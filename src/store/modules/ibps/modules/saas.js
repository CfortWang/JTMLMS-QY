import { register } from '@/api/saas/tenant/tenant'
import { open } from '@/api/oauth2/user'

export default {
  namespaced: true,
  state: {
    // 用户信息
    tenantOpen: false
  },
  actions: {
    /**
     *  @description 是否开启注册
     *
     */
    getRegisterTenantOpen({
      state
    }) {
      return new Promise((resolve, reject) => {
        open().then(response => {
          const regOpen = response.data
          state.tenantOpen = regOpen
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 注册帐号
     * @param {*} param context 上下文
     * @param {*} form 表单
     */
    register({
      commit,
      dispatch
    }, form) {
      return new Promise(async(resolve, reject) => {
        // 开始请求注册接口
        register(form).then(response => {
          resolve()
        }).catch(err => {
          console.error('err: ', err)
          reject(err)
        })
      })
    }
  }
}
