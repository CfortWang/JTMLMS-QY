<template>
    <div>
        <image-viewer
            v-if="fileType === 'image'"
            :z-index="zIndex"
            :url-list="[url]"
            :on-close="closeDialog"
        />
        <template v-if="fileType !== 'image' && fileType">
            <el-dialog
                :visible.sync="dialogVisible"
                :title="title"
                fullscreen
                append-to-body
                custom-class="ibps-file-preview-dialog"
                @close="closeDialog"
            >
                <editor :option="option" v-if="dialogVisible" />
                <pdf-viewer v-if="fileType === 'pdf'" ref="viewer" />

                <txt-viewer
                    v-else-if="fileType === 'txt'"
                    class="file-type-txt"
                    :src="url"
                />
                <div v-else class="lc-fixed-navbar">不支持预览的类型</div>
            </el-dialog>
        </template>
    </div>
</template>
<script>
    /**
     * 文件预览
     * 1、'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'  类型支持
     * 2、图片支持缩放
     * 3、音频，语音支持
     * ==================
     * 下一版本支持
     * 1、pdf支持缩放
     * 2、音频，语音多格式支持
     * 3、压缩包支持
     */
    import ImageViewer from './image'
    // import AudioViewer from './audio' //xianyifan
    // import VideoViewer from './video' //xianyifan
    import TxtViewer from './txt'
    import pdfViewer from './pdf/index'
    import { officeType, pdfType, txtType, imageType, audioType, videoType } from './constants'
    import PopupManager from '@/utils/popup'
    import editor from '@/business/platform/file/attachment/editFile/editor.vue'
    export default {
        components: {
            ImageViewer,
            // AudioViewer,
            // VideoViewer,
            TxtViewer,
            editor,
            pdfViewer
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            fileExt: {
                type: String
            },
            url: {
                type: String,
                require: true
            },
            optionFile: {
                type: Object,
                default: () => {}
            },
            file:{
                type: String,
                require: ''
            }
        },
        data() {
            return {
                dialogVisible: false,
                fileType: '',
                zIndex: 2000,
                // openedLoaded: false,
                fileUrl: '',
                option: {
                    url: '',
                    isEdit: true,
                    fileType: '',
                    title: '',
                    user: {
                        id: '',
                        name: ''
                    },
                    mode: 'view',
                    editUrl: '',
                    key: ''
                }
            }
        },
        watch: {
            optionFile: {
                handler: function (val, oldVal) {
                    this.dialogVisible = this.visible
                    this.loadViewer()
                },
                immediate: true
            }
        },
        beforeDestroy() {
            this.fileType = ''
            // this.openedLoaded = false
            this.option = {}
        },
        methods: {
            /**
             * zxh 修复zindex 不是最高的被遮住
             */
            fixZIndex() {
                return PopupManager.getZIndex()
            },
            loadViewer() {
                var flag = true
                if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
                    flag = false
                }
                if (imageType.includes(this.fileExt)) {
                    this.dialogVisible = false
                    this.zIndex = this.fixZIndex()
                    this.fileUrl = this.url
                    this.fileType = 'image'
                } else if(flag && pdfType.includes(this.fileExt)){
                    // this.fileType = 'pdf'
                    this.$nextTick(() => {
                        // this.$refs.viewer.load(this.url)
                        const newTab = window.open()
                        const link = newTab.document.createElement('link')
                        link.rel = 'shortcut icon'
                        link.type = 'image/x-icon'
                        link.href = 'favicon.ico'
                        // newTab.document.write('<link rel="icon" type="image/x-icon" href="favicon.ico">')
                        newTab.document.write(`<title>文件预览页-${this.title}</title>`)
                        newTab.document.write('<style>body { margin: 0px; }</style>')
                        newTab.document.head.appendChild(link)
                        newTab.document.write(`<iframe src="${this.$baseUrl}lib/pdfjs-dist/web/viewer.html?file=${encodeURIComponent(this.url)}" style="width:100%; height:100%;" frameborder="0";>`)
                        this.closeDialog()
                    })

                } else {
                    this.openDialog() // 先初始化调用参数
                    this.openWindow() // 打开外部预览页面
                    this.closeDialog() // 关闭当前
                    // this.fileType = 'FILE'
                }
                // else if (
                //     officeType.includes(this.fileExt) ||
                //     pdfType.includes(this.fileExt)
                // ) {
                //     this.fileType = 'pdf'
                // } else if (audioType.includes(this.fileExt)) {
                //     this.fileType = 'audio'
                // } else if (videoType.includes(this.fileExt)) {
                //     this.fileType = 'video'
                // } else if (txtType.includes(this.fileExt)) {
                //     this.fileType = 'txt'
                // }
            },
            openWindow(data) {
                let routeData = this.$router.resolve({
                    path: '/fileView',
                    query: this.option
                })
                window.open(routeData.href)
            },
            openDialog() {
                this.option.user.id = this.$store.getters.userId
                this.option.user.name = this.$store.getters.name
                this.getFile()
            },
            getFile() {
                this.option.url = this.optionFile.url // 下载地址
                this.option.editUrl = this.optionFile.editUrl // 回调接口url
                this.option.title = this.optionFile.title // 文件名称
                this.option.fileType = this.optionFile.fileType // 类型
            },
            // openDialog() {
            //     if (this.fileType === 'pdf') {
            //         this.$nextTick(() => {
            //             const timer = setInterval(() => {
            //                 if (this.openedLoaded) {
            //                     clearInterval(timer)
            //                 } else {
            //                     if (this.$refs.viewer) {
            //                         this.$refs.viewer.load(this.url)
            //                         this.openedLoaded = true
            //                     }
            //                 }
            //             }, 50)
            //         })
            //     }
            // },
            closeDialog() {
                this.fileType = ''
                // this.openedLoaded = false
                this.$emit('close', false)
            }
        }
    }
</script>
<style lang="scss">
    .ibps-file-preview-dialog {
        .el-dialog__body {
            padding: 0;
        }
        .file-type-txt {
            height: calc(88vh) !important;
        }
    }
</style>
