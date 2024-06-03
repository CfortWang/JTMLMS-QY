<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog experimental-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model.sync="form"
            :rules="rules"
            class="config-form"
            :class="readonly ? 'readonly-form' : ''"
            @submit.native.prevent
        >
            <div v-if="loadCompleted" class="config-form-container">
                <div class="left">
                    <experimental-desc
                        :step="configData.step"
                        :criterion="configData.criterion"
                        :formulas="configData.formulas"
                        :references="configData.references"
                        :readonly="readonly"
                    />
                    <basic-info :info="form" :readonly="readonly" />
                    <reagent-info :info="form.reagentPoList" :readonly="readonly" />
                    <param-info
                        v-if="$utils.isNotEmpty(configData.params)"
                        :form-id="formId"
                        :info="form.shiYanCanShu"
                        :config-data="configData.params"
                        :readonly="readonly"
                        @updateParams="handleUpdateParams"
                    />
                </div>
                <div class="right">
                    <experimental-data
                        :exp-data="form.jiSuanJieGuo"
                        :form-id="formId"
                        :readonly="readonly"
                        @export="handleExport"
                        @import="handleImport"
                    />
                    <precision
                        v-if="$utils.isNotEmpty(form.jiSuanJieGuo)"
                        :info="form.jiSuanJieGuo"
                        :readonly="readonly"
                        @recalculate="handleRecalculate"
                    />
                    <conclusion
                        :result="form.shiYanJieLun"
                        :files="form.fuJian"
                        :readonly="readonly"
                        @updateData="handleUpdateData"
                    />
                </div>
            </div>
        </el-form>
        <div slot="title" class="config-dialog-header">
            <div class="title">{{ configData.methodName }}</div>
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
import { formRules } from './constants/index'
import ActionUtils from '@/utils/action'
import { getExperimental, saveExperimental, getConfigDetail, recalculate, exportTemplate, importTemplate } from '@/api/business/pv'
export default {
    components: {
        ExperimentalDesc: () => import('./components/experimental-desc'),
        BasicInfo: () => import('./components/basic-info'),
        ReagentInfo: () => import('./components/reagent-info'),
        ParamInfo: () => import('./components/param-info'),
        ExperimentalData: () => import('./components/experimental-data'),
        Conclusion: () => import('./components/conclusion'),
        Precision: () => import('./report/precision')
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
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        return {
            dialogVisible: this.visible,
            formLabelWidth: '110px',
            configData: {},
            formId: this.params.recordId,
            form: {
                xingNengZhiBia: '',
                fangAnLeiXing: '',
                bianZhiBuMen: '',
                shiYanXiangMu: '',
                shiYanFangFa: '',
                yangBenLeiXing: '',
                shiYanYiQi: '',
                yiQiBianHao: '',
                kaiShiShiJian: '',
                jieShuShiJian: '',
                bianZhiRen: '',
                createBy: userId,
                jieGuoDanWei: '',
                baoLiuXiaoShu: 3,
                beiZhu: '',
                reagentPoList: [],
                shiYanCanShu: {},
                shiYanShuJu: [],
                jiSuanJieGuo: {},
                shiYanJieLun: '',
                fuJian: ''
            },
            rules: formRules,
            loading: false,
            loadCompleted: false,
            toolbars: [
                { key: 'test', icon: 'ibps-icon-gg', label: '测试', type: 'warning', hidden: this.readonly },
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success', hidden: this.readonly },
                // { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'primary', hidden: this.readonly },
                // { key: 'generate', icon: 'ibps-icon-cube', label: '生成报告', type: 'success', hidden: this.readonly },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
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
        this.getConfigData(this.params)
        if (!this.params.recordId) {
            this.loadCompleted = true
            return
        }
        this.loadData()
    },
    methods: {
        // 获取数据
        loadData () {
            this.loading = true
            getExperimental({ id: this.params.recordId }).then(res => {
                this.loading = false
                const data = res.data
                if (!data) {
                    return
                }
                data.shiYanCanShu = data.shiYanCanShu ? JSON.parse(data.shiYanCanShu) : {}
                data.shiYanShuJu = data.shiYanShuJu ? JSON.parse(data.shiYanShuJu) : []
                data.jiSuanJieGuo = data.jiSuanJieGuo ? JSON.parse(data.jiSuanJieGuo) : {}
                this.form = Object.assign(this.form, data)
                this.loadCompleted = true
            }).catch(() => {
                this.loading = false
            })
        },
        getConfigData ({ targetId, methodId }) {
            getConfigDetail({ id: targetId }).then(res => {
                const { target, targetKey, experimentalConfigDetailPoList: methods } = res.data || {}
                const method = methods.find(i => i.id === methodId) || {}
                this.configData = {
                    target,
                    targetKey,
                    ...method,
                    params: this.$utils.isNotEmpty(method.params) ? JSON.parse(method.params) : [],
                    formulas: this.$utils.isNotEmpty(method.formulas) ? JSON.parse(method.formulas) : []
                }
                console.log(this.configData)
            })
        },
        handleActionEvent (key) {
            switch (key) {
                case 'save':
                case 'submit':
                    this.handleSubmit('submit', true)
                    break
                case 'generate':
                    this.handleGenerate()
                    break
                case 'cancel':
                    this.handleCancel()
                    break
                case 'test':
                    this.handleTest()
                    break
                default:
                    break
            }
        },
        handleSave (key, callback) {
            this.submitForm(key, callback)
        },
        handleSubmit (key, showMsg, callback) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项后再进行操作！')
                }
                this.submitForm(key, showMsg, callback)
                // this.$confirm('确定要提交数据吗？', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning',
                //     showClose: false,
                //     closeOnClickModal: false,
                //     closeOnPressEscape: false
                // }).then(() => {
                //     this.submitForm('submit', callback)
                // })
            })
        },
        handleGenerate () {
            this.$message.info('waiting...')
        },
        submitForm (key, showMsg, callback) {
            const { shiYanCanShu, shiYanShuJu, jiSuanJieGuo, ...rest } = this.form || {}
            const submitData = {
                ...rest,
                shiYanCanShu: this.$utils.isNotEmpty(shiYanCanShu) ? JSON.stringify(shiYanCanShu) : null,
                shiYanShuJu: this.$utils.isNotEmpty(shiYanShuJu) ? JSON.stringify(shiYanShuJu) : null,
                jiSuanJieGuo: this.$utils.isNotEmpty(jiSuanJieGuo) ? JSON.stringify(jiSuanJieGuo) : null,
                xingNengZhiBia: this.configData.target,
                fangAnLeiXing: this.configData.methodName,
                zhiBiaoId: this.params.targetId,
                fangFaKey: this.params.methodKey,
                fangFaId: this.params.methodId,
                id: this.formId
            }
            const isEdit = !!this.formId
            // 提交数据
            saveExperimental(submitData).then(res => {
                this.formId = res.data
                if (showMsg) {
                    this.$message.success('保存成功')
                }
                if (callback) {
                    callback()
                }
                // 提交时且有实验数据时，重新计算
                if (key === 'submit' && isEdit && this.$utils.isNotEmpty(shiYanShuJu)) {
                    recalculate({ id: this.formId }).then(res => {
                        this.form.jiSuanJieGuo = res.data
                        this.form.shiYanJieLun = res.data.reportResult
                    })
                }
            })
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('update:visible', false)
            this.$emit('refresh')
        },
        handleUpdateParams (value) {
            this.form.shiYanCanShu = value
        },
        handleUpdateData (value) {
            this.form = {
                ...this.form,
                ...value
            }
        },
        handleExport () {
            this.handleSubmit('beforeExport', false, () => {
                exportTemplate({ id: this.formId }).then(res => {
                    ActionUtils.download(res.data, `${this.form.fangAnLeiXing}-${this.form.shiYanXiangMu}.xlsx`)
                })
            })
        },
        handleImport () {
            this.handleSubmit('beforeImport', false, () => {
                this.importData()
            })
        },
        importData () {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.xlsx'
            input.onchange = event => {
                const file = event.target.files[0]
                const reader = new FileReader()
                reader.onload = event => {
                    const data = new FormData()
                    data.append('id', this.formId)
                    data.append('applyFiles', file)
                    importTemplate(data).then(res => {
                        this.$message.success('实验数据导入成功')
                        this.form.jiSuanJieGuo = res.data
                    }).catch(({ state, cause }) => {
                        const errMsg = JSON.parse(cause)
                        let msgContent = ''
                        Object.keys(errMsg).forEach(key => {
                            let msgItem = '<div >'
                            errMsg[key].forEach(item => {
                                msgItem += `<div>${item}</div>`
                            })
                            msgContent += `<div><div style="font-weight: bold;">${key}：</div>${msgItem}<div>`
                        })
                        this.$confirm(`<div style="font-size: 14px;">${msgContent}</div>`, '数据校验失败，请根据以下提示完善您的数据！', {
                            confirmButtonText: '确认',
                            showClose: false,
                            showCancelButton: false,
                            closeOnClickModal: false,
                            dangerouslyUseHTMLString: true,
                            customClass: 'errorTips',
                            type: 'error'
                        }).then(() => {}).catch(() => {})
                    })
                }
                reader.readAsBinaryString(file)
            }
            input.click()
        },
        handleRecalculate () {
            this.submitForm('save', () => {
                recalculate({ id: this.formId }).then(res => {
                    this.$message.success('重新计算成功')
                    this.form.jiSuanJieGuo = res.data
                })
            })
        },
        handleTest () {
            const o = {
                xingNengZhiBia: '精密度',
                fangAnLeiXing: 'EP15-A3精密度评价',
                bianZhiBuMen: '1166703356459089920',
                shiYanXiangMu: '测试项目',
                shiYanFangFa: '测试方法',
                yangBenLeiXing: '测试样本类型',
                shiYanYiQi: '测试实验仪器',
                yiQiBianHao: 'jyk-test-001',
                kaiShiShiJian: '2024-05-01 09:00',
                jieShuShiJian: '2024-05-05 17:00',
                bianZhiRen: '1166772479054577664',
                createBy: '1166771426615623680',
                jieGuoDanWei: 'mmol/L',
                baoLiuXiaoShu: 3,
                beiZhu: '测试数据',
                reagentPoList: [
                    {
                        changJia: 'BIO-RIO',
                        leiBie: '质控品',
                        piHao: 'test001',
                        shiJiMingCheng: '生化质控品',
                        youXiaoQi: '2025-05-01'
                    },
                    {
                        changJia: 'BIO-RIO',
                        leiBie: '校准品',
                        piHao: 'test002',
                        shiJiMingCheng: '生化校准品',
                        youXiaoQi: '2025-06-01'
                    },
                    {
                        changJia: 'BIO-RIO',
                        leiBie: '标准物',
                        piHao: 'test001',
                        shiJiMingCheng: '标准物',
                        youXiaoQi: '2025-05-01'
                    }
                ],
                shiYanCanShu: {
                    specimensNum: 2,
                    repeatNum: 3,
                    days: 5,
                    isConvert: false,
                    standard: '基于允许总误差TEa',
                    tea: 10,
                    batchCVS: 0.25,
                    batchCVSValue: 2.50,
                    dailyCVS: 0.33,
                    dailyCVSValue: 3.33
                },
                shiYanShuJu: [],
                shiYanJieLun: '测试达标',
                shenHeRen: '1166673437578493952',
                baoGaoShiJian: '2024-05-06',
                fuJian: '1239940596743798784'
            }
            this.form = JSON.parse(JSON.stringify(o))
        }
    }
}
</script>
<style lang="scss" scoped>
    .experimental-dialog {
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
        }
        .config-form {
            &-container {
                position: relative;
                width: 100%;
                height: calc(100vh - 60px);
                overflow: auto;
                display: flex;
                .left, .right {
                    width: 50%;
                    // min-height: 100%;
                    height: 100%;
                    overflow-y: auto;
                    padding: 15px 20px;
                    box-sizing: border-box;
                    .info-container {
                        margin-bottom: 20px;
                        &:last-child {
                            margin-bottom: 0;
                        }
                    }
                    ::v-deep {
                        .info-item {
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
                            .el-form-item {
                                margin-bottom: 0 !important;
                                &__label {
                                    font-size: 14px !important;
                                    color: #606266;
                                }
                                &__content {
                                    .el-input, .el-select, .el-input-number {
                                        width: 100%;
                                    }
                                    .el-textarea .el-input__count {
                                        padding: 0 5px;
                                        line-height: initial;
                                    }
                                    .el-radio, .el-checkbox {
                                        margin-right: 10px;
                                    }
                                }
                            }
                            .el-table th.el-table__cell > .cell, .el-table td.el-table__cell {
                                color: #606266;
                                font-size: 14px !important;
                            }
                            .el-button--mini {
                                padding: 5px 12px;
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
