import request from '@/utils/request'
const REPORT_URL = '/business/v3/report/reportset'


/**
 * 保存数据
 * @param {*} params
 */
export function paramSetById(params) {
  return request({
    url: REPORT_URL + '/paramSetById',
    method: 'post',
    data: params
  })
}

export function load() {
  return request({
    url: REPORT_URL + '/load',
    method: 'post',
  })
}

export function deleteMe(data) {
  return request({
    url: REPORT_URL + '/delete',
    method: 'post',
    params: data
  })
}