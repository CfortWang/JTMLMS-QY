import request from '@/utils/request'
import { OAUTH2_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: OAUTH2_URL() + '/authentication/query',
    method: 'post',
    data: params
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: OAUTH2_URL() + '/authentication/remove',
    method: 'post',
    isLoading: true,
    data: params
  })
}
