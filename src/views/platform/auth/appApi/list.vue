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
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <!-- 搜索栏插槽 -->
            <template slot="scope">
                <el-select v-model="scope" clearable placeholder="请选择">
                    <el-option
                        v-for="item in scopeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </template>
            <!-- 表格字段插槽 -->
            <template slot="scopeColumns" slot-scope="scopeColumns">
                <el-tag
                    v-for="(item,index ) in dataConvert(scopeColumns.row.scope)"
                    :key="index"
                >
                    {{ item|optionsFilter(scopeOptions,'label') }}
                </el-tag>
            </template>
        </ibps-crud>
        <edit
            :id="editId"
            :title="title"
            :constant="constantInfo(scopeOptions)"
            :visible="dialogFormVisible"
            :readonly="readonly"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
        <import
            :title="title"
            :visible="importFormVisible"
            @callback="search"
            @close="visible => importFormVisible = visible"
        />
    </div>
</template>

<script>
import { queryPageList, remove, submitLimit, getSubmitLimit, getSubmitLimitEnabled } from '@/api/platform/auth/api'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { typeOptions } from './constants'
import Edit from './edit'
import Import from './import'
import { findApiScope } from '@/api/platform/info/find'

const getScopeType = scopeType => {
    return typeOptions.find(x => x.value === scopeType)
}

export default {
    components: {
        Edit,
        Import
    },
    filters: {
        getScopeTypeFilter (scopeType) {
            const t = getScopeType(scopeType)
            return t ? t.label : scopeType
        }
    },
    mixins: [FixHeight],
    data () {
        const statusOptions = [{
            label: '是',
            value: 'Y'
        }, {
            label: '否',
            value: 'N',
            type: 'danger'
        }]
        return {
            dialogFormVisible: false, // 弹窗
            importFormVisible: false,
            editId: '', // 编辑dialog需要使用
            readonly: false, // 是否只读
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            title: '',
            loading: true,
            isLimitedEnabled: false,
            isLimited: false,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            scopeOptions: [],
            scope: '',
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'import'
                    },
                    {
                        key: 'add'
                    },
                    {
                        key: 'edit'
                    },
                    {
                        key: 'remove'
                    },
                    {
                        key: 'setSubmitLimit',
                        label: '设置接口提交限制',
                        icon: 'ibps-icon-plus-square-o',
                        hidden: (data) => {
                            return this.isLimitedEnabled === false || this.$store.getters.isSuper === false || this.isLimited === true
                        }
                    },
                    {
                        key: 'removeSubmitLimit',
                        label: '取消接口提交限制',
                        icon: 'ibps-icon-minus-square-o',
                        hidden: (data) => {
                            return this.isLimitedEnabled === false || this.$store.getters.isSuper === false || this.isLimited === false
                        }
                    }
                ],
                searchForm: {
                    forms: [
                        { prop: 'Q^APP_KEY_^SL', label: '应用标识' },
                        { prop: 'Q^API_KEY_^SL', label: '接口标识' },
                        { prop: 'Q^API_NAME_^SL', label: '接口名称' },
                        { prop: 'Q^API_URI_^SL', label: '接口地址' },
                        { prop: 'Q^SCOPE_^SL', label: '作用域', fieldType: 'slot', slotName: 'scope' },
                        { prop: 'Q^SUBMIT_CTRl_^S', label: '提交限制', fieldType: 'select',
                            options: statusOptions }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'appKey', label: '应用标识', width: 150 },
                    { prop: 'apiKey', label: '接口标识', minWidth: 150 },
                    { prop: 'apiName', label: '接口名称', width: 150 },
                    { prop: 'apiUri', label: '接口地址', minWidth: 200 },
                    { prop: 'scope', label: '作用域', slotName: 'scopeColumns', width: 100 },
                    {
                        prop: 'submitCtrl', label: '提交限制',
                        tags: statusOptions,
                        width: 100
                    },
                    { prop: 'limit', label: '频次', width: 80 },
                    { prop: 'testLimit', label: '测试频次', width: 90 }
                ],
                rowHandle: {
                    actions: [{
                        key: 'edit'
                    }, {
                        key: 'remove'
                    }, {
                        key: 'detail'
                    }]
                }
            }
        }
    },
    created () {
        this.loadData()
        this.constant()
        if (this.$store.getters.isSuper === true) {
            this.loadSubmitLimit()
        }
    },
    methods: {
        constantInfo (...params) {
            return { ...params }
        },
        dataConvert (data) {
            return data.split(',')
        },
        loadSubmitLimit () {
            getSubmitLimit().then(response => {
                this.isLimited = response.data
            }).catch(() => {})
            getSubmitLimitEnabled().then(response => {
                this.isLimitedEnabled = response.data
            }).catch(() => {})
        },
        toggleSubmitLimit () {
            if (this.isLimited) {
                submitLimit({ limit: false }).then(response => {
                    ActionUtils.success('取消接口限制成功')
                    this.isLimited = false
                    this.$router.replace('/refresh')
                }).catch(() => {
                })
            } else {
                submitLimit({ limit: true }).then(response => {
                    ActionUtils.success('设置接口限制成功')
                    this.isLimited = true
                    this.$router.replace('/refresh')
                }).catch(() => {
                })
            }
        },
        constant () {
            findApiScope().then(response => { this.scopeOptions = response.data }).catch(() => {})
        },
        // 加载数据
        loadData () {
            this.loading = true
            queryPageList(this.getSearcFormData()).then(response => {
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getSearcFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            params['Q^SCOPE_^SL'] = this.scope
            return ActionUtils.formatParams(
                params,
                this.pagination,
                this.sorts)
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
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add':// 添加
                    this.handleEdit()
                    this.title = '添加接口'
                    break
                case 'import':// 导入
                    this.title = '接口导入'
                    this.handleImport()
                    break
                case 'edit':// 编辑
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id)
                        this.title = '编辑接口'
                    }).catch(() => { })
                    break
                case 'detail':// 明细
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id, true, true)
                        this.title = '接口明细'
                    }).catch(() => { })
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    break
                case 'setSubmitLimit':// 设置接口限制
                case 'removeSubmitLimit':// 取消接口限制
                    this.toggleSubmitLimit()
                    break
                default:
                    break
            }
        },
        /**
         * 导入
         */
        handleImport () {
            this.importFormVisible = true
        },
        /**
         * 处理编辑
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
            // 获取数据
            remove({ authAppApiIds: ids }).then(response => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        }
    }
}
</script>
