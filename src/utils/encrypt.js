import CryptoJS from 'crypto-js'
const key1 = CryptoJS.enc.Utf8.parse('dmngJmmO+9GMw+tu')
const iv1 = CryptoJS.enc.Utf8.parse('sanXyqhk8+U7LPP4')
const key2 = CryptoJS.enc.Utf8.parse('49PBou+TREIOzSHj')
const iv2 = CryptoJS.enc.Utf8.parse('5lDsNRe&UduJ97uS')

// AES加密
export const encryptByAes = (pwd, type = 'normal') => {
    let encrypted = ''
    const key = type === 'normal' ? key1 : key2
    const iv = type === 'normal' ? iv1 : iv2
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

export const decryptByAes = (encryptedText, type = 'normal') => {
    const key = type === 'normal' ? key1 : key2
    const iv = type === 'normal' ? iv1 : iv2
    const options = {
        iv: iv,
        mode: CryptoJS.mode.CBC, // 使用CBC模式
        padding: CryptoJS.pad.Pkcs7 // 使用PKCS7填充
    }
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedText)
    const decryptedData = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, options)
    const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8)
    return decryptedText.trim()
}
