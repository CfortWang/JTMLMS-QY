<template>
    <ibps-container type="full" class="page">
        <div class="error-page-container">
            <el-button v-if="canBack" icon="el-icon-back" class="pan-back-btn" @click="back">{{ $t('error.back') }}</el-button>
            <el-row>
                <el-col :span="12">
                    <h1 class="text-jumbo text-ginormous">Oops!</h1>
                    <h2>该用户没有系统没有菜单资源</h2>
                    <h6>请与系统管理员联系</h6>
                    <ul class="list-unstyled">
                        <li>{{ $t('error.page403.maybe') }}:</li>
                        <li class="link-type">
                            <el-button icon="ibps-icon-home" type="primary" @click="selectSystem">重新选择子系统</el-button>
                            <el-button icon="ibps-icon-check" type="info" @click="login">{{ $t('error.reLogin') }}</el-button>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="12">
                    <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
                </el-col>
            </el-row>
        </div>
    </ibps-container>
</template>

<script>
import errGif from '@/assets/images/error/401.gif'

export default {
    name: 'error-page401',
    data () {
        return {
            errGif: errGif + '?' + +new Date()
        }
    },
    computed: {
        canBack () {
            return !(this.$route.query.noGoBack === 'true' || this.$route.query.noGoBack)
        }
    },
    methods: {
        back () {
            if (this.canBack) {
                this.$router.push({ path: '/' })
            } else {
                this.$router.go(-1)
            }
        },
        selectSystem () {
            this.$router.push({ path: '/systemSelect' })
        },
        login () {
            this.$store.dispatch('ibps/account/logout', {
                vm: this
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .error-page-container {
        width: 800px;
        margin: 100px auto;
        .pan-back-btn {
            background: #008489;
            color: #fff;
        }
        .pan-gif {
            margin: 0 auto;
            display: block;
        }
        .pan-img {
            display: block;
            margin: 0 auto;
        }
        .text-jumbo {
            font-size: 60px;
            font-weight: 700;
            color: #484848;
        }
        .list-unstyled {
            font-size: 14px;
            li {
                padding-bottom: 5px;
            }
            a {
                color: #008489;
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
