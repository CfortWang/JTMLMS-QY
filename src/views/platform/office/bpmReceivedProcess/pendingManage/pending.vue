<template>
<div>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        title="任务分类"
        ref = "typeTree"
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
      <template slot="procDefIdSelect">
        <bpm-definition-selector
          v-model="procDefIdSelect"
          style="width:200px;display:block;"
          value-key="defKey"
          is-super
          :multiple="false"
          @input="getProcDefId"
          @callback="data => formId= data.id"
        />
      </template>
     <template slot="item-symbol">
        <p style="width:60px;height:60px;border: 2px solid #409eff;border-radius: 100%;font-size: 48px;color:#409eff;font-size:30px;line-height: 60px;">待办</p>
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
      :task-id="taskId"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <delegate
      :task-id="taskId"
      :title="title"
      :visible="delegateVisible"
      @callback="search"
      @close="visible => delegateVisible = visible"
    />
    <approve-dialog
      :visible="approveDialogVisible"
      :title="title"
      :task-id="taskId"
      :action="action"
      @callback="search"
      @close="visible => approveDialogVisible = visible"
    />
  </ibps-layout>
  </div>
</template>
<script>
import TreeUtils from '@/utils/tree'
import FixHeight from '@/mixins/height'

import IbpsTypeTree from '@/business/platform/cat/type/tree'

import { pending } from '@/api/platform/office/bpmReceived'
import { pending4User } from '@/api/platform/office/bpmReceived'
import { batchSuspendProcess, batchRecoverProcess } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from '@/utils/action'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import Delegate from '@/business/platform/bpmn/task-change/edit'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'

export default {
  components: {
    // Detail,
    IbpsTypeTree,
    BpmDefinitionSelector,
    Delegate,
    ApproveDialog,
    BpmnFormrender,
    'ibps-type-tree': () => import('@/business/platform/cat/type/tree'),
    'ibps-card-list': () => import('@/components/ibps-card-list/list'),
    'form-rights': () => import('@/business/platform/form/form-rights'),
    'form-builder': () => import('@/business/platform/form/formbuilder/dialog'),
    'formrender-preview': () => import('@/business/platform/form/formrender/preview/index')
  },
   props: {
    id: String
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 220,
      height: 800,
      height: 799,
      title: '我的待办事务',
      createText: '创建表单',
      query: '',
      copyDialogFormVisible: false,
      rightsDialogFormVisible: false,
      formbuilderDialogVisible: false,
      formrenderDialogVisible: false,
      importFormVisible: false,
      formPrintDialogVisible: false,
      defId: '', // 编辑dialog需要使用
      statusOptions: [],
      editId: '',
      formKey: '',
      searchField: '',
      searchName: 'Q^subject_^SL',
      dialogFormVisible: false, // 弹窗
      taskId: '', // 编辑dialog需要使用
      stautusOptions: [],
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
      approveDialogVisible: false, // 批量审批
      delegateVisible: false,
      action: '',
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
        /*   {
            key: 'agree',
            label: '提交/通过',
            icon: 'ibps-icon-check-square-o'
          },
          {
            key: 'stop',
            label: '终止',
            icon: 'ibps-icon-ioxhost'
          },
          {
            key: 'suspend',
            label: '挂起',
            icon: 'ibps-icon-ioxhost '
          },
          {
            key: 'recover',
            label: '恢复',
            icon: 'ibps-icon-ioxhost '
          } */
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', name: 'Q^temp.subject_^SL', label: '请求标题', link: 'dialog', labelWidth: 80, itemWidth: 200 },
            // { prop: 'Q^creatorId^S',  label: '创建人', labelWidth: 80, itemWidth: 200, fieldType: 'slot', slotName: 'searchFormCreator' },
            { prop: 'Q^proc_def_key_^S', name: 'Q^temp.proc_def_key_^S', label: '流程名称', fieldType: 'slot', slotName: 'procDefIdSelect', labelWidth: 80, itemWidth: 200 },
            {
              prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
              name: ['Q^temp.create_time_^DL', 'Q^temp.create_time_^DG'],
              label: '创建时间',
              fieldType: 'daterange',
              labelWidth: 80
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'subject', label: '请求标题', slotName: 'subject' },
          { prop: 'procDefName', label: '流程名称', width: 120 },
          { prop: 'name', label: '当前节点', width: 120 },
          { prop: 'createTime', label: '创建时间', width: 140 },
          { prop: 'ownerName', label: '所属人', width: 150 }
        ]
      },
      pagination: {},
      sorts: {},
      procDefIdSelect: ''
    }
  },
   created() {
    this.loadData()
  },
  methods: {
    getProcDefId(data) {
      this.procDefIdSelect = data
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      pending(this.getFormatParams()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams(id) {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.$utils.isNotEmpty(this.procDefIdSelect)) {
        params['Q^temp.proc_def_key_^S'] = this.procDefIdSelect
      }
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^temp.TYPE_ID_^S'] = this.typeId
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
    handleLinkClick(data, columns) {
      this.taskId = data.taskId || ''
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
          this.handleEdit(selection)
          break
        case 'stop': // 反对
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleBatchApprove(ids, 'stop')
            this.title = '批量终止流程'
          }).catch(() => { })
          break
        case 'agree': // 同意
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleBatchApprove(ids, 'agree')
            this.title = '批量同意审批'
          }).catch(() => { })
          break
        case 'suspend': // 挂起
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleSuspend(ids)
          }).catch(() => { })
          break
        case 'recover': // 恢复
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleRecover(ids)
          }).catch(() => { })
          break
        case 'delegate': // 转办
          ActionUtils.selectedRecord(selection).then((id) => {
            this.title = '任务转办'
            this.handleDelegate(id)
          }).catch(() => { })
          break
        default:
          break
      }
    },
      /**
     * 编辑
     */
    handleEdit(id) {
      this.taskId = id
      this.dialogFormVisible = true
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    /**
     * 处理批量审批
     */
    handleBatchApprove(id = '', action = 'agree') {
      this.taskId = id
      this.action = action
      this.approveDialogVisible = true
    },
    /**
     * 批量挂起任务
     */
    handleSuspend(ids) {
      this.$confirm('确认批量挂起流程任务？', '信息').then(() => {
        batchSuspendProcess({ taskIds: ids }).then(() => {
          ActionUtils.successMessage('挂起流程任务成功')
          this.search()
        }).catch(err => {
          console.error(err)
        })
      })
    },
    /**
     * 批量挂起任务
     */
    handleRecover(ids) {
      this.$confirm('确认批量恢复流程任务？', '信息').then(() => {
        batchRecoverProcess({ taskIds: ids }).then(() => {
          ActionUtils.successMessage('恢复流程任务成功')
          this.search()
        }).catch(err => {
          console.error(err)
        })
      })
    },
    handleDelegate(id) {
      this.taskId = id
      this.delegateVisible = true
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    }
  }
}
</script>
<style lang="scss" >
.padding-page{
  .container-component{
    margin-left:0 !important;
  }
}
// .org-tree-move-node-dialog{
//   .el-dialog__body{
//      height:  calc(50vh - 95px) !important;
//   }
// }
</style>
<style scoped>
.page  >>> .ibps-container-full__body{padding:0  0  10px  0!important;}
.ibps-layout >>>  .container-component{
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0px;
    left: 220px!important;}
.ibps-card-list-container >>> .ibps-card-list--picture-card{display: block;}
.ibps-card-list-container >>> .ibps-card-list{padding-top: 10px!important;}
</style>
