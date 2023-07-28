<template>
    <el-form-item
        v-if="!hidden"
        :prop="prop"
        :rules="rules"
        :label="mode === 'block'?label:null"
        :label-width="mode === 'block'?fieldLabelWidth:'0px'"
        :class="{'dynamic-form-table-item__readonly':readonly}"
    >
        <!--子表嵌套-->
        <ibps-dynamic-form-table
            v-if="field.field_type==='table'"
            :value.sync="dataModel"
            :field="field"
            :row="row"
            :rights="fieldRights"
            :readonly="readonly"
            :params="params"
            v-on="listeners"
        />
        <ibps-dynamic-form-field
            v-else
            :value.sync="dataModel"
            :field="field"
            :form-data="formData"
            :row="row"
            :code="code"
            :main-code="mainCode"
            :readonly="readonly"
            :params="params"
            :is-table="true"
            v-on="listeners"
        />
        <div
            v-if="field && field.desc && descPosition==='inline'"
            class="ibps-help-block"
            v-html="$utils.formatText(field.desc )"
        />
    </el-form-item>
</template>
<script>
import FormUtil from '@/business/platform/form/utils/formUtil'
import FormOptions from '../../constants/formOptions'

export default {
    props: {
        models: [Object, Array], // 字段数据
        rights: [String, Object], // 字段权限
        formData: [Array, Object], // 表单数据（包含子表）
        defaultValue: Object, // 默认值
        field: Object, // 字段
        mainCode: String, // 主表名
        code: String, // 表名
        row: [String, Number], // 子表行数
        currPage: [String, Number], // 页数量，
        mode: { // 子表模式
            type: String,
            default: 'inner'
        },
        params: Object // 参数
    },
    data () {
        let defaultVal = ''
        if (this.field.field_type === 'table') {
            // 一对多，是数组，一对一是对象
            defaultVal = []
        } else {
            defaultVal = ''
        }
        return {
            dataModel: this.models[this.field.name] || defaultVal,
            fieldRights: this.rights[this.field.name] || 'e'
        }
    },
    computed: {
        prop () {
            return this.code + '.' + this.row + '.' + this.field.name
        },
        label () { // 显示的文本
            return this.$utils.isNotEmpty(this.field.field_options.units) ? this.field.label + '(' + this.field.field_options.units + ')' : this.field.label
        },
        fieldLabelWidth () { // 字段宽度
            if (this.field.field_type === 'table') { return '0' }
            return this.field.field_options.is_label_width ? this.field.field_options.label_width + (this.field.field_options.label_width_unit || 'px') : this.labelWidth
        },
        hidden () { // 是否隐藏
            return this.fieldRights === FormOptions.t.PERMISSIONS.HIDE || this.field.field_type === 'hidden'
        },
        readonly () { // 是否只读
            // 弹窗就是只读模式
            return this.mode === 'dialog' ? true : this.readonlyRights ? true : this.fieldRights === FormOptions.t.PERMISSIONS.READ
        },
        required () { // 必填  【只读隐藏，都设置非必填】
            return (this.readonly || this.hidden) ? false : (this.fieldRights === FormOptions.t.PERMISSIONS.REQUIRED ? true : this.field.field_options.required || false)
        },
        rules () {
            if (this.readonly || this.hidden) { return [] }
            return FormUtil.buildFormRules(this.field, this.required, this.formData)
        },
        descPosition () {
            return this.params.descPosition || 'inline'
        },
        labelWidth () {
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
        listeners () {
            return {
                ...this.$listeners,
                change: (data) => {
                    // 值改变进行数据联动
                    this.runLinkage()
                    this.emitEvent('change', data)
                }, // 在 Input 值改变时触发
                focus: (event) => { this.emitEvent('focus', event) }, // 在 Input 获得焦点时触发
                blur: (event) => { this.emitEvent('blur', event) }, // 在 Input 失去焦点时触发
                // click: (event) => { this.emitEvent('click', event) } // 在 Input 点击时触发
                'change-data': this.handleModels // 数据改变
            }
        }
    },
    watch: {
        dataModel: {
            handler (val, out) {
                if (FormOptions.t.NON_MODEL_FIELD_TYPES.includes(this.field.field_type)) {
                    return
                }
                /* 如果是选择器或值来源类型， 需从监控方法进行更新数据*/
                if (this.field.field_type === 'selector' || this.field.field_type === 'select' || this.field.field_type === 'customDialog' || this.field.field_type === 'linkdata') {
                    this.handleModels(this.field.name, val)
                }
                this.$nextTick(() => {
                    // 值改变进行公式计算
                    this.runCalFormula()
                })
            },
            deep: true,
            immediate: true
        },
        models: {
            handler (val, oldVal) {
                this.dataModel = val[this.field.name]
            },
            deep: true
        },
        fieldRights: {
            handler (val) {
                this.rights[this.field.name] = val
                this.$emit('update:rights', {
                    ...this.rights,
                    [this.field.name]: val
                })
            },
            deep: true,
            immediate: true
        },
        rights: {
            handler (val, oldVal) {
                this.fieldRights = val[this.field.name]
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        handleModels (name, val) {
            this.models[name] = val
            if (this.currPage) {
                this.$emit('updateModel', name, val, this.row, this.currPage)
            } else {
                this.$emit('update:models', {
                    ...this.models,
                    [name]: val
                })
            }
        },
        setFieldData (name, val) {
            this.$emit('update-form-data', name, val)
        },
        /**
         * 进行公式计算
         */
        runCalFormula () {
            if (!this.formula) return
            const { field, code, mainCode, row } = this
            const key = code + '.' + field.name
            const formulas = this.formula ? this.formula[key] : null
            if (formulas) {
                FormUtil.runSubCalFormula(this, formulas, code, mainCode, row)
            }
        },
        /**
         * 进行联动数据
         */
        runLinkage () {
            if (!this.linkages) return
            const { field, code, row } = this
            if (field.isSub) { // 子表
                const key = code + '.' + field.name
                const linkages = this.linkages ? this.linkages[key] : null
                if (linkages) {
                    FormUtil.runLinkage(linkages, this.models, field, row)
                }
            } else {
                field.code = code
                const key = field.code + '.' + field.name
                const linkages = this.linkages ? this.linkages[key] : null
                if (linkages) {
                    FormUtil.runLinkage(linkages, this.models, field)
                }
            }
        },
        emitEvent (event, data) {
            // 如果是输入值， 需从当前方法进行更新数据
            if (event === 'change' && this.currPage) {
                this.$emit('updateModel', this.field.name, data, this.row, this.currPage)
            }
            this.$emit(event, ...Array.from(arguments).slice(1))
        }
    }
}
</script>
