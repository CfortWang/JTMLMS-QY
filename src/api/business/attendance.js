import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'
import { save } from '@/api/platform/message/innerMessage'

/**
 * 考勤明细-打卡
 * @param {*} params
 */
export function attendanceDetailClockIn (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceDetail/clockIn',
        method: 'post',
        params
    })
}

/**
 * 考勤明细-获取
 * @param {*} params
 */
export function getAttendanceDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceDetail/get',
        method: 'get',
        params
    })
}

/**
 * 考勤明细-查询
 * @param {*} params
 */
export function queryAttendanceDetail (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceDetail/query',
        method: 'post',
        data
    })
}

/**
 * 考勤明细-保存
 * @param {*} params
 */
export function saveAttendanceDetail (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceDetail/save',
        method: 'post',
        data
    })
}

/**
 * 考勤明细-删除
 * @param {*} params
 */
export function removeAttendanceDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceDetail/remove',
        method: 'post',
        params
    })
}

/**
 * 补卡记录-查询
 * @param {*} params
 */
export function queryAttendanceReissue (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceReissue/query',
        method: 'post',
        data
    })
}

/**
 * 补卡记录-保存
 * @param {*} params
 */
export function saveAttendanceReissue (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceReissue/save',
        method: 'post',
        data
    })
}

/**
 * 补卡记录-删除
 * @param {*} params
 */
export function removeAttendanceReissue (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceReissue/remove',
        method: 'post',
        params
    })
}

/**
 * 补卡记录-获取
 * @param {*} params
 */
export function getAttendanceReissue (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/attendanceReissue/get',
        method: 'get',
        params
    })
}
