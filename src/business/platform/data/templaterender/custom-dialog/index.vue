<template>
    <div>
        <ibps-selector
            v-bind="$props"
            :icon="icon"
            :items="items"
            :multiple="multiple"
            :disabled="disabled"
            :readonly="readonly"
            :size="size"
            :readonly-text="readonlyText"
            :temp-search="tempSearch"
            @click="handleSelectorClick"
            @remove="handleSelectorRemove"
            v-on="$listeners"
        />
        <data-template-dialog
            :visible.sync="selectorVisible"
            :data="dataTemplate"
            :dynamic-params="dynamicParams"
            :multiple="multiple"
            :value="selectorValue"
            :label-key="labelKey"
            :preview="false"
            :temp-search="tempSearch"
            type="dialog"
            @close="visible=>selectorVisible =visible"
            @action-event="handleSelectorActionEvent"
        />
    </div>
</template>
<script>
import { getByKey, transferByIds, queryDataById } from '@/api/platform/data/dataTemplate'
import { valueEquals } from '@/plugins/element-ui/src/utils/util'
import emitter from '@/plugins/element-ui/src/mixins/emitter'
// remoteTransRequest
import { remoteRequest, remoteTransRequest } from '@/utils/remote'
import DataTemplateDialog from '../preview'
import IbpsSelector from '@/components/ibps-selector/selector'
import { buildLabelTitle } from '../utils'
import { TRANSFER_DATA } from '@/constant'

