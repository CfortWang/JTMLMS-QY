<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
  >
    <el-radio-group v-model="radios">
      <div style="margin-top: 20px">
        <el-radio :label="'N'">子菜单显示到菜单</el-radio>
      </div>
      <div style="margin-top: 20px">
        <el-radio :label="'Y'">子菜单不显示到菜单</el-radio>
      </div>
      <div style="margin-top: 20px">
        <el-radio :label="'C'">子菜单层级转换为该菜单层级</el-radio>
      </div>
    </el-radio-group>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    resourceId: String
  },
  data() {
    return {
      title: '设置',
      formName: 'settingForm',
      dialogVisible: this.visible,
      dialogLoading: false,
      radios: 'Y',
      toolbars: [
        { key: 'confirm' }
      ]
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
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleSave()
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    handleSave() {
      if (this.radios === 'N') {
        this.$emit('save', 'N')
      } else if (this.radios === 'Y') {
        this.$emit('save', 'Y')
      } else if (this.radios === 'C') {
        this.$emit('save', 'C')
      }
    }
  }

}
</script>
<style lang="scss">
.resources-import-dialog{
  .el-dialog__body{
    height:  calc(32vh - 120px) !important;
  }
}
</style>
