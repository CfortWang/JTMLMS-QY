/* Modified from https://github.com/taylorhakes/fecha
 * v4.1.0
 * hugh zhuang  把 YYYY-MM-DD 改成了 yyyy-MM-dd  与java后台 统一格式
 * YYYY修改为yyyy
 *
 * 备注：未支持多个国际化，该代码参考element-ui的日期帮助类
 *      增加日期格式处理
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Taylor Hakes
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 *     The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 *     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g
var twoDigitsOptional = '[1-9]\\d?'
var twoDigits = '\\d\\d'
var threeDigits = '\\d{3}'
var fourDigits = '\\d{4}'
var word = '[^\\s]+'
var literal = /\[([^]*?)\]/gm
function shorten(arr, sLen) {
  var newArr = []
  for (var i = 0, len = arr.length; i < len; i++) {
    newArr.push(arr[i].substr(0, sLen))
  }
  return newArr
}
var monthUpdate = function(arrName) {
  return function(v, i18n) {
    var lowerCaseArr = i18n[arrName].map(function(v) { return v.toLowerCase() })
    var index = lowerCaseArr.indexOf(v.toLowerCase())
    if (index > -1) {
      return index
    }
    return null
  }
}
function assign(origObj) {
  var args = []
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i]
  }
  for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
    var obj = args_1[_a]
    for (var key in obj) {
      // @ts-ignore ex
      origObj[key] = obj[key]
    }
  }
  return origObj
}
var dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
var monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
var monthNamesShort = shorten(monthNames, 3)
var dayNamesShort = shorten(dayNames, 3)
var defaultI18n = {
  dayNamesShort: dayNamesShort,
  dayNames: dayNames,
  monthNamesShort: monthNamesShort,
  monthNames: monthNames,
  amPm: ['am', 'pm'],
  DoFn: function(dayOfMonth) {
    return (dayOfMonth +
            ['th', 'st', 'nd', 'rd'][dayOfMonth % 10 > 3
              ? 0
              : ((dayOfMonth - (dayOfMonth % 10) !== 10 ? 1 : 0) * dayOfMonth) % 10])
  }
}
var globalI18n = assign({}, defaultI18n)
var setGlobalDateI18n = function(i18n) {
  return (globalI18n = assign(globalI18n, i18n))
}
var regexEscape = function(str) {
  return str.replace(/[|\\{()[^$+*?.-]/g, '\\$&')
}
var pad = function(val, len) {
  if (len === void 0) { len = 2 }
  val = String(val)
  while (val.length < len) {
    val = '0' + val
  }
  return val
}
var formatFlags = {
  d: function(dateObj) { return String(dateObj.getDate()) }, // zxh  D 修改为 d
  dd: function(dateObj) { return pad(dateObj.getDate()) }, // zxh  DD 修改为 dd
  do: function(dateObj, i18n) { // zxh  Do 修改为 do
    return i18n.DoFn(dateObj.getDate())
  },
  D: function(dateObj) { return String(dateObj.getDay()) }, // zxh  d 修改为D
  DD: function(dateObj) { return pad(dateObj.getDay()) }, // zxh  dd 修改为 DD
  DDD: function(dateObj, i18n) { // zxh  ddd 修改为 DDD
    return i18n.dayNamesShort[dateObj.getDay()]
  },
  DDDD: function(dateObj, i18n) { // zxh  dddd 修改为 DDDD
    return i18n.dayNames[dateObj.getDay()]
  },
  M: function(dateObj) { return String(dateObj.getMonth() + 1) },
  MM: function(dateObj) { return pad(dateObj.getMonth() + 1) },
  MMM: function(dateObj, i18n) {
    return i18n.monthNamesShort[dateObj.getMonth()]
  },
  MMMM: function(dateObj, i18n) {
    return i18n.monthNames[dateObj.getMonth()]
  },
  yy: function(dateObj) { // zxh 修改 YY  修改为 yy
    return pad(String(dateObj.getFullYear()), 4).substr(2)
  },
  yyyy: function(dateObj) { return pad(dateObj.getFullYear(), 4) }, // zxh 修改 YYYY  修改为 yyyy
  h: function(dateObj) { return String(dateObj.getHours() % 12 || 12) },
  hh: function(dateObj) { return pad(dateObj.getHours() % 12 || 12) },
  H: function(dateObj) { return String(dateObj.getHours()) },
  HH: function(dateObj) { return pad(dateObj.getHours()) },
  m: function(dateObj) { return String(dateObj.getMinutes()) },
  mm: function(dateObj) { return pad(dateObj.getMinutes()) },
  s: function(dateObj) { return String(dateObj.getSeconds()) },
  ss: function(dateObj) { return pad(dateObj.getSeconds()) },
  S: function(dateObj) {
    return String(Math.round(dateObj.getMilliseconds() / 100))
  },
  SS: function(dateObj) {
    return pad(Math.round(dateObj.getMilliseconds() / 10), 2)
  },
  SSS: function(dateObj) { return pad(dateObj.getMilliseconds(), 3) },
  a: function(dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1]
  },
  A: function(dateObj, i18n) {
    return dateObj.getHours() < 12
      ? i18n.amPm[0].toUpperCase()
      : i18n.amPm[1].toUpperCase()
  },
  ZZ: function(dateObj) {
    var offset = dateObj.getTimezoneOffset()
    return ((offset > 0 ? '-' : '+') +
            pad(Math.floor(Math.abs(offset) / 60) * 100 + (Math.abs(offset) % 60), 4))
  },
  Z: function(dateObj) {
    var offset = dateObj.getTimezoneOffset()
    return ((offset > 0 ? '-' : '+') +
            pad(Math.floor(Math.abs(offset) / 60), 2) +
            ':' +
            pad(Math.abs(offset) % 60, 2))
  }
}
var monthParse = function(v) { return +v - 1 }
var emptyDigits = [null, twoDigitsOptional]
var emptyWord = [null, word]
var amPm = [
  'isPm',
  word,
  function(v, i18n) {
    var val = v.toLowerCase()
    if (val === i18n.amPm[0]) {
      return 0
    } else if (val === i18n.amPm[1]) {
      return 1
    }
    return null
  }
]
var timezoneOffset = [
  'timezoneOffset',
  '[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?',
  function(v) {
    var parts = (v + '').match(/([+-]|\d\d)/gi)
    if (parts) {
      var minutes = +parts[1] * 60 + parseInt(parts[2], 10)
      return parts[0] === '+' ? minutes : -minutes
    }
    return 0
  }
]
var parseFlags = {
  d: ['day', twoDigitsOptional], // zxh D 修改为 d
  dd: ['day', twoDigits], // zxh DD 修改为 dd
  do: ['day', twoDigitsOptional + word, function(v) { return parseInt(v, 10) }], // zxh D0 修改为 do
  M: ['month', twoDigitsOptional, monthParse],
  MM: ['month', twoDigits, monthParse],
  YY: [
    'year',
    twoDigits,
    function(v) {
      var now = new Date()
      var cent = +('' + now.getFullYear()).substr(0, 2)
      return +('' + (+v > 68 ? cent - 1 : cent) + v)
    }
  ],
  h: ['hour', twoDigitsOptional, undefined, 'isPm'],
  hh: ['hour', twoDigits, undefined, 'isPm'],
  H: ['hour', twoDigitsOptional],
  HH: ['hour', twoDigits],
  m: ['minute', twoDigitsOptional],
  mm: ['minute', twoDigits],
  s: ['second', twoDigitsOptional],
  ss: ['second', twoDigits],
  yyyy: ['year', fourDigits], // zxh YYYY修改为yyyy
  S: ['millisecond', '\\d', function(v) { return +v * 100 }],
  SS: ['millisecond', twoDigits, function(v) { return +v * 10 }],
  SSS: ['millisecond', threeDigits],
  D: emptyDigits, // zxh d 修改为 D
  DD: emptyDigits, // zxh dd 修改为 DD
  DDD: emptyWord,
  DDDD: emptyWord,
  MMM: ['month', word, monthUpdate('monthNamesShort')],
  MMMM: ['month', word, monthUpdate('monthNames')],
  a: amPm,
  A: amPm,
  ZZ: timezoneOffset,
  Z: timezoneOffset
}
// Some common format strings
var globalMasks = {
  default: 'yyyy-MM-dd HH:mm:ss',
  shortDate: 'M/d/yy',
  mediumDate: 'MMM D, yyyy',
  longDate: 'MMMM d, yyyy',
  fullDate: 'DDDD, MMMM d, yyyy',
  isoDate: 'yyyy-MM-dd',
  isoDateTime: 'yyyy-MM-ddTHH:mm:ssZ',
  shortTime: 'HH:mm',
  mediumTime: 'HH:mm:ss',
  longTime: 'HH:mm:ss.SSS'
}
var setGlobalDateMasks = function(masks) { return assign(globalMasks, masks) }
/** *
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 * @returns {string} Formatted date string
 */
