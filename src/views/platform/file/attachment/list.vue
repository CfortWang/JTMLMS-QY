<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        />
        <ibps-uploader
            :visible="dialogFormVisible"
            :multiple="true"
            margin-top="7vh"
            accept="*"
            class="attachment-uploader-dialog"
            @action-event="uploaderAction"
            @close="visible => dialogFormVisible = visible"
        />
        <modify-name
            :id="editId"
            :file="file"
            :visible="modifyNameVisible"
            @callback="search"
            @close="visible => modifyNameVisible = visible"
        />
        <detail
            :id="editId"
            :visible="detailVisible"
            :data="detailData"
            @callback="search"
            @close="visible => detailVisible = visible"
        />
        <div v-if="filePreviewVisible">
            <file-preview
                :file="file"
                :visible="filePreviewVisible"
                @close="visible => filePreviewVisible = visible"
            />
        </div>
        <div v-if="filePreviewVisible2">
            <file-preview
                :option-file="file"
                :visible="filePreviewVisible2"
                @close="visible => filePreviewVisible2 = visible"
            />
        </div>
    </div>
</template>

<script>
import { queryPageList, deleteFile } from '@/api/platform/file/attachment'
import { downloadFile, downloadFileByZip } from '@/business/platform/file/utils'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsUploader from '@/business/platform/file/uploader'
import FilePreview from '@/business/platform/file/file-preview'
import { fileTypes } from '@/business/platform/file/constants/fileTypes'
import Detail from './detail'
import ModifyName from './modify-name'
import { SYSTEM_URL, BASE_API } from '@/api/baseUrl'

