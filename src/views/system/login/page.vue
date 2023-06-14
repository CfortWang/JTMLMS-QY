<template>
    <div class="jbd-login-page-bg">
        <el-container class="login-container" @keyup.enter="handleLogin">
            <el-main style="width: 100%; height: 100%; overflow: hidden; border: 0; display: flex; justify-content: right">
                <div class="">
                    <div class="logoTitle">
                        <h1 class="login-title">
                            <img src="@/assets/images/login/logo.jpg" class="logoImg" />
                            <span style="font-size: 24px; margin-left: 5px">金源信通</span>
                        </h1>
                        <h1 class="login-title">金通医学实验室管理系统</h1>
                    </div>

                    <div class="jbd-login-page-main">
                        <h3 class="Loginh3">
                            <span class="loginTong">{{ $t('login.userLogin') }}</span>
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
            <el-footer style="width: 100%">
                <hr style="color: #aaaaaa" />
                <div class="centerCox">
                    <div class="footerLeft"></div>
                    <div class="footerCenter">推荐使用IE 11、Chrome 69、Firefox 65及以上版本的浏览器，推荐显示分辨率：1920 * 1080</div>
                    <div class="footerRight">
                        <div><i class="el-icon-s-platform" /> 深圳市金源信通科技有限公司开发</div>
                    </div>
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
    background-image: url('~@/assets/images/login/bgImg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.jbd-login-page-main {
    margin: 80px auto 0;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    /* height: 340px; */
    width: 300px;
    background-repeat: no-repeat;
    border-radius: 5%;
    box-sizing: border-box;
    background: #fff;
}

.login-title {
    font-size: 52px;
    color: #01a39e;
}
.logoImg {
    width: 30px;
    height: 30px;
    position: relative;
    top: 5px;
}
</style>

<style lang="scss" scoped>
.logoTitle {
    margin: 30px;
}

.centerCox {
    color: #4f4f4f;
    display: flex;
    justify-content: space-between;
    align-content: center;
    .footerLeft {
        width: 280px;
    }

    .footerCenter {
        font-size: 12px;
        text-align: center;
    }

    .footerRight {
        width: 280px;
        font-size: 14px;
    }
}
hr {
    border: 1px solid white;
}

.el-footer {
    padding: 0;
}

@media (min-width: 1350px) and (max-width: 1900px) {
    .jbd-login-page-main {
        margin: 0 auto;
        width: 260px;
    }
    .Loginh3{
        margin: 0 !important;
    }
    .login-form{
        margin: 0 !important;
    }

    .loginTong{
        font-size: 14px !important;
    }
    .login-title {
        font-size: 32px;
    }
}
</style>
