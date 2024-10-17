import request from '@/utils/request'
import axios from 'axios'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 文件上传
 * @param {*} file
 * @param {*} uploadFileVo
 */
export function uploadOnlyOfficeFile (file, uploadFileVo) {
    const data = new FormData() // 创建form对象
    data.append('file', file)
    // data.append('uploadFileVo', null)
    return request({
        url: BPMN_URL() + '/onlyOffice/upload',
        method: 'post',
        isLoading: true,
        gateway: true,
        data: data
    })
}

/**
 * 删除文件
 * @param {*} params
 */
export function deleteOnlyOfficeFile (params) {
    return request({
        url: BPMN_URL() + '/onlyOffice/delete',
        method: 'post',
        isLoading: true,
        params: params
    })
}

