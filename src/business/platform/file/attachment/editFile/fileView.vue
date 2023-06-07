<!--暂时用不到， 备份-->
<template>
  <div>
    <div id="editorDiv" class="nav" ref="editor" />
  </div>
</template>

<script>
  import {
    handleDocType
  } from './editor/editor.js'

  export default {
    name: 'viewFile',
    props: {
      option: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        doctype: ''
      }
    },
    mounted() {
      /* 调用初始化方法 ，渲染wps*/
      if (this.option.url) {
        this.setEditor(this.option)
      }
    },
    methods: {
      setEditor(option) {
        this.doctype = handleDocType(option.fileType)
        let config = {
          document: {
            fileType: option.fileType,
            key: option.key,
            title: option.title,
            permissions: {
              comment: true,
              download: true,
              modifyContentControl: true,
              modifyFilter: true,
              print: true,
              edit: option.isEdit,
              fillForms: true,
              review: true
            },
            url: option.url
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
              "atuosave": false, //取消强制保存，进行手动保存
            },
            user: {
              id: option.user.id,
              name: option.user.name
            },
            mode: option.mode,
          },
          width: '100%',
          height: document.body.clientHeight + 'px'
        }
        let docEditor = new DocsAPI.DocEditor('editorDiv', config)
      },
    },
    watch: {
      option: {
        handler: function(n, o) {
          this.setEditor(n)
          this.doctype = handleDocType(n.fileType)
        },
        deep: true,
      }
    }
  }
</script>

<style scoped>

</style>
