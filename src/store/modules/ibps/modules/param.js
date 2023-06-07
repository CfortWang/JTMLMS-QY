export default {
    namespaced: true,
    state: {
        // 所有菜单
        jianCeDuiXiangId: '',
        jianCeCanShuId: '',
        myform: '',
        // 所有检测项目名称及流程key数组
        testingList: [],
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
        testingList(state, data) {
            state.testingList = data.length ? data : []
        },
        usersList(state, data) {
            state.usersList = data.length ? data : []
        }
    },
    actions: {
        setTestingList({ commit }, data){
            commit('testingList', data)
        },
        setUsersList({ commit }, data){
            commit('usersList', data)
        }
    }
}