var format = function(dateObj, mask, i18n) {
  if (dateObj === null || dateObj === undefined) return ''
  if (mask === void 0) { mask = globalMasks['default'] }
  if (i18n === void 0) { i18n = {} }
  if (typeof dateObj === 'number') {
    dateObj = new Date(dateObj)
  }
  if (Object.prototype.toString.call(dateObj) !== '[object Date]' ||
        isNaN(dateObj.getTime())) {
    throw new Error('Invalid Date pass to format')
  }
  mask = globalMasks[mask] || mask
  var literals = []
  // Make literals inactive by replacing them with @@@
  mask = mask.replace(literal, function($0, $1) {
    literals.push($1)
    return '@@@'
  })
  var combinedI18nSettings = assign(assign({}, globalI18n), i18n)
  // Apply formatting rules
  mask = mask.replace(token, function($0) {
    return formatFlags[$0](dateObj, combinedI18nSettings)
  })
  // Inline literal values back into the formatted value
  return mask.replace(/@@@/g, function() { return literals.shift() })
}
/**
 * Parse a date string into a Javascript Date object /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @param {i18n} I18nSettingsOptional Full or subset of I18N settings
 * @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
 */
function parse(dateStr, format, i18n) {
  if (dateStr === null || dateStr === undefined) return ''
  if (i18n === void 0) { i18n = {} }
  if (typeof format !== 'string') {
    throw new Error('Invalid format in fecha parse')
  }
  // Check to see if the format is actually a mask
  format = globalMasks[format] || format
  // Avoid regular expression denial of service, fail early for really long strings
  // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
  if (dateStr.length > 1000) {
    return null
  }
  // Default to the beginning of the year.
  var today = new Date()
  var dateInfo = {
    year: today.getFullYear(),
    month: 0,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    isPm: null,
    timezoneOffset: null
  }
  var parseInfo = []
  var literals = []
  // Replace all the literals with @@@. Hopefully a string that won't exist in the format
  var newFormat = format.replace(literal, function($0, $1) {
    literals.push(regexEscape($1))
    return '@@@'
  })
  var specifiedFields = {}
  var requiredFields = {}
  // Change every token that we find into the correct regex
  newFormat = regexEscape(newFormat).replace(token, function($0) {
    var info = parseFlags[$0]
    var field = info[0]; var regex = info[1]; var requiredField = info[3]
    // Check if the person has specified the same field twice. This will lead to confusing results.
    if (specifiedFields[field]) {
      throw new Error('Invalid format. ' + field + ' specified twice in format')
    }
    specifiedFields[field] = true
    // Check if there are any required fields. For instance, 12 hour time requires AM/PM specified
    if (requiredField) {
      requiredFields[requiredField] = true
    }
    parseInfo.push(info)
    return '(' + regex + ')'
  })
  // Check all the required fields are present
  Object.keys(requiredFields).forEach(function(field) {
    if (!specifiedFields[field]) {
      throw new Error('Invalid format. ' + field + ' is required in specified format')
    }
  })
  // Add back all the literals after
  newFormat = newFormat.replace(/@@@/g, function() { return literals.shift() })
  // Check if the date string matches the format. If it doesn't return null
  var matches = dateStr.match(new RegExp(newFormat, 'i'))
  if (!matches) {
    return null
  }
  var combinedI18nSettings = assign(assign({}, globalI18n), i18n)
  // For each match, call the parser function for that date part
  for (var i = 1; i < matches.length; i++) {
    var _a = parseInfo[i - 1]; var field = _a[0]; var parser = _a[2]
    var value = parser
      ? parser(matches[i], combinedI18nSettings)
      : +matches[i]
    // If the parser can't make sense of the value, return null
    if (value == null) {
      return null
    }
    dateInfo[field] = value
  }
  if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
    dateInfo.hour = +dateInfo.hour + 12
  } else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
    dateInfo.hour = 0
  }
  var dateWithoutTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond)
  var validateFields = [
    ['month', 'getMonth'],
    ['day', 'getDate'],
    ['hour', 'getHours'],
    ['minute', 'getMinutes'],
    ['second', 'getSeconds']
  ]
  for (var j = 0, len = validateFields.length; j < len; j++) {
    // Check to make sure the date field is within the allowed range. Javascript dates allows values
    // outside the allowed range. If the values don't match the value was invalid
    if (specifiedFields[validateFields[j][0]] &&
            dateInfo[validateFields[j][0]] !== dateWithoutTZ[validateFields[j][1]]()) {
      return null
    }
  }
  if (dateInfo.timezoneOffset == null) {
    return dateWithoutTZ
  }
  return new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond))
}

