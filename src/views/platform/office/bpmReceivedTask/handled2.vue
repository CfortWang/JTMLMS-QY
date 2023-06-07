<template>
  <div>
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

 <!-- <div>
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
        <template   slot="item-symbol">
          <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">已办</p>
        </template>

      <template slot="item-detail-name">
        <span></span>
      </template>
      <template slot="item-detail-partyTypeName">
        <span></span>
      </template>
      <template slot="item-detail-createTime">
        <span></span>
      </template>
      <template slot="item-detail-curNode">
        <span></span>
      </template>
      <template slot="item-detail-status">
        <span></span>
      </template>

      </ibps-card-list>
      <bpmn-formrender
      :visible="dialogFormVisible"
      :instance-id="instanceId"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
   <!-- </ibps-layout> -->
  </div>
</template>
<script>
import { handledTask } from '@/api/platform/office/bpmReceived'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { actionOptions } from '@/business/platform/bpmn/constants'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    IbpsTypeTree,
    BpmnFormrender,
    'ibps-type-tree': () => import('@/business/platform/cat/type/tree'),
 /*   'ibps-card-list': () => import('@/components/ibps-card-list/list'),
    'form-builder': () => import('@/business/platform/form/formbuilder/dialog'),
    'formrender-preview': () => import('@/business/platform/form/formrender/preview/index'), */
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 220,
      height: 500,
      //height: document.clientHeight,
      title: '已办结的事务',
      createText: '创建表单',
      query: '',
      typeId: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      dialogFormVisible: false,
      copyDialogFormVisible: false,
      rightsDialogFormVisible: false,
      formbuilderDialogVisible: false,
      formrenderDialogVisible: false,
      importFormVisible: false,
      formPrintDialogVisible: false,
      instanceId: '', // 编辑dialog需要使用
      statusOptions: [],
      editId: '',
      formKey: '',
      searchField: '',
      searchName: 'Q^SUBJECT_^SL',
      listData: [],
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
          { prop: 'subject', label: '已办任务名称', link: 'dialog',width: 350 },
          { prop: 'taskName', label: '已办事务名称', width: 180 },
          { prop: 'status', label: '处理方式', tags: actionOptions, width: 150 },
          { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', width: 180 },
          { prop: 'completeTime', label: '处理时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', width: 180 }
        ]
      },
      pagination: {},
      sorts: {}
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      handledTask(this.getFormatParams()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
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
    search() {
      this.loadData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
    },
    /**
     * 点击表格
     */
    handleLinkClick(data) {
      this.instanceId = data.procInstId || ''
      this.dialogFormVisible = true
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
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
    handleEdit(data) {
      this.instanceId = data.procInstId || ''
      this.dialogFormVisible = true
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    }
  }
}
</script>
<style scoped>
.ibps-layout >>>  .container-component{
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0px;
    left: 220px!important;}
.ibps-card-list-container >>> .ibps-card-list--picture-card{display: block;}
</style>
