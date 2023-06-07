<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="formData"
    class="login-form"
    status-icon
    label-width="0"
  >
    <el-form-item prop="companyName">
      <el-input
        v-model="formData.companyName"
        :placeholder="$t('login.company')"
        auto-complete="off"
        prefix-icon="iconfont ibps-icon-user"
        @keyup.enter.native="handleRegister"
      />
    </el-form-item>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="code">
          <el-input
            v-model="formData.code"
            :placeholder="$t('login.companyCode')"
            auto-complete="off"
            prefix-icon="iconfont ibps-icon-university"
            @keyup.enter.native="handleRegister"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="scale">
          <el-select
            v-model="formData.scale"
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
      </el-col>
    </el-row>
    <el-form-item prop="area">
      <ibps-address-cascader v-model="formData.area" :data="areaData" level="province" top-val="86" data-type="name" />
    </el-form-item>
    <el-form-item prop="street">
      <el-input
        v-model="formData.street"
        :placeholder="$t('login.street')"
        auto-complete="off"
        prefix-icon="iconfont ibps-icon-user"
        @keyup.enter.native="handleRegister"
      />
    </el-form-item>

    <el-row>
      <el-col :span="16">
        <el-form-item prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="$t('login.fullName')"
            auto-complete="off"
            prefix-icon="iconfont ibps-icon-user"
            @keyup.enter.native="handleRegister"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item prop="gender">
          <el-radio-group v-model="formData.gender" class="register-radio">
            <el-radio label="male">{{ $t('login.gender.male') }}</el-radio>
            <el-radio label="female">{{ $t('login.gender.female') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="email">
      <el-input v-model="formData.email" :placeholder="$t('login.email')" auto-complete="off" prefix-icon="iconfont ibps-icon-envelope" @keyup.enter.native="handleRegister" />
    </el-form-item>
    <el-form-item prop="account">
      <el-input v-model="formData.account" :placeholder="$t('login.account')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" @keyup.enter.native="handleRegister" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="formData.password" :type="passwordType" :placeholder="$t('login.password')" prefix-icon="ibps-icon-lock" auto-complete="off" @keyup.enter.native="handleRegister">
        <i slot="suffix" :class="passwordType=='password'?'ibps-icon-eye-slash':'ibps-icon-eye'" class=" el-input__icon" @click="showPassword" />
      </el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input v-model="formData.phone" :placeholder="$t('login.mobile')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" @keyup.enter.native="handleRegister" />
    </el-form-item>
    <el-form-item>
      <el-form-item prop="validCode">
        <el-input v-model="formData.validCode" :placeholder="$t('login.code')" auto-complete="off" prefix-icon="iconfont ibps-icon-mobile" @keyup.enter.native="handleRegister">
          <template slot="append"><span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ $t(msgKey?'login.msgScuccess':'login.msgInit',{'time':msgTime}) }}</span></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-submit" @click.native.prevent="handleRegister">{{ $t('login.registration') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button plain class="login-submit" @click.native.prevent="handleLogin">{{ $t('login.backLogin') }}</el-button>
      </el-form-item>
    </el-form-item></el-form>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import { sendSmsTenant } from '@/api/oauth2/user'
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
    const valiAccount = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9]*$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('validate.valiAccount')))
      } else {
        callback()
      }
    }
    // const validateSpecialCharacters = (rule, value, callback) => {
    //   const specialCharacters = /((?=[\x21-\x7e]+)[^A-Za-z0-9])/g
    //   if (specialCharacters.test(value)) {
    //     callback(new Error('请勿携带特殊字符'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      msgTime: MSGTIME,
      msgvalidTime: MSGTIME,
      msgKey: false,
      msgvalidKey: false,
      areaData: pca,
      validateCode: validateCode,
      passwordType: 'password',
      defaultArea: ['广东省', '广州市'],
      formData: {
        account: '',
        email: '',
        gender: 'male',
        isSuper: 'Y',
        name: '',
        password: '',
        phone: '',
        id: '',
        code: '',
        validCode: '',
        area: '',
        street: '',
        companyName: '',
        scale: '1-50人'
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: valiAccount }],
        name: [{ required: true, message: this.$t('validate.required') }],
        email: [
          { required: true, message: this.$t('validate.required') },
          { type: 'email', message: '请输入正确的邮箱地址', min: 3, max: 18, trigger: ['blur', 'change'] }
        ],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, message: this.$t('validate.required') }],
        validCode: [{ required: true, trigger: 'blur', validator: validateCode }],
        companyName: [{ required: true, message: this.$t('validate.required') }],
        code: [{ required: true, validator: valiAccount }],
        gender: [{ required: true, message: this.$t('validate.required') }],
        scale: [{ required: true, message: this.$t('validate.required') }]
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
      const isMobile = validateMobile(this.formData.phone)
      if (!isMobile.result) {
        this.$message.closeAll()
        this.$message.error(this.$t('login.mobileCorrect'))
        this.$el[11].focus()
        return
      }

      // 真正发送验证码
      sendSmsTenant({
        mobile: this.formData.phone,
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
      }).catch((e) => {})
    },
    handleRegister() {
      const loginForm = {
        adminUser: {
          account: this.formData.account,
          email: this.formData.email,
          gender: this.formData.gender,
          isSuper: 'Y',
          name: this.formData.name,
          password: this.formData.password,
          phone: this.formData.phone
        },
        code: this.formData.code,
        validCode: this.formData.validCode,
        area: JSON.stringify(this.formData.area),
        street: this.formData.street,
        name: this.formData.companyName,
        scale: this.formData.scale
      }
      const data = JSON.stringify(loginForm)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('ibps/saas/register', data).then(res => {
            this.$confirm('企业注册成功', '提示', {
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

<style  lang="scss">
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
<style  lang="scss">
.register-radio{
  .el-radio{
    margin-right:0;
    margin-left: 12px;
  }
}
</style>
