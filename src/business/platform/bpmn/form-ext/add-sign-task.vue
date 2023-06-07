<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionTitle"
    append-to-body
    top="5vh"
    width="60%"
    @close="closeDialog"
    @opened="openedDialog"
  >
    <el-form
      ref="form"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :label-width="formLabelWidth"
      :rules="rules"
      @submit.native.prevent
    >
      <el-form-item label="补签人员:" prop="addSignTaskUserId">
        <ibps-employee-selector
          v-model="form.addSignTaskUserId"
          multiple
        />
      </el-form-item>
      <el-form-item label="提醒消息:" prop="messageType">
        <ibps-checkbox
          v-model="form.messageType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />

      </el-form-item>
      <el-form-item v-if="!hideOpinion" label="补签原因:" prop="opinion">
        <approval-opinion
          v-model="form.opinion"
          :action="action"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-group" @click="handleSave()">{{ actionTitle }}</el-button>
      <el-button icon="el-icon-circle-close"  type="danger" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import { toAddSignTask } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from '@/utils/action'
import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
export default {
  components: {
    ApprovalOpinion,
    IbpsEmployeeSelector
  },
  props: {
    className: String,
    visible: Boolean,
    action: String,
    title: String,
    taskId: String,
    data: [String, Object],
    hideOpinion: { // 隐藏意见
      type: Boolean,
      default: false
    },
    formOpinion: { // 表单意见
      type: String
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formName: 'form',
      formLabelWidth: '130px',
      messageTypes: [{
        type: 'inner',
        title: '内部消息'
      }, {
        type: 'mail',
        title: '邮件'
      }, {
        type: 'sms',
        title: '短信'
      }],
      defaultForm: {},
      form: {
        addSignTaskUserId: '',
        messageType: 'inner,mail',
        opinion: ''
      },
      rules: {
        addSignTaskUserId: [{ required: true, message: this.$t('validate.required') }],
        opinion: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    actionTitle() {
      if (this.title) {
        return this.title
      }
      return '补签'
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
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    closeDialog() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.$emit('close', false)
    },
    openedDialog() {
      this.dialogLoading = true
      toAddSignTask({
        taskId: this.taskId
      }).then(response => {
        this.messageTypes = this.$utils.parseData(response.variables.messageTypes)
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })

      if (this.$utils.isNotEmpty(this.formOpinion)) {
        this.form.opinion = this.formOpinion
      } else {
        queryIncludeNull(ActionUtils.formatParams(
          {
            'Q^ACTION_^S': this.action,
            'Q^CREATE_BY_^S': this.$store.getters.userId
          })).then(response => {
          const data = response.variables && response.variables.def ? response.variables.def.value || '' : ''
          if (this.$utils.isNotEmpty(data)) {
            this.form.opinion = data
          }
        })
      }
      this.formValidate()
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (this.form.addSignTaskUserId.split(',').includes(this.$store.getters.userId)) {
          ActionUtils.saveErrorMessage('当前人员不能作为补签人员')
          return
        }

        if (valid) {
          this.$emit('action-event', this.action, this.form)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    }
  }
}
</script>
