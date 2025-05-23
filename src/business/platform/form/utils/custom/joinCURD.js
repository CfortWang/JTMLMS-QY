import request from '@/utils/request'
import { normal } from './requestType'
import { encryptByAes } from '@/utils/encrypt'
import { mapValues } from 'lodash'
import { SHOW_PLAINTEXT } from '@/constant'
import { getToken } from '@/utils/auth'
// 请求方式默认POST
const post = (type, data, method = 'post', loading = false) => {
    const requestUrl = `business/v3/sys/universal/${normal[type]}`
    // 非sql类型要关闭loading动画需传参loading:true
    const isLoading = type === 'sql' ? loading : !loading
    return request({
        url: requestUrl,
        method,
        data: dealData(data, type),
        // 开启表单提交加载，查询接口除外
        isLoading
    })
}

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

export default post
