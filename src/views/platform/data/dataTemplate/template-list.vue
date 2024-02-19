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
        }
    },
    data () {
        return {
            dataTemplate: {},
            dataTemplateId: ''
        }
    },
    watch: {
        '$route': {
            handler (val, oldVal) {
                if (val === oldVal) {
                    return
                }
                this.$nextTick(() => {
                    const defaultUrl = this.$route.meta.defaultUrl
                    const isDashboard = this.$route.name
                    if (this.$utils.isNotEmpty(defaultUrl)) {
                        // 判断地址是否正确
                        const url = defaultUrl.split('/')
                        this.dataTemplateId = url[url.length - 1]
                    } else if (isDashboard === 'dashboard') {
                        this.dataTemplateId = this.templateId
                    } else {
                        const params = this.$route.params
                        this.dataTemplateId = params.id
                    }
                    if (this.$utils.isEmpty(this.dataTemplateId)) {
                        this.$alert('参数错误，未获取模版ID')
                        return
                    }
                    this.loadDataTemplate()
                })
            },
            deep: true,
            immediate: true
        },
        templateId: {
            handler (val) {
                if (this.$utils.isNotEmpty(val)) {
                    this.dataTemplateId = val
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
                        this.dataTemplate = data
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
                    this.dataTemplate = data
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
            return [data]
        },
        dealButtom (buttons) {
            const keys = ['search', 'remove', 'consult', 'detail']
            if (!buttons.length) {
                return []
            }
            const defaultBtn = buttons.filter(i => keys.includes(i.button_type))
            const customBtn = buttons.filter(i => i.show_on_record == 'Y')
            return [...defaultBtn, ...customBtn]
        },
        dealFilter (dataList) {
            // 1.去除原过滤条件中的编制部门在其中
            // 2.追加数据模板归档中的过滤条件
            // 3.增加地点过滤（若为第一层级用户，则过滤出所有一二级地点数据；若为第二级用户，则过滤当前地点数据）
            const levelFilter = this.getLevelFilter()
            if (!dataList.length) {
                // 无过滤条件时默认地点过滤
                return [
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
            }
            const newDataList = dataList.map(data => {
                const rules = data.filter.rules.filter(i => i.id !== 'find_in_set' && !i.value.includes('cscript.findPositionId()'))
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
                return { ...data, filter: { ...data.filter, rules: newRules }}
            })
            return newDataList
        },
        // 获取当前用户地点信息 equal-等于 in-在…之内
        getLevelFilter () {
            const { second = '' } = this.$store.getters.level
            const { deptList = [] } = this.$store.getters
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
