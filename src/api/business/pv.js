import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 获取性能验证实验数据
 * @param {*} params
 */
export function getExperimentalList (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/query',
        method: 'get',
        params
    })
}

/**
 * 获取性能验证实验数据详情
 * @param {*} params
 */
export function getExperimentalDetail (params) {
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
export function removeExperimental (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/remove',
        method: 'post',
        data
    })
}

/**
 * 获取性能验证实验试剂数据
 * @param {*} params
 */
export function getReagentList (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/reagent/query',
        method: 'get',
        params
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
