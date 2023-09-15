<template>
    <div v-if="!hidden">
        <!-- 只读类型-->
        <ibps-dynamic-form-other
            v-if="isOtherFieldType"
            :models="models"
            :field="field"
            :params="params"
        />
        <template v-else>
            <el-form-item
                v-if="fieldType!=='approval_opinion' || ( fieldType==='approval_opinion' && (formOpinionData[fieldName] && formOpinionData[fieldName].length>0 || !readonly))"
                ref="formItem"
                :prop="prop"
                :rules="rules"
                :label="fieldType==='table'?null:label"
                :label-width="labelWidth"
                :class="field.field_options.custom_class"
            >
                <template v-if="fieldType!=='table'" slot="label">{{ label + labelSuffix }}
                    <ibps-help v-if="field && field.desc && descPosition==='lableIcon'" type="tooltip" :content="$utils.formatText(field.desc)" />
                </template>
                <!-- 表单意见-->
                <ibps-dynamic-form-opinion
                    v-if="fieldType==='approval_opinion'"
                    ref="formField"
                    :value.sync="dataModel"
                    :field="field"
                    :readonly="readonly"
                    :readonly-style="readonlyStyle"
                    :opinion-data="formOpinionData[fieldName]"
                    :params="params"
                    v-on="listeners"
                />
                <!--子表-->
                <ibps-dynamic-form-table
                    v-else-if="fieldType==='table'"
                    ref="formField"
                    :value.sync="dataModel"
                    :form-data="$utils.isNotEmpty(row)?formData:models"
                    :main-code="code"
                    :field="field"
                    :rights="fieldRights"
                    :readonly="readonly"
                    :params="params"
                    v-on="listeners"
                />
                <!--字段-->
                <ibps-dynamic-form-field
                    v-else
                    ref="formField"
                    :value.sync="dataModel"
                    :field="field"
                    :form-data="models"
                    :readonly="readonly"
                    :readonly-style="readonlyStyle"
                    :row="row"
                    :code="code"
                    :params="params"
                    v-on="listeners"
                />
                <!-- ######描述属性###### -->
                <div
                    v-if="field && field.desc && descPosition==='inline'"
                    class="ibps-help-block"
                    v-html="$utils.formatText(field.desc )"
                />
            </el-form-item>
        </template>
    </div>
</template>
<script>
import FormUtil from '@/business/platform/form/utils/formUtil'
import FormOptions from '../../constants/formOptions'
import { otherFieldTypes } from '@/business/platform/form/constants/fieldTypes'

