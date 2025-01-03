<template>
    <div v-if="structure === 'list'">
        <template v-if="!readonly">
            <el-select
                v-model="selectData"
                v-load-more="loadMore"
                :filterable="filterable"
                :clearable="clearable"
                :no-data-text="showEmptyText"
                :loading="loading"
                :multiple="multiple"
                :placeholder="placeholder"
                style="width: 100%"
                :allow-create="allowCreate"
                :collapse-tags="tempSearch"
                @focus="focusData"
                @change="changeData"
                @clear="clearData"
                v-on="$listeners"
                @blur="e => {selectData = e.target.value}"
            >
                <el-option
                    v-for="(item, i) in selectDataOptions"
                    :key="i"
                    :label="labelFilter(item, 'label')"
                    :value="labelFilter(item, 'value')"
                />
            </el-select>
        </template>
        <!--只读-->
        <template v-else>
            <template v-if="!initLoading && $utils.isNotEmpty(treeDataOptions) && $utils.isNotEmpty(selectData)">
                <template v-if="multiple">
                    <el-tag
                        v-for="(item, index) in selectData"
                        :key="item + index"
                        disable-transitions
                        class="ibps-mr-5"
                    >
                        {{ item | optionsFilter(treeDataOptions, 'label') }}
                    </el-tag>
                </template>
                <template v-else>
                    {{ selectData | optionsFilter(treeDataOptions, 'label') }}
                </template>
            </template>
        </template>
    </div>
    <ibps-tree-select
        v-else
        v-model="selectData"
        :data="treeData"
        :props="props"
        :node-key="pkKey"
        :multiple="multiple"
        :placeholder="placeholder"
        :empty-text="showEmptyText"
        :clearable="clearable"
        :filterable="filterable"
        :select-mode="selectMode"
        :display-mode="displayMode"
        :separator="separator"
        :disabled="disabled"
        :readonly="readonly"
        :readonly-text="readonlyText"
        @focus="focusData"
        @change="changeData"
        @clear="clearData"
        v-on="$listeners"
    />
