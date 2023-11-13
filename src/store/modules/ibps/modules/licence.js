export default {
    namespaced: true,
    state: {
        licJson: {}
    },
    mutations: {
        updateLicJson (state, data) {
            state.licJson = data
        }
    },
    actions: {
        setLicence ({ commit }, data) {
            commit('updateLicJson', data)
        }
    }
}
