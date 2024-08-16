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
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick"
        >
            1
        </ibps-crud>
        <schedule-config
            v-if="showConfigDialog"
            :visible.sync="showConfigDialog"
            :params="params"
            :readonly="readonly"
            @refresh="loadData"
            @close="() => showConfigDialog = false"
        />
    </div>
</template>

<script>
import { querySchedule } from '@/api/business/schedule'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
    components: {
        ScheduleConfig: () => import('./components/config')
    },
    mixins: [FixHeight],
    data () {
        const { userList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userOption,
            title: '排班记录',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            showConfigDialog: false,
            readonly: false,
            params: {},
            targetOption: [],
            methodOption: [],
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary', hidden: false },
                    { key: 'create', icon: 'ibps-icon-plus', label: '创建', type: 'success', hidden: false },
                    { key: 'remove', icon: 'ibps-icon-close', label: '删除', type: 'danger', hidden: false },
                    { key: 'config', icon: 'ibps-icon-cogs', label: '配置', type: 'info', hidden: false }
                ],
                searchForm: {
                    labelWidth: 80,
                    itemWidth: 150,
                    forms: [
                        // { prop: 'Q^name_^SL', label: '性能指标', fieldType: 'select', options: this.targetOption },
                        // { prop: 'Q^fang_an_lei_xing_^SL', label: '方案类型', fieldType: 'select', options: this.methodOption },
                        { prop: 'Q^title_^SL', label: '排班名称' },
                        { prop: 'Q^scope_^SL', label: '使用范围' },
                        { prop: 'Q^cycle_^SL', label: '排班周期' },
                        { prop: 'Q^status_^SL', label: '状态' },
                        { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'daterange', itemWidth: 200 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'title', label: '排班名称', tags: [], minWidth: 150 },
                    { prop: 'scope', label: '使用范围', tags: [], width: 120 },
                    { prop: 'cycle', label: '排班周期', width: 120 },
                    { prop: 'dateRange', label: '时间范围', slotName: 'time', width: 140 },
                    { prop: 'status', label: '状态', width: 80 },
                    { prop: 'createBy', label: '创建人', tags: userOption, width: 90 },
                    { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 130 }
                ],
                rowHandle: {
                    effect: 'display',
                    actions: [
                        { key: 'edit', label: '编辑', type: 'primary', icon: 'ibps-icon-edit' },
                        { key: 'preview', label: '查看', type: 'primary', icon: 'ibps-icon-eye' }
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
            querySchedule(this.getSearchFormData()).then(res => {
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
            return ActionUtils.formatParams(
                this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
                this.pagination,
                this.sorts
            )
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
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'create':
                    this.handleEdit(data, command)
                    break
                case 'config':
                    this.showConfigDialog = true
                    break
                case 'edit':
                    this.handleEdit(data, command)
                    break
                case 'preview':
                    this.handlePreview(data)
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
        async handleEdit ({ id, zhiBiaoId, fangFaId, fangFaKey }, key) {
            this.params = {
                targetId: zhiBiaoId,
                methodId: fangFaId,
                methodKey: fangFaKey,
                recordId: id
            }
            this.readonly = key === 'detail'
            // this.showConfigDialog = true
        },
        handleReport (data) {
            console.log('wwww')
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            // return this.$message.warning('避免误删测试数据，联系开发删除')
            // removeExperimental({ ids }).then(() => {
            //     ActionUtils.removeSuccessMessage()
            //     this.search()
            // }).catch(() => {})
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
