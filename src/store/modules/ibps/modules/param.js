export default {
    namespaced: true,
    state: {
        // 所有菜单
        myform: '',
        // 所有用户信息
        userList: [],
        // 所有部门信息
        deptList: [],
        // 当前用户层级
        level: {
            first: '',
            second: ''
        }
    },
    mutations: {
        myformSet (state, myform) {
            state.myform = myform.myform || ''
        },
        userList (state, data) {
            state.userList = data.length ? data : []
        },
        deptList (state, data) {
            state.deptList = data.length ? data : []
        },
        level (state, data) {
            state.level = data || { first: '', second: '' }
        }
    },
    actions: {
        setUserList ({ commit }, data) {
            commit('userList', data)
        },
        setDeptList ({ commit }, data) {
            commit('deptList', data)
        },
        setLevel ({ commit }, data) {
            console.log(data)
            commit('level', data)
        }
    }
}
