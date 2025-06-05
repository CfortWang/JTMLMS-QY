/**
 * 表单--封装自定义代码扩展接口
 */
import _ from 'lodash'
import Vue from 'vue'
import request from '@/utils/request'
import dialog from '@/utils/dialog'
import common from '@/utils/common'
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)
import store from '@/store'
import router from '@/router'

// 定义全局
var JForm
if (!window.JForm) {
    JForm = window.JForm = {}
} else {
    JForm = window.JForm
}
/**
 * 封装自定义代码扩展接口
 */
_.extend(JForm, {
    // 已经初始化
    _isInitialization: false,
    _isLoadJavaScriptFile: false,
    // 初始化表单
    _init: function (form) {
        if (this._isInitialization) return
        this.$form = form
        this.$vue = Vue
        this.$request = request
        this.$dialog = dialog
        this.$common = common
        this.$router = router
        this.$store = store
        this.$import = _import
        this._ = _
        this._isInitialization = true
        this.$loading = Vue.prototype.$loading
    },

    // 表单加载
    _onLoad: function (form) {
        this._init(form)
        if (_.isFunction(this.onLoad)) {
            this.onLoad(form)
        }
    },

    // 加载按钮
    _onLoadActions: function (form, action, button, type) {
        if (_.isFunction(this.onLoadActions)) {
            return this.onLoadActions(form, action, button, type)
        }
    },

    // 表单校验
    _onValidate: function (form, callback) {
        if (_.isFunction(this.onValidate)) {
            return this.onValidate(form, callback)
        }
        if (_.isFunction(callback)) {
            callback(true)
        }
    },

    // 按钮提交前事件
    _beforeSubmit: function (form, action, postValue, callback) {
        if (_.isFunction(this.beforeSubmit)) {
            try {
                return this.beforeSubmit(form, action, postValue, callback)
            } catch (e) {
                return callback(true)
            }
        }
        if (_.isFunction(callback)) {
            callback(true)
        }
    },

    // 按钮提交后事件
    _afterSubmit: function (form, action, postValue, callback) {
        if (_.isFunction(this.afterSubmit)) {
            return this.afterSubmit(form, action, postValue, callback)
        }
        if (_.isFunction(callback)) {
            callback(true)
        }
    },
    // 子表按钮的提交前事件
    _beforeSubButton: function (tableForm, action, position, params, callback) {
        if (_.isFunction(this.beforeSubButton)) {
            return this.beforeSubButton(tableForm, action, position, params, callback)
        }
        if (_.isFunction(callback)) {
            callback(true)
        }
    },
    // 子表按钮的提交后事件
    _afterSubButton: function (tableForm, action, position, params, callback) {
        if (_.isFunction(this.afterSubButton)) {
            return this.afterSubButton(tableForm, action, position, params, callback)
        }
        if (_.isFunction(callback)) {
            callback(true)
        }
    },
    // 子表统计
    _summaryMethod: function (tableForm, tableName, params) {
        if (_.isFunction(this.summaryMethod)) {
            return this.summaryMethod(tableForm, tableName, params)
        }
    },
    // 清理所有自定义事件
    cleanEvents: function () {
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

export default JForm
