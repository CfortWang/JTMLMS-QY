<template>
    <div>
        <ibps-selector
            :items="items"
            :multiple="multiple"
            :placeholder="placeholder"
            :readonly="readonly"
            :readonly-text="readonlyText"
            :disabled="disabled"
            :disabled-icon="disabledIcon"
            :show-placeholder="showPlaceholder"
            :temp-search="tempSearch"
            @click="handleSelectorClick"
            @remove="handleSelectorRemove"
        />
        <org-compose-selector-dialog
            ref="composeSelectorDialog"
            :visible="selectorVisible"
            :form-data="formData"
            :type="type"
            :value="selectorValue"
            :filter="filter"
            :multiple="multiple"
            :filtrate="filtrate"
            @close="visible=>selectorVisible=visible"
            @action-event="handleSelectorActionEvent"
        />
    </div>
</template>
<script>
import { transfer as transferEmployee, get as getEmployee } from '@/api/platform/org/employee'
import { transfer as transferOrg, get as getOrg } from '@/api/platform/org/org'
import { transfer as transferPosition, get as getPosition } from '@/api/platform/org/position'
import { transfer as transferRole, get as getRole } from '@/api/platform/org/role'

import { valueEquals } from '@/plugins/element-ui/src/utils/util'
import emitter from '@/plugins/element-ui/src/mixins/emitter'
import { remoteRequest, remoteTransRequest } from '@/utils/remote'

import IbpsSelector from '@/components/ibps-selector/selector'
import OrgComposeSelectorDialog from './dialog'
import { TRANSFER_DATA } from '@/constant'

