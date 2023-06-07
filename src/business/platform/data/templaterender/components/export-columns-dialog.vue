<template>
  <el-dialog
    title="导出字段勾选"
    :visible.sync="dialogTableVisible"
    append-to-body
    width="15%"
    class="templaterender-export-columns-dialog"
    @close="closeDialog"
    @open="openDialog"
  >
    <el-table
      ref="exportFieldsTable"
      :data="tableData"
      tooltip-effect="dark"
      row-key="name"
      :height="`calc(60vh - 30px) !important`"
      style="width: 100%;height:100%;"
      @selection-change="handleSelectionChange"
      @row-click="handleRowclick"
    >
      <el-table-column type="selection" :selectable="selectInit" width="50" reserve-selection />
      <el-table-column property="label" label="字段名" />
    </el-table>
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
    data: {
      type: Object
    },
    template: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    },
    action: String,
    pagination: Object

  },
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      dialogTableVisible: false,
      toolbars: [
        { key: 'save' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogTableVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleRowclick(row) {
      if (row.rights.length > 0 && row.rights[0].type !== 'none') {
        this.$refs.exportFieldsTable.toggleRowSelection(row)
      }
    },
    handleSave() {
      if (this.$utils.isEmpty(this.multipleSelection)) {
        this.$message({
          message: '导出字段不能为空！',
          type: 'warning'
        })
        return
      }
      this.$emit('callback', this.multipleSelection)
      this.closeDialog()
    },
    selectInit(row, index) {
      if (row.rights.length > 0 && row.rights[0].type === 'none') {
        return false // 不可勾选
      } else {
        return true // 可勾选
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
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
    },
    openDialog() {
      this.tableData = this.data.export_columns.fields
      this.$nextTick(() => {
        this.tableData.forEach(t => {
          if (t.rights.length > 0 && t.rights[0].type !== 'none') {
            this.$refs.exportFieldsTable.toggleRowSelection(t, true)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.templaterender-export-columns-dialog{
  .el-dialog__body{
    padding:0 !important;
    height: calc(60vh - 30px) !important;
  }
}
</style>