export default {
    components: {
        DataTemplateDialog,
        IbpsSelector
    },
    mixins: [emitter],
    props: {
        value: { // value
            type: [String, Number, Object, Array],
            default () {
                return this.multiple ? [] : {}
            }
        },
        templateKey: { // 数据模版key
            type: String
        },
        dynamicParams: { // 动态参数
            type: Object
        },
        // 存储类型 ,
        // ①、id:只存储id 字符串，
        // ②、json： json字符串,
        store: {
            type: String,
            default: 'id',
            validator: function (value) {
                return ['id', 'json'].indexOf(value) !== -1
            }
        },
        storeSeparator: { // 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
            type: String,
            default: ','
        },
        placeholder: { // 输入框占位文本
            type: String,
            default: '请选择'
        },
        multiple: { // 是否多选
            type: Boolean,
            default: false
        },
        disabled: { // 禁用
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'mini'
        },
        readonly: { // 只读
            type: Boolean,
            default: false
        },
        readonlyText: { // 只读样式
            type: String,
            default: 'text'
        },
        icon: {
            type: String,
            default: 'search-plus'
        },
        tempSearch: { // 是否是数据模板使用的筛选条件
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            initialization: false,
            dataTemplate: {},
            labelKey: '',
            valueKey: '',
            selectorVisible: false,
            selectorValue: this.multiple ? [] : {},
            cacheData: {},
            bindIdValue: ''
        }
    },
    computed: {
        items () {
            if (this.$utils.isEmpty(this.selectorValue)) return []
            if (this.multiple) {
                return this.selectorValue.map(data => {
                    return this.handleLabel(data)
                })
            } else {
                return [this.handleLabel(this.selectorValue)]
            }
        }
    },
    watch: {
        value: {
            handler (val, oldVal) {
                this.initData()
                if (!valueEquals(val, oldVal)) {
                    this.dispatch('ElFormItem', 'el.form.change', val)
                }
            },
            immediate: true
        },
        templateKey: {
            handler (val, oldVal) {
                if (val !== oldVal && val) {
                    this.loadTemplateData()
                } else {
                    this.dataTemplate = {}
                }
            },
            immediate: true
        },
        dynamicParams (val, oldVal) {
            if (val !== oldVal) {
                this.initData()
            }
        }
    },
    beforeDestroy () {
        this.dataTemplate = {}
        this.cacheData = {}
    },
    methods: {
        loadTemplateData () {
            this.initialization = false
            if (this.$utils.isEmpty(this.templateKey)) {
                return
            }
            remoteRequest('dataTemplate', this.templateKey, () => {
                return this.getRemoteDataTemplateFunc(this.templateKey)
            }).then(data => {
                this.initialization = true
                this.dataTemplate = this.$utils.parseData(data)
                this.dataTemplate.showType === 'compose' ? this.initDataTemplate(this.dataTemplate.composeType === 'treeList' ? this.dataTemplate.templates[1].attrs.bind_template_key : this.dataTemplate.templates[0].attrs.bind_template_key) : this.initDataTemplate()
            }).catch(() => {
            })
        },
        getRemoteDataTemplateFunc (templateKey) {
            return new Promise((resolve, reject) => {
                getByKey({ dataTemplateKey: templateKey }).then(response => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        initDataTemplate (key) {
            if (this.$utils.isEmpty(key)) {
                this.valueKey = this.dataTemplate.unique
                this.labelKey = buildLabelTitle(this.dataTemplate)
                this.initData()
            } else {
                remoteRequest('dataTemplate', key, () => {
                    return this.getRemoteDataTemplateFunc(key)
                }).then(res => {
                    this.initialization = true
                    const data = this.$utils.parseData(res)
                    this.valueKey = data.unique
                    this.labelKey = buildLabelTitle(data)
                    this.initData()
                }).catch(() => {
                })
            }
        },
        handleLabel (data) {
            const config = this.labelKey
            if (typeof config === 'function') {
                return config(data)
            } else if (typeof config === 'string') {
                return data[config]
            } else if (typeof config === 'undefined') {
                const dataProp = data['name']
                return dataProp === undefined ? '' : dataProp
            }
        },
        /**
     * 初始化数据
     */
        initData (init = true) {
            const data = this.getArrayValue(this.value)
            this.selectorValue = this.multiple ? [] : {}
            if (this.$utils.isEmpty(data)) {
                return
            }
            data.forEach(v => {
                if (this.cacheData[v]) {
                    this.setSelectorValue(v)
                } else {
                    if (init && this.initialization) {
                        this.getDataInfo(v)
                    }
                }
            })
        },
        setCacheData () {
            if (this.$utils.isEmpty(this.selectorValue)) return
            const data = this.multiple ? this.selectorValue : [this.selectorValue]
            data.forEach(v => {
                this.cacheData[v[this.valueKey]] = v
            })
        },
        setSelectorValue (v) {
            if (this.multiple) {
                this.selectorValue.push(this.cacheData[v])
            } else {
                this.selectorValue = JSON.parse(JSON.stringify(this.cacheData[v]))
            }
        },
        /**
     * 获得数组数据
     */
        getArrayValue (value, bindId) {
            if (this.$utils.isEmpty(value)) {
                return []
            }
            if (this.store === 'json') { // json
                const o = Object.prototype.toString.call(this.$utils.parseData(value)) === '[object Object]'
                try {
                    const data = o ? [this.$utils.parseData(value)] : this.$utils.parseData(value)
                    return data.map((d) => {
                        return d[this.valueKey]
                    })
                } catch (error) {
                    console.error(error)
                    return []
                }
            } else if (this.store === 'id') { // id
                return value.split(this.storeSeparator)
            } else if (this.store === 'bind') { // 绑定id
                if (this.$utils.isEmpty(bindId)) {
                    return []
                }
                return bindId.split(this.storeSeparator)
            } else { // array
                return value.map((d) => {
                    return d[this.valueKey]
                })
            }
        },
        getStoreValue (value) {
            const res = []
            if (this.store === 'json') { // json
                if (this.$utils.isEmpty(value)) {
                    return ''
                }
                if (this.multiple) {
                    value.forEach(v => {
                        const o = {}
                        o[this.valueKey] = v[this.valueKey]
                        if (typeof this.labelKey === 'string') {
                            o[this.labelKey] = v[this.labelKey]
                            o['#title#'] = v[this.labelKey]
                        } else {
                            o['#title#'] = this.labelKey(v)
                        }
                        res.push(o)
                    })
                    return JSON.stringify(res)
                } else {
                    const o = {}
                    o[this.valueKey] = value[this.valueKey]
                    if (typeof this.labelKey === 'string') {
                        o[this.labelKey] = value[this.labelKey]
                        o['#title#'] = value[this.labelKey]
                    } else {
                        o['#title#'] = this.labelKey(value)
                    }
                    return JSON.stringify(o)
                }
            } else if (this.store === 'id') { // id
                if (this.$utils.isEmpty(value)) {
                    return ''
                }
                if (this.multiple) {
                    value.forEach(v => {
                        res.push(v[this.valueKey])
                    })
                } else {
                    res.push(value[this.valueKey])
                }
                return res.join(this.storeSeparator)
            } else if (this.store === 'bind') { // 绑定id
                const res = []
                const bindIdValue = []
                value.forEach(v => {
                    bindIdValue.push(v[this.valueKey])
                    res.push(v[this.labelKey])
                })
                this.bindIdValue = bindIdValue.join(this.storeSeparator)

                return res.join(this.storeSeparator)
            } else { // 数组 array
                return value || []
            }
        },
        getValue () {
            return this.getStoreValue(this.selectorValue)
        },
        /**
    * 通过ID获取数据
     */
        getDataInfo (id) {
            if (TRANSFER_DATA === 'transfer') {
                this.getTransferData(id)
            } else {
                this.getRemoteData(id)
            }
        },
        getTransferData (id) {
            remoteTransRequest('dataTemplate:' + this.templateKey, id).then(idset => {
                const ids = Array.from(idset)
                remoteRequest('dataTemplateIds', ids, () => {
                    return this.getRemoteTransFunc(ids)
                }).then(response => {
                    if (this.$utils.isNotEmpty(response) && this.$utils.isNotEmpty(response.data)) {
                        const responseData = response.data
                        const dataKey = id
                        const data = responseData[dataKey] ? responseData[dataKey] : {}
                        let key = id
                        if (this.$utils.isNotEmpty(data[this.valueKey])) {
                            key = data[this.valueKey]
                        }
                        this.cacheData[key] = data
                        this.initData(false)
                    }
                }).catch(() => {
                })
            })
        },
        getRemoteTransFunc (ids) {
            return new Promise((resolve, reject) => {
                transferByIds({
                    'templateKey': this.templateKey,
                    'ids': ids
                }).then(response => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
            })
        },

        /**
     * 通过ID获取数据
     */
        getRemoteData (id) {
            const params = {
                key: this.templateKey,
                id: id
            }
            if (this.$utils.isNotEmpty(this.dynamicParams)) {
                params['dynamicParams'] = JSON.stringify(this.dynamicParams)
            }
            remoteRequest('dataTemplate', params, () => {
                return this.getRemoteDataTemplateByIdFunc(params)
            }).then(responseData => {
                if (this.$utils.isNotEmpty(responseData) && this.$utils.isNotEmpty(responseData.data)) {
                    const data = responseData.data[0]
                    let key = id
                    if (this.$utils.isNotEmpty(data[this.valueKey])) {
                        key = data[this.valueKey]
                    }
                    this.cacheData[key] = data
                    this.initData(false)
                }
            }).catch(() => {
            })
        },
        getRemoteDataTemplateByIdFunc (params) {
            return new Promise((resolve, reject) => {
                queryDataById(params).then(response => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        // ===================事件处理=========

        handleSelectorClick () {
            if (this.$utils.isEmpty(this.templateKey)) {
                this.$message.closeAll()
                this.$message({
                    message: '请绑定自定义对话框',
                    type: 'warning'
                })
                return
            }
            this.selectorVisible = true
            this.initData()
        },
        handleSelectorRemove (index) {
            if (this.multiple) {
                this.selectorValue.splice(index, 1)
            } else {
                this.selectorValue = {}
            }
            const val = this.getValue()
            this.handleInput(val)
            this.emitChange(val)
        },

        handleSelectorActionEvent (buttonKey, data) {
            let val
            switch (buttonKey) {
                case 'ok':// 确定
                    this.selectorVisible = false
                    this.selectorValue = data
                    this.setCacheData() // 设置缓存数据
                    val = this.getValue()
                    this.handleInput(val)
                    this.emitChange(val)
                    break
                case 'cleanClose': // 清空关闭
                    this.selectorVisible = false
                    this.selectorValue = this.multiple ? [] : {}
                    this.handleInput('')
                    this.emitChange('')
                    break
                case 'cancel':// 取消
                    this.selectorVisible = false
                    break
        // TODO:自定义按钮事件处理
            }
        },
        emitChange (val) {
            if (!valueEquals(this.value, val)) {
                this.$emit('change', val, this.selectorValue)
                this.$emit('change-link-data', val, this.selectorValue)
            }
        },
        handleInput (val) {
            this.$emit('input', val, this.selectorValue)
            this.$emit('change-link-attr', val, this.selectorValue)
        }
    }
}
</script>