/**
 * 格式化当前时间
 */
function formatDate(mask = globalMasks.default, i18nSettings) {
  return format(new Date(), mask, i18nSettings)
}

/**
 * 格式当前时间
 */
function parseDate(mask = globalMasks.default, i18nSettings) {
  return parse(formatDate(mask, i18nSettings), mask, i18nSettings)
}

/**
 * 相对时间字符串
 * @param {String|Number} time 时间格式字符串，或者时间
 * @returns {String} 相对时间字符串
 */
function formatRelativeTime(time, mask = {}, i18nSettings) {
  if (!i18nSettings) {
    i18nSettings = function() {}
  }
  if (!time || time === null) return ''
  let date
  if (Object.prototype.toString.call(time) === '[object Date]') {
    date = time
  } else {
    date = !isNaN(time) ? new Date(time) : parse(time, mask['orig'] || globalMasks.default)
  }
  const timeStamp = date.getTime()
  // 获取当前时间时间戳
  const currentTime = (new Date()).getTime()

  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = timeStamp <= currentTime
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? (i18nSettings('ibps.time.before') || '前') : (i18nSettings('ibps.time.after') || '后')

  if (diff < 1000) {
    resStr = i18nSettings('ibps.time.just') || '刚刚'
  } else if (diff < 60000) {
    // 少于等于59秒
    resStr = parseInt(diff / 1000) + (i18nSettings('ibps.time.seconds') || '秒') + dirStr
  } else if (diff >= 60000 && diff < 3600000) {
    // 多于59秒，少于等于59分钟59秒
    resStr = Math.floor(diff / 60000) + (i18nSettings('ibps.time.minutes') || '分钟') + dirStr
  } else if (diff >= 3600000 && diff < 86400000) {
    // 多于59分钟59秒，少于等于23小时59分钟59秒
    resStr = Math.floor(diff / 3600000) + (i18nSettings('ibps.time.hours') || '小时') + dirStr
  } else if (diff >= 86400000 && diff < 2623860000) {
    // 多于23小时59分钟59秒，少于等于29天59分钟59秒
    resStr = Math.floor(diff / 86400000) + (i18nSettings('ibps.time.days') || '天') + dirStr
  } else if (diff >= 2623860000 && diff <= 31567860000 && IS_EARLY) {
    // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
    resStr = format(timeStamp, mask['day'] || 'MM-dd HH:mm')
  } else {
    resStr = format(timeStamp, mask['year'] || globalMasks.default)
  }
  return resStr
}

