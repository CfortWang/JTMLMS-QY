import { getToken } from '@/utils/auth'
import { BASE_API, SYSTEM_URL } from '@/api/baseUrl'

/**
 * 返回ueditor地址
 */
export function serverUrl() {
  return BASE_API() + SYSTEM_URL() + `/file/ueditor/action?access_token=` + getToken()
}

/**
 * 返回ueditor地址
 */
export function fileUrl() {
  return BASE_API() + SYSTEM_URL() + '/file/preview?access_token=' + getToken() + '&attachmentId='
}

