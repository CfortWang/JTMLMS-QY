import request from '@/utils/request'
import { DATA_URL } from '@/api/baseUrl'

/**
 * 获取科研等单一关联的数据
 * @param {*} params
 */
export function get (params) {
    return request({
        url: DATA_URL() + '/employee/employeeInfo/queryResearches',
        method: 'post',
        data: params
    })
}
