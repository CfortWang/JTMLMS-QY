import CryptoJS from 'crypto-js'
const key = '49PBou+TREIOzSHj'
const key1 = CryptoJS.enc.Utf8.parse('dmngJmmO+9GMw+tu')
const key2 = CryptoJS.enc.Utf8.parse(key)
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
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        encrypted += String.fromCharCode(charCode)
    }

    return btoa(encrypted)
}

const xorDecrypt = (encryptedBase64) => {
    // 从Base64解码
    const decodedStr = atob(encryptedBase64)
    let decrypted = ''

    // 异或解密
    for (let i = 0; i < decodedStr.length; i++) {
        const charCode = decodedStr.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        decrypted += String.fromCharCode(charCode)
    }

    return decrypted
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

export const decryptByAes = (ciphertext) => {
    try {
        // 初始化解密参数
        let cipherToDecrypt = ciphertext
        let iv = defaultIv
        let key = key2

        // 尝试XOR解密并解析参数
        const decryptedStr = xorDecrypt(ciphertext)
        const parts = decryptedStr.split('|')
        if (parts.length === 4) {
            const [ciphertextBase64, ivBase64, saltBase64, token] = parts

            if (token && !(isValidBase64(ivBase64) && isValidBase64(saltBase64))) {
                console.error('解密失败: 无效的IV参数或salt参数！')
                return ''
            }
            // 转换编码
            iv = CryptoJS.enc.Base64.parse(ivBase64)
            const salt = CryptoJS.enc.Base64.parse(saltBase64)
            // 动态派生密钥
            key = deriveDynamicKey(token, salt)
            cipherToDecrypt = ciphertextBase64
        }

        // 解密
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(cipherToDecrypt) },
            key,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        )

        return decrypted.toString(CryptoJS.enc.Utf8).trim()
    } catch (error) {
        console.error('AES解密失败:', error)
        return ''
    }
}
