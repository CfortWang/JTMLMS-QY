import request from '@/utils/request'
const NEWHOME_URL = '/platform/v3'
const news_url = 'business/v3'
/**
 * 个人信息
 * @param {*} params
 */
export function getAccountInfo (params) {
    return request({
        url: NEWHOME_URL + '/desktop/facade/userInfo',
        method: 'get',
        params: params
    })
}
/**
 * 新建流程
 * @param {*} params
 */
export function findBpm (params) {
    return request({
        url: NEWHOME_URL + '/bpm/initiated/find/dashboard/bpmn',
        method: 'get',
        params: params
    })
}
/**
 * 公告栏目
 * @param {*} params
 */
export function getNews (params) {
    return request({
        url: NEWHOME_URL + '/desktop/facade/getNews',
        method: 'get',
        params: params
    })
}
/**
 * 新短信公告
 * @param {*} params
 */
export function getCmsNews (params) {
    return request({
        url: news_url + '/data/template/queryDataTable',
        method: 'post',
        data: params
    })
}

/**
 * 未读消息
 * @param {*} params
 */
export function unreadMessage (params) {
    return request({
        url: NEWHOME_URL + '/desktop/facade/unreadMessage',
        method: 'get',
        params: params
    })
}

/**
 * 查询当前用户日历日程信息
 * @param {*} params
 */
export function findAllByCurrUserId (params) {
    return request({
        url: NEWHOME_URL + '/desktop/facade/calendar/findAllByCurrUserId',
        method: 'get',
        params: params
    })
}

/**
 * 编辑保存用户日历日程
 * @param {*} params
 */
export function saveCalendarInfos (params) {
    return request({
        url: NEWHOME_URL + '/desktop/facade/calendar/save',
        method: 'post',
        data: params
    })
}

/**
 * 删除用户日历日程
 * @param {*} params
 */
export function removeCalendarInfos (params) {
    return request({
        url: NEWHOME_URL + '/desktop/facade/calendar/remove',
        method: 'post',
        params: params
    })
}
