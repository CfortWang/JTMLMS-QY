<!--onlyoffice 编辑器-->
<template>
    <div>
        <div id="editorDiv" ref="editor" class="nav" />
    </div>
</template>

<script>

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
        const url = (location.hash.match(/\?(.*)/) || [])[1] || ''
        const params = {}
        if (url) {
            url.split('&').forEach(param => {
                if (param.includes('=')) {
                    const [key, value] = param.split('=')
                    params[decodeURIComponent(key)] = decodeURIComponent(value)
                }
            })
        }
        const path = params.path
        const temp = sessionStorage.getItem(decodeURIComponent(path))
        // const temp = localStorage.getItem('templateOption')
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
