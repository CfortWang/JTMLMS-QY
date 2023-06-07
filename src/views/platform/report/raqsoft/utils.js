/**
 * 报表工具类
 */

import { getToken } from '@/utils/auth'
import { FORM_TOKEN_KEY, BASE_REPORT_API } from '@/constant'

const util = {
  /**
   *
   * @param {String} url 请求部分地址
   */
  reportUrl: function(urlText) {
    const token = getToken()
    return BASE_REPORT_API + urlText + '&' + FORM_TOKEN_KEY + '=' + token
  }
}

export default util
