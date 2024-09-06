import request from '@/utils/request'
import { DATA_URL } from '@/api/baseUrl'

/**
 * 实验室看板
 * @param {*} params
 */
export function labsDashBoard(params) {
  return request({
    url: DATA_URL() + '/report/statistic/labsDashBoard',
    method: 'get',
    params: params
  })
}
/**
 * 培训看板
 * @param {*} params
 */
 export function trainingDashBoard(params) {
  return request({
    url: DATA_URL() + '/report/statistic/trainingDashBoard',
    method: 'get',
    params: params
  })
}
/**
 *设备看板
 * @param {*} params
 */
 export function equipDashBoard(params) {
  return request({
    url: DATA_URL() + '/report/statistic/equipDashBoard',
    method: 'get',
    // params: params
  })
}
