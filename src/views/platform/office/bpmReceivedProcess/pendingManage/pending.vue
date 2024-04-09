<template>
    <div>
        <ibps-layout ref="layout">
            <div slot="west">
                <ibps-type-tree
                    ref="typeTree"
                    :width="width"
                    :height="height"
                    title="任务分类"
                    category-key="FLOW_TYPE"
                    :has-permission="true"
                    @node-click="handleNodeClick"
                    @expand-collapse="handleExpandCollapse"
                />
            </div>
            <ibps-crud
                ref="crud"
                :height="height"
                :style="{ marginLeft: width + 'px' }"
                :data="listData"
                :toolbars="listConfig.toolbars"
                :search-form="listConfig.searchForm"
                :pk-key="pkKey"
                :columns="listConfig.columns"
                :row-handle="listConfig.rowHandle"
                :pagination="pagination"
                :loading="loading"
                :selection-row="false"
                :index-row="false"
                :display-field="title"
                @action-event="handleAction"
                @sort-change="handleSortChange"
                @column-link-click="handleLinkClick"
                @pagination-change="handlePaginationChange"
            >
                <template slot="createDept" slot-scope="scope">
                    <span class="wrap">{{ getTransformData(scope.row.createDept, 'deptList', 'positionId', 'positionName') }}</span>
                </template>
            </ibps-crud>
            <!-- <ibps-card-list
                ref="crud"
                :title="title"
                :height="height"
                :data="listData"
                :pagination="pagination"
                :pk-key="pkKey"
                :toolbars="listConfig.toolbars"
                :search-form="listConfig.searchForm"
                :columns="listConfig.columns"
                :loading="loading"
                :index-row="false"
                @action-event="handleAction"
                @sort-change="handleSortChange"
                @pagination-change="handlePaginationChange"
            >
                <template slot="procDefIdSelect">
                    <bpm-definition-selector
                        v-model="procDefIdSelect"
                        style="width:200px;display:block;"
                        value-key="defKey"
                        is-super
                        :multiple="false"
                        @input="getProcDefId"
                        @callback="data => formId= data.id"
                    />
                </template>
                <template slot="item-symbol">
                    <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">待办</p>
                </template>

                <template slot="item-detail-createTime">
                    <span />
                </template>
                <template slot="item-detail-taskName">
                    <span />
                </template>
                <template slot="item-detail-completeTime">
                    <span />
                </template>
                <template slot="item-detail-curNode">
                    <span />
                </template>
                <template slot="item-detail-status">
                    <span />
                </template>
            </ibps-card-list> -->

            <bpmn-formrender
                :visible="dialogFormVisible"
                :task-id="taskId"
                @callback="search"
                @close="visible => dialogFormVisible = visible"
            />
            <delegate
                :task-id="taskId"
                :title="title"
                :visible="delegateVisible"
                @callback="search"
                @close="visible => delegateVisible = visible"
            />
            <approve-dialog
                :visible="approveDialogVisible"
                :title="title"
                :task-id="taskId"
                :action="action"
                @callback="search"
                @close="visible => approveDialogVisible = visible"
            />
        </ibps-layout>
    </div>
</template>
<script>
import TreeUtils from '@/utils/tree'
import FixHeight from '@/mixins/height'
import CommonData from '../../mixin/utils'
import { pending } from '@/api/platform/office/bpmReceived'
import { batchSuspendProcess, batchRecoverProcess } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from '@/utils/action'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import Delegate from '@/business/platform/bpmn/task-change/edit'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'

