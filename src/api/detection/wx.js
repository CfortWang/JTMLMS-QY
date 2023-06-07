import request from '@/utils/request'
const WX_URL = '/business/v3/wx'


/**
 * 查询是否注册
 * @param {*} params
 */
export function get(params) {
  return request({
    url: WX_URL + '/openid',
    method: 'get',
    params: params
  })
}


/**
 * 注册并签到
 * @param {*} params
 */
 export function adduser(params) {
  return request({
    url: WX_URL + '/adduser',
    method: 'post',
    data: params
  })
}
// const concrete_url = '/business/v3/wx' // 具体的url 前缀 需拼接


// /*
// url: concrete_url + '/'+ tableName +'/'+methodName&param,

// let param={}
// param['userId'] = 'lll'
// param['userName'] = 'xxx'
// param['data'] = {}
// param['data']['id']='sss'

// 最后要toString
// */

