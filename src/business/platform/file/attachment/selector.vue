<template>
    <div>
        <ibps-file-attachment-selector
            ref="attachmentSelector"
            :items="items"
            :value="selectorValue"
            :media-type="mediaType"
            :media="media"
            :placeholder="placeholder"
            :multiple="multiple"
            :limit="limit"
            :disabled="disabled"
            :readonly="readonly"
            :download="download"
            :operation_status="operation_status"
            :preview="preview"
            :upload-type="uploadType"
            :file-size="fileSize"
            :accept="acceptType"
            :file-ext="fileExt"
            @action-event="handleActionEvent"
        />
        <!-- 选择器 -->
        <ibps-uploader-selector-dialog
            :visible="selectorVisible"
            :value="selectorValue"
            :multiple="selectorMultiple"
            :file-size="fileSize"
            :accept="acceptType"
            :file-ext="fileExt"
            :limit="limit"
            @close="visible => selectorVisible = visible"
            @action-event="handleSelectorActionEvent"
        />
        <div v-if="filePreviewVisible">
            <file-preview
                :file="attachment"
                :visible="filePreviewVisible"
                :option-file="optionFileView"
                @close="visible => filePreviewVisible = visible"
            />
        </div>

        <div v-if="showFile" class="divShow">
            <fView :option-file="optionFile" @updateFile="updateFile" />
        </div>
    </div>
</template>
<script>
import { get, transfer, uploadFile } from '@/api/platform/file/attachment'
import { downloadFile } from '@/business/platform/file/utils'
import { remoteRequest, remoteTransRequest } from '@/utils/remote'
import IbpsFileAttachmentSelector from './index'
import IbpsUploaderSelectorDialog from '@/business/platform/file/uploader'
import FilePreview from '@/business/platform/file/file-preview'
import { supportFileTypes } from '@/components/ibps-file-viewer/constants'
import { TRANSFER_DATA } from '@/constant'
import fView from './editFile/fView.vue'
import { SYSTEM_URL, BASE_API } from '@/api/baseUrl'

