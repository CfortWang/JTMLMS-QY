import request from '@/utils/request'
import { SAAS_URL } from '@/api/baseUrl'

const BASE_MAPPING = '/saas/tenant/user'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/query',
    method: 'post',
    data: params
  })
}

/**
 * 查询未审核列表数据
 * @param {*} params
 */
export function queryWaitPageList(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/query/wait',
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
    url: SAAS_URL() + BASE_MAPPING + '/remove',
    method: 'post',
    isLoading: true,
    params
  })
}

/**
 * 企业用户注册
 * @param {*} data
 */
export function register(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/register',
    method: 'post',
    isLoading: true,
    data
  })
}

/**
 * 保存数据
 * @param {*} data
 */
export function save(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/save',
    method: 'post',
    isLoading: true,
    data
  })
}

/**
 * 企业用户审核
 * @param {*} data
 */
export function approve(data) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/approve',
    method: 'post',
    isLoading: true,
    data
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: SAAS_URL() + BASE_MAPPING + '/get',
    method: 'get',
    params
  })
}
