/**
 * 移动，排序处理帮助类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
/**
* 数组元素交换位置
* @param {array} arr 数组
* @param {number} index1
* @param {number} index2
* index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
*/
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

export function moveUp(source, count) {
  let result = source
  for (let c = 0; c < count; c++) {
    for (let i = 1; i < result.length; i++) {
      if (result[i].checked && !result[i - 1].checked) {
        result = swapArray(result, i, i - 1)
      }
    }
  }
  return result
}

export function moveDown(source, count) {
  let result = source
  for (let c = 0; c < count; c++) {
    for (let i = result.length - 2; i > -1; i--) {
      if (result[i].checked && !result[i + 1].checked) {
        result = swapArray(result, i, i + 1)
      }
    }
  }
  return result
}

export function move2(source, target, isTop) {
  let result = []
  let sourceArr = JSON.parse(JSON.stringify(source))
  const checkArr = []
  target.forEach(i => {
    sourceArr.forEach(l => {
      if (l.id === i) {
        checkArr.push(l)
      }
    })
  })
  checkArr.forEach(l => {
    sourceArr.forEach((item, index) => {
      if (item.id === l.id) {
        sourceArr.splice(index, 1)
      }
    })
  })
  if (isTop) {
    sourceArr = [...checkArr, ...sourceArr]
  } else {
    sourceArr = [...sourceArr, ...checkArr]
  }
  result = sourceArr
  return result
}

export function moveTop(source, target) {
  return move2(source, target, true)
}

export function moveButtom(source, target) {
  return move2(source, target, false)
}
