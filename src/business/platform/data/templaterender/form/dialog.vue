<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="data-template-form-renderer-dialog"
    fullscreen
    destroy-on-close
    append-to-body
    @open="loadFormData"
    @close="closeDialog"
  >
   <data-formrender
      ref="formrender"
      :template-key="templateKey"
      :form-key="formKey"
      :print-template-id="printTemplateId"
      :pk-value="pkValue"
      :addDataCont = "addDataCont"
      :dynamicParams = "dynamicParams"
      :toolbars="toolbars"
      :readonly="readonly"
      :default-data="defaultData"
      @close="closeDialog"
      @callback="handleCallback"
    />
  </el-dialog>
</template>
<script>
import DataFormrender from './index'
export default {
  components: {
    DataFormrender
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    templateKey: { // 模版Key
      type: String
    },
    dynamicParams: Object,
    formKey: { // 表单key
      type: String
    },
    addDataCont: { // 表单参数
      type: Object
    },
    printTemplateId: {
      type: String
    },
    pkValue: { // 主键
      type: [String, Number]
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
      dialogVisible: this.visible
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    loadFormData() {
      this.$nextTick(() => {
        this.$refs.formrender.loadFormData()
      })
    },
    handleCallback(data) {
      this.$emit('callback', data)
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
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