</template>
<script>
import { getByKey, queryDataTable } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import { remoteRequest } from '@/utils/remote'
import { getDynamicParamsConditions, buildLabelTitle, buildLinkLabelTitle } from '../utils'
import TreeUtils from '@/utils/tree'
import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
    components: {
        IbpsTreeSelect
    },
    props: {
        allowCreate: {
            // 是否可填写
            type: Boolean,
            default: true
        },
        value: {
            type: [String, Number, Array, Object],
            default: ''
        },
        templateKey: {
            // 数据模版key
            type: String
        },
        allowEmptyDynamicParams: {
            type: Boolean,
            default: false
        },
        hasDynamicParams: {
            type: Boolean,
            default: false
        },
        dynamicParams: {
            // 动态参数
            type: Object
        },
        data: {
            type: Array
        },
        multiple: {
            // 是否多选
            type: Boolean,
            default: false
        },
        structure: {
            type: String,
            default: 'list'
        },
        valueKey: {
            // 值key
            type: String
        },
        labelType: {
            // 文本类型
            type: String,
            default: 'first'
        },
        labelKey: {
            // 文本key
            type: [String, Function]
        },
        config: {
            // 配置
            type: Object
        },
        disabled: {
            // 是否禁用
            type: Boolean,
            default: false
        },
        readonly: {
            // 是否只读
            type: Boolean,
            default: false
        },
        placeholder: {
            // 输入框占位文本
            type: String,
            default: '请选择'
        },
        emptyText: {
            type: String,
            default: '暂无数据'
        },
        store: {
            // 存储类型 对应[多选]有效，array 数组。string 字符串类型
            type: String,
            default: 'string',
            validator: function (value) {
                return ['array', 'string'].indexOf(value) !== -1
            }
        },
        storeSeparator: {
            // 存储值分割符，对于设置字符串类型的分隔符
            type: String,
            default: ','
        },
        clearable: {
            type: Boolean,
            default: true
        },
        filterable: {
            type: Boolean,
            default: true
        },
        readonlyText: {
            // 只读样式
            type: String,
            default: 'original'
        },
        tempSearch: { // 是否是数据模板使用的筛选条件
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dataTemplate: {},
            template: {},
            loading: false,
            initLoading: true,
            initValue: '',
            pkKey: this.valueKey,
            props: {
                children: 'children',
                label: this.labelKey
            },
            listData: [],
            selectData: this.multiple ? [] : '',
            treeData: [],
            treeDataOptions: [],
            dynamicConditions: {},
            showEmptyText: this.emptyText,
            selectDataOptions: [],
            pagination: {
                page: 1,
                limit: 10,
                count: 0
            }
        }
    },
    computed: {
        pidKey () {
            return this.config ? this.config.parentId || '' : ''
        },
        selectMode () {
            return this.config ? this.config.selectMode || 'any' : 'any'
        },
        displayMode () {
            return this.config ? this.config.displayMode || 'path' : 'path'
        },
        separator () {
            return this.config ? this.config.split || '/' : '/'
        }
    },
    watch: {
        selectData (val, oldVal) {
            this.$emit('input', this.getStoreValue(val))
        },
        templateKey: {
            handler (val, oldVal) {
                if (val !== oldVal && val) {
                    this.loadTemplateData()
                } else {
                    this.treeData = []
                    this.treeDataOptions = []
                    this.selectDataOptions = []
                }
            },
            immediate: true
        },
        dynamicParams: {
            handler (val, oldVal) {
                if (!this.valueEquals(val, oldVal) && this.hasDynamicParams) {
                    this.treeData = []
                    this.treeDataOptions = []
                    this.selectDataOptions = []
                    this.clearData()
                }
            },
            immediate: true
        },
        structure: {
            handler (val, oldVal) {
                if (val !== oldVal && val) {
                    this.loadTemplateData()
                }
            },
            immediate: true
        },
        emptyText (val, oldVal) {
            if (this.$utils.isEmpty(this.templateKey)) {
                this.showEmptyText = '请设置关联数据'
            } else {
                this.showEmptyText = val
            }
        },
        multiple (val, oldVal) {
            if (val !== oldVal && !this.initLoading) {
                this.initData()
            }
        },
        value: {
            handler (val, oldVal) {
                if (val !== oldVal && !this.initLoading) {
                    this.initData()
                    this.changeLinkAttr()
                }
            },
            immediate: true
        },
        labelKey: {
            handler (val, oldVal) {
                if (val !== oldVal && val) {
                    this.props.label = buildLinkLabelTitle(this.labelType, this.labelKey, this.labelKey)
                }
            },
            immediate: true
        },
        valueKey: {
            handler (val, oldVal) {
                if (val !== oldVal && val) {
                    this.pkKey = this.valueKey
                }
            },
            immediate: true
        }
    },
    created () {
        this.defaultPagination = JSON.parse(JSON.stringify(this.pagination))
    },
    beforeDestroy () {
        this.listData = null
        this.treeData = null
        this.treeDataOptions = null
        this.selectDataOptions = null
    },
    methods: {
        valueEquals (obj1, obj2) {
            const o1 = obj1 instanceof Object
            const o2 = obj2 instanceof Object
            // 判断是不是对象
            if (!o1 || !o2) {
                return obj1 === obj2
            }

            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false
            }

            for (var o in obj1) {
                const t1 = obj1[o] instanceof Object
                const t2 = obj2[o] instanceof Object
                if (t1 && t2) {
                    return this.valueEquals(obj1[o], obj2[o])
                } else if (obj1[o] !== obj2[o]) {
                    return false
                }
            }
            return true
        },
        labelFilter (item, key) {
            const opt = this.treeDataOptions.find(opt => {
                return opt.value === item[this.pkKey]
            })
            // 添加个年份的判断
            if (key === 'label' && opt && opt[key] && opt[key].slice(5, 10) === '01-01') {
                if (opt[key].slice(5, 10) == '00:00:00') return (opt[key] = opt[key].slice(0, 4))
                else if (this.props['label'] === 'nian_fen_') return (opt[key] = opt[key].slice(0, 4))
            }
            return opt ? opt[key] : ''
        },
        getTreeData (id) {
            return this.treeData.find(opt => {
                return opt[this.pkKey] === id
            })
        },
        loadMore () {
            const pageSize = this.pagination.limit * this.pagination.page
            if (pageSize >= this.pagination.count) {
                return
            }
            this.pagination.page = this.pagination.page + 1
            const data = this.treeData.slice(pageSize, pageSize + this.pagination.limit)
            if (this.$utils.isNotEmpty(data)) {
                data.forEach(d => {
                    this.selectDataOptions.push(d)
                })
            }
        },
        loadTemplateData () {
            if (this.$utils.isEmpty(this.templateKey)) {
                return
            }
            this.loading = true
            remoteRequest('dataTemplate', this.templateKey, () => {
                return this.getRemoteDataTemplateFunc(this.templateKey)
            }).then(response => {
                this.loading = false
                this.dataTemplate = this.$utils.parseData(response.data)
                this.template = this.dataTemplate.templates[0]
                this.initDataTemplate()
                this.loadTreeData(true)
            })
        },
        getRemoteDataTemplateFunc (templateKey) {
            return new Promise((resolve, reject) => {
                getByKey({ dataTemplateKey: templateKey }).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        initDataTemplate () {
            this.pkKey = this.$utils.isEmpty(this.valueKey) ? this.dataTemplate.unique || 'id_' : this.valueKey
            this.props.label = this.buildLabelTitle(this.labelKey)
            this.dynamicConditions = getDynamicParamsConditions(this.dataTemplate)
        },
        buildLabelTitle (labelKey) {
            if (this.$utils.isEmpty(labelKey)) {
                return buildLabelTitle(this.dataTemplate)
            } else {
                return buildLinkLabelTitle(this.labelType, labelKey, labelKey)
            }
        },
        focusData (event) {
            if (!event.sourceCapabilities) return // 如果是勾选或反选下拉选项
            if (!event.target.value) {
                // 输入框没有搜索条件时触发
                this.loadTreeData()
            }
        },
        /**
         * 初始化的时候  将选中的数据移动到最前面 防止因为分页找不到对应的label
         */
        handleData (data = []) {
            if (data.length === 0 || !this.selectData) return data
            const newData = JSON.parse(JSON.stringify(data)) // 深拷贝避免缓存数据被修改
            const selectiton = this.multiple ? this.selectData : [this.selectData]
            // 将n条数据与前n条数据做交换
            for (let i = 0; i < selectiton.length; i++) {
                const item = selectiton[i]
                const index = newData.findIndex(i => i[this.valueKey] === item)
                if (index > -1 && index !== i) {
                    const temp = newData[index]
                    newData[index] = newData[i]
                    newData[i] = temp
                }
                // console.log(JSON.parse(JSON.stringify(newData)))
            }
            return newData
        },
        loadTreeData (init = false) {
            if (init) {
                this.listData = []
                this.treeData = []
                this.treeDataOptions = []
                this.selectDataOptions = []
                this.initLoading = true
            }
            if (this.$utils.isEmpty(this.templateKey)) {
                this.showEmptyText = '请设置关联数据'
                this.initLoading = false
                return
            }
            // 遍历所有条件
            if (this.$utils.isNotEmpty(this.dynamicConditions) && !this.allowEmptyDynamicParams) {
                for (const key in this.dynamicConditions) {
                    const value = this.dynamicParams[key]
                    if (this.$utils.isEmpty(value)) {
                        this.listData = []
                        this.treeData = []
                        this.treeDataOptions = []
                        this.selectDataOptions = []
                        this.showEmptyText = '请输入或选择过滤条件'
                        this.initLoading = false
                        return
                    }
                }
            }
            if (this.$utils.isEmpty(this.template)) {
                this.showEmptyText = '加载中...'
                this.initLoading = false
                return
            }
            this.showEmptyText = '加载中...'
            const p = this.getFormatParams()
            remoteRequest('dataTemplate', p, () => {
                return this.getRemoteQueryDataTableFunc(p)
            }).then(response => {
                this.showEmptyText = this.emptyText
                const responseData = response.data
                let data = responseData.dataResult || []

                // 当多选的数据大于分页数时 动态调整分页容量
                if (this.multiple && this.selectData.length > this.pagination.limit) {
                    this.pagination.limit = Math.ceil(this.selectData.length / 10) * 10
                    this.defaultPagination.limit = this.pagination.limit
                }
                data = this.handleData(data, init)

                if (this.structure === 'list') {
                    // 处理分页
                    this.handlerPagination(JSON.parse(JSON.stringify(this.defaultPagination)))
                    this.pagination.count = data.length

                    this.selectDataOptions = []
                    this.$nextTick(() => {
                        this.selectDataOptions = data.slice(this.pagination.page - 1, this.pagination.limit)
                    })

                    this.treeData = data
                } else {
                    this.treeData = TreeUtils.transformToTreeFormat(data, {
                        idKey: this.pkKey,
                        pIdKey: this.pidKey
                    })
                }

                this.listData = data
                this.treeDataOptions = this.buildTreeDataOptions(data)

                if (init) {
                    this.initLoading = false
                    this.initData()
                    this.changeLinkAttr()
                }
                this.$emit('load-data', this.listData)
            }).catch(() => {
                this.showEmptyText = '加载数据出错了'
                this.loading = false
                this.initLoading = false
            })
        },
        buildTreeDataOptions (data) {
            const cont = data.map(item => {
                let labelData = ''
                if (typeof this.props.label === 'string') {
                    labelData = item[this.props.label]
                } else {
                    const labs = this.labelKey.split('$_widget_')
                    for (const i in labs) {
                        if (labs[i]) {
                            const src = labs[i].split('#')
                            labelData = labelData + item[src[0]] + src[1]
                        }
                    }
                }
                return {
                    value: item[this.pkKey],
                    label: labelData
                }
            })
            return cont
        },
        getRemoteQueryDataTableFunc (p) {
            return new Promise((resolve, reject) => {
                queryDataTable(p).then(response => {
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handlerPagination (pagination) {
            this.pagination = pagination
        },
        /**
         * 获取格式化参数
         */
        getFormatParams () {
            let formParams = {}
            if (this.$refs['searchForm']) {
                formParams = this.$refs['searchForm'].getSearcFormData() || {}
            }
            const responseData = JSON.parse(JSON.stringify(this.template))

            responseData.datasetKey = this.dataTemplate.datasetKey
            responseData.unique = this.pkKey
            responseData['key'] = this.templateKey
            responseData['dynamic_params'] = this.dynamicParams
            formParams['response_data'] = JSON.stringify(responseData)
            formParams['filter_condition_key'] = this.filterConditionKey || ''
            return ActionUtils.formatParams(formParams)
        },
        initData () {
            if (this.multiple) {
                this.selectData = this.getArrayValue()
            } else {
                this.selectData = this.value
            }
            this.initSelectDataOptions()
        },
        initSelectDataOptions () {
            if (this.$utils.isEmpty(this.selectDataOptions) || this.$utils.isEmpty(this.selectData)) return
            if (this.multiple) {
                this.selectData.forEach(data => {
                    this.setSelectDataOptions(data)
                })
            } else {
                this.setSelectDataOptions(this.selectData)
            }
        },
        setSelectDataOptions (v) {
            const data = this.selectDataOptions.find(item => {
                return item[this.valueKey] === v
            })
            if (!data) {
                // bug 2022-03-09 nichuqia modified
                // this.selectDataOptions.push(this.getTreeData(v))
            }
        },
        getArrayValue () {
            if (this.store === 'string') {
                return this.$utils.isNotEmpty(this.value) ? this.value.split(this.storeSeparator) : []
            } else {
                return this.value || []
            }
        },
        getStoreValue (val) {
            if (this.multiple) {
                if (this.store === 'string') {
                    return this.$utils.isNotEmpty(val) ? val.join(this.storeSeparator) : ''
                } else {
                    return val || []
                }
            } else {
                return val
            }
        },
        getSelectedData (val) {
            if (this.$utils.isEmpty(val) || this.$utils.isEmpty(this.listData)) {
                return {}
            }
            const data = this.listData.find(d => {
                if (d[this.pkKey] === val) {
                    return d
                }
            })
            return data
        },
        clearData () {
            const val = ''
            this.$emit('input', this.getStoreValue(val))
            this.changeData(val)
            this.changeLinkAttr()
        },
        changeData (val) {
            if (!this.multiple && this.getSelectedData(val)) {
                this.$emit('change-link-data', val, this.getSelectedData(val))
            }
        },
        changeLinkAttr () {
            if (!this.multiple) {
                this.$emit('change-link-attr', this.value, this.getSelectedData(this.value))
            }
        }
    }
}
</script>
