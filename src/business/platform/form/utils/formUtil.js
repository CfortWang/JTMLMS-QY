/* eslint-disable no-new-func */
import Utils from '@/utils/util'
import I18n from '@/utils/i18n'
import fecha from '@/utils/fecha'
import FormulaUtil from './formula'
import FormFieldUtil from './formFieldUtil'
import AddressUtls from '@/components/ibps-address/util'
import { dataFormatMap } from '@/business/platform/form/constants/fieldOptions'
import FormOptions from '@/business/platform/form/constants/formOptions'
import { validateRequired, validateLengthRange, validateOptions, validateInteger, validateDecimal, validateNumberRange } from '@/utils/validate'
import { remoteRequest } from '@/utils/remote'
import { validateDateBetween } from './customValidator'
import { getScriptValue } from '@/api/platform/form/common'
import { getNextIdByAlias } from '@/api/platform/system/identity'
import { queryLinkageData } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import store from '@/store' // store

window.FormulaUtil = FormulaUtil
window.Utils = Utils
const FormUtil = {
    TABLE_SEPARATOR: '.', // 表分隔符
    EVAL_FORMULA: '',
    NOT_NEED_FIELD: '#not_need_field#', // 不需要通过字段计算的字段
    CACHE_DYNAMIC_VALUE: {},
    CACHE_CURRENT_USER_DATA: {}, // 缓存的用户数据值，包含组织、岗位部门，以后缓存到store 或者缓存
    setResponseFormula (responseFormula, model, code) {
        if (model.field_type === 'table') { //  判断是否是主表，子表他自己处理
            const columns = model.field_options.columns
            if (columns && columns.length > 0) {
                model.field_options.columns.forEach((item) => {
                    this.setChangeFormulaData(responseFormula, item, model.name)
                })
            }
        } else { // 主表
            this.setChangeFormulaData(responseFormula, model, code)
        }
    },

    setChangeFormulaData (responseFormula, model, code) {
        const fieldOptions = model.field_options
        if (Utils.isEmpty(fieldOptions)) {
            return {}
        }
        const formula = fieldOptions.default_value
        if (fieldOptions.default_value_type !== 'formula' || !formula) {
            return {}
        }
        const changename = code + this.TABLE_SEPARATOR + model.name
        // eslint-disable-next-line no-useless-escape
        const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
        const z = this.NOT_NEED_FIELD
        const changFormula = {
            changename: changename,
            formula: formula
        }
        let isHasField = false

        d.forEach(n => {
            if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
                const f = n.replace('$_widget_', '').split('#')
                const g = f[0]
                const h = f[1]
                if (Utils.isEmpty(h)) {
                    if (!responseFormula[g]) { responseFormula[g] = [] }
                    responseFormula[g].push(changFormula)
                }
                isHasField = true
            }
        })
        // 未有要计算改变字段
        if (!isHasField) {
            if (!responseFormula[z]) { responseFormula[z] = [] }
            responseFormula[z].push(changFormula)
        }
    },
    runCalFormula (self, responseFormulas, curCode, row) {
        if (Utils.isEmpty(responseFormulas)) { return self.models }
        responseFormulas.forEach((formula) => {
            const changename = formula.changename // 修改字段
            const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象
            const changeCode = changeObj[0]
            const changeField = changeObj[1] // 修改的字段
            const formData = JSON.parse(JSON.stringify(self.models))
            const v = this.getCalFormulaValue(formula, formData, curCode, curCode)
            if (Utils.isNotEmpty(row)) { // 子表
                self.setRowData(row, changeField, v)
            } else {
                if (curCode === changeCode) {
                    self.setFieldData(changeField, v)
                } else { // 子表
                    const rowData = this.getCalFormulaSubValue(formula, formData, changeField, changeCode, curCode)
                    self.setFieldData(changeCode, rowData)
                }
            }
        })
    },
    /**
     * 进行主表公式计算
     * @param {*} responseFormulas
     * @param {*} field
     * @param {*} curCode
     */
    runMainCalFormula (self, responseFormulas, curCode) {
        if (Utils.isEmpty(responseFormulas)) { return }

        responseFormulas.forEach((formula) => {
            const changename = formula.changename // 修改字段
            const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象
            const changeCode = changeObj[0] || ''// 修改的表
            const changeField = changeObj[1] || '' // 修改的字段
            const formData = JSON.parse(JSON.stringify(self.models))
            if (curCode === changeCode) {
                const v = this.getCalFormulaValue(formula, formData, curCode, curCode)
                self.handleModels(changeField, v)
            } else { // 子表 主表修改子表
                if (formData[changeCode]) { // 修改其他子表
                    const v = this.getCalFormulaSubValue(formula, formData, changeField, changeCode, curCode)
                    self.handleModels(changeCode, v)
                } else { // 修改主表表
                    const v = this.getCalFormulaValue(formula, formData, changeCode, changeCode)
                    if (formData[changeField]) {
                        self.handleModels(changeField, v)
                    }
                }
            }
        })
    },
    runSubCalFormula (self, responseFormulas, curCode, mainCode, row) {
        if (Utils.isEmpty(self.formData)) {
            return
        }
        const formData = JSON.parse(JSON.stringify(self.formData))
        responseFormulas.forEach((formula) => {
            const changename = formula.changename // 修改字段
            const changeObj = changename ? changename.split(FormUtil.TABLE_SEPARATOR) : []// 改变的对象
            const changeCode = changeObj[0] || ''// 修改的表
            const changeField = changeObj[1] || '' // 修改的字段
            // 获取公式计算的值
            const v = FormUtil.getCalFormulaValue(formula, formData, curCode, mainCode, row)
            // 回填值
            if (changeCode === curCode) { // 是否相同子表 则取1列
                self.handleModels(changeField, v)
            } else { // 不同表
                if (mainCode === changeCode) { // 修改是主表
                    self.setFieldData(changeField, v)
                } else {
                    if (formData[changeCode]) { // 修改其他子表
                        const rowData = this.getCalFormulaSubValue(formula, formData, changeField, changeCode, curCode)
                        self.setFieldData(changeCode, rowData)
                    } else { // 修改主表表
                        if (formData[changeField]) {
                            self.handleModels(changeField, v)
                        }
                    }
                }
            }
        })
    },
    getCalFormulaSubValue (formula, formData, changeField, changeCode, curCode) {
        const rowData = JSON.parse(JSON.stringify(formData[changeCode]))
        if (Utils.isArray(rowData)) {
            const res = []
            for (let i = 0; i < rowData.length; i++) {
                const row = rowData[i]
                const obj = {}
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        let val = row[key]
                        if (key === changeField) {
                            val = this.getCalFormulaValue(formula, formData, changeCode, curCode, i)
                        }
                        obj[key] = val
                    }
                }
                res.push(obj)
            }
            return res
        } else {
            // TODO: 一对一
            if (Utils.isNotEmpty(rowData[changeField])) {
                rowData[changeField] = this.getCalFormulaValue(formula, formData, changeCode, curCode)
            }
            return rowData
        }
    },
    /**
     * 通过计算的值
     */
    getCalFormulaValue (responseFormula, data, curCode, mainCode, row) {
        const formula = responseFormula.formula
        const changename = responseFormula.changename// 修改字段
        const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : [] // 改变的对象
        const isSameTable = changeObj[0] === curCode // 是否相同的表
        // eslint-disable-next-line no-useless-escape
        const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
        const e = []
        let v = ''
        d.forEach(n => {
            if (/^\$(_widget_)/.test(n)) {
                const f = n.replace('$_widget_', '').split('#')
                const g = f[0]
                const h = f[1]
                if (Utils.isEmpty(h)) {
                    // 获取公式的值 数字
                    const t = g.split(this.TABLE_SEPARATOR)
                    let origVal = ''
                    const calCode = t[0] // 当前计算的code
                    const key = t[1]
                    if (mainCode === calCode) { // 主表
                        origVal = this.getValueByKey(data, key)
                    } else { // 其他子表
                        if (isSameTable && Utils.isNotEmpty(row)) { // 相同的子表
                            origVal = this.getValueByKey(data, key, calCode, row)
                        } else { // 如果改变的是主表,则取一列的值
                            origVal = this.getColumnValue(data, calCode, key)
                        }
                    }
                    // 修复 特殊字符的bug
                    let val = ''
                    val = (val = (val = (val = JSON.stringify(origVal) + '').replace(/\\\\(?=.+)/g, '"+CHAR(92)+"')).replace(/\\\"(?=.+)/g, '"+CHAR(34)+"')).replace(/\\n(?=.+)/g, '"+CHAR(10)+"')
                    if (!isNaN(origVal) && origVal < 0) {
                        val = '(' + val + ')'
                    }
                    e.push(val)
                } else {
                    e.push('"' + n + '"')
                }
            } else {
                e.push(n)
            }
        })
        // console.error(e.join(''))
        try {
            v = this.evalFormula(e.join(''))
        } catch (e) {
            v = ''
        }
        return v
    },
    getValueByKey (data, key, code, row) {
        if (!data) {
            return this.getRealValue()
        }
        if (Utils.isNotEmpty(code)) {
            return this.getRealValue(data[code][row][key])
        } else {
            return this.getRealValue(data[key])
        }
    },
    // 获取一行数据
    getColumnValue (data, code, key) {
        const tableData = data[code]
        if (Utils.isEmpty(tableData)) {
            return ''
        }
        const v = tableData.map((d) => {
            return this.getRealValue(d[key])
        })
        return JSON.stringify(v)
    },
    // TODO: 需要传递类型，判断类型不同进行进行计算,默认是字符串
    // 暂时处理把能转数字类型转数字
    getRealValue (val) {
        if (Utils.isEmpty(val)) return ''
        if (Utils.isNum(val)) {
            return Number(val)
        } else {
            return val
        }
    },

    getEvalFormula: function () {
        if (Utils.isEmpty(this.EVAL_FORMULA)) {
            // 做缓存避免运算
            const b = []
            Object.keys(FormulaUtil).forEach(n => {
                b.push('var ' + n + '=FormulaUtil.' + n)
            })

            this.EVAL_FORMULA = b.join(';') + ';'
        }
        return this.EVAL_FORMULA
    },
    evalFormula: function (a) {
        let c = null
        let env = null
        try {
            env = this.getEvalFormula()
            c = new Function(env + 'return ' + a + ';')()
        } catch (e) {
            console.error(e)
            c = null
        }
        return c
    },
    /**
     * 表单提交校验
     * @param {*} formula 计算的公式
     * @param {*} data 数据
     * @param {*} mainCode  主表code
     */
    runFormSubmitVerify (formula, data, mainCode) {
        // eslint-disable-next-line no-useless-escape
        const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
        const e = []
        let v = true

        d.forEach(n => {
            if (/^\$(_widget_)/.test(n)) {
                const f = n.replace('$_widget_', '').split('#')
                const g = f[0]
                const h = f[1]
                if (Utils.isEmpty(h)) {
                    // 获取公式的值 数字
                    const t = g.split(this.TABLE_SEPARATOR)
                    let val = '""'
                    const calCode = t[0] // 当前计算的code
                    const key = t[1]
                    const isMainTable = calCode === mainCode// 是否主表
                    if (isMainTable) { // 主表
                        val = this.getValueByKey(data, key)
                    } else { // 子表  是主表,则取一列的值
                        val = this.getColumnValue(data, calCode, key)
                    }
                    e.push(val)
                } else {
                    e.push('"' + n + '"')
                }
            } else {
                e.push(n)
            }
        })
        try {
            v = this.evalFormula(e.join(''))
        } catch (e) {
            console.warn(e)
            v = true
        }

        return v
    },
    getSelectorValue (store, val) {
        if (Utils.isEmpty(val)) return ''
        if (store === 'json') {
            return JSON.stringify(val)
        } else if (store === 'id') {
            return val.map((d) => { return d.id }).join(',')
        } else if (store === 'bind') {
            return val.map((d) => { return d.name }).join(',')
        }
    },
    getCurrentDataValue ({ selectorType, bindId, fieldName, storeType }) {
        const { userInfo } = store.getters || {}
        const { level = {} } = store.getters
        // 缓存用户
        if (userInfo.employee && userInfo.employee.id) {
            const selectors = [{
                'id': userInfo.employee.id,
                'name': userInfo.employee.name
            }]
            this.CACHE_CURRENT_USER_DATA['user'] = selectors
        }
        // 当前层级
        if (selectorType === 'currentPosition') {
            const t = level.second || level.first
            const selectors = t ? t.split(',').map(str => ({ id: str })) : ''
            this.CACHE_CURRENT_USER_DATA['currentPosition'] = selectors
        }
        // 当前组织
        if (userInfo.org && userInfo.org.id) {
            const selectors = [{
                'id': userInfo.org.id,
                'name': userInfo.org.name
            }]
            this.CACHE_CURRENT_USER_DATA['org'] = selectors
        }
        // 岗位
        if (Utils.isNotEmpty(userInfo.positions)) {
            const { mainPosition } = userInfo || {}
            if (Utils.isNotEmpty(mainPosition)) {
                this.CACHE_CURRENT_USER_DATA['position'] = [{
                    id: mainPosition.id,
                    name: mainPosition.name
                }]
            } else {
                const selectors = []
                userInfo.positions.forEach((item) => {
                    if (Utils.isNotEmpty(item) && Utils.isNotEmpty(item.id)) {
                        selectors.push({
                            'id': item.id,
                            'name': item.name
                        })
                    }
                })
                this.CACHE_CURRENT_USER_DATA['position'] = selectors
            }
        }
        // 角色
        if (Utils.isNotEmpty(userInfo.role)) {
            const selectors = []
            userInfo.role.forEach((item) => {
                if (Utils.isNotEmpty(item) && Utils.isNotEmpty(item.id)) {
                    selectors.push({
                        'id': item.id,
                        'name': item.name
                    })
                }
            })
            this.CACHE_CURRENT_USER_DATA['role'] = selectors
        }
        // 回调数据
        return this.getSelectorValue(storeType, this.CACHE_CURRENT_USER_DATA[selectorType])
    },
    /**
     * 绑定值回调
     * @param {*} store
     * @param {*} bindId
     * @param {*} value
     * @param {*} callback
     */
    bindIdCallback (store, bindId, value, callback) {
        if (store === 'bind') {
            callback(bindId, this.getSelectorValue('id', value))
        }
    },
    /**
     * 获取子表字段默认值
     */
    async getTableDefaultData (field) {
        const columns = field.field_options.columns
        const tableDefaultValue = {}
        if (columns && columns.length > 0) {
            const subColumns = FormFieldUtil.getColumns(columns)
            for (let i = 0; i < subColumns.length; i++) {
                const column = subColumns[i]
                const defaultValue = await FormUtil.getFieldDefaultValue(column)
                tableDefaultValue[column.name] = defaultValue
            }
        }
        return tableDefaultValue
    },
    /**
     * 获取子表空数据
     * @param {*} field
     */
    getTableDefaultColumnData (field) {
        const columns = field.field_options.columns
        const defaultValue = {}
        if (columns && columns.length > 0) {
            const subColumns = FormFieldUtil.getColumns(columns)
            for (let i = 0; i < subColumns.length; i++) {
                const column = subColumns[i]
                defaultValue[column.name] = ''
            }
        }
        return defaultValue
    },
    /**
     * 获取字段默认值
     */
    async getFieldDefaultValue (field) {
        const fieldName = field.name
        const fieldOptions = field.field_options
        const fieldType = field.field_type
        const defaultValueType = fieldOptions.default_value_type || 'fixed'
        const defaultValue = fieldOptions.default_value
        let result = ''
        // ================= 固定值   =================
        if (defaultValueType === 'fixed') {
            if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') { // 单选，复选，下拉
                const checkedValue = []
                if (Utils.isNotEmpty(fieldOptions.options)) {
                    fieldOptions.options.forEach(option => {
                        if (option['checked']) {
                            checkedValue.push(option['val'])
                        }
                    })
                }
                result = checkedValue.join(',')
            } else if (fieldType === 'currentDate' || fieldType === 'currentTime') { // 当前时间，当前日期
                result = this.getFieldDatefmtValue(fieldOptions)
            } else if (fieldType === 'autoNumber') { // 自动编号
                if (Utils.toBoolean(fieldOptions.init, false)) {
                    await getNextIdByAlias({
                        alias: fieldOptions.identity
                    }).then(response => {
                        result = response.data
                    }).catch(() => { })
                }
            } else if (fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition') { // 当前用户、组织
                const types = {
                    currentUser: 'user',
                    currentOrg: 'org',
                    currentPosition: 'position'
                }
                result = this.getCurrentDataValue({
                    selectorType: types[fieldType],
                    bindId: fieldOptions.bind_id,
                    name: fieldName,
                    storeType: fieldOptions.store
                })
            } else if (fieldType === 'address') { // 地址 固定值
                result = defaultValue ? this.getAddressValue(defaultValue, '', fieldOptions) : ''
            } else { // 默认值
                result = defaultValue || ''
            }
            // ================= 预设值   =================
        } else if (defaultValueType === 'present') {
            if (fieldType === 'selector' || fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition') { // 当前用户、组织
                result = this.getCurrentDataValue({
                    selectorType: fieldType === 'currentPosition' ? 'currentPosition' : fieldOptions.selector_type || 'user',
                    bindId: fieldOptions.bind_id,
                    storeType: fieldOptions.store,
                    fieldName: fieldName
                })
            }
            // ================= 动态值   =================
        } else if (defaultValueType === 'dynamic') {
            if (Utils.isEmpty(defaultValue)) {
                return
            }
            // 缓存之前的值
            await this.getDynamicValue(defaultValue).then(data => {
                result = data
            })
            // =================  当前时间   =================
        } else if (defaultValueType === 'today') { // 当前时间
            result = this.getFieldDatefmtValue(fieldOptions)
        }

        return result
    },
    /**
     * 获取当前格式化日期
     * @param {*} fieldOptions
     */
    getFieldDatefmtValue (fieldOptions) {
        let datefmt = FormOptions.t.DATE_FORMATS['datetime']
        if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
            datefmt = FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
        } else {
            datefmt = fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
        }
        return fecha.format(new Date(), datefmt)
    },
    // 地址顶部的值
    getAddressTopVal (fieldOptions) {
        const top = fieldOptions.top || 'country'
        const topval = fieldOptions.topval
        if (Utils.isEmpty(topval)) {
            if (top === 'country') { return '0' }
            return '' // 异常配置
        }
        if (top === 'country') {
            return '0'
        } else if (top === 'province' || top === 'city' || top === 'district') {
            return topval[topval.length - 1]
        }
        return ''
    },
    // 地址的值
    getAddressValue (value, model, fieldOptions) {
        const topIndex = AddressUtls.getLevelIndex(fieldOptions.top || 'country')
        const levelIndex = AddressUtls.getLevelIndex(fieldOptions.level || 'district')
        let data = {
            street: fieldOptions.street || ''
        }
        if (Utils.isNotEmpty(model)) {
            data = Utils.parseJSON(model)
        }
        let v = 0
        for (let i = topIndex; i < levelIndex + 1; i++) {
            const key = AddressUtls.levelArr[i]
            data[key] = value[v] || ''
            v++
        }

        return JSON.stringify(data)
    },
    // 控件地址值
    getAddressControlValue (model, fieldOptions) {
        if (Utils.isEmpty(model)) {
            return []
        }
        const data = Utils.parseJSON(model)
        const topIndex = AddressUtls.getLevelIndex(fieldOptions.top || 'country')
        const levelIndex = AddressUtls.getLevelIndex(fieldOptions.level || 'district')
        const val = []
        for (let i = topIndex; i < levelIndex + 1; i++) {
            const key = AddressUtls.levelArr[i]
            if (data[key]) {
                val.push(data[key])
            }
        }
        return val
    },
    // 获得动态值
    getDynamicValue (value, vars) {
        return new Promise((resolve, reject) => {
            const params = {
                script: value,
                vars: vars || ''
            }
            remoteRequest('getScriptValue', params, () => {
                return new Promise((rev, rej) => {
                    getScriptValue(params).then(response => {
                        rev(response)
                    }).catch(error => {
                        rej(error)
                    })
                })
            }, true).then(response => {
                const data = response.data
                this.CACHE_DYNAMIC_VALUE[value] = data
                resolve(data)
            }).catch(() => {
            })
        })
    },
    setResponseLinkages: function (responseLinkages, model, code) {
        if (model.field_type === 'table') { //  判断是否是主表，子表他自己处理
            model.field_options.columns.forEach((item) => {
                this.setChangeLinkagesData(responseLinkages, item, model.name)
            })
        } else { // 主表
            this.setChangeLinkagesData(responseLinkages, model, code)
        }
    },
    setChangeLinkagesData: function (responseLinkages, model, code) {
        const fieldOptions = model.field_options
        if (Utils.isEmpty(fieldOptions)) {
            return
        }
        const type = fieldOptions.default_value_type
        const linkage = fieldOptions.default_value
        if (type !== 'linkage' || Utils.isEmpty(linkage)) { return }
        const changename = code + this.TABLE_SEPARATOR + model.name
        const changFormula = {
            changename: changename,
            linkage: linkage
        }
        const key = code + this.TABLE_SEPARATOR + linkage.field
        if (!responseLinkages[key]) { responseLinkages[key] = [] }
        responseLinkages[key].push(changFormula)
    },
    // TODO:数据联动
    // 1、主表数据联动 （完成）
    // 2、子表的数据联动
    // 3、不同控件间的数据联动
    // 4、支持不同控件进行联动
    // 5、实现多级联动
    runLinkage: function (self, responseLinkages, field, row) {
        if (!responseLinkages) { return }
        const curCode = field.code
        const key = field.name
        for (let i = 0; i < responseLinkages.length; i++) {
            const responseLinkage = responseLinkages[i]
            const linkage = responseLinkage.linkage
            const changename = responseLinkage.changename// 修改字段
            const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象

            const formParams = {
                key: linkage.dataSource,
                [`Q^${linkage.relyData}^S`]: this.getFieldDataValue(Utils.isEmpty(row), changeObj[0] === curCode, self.models, key, curCode, row)
            }

            // 加载数据
            queryLinkageData(ActionUtils.formatParams(formParams)).then(response => {
                const dataResult = response.data
                if (Utils.isNotEmpty(dataResult)) {
                    const resultVal = dataResult[linkage.dataField]
                    self.models[changeObj[1]] = resultVal
                }
            }).catch((e) => {
                console.error(e)
            })
        }
    },
    getFieldDataValue: function (isMainTable, isSameTable, data, key, code, row) {
        let val = ''
        if (isMainTable) { // 主表
            val = data[key]
        } else { // 子表
            if (isSameTable) { // 相同的表
                val = data[code][row][key]
            } else { // 如果改变的是主表,则取一列的值
                const tableData = data[code]
                if (Utils.isEmpty(tableData)) {
                    return ''
                }
                const v = tableData.map((d) => {
                    return d[key]
                })
                val = JSON.stringify(v) + ''
            }
        }

        return val
    },
    /**
     * 默认权限
     */
    getDefaultRigths (field) {
        if (Utils.isEmpty(field) || Utils.isEmpty(field.field_options)) {
            return
        }
        const hideRights = field.field_options.hide_rights
        if (Utils.isNotEmpty(hideRights) && hideRights) {
            return FormOptions.t.PERMISSIONS.HIDE
        }
        const readRights = field.field_options.read_rights
        if (Utils.isNotEmpty(readRights) && readRights) {
            return FormOptions.t.PERMISSIONS.READ
        }
    },
    /**
     *  表单意见权限
     * @param {*} field
     * @param {*} params
     */
    getDefaultApprovalOpinionRigths (field, params) {
        if (!params) {
            return
        }
        if (Utils.isNotEmpty(params.defId)) {
            return FormOptions.t.PERMISSIONS.HIDE
        }
        if (this.readApprovalOpinionRigths(field, params)) {
            return FormOptions.t.PERMISSIONS.READ
        }
    },
    /**
     * 表单意见读权限
     * @param {*} field
     * @param {*} params
     */
    readApprovalOpinionRigths (field, params) {
        if (!params) {
            return false
        }
        if (Utils.isNotEmpty(params.nodeId)) {
            const formOpinionConfig = params.formOpinionData.formOpinionConfig
            if (!formOpinionConfig) { return false }
            const bindNode = formOpinionConfig[field.name] || []
            return (Utils.isNotEmpty(bindNode) && !(bindNode.includes('') || bindNode.includes(params.nodeId)))
        } else {
            return false
        }
    },

    /**
     * 构建表单验证规则
     * @param {*} field
     * @param {*} required
     */
    buildFormRules (field, required, models) {
        const rules = []
        const fieldOptions = field.field_options || {}
        // 必填验证
        if (required) {
            rules.push({ required: true, message: I18n.t('validate.required') })
            rules.push({ validator: validateRequired, message: I18n.t('validate.required') })
        }
        // 整型验证
        if (fieldOptions.integer) {
            rules.push({ validator: validateInteger, message: I18n.t('validate.integer') })
        }
        // 小数验证
        if (fieldOptions.decimal) {
            rules.push({
                validator: validateDecimal,
                decimal: fieldOptions.decimal
            })
        }

        //  最大、最小字符串长度验证
        if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) ||
            (fieldOptions['is_max_length'] && Utils.isNotEmpty(fieldOptions['max_length']))) {
            rules.push({
                validator: validateLengthRange,
                format: field.field_type === 'editor' ? (v) => {
                    let content = v.replace(/<\/?[^>]*>/g, '') // 去除HTML Tag
                    content = content.replace(/[|]*\n/, '') // 去除行尾空格
                    content = content.replace(/&npsp;/ig, '') // 去掉npsp
                    return content
                } : false,
                min: fieldOptions['is_min_length'] ? fieldOptions['min_length'] : null,
                max: fieldOptions['is_max_length'] ? fieldOptions['max_length'] : null
            })
        }

        //  最大、最小值验证[数字]
        if ((fieldOptions['is_min'] && Utils.isNotEmpty(fieldOptions['min'])) ||
            (fieldOptions['is_max'] && Utils.isNotEmpty(fieldOptions['max']))) {
            rules.push({
                validator: validateNumberRange,
                min: fieldOptions['is_min'] ? fieldOptions['min'] : null,
                max: fieldOptions['is_max'] ? fieldOptions['max'] : null
            })
        }

        // 日期验证 date_format 不需要

        // 日期范围验证-开始、结束时间 date_between
        if (Utils.isNotEmpty(fieldOptions['start_date_type']) ||
            Utils.isNotEmpty(fieldOptions['end_date_type'])) {
            rules.push({
                validator: validateDateBetween,
                fieldOptions: fieldOptions,
                models: models
            })
        }

        //  最多、最少选项验证
        if ((fieldOptions['is_min_mum'] && Utils.isNotEmpty(fieldOptions['min_mum'])) ||
            (fieldOptions['is_max_mum'] && Utils.isNotEmpty(fieldOptions['max_mum']))) {
            rules.push({
                validator: validateOptions,
                min: fieldOptions['is_min_mum'] ? fieldOptions['min_mum'] : null,
                max: fieldOptions['is_max_mum'] ? fieldOptions['max_mum'] : null
            })
        }
        // 正则表达式
        if (fieldOptions['data_format']) {
            let dataFormatValue = fieldOptions['data_format_value']
            const dataFormatMsg = fieldOptions['data_format_msg']
            if (fieldOptions['data_format'] !== 'custom') {
                dataFormatValue = dataFormatMap[fieldOptions['data_format']].regexp
                // 内置校验规则更新，校验提示信息可自由配置
                // dataFormatMsg = I18n.t('validate.' + fieldOptions['data_format'])
            }
            rules.push({
                pattern: dataFormatValue,
                message: dataFormatMsg
            })
        }
        return rules
    },
    /**
     * 初始化表单意见
     */
    initFormOpinionData: function (attrs) {
        if (Utils.isEmpty(attrs)) { return null }
        const opinionList = attrs.opinionList // 表单意见列表
        const formOpinionConfig = attrs.formOpinion // 表单意见配置
        if (Utils.isEmpty(opinionList)) { return null }
        const opinionData = {
            hasBindNode: false, // 是否包含节点
            opinionList: [], // 表单意见数据list
            formOpinionNodeData: {}, // 表单意见节点的数据
            formOpinionConfig: {} // 表单意见配置
        }
        const formOpinionList = [] // 过滤掉待审批的
        for (let i = 0; i < opinionList.length; i++) {
            const opinion = opinionList[i]
            if (Utils.isEmpty(opinion.completeTime)) { continue }
            formOpinionList.push(opinion)
        }
        // 筛选出已保存未提交的审批意见（已结束流程无此数据，需判空）
        const unComplate = opinionList.find(i => i.completeTime === null)
        const unComplateOpinion = unComplate ? unComplate.opinion : ''
        opinionData.unComplateOpinion = unComplateOpinion

        if (Utils.isEmpty(formOpinionConfig)) { // 没有绑定节点的
            opinionData.hasBindNode = false
            opinionData.opinionList = formOpinionList
        } else {
            const opinionMap = {}
            for (let i = 0; i < formOpinionList.length; i++) {
                const opinion = formOpinionList[i]
                const nodeId = opinion.taskKey
                const opinionMapList = opinionMap[nodeId]
                if (Utils.isEmpty(opinionMapList)) {
                    opinionMap[nodeId] = []
                }
                opinionMap[nodeId].push(opinion)
            }
            const formOpinionNodeData = {}
            for (const k in formOpinionConfig) {
                const nodes = formOpinionConfig[k]
                if (Utils.isEmpty(nodes) || nodes.includes('')) { // 全局节点
                    formOpinionNodeData[k] = formOpinionList
                } else {
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i]
                        const oList = opinionMap[node] || []
                        let list = formOpinionNodeData[k] || []
                        list = list.concat(oList)
                        formOpinionNodeData[k] = list
                    }
                }
            }
            // 审批按时间排序
            for (const key in formOpinionNodeData) {
                let list = formOpinionNodeData[key]
                list = list.sort((obj1, obj2) => {
                    const val1 = obj1.completeTime
                    const val2 = obj2.completeTime
                    return val1 < val2 ? -1 : val1 > val2 ? 1 : 0
                })
                formOpinionNodeData[key] = list
            }

            opinionData.hasBindNode = true
            opinionData.formOpinionNodeData = formOpinionNodeData
            opinionData.formOpinionConfig = formOpinionConfig
            opinionData.opinionList = formOpinionList
        }
        return opinionData
    },

    hasLinkDynamicParams (fieldOptions) {
        const conditions = fieldOptions['link_condition'] ? fieldOptions['link_condition'] : []
        if (Utils.isNotEmpty(conditions)) { return true }
        return false
    },
    getDynamicParamsConfing (fieldOptions) {
        const conditions = fieldOptions['link_condition'] ? fieldOptions['link_condition'] : []
        if (Utils.isEmpty(conditions)) { return {} }
        const dynamicParams = {}
        for (let i = 0; i < conditions.length; i++) {
            const condition = conditions[i]
            dynamicParams[condition.fieldName] = condition
        }
        return dynamicParams
    },
    /**
     * 获取联动参数数据
     * @param {*} fieldOptions
     * @param {*} data
     * @param {*} row
     */
    getLinkDynamicParams (fieldOptions, data = {}, code, row) {
        const conditions = fieldOptions['link_condition'] ? fieldOptions['link_condition'] : []
        if (Utils.isEmpty(conditions)) { return {} }
        const dynamicParams = {}
        for (let i = 0; i < conditions.length; i++) {
            const condition = conditions[i]
            let val = ''
            const changeValueName = condition.value
            if (Utils.isNotEmpty(changeValueName) && condition.mode === 'bind') { // 绑定表单
                const changeObj = changeValueName.split('.')// 改变的对象
                if (changeObj.length > 1) {
                    const changeName = changeObj[changeObj.length - 1]
                    if (Utils.isNotEmpty(row)) {
                        if (Array.isArray(data)) {
                            val = data[code] && data[code][row] ? data[code][row][changeName] : (data[changeName] || '')
                        } else {
                            // val = (data[changeName] || '')
                            val = data[code][row][changeName]
                        }
                    } else { // 弹窗模式
                        const changeCode = changeObj[changeObj.length - 2]
                        // 判断 相同表.避免出现重复表名取值问题
                        if (changeCode === code) {
                            val = data[changeName] || ''
                        }
                    }
                } else {
                    val = data[changeObj[0]]
                }
            } else { // 固定值
                val = changeValueName
            }
            dynamicParams[condition.fieldName] = val || ''
        }
        return dynamicParams
    },
    getSwitchOptions (fieldOptions, valueKey = 'val', labelKey = 'label') {
        const options = []
        const activeValue = fieldOptions.active_value
        const activeText = Utils.isNotEmpty(fieldOptions.active_text) ? fieldOptions.active_text : activeValue
        const inactiveValue = fieldOptions.inactive_value
        const inactiveText = Utils.isNotEmpty(fieldOptions.inactive_text) ? fieldOptions.inactive_text : inactiveValue

        options.push({
            [valueKey]: activeValue,
            [labelKey]: activeText
        })
        options.push({
            [valueKey]: inactiveValue,
            [labelKey]: inactiveText
        })
        return options
    },
    getLinkValueKey (fieldOptions, data) {
        return fieldOptions['link_config'] ? fieldOptions['link_config'].id || '' : ''
    },
    getLinkLabelType (fieldOptions, data) {
        return fieldOptions['link_config'] ? fieldOptions['link_config'].type || 'first' : 'first'
    },
    getLinkLabelKey (fieldOptions, data) {
        return fieldOptions['link_config'] ? fieldOptions['link_config'].text || '' : ''
    },
    getLinkStructure (fieldOptions, data) {
        return fieldOptions['link_config'] ? fieldOptions['link_config'].structure || 'list' : 'list'
    },
    getLinkConfig (fieldOptions, data) {
        return fieldOptions['link_config'] ? fieldOptions['link_config'] || {} : {}
    },
    /**
     * 处理流程关联
     */
    getBpmLinkData: function (attrs) {
        if (Utils.isEmpty(attrs)) { return null }
        return {
            currentBpmLink: attrs.currentFormInst,
            postBpmLink: attrs.postFormInst
        }
    }
}

export default FormUtil
