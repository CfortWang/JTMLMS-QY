import request from '@/utils/request'
const JCWTD_URL = '/business/v3/entrust/sysjtsjpz'

/**
 * 查询列表数据
 * @param {*} params
 */
export function query(data) {
  return request({
    url: JCWTD_URL + '/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function deleteMe(data) {
  return request({
    url: JCWTD_URL + '/delete',
    method: 'post',
    params: data
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function add(data) {
  return request({
    url: JCWTD_URL + '/add',
    method: 'post',
    data: data
  })
}
export function update(data) {
  return request({
    url: JCWTD_URL + '/update',
    method: 'post',
    data: data
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(data) {
  return request({
    url: JCWTD_URL + '/get',
    method: 'post',
    data: data
  })
}
export function upload(data) {
  return request({
    url: '/platform/v3/file/upload',
    method: 'post',
    data: data
  })
}
