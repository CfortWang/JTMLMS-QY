<template>
  <div class="login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('login.title') }}</h3>

        </div>
        <h3>
          <div v-if="isRegOpenTenant" class="ibps-pl-5">
            <el-radio-group v-model="regType">
              <el-radio-button label="tenant">企业注册</el-radio-button>
              <el-radio-button label="user">用户注册</el-radio-button>
            </el-radio-group>
          </div>
          <span v-else class="title">
            {{ $t('login.register') }}
          </span>
        </h3>
        <tenant-form v-if="regType=='tenant'" />
        <user-form v-else />
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import '@/assets/styles/pages/login.scss'
import LoginInfo from '../login/login-info'
import LoginBottom from '../login/login-bottom'
import UserForm from './user-form'
import TenantForm from './tenant-form'

export default {
  components: {
    LoginInfo,
    LoginBottom,
    UserForm,
    TenantForm
  },
  data() {
    return {
      isRegOpenTenant: false,
      regType: 'user'
    }
  },
  created() {
    this.isRegisterOpen()
  },
  methods: {
    ...mapActions('ibps/saas', [
      'getRegisterTenantOpen'
    ]),
    isRegisterOpen() {
      this.getRegisterTenantOpen().then((data) => {
        this.isRegOpenTenant = true
        this.regType = this.isRegOpenTenant ? 'tenant' : 'user'
      }).catch((e) => {})
    }
  }
}
</script>
