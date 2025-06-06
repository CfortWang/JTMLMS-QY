<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            :display-field="title"
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
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick"
        >
            <template slot="dateRange" slot-scope="scope">
                <span>{{ `${scope.row.startDate} 至 ${scope.row.endDate}` }}</span>
            </template>
        </ibps-crud>
        <schedule-edit
            v-if="showScheduleEdit"
            :visible.sync="showScheduleEdit"
            :page-params="params"
            :readonly="readonly"
            @refresh="loadData"
            @close="() => {showScheduleEdit = false;this.search()}"
        />
        <schedule-config-list
            v-if="showConfigList"
            :visible.sync="showConfigList"
            @refresh="loadData"
            @close="() => showConfigList = false"
        />
        <adjust-edit
            v-if="showAdjustEdit"
            :visible.sync="showAdjustEdit"
            :params="params"
            @refresh="loadData"
            @close="() => showAdjustEdit = false"
        />
    </div>
</template>

<script>
import { queryStaffSchedule, removeStaffSchedule, queryScheduleConfig } from '@/api/business/schedule'
import { scheduleType } from '@/views/constants/schedule'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
    components: {
        ScheduleEdit: () => import('./edit'),
        ScheduleConfigList: () => import('./components/config-list'),
        AdjustEdit: () => import('./components/adjust-edit')
    },
    mixins: [FixHeight],
    data () {
        const { userList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userOption,
            scheduleType,
            title: '排班记录',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            showScheduleEdit: false,
            showConfigList: false,
            showAdjustEdit: false,
            readonly: false,
            params: {},
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary', hidden: false },
                    { key: 'create', icon: 'ibps-icon-plus', label: '创建', type: 'success', hidden: !this.isRoleFilter() && !this.isZhsfzr() },
                    { key: 'remove', icon: 'ibps-icon-close', label: '删除', type: 'danger', hidden: !this.isRoleFilter() && !this.isZhsfzr() },
                    { key: 'config', icon: 'ibps-icon-cogs', label: '配置', type: 'info', hidden: !this.isRoleFilter() && !this.isZhsfzr() }
                ],
                searchForm: {
                    labelWidth: 80,
                    itemWidth: 180,
                    forms: [
                        { prop: 'Q^title_^SL', label: '排班名称' },
                        { prop: 'Q^type_^S', label: '排班类型', fieldType: 'select', options: scheduleType, multiple: 'N' },
                        { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'daterange', itemWidth: 200 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'title', label: '排班名称', minWidth: 150 },
                    { prop: 'type', label: '排班类型', tags: scheduleType, width: 120 },
                    { prop: 'dateRange', label: '排班时间范围', slotName: 'dateRange', width: 180 },
                    { prop: 'createBy', label: '创建人', tags: userOption, width: 100 },
                    { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 140 },
                    { prop: 'status', label: '状态', width: 120 }
                ],
                rowHandle: {
                    effect: 'display',
                    actions: [
                        // { key: 'adjust', label: '申请调班', type: 'primary', icon: 'ibps-icon-exchange', hidden: false },
                        { key: 'edit', label: '编辑', type: 'primary', icon: 'ibps-icon-edit', hidden: (row) => {
                            return !this.isRoleFilter() && this.$store.getters.userId !== row.createBy
                        } },
                        { key: 'preview', label: '查阅', type: 'primary', icon: 'ibps-icon-eye', hidden: false }
                        // { key: 'report', label: '实验报告', type: 'success', icon: 'ibps-icon-file-text-o' }
                    ]
                }
            }
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData () {
            this.loading = true
            queryStaffSchedule(this.getSearchFormData()).then(res => {
                ActionUtils.handleListData(this, res.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const { first, second } = this.$store.getters.level || {}
            const searchParam = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            searchParam['Q^di_dian_^S'] = second || first
            return ActionUtils.formatParams(searchParam, this.pagination, this.sorts)
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
         * 判断当前用户是否为超级管理员和高权限角色和专业组组长
         */
        isRoleFilter () {
            const highRoles = this.$store.getters.userInfo.highRoles || [] // 高权限角色
            const userRole = this.$store.getters.userInfo.role || [] // 用户权限角色
            let isHighRole = false
            userRole.forEach(el => {
                const roleAlias = el.alias
                if (highRoles.includes(roleAlias)) {
                    isHighRole = true
                }
                if (roleAlias === 'zhsfzr') {
                    isHighRole = true
                }
            })
            return (this.$store.getters.isSuper || isHighRole)
        },
        isZhsfzr () {
            const userRole = this.$store.getters.userInfo.role || [] // 用户权限角色
            let isZhsfzrRole = false
            userRole.forEach(el => {
                const roleAlias = el.alias
                if (roleAlias === 'zhsfzr') {
                    isZhsfzrRole = true
                }
            })
            return isZhsfzrRole
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'create':
                    this.handleEdit(command, {})
                    break
                case 'config':
                    this.showConfigList = true
                    break
                case 'edit':
                    this.handleEdit(command, data)
                    break
                case 'preview':
                    this.handleEdit(command, data)
                    break
                case 'adjust':
                    this.handleAdjust(command, data)
                    break
                case 'remove':
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => {})
                    break
                default:
                    break
            }
        },
        /**
         * 处理编辑
         */
        async handleEdit (key, { id }) {
            this.params = {
                id
            }
            this.readonly = (key === 'detail' || key === 'preview')
            this.showScheduleEdit = true
        },
        handleAdjust (key, { id }) {
            this.params = {
                scheduleId: id
            }
            this.showAdjustEdit = true
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            // return this.$message.warning('避免误删测试数据，联系开发删除')
            removeStaffSchedule({ ids }).then(() => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        },
        handleRowDblclick (row) {
            this.handleEdit(row, 'detail')
        }
    }
}
</script>
<style lang="scss">
    .attachment-uploader-dialog {
        .el-dialog__body {
            height: calc(57vh - 100px) !important;
        }
    }
</style>
