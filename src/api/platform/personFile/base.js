import request from '@/utils/request'
import { DATA_URL } from '@/api/baseUrl'

/**
 * 获取人员基本信息
 * @param {*} params
 */
export function getInfo (params) {
    return request({
        url: DATA_URL() + '/employee/employeeInfo/get',
        method: 'get',
        params: params
    })
}
/**
 * 保存人员基本信息
 * @param {*} params
 */
export function setInfo (params) {
    return request({
        url: DATA_URL() + '/employee/employeeInfo/save',
        method: 'post',
        isLoading: true,
        data: params
    })
}
