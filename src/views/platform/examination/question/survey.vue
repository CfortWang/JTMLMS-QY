<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog question-dialog"
        top="6vh"
        @close="closeDialog"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="form"
            :rules="rules"
            class="question-form"
            :class="readonly ? 'readonly-form' : ''"
            @submit.native.prevent
        >
            <div class="inline-item" style="margin-bottom:16px">
                <el-form-item label="题型：" prop="ti_xing_">
                    <el-select
                        v-model="form.ti_xing_"
                        filterable
                        width="100%"
                        placeholder="请选择题型"
                        :disabled="readonly"
                    >
                        <el-option
                            v-for="item in surveyQuestionType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="题干：" prop="ti_gan_">
                <el-input
                    v-model="form.ti_gan_"
                    type="textarea"
                    :maxlength="512"
                    :rows="2"
                    :autosize="readonly"
                    :disabled="readonly"
                    placeholder="请输入题干内容"
                />
            </el-form-item>

            <template v-if="['单选题', '多选题'].includes(form.ti_xing_)">
                <el-form-item
                    v-for="(item, index) in optionList"
                    :key="`${item.value}${index}`"
                    class="option-item"
                >
                    <template slot="label">
                        <div class="custom-label">{{ `选项${item.value}：` }}</div>
                    </template>
                    <el-input
                        v-model="item.content"
                        type="textarea"
                        :rows="1"
                        :autosize="readonly"
                        :disabled="readonly"
                        placeholder="请输入选项内容，最多可配置8个选项"
                    />
                    <div class="operate-btn">
                        <el-button
                            v-if="index === 0 && optionList.length < 8"
                            type="primary"
                            :tabindex="-1"
                            icon="el-icon-plus"
                            circle
                            @click="addOption"
                        />
                        <el-button
                            v-else-if="index === optionList.length - 1"
                            type="danger"
                            :tabindex="-1"
                            icon="el-icon-delete"
                            circle
                            @click="subOption"
                        />
                    </div>
                </el-form-item>
            </template>
            <el-form-item label="是否必填：" prop="shi_fou_bi_tian_">
                <el-radio-group v-model="form.shi_fou_bi_tian_" :disabled="readonly">
                    <el-radio-button label="是">是</el-radio-button>
                    <el-radio-button label="否">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：" prop="bei_zhu_">
                <el-input
                    v-model="form.bei_zhu_"
                    type="textarea"
                    :rows="2"
                    :autosize="readonly"
                    :disabled="readonly"
                    placeholder="请输入题目备注信息"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
