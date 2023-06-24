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
            @column-link-click="handleLinkClick"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <template slot="headerIcon" slot-scope="scope">
                <span>{{ scope.column.label }}</span>
                <el-tooltip class="item" effect="light" placement="bottom">
                    <div slot="content">
                        此列是查询“流程定义-增加用户设置”的所有用户信息；<br />
                        当为空的时候，可在‘候选范围’知道原因，如：<br />
                        设置用户类型为“某组织负责人”且不抽取，在‘用户管理’模块下未配置相关基础数据时，则在审批运行中此列会为空；<br />
                        此时，可在“候选范围”显示的“某组织负责人”信息快速定位原因！<br />
                    </div>
                    <ibps-icon name="help" style="color: #dd5b44" />
                </el-tooltip>
            </template>
        </ibps-crud>
        <approve-dialog
            :visible="dialogFormVisible"
            :title="title"
            :task-id="editId"
            :action="action"
            class="bpm-task-dialog"
            @callback="search"
            @close="visible => (dialogFormVisible = visible)"
        />
        <!-- 人员选择器 -->
        <ibps-employee-selector-dialog
            :visible="selectorVisible"
            :value="[]"
            multiple
            @close="visible => (selectorVisible = visible)"
            @action-event="handleSelectorActionEvent"
        />

        <bpmn-formrender
            :visible="bpmnFormrenderDialogVisible"
            :task-id="editId"
            :title="flowName"
            @callback="search"
            @close="visible => (bpmnFormrenderDialogVisible = visible)"
        />
    </div>
</template>

