<!--暂时用不到， 备份-->
<template>
    <div>
        <div id="editorDiv" ref="editor" class="nav" />
    </div>
</template>

<script>
import { handleDocType } from './editor/editor.js'

export default {
    name: 'view-file',
    props: {
        option: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            doctype: ''
        }
    },
    watch: {
        option: {
            handler: function (n, o) {
                this.setEditor(n)
            },
            deep: true
        }
    },
    mounted () {
        if (this.$utils.isNotEmpty(this.option)) {
            this.setEditor(this.option)
        }
    },
    methods: {
        setEditor (option) {
            const config = {
                ...option,
                width: '100%',
                height: document.body.clientHeight + 'px'
            }
            const docEditor = new DocsAPI.DocEditor('editorDiv', config)
        }
    }
}
</script>
