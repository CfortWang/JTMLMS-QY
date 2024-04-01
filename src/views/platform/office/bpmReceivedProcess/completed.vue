<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="事务分类"
                category-key="FLOW_TYPE"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
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
            :selection-row="false"
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
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :instance-id="instanceId"
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
                    <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">办结</p>
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
                @callback="search"
                @close="visible => dialogFormVisible = visible"
            />
        </ibps-layout>
    </div> -->
</template>
<script>
import { handled } from '@/api/platform/office/bpmReceived'
import { statusOptions, status } from '@/business/platform/bpmn/constants'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '办结事务',
            statusOptions,
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^proc_def_name_^SL', name: 'Q^inst.proc_def_name_^SL', label: '事务名称', itemWidth: 200 },
                        { prop: 'Q^subject_^SL', name: 'Q^inst.subject_^SL', label: '事务说明', itemWidth: 200 },
                        { prop: 'Q^status_^S',
                            name: 'Q^inst.status_^S',
                            label: '状态',
                            itemWidth: 200,
                            labelWidth: 70,
                            fieldType: 'select',
                            options: status
                        },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            name: ['Q^inst.create_time_^DL', 'Q^inst.create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '事务名称', width: 200, link: 'dialog' },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'createDept', label: '发起部门', width: 100, slotName: 'createDept' },
                    { prop: 'createBy', label: '发起人', width: 80, slotName: 'createBy' },
                    { prop: 'updateBy', label: '提交人', width: 80, slotName: 'updateBy' },
                    { prop: 'createTime', label: '创建时间', width: 150, sortable: true },
                    { prop: 'status', label: '事务状态', tags: statusOptions, width: 100 }
                ]
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
            handled(this.getFormatParams({ 'Q^status_^NE': 'running' })).then(response => {
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .ibps-layout .container-component {
        position: absolute;
        top: 0px;
        right: 0;
        bottom: 0px;
        left: 220px!important;
    }
    .ibps-card-list-container .ibps-card-list--picture-card {
        display: block;
    }
</style>
