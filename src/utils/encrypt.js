import CryptoJS from 'crypto-js'
const key = CryptoJS.enc.Utf8.parse('dmngJmmO+9GMw+tu')
const iv = CryptoJS.enc.Utf8.parse('sanXyqhk8+U7LPP4')
// AES加密
export const encryptByAes = pwd => {
    let encrypted = ''
    if (typeof pwd === 'string') {
        const srcs = CryptoJS.enc.Utf8.parse(pwd)
        const options = {
            iv: iv,
            mode: CryptoJS.mode.CBC, // 使用CBC模式
            padding: CryptoJS.pad.Pkcs7 // 使用PKCS7填充
        }
        encrypted = CryptoJS.AES.encrypt(srcs, key, options)
    } else if (typeof pwd === 'object') {
        const data = JSON.stringify(pwd)
        const srcs = CryptoJS.enc.Utf8.parse(data)
        const options = {
            iv: iv,
            mode: CryptoJS.mode.CBC, // 使用CBC模式
            padding: CryptoJS.pad.Pkcs7 // 使用PKCS7填充
        }
        encrypted = CryptoJS.AES.encrypt(srcs, key, options)
    }
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}
