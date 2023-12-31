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
import { actionOptions,statusOptions} from '@/business/platform/bpmn/constants'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'

export default {
  components: {
    IbpsTypeTree,
    BpmnFormrender
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      height: document.clientHeight,
      dialogFormVisible: false, // 弹窗
      instanceId: '', // 编辑dialog需要使用

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      typeId: '',
      loading: false,
      listData: [],
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
          { prop: 'subject', label: '事务名称', link: 'dialog' , width: 450},
          { prop: 'curNode', label: '事务类型', width: 100 },
          { prop: 'status', label: '运行 / 结束', tags: statusOptions, width: 100 },
          { prop: 'createTime', label: '提交时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', width: 140 },
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
      this.instanceId = data.id || ''
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
        default:
          break
      }
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
