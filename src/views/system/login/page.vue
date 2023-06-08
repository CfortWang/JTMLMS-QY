<template>
    <div class="jbd-login-page-bg">
        <el-container class="login-container" @keyup.enter="handleLogin">
            <el-main style="width: 100%; height: 100%; overflow: hidden;border: 0;display: flex;
            justify-content: right;">
                <div class="">
                    <div class="logoTitle">
                        <h1 class="login-title">
                            <img src="../../../assets/images/login/logo.jpg" class="logoImg" />
                            金源信通
                        </h1>
                        <h1 class="login-title" style="font-size: 52px">金通医学实验室管理系统</h1>
                    </div>

                    <div class="jbd-login-page-main">
                        <h3>
                            <span>{{ $t('login.userLogin') }}</span>
                            <ibps-api-base-url-controller v-if="$nodeEnv === 'development'">
                                <el-tooltip effect="dark" :content="$t('navbar.switchEnvironment')" placement="bottom">
                                    <el-button type="text" class="ibps-fr ibps-mr-5 btn-text can-hover">
                                        <ibps-icon name="wifi" style="font-size: 18px" />
                                    </el-button>
                                </el-tooltip>
                            </ibps-api-base-url-controller>
                        </h3>
                        <user-login />
                        <login-bottom />
                    </div>
                </div>
            </el-main>
            <el-footer style="width: 80%">
                <div style="font-size: 12px; text-align: right">
                    <hr />
                    <div><i class="el-icon-s-platform" /> 深圳市金源信通科技有限公司开发</div>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>
<script>
import '@/assets/styles/pages/login.scss'
import LoginBottom from './login-bottom'
import UserLogin from './user-login'
// import IbpsPluginLanguage from '@/plugins/language'
import IbpsApiBaseUrlController from '@/plugins/api-base-url'

export default {
    name: 'login',
    components: {
        LoginBottom,
        UserLogin,
        // IbpsPluginLanguage,
        IbpsApiBaseUrlController
    },
    data() {
        return {
            activeName: 'user'
        }
    },
    methods: {
        handleLogin() {}
    }
}
</script>
<style>
.jbd-login-page-bg {
    background-image: url('../../../assets/images/login/bgImg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.jbd-login-page-main {
    margin-top: 80px;
    margin-left: 3%;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 30px;
    height: 340px;
    width: 300px;
    background-repeat: no-repeat;
    border-radius: 5%;
    box-sizing: border-box;
}

.login-title {
    font-size: 26px;
    color: #01a39e;

}
.logoImg {
    width: 30px;
    height: 30px;
    position: relative;
    top: 5px;
}
</style>

<style scoped>
.logoTitle {
    margin: 30px;
}
</style>
