import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index.js'
import util from '@/utils/util.js'
import setting from '@/setting.js'
import i18n from '@/utils/i18n.js'

// 验权
import { getToken, getRefreshToken } from '@/utils/auth'

// 路由数据
import routes from './routes'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
    return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    // 确认已经加载多标签页数据
    await store.dispatch('ibps/page/isLoaded')
    // 确认已经加载组件尺寸设置
    await store.dispatch('ibps/size/isLoaded')
    // 关闭搜索面板
    store.commit('ibps/search/set', false)
    // 进度条
    NProgress.start()

    const locking = util.cookies.get('locking')
    if (locking === 'locked' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        })
    } else if (locking === 'unlock' && to.name === 'locking') {
        next(false)
    } else {
        // 这里将cookie里是否存有token作为验证是否登录的条件
        const hasToken = getToken()
        if (hasToken && hasToken !== 'undefined') { // 从cookie 获取用户token
            // 登录 锁定 401没权限  403禁止访问
            if (to.name === 'locking' || to.name === 'login' || to.name === 'error401' || to.name === 'error403' || to.name === 'nomenu') {
                next()
            } else {
                // 判断是否有子系统和是否有菜单
                if (util.isEmpty(store.getters.system) || util.isEmpty(store.getters.menus)) {
                    store.dispatch('ibps/user/load').then(res => { // 拉取用户信息,避免刷新用户丢失
                        const system = store.getters.system
                        if ((util.isEmpty(system) || util.isEmpty(system.id))) {
                            if (util.isEmpty(store.getters.tenants)) {
                                if (to.name === 'systemSelect') return next()
                                return next({ path: '/systemSelect', replace: true })
                            }
                            // 租户模式下跳转
                            if (util.isNotEmpty(store.getters.tenants)) {
                                if (to.name === 'tenantSelect') return next()
                                if (to.name === 'systemSelect') return next()
                                return next({ path: '/tenantSelect', replace: true })
                            }
                        }
                        store.dispatch('ibps/menu/init', { systemId: system.id }).then(() => { // 根据用户菜单权限生成可访问的路由表
                            if (util.isEmpty(store.getters.menus)) {
                                next()
                            } else {
                                const addRouters = store.getters.routers

                                if (addRouters && addRouters.length > 0) {
                                    // 动态添加可访问路由表
                                    router.addRoutes(addRouters)
                                    // 初始化加载或用户刷新页面后从数据库加载一系列的设置
                                    store.dispatch('ibps/account/loadInfo', {
                                        addRouters,
                                        menus: store.getters.menus
                                    })
                                    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
                                } else {
                                    next({ path: '/403', replace: true, query: { noGoBack: true } })
                                }
                            }
                        }).catch((e) => {
                            console.error(e)
                            NProgress.done() // 结束Progress
                        })
                    }).catch((e) => {
                        NProgress.done() // 结束Progress
                        // 前台登出
                        store.dispatch('ibps/account/fedLogout').then(() => {
                            next({ name: 'login' })
                        }).catch((err) => {
                            console.error(err)
                        })
                    })
                } else { // 动态改变权限,判断是否有菜单权限，或者刷新页面
                    if (to.matched.length === 0) { // 不能匹配的路由
                        return next({ path: '401', replace: true, query: { noGoBack: true } })
                    } else {
                        next()
                    }
                }
                // end
            }
        } else { /* has no token */
            // 判断refresh tonken是否过期
            const refreshToken = getRefreshToken()
            if (util.isNotEmpty(refreshToken)) {
                // 刷新tonken
                await store.dispatch('ibps/account/refreshToken').then(() => {
                    next()
                }).catch((err) => {
                    console.error(err)
                })
            } else {
                // 在免登录白名单，直接进入
                if (setting.whiteRouterList.indexOf(to.path) !== -1) {
                    next()
                } else {
                    // 没有登录的时候跳转到登录界面
                    // 携带上登陆成功之后需要跳转的页面完整路径
                    next({
                        name: 'login',
                        query: {
                            redirect: to.fullPath
                        }
                    })
                    NProgress.done()
                }
            }
        }
    }
})

router.afterEach(to => {
    // 进度条
    NProgress.done()
    // 多页控制 打开新的页面
    /* store.dispatch('ibps/page/open', to) */
    // 更改标题
    i18n.setTitle(to.meta.name || to.name, to.meta.title)
})

export default router
