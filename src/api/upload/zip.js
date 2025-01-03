import request from '@/utils/request'
import { BUSINESS_BASE_URL } from '@/api/baseUrl'

/**
 * 导入文件
 * @param {*} file
 */
export function importZip (file) {
    const data = new FormData() // 创建form对象
    data.append('file', file)
    return request({
        url: BUSINESS_BASE_URL() + '/thirtyparty/humiture/importHumiture',
        method: 'post',
        data: data,
        isLoading: true,
        gateway: true
    })
}
