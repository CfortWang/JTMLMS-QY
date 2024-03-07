<!--
 * @Descripttion: 表单/数据模板脚本：
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2023-11-17 16:40:46
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-03-07 08:51:52
-->
<template>
    <div>
        <editor ref="editor" :option="option" :operation_status="operation_status" @updateFile="updateFile" @hadLoadedFile="hadLoadedFile" />
    </div>
</template>

<script>
import editor from './editor'
export default {
    name: 'f-view',
    components: { editor },
    props: {
        optionFile: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // eslint-disable-next-line vue/prop-name-casing
        operation_status: {
            type: String,
            default: ''
        }
    },
    data () {
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
    created () {
        this.option.user.id = this.$store.getters.userId
        this.option.user.name = this.$store.getters.name
        this.getFile()
    },
    methods: {
        updateFile (data) {
            this.$emit('updateFile', data)
        },
        getFile () {
            this.option.url = this.optionFile.url // 下载地址
            this.option.editUrl = this.optionFile.editUrl // 回调接口url
            this.option.title = this.optionFile.title // 文件名称
            this.option.fileType = this.optionFile.fileType // 类型
        },
        hadLoadedFile (v) {
            this.$emit('hadLoadedFile', v)
        },
        destoryZiComponent () {
            const editor = this.$refs.editor
            editor.clearTimer()
        }
    }
}
</script>