import { surveyQuestionType, surveyDefaultOptions } from '../constants'
export default {
    components: {
        IbpsImage: () => import('@/business/platform/file/image')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        // 题目数据
        quesData: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList = [], deptList = [], userId, level = {}, position } = this.$store.getters || {}
        const defaultType = surveyQuestionType.length ? surveyQuestionType[0].value : ''
        return {
            userId,
            userList,
            surveyQuestionType,
            deptList: deptList.filter(i => i.depth === 4),
            title: '',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            form: {
                bian_zhi_bu_men_: position && position.split(',').at(-1),
                bian_zhi_ren_: userId,
                bian_zhi_shi_jian: this.$common.getDateNow(19),
                di_dian_: level.second || level.first,
                ti_gan_: '',
                ti_xing_: defaultType,
                bei_zhu_: '',
                xuan_xiang_: '',
                pai_xu_: 0,
                shi_fou_bi_tian_: '是'
            },
            questionTags: [],
            toolbars: [
                {
                    key: 'submit',
                    icon: 'ibps-icon-save',
                    label: '保存',
                    hidden: () => {
                        return this.readonly
                    }
                },
                {
                    key: 'submitAndContinue',
                    icon: 'ibps-icon-send',
                    label: '保存并继续',
                    type: 'warning',
                    hidden: () => {
                        return this.readonly || this.isEdit
                    }
                },
                {
                    key: 'reset',
                    icon: 'ibps-icon-refresh',
                    label: '重置',
                    type: 'info',
                    hidden: () => {
                        return this.readonly || this.isEdit
                    }
                },
                { key: 'cancel', label: '关闭' }
            ],
            rules: {
                ti_gan_: [{ required: true, message: this.$t('validate.required') }],
                ti_xing_: [{ required: true, message: this.$t('validate.required') }]
            },
            optionList: JSON.parse(JSON.stringify(surveyDefaultOptions))
        }
    },
    computed: {
        isEdit () {
            return this.quesData.$index >= 0
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
    mounted () {
        this.getData()
    },
    methods: {
        addOption () {
            this.optionList.push({
                value: String.fromCharCode(this.optionList[0].value.charCodeAt(0) + this.optionList.length),
                radio: null,
                checkbox: [],
                content: ''
            })
        },
        subOption () {
            this.optionList.pop()
        },
        changeQuestionType () {
            this.optionList = JSON.parse(JSON.stringify(surveyDefaultOptions))
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'submit':
                    this.handleSubmit(key)
                    break
                case 'submitAndContinue':
                    this.handleSubmit(key)
                    break
                case 'reset':
                    this.resetForm()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        // 获取题库数据
        getData () {
            this.title = this.readonly ? '题目详情' : this.isEdit ? '编辑题目' : '添加题目'
            if (this.isEdit) {
                Object.assign(this.form, this.quesData.row)
                if (this.form.ti_xing_ === '单选题' || this.form.ti_xing_ === '多选题') {
                    const options = this.form.xuan_xiang_ ? JSON.parse(this.form.xuan_xiang_) : {}
                    this.optionList = []
                    Object.keys(options).forEach(key => {
                        this.optionList.push({
                            value: key,
                            content: options[key]
                        })
                    })
                }
            }
        },
        handleSubmit (action) {
            this.$refs.form.validate(async (valid) => {
                if (!valid) {
                    return ActionUtils.saveErrorMessage()
                }
                // 验证选项、答案内容（未被表单校验）
                const { ti_xing_: questionType } = this.form
                if (['单选题', '多选题'].includes(questionType)) {
                    const emptyIndex = this.optionList.findIndex(item => !item.content)
                    if (emptyIndex !== -1) {
                        const tip2 = `选项${(String.fromCharCode('A'.charCodeAt(0) + emptyIndex))}内容为空，请填写后再保存！`
                        return ActionUtils.saveErrorMessage(tip2)
                    }
                }
                this.getSubmitData()
                this.submitForm(action)
            })
        },
        getSubmitData () {
            const options = {}
            this.optionList.forEach(item => {
                options[item.value] = item.content
            })
            switch (this.form.ti_xing_) {
                case '单选题':
                    this.form.xuan_xiang_ = JSON.stringify(options)
                    break
                case '多选题':
                    this.form.xuan_xiang_ = JSON.stringify(options)
                    break
                case '问答题':
                    this.form.xuan_xiang_ = ''
                    break
                default:
                    break
            }
        },
        submitForm (action) {
            if (action === 'submit') {
                this.closeDialog(false, { ...this.quesData, row: this.form })
            } else {
                this.closeDialog(true, { ...this.quesData, row: this.form })
                this.resetForm()
            }
        },
        resetForm () {
            this.$refs.form.resetFields()
            this.changeQuestionType()
        },
        // 关闭当前窗口
        closeDialog (visible = false, data) {
            this.$emit('close', visible, data)
        }
    }
}
</script>
<style lang="scss" scoped>
    .question-dialog {
        ::v-deep {
            .el-rate{
                padding: 6px 0 0 0;
            }
            .el-dialog {
                min-width: 1080px;
            }
            .el-dialog__body {
                height: calc(88vh - 200px);
            }
            .el-form-item {
                margin-bottom: 14px !important;
                &:last-child {
                    margin-bottom: 0 !important;
                }
                .el-form-item__label {
                    font-size: 14px !important;
                }
            }
            .el-form-item--small .el-form-item__error {
                padding-top: 6px;
            }
            .el-radio-button__orig-radio {
                &:disabled + .el-radio-button__inner {
                    color: #606266;
                }
                &:disabled:checked + .el-radio-button__inner {
                    color: #fff;
                    background-color: #409EFF;
                }
            }
        }
        .readonly-form {
            ::v-deep {
                .el-radio, .el-checkbox, .el-radio-button, .el-input, .el-select, .el-textarea, .el-input-number, .el-button, .el-upload {
                    pointer-events: none;
                }
            }
        }
        .qustion-tag {
            margin-right: 10px;
            height: 32px;
            line-height: 30px;
            ::v-deep {
                .el-icon-close {
                    top: 0px;
                }
            }
        }
        .button-new-tag {
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 100px;
            vertical-align: bottom;
        }
        .question-form {
            padding: 20px;
        }
        .ibps-image {
            font-size: 0;
            ::v-deep {
                .el-upload--picture-card {
                    font-size: 24px;
                }
            }
        }
        .inline-item {
            display: flex;
            .el-form-item {
                flex: 1;
                .el-select {
                    width: 100%;
                }
            }
        }
        .mb-20 {
            margin-bottom: 20px;
        }
        .option-item {
            ::v-deep {
                .el-form-item__content {
                    display: flex;
                    .el-input {
                        flex: 1;
                    }
                    .el-radio-group, .el-checkbox-group {
                        width: 100px;
                        margin-left: 10px;
                        line-height: 28px;
                        .el-radio {
                            line-height: 28px;
                        }
                    }
                    .operate-btn {
                        width: 32px;
                        min-width: 32px;
                        margin-left: 10px;
                        line-height: 30px;
                    }
                }
            }
            .custom-label {
                &::before {
                    content: '*';
                    color: #F56C6C;
                    margin-right: 4px;
                }
            }
        }
    }
</style>