export default {
    props: {
        models: [Object, Array], // 当前字段数据
        rights: [String, Object], // 字段权限
        formData: [Array, Object], // 表单数据（包含子表）
        field: Object, // 字段
        code: String, // 表名
        mainCode: String, // 主表名
        row: [String, Number], // 子表行数
        params: Object // 参数
    },
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    data () {
        let defaultVal = ''
        if (this.field.field_type === 'table') {
            // 一对多，是数组，一对一是对象
            defaultVal = this.field.field_options.relation === 'one2one' ? {} : []
        } else {
            defaultVal = ''
        }

        return {
            dataModel: this.models[this.field.name] || defaultVal,
            fieldRights: this.rights[this.field.name] || 'e'
        }
    },
    computed: {
        fieldName () {
            return this.field.name
        },
        prop () {
            if (this.$utils.isNotEmpty(this.row)) {
                return this.code + '.' + this.row + '.' + this.fieldName
            }
            return this.fieldName
        },
        label () { // 显示的文本
            if (this.fieldType === 'table' || this.field.field_options.hide_label) return ''
            return this.$utils.isNotEmpty(this.field.field_options.units) ? this.field.label + '(' + this.field.field_options.units + ')' : this.field.label
        },
        labelSuffix () {
            return this.params.labelSuffix
        },
        labelWidth () { // 字段宽度
            if (this.fieldType === 'table' || this.field.field_options.hide_label) { return '0' }
            return this.field.field_options.is_label_width ? this.field.field_options.label_width + (this.field.field_options.label_width_unit || 'px') : this.defaultLabelWidth
        },

        fieldType () {
            return this.field.field_type
        },
        subTableRights () { // 子表权限
            if (this.fieldType === 'table' && this.$utils.isNotEmpty(this.fieldRights) && this.$utils.isPlainObject(this.fieldRights)) {
                return this.fieldRights['rights']
            }
            return false
        },
        hidden () { // 是否隐藏
            if (this.subTableRights) {
                return this.subTableRights === FormOptions.t.PERMISSIONS.HIDE
            }
            return this.fieldRights === FormOptions.t.PERMISSIONS.HIDE || this.fieldType === 'hidden' || (this.fieldType === 'approval_opinion' && (this.$utils.isNotEmpty(this.defId) || this.hiddenApprovalOpinion))
        },
        readonly () { // 是否只读
            if (this.subTableRights) {
                return this.subTableRights === FormOptions.t.PERMISSIONS.READ
            }
            return this.readonlyRights ? true : this.fieldRights === FormOptions.t.PERMISSIONS.READ
        },
        required () { // 必填  【只读隐藏，都设置非必填】
            if (this.readonly || this.hidden) {
                return false
            }
            if (this.subTableRights) {
                return this.subTableRights === FormOptions.t.PERMISSIONS.REQUIRED
            }
            return this.fieldRights === FormOptions.t.PERMISSIONS.REQUIRED ? true : this.field.field_options.required || false
        },
        isOtherFieldType () {
            return otherFieldTypes.includes(this.fieldType)
        },
        rules () { // 表单字段规则
            if (this.readonly || this.hidden) { return [] }
            return FormUtil.buildFormRules(this.field, this.required, this.models)
        },
        descPosition () {
            return this.params.descPosition || 'inline'
        },
        defaultLabelWidth () {
            return this.params.labelWidth
        },
        readonlyRights () {
            return this.params.readonly
        },
        readonlyStyle () {
            return this.params.readonlyStyle
        },
        formula () {
            return this.params.responseFormula
        },
        linkages () {
            return this.params.responseLinkages
        },
        formOpinionData () {
            return this.params.responseFormOpinionData || {}
        },
        listeners () {
            return {
                ...this.$listeners,
                change: (data) => { // 在 Input 值改变时触发
                    // 值改变进行数据联动
                    this.runLinkage()
                    this.emitEvent('change', data)
                },
                focus: (event) => { this.emitEvent('focus', event) }, // 在 Input 获得焦点时触发
                blur: (event) => { this.emitEvent('blur', event) }, // 在 Input 失去焦点时触发
                // click: (event) => { this.emitEvent('click', event) } // 在 Input 点击时触发
                'change-data': this.handleModels // 数据改变
            }
        }
    },
    watch: {
        dataModel: {
            handler (val) {
                if (FormOptions.t.NON_MODEL_FIELD_TYPES.includes(this.fieldType)) {
                    return
                }
                this.handleModels(this.fieldName, val)
                this.$nextTick(() => {
                    // 值改变进行公式计算
                    this.runCalFormula()
                })
            },
            // deep: false,
            immediate: true
        },
        models: {
            handler (val, oldVal) {
                this.dataModel = val[this.fieldName]
            },
            deep: true
        },
        fieldRights: {
            handler (val) {
                this.handleFieldRights(this.fieldName, val)
            },
            deep: true,
            immediate: true
        },
        rights: {
            handler (val, oldVal) {
                this.fieldRights = val[this.fieldName]
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleModels (name, val) {
            if (this.$utils.isEmpty(name)) {
                return
            }
            this.models[name] = val
            this.$emit('update:models', {
                ...this.models,
                [name]: val
            })
        },
        handleFieldRights (name, val) {
            if (this.$utils.isEmpty(name)) {
                return
            }
            this.rights[name] = val
            this.$emit('update:rights', {
                ...this.rights,
                [name]: val
            })
        },
        setFieldData (name, val) {
            setTimeout(() => {
                this.$emit('update-form-data', name, val)
            }, 10)
        },
        /**
         * 进行公式计算
         */
        runCalFormula () {
            if (!this.formula) return
            const { field, code, mainCode, row } = this
            if (field.field_type === 'table') {
                const columns = field.field_options.columns || []
                for (let i = 0; i < columns.length; i++) {
                    const column = columns[i]
                    this.calFormula(field.name, column.name, mainCode, row)
                }
            } else {
                this.calFormula(code, field.name, mainCode, row)
            }
        },
        calFormula (code, name, mainCode, row) {
            const key = code + '.' + name
            const formulas = this.formula[key]
            if (formulas) {
                if (mainCode) {
                    FormUtil.runSubCalFormula(this, formulas, code, mainCode, row)
                } else {
                    FormUtil.runMainCalFormula(this, formulas, code)
                }
            }
        },
        /**
         * 进行联动数据
         */
        runLinkage () {
            if (!this.linkages) return
            const { field, code } = this
            if (field.isSub) { // 子表
                const key = code + '.' + field.name
                const linkages = this.linkages ? this.linkages[key] : null
                if (linkages) {
                    FormUtil.runLinkage(this, linkages, field, field.row)
                }
            } else {
                field.code = code
                const key = field.code + '.' + field.name
                const linkages = this.linkages ? this.linkages[key] : null
                if (linkages) {
                    FormUtil.runLinkage(this, linkages, field)
                }
            }
        },
        emitEvent (event) {
            this.$emit(event, ...Array.from(arguments).slice(1))
        }
    }
}
</script>
