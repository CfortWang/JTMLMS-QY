<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    status-icon
    label-width="0"
  >
    <el-form-item prop="company">
      <el-input
        v-model="loginForm.company"
        :placeholder="$t('login.company')"
        autocomplete="off"
        prefix-icon="iconfont ibps-icon-university"
        clearable
        @keyup.enter.native="handleRegister"
      />
    </el-form-item>
    <el-form-item prop="companyCode">
      <el-input
        v-model="loginForm.code"
        :placeholder="$t('login.companyCode')"
        autocomplete="off"
        prefix-icon="iconfont ibps-icon-university"
        @keyup.enter.native="handleRegister"
      />
    </el-form-item>
    <el-form-item prop="scale">
      <el-select
        v-model="loginForm.scale"
        placeholder="公司规模"
        style="width:100%;"
      >
        <el-option label="1-50人" value="1-50人" />
        <el-option label="51-100人" value="51-100人" />
        <el-option label="101-200人" value="101-200人" />
        <el-option label="201-500人" value="201-500人" />
        <el-option label="501-1000人" value="501-1000人" />
        <el-option label="1001及以上" value="1001及以上" />
      </el-select>
    </el-form-item>
    <el-form-item prop="area">
      <ibps-address-cascader v-model="area" :data="areaData" level="province" top-val="86" data-type="name" />
    </el-form-item>
    <el-form-item prop="fullName">
      <el-input
        v-model="loginForm.fullName"
        :placeholder="$t('login.fullName')"
        autocomplete="off"
        prefix-icon="iconfont ibps-icon-user"
        @keyup.enter.native="handleRegister"
      />
    </el-form-item>
    <el-form-item prop="gender">
      <el-radio-group v-model="loginForm.gender">
        <el-radio label="male">{{ $t('login.gender.male') }}</el-radio>
        <el-radio label="female">{{ $t('login.gender.female') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="email">
      <el-input v-model="loginForm.email" :placeholder="$t('login.email')" autocomplete="off" prefix-icon="iconfont ibps-icon-envelope" @keyup.enter.native="handleRegister" />
    </el-form-item>
    <el-form-item prop="mobile">
      <el-input v-model="loginForm.mobile" :placeholder="$t('login.mobile')" autocomplete="off" prefix-icon="iconfont ibps-icon-mobile" @keyup.enter.native="handleRegister" />
    </el-form-item>
    <el-form-item prop="passWd">
      <el-input v-model="loginForm.passWd" :type="passwordType" :placeholder="$t('login.password')" prefix-icon="ibps-icon-lock" autocomplete="off" @keyup.enter.native="handleRegister">
        <i slot="suffix" :class="passwordType=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword" />
      </el-input>
    </el-form-item>
    <el-form-item prop="validCode">
      <el-input v-model="loginForm.validCode" :placeholder="$t('login.code')" autocomplete="off" prefix-icon="iconfont ibps-icon-qrcode" @keyup.enter.native="handleRegister">
        <template slot="append"><span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ $t(msgKey?'login.msgScuccess':'login.msgInit',{'time':msgTime}) }}</span></template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" class="login-submit" @click.native.prevent="handleRegister">{{ $t('login.registration') }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button plain class="login-submit" @click.native.prevent="handleLogin">{{ $t('login.backLogin') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validateMobile, validateEmpty } from '@/utils/validate'
import { sendSms } from '@/api/oauth2/user'
import { pca } from 'area-data'
import IbpsAddressCascader from '@/components/ibps-address/cascader'

const MSGTIME = 60 // 时间 60秒
export default {
  name: 'codelogin',
  components: {
    IbpsAddressCascader
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      const isMobile = validateMobile(value)
      if (!isMobile.result) {
        callback(new Error(this.$t('validate.mobile.' + isMobile.msg)))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error(this.$t('login.codeLength')))
      } else {
        callback()
      }
    }
    const validateSpecialCharacters = (rule, value, callback) => {
      if (this.$utils.isEmpty(value)) {
        return validateEmpty(rule, value, callback)
      }
      const specialCharacters = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/g
      if (specialCharacters.test(value)) {
        callback(new Error('请勿携带特殊字符'))
      } else {
        callback()
      }
    }
    return {
      msgTime: MSGTIME,
      msgKey: false,
      areaData: pca,
      passwordType: 'password',
      defaultArea: ['广东省', '广州市'],
      loginForm: {
        company: '',
        companyCode: '',
        fullName: '',
        gender: 'female',
        area: '',
        mobile: '',
        passWd: '',
        validCode: ''
      },
      loginRules: {
        fullName: [{ required: true, trigger: 'blur', validator: validateSpecialCharacters }],
        company: [{ required: true, trigger: 'blur', validator: validateSpecialCharacters }],
        address: [{ required: true, message: this.$t('validate.required') }],
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        passWd: [{ required: true, message: this.$t('validate.required') }],
        validCode: [{ required: true, trigger: 'change', validator: validateCode }]
      }
    }
  },
  computed: {
    area: {
      get() {
        if (this.loginForm.area === '') {
          return this.defaultArea
        } else {
          return this.loginForm.area.split('-')
        }
      },
      set(newValue) {
        this.loginForm.area = newValue.join('-')
      }
    }
  },
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // 发送验证码
    handleSend() {
      const isMobile = validateMobile(this.loginForm.mobile)
      if (!isMobile.result) {
        this.$message.closeAll()
        this.$message.error(this.$t('login.mobileCorrect'))
        this.$el[5].focus()
        return
      }

      // 真正发送验证码
      sendSms({
        mobile: this.loginForm.mobile,
        forget: false
      }).then((data) => {
        if (this.msgKey) { return }
        this.msgKey = true
        const time = setInterval(() => {
          this.msgTime--
          if (this.msgTime === 0) {
            this.msgTime = MSGTIME
            this.msgKey = false
            clearInterval(time)
          }
        }, 1000)
      }).catch((e) => {

      })
    },
    handleRegister() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('ibps/saas/register', this.loginForm).then(res => {
            this.$confirm('注册帐号成功', '提示', {
              confirmButtonText: '返回登录',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({ path: '/login' })
            }).catch(() => {
            })
          })
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
</style>
