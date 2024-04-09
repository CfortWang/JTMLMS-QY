<template>
    <div>
        <ibps-layout ref="layout">
            <div slot="west">
                <ibps-type-tree
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
                @action-event="handleAction"
                @sort-change="handleSortChange"
                @column-link-click="handleLinkClick"
                @pagination-change="handlePaginationChange"
            />
            <bpmn-formrender
                :visible="dialogFormVisible"
                :instance-id="instanceId"
                @callback="search"
                @close="visible => dialogFormVisible = visible"
            />
        </ibps-layout>

        <!-- 卡片模式 -->
        <!-- <ibps-layout ref="layout">
            <div slot="west">
                <ibps-type-tree
                    :width="width"
                    :height="height"
                    title="流程分类"
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
                    <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">已办</p>
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
        </ibps-layout> -->
    </div>
</template>
<script>
import { handledTask } from '@/api/platform/office/bpmReceived'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'
import { actionOptions } from '@/business/platform/bpmn/constants'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '我的办结',
            statusOptions: [],
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^SUBJECT_^SL', label: '任务名称', itemWidth: 200 },
                        { prop: 'Q^TASK_NAME_^SL', label: '事务名称', itemWidth: 200 },
                        { prop: 'Q^STATUS_^S',
                            name: 'Q^APO.STATUS_^S',
                            label: '状态',
                            itemWidth: 200,
                            labelWidth: 70,
                            fieldType: 'select',
                            options: actionOptions
                        },
                        {
                            prop: ['Q^COMPLETE_TIME_^DL', 'Q^COMPLETE_TIME_^DG'],
                            label: '处理时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'subject', label: '已办任务名称', link: 'dialog', width: 350 },
                    { prop: 'taskName', label: '已办事务名称', width: 180 },
                    { prop: 'status', label: '处理方式', tags: actionOptions, width: 150 },
                    { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', width: 180 },
                    { prop: 'completeTime', label: '处理时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', width: 180 }
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
            handledTask(this.getFormatParams()).then(response => {
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
                case 'add':// 添加
                    this.handleEdit()
                    break
                case 'edit':// 编辑
                    this.handleEdit(data)
                    break
                default:
                    break
            }
        },
        /**
         * 编辑
         */
        handleEdit (data) {
            this.instanceId = data.procInstId || ''
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
