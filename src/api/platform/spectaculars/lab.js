import request from '@/utils/request'
import { DATA_URL } from '@/api/baseUrl'

/**
 * 标记为已读
 * @param {*} params
 */
export function labsDashBoard(params) {
  return request({
    url: DATA_URL() + '/report/statistic/labsDashBoard',
    method: 'get',
    params: params
  })
}
