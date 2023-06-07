<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :title="title"
    top="0"
    width="80%"
    custom-class="client-grant-form-dialog is-fullscreen"
    @open="loadData"
    @close="closeDialog"
  >
    <api-grant-list
      ref="apiGrant"
      :dialog="visible"
      :client-key="clientKey"
      :app-key="appKey"
      :grant-type="grantType"
      :dialog-height="height"
      @close="closeDialog"
      @closeAll="closeAll"
    />
  </el-dialog>
</template>

<script>
import ApiGrantList from '@/views/platform/auth/apiGrant/list'
export default {
  components: {
    ApiGrantList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    clientKey: String,
    appKey: String,
    grantType: String
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogVisible: true,
      height: (document.documentElement.clientHeight || document.body.clientHeigh) - 70
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
    loadData() {
      this.$nextTick(() => {
        this.$refs['apiGrant'].search()
      })
    },
    closeDialog() {
      this.$emit('close', false)
    },
    closeAll() {
      this.dialogVisible = false
      this.$emit('closeAll')
    }
  }
}
</script>
<style lang='scss' >
.client-grant-form-dialog {
  .el-dialog__body{
    padding: 0!important;
  }
}
</style>
