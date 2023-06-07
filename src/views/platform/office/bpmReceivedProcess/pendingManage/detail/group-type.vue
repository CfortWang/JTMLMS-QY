<template>
  <div :style="{height:height+'px'}" class="pendingManage-module">
    <ibps-crud
      ref="crud"
      :style="{ marginLeft: width+'px' }"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="pagination"
      :loading="loading"
      :index-row="false"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @column-link-click="handleLinkClick"
      @pagination-change="handlePaginationChange"
	    :contorlLength = "true"
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
      <template slot="subject" slot-scope="scope">
        <el-badge v-if="scope.row.remindTimes>0" :value="scope.row.remindTimes" class="item">
          <el-link type="primary" :underline="false" @click="handleLinkClick(scope.row)">
            {{ scope.row.subject }}
          </el-link>
        </el-badge>
        <el-link v-else type="primary" :underline="false" @click="handleLinkClick(scope.row)">
          {{ scope.row.subject }}
        </el-link>
      </template>
    </ibps-crud>
    <bpmn-formrender
      :visible="dialogFormVisible"
      :task-id="taskId"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 转办 -->
    <delegate
      :task-id="taskId"
      :title="title"
      :visible="delegateVisible"
      @callback="search"
      @close="visible => delegateVisible = visible"
    />
    <!-- 批量审批 -->
    <approve-dialog
      :visible="approveDialogVisible"
      :title="title"
      :task-id="taskId"
      :action="action"
      @callback="search"
      @close="visible => approveDialogVisible = visible"
    />
  </div>
</template>
<script>
import { pending4Group } from '@/api/platform/office/bpmReceived'
import { batchSuspendProcess, batchRecoverProcess } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from '@/utils/action'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import Delegate from '@/business/platform/bpmn/task-change/edit'
import ApproveDialog from '@/business/platform/bpmn/form-ext/approve'

export default {
  components: {
    BpmDefinitionSelector,
    Delegate,
    ApproveDialog,
    BpmnFormrender
  },
  props: {
    id: String,
    height: Number
  },
  data() {
    return {
      width: 200,
      // height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      approveDialogVisible: false, // 批量审批
      delegateVisible: false,
      action: '',
      taskId: '', // 编辑dialog需要使用
      title: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          {
            key: 'agree',
            label: '同意',
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
          }
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
          { prop: 'createTime', label: '创建时间', width: 140 }
        ]
      },
      pagination: {},
      sorts: {},
      procDefIdSelect: ''

    }
  },
  // created() {
  //   this.loadData()
  // },
  methods: {
    getProcDefId(data) {
      this.procDefIdSelect = data
    },
    /**
     * 加载数据
     */
    loadData(id) {
      this.loading = true
      pending4Group(this.getFormatParams(id)).then(response => {
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
      if (this.$utils.isNotEmpty(id)) {
        params['Q^temp.TYPE_ID_^S'] = id
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
        case 'stop': // 终止
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
    }
  }
}
</script>
<style lang="scss">
.pendingManage-module{
  .cell{
    overflow:initial !important;
  }
  .el-badge{
    margin:10px 0 0 10px;
  }
  .el-badge__content.is-fixed{
    top: 0;
    left: -40px;
    right: auto;
  }
}
</style>
