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
            :model.sync="form"
            :rules="rules"
            class="config-form"
            :class="readonly ? 'readonly-form' : ''"
            @submit.native.prevent
        >
            <div class="config-form-container">
                <div class="left">
                    <experimental-desc :info.sync="form" :readonly="readonly" />
                    <basic-info :info.sync="form" :readonly="readonly" />
                    <reagent-info :info.sync="form.reagentPoList" :readonly="readonly" />
                    <param-info :info.sync="form.shiYanCanShu" :readonly="readonly" @updateParams="handleUpdateParams" />
                </div>
                <div class="right">
                    <experimental-data :info="form" :readonly="readonly" />
                    <precision v-if="$utils.isNotEmpty(form.shiYanShuJu)" :info="form.shiYanShuJu" :readonly="readonly" />
                    <conclusion :info="form" :readonly="readonly" />
                </div>
            </div>
        </el-form>
        <div slot="title" class="config-dialog-header">
            <div class="title">{{ pageData.method }}</div>
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
import { getExperimental, saveExperimental } from '@/api/business/pv'
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
        pageData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        return {
            dialogVisible: this.visible,
            formLabelWidth: '110px',
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
                baoLiuXiaoShu: 2,
                beiZhu: '',
                reagentPoList: [],
                shiYanCanShu: {
                    model: []
                },
                shiYanShuJu: {},
                shiYanJieLun: ''
            },
            rules: formRules,
            loading: false,
            toolbars: [
                { key: 'test', icon: 'ibps-icon-gg', label: '测试', type: 'warning', hidden: this.readonly },
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'info', hidden: this.readonly },
                { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'primary', hidden: this.readonly },
                // { key: 'generate', icon: 'ibps-icon-cube', label: '生成报告', type: 'success', hidden: this.readonly },
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
        if (!this.pageData.id) {
            return
        }
        this.loadData()
    },
    methods: {
        // 获取数据
        async loadData () {
            getExperimental({ id: this.pageData.id }).then(res => {
                const { data } = res || {}
                if (data) {
                    data.shiYanCanShu = data.shiYanCanShu ? JSON.parse(data.shiYanCanShu) : {}
                    data.shiYanShuJu = data.shiYanShuJu ? JSON.parse(data.shiYanShuJu) : {}
                    this.form = Object.assign(this.form, data)
                }
            })
        },
        handleActionEvent (key) {
            switch (key) {
                case 'save':
                case 'submit':
                    this.handleSave(key)
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
        handleSave (key) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项信息！')
                }
                if (key === 'save') {
                    this.submitForm(key)
                } else {
                    this.$confirm('确定要提交数据吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        showClose: false,
                        closeOnClickModal: false,
                        closeOnPressEscape: false
                    }).then(() => {
                        this.submitForm(key)
                    })
                }
            })
        },
        handleGenerate () {
            this.$message.info('waiting...')
        },
        submitForm (key) {
            const submitData = {
                ...this.form,
                shiYanCanShu: JSON.stringify(this.form.shiYanCanShu),
                shiYanShuJu: JSON.stringify(this.form.shiYanShuJu),
                xingNengZhiBia: this.pageData.target,
                fangAnLeiXing: this.pageData.method,
                id: this.pageData.id
            }
            // 提交数据
            saveExperimental(submitData).then(res => {
                console.log(res)
                if (key === 'save') {
                    this.form.id = res.data
                    this.$message.success('保存成功')
                } else {
                    this.$message.success('提交成功')
                    this.closeDialog()
                }
            })
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('update:visible', false)
        },
        handleUpdateParams (value) {
            this.form.shiYanCanShu = value
        },
        handleUpdateData (value) {
            this.form.shiYanShuJu = value
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
                baoLiuXiaoShu: 2,
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
                    repeatNum: 10,
                    days: 5,
                    isConvert: true,
                    model: ['总不精密度'],
                    range: '无',
                    standard: '允许总误差Tea',
                    remark: '',
                    tea: 10,
                    batchCVS: 0.25,
                    batchCVSValue: 2.50,
                    dailyCVS: 0.33,
                    dailyCVSValue: 3.33
                },
                shiYanShuJu: null,
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
                    // min-height: 100%;
                    height: 100%;
                    overflow-y: auto;
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
                                color: #606266;
                                font-size: 14px;
                                line-height: 1.5;
                                text-indent: 2em;
                            }
                            .el-form-item {
                                margin-bottom: 0 !important;
                                .el-form-item__label {
                                    font-size: 14px !important;
                                    color: #606266;
                                }
                                .el-form-item__content {
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
                                font-size: 14px;
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
