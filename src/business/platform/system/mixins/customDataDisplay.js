/**
 * 自定义展示数据
 */
import { getIdentityTypeAccount, save, reset } from '@/api/platform/system/customDataDisplay'
export default {
  methods: {

    getCustomDataDisplay(identity, type = 'display', account) {
      if (!account) {
        account = this.$store.getters.account
      }
      return new Promise((resolve, reject) => {
        getIdentityTypeAccount({
          identity: identity,
          account: account,
          type: type
        }).then(response => {
          const data = response.data
          if (this.$utils.isNotEmpty(data)) {
            resolve(JSON.parse(data.scheme))
          } else {
            resolve([])
          }
        }).catch((err) => {
          reject(err)
        })
      })
    },
    saveCustomDataDisplay(scheme, identity, type = 'display', account) {
      if (!account) {
        account = this.$store.getters.account
      }
      const customDataDisplay = {
        'account': account,
        'identity': identity,
        'type': type
      }
      return new Promise((resolve, reject) => {
        if (this.$utils.isNotEmpty(scheme)) {
          customDataDisplay['scheme'] = JSON.stringify(scheme)
          save(customDataDisplay).then(response => {
            resolve(true)
          }).catch((err) => {
            reject(err)
          })
        } else {
          reset(customDataDisplay).then(response => {
            resolve(response)
          }).catch((err) => {
            reject(err)
          })
        }
      })
    }
  }
}
