export const checkTime = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请选择日期'))
    }
    setTimeout(() => {
        const nowTime = new Date().getTime()
        const valueTime = new Date(value).getTime()
        if (nowTime < valueTime) {
            callback(new Error('请选择小于当前日期的时间'))
        } else {
            callback()
        }
    }, 100)
}
export const checkTimeNull = (rule, value, callback) => {
    if (!value) {
        callback()
    }
    setTimeout(() => {
        const nowTime = new Date().getTime()
        const valueTime = new Date(value).getTime()
        if (nowTime < valueTime) {
            callback(new Error('请选择小于当前日期的时间'))
        } else {
            callback()
        }
    }, 100)
}
export const checkLength = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请填写内容'))
    }
    setTimeout(() => {
        if (value.length > 200) {
            callback(new Error('请将字数限制在200以内'))
        } else {
            callback()
        }
    }, 100)
}
export const checkLengthNull = (rule, value, callback) => {
    if (!value) {
        callback()
    }
    setTimeout(() => {
        if (value.length > 200) {
            callback(new Error('请将字数限制在200以内'))
        } else {
            callback()
        }
    }, 100)
}
export const optional = (rule, value, callback) => {
    if (!value) {
        callback()
    } else if (value.length > 200) {
        callback(new Error('请将字数限制在200以内'))
    } else {
        callback()
    }
}
export const attachmentsNum = (rule, value, callback) => {
    if (!value) {
        callback()
    } else if (value.split(',').length > 5) {
        callback(new Error('请将数量限制在5个以内'))
    } else {
        callback()
    }
}
export const attachmentsNumOne = (rule, value, callback) => {
    if (!value) {
        callback()
    } else if (value.split(',').length > 1) {
        callback(new Error('请将数量限制在1个以内'))
    } else {
        callback()
    }
}
export const checkNianLing = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请合理选择年龄'))
    }
    if (value > 150 || value < 0) {
        callback(new Error('年龄范围在0~150岁'))
    } else {
        callback()
    }
}
export const checkNianLingNull = (rule, value, callback) => {
    if (!value) {
        // return callback(new Error('请合理选择年龄'))
        callback()
    } else if (value > 150 || value < 0) {
        callback(new Error('年龄范围在0~150岁'))
    } else {
        callback()
    }
}
export default {
    checkTime,
    checkLength,
    optional,
    attachmentsNum,
    checkNianLing,
    attachmentsNumOne,
    checkTimeNull,
    checkNianLingNull,
    checkLengthNull
}
