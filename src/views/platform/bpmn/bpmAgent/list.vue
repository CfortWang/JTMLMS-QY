<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            :index-row="false"
            :display-field="title"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <template slot="delegatorId">
                <!-- <ibps-employee-selector :value="searchDelegatorId" style="width: 200px" @input="getDelegatorId" /> -->
                <ibps-user-selector
                    v-model="searchDelegatorId"
                    :type="type"
                    :filter="filter"
                    :multiple="multiple"
                    :filtrate="filtrate"
                    :store="store"
                    :disabled="disabled"
                    :readonly-text="readonlyText"
                    placeholder="请选择代理人"
                    @change-link-data="callbackAgenterInfo"
                />
            </template>
        </ibps-crud>
        <edit :id="editId" :title="title" :visible="dialogFormVisible" :readonly="readonly" @callback="search" @close="(visible) => (dialogFormVisible = visible)" />
    </div>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import { queryPageList, remove, setEnable } from '@/api/platform/bpmn/bpmAgent'
import ibpsUserSelector from '@/business/platform/org/selector'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { statusOptions, agentTypeOptions } from './constants'
import Edit from './edit'

export default {
    components: {
        IbpsEmployeeSelector,
        Edit,
        ibpsUserSelector
    },
    mixins: [FixHeight],
    data () {
        return {
            dialogFormVisible: false, // 弹窗
            editId: '', // 编辑dialog需要使用
            readonly: false, // 是否只读
            pkKey: 'id', // 主键  如果主键不是pk需要传主键

            searchDelegatorId: '',
            title: '事务代理记录列表',
            loading: true,
            height: document.clientHeight,

            listData: [],
            pagination: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'add'
                    },
                    {
                        key: 'edit'
                    },
                    {
                        key: 'remove'
                    }
                ],
                searchForm: {
                    forms: [
                        // { prop: 'Q^TITLE_^SL', label: '标题' },
                        {
                            prop: 'Q^AGENTER_ID_^S',
                            label: '代理人',
                            fieldType: 'slot',
                            slotName: 'delegatorId'
                        },
                        {
                            prop: 'Q^IS_ENABLED_^S',
                            label: '是否启用',
                            fieldType: 'select',
                            options: statusOptions
                        }
                        // {
                        //     prop: 'Q^AGENT_TYPE_^S',
                        //     label: '代理类型',
                        //     fieldType: 'select',
                        //     options: agentTypeOptions
                        // }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'title', label: '标题' },
                    { prop: 'delegatorName', label: '委托人' },
                    { prop: 'agenterName', label: '代理人' },
                    { prop: 'isEnabled', label: '是否启用', tags: statusOptions },
                    { prop: 'effectiveTime', label: '生效时间', sortable: 'custom' },
                    { prop: 'expiryTime', label: '失效时间', sortable: 'custom' },
                    { prop: 'agentType', label: '代理类型', tags: agentTypeOptions }
                ]
                // rowHandle: {
                //   actions: [{
                //     key: 'edit'
                //   }, {
                //     key: 'enabled',
                //     label: '启用',
                //     icon: 'ibps-icon-toggle-on',
                //     hidden: (rowData, index) => {
                //       return rowData.isEnabled === 'enabled'
                //     }
                //   }, {
                //     key: 'disabled',
                //     label: '禁用',
                //     icon: 'ibps-icon-toggle-off',
                //     hidden: (rowData, index) => {
                //       return rowData.isEnabled === 'disabled'
                //     }
                //   }, {
                //     key: 'remove'
                //   }, {
                //     key: 'detail'
                //   }]
                // }
            },
            // 委托人和代理人 选择器修改通用选择器，需要这些参数
            type: 'user',
            filter: [{
                descVal: '2',
                includeSub: true,
                old: 'position',
                partyId: '',
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            multiple: false,
            filtrate: true,
            store: 'id',
            disabled: false,
            readonlyText: 'null'
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        getDelegatorId (value) {
            this.searchDelegatorId = value
        },
        callbackAgenterInfo (value, data, type) {
            console.log(value)
            this.searchDelegatorId = value
        },
        // 加载数据
        loadData () {
            this.loading = true
            queryPageList(this.getSearcFormData())
                .then((response) => {
                    ActionUtils.handleListData(this, response.data)
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        /**
         * 获取格式化参数
         */
        getSearcFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            params['Q^AGENTER_ID_^S'] = this.searchDelegatorId
            return ActionUtils.formatParams(params, this.pagination, this.sorts)
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        /**
         * 查询
         */
        search () {
            this.loadData()
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search': // 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add': // 添加
                    this.handleEdit()
                    this.title = '事务代理设置'
                    break
                case 'edit': // 编辑
                    ActionUtils.selectedRecord(selection)
                        .then((id) => {
                            this.handleEdit(id)
                            this.title = '编辑流程代理'
                        })
                        .catch(() => {})
                    break
                case 'detail': // 明细
                    ActionUtils.selectedRecord(selection)
                        .then((id) => {
                            this.handleEdit(id, true)
                            this.title = '流程代理明细'
                        })
                        .catch(() => {})
                    break
                case 'remove': // 删除
                    ActionUtils.removeRecord(selection)
                        .then((ids) => {
                            this.handleRemove(ids)
                        })
                        .catch(() => {})
                    break
                case 'enabled': // 启用
                    this.handleSetEnable(data.id, 'enabled')
                    break
                case 'disabled': // 禁用
                    this.handleSetEnable(data.id, 'disabled')
                    break
                default:
                    break
            }
        },
        /**
         * 处理编辑。
         */
        handleEdit (id = '', readonly = false) {
            this.editId = id
            this.readonly = readonly
            this.dialogFormVisible = true
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            remove({ ids: ids })
                .then((response) => {
                    ActionUtils.removeSuccessMessage()
                    this.search()
                })
                .catch(() => {})
        },
        handleSetEnable (id, status) {
            const params = { id: id, isEnabled: status }
            setEnable(params)
                .then((response) => {
                    ActionUtils.removeSuccessMessage(response.message)
                    this.search()
                })
                .catch(() => {})
        }
    }
}
</script>
