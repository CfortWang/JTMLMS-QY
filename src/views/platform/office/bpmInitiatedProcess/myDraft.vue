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
            :pagination="pagination"
            :loading="loading"
            :index-row="false"
            :display-field="title"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @column-link-click="handleLinkClick"
            @pagination-change="handlePaginationChange"
        />
        <bpmn-formrender
            :visible="dialogFormVisible"
            :def-id="defId"
            :pro-inst-id="proInstId"
            :title="flowName"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { myDraft, removeDraft } from '@/api/platform/office/bpmInitiated'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '我的暂存',
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    { key: 'remove' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^proc_def_name_^SL', label: '事务名称' },
                        { prop: 'Q^subject_^SL', label: '事务说明' },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '事务名称', width: 200, link: 'dialog' },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'createTime', label: '创建时间', width: 150, sortable: true }
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
            myDraft(this.getFormatParams()).then(response => {
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
         * 点击链接
         */
        handleLinkClick (data, columns) {
            this.flowName = data.name
            this.defId = data.procDefId || ''
            this.proInstId = data.id || ''
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
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            removeDraft({ ids: ids }).then(response => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {

            })
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

