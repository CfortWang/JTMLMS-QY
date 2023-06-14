
<template>
    <el-form
        ref="loginForm"
        :rules="loginRules"
        :model="loginForm"
        class="login-form"
        status-icon
        label-width="80"
        @submit.native.prevent
    >
        <br/>
        <el-form-item label="账号" prop="username">
            <el-input
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                tabindex="1"
                auto-complete="on"
                prefix-icon="ibps-icon-user"
                @keyup.enter.native="handleLogin"
                style="width:75%;"
            />
        </el-form-item>
        <el-tooltip
            v-model="capsTooltip"
            :content="$t('login.capsTooltip')"
            placement="right"
            manual
        >
            <el-form-item label="密码" prop="password">
                <el-input
                    v-model="loginForm.password"
                    :type="passwordType"
                    :placeholder="$t('login.password')"
                    tabindex="2"
                    auto-complete="on"
                    prefix-icon="ibps-icon-lock"
                    style="width: 75%;"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                >
                    <i
                        slot="suffix"
                        :class="passwordType === 'password' ? 'ibps-icon-eye-slash' : 'ibps-icon-eye'"
                        class="el-input__icon"
                        @click="showPassword"
                    ></i>
                </el-input>
            </el-form-item>
        </el-tooltip>
        <el-form-item v-if="enabledValidCode" prop="captcha">
            <el-row :span="24">
                <el-col :span="15">
                    <el-input
                        v-model="loginForm.captcha"
                        :maxlength="code.len"
                        :placeholder="$t('login.code')"
                        tabindex="3"
                        auto-complete="on"
                        prefix-icon="ibps-icon-qrcode"
                        @keyup.enter.native="handleLogin"
                    />
                </el-col>
                <el-col :span="9">
                    <div class="login-code">
                        <span v-if="code.type === 'text'" class="login-code-img" @click="refreshCode">{{ code.value}}</span>
                        <img v-else :src="code.src" class="login-code-img" @click="refreshCode">
                    </div>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item prop="remember">
            <el-row :span="24">
                <el-col :span="14">
                    <el-checkbox v-model="loginForm.remember">{{ $t('login.remember') }}</el-checkbox>
                </el-col>
                <el-col v-if="isRegOpen || isTenantOpen" :span="10">
                    <el-button
                        v-if="!isTenantOpen"
                        type="text"
                        class="forget"
                        @click="forget"
                    >{{ $t('login.forget') }}</el-button>
                    <el-button
                        v-if="isTenantOpen"
                        type="text"
                        class="forget"
                        @click="tenantForget"
                    >{{ $t('login.forget') }}</el-button>
                    <el-divider v-if="isRegOpen" direction="vertical" />
                    <el-button
                        v-if="isRegOpen"
                        type="text"
                        class="register"
                        @click="register"
                    >{{ $t('login.register') }}</el-button>
                    <el-divider v-if="isTenantOpen" direction="vertical" />
                    <el-button
                        v-if="isTenantOpen"
                        type="text"
                        class="register"
                        @click="tenantRegister"
                    >{{ $t('login.tenantRegister') }}</el-button>
                </el-col>
            </el-row>
        </el-form-item>

        <el-button
                :loading="loading"
                type="primary"
                class="login-submit"
                @click.native.prevent="handleLogin"
            >{{ $t('login.logIn') }}</el-button>
    </el-form>
</template>

