import Utils from '@/utils/util'
import { toFixed } from './index'

class PrintUtils {
  constructor(options, images, dpi) {
    var _this = this
    // 样式key
    this.styleKey = 1
    // 图片 key
    this.imageKey = 1
    // 样式Map
    this.styleMap = {}
    // 图片map
    this.imageMap = {}
    // 样式名Map
    this.styleNameMap = {}
    // 图片
    this.images = images
    this.dpi = dpi
    // 如果是默认样式采用默认
    if (options.default) { this.defaultStyle = options.default }
    for (const key in options) {
      const style = options[key]
      _this.styleKey++
      _this.styleMap[key] = style
      _this.styleNameMap[JSON.stringify(style)] = key
    }
  }
}

Object.assign(PrintUtils.prototype, {
  DEFAULT_STYLE_NAME: 'default',
  STYLE_MAP: {
    htTop: {
      type: 'vertical-align',
      style: 'top'
    },
    htBottom: {
      type: 'vertical-align',
      style: 'bottom'
    },
    htMiddle: {
      type: 'vertical-align',
      style: 'middle'
    },
    htLeft: {
      type: 'text-align',
      style: 'left'
    },
    htRight: {
      type: 'text-align',
      style: 'right'
    },
    htCenter: {
      type: 'text-align',
      style: 'center'
    },
    bold: {
      type: 'font-weight',
      style: 'bold'
    },
    italic: {
      type: 'font-style',
      style: 'italic'
    },
    underline: {
      type: 'text-decoration',
      style: 'underline',
      result: 'array'
    },
    'ff-SimSun': {
      type: 'font-family',
      style: 'SimSun'
    },
    'ff-KaiTi': {
      type: 'font-family',
      style: 'KaiTi'
    },
    'ff-SimHei': {
      type: 'font-family',
      style: 'SimHei'
    }
  },
  ClASS_MAP: {
    'vertical-align': {
      top: 'htTop',
      bottom: 'htBottom',
      middle: 'htMiddle'
    },
    'text-align': {
      left: 'htLeft',
      right: 'htRight',
      center: 'htCenter'
    },
    'font-weight': {
      bold: 'bold'
    },
    'font-style': {
      italic: 'italic'
    },
    'font-family': {
      SimSun: 'ff-SimSun',
      KaiTi: 'ff-KaiTi',
      SimHei: 'ff-SimHei'
    },
    'text-decoration': {
      underline: 'underline'
    },
    'font-size': 'style'
  },
  DEFAULT_STYLE: {
    'font-family': 'SimSun',
    'font-size': 12,
    'font-style': 'normal',
    'font-weight': 'normal',
    'color': '#000',
    'line-height': 14.4,
    'padding': [4],
    'text-align': 'left',
    'vertical-align': 'top',
    'text-decoration': [],
    'opacity': 1,
    'border-style': 'none',
    'border-color': '#000'
  },
  PAGE_SIZE: {
    A4: {
      width: 210,
      height: 297
    },
    A3: {
      width: 297,
      height: 420
    },
    A5: {
      width: 148,
      height: 210
    },
    B5: {
      width: 176,
      height: 250
    }
  },

  fixDecimalPrecision: function(a, b) {
    var c = ''
    b || (b = 8)
    if (!Utils.isEmpty(a)) {
      var d = parseFloat(a)
      if (!isNaN(d)) {
        var e = (d + '').split('.')[1]
        c = e && e.length > b ? parseFloat(toFixed(d, b)) : d

        b > 6 && Math.abs(c) < 1 && /e-/.test(c + '') && (c = parseFloat(toFixed(d, 6)))
      }
    }
    return c
  },
  // 获取纸张大小
  getPageSize: function(option) {
    var pageSize = {}
    if (Array.isArray(option.size)) {
      pageSize = {
        width: Math.ceil(option.size[0]),
        height: Math.ceil(option.size[1])
      }
    } else {
      option.size = option.size || 'A4'
      pageSize = {
        width: Math.ceil(this.PAGE_SIZE[option.size].width / 25.4 * this.dpi.design),
        height: Math.ceil(this.PAGE_SIZE[option.size].height / 25.4 * this.dpi.design)
      }
    }
    // 横向:landscape || 纵向：portrait
    if (option.layout === 'landscape') {
      pageSize = {
        width: pageSize.height,
        height: pageSize.width
      }
    }
    // margin 外边距
    if (option.margin.length === 2) { // 2个属性
      pageSize.width = pageSize.width - 2 * option.margin[1]// 右外边距和左外边距
      pageSize.height = pageSize.height - 2 * option.margin[0]// 上外边距和下外边距
    } else if (option.margin.length === 4) {
      pageSize.width = pageSize.width - option.margin[1] - option.margin[3]
      pageSize.height = pageSize.height - option.margin[0] - option.margin[2]
    }

    return pageSize
  },
  // 获取页边距
  getPageMargin: function(option) {
    var pageMargin = {}
    for (let i = 0; i < option.margin.length; i++) {
      const val = option.margin[i]
      switch (i) {
        case 0:
          pageMargin.top = val
          pageMargin.bottom = val
          break
        case 1:
          pageMargin.left = val
          pageMargin.right = val
          break
        case 2:
          pageMargin.bottom = val
          break
        case 3:
          pageMargin.left = val
      }
    }

    return pageMargin
  },
  getStyleByClassName: function(name) {
    return Object.assign({}, this._defaultCellStyle(), this.className2Style(name))
  },
  getStyleNameByCell: function(cell) {
    var styleName = this.className2Style(cell.className)
    if (Utils.isEmpty(styleName)) {
      return this.DEFAULT_STYLE_NAME
    }
    var styleString = JSON.stringify(styleName)
    if (!this.styleNameMap[styleString]) {
      var styleKey = this._getStyleKey()
      this.styleNameMap[styleString] = styleKey
      this.styleMap[styleKey] = styleName
    }
    return this.styleNameMap[styleString]
  },
  getStyles: function() {
    const styleMap = {}
    for (const key in this.styleMap) {
      const val = this.styleMap[key]
      styleMap[key] = this._design2Print(val)
    }
    this.styleMap = styleMap
    return this.styleMap
  },
  getImages: function() {
    var images = {}
    for (const key in this.imageMap) {
      const image = this.imageMap[key]
      images[image.key] = image.image
    }
    return images
  },
  hasBorder: function(styleKey) {
    return styleKey !== this.DEFAULT_STYLE_NAME && (this.styleMap[styleKey] && this.styleMap[styleKey]['border-width'])
  },
  initStyles: function() {
    this.styleKey = 1
    this.imageKey = 1
    this.styleNameMap = {}
    this.styleMap = {}
    this.styleMap[this.DEFAULT_STYLE_NAME] = this._defaultCellStyle()
  },
  _print2Design: function(a, b) {
    switch (a) {
      case 'font-size':
        return Math.round(b / this.dpi.design * this.dpi.print)
      case 'line-height':
        return this.fixDecimalPrecision(b / this.dpi.design * this.dpi.print, 1)
      default:
        return b
    }
  },
  _design2Print: function(data) {
    var _this = this
    for (const key in data) {
      const val = data[key]
      switch (key) {
        case 'font-size':
          data[key] = Math.round(val / _this.dpi.print * _this.dpi.design)
          break
        case 'line-height':
          data[key] = this.fixDecimalPrecision(val / _this.dpi.print * _this.dpi.design, 1)
      }
    }
    return data
  },
  _defaultCellStyle: function() {
    var style = {}
    const defaultStyle = this.defaultStyle || this.DEFAULT_STYLE
    for (const key in defaultStyle) {
      style[key] = this._print2Design(key, defaultStyle[key])
    }

    return style
  },
  className2Style: function(style) {
    var temp = {}
    if (Utils.isEmpty(style)) { return temp }
    var cellStyle = this._defaultCellStyle()
    var boderStyle = []

    var styles = style.split(' ')

    for (let i = 0; i < styles.length; i++) {
      const val = styles[i]
      if (/font-size-[0-9]{1,2}/.test(val)) { // 字体
        var fontSize = val.replace('font-size-', '')
        fontSize = parseInt(fontSize)
        if (cellStyle['font-size'] === fontSize) { return }
        temp['font-size'] = fontSize
        temp['line-height'] = this.fixDecimalPrecision(1.2 * fontSize, 1)
      } else if (/border-/.test(val)) { // 边框
        boderStyle.push(val)
      }

      var styleVal = this.STYLE_MAP[val]
      if (styleVal && cellStyle[styleVal.type] !== styleVal.style) {
        if (styleVal.result === 'array') {
          temp[styleVal.type] = [styleVal.style]
        } else {
          temp[styleVal.type] = styleVal.style
        }
      }
    }
    return Object.assign(temp, this._border2Style(boderStyle))
  },
  /**
   * css样式边框
   */
  _border2Style: function(borders) {
    var temp = {}
    for (let i = 0; i < borders.length; i++) {
      const border = borders[i]
      if (/border-width-[0-4]{1}/.test(border)) {
        temp.width = parseInt(border.replace('border-width-', ''))
        continue
      }
      switch (border) {
        case 'border-left':
          temp.left = true
          break
        case 'border-top':
          temp.top = true
          break
        case 'border-right':
          temp.right = true
          break
        case 'border-bottom':
          temp.bottom = true
          break
      }
    }

    var style = {}
    style['border-style'] = 'solid'
    style['border-width'] = temp.width || 1
    var j = 4
    const b = ['left', 'top', 'right', 'bottom']
    for (let i = 0; i < b.length; i++) {
      const val = b[i]
      const f = temp[val]
      var g = ['border', val, 'width'].join('-')
      if (!f) {
        style[g] = 0
        j--
      }
    }
    return j > 0 ? style : {}
  },
  style2ClassName: function(style) {
    if (style === this.DEFAULT_STYLE_NAME) {
      return ''
    }
    var className = ''
    style = this.styleMap[style]

    for (const key in style) {
      let value = style[key]
      if (this.ClASS_MAP[key]) {
        if (this.ClASS_MAP[key] === 'style') {
          value = this._print2Design(key, value)
          className += ' ' + [key, value].join('-')
          continue
        }
        if (Array.isArray(value)) {
          for (const e in value) {
            const f = value[e]
            if (!this.ClASS_MAP[key][f]) {
              continue
            }
            if (Utils.isNotEmpty(className)) {
              className += ' '
            }
            className += this.ClASS_MAP[key][f]
          }
        } else {
          if (!this.ClASS_MAP[key][value]) {
            continue
          }
          if (Utils.isNotEmpty(className)) {
            className += ' '
          }
          className += this.ClASS_MAP[key][value]
        }
      }
    }

    return className
  },
  formatData: function(data) {
    var _this = this
    var rtn = []
    if (!data) { return rtn }
    for (let i = 0; i < data.length; i++) {
      const value = data[i]
      if (!value.image) {
        rtn.push(value)
        continue
      }

      var image = _this.images[value.image] || value.image
      var id = image.id
      if (id) {
        var imageKey = ''
        if (_this.imageMap[id]) {
          imageKey = _this.imageMap[id].key
        } else {
          imageKey = _this._getImageKey()
          _this.imageMap[id] = {
            key: imageKey,
            image: image
          }
        }

        rtn.push({
          image: imageKey,
          fit: [100, 100]
        })
      }
    }

    return rtn
  },
  _getStyleKey: function() {
    return 's_' + this.styleKey++
  },
  _getImageKey: function() {
    return 'img_' + this.imageKey++
  }
})
export default PrintUtils
