<template>
    <div :style="{height: height}" class="ibps-uplpad">
        <div class="header">
            <div class="btns">
                <el-upload
                    :file-list="fileList"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :before-upload="beforeUpload"
                    :http-request="httpRequest"
                    :multiple="multiple"
                    :accept="accept"
                    :show-file-list="false"
                    action="https://www.bpmhome.cn/post"
                    list-type="picture"
                    name="file"
                >
                    <el-button
                        slot="trigger"
                        icon="el-icon-upload"
                        type="primary"
                        size="mini"
                    >选择要上传的文件</el-button>
                    <el-button
                        type="danger"
                        icon="ibps-icon-remove"
                        class="ibps-ml-5"
                        size="mini"
                        @click="clearFiles"
                    >清空文件</el-button>
                </el-upload>
            </div>
        </div>
        <div class="uploader">
            <el-upload
                ref="upload"
                :file-list="fileList"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="beforeUpload"
                :http-request="httpRequest"
                :multiple="multiple"
                :accept="accept"
                action="https://www.bpmhome.cn/post"
                name="file"
                drag
                list-type="picture-card"
            >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

            <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img :src="dialogImageUrl" width="100%" alt="">
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { uploadFile, remove, deleteFile } from '@/api/platform/file/attachment'
import { uploadTemplateFile } from '@/api/platform/file/onlyoffice'
import { fileTypes, allFileTypes, accept as acceptTypes } from '@/business/platform/file/constants/fileTypes'
import { compress } from '../utils/compress.js'

