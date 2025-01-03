<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="true"
        append-to-body
        class="dialog schedule-config-list"
        top="5vh"
        width="60%"
        @open="loadData"
        @close="closeDialog"
    >
        <ibps-crud
            ref="crud"
            :display-field="title"
            :height="maxHeight"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :index-row="false"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            :pagination="pagination"
            :loading="loading"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick"
        >
            <template slot="isEffective" slot-scope="scope">
                <el-switch
                    v-model="scope.row.isEffective"
                    active-value="Y"
                    inactive-value="N"
                    @change="handleEffective(scope.row)"
                />
            </template>
        </ibps-crud>
        <schedule-config-detail
            v-if="showConfigDetail"
            :visible.sync="showConfigDetail"
            :params="params"
            :readonly="readonly"
            @refresh="loadData"
            @close="() => showConfigDetail = false"
        />
    </el-dialog>
</template>

<script>
import { queryScheduleConfig, removeScheduleConfig, saveScheduleConfig } from '@/api/business/schedule'
import { scheduleType } from '@/views/constants/schedule'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
    components: {
        ScheduleConfigDetail: () => import('./config')
    },
    mixins: [FixHeight],
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userOption,
            scheduleType,
            title: '排班配置项',
            dialogVisible: this.visible,
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            maxHeight: 600,
            listData: [],
            pagination: {},
            sorts: {},
            showConfigDetail: false,
            readonly: false,
            params: {},
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary', hidden: false },
                    { key: 'create', icon: 'ibps-icon-plus', label: '添加', type: 'success', hidden: false },
                    { key: 'remove', icon: 'ibps-icon-close', label: '删除', type: 'danger', hidden: false }
                ],
                searchForm: {
                    labelWidth: 80,
                    itemWidth: 150,
                    forms: [
                        { prop: 'Q^name_^SL', label: '配置名称' },
                        { prop: 'Q^schedule_type_^SL', label: '排班类型', fieldType: 'select', options: scheduleType },
                        { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'daterange', itemWidth: 200 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'name', label: '配置名称', width: 150 },
                    { prop: 'scheduleType', label: '排班类型', tags: scheduleType, width: 100, sortable: 'custom' },
                    { prop: 'isEffective', label: '是否生效', slotName: 'isEffective', width: 85, align: 'center' },
                    { prop: 'approver', label: '调班审批人', tags: userOption, dataType: 'stringArray', minWidth: 140 },
                    { prop: 'createBy', label: '创建人', tags: userOption, width: 90 },
                    { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 120 }
                ],
                rowHandle: {
                    effect: 'display',
                    actions: [
                        { key: 'copy', label: '复制', type: 'primary', icon: 'ibps-icon-copy' },
                        { key: 'edit', label: '编辑', type: 'primary', icon: 'ibps-icon-edit' }
                        // { key: 'detail', label: '详情', type: 'primary', icon: 'ibps-icon-list-alt' }
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
            queryScheduleConfig(this.getSearchFormData()).then(res => {
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
            console.log(this.pagination)
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
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'create':
                    this.handleEdit({}, command)
                    break
                case 'copy':
                    this.handleEdit(data, command)
                    break
                case 'edit':
                    this.handleEdit(data, command)
                    break
                case 'detail':
                    this.handleEdit(data, command)
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
        async handleEdit (data, key) {
            this.params = {
                configId: data.id,
                action: key
            }
            this.readonly = key === 'detail'
            this.showConfigDetail = true
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            // return this.$message.warning('避免误删测试数据，联系开发删除')
            removeScheduleConfig({ ids }).then(() => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        },
        handleRowDblclick (row) {
            this.handleEdit(row, 'detail')
        },
        handleEffective (row) {
            const { id, isEffective, name } = row
            console.log(isEffective)
            this.$confirm(`确定要${isEffective ? '启用' : '禁用'}配置项【${name}】吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                closeOnClickModal: false,
                type: 'warning'
            }).then(() => {
                saveScheduleConfig({
                    ...row,
                    id,
                    pk: id,
                    isEffective
                }).then(() => {
                    ActionUtils.success('操作成功')
                    this.search()
                }).catch(() => {})
            }).catch(() => {
                this.search()
            })
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss">
    .schedule-config-list {

    }
</style>
