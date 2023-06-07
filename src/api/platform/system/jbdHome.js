import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'


/* 统计各委托单位案件数量   左一 行 */
export function countCaseNumData(params) {
 return  request({
    url: BPMN_URL() + '/sys/Statistics/countCaseNumData',
    method: 'post',
    data: params
  })
}

/* 统计各类型案件数量   中一 块 */
export function caseTypeStatis(params) {
 return  request({
    url: BPMN_URL() + '/sys/Statistics/caseTypeStatis',
    method: 'post',
    data: params
  })
}

/* 任务完成情况（委托任务）  中二 块 */
export function tasksCompleteState(params) {
 return  request({
    url: BPMN_URL() + '/sys/Statistics/tasksCompleteState',
    method: 'post',
    data: params
  })
}

/* 办公数量统计 上一 行 */
export function jianceTypeNum(params) {
 return  request({
    url: BPMN_URL() + '/sys/Statistics/jianceTypeNum',
    method: 'post',
    data: params
  })
}

/* 办公数量统计 上一 行 */
export function staffTaskNum(params) {
 return  request({
    url: BPMN_URL() + '/sys/Statistics/staffTaskNum',
    method: 'post',
    data: params
  })
}

/* 各阶段完成量 下一  行 */
export function stageCompleteStatis(params) {
 return  request({
    url: BPMN_URL() + '/sys/Statistics/stageCompleteStatis',
    method: 'post',
    data: params
  })
}
/* 定时任务获取 */
export function StatisticsData(params) {
 return  request({
    url: BPMN_URL() + '/sys/CronNotify/data',
    method: 'post',
    data: params
  })
}
/* 定时任务签到   参数cronId*/
export function StatisticsSign(params) {
 return  request({
    url: BPMN_URL() + '/sys/CronNotify/sign',
    method: 'post',
    params
  })
}

/* 定时任务统计   参数cronId*/
export function StatisticsSelect(params) {
 return  request({
    url: BPMN_URL() + '/sys/CronNotify/selectAll',
    method: 'post',
    data:params
  })
}
