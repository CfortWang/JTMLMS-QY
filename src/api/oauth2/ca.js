import request from '@/utils/request'
import { BPMN_URL, OAUTH2_BASE_URL } from '@/api/baseUrl'
/**
 * 获得服务器证书
 * @param {*} params
 */
 export function SZG_getServerCertificate(params) {
    return request({
        url: OAUTH2_BASE_URL() + '/bjca/getServerCertificate',
        method: 'post',
        params: {
            access_token: 'lhcarz',
            ...params
        }
    })
}

/**
 * 产生随机数
 * @param {*} params
 */
 export function SZG_genRandom(params) {
    return request({
        url: OAUTH2_BASE_URL() + '/bjca/genRandom',
        method: 'post',
        params: {
            access_token: 'lhcarz',
            ...params
        }
    })
}

/**
 * 数据签名
 * @param {*} 随机数接口产生的随机数
 */
 export function SZG_signData(params) {
    return request({
        url: OAUTH2_BASE_URL() + '/bjca/signData',
        method: 'post',
        params: {
            access_token: 'lhcarz',
            ...params
        }
    })
}