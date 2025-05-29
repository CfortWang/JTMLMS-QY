import request from '@/utils/request'
import { normal } from './requestType'
import { encryptByAes } from '@/utils/encrypt'
import { mapValues } from 'lodash'
import { SHOW_PLAINTEXT } from '@/constant'
import { getToken } from '@/utils/auth'

const replaceNullWithEmpty = obj => {
    function replaceValue (value) {
        if (value === null) {
            return ''
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value.map(item => replaceValue(item))
            } else {
                return mapValues(value, v => replaceValue(v))
            }
        } else {
            return value
        }
    }
    return replaceValue(obj)
}

// 处理数据
const dealData = (args, type) => {
    if (type === 'query') {
        return JSON.stringify(args)
    }
    // sql方法特殊处理
    if (type === 'sql') {
        args = {
            sql: args.replace(/\n/g, ' ')
        }
    }
    const data = typeof args === 'object' ? replaceNullWithEmpty(args) : args
    const plaintext = SHOW_PLAINTEXT ? { plaintext: data } : {}
    const res = {
        ciphertext: encryptByAes(data, 'dynamic', getToken()),
        ...plaintext
    }
    return JSON.stringify(res)
}

const BASE_URL = 'business/v3/sys/universal/'
const DEFAULT_METHOD = 'post'
const DEFAULT_LOADING = false

const post = (type, data, method = DEFAULT_METHOD, loading = DEFAULT_LOADING) => {
    const requestUrl = `${BASE_URL}${normal[type]}`
    const isQueryType = type === 'query'

    // 查询类型默认无 loading 动画，非查询类型要关闭 loading 动画需传参 loading:true
    const isLoading = ['sql', 'query'].includes(type) ? loading : !loading

    return request({
        url: requestUrl,
        method,
        isLoading,
        data: dealData(data, type)
        // ...(isQueryType ? { data: JSON } : { data: dealData(data, type) })
    })
}

export default post
