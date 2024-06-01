<template>
    <el-dialog
        title="公式预览"
        :visible.sync="dialogVisible"
        :show-close="false"
        append-to-body
        width="50%"
        class="dialog formula-dialog"
        top="30vh"
        @close="closeDialog"
    >
        <div class="formula">
            <div>{{ formula.label }}</div>
            <div>{{ formula.value }}</div>
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>

<script>
import MathJax from '@/utils/MathJax'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        formula: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            dialogVisible: this.show,
            toolbars: [
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    watch: {
        show: {
            handler (val, oldVal) {
                this.dialogVisible = this.show
            },
            immediate: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.formatMath()
        })
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        formatMath () {
            if (MathJax.isMathjaxConfig) {
                MathJax.initMathjaxConfig()
            }
            MathJax.MathQueue('.formula')
        },
        closeDialog () {
            this.$emit('update:show', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .formula-dialog {
        .formula {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>