<script>
    import { queryPageList, remove, batchSuspendProcess, batchRecoverProcess, assignee } from '@/api/platform/bpmn/bpmTask'
    import ActionUtils from '@/utils/action'
    import FixHeight from '@/mixins/height'
    import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
    //import getFormDataFlag from '@/api/platform/form/common.js'
    import request from '@/utils/request'
    import { FORM_URL } from '@/api/baseUrl'
    import { BUSINESS_BASE_URL } from '@/api/baseUrl'

    export default {
        components: {
            'ibps-employee-selector-dialog': () => import('@/business/platform/org/employee/dialog'),
            'approve-dialog': () => import('@/business/platform/bpmn/form-ext/approve'),
            'bpmn-formrender': () => import('@/business/platform/bpmn/form/dialog')
        },
        mixins: [FixHeight],
        data() {
            return {
                dialogFormVisible: false, // 弹窗
                bpmnFormrenderDialogVisible: false, // 表单
                editId: '', // 编辑dialog需要使用
                action: 'agree', // 打开弹窗的动作
                pkKey: 'id', // 主键  如果主键不是pk需要传主键
                flowName: '',
                selectorVisible: false,
                ids: '',
                title: '',
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
                            key: 'agree',
                            label: '同意',
                            icon: 'ibps-icon-check-square-o'
                        },
                        {
                            key: 'stop',
                            label: '终止',
                            icon: 'ibps-icon-stop'
                        },
                        {
                            key: 'suspend',
                            label: '挂起',
                            icon: 'ibps-icon-ioxhost'
                        },
                        {
                            key: 'recover',
                            label: '恢复',
                            icon: 'ibps-icon-ioxhost'
                        },
                        {
                            key: 'assignee',
                            label: '指定执行人',
                            icon: 'ibps-icon-cog'
                        }
                    ],
                    searchForm: {
                        forms: [
                            {
                                prop: 'Q^subject_^SL',
                                label: '请求标题'
                            },
                            {
                                prop: 'Q^NAME_^SL',
                                label: '当前节点'
                            },
                            {
                                prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
                                label: '创建时间',
                                fieldType: 'daterange'
                            }
                        ]
                    },
                    // 表格字段配置
                    columns: [
                        {
                            prop: 'subject',
                            label: '请求标题',
                            link: 'dialog'
                        },
                        {
                            prop: 'name',
                            label: '当前节点',
                            width: 200
                        },
                        {
                            prop: 'ownerName',
                            label: '候选人',
                            width: 200,
                            headerName: 'headerIcon'
                        },
                        {
                            prop: 'partyTypeName',
                            label: '候选人范围',
                            width: 200
                        },
                        {
                            prop: 'createTime',
                            label: '创建时间',
                            sortable: 'custom',
                            width: 150
                        }
                    ],
                    rowHandle: {
                        actions: [
                            {
                                key: 'assignee',
                                label: '指定执行人',
                                icon: 'ibps-icon-cog'
                            },
                            {
                                key: 'approve',
                                label: '审批',
                                icon: 'ibps-icon-edit'
                            }
                        ]
                    }
                }
            }
        },
        created() {
            this.loadData()
        },
        methods: {
            // 加载数据
            loadData() {
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
            getSearcFormData() {
                return ActionUtils.formatParams(
                    this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
                    this.pagination,
                    this.sorts
                )
            },
            /**
             * 处理分页事件
             */
            handlePaginationChange(page) {
                ActionUtils.setPagination(this.pagination, page)
                this.loadData()
            },
            /**
             * 处理排序
             */
            handleSortChange(sort) {
                ActionUtils.setSorts(this.sorts, sort)
                this.loadData()
            },
            /**
             * 查询
             */
            search() {
                this.loadData()
            },
            /**
             * 处理按钮事件
             */
            handleAction(command, position, selection, data) {
                switch (command) {
                    case 'search': // 查询
                        ActionUtils.setFirstPagination(this.pagination)
                        this.search()
                        break
                    case 'stop': // 终止
                        ActionUtils.selectedMultiRecord(selection).then(ids => {
                            this.handleBatchApprove(ids, 'stop')
                            this.title = '批量终止流程'
                        }).catch(() => {})
                        break
                    case 'agree': // 同意
                        ActionUtils.selectedMultiRecord(selection).then(ids => {
                            this.handleBatchApprove(ids, 'agree')
                            this.title = '批量同意审批'
                        }).catch(() => {})
                        break
                    case 'suspend': // 挂起
                        ActionUtils.selectedMultiRecord(selection).then(ids => {
                            this.handleSuspend(ids)
                        }).catch(() => {})
                        break
                    case 'recover': // 恢复
                        ActionUtils.selectedMultiRecord(selection).then(ids => {
                            this.handleRecover(ids)
                        }).catch(() => {})
                        break
                    case 'assignee': // 指定执行人
                        ActionUtils.selectedMultiRecord(selection).then(ids => {
                            this.handleAssignee(ids)
                        }).catch(() => {})
                        break
                    case 'approve': // 审批
                        ActionUtils.selectedMultiRecord(selection).then(ids => {
                            this.handleApprove(ids)
                        }).catch(() => {})
                        break
                    default:
                        break
                }
            },
            /**
             * 处理审批
             */
            handleBatchApprove(id = '', action = 'agree') {
                this.editId = id
                this.action = action
                this.dialogFormVisible = true
            },
            /**
             * 处理删除
             */
            handleRemove(ids) {
                remove({ levelIds: ids }).then(response => {
                    ActionUtils.removeSuccessMessage()
                    this.search()
                }).catch(() => {})
            },
            /**
             * 批量挂起任务
             */
            handleSuspend(ids) {
                this.$confirm('确认批量挂起流程任务？', '信息').then(() => {
                    batchSuspendProcess({ taskIds: ids }).then(() => {
                        ActionUtils.successMessage('挂起流程任务成功')
                        this.search()
                    }).catch(error => {
                        console.error(error)
                    })
                })
            },
            /**
             * 批量挂起任务
             */
            handleRecover(ids) {
                this.$confirm('确认批量恢复流程任务？', '信息').then(() => {
                    batchRecoverProcess({ taskIds: ids }).then(() => {
                        ActionUtils.successMessage('恢复流程任务成功')
                        this.search()
                    }).catch(error => {
                        console.error(error)
                    })
                })
            },
            /**
             * 指定执行人
             */
            handleAssignee(ids) {
                this.ids = ids
                this.selectorVisible = true
            },
            handleSelectorActionEvent(buttonKey, data) {
                switch (buttonKey) {
                    case 'confirm': // 确定
                        this.handleConfirm(data)
                        break
                }
            },
            handleConfirm(data) {
                assignee({
                    taskId: this.ids,
                    userId: data.map(d => { return d.id }).join(',')
                }).then(response => {
                    this.selectorVisible = false
                    ActionUtils.success('指定执行人成功!')
                    this.search()
                })
            },
            /**
             * 审批
             */
            handleApprove(id) {
                // this_.editId = id
                // this_.bpmnFormrenderDialogVisible = true
                // return

                // getFormDataFlag(JSON.stringify({taskId:id})).then(response => {
                //     console.log("111")
                //     if( response.data.data=='Y'){
                //         this_.editId = id
                //         this_.bpmnFormrenderDialogVisible = true
                //     }else{
                //         ActionUtils.success('任务生成中、请稍后重试...!')
                //         this_.search()
                //     }
                // })

                // 打开表单前获取flowName和processName，避免流程节点状态bug
                let selected = this.listData.find(item => item.id === id)
                this.flowName = selected.name
                request({
                    url: BUSINESS_BASE_URL() + '/getFormData/flag',
                    method: 'post',
                    data: JSON.stringify({ taskId: id })
                }).then(response => {
                    if (response.data != 'N') {
                        this.editId = id
                        this.bpmnFormrenderDialogVisible = true
                    } else {
                        ActionUtils.success('任务生成中、请稍后重试...!')
                        this.search()
                    }
                })

                // let sql = "select ID_,HOT_READ_ from ibps_bpm_tasks where TASK_ID_='"+id+"'"
                // curdPost('sql',sql).then(response => {
                //     if( response.variables.data.length>0){
                //         if( response.variables.data[0].HOT_READ_=='1'){
                //             this_.editId = id
                //             this_.bpmnFormrenderDialogVisible = true
                //         } else {
                //             ActionUtils.success('任务生成中、请稍后重试...!')
                //             this_.search()
                //         }
                //     } else {
                //         ActionUtils.success('任务状态已过期、请刷新页面...!')
                //         this_.search()
                //     }
                // })
            },
            handleLinkClick(data, columns) {
                this.flowName = data.name
                this.handleApprove(data[this.pkKey])
            }
        }
    }
</script>
<style lang="scss">
    // .bpm-task-dialog {
    //     .el-dialog__body {
    //         height: calc(27vh - 120px) !important;
    //     }
    // }
    // .bpm-employee-dialog {
    //     .el-dialog__body {
    //         height: calc(67vh - 140px) !important;
    //     }
    // }
</style>
