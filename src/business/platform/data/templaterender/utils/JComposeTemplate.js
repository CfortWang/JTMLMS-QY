
/**
 * 数据模版--封装自定义代码扩展接口
 *
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2017-10-01-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _ from 'lodash'
import Vue from 'vue'
import request from '@/utils/request'
import dialog from '@/utils/dialog'
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)
import getserial from '../../../form/utils/custom/serialNumber' //编码规则
import pintText from '../../../form/utils/custom/pintText.js' //打印规则
import repostCurd from '../../../form/utils/custom/joinCURD.js' //增删改查规则
import getDate from '../../../form/utils/custom/getDateRule.js' //获取年月日

// 定义全局
var JComposeTemplate
if (!window.JComposeTemplate) {
  JComposeTemplate = window.JComposeTemplate = {}
} else {
  JComposeTemplate = window.JComposeTemplate
}
/**
   * 封装自定义代码扩展接口
   */
_.extend(JComposeTemplate, {
  // 已经初始化
  _isInitialization: false,
  _isLoadJavaScriptFile: false,
  // 初始化表单
  _init: function(template) {
    if (this._isInitialization) return
    this.$template = template
    this.$vue = Vue
    this.$request = request
    this.$dialog = dialog
    this.$import = _import
    this._ = _
    this.$getDate = getDate //获取封装好的年月日
    this.$getNumBer = getserial //封装获取流水号
    this.$getPint =  pintText //封装打开报表
    this.$curdPost = repostCurd //封装通用增删改查

    this._isInitialization = true
  },

  // 页面加载
  _onLoad: function(template) {
    this._init(template)
    if (_.isFunction(this.onLoad)) {
      this.onLoad(template)
    }
  },

  // 加载按钮
  _onLoadActions: function(template) {
    if (_.isFunction(this.onLoadActions)) {
      this.onLoadActions(template)
    }
  },
  // 按钮提交前事件
  _beforeSubmit: function(template, action, position, selection, data, callback) {
    if (_.isFunction(this.beforeSubmit)) {
      return this.beforeSubmit(template, action, position, selection, data, callback)
    }
    if (_.isFunction(callback)) {
      const flag = true
      callback(flag)
    }
  },

  // 按钮提交后事件
  _afterSubmit: function(template, action, position, selection, data, callback) {
    if (_.isFunction(this.afterSubmit)) {
      return this.afterSubmit(template, action, position, selection, data, callback)
    }
    if (_.isFunction(callback)) {
      const flag = true
      callback(flag)
    }
  },
  // 单元格自定义格式
  _customFormatter: function(template, name, value, rowData, column) {
    if (_.isFunction(this.customFormatter)) {
      return this.customFormatter(template, name, value, rowData, column)
    }
  },
  // 清理所有自定义事件
  cleanEvents: function() {
    this.onLoad = null
    this.onLoadActions = null
    this.onValidate = null
    this.afterSubButton = null
    this.beforeSubButton = null
    this.summaryMethod = null
    this.afterSubmit = null
    this.beforeSubmit = null
    this._isInitialization = false
  }
})

export default JComposeTemplate
