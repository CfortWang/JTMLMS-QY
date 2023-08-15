import { getUserInfo, switchUser, exitSwitchUser, getRegisterOpen } from '@/api/oauth2/user'
import { getToken, getUuid } from '@/utils/auth'
import Utils from '@/utils/util'

export default {
    namespaced: true,
    state: {
        // 用户信息
        info: {},
        // 帐号
        account: '',
        // 切换的账号
        switchAccount: '',
        // 设置的关联租户ID
        designTenantid: '',
        // 是否开启注册
        regOpen: false
    },
    actions: {
        /**
         * @description 设置用户数据
         * @param {Object} context
         * @param {*} info info
         */
        async set ({ state, dispatch }, info) {
            // store 赋值
            state.info = info
            // 持久化
            await dispatch('ibps/db/set', {
                dbName: 'sys',
                path: 'user.info',
                value: info,
                user: true
            }, { root: true })
        },
        /**
         * @description 从数据库取用户数据
         * @param {Object} state vuex state
         */
        async get ({ state, dispatch }) {
            // store 赋值
            state.info = await dispatch('ibps/db/get', {
                dbName: 'sys',
                path: 'user.info',
                defaultValue: {},
                user: true
            }, { root: true })
        },
        /**
         * @description 从数据库取用户数据
         * @param {Object} context
         */
        async load ({ state, dispatch }) {
            return new Promise(async (resolve, reject) => {
                // 获取当前用户账号
                await dispatch('getAccount')
                // 获取切换用户账号
                await dispatch('getSwitchAccount')

                // 获取注册用户账号
                dispatch('getRegister').then((r) => {
                    if (Utils.isEmpty(state.account)) {
                        reject()
                        return
                    }
                    // 获取用户信息
                    getUserInfo(state.account).then(async response => {
                        if (!response) {
                            reject(response)
                        }
                        const info = response.data
                        // 设置当前
                        await dispatch('ibps/user/set', info, {
                            root: true
                        })
                        if (info.positions && info.positions.length) {
                            const level = {
                                first: [...new Set(info.positions.map(obj => obj.path ? obj.path.split('.')[0] : '').filter(Boolean))].join(','),
                                second: [...new Set(info.positions.map(obj => obj.path ? obj.path.split('.')[1] : '').filter(Boolean))].join(',')
                            }
                            await dispatch('ibps/param/setLevel', level, {
                                root: true
                            })
                        }
                        // 获取当前子系统
                        await dispatch('ibps/system/loadSystem', null, {
                            root: true
                        })
                        resolve(info)
                    }).catch(error => {
                        reject(error)
                    })
                }).catch(error => {
                    reject(error)
                })
            })
        },
        listen ({ state, dispatch }) {
            // 找到当前浏览器支持的hidden属性名和visibilitychange事件名
            let hidden = 'hidden'
            let visibilityChange = 'visibilitychange'
            if (typeof document.hidden !== 'undefined') {
                hidden = 'hidden'
                visibilityChange = 'visibilitychange'
            } else if (typeof document.mozHidden !== 'undefined') {
                hidden = 'mozHidden'
                visibilityChange = 'mozvisibilitychange'
            } else if (typeof document.msHidden !== 'undefined') {
                hidden = 'msHidden'
                visibilityChange = 'msvisibilitychange'
            } else if (typeof document.webkitHidden !== 'undefined') {
                hidden = 'webkitHidden'
                visibilityChange = 'webkitvisibilitychange'
            }
            document.addEventListener(visibilityChange, () => {
                const uuid = getUuid()
                const userId = state.info && state.info.user ? state.info.user.id : ''
                if (!document[hidden] && Utils.isNotEmpty(userId) && userId !== uuid) { // 显示
                    location.reload()
                }
            }, false)
        },
        /**
         * 获取用户名
         * @param {*} param0
         */
        getAccount ({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.account = await dispatch('ibps/db/get', {
                    dbName: 'sys',
                    path: 'account',
                    defaultValue: '',
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        setAccount ({
            state,
            dispatch
        }, account) {
            return new Promise(async resolve => {
                // store 赋值
                state.account = account
                // 持久化
                await dispatch('ibps/db/set', {
                    dbName: 'sys',
                    path: 'account',
                    value: account,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * 获取切换用户账号
         * @param {*} param0
         */
        getSwitchAccount ({ state, dispatch }) {
            return new Promise(async resolve => {
                // store 赋值
                state.switchAccount = await dispatch('ibps/db/get', {
                    dbName: 'sys',
                    path: 'switchAccount',
                    defaultValue: '',
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * 设置切换用户账号
         * @param {*} param0
         * @param {*} switchAccount
         */
        setSwitchAccount ({
            state,
            dispatch
        }, switchAccount) {
            return new Promise(async resolve => {
                // store 赋值
                state.switchAccount = switchAccount
                // 持久化
                await dispatch('ibps/db/set', {
                    dbName: 'sys',
                    path: 'switchAccount',
                    value: switchAccount,
                    user: true
                }, { root: true })
                // end
                resolve()
            })
        },
        /**
         * 切换用户
         * @param {*} param0
         * @param {*} username
         */
        switchUser ({
            state,
            dispatch
        }, username) {
            return new Promise(async (resolve, reject) => {
                const switchAccount = state.account
                let token = getToken()
                if (Utils.isEmpty(token)) {
                    await dispatch('ibps/account/refreshToken', null, { root: true })
                    token = getToken()
                    if (Utils.isEmpty(token)) {
                        reject(token)
                        return
                    }
                }

                await switchUser({
                    username: username,
                    token: token
                }).then(async response => {
                    const data = response.data
                    // 更新token信息
                    await dispatch('ibps/account/updataTokenInfo', data, { root: true })
                    // 更新用户信息
                    await dispatch('setAccount', username)
                    // 更新切换用户信息
                    await dispatch('setSwitchAccount', switchAccount)
                    // 清除子系统
                    // await dispatch('ibps/system/set', null, { root: true })
                    //  清除菜单
                    await dispatch('ibps/menu/menusSet', null, { root: true })
                    // 重置路由
                    // resetUrlRouter('/dashboard')
                    resolve(data)
                }).catch(err => {
                    console.error('switchUser-err: ', err)
                    reject(err)
                })
            })
        },
        /**
         * 退出切换
         * @param {*} param0
         */
        exitSwitchUser ({
            state,
            dispatch
        }) {
            return new Promise(async (resolve, reject) => {
                const switchAccount = state.switchAccount
                let token = getToken()
                if (Utils.isEmpty(token)) {
                    await dispatch('ibps/account/refreshToken', null, { root: true })
                    token = getToken()
                    if (Utils.isEmpty(token)) {
                        reject(token)
                        return
                    }
                }
                await exitSwitchUser({
                    username: switchAccount,
                    token: token
                }).then(async response => {
                    const data = response.data
                    // 更新token信息
                    await dispatch('ibps/account/updataTokenInfo', data, { root: true })
                    // 更新用户信息
                    await dispatch('setAccount', switchAccount)
                    // 更新切换用户信息
                    await dispatch('setSwitchAccount', '')
                    // 清除子系统
                    // await dispatch('ibps/system/set', null, { root: true })
                    //  清除菜单
                    await dispatch('ibps/menu/menusSet', null, { root: true })

                    // 重置路由
                    // resetUrlRouter('/')
                    resolve(data)
                }).catch(err => {
                    console.error('refreshAccessToken-err: ', err)
                    reject(err)
                })
            })
        },
        getRegister ({
            state
        }) {
            return new Promise(async (resolve, reject) => {
                await getRegisterOpen().then(async response => {
                    const regOpen = response.data
                    state.regOpen = regOpen
                    resolve(regOpen)
                }).catch(err => {
                    console.error('getRegisterInfo:', err)
                    reject(err)
                })
            })
        },
        /**
         * @description 切换更新租户ID数据
         * @param {Object} state vuex state
         * @param {String} tenantid 租户ID
         */
        setTenantids ({ state }, tenantid) {
            state.info.tenantId = tenantid
        },
        setDesignTenantid ({ state }, designTenantid) {
            state.designTenantid = designTenantid
        }
    }
}
