<template>
  <div
    v-loading.fullscreen.lock="loading"
    :element-loading-text="$t('common.loading')"
  >
    <!--在线表单-->
    <formrender
      v-if="formDef"
      ref="formrender"
      :form-def="formDef"
      :buttons="buttons"
      :data="formData"
      :params="formParams"
      :dynamicParams = "dynamicParams"
      :readonly="readonly"
      :addDataCont="addDataCont"
      @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
      @callback="callbackPage"
      @close="closeDialog"
    />

    <!-- 流程定义选择器 -->
    <bpm-def-dialog
      v-model="bpmDefValue"
      :visible="bpmDefDialogVisible"
      :form-key="formKey"
      :multiple="false"
      :is-data-template-use="true"
      @close="visible => bpmDefDialogVisible = visible"
      @action-event="handleDialogActionEvent"
    />

    <form-print-template
      :id="printTemplateId"
      :data="formData"
      :pk="pkValue"
      :visible="formPrintTemplateDialogVisible"
      @close="visible => formPrintTemplateDialogVisible = visible"
    />
  </div>
</template>
<script>
import { getFormData } from '@/api/platform/form/formDef'
import FormUtil from '@/business/platform/form/utils/formUtil'
import FormButton from './button'
import ActionMixin from './action'
import BpmDefDialog from '@/business/platform/bpmn/definition/dialog'

import Formrender from '@/business/platform/form/formrender/index.vue'

import FormPrintTemplate from '@/business/platform/form/form-print/template'

export default {
  components: {
    Formrender,
    BpmDefDialog,
    FormPrintTemplate
  },
  mixins: [ActionMixin],
  props: {
    templateKey: { // 模版Key
      type: String
    },
    addDataCont: { // 表单参数
      type: Object
    },
    formKey: { // 表单key
      type: String
    },
    dynamicParams: Object,
    printTemplateId: {
      type: String
    },
    pkValue: { // 主键
      type: [String, Number]
    },
    rightsScope: {
      type: String,
      default: 'data'
    },
    toolbars: { // 工具栏
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    },
    defaultData: { // 默认数据
      type: Object
    }
  },
  data() {
    return {
      loading: false,

      bpmDefValue: {},
      bpmDefDialogVisible: false,

      formPrintTemplateDialogVisible: false,

      formDef: null,
      formData: {},
      formParams: {}, // 扩展参数
      buttons: [],
      boCode: '',
      version: 0
    }
  },
  watch: {
    toolbars: {
      handler: function(val, oldVal) {
        this.buttons = this.getButtons(this.toolbars, {})
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadFormData() {
      this.loading = true
      getFormData({
        templateKey: this.templateKey || '',
        formKey: this.formKey,
        pk: this.pkValue,
        rightsScope: this.rightsScope
      }).then(response => {
        const data = response.data
        let responses = {}
        if (this.$utils.isNotEmpty(this.defaultData)) {
          responses = this.defaultData
        } else {
          responses = data.boData ? this.$utils.parseJSON(data.boData) : {}
        }

        this.formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(data.permissions) || {}
        }
        // 从后台获取表单定义数据
        this.formDef = this.$utils.parseData(data.form) || {}
        this.boCode = this.formDef.code
        // 版本号
        this.version = data.version

        // 表单意见
        this.formParams.formOpinionData = FormUtil.initFormOpinionData(data.attributes || {})
        // 流程关联数据
        this.formParams.bpmLinkData = FormUtil.getBpmLinkData(data.attributes)

        // 业务主键
        this.formParams.bizKey = this.pkValue

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getButtons(buttons, params) {
      if (this.$utils.isEmpty(buttons)) { return null }
      const btn = new FormButton({
        buttons: buttons,
        params: params
      })
      return btn.response_buttons
    },
    getFormData() {
      return this.$refs.formrender.getFormData()
    },
    getFormEL() {
      return this.$refs.formrender
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
    /**
     * 回调上个页面
     */
    callbackPage() {
      this.closeDialog()
      this.$emit('callback', true)
    },
    // 关闭当前窗口
    closeDialog() {
      this.formDef = null
      this.$emit('close', false)
    },
    // 验证表单
    validate(callback) {
      if (!this.$refs.formrender.validate) {
        const flag = true
        callback(flag)
        return
      }
      this.$refs.formrender.validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    formSubmitVerify(callback) {
      return this.$refs.formrender.formSubmitVerify(callback)
    },
    formErrorToast() {
      return this.$refs.formrender.formErrorToast()
    }
  }
}
</script>
<style lang="scss">
   .data-template-form-renderer-dialog{
    .el-dialog__header{
      padding: 0;
      border-bottom:0;
    }
    .el-dialog__body {
      padding: 0;
    }
     .el-dialog__headerbtn{
      z-index: 99999;
    }
    @media print {
      .dynamic-form{
        margin-top:0 !important;
      }
      .el-dialog__headerbtn {
        display: none !important;
      }
      .hidden-print{
        padding: 0;
        margin:  0;
      }
    }
  }
</style>
