// import { uniqueId } from 'lodash'
// 设置文件
import setting from '@/setting.js'
import menuUtil from '@/utils/menu'
import { getMenuData } from '@/api/platform/auth/resources'
import { generateRoutes } from '@/router/utils'
// 帮助类
import Utils from '@/utils/util'

// /**
//  * 给菜单数据补充上 path 字段
//  * @param {Array} menu 原始的菜单数据
//  */
// function supplementMenuPath (menu) {
//     return menu.map(e => ({
//         ...e,
//         path: e.path || uniqueId('ibps-menu-empty-'),
//         ...e.children ? {
//             children: supplementMenuPath(e.children)
//         } : {}
//     }))
// }

export default {
    namespaced: true,
    state: {
        // 所有菜单
        menus: [],
        // 顶栏菜单
        header: [],
        // 侧栏菜单
        aside: [],
        // 激活的顶栏菜单
        activeHeader: setting.menu.activeHeader,
        // 侧边栏收缩
        asideCollapse: setting.menu.asideCollapse,
        // 侧边栏折叠动画
        asideTransition: setting.menu.asideTransition,
        // 动态路由
        routers: [],
        // 权限
        permissions: {}
    },
    actions: {
        /**
         * 从后台获取菜单资源
         * @param {*} param0
         */
        init ({ state, commit, dispatch }, { systemId }) {
            return new Promise(async (resolve, reject) => {
                getMenuData({
                    systemId: systemId
                }).then(async res => {
                    const data = res.data
                    if (Utils.isEmpty(data)) {
                        // await dispatch('ibps/system/set', null, { root: true })
                        await commit('menusSet', null)
                        await commit('addRouters', null)
                        await commit('headerSet', null)
                        await commit('permissionsSet', null)
                        return resolve()
                    }
                    // 初始化菜单
                    const menus = menuUtil.transformToTreeAndLevelFormat(data)
                    await commit('menusSet', menus)
                    // 构建一份路由表
                    await commit('addRouters', generateRoutes(menus))
                    // 设置顶部
                    await commit('headerSet', menuUtil.getHeaderMenus(menus))
                    // 权限设置
                    await commit('permissionsSet', menuUtil.getPermissions(data))
                    // 当前的顶部选中
                    await dispatch('activeHeaderSet', {})
                    resolve(menus)
                }).catch((e) => {
                    reject(e)
                })
            })
        },
        menusSet ({ state, dispatch }, menus) {
            state.menus = menus || []
        },
        /**
         *  设置激活顶部
         * @param {*} context
         * @param {*} activeHeader
         */
        activeHeaderSet ({ state, dispatch, commit }, { activeHeader, vm }) {
            return new Promise(async resolve => {
                if (!activeHeader) {
                    // 如果没有从数据库读取 激活的头部
                    await dispatch('activeHeaderLoad', (state.header && state.header.length > 0) ? state.header[0].id : '1')
                } else {
                    state.activeHeader = activeHeader
                }
                // 持久化
                await dispatch('ibps/db/set', {
                    dbName: 'sys',
                    path: 'menu.activeHeader',
                    value: state.activeHeader,
                    user: true
                }, { root: true })
                const asideMenus = menuUtil.getAsideMenus(state.menus, state.activeHeader) || []
                if (asideMenus.length === 0 && vm) { //  判断有没有侧边
                    state.header.forEach(h => {
                        if (h.id === activeHeader && h.path) {
                            vm.$router.push({
                                path: h.path + '/index'
                            })
                        }
                    })
                }
                // 设置侧边栏
                await commit('asideSet', asideMenus)
                resolve()
            })
        },
        /**
         * 加载激活顶部
         * @param {*} context
         * @param {*} defaultValue
         */
        activeHeaderLoad ({ state, dispatch }, defaultValue) {
            return new Promise(async resolve => {
                // store 赋值
                state.activeHeader = await dispatch('ibps/db/get', {
                    dbName: 'sys',
                    path: 'menu.activeHeader',
                    defaultValue: defaultValue,
                    user: true
                }, { root: true })
                let valid = false
                // 判断已激活的是否有效，否则取底部第一个
                state.header.forEach(h => {
                    if (h.id === state.activeHeader) {
                        valid = true
                        return false
                    }
                })
                if (!valid && state.header && state.header.length > 0) {
                    state.activeHeader = state.header[0].id
                }
                // end
                resolve()
            })
        },
        /**
         * 设置侧边栏展开或者收缩
         * @param {Object} context
         * @param {Boolean} collapse is collapse
         */
        asideCollapseSet ({ state, dispatch }, collapse) {
            return new Promise(async resolve => {
                // store 赋值
                state.asideCollapse = collapse
                // 持久化
                await dispatch('ibps/db/set', {
                    dbName: 'sys',
                    path: 'menu.asideCollapse',
                    value: state.asideCollapse,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * 切换侧边栏展开和收缩
         * @param {Object} context
         */
        asideCollapseToggle ({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.asideCollapse = !state.asideCollapse
                // 持久化
                await dispatch('ibps/db/set', {
                    dbName: 'sys',
                    path: 'menu.asideCollapse',
                    value: state.asideCollapse,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * 设置侧边栏折叠动画
         * @param {Object} context
         * @param {Boolean} transition is transition
         */
        async asideTransitionSet ({ state, dispatch }, transition) {
            // store 赋值
            state.asideTransition = transition
            // 持久化
            await dispatch('ibps/db/set', {
                dbName: 'sys',
                path: 'menu.asideTransition',
                value: state.asideTransition,
                user: true
            }, { root: true })
        },
        /**
         * 切换侧边栏折叠动画
         * @param {Object} context
         */
        async asideTransitionToggle ({ state, dispatch }) {
            // store 赋值
            state.asideTransition = !state.asideTransition
            // 持久化
            await dispatch('ibps/db/set', {
                dbName: 'sys',
                path: 'menu.asideTransition',
                value: state.asideTransition,
                user: true
            }, { root: true })
        },
        /**
         * 持久化数据加载侧边栏设置
         * @param {Object} context
         */
        async asideLoad ({ state, dispatch }) {
            // store 赋值
            const menu = await dispatch('ibps/db/get', {
                dbName: 'sys',
                path: 'menu',
                defaultValue: setting.menu,
                user: true
            }, { root: true })
            state.asideCollapse = menu.asideCollapse !== undefined ? menu.asideCollapse : setting.menu.asideCollapse
            state.asideTransition = menu.asideTransition !== undefined ? menu.asideTransition : setting.menu.asideTransition
        }

    },
    mutations: {
        /**
         *  菜单设置
         *  @param {Object} context
         * @param {*} menus
         */
        menusSet (state, menus) {
            state.menus = menus || []
        },
        /**
         * 路由设置
         * @param {*} state
         * @param {*} routers
         */
        addRouters (state, routers) {
            state.routers = routers || []
        },

        /**
         * 权限设置
         * @param {*} state
         * @param {*} permissions
         */
        permissionsSet (state, permissions) {
            state.permissions = permissions
        },
        /**
         * @description 设置顶栏菜单
         * @param {Object} state vuex state
         * @param {Array} menu menu setting
         */
        headerSet (state, menus) {
            state.header = menus || []
        },
        /**
         * @description 设置侧边栏菜单
         * @param {Object} state vuex state
         * @param {Object} asideMenus menu setting
         */
        asideSet (state, asideMenus) {
            // 设置侧边栏菜单
            state.aside = asideMenus
        }
    }
}
