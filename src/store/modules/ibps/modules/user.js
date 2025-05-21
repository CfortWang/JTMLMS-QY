import { getUserInfo, switchUser, exitSwitchUser, getRegisterOpen } from '@/api/oauth2/user'
import { getToken, getUuid } from '@/utils/auth'
import Utils from '@/utils/util'
import common from '@/utils/common'
import router from '@/router'
import { getSetting } from '@/utils/query'

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
                // 存储许可证信息
                await dispatch('ibps/licence/setLicence', JSON.parse(localStorage.getItem('licence')), { root: true })

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
                        /**
                         * store 统一存储高权限角色，用于各模块校验附件下载权限
                         * 初定角色为：系统管理角色、主任、质量负责人、技术负责人、专业组组长、文件管理负责人、文件管理员，文件下载角色
                         */
                        info.highRoles = ['xtgljs', 'syszr', 'zlfzr', 'jsfzr', 'zhsfzr', 'wjglzzc', 'wjgly', 'wjxzjs']

                        let level = {}
                        if (info.positions && info.positions.length) {
                            // 当存在第二级为空时，说明具备最高级权限
                            const hasFirst = info.positions.some(obj => obj.path.split('.')[1] === '')
                            level = {
                                first: [...new Set(info.positions.map(obj => obj.path.split('.')[0]))].join(','),
                                second: hasFirst ? '' : [...new Set(info.positions.map(obj => obj.path.split('.')[1]))].join(',')
                            }
                            await dispatch('ibps/param/setLevel', level, {
                                root: true
                            })
                        }
                        // 获取所有配置信息
                        await dispatch('ibps/param/setSetting', await getSetting(), {
                            root: true
                        })
                        // 获取所有用户信息
                        await dispatch('getUserList', level)
                        // 获取所有部门信息
                        await dispatch('getDeptList', level)
                        // 获取当前子系统
                        await dispatch('ibps/system/loadSystem', null, {
                            root: true
                        })
                        // 尝试从配置数据中获取 否则使用默认
                        const highRoles = await getSetting('system', 'highRoles')
                        Utils.isNotEmpty(highRoles) && (info.highRoles = highRoles)
                        const { role = [] } = info || {}
                        const hasHighRole = role.some(item => info.highRoles.includes(item.alias))
                        // 用于文件预览页判定是否开启下载权限
                        localStorage.setItem('hasHighRole', hasHighRole ? 1 : 0)
                        // 设置当前
                        await dispatch('ibps/user/set', info, {
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
        setAccount ({ state, dispatch }, account) {
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
         * 获取所有系统用户账号
         */
        getUserList ({ state, dispatch }, { first, second }) {
            const params = second ? `'%${second}%' or entity.id_ = '${first}'` : first ? `'%${first}%'` : '%%'
            const sql = `select users.id_ as userId, users.name_ as userName, ifnull(users.mobile_, '') as phone, ifnull(group_concat(distinct positions.id_ order by positions.id_ separator ','), '') as positionId, ifnull(group_concat(distinct positions.name_ order by positions.id_ separator ','), '') as positions, ifnull(group_concat(distinct roles.id_ order by roles.role_note_ asc separator ','), '') as roleId, ifnull(group_concat(distinct roles.name_ order by roles.role_note_ asc separator ','), '') as roles, (select ifnull(people.qian_zi_tu_wen_, '') from t_ryjbqk as people where people.parent_id_ = users.id_ order by create_time_ desc limit 1) as signatureId, (select ifnull(files.file_name_, '') from ibps_file_attachment as files where files.id_ = signatureId) as signatureName from ibps_party_employee as users left join (select ur.user_id_, r.role_note_, group_concat(distinct r.id_ order by r.id_ separator ',') as id_, group_concat(distinct r.name_ order by r.id_ separator ',') as name_ from ibps_party_user_role as ur join ibps_party_role as r on ur.role_id_ = r.id_ group by ur.user_id_) as roles on users.id_ = roles.user_id_ left join ibps_party_entity as positions on find_in_set(positions.id_, users.positions_) where exists (select 1 from ibps_party_entity as entity where find_in_set(entity.id_, users.positions_) and (entity.path_ like ${params})) and users.status_ = 'actived' group by users.id_`
            common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                dispatch('ibps/param/setUserList', data, {
                    root: true
                })
            }).catch(error => {
                console.log(error)
                alert('获取所有用户信息失败！')
            })
        },
        /**
         * 获取所有系统部门信息
         */
        getDeptList ({ state, dispatch }, { first, second }) {
            const params = second ? ` and (pe.path_ like '%${second}%' or pe.id_ = '${first}')` : first ? ` and pe.path_ like '%${first}%'` : ''
            // const sql = `select id_ as positionId, name_ as positionName, path_ as path, depth_ as depth, sn_ as sn from ibps_party_entity where party_type_ = 'position'${params} order by depth_ asc, sn_ asc`
            const sql = `select pe.id_ as positionId, pe.name_ as positionName, pe.path_ as path, pe.depth_ as depth, pe.party_alias_ as alias, pe.sn_ as sn, ifnull(r.name_, '') as manager, ifnull(r.id_, '') as managerId from ibps_party_entity as pe left join (select em.id_, em.positions_, em.name_ from ibps_party_employee as em left join ibps_party_user_role as ur on em.id_ = ur.user_id_ left join ibps_party_role as pr on pr.id_ = ur.role_id_ where role_alias_ in ('zhsfzr', 'syszr', 'zhglzzc')) as r on find_in_set(pe.id_, r.positions_) > 0 where pe.party_type_ = 'position'${params} group by pe.id_ order by pe.depth_ asc, pe.sn_ asc,pe.id_ asc`
            common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                dispatch('ibps/param/setDeptList', data, {
                    root: true
                })
            }).catch(error => {
                console.log(error)
                alert('获取所有部门信息失败！')
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
        setSwitchAccount ({ state, dispatch }, switchAccount) {
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
        switchUser ({ state, dispatch }, username) {
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
                    await router.push({ path: '/' })
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
                    // 刷新页面重新获取信息
                    location.reload()
                    // await dispatch('load')
                    // 重置路由
                    // resetUrlRouter('/')
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
        exitSwitchUser ({ state, dispatch }) {
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
                    await router.push({ path: '/' })
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
                    // 刷新页面重新获取信息
                    location.reload()
                    // 重置路由
                    // resetUrlRouter('/')
                    resolve(data)
                }).catch(err => {
                    console.error('refreshAccessToken-err: ', err)
                    reject(err)
                })
            })
        },
        getRegister ({ state }) {
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
