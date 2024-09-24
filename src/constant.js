/**
 * 常量配置
 *
 */
import env from '@/env'
/**
 * 读取静态配置
 * @private
 */
const __IBPS_CONFIG__ = window.__IBPS_CONFIG__ || {}

export default __IBPS_CONFIG__

const enableConfig = __IBPS_CONFIG__.ENABLE_CONFIG || false

/**
 * 接口服务器
 * @type {*|string}
 */
export const BASE_URL = enableConfig ? (__IBPS_CONFIG__.BASE_URL || env.VUE_APP_BASE_URL) : env.VUE_APP_BASE_URL
export const PUBLIC_URL = enableConfig ? (__IBPS_CONFIG__.PUBLIC_URL || env.PUBLIC_URL) : env.PUBLIC_URL
export const BASE_API = enableConfig ? (__IBPS_CONFIG__.BASE_API || env.VUE_APP_BASE_API) : env.VUE_APP_BASE_API
export const BASE_GATEWAY_API = enableConfig ? (__IBPS_CONFIG__.BASE_GATEWAY_API || env.VUE_APP_BASE_GATEWAY_API) : env.VUE_APP_BASE_GATEWAY_API
export const BASE_WEBSOCKET = enableConfig ? (__IBPS_CONFIG__.BASE_WEBSOCKET_API || env.VUE_APP_BASE_WEBSOCKET) : env.VUE_APP_BASE_WEBSOCKET
export const BASE_REPORT_API = enableConfig ? (__IBPS_CONFIG__.BASE_REPORT_API || env.VUE_APP_BASE_REPORT_API) : env.VUE_APP_BASE_REPORT_API
export const BASE_SEAL_API = __IBPS_CONFIG__.BASE_SEAL_API || ''

export const SINGLE = __IBPS_CONFIG__.SINGLE || false
export const API_DOMAIN_NAMES = __IBPS_CONFIG__.API_DOMAIN_NAMES || []
export const MULTIPLE_DOMAIN = __IBPS_CONFIG__.MULTIPLE_DOMAIN || false

// ================认证中心=====================

export const GRANT_TYPE = __IBPS_CONFIG__.GRANT_TYPE || ''
export const CLIENT_ID = __IBPS_CONFIG__.CLIENT_ID || ''
export const CLIENT_SECRET = __IBPS_CONFIG__.CLIENT_SECRET || ''

// ================请求头=====================
export const HEADER_TOKEN_KEY = __IBPS_CONFIG__.HEADER_TOKEN_KEY || 'X-Authorization-access_token'
export const FORM_TOKEN_KEY = __IBPS_CONFIG__.TOKEN_KEY || 'access_token'
export const HEADER_SYSTEM_ID = __IBPS_CONFIG__.HEADER_SYSTEM_ID || 'X-Authorization-systemid'
export const HEADER_TENANT_ID = __IBPS_CONFIG__.HEADER_TENANT_ID || 'X-Authorization-tenantid'
export const TENANT_ID = __IBPS_CONFIG__.TENANT_ID || 'tenant_id'

// ================Cookies 存储=====================
export const UUID_KEY = __IBPS_CONFIG__.UUID_KEY || 'uuid'
export const LANG_KEY = __IBPS_CONFIG__.LANG_KEY || 'lang'

export const TOKEN_STORE = __IBPS_CONFIG__.TOKEN_STORE || 'default'
export const TOKEN_DOMAIN = __IBPS_CONFIG__.TOKEN_DOMAIN || 'bpmhome.cn'
export const TOKEN_STORE_PREFIX = __IBPS_CONFIG__.TOKEN_STORE_PREFIX || 'default'
export const TOKEN_STORE_KEY = __IBPS_CONFIG__.TOKEN_STORE_KEY || 'token'
export const REFRESH_TOKEN_STORE_KEY = __IBPS_CONFIG__.REFRESH_TOKEN_STORE_KEY || 'refresh_token'

export const TRANSFER_DATA = __IBPS_CONFIG__.TRANSFER_DATA || 'transfer'

export const I18N_LOCALE = __IBPS_CONFIG__.I18N_LOCALE || 'zh-CN'
export const I18N_FALLBACK_LOCALE = __IBPS_CONFIG__.I18N_FALLBACK_LOCALE || 'zh-CN'

export const ELEMENT_COLOR = __IBPS_CONFIG__.ELEMENT_COLOR || '#409EFF'
export const SYSTEM_NAME = __IBPS_CONFIG__.SYSTEM_NAME || '金通医学实验室标准化数智化管理平台'
export const REPORT_PATH = __IBPS_CONFIG__.REPORT_PATH || '金通医学实验室管理系统'
// 是否显示明文SQL，开发环境默认显示
export const SHOW_PLAINTEXT = __IBPS_CONFIG__.SHOW_PLAINTEXT || env.NODE_ENV === 'development'
// 是否加密 GET 请求参数
export const ENCRYPT_GET_PARAMS = __IBPS_CONFIG__.ENCRYPT_GET_PARAMS || false
