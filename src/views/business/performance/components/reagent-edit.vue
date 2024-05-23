<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        width="60%"
        class="dialog reagent-dialog"
        top="5vh"
        @close="closeDialog"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="reagentForm"
            :rules="rules"
            class="reagent-form"
            @submit.native.prevent
        >
            <el-form-item label="类别" prop="leiBie">
                <el-select
                    v-model="reagentForm.leiBie"
                    filterable
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in reagentType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="试剂名称" prop="shiJiMingCheng">
                <el-input
                    v-model="reagentForm.shiJiMingCheng"
                    type="text"
                    clearable
                    show-word-limit
                    :maxlength="64"
                    :disabled="readonly"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="批号" prop="piHao">
                <el-input
                    v-model="reagentForm.piHao"
                    type="text"
                    clearable
                    show-word-limit
                    :maxlength="64"
                    :disabled="readonly"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="厂家" prop="changJia">
                <el-input
                    v-model="reagentForm.changJia"
                    type="text"
                    clearable
                    show-word-limit
                    :maxlength="64"
                    :disabled="readonly"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="有效期" prop="youXiaoQi">
                <el-date-picker
                    v-model="reagentForm.youXiaoQi"
                    type="date"
                    clearable
                    align="right"
                    class="date-picker"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
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
import { reagentFormRules, reagentType } from '../constants/index'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        pageData: {
            type: Object,
            default: () => {}
        },
        dataIndex: {
            type: Number,
            default: null
        }
    },
    data () {
        const isCreate = this.$utils.isEmpty(this.pageData)
        return {
            isCreate,
            reagentType,
            dialogVisible: this.show,
            title: isCreate ? '新增试剂' : '编辑试剂',
            formLabelWidth: '100px',
            reagentForm: !isCreate ? JSON.parse(JSON.stringify(this.pageData)) : {},
            rules: reagentFormRules,
            pickerOptions: {
                disabledDate (time) {
                    // 禁用当前日期之前的日期
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', hidden: () => { return this.readonly } },
                { key: 'continue', icon: 'ibps-icon-send', label: '保存并继续', type: 'success', hidden: () => { return this.readonly || !this.isCreate } },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    watch: {
        show: {
            handler (val, oldVal) {
                this.dialogVisible = val
            },
            immediate: true
        }
    },
    mounted () {

    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave(key)
                    break
                case 'continue':
                    this.handleSave(key)
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleSave (key) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return
                }
                this.submitForm(this.reagentForm, key)
            })
        },
        submitForm (data, key) {
            this.$emit('callback', { data, index: this.dataIndex })
            if (key === 'save') {
                return this.closeDialog()
            }
            // this.$refs.form.resetFields()
            this.reagentForm = {}
        },
        closeDialog () {
            this.$emit('update:show', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .reagent-dialog {
        .reagent-form {
            padding: 20px;
            ::v-deep {
                .el-form-item {
                    margin-bottom: 16px !important;
                    &:last-child {
                        margin-bottom: 0 !important;
                    }
                    .el-form-item__error {
                        padding-top: 8px !important;
                    }
                }
            }
        }
    }
</style>
