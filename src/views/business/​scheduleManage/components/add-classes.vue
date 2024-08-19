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
            <el-form-item label="颜色" prop="color">
                <el-color-picker
                    v-model="formData.color"
                    :predefine="predefine"
                    size="mini"
                    @change="handleColorChange"
                />
            </el-form-item>
            <el-form-item label="是否可用" prop="isEnabled" :show-message="false">
                <el-switch v-model="formData.isEnabled" active-value="Y" inactive-value="N" />
            </el-form-item>
            <el-form-item
                v-for="(item, index) in dateRangeList"
                :key="`${index}`"
                class="date-range"
            >
                <template slot="label">
                    <div class="custom-label">{{ `班次时间${index + 1}` }}</div>
                </template>
                <el-radio-group v-model="item.type" class="date-type">
                    <el-radio-button label="range">时间段</el-radio-button>
                    <el-radio-button label="allday" :disabled="dateRangeList.length !== 1">全天</el-radio-button>
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
                        v-if="index === 0 && dateRangeList.length < 5 && item.type === 'range'"
                        type="primary"
                        :tabindex="-1"
                        icon="el-icon-plus"
                        circle
                        @click="addOption"
                    />
                    <el-button
                        v-else-if="index === dateRangeList.length - 1 && dateRangeList.length > 1"
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
        return {
            isCreate,
            reagentType: [],
            dialogVisible: this.visible,
            title: isCreate ? '新增班次' : '编辑班次',
            formLabelWidth: '100px',
            formData: !isCreate ? JSON.parse(JSON.stringify(this.pageData.row)) : {},
            rules: {},
            dateRangeList: [{
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
            }],
            predefine: setting.color.predefine,
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', hidden: () => { return this.readonly } },
                { key: 'continue', icon: 'ibps-icon-send', label: '保存并继续', type: 'success', hidden: () => { return this.readonly || !this.isCreate } },
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
        }
    },
    mounted () {

    },
    methods: {
        handleColorChange (v) {
            console.log(v)
        },
        addOption () {
            this.dateRangeList.push({
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
            this.dateRangeList.pop()
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
                    return
                }
                this.submitForm(this.formData, key)
            })
        },
        submitForm (data, key) {
            const submitData = {
                ...data,
                dateRange: JSON.stringify(this.dateRangeList)
            }
            console.log(submitData)
            this.$emit('callback', { data: submitData, index: this.pageData.index })
            if (key === 'save') {
                return this.closeDialog()
            }
            this.$refs.form.resetFields()
            this.formData = {}
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
                    margin-bottom: 16px !important;
                    &:last-child {
                        margin-bottom: 0 !important;
                    }
                    .el-form-item__error {
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