export default {
    components: {
        IbpsFileAttachmentSelector,
        IbpsUploaderSelectorDialog,
        FilePreview,
        fView
    },
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    props: {
        value: {
            type: [String, Number, Array, Object]
        },
        mediaType: String,
        media: String,
        store: {
            // 存储类型，json: json字符串，id: 只存储id，array: 存储数组数据，arrayId: 字符串类型。
            type: String,
            default: 'id',
            validator: function (value) {
                return (['json', 'id', 'array', 'arrayId', 'bind'].indexOf(value) !== -1)
            }
        },
        storeSeparator: {
            // 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
            type: String,
            default: ','
        },
        placeholder: {
            // 输入框占位文本
            type: String,
            default: '请选择附件'
        },
        multiple: {
            // 是否多选
            type: Boolean,
            default: false
        },
        limit: {
            // 最大允许上传个数
            type: Number
        },
        // 类型,
        accept: String,
        fileExt: {
            type: Array,
            default: () => []
        },
        disabled: {
            // 禁用
            type: Boolean,
            default: false
        },
        readonly: {
            // 只读
            type: Boolean,
            default: false
        },
        operation_status: {
            // 编辑
            type: String,
            default: 'none'
        },
        download: {
            // 允许下载
            type: Boolean,
            default: true
        },
        preview: {
            // 允许预览
            type: Boolean,
            default: true
        },
        fileSize: {
            // 上传尺寸
            type: Number
        },
        labelKey: {
            type: String,
            default: 'fileName'
        },
        valueKey: {
            type: String,
            default: 'id'
        },
        uploadType: {
            // 上传方式 （ default:直接打开上传，attachment：ibps上传附件打开上传 ）
            type: String,
            default: 'attachment'
        },
        showExtName: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            selectorVisible: false,
            selectorValue: this.multiple ? [] : {},
            reselect: false, // 重新选择
            selectorMultiple: this.multiple,
            index: -1,
            cacheData: {},
            attachment: {},
            filePreviewVisible: false,
            acceptType: '',
            showFile: false,
            file: '',
            optionFile: {},
            optionFileView: {}
        }
    },
    computed: {
        items () {
            if (this.$utils.isEmpty(this.selectorValue)) return []
            if (this.multiple) {
                return this.selectorValue.map(data => {
                    return data[this.labelKey] + this.getExtName(data)
                })
            } else {
                return [this.selectorValue[this.labelKey] + this.getExtName(this.selectorValue)]
            }
        },
        uploadStyle () {
            const { width, height } = this
            return {
                width: `${width}px`,
                height: `${height}px`,
                lineHeight: `${height}px`,
                display: 'inline'
            }
        }
    },
    watch: {
        value (val) {
            if (this.$utils.isEmpty(this.value)) {
                this.selectorValue = []
            } else if (val) {
                this.initData()
            }
        },
        mediaType: {
            handler: function (val, oldVal) {
                if (val === 'custom') {
                    var arr = this.media.split(',')
                    const accept = '.' + arr.join(',').replace(/,/g, ',.')
                    this.acceptType = accept
                } else {
                    this.acceptType = this.accept
                }
            },
            immediate: true
        }
    },
    mounted () {
        this.initData()
    },
    methods: {
        // 替换对应的文件 id  this.optionFile.data.index  为点击编辑时记录的下表号
        updateFile (data) {
            if (this.multiple) {
                this.selectorValue[this.optionFile.data.index].id = data
            } else {
                this.selectorValue.id = data
            }
            this.handleInput()
        },
        /**
             * 初始化数据
             */
        initData () {
            const data = this.getArrayValue(this.value)
            this.selectorValue = this.multiple ? [] : {}
            if (this.$utils.isEmpty(data)) {
                return
            }
            data.forEach(v => {
                if (this.cacheData[v]) {
                    this.setSelectorValue(v)
                } else {
                    this.getDataInfo(v)
                }
            })
        },
        setCacheData () {
            if (this.$utils.isEmpty(this.selectorValue)) return
            const data = this.multiple ? this.selectorValue : [this.selectorValue]
            data.forEach(v => {
                this.cacheData[v[this.valueKey]] = v
            })
        },
        setSelectorValue (v) {
            if (this.multiple) {
                this.selectorValue.push(this.cacheData[v])
                const data = this.getArrayValue(this.value)
                if (this.selectorValue.length === data.length) {
                    const dataHadSort = []
                    data.forEach(el => {
                        const fidData = this.selectorValue.find(fi => fi.id == el)
                        if (fidData) {
                            dataHadSort.push(fidData)
                        }
                    })
                    this.selectorValue = dataHadSort
                }
            } else {
                this.selectorValue = JSON.parse(JSON.stringify(this.cacheData[v]))
            }
        },
        /**
             * 获得数组数据
             */
        getArrayValue (value, bindId) {
            if (this.$utils.isEmpty(value)) {
                return []
            }
            if (this.store === 'json') {
                // json
                return this.parseJsonData(value)
            } else if (this.store === 'id') {
                // id
                // 可能是json数据[之前存储的josn格式]
                if (this.$utils.isJSON(value)) {
                    return this.parseJsonData(value)
                } else {
                    return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
                }
            } else if (this.store === 'bind') {
                // 绑定id
                if (this.$utils.isEmpty(bindId)) {
                    return []
                }
                return bindId.split(this.storeSeparator)
            } else {
                // array
                return value.map(d => {
                    return d[this.valueKey]
                })
            }
        },
        parseJsonData (value) {
            try {
                const data = this.$utils.parseData(value)
                const result = []
                if (Array.isArray(data)) {
                    data.forEach(d => {
                        const node = d[this.valueKey]
                        if (node) result.push(node)
                    })
                } else {
                    if (this.$utils.isPlainObject(data)) {
                        result.push(data[this.valueKey])
                    } else {
                        const realData = this.$utils.isString(value) ? value.split(this.storeSeparator) : []
                        realData.forEach(v => { result.push(v) })
                    }
                }
                return result
            } catch (error) {
                console.warn(error)
                return []
            }
        },
        getStoreValue (value) {
            const res = []
            if (this.store === 'json') {
                // json
                if (this.$utils.isEmpty(value)) {
                    return ''
                }
                if (this.multiple) {
                    value.forEach(v => {
                        const o = {}
                        o[this.valueKey] = v[this.valueKey]
                        o[this.labelKey] = v[this.labelKey]
                        res.push(o)
                    })
                    return JSON.stringify(res)
                } else {
                    const o = {}
                    o[this.valueKey] = value[this.valueKey]
                    o[this.labelKey] = value[this.labelKey]
                    return JSON.stringify(o)
                }
            } else if (this.store === 'id') {
                if (this.$utils.isEmpty(value)) {
                    return ''
                }
                if (this.multiple) {
                    value.forEach(v => {
                        res.push(v[this.valueKey])
                    })
                } else {
                    res.push(value[this.valueKey])
                }
                return res.join(this.storeSeparator)
            } else if (this.store === 'bind') {
                // 绑定id
                const res = []
                const bindIdValue = []
                value.forEach(v => {
                    bindIdValue.push(v[this.valueKey])
                    res.push(v[this.labelKey])
                })
                this.bindIdValue = bindIdValue.join(this.storeSeparator)

                return res.join(this.storeSeparator)
            } else {
                // 数组 array
                return value || []
            }
        },
        /**
             * 通过ID获取数据
             */
        getDataInfo (id) {
            if (TRANSFER_DATA === 'transfer') {
                this.getTransferData(id)
            } else {
                this.getRemoteData(id)
            }
        },
        getTransferData (id) {
            remoteTransRequest('attachment', id).then(idset => {
                const ids = Array.from(idset)
                remoteRequest('attachmentIds', ids, () => {
                    return this.getRemoteTransFunc(ids)
                }).then(response => {
                    const responseData = response.data
                    const data = responseData[id]
                    this.setRemoteData(data)
                }).catch(() => {})
            })
        },
        getRemoteTransFunc (ids) {
            return new Promise((resolve, reject) => {
                transfer({ ids: ids }).then(response => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        getRemoteData (id) {
            remoteRequest('attachment' + this.valueKey, id, () => {
                return this.getRemoteByIdFunc(id)
            }).then(response => {
                const data = response.data
                this.setRemoteData(data)
            }).catch(() => {})
        },
        getRemoteByIdFunc (id) {
            return new Promise((resolve, reject) => {
                get({ attachmentId: id }).then(response => {
                    resolve(response)
                }).catch(() => {})
            })
        },
        setRemoteData (data) {
            if (this.$utils.isNotEmpty(data)) {
                this.cacheData[data[this.valueKey]] = data
                this.setSelectorValue(data[this.valueKey])
            }
        },
        getExtName (data) {
            if (!data) {
                return ''
            }
            if (this.showExtName && data['ext']) {
                return '.' + data['ext']
            }
            return ''
        },
        // 事件处理
        handleActionEvent (action, index, data, type) {
            this.index = index
            switch (action) {
                case 'select': // 选择
                    this.selectorVisible = true
                    this.selectorMultiple = this.multiple
                    this.reselect = false
                    this.showFile = false
                    break
                case 'reselect': // 重新选择
                    this.selectorVisible = true
                    this.selectorMultiple = false
                    this.reselect = true
                    this.showFile = false
                    break
                case 'remove': // 删除
                    this.handleRemove(index)
                    this.$refs['attachmentSelector'].init()
                    break
                case 'download': // 下载
                    this.handleDownload(index)
                    break
                case 'preview': // 预览
                    this.handlePreview(index)
                    break
                case 'confirm': // 默认上传选择文件
                    this.handleSelectorActionEvent(action, index)
                    break
                case 'edit': // 编辑
                    this.handleEdit(index, data, type)
                    break
            }
        },
        // 处理编辑文件
        handleEdit (index, data, type) {
            // 1、获取文件数据 及下载流接口
            this.optionFile.url = BASE_API() + SYSTEM_URL() + '/file/download?attachmentId=' + data.id
            this.optionFile.editUrl = BASE_API() + SYSTEM_URL() + '/file/editCallback?fileName=' + data.fileName + '&fileType=' + data.ext + '&type=' + type + '&id=' + data.id
            this.optionFile.title = data.fileName // 文件名称
            this.optionFile.fileType = data.ext // 类型
            this.optionFile.data = data // 记录编制的位置，需要替换。
            this.optionFile.data.index = index
            // 2、显示编辑位置，提交后进行保存
            if (this.showFile) {
                // 重复打开，进行刷新子组件
                this.showFile = false
            } else {
                this.showFile = true
                // this.timer = setInterval((num)=>{
                //     this. test = true
                // },10000)
            }
        },
        /**
             * 处理删除
             */
        handleRemove (index) {
            if (this.multiple) {
                this.selectorValue.splice(index, 1)
            } else {
                this.selectorValue = {} // 当前为清空
            }
            this.handleInput()
        },
        /**
             * 处理下载
             */
        handleDownload (index) {
            downloadFile(this.multiple ? this.selectorValue[index] : this.selectorValue)
        },
        /**
             * 处理预览
             */
        handlePreview (index) {
            this.attachment = this.multiple ? this.selectorValue[index] : this.selectorValue
            if (supportFileTypes.includes(this.attachment.ext)) {
                this.getPreview(index)
            } else {
                this.$message.closeAll()
                this.$message.warning('暂不支持该文件类型预览')
            }
        },
        /**
             * 处理预览
             */
        getPreview (index) {
            // 1、获取文件数据 及下载流接口
            // 下载地址
            this.optionFileView.url = BASE_API() + SYSTEM_URL() + '/file/download?attachmentId=' + this.attachment.id
            // 回调接口url
            this.optionFileView.editUrl = BASE_API() + SYSTEM_URL() + '/file/editCallback?fileName=' + this.attachment.fileName + '&fileType=' + this.attachment.ext
            this.optionFileView.title = this.attachment.fileName // 文件名称
            this.optionFileView.fileType = this.attachment.ext // 类型
            this.optionFileView.data = this.attachment // 记录编制的位置，需要替换。
            this.optionFileView.data.index = index
            this.filePreviewVisible = true
        },
        /**
             *  确定
             */
        handleSelectorActionEvent (buttonKey, data) {
            if (this.uploadType === 'default' && this.$utils.isNotEmpty(this.limit) && this.multiple && this.limit < data.length) {
                this.$message({
                    type: 'warning'
                })
                this.$refs['attachmentSelector'].init()
                return
            }
            switch (buttonKey) {
                case 'confirm': // 确定
                    this.selectorVisible = false
                    if (this.reselect) {
                        if (this.multiple) {
                            this.selectorValue.splice(this.index, 1, data)
                        } else {
                            this.selectorValue = data
                        }
                    } else {
                        this.selectorValue = data
                    }
                    this.setCacheData()
                    this.handleInput()
                    break
            }
        },
        handleInput () {
            this.$emit('input', this.getStoreValue(this.selectorValue))
            // 提供一个返回实体，提供调用
            this.$emit('callback', this.selectorValue)
        },
        /**
             * 文件上传
             */
        httpRequest (options) {
            return uploadFile(options.file, {})
        },
        handleDelete (file, selectorValue) {
            this.selectorValue = selectorValue
        },
        handleSuccess (response, file, selectorValue) {
            this.selectorValue = selectorValue.map(item => {
                item.isActive = false
                return item
            })
        },
        handleChange (file, selectorValue) {
            this.selectorValue = selectorValue
        },
        // 图片上传数量限制
        handlePicAmount (files, selectorValue) {
            if (this.multiple && this.limit) {
                this.$message.closeAll()
                this.$message({
                    message: `图片上传上限${this.limit}张`,
                    type: 'warning'
                })
            }
        },
        // 格式、大小限制
        beforeUpload (file) {
            const isType = this.accept ? file.type.includes(this.accept) : true
            if (!isType) {
                this.$message.closeAll()
                this.$message.error(`上传图片的格式为${this.accept}`)
            }
            const isLimitSize = this.size ? (file.size / 1024 / 1024 < this.size) : true
            if (!isLimitSize) {
                this.$message.closeAll()
                this.$message.error(`上传图片的大小不能超过 ${this.size}M!`)
            }
            return isLimitSize && isType
        }
    }
}
</script>
<style scoped>
    .divShow {
        width: 100%;
        height: calc(100vh);
    }
</style>
