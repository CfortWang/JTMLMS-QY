import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 获取性能验证实验数据
 * @param {*} params
 */
export function queryExperimental (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/query',
        method: 'post',
        data
    })
}

/**
 * 获取性能验证实验数据详情
 * @param {*} params
 */
export function getExperimental (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/get',
        method: 'get',
        params
    })
}

/**
 * 保存性能验证实验数据
 * @param {*} params
 */
export function saveExperimental (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/save',
        method: 'post',
        data
    })
}

/**
 * 删除性能验证实验数据
 * @param {*} params
 */
export function removeExperimental (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/remove',
        method: 'post',
        params
    })
}

/**
 * 获取性能验证实验试剂数据
 * @param {*} params
 */
export function getReagentList (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/reagent/query',
        method: 'post',
        data
    })
}

/**
 * 获取性能验证实验试剂数据详情
 * @param {*} params
 */
export function getReagentDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/reagent/get',
        method: 'get',
        params
    })
}

/**
 * 保存性能验证实验数据
 * @param {*} params
 */
export function saveReagent (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/reagent/save',
        method: 'post',
        data
    })
}

/**
 * 删除性能验证实验数据
 * @param {*} params
 */
export function removeReagent (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/reagent/remove',
        method: 'post',
        data
    })
}

/**
 * 获取性能验证配置数据
 * @param {*} params
 */
export function getConfigList (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimentalConfig/query',
        method: 'post',
        data
    })
}

/**
 * 获取性能验证配置数据详情
 * @param {*} params
 */
export function getConfigDetail (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimentalConfig/get',
        method: 'get',
        params
    })
}

/**
 * 保存性能验证配置数据
 * @param {*} params
 */
export function saveConfig (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimentalConfig/save',
        method: 'post',
        data
    })
}

/**
 * 删除性能验证配置数据
 * @param {*} params
 */
export function removeConfig (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimentalConfig/remove',
        method: 'post',
        data
    })
}

/**
 * 导出数据模板
 * @param {*} params
 */
export function exportTemplate (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/exportExcelTemplate',
        responseType: 'arraybuffer',
        method: 'post',
        params
    })
}

/**
 * 导入实验数据
 * @param {*} params
 */
export function importTemplate (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/importExcelRecord',
        method: 'post',
        data
    })
}

/**
 * 导出数据报告
 * @param {*} params
 */
export function exportReport (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/exportExcelReport',
        method: 'post',
        data
    })
}
