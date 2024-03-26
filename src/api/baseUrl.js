import store from '@/store'
import {
    BASE_API as baseApi,
    BASE_GATEWAY_API as gatewayApi,
    BASE_WEBSOCKET as baseWebsocket,
    SINGLE, MULTIPLE_DOMAIN, API_DOMAIN_NAMES
} from '@/constant'

export const SINGLE_APP = () => {
    if (!store || typeof (store.getters.single) === 'undefined') {
        return SINGLE
    }
    return store.getters.single
}

const getApi = (api, i) => {
    if (i === null || i === undefined) {
        i = 0
    }
    const domainName = API_DOMAIN_NAMES[i] || API_DOMAIN_NAMES[0] || ''

    return api.replace('{DOMAIN}', domainName)
}

// 默认url
export const BASE_API = function (i) {
    const api = store && store.getters.baseApi ? store.getters.baseApi : baseApi
    return MULTIPLE_DOMAIN ? getApi(api, i) : api
}
// 网关API 解决上传乱码问题
export const BASE_GATEWAY_API = function (i) {
    const api = store && store.getters.baseApi ? store.getters.baseApi : gatewayApi
    return MULTIPLE_DOMAIN ? getApi(api, i) : api
}
// websocket地址
export const BASE_WEBSOCKET_API = (i) => {
    const api = store && store.getters.websocket ? store.getters.websocket : baseWebsocket
    return MULTIPLE_DOMAIN ? getApi(api, i) : api
}
export const OAUTH2_BASE_URL = () => {
    return SINGLE_APP() ? '' : '/oauth2/v3'
}
export const PLATFORM_BASE_URL = () => {
    return SINGLE_APP() ? '' : '/platform/v3'
}

export const BUSINESS_BASE_URL = () => {
    return SINGLE_APP() ? '' : '/business/v3'
}

// ========== business=================

export const OAUTH2_URL = () => {
    return OAUTH2_BASE_URL()
}
// ========== business=================
export const FORM_URL = () => {
    return BUSINESS_BASE_URL()
}

export const BPMN_URL = () => {
    return BUSINESS_BASE_URL()
}
export const DATA_URL = () => {
    return BUSINESS_BASE_URL()
}
export const CODEGEN_URL = () => {
    return BUSINESS_BASE_URL()
}

// ========== PLATFORM_BASE_URL=================
export const PLATFORM_URL = () => {
    return PLATFORM_BASE_URL()
}
export const ORG_URL = () => {
    return PLATFORM_BASE_URL()
}
export const AUTH_URL = () => {
    return PLATFORM_BASE_URL()
}
export const SAAS_URL = () => {
    return PLATFORM_BASE_URL()
}
export const CAT_URL = () => {
    return PLATFORM_BASE_URL()
}
export const JOB_URL = () => {
    return PLATFORM_BASE_URL()
}
export const SYSTEM_URL = () => {
    return PLATFORM_BASE_URL()
}
export const LOG_URL = () => {
    return PLATFORM_BASE_URL()
}
export const MSG_URL = () => {
    return PLATFORM_BASE_URL()
}
export const MAIL_URL = () => {
    return PLATFORM_BASE_URL()
}
export const OFFICE_URL = () => {
    return PLATFORM_BASE_URL()
}
export const SERV_URL = () => {
    return PLATFORM_BASE_URL()
}

export const DS_URL = () => {
    return PLATFORM_BASE_URL()
}
export const INFO_URL = () => {
    return PLATFORM_BASE_URL()
}

export const SOCKET_URL = () => {
    return PLATFORM_BASE_URL()
}

