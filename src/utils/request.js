/**
 * 和服务端进行交互
 *  它封装了全局 request拦截器、respone拦截器、统一的错误处理、统一做了超时，baseURL设置等
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
// Internationalization 国际化
import I18n from '@/utils/i18n'
import Utils from '@/utils/util'
import Ids from 'ids'
import setting from '@/setting.js'

// 验权
import { getToken, updateToken, removeRefreshToken } from '@/utils/auth'
import { refreshAccessToken } from '@/api/oauth2/user'

import { showFullScreenLoading, tryHideFullScreenLoading } from './loading'

import requestState from '@/constants/state'
import { BASE_API, BASE_GATEWAY_API } from '@/api/baseUrl'
import { HEADER_TOKEN_KEY, HEADER_SYSTEM_ID, HEADER_TENANT_ID, MULTIPLE_DOMAIN, API_DOMAIN_NAMES } from '@/constant'

// 请求超时（timeout）时间
const TIMEOUT = setting.requestTimeout

/**
 * 创建axios实例
 */
const service = axios.create({
    // request timeout
    timeout: TIMEOUT,
    // 跨域安全策略
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json;charset=utf-8'
    }
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
// 取消请求
let cancelRequest = false

let requestCount = 0

/**
 * 请求(request)拦截器
 *
 * get请求，统一参数放在params里面，后台对应只有@RequestParam
 * `params`是即将与请求一起发送的 URL 参数，必须是一个无格式对象(plain object)或 URLSearchParams 对象
 * 
 * post请求，统一参数放在data里面——json格式，后台对应@RequestBody ,其他 后台对应@RequestParam
 * `data` 是作为请求主体被发送的数据
 * 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
 * 在没有设置 `transformRequest` 时，必须是以下类型之一：
 * - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
 * - 浏览器专属：FormData, File, Blob
 * - Node 专属： Stream
 * post 请求 `params` 这个同get 但要注意 后台对应@RequestParam 请求的`Content-Type`是 application/x-www-form-urlencoded 用 qs.stringify 去构造数据
 */
service.interceptors.request.use(async config => {
    if (!config.baseURL) {
        config.baseURL = BASE_API(parseInt(requestCount / 5, 10))
        if (MULTIPLE_DOMAIN) {
            requestCount >= ((API_DOMAIN_NAMES.length - 1) * 5) ? requestCount = 0 : requestCount++
        }
    }
    if (config.gateway) {
        config.baseURL = BASE_GATEWAY_API()
    }

    config.isLoading = config.isLoading !== undefined && config.isLoading !== null ? config.isLoading : false
    if (config.isLoading) {
        showFullScreenLoading(config.loading)
    }
    // 如果超时不对还原默认超时时间
    if (config.timeout !== TIMEOUT) {
        config.timeout = TIMEOUT
    }
    // 只设置当前的时间设置以设置为准
    if (Utils.isNotEmpty(config.overtime)) {
        config.timeout = config.overtime
    }
    // 防止缓存
    if (config.method.toUpperCase() === 'GET') {
        config.params = {
            ...config.params,
            _t: new Ids([32, 36, 1]).next()
        }
    }

    // 判断是否需要token
    if (setting.whiteRequestList.indexOf(config.url) !== -1) {
        return config
    }
    config.headers[HEADER_TOKEN_KEY] = getToken()
    // 系统ID
    if (store && store.getters.systemid) {
        config.headers[HEADER_SYSTEM_ID] = store.getters.systemid
    }
    // 租户ID
    if (store && store.getters.tenantid) {
        config.headers[HEADER_TENANT_ID] = store.getters.designTenantid ? store.getters.designTenantid : store.getters.tenantid
    }
    // 租户模式
    if (store && store.getters.isTenantOpen) {
        config.headers[HEADER_TENANT_ID] = store.getters.designTenantid ? store.getters.designTenantid : store.getters.tenantid
    }
    return config
}, error => {
    tryHideFullScreenLoading()
    // Do something with request error
    // for debug
    Utils.log.error('request' + error)
    Promise.reject(error)
})

/**
 * 响应(respone)拦截器
 */
service.interceptors.response.use(response => {
    //临时关闭了保存等待的取消功能
    tryHideFullScreenLoading()

    const dataAxios = response.data
    const { state, message, cause } = dataAxios
    // 获取接口保留参数，用于部分接口的后续请求
    const { retainData } = response.config
    if (response.config.responseType === 'arraybuffer') {
        // 刷新tonken
        return response
    }
    // 如果没有 state 代表这不是项目后端开发的接口 比如可能是请求最新版本,或者是请求的数据，或者是
    if (state === undefined) {
        const msg = '接口异常，没有返回[state]参数</br>' + response.config.url
        Message.closeAll()
        Message({
            message: `${msg}`,
            type: 'error',
            showClose: true,
            dangerouslyUseHTMLString: true,
            duration: 10000
        })
        return
    }
    // state为200是正确的请求 或者 验证码问题,或者警告类型的错误 自行处理
    if (state === requestState.SUCCESS || state === requestState.UNSUPORT || state === requestState.WARNING || state === requestState.WARN) {
        return { ...dataAxios, retainData }
    }
    // 处理刷新tonken问题,说明token过期了,刷新token
    if (state === requestState.TOKEN_EXPIRED) {
        const config = response.config
        if (!isRefreshing) {
            isRefreshing = true
            return refreshAccessToken().then(res => {
                const data = res.data
                updateToken(data)
                const token = getToken()
                config.headers[HEADER_TOKEN_KEY] = token
                // 已经刷新了token，将所有队列中的请求进行重试
                requests.forEach(cb => cb(token))
                requests = []
                return service(config)
            }).catch(res => {
                console.error('refreshtoken error =>', res)
                removeRefreshToken()
                window.location.href = this.$baseUrl
            }).finally(() => {
                isRefreshing = false
            })
        } else {
            // 正在刷新token，将返回一个未执行resolve的promise
            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                requests.push((token) => {
                    config.headers[HEADER_TOKEN_KEY] = token
                    resolve(service(config))
                })
            })
        }
        // 6020201:非法的token;6020202:其他客户端登录了;6020301:Token 过期了;
    } else if (state === requestState.ILLEGAL_TOKEN ||
        state === requestState.OTHER_CLIENTS) {
        if (!cancelRequest) {
            cancelRequest = false
            MessageBox.confirm(
                I18n.t('error.logout.message'),
                I18n.t('error.logout.title'), {
                confirmButtonText: I18n.t('error.logout.confirmButtonText'),
                cancelButtonText: I18n.t('error.logout.cancelButtonText'),
                type: 'warning'
            }).then(() => {
                store.dispatch('ibps/account/fedLogout').then(() => {
                    // 终止所有请求
                    cancelRequest = true
                    router.push({
                        name: 'login'
                    })
                }).catch(() => {
                    cancelRequest = false
                })
            }).finally(() => {
                cancelRequest = false
            })
        }
        return Promise.reject(new Error(message))
    } else { // 错误处理
        let errorMsg = ''
        if (Utils.isNotEmpty(message)) { // 有错误消息
            errorMsg = Utils.isNotEmpty(dataAxios.cause) ? I18n.t('error.messageCause', {
                message,
                cause: dataAxios.cause
            }) : I18n.t('error.message', {
                message
            })
        } else if (Utils.isNotEmpty(cause)) { // 只有错误原因
            errorMsg = I18n.t('error.cause', {
                cause
            })
        } else if (I18n.te('error.status.' + state)) { // 有错误编码
            errorMsg = I18n.t('error.status.' + state)
        } else { // 未知
            errorMsg = message || I18n.t('error.unknown', {
                state
            })
        }
        Message.closeAll()
        Message({
            message: `${errorMsg}`,
            type: 'error',
            showClose: true,
            dangerouslyUseHTMLString: true,
            duration: 5 * 1000
        })
        const err = new Error(errorMsg)
        err.state = state
        err.cause = cause
        return Promise.reject(err)
    }
},
    // 异常处理
    error => {
        tryHideFullScreenLoading()
        // for debug
        console.error('request-error', error)
        if (error && error.response) {
            error.message = I18n.t('error.status.' + error.response.status, {
                url: error.response.config.url
            })
        } else {
            error.state = 500
            // '服务器君开小差了，请稍后再试'
            error.message = I18n.t('error.network')
        }
        Message.closeAll()
        Message({
            message: error.message || I18n.t('error.network'),
            type: 'error',
            showClose: true,
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service