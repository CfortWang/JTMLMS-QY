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
