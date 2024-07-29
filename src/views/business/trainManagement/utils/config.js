export const GetPercent = (num, total)=> {
    /// <summary>
    /// 求百分比
    /// </summary>
    /// <param name="num">当前数</param>
    /// <param name="total">总数</param>
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
}
export const GetMax = (arr)=> {
    let max = 1;
    if(arr ==undefined)
        return 1;

    arr.forEach(v => {
        if (max<v) {
          max = v;
        }
      })
   return max;
}

export const GetTotality = (arr)=> {
    let mid = 0;
    if(arr == undefined)
        return mid;

    arr.forEach(v => {
        mid += v.value
    })
   return mid;
}

// 时间格式化
export const getFormatDate = (type, start, length, date = new Date()) => {
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
    return result.slice(start, length || result.length)
}
