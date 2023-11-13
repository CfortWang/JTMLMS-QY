import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'
import { BASE_SEAL_API } from '@/constant'
import axios from 'axios'

const BASE_URL = process.env.VUE_APP_BASE_URL

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

/* 自动微签：脚本对文件盖章 */
export function seal (url, fileType, type) {
    const Base64 = require('js-base64').Base64
    const data = {
        'signKey': 'V1FTMjAyMTEyMjFkOTVjNWM=',
        'signSecret': 'YWQwMmY3ZjQ4ZDJmMmYwNDA=',
        'sealUser': 'YWRtaW4=',
        'password': 'MTIzNA==',
        // "ruleName": "6aqR57yd56ug6KeE5YiZLOmmlumhteeblueroA==",
        'ruleName': type,
        'provideSigFile': Base64.encode(url),
        'fileKey': Base64.encode(generateUUID() + '.' + fileType)
    }
    return axios({
        url: `${BASE_URL}doSeal/`,
        method: 'post',
        data: data
    })
}

/* 手动微签：脚本对文件进行手动盖章-预处理 */
export function sealPre (url, fileKey) {
    const Base64 = require('js-base64').Base64
    const data = {
        'signKey': 'V1FTMjAyMTEyMjFkOTVjNWM=',
        'signSecret': 'YWQwMmY3ZjQ4ZDJmMmYwNDA=',
        'sealUser': 'YWRtaW4=',
        'password': 'MTIzNA==',
        'provideSigFile': Base64.encode(url),
        // "getSigFile":  Base64.encode(this.$form.$getSigFile),
        'getSigFile': Base64.encode(`${BASE_URL}#/sealCompleted`),
        'fileKey': Base64.encode(fileKey)
    }
    return axios({
        url: `${BASE_URL}preprocess/`,
        method: 'post',
        data: data
    })
}

/* 手动微签：脚本对文件进行手动盖章-手动签章页面的url */
export function getSigPageUrl (sigFile) {
    const sigUrl = `${BASE_SEAL_API}manualSig/manualSigPage/?signKey=V1FTMjAyMTEyMjFkOTVjNWM=&signSecret=YWQwMmY3ZjQ4ZDJmMmYwNDA=&sigFile=${sigFile}`
    return sigUrl
}

export function generateUUID () {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}

