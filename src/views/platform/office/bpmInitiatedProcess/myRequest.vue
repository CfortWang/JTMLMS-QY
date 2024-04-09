<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="事务分类"
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
            <template slot="createBy" slot-scope="scope">
                <span class="wrap">{{ getTransformData(scope.row.createBy, 'userList', 'userId', 'userName') }}</span>
            </template>
            <template slot="updateBy" slot-scope="scope">
                <span class="wrap">{{ getTransformData(scope.row.updateBy, 'userList', 'userId', 'userName') }}</span>
            </template>
            <template slot="status" slot-scope="scope">
                <el-tag>{{ scope.row.status | optionsFilter(statusOptions,'value','key') }}</el-tag>
            </template>
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :instance-id="instanceId"
            :pro-inst-id="proInstId"
            :def-id="defId"
            :copy-flow="copyFlow"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
    </ibps-layout>
    <!-- <div>
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
            <ibps-card-list
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
                <template slot="item-symbol">
                    <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">启动</p>
                </template>

                <template slot="item-detail-name">
                    <span />
                </template>
                <template slot="item-detail-partyTypeName">
                    <span />
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

            </ibps-card-list>
            <bpmn-formrender
                :visible="dialogFormVisible"
                :instance-id="instanceId"
                :pro-inst-id="proInstId"
                :def-id="defId"
                :copy-flow="copyFlow"
                @callback="search"
                @close="visible => dialogFormVisible = visible"
            />
        </ibps-layout>
    </div> -->
</template>
<script>
import { myRequested } from '@/api/platform/office/bpmInitiated'
import { findProcInstStatus } from '@/api/platform/bpmn/bpmInfo'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '我的发起',
            statusOptions: [],
            copyFlow: false,
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^proc_def_name_^SL', label: '事务名称', labelWidth: 80, itemWidth: 150 },
                        { prop: 'Q^subject_^SL', label: '事务说明', labelWidth: 80, itemWidth: 150 },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange',
                            labelWidth: 80,
                            itemWidth: 200
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '事务名称', width: 200, link: 'dialog' },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'curNode', label: '审批状态', width: 120 },
                    { prop: 'createDept', label: '发起部门', width: 90, slotName: 'createDept' },
                    { prop: 'createBy', label: '发起人', width: 90, slotName: 'createBy' },
                    { prop: 'updateBy', label: '提交人', width: 90, slotName: 'updateBy' },
                    { prop: 'createTime', label: '创建时间', width: 150, sortable: true },
                    { prop: 'status', label: '状态', slotName: 'status', width: 100 }
                ],
                // 管理列
                rowHandle: {
                    effect: 'display',
                    width: '110px',
                    actions: [
                        {
                            key: 'copy',
                            label: '编制查看',
                            icon: 'el-icon-setting'
                        }
                    ]
                }
            }
        }
    },
    created () {
        this.loadData()
        this.findProcInstStatus()
    },
    methods: {
        findProcInstStatus () {
            findProcInstStatus().then(response => {
                this.statusOptions = response.data
            })
        },
        /**
         * 加载数据
         */
        loadData () {
            this.loading = true
            myRequested(this.getFormatParams()).then(response => {
                const { data } = response || {}
                data.dataResult.forEach((item, i) => {
                    item.createDept = this.getTaskInfo(item.subject)
                    item.subject = this.getTaskDesc(item.subject)
                    item.curNode = item.curNode ? `待${item.curNode}` : '已结束'
                })
                ActionUtils.handleListData(this, data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 点击表格
         */
        handleLinkClick (data) {
            this.instanceId = data.id || ''
            this.proInstId = ''
            this.defId = ''
            this.copyFlow = false
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
                case 'copy':// 复制
                    this.handleCopy(data)
                    break
                case 'add':// 添加
                    this.handleEdit()
                    break
                case 'edit':// 编辑
                    this.handleEdit(selection)
                    break
                default:
                    break
            }
        },
        /**
         * 编辑
         */
        handleEdit (id) {
            this.instanceId = id
            this.dialogFormVisible = true
        },
        handleCopy (data) {
            this.instanceId = ''
            this.proInstId = data.id || ''
            this.defId = data.procDefId || ''
            this.copyFlow = true
            this.dialogFormVisible = true
        }
    }
}
</script>
