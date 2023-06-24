export default {
    namespaced: true,
    state: {
        // 所有菜单
        jianCeDuiXiangId: '',
        jianCeCanShuId: '',
        myform: '',
        // 所有用户信息
        usersList: []
    },
    mutations: {
        jianCeDuiXiangIdSet(state, jianCeDuiXiang) {
            state.jianCeDuiXiangId = jianCeDuiXiang.jianCeDuiXiangId || ''
        },
        myformSet(state, myform) {
            state.myform = myform.myform || ''
        },
        jianCeCanShuIdSet(state, jianCeCanShu) {
            state.jianCeCanShuId = jianCeCanShu.jianCeCanShuId || ''
        },
        usersList(state, data) {
            state.usersList = data.length ? data : []
        }
    },
    actions: {
        setUsersList({ commit }, data){
            commit('usersList', data)
        }
    }
}
