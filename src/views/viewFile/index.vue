<!--onlyoffice 编辑器-->
<template>
    <div>
        <div id="editorDiv" ref="editor" class="nav" />
    </div>
</template>

<script>
import { handleDocType } from '@/business/platform/file/attachment/editFile/editor/editor.js'
import { showView } from '@/api/platform/file/attachment'
import { getToken } from '@/utils/auth'

export default {
    name: 'editor',
    data () {
        return {
            doctype: '',
            newId: '',
            timer: '',
            configKey: '',
            option: {},
            hasRole: localStorage.getItem('hasHighRole') === '1'
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
        this.option = this.$route.query
        /* 调用初始化方法 ，渲染wps*/
        if (this.option.url) {
            this.setEditor(this.option)
        }
    },
    methods: {
        setEditor (option) {
            this.doctype = handleDocType(option.fileType)
            const url = option.url + '&access_token=' + getToken()
            console.log('url:' + url)
            const config = {
                document: {
                    fileType: option.fileType,
                    key: option.key,
                    title: option.title,
                    permissions: {
                        comment: true,
                        copy: true,
                        download: this.hasRole,
                        modifyContentControl: true,
                        modifyFilter: true,
                        print: this.hasRole,
                        edit: true,
                        fillForms: true,
                        review: true
                    },
                    url: url
                },
                documentType: this.doctype,
                editorConfig: {
                    callbackUrl: option.editUrl,
                    lang: 'zh',
                    canHistoryRestore: true,
                    canUseHistory: true,
                    customization: {
                        commentAuthorOnly: false,
                        comments: true,
                        compactHeader: false,
                        compactToolbar: true,
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
                        id: this.$store.getters.userId,
                        name: this.$store.getters.name
                    },
                    mode: option.mode
                },
                width: '100%',
                height: document.body.clientHeight + 'px'
            }
            const docEditor = new DocsAPI.DocEditor('editorDiv', config)
            this.configKey = config.document.key
        }
    }
}
</script>
