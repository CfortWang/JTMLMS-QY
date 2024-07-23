import request from '@/utils/request'
import { SYSTEM_URL, FORM_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SYSTEM_URL() + '/system/news/query',
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
    url: SYSTEM_URL() + '/system/news/remove',
    method: 'post',
    isLoading: true,
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SYSTEM_URL() + '/system/news/save',
    method: 'post',
    isLoading: true,
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SYSTEM_URL() + '/system/news/get',
    method: 'get',
    params
  })
}

/**
 * 推送管理评审通知
 * @param {*} params
 */
export function manage(params) {
  return request({
    url: FORM_URL() + '/audit/notice/manage',
    method: 'post',
    data: params
  })
}
 /**
 * 推送内审实施计划通知
 * @param {*} params
 */
export function internal(params) {
  return request({
    url: FORM_URL() + '/audit/notice/internal',
    method: 'post',
    data: params
  })
}
