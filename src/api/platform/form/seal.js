import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'

/**
 * ca电子签章接口
 * @param {*} params
 */
export const goSeal = params => {
    return request({
        url: FORM_URL() + '/sys/esspdf/fileSign',
        method: 'post',
        isLoading: true,
        data: params
    })
}
/**
 * word 转 pdf
 * @param {*} params
 */
export const wordToPdf = params => {
    return request({
        url: FORM_URL() + '/sys/esspdf/wordToPdf',
        method: 'post',
        isLoading: true,
        data: params
    })
}

/**
 * 关键字盖章
 * @param {*} data
 */
export const sealByKeywords = data => {
    return request({
        url: FORM_URL() + '/sys/esspdf/fileSignByKeyWord',
        method: 'post',
        isLoading: true,
        data
    })
}

/**
 * 转pdf并签章
 * @param {*} params
 */
export const docxToPdfAndSign = params => {
    return request({
        url: FORM_URL() + '/sys/esspdf/onlyOfficeToPdfAndSign',
        method: 'post',
        isLoading: true,
        params
    })
}

export const onlyOfficeToPdf = params => {
    return request({
        url: FORM_URL() + '/sys/esspdf/onlyOfficeToPdf',
        method: 'post',
        isLoading: true,
        params
    })
}
