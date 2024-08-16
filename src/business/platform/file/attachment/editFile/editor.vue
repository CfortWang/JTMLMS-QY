<!--onlyoffice 编辑器-->
<template>
    <div id="editorDiv" ref="editor" class="nav" />
</template>

<script>
import { handleDocType } from './editor/editor.js'
import { showView } from '@/api/platform/file/attachment'
import { getToken } from '@/utils/auth'
import { ref } from 'vue'

export default {
    name: 'editor',
    props: {
        option: {
            type: Object,
            default: () => {
                return {}
            }
        },
        operation_status: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            doctype: '',
            newId: '',
            timer: '',
            configKey: ''

        }
    },
    watch: {
        option: {
            handler: function (n, o) {
                this.setEditor(n)
                this.doctype = handleDocType(n.fileType)
            },
            deep: true
        }
    },
    mounted () {
        // 调用初始化方法 ，渲染wps
        if (this.option.url) {
            this.setEditor(this.option)
        }
        if (this.option.mode === 'edit') {
            // 编辑模式下轮询获取文件id
            this.timer = setInterval(() => {
                if (this.configKey) {
                    showView({ key: this.configKey }).then((response) => {
                        if (response.variables.data !== '0' && this.newId !== response.variables.data) {
                            // 记录当前id，与返回的文件id比对，有变化证明有做修改，提示并替换
                            this.newId = response.variables.data
                            this.$message.success('文件编辑保存成功，稍后请提交表单！')
                            this.$emit('updateFile', this.newId)
                        }
                    })
                }
            }, 2000)
        }
    },
    beforeDestroy () {
        // 页面关闭清除定时任务
        this.clearTimer()
    },
    methods: {
        // 清除定时任务
        clearTimer () {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },
        setEditor (option) {
            this.doctype = handleDocType(option.fileType)
            const config = {
                document: {
                    fileType: option.fileType,
                    key: option.key,
                    title: option.title,
                    permissions: {
                        comment: this.operation_status !== 'fileTraining',
                        download: this.operation_status !== 'fileTraining',
                        modifyContentControl: this.operation_status !== 'fileTraining',
                        modifyFilter: this.operation_status !== 'fileTraining',
                        print: this.operation_status !== 'fileTraining',
                        edit: this.operation_status !== 'fileTraining',
                        fillForms: this.operation_status !== 'fileTraining',
                        review: this.operation_status !== 'fileTraining'
                    },
                    url: option.url
                },
                documentType: this.doctype,
                editorConfig: {
                    callbackUrl: option.editUrl + '&access_token=' + getToken(),
                    lang: 'zh',
                    canHistoryRestore: true,
                    canUseHistory: true,
                    customization: {
                        commentAuthorOnly: false,
                        comments: true,
                        compactHeader: false,
                        compactToolbar: false,
                        plugins: true,
                        feedback: {
                            // 隐藏反馈按钮
                            visible: false
                        },
                        // true 表示强制文件保存请求添加到回调处理程序
                        forcesave: true,
                        // 取消强制保存，进行手动保存
                        atuosave: false
                    },
                    user: {
                        id: option.user.id,
                        name: option.user.name
                    },
                    mode: option.mode
                },
                events: {
                    onRequestSaveAs: () => {
                        console.log('另存为')
                    },
                    // 监听文件修改开启轮询，有几率同时触发N个，导致页面卡死
                    // onDocumentStateChange: e => {
                    //     if (!e.data) {
                    //         console.log('文件修改', e)
                    //         this.handlerFileSave()
                    //     }
                    // },
                    onDocumentReady: () => {
                        console.log('文件加载完成~')
                        this.hadLoadedFile(0)
                    }
                },
                width: '100%',
                token: getToken(),
                // 减去弹窗的顶部标题区域
                height: document.body.clientHeight - 63 + 'px'
            }
            const docEditor = new DocsAPI.DocEditor('editorDiv', config)
            this.configKey = config.document.key
        },
        handlerFileSave () {
            this.clearTimer()
            // 进行后端接口轮询，查到id则进行与当前id比较，相等则不做操作，不相等则返回id，更新页面数据。
            this.timer = setInterval(() => {
                if (this.configKey) {
                    showView({ key: this.configKey }).then((response) => {
                        if (response.variables.data !== '0' && this.newId !== response.variables.data) {
                            // 记录当前id，与返回的文件id比对，有变化证明有做修改，提示并替换
                            this.newId = response.variables.data
                            this.$message.success('文件编辑保存成功，稍后请提交表单！')
                            this.$emit('updateFile', this.newId)
                            this.clearTimer()
                        }
                    })
                }
            }, 2000)
        },
        hadLoadedFile (v) {
            this.$emit('hadLoadedFile', v)
        }
    }
}
</script>
