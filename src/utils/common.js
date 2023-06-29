// 通用工具类，定义通用函数及常用接口
import { encryptByAes } from '@/utils/encrypt'
import previewPdf from '@/business/platform/form/utils/custom/preview'
import request from '@/business/platform/form/utils/custom/joinCURD'
import pinyin4js from 'pinyin4js'
import { snapshoot } from '@/api/platform/file/attachment'
import { getNextIdByAlias } from '@/api/platform/system/identity'
import { save as sendMsg } from '@/api/platform/message/innerMessage'
import { bpmTaskSave } from '@/api/platform/bpmn/bpmTask'

// base64解码
const decode = str => decodeURIComponent(window.atob(str).split('').map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join(''))

// 下载
export const download = (o, name) => {
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

export default {
    previewPdf,
    request,
    pinyin4js,
    snapshoot,
    getNextIdByAlias,
    decode,
    encryptByAes,
    download,
    sendMsg,
    bpmTaskSave
}
