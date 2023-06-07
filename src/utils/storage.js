/**
 * 缓存处理
 * 存储到localStorage中，避免刷新页面数据丢失
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import Utils from '@/utils/util'
import setting from '@/setting.js'

const globalKey = setting.globalKey + '-'

const storage = {
  /**
   * 存储localStorage
   */
  set: (key, value, options = {}, isPrefix = true) => {
    const obj = {
      dataType: typeof (value),
      value: value,
      type: options.type,
      datetime: options.datetime || new Date().getTime()
    }
    key = isPrefix ? globalKey + key : key
    if (options.type) {
      window.sessionStorage.setItem(key, JSON.stringify(obj))
    } else {
      window.localStorage.setItem(key, JSON.stringify(obj))
    }
  },
  /**
   * 获取localStorage
   */
  get: (key, defaultValue, isPrefix = true) => {
    let obj = {}
    let value
    key = isPrefix ? globalKey + key : key
    obj = window.localStorage.getItem(key)
    if (Utils.isEmpty(obj)) obj = window.sessionStorage.getItem(key)
    if (Utils.isEmpty(obj)) return defaultValue
    obj = JSON.parse(obj)
    if (obj.dataType === 'string') {
      value = obj.value
    } else if (obj.dataType === 'number') {
      value = Number(obj.value)
    } else if (obj.dataType === 'boolean') {
      value = Boolean(obj.value)
    } else if (obj.dataType === 'object') {
      value = obj.value
    }
    return value
  },
  /**
   * 删除localStorage
   */
  remove: (key) => {
    key = globalKey + key
    window.sessionStorage.removeItem(key)
    window.localStorage.removeItem(key)
  },
  /**
   * 清空localStorage
   */
  clear: () => {
    window.sessionStorage.clear()
    window.localStorage.clear()
  }

}

export default storage
