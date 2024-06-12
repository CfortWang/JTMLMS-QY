<template>
    <ibps-layout ref="layout" class="pendingManage-module">
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
            :pagination="pagination"
            :loading="loading"
            :index-row="false"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @column-link-click="handleLinkClick"
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
            <template slot="ownerName" slot-scope="scope">
                <div class="ibps-field-text">{{ scope.value }}</div>
            </template>
            <template slot="subject" slot-scope="scope">
                <el-badge v-if="scope.row.remindTimes>0" :value="scope.row.remindTimes" class="item">
                    <el-link type="primary" :underline="false" @click="handleLinkClick(scope.row)">
                        {{ scope.row.subject }}
                    </el-link>
                </el-badge>
                <el-link v-else type="primary" :underline="false" @click="handleLinkClick(scope.row)">
                    {{ scope.row.subject }}
                </el-link>
            </template>
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :task-id="taskId"
            :wai-jian="waiJian"
            :title="flowName"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
        <!-- 转办 -->
        <delegate
            :task-id="taskId"
            :title="title"
            :visible="delegateVisible"
            @callback="search"
            @close="visible => delegateVisible = visible"
        />
        <!-- 批量审批 -->
        <approve-dialog
            :visible="approveDialogVisible"
            :title="title"
            :task-id="taskId"
            :action="action"
            @callback="search"
            @close="visible => approveDialogVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { pending4Assignee } from '@/api/platform/office/bpmReceived'
import { batchSuspendProcess, batchRecoverProcess } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../../mixin/utils'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import Delegate from '@/business/platform/bpmn/task-change/edit'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'

export default {
    components: {
        BpmDefinitionSelector,
        Delegate,
        ApproveDialog
    },
    mixins: [FixHeight, CommonData],
    data () {
        return {
            approveDialogVisible: false, // 批量审批
            delegateVisible: false,
            action: '',
            title: '',
            waiJian: '',
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    {
                        key: 'agree',
                        label: '同意',
                        icon: 'ibps-icon-check-square-o'
                    },
                    {
                        key: 'stop',
                        label: '终止',
                        icon: 'ibps-icon-ioxhost'
                    },
                    {
                        key: 'suspend',
                        label: '挂起',
                        icon: 'ibps-icon-ioxhost '
                    },
                    {
                        key: 'recover',
                        label: '恢复',
                        icon: 'ibps-icon-ioxhost '
                    }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^subject_^SL', name: 'Q^temp.subject_^SL', label: '请求标题', link: 'dialog', labelWidth: 80, itemWidth: 200 },
                        // { prop: 'Q^creatorId^S',  label: '创建人', labelWidth: 80, itemWidth: 200, fieldType: 'slot', slotName: 'searchFormCreator' },
                        { prop: 'Q^proc_def_key_^S', name: 'Q^temp.proc_def_key_^S', label: '流程名称', fieldType: 'slot', slotName: 'procDefIdSelect', labelWidth: 80, itemWidth: 200 },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            name: ['Q^temp.create_time_^DL', 'Q^temp.create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange',
                            labelWidth: 80
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'subject', label: '请求标题', slotName: 'subject' },
                    { prop: 'procDefName', label: '流程名称', width: 120 },
                    { prop: 'name', label: '当前节点', width: 120 },
                    { prop: 'createTime', label: '创建时间', width: 140 },
                    { prop: 'ownerName', label: '所属人', width: 300 }
                ]
            },
            procDefIdSelect: ''
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        removeDesc (str) {
            const parts = str.split('#')
            if (parts.length > 2) {
                return parts.slice(0, 2).join('#') + '#'
            } else {
                return str
            }
        },
        getProcDefId (data) {
            this.procDefIdSelect = data
        },
        /**
         * 加载数据
         */
        loadData () {
            this.loading = true
            const params = {}
            if (this.$utils.isNotEmpty(this.procDefIdSelect)) {
                params['Q^temp.proc_def_key_^S'] = this.procDefIdSelect
            }
            pending4Assignee(this.getFormatParams(params)).then(response => {
                const { dataResult = [] } = response.data || {}
                dataResult.forEach(i => {
                    i.subject = this.removeDesc(i.subject)
                })
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
                case 'stop': // 终止
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
        /**
         * 点击表格
         */
        handleLinkClick (data) {
            this.taskId = data.taskId || ''
            this.waiJian = data.waiJian || ''
            this.flowName = data.name || ''
            this.dialogFormVisible = true
        },
        handleDelegate (id) {
            this.taskId = id
            this.delegateVisible = true
        }
    }
}
</script>
<style lang="scss">
    .pendingManage-module{
        .cell{
            overflow:initial !important;
        }
        .el-badge{
            margin:10px 0 0 10px;
        }
        .el-badge__content.is-fixed{
            top: 0;
            left: -40px;
            right: auto;
        }
    }
</style>
