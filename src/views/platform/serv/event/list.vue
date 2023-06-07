<template>
  <div v-if="dialogVisible" class="main-container">
    <ibps-container type="full" class="page">
      <ibps-crud
        ref="crud"
        :height="height"
        :data="listData"
        :index-row="false"
        :toolbars="listConfig.toolbars"
        :row-handle="listConfig.rowHandle"
        :search-form="listConfig.searchForm"
        :pk-key="pkKey"
        :columns="listConfig.columns"
        :pagination="pagination"
        :loading="loading"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      >
        <el-input
          slot="eventTypesSelect"
          v-model="formEventTypeLabel"
          style="width:200px;"
          disabled
          clearable
        />
      </ibps-crud>
    </ibps-container>

    <!-- 服务选择器 -->
    <ibps-service-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      :multiple="true"
      class="position-org-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />

    <event-sort
      :source-id="formId"
      :visible="nodeSortVisible"
      title="事件排序"
      @close="visible => nodeSortVisible = visible"
      @callback="search"
    />
  </div>
</template>
<script>
import { queryPageList, saveBatch, remove, changeIgnoreException, changeEnabled, changeEnabledBeforeEvent, changeEnabledAfterEvent } from '@/api/platform/serv/event'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { eventTypeOptions, defaultAllOptions } from '../constants'
import IbpsServiceSelectorDialog from '@/business/platform/serv/service/dialog'
import EventSort from './sort'
export default {
  components: {
    IbpsServiceSelectorDialog,
    EventSort
  },
  mixins: [
    FixHeight
  ],
  props: {
    id: {
      type: String
    },
    visible: {
      type: Boolean,
      default: false
    },
    eventType: String,
    eventTypeLabel: String,
    title: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: document.clientHeight,
      formName: 'typeForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      selectorVisible: false,
      dialogFormVisible: false,
      editId: '', // 编辑dialog需要使用

      // 排序参数
      nodeSortVisible: false,
      sourceId: '',
      sortData: '',

      defaultAllOptions: defaultAllOptions,
      targetEventType: this.eventType,
      eventTypeOptions: eventTypeOptions,
      // 数据字典列表
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: { // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'add' },
          { key: 'remove' },
          { key: 'sort', label: '排序', icon: 'ibps-icon-cog' }
        ],
        searchForm: { // 查询条件
          forms: [
            {
              prop: 'Q^TYPE_^S',
              label: '事件类型',
              fieldType: 'slot', slotName: 'eventTypesSelect'
            },
            {
              prop: 'Q^IGNORE_EXCEPTION_^S',
              label: '忽略异常',
              fieldType: 'select',
              options: defaultAllOptions
            },
            {
              prop: 'Q^ENABLED_^S',
              label: '是否启用',
              fieldType: 'select',
              options: defaultAllOptions
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'sourceName', label: '源服务' },
          { prop: 'serviceName', label: '服务' },
          { prop: 'type', label: '事件类型', tags: eventTypeOptions, width: 80 },
          { prop: 'enabled', label: '是否启用', tags: defaultAllOptions, width: 80 },
          { prop: 'ignoreException', label: '忽略异常', tags: defaultAllOptions, width: 80 },
          { prop: 'enabledBeforeEvent', label: '是否启用事件服务前置事件', tags: defaultAllOptions, width: 180 },
          { prop: 'enabledAfterEvent', label: '是否启用事件服务后置事件', tags: defaultAllOptions, width: 180 },
          { prop: 'sn', label: '序号', width: 80 }
        ],
        rowHandle: {
          actions: [
            {
              key: 'enable',
              label: '启用',
              icon: 'ibps-icon-toggle-on',
              hidden: function(rowData, index) {
                return rowData.enabled === 'Y'
              }
            },
            {
              key: 'disable',
              label: '禁止',
              icon: 'ibps-icon-toggle-off',
              hidden: function(rowData, index) {
                return rowData.enabled === 'N'
              }
            },
            {
              key: 'ignore',
              label: '忽略异常',
              icon: 'ibps-icon-toggle-on',
              hidden: function(rowData, index) {
                return rowData.ignoreException === 'Y'
              }
            },
            {
              key: 'interrupt',
              label: '异常中断',
              icon: 'ibps-icon-toggle-off',
              hidden: function(rowData, index) {
                return rowData.ignoreException === 'N'
              }
            },
            {
              key: 'enableBeforeEvent',
              label: '启用前置事件',
              icon: 'ibps-icon-toggle-on',
              hidden: function(rowData, index) {
                return rowData.enabledBeforeEvent === 'Y'
              }
            },
            {
              key: 'disableBeforeEvent',
              label: '禁止前置事件',
              icon: 'ibps-icon-toggle-off',
              hidden: function(rowData, index) {
                return rowData.enabledBeforeEvent === 'N'
              }
            },
            {
              key: 'enableAfterEvent',
              label: '启用后置事件',
              icon: 'ibps-icon-toggle-on',
              hidden: function(rowData, index) {
                return rowData.enabledAfterEvent === 'Y'
              }
            },
            {
              key: 'disableAfterEvent',
              label: '禁止后置事件',
              icon: 'ibps-icon-toggle-off',
              hidden: function(rowData, index) {
                return rowData.enabledAfterEvent === 'N'
              }
            },
            {
              key: 'remove',
              hidden: function(rowData, index) {
                return false
              }
            }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    formId() {
      return this.id
    },
    formEventType() {
      return this.eventType
    },
    formEventTypeLabel() {
      return this.eventTypeLabel
    }
  },
  watch: {
    formId() {
      this.loadData()
    },
    formEventType() {
      this.loadData()
    },
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) this.loadData()
      },
      immediate: true
    }
  },
  created() {
    // this.loadData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^SOURCE_ID_^S'] = this.formId
      params['Q^TYPE_^S'] = this.formEventType
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
     * 前置事件
     *
     * @before-action-event="beforeActionEvent"
     */
    beforeActionEvent(key, position, data, callback) {
      const flag = true
      callback(flag)
    },
    // 处理选择器显示
    handleAssign() {
      this.selectorVisible = true
    },
    handleSelectorActionEvent(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          this.handleConfirm(data)
          break
      }
    },
    handleConfirm(data) {
      if (this.$utils.isEmpty(data)) {
        return
      }
      const serviceIds = data.map(item => {
        return item.id
      })
      saveBatch({
        type: this.eventType,
        sourceId: this.formId,
        serviceIds: serviceIds// .join(',')
      }).then(response => {
        this.selectorVisible = false
        this.$message.closeAll()
        this.$message({
          message: '添加事件成功!',
          type: 'success'
        })
        this.search()
      })
    },
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理排序
     */
    handleSort() {
      this.nodeSortVisible = true
      this.sortData = this.listData
      // if (data.children && data.children.length > 0) {
      //   if (data.children.length === 1) {
      //     this.$message.closeAll()
      //     this.$message.warning('只有一个节点无需排序')
      //   } else {
      //   }
      // } else {
      //   this.$message.closeAll()
      //   this.$message.warning('无子节点排序')
      // }
    },
    handleEnabled(id, enabled = 'Y') {
      changeEnabled({ id: id, enabled: enabled }).then(response => {
        ActionUtils.successMessage()
        this.search()
      }).catch(() => {})
    },
    handleIgnoreException(id, enabled = 'Y') {
      changeIgnoreException({ id: id, ignoreException: enabled }).then(response => {
        ActionUtils.successMessage()
        this.search()
      }).catch(() => {})
    },
    handleEnabledBeforeEvent(id, enabled = 'Y') {
      changeEnabledBeforeEvent({ id: id, enabledBeforeEvent: enabled }).then(response => {
        ActionUtils.successMessage()
        this.search()
      }).catch(() => {})
    },
    handleEnabledAfterEvent(id, enabled = 'Y') {
      changeEnabledAfterEvent({ id: id, enabledAfterEvent: enabled }).then(response => {
        ActionUtils.successMessage()
        this.search()
      }).catch(() => {})
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
          this.handleAssign()
          break
        case 'enable':// 启用
          this.handleEnabled(data.id)
          break
        case 'disable':// 禁用
          this.handleEnabled(data.id, 'N')
          break
        case 'enableBeforeEvent':// 启用前置事件
          this.handleEnabledBeforeEvent(data.id)
          break
        case 'disableBeforeEvent':// 禁用前置事件
          this.handleEnabledBeforeEvent(data.id, 'N')
          break
        case 'enableAfterEvent':// 启用后置事件
          this.handleEnabledAfterEvent(data.id)
          break
        case 'disableAfterEvent':// 禁用后置事件
          this.handleEnabledAfterEvent(data.id, 'N')
          break
        case 'ignore':// 异常忽略
          this.handleIgnoreException(data.id)
          break
        case 'interrupt':// 异常中断
          this.handleIgnoreException(data.id, 'N')
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'sort':// 排序
          this.handleSort()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lc-row-buttom-setting{
  margin-bottom: 10px;
}
.position-org-dialog {
  .el-dialog__body{
    height:  calc(70vh - 120px) !important;
  }
}
/* .el-row {
    margin-bottom: 10px;
  } */
</style>
