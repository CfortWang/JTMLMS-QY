/*
 * @Descripttion: 表单/数据模板脚本：
 * @version: 1.0
 * @Author: Liu_jiaYin
 * @Date: 2023-11-17 16:40:45
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-04-22 15:37:39
 */
import request from '@/utils/request'
import { BPMN_URL, BUSINESS_BASE_URL } from '@/api/baseUrl'
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

/**
 * 获取设施环境控制总览数据
 * @param {*} params
 */
export function getFacsDaily (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/facs/report/daily',
        method: 'get',
        params
    })
}
