<template>
  <div class="login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('login.title') }}</h3>
        </div>
        <h3><span class="title">{{ $t('login.tenantRegister') }}</span></h3>
        <form-info @keyup.enter.native="handleLogin" />
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'
import LoginInfo from '@/views/system/login/login-info'
import LoginBottom from '@/views/system/login/login-bottom'
import FormInfo from './form'
export default {
  components: {
    LoginInfo,
    LoginBottom,
    FormInfo
  }
}
</script>