export default {
    props: {
        height: String,
        init: Boolean,
        limit: Number, // 个数
        multiple: Boolean,
        fileSize: Number, // 尺寸
        accept: String, // 类型
        // 上传类型：normal:普通上传，onlyoffice:onlyoffice文件上传
        uploadMethod: {
            type: String,
            default: 'normal'
        },
        // 图片压缩配置
        compressOption: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            uploadData: {}, // 可以添加分类、文件等信息
            fileList: [],
            dialogVisible: false,
            targetExt: false,
            dialogImageUrl: '',
            fileTypes: fileTypes,
            allFileTypes: allFileTypes,
            acceptTypes: acceptTypes
        }
    },
    watch: {
        init: {
            handler () {
                if (this.init) {
                    this.fileList = []
                }
            },
            immediate: true
        }
    },
    methods: {
        /**
         * 文件上传
         */
        httpRequest (options) {
            const uploadMap = {
                normal: uploadFile,
                onlyoffice: uploadTemplateFile
            }

            const { isCompress, maxWidth, maxFileSize, quality } = this.compressOption || {}
            if (isCompress !== 'N' && options.file.type.startsWith('image/')) {
                return compress(options.file, maxWidth, maxFileSize, quality).then((file) => {
                    return uploadFile(file, {})
                })
            }
            return uploadMap[this.uploadMethod || 'normal'](options.file, {})
        },
        // 做文件校验
        beforeUpload (file) {
            if (this.$utils.isNotEmpty(this.limit) && this.limit === 0) {
                this.$message({
                    message: '上传文件个数不能为0，请重新设置',
                    type: 'warning'
                })
                return false
            }
            if (this.$utils.isNotEmpty(this.fileSize) && file.size > this.fileSize) {
                this.$message.closeAll()
                this.$message({
                    message: '上传文件的大小大于' + this.$utils.formatSize(this.fileSize),
                    type: 'warning'
                })
                return false
            }
            // if (this.$utils.isNotEmpty(this.accept) && this.handleAccpt(file) || this.fileExtType(file)) {
            if (this.$utils.isNotEmpty(this.accept) && this.accept && !this.fileExtType(file)) {
                this.$message.closeAll()
                this.$message({
                    message: '不允许的文件类型',
                    type: 'warning'
                })
                return false
            }
            // console.log(this.fileList, 'beforeUpload')
            if (!this.multiple && this.$utils.isNotEmpty(this.fileList)) {
                this.$message.closeAll()
                this.$message({
                    message: '附件上传设置为单选，文件上传只能为1个',
                    type: 'warning'
                })
                return false
            }
        },
        /**
         * 文件类型的检测
         */
        fileExtType (file) {
            const accept = this.accept
            const acceptTypes = this.acceptTypes
            const fileTypes = this.fileTypes
            const arr = file.name.split('.')
            const result = arr[arr.length - 1]
            let type = ''
            this.targetExt = false
            for (const i in acceptTypes) {
                if (acceptTypes[i] === accept) {
                    type = i
                }
            }
            if (type !== '' && this.accept !== '*') {
                // 现存的附件类型
                const targetFileTypes = fileTypes[type]
                this.targetExt = targetFileTypes.includes(result)
            } else {
                if (this.accept === '*') {
                    // 不限制
                    this.targetExt = true
                } else {
                    // 自定义
                    const targetFileTypes = this.accept.split(',')
                    this.targetExt = targetFileTypes.includes('.' + result)
                }
            }
            return this.targetExt
        },
        /**
         * 文件类型的限制
         */
        // handleAccpt (file) {
        //     const rExt = /\.\w+$/
        //     let accept = ''
        //     const arr = []
        //     const extensions = this.accept.split(',')
        //     const acceptTypes = this.acceptTypes
        //     const acceptArr = []
        //     for (var i in acceptTypes) {
        //         acceptArr.push(acceptTypes[i])
        //     }
        //     const inAcceptTypes = acceptArr.includes(this.accept)

        //     for (let i = 0, len = extensions.length; i < len; i++) {
        //         const item = extensions[i]
        //         if (item) {
        //             if (item.indexOf('/')) {
        //                 const v = item.split('/')
        //                 let k = item
        //                 if (v.length > 0) {
        //                     k = v[v.length - 1]
        //                 }
        //                 arr.push(k)
        //             } else {
        //                 arr.push(item)
        //             }
        //         }
        //     }
        //     if (arr.length) {
        //         accept = '\\.' + arr.join(',').replace(/,/g, '$|\\.').replace(/\*/g, '.*') + '$'
        //     }
        //     accept = new RegExp(accept, 'i')
        //     // 如果名字中有后缀，才做后缀白名单处理。
        //     return !file || !file.size || this.accept && rExt.exec(file.name) && !accept.test(file.name) && inAcceptTypes
        // },
        handleSuccess (response, file, fileList) {
            let ext = this.getExtName(file.name)
            let url = ''
            if (this.$utils.isEmpty(ext)) {
                ext = 'file'
            }
            if (['jpg', 'jpeg', 'bmp', 'png'].includes(ext)) {
                url = file.url
            } else {
                url = `${this.$baseUrl}images/file/${ext}.png`
            }
            file.url = url
            this.fileList = fileList
            this.emitCallback(fileList)
        },
        // 获取扩展名
        getExtName (name) {
            return name ? name.substring(name.lastIndexOf('.') + 1, name.length) : ''
        },
        handleError (err, file, fileList) {
            this.fileList = fileList
            if (!(err instanceof Error)) {
                const data = this.$utils.parseJSON(err.message)
                this.$message.closeAll()
                this.$message({
                    message: this.$utils.isNotEmpty(data.message) ? data.message : data.cause,
                    type: 'error'
                })
            }
        },
        handleRemove (file, fileList) {
            this.fileList = fileList
            if (file && file.response) {
                this.handleRemoteRemove(file.response.data.id, () => {
                    this.emitCallback(fileList)
                })
            }
        },
        emitCallback (fileList) {
            this.$emit('callback', this.convertFileDataList(fileList, this.multiple))
        },
        convertFileDataList (fileList, multiple) {
            if (this.$utils.isEmpty(fileList)) {
                return multiple ? [] : {}
            }
            const rtn = []
            fileList.forEach((file) => {
                if (this.$utils.isNotEmpty(file.response)) {
                    rtn.push(file.response.data)
                }
            })
            return multiple ? rtn : rtn[rtn.length - 1]
        },
        /**
         * 清空
         */
        clearFiles () {
            const ids = this.$refs.upload.uploadFiles.map((file) => {
                // console.log(file.response.data.id)
                return file.response.data.id
            }).join(',')

            if (this.$utils.isEmpty(ids)) {
                this.$message.warning('请先上传文件！')
                return
            }
            this.handleRemoteRemove(ids, () => {
                this.$refs.upload.clearFiles()
                this.$emit('callback', this.multiple ? [] : {})
            })
        },
        handleRemoteRemove (ids, callback) {
            // 删除附件文件
            deleteFile({ attachmentIds: ids }).then(() => {
                const _this = this
                // this.fileList = []
                callback(_this)
            }).catch(() => {})
        },
        handlePreview (file) {
            this.dialogVisible = true
            //  this.dialogImageUrl = file.url
        }
    }
}
</script>
<style lang="scss">
    .ibps-uplpad {
        overflow-y: auto;
        padding: 5px;
        .header {
            height: 45px;
            border-bottom: 1px solid #dadada;
            margin: 0;
            padding: 0;
            line-height: 45px;
            vertical-align: middle;
            position: relative;
        }
        .btns {
            position: absolute;
            top: 7px;
            right: 0;
            line-height: 30px;
        }
        .uploader {
            list-style: none;
            margin: 0;
            padding-top: 5px;
        }
        .el-upload--picture-card {
            border: 0;
        }
        .el-upload-dragger {
            width: 148px;
            height: 148px;
        }
        .el-upload-list--picture-card .el-upload-list__item-name {
            display: block;
            position: absolute;
            top: 0px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            margin: 0;
            width: 100%;
        }
    }
</style>
