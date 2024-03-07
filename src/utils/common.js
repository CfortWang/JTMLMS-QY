// 通用工具类，定义通用函数及常用接口
import { mapValues } from 'lodash'
import { encryptByAes } from '@/utils/encrypt'
import { preview } from '@/business/platform/form/utils/custom/preview'
import request from '@/business/platform/form/utils/custom/joinCURD'
import pinyin4js from 'pinyin4js'
import { snapshoot } from '@/api/platform/file/attachment'
import { getNextIdByAlias } from '@/api/platform/system/identity'
import { save as sendMsg } from '@/api/platform/message/innerMessage'
import { save as saveNews } from '@/api/platform/system/news'
import { bpmTaskSave } from '@/api/platform/bpmn/bpmTask'
import { onlyOfficeToPdf, generateUUID } from '@/api/platform/form/seal'
import { downloadFile as download } from '@/business/platform/file/utils'
import { removeFormData } from '@/api/platform/data/dataTemplate'
import utils from '@/utils/action'

// base64解码
const decode = str => decodeURIComponent(window.atob(str).split('').map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join(''))

// 下载
export const downloadByBlob = (o, name) => {
    if (!(o instanceof Blob)) {
        return
    }

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(o, name)
    } else {
        const URL = window.URL || window.webkitURL || window
        const e = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        e.href = URL.createObjectURL(o)
        e.download = name

        if (document.all) {
            e.click()
        } else {
            const ev = document.createEvent('MouseEvents')
            ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, false, false, false, false, 0, null)
            e.dispatchEvent(ev)
        }
    }
}

// 获取当前时间
export const getDateNow = (length = 10, formatType) => {
    if (formatType === 'string') {
        return new Date(new Date().getTime() + 28800000).toJSON().slice(0, length).replace(/[-:T]/g, '')
    }
    return new Date(new Date().getTime() + 28800000).toJSON().slice(0, length).replace('T', ' ')
}

// 获取指定值后的日期
export const getDate = (type, value, date) => {
    const d = date || getDateNow(19)
    if (typeof type !== 'string' || !Number.isInteger(value) || typeof d !== 'string') {
        console.log('参数类型错误')
        return null
    }
    const now = new Date(d)
    const D = {
        day: value * 24 * 60 * 60 * 1000,
        hour: value * 60 * 60 * 1000,
        minute: value * 60 * 1000,
        second: value * 1000
    }
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const second = now.getSeconds()

    switch (type) {
        case 'year': {
            const isLeapYear = new Date(year + value, 1, 29).getDate() === 29
            return new Date(year + value, isLeapYear && month === 1 && day === 29 ? 1 : month, isLeapYear && month === 1 && day === 29 ? 29 : day, hour, minute, second)
        }
        case 'month': {
            let newYear = year
            let newMonth = month + value
            if (newMonth < 0) {
                newYear -= Math.ceil(Math.abs(newMonth) / 12)
                newMonth = 12 - Math.abs(newMonth) % 12
            } else if (newMonth > 11) {
                newYear += Math.floor(newMonth / 12)
                newMonth = newMonth % 12
            }
            const isLeapMonth = new Date(newYear, newMonth + 1, 0).getDate() === 29
            return new Date(newYear, isLeapMonth && month === 1 && day === 29 ? 1 : newMonth, isLeapMonth && month === 1 && day === 29 ? 29 : day, hour, minute, second)
        }
        case 'day': case 'hour': case 'minute': case 'second':
            return new Date(now.getTime() + D[type])
        default:
            console.log('无效的日期类型')
            return null
    }
}

// 时间格式化
export const getFormatDate = (type, length, date = new Date()) => {
    const now = new Date(new Date(date).getTime())
    // eslint-disable-next-line
    if (now == 'Invalid Date') {
        console.log('非法日期，无法格式化')
        return date
    }
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    // 补零
    const padZero = (num) => {
        return num.toString().padStart(2, '0')
    }
    // 默认返回String类型
    let result = `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
    switch (type) {
        case 'string':
            result = `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
            break
        case 'cn':
            result = `${year}年${padZero(month)}月${padZero(day)}日 ${padZero(hours)}时${padZero(minutes)}分${padZero(seconds)}秒`
            break
        case 'number':
            result = `${year}${padZero(month)}${padZero(day)}${padZero(hours)}${padZero(minutes)}${padZero(seconds)}`
            break
        default:
            break
    }
    return result.slice(0, length || result.length)
}

/**
 * 替换对象中的null为空字符串
 * @param  {Object} obj 目标对象
 */
export const replaceNullWithEmpty = obj => {
    function replaceValue (value) {
        if (value === null) {
            return ''
        } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value.map(item => replaceValue(item))
            } else {
                return mapValues(value, v => replaceValue(v))
            }
        } else {
            return value
        }
    }
    return replaceValue(obj)
}

export default {
    preview,
    request,
    pinyin4js,
    snapshoot,
    getNextIdByAlias,
    decode,
    encryptByAes,
    downloadByBlob,
    sendMsg,
    saveNews,
    bpmTaskSave,
    getDate,
    getDateNow,
    getFormatDate,
    onlyOfficeToPdf,
    generateUUID,
    download,
    removeFormData,
    replaceNullWithEmpty,
    utils
}
