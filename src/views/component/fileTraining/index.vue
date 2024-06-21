<!--
 * @Descripttion: POCT文件培训
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2024-03-01 13:47:32
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-04-26 16:04:02
-->
<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :title="title"
        fullscreen
        append-to-body
        custom-class="ibps-file-preview-dialog"
    >
        <div>
            <fView v-if="refresh" ref="fvView" :option-file="optionFile" :operation_status="operation_status" @hadLoadedFile="hadLoadedFile" />
        </div>
    </el-dialog>
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
import fView from '@/business/platform/file/attachment/editFile/fView.vue'
import { SYSTEM_URL, BASE_API } from '@/api/baseUrl'
import ViewFile from '@/views/viewFile/index.vue'

export default {
    name: 'file-training',
    components: {
        fView,
        ViewFile
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        fileInfos: {
            type: Object,
            default: () => {}
        }
        // template: {
        //     type: Object,
        //     default: () => {}
        // }
    },
    data () {
        return {
            dialogVisible: false,
            operation_status: 'fileTraining',
            title: '',
            browseTime: 0, // 浏览时长初始值为 0
            clearTimeSet: null,
            optionFile: {},
            tmpId: '',
            upFunc: () => {},
            height: 0,
            out: false, // 记录鼠标是否离开过被监听的位置，未离开过则startTimer不启用
            hadLoad: false,
            refresh: false
        }
    },
    watch: {
        fileInfos: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
                this.title = `文件：《${val.FILE_NAME_}》`
                this.tmpId = val.id
                this.upFunc = val.func
                const data = {
                    ext: val.fileInfos.EXT_,
                    fileName: val.fileInfos.FILE_NAME_,
                    id: val.fileInfos.ID_,
                    index: 0,
                    totalBytes: val.fileInfos.TOTAL_BYTES_
                }
                // 1、获取文件数据 及下载流接口
                this.optionFile.url = BASE_API() + SYSTEM_URL() + '/file/download?attachmentId=' + data.id
                this.optionFile.editUrl = BASE_API() + SYSTEM_URL() + '/file/editCallback?fileName=' + data.fileName + '&fileType=' + data.ext + '&type="fileTraining"&id=' + data.id
                this.optionFile.title = data.fileName // 文件名称
                this.optionFile.fileType = data.ext // 类型
                this.optionFile.data = data // 记录编制的位置，需要替换。
                this.optionFile.data.index = data.index
                // 使用 v-if 实现组件刷新功能
                this.refresh = false
                this.$nextTick(() => {
                    this.refresh = true
                })
            }
        },
        browseTime: {
            handler: function (val, oldVal) {
                this.title = `文件：《 ${this.fileInfos.FILE_NAME_} 》，查阅时长：${val}秒`
            },
            immediate: true
        },
        dialogVisible: {
            handler: function (val, oldVal) {
                if (!val) {
                    this.closeDialog()
                }
            }
        }
    },
    beforeDestroy () {
        this.fileType = ''
        this.option = {}
    },
    mounted () {
        this.height = this.getDialogHeightHeight()
        // 页面切换时改变计时状态
        document.addEventListener('visibilitychange', this.handlePageChange)
    },
    methods: {
        handlePageChange () {
            if (document.visibilityState === 'hidden') {
                this.pauseTimer()
            } else {
                this.startTimer()
            }
        },
        closeDialog () {
            const fvView = this.$refs.fvView
            // 销毁子组件方法
            fvView.destoryZiComponent()
            this.upFunc(this.tmpId, this.browseTime)
            // 针对关闭窗口或者浏览器的
            if (this.clearTimeSet != null) {
                clearInterval(this.clearTimeSet)
                this.clearTimeSet = null
            }
            this.out = false
            this.browseTime = 0
        },
        hadLoadedFile (v) {
            this.setBrowseTime()
            this.hadLoad = true
        },
        setBrowseTime () {
            // 设置定时器
            this.clearTimeSet = setInterval(() => {
                this.browseTime++
            }, 1000)
        },
        getDialogHeightHeight () {
            return ((document.documentElement.clientHeight || document.body.clientHeight) - 60) + 'px'
        },
        startTimer () {
            if (this.dialogVisible && this.hadLoad && this.out && this.clearTimeSet == null) {
                this.clearTimeSet = setInterval(() => {
                    this.browseTime++
                }, 1000)
            }
        },
        pauseTimer () {
            if (this.dialogVisible) {
                this.out = true
                clearInterval(this.clearTimeSet)
                this.clearTimeSet = null
            }
        }
    }
}
</script>
<style lang="scss">
    .ibps-file-preview-dialog {
      width: 80%;
      z-index:99999;
        .el-dialog__body {
            padding: 0;

        }
        .file-type-txt {
            height: calc(88vh) !important;
        }
    }
</style>
