<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="任务分类"
                category-key="FLOW_TYPE"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <ibps-crud
            ref="crud"
            :style="{ marginLeft: width+'px' }"
            :height="height"
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
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @column-link-click="handleLinkClick"
            @pagination-change="handlePaginationChange"
        />
        <bpmn-formrender
            :visible="dialogFormVisible"
            :instance-id="instanceId"
            @close="visible => dialogFormVisible = visible"
        />
        <!-- 撤销 -->
        <approve-dialog
            :visible="approveDialogVisible"
            :title="title"
            :task-id="taskId"
            action="revoke"
            @callback="search"
            @close="closeApproveDialog"
        />
        <!-- visible => approveDialogVisible = visible -->
    </ibps-layout>
</template>
<script>
import { revokable } from '@/api/platform/office/bpmReceived'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'

export default {
    components: {
        ApproveDialog
    },
    mixins: [FixHeight, CommonData],
    data () {
        return {
            approveDialogVisible: false,
            title: '',
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^subject_^SL', name: 'Q^wfInst.subject_^SL', label: '请求标题' },
                        { prop: 'Q^proc_def_name_^SL', name: 'Q^wfInst.proc_def_name_^SL', label: '流程名称' },
                        {
                            prop: ['Q^end_time_^DL', 'Q^end_time_^DG'],
                            name: ['Q^ec.end_time_^DL', 'Q^ec.end_time_^DG'],
                            label: '审批时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'subject', label: '请求标题', link: 'dialog' },
                    { prop: 'procDefName', label: '流程名称', width: 120 },
                    { prop: 'myNode', label: '我审批得节点', width: 120 },
                    { prop: 'taskEndTime', label: '审批时间', width: 140, dateFormat: 'yyyy-MM-dd HH:mm:ss' },
                    { prop: 'curNode', label: '当前审批节点', width: 120 }
                ],
                // 管理列
                rowHandle: {
                    actions: [
                        {
                            key: 'revoke',
                            label: '撤销',
                            icon: 'ibps-icon-send'
                        }
                    ]
                }
            }
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        /**
         * 加载数据
         */
        loadData () {
            this.loading = true
            revokable(this.getFormatParams()).then(response => {
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
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
                case 'revoke':
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.title = '撤销任务'
                        this.handleRevoke(data.taskId)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        /**
         * 撤销
         */
        handleRevoke (id = '') {
            this.taskId = id
            this.approveDialogVisible = true
        },
        closeApproveDialog () {
            this.approveDialogVisible = false
        }
    }
}
</script>
