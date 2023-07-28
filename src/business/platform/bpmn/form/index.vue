<template>
    <div v-loading.fullscreen.lock="loading" :element-loading-text="$t('common.loading')">
        <template v-if="formModel.type === 'INNER'">
            <formrender
                v-if="formDef"
                ref="formrender"
                :form-def="formDef"
                :buttons="buttons"
                :data="formData"
                :params="formParams"
                :readonly="readonly"
                @action-event="(actionKey, args) => emitEventHandler(actionKey, args)"
                @callback="callbackPage"
                @close="closeDialog"
            />
        </template>
        <!-- 内嵌url表单，外部url表单 -->
        <template v-else-if="formModel.type === 'URL_LOAD' || formModel.type === 'FRAME'">
            <form-toolbar
                v-if="formModel.type === 'URL_LOAD'"
                :buttons="buttons"
                @validate="validateForm"
                @action-event="(actionKey, args) => emitButtonEventHandler(actionKey, args)"
                @callback="callbackPage"
                @close="closeDialog"
            />
            <iframe
                v-if="formUrlType === 'iframe'"
                ref="formrender"
                :class="formModel.type === 'URL_LOAD' ? 'ibps-container-url-frame' : 'ibps-container-frame'"
                frameborder="0"
            />
            <component
                :is="formUrlName"
                v-else
                ref="formrender"
                :params="formParams"
                :readonly="readonly"
                @action-event="(actionKey, args) => emitButtonEventHandler(actionKey, args)"
                @callback="callbackPage"
                @close="closeDialog"
            />
        </template>
        <!-- 流程图 -->
        <flow-diagram-dialog
            :visible="flowDiagramVisible"
            :def-id="defId"
            :task-id="taskId"
            :inst-id="instanceId"
            @close="visible => (flowDiagramVisible = visible)"
        />
        <!-- 流程历史 -->
        <approval-history-dialog
            :visible="approvalHistoryVisible"
            :task-id="taskId"
            :inst-id="instanceId"
            @close="visible => (approvalHistoryVisible = visible)"
        />
        <!-- 流程实例 -->
        <instance-detail
            :visible="instanceDetailVisible"
            :bpmn-inst-id="instanceId"
            @close="visible => (instanceDetailVisible = visible)"
        />
        <!-- 启动流程 -->
        <start-flow-dialog
            :visible="startFlowDialogVisible"
            :def-id="defId"
            :data="submitFormData"
            :title="actionTitle"
            @close="visible => (startFlowDialogVisible = visible)"
            @action-event="saveStartFlow"
        />
        <!-- 同意 -->
        <agree-dialog
            :visible="agreeDialogVisible"
            :action="actionName"
            :title="actionTitle"
            :task-id="taskId"
            :version="version"
            :is-common="attributes.isCommonJumpType"
            :hide-opinion="isBpmOpinionHide"
            :hide-path="attributes.isHidePath"
            :form-opinion="submitFormOpinion"
            @close="visible => (agreeDialogVisible = visible)"
            @action-event="handleActionEvent"
        />
        <!-- 驳回 -->
        <reject-dialog
            :visible="rejectDialogVisible"
            :action="actionName"
            :title="actionTitle"
            :task-id="taskId"
            :hide-opinion="false"
            :form-opinion="submitFormOpinion"
            @close="visible => (rejectDialogVisible = visible)"
            @action-event="handleActionEvent"
        />
        <!-- 终止流程 -->
        <approve-dialog
            :visible="approveDialogVisible"
            :action="actionName"
            :title="actionTitle"
            :task-id="taskId"
            :hide-opinion="isBpmOpinionHide"
            :form-opinion="submitFormOpinion"
            callback-event
            @close="visible => (approveDialogVisible = visible)"
            @action-event="handleActionEvent"
        />
        <!-- 转办 -->
        <delegate-dialog
            :id="taskChangeId"
            :visible="delegateDialogVisible"
            :action="actionName"
            :title="actionTitle"
            :task-id="taskId"
            :readonly="delegateReadonly"
            @close="visible => (delegateDialogVisible = visible)"
            @callback="callbackPage"
        />
        <!-- 任务补签 -->
        <add-sign-task-dialog
            :visible="addSignTaskDialogVisible"
            :action="actionName"
            :title="actionTitle"
            :task-id="taskId"
            :hide-opinion="false"
            :form-opinion="submitFormOpinion"
            @close="visible => (addSignTaskDialogVisible = visible)"
            @action-event="handleActionEvent"
            @callback="callbackPage"
        />
        <!-- 表单打印 -->
        <form-print-template
            :id="printTemplateId"
            :data="submitFormData"
            :pk="pkValue"
            :visible="formPrintTemplateDialogVisible"
            @close="visible => (formPrintTemplateDialogVisible = visible)"
        />
    </div>
