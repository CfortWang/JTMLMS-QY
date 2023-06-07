import request from '@/utils/request'
import md5 from 'js-md5';


const concrete_url = '/business/v3/entrust' // 具体的url 前缀 需拼接


/*
url: concrete_url + '/'+ tableName +'/'+methodName&param,

let param={}
param['userId'] = 'lll'
param['userName'] = 'xxx'
param['data'] = {}
param['data']['id']='sss'

最后要toString
*/

/**
 * 查询列表数据
 * @param {*} params
 */
export function query(tableName,methodName,data) {
  return request({
    url: concrete_url +'/'+ tableName +'/'+methodName,
    method: 'post',
    data: data
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(tableName,methodName,params) {
  return request({
    url: concrete_url + '/'+ tableName +'/'+methodName,
    method: 'post',
    data: params
  })
}
export function removeMulti(tableName,methodName,params) {
  return request({
    url: concrete_url + '/'+ tableName +'/'+methodName,
    method: 'post',
    data: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveData(tableName,methodName,params) {
  return request({
    url: concrete_url + '/'+ tableName +'/'+methodName,
    method: 'post',
    data: params
  })
}
export function updateData(tableName,methodName,params) {
  return request({
    url: concrete_url + '/'+ tableName +'/'+methodName,
    method: 'post',
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(tableName,methodName,params) {
  return request({
    url: concrete_url + '/'+ tableName +'/'+methodName,
    method: 'post',
    data: params
  })
}

/*
 样品退回
*/
export function backOff(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}

/*
右侧办理按钮统一接口
*/
export function selectById(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}
/*
报告审核
*/
export function saveSh(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}

/*
报告审核退回
*/
export function rejectedSh(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}

/*
报告审批提交
*/
export function saveSp(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}
/*
报告审批退回
*/
export function rejectedSp(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}
/*
报告发放提交
*/
export function saveFf(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}
/*
报告发放退回
*/
export function rejectedFf(tableName,methodName,params){
  return request({
    url:concrete_url + '/' + tableName + '/' + methodName,
    method:'post',
    data: params
  })
}

let requestData = ''

/*
样品分发扫码出库接口
*/
export function updateSample(params) {
  requestData =  reqData(params)
  return request({
    url: '/business/v3/sys/universal/sampleStockInAndStockOut',
    method: 'post',
    data: requestData
  })
}


/*
  查询样品位置状态接口
*/
export function sampleWZ(params) {
  requestData =  reqData(params)
  return request({
    url: '/business/v3/sys/universal/sampleWZ',
    method: 'post',
    data: requestData
  })
}






/* 直接传入sql的签名算法   MD5加密*/
function sig(sql){
  let rul = (sql.length + 9)*12*3+168
  let salt ="JinYuanXinTong"
  return md5(rul+''+salt)
}
/*  加密参数内容 */
function reqData(params){
  let md5 = sig(params) //加密， 获取md5密文
  return params.slice(0,1)+'"sig":"'+md5+'",'+params.slice(1) //结果拼接
}