export default {
    components: {
        IbpsSelector,
        OrgComposeSelectorDialog
    },
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    mixins: [emitter],
    props: {
        type: {
            type: String,
            default: 'employee'
        },
        value: {
            type: [String, Number, Array, Object]
        },
        // 存储类型 ：
        // ①、id:只存储id 字符串，
        // ②、json： json字符串,
        // ③、 array：存储数组数据(完整数据，包含key和value)。
        // ④、 bind：绑定ID，需要回调和返回
        store: {
            type: String,
            default: 'id',
            validator: function (value) {
                return ['id', 'json', 'array', 'arrayId', 'bind'].indexOf(value) !== -1
            }
        },
        storeSeparator: { // 存储值分割符,对应[多选]有效，对于设置字符串类型的分隔符
            type: String,
            default: ','
        },
        multiple: { // 是否多选
            type: Boolean,
            default: false
        },
        filtrate: {
            type: Boolean,
            default: false
        },
        placeholder: { // 输入框占位文本
            type: String,
            default: '请选择'
        },
        labelKey: {
            type: String,
            default: 'name'
        },
        valueKey: {
            type: String,
            default: 'id'
        },
        disabled: { // 禁用
            type: Boolean,
            default: false
        },
        disabledIcon: { // 禁用有图标
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        filter: {
            type: Array,
            default: () => []
        },
        readonlyText: {
            type: String,
            default: 'original'
        },
        showPlaceholder: { // 是否显示占位符
            type: Boolean,
            default: false
        },
        formData: Object,
        tempSearch: { // 是否是数据模板使用的筛选条件
            type: Boolean,
            default: false
        }

    },
    data () {
        return {
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
                    return data[this.labelKey] || ''
                })
            } else {
                return [this.selectorValue[this.labelKey] || '']
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
        }
    },
    methods: {
        /**
         * 初始化数据
         */
        initData () {
            let value = ''
            if (this.type === 'position' && !this.multiple && this.value) {
                const valueList = this.value.split(',')
                value = valueList[valueList.length - 1]
                // this.emitChangeLinkData(value, 'position')
                this.$emit('input', value)
            } else {
                value = this.value
            }

            const data = this.getArrayValue(value)
            this.selectorValue = this.multiple ? [] : {}
            if (this.$utils.isEmpty(data)) {
                return
            }
            data.forEach(v => {
                if (this.cacheData[v]) {
                    this.setSelectorValue(v)
                } else {
                    this.getDataInfo(v)
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
                return this.parseJsonData(value)
            } else if (this.store === 'id') { // id
                // 可能是json数据
                if (this.$utils.isJSON(value)) {
                    return this.parseJsonData(value)
                } else {
                    return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
                }
            } else if (this.store === 'bind') { // 绑定bind
                if (this.$utils.isJSON(value)) {
                    return this.parseJsonData(value)
                } else {
                    return this.$utils.isString(value) ? value.split(this.storeSeparator) : []
                }
            } else { // array
                return value.map((d) => {
                    return d[this.valueKey]
                })
            }
        },
        parseJsonData (value) {
            try {
                const data = this.$utils.parseData(value)
                const result = []
                if (Array.isArray(data)) {
                    data.forEach(d => {
                        this.cacheData[d[this.valueKey]] = d
                        const node = d[this.valueKey]
                        if (node) result.push(node)
                    })
                } else {
                    this.cacheData[data[this.valueKey]] = data
                    result.push(data[this.valueKey])
                }
                return result
            } catch (error) {
                return []
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
                        o[this.labelKey] = v[this.labelKey]
                        res.push(o)
                    })
                    return JSON.stringify(res)
                } else {
                    const o = {}
                    o[this.valueKey] = value[this.valueKey]
                    o[this.labelKey] = value[this.labelKey]
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
            } else if (this.store === 'bind') { // 绑定bind
                const bindIdValue = []
                value.forEach(v => {
                    bindIdValue.push(v[this.valueKey])
                })
                this.bindIdValue = bindIdValue.join(this.storeSeparator)

                return this.bindIdValue
            } else { // 数组 array
                return value || []
            }
        },
        getValue () {
            return this.getStoreValue(this.selectorValue)
        },
        getDataInfo (id) {
            const type = this.type
            if (TRANSFER_DATA === 'transfer') {
                this.getTransferData(type, id)
            } else {
                this.getRemoteData(type, id)
            }
        },
        setRemoteData (data) {
            if (this.$utils.isNotEmpty(data)) {
                this.cacheData[data[this.valueKey]] = data
                this.setSelectorValue(data[this.valueKey])
            }
        },
        getTransferData (type, id) {
            remoteTransRequest(type + 'id', id).then(idset => {
                const ids = Array.from(idset)
                remoteRequest(type + 'ids', ids, () => {
                    return this.getRemoteTransFunc(type, ids)
                }).then(response => {
                    const responseData = response.data
                    const data = responseData[id]
                    data[this.valueKey] = id
                    this.setRemoteData(data)
                }).catch(() => {
                })
            })
        },
        getRemoteTransFunc (type, ids) {
            return new Promise((resolve, reject) => {
                switch (type) {
                    case 'employee':// 员工
                    case 'user':
                        transferEmployee({
                            'ids': ids
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break

                    case 'org':// 组织
                        transferOrg({
                            'ids': ids
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break
                    case 'position':// 岗位
                        transferPosition({
                            'ids': ids
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break
                    case 'role':// 角色
                        transferRole({
                            'ids': ids
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break
                    default:
                        break
                }
            })
        },
        getRemoteData (type, id) {
            remoteRequest(type + 'id', id, () => {
                return this.getRemoteByIdFunc(type, id)
            }).then(response => {
                const data = response.data
                this.setRemoteData(data)
            }).catch(() => {
            })
        },
        getRemoteByIdFunc (type, id) {
            return new Promise((resolve, reject) => {
                switch (type) {
                    case 'employee':// 员工
                    case 'user':
                        getEmployee({
                            employeeId: id
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break

                    case 'org':// 组织
                        getOrg({
                            orgId: id
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break
                    case 'position':// 岗位
                        getPosition({
                            positionId: id
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break
                    case 'role':// 角色
                        getRole({
                            roleId: id
                        }).then(response => {
                            resolve(response)
                        }).catch((error) => {
                            reject(error)
                        })
                        break
                    default:
                        break
                }
            })
        },
        // ===================事件处理=========
        handleSelectorClick () {
            this.selectorVisible = true
            this.initData()
        },
        handleSelectorRemove (index) {
            if (this.multiple) {
                this.selectorValue.splice(index, 1)
            } else {
                this.selectorValue = {}
            }
            this.handleInput()
        },
        handleSelectorActionEvent (buttonKey, data, type) {
            let val
            switch (buttonKey) {
                case 'confirm':// 确定
                    this.selectorVisible = false
                    this.selectorValue = data
                    this.setCacheData() // 设置缓存数据
                    this.handleInput()
                    val = this.getValue()
                    this.emitChangeLinkData(val, type)
                    break
            }
        },
        handleInput () {
            const value = this.getValue()
            this.$emit('input', value)
        },
        emitChangeLinkData (val, type) {
            if (!valueEquals(this.value, val)) {
                this.$emit('change-link-data', val, this.selectorValue, type)
            }
        }
    }
}
</script>
