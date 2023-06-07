<template>
  <el-dialog
    v-if="dialogVisible"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    top="0"
    custom-class="tenant-admin-dialog is-fullscreen"
    width="80%"
    @close="closeDialog"
  >
    <el-tabs
      v-model="activeName"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      class="emp-tab"
      @tab-click="flush"
    >
      <el-tab-pane label="管理员列表" name="list">
        <list
          :id="formId"
          ref="list"
          :tenant-name="tenantName"
          :readonly="readonly"
        />
      </el-tab-pane>

      <el-tab-pane label="管理员审核列表" name="approve-list">
        <approve-list
          :id="formId"
          ref="approveList"
          :tenant-name="tenantName"
          :readonly="readonly"
        />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import List from './list'
import ApproveList from './approveList'

export default {
  components: {
    List,
    ApproveList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String]
    },
    title: String,
    tenantName: String
  },
  data() {
    return {
      formName: 'tenantForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      activeName: 'list',
      defaultForm: {}
    }
  },
  computed: {
    formId() {
      return this.id
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
  created() {
  },
  methods: {
    // 关闭当前窗口
    closeDialog() {
      this.activeName = 'list'
      this.$emit('close', false)
    },
    flush(targetName) {
      if (targetName.name === 'list') {
        this.$refs.list.search()
      } else {
        this.$refs.approveList.search()
      }
    }
  }
}
</script>
<style lang='scss'>
.tenant-admin-dialog{
  .el-dialog__body{
    padding: 10px 20px;
  }
}
</style>
