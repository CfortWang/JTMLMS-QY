<template>
  <!-- :title="title"-->
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :top="dialogTop||'1vh'"
    :width="dialogWidth||'90%'"
    class="js-custom-dialog"
    append-to-body
    :fullscreen="components.fullscreen||false"
    @open="getFormData"
    @close="closeDialog"
  >
    <div
      v-if="components.customBody"
      :style="{'height':bodyHeight||'100px','width':bodyWidth||'100px'}"
      v-html="$utils.formatText(components.customBody)"
    />
    <iframe
      v-else
      :src="components.url"
      :height="components.bodyHeight||'100%'"
      :width="components.bodyWidth||'100%'"
      frameborder="0"
      scrolling="no"
    />
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object,
    id: String,
    toolbars: {
      type: Array,
      default: () => [
        { key: 'save' },
        { key: 'cancel' }
      ]
    },
    components: Object,
    dialogHeight: String,
    dialogWidth: String,
    dialogTop: String,
    bodyHeight: String,
    bodyWidth: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      templateType: '',
      template: ''
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
    getFormData() {
      // console.log(this.components)
    },
    closeDialog() {
      this.$emit('close', false)
    },
    handleSave() {},
    handleActionEvent({ key }) {
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
    }
  }
}
</script>
<style lang="scss" >
.js-custom-dialog{
  .el-dialog__body{
      height:  calc(100vh) !important;
      margin: -9px !important;
      padding: 0;
	  overflow: hidden;
  }
  .el-dialog__header{
    padding: 0px;
  }
  .el-dialog__headerbtn i {
   font-size: 28px;
   font-weight: bold;
   background-color: #FFFFFF;
   border-radius: 8px;
   margin-top: -8px;
  }
}
</style>
