export default {
    namespaced: true,
    state: {
        // 所有菜单
        myform: '',
        // 所有用户信息
        usersList: [],
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
        usersList (state, data) {
            state.usersList = data.length ? data : []
        },
        level (state, data) {
            state.level = data || { first: '', second: '' }
        }
    },
    actions: {
        setUsersList ({ commit }, data) {
            commit('usersList', data)
        },
        setLevel ({ commit }, data) {
            console.log(data)
            commit('level', data)
        }
    }
}
