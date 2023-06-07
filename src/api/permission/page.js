import request from '@/utils/request'
import {
    DATA_URL
} from '@/api/baseUrl'

/**
 * 查询-获取指定用户的所有页面及其权限信息
 * @param {*} params
 * string userId
 */
export function getAllIncludeUserStaticPage(params) {
    return request({
        url: DATA_URL() + '/static/getAllIncludeUserStaticPage?userId=' + params,
        method: 'post',
    })
}
/**
 * 查询-获取所有用户信息
 * @param {*} params
 * 
 */
export function getAllUserInfor(params) {
    return request({
        url: DATA_URL() + '/static/getAllUserInfor',
        method: 'post',
        data: params
    })
}
/**
 * 保存-用户权限的所有静态页面
 * @param {*} params
 * saveUserData = []
 */
export function saveStaticPage(params) {
    return request({
        url: DATA_URL() + '/static/saveStaticPage',
        method: 'post',
        data: params
    })
}