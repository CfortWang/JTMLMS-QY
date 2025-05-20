<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            append-to-body
            width="60%"
            class="dialog json-parse-dialog"
            top="5vh"
            @close="closeDialog"
        >
            <div class="contain">
                <div class="item">
                    <div class="label">以下内容仅供技术人员恢复数据使用</div>
                    <div class="value">
                        <el-input
                            v-model="result"
                            type="textarea"
                            :autosize="{ minRows: 10, maxRows: 24}"
                            placeholder=""
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div slot="footer" class="el-dialog--center">
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { dataToSql } from '@/api/platform/system/news'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            title: 'JSON解析结果',
            dialogVisible: true,
            result: '',
            toolbars: [
                { key: 'copy', icon: 'ibps-icon-copy', label: '复制', type: 'primary', hidden: () => !this.result },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    computed: {

    },
    async mounted () {
        const { logId } = this.params
        const { data: { sql = '' } = {}} = await dataToSql({ logId })
        this.result = sql
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'copy':
                    this.handleCopy(this.result)
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleCopy (text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.$message.success('复制成功')
                }).catch(() => this.fallbackCopy(text))
            } else {
                this.fallbackCopy(text)
            }
        },
        fallbackCopy (text) {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            document.body.appendChild(textarea)
            textarea.select()
            try {
                document.execCommand('copy')
                this.$message.success('复制成功')
            } catch (err) {
                this.$message.warning('复制失败，请手动选择内容复制！')
            } finally {
                document.body.removeChild(textarea)
            }
        },
        closeDialog () {
            // this.$emit('close', false)
            this.dialogVisible = false
        }
    }

}
</script>

<style lang="scss" scoped>
.json-parse-dialog {
    .contain{
        .item {
            padding: 15px;
            .label {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .value {
                font-size: 16px;
                color: #666;
            }
        }
    }
}
</style>
