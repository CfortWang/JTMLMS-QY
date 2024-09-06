<template>
    <div
        :style="styleLayoutMainGroup"
        :class="{ grayMode: grayActive }"
        class="ibps-layout-header-aside-group hidden-print"
    >
        <!-- <iframe
            style="display: none;"
            id="iframeContain"
            name="iframeContain"
            seamless
            scrolling="yes"
            src=""
        >
        </iframe> -->

        <!-- 半透明遮罩 -->
        <div class="ibps-layout-header-aside-mask" />
        <!-- websocket -->
        <ibps-notify-monitor />
        <!-- 主体内容 -->
        <div class="ibps-layout-header-aside-content" flex="dir:top">
            <panle />
            <!-- 顶栏 -->
            <div
                :style="{opacity: searchActive ? 0.5 : 1}"
                class="ibps-theme-header"
                style="box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.12), 0 0 5px rgba(155, 155, 0, 0.04);margin-bottom: 5px;"
                flex-box="0"
                flex
            >
                <!-- <div
                    :class="{'logo-group': true, 'logo-transition': asideTransition, 'ibps-pt-5': system.logoType === 'image', 'ibps-pl-0': system.logoType === 'image'}"
                    :style="{width: asideCollapse ? asideWidthCollapse : asideWidth}"
                    flex-box="0"
                >
                    <el-dropdown
                        v-if="subsystemList && subsystemList.length > 1"
                        trigger="click"
                        placement="bottom-start"
                        @command="command => handleSubsystemClick(command)"
                    >
                        <ibps-logo
                            :system="system"
                            :aside-collapse="asideCollapse"
                            :subsystem-list="subsystemList"
                            :logo-icon-all="logoIconAll"
                            :logo-icon-only="logoIconOnly"
                        />
                        <el-dropdown-menu slot="dropdown" style="width: 180px;">
                            <el-dropdown-item
                                v-for="(item, index) in subsystemList"
                                :key="index"
                                :disabled="item.id === system.id"
                                :command="item"
                            >
                                <ibps-icon :name="item.logo || 'logo'" :title="item.name"/>{{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <ibps-logo
                        v-else
                        :system="system"
                        :aside-collapse="asideCollapse"
                        :subsystem-list="subsystemList"
                        :logo-icon-all="logoIconAll"
                        :logo-icon-only="logoIconOnly"
                    />
                </div>
                <div
                    class="toggle-aside-btn"
                    flex-box="0"
                    @click="handleToggleAside"
                >
                    <ibps-icon :name="asideCollapse ? 'indent' : 'outdent'" />
                </div> -->

                <ibps-menu-header flex-box="1" @pageChange="pageChange" />

                <!-- 顶栏右侧 -->
                <div class="ibps-header-right" flex-box="0">
                    <IbpHeaderSearchFeature></IbpHeaderSearchFeature>
                    <!-- 如果你只想在开发环境显示这个按钮请添加 v-if="$nodeEnv === 'development'" -->
                    <!-- 全局搜索放大镜、日志、环境切换、全屏 -->
                    <!-- <ibps-header-search @click="handleSearchClick" /> -->
                    <!-- <ibps-header-error-log v-if="$nodeEnv === 'development'" />
                    <ibps-header-base-url v-if="$nodeEnv === 'development'" /> -->

                    <!-- <ibps-header-download />
                    <ibps-header-locking />
                    <ibps-header-theme />
                    <ibps-header-language />
                    <ibps-header-size />
                    <ibps-header-fullscreen />
                    <ibps-header-tenant /> -->

                    <!-- <ibps-header-clean-cache v-if="isSuper" type="platform" />
                    <ibps-header-clean-cache v-if="isSuper" type="form" /> -->
                    <ibps-header-tools :is-super="isSuper" />
                    <!-- <ibps-header-clean-cache v-if="isSuper" type="oauth" />
                    <ibps-header-clean-cache v-if="isSuper" type="office" /> -->

                    <span style="font-size: 12px; cursor: pointer;" @click="goToMain()">首页</span>
                    <span style="margin: 0 10px;">|</span>
                    <ibps-header-message />
                    <!-- 消息中心 -->
                    <span style="margin: 0 10px;">|</span>
                    <ibps-header-user style="margin-right: 15px;" />
                    <!-- <span style="margin-left: 10px;">|</span>
                    <ibps-header-setting /> -->
                </div>
            </div>
            <!-- 下面 主体 -->
            <div class="ibps-theme-container" flex-box="1" flex>
                <!-- 主体 侧边栏 -->
                <div
                    v-if="!hiddenAsideMenu"
                    ref="aside"
                    flex-box="0"
                    :class="{'ibps-theme-container-aside': true, 'ibps-theme-container-transition': asideTransition}"
                    :style="{width: asideCollapse ? asideWidthCollapse : asideWidth, opacity: searchActive ? 0.5 : 1}"
                >
                    <!-- 侧部顶头栏-->
                    <div class="layout-border-left">
                        <div
                            class="toggle-aside-btn"
                            style="float: right; width: 25%;"
                            @click="handleToggleAside"
                        >
                            <ibps-icon :name="asideCollapse ? 'indent' : 'outdent'" />
                        </div>
                        <div style="width: 74%;" class="toggle-aside-btn layout-border-left-name">
                            <span>{{ getSystemName[0].name }}</span>
                        </div>
                    </div>
                    <ibps-menu-side style="margin-top: 52px;" />
                </div>

                <!-- 主体 -->
                <div class="ibps-theme-container-main" flex-box="1" flex>
                    <!-- 搜索 -->
                    <transition name="fade-scale">
                        <div
                            v-show="searchActive"
                            class="ibps-theme-container-main-layer"
                            flex
                        >
                            <ibps-panel-search ref="panelSearch" @close="searchPanelClose" />
                        </div>
                    </transition>
                    <!-- 内容 -->
                    <transition name="fade-scale">
                        <div
                            v-show="!searchActive"
                            class="ibps-theme-container-main-layer"
                            flex="dir:top"
                        >
                            <!-- tab -->
                            <!-- <div class="ibps-theme-container-main-header" flex-box="0">
                                <ibps-tabs />
                            </div> -->

                            <!-- 页面 -->
                            <div class="ibps-theme-container-main-body" flex-box="1">
                                <transition :name="transitionActive ? 'fade-transverse' : ''">
                                    <!-- <keep-alive :include="keepAlive"> -->
                                    <router-view :key="routerViewKey" />
                                    <!-- </keep-alive> -->
                                </transition>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <!-- <FloatBall></FloatBall> -->
    </div>
</template>

<script>
import IbpsLogo from './components/logo'
import IbpsMenuSide from './components/menu-side/index.js'
import IbpsMenuHeader from './components/menu-header/index.js'
import IbpsTabs from './components/tabs'
import IbpsHeaderSearch from './components/header-search'
import FloatBall from './components/components/float-ball'
import IbpsHeaderFullscreen from './components/header-fullscreen'
// import IbpsHeaderLocking from './components/header-locking'
// import IbpsHeaderLanguage from './components/header-language'
// import IbpsHeaderSize from './components/header-size'
// import IbpsHeaderTheme from './components/header-theme'
// import IbpsHeaderToolbar from './components/header-toolbar'

// import IbpsHeaderTenant from './components/header-tenant'
import IbpsHeaderSetting from './components/header-setting'
import IbpsHeaderMessage from './components/header-message'
import panle from '@/components/jbd-panel'
import IbpsHeaderUser from './components/header-user'
import IbpsHeaderErrorLog from './components/header-error-log'
import IbpsHeaderBaseUrl from './components/header-base-url'
import IbpsHeaderCleanCache from './components/header-clean-cache'
import IbpsHeaderTools from './components/header-tools'
import IbpHeaderSearchFeature from './components/header-search-feature'
// import IbpsHeaderDownload from './components/header-download'
import IbpsNotifyMonitor from '@/business/platform/socket/notify-monitor'
import { mapState, mapGetters, mapActions } from 'vuex'
import mixinSearch from './mixins/search'
import mixinLock from './mixins/lock'
import setting from '@/setting.js'
import { f } from 'vue-grid-layout'
export default {
    name: 'ibps-layout-header-aside',
    components: {
        IbpsLogo,
        IbpsMenuSide,
        IbpsMenuHeader,
        IbpsTabs,
        IbpsHeaderSearch,
        FloatBall,
        panle,
        IbpsHeaderFullscreen,
        // IbpsHeaderLocking,
        // IbpsHeaderLanguage,
        // IbpsHeaderSize,
        // IbpsHeaderTheme,
        // IbpsHeaderToolbar,
        // IbpsHeaderTenant,
        IbpsHeaderSetting,
        IbpsHeaderMessage,
        IbpsHeaderUser,
        IbpsHeaderErrorLog,
        IbpsHeaderBaseUrl,
        IbpsHeaderCleanCache,
        IbpsHeaderTools,
        // IbpsHeaderDownload,
        IbpsNotifyMonitor,
        IbpHeaderSearchFeature
    },
    mixins: [mixinSearch, mixinLock],
    data () {
        const { isSuper, account } = this.$store.getters
        const { hiddenAsideMenu = false } = this.$route.meta || {}
        return {
            // [侧边栏宽度] 正常状态
            asideWidth: '200px',
            // [侧边栏宽度] 折叠状态
            asideWidthCollapse: '65px',
            isSuper,
            account,
            hiddenAsideMenu
        }
    },
    computed: {
        ...mapState('ibps', {
            keepAlive: state => state.page.keepAlive,
            grayActive: state => state.gray.active,
            transitionActive: state => state.transition.active,
            asideCollapse: state => state.menu.asideCollapse,
            asideTransition: state => state.menu.asideTransition,
            system: state => state.system.system,
            subsystemList: state => state.system.subsystemList
        }),
        ...mapGetters('ibps', {
            themeActiveSetting: 'theme/activeSetting'
        }),
        getSystemName () {
            return this.header().filter(name => { return name.id === this.activeHeader() })
        },
        /**
         * @description 用来实现带参路由的缓存
         */
        routerViewKey () {
            // 默认情况下 key 类似 __transition-n-/foo
            // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
            const stamp = this.$route.meta[`__stamp-${this.$route.path}`] || ''
            return `${stamp ? `__stamp-${stamp}-` : ''}${this.$route.path}`
        },
        /**
         * @description 最外层容器的背景图片样式
         */
        styleLayoutMainGroup () {
            return { ...(this.themeActiveSetting.backgroundImage ? { backgroundImage: `url('${this.$baseUrl}${this.themeActiveSetting.backgroundImage}')` } : {}) }
        },
        logoIconAll () {
            return `${this.$baseUrl}images/theme/${this.themeActiveSetting.name}/all.png`
        },
        logoIconOnly () {
            return `${this.$baseUrl}images/theme/${this.themeActiveSetting.name}/only.png`
        }
    },
    watch: {
        $route (v) {
            this.hiddenAsideMenu = v.meta ? v.meta.hiddenAsideMenu : false
        }
    },
    mounted () {
        // window.performance.navigation.type === 1
    },
    methods: {
        ...mapActions('ibps/menu', ['asideCollapseToggle']),
        ...mapState('ibps/menu', ['routers', 'activeHeader', 'header', 'activeName']),
        goToMain () {
            this.$router.push({ path: '/' })
        },
        pageChange () {

        },
        /**
         * 接收点击切换侧边栏的按钮
         */
        handleToggleAside () {
            this.asideCollapseToggle()
        },
        handleSubsystemClick (system) {
            this.$store.dispatch('ibps/system/set', system)
            window.location.href = this.$baseUrl
            // location.reload() // 为了重新实例化vue-router对象 避免bug
        }
    }
}
</script>

<style lang="scss">
    // 注册主题
    @import '~@/assets/styles/theme/register.scss';
    .jbd-sys-title {
        background: linear-gradient(to top, rgb(48, 194, 189), rgb(145, 216, 210));
        // background: rgb(51, 150, 209);
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        text-align: center;
    }
    .jbd-sys-title-cont {
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        font-size: 14px;
    }
    .jbd-sys-title-contact {
        line-height: 20px;
        margin-right: 40px;
        font-size: 14px;
    }
    .layout-border-left {
        float: left;
        box-shadow: 0px 2px 4px #e78c45, 0 0 5px rgba(155, 155, 0, 0.04);
        width: 100%;
        height: 50px;
        line-height: 50px;
        .layout-border-left-name {
            float: left;
            font-size: 18px;
            font-weight: bold;
        }
    }
</style>
