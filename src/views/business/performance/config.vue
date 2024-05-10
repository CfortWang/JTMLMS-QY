<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog method-config-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="form"
            :rules="rules"
            class="config-form"
            :class="readonly ? 'readonly-form' : ''"
            @submit.native.prevent
        >
            <div class="config-form-container">
                <div class="left">
                    <experimental-desc :info="form" :readonly="readonly" />
                    <basic-info :info="form" :readonly="readonly" />
                    <reagent-info :info="form" :readonly="readonly" />
                    <param-info :info="form" :readonly="readonly" />
                </div>
                <div class="right">
                    <experimental-data :info="form" :readonly="readonly" />
                    <conclusion :info="form" :readonly="readonly" />
                </div>
            </div>
        </el-form>
        <div slot="title" class="config-dialog-header">
            <div class="title">{{ pageData.name }}</div>
            <div class="operate">
                <template v-for="btn in toolbars">
                    <el-button
                        v-if="!btn.hidden"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        @click="handleActionEvent(btn.key)"
                    >
                        {{ btn.label }}
                    </el-button>
                </template>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { round } from 'lodash'
import { formRules } from './constants'
export default {
    components: {
        ExperimentalDesc: () => import('./components/experimental-desc'),
        BasicInfo: () => import('./components/basic-info'),
        ReagentInfo: () => import('./components/reagent-info'),
        ParamInfo: () => import('./components/param-info'),
        ExperimentalData: () => import('./components/experimental-data'),
        Conclusion: () => import('./components/conclusion')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        pageData: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        return {
            dialogVisible: this.visible,
            formLabelWidth: '110px',
            form: {
                dept: '',
                projectName: '',
                method: '',
                sample: '',
                deviceName: '',
                deviceNo: '',
                startTime: '',
                endTime: '',
                operator: '',
                rater: '',
                resultUnit: '',
                resultValue: '',
                decimalPlaces: 2,
                remark: ''
            },
            rules: formRules,
            loading: false,
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'info', hidden: this.readonly },
                { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'primary', hidden: this.readonly },
                { key: 'generate', icon: 'ibps-icon-cube', label: '生成报告', type: 'success', hidden: this.readonly },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    computed: {

    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
            // immediate: true
        }
    },
    created () {

    },
    mounted () {
        this.loadData()
    },
    methods: {
        // 获取数据
        async loadData () {
            console.log(11)
        },
        handleActionEvent (key) {
            switch (key) {
                case 'save':
                    this.handleSave(key)
                    break
                case 'submit':
                    this.handleSave(key)
                    break
                case 'generate':
                    this.handleGenerate()
                    break
                case 'cancel':
                    this.handleCancel()
                    break
                default:
                    break
            }
        },
        handleSave () {
            this.$confirm('123123', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
            }).then(() => {
                this.submitForm()
            })
        },
        handleGenerate () {
            console.log('handleGenerate')
        },
        submitForm (data) {

        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('update:visible', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .method-config-dialog {
        ::v-deep {
            .el-dialog__header {
                padding: 15px 20px 16px;
            }
        }
        .config-dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                line-height: 24px;
                font-size: 18px;
                color: #303133;
            }
            .operate {

            }
        }
        .config-form {
            .config-form-container {
                position: relative;
                width: 100%;
                height: calc(100vh - 60px);
                overflow: auto;
                display: flex;
                .left, .right {
                    width: 50%;
                    min-height: 100%;
                    padding: 15px 20px;
                    box-sizing: border-box;
                    ::v-deep {
                        .info-item {
                            margin-bottom: 20px;
                            .title {
                                height: 20px;
                                line-height: 20px;
                                font-size: 16px;
                                font-weight: bold;
                                margin-bottom: 10px;
                                .ibps-icon-star {
                                    color: #FB9600;
                                    margin-right: 5px;
                                }
                            }
                            .desc {
                                color: #666;
                                font-size: 14px;
                                line-height: 1.5;
                                text-indent: 2em;
                            }
                        }
                    }
                }
                .left {
                    &::before {
                        content: '';
                        width: 0;
                        height: 100%;
                        border-left: 1px dashed #dcdfe6;
                        position: absolute;
                        top: 0;
                        left: 50%;
                    }
                }
            }
        }
    }
</style>