</template>
<script>
    import { getFormData, getInstFormData } from '@/api/platform/bpmn/bpmInst'
    import { getTaskFormData } from '@/api/platform/bpmn/bpmTask'

    import FormUtil from '@/business/platform/form/utils/formUtil'
    import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'
    import ActionMixin from './action'
    import BpmnButton from './button'

    import Formrender from '@/business/platform/form/formrender/index.vue'
    import FormToolbar from '@/business/platform/form/formrender/toolbar.vue'

    import FlowDiagramDialog from '@/business/platform/bpmn/components/flow-diagram/dialog'
    import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog'
    import InstanceDetail from '@/views/platform/bpmn/bpmInst/detail'

    import StartFlowDialog from '@/business/platform/bpmn/form-ext/start-flow'
    import AgreeDialog from '@/business/platform/bpmn/form-ext/agree'
    import RejectDialog from '@/business/platform/bpmn/form-ext/reject'
    import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'
    import DelegateDialog from '@/business/platform/bpmn/task-change/edit'
    import AddSignTaskDialog from '@/business/platform/bpmn/form-ext/add-sign-task'

    import FormPrintTemplate from '@/business/platform/form/form-print/template'

    const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

    export default {
        components: {
            Formrender,
            FormToolbar,
            FlowDiagramDialog,
            ApprovalHistoryDialog,
            InstanceDetail,
            StartFlowDialog,
            AgreeDialog,
            RejectDialog,
            ApproveDialog,
            DelegateDialog,
            AddSignTaskDialog,
            FormPrintTemplate
        },
        mixins: [ActionMixin],
        props: {
            // 流程定义ID
            defId: {
                type: String
            },
            // 草稿流程实例ID
            proInstId: {
                type: String
            },
            // 流程实例ID
            instanceId: {
                type: String
            },
            // 流程任务ID
            taskId: {
                type: String
            },
            // 转办代理任务ID
            taskChangeId: {
                type: String
            },
            // waiJianID
            waiJian: {
                type: String
            },
            // 新增参数
            addDataCont: {
                type: Object
            },
            // 是否复制流程
            copyFlow: {
                type: Boolean,
                default: false
            },
            flowName: {
                type: String
            },
            closeable: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                flowDiagramVisible: false,
                approvalHistoryVisible: false,
                instanceDetailVisible: false,
                startFlowDialogVisible: false,
                agreeDialogVisible: false, // 同意
                rejectDialogVisible: false,
                delegateDialogVisible: false,
                addSignTaskDialogVisible: false,
                approveDialogVisible: false,
                delegateReadonly: false,

                endProcessTaskId: '',
                actionName: '',
                actionTitle: '',
                version: '',
                // 表单数据
                loading: false,
                formUrlName: '',
                // 内嵌url方式：inner： vue组件方式，iframe：iframe方式
                formUrlType: 'inner',
                formModel: {
                    type: 'INNER'
                },
                formDef: null,
                buttons: [],
                formData: {},
                // 新增扩展属性
                attributes: {},
                // 表单流程扩展参数
                formParams: {},
                isBpmOpinionHide: false,
                readonly: false,
                submitFormData: {},
                submitFormOpinion: '',
                printTemplateId: '',
                formPrintTemplateDialogVisible: false,
                pkValue: ''
            }
        },
        watch: {
            visible: {
                handler: function (val, oldVal) {
                    this.dialogVisible = this.visible
                },
                immediate: true
            }
        },
        methods: {
            // 获取数据
            loadFormData() {
                this.loading = true
                this.formDef = null
                this.buttons = null
                this.formData = null
                this.$nextTick(() => {
                    this.readonly = false
                    if (this.$utils.isNotEmpty(this.taskId)) {
                        // 处理流程任务
                        this.getTaskFormData()
                    } else if (this.$utils.isNotEmpty(this.defId)) {
                        // 启动 或者草稿流程启动
                        this.getDefinitionFormData()
                    } else if (this.$utils.isNotEmpty(this.instanceId)) {
                        // 流程实例
                        this.getInstanceFormData()
                    } else {
                        this.$alert('未获取正确的参数，请检查传入参数').then(() => {
                            this.closeDialog()
                        })
                        this.loading = false
                    }
                })
            },

            /**
             * 启动 或者草稿流程。
             */
            getDefinitionFormData() {
                const proInstId = this.proInstId || null
                const copyFlow = this.copyFlow || null
                this.formParams.defId = this.defId
                this.formParams.proInstId = proInstId
                this.formParams.copyFlow = copyFlow
                this.formParams.addDataCont = this.addDataCont

                getFormData({
                    defId: this.defId,
                    proInstId: proInstId,
                    copy: copyFlow
                }).then(response => {
                    this.loading = false
                    this.buildFormData(response.data)
                }).catch(() => {
                    this.loading = false
                })
            },
            /**
             * 获取流程任务表单
             */
            getTaskFormData() {
                this.loading = true
                this.formParams.taskId = this.taskId || null
                this.formParams.waiJian = this.waiJian || null
                getTaskFormData({
                    taskId: this.taskId,
                    waiJian: this.waiJian
                }).then(response => {
                    this.loading = false
                    this.buildFormData(response.data)
                }).catch(() => {
                    this.loading = false
                })
            },
            /**
             * 流程实例 的表单数据
             */
            getInstanceFormData() {
                this.readonly = true
                this.formParams.instanceId = this.instanceId || null
                getInstFormData({
                    instId: this.instanceId
                }).then(response => {
                    this.loading = false
                    this.buildFormData(response.data)
                }).catch(() => {
                    this.loading = false
                })
            },
            /**
             * 构建表单相关数据
             */
            buildFormData(data) {
                if (this.$utils.isEmpty(data)) {
                    this.$alert(`未获取到数据`).then(() => {
                        this.closeDialog()
                    })
                    return
                }
                const formModel = data.formModel
                this.formUrlType = 'inner'

                // 判断是否设置表单
                if (this.$utils.isEmpty(formModel)) {
                    this.$alert(`未设置表单,请流程定义中设置表单`).then(() => {
                        this.closeDialog()
                    })
                    return
                }
                this.formModel = formModel
                // 数据预处理，审批意见数据添加审批人姓名
                if (data.attributes && data.attributes.opinionList && data.attributes.opinionList.length) {
                    let users = this.$store.getters.usersList || []
                    data.attributes.opinionList.forEach(item => {
                        let userInfo = users.find(i => i.userId === item.auditor)
                        item.auditorName = userInfo ? userInfo.userName : null
                    })
                }
                // ============在线表单 ================
                if (formModel.type === 'INNER') {
                    if (this.$utils.isEmpty(formModel.formData)) {
                        this.$alert(`未设置在线表单`).then(() => {
                            this.closeDialog()
                        })
                    }

                    // 表单定义
                    this.formDef = this.$utils.parseData(formModel.formData) || {}
                    this.formDef.flowName = this.flowName

                    this.formData = {
                        // 表单数据
                        responses: this.$utils.parseData(data.boData) || {},
                        // 表单权限
                        permissions: this.$utils.parseData(data.permissions) || {}
                    }

                    // 一些参数
                    this.attributes = this.initAttributes(data)
                    this.formParams.nodeId = this.attributes.nodeId
                    this.formParams.proInstId = data.attributes.proInstId
                    // 操作按钮
                    this.buttons = this.buildButtons(data.buttons, this.attributes) || []
                    // 表单意见
                    this.formParams.formOpinionData = FormUtil.initFormOpinionData(data.attributes || {})

                    // 表单意见是否隐藏意见
                    this.$nextTick(() => {
                        this.isBpmOpinionHide = this.handleBpmOpinionHide(data.attributes || {}, this.formDef)
                    })
                    // 流程关联信息
                    this.formParams.bpmLinkData = FormUtil.getBpmLinkData(data.attributes || {})
                    // 打印模版
                    this.printTemplateId = this.attributes.templateId

                    // 版本号
                    this.version = data.version
                    // 流程实例当前审批节点
                    this.endProcessTaskId = data.endProcessTaskId
                    //  ============内嵌表单[按钮这边提供] ================
                } else if (formModel.type === 'URL_LOAD') {
                    const urlForm = formModel.formValue
                    if (this.$utils.isEmpty(urlForm)) {
                        this.$alert(`未设置内嵌表单`).then(() => {
                            this.closeDialog()
                        })
                    }
                    // 一些参数
                    this.attributes = this.initAttributes(data)
                    this.formParams.nodeId = this.attributes.nodeId

                    // 操作按钮
                    this.buttons = this.buildButtons(data.buttons, this.attributes) || []
                    // 初始化url表单
                    this.initUrlForm(urlForm)
                    console.log(urlForm, this.attributes, data, this.formParams)
                    //  ============外部表单【iframe】 ================
                } else if (formModel.type === 'FRAME') {
                    const urlForm = formModel.formValue
                    if (this.$utils.isEmpty(urlForm)) {
                        this.$alert(`未设置外部表单`).then(() => {
                            this.closeDialog()
                        })
                    }
                    // 初始化url表单
                    this.initUrlForm(urlForm)
                    console.log(urlForm, this.attributes, data, this.formParams)
                }
            },
            // 初始化url表单
            initUrlForm(url) {
                if (url.startsWith('http')) {
                    this.formUrlType = 'iframe'
                    this.$nextTick(() => {
                        this.$refs.formrender.src = url
                        // 传递消息
                        this.$refs.formrender.contentWindow.postMessage({ data: this.attributes }, '*')
                    })
                } else {
                    const component = url.split('?')[0]
                    this.formParams.attrs = this.urlParse(url)
                    this.formUrlType = 'inner'
                    const formUrlName = 'IbpsBpmnFormUrl'
                    this.$options.components[formUrlName] = _import(component)
                    this.formUrlName = formUrlName
                }
            },
            urlParse(str) {
                const obj = {}
                if (str.indexOf('?') !== -1) {
                    const str1 = str.split('?')[1].split('&')
                    for (let i = 0; i < str1.length; i++) {
                        const params = str1[i].split('=')
                        obj[params[0]] = params[1]
                    }
                }
                return obj
            },
            initAttributes(data) {
                const attributes = data.attributes || {}
                return {
                    title: this.title,
                    defId: this.defId,
                    proInstId: this.proInstId,
                    taskId: this.taskId,
                    nodeId: attributes.nodeId,
                    // 锁定用户
                    lockUser: attributes.lockUser,
                    // 当前用户
                    curUserId: attributes.curUserId,
                    // 挂起状态
                    suspendState: attributes.suspendState,
                    // 是否转办
                    isHiddenDelegate: this.$utils.toBoolean(attributes.isHiddenDelegate),
                    // 是否正常跳转
                    isCommonJumpType: this.$utils.toBoolean(attributes.isCommonJumpType),
                    // 是否隐藏意见
                    isHideOpinion: this.$utils.toBoolean(attributes.isHideOpinion),
                    // 是否隐藏路径
                    isHidePath: this.$utils.toBoolean(attributes.isHidePath),
                    // 是否结束
                    isEnd: this.$utils.toBoolean(attributes.isEnd),
                    // 第一个节点是否选择
                    firstNodeUserAssign: attributes.firstNodeUserAssign,
                    // 打印模版
                    printTemplateId: data.formModel.templateId,
                    // BO版本号
                    version: data.version
                }
            },
            handleBpmOpinionHide(attributes = {}, formDef) {
                const formOpinionSetting = attributes.formOpinionSetting
                const formOpinion = attributes.formOpinion
                const curNodeId = attributes.nodeId
                // 处理删除审批意见的bug
                if (this.$utils.isNotEmpty(formOpinionSetting) && this.$utils.isNotEmpty(formOpinion)) {
                    const formOpinionField = FormFieldUtil.getFormOpinionField(formDef.fields)
                    for (const key in formOpinion) {
                        const nodeList = formOpinion[key]
                        if (!formOpinionField[key]) {
                            const nodeKey = JSON.stringify(nodeList)
                            delete formOpinionSetting[nodeKey]
                        }
                    }
                }

                if (this.$utils.isNotEmpty(formOpinionSetting)) {
                    let flag = false
                    for (const o in formOpinionSetting) {
                        const formOpinionHidden = formOpinionSetting[o]
                        try {
                            const nodeIds = this.$utils.parseJSON(o)
                            if (nodeIds.includes(curNodeId)) {
                                flag = this.$utils.toBoolean(formOpinionHidden)
                                break
                            }
                        } catch (err) {
                            console.error(err)
                        }
                    }
                    return this.hasFormOpinion() && !flag ? flag : true
                }
                // 是否有表单意见
                return this.hasFormOpinion() ? true : (this.attributes.isHideOpinion || false)
            },
            /**
             * 构建操作按钮
             */
            buildButtons(toolbars, params) {
                if (this.$utils.isEmpty(toolbars)) {
                    toolbars = []
                }
                // 如果转办，代理不为空
                if (this.$utils.isNotEmpty(this.taskChangeId)) {
                    toolbars.unshift({
                        alias: 'delegateDetail',
                        name: '转办/代理明细'
                    })
                }
                if (this.closeable) {
                    toolbars.unshift({
                        alias: 'close'
                    })
                }
                const buttons = []
                // 已办事宜去除打印按钮和流程实例信息按钮（区分标准，this.instanceId有值则为已办）
                const filterType = ['print', 'instanceDetail']
                for (let i = 0; i < toolbars.length; i++) {
                    const button = toolbars[i]
                    const alias = button.alias
                    const code = button.code
                    button.key = alias === 'custom' ? (code || (alias + i)) : alias
                    if (!this.instanceId) {
                        buttons.push(button)
                    } else if (!filterType.includes(button.key)) {
                        buttons.push(button)
                    }
                }
                const bpmnButton = new BpmnButton({
                    buttons: buttons,
                    params: params
                })
                return bpmnButton.response_buttons
            },
            getFormEL() {
                if (this.formUrlType === 'inner') {
                    return this.$refs.formrender
                } else {
                    try {
                        // 跨域获取表单数据
                        return this.$refs.formrender.contentWindow.ibpsFormUrl
                    } catch (err) {
                        console.error(err)
                    }
                }
            },
            // 获取表单数据
            getFormData() {
                if (!(this.getFormEL() && this.getFormEL().getFormData)) {
                    this.$message({
                        message: 'URL表单必须包含获取表单数据的方法【getFormData】',
                        type: 'warning'
                    })
                    return
                }
                return this.getFormEL().getFormData()
            },
            // 是否有审批意见字段
            hasFormOpinion() {
                if (!(this.getFormEL() && this.getFormEL().hasFormOpinion)) {
                    return false
                }
                return this.getFormEL().hasFormOpinion() || false
            },
            // 获取表单意见数据
            getFormOpinionData() {
                if (!(this.getFormEL() && this.getFormEL().getFormOpinionData)) {
                    return ''
                }
                const formOpinionData = this.getFormEL().getFormOpinionData()
                let data = ''
                if (this.$utils.isEmpty(formOpinionData)) {
                    return data
                }
                // 如果只有一个，多个，取最后一个
                for (const key in formOpinionData) {
                    data = formOpinionData[key]
                }
                return data
            },
            /**
             * 获取审批意见验证
             */
            formOpinionValidate(calback, flag) {
                if (!(this.getFormEL() && this.getFormEL().formOpinionValidate)) {
                    calback(false)
                    return false
                }
                this.getFormEL().formOpinionValidate(calback, flag)
            },
            // 前置事件
            beforeScript(key, callback) {
                if (!(this.getFormEL() && this.getFormEL().beforeScript)) {
                    const flag = true
                    callback(flag)
                    return
                }
                return this.getFormEL().beforeScript(key, callback)
            },
            // 后置事件
            afterScript(key, params, callback) {
                if (!(this.getFormEL() && this.getFormEL().afterScript)) {
                    const flag = true
                    callback(flag)
                    return
                }
                return this.getFormEL().afterScript(key, params, callback)
            },
            // 回调上一个页面
            callbackPage() {
                this.closeDialog()
                this.$emit('callback', this)
            },
            // 关闭当前窗口
            closeDialog() {
                if (this.closeable) {
                    this.$emit('close', false)
                }
            },
            // 验证表单
            validateForm(callback) {
                if (!(this.getFormEL() && this.getFormEL().validate)) {
                    const flag = true
                    callback(flag)
                    return
                }
                this.getFormEL().validate((valid, invalidFields) => {
                    callback(valid, invalidFields)
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .ibps-container-frame {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
    }
    .ibps-container-url-frame {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: calc(100vh - 50px) !important;
        margin-top: 50px;
    }
</style>
