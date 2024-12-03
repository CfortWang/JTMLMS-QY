import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'
import { save } from '@/api/platform/message/innerMessage'
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
 * 获取排班记录详情
 * @param {*} params
 */
export function getStaffScheduleDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffScheduleDetail/get',
        method: 'get',
        params
    })
}

/**
 * 获取排班记录列表
 * @param {*} params
 */
export function queryStaffScheduleDetail (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffScheduleDetail/query',
        method: 'post',
        data
    })
}

/**
 * 保存排班
 * @param {*} params
 */
export function saveStaffScheduleDetail (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffScheduleDetail/save',
        method: 'post',
        data
    })
}

/**
 * 删除排班
 * @param {*} params
 */
export function removeStaffScheduleDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/staffScheduleDetail/remove',
        method: 'post',
        params
    })
}

/**
 * 获取调班记录详情
 * @param {*} params
 */
export function getAdjustment (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/adjustment/get',
        method: 'get',
        params
    })
}

/**
 * 获取调班记录列表
 * @param {*} params
 */
export function queryAdjustment (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/adjustment/query',
        method: 'post',
        data
    })
}

/**
 * 调班申请
 * @param {*} params
 */
export function saveAdjustment (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/adjustment/save',
        method: 'post',
        data
    })
}

/**
 * 删除调班记录
 * @param {*} params
 */
export function removeAdjustment (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/adjustment/remove',
        method: 'post',
        params
    })
}

/**
 * 获取单条调班记录
 * @param {*} params
 */
export function getAdjustmentDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/adjustmentDetail/get',
        method: 'get',
        params
    })
}

/**
 * 审批（保存）单条调班记录
 * @param {*} params
 */
export function saveAdjustmentDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/adjustmentDetail/save',
        method: 'post',
        params
    })
}

/**
 * 发送申请单状态改变提醒
 * @param {data, receiverId} 申请单数据、消息接收人
 */
export function sendMessage (data, receiverId) {
    let content = ''
    switch (data.status) {
        case '待审核':
            content = '调班申请单[' + data.overview + ']' + ' 待您审核'
            break
        case '待审批':
            content = '调班申请单[' + data.overview + ']' + ' 待您审批'
            break
        case '已拒绝':
            content = '调班申请单[' + data.overview + ']' + ' 已被拒绝'
            break
        case '已通过':
            content = '调班申请单[' + data.overview + ']' + ' 已通过'
            break
        default:
            // 如果data.status的值不在上述列举的情况中，可以在这里添加默认处理逻辑
            content = '调班申请单[' + data.overview + ']'
            break
    }
    const params = {
        subject: '调班申请单变更提醒',
        content: content,
        receiverId: receiverId,
        canreplay: '0'
    }
    return save(params)
}

