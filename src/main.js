// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import ibps from './plugins/ibps'
// store
import store from './store/index'

// 菜单和路由设置
import router from './router'
// 数据大屏插件
import dataV from '@jiaminghi/data-view'
// less的css编码语法
import less from 'less'

// 表格自适应高度
// import Plugin from 'v-fit-columns'
// import Blob from './excel/Blob'
// import Export2Excel from './excel/Export2Excel.js'

// less的css编码
Vue.use(less)

// 数据大屏插件
Vue.use(dataV)

// 核心插件
Vue.use(ibps)
Vue.directive('removeAriaHidden', {
    bind (el, binding) {
        const ariaEls = el.querySelectorAll('.el-radio__original')
        ariaEls.forEach((item) => {
            item.removeAttribute('aria-hidden')
        })
    }
})

new Vue({
    router,
    store,
    i18n,
    devtools: process.env.NODE_ENV === 'development',
    async created () {
        // 加载接口配置
        await this.$store.dispatch('ibps/api/load')
    },
    async mounted () {
        // 展示系统信息
        await this.$store.commit('ibps/releases/versionShow')
        // 用户登录后从数据库加载一系列的设置
        await this.$store.dispatch('ibps/account/load')
        // 获取并记录用户 UA
        await this.$store.commit('ibps/ua/get')
        // 初始化全屏监听
        await this.$store.dispatch('ibps/fullscreen/listen')
        // 初始化加载是否修改用户信息
        await this.$store.dispatch('ibps/user/listen')
    },
    render: h => h(App)
}).$mount('#app')
