import { Notification, Message } from 'element-ui'
import { SINGLE, BASE_API, BASE_WEBSOCKET } from '@/constant'
import env from '@/env'

let optionsEnv = []
const single = SINGLE
let base = BASE_API
let websocket = BASE_WEBSOCKET

if (process.env.NODE_ENV === 'development') {
  optionsEnv = Object.keys(env)
    .filter(keyName => /^VUE_APP_BASE_API_\d+_\w+$/.test(keyName))
    .map(keyName => {
      const [index, single, ...name] = keyName.replace('VUE_APP_BASE_API_', '').split('_')
      return {
        index: Number(index),
        single: Number(single) === 1,
        name: name.join('_'),
        value: env[keyName]
      }
    })
    .sort((a, b) => a.index - b.index)
    .map(e => ({
      single: e.single,
      name: e.name,
      value: e.value,
      type: 'env'
    }))

  base = BASE_API || (optionsEnv.length > 0 ? optionsEnv[0].value : '')

  websocket = BASE_WEBSOCKET || (optionsEnv.length > 0 ? optionsEnv[0].value : '')
}

export default {
  namespaced: true,
  state: {
    // 是否是单体
    single,
    // 网络请求地址
    base,
    // websocket 地址
    websocket,
    // env 中设置的地址选项
    optionsEnv,
    // 用户自己添加的地址
    optionsUser: []
  },
  getters: {
    // 混合系统提供的地址和用户自己设置的地址记录
    options(state) {
      return [
        ...state.optionsUser,
        ...state.optionsEnv
      ]
    }
  },
  actions: {
    /**
       * @description 设置自定义选项
       * @param {Object} vuex context
       * @param {String} value
       * @param {Boolean} single
       */
    async custom({ state, dispatch }, {
      baseUrl,
      single = false
    }) {
      // 如果和现在的值一样 直接返回
      if (state.base === baseUrl) return
      // 如果不是选项中的值 将其加入选项
      const findIndex = [
        ...state.optionsEnv,
        ...state.optionsUser
      ].map(e => e.value).indexOf(baseUrl)

      if (findIndex === -1) {
        state.optionsUser.push({
          name: '自定义',
          single: single,
          value: baseUrl,
          type: 'custom'
        })
        // 持久化用户自定义选项
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'api.optionsUser',
          value: state.optionsUser,
          user: false
        }, { root: true })
      } else {
        Notification({
          title: '接口地址已经存在！！',
          type: 'warning',
          message: baseUrl
        })
      }
    },
    /**
     *
       * @description 改变网络请求地址
       * @param {Object} vuex context
       * @param {String} value
       * @param {Boolean} single
     */
    async set({ state, dispatch }, {
      baseUrl,
      single = false,
      vm
    }) {
      // 设置当前子系统为空
      await dispatch('ibps/system/set', null, {
        root: true
      })
      // 注销当前用户登录
      await dispatch('ibps/account/fedLogout', {
        vm: vm
      }, { root: true })

      // 接口地址变更
      state.base = baseUrl
      // 持久化接口地址设置
      await dispatch('ibps/db/set', {
        dbName: 'sys',
        path: 'api.base',
        value: state.base,
        user: false
      }, { root: true })

      // 单体应用变更
      state.single = single
      // 持久化单体应用设置
      await dispatch('ibps/db/set', {
        dbName: 'sys',
        path: 'api.single',
        value: state.single,
        user: false
      }, { root: true })
      // 显示提示
      Notification({
        title: '接口地址变更',
        message: baseUrl
      })
    },
    /**
       * @description 删除一个用户自己的地址配置
       * @param {Object} vuex context
       * @param {String} value
       */
    async remove({ state, dispatch }, value) {
      const index = state.optionsUser.map(e => e.value).indexOf(value)
      if (index >= 0) {
        // 移除
        state.optionsUser.splice(index, 1)
        // 持久化用户自定义选项
        await dispatch('ibps/db/set', {
          dbName: 'sys',
          path: 'api.optionsUser',
          value: state.optionsUser,
          user: false
        }, { root: true })

        // 显示提示
        Message({
          message: `${value} 已经删除`,
          type: 'success'
        })
      }
    },
    /**
       * @description 加载设置
       * @param {Object} vuex context
       */
    async load({ state, dispatch }) {
      if (process.env.NODE_ENV !== 'development') {
        return
      }
      // 加载接口地址设置
      state.base = await dispatch('ibps/db/get', {
        dbName: 'sys',
        path: 'api.base',
        defaultValue: base,
        user: false
      }, { root: true })

      // 加载单体应用设置
      state.single = await dispatch('ibps/db/get', {
        dbName: 'sys',
        path: 'api.single',
        defaultValue: single,
        user: false
      }, { root: true })

      // 加载接口地址设置
      state.optionsUser = await dispatch('ibps/db/get', {
        dbName: 'sys',
        path: 'api.optionsUser',
        defaultValue: [],
        user: false
      }, { root: true })
    }
  }
}
