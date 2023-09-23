<template>
    <div :class="{ 'jbd-form': !isDialog }">
        <div class="jbd-replce"></div>
        <div class="dynamic-form" :class="{ 'jbd-form-cont': !isDialog }">
            <!--表头-->
            <div v-if="hasHeader" class="form-header">
                <div v-if="hasHeader" class="title" style="font-size: 22px; font-family: SimHei" :class="titlePosition">
                    {{ formDef.name }}
                    <span v-if="formDef && formDef.flowName">{{ formDef.flowName }}</span>
                    <relevance-table
                        v-if="titleList.length > 0 && (formParams.formAttrs.customClass && formParams.formAttrs.customClass.includes('true'))"
                        :list="titleList"
                        :form="form"
                        class="relevanceTable"
                    />
                    <Statis-or-record-table
                        v-if="record.length > 0"
                        :list="record"
                        :form="form"
                    />
                </div>
                <div v-if="hasDesc" class="desc" v-html="$utils.formatText(formDef.desc)"></div>
            </div>
            <!--表单-->
            <el-form
                ref="form"
                :model="models"
                :inline="inline"
                :label-suffix="labelSuffix"
                :label-width="labelWidth"
                :label-position="labelPosition"
                :status-icon="statusIcon"
                :size="size"
                :hide-required-asterisk="hideRequiredAsterisk"
                :class="customClass"
                @submit.native.prevent
            >
                <template v-for="(item, index) in formDef.fields">
                    <!--嵌套布局-->
                    <component
                        :is="'ibps-dynamic-form-' + item.field_type"
                        v-if="item.field_type === 'grid' || item.field_type === 'tabs' || item.field_type === 'collapse' || item.field_type === 'steps'"
                        :ref="'formItem' + item.name"
                        :key="index"
                        :models.sync="models"
                        :rights.sync="rights"
                        :form-data="models"
                        :field="item"
                        :code="code"
                        :params="formParams"
                        :cur-active-step.sync="activeStep"
                    />
                    <!--其他类型-->
                    <ibps-dynamic-form-item
                        v-else
                        :ref="'formItem' + item.name"
                        :key="index"
                        :models.sync="models"
                        :rights.sync="rights"
                        :form-data="models"
                        :field="item"
                        :code="code"
                        :params="formParams"
                    />
                </template>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    import { nestedFieldTypes } from '@/business/platform/form/constants/fieldTypes'
    import FormOptions from '../../constants/formOptions'
    import FormUtils from '../../utils/formUtil'
    import relevanceTable from './mixins/relevanceTable'
    import StatisOrRecordTable from './mixins/StatisOrRecordTable'

    import DynamicFormItem from './dynamic-form-item'
    import DynamicFormField from './dynamic-form-field'
    import DynamicFormOther from './dynamic-form-other'
    import DynamicFormOpinion from './components/approval-opinion'
    import DynamicFormGrid from './dynamic-form-grid'
    import DynamicFormTabs from './dynamic-form-tabs'
    import DynamicFormSteps from './dynamic-form-steps'
    import DynamicFormCollapse from './dynamic-form-collapse'
    import DynamicFormTable from './dynamic-form-table'
    import DynamicFormTableItem from './dynamic-form-table-item'
    import DynamicFormTableBlock from './dynamic-form-table-block'
    // import templateList from '@/views/platform/data/dataTemplate/template-list.vue'

    Vue.component('ibps-dynamic-form-item', DynamicFormItem)
    Vue.component('ibps-dynamic-form-field', DynamicFormField)
    Vue.component('ibps-dynamic-form-other', DynamicFormOther)
    Vue.component('ibps-dynamic-form-opinion', DynamicFormOpinion)
    Vue.component('ibps-dynamic-form-grid', DynamicFormGrid)
    Vue.component('ibps-dynamic-form-tabs', DynamicFormTabs)
    Vue.component('ibps-dynamic-form-steps', DynamicFormSteps)
    Vue.component('ibps-dynamic-form-collapse', DynamicFormCollapse)
    Vue.component('ibps-dynamic-form-table', DynamicFormTable)
    Vue.component('ibps-dynamic-form-table-item', DynamicFormTableItem)
    Vue.component('ibps-dynamic-form-table-block', DynamicFormTableBlock)
    // Vue.component('template-list', templateList)

    // Vue.component('ibps-dynamic-form-layout-table', DynamicFormLayoutTable)

    export default {
        components: {
            relevanceTable,
            StatisOrRecordTable
        },
        provide() {
            return {
                dynamicForm: this
            }
        },
        props: {
            isDialog: {
                type: Boolean,
                default: false
            },
            form: {
                type: Object
            },
            dynamicParams: {
                type: Object
            },
            formDef: {
                type: Object,
                required: true
            },
            value: {
                type: Object
            },
            readonly: {
                type: Boolean,
                default: false
            },
            permissions: {
                type: Object
            },
            BpmnForm: {
                type: Boolean,
                default: false
            },
            validateImmediately: {
                // 是否初始验证
                type: Boolean,
                default: true
            },
            initialization: {
                type: Boolean,
                default: false
            },
            // 扩展参数
            params: Object,
            // 当前激活步骤
            curActiveStep: Number
        },
        data() {
            return {
                models: {}, // 表单model对象数据
                rights: {}, // 表单权限
                responseFormula: {}, // 公式
                responseLinkages: {}, // 联动数据
                responseVerifys: [], // 表单提交校验
                responseOpinionFields: {}, // 表单的意见字段
                responseFormOpinionData: {}, // 已填写的表单意见
                responseLabelFields: {}, // 表单的文本字段
                unComplateOpinion: '', // 未提交的审批意见
                invalidFields: {},
                activeStep: 0,
                titleList: [],
                record: []
            }
        },
        computed: {
            formAttrs() {
                return this.formDef ? this.formDef.attrs || {} : {}
            },
            hasHeader() {
                return this.formAttrs && !this.formAttrs.hide_name
            },
            hasDesc() {
                return this.formAttrs && !this.formAttrs.hide_desc && this.formDef.desc
            },
            titlePosition() {
                if (this.formAttrs.title_position === 'center') {
                    return 'ibps-tc'
                } else if (this.formAttrs.title_position === 'right') {
                    return 'ibps-tr'
                } else {
                    return ''
                }
            },
            size() {
                return this.formAttrs.size || (this.$ELEMENT || {}).size
            },
            inline() {
                return this.formAttrs.inline || false
            },
            labelSuffix() {
                return this.formAttrs ? (this.formAttrs.colon ? this.formAttrs.labelSuffix || ':' : '') : ''
            },
            labelWidth() {
                if (this.$utils.isNotEmpty(this.formAttrs.labelWidth) && this.$utils.isNotEmpty(this.formAttrs.labelWidthUnit)) {
                    return this.formAttrs.labelWidth + this.formAttrs.labelWidthUnit
                } else {
                    return '100px'
                }
            },
            labelPosition() {
                return this.$utils.isNotEmpty(this.formAttrs.labelPosition) ? this.formAttrs.labelPosition : 'right'
            },
            descPosition() {
                return this.$utils.isNotEmpty(this.formAttrs.descPosition) ? this.formAttrs.descPosition || 'inline' : 'inline'
            },
            customClass() {
                return this.$utils.isNotEmpty(this.formAttrs.customClass) ? this.formAttrs.customClass : null
            },
            statusIcon() {
                return this.$utils.isNotEmpty(this.formAttrs.statusIcon) ? this.formAttrs.statusIcon : false
            },
            hideRequiredAsterisk() {
                return this.$utils.toBoolean(this.formAttrs.hideRequiredAsterisk, false)
            },
            code() {
                return this.formDef.code
            },
            readonlyRights() {
                return this.readonly
            },
            readonlyStyle() {
                return this.formAttrs && this.formAttrs.read_style ? this.formAttrs.read_style : 'text'
            },
            hasScript() {
                return this.formAttrs ? this.$utils.isNotEmpty(this.formAttrs.script) : false
            },
            formParams() {
                const params = {
                    responseFormula: this.responseFormula,
                    responseLinkages: this.responseLinkages,
                    responseFormOpinionData: this.responseFormOpinionData,
                    unComplateOpinion: this.unComplateOpinion,
                    readonly: this.readonly,
                    readonlyStyle: this.readonlyStyle,
                    labelWidth: this.labelWidth,
                    labelSuffix: this.labelSuffix,
                    descPosition: this.descPosition,
                    formAttrs: this.formAttrs,
                    invalidFields: this.invalidFields
                }
                return Object.assign(params, this.params)
            }
        },
        watch: {
            formDef: {
                handler(val) {
                    this.initResponseFields()
                },
                deep: true,
                immediate: true
            },
            // models: {
            //     handler (val) {
            //         // 延迟验证
            //         this.$nextTick(() => {
            //             this.validate(() => { })
            //         })
            //     },
            //     deep: true
            // },
            // initialization (val) {
            //     if (val && this.hasScript) {
            //         this.$emit('load-script')
            //     }
            // },
            // curActiveStep (val) {
            //     this.activeStep = val
            // },
            // activeStep (val, oldVal) {
            //     if (val !== oldVal) {
            //         this.$emit('update:cur-active-step', val)
            //     }
            // }
        },
        mounted() {
            // 初始化脚本
            // this.$nextTick(() => {
            //     if (this.validateImmediately) {
            //         this.validate(() => {})
            //     }
            // }) 
            this.titleList = []
            this.record = []
        },
        methods: {
            /**
             * 初始化字段
             */
            async initResponseFields() {
                let fields
                if (this.formDef && this.formDef.fields) fields = this.formDef.fields
                if (!fields) {
                    return
                }
                await this.generateModles(fields)
                // 初始化运行公式计算
                await this.initRunCalFormula()
                // 初始化表单意见
                await this.initResponseOpinionData()
            },
            /**
             * 生成modles
             */
            async generateModles(fields) {
                for (let i = 0; i < fields.length; i++) {
                    const field = fields[i]
                    const fieldName = field.name
                    const fieldType = field.field_type
                    const fieldOptions = field.field_options

                    if (nestedFieldTypes.includes(fieldType)) {
                        // 嵌套布局
                        if (this.$utils.isNotEmpty(fieldOptions) && this.$utils.isNotEmpty(fieldOptions.columns)) {
                            // 循环遍历所有字段
                            fieldOptions.columns.forEach(item => {
                                this.generateModles(item.fields)
                            })
                        }
                    } else if (fieldType === 'table') {
                        // 子表单
                        const data = this.value ? this.value[fieldName] : []
                        if (fieldOptions.mode === 'block') {
                            if (this.$utils.isEmpty(data)) {
                                this.$set(this.models, fieldName, [])
                                const defaultValue = await FormUtils.getTableDefaultData(field)
                                this.models[fieldName].push(JSON.parse(JSON.stringify(defaultValue)))
                            } else {
                                this.models[fieldName] = data || []
                            }
                        } else {
                            this.models[fieldName] = data || []
                        }
                        // 初始化表单扩展参数
                        this.initFormFieldParameter(field)
                    } else if (fieldType === 'approval_opinion') {
                        // 审批意见
                        this.models[fieldName] = ''
                        this.responseOpinionFields[fieldName] = field
                        // ====== 初始化表单权限
                        this.initFormApprovalOpinionRights(field)
                    } else {
                        if (fieldType === 'label') {
                            // 文本字段
                            this.responseLabelFields[fieldName] = field
                        }
                        // 不是只读字段
                        if (!FormOptions.t.NON_MODEL_FIELD_TYPES.includes(fieldType)) {
                            // 空值默认
                            const defaultValueEmpty = this.$utils.toBoolean(fieldOptions.default_value_empty, true)
                            if (this.value && Object.keys(this.value).indexOf(fieldName) >= 0) {
                                // 有值
                                const data = this.value[fieldName]
                                if (this.$utils.isEmpty(data)) {
                                    if (defaultValueEmpty) {
                                        const defaultValue = await FormUtils.getFieldDefaultValue(field)
                                        this.models[fieldName] = defaultValue
                                    }
                                } else {
                                    this.models[fieldName] = await this.getInitData(field, data)
                                }
                            } else {
                                // 默认值
                                this.models[fieldName] = await FormUtils.getFieldDefaultValue(field)
                                if (this.dynamicParams && this.dynamicParams[field.field_name]) {
                                    this.models[fieldName] = this.dynamicParams[field.field_name]
                                }
                            }
                        }
                        // 初始化表单扩展参数
                        this.initFormFieldParameter(field)
                    }
                }
            },
            async getInitData(field, data) {
                const fieldType = field.field_type
                const copyFlow = this.$utils.toBoolean(this.formParams ? this.formParams.copyFlow : false, false)
                if (fieldType === 'autoNumber' && copyFlow) {
                    // 复制流程初始化数据
                    return await FormUtils.getFieldDefaultValue(field)
                }
                return data
            },
            /**
             *  初始化表单扩展参数
             */
            initFormFieldParameter(field) {
                // ====== 初始化表单权限
                this.initFormRights(field)
                // ====== 初始化需要进行公式计算的字段
                this.initResponseFormula(field)
                // ======  初始化需要进行联动数据的字段
                this.initResponseLinkages(field)
            },
            initFormApprovalOpinionRights(field) {
                this.rights[field.name] = FormUtils.getDefaultApprovalOpinionRigths(field, this.params) || this.getPermissions(this.permissions, field) || FormUtils.getDefaultRigths(field)
            },
            /**
             *  初始化表单权限
             */
            initFormRights(field) {
                this.rights[field.name] = this.getPermissions(this.permissions, field) || FormUtils.getDefaultRigths(field)
            },
            // 获取权限
            getPermissions(permissions, field) {
                if (this.$utils.isEmpty(permissions)) {
                    return
                }
                const fieldType = field.field_type
                const name = field.name
                let rightsValue = null
                const isNonInputField = FormOptions.t.NON_INPUT_FIELD_TYPES.includes(fieldType)
                let isSpecial = false
                if (isNonInputField && permissions.fields) {
                    // 非输入字段
                    rightsValue = permissions.fields[name] ? permissions.fields[name] : null
                } else if (fieldType === 'approval_opinion' && permissions.opinions) {
                    // 意见 特殊处理
                    rightsValue = permissions.opinions[name] ? permissions.opinions[name] : null
                } else if (fieldType === 'table' && permissions.tables) {
                    // 子表
                    isSpecial = true
                    rightsValue = permissions.tables[name] ? permissions.tables[name] : null
                } else {
                    // 字段
                    rightsValue = permissions.fields[name] ? permissions.fields[name] : null
                }
                if (this.readonly && !isNonInputField && !isSpecial) {
                    // 只读权限
                    // 修复空权限默认值的bug
                    if (this.$utils.isEmpty(rightsValue)) {
                        rightsValue = FormUtils.getDefaultRigths(field)
                    }
                    rightsValue = rightsValue !== FormOptions.t.PERMISSIONS.HIDE ? FormOptions.t.PERMISSIONS.READ : rightsValue
                }
                return rightsValue
            },
            // 初始化需要进行公式计算的字段
            initResponseFormula(item) {
                FormUtils.setResponseFormula(this.responseFormula, item, this.code)
            },
            // 初始化运行公式计算
            initRunCalFormula() {
                // 不需要字段的进行公式计算 比如获取但其当前时间
                FormUtils.runCalFormula(this, this.responseFormula[FormUtils.NOT_NEED_FIELD], this.formDef.code)
            },
            // 初始化联动数据
            initResponseLinkages(item) {
                FormUtils.setResponseLinkages(this.responseLinkages, item, this.code)
            },
            // 初始化表单意见
            initResponseOpinionData() {
                this.responseFormOpinionData = {}
                this.unComplateOpinion = null
                const opinionData = this.params ? this.params.formOpinionData || {} : {}
                if (this.$utils.isEmpty(opinionData) || !this.hasFormOpinion()) {
                    return
                }
                this.unComplateOpinion = opinionData.unComplateOpinion
                const hasBindNode = opinionData.hasBindNode
                const formOpinionConfig = opinionData.formOpinionConfig
                if (hasBindNode) {
                    // 1、有流程节点绑定的流程意见
                    const nodeData = opinionData.formOpinionNodeData
                    for (const key in this.responseOpinionFields) {
                        if (this.responseOpinionFields.hasOwnProperty(key)) {
                            if (formOpinionConfig[key]) {
                                this.responseFormOpinionData[key] = nodeData[key]
                            } /* else {
                                this.responseFormOpinionData[key] = opinionData.opinionList
                            } */
                        }
                    }
                } else {
                    for (const key in this.responseOpinionFields) {
                        if (this.responseOpinionFields.hasOwnProperty(key)) {
                            this.responseFormOpinionData[key] = opinionData.opinionList
                        }
                    }
                }
            },
            /**
             * 表单提交校验
             */
            formSubmitVerify(callback) {
                let flag = true
                const verifys = this.formAttrs ? this.formAttrs.verifys : []
                if (this.$utils.isEmpty(verifys)) {
                    callback(flag)
                    return
                }
                const formData = this.getFormData()
                for (let i = 0; i < verifys.length; i++) {
                    const verify = verifys[i]
                    if (!FormUtils.runFormSubmitVerify(verify.formula, formData, this.formDef.code)) {
                        flag = false
                        callback(flag, verify.msg)
                        return
                    }
                }
                flag = true
                callback(flag)
            },
            /**
             * 获取表单数据
             */
            getFormData() {
                const data = {}
                // 去除文本字段,表单意见字段
                for (var key in this.models) {
                    if (!this.responseOpinionFields[key] && !this.responseLabelFields[key]) {
                        data[key] = this.models[key]
                    }
                }
                return data
            },
            /**
             * 设置表单字段数据
             */
            setFieldData(name, value) {
                this.models[name] = value
            },
            /**
             * 设置表单权限
             */
            getFormRights(name) {
                return this.rights[name]
            },
            /**
             * 设置表单权限
             */
            setFormRights(name, value) {
                this.rights[name] = value
            },
            /**
             *  是否有审批意见字段
             */
            hasFormOpinion() {
                return this.$utils.isNotEmpty(this.responseOpinionFields)
            },
            /**
             * 获取审批意见数据
             */
            getFormOpinionData() {
                const data = {}
                for (var key in this.models) {
                    if (this.responseOpinionFields[key] && (this.$utils.isEmpty(this.rights[key]) || this.rights[key] === FormOptions.t.PERMISSIONS.EDIT || this.rights[key] === FormOptions.t.PERMISSIONS.REQUIRED)) {
                        data[key] = this.models[key]
                    }
                }
                return data
            },
            /**
             * 获取审批意见验证
             */
            formOpinionValidate(callback, flag = false) {
                if (this.$utils.isEmpty(this.responseOpinionFields)) {
                    callback(true)
                    return
                }
                let i = 0
                if (flag) {
                    for (const key in this.responseOpinionFields) {
                        if (this.$utils.isEmpty(this.models[key]) && (this.$utils.isEmpty(this.rights[key]) || this.rights[key] === FormOptions.t.PERMISSIONS.EDIT || this.rights[key] === FormOptions.t.PERMISSIONS.REQUIRED)) {
                            this.models[key] = '退回修改 / 驳回'
                        }
                    }
                } else {
                    for (const key in this.responseOpinionFields) {
                        if (this.$utils.isEmpty(this.models[key]) && this.rights[key] === FormOptions.t.PERMISSIONS.REQUIRED) {
                            i++
                        }
                    }
                }

                if (i > 0) {
                    callback(false)
                } else {
                    callback(true)
                }
            },
            /**
             * 表单验证
             */
            validate(callback) {
                // 先移除校验再进行校验
                this.$refs.form.clearValidate()
                this.$refs.form.validate((valid, invalidFields) => {
                    this.invalidFields = invalidFields
                    if (callback) callback(valid, invalidFields)
                })
            },
            //表单关联
            getTableList(list) {
                this.titleList = list
            },
            // 将对象参数传入， 进行渲染
            getStatisOrRecord(type) {
                this.record = type
            }
            /**
             * 获取表单字段的具体控件组件实例
             */
            // getRefsField (fieldName) {
            //     const refs = this.getRefs(fieldName)
            //     if (this.$utils.isEmpty(refs) || this.$utils.isEmpty(refs[0]) || this.$utils.isEmpty(refs[0].$refs) || this.$utils.isEmpty(refs[0].$refs['formField'])) {
            //         return null
            //     }
            //     return refs[0].$refs.formField
            // },
            // getRefs (fieldName) {
            //     const key = 'formItem' + fieldName
            //     return this.getDynamicRefs(this.$refs, key)
            // },
            // getDynamicRefs (formRefs, key) {
            //     if (this.$utils.isEmpty(formRefs)) {
            //         return
            //     }
            //     for (const refKey in formRefs) {
            //         const formRef = formRefs[refKey]
            //         if (refKey === key) { return formRef }
            //         for (let j = 0; j < formRef.length; j++) {
            //             const refs = formRef[j]
            //             const v = this.getDynamicRefs(refs.$refs, key)
            //             if (v) {
            //                 return v
            //             }
            //         }
            //     }
            // }
        }
    }
