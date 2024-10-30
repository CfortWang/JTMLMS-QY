import request from '@/utils/request'
import axios from 'axios'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 文件上传
 * @param {*} file
 * @param {*} uploadFileVo
 */
export function uploadTemplateFile (file, uploadFileVo) {
    const data = new FormData() // 创建form对象
    data.append('file', file)
    // data.append('uploadFileVo', null)
    return request({
        url: BPMN_URL() + '/onlyOffice/upload',
        method: 'post',
        isLoading: true,
        gateway: true,
        data: data,
        retainData: file
    })
}

/**
 * 删除文件
 * @param {*} params
 */
export function deleteTemplateFile (params) {
    return request({
        url: BPMN_URL() + '/onlyOffice/delete',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 创建文件
 * @param {*} params
 */
export function createTemplateFile (params) {
    return request({
        url: BPMN_URL() + '/onlyOffice/create',
        method: 'get',
        isLoading: true,
        params: params
    })
}

/**
 * 创建文件
 * @param {*} params
 */
export function editTemplateFile (params) {
    return request({
        url: BPMN_URL() + '/onlyOffice/editor',
        method: 'get',
        isLoading: true,
        params: params
    })
}
