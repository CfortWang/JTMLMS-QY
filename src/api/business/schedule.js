import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 获取排班列表数据
 * @param {*} params
 */
export function querySchedule (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/query',
        method: 'post',
        data
    })
}

/**
 * 获取排班配置
 * @param {*} params
 */
export function getScheduleConfig (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/v3/employee/scheduleConfig/get',
        method: 'get',
        params
    })
}

/**
 * 获取排班配置列表
 * @param {*} params
 */
export function queryScheduleConfig (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/v3/employee/scheduleConfig/query',
        method: 'post',
        data
    })
}

/**
 * 保存排班配置
 * @param {*} params
 */
export function saveScheduleConfig (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/v3/employee/scheduleConfig/save',
        method: 'post',
        data
    })
}

/**
 * 删除排班配置
 * @param {*} params
 */
export function removeScheduleConfig (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/v3/employee/scheduleConfig/remove',
        method: 'post',
        params
    })
}
