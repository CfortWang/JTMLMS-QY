<template>
    <div class="ibps-attachment-selector">
        <template v-if="uploadable">
            <!--ibps 附件上传方式-->
            <template v-if="uploadType==='attachment'">
                <ul
                    :class="{disabled:disabled}"
                    class="selector-list"
                    @click="handleUpload"
                >
                    <label>
                        <div class="plus">+</div>
                        <div class="selector-empty">{{ placeholder }}</div>
                    </label>
                </ul>
            </template>
            <!--直接弹出选择文件框-->
            <template v-else>
                <el-upload
                    ref="upload"
                    :file-list="fileList"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :before-upload="beforeUpload"
                    :http-request="httpRequest"
                    :multiple="multiple"
                    :accept="accept"
                    :show-file-list="false"
                    action="https://www.bpmhome.cn/post"
                    name="file"
                    drag
                    class="ibps-default-upload"
                >
                    <ul
                        :class="{disabled:disabled}"
                        class="selector-list"
                    >
                        <label>
                            <div class="plus">+</div>
                            <div class="selector-empty">{{ placeholder }}</div>
                        </label>
                    </ul>
                </el-upload>

                <!--重选附件-->
                <el-upload
                    ref="defaultReselectUpload"
                    style="display:none;"
                    action="https://www.bpmhome.cn/post"
                    :on-success="handleReselectSuccess"
                    :before-upload="beforeUpload"
                    :http-request="httpRequest"
                    :file-list="fileList"
                    :multiple="false"
                    :accept="accept"
                    name="file"
                    drag
                />
            </template>
        </template>

        <ul
            v-if="$utils.isNotEmpty(items)"
            :class="['el-upload-list', 'el-upload-list--' + listType, { 'is-disabled': !editable }]"
        >
            <vue-draggable
                v-model="sortList"
                v-bind="draggableOptions"
                class="list-group"
                @start="isDragging = true"
                @end="()=>{isDragging= false}"
                @update="updateSort"
            >
                <li
                    v-for="(file,index) in items"
                    :key="index"
                    :class="['el-upload-list__item', focusing ? 'focusing' : '']"
                    tabindex="0"
                    @focus="focusing = true"
                    @blur="focusing = false"
                    @click.stop="focusing = false"
                >
                    <span :file="file">
                        <a
                            class="el-upload-list__item-name"
                            :style="{ marginRight:toolsWidth }"
                            :title="file"
                            @click.stop="handlePreview(index)"
                        >
                            <i class="el-icon-document" />{{ file | ellipsis }}
                        </a>
                        <label class="tools">
                            <template v-if="operationStatus!='none' && editable">
                                <el-tooltip effect="dark" content="编辑" placement="bottom-start">
                                    <el-link type="primary" :underline="false" icon="el-icon-edit" @click.stop="handleEdit(index)">&nbsp;</el-link>
                                </el-tooltip>
                            </template>
                            <el-divider direction="vertical" />
                            <template v-if="editable">
                                <!--默认附件上传 -->
                                <!-- <el-tooltip effect="dark" content="拖拽排序" placement="bottom-start">
                                    <el-link type="info" :underline="false" icon="ibps-icon-arrows" class="draggable">&nbsp;</el-link>
                                </el-tooltip>
                                <el-divider direction="vertical" /> -->
                                <el-tooltip effect="dark" content="重新选择" placement="bottom-start">
                                    <el-link type="primary" :underline="false" icon="ibps-icon-undo" @click.stop="handleReselect(index)">&nbsp;</el-link>
                                </el-tooltip>
                                <el-divider direction="vertical" />
                                <el-tooltip effect="dark" content="删除" placement="bottom-start">
                                    <el-link type="danger" :underline="false" icon="ibps-icon-delete" @click.stop="handleRemove(index)">&nbsp;</el-link>
                                </el-tooltip>
                                <el-divider v-if="download" direction="vertical" />
                            </template>
                            <template v-if="download">
                                <el-tooltip effect="dark" content="下载" placement="bottom-start">
                                    <el-link type="primary" :underline="false" icon="ibps-icon-download" @click.stop="handleDownload(index)">&nbsp;</el-link>
                                </el-tooltip>
                            </template>
                        </label>
                    </span>
                </li>
            </vue-draggable>
        </ul>
    </div>
</template>
<script>

import { fileTypes, allFileTypes, accept as acceptTypes } from '@/business/platform/file/constants/fileTypes'
import { uploadTemplateFile } from '@/api/platform/file/onlyoffice'
import VueDraggable from 'vuedraggable'

