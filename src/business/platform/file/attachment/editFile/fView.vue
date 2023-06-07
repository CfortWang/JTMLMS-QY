<template>
    <div>
        <editor :option="option" @updateFile="updateFile" />
    </div>
</template>

<script>
    import editor from './editor'
    export default {
        name: 'fView',
        components: { editor },
        props: {
            optionFile: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                option: {
                    url: '',
                    isEdit: true,
                    fileType: '',
                    title: '',
                    user: {
                        id: '',
                        name: ''
                    },
                    mode: 'edit',
                    editUrl: '',
                    key: ''
                }
            }
        },
        // 创建定时任务，开始查询是否有对应key
        created() {
            this.option.user.id = this.$store.getters.userId
            this.option.user.name = this.$store.getters.name
            this.getFile()
        },
        methods: {
            updateFile(data) {
                this.$emit('updateFile', data)
            },
            getFile() {
                this.option.url = this.optionFile.url // 下载地址
                this.option.editUrl = this.optionFile.editUrl // 回调接口url
                this.option.title = this.optionFile.title // 文件名称
                this.option.fileType = this.optionFile.fileType // 类型
            }
        }
    }
</script>
