<template>
    <div v-if="formPage">
        <ibps-watermark :disabled="!enableWatermark" :text="watermarkText">
            <!--顶部按钮-->
            <template v-if="hasActions">
                <div v-sticky="{ stickyTop: marginTop }" class="form-toolbar hidden-print">
                    <div :class="['ibps-toolbar--' + $ELEMENT.size]" class="ibps-toolbar">
                        <panle />
                        <div class="header" style="height: 30px">
                            <div class="buttons" style="float: right; margin-right: 8%">
                                <ibps-toolbar
                                    ref="toolbar"
                                    :actions="actions.reverse()"
                                    @action-event="handleButtonEvent"
                                />
                            </div>
                            <!--步骤条按钮-->
                            <div v-if="hasStepButton" class="buttons ibps-pr-10 ibps-fr-important">
                                <el-button
                                    v-for="button in stepButtons"
                                    :key="button.key"
                                    :size="button.size || $ELEMENT.size"
                                    :icon="'ibps-icon-' + button.icon"
                                    :autofocus="false"
                                    :disabled="disabledStepButton(button.key)"
                                    :loading="stepLoading"
                                    @click="() => { handleStepButtonEvent(button) }"
                                >
                                    {{ button.label }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <!--表单-->
            <dynamic-form
                ref="dynamicForm"
                v-model="formData"
                :form-def="formDefData"
                :form="this"
                :permissions="permissions"
                :readonly="readonly"
                :params="params"
                :dynamicParams="dynamicParams"
                :initialization="initialization"
                :cur-active-step.sync="curActiveStep"
                :isDialog="isDialog"
                class="form-container"
                :style="{ marginTop: hasActions ? marginTop + 'px' : '0' }"
            />
            <component
                :is="dialogTemplate"
                v-if="dialogTemplate"
                ref="dialogTemplate"
                v-bind="dialogTemplateAtts"
            />
            <component
                :is="customComponent"
                v-if="customComponent"
                ref="customComponent"
                v-bind="customComponentAtts"
            />
        </ibps-watermark>
    </div>
</template>

<script>
    import ActionUtils from '@/utils/action'
    import JForm from '../utils/JForm' // 自定义脚本
    import DynamicForm from './dynamic-form/dynamic-form'
    import IbpsWatermark from '@/components/ibps-watermark'
    import panle from '@/components/jbd-panel'

    const JFormId = 'JForm'

    export default {
        components: {
            DynamicForm,
            panle,
            IbpsWatermark
        },
        props: {
            isDialog: {
                type: Boolean,
                default: false
            },
            formDef: {
                type: Object,
                required: true
            },
            dynamicParams: {
                type: Object
            },
            // 表单参数
            addDataCont: {
                type: Object
            },
            data: {
                type: Object
            },
            /**
             * @description 工具栏
             */
            buttons: {
                type: Array
            },
            /**
             * 是否只读 (流程实例时候控制)
             */
            readonly: {
                type: Boolean,
                default: false
            },
            /**
             *  @description 扩展参数 比如流程id等
             * 流程相关信息:
             * taskId:任务id
             * instanceId：流程实例
             * defId：定义Id
             * formOpinionData： 流程意见配置及已经审批的意见数据
             */
            params: {
                type: Object
            },
            mode: {
                // 表单模式
                type: String
            }
        },
        data() {
            return {
                formPage: true,
                loading: false,
                formData: {},
                permissions: null,
                // actions: [],
                initialization: false,
                marginTop: 50,
                curActiveStep: 0,
                formParams: {},
                curTime: new Date().getTime(),
                stepLoading: false,
                dialogTemplate: null,
                dialogTemplateAtts: {},
                number: 0,
                // 个性定制
                customComponent: null,
                customComponentAtts: {}
            }
        },
        computed: {
            formDefData() {
                return JSON.parse(JSON.stringify(this.formDef))
            },
            hasActions() {
                return this.hasStepButton || (this.actions && this.actions.length > 0)
            },
            dynamicForm() {
                return this.$refs ? this.$refs.dynamicForm : null
            },
            hasStepButton() {
                return this.$utils.isNotEmpty(this.stepButtons) && this.mode !== 'dialog'
            },
            stepNum() {
                if (this.$utils.isEmpty(this.step)) {
                    return 0
                }
                return this.step.field_options.columns.length
            },
            finishStep() {
                return this.stepNum - 1 === this.curActiveStep
            },
            actions() {
                return this.getActions()
            },
            stepButtons() {
                return this.getStepButtons()
            },
            step() {
                return this.getFormStep()
            },
            enableWatermark() {
                return this.formDefData ? (this.formDefData.attrs.watermark || false) : false
            },
            watermarkText() {
                if (this.enableWatermark) {
                    return this.formDefData.attrs.watermarkText || ''
                }
                return ''
            }
        },
        watch: {
            formDef: {
                handler: function (val, oldVal) {
                    if (val && val !== oldVal) {
                        this.initialization = false
                        this.initUI()
                    }
                },
                immediate: true
            },
            data: {
                handler: function (val, oldVal) {
                    if (val && val !== oldVal) {
                        const data = JSON.parse(JSON.stringify(val))
                        // 表单数据
                        this.formData = data.responses || {}
                        if (this.addDataCont) this.formData['addDataCont'] = this.addDataCont
                        // 表单权限
                        this.permissions = data.permissions || null
                    }
                },
                immediate: true,
                deep: true
            },
            curActiveStep() {
                this.$emit('cur-active-step', this.curActiveStep)
            }
        },
        created() {
            this.initUI()
        },
        beforeDestroy() {
            this.formPage = false
            const script = document.getElementById(JFormId)
            if (script) {
                script.parentNode.removeChild(script)
            }
            /*清除缓存 */
            if (this.formDef.key) {
                JForm.cleanEvents()
            }
        },
        methods: {
            initUI() {
                if (!this.initialization) {
                    this.initJForm()
                    this.initialization = true
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.loadScript()
                        }, 10)
                    })
                }
            },
            getActions() {
                if (this.$utils.isEmpty(this.buttons)) {
                    return []
                }
                const actions = []
                this.buttons.forEach((btn, i) => {
                    const key = btn.getAlias()
                    let disabled = false
                    let hidden = false
                    if (btn.getAlias() !== 'close' && this.hasStepButton && !this.finishStep) {
                        disabled = true
                    }

                    hidden = this.onLoadActions(key, btn, 'hidden', hidden)
                    disabled = this.onLoadActions(key, btn, 'disabled', disabled)
                    const this_ = this
                    const button = {
                        key: key,
                        label: btn.getLabel(),
                        icon: btn.getIcon(),
                        type: btn.getType(),
                        disabled: disabled,
                        hidden: hidden,
                        callback: () => {
                            if (btn.key == 'agree') {
                                // 前置事件
                                this_.$confirm(`确认任务 [ 提交 ] 操作 ？`, '提示:', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.beforeScript(btn.getAlias(), result => {
                                        if (result) {
                                            return btn.action.apply(this, [btn])
                                        }
                                    })
                                }).catch(() => {})
                            } else {
                                this.beforeScript(btn.getAlias(), result => {
                                    if (result) {
                                        return btn.action.apply(this, [btn])
                                    }
                                })
                            }
                        }
                    }
                    actions.push(button)
                })
                return actions
            },
            // 自定义格式数据事件
            onLoadActions: function (key, button, type, defaultVal) {
                const buttonActionResult = JForm._onLoadActions(this, key, button, type)
                if (typeof buttonActionResult !== 'undefined' && buttonActionResult) {
                    return true
                }
                return defaultVal
            },
            handleButtonEvent(button, position, data, index) {
                const action = this.actions.find(action => {
                    return button.key === action.key
                })
                if (action) {
                    action.callback()
                }
            },
            handleActionEvent(actionKey, args = {}) {
                this.$emit('action-event', actionKey, args)
            },
            disabledStepButton(key) {
                if (key === 'prev') {
                    return this.curActiveStep === 0
                } else {
                    return this.stepNum - 1 === this.curActiveStep
                }
            },
            /** **Step 处理 */
            getStepButtons() {
                if (this.$utils.isEmpty(this.step)) {
                    return []
                }
                if (this.$utils.isNotEmpty(this.step.field_options.buttons)) {
                    return this.step.field_options.buttons
                } else {
                    const defaultButtons = [
                        {
                            key: 'prev',
                            icon: 'angle-left',
                            label: '上一步'
                        },
                        {
                            key: 'next',
                            icon: 'angle-right',
                            label: '下一步'
                        }
                    ]
                    return defaultButtons
                }
            },
            getFormStep() {
                const step = {}
                if (this.$utils.isEmpty(this.formDef)) {
                    return
                }
                for (let i = 0; i < this.formDef.fields.length; i++) {
                    const field = this.formDef.fields[i]
                    if (field.field_type === 'steps') {
                        return field
                    }
                }
                return step
            },
            handleStepButtonEvent(button) {
                const key = button.key
                if (key === 'next' && this.curActiveStep === this.stepNum - 1) {
                    ActionUtils.warning('没有更多')
                    return
                }
                if (key === 'prev' && this.curActiveStep === 0) {
                    ActionUtils.warning('没有上一步')
                    return
                }
                this.stepLoading = true
                const curDate = new Date().getTime()
                let time = 0
                if (this.curTime + 1500 >= curDate) {
                    time = 1000
                }
                this.curTime = curDate
                setTimeout(() => {
                    if (key === 'next') {
                        this.validate(valid => {
                            if (valid) {
                                this.curActiveStep++
                            } else {
                                this.formErrorToast()
                            }
                        })
                    } else {
                        this.curActiveStep--
                    }
                    this.stepLoading = false
                }, time)
            },
            callback() {
                this.$emit('callback')
            },
            closeDialog() {
                this.$emit('close')
            },
            getForm() {
                return this.$refs.dynamicForm
            },
            /**
             * 获取表单验证
             */
            validate(callback) {
                this.getForm().validate((valid, invalidFields) => {
                    callback(valid, invalidFields)
                })
            },
            formErrorToast(msg) {
                ActionUtils.saveErrorMessage(msg)
            },
            // 处理表单提交验证
            formSubmitVerify(callback) {
                if (!this.hasScript()) {
                    if (callback) {
                        this.getForm().formSubmitVerify(callback)
                    }
                    return
                }

                JForm._onValidate(this, (result, errorMsg) => {
                    if (!result) {
                        return callback(result, errorMsg || '验证不通过,请检查表单')
                    }
                    this.getForm().formSubmitVerify(callback)
                })
            },
            /**
             * 获取表单数据
             */
            getFormData() {
                return this.getForm().getFormData()
            },
            /**
             * 获取字段数据
             */
            getData(name) {
                const data = this.getFormData()
                return data[name]
            },
            /**
             * 设置字段数据
             */
            setData(name, value) {
                return this.getForm().setFieldData(name, value)
            },
            /**
             * 设置表单权限
             */
            getFormRights(name) {
                return this.getForm().getFormRights(name)
            },
            /**
             * 设置表单权限
             */
            setFormRights(name, value) {
                return this.getForm().setFormRights(name, value)
            },
            hasFormOpinion() {
                return this.getForm().hasFormOpinion()
            },
            /**
             * 表单意见数据
             */
            getFormOpinionData() {
                return this.getForm().getFormOpinionData()
            },
            /**
             * 获取审批意见验证
             */
            formOpinionValidate(calback, flag) {
                this.getForm().formOpinionValidate(calback, flag)
            },
            /**
             * 获取表单字段组件实例
             */
            getRefs(fieldName) {
                return this.getForm().getRefs(fieldName)
            },
            /**
             * 获取表单字段的具体控件组件实例
             */
            getRefsField(fieldName) {
                return this.getForm().getRefsField(fieldName)
            },
            /* 给与表头赋值关联对话框及数据*/
            getTableList(list) {
                return this.getForm().getTableList(list)
            },
            /* 获取统计页面或记录页面*/
            getStatisOrRecord(type) {
                return this.getForm().getStatisOrRecord(type)
            },
            /* 表头点击事件*/
            clickTableHeand(a) {
                return this.getForm().clickTableHeand(a)
            },
            /**
             * 初始化脚本
             */
            initJForm() {
                let script = document.getElementById(JFormId)
                if (script) {
                    script.parentNode.removeChild(script)
                }
                if (this.formDef.attrs && this.formDef.attrs.script) {
                    const codeScript = this.formDef.attrs.script
                    script = document.createElement('script')
                    script.type = 'text/javascript'
                    script.id = JFormId
                    document.body.appendChild(script)
                    try {
                        script.appendChild(document.createTextNode(codeScript))
                    } catch (ex) {
                        console.error(ex)
                        script.text = codeScript
                    }
                    document.body.appendChild(script)
                }
            },
            // 处理脚本
            hasScript() {
                return this.getForm().hasScript
            },
            // 加载脚本
            loadScript() {
                this.$emit('load', this)
                if (!this.hasScript()) {
                    return
                }
                JForm._onLoad(this, this.getForm)
            },
            // 前置脚本
            beforeScript(action, callback) {
                if (!this.hasScript()) {
                    if (callback) {
                        const flag = true
                        callback(flag)
                    }
                    return
                }
                JForm._beforeSubmit(this, action, this.getFormData(), callback)
            },
            // 后置脚本
            afterScript(action, params, callback) {
                this.formParams = params
                if (!this.hasScript()) {
                    if (callback) {
                        const flag = true
                        callback(flag)
                    }
                    return
                }
                JForm._afterSubmit(this, action, this.getFormData(), callback)
            },
            // 更新store
            updateStore(action, data) {
                this.$store.dispatch(action, data)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .form-toolbar {
        position: fixed;
        width: 100%;
        margin-top: -50px;
    }
    .form-container {
        margin: 0 10px 10px 10px;
    }
    @media print {
        .dynamic-form {
            margin-top: 0 !important;
        }
        .el-dialog__headerbtn {
            display: none !important;
            padding: 0;
            margin: 0;
        }
        .hidden-print {
            padding: 0;
            margin: 0;
        }
    }
</style>
