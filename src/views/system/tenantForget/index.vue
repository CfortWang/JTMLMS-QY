<template>
  <div class="login-container pull-height">
    <login-info />
    <div class="login-border pull-height">
      <div class="login-main animated fadeIn">
        <div class="login-title-container">
          <h3 class="title"><i class="ibps-icon-logo" />{{ $t('login.title') }} </h3>
        </div>
        <h3>
          <span class="title">{{ $t('login.forget') }}</span>
          <el-tooltip class="item" effect="light" content="企业管理员才能操作“忘记密码”！" placement="right">
            <i class="el-icon-question" style="color:#409EFF" />
          </el-tooltip>
        </h3>
        <form-info />
        <login-bottom />
      </div>
    </div>

  </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'
import LoginInfo from '../login/login-info'
import LoginBottom from '../login/login-bottom'
import FormInfo from './form'

export default {
  components: {
    LoginInfo,
    LoginBottom,
    FormInfo
  }
}
</script>
