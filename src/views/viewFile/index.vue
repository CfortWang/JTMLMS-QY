<!--onlyoffice 编辑器-->
<template>
    <div>
        <div id="editorDiv" class="nav" ref="editor" />
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
            option: {}
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
            let url = option.url + '&access_token=' + getToken();
            console.log("url:" + url)
            let config = {
                document: {
                    fileType: option.fileType,
                    key: option.key,
                    title: option.title,
                    permissions: {
                        comment: true,
                        copy: true,
                        download: false,
                        modifyContentControl: true,
                        modifyFilter: true,
                        print: false,
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
                        feedback: false,
                        plugins: true,
                        "feedback": {
                            "visible": true // 隐藏反馈按钮
                        },
                        "forcesave": true, // true 表示强制文件保存请求添加到回调处理程序
                        "atuosave": false, // 取消强制保存，进行手动保存
                    },
                    user: {
                        id: this.$store.getters.userId,
                        name: this.$store.getters.name
                    },
                    mode: option.mode,
                },
                width: '100%',
                height: document.body.clientHeight + 'px'
            }
            let docEditor = new DocsAPI.DocEditor('editorDiv', config)
            this.configKey = config.document.key
        },
    },
    watch: {
        option: {
            handler: function (n, o) {
                this.setEditor(n)
                this.doctype = handleDocType(n.fileType)
            },
            deep: true,
        }
    }
}
</script>
