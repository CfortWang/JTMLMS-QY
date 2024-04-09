<template>
    <ibps-layout ref="layout">
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
</template>
<script>
import { handledTask } from '@/api/platform/office/bpmReceived'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'
import { actionOptions, statusOptions } from '@/business/platform/bpmn/constants'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^SUBJECT_^SL', label: '事务名称', itemWidth: 150 },
                        { prop: 'Q^STATUS_^S',
                            name: 'Q^APO.STATUS_^S',
                            label: '状态',
                            itemWidth: 150,
                            labelWidth: 70,
                            fieldType: 'select',
                            options: statusOptions
                        },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            label: '处理时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'subject', label: '事务名称', link: 'dialog', width: 450 },
                    { prop: 'curNode', label: '事务类型', width: 100 },
                    { prop: 'status', label: '运行 / 结束', tags: statusOptions, width: 100 },
                    { prop: 'createTime', label: '提交时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', width: 140 }
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
                default:
                    break
            }
        }
    }
}
</script>
