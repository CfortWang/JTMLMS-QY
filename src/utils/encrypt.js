import CryptoJS from 'crypto-js'
const key1 = CryptoJS.enc.Utf8.parse('dmngJmmO+9GMw+tu')
const key2 = CryptoJS.enc.Utf8.parse('49PBou+TREIOzSHj')
// 固定IV 用于密码、get请求参数加密
const defaultIv = CryptoJS.enc.Utf8.parse('5lDsNRe&UduJ97uS')

// 动态IV生成器
export const generateDynamicIV = () => {
    // 1. 获取当前时间戳（8字节，64位）
    const timestamp = Date.now()
    // 将时间戳转换为8字节的WordArray（大端序）
    const timestampBytes = CryptoJS.enc.Hex.parse(
        timestamp.toString(16).padStart(16, '0')
    )

    // 2. 生成8字节随机数
    const randomBytes = CryptoJS.lib.WordArray.random(8)

    // 3. 构造IV（16字节）
    const ivWords = [
        // 前4字节：随机数的高4字节
        randomBytes.words[0],
        // 接下来4字节：时间戳的高4字节
        timestampBytes.words[0],
        // 接下来4字节：随机数的低4字节
        randomBytes.words[1],
        // 最后4字节：时间戳的低4字节
        timestampBytes.words[1]
    ]

    return CryptoJS.lib.WordArray.create(ivWords, 16)
}

// AES加密
export const encryptByAes = (params, type = 'normal') => {
    let encrypted = ''
    const key = type === 'normal' ? key1 : key2
    const iv = type === 'normal' ? generateDynamicIV() : defaultIv
    if (typeof params === 'string' || typeof params === 'object') {
        const data = typeof params === 'string' ? params : JSON.stringify(params)
        const srcs = CryptoJS.enc.Utf8.parse(data)
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
    }

    return type === 'normal' ? {
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
        iv: iv.toString(CryptoJS.enc.Base64)
    } : encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

const isValidBase64 = (str) => {
    try {
        return btoa(atob(str)) === str
    } catch (e) {
        return false
    }
}

export const decryptByAes = (encryptedText, ivBase64 = null, type = 'normal') => {
    const key = type === 'normal' ? key1 : key2

    if (!isValidBase64(ivBase64)) {
        console.error('ivBase64不是有效的 Base64 字符串')
        return ''
    }
    // 解析动态IV
    const iv = CryptoJS.enc.Base64.parse(ivBase64)

    const options = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }

    try {
        const encryptedData = CryptoJS.enc.Base64.parse(encryptedText)
        const decryptedData = CryptoJS.AES.decrypt(
            { ciphertext: encryptedData },
            key,
            options
        )

        // 返回UTF-8解码的明文（去除首尾空格）
        return decryptedData.toString(CryptoJS.enc.Utf8).trim()
    } catch (error) {
        console.error('AES解密失败:', error)
        return ''
    }
}