export default {
    components: {
        // Detail,
        BpmDefinitionSelector,
        Delegate,
        ApproveDialog
    },
    mixins: [FixHeight, CommonData],
    props: {
        id: String
    },
    data () {
        const statusOptions = [
            { key: '未超时', value: '未超时', type: 'primary' },
            { key: '即将超时', value: '即将超时', type: 'warning' },
            { key: '已超时', value: '已超时', type: 'danger' }
        ]
        return {
            title: '我的待办',
            approveDialogVisible: false, // 批量审批
            delegateVisible: false,
            action: '',
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    // {
                    //     key: 'agree',
                    //     label: '提交/通过',
                    //     icon: 'ibps-icon-check-square-o'
                    // },
                    // {
                    //     key: 'stop',
                    //     label: '终止',
                    //     icon: 'ibps-icon-ioxhost'
                    // },
                    // {
                    //     key: 'suspend',
                    //     label: '挂起',
                    //     icon: 'ibps-icon-ioxhost '
                    // },
                    // {
                    //     key: 'recover',
                    //     label: '恢复',
                    //     icon: 'ibps-icon-ioxhost '
                    // }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^proc_def_name_^SL', name: 'Q^temp.proc_def_name_^SL', label: '事务名称' },
                        { prop: 'Q^subject_^SL', name: 'Q^temp.subject_^SL', label: '事务说明' },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            name: ['Q^temp.create_time_^DL', 'Q^temp.create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '事务名称', link: 'dialog', width: 200 },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'name', label: '当前节点', width: 120 },
                    { prop: 'expired', label: '办理情况', tags: statusOptions, width: 100 },
                    { prop: 'ownerName', label: '发起人', width: 90 },
                    { prop: 'createDept', label: '发起部门', width: 90, slotName: 'createDept' },
                    { prop: 'createTime', label: '创建时间', width: 150, sortable: true }
                ]
            },
            procDefIdSelect: ''
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        getProcDefId (data) {
            this.procDefIdSelect = data
        },
        /**
         * 加载数据
         */
        loadData () {
            this.loading = true
            pending(this.getFormatParams()).then(response => {
                const { data } = response || {}
                data.dataResult.forEach((item, i) => {
                    item.createDept = this.getTaskInfo(item.subject)
                    item.subject = this.getTaskDesc(item.subject)
                })
                ActionUtils.handleListData(this, data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getFormatParams () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (this.$utils.isNotEmpty(this.procDefIdSelect)) {
                params['Q^temp.proc_def_key_^S'] = this.procDefIdSelect
            }
            let res = {}
            if (params.hasOwnProperty('Q^temp.proc_def_name_^SL')) {
                const temp = params['Q^temp.proc_def_name_^SL']
                delete params['Q^temp.proc_def_name_^SL']
                res = ActionUtils.formatParams(params, this.pagination, this.sorts)
                res.customs = {
                    procDefName: temp
                }
            } else {
                res = ActionUtils.formatParams(params, this.pagination, this.sorts)
            }
            return res
        },
        /**
         * 点击表格
         */
        handleLinkClick (data, columns) {
            this.taskId = data.taskId || ''
            this.dialogFormVisible = true
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
                    break
                case 'edit':// 编辑
                    this.handleEdit(selection)
                    break
                case 'stop': // 反对
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleBatchApprove(ids, 'stop')
                        this.title = '批量终止流程'
                    }).catch(() => { })
                    break
                case 'agree': // 同意
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleBatchApprove(ids, 'agree')
                        this.title = '批量同意审批'
                    }).catch(() => { })
                    break
                case 'suspend': // 挂起
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleSuspend(ids)
                    }).catch(() => { })
                    break
                case 'recover': // 恢复
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleRecover(ids)
                    }).catch(() => { })
                    break
                case 'delegate': // 转办
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.title = '任务转办'
                        this.handleDelegate(id)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        /**
         * 编辑
         */
        handleEdit (id) {
            this.taskId = id
            this.dialogFormVisible = true
        },
        handleNodeClick (typeId) {
            this.typeId = typeId
            this.loadData()
        },
        /**
         * 处理批量审批
         */
        handleBatchApprove (id = '', action = 'agree') {
            this.taskId = id
            this.action = action
            this.approveDialogVisible = true
        },
        /**
         * 批量挂起任务
         */
        handleSuspend (ids) {
            this.$confirm('确认批量挂起流程任务？', '信息').then(() => {
                batchSuspendProcess({ taskIds: ids }).then(() => {
                    ActionUtils.successMessage('挂起流程任务成功')
                    this.search()
                }).catch(err => {
                    console.error(err)
                })
            })
        },
        /**
         * 批量恢复任务
         */
        handleRecover (ids) {
            this.$confirm('确认批量恢复流程任务？', '信息').then(() => {
                batchRecoverProcess({ taskIds: ids }).then(() => {
                    ActionUtils.successMessage('恢复流程任务成功')
                    this.search()
                }).catch(err => {
                    console.error(err)
                })
            })
        },
        handleDelegate (id) {
            this.taskId = id
            this.delegateVisible = true
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 230 : 30
        }
    }
}
</script>
<style lang="scss" scoped >
    .padding-page{
        .container-component{
            margin-left:0 !important;
        }
    }
    // .org-tree-move-node-dialog{
    //     .el-dialog__body{
    //         height:  calc(50vh - 95px) !important;
    //     }
    // }
    .page .ibps-container-full__body {
        padding: 0 0 10px 0!important;
    }
    .ibps-card-list-containe .ibps-card-list {
        padding-top: 10px!important;
    }
</style>
