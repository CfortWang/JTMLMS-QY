import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 获取排班记录详情
 * @param {*} params
 */
export function getStaffSchedule (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffSchedule/get',
        method: 'get',
        params
    })
}

/**
 * 获取排班记录列表
 * @param {*} params
 */
export function queryStaffSchedule (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffSchedule/query',
        method: 'post',
        data
    })
}

/**
 * 保存排班
 * @param {*} params
 */
export function saveStaffSchedule (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffSchedule/save',
        method: 'post',
        data
    })
}

/**
 * 删除排班
 * @param {*} params
 */
export function removeStaffSchedule (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffSchedule/remove',
        method: 'post',
        params
    })
}

/**
 * 获取排班配置
 * @param {*} params
 */
export function getScheduleConfig (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/scheduleConfig/get',
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
        url: BUSINESS_BASE_URL() + '/employee/scheduleConfig/query',
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
        url: BUSINESS_BASE_URL() + '/employee/scheduleConfig/save',
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
        url: BUSINESS_BASE_URL() + '/employee/scheduleConfig/remove',
        method: 'post',
        params
    })
}
