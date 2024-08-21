<template>
    <el-form
        v-if="forms"
        ref="form"
        :model="params"
        :inline="inline"
        label-width="100"
        label-position="left"
        class="ibps-crud-search-form"
        size="mini"
        @submit.native.prevent
        @keyup.enter.native.stop="handleEnter"
    >
        <template v-for="(item, index) in forms">
            <el-form-item
                v-if="item.fieldType !== 'hidden'"
                :key="index"
                :prop="item.modelValue"
                :label="item.label"
                :rules="item.rules || []"
                :label-width="item.labelWidth ? (item.labelWidth + 'px') : 'width: 150px;'"
                class="search-form-item"
                @submit.native.prevent
            >
                <!-- 文本框-->
                <el-input
                    v-if="item.fieldType === 'input' ||item.fieldType === 'text'|| item.fieldType === undefined"
                    v-model="params[item.modelValue]"
                    :size="item.size ? item.size : 'mini'"
                    :readonly="item.readonly"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px;')"
                    clearable
                    @keyup.enter.native.stop="handleEnter"
                />
                <!-- 下拉框-->
                <el-select
                    v-else-if="item.fieldType === 'select'"
                    v-model="params[item.modelValue]"
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    multiple
                    clearable
                    collapse-tags
                    @keyup.enter.native.stop="handleEnter"
                >
                    <el-option
                        v-for="(option, optionIndex) in item.options"
                        :key="optionIndex + '_local'"
                        :value="(typeof option === 'object') ? option[item.valueKey || 'value'] : option"
                        :label="(typeof option === 'object') ? option[item.labelKey || 'label'] : option"
                    />
                    <el-option
                        v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
                        :key="opIndex + '_remote'"
                        :value="(typeof op === 'object') ? op[item.valueKey || 'value'] : op"
                        :label="(typeof op === 'object') ? op[item.labelKey || 'label'] : op"
                    />
                </el-select>
                <!--数字范围-->
                <ibps-number-range
                    v-else-if="item.fieldType === 'numberRange'"
                    v-model="params[item.modelValue]"
                    :placeholder="item.placeholder"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    @input="data => changeNumber(data, item.prop[0], item.prop[1])"
                    @keyup.enter.native.stop="handleEnter"
                />
                <!-- 日期-->
                <el-date-picker
                    v-else-if="item.fieldType === 'date'"
                    v-model="params[item.modelValue]"
                    :placeholder="item.placeholder"
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :editable="item.editable"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :picker-options="item.pickerOptions || {}"
                    type="'year'"
                    @change="date => changeDateAddEndDate(date, item)"
                    @keyup.enter.native.stop="handleEnter"
                />
                <!-- <el-date-picker
                    v-else-if="item.fieldType === 'datePicker'"
                    v-model="params[item.modelValue]"
                    :placeholder="item.placeholder"
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :editable="item.editable"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :picker-options="item.pickerOptions || {}"
                    :type="getDateType(item.field_options.datefmt)"
                    :value-format="item.field_options.datefmt"
                    :format="item.field_options.datefmt"
                    @keyup.enter.native.stop="handleEnter"
                /> -->
                <!-- 日期范围-->
                <ibps-date-range
                    v-else-if="item.fieldType === 'yearrange'"
                    v-model="params[item.modelValue]"
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :editable="item.editable"
                    :placeholder="item.placeholder"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :value-format="item.field_options.datefmt"
                    :format="item.field_options.datefmt"
                    type="year"
                    clearable
                    @change="date => changeDateAddEndDate(date, item)"
                    @keyup.enter.native.stop="handleEnter"
                />
                <!--
                    :placeholder="item.placeholder"
                    :picker-options="item.pickerOptions || {}"
                -->
                <el-date-picker
                    v-else-if="item.fieldType === 'monthrange' "
                    v-model="params[item.modelValue]"
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :editable="item.editable"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    value-format="yyyy-MM"
                    type="month"
                    format="yyyy-MM"
                    clearable
                    @change="date => monthDate(date, item.prop[0], item.prop[1])"
                    @keyup.enter.native.stop="handleEnter"
                />
                <el-date-picker
                    v-else-if="item.fieldType === 'daterange' ||item.fieldType === 'datetimerange'"
                    v-model="params[item.modelValue]"
                    unlink-panels
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :editable="item.editable"
                    :placeholder="item.placeholder"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
                    :picker-options="item.pickerOptions || defaultPickerOptions"
                    :type="item.fieldType"
                    :value-format="item.field_options.datefmt"
                    :format="item.field_options.datefmt"
                    clearable
                    @change="date => changeDate(date, item.prop[0], item.prop[1])"
                    @keyup.enter.native.stop="handleEnter"
                />
                <!-- 时间范围-->
                <el-time-picker
                    v-else-if="item.fieldType === 'timerange'"
                    v-model="params[item.modelValue]"
                    is-range
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :editable="item.editable"
                    :placeholder="item.placeholder"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : '')"
                    :picker-options="item.pickerOptions || {}"
                    :value-format="item.field_options.datefmt"
                    @change="date => changeDate(date, item.prop[0], item.prop[1])"
                    @keyup.enter.native.stop="handleEnter"
                />
                <!-- 数据字典-->
                <ibps-dictionary
                    v-else-if="item.fieldType === 'dictionary'"
                    v-model="params[item.modelValue]"
                    :type-key="item.field_options.dictionary"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :multiple="true"
                    :disabled="item.disabled"
                    clearable
                />
                <!-- 选择器-->
                <!-- :filtrate="item.filtrate" -->
                <ibps-user-selector
                    v-else-if="item.fieldType === 'selector'"
                    v-model="params[item.modelValue]"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :size="item.size ? item.size : 'mini'"
                    :type="item.selectorType||'user'"
                    :placeholder="item.placeholder"
                    :multiple="true"
                    :store="'id'"
                    :disabled="item.disabled"
                    :filter="item.field_options.filter || []"
                    :filtrate="true"
                    :temp-search="true"
                />
                <!--自定义对话框-->
                <ibps-custom-dialog
                    v-else-if="item.fieldType === 'customDialog'"
                    v-model="params[item.modelValue]"
                    :size="item.size ? item.size : 'mini'"
                    :disabled="item.disabled"
                    :template-key="item.field_options.dialog"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :multiple="true"
                    :store="item.field_options.store"
                    :icon="item.field_options.icon?'ibps-icon-'+item.field_options.icon:'ibps-icon-search'"
                    :type="item.field_options.dialog_type||'dialog'"
                    :dynamic-params="getLinkDynamicParams(item.field_options,params)"
                    :temp-search="true"
                    :previous-data-template="previousDataTemplate"
                    @close="handleRenderDialogClose"
                />
                <!-- 关联数据-->
                <ibps-link-data
                    v-else-if="item.fieldType==='linkdata'"
                    v-model="params[item.modelValue]"
                    :size="item.size ? item.size : 'mini'"
                    :template-key="item.field_options.linkdata"
                    :style="itemStyle + (item.itemWidth ? `width: ${item.itemWidth}px;` : 'width: 150px')"
                    :multiple="true"
                    :dynamic-params="getLinkDynamicParams(item.field_options,params)"
                    :value-key="getLinkValueKey(item.field_options)"
                    :label-type="getLinkLabelType(item.field_options)"
                    :label-key="getLinkLabelKey(item.field_options)"
                    :temp-search="true"
                />
                <!-- 地址-->
                <ibps-address
                    v-else-if="item.fieldType === 'address'"
                    v-model="params[item.modelValue]"
                    :size="item.field_options.size"
                    :top="item.field_options.top || 'country'"
                    :top-val="getAddressTopVal(item.field_options)"
                    :level="item.field_options.level||'district'"
                    data-type="code"
                />
                <!--TODO: 查询字段类型持续开发中-->
            </el-form-item>
        </template>
    </el-form>