export default {
    name: 'ibps-attachment-selector',
    components: { VueDraggable },
    filters: {
        ellipsis (val) {
            if (!val) return ''
            if (val.length > 60) {
                return val.slice(0, 60) + '...'
            }
            return val
        }
    },
    props: {
        items: {
            type: Array
        },
        operationStatus: String, // 编辑
        value: {
            type: [Array, Object]
        },
        mediaType: String,
        media: String,
        placeholder: {
            type: String,
            default: '请选择'
        },
        multiple: { // 是否多选
            type: Boolean,
            default: false
        },
        limit: { // 最大允许上传个数
            type: Number
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        download: {
            type: Boolean,
            default: false
        },
        preview: {
            type: Boolean,
            default: true
        },
        uploadType: { // 上传方式 （ default:直接打开上传，attachment：ibps上传附件打开上传 ）
            type: String,
            default: 'attachment'
        },
        accept: String, // 允许上传类型
        fileSize: Number, // 尺寸
        fileExt: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            fileList: [],
            fileTypes: fileTypes,
            allFileTypes: allFileTypes,
            acceptTypes: acceptTypes,
            defaultSelectIndex: 0,
            listType: 'text',
            focusing: false,
            defaultDisabled: true,
            sortList: [],
            isDragging: false,
            draggableOptions: {
                handle: '.draggable',
                ghostClass: 'sortable-ghost',
                distance: 1,
                disabled: false,
                animation: 200,
                axis: 'y'
            }
        }
    },
    computed: {
        // 是否允许上传
        uploadable () {
            if (this.readonly) return false
            if (!this.multiple && this.items.length >= 1) return false
            if (this.multiple && (this.limit && this.items.length >= this.limit)) return false
            return true
        },
        editable () {
            return !(this.readonly || this.disabled)
        },
        toolsWidth () {
            const length = this.editable ? 3 : 1
            return (30 * length) + 'px'
        }
    },
    methods: {
        init () {
            this.fileList = []
        },
        handleUpload () {
            if (!this.editable) return
            this.$emit('action-event', 'select')
        },
        // 在线编辑报表
        handleEdit (index) {
            this.$emit('action-event', 'edit', index, this.value[index] || this.value, this.operationStatus)
        },
        handleReselect (index) {
            if (!this.editable) return
            if (this.uploadType === 'attachment') {
                this.$emit('action-event', 'reselect', index)
            } else {
                this.$refs.defaultReselectUpload.$refs['upload-inner'].handleClick()
                this.defaultSelectIndex = index
            }
        },
        handleRemove (index) {
            if (!this.editable) return
            this.$emit('action-event', 'remove', index)
        },
        handleDownload (index) {
            this.$emit('action-event', 'download', index)
        },
        handlePreview (index) {
            this.$emit('action-event', 'preview', index)
        },
        // 默认上传模块
        httpRequest (options) {
            return uploadTemplateFile(options.file, {})
        },
        handleSuccess (response, file, fileList) {
            this.fileList = fileList
            this.emitCallback(fileList, file)
        },
        emitCallback (list, file) {
            let data = this.multiple ? [] : {}
            if (this.multiple) {
                data = this.getFileDataList(list)
            } else {
                data = file.response.data
            }
            this.$emit('action-event', 'confirm', data)
        },
        getFileDataList (fileList) {
            if (this.$utils.isEmpty(fileList)) {
                return []
            }
            return fileList.map((file) => {
                return file.response.data
            })
        },
        handleError () {
            // TODO:
        },
        beforeUpload (file) {
            if (this.limit && this.limit === 0) {
                this.$message({
                    message: '上传文件个数不能为0，请重新设置',
                    type: 'warning'
                })
                return false
            }
            if (this.fileSize && file.size > this.fileSize) {
                this.$message.closeAll()
                this.$message({
                    message: `上传文件的尺寸大于${this.$utils.formatSize(this.fileSize, 2, ['B', 'K', 'M', 'G', 'TB'])}`,
                    type: 'warning'
                })
                return false
            }
            if (this.accept && !this.fileExtType(file)) {
                this.$message.closeAll()
                this.$message({
                    message: '不允许的文件类型',
                    type: 'warning'
                })
                return false
            }
        },
        /**
         * 文件类型的检测
         */
        /**
         * 文件类型的检测
         */
        fileExtType (file) {
            const { accept, acceptTypes, fileTypes } = this
            const fileExtension = this.getFileExtension(file.name)

            if (!fileExtension) {
                return false
            }

            if (this.accept === '*') {
                // 不限制
                return true
            }

            const type = Object.keys(acceptTypes).find(key => acceptTypes[key] === accept) || ''
            if (type) {
                // 扩展名转换小写判断
                const targetFileTypes = fileTypes[type].map(ext => ext.toLowerCase())
                return targetFileTypes.includes(fileExtension.toLowerCase())
            }

            const targetFileTypes = this.accept.split(',').map(ext => ext.trim().toLowerCase().replace('.', ''))
            return targetFileTypes.includes(fileExtension.toLowerCase())
        },
        /**
         * 获取文件后缀
         * @param {string} fileName - 文件名
         * @returns {string|null} - 文件后缀（不带点），如果没有后缀则返回 null
         */
        getFileExtension (fileName) {
            if (!fileName || typeof fileName !== 'string') {
                return null
            }

            if (fileName.startsWith('.')) {
                return null
            }

            // 获取最后一个点之后的部分
            const lastDotIndex = fileName.lastIndexOf('.')
            if (lastDotIndex === -1) {
                return null // 没有后缀
            }

            return fileName.slice(lastDotIndex + 1).toLowerCase()
        },
        handleReselectSuccess (response, file, fileList) {
            this.fileList = fileList
            const targetFile = file.response.data
            var data = this.value
            if (this.multiple) {
                data.splice(this.defaultSelectIndex, 1, targetFile)
            } else {
                data = targetFile
            }
            this.$emit('action-event', 'confirm', data)
        },
        updateSort ({ to, from, item, clone, oldIndex, newlndex }) {
            // console.log(to, from, item, clone, oldIndex, newlndex)
            // console.log(this.value)
            // console.log(this.sortList)
        }
    }
}
</script>
