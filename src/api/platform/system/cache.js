import request from '@/utils/request'
import { PLATFORM_URL, FORM_URL, OAUTH2_URL } from '@/api/baseUrl'

/**
 * 清除平台缓存
 * @param {*} params
 */
// export function cleanPlatformCache(params) {
export const cleanPlatformCache = (params) => {
    return request({
        url: PLATFORM_URL() + '/platform/cache/system/flushAll',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 清除表单缓存
 * @param {*} params
 */
// export function cleanFormCache(params) {
export const cleanFormCache = (params) => {
    return request({
        url: FORM_URL() + '/form/cache/system/flushAll',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 清除认证缓存
 * @param {*} params
 */
// export function cleanOauthCache(params) {
export const cleanOauthCache = (params) => {
    return request({
        url: OAUTH2_URL() + '/oauth/cache/system/flushAll',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 清除办公缓存
 * @param {*} params
 */
// export function cleanOfficeCache(params) {
export const cleanOfficeCache = (params) => {
    return request({
        url: FORM_URL() + '/office/cache/system/flushAll',
        method: 'post',
        isLoading: true,
        data: params
    })
}