import request from '@/utils/request'
const MYCALENDAR_URL = '/business/v3'

/**
 * 查询日历所有数据
 * @param {*} params
 */
export function query(data) {
  return request({
    url: MYCALENDAR_URL+'/workRecordCalendar/query',
    method: 'post',
    data: data
  })
}
/**
 * 查询日历数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: MYCALENDAR_URL+'/workRecordCalendar/queryDate',
    method: 'post',
    data: data
  })
}
/**
 * 删除日历数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url:  MYCALENDAR_URL+'/workRecordCalendar/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存日历数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url:  MYCALENDAR_URL+'/workRecordCalendar/save',
    method: 'post',
    data: params
  })
}

/**
 * 获取日历数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url:  MYCALENDAR_URL+'/workRecordCalendar/get',
    method: 'get',
    params: params
  })
}
