<template>
    <ibps-layout ref="layout">
        <ibps-crud
            ref="crud"
            :height="tableHeight"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :pagination="pagination"
            :loading="loading"
            :selection-type="multiple?'checkbox':'radio'"
            @selection-change="handleSelectionChange"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        />
    </ibps-layout>
</template>
<script>
import { queryPageList } from '@/api/platform/form/formPrint'
import ActionUtils from '@/utils/action'
import SelectionMixin from '@/components/ibps-selector/mixins/selection'

export default {
    mixins: [SelectionMixin],
    props: {
        value: [Object, Array],
        multiple: Boolean,
        height: {
            type: String,
            default: '400px'
        },
        type: {
            type: String
        },
        formKey: {
            type: String
        }
    },
    data () {
        return {
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: false,
            listData: [],
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    labelWidth: 100,
                    forms: [
                        { prop: 'Q^name_^SL', label: '名称', itemWidth: '200' },
                        { prop: 'Q^key_^SL', label: '编码', itemWidth: '200' }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'name', label: '名称' },
                    { prop: 'key', label: '编码' }
                ]
            },
            pagination: {},
            sorts: { CREATE_TIME_: 'DESC' }

        }
    },
    computed: {
        tableHeight () {
            const h = this.height.substr(0, this.height.length - 2)
            return parseInt(h) - 10
        }
    },
    watch: {
        type: {
            handler (val, oldVal) {
                if (val) {
                    this.loadListData()
                }
            },
            immediate: true
        }
    },
    methods: {
        /**
         * 加载数据
         */
        loadListData () {
            this.loading = true
            queryPageList(this.getFormatParams()).then(response => {
                this.loading = false
                ActionUtils.handleListData(this, response.data)
                this.setSelectRow()
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getFormatParams () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            params['Q^FORM_KEY_^S'] = this.formKey
            params.type = this.type
            return ActionUtils.formatParams(
                params,
                this.pagination,
                this.sorts)
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            this.changePageCoreRecordData()
            ActionUtils.setPagination(this.pagination, page)
            this.loadListData()
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadListData()
        },
        /**
         * 查询
         */
        search () {
            this.loadListData()
        },
        /**
         * 重置查询条件
         */
        reset () {
            this.$refs['crud'].handleReset()
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                default:
                    break
            }
        }
    }
}
</script>
