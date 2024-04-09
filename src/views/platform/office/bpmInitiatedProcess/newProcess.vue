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
        >
            <template slot="favoritesIcon" slot-scope="scope">
                <el-tooltip v-if="scope.row.favorites" class="item" effect="dark" content="已收藏" placement="bottom">
                    <i class="ibps-icon-star" style="margin-left:7px;" @click="handleTips(scope.row.favorites,scope.row.id)" />
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="未收藏" placement="bottom">
                    <i class="ibps-icon-star-o" style="margin-left:7px;" @click="handleTips(scope.row.favorites,scope.row.id)" />
                </el-tooltip>
            </template>
            <template slot="statusCloum" slot-scope="scope">
                <el-tag>{{ scope.row.status|optionsFilter(statusOptions,'value','key') }}</el-tag>
            </template>
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :def-id="defId"
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
                :def-id="defId"
                @callback="search"
                @close="visible => dialogFormVisible = visible"
            />
        </ibps-layout>
    </div> -->
</template>
<script>
import { newProcess, saveFavorites, removeFavorites } from '@/api/platform/office/bpmInitiated'
import { findBpmDefinitionState } from '@/api/platform/bpmn/bpmInfo'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '新建流程',
            statusOptions: [],
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    {
                        key: 'saveFavorites',
                        label: '收藏',
                        icon: 'ibps-icon-star'
                    }, {
                        key: 'removeFavorites',
                        label: '取消',
                        icon: 'ibps-icon-star-o'
                    }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^name_^SL', label: '流程名称' }
                    ]
                },
                // 表格字段配置.
                columns: [
                    { prop: 'favorites', label: '收藏', slotName: 'favoritesIcon', width: '60' },
                    { prop: 'name', label: '流程名称', link: 'dialog' },
                    // { prop: 'createTime', label: '创建时间', width: 140 },
                    { prop: 'typeName', label: '所属分类', width: 180 },
                    { prop: 'status', label: '状态', slotName: 'statusCloum', width: 150 },
                    { prop: 'version', label: '版本号', width: 80 }
                ]
            }
        }
    },
    created () {
        this.loadData()
        this.findBpmDefinitionState()
    },
    methods: {
        findBpmDefinitionState () {
            findBpmDefinitionState().then(response => {
                this.statusOptions = response.data
            })
        },
        handleTips (favorites, id) {
            if (favorites) {
                this.tips('removeFavorites', '确认取消流程收藏吗？', id)
            } else {
                this.tips('saveFavorites', '确认流程收藏吗？', id)
            }
        },
        /**
         * 加载数据
         */
        loadData () {
            this.loading = true
            newProcess(this.getFormatParams()).then(response => {
                this.listData = response.data.dataResult
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
                    this.handleEdit(selection)
                    break
                case 'saveFavorites':// 收藏
                    ActionUtils.selectedMultiRecord(selection).then((id) => {
                        this.tips('saveFavorites', '确认流程收藏吗？', id)
                    }).catch(() => { })
                    break
                case 'removeFavorites':// 取消
                    ActionUtils.selectedMultiRecord(selection).then((id) => {
                        this.tips('removeFavorites', '确认取消流程收藏吗？', id)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        /**
         * 点击表格
         */
        handleLinkClick (data) {
            this.defId = data.id || ''
            this.dialogFormVisible = true
        },
        /**
         * 编辑
         */
        handleEdit (id) {
            this.defId = id
            this.dialogFormVisible = true
        },
        tips (tip, title, id) {
            this.$confirm(title, '消息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (tip === 'saveFavorites') {
                    saveFavorites({ defIds: id }).then(response => {
                        ActionUtils.successMessage('收藏成功！')
                        this.loadData()
                    })
                } else {
                    removeFavorites({ defIds: id }).then(response => {
                        ActionUtils.successMessage('取消收藏成功！')
                        this.loadData()
                    })
                }
            }).catch(() => {})
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
        left: 220px !important;
    }
    .ibps-card-list-container .ibps-card-list--picture-card {
        display: block;
    }
</style>