</script>

<style lang="scss">
    .jbd-form {
        padding: 0;
        margin: 0;
        margin-top: 85px !important;
    }
    .jbd-form-cont {
        background-color: #ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        margin: 0 auto;
        padding: 10px;
        min-height: 92vh;
        width: 84%;
    }
    .jbd-replce {
        height: 5px;
    }
    .dynamic-form {
        .el-input {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        .el-collapse-item__header.is-active {
            border-bottom: 1px solid #ebeef5;
            margin-bottom: 5px;
        }
        .form-header {
            border-bottom: 1px solid #2b34410d;
            margin-bottom: 5px;
            .title {
                font-weight: bold;
                color: #222;
                text-align: left;
                padding: 8px 10px 10px;
                margin: 0;
            }
            .desc {
                word-wrap: break-word;
                word-break: normal;
                text-indent: 0;
                line-height: 1.6;
                margin: 0 0 11px;
                padding: 3px 30px 8px;
            }
        }
        .dynamic-form-table-item__readonly {
            margin-bottom: 0;
        }
        //===================border-form====================
        .ibps-border-form {
            border: 1px solid #cfd7e5;
            .el-form-item {
                border-top: 1px solid #cfd7e5;
            }
            .el-form-item__content:before {
                width: 1px;
                background: #cfd7e5;
                display: block;
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: -20px;
            }
            .el-form-item__content .el-form-item__error {
                left: 5px;
            }
            .el-form--label-top .el-form-item__content:before,
            .no-label-form-item .el-form-item__content:before {
                background: transparent;
            }
            .el-row + .el-row {
                border-top: 1px solid #cfd7e5;
            }
            .el-col + .el-col {
                border-left: 1px solid #cfd7e5;
            }
            .el-col {
                overflow: hidden;
            }
            .el-form-item__content {
                padding: 5px;
                padding-bottom: 0;
            }
            .el-form-item__label {
                padding: 5px;
            }
            .el-table {
                .el-form-item {
                    border-top: 0;
                }
                .el-form-item__content:before {
                    width: 0;
                }
                .el-form-item__content {
                    padding: 0;
                }
            }
        }
    }

    .relevanceTable{
        margin-top: 30px;
    }
</style>