export default {
    components: {
        IbpsUploader,
        FilePreview,
        Detail,
        ModifyName
    },
    mixins: [FixHeight],
    data () {
        const extType = [
            'txt',
            'pdf',
            'doc',
            'docx',
            'xls',
            'xlsx',
            'ppt',
            'pptx',
            'wps',
            'jpg',
            'jpeg',
            'png',
            'gif',
            'mp3',
            'mp4'
        ]
        return {
            dialogFormVisible: false, // 弹窗
            modifyNameVisible: false,
            detailVisible: false,
            filePreviewVisible: false,
            filePreviewVisible2: false,
            editId: '', // 编辑dialog需要使用
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            detailData: '',
            file: {
                fileName: '',
                url: '',
                editUrl: '',
                title: '',
                fileType: ''
            },
            loading: true,
            height: document.clientHeight,

            listData: [],
            pagination: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'upLoad',
                        label: '上传',
                        icon: 'ibps-icon-upload'
                    },
                    {
                        key: 'downloadZip',
                        label: '批量下载',
                        icon: 'ibps-icon-download'
                    },
                    {
                        key: 'remove'
                    }
                ],
                searchForm: {
                    forms: [
                        { prop: 'Q^file_name_^SL', label: '文件名' },
                        { prop: 'Q^creator_name_^SL', label: '上传者' },
                        { prop: 'Q^ext_^SL', label: '扩展名' },
                        {
                            prop: [
                                'Q^create_time_^DL',
                                'Q^create_time_^DG'
                            ],
                            label: '创建时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'fileName', label: '文件名' },
                    {
                        prop: 'createTime',
                        label: '创建时间',
                        dateFormat: 'yyyy-MM-dd HH:mm:ss'
                    },
                    { prop: 'ext', label: '扩展名' },
                    {
                        prop: 'totalBytes',
                        label: '总字节数',
                        filter: 'numberFormatter'
                    },
                    { prop: 'creatorName', label: '上传者' }
                ],
                rowHandle: {
                    actions: [
                        {
                            key: 'preview',
                            label: '预览',
                            icon: 'ibps-icon-eye',
                            hidden: (row, index) => {
                                if (extType.includes(row.ext)) return false
                                return true
                            }
                        },
                        {
                            key: 'modifyName',
                            label: '修改文件名',
                            icon: 'ibps-icon-eraser'
                        },
                        {
                            key: 'detail',
                            icon: 'ibps-icon-detail'
                        },
                        {
                            key: 'download',
                            label: '下载',
                            icon: 'ibps-icon-download'
                        },
                        {
                            key: 'remove'
                        }
                    ]
                }
            }
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData () {
            this.loading = true
            queryPageList(this.getSearcFormData()).then((response) => {
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getSearcFormData () {
            return ActionUtils.formatParams(
                this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
                this.pagination,
                this.sorts
            )
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        /**
         * 查询
         */
        search () {
            this.loadData()
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search': // 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'upLoad': // 添加
                    this.handleUpload()
                    break
                case 'modifyName': // 修改文件名
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleModify(id)
                        this.file.fileName = data.fileName
                        // console.log(this.file.fileName)
                    })
                    break
                case 'detail': // 明细
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleDetail(id)
                        this.detailData = data
                    })
                    break
                case 'preview': // 预览
                    console.log('ext:', data.ext)
                    if (fileTypes.images.includes(data.ext)) {
                        this.file = data
                        this.filePreviewVisible2 = false
                        this.filePreviewVisible = true
                    } else if (data.ext === 'pdf' || data.ext === 'PDF') {
                        this.$nextTick(() => {
                            const newTab = window.open()
                            const link = newTab.document.createElement('link')
                            const url = BASE_API() + SYSTEM_URL() + '/file/download?attachmentId=' + data.id
                            const hasRole = localStorage.getItem('hasHighRole') || 0
                            link.rel = 'shortcut icon'
                            link.type = 'image/x-icon'
                            link.href = 'favicon.ico'
                            // newTab.document.write('<link rel="icon" type="image/x-icon" href="favicon.ico">')
                            newTab.document.write(`<title>文件预览页-${data.fileName}</title>`)
                            newTab.document.write('<style>body { margin: 0px; }</style>')
                            newTab.document.head.appendChild(link)
                            console.log(`${this.$baseUrl}lib/pdfjs-dist/web/viewer.html?file=${encodeURIComponent(url)}&hasRole=${hasRole}`)
                            newTab.document.write(`<iframe src="${this.$baseUrl}lib/pdfjs-dist/web/viewer.html?file=${encodeURIComponent(url)}&hasRole=${hasRole}" style="width:100%; height:100%;" frameborder="0";>`)
                        })
                    } else {
                        this.file.url = `${this.$onlyofficeApi}/file/download?attachmentId=${data.id}`
                        this.file.editUrl = `${this.$onlyofficeApi}/file/editCallback?fileName=${data.fileName}&fileType=${data.ext}&id=${data.id}`
                        this.file.title = data.fileName // 文件名称
                        this.file.fileType = data.ext // 类型
                        this.filePreviewVisible = false
                        this.filePreviewVisible2 = true
                    }
                    break
                case 'download': // 下载
                    this.handleDownload(data)
                    break
                case 'downloadZip': // 批量下载
                    ActionUtils.selectedMultiRecord(selection).then((id) => {
                        downloadFileByZip(id)
                    })
                    break
                case 'remove': // 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => {})
                    break
                default:
                    break
            }
        },
        /**
         * 上传
         */
        handleUpload (id = '') {
            this.editId = id
            this.dialogFormVisible = true
        },
        uploaderAction (data) {
            this.dialogFormVisible = false
            this.search()
        },
        /**
         * 修改文件名
         */
        handleModify (id = '') {
            this.editId = id
            this.modifyNameVisible = true
        },
        /**
         * 处理明细
         */
        handleDetail (id = '') {
            this.editId = id
            this.detailVisible = true
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            deleteFile({ attachmentIds: ids }).then(() => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        },
        handleDownload (data) {
            downloadFile(data)
        }
    }
}
</script>
<style lang="scss">
    .attachment-uploader-dialog {
        .el-dialog__body {
            height: calc(57vh - 100px) !important;
        }
    }
</style>
