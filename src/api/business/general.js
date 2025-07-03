import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 获取电子表单填写记录
 * @param {*} params
 */
export function queryOnlineForm (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/sqlInjectionDeal/query',
        method: 'post',
        data
    })
}

/**
 * 获取电子表单填写记录数据详情
 * @param {*} params
 */
export function getOnlineForm (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/sqlInjectionDeal/get',
        method: 'get',
        params
    })
}

/**
 * 保存电子表单填写数据
 * @param {*} params
 */
export function saveOnlineForm (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/sqlInjectionDeal/save',
        method: 'post',
        data
    })
}

/**
 * 删除电子表单填写记录
 * @param {*} params
 */
export function removeOnlineForm (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/sqlInjectionDeal/remove',
        method: 'post',
        params
    })
}

/**
 * 获取业务流程快照及附件
 * @param {*} params
 */
export function getProcSnap (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/reform/getFileInfo',
        method: 'get',
        params
    })
}

/**
 * 获取受控文件查阅信息
 * @param {*} params
 */
export function queryFileInfo (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/reform/queryWjxx',
        method: 'get',
        params
    })
}

/**
 * 获取事务代理记录
 * @param {*} params
 */
export function queryTaskAgemt (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/swdl/queryData',
        method: 'post',
        data
    })
}

/**
 * 获取考试记录
 * @param {*} params
 */
export function queryExams (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/management/queryData',
        method: 'post',
        data
    })
}

/**
 * 获取纸质运行记录
 * @param {*} params
 */
export function queryPaperOpRecod (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/operateRecord/query',
        method: 'post',
        data
    })
}

/**
 * 删除纸质运行记录
 * @param {*} params
 */
export function removePaperOpRecod (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/employee/operateRecord/remove',
        method: 'post',
        isLoading: true,
        params: params
    })
}

/**
 * 获取系统指引
 * @param {*} params
 */
export function querySystemGuide (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/sql/systemGuide/query',
        method: 'post',
        data
    })
}
