<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="dialog"
    :class="isReset?'other-changePassword_dialog':'super-changePassword_dialog'"
    @open="formValidate"
    @close="closeDialog"
  >
    <el-form
      ref="passwordForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="password"
      :rules="rules"
      :label-width="formLabelWidth"
      label-suffix=":"
      status-icon
      @submit.native.prevent
      style="margin: 20px;"
    >
      <el-form-item v-if="!isReset" :label="$t('platform.org.employee.change-password.primitivePassword')" prop="primitivePassword">
        <el-input v-model="password.primitivePassword" type="password" autocomplete="off" clearable show-password/>
      </el-form-item>
      <el-form-item :label="$t('platform.org.employee.change-password.newPassword')" prop="newPassword">
        <el-input v-model="password.newPassword" type="password" autocomplete="off" clearable show-password/>
      </el-form-item>
      <el-form-item :label="$t('platform.org.employee.change-password.repeatPassword')" prop="repeatPassword">
        <el-input v-model="password.repeatPassword" type="password" autocomplete="off" clearable show-password/>
      </el-form-item>
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
import { changePassword, registerChangePassword } from '@/api/platform/org/user'
import { mapActions } from 'vuex'
import ActionUtils from '@/utils/action'

export default {
  props: {
    title: {
      type: String,
      default: () => {
        return this.$t('platform.org.employee.change-password.title')
      }
    },
    visible: Boolean,
    ids: String,
    regOpen: {
      type: Boolean,
      default: false
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.password.repeatPassword !== '') {
          this.$refs[this.formName].validateField('repeatPassword')
        }
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      if (this.restoreDefaultPassW !== '') return
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.password.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '140px',
      formName: 'passwordForm',
      dialogLoading: false,
      dialogVisible: this.visible,
      restoreDefaultPassW: '',
      rules: {
        primitivePassword: [{ required: true, message: this.$t('validate.required') }],
        newPassword: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateNewPassword, trigger: 'change' }
        ],
        repeatPassword: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateRepeatPassword, trigger: 'change' }
        ]
      },
      password: {
        userIds: this.ids,
        // isReset: 0, // 是否重置，0-非重置、非0-重置
        newPassword: '',
        repeatPassword: '',
        primitivePassword: ''// 原始密码
      },
      toolbars: [
        { key: 'save' },
        { key: 'reset',
          type: 'warning',
          label: this.$t('platform.org.employee.change-password.reset'),
          icon: 'ibps-icon-reply',
          hidden: () => { return !this.isReset }
        },
        { key: 'cancel' }
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
    ...mapActions({
      logout: 'ibps/account/logout'
    }),
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'reset':
          this.restoreDefault()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        vm: this,
        confirm: false
      })
    },
    // 提交（校验）
    handleSave() {
      if (this.isReset) {
        this.rules['primitivePassword'] = [{ required: false, message: this.$t('validate.required') }]
      }
      if (this.restoreDefaultPassW === 'restoreDefault') {
        this.saveData()
        return
      }
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          this.restoreDefaultPassW = ''
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      this.password.userIds = this.ids
      if (this.$store.getters.regOpen) {
        this.password.reset = 0 // 0-非重置、1-重置
        this.password.userIds = this.password.userIds.split(',')
        registerChangePassword(this.password).then(response => {
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            this.logOff()
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.error(err)
        })
      } else {
        this.restoreDefaultPassW === 'restoreDefault' ? this.password.reset = 2 : !this.isReset ? this.password.reset = 0 : this.password.reset = 1
        this.password.userIds = this.password.userIds.split(',')
        changePassword(this.password).then(response => {
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (rtn) {
              this.closeDialog()
            }
          })
        }).catch((err) => {
          console.error(err)
        })
      }
    },
    /**
     * 还原默认
     */
    restoreDefault() {
      this.password.newPassword = '1'
      this.restoreDefaultPassW = 'restoreDefault'
      this.saveData()
    },
    // 关闭当前窗口
    closeDialog() {
      this.restoreDefaultPassW = ''
      this.$emit('close', false)
      this.$refs[this.formName].resetFields() // 初始化状态
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    }
  }
}
</script>
