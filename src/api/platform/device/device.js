import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 根据id查询设备档案卡
 * @param {*} params
 */
export function getequipmentCard (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/equipmentCard/get',
        method: 'get',
        params: params
    })
}
/**
 * 设备档案卡列表(分页条件查询)数据
 * @param {*} data
 * @returns
 */
export function queryequipmentCard (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/equipmentCard/query',
        method: 'post',
        data: data
    })
}

/**
 * 保存设备档案卡信息
 * @param {*} data
 * @returns
 */
export function saveEquipmentCard (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/equipmentCard/save',
        method: 'post',
        data: data
    })
}

/**
 * 删除设备档案卡
 * @param {*} params
 * @returns
 */
export function removeEquipmentCard (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/equipmentCard/remove',
        method: 'post',
        params: params
    })
}

/**
 * 根据id查询设备停用报废记录表
 * @param {*} params
 * @returns
 */
export function getScrappedRecord (params) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/scrappedRecord/get',
        method: 'get',
        params: params
    })
}

/**
 * 设备停用报废记录表列表(分页条件查询)数据
 * @param {*} data
 * @returns
 */
export function queryScrappedRecord (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/scrappedRecord/query',
        method: 'post',
        data: data
    })
}

/**
 * 设备维护记录表列表(分页条件查询)数据
 * @param {*} data
 * @returns
 */
export function queryMaintenanceRecord (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/maintenanceRecord/query',
        method: 'post',
        data: data
    })
}
/**
 * 检定校准实施记录表列表(分页条件查询)数据
 * @param {*} data
 * @returns
 */
export function queryCalibrationCheckRecord (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/calibrationCheckRecord/query',
        method: 'post',
        data: data
    })
}
/**
 * 设备维修记录表列表(分页条件查询)数据
 * @param {*} data
 * @returns
 */
export function queryRepairRecord (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/equipment/repairRecord/query',
        method: 'post',
        data: data
    })
}
