<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        width="40%"
        class="dialog monthly-stat-dialog"
        top="15vh"
        @close="closeDialog"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="paramForm"
            class="dialog-form"
            @submit.native.prevent
        >
            <template v-for="(field, index) in fields">
                <el-form-item :key="index" :label="field.label" :prop="field.key">
                    <el-select
                        v-if="field.type === 'select'"
                        v-model="paramForm[field.key]"
                        filterable
                        clearable
                        :required="field.required"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in field.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-date-picker
                        v-else-if="field.type === 'date'"
                        v-model="paramForm[field.key]"
                        :type="field.dateType"
                        clearable
                        align="right"
                        class="date-picker"
                        :value-format="field.format"
                        placeholder="请选择"
                    />
                    <template v-else-if="field.type === 'dialog'">
                        <ibps-custom-dialog
                            v-model="paramForm[field.key]"
                            size="small"
                            :template-key="field.templateKey"
                            :store="field.store || 'id'"
                            :multiple="false"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择"
                        />
                    </template>
                    <template v-else-if="field.type === 'linkData'">
                        <ibps-link-data
                            v-model="paramForm[field.key]"
                            size="small"
                            :template-key="field.templateKey"
                            :multiple="false"
                            :value-key="field.valueKey"
                            :label-type="field.labelType || 'first'"
                            :label-key="field.labelKey"
                        />
                    </template>
                    <el-input
                        v-else
                        v-model="paramForm[field.key]"
                        type="text"
                        clearable
                        show-word-limit
                        :maxlength="64"
                        placeholder="请输入"
                    />
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>

<script>
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
        IbpsLinkData: () => import('@/business/platform/data/templaterender/link-data')
    },
    props: {
        fields: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            formLabelWidth: '100px',
            paramForm: {},
            dialogVisible: this.visible,
            maxHeight: '400px',
            title: '月报表参数选择',
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '确定', type: 'primary' },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ]
        }
    },
    watch: {
        visible: {
            handler (val) {
                this.dialogVisible = val
            },
            immediate: true
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        addConfig (index) {
            if (!index || !this.configData.length) {
                this.configData.push({ name: '' })
            } else {
                this.configData.splice(index + 1, 0, { name: '' })
            }
        },
        handleSave () {
            const paramValues = Object.values(this.paramForm)
            if (paramValues.length !== this.fields.length || paramValues.some(i => !i)) {
                return this.$message.warning('请完整填写查询参数！')
            }
            this.$emit('confirm', this.paramForm)
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .monthly-stat-dialog {
        .dialog-form {
            padding: 20px;
            ::v-deep {
                .el-input {
                    width: calc(100% - 100px);
                }
            }
        }
        .toolbar {
            text-align: right;
        }
    }
</style>