</template>

<script>
import { formProps } from './props.js'
import request from '@/utils/request'
import FormUtils from '@/business/platform/form/utils/formUtil'
import IbpsNumberRange from '@/components/ibps-number-range'
import IbpsDateRange from '@/components/ibps-date-range'

import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsAddress from '@/components/ibps-address/cascader'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'

export default {
    components: {
        IbpsNumberRange,
        IbpsDateRange,
        IbpsDictionary,
        IbpsUserSelector,
        IbpsCustomDialog,
        IbpsLinkData,
        IbpsAddress
    },
    props: formProps,
    data () {
        const { forms, fuzzy } = this.$props
        const datePrefix = 'daterange-prefix'
        const selectOptionPrefix = 'select-option-prefix'
        const dataObj = {
            selectOptions: {}
        }
        const params = {}
        const nameParams = {}
        const format = {}
        const fuzzyOps = {}
        forms.forEach((v, i) => {
            const propType = typeof v.prop
            if (propType === 'string') {
                v.modelValue = v.prop
                params[v.prop] = v.value || ''
                if (v.name) {
                    nameParams[v.prop] = v.name
                }

                fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy
                if (v.format) {
                    format[v.prop] = v.format
                }
            } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
                v.prop.forEach((vv, j) => {
                    params[vv] = vv.value || ''
                    if (v.name) {
                        nameParams[vv] = v.name[j]
                    }
                    if (v.format) {
                        format[vv] = v.format
                    }
                    fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
                })
            }
            if (v.fieldType === 'yearrange' || v.fieldType === 'monthrange' || v.fieldType === 'daterange' || v.fieldType === 'datetimerange' || v.fieldType === 'timerange' || v.fieldType === 'numberRange') {
                params[datePrefix + i] = v.fieldType === 'numberRange' ? [] : ''
                v.modelValue = datePrefix + i
            } else if (v.fieldType === 'select' && (v.selectFetch || v.selectUrl)) {
                const dataKey = selectOptionPrefix + i
                dataObj.selectOptions[dataKey] = []
                if (!v.selectMethod) {
                    v.selectMethod = 'get'
                }
                this.getRemoteData({
                    fetch: v.selectFetch ? v.selectFetch : () => {
                        const p = v.selectMethod.toLowerCase() === 'get'
                            ? { params: v.selectParams } : v.selectParams
                        return request({
                            url: v.selectUrl,
                            method: v.selectMethod,
                            p
                        })
                    },
                    dataKey,
                    resultField: v.resultField || 'data',
                    resultHandler: v.resultHandler
                })
            }
        })
        return {
            defaultPickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            params,
            nameParams,
            datePrefix,
            selectOptionPrefix,
            ...dataObj,
            format,
            fuzzyOps
        }
    },
    computed: {
        itemStyle () {
            const { itemWidth } = this
            if (itemWidth) {
                return `width: ${itemWidth}px;`
            }
            return ''
        }

    },
    methods: {
        /**
         * 处理回车
         */
        handleEnter () {
            this.$emit('search')
        },
        isArray (value) {
            return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]'
        },
        getParamFuzzy () {
            return this.fuzzyOps
        },
        /**
         * 获取参数
         */
        getSearcFormData () {
            const { params, nameParams, datePrefix, format } = this
            // 剔除params里相同字段既有日期的筛选条件，又有重复的模糊查询条件，只保留日期的
            for (const i of Object.keys(params)) {
                const slic = i.slice(2)
                const name = slic.substring(0, slic.indexOf('^'))
                const hadName = Object.keys(params).filter(item => { return item.indexOf(name) > -1 })
                if (name && hadName.length > 2) {
                    delete params[`Q^${name}^SL`]
                }
            }
            const formattedForm = {
                arg: {
                    relation: 'AND',
                    parameters: []
                }
            }
            Object.keys(params).forEach(v => {
                if (v && v.indexOf(datePrefix) === -1) {
                    const val = format[v] ? format[v](params[v], v) : params[v]
                    if (this.$utils.isNotEmpty(val)) {
                        const key = nameParams[v] || v
                        if (!Array.isArray(val)) {
                            const valArr = val.split(',')
                            if (valArr.length > 1) {
                                const parameters = valArr.map(i => ({
                                    key,
                                    value: i,
                                    param: this.$utils.guid()
                                }))
                                formattedForm.arg.parameters.push({
                                    relation: 'OR',
                                    parameters
                                })
                            } else {
                                const o = {
                                    relation: 'AND',
                                    parameters: [
                                        {
                                            key,
                                            value: val,
                                            param: this.$utils.guid()
                                        }
                                    ]
                                }
                                formattedForm.arg.parameters.push(o)
                            }
                        } else {
                            const parameters = val.map(i => ({
                                key,
                                value: i,
                                param: this.$utils.guid()
                            }))
                            formattedForm.arg.parameters.push({
                                relation: 'OR',
                                parameters
                            })
                        }
                    }
                }
            })
            return formattedForm.arg.parameters.length ? formattedForm : {}
        },
        /**
         *重置表单
        */
        resetSearchForm () {
            const { params, datePrefix } = this
            Object.keys(params).forEach(v => {
                if (v && v.indexOf(datePrefix) === -1) {
                    params[v] = ''
                }
            })
            this.$refs['form'].resetFields()
        },
        changeNumber (data, start, end) {
            let startVal = null
            let endVal = null
            if (data !== null) {
                startVal = data[0] || null
                endVal = data[1] || null
            }
            this.params[start] = startVal
            this.params[end] = endVal
        },
        monthDate (date, startDate, endDate) {
            if (date === null) {
                this.params[startDate] = ''
                this.params[endDate] = ''
                return
            }
            // this.params[startDate] = this.formatDate(date, 1)
            // this.params[endDate] = this.formatDate(date, 2)
            this.params[startDate] = date + '-01'
            this.params[endDate] = date + '-31'
        },
        // yyyy格式 日期增加01-01和12-31
        changeDateAddEndDate (date, item, type) {
            const startDate = item.prop[0]
            const endDate = item.prop[1]
            const p = item.prop[0].split('^')
            const fmt = p[p.length - 1]
            if (date === null || date[0] == null) {
                this.params[startDate] = ''
                this.params[endDate] = ''
                return
            }
            this.params[startDate] = date[0] + '-01-01'
            this.params[endDate] = date[0] + '-12-31'

            return
        },
        changeDate (date, startDate, endDate) {
            if (date === null) {
                this.params[startDate] = ''
                this.params[endDate] = ''
                return
            }
            this.params[startDate] = date[0]
            this.params[endDate] = date[1]
        },
        padDate (value) {
            return value < 10 ? '0' + value : value
        },
        formatDate (value, num) {
            var date = new Date(value)
            if (date.getMonth() + num > 12) {
                var year = date.getFullYear() + 1
                var month = this.padDate(1)
            } else {
                var year = date.getFullYear()
                var month = this.padDate(date.getMonth() + num)
            }
            var day = this.padDate(date.getDate())
            var hours = this.padDate(date.getHours())
            var minutes = this.padDate(date.getMinutes())
            var seconds = this.padDate(date.getSeconds())
            const week = new Date(value).getDay()
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            const getWeek = '星期' + weeks[week]
            return year + '-' + month
        },
        /**
         * 获取的远程数据【下拉框】
         */
        getRemoteData ({ fetch, dataKey, resultField, resultHandler }) {
            fetch().then(response => {
                let result = response
                if (typeof response === 'object' && !this.isArray(response)) {
                    if (resultField.indexOf('.') !== -1) {
                        resultField.split('.').forEach(vv => {
                            result = result[vv]
                        })
                    } else {
                        result = response[resultField]
                    }
                }
                if (!result || !(result instanceof Array)) {
                    throw new Error(`The result of key:${resultField} is not Array.`)// 接口返回的字段:${resultField} 不是一个数组
                }
                if (this.resultHandler) {
                    this.selectOptions[dataKey] = result.map(this.resultHandler)
                } else {
                    this.selectOptions[dataKey] = result
                }
            })
        },
        getAddressTopVal (fieldOptions) {
            return FormUtils.getAddressTopVal(fieldOptions)
        },
        getLinkDynamicParams (fieldOptions, data) {
            return FormUtils.getLinkDynamicParams(fieldOptions, data)
        },
        getLinkValueKey (fieldOptions, data) {
            return FormUtils.getLinkValueKey(fieldOptions, data)
        },
        getLinkLabelType (fieldOptions, data) {
            return FormUtils.getLinkLabelType(fieldOptions, data)
        },
        getLinkLabelKey (fieldOptions, data) {
            return FormUtils.getLinkLabelKey(fieldOptions, data)
        },
        // yyyy-MM-dd HH:mm:ss
        getDateType (datefmt) {
            switch (datefmt) {
                case 'yyyy':
                    return 'year'
                case 'yyyy-MM':
                    return 'month'
                default:
                    return 'date'
            }
        },
        handleRenderDialogClose (visible, previousDataTemplate) {
            this.$emit('close', visible, previousDataTemplate)
        }
    }
}
</script>
<style>
    .el-form-item__label{
        font-size: 12px !important;
    }
</style>
