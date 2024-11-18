import request from '@/utils/request'
import { SYSTEM_URL, FORM_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList (params) {
    return request({
        url: SYSTEM_URL() + '/identity/query',
        method: 'post',
        data: params
    })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove (params) {
    return request({
        url: SYSTEM_URL() + '/identity/remove',
        method: 'post',
        isLoading: true,
        params: params
    })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save (params) {
    return request({
        url: SYSTEM_URL() + '/identity/save',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get (params) {
    return request({
        url: SYSTEM_URL() + '/identity/get',
        method: 'get',
        params
    })
}
/**
 * 获取数据
 * @param {*} params
 */
export function getByAlias (params) {
    return request({
        url: SYSTEM_URL() + '/identity/getByAlias',
        method: 'get',
        params
    })
}

/**
 * 预览数据
 * @param {*} params
 */
export function test (params) {
    return request({
        url: SYSTEM_URL() + '/identity/test',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 获取下一个流水号编号
 * @param {*} params
 */
export function getNextIdByAlias (params) {
    return request({
        url: SYSTEM_URL() + `/identity/getNextIdByAlias`,
        method: 'get',
        params: params
    })
}

/**
 * 试剂耗材库存，出入库记录
 * @param {*} params
 */
export function reagentConsumablesInventory (params) {
    return request({
        url: FORM_URL() + `/reagent/reagentConsumablesInventory/sync?id=${params.id}&action=${params.action}`,
        method: 'post',
        isLoading: true,
        data: params
    })
}
