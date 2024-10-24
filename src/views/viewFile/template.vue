<!--onlyoffice 编辑器-->
<template>
    <div>
        <div id="editorDiv" ref="editor" class="nav" />
    </div>
</template>

<script>
import { showView } from '@/api/platform/file/attachment'
import { getToken } from '@/utils/auth'

export default {
    name: 'editor',
    data () {
        return {
            configKey: '',
            option: {}
        }
    },
    watch: {
        option: {
            handler (n, o) {
                this.setEditor(n)
            },
            deep: true
        }
    },
    mounted () {
        const temp = localStorage.getItem('fileOption')
        this.option = temp ? JSON.parse(temp) : {}
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
            this.configKey = config.document.key
        }
    }
}
</script>
