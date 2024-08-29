<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        width="60%"
        class="dialog classes-dialog"
        top="5vh"
        @close="closeDialog"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="formData"
            :rules="rules"
            label-position="left"
            class="classes-form"
            @submit.native.prevent
        >
            <el-form-item label="班次名称" prop="name">
                <el-input
                    v-model="formData.name"
                    type="text"
                    clearable
                    show-word-limit
                    :maxlength="16"
                    :disabled="readonly"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="班次别名" prop="alias">
                <el-input
                    v-model="formData.alias"
                    type="text"
                    clearable
                    show-word-limit
                    :maxlength="5"
                    :disabled="readonly"
                    placeholder="请输入"
                />
            </el-form-item>
            <el-form-item label="对应岗位" prop="positions">
                <el-select
                    v-model="formData.positions"
                    filterable
                    multiple
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in positionList"
                        :key="item.positionId"
                        :label="item.positionName"
                        :value="item.positionName"
                    />
                </el-select>
            </el-form-item>
            <el-row :gutter="20" class="form-row">
                <el-col :span="12">
                    <el-form-item
                        label="颜色"
                        prop="color"
                        required
                        :show-message="false"
                    >
                        <el-color-picker
                            v-model="formData.color"
                            :predefine="predefine"
                            size="mini"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否可用" prop="isEnabled" :show-message="false">
                        <el-switch v-model="formData.isEnabled" active-value="Y" inactive-value="N" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item
                v-for="(item, index) in formData.dateRange"
                :key="`${index}`"
                class="date-range"
                required
                :show-message="false"
            >
                <template slot="label">
                    <div class="custom-label">{{ `班次时间${index + 1}` }}</div>
                </template>
                <el-radio-group v-model="item.type" class="date-type">
                    <el-radio-button label="range">时间段</el-radio-button>
                    <el-radio-button label="allday" :disabled="formData.dateRange.length !== 1">全天</el-radio-button>
                </el-radio-group>
                <div v-if="item.type === 'range'" class="range-item">
                    <div class="start">
                        <el-time-select
                            v-model="item.startTime"
                            align="right"
                            class="date-picker"
                            :picker-options="item.pickerOptions"
                            placeholder="开始时间"
                        />
                    </div>
                    <div class="concat">至</div>
                    <div class="end">
                        <el-switch
                            v-model="item.isSecondDay"
                            active-value="Y"
                            inactive-value="N"
                            active-text="第二天"
                            inactive-text="当天"
                        />
                        <el-time-select
                            v-model="item.endTime"
                            align="right"
                            class="date-picker"
                            :picker-options="item.pickerOptions"
                            placeholder="结束时间"
                        />
                    </div>
                </div>
                <div v-if="!readonly" class="operate-btn">
                    <el-button
                        v-if="index === 0 && formData.dateRange.length < 5 && item.type === 'range'"
                        type="primary"
                        :tabindex="-1"
                        icon="el-icon-plus"
                        circle
                        @click="addOption"
                    />
                    <el-button
                        v-else-if="index === formData.dateRange.length - 1 && formData.dateRange.length > 1"
                        type="danger"
                        :tabindex="-1"
                        icon="el-icon-delete"
                        circle
                        @click="subOption"
                    />
                </div>
            </el-form-item>
            <el-form-item label="说明" prop="desc">
                <el-input
                    v-model="formData.desc"
                    type="textarea"
                    clearable
                    show-word-limit
                    :maxlength="256"
                    :disabled="readonly"
                    placeholder="请输入"
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
import setting from '@/setting.js'
import { validateId } from 'bpmn-js-properties-panel/lib/Utils'
export default {
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
            default: () => {}
        },
        positionList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        const isCreate = this.$utils.isEmpty(this.pageData)
        const dateRangeList = [{
            type: 'range',
            startTime: '',
            endTime: '',
            isSecondDay: 'N',
            pickerOptions: {
                start: '06:30',
                step: '00:30',
                end: '23:30'
                // disabledDate (time) {
                //     // 禁用当前日期之前的日期
                //     return time.getTime() < Date.now() - 8.64e7
                // }
            }
        }]
        return {
            dateRangeList,
            reagentType: [],
            dialogVisible: this.visible,
            formLabelWidth: '100px',
            title: isCreate ? '新增班次' : '编辑班次',
            formData: !isCreate ? JSON.parse(JSON.stringify(this.pageData.row)) : {
                isEnabled: 'Y',
                positions: '',
                color: '',
                desc: '',
                dateRange: { ...dateRangeList }
            },
            rules: {
                name: [{ required: true, message: '请输入班次名称', trigger: 'change' }],
                alias: [{ required: true, message: '请输入班次别名', trigger: 'change' }]
            },
            predefine: setting.color.predefine,
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', hidden: () => { return this.readonly } },
                { key: 'continue', icon: 'ibps-icon-send', label: '保存并继续', type: 'success', hidden: () => { return this.readonly || !isCreate } },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = val
            },
            immediate: true
        },
        pageData: {
            handler (val, oldVal) {
                this.isCreate = this.$utils.isEmpty(val)
                this.title = this.isCreate ? '新增班次' : '编辑班次'
                this.toolbars[1] = {
                    ...this.toolbars[1],
                    hidden: () => { return this.readonly || !this.isCreate }
                }
                this.formData = !this.isCreate ? JSON.parse(JSON.stringify(val.row)) : {
                    isEnabled: 'Y',
                    dateRange: JSON.parse(JSON.stringify(this.dateRangeList))
                }
            },
            immediate: true
        }
    },
    methods: {
        addOption () {
            this.formData.dateRange.push({
                type: 'range',
                startTime: '',
                endTime: '',
                isSecondDay: 'N',
                pickerOptions: {
                    start: '06:30',
                    step: '00:30',
                    end: '23:30'
                }
            })
        },
        subOption () {
            this.formData.dateRange.pop()
        },
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
                    return this.$message.warning('请填写所有必填项！')
                }
                const { color, dateRange } = this.formData
                if (!color || dateRange.some(i => i.type === 'range' && !(i.startTime && i.endTime))) {
                    return this.$message.warning('请填写所有必填项！')
                }
                this.submitForm(this.formData, key)
            })
        },
        submitForm (data, key) {
            const submitData = { ...data }
            console.log(submitData)
            this.$emit('callback', { data: submitData, index: this.pageData.index })
            if (key === 'save') {
                return this.closeDialog()
            }
            this.$refs.form.resetFields()
            this.formData = {
                isEnabled: 'Y',
                dateRange: JSON.parse(JSON.stringify(this.dateRangeList))
            }
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .classes-dialog {
        .classes-form {
            padding: 20px;
            ::v-deep {
                .el-form-item {
                    &__label {
                        position: relative;
                        &:before {
                            position: absolute;
                            left: -8px;
                        }
                    }
                    margin-bottom: 16px !important;
                    &:last-child {
                        margin-bottom: 0 !important;
                    }
                    &__error {
                        padding-top: 8px !important;
                    }
                    .el-input {
                        // width: calc(100% - 100px);
                        width: 100%;
                    }
                    .el-select {
                        width: 100%;
                    }
                }
            }
            .date-range {
                ::v-deep {
                    .el-form-item__content {
                        display: flex;
                        .date-type {
                            flex-shrink: 0;
                        }
                        .range-item {
                            flex-shrink: 0;
                            display: flex;
                            align-items: center;
                            margin: 0 20px;
                            .concat {
                                margin: 0 20px;
                            }
                            .end {
                                display: flex;
                                align-items: center;
                                .el-switch {
                                    width: 150px;
                                    flex-shrink: 0;
                                }
                            }
                            .date-picker {
                                max-width: 120px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