const dateDealFmt = {
  $dp: {
    has: {}
  },
  dealFmt: function(dateStr, dateFmt) {
    if (dateStr === '' || dateStr === null || dateStr === undefined) { return null }
    if (dateStr.length !== dateFmt.length) { // 格式化日期不相同
      const date = new Date(dateStr.replace(/-/g, '/'))
      if (!isNaN(date.getTime())) {
        return date
      } else { // IE
        const mydate = dateStr.slice(0, dateStr.indexOf('.'))// 去掉毫秒数
        return new Date(mydate.replace(/-/g, '/'))
      }
    }

    this.$dp.dateFmt = dateFmt
    this._setHas(/w/)
    this._setHas(/WW|W/)
    this._setHas(/DD|D/)
    this._setHas(/yyyy|yyy|yy|y/)
    this._setHas(/MMMM|MMM|MM|M/)
    this._setHas(/dd|d/)
    this._setHas(/HH|H/)
    this._setHas(/mm|m/)
    this._setHas(/ss|s/)

    const date = new Date()
    for (const p in this.$dp.has) {
      const has = this.$dp.has[p]
      if (has != null) {
        const val = parseInt(dateStr.substring(has.index, has.index + has[0].length), 10)
        if (p === 'y') { date.setYear(val) }
        if (p === 'M') { date.setMonth(val - 1, 1) }
        if (p === 'd') { date.setDate(val) }
        if (p === 'H') { date.setHours(val) }
        if (p === 'm') { date.setMinutes(val) }
        if (p === 's') { date.setSeconds(val) }
      }
    }
    return date
  },
  _setHas: function(re) {
    this.$dp.has[(re + '').slice(1, 2)] = re.exec(this.$dp.dateFmt)
  }
}

var fecha = {
  format: format,
  parse: parse,
  defaultI18n: defaultI18n,
  setGlobalDateI18n: setGlobalDateI18n,
  setGlobalDateMasks: setGlobalDateMasks,
  formatDate: formatDate,
  parseDate: parseDate,
  formatRelativeTime: formatRelativeTime
}

export default fecha
export { assign, format, parse, defaultI18n, setGlobalDateI18n, setGlobalDateMasks, formatDate, parseDate, formatRelativeTime, dateDealFmt }

