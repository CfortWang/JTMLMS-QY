<template>
  <div
    ref="dialog"
    class="form-renderer-dialog"
    style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);background-color: #FFFFFF; margin-left: 20px;margin-right: 20px;"
  >
  <el-divider  v-if="editFromType == 'add'" content-position="left">添加记录</el-divider>
  <el-divider  v-else-if="editFromType == 'edit'" content-position="left">编辑记录</el-divider>
    <el-divider  v-else-if="editFromType == 'consult'" content-position="left">查阅记录</el-divider>
    <ibps-formrender
      v-if="formDef"
      ref="formrender"
      :form-def="formDefData"
      :data="formData"
      :isDialog="true"
      :mode="mode"
      @load="loadFormrender"
      @cur-active-step="(val)=>curActiveStep=val"
    />

    <div slot="footer" class="el-dialog--center">
      <template>
        <el-button
          v-for="button in stepButtons"
          :key="button.key"
          :size="button.size||$ELEMENT.size"
          :icon="'ibps-icon-'+button.icon"
          :autofocus="false"
          :disabled="disabledStepButton(button.key)"
          :loading="stepLoading"
          @click="()=>{ handleStepButtonEvent(button)}"
        >{{ button.label }}
        </el-button>
        <span class="ibps-pr-10">&nbsp;</span>
      </template>

<!--      查阅按钮用toolbarsConsult-->
      <ibps-toolbar
        :actions="editFromType != 'consult' ? toolbars : toolbarsConsult"
        @action-event="handleActionEvent"
      />
    </div>
  </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import Vue from 'vue'
Vue.component('ibps-formrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
  props: {
    title: {
      type: String
    },
    formDef: { // 表单定义
      type: Object
    },
    data: { // 表单数据
      type: Object
    },
    mode: { // 表单模式
      type: String
    },
    editFromType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      formDefData: null,
      formData: {},
      formOpinionData: {},
      toolbars: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ],
      // 查阅按钮
      toolbarsConsult: [
        { key: 'cancel' }
      ],
      stepButtons: [],
      curActiveStep: 0,
      stepNum: 3,
      stepLoading: false
    }
  },
 created() {
   this.geFormData()
  },
  destroyed() {
    if(this.formDefData && this.formDef){
        this.closeDialog()
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm(key)
          break
        case 'cancel' :
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm(key) {
      // 验证表单是否正确
      this.validate(valid => {
        if (valid) {
          // 表单提交校验
          this.formSubmitVerify((result, errorMsg) => {
            if (!result) {
              this.$message.closeAll()
              return this.$message.warning(errorMsg)
            }
            this.$emit('action-event', key, this.getFormData())
            // 表单提交校验成功
            this.closeDialog()
          })
        } else {
          this.formErrorToast()
        }
      })
    },
    getForm() {
      return this.$refs.formrender
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.getForm().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    formErrorToast() {
      ActionUtils.saveErrorMessage()
    },
    // 处理表单提交验证
    formSubmitVerify(callback) {
      this.getForm().formSubmitVerify(callback)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      return this.getForm().getFormData()
    },
    closeDialog() {
      this.formDefData = null
      this.formData = null
      this.$emit('close', false)
    },
    geFormData(){
      this.formDefData = JSON.parse(JSON.stringify(this.formDef))
      this.formData = JSON.parse(JSON.stringify(this.data))
    },
    loadFormData() {
      this.$nextTick(()=>{
        this.formDefData = JSON.parse(JSON.stringify(this.formDef))
        this.formData = JSON.parse(JSON.stringify(this.data))
      })
    },
    loadFormrender(form) {
      const stepButtons = form.stepButtons
      if (this.$utils.isEmpty(stepButtons)) { return }
      this.stepButtons = stepButtons
      this.stepNum = form.stepNum
    },
    disabledStepButton(key) {
      if (key === 'prev') {
        return this.curActiveStep === 0
      } else {
        return this.stepNum - 1 === this.curActiveStep
      }
    },
    handleStepButtonEvent(button) {
      this.getForm().handleStepButtonEvent(button)
    }
  }
}
</script>
<style lang="scss" >
  .form-renderer-dialog{
    .el-dialog__body {
      padding: 10px 0 5px 0;
    }
    .el-dialog__headerbtn{
      z-index: 99999;
    }
    @media print {
      .el-dialog__headerbtn {
        display: none !important
      }
      .hidden-print{
        padding: 0;
        margin:  0;
      }
    }
  }
</style>
