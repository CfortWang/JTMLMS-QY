/**
 * 表单--封装自定义代码扩展接口
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
import getserial from './custom/serialNumber' //编码规则
import pintText from './custom/pintText.js' //打印规则
import repostCurd from './custom/joinCURD.js' //增删改查规则
import getDate from './custom/getDateRule.js' //获取年月日
import {
    snapshoot,
    generateUUID,
    getFileByte,
    uploadFile
} from '@/api/platform/file/attachment' //印章，快照
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)
import pinyin4js from 'pinyin4js';
import store from '@/store'
import router from '@/router'
import { save } from '@/api/platform/message/innerMessage'

import {
    goSeal, wordToPdf, sealByKeywords, docxToPdfAndSign
} from '@/api/platform/form/seal' // ca电子签章接口


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
        this.$import = _import
        this.$pyjs = pinyin4js
        this.$getDate = getDate //获取封装好的年月日
        this.$getNumBer = getserial //封装获取流水号
        this.$getPint = pintText //封装打开报表
        this.$curdPost = repostCurd //封装通用增删改查
        this.$snapshoot = snapshoot //报表快照(经过润乾)
        this.$generateUUID = generateUUID // 自定义规则自动生成uuid
        this.$router = router //添加router对象
        this.$save = save   // 文件发放通知
        this.$goSeal = goSeal  // ca电子签章接口
        this.$wordToPdf = wordToPdf  // word转pdf
        this.$sealByKeywords = sealByKeywords // 关键字盖章
        this.$getFileByte = getFileByte // 获取文件流
        this.$uploadFile = uploadFile   // 文件上传接口
        this.$sign = docxToPdfAndSign
        this._ = _
        this.$store = store
        this._isInitialization = true
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
