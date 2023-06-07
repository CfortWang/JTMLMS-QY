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
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
    >
      <template slot="statusCloum" slot-scope="scope">
        <el-tag>{{ scope.row.status|optionsFilter(stautusOptions,'value','key') }}</el-tag>
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
          <span></span>
      </template>
      <template slot="item-detail-partyTypeName">
        <span></span>
      </template>
      <template slot="item-detail-createTime">
        <span></span>
      </template>
      <template slot="item-detail-taskName">
        <span></span>
      </template>
      <template slot="item-detail-completeTime">
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
        :pro-inst-id="proInstId"
        :def-id="defId"
        :copy-flow="copyFlow"
        @callback="search"
        @close="visible => dialogFormVisible = visible"
      />
   </ibps-layout> -->
  </div>
</template>
<script>
import { myRequested } from '@/api/platform/office/bpmInitiated'
import { findProcInstStatus } from '@/api/platform/bpmn/bpmInfo'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    IbpsTypeTree,
    BpmnFormrender,
   /* 'ibps-type-tree': () => import('@/business/platform/cat/type/tree'),
    'ibps-card-list': () => import('@/components/ibps-card-list/list'),
    'form-rights': () => import('@/business/platform/form/form-rights'),
    'form-builder': () => import('@/business/platform/form/formbuilder/dialog'),
    'formrender-preview': () => import('@/business/platform/form/formrender/preview/index') */
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 220,
      height: 500,
      // height: document.clientHeight,
      title: '我启动的流程',
      createText: '创建表单',
      query: '',
      typeId: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      copyDialogFormVisible: false,
      rightsDialogFormVisible: false,
      formbuilderDialogVisible: false,
      formrenderDialogVisible: false,
      importFormVisible: false,
      formPrintDialogVisible: false,
      defId: '',
      statusOptions: [],
      editId: '',
      formKey: '',
      searchField: '',
      searchName: 'Q^subject_^SL',
      listData: [],
      dialogFormVisible: false, // 弹窗
      instanceId: '',  // 编辑dialog需要使用
      proInstId: '',  // 编辑dialog需要使用
      defId: '',  // 编辑dialog需要使用
      copyFlow: false,
      stautusOptions: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', label: '事务名称' , labelWidth: 80, itemWidth: 150},
            { prop: 'Q^proc_def_name_^SL', label: '事务类型', labelWidth: 80, itemWidth: 150},
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
          { prop: 'subject', label: '事务名称', link: 'dialog' },
          { prop: 'procDefName', label: '事务类型', width: 120 },
           { prop: 'createTime', label: '创建时间', width: 140 },
          // { prop: 'status', label: '状态', slotName: 'statusCloum', width: 150 }
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
      },
      pagination: {},
      sorts: {}
    }
  },
  created() {
    this.loadData()
    this.findProcInstStatus()
  },
  methods: {
    findProcInstStatus() {
      findProcInstStatus().then(response => {
        this.stautusOptions = response.data
      })
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      myRequested(this.getFormatParams()).then(response => {
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
      this.instanceId = data.id || ''
      this.proInstId = ''
      this.defId = ''
      this.copyFlow = false
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
    handleEdit(id) {
      this.instanceId = id
      this.dialogFormVisible = true
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleCopy(data) {
      this.instanceId = ''
      this.proInstId = data.id || ''
      this.defId = data.procDefId || ''
      this.copyFlow = true
      this.dialogFormVisible = true
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
