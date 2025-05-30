<template>
    <div v-if="$utils.isNotEmpty(dataTemplate)">
        <data-template-render
            :data="dataTemplate"
            :height="height"
            :dynamic-params="dynamicParams"
        />
    </div>
    <div v-else class="ibps-container-frame" />
</template>
<script>
import { getBuildDataById } from '@/api/platform/data/dataTemplate'
import { getFormDataByFormKey } from '@/api/platform/form/formDef'

import DataTemplateRender from '@/business/platform/data/templaterender'
import { buildFelds } from '@/business/platform/data/templaterender/utils'

export default {
    components: {
        DataTemplateRender
    },
    props: {
        height: [String, Number],
        dynamicParams: {
            type: Object
        },
        filterParams: {
            type: Array
        },
        templateId: {
            type: String,
            default: ''
        },
        typeName: {
            type: String,
            default: ''
        },
        typeId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            dataTemplate: {},
            dataTemplateId: '',
            query: {}
        }
    },
    watch: {
        '$route': {
            handler (val, oldVal) {
                if (val === oldVal) {
                    return
                }
                this.$nextTick(() => {
                    const { defaultUrl } = this.$route.meta || {}
                    const isDashboard = this.$route.name
                    if (this.$utils.isNotEmpty(defaultUrl)) {
                        // 判断地址是否正确
                        const { id, query } = this.parseUrl(defaultUrl) || {}
                        this.dataTemplateId = id
                        this.query = query
                    } else if (isDashboard === 'dashboard') {
                        this.dataTemplateId = this.templateId
                    } else {
                        const params = this.$route.params
                        this.dataTemplateId = params.id
                    }
                    if (this.$utils.isEmpty(this.dataTemplateId) && this.$utils.isEmpty(this.templateId)) {
                        this.$alert('参数错误，未获取模版ID')
                        return
                    }
                    this.loadDataTemplate()
                })
            },
            deep: true,
            immediate: true
        },
        // 不同的 typeId 可能会有相同的 templateId
        // templateId: {
        //     handler (val) {
        //         console.log('templateId', val)
        //         if (this.$utils.isNotEmpty(val)) {
        //             this.dataTemplateId = val
        //             this.loadDataTemplate()
        //         }
        //     },
        //     immediate: true
        // },
        typeId: {
            handler (val) {
                if (this.$utils.isNotEmpty(val)) {
                    this.dataTemplateId = this.templateId
                    this.loadDataTemplate()
                }
            },
            immediate: true
        }
    },
    // created () {
    //     this.loadDataTemplate()
    // },
    methods: {
        parseUrl (url) {
            // 处理URL可能包含的前导/尾随斜杠和空格
            url = (url || '').trim().replace(/^\/|\/$/g, '')
            // 分割路径和查询部分
            const [pathPart, queryPart] = url.split('?')

            // 提取ID
            const idMatch = pathPart.match(/^d\/(\d+)$/)
            const id = idMatch ? idMatch[1] : null

            // 解析查询参数
            const query = {}
            if (queryPart) {
                queryPart.split('&').forEach(pair => {
                    const [key, value] = pair.split('=')
                    if (key) {
                        query[key] = value || ''
                    }
                })
            }

            return {
                id: id ? BigInt(id).toString() : null,
                query
            }
        },
        loadDataTemplate () {
            const loading = this.$loading({
                lock: false,
                background: 'transparent'
            })
            this.dataTemplate = {}
            getBuildDataById({
                dataTemplateId: this.templateId || this.dataTemplateId,
                isFilterForm: false,
                isRightsFilter: true
            }).then(response => {
                // 从后台获取数据
                const data = this.$utils.parseData(response.data)
                if (data && data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
                    getFormDataByFormKey({
                        formKey: data.attrs.form_key
                    }).then(response => {
                        const formData = this.$utils.parseData(response.data)
                        const datasets = buildFelds(formData.fields, data.datasets)
                        data.datasets = datasets
                        this.dataTemplate = { ...data, query: this.query }
                        if (this.typeName) {
                            this.dataTemplate.templates = this.dealData(this.dataTemplate)
                        }
                        setTimeout(() => {
                            loading.close()
                        }, 1000)
                    }).catch(() => {
                        loading.close()
                    })
                } else {
                    this.dataTemplate = { ...data, query: this.query }
                    setTimeout(() => {
                        loading.close()
                    }, 1000)
                }
            }).catch(() => {
                loading.close()
            })
        },
        buildFelds (fields, datasets) {
            const fieldMap = {}
            fields.forEach(field => {
                if (field.field_type === 'grid' || field.field_type === 'tabs') {
                    field.field_options.columns.forEach(column => {
                        column.fields.forEach(cfield => {
                            fieldMap[cfield.field_name] = cfield
                        })
                    })
                } else {
                    fieldMap[field.field_name] = field
                }
            })
            const rtn = []
            datasets.forEach(dataset => {
                const field = fieldMap[dataset.name]
                if (this.$utils.isNotEmpty(field)) {
                    dataset.field_type = field.field_type
                    dataset.field_options = field.field_options
                }
                rtn.push(dataset)
            })
            return rtn
        },
        dealData ({ showType, templates }) {
            if (showType !== 'list') {
                return templates
            }
            const data = templates[0]
            // 替换列表标题
            data.attrs.display_field = this.typeName
            // 替换按钮
            data.buttons.function_buttons = this.dealButtom(data.buttons.function_buttons)
            // 增加过滤信息
            data.filter_conditions = this.dealFilter(data.filter_conditions)
            // 处理查询条件默认值，数据模板中的查询条件默认值如果与模板归档中的配置冲突，则优先使用归档中的配置
            data.query_columns = this.dealQueryColumns(data.query_columns)
            return [data]
        },
        dealButtom (buttons) {
            const keys = ['search', 'remove', 'consult', 'detail']
            if (!buttons.length) {
                return []
            }
            const defaultBtn = buttons.filter(i => keys.includes(i.button_type))
            const customBtn = buttons.filter(i => i.show_on_record === 'Y')
            return [...defaultBtn, ...customBtn]
        },
        dealFilter (dataList = []) {
            // 1.去除原过滤条件中的编制部门在其中
            // 2.追加数据模板归档中的过滤条件
            // 3.增加地点过滤（若为第一层级用户，则过滤出所有一二级地点数据；若为第二级用户，则过滤当前地点数据）
            const levelFilter = this.getLevelFilter()
            // 无过滤条件时默认地点过滤
            const initList = dataList.length ? dataList : [
                {
                    label: '默认条件',
                    key: this.$utils.guid(),
                    type: 'condition',
                    rights: [{ type: 'all' }],
                    filter: {
                        condition: 'AND',
                        rules: [levelFilter]
                    }
                }
            ]

            const newDataList = initList.map(data => {
                const rules = data.filter.rules.filter(i => i.id !== 'find_in_set' && !i.value.includes('cscript.findPositionId'))
                const newRules = [
                    ...this.filterParams.map(item => ({
                        id: item.field,
                        type: 'string',
                        input: 'text',
                        ...item
                    })),
                    ...rules,
                    levelFilter
                ]
                // 关联关系固定为AND
                return { ...data, filter: { ...data.filter, condition: 'AND', rules: newRules.filter(i => i) }}
            })
            return newDataList
        },
        dealQueryColumns (data) {
            if (!data || !data.length || !this.filterParams || !this.filterParams.length) {
                return data || []
            }
            const allParamsKey = this.filterParams.map(i => i.field)
            data.forEach(item => {
                if (allParamsKey.includes(item.name)) {
                    item.default_value = undefined
                }
            })
            return data
        },
        // 获取当前用户地点信息 equal-等于 in-在…之内
        getLevelFilter () {
            const { second = '' } = this.$store.getters.level
            const { deptList = [] } = this.$store.getters
            // 当参数中含有地点配置时，无需再额外处理
            const hasLocationParams = this.filterParams.some(i => i.id === 'di_dian_' && i.value.includes('cscript.findPositionId'))
            if (hasLocationParams) {
                return undefined
            }
            if (second) {
                return {
                    field: 'di_dian_',
                    id: 'di_dian_',
                    input: 'text',
                    label: '地点',
                    operator: 'equal',
                    source: 'fixed',
                    type: 'string',
                    value: second
                }
            }

            return {
                field: 'di_dian_',
                id: 'di_dian_',
                input: 'text',
                label: '地点',
                operator: 'in',
                source: 'fixed',
                type: 'string',
                value: deptList.filter(i => i.depth * 1 >= 2).map(i => i.id)
            }
        }
    }
}
</script>
<style lang="scss">
.data-template-renderer-dialog {
    .el-dialog__header {
        padding: 0;
        border-bottom: 0;
    }
    .el-dialog__body {
        padding: 0;
    }
    .el-dialog__headerbtn {
        z-index: 99999;
    }
}
</style>
