<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title+'选择'"
    top="10vh"
    width="70%"
    class="user-plugins-dialog"
    append-to-body
    @close="closeDialog"
  >
    <component
      :is="pluginsType"
      ref="userPlugin"
      v-model="formData"
      :type="userType"
    />

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>

  </el-dialog>
</template>

<script>
import Plugins from './plugins'
import { kebabCase } from 'lodash'

export default {
  components: Plugins,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object,
    userType: String,
    title: String
  },
  data() {
    return {
      formData: {},
      dialogVisible: this.visible,
      actions: [
        { key: 'confirm', label: '确定' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    pluginsType() {
      return 'user-plugin-' + kebabCase(this.userType)
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.formData = JSON.parse(JSON.stringify(this.data))
        }
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleConfirm() {
      const rtn = this.$refs.userPlugin.getData()
      if (rtn && rtn.result) {
        this.closeDialog()
        this.$emit('callback', rtn.data)
      } else {
        this.$message.closeAll()
        this.$message({
          message: rtn.message || '出错了',
          type: 'warning'
        })
      }
    },
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