<script>
    import { mapActions } from 'vuex'
    import Utils from '@/utils/util'
    import I18n from '@/utils/i18n'
    import { SZG_getServerCertificate, SZG_genRandom, SZG_signData } from '@/api/oauth2/ca'
    // import './xtxsync'
    const loginForm = process.env.NODE_ENV === 'development'
        ? {
            username: 'jinyuan',
            password: 'szjbd168',
            captcha: '',
            remember: true,
            requestId: ''
        } : {
            username: '',
            password: '',
            captcha: '',
            remember: true,
            requestId: ''
        }

    const validateUsername = (rule, value, callback) => {
        if (Utils.isEmpty(value)) {
            return callback(new Error(I18n.t('login.usernameCorrect')))
        }
        callback()
    }
    const validateMobile = (rule, value, callback) => {
        if (Utils.isEmpty(value)) {
            return callback(new Error(I18n.t('手机号不能为空')))
        } else {
            const isPhone = /^1(3|4|5|6|7|8|9)\d{9}$/
            if (value.length === 11) {
                if (!isPhone.test(value)) {
                    return callback(new Error(I18n.t('请输入正确手机号')))
                } else {
                    callback()
                }
            } else {
                if (!isPhone.test(value)) {
                    return callback(new Error(I18n.t('请输入正确手机号')))
                } else {
                    return callback(new Error(I18n.t('请输入正确手机号长度')))
                }
            }
        }
    }
    const validateCode = (rule, value, callback) => {
        callback()
        // if (this.code.value !== value) {
        //   this.loginForm.captcha = ''
        //   this.loadValidCode(false)
        //   callback(new Error(I18n.t('login.codeCorrect')))
        // } else {
        //   callback()
        // }
    }

    export default {
        name: 'login-form',
        data () {
            return {
                demoVar: '123',
                enabledValidCode: false,
                loginForm,
                isRegOpen: false,
                isTenantOpen: false,
                validateMobile: validateMobile,
                code: {
                    src: '',
                    value: '',
                    len: 5,
                    type: 'src'
                },
                loginRules: {
                    username: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: this.$t('login.usernameCorrect'),
                            validator: validateUsername
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: this.$t('login.password'),
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            message: this.$t('login.passwordCorrect'),
                            trigger: 'blur'
                        }
                    ],
                    captcha: [
                        {
                            required: true,
                            message: this.$t('login.code'),
                            trigger: 'blur'
                        },
                        {
                            required: true,
                            trigger: 'blur',
                            validator: validateCode
                        }
                    ]

                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false
            }
        },
        watch: {
            isRegOpen: {
                handler: function (val, oldVal) {
                    if (val) {
                        this.loginRules.username = [{
                            required: true,
                            trigger: 'blur',
                            validator: validateMobile
                        }]
                    } else {
                        this.loginRules.username = [{
                            required: true,
                            trigger: 'blur',
                            validator: validateUsername
                        }]
                    }
                },
                immediate: true
            }
        },
        created () {
            this.initValidCode()
            this.loadValidCode(true)
            this.isRegisterOpen()
        },
        mounted () {
            // 注销退出清空验证码
            this.loginForm.captcha = ''
            // 注销退出清空请求ID
            this.loginForm.requestId = ''
        },
        methods: {
            ...mapActions({
                'login': 'ibps/account/login',
                'getCaptcha': 'ibps/account/getCaptcha',
                'getRegisterOpen': 'ibps/account/getRegisterOpen',
                'getRegisterTenantOpen': 'ibps/saas/getRegisterTenantOpen'
            }),
            initValidCode () {
                if (this.enabledValidCode) {
                    this.loginRules.captcha[0]['required'] = true
                    this.loginRules.captcha[1]['required'] = true
                } else {
                    this.loginRules.captcha[0]['required'] = false
                    this.loginRules.captcha[1]['required'] = false
                }
            },
            isRegisterOpen () {
                this.getRegisterOpen().then((data) => {
                    this.isRegOpen = data.data
                }).catch((e) => { })
                this.getRegisterTenantOpen().then((data) => {
                    this.isTenantOpen = data.data
                }).catch((e) => { })
            },
            // 获取验证码
            loadValidCode (isBackfill) {
                this.getCaptcha({ params: { requestId: this.loginForm.requestId } }).then((data) => {
                    // 返回状态501，说明系统没有开启验证码
                    if (data.state === 501) {
                        this.enabledValidCode = false
                    } else {
                        this.enabledValidCode = true
                        this.code.src = data.data
                        this.loginForm.requestId = data.variables.requestId
                    }
                    this.initValidCode()
                    if (isBackfill) {
                        this.loginForm.code = this.code.value
                    }
                }).catch((e) => {

                })
            },
            refreshCode () {
                this.loadValidCode()
            },
            checkCapslock ({ shiftKey, key } = {}) {
                if (key && key.length === 1) {
                    if ((shiftKey && (key >= 'a' && key <= 'z')) || (!shiftKey && (key >= 'A' && key <= 'Z'))) {
                        this.capsTooltip = true
                    } else {
                        this.capsTooltip = false
                    }
                }
                if (key === 'CapsLock' && this.capsTooltip === true) {
                    this.capsTooltip = false
                }
            },
            showPassword () {
                this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
            },
            forget () {
                this.$router.replace('/forget')
            },
            tenantForget () {
                this.$router.replace('/tenantForget')
            },
            register () {
                this.$router.replace('/register')
            },
            tenantRegister () {
                this.$router.replace('/tenantRegister')
            },
            handleLogin () {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        const loading = this.$loading({
                            lock: true,
                            text: this.$t('common.loading'),
                            background: 'rgba(0, 0, 0, 0.7)'
                        })
                        this.login({
                            form: this.loginForm
                        }).then((data) => {
                            localStorage.setItem('statistic', data.statistic)
                            // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
                            const redirect = this.$route.query.redirect

                            if (redirect && redirect !== '/refresh') {
                              if(data && (data.statistic === 'isMaster' ||data.statistic === 'isCharger')){
                                    // 重定向到开始路径
                                    this.$router.replace('/dashboard')
                                } else {
                                    this.$router.replace('/')
                                }
                            } else {
                               if(data && (data.statistic === 'isMaster' ||data.statistic === 'isCharger')){
                                    // 重定向到开始路径
                                    this.$router.replace('/dashboard')
                                } else {
                                    this.$router.replace('/')
                                }
                            }

                            // 延迟10秒关闭遮盖层
                            setTimeout(() => {
                                this.loading = false
                                loading.close()
                            }, 1000)
                        }).catch((err) => {
                            // 验证码错误自动清空&密码输入错误3次后触发验证码填写模块
                            if (err && err.state === 6020104) {
                                this.loginForm.captcha = ''
                                this.enabledValidCode = true
                                this.refreshCode()
                            }
                            // 有错误状态开启验证码需要刷新验证码
                            if (err && err.state && this.enabledValidCode) {
                                this.loginForm.captcha = ''
                                this.refreshCode()
                            }
                            this.loading = false
                            loading.close()
                        })
                    } else {
                        this.$message.closeAll()
                        this.$message({
                            message: this.$t('common.dialog.saveError'),
                            type: 'warning'
                        })
                        return false
                    }
                })
            },
            // ca认证
            caAuth () {
                SZG_getServerCertificate().then(res1 => {
                    let data1 = res1.variables && res1.variables.data
                    console.log(data1)
                    SZG_genRandom().then(res2 => {
                        let data2 = res2.variables && res2.variables.data
                        console.log(data2)
                        if (data2) {
                            SZG_signData({ inData: data2 }).then(res3 => {
                                let data3 = res3.variables && res3.variables.data
                                console.log(res3, data3)
                            })
                        }
                    })
                }).catch(err => {
                    console.log('获取服务器证书失败！')
                })
                // 获取用户列表，并截取用户姓名显示到登录框中
                this.loginForm.username = xtxsync.SOF_GetUserList()
            },
            // 验签
            caVerify () {
                xtxsync.SOF_VerifySignedData()
            }
        }
    }
</script>

<style scoped>
    .el-form-item {
        margin-bottom: 18px !important;
    }

    /deep/ .el-form-item--small .el-form-item__error{
        padding-top: 10px;
    }
</style>
