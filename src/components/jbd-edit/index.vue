<template>
 <el-dialog
   :visible.sync="dialogVisible"
   :close-on-click-modal="false"
   :close-on-press-escape="false"
   class="bpmn-formrenderer-dialog"
   fullscreen
   destroy-on-close
   append-to-body
   @close="closeDialog"
 >
    <panle/>
    <slot  name="form"/>



  </el-dialog>
</template>
<script>


  import panle from '../jbd-panel'



  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
     panle,
    },
    data() {
      return {
        dialogVisible: this.visible,
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
      // 关闭当前窗口
      closeDialog() {
        this.$emit('close', false)
      },
      // 提交保存数据
      saveData() {
      },

    }
  }
</script>
<style lang="scss">
  .is-required:not(.is-no-asterisk) {
    .dynamic-form-table__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }
</style>
