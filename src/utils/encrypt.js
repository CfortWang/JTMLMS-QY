import CryptoJS from 'crypto-js'
import { toLength } from 'lodash'
const key1 = CryptoJS.enc.Utf8.parse('dmngJmmO+9GMw+tu')
const key2 = CryptoJS.enc.Utf8.parse('49PBou+TREIOzSHj')
// 固定IV 用于密码、get请求参数加密
const defaultIv = CryptoJS.enc.Utf8.parse('5lDsNRe&UduJ97uS')

// 密钥派生参数配置
const PBKDF2_CONFIG = {
    // 盐值长度（bits）
    saltSize: 128,
    // 迭代次数
    iterations: 10000,
    // 密钥长度（256bit）
    keySize: 256 / 32,
    hashAlgorithm: CryptoJS.algo.SHA256
}

// 动态密钥派生器
const deriveDynamicKey = (token, salt) => {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid user token')
    }

    return CryptoJS.PBKDF2(token, salt, {
        keySize: PBKDF2_CONFIG.keySize,
        iterations: PBKDF2_CONFIG.iterations,
        hasher: PBKDF2_CONFIG.hashAlgorithm
    })
}

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

const xorEncrypt = (text) => {
    let encrypted = ''
    const key = '49PBou+TREIOzSHj'
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        encrypted += String.fromCharCode(charCode)
    }

    return btoa(encrypted)
}

// AES加密
export const encryptByAes = (params, type = 'dynamic', token) => {
    try {
        const isDynamic = type === 'dynamic'
        // 生成随机盐值
        const salt = CryptoJS.lib.WordArray.random(PBKDF2_CONFIG.saltSize)
        // 动态派生密钥
        const derivedKey = isDynamic ? deriveDynamicKey(token, salt) : key2
        // 生成动态iv
        const iv = isDynamic ? generateDynamicIV() : defaultIv
        const data = typeof params === 'string' ? params : JSON.stringify(params)
        const srcs = CryptoJS.enc.Utf8.parse(data)

        const encrypted = CryptoJS.AES.encrypt(srcs, derivedKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })

        if (isDynamic) {
            const str = encrypted.ciphertext.toString(CryptoJS.enc.Base64) + '|' + iv.toString(CryptoJS.enc.Base64) + '|' + salt.toString(CryptoJS.enc.Base64) + '|' + token
            console.log(str)
            return xorEncrypt(str)
        }
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    } catch (error) {
        console.error('Encryption error:', error)
        throw new Error('Encryption failed')
    }
}

const isValidBase64 = (str) => {
    try {
        return btoa(atob(str)) === str
    } catch (e) {
        return false
    }
}

export const decryptByAes = (ciphertext, saltBase64, ivBase64 = null, token, type = 'dynamic') => {
    try {
        // 参数校验
        if (!isValidBase64(ivBase64) || !isValidBase64(saltBase64)) {
            console.error('ivBase64不是有效的 Base64 字符串')
            return ''
        }
        // 转换编码
        const salt = CryptoJS.enc.Base64.parse(saltBase64)
        const iv = CryptoJS.enc.Base64.parse(ivBase64)
        // 动态派生密钥
        const derivedKey = type === 'dynamic' ? deriveDynamicKey(token, salt) : key2
        // 解密
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(ciphertext) },
            derivedKey,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        )

        return decrypted.toString(CryptoJS.enc.Utf8).trim()
    } catch (error) {
        console.error('AES解密失败:', error)
        return ''
    }
}
