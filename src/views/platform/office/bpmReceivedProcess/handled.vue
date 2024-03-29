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
        <!-- :style="{ marginLeft: width+'px' }" -->
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
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :instance-id="instanceId"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { handled } from '@/api/platform/office/bpmReceived'
import { statusOptions, endOptions } from '@/business/platform/bpmn/constants'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '我的已办',
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^proc_def_name_^SL', label: '事务名称' },
                        { prop: 'Q^subject_^SL', name: 'Q^inst.subject_^SL', label: '事务说明' },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            name: ['Q^inst.create_time_^DL', 'Q^inst.create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange'
                        },
                        {
                            prop: 'end',
                            label: '是否结束',
                            labelWidth: 100,
                            fieldType: 'select',
                            options: endOptions
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '事务名称', link: 'dialog', width: 200 },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'curNode', label: '审批状态', width: 120 },
                    { prop: 'createDept', label: '发起部门', width: 90, slotName: 'createDept' },
                    { prop: 'createBy', label: '发起人', width: 80, slotName: 'createBy' },
                    { prop: 'updateBy', label: '提交人', width: 80, slotName: 'updateBy' },
                    { prop: 'updateTime', label: '办理时间', width: 150, sortable: true },
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
            handled(this.getFormatParams()).then(response => {
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
         * 获取格式化参数
         */
        getFormatParams () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (this.$utils.isNotEmpty(this.typeId)) {
                params['Q^inst.TYPE_ID_^S'] = this.typeId
            }
            return ActionUtils.formatParams(params, this.pagination, this.sorts)
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
