import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'
/**
 * 获取goovry脚本的值
 * @param {*} params
 */
export function getScriptValue(params) {
  // TODO:暂时放在这个模块
  return request({
    url: FORM_URL() + '/form/def/getScriptValue',
    method: 'post',
    data: params
  })
}
/**
 * 获取当前时间戳
 */
export function getSystemTimestamp() {
  return request({
    url: FORM_URL() + '/form/def/getSystemTimestamp',
    method: 'get'
  })
}
/**
 * 获取当前时间戳
 */
export function getFormDataFlag(params) {
  return request({
    url: BUSINESS_BASE_URL() + '/getFormData/flag',
    method: 'post',
    params: params
  })
}
