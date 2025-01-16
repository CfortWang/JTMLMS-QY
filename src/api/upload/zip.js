import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 导入文件
 * @param {*} file
 */
export function upload (file, uploadUrl) {
    const data = new FormData() // 创建form对象
    data.append('file', file)
    return request({
        url: BUSINESS_BASE_URL() + uploadUrl,
        method: 'post',
        data: data,
        isLoading: true,
        gateway: true
    })
}
