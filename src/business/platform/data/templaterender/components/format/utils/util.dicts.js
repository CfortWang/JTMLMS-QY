const cache = new Map()
import { findByTypeKey } from '@/api/platform/cat/dictionary'
import TreeUtils from '@/utils/tree'
/**
 * 远程获取数据字典
 * @param dict 数据字典配置
 * @returns {Promise<any>|Promise<T | never>}
 */
function get(dict) {
  if (dict == null) {
    // 如果没有配置字典，直接返回空数组
    console.error('没有配置数据字典，返回空数组')
    return new Promise((resolve) => {
      resolve([])
    })
  }

  let typeKey = null
  let dictData = null

  if (typeof (dict) === 'string') {
    typeKey = dict
  } else {
    this.mergeDefault(dict)
    typeKey = dict.typeKey
    dictData = dict.data
  }
  if (dictData != null) {
    // 配置中就有字典数据，直接返回
    if (dictData instanceof Promise) {
      return dictData
    }
    return new Promise((resolve) => {
      resolve(dictData)
    })
  }
  if (typeKey == null) {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  // 远程获取
  let item = cache.get(typeKey)
  if (item == null || item.error === true) {
    // 还没加载过
    if (item == null) {
      item = { loading: true, callbacks: [] }
      cache.set(typeKey, item)
    }

    item.loading = true
    item.error = false
    // 远程加载
    return this.getRemoteDictFunc(typeKey, dict).then((ret) => {
      // prop mapping
      let data = ret.data
      if (data == null) {
        data = ret
      }
      item.data = data
      // 之前注册过的callback全部触发
      for (const callback of item.callbacks) {
        callback(item.data)
      }
      item.loading = false
      item.callbacks = []
      return data
    }).catch(() => {
      item.loading = false
      item.error = true
    })
  } else if (item.loading === true) {
    // 正在加载中，注册callback，等加载完了之后，再统一触发，就只需要向服务器请求一次字典
    return new Promise((resolve) => {
      const callback = (data) => {
        resolve(data)
      }
      item.callbacks.push(callback)
    })
  } else {
    //  从缓存拿
    return new Promise((resolve) => {
      resolve(item.data)
    })
  }
}

function clear(url) {
  if (url == null) {
    cache.clear()
  } else {
    cache.delete(url)
  }
}
function getRemoteDictFunc(typeKey, dict) {
  return new Promise((resolve, reject) => {
    findByTypeKey({ typeKey: typeKey }).then(response => {
      const data = response.data
      const treeData = TreeUtils.transformToTreeFormat(data)
      if (dict.displayMode === 'path') {
        buildPathData(treeData, dict)
      }
      resolve(treeData)
    }).catch((error) => {
      reject(error)
    })
  })
}

const defaultDict = {
  valueKey: 'key',
  labelKey: 'name',
  colorKey: 'color',
  childrenKey: 'children',
  separator: '/',
  displayMode: 'path',
  pathKey: 'name',
  isTree: true
}

function mergeDefault(dict) {
  if (dict == null) {
    throw new Error('dict 不能为空')
  }
  if (typeof (dict) === 'string') {
    return
  }
  for (const key in defaultDict) {
    if (dict[key] == null) {
      dict[key] = defaultDict[key]
    }
  }
}
function getCache(key) {
  return cache.get(key)
}
function putCache(key, value) {
  console.log('set cache:', key)
  return cache.set(key, value)
}

function buildPathData(data, setting) {
  const childrenKey = setting.childrenKey
  const labelKey = setting.labelKey
  const separator = setting.separator
  const pathKey = setting.pathKey
  const traverse = (arr, lablePrefix = []) => {
    for (let i = 0; i < arr.length; i++) {
      const child = arr[i]
      let labelData = child[labelKey]
      if (typeof labelKey !== 'string') {
        labelData = this.labelKey(child)
      }
      child[pathKey] = [...lablePrefix, labelData].join(separator)
      if (child[childrenKey] && child[childrenKey].length > 0) {
        traverse(child[childrenKey], [...lablePrefix, labelData])
      }
    }
  }
  traverse(data)
}

function getByValue(value, data, dict) {
  let node = null
  const labelKey = dict.labelKey
  const valueKey = dict.valueKey
  const separator = dict.separator
  const traverse = (arr, lablePrefix = []) => {
    for (let i = 0; i < arr.length; i++) {
      const child = arr[i]
      let labelData = child[labelKey]
      if (typeof labelKey !== 'string') {
        labelData = this.labelKey[child]
      }

      if (child[valueKey] === value) {
        node = {
          label: labelData,
          value: child[valueKey],
          path: [...lablePrefix, labelData].join(separator),
          data: child
        }
        break
      } else if (child.children && child.children.length > 0) {
        traverse(child.children, [...lablePrefix, labelData])
      }
    }
  }
  traverse(data)
  return node
}

const dict = {
  get,
  getByValue,
  clear,
  getCache,
  putCache,
  mergeDefault,
  getRemoteDictFunc
}

export default dict
