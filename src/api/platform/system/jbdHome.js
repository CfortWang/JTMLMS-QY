import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/* 定时任务获取 */
export function StatisticsData (params) {
    return request({
        url: BPMN_URL() + '/sys/CronNotify/data',
        method: 'post',
        data: params
    })
}
/* 定时任务签到   参数cronId*/
export function StatisticsSign (params) {
    return request({
        url: BPMN_URL() + '/sys/CronNotify/sign',
        method: 'post',
        params
    })
}

/* 定时任务统计   参数cronId*/
export function StatisticsSelect (params) {
    return request({
        url: BPMN_URL() + '/sys/CronNotify/selectAll',
        method: 'post',
        data: params
    })
}
