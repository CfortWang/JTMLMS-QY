import request from '@/utils/request'
import {
    DATA_URL
} from '@/api/baseUrl'
/**
 * 查询-根据用户id,获取文件信息
 * @param {*} params
 * 
 */
export function getFileByUserId(params) {
    return request({
        url: DATA_URL() + '/consult/getFileByUserIdAndLH',
        method: 'post',
        data: params
    })
}
/**
 * 查询-获取文档类型
 * @param {*} params
 * 
 */
export function getFileType(params) {
    return request({
        url: DATA_URL() + '/consult/getFileType?fileSign=' + params,
        method: 'post',
    })
}
/**
 * 查询-指定人员未授权的受限文件
 * @param {*} params
 * userId
 */
export function getLmitedFile(params) {
    return request({
        url: DATA_URL() + '/consult/getLimitedFileLH?userId=' + params,
        method: 'post',
    })
}

/**
 * 查询-指定人员已授权的受限文件
 * @param {*} params
 * userId
 */
export function getUserByFile(params) {
    return request({
        url: DATA_URL() + '/consult/getUserByFile?userId=' + params,
        method: 'post',
    })
}

/**
 * 保存-用户的文档权限
 * @param {*} params
 *  fileData = []
 */
export function saveUserByFile(params) {
    return request({
        url: DATA_URL() + '/consult/saveUserByFile',
        method: 'post',
        data: params
    })
}

