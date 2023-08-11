<template>
    <div class="jbd-login-page-bg">
        <el-container class="login-container" @keyup.enter="handleLogin">
            <el-main class="mainclass">
                <div class="weizhi">
                    <div class="logoTitle">
                        <!-- <h1 class="login-title1"> -->
                        <!-- <img src="../../../assets/images/login/logo.jpg" class="logoImg" />
                            金源信通 -->
                        <img src="~@/assets/images/login/company.png" class="logo">
                        <!-- </h1> -->
                        <h1 class="login-title">医学实验室标准化智慧管理平台</h1>
                    </div>

                    <div class="jbd-login-page-main">
                        <h3>
                            <span>{{ $t('login.userLogin') }}</span>
                            <ibps-api-base-url-controller v-if="$nodeEnv === 'development'">
                                <el-tooltip effect="dark" :content="$t('navbar.switchEnvironment')" placement="bottom">
                                    <el-button type="text" class="ibps-fr ibps-mr-5 btn-text can-hover">
                                        <ibps-icon name="wifi" class="mainWifi" />
                                    </el-button>
                                </el-tooltip>
                            </ibps-api-base-url-controller>
                        </h3>
                        <user-login />
                        <login-bottom />
                    </div>
                </div>
            </el-main>
            <el-footer class="footerclass">
                <div class="footerOutside">
                    <hr>
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
    data () {
        return {
            activeName: 'user'
        }
    },
    methods: {
        handleLogin () {}
    }
}
</script>
<style lang="scss" scoped>
    .jbd-login-page-bg{
        min-width: 560px;
    }
    // @media (min-width: 1200px) {
        h1{
            margin: 0 !important;
        }
        .jbd-login-page-bg {
            background-image: url('~@/assets/images/login/bgImg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .jbd-login-page-main {
            margin: 0 auto;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 10px 20px;
            //margin-left: 50px;
            // height: 340px;
            width: 280px;
            background-repeat: no-repeat;
            border-radius: 5%;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 1);
        }

        .login-title {
            font-size: 44px;
            color: #01a39e;
            // margin: 0 0 40px !important;
        }
        .logo {
            height: 50px;
            position: relative;
            // top: 5px;
            margin: 20px 0 20px;
        }
        .mainclass{
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 0;
            padding: 0 7.5%;
        }
        .footerclass{
            width: 80%;
        }
        .footerOutside{
            font-size: 12px;
            text-align: right;
        }
        .mainWifi{
            font-size: 18px
        }
        .logoTitle{
            display: flex;
            align-items: center;
            margin-bottom: 40px;
        }
        .weizhi{
            position: absolute;
            top:40%;
            transform: translateY(-50%);
            margin-left: 50px;
        }
    // }

    /*在 992 和 1199 像素之间的屏幕里，中等屏幕，分辨率低的 PC*/
    @media (min-width: 992px) and (max-width: 1199px) {
        h1{
            margin: 0 !important;
        }
        .jbd-login-page-bg {
            background-image: url('~@/assets/images/login/bgImg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .jbd-login-page-main {
            margin: 0 auto;
            // margin-top: 0px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 10px 20px;
            // margin-left: 40px;
            // height: 340px;
            width: 280px;
            background-repeat: no-repeat;
            border-radius: 5%;
            box-sizing: border-box;
        }

        .login-title {
            font-size: 44px;
            color: #01a39e;
            // margin: 0 0 40px !important;
        }
        .logo {
            position: relative;
            // top: 5px;
            margin: 20px 0 20px;
        }
        .mainclass{
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 0;
            padding: 0 7.5%;
        }
        .footerclass{
            width: 80%;
        }
        .footerOutside{
            font-size: 12px;
            text-align: right;
        }
        .mainWifi{
            font-size: 18px
        }
        .logoTitle{
            display: flex;
            align-items: center;
            img {
                height: 40px;
            }
        }
        .weizhi{
            position: absolute;
            top:40%;
            transform: translateY(-50%);
            margin-left: 40px;
        }
    }

    /*在 768 和 991 像素之间的屏幕里，小屏幕，主要是 PAD*/
    @media (max-width: 991px) {
        h1{
            margin: 0 !important;
        }
        .jbd-login-page-bg {
            background-image: url('~@/assets/images/login/bgImg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .jbd-login-page-main {
            margin: 0 auto;
            // margin-top: 0px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 10px 20px;
            // margin-left: 50px;
            // height: 340px;
            width: 280px;
            background-repeat: no-repeat;
            border-radius: 5%;
            box-sizing: border-box;
        }

        .login-title {
            font-size: 34px;
            color: #01a39e;
            margin-bottom: 20px !important;
        }
        .logo {
            height: 40px;
            position: relative;
            // top: 5px;
            margin: 20px 0 20px;
        }
        .mainclass{
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 0;
            padding: 0 7.5%;
        }
        .footerclass{
            width: 80%;
        }
        .footerOutside{
            font-size: 12px;
            text-align: right;
        }
        .mainWifi{
            font-size: 18px
        }
        .logoTitle{
            // display: flex;
            // align-items: center;
            // margin-left: 50px;
        }
        .weizhi{
            position: absolute;
            top:40%;
            transform: translateY(-50%);
            margin-left: 50px;
        }
    }
</style>
