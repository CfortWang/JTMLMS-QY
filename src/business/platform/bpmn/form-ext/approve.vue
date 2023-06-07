<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="actionTitle"
    :class="className"
    class="bpmn-agree-dialog"
    append-to-body
    top="10vh"
    width="60%"
    @close="closeDialog"
    @opened="getFormData"
  >
    <el-form
      ref="form"
      :element-loading-text="$t('common.loading')"
      :model="approve"
      :rules="rules"
      @submit.native.prevent
    >
      <el-form-item
        v-if="action === 'revoke'"
        label="返回方式:"
        prop="backHandMode"
      >
        <el-radio-group v-model="backHandMode">
          <el-radio label="normal">按流程图执行</el-radio>
          <el-radio label="direct">回到本节点</el-radio>
        </el-radio-group>

      </el-form-item>
      <el-form-item v-if="!hideOpinion" :label="opinionLabel" prop="opinion">
        <approval-opinion
          v-model="approve.opinion"
          :action="action"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">{{ buttonLabel }}</el-button>
      <el-button icon="el-icon-circle-close" type="danger" @click="closeDialog()">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { doEndProcess, agreeBatch, revoke } from '@/api/platform/bpmn/bpmTask'
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import ActionUtils from '@/utils/action'

import ApprovalOpinion from '@/business/platform/bpmn/components/approval-opinion'
export default {
  components: {
    ApprovalOpinion
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
    },
    sameTitleName: { // 标题和按钮名称相同
      type: Boolean,
      default: false
    },
    callbackEvent: { // 是否回调事件，还是默认的方法
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: false,
      formName: 'form',
      formLabelWidth: '130px',
      loading: null,
      backHandMode: 'normal',
      defaultForm: {},
      approve: {
        opinion: ''
      },
      rules: {
        opinion: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    actionTitle() {
      if (this.title) {
        return this.title
      }
      let title = '审批流程'
      switch (this.action) {
        case 'agree':
          title = '批量同意审批'
          break
        case 'endProcess':
          title = '终止流程'
          break
        case 'stop':
          title = '批量终止流程'
          break
        case 'revoke':
          title = '撤销'
          break
        default:
          break
      }
      return title
    },
    buttonLabel() {
      if (this.sameTitleName) {
        return this.actionTitle
      }
      let label = '保存'
      switch (this.action) {
        case 'agree':
          label = '同意'
          break
        case 'endProcess':
          label = '确定'
          break
        case 'stop':
          label = '终止'
          break
        case 'revoke':
          label = '撤销'
          break
        default:
          break
      }
      return label
    },
    opinionLabel() {
      let label = '审批意见'
      switch (this.action) {
        case 'agree':
          label = '审批意见'
          break
        case 'endProcess':
        case 'stop':
          label = '终止原因'
          break
        case 'revoke':
          label = '撤销原因'
          break
        default:
          break
      }
      return label + ':'
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
    this.defaultForm = JSON.parse(JSON.stringify(this.approve))
  },
  methods: {
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 加载常用语
     */
    loadCommonStatment() {
      let action = this.action
      if (action === 'endProcess' || action === 'stop') {
        action = 'manualend'
      }
      queryIncludeNull(
        ActionUtils.formatParams({
          'Q^ACTION_^S': action,
          'Q^CREATE_BY_^S': this.$store.getters.userId
        })).then(response => {
        const data = response.variables !== {} && response.variables.def ? response.variables.def.value : ''
        this.approve.opinion = data
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.loadCommonStatment()
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        if (this.action === 'agree') {
          this.rules.opinion[0].required = false
        } else {
          this.rules.opinion[0].required = true
        }
        this.approve = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      if (this.callbackEvent) {
        this.$emit('action-event', this.action, {
          opinion: this.approve.opinion
        })
        return
      }

      this.loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      switch (this.action) {
        case 'agree':
          this.agreeBatch()
          break
        case 'endProcess':
        case 'stop':
          this.doEndProcess()
          break
        case 'revoke':
          this.revoke()
          break
        default:
          break
      }
    },
    /**
     * 批量同意
     */
    agreeBatch() {
      agreeBatch({
        taskIds: this.taskId,
        opinion: this.approve.opinion
      }).then(response => {
        this.callback(response)
      }).catch((err) => {
        this.loading.close()
        console.error(err)
      })
    },
    /**
     * 批量终止
     */
    doEndProcess() {
      doEndProcess({
        taskId: this.taskId,
        endReason: this.approve.opinion
      }).then(response => {
        this.callback(response)
      }).catch((err) => {
        this.loading.close()
        console.error(err)
      })
    },
    /**
     * 撤销任务
     */
    revoke() {
      revoke({
        taskId: this.taskId,
        backHandMode: this.backHandMode,
        opinion: this.approve.opinion
      }).then(response => {
        this.callback(response)
      }).catch((err) => {
        this.loading.close()
        console.error(err)
      })
    },
    callback(response) {
      this.loading.close()
      this.$emit('callback', this)
      ActionUtils.saveSuccessAlert(response.message, (rtn) => {
        if (this.$utils.isEmpty(this.formId)) {
          this.$refs[this.formName].resetFields()
        }
        if (rtn) {
          this.closeDialog()
        }
      })
    }
    // handleSave() {
    //   this.$refs[this.formName].validate(valid => {
    //     if (valid) {
    //       this.$emit('action-event', this.action, {
    //         opinion: this.approve.opinion
    //       })
    //     } else {
    //       ActionUtils.saveErrorMessage()
    //     }
    //   })
    // }
  }
}
</script>
