import util from '@/utils/util.js'
import setting from '@/setting.js'
const __IBPS_CONFIG__ = window.__IBPS_CONFIG__ || {}

export default {
    namespaced: true,
    mutations: {
        /**
         * @description 显示版本信息
         * @param {Object} state state
         */
        versionShow () {
            util.log.capsule('ibps', `v${__IBPS_CONFIG__.VERSION}`)
        }
    }
}
