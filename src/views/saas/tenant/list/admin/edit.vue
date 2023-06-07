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
      :model="user"
      :rules="rules"
      :label-width="formLabelWidth"
      label-suffix=":"
      @submit.native.prevent
    >
      <el-form-item v-if="tenantName" :label="$t('platform.saas.tenant.prop.parentName')" prop="parentName">
        <span>{{ tenantName }}</span>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-if="!readonly" v-model="user.name" v-pinyin="{vm:user,key:'account'}" maxlength="64" />
        <span v-else>{{ user.name }}</span>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-if="!readonly" v-model="user.account" :disabled="formId!==''" />
        <span v-else>{{ user.account }}</span>
      </el-form-item>
      <el-form-item v-show="!user.id" label="密码" prop="password">
        <el-input v-if="!readonly" v-model="user.password" autocomplete="off" type="password" />
        <span v-else>{{ user.password }}</span>
      </el-form-item>
      <!-- <el-form-item v-if="readonly" label="是否管理员" prop="isSuper">
        <el-tag :type="user.isSuper|optionsFilter(isSuperOptions,'type')">
          {{ user.isSuper|optionsFilter(isSuperOptions,'label') }}
        </el-tag>
      </el-form-item> -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-if="!readonly" v-model="user.phone" :disabled="formId!==''" />
        <span v-else>{{ user.phone }}</span>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-if="!readonly" v-model="user.email" :disabled="formId!==''" />
        <span v-else>{{ user.email }}</span>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-if="!readonly" v-model="user.gender" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in genderOption"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <span v-else>{{ user.gender|optionsFilter(genderOption, 'label') }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="状态" prop="status">
        <span>{{ user.status|optionsFilter(approveStatusOptions,'label') }}</span>
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
import { save, get } from '@/api/saas/tenant/user'
import { getDefaultUserSecurity } from '@/api/platform/auth/userSecurity'
import ActionUtils from '@/utils/action'
import { approveStatusOptions, genderOption, isSuperOptions } from '../constants'

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
    tenant: String,
    title: String,
    tenantName: String
  },
  data() {
    const validateName = (rule, value, callback) => {
      const re = /[^a-zA-Z0-9\u4E00-\u9FA5]{1,255}$/g
      if (re.test(value)) {
        callback(new Error('字符请勿携带特殊字符或者空格'))
      } else {
        callback()
      }
    }
    const validateAccount = (rule, value, callback) => {
      const re = /^[a-zA-Z][0-9a-zA-Z]{1,192}$/
      if (!re.test(value)) {
        callback(new Error('账号必须是由数字字母组成，以字母开头，至少3位'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      const re = /^1[3456789]\d{9}$/
      if (!re.test(value)) {
        callback(new Error('请填入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      var search = '@'
      var start = value.indexOf(search)// 获得字符串的开始位置
      var result = value.substring(start, search.length - start)
      const re = /^[0-9a-zA-Z]{1}[0-9a-zA-Z_.-]{1,16}[0-9a-zA-Z]{1}$/
      if (!re.test(result) && result.length > 3 && result.length < 18) {
        callback(new Error('必须以字母或者数字开头；字母或者数字结尾（结尾不包括邮箱后缀名），且字符类型为字母、数字、下划线、点、减号'))
      } else if (!re.test(result) && (result.length > 18 || result.length < 3)) {
        callback(new Error('长度最少为3位，最多为18位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      // const re = /^[0-9a-zA-Z]{1,128}$/
      const complexityRegular = this.regx
      if (value !== undefined) {
        if (this.userSecurity.complexity.length === 0) {
          // if (!re.test(value)) {
          //   callback(new Error('密码必须是由数字字母组成，至少1位'))
          // } else {
          callback()
          // }
        } else {
          const flag = []
          for (var l in complexityRegular) {
            if (value.match(complexityRegular[l]) !== null) {
              flag.push(l)
            }
          }
          if (flag.toString() !== this.userSecurity.complexity.toString()) {
            callback(new Error('格式：' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
          } else {
            if (value.length > this.userSecurity.maxLength || value.length < this.userSecurity.minLength) {
              callback(new Error('格式：' + this.userSecurity.maxLengthText + ';' + this.userSecurity.minLengthText + ';' + this.userSecurity.complexityText))
            } else {
              callback()
            }
          }
        }
      } else {
        callback()
      }
    }

    return {
      formName: 'tenantForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      approveStatusOptions: approveStatusOptions,
      genderOption: genderOption,
      isSuperOptions: isSuperOptions,
      isSuper: this.$store.getters.isSuper,
      defaultForm: {},
      user: {
        name: '',
        status: 'PASSED',
        account: '',
        gender: 'male',
        tenantId: this.tenant,
        isSuper: 'Y',
        password: '',
        tenantName: this.tenantName
      },
      // 用户安全设置
      userSecurity: {
        complexity: [],
        complexityText: '',
        maxLength: '',
        maxLengthText: '',
        minLength: '',
        minLengthText: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateName, trigger: 'blur' }
        ],
        account: [
          { required: true, message: this.$t('validate.required') },
          { type: 'string', min: 3, max: 128, message: '帐号长度至少3位,至多128位', trigger: 'blur' },
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required') },
          { type: 'string', min: 1, max: 128, message: '密码长度至少3位,至多128位', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('validate.required') },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('validate.required') },
          { type: 'email', message: '请输入正确的邮箱地址', min: 3, max: 18, trigger: ['blur', 'change'] },
          { validator: validateEmail, trigger: 'blur' }
        ],
        gender: [{ required: true, message: this.$t('validate.required') }],
        status: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
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
    user: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.account)) {
            val.account = ''
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.user))
  },
  methods: {
    handleGetDefaultUserSecurity() {
      getDefaultUserSecurity().then(response => {
        const userSecurityTextObj = this.userSecurityTextObj
        const complexityArr = response.data.complexity.split(',').sort()
        const arr = []
        complexityArr.forEach(i => {
          arr.push(userSecurityTextObj[parseInt(i)])
        })
        this.userSecurity.complexity = complexityArr
        this.userSecurity.complexityText = arr.join(',')
        this.userSecurity.maxLength = response.data.maxLength
        this.userSecurity.maxLengthText = '最大长度' + response.data.maxLength
        this.userSecurity.minLength = response.data.minLength
        this.userSecurity.minLengthText = '最小长度' + response.data.minLength
      }).catch(() => {})
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
      save(this.user).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.user = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.user = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
// .leave-dialog-readonly{
//   .el-dialog__body{
//     height:  calc(42vh - 140px) !important;
//   }
// }
// .leave-dialog-disReadonly{
//   .el-dialog__body{
//     height: calc(32vh - 140px) !important;
//   }
// }
</style>
