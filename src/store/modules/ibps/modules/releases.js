import util from '@/utils/util.js'
import setting from '@/setting.js'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description 显示版本信息
     * @param {Object} state state
     */
    versionShow() {
      util.log.capsule('ibps', `v${setting.releases.version}`)
    }
  }
}
