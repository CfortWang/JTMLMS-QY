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
        <!-- :style="{ marginLeft: width+'px' }" -->
        <ibps-crud
            ref="crud"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
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
            <template slot="status" slot-scope="scope">
                <el-tag>{{ scope.row.status | optionsFilter(statusOptions, 'value', 'key') }}</el-tag>
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
                    <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">结束</p>
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
import { myCompleted } from '@/api/platform/office/bpmInitiated'
import { findProcInstStatus } from '@/api/platform/bpmn/bpmInfo'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

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
                        { prop: 'Q^proc_def_name_^SL', label: '表单名称' },
                        { prop: 'Q^subject_^SL', label: '事务说明' },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange'
                        },
                        {
                            prop: ['Q^end_time_^DL', 'Q^end_time_^DG'],
                            label: '结束时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '表单名称', width: 200, link: 'dialog' },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'createTime', label: '创建时间', width: 150, sortable: true },
                    { prop: 'endTime', label: '结束时间', width: 150, sortable: true },
                    { prop: 'status', label: '办结方式', slotName: 'status', width: 120 }
                ]
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
            myCompleted(this.getFormatParams()).then(response => {
                const { data } = response || {}
                data.dataResult.forEach((item, i) => {
                    item.subject = this.getTaskDesc(item.subject)
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
