import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 获取排班列表数据
 * @param {*} params
 */
export function querySchedule (data) {
    return request({
        url: BUSINESS_BASE_URL() + '/pv/experimental/query',
        method: 'post',
        data
    })
}
