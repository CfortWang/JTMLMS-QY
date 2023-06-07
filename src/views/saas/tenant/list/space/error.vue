<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="dialog"
    :class="readonly?'leave-dialog-readonly':'leave-dialog-disReadonly'"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="tenantForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="tenant"
      :label-width="formLabelWidth"
      label-suffix=":"
      @submit.native.prevent
    >
      <el-input
        v-model="tenant.cause"
        autosize
        type="textarea"
        :readonly="true"
      />
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getSpace } from '@/api/saas/tenant/tenant'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String
  },
  data() {
    return {
      formName: 'tenantForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      tenant: {},
      toolbars: [
        { key: 'cancel' }
      ]
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
    },
    tenant: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.code)) {
            val.code = ''
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
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
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        return
      }
      this.dialogLoading = true
      getSpace({
        id: this.formId
      }).then(response => {
        this.tenant = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }
}
</script>

