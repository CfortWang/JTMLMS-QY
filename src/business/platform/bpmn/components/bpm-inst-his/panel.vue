<template>
  <div>
    <ibps-crud
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      :selection-type="multiple?'checkbox':'radio'"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <bpmn-formrender
      :visible="dialogFormVisible"
      :instance-id="instanceId"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>
<script>
import { normalPassJson as queryPageList } from '@/api/platform/bpmn/bpmInstHis'
import ActionUtils from '@/utils/action'

import Vue from 'vue'
Vue.component('bpmn-formrender', () => import('@/business/platform/bpmn/form/dialog'))
export default {
  props: {
    value: [Object, Array],
    isAuth: {
      type: Boolean,
      default: false
    },
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },
    orgId: [String, Number],
    bpmDefScope: String,
    bpmDefKey: String,
    script: String,
    starterScope: String,
    starter: String
  },
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      instanceId: '', // 编辑dialog需要使用
      radio: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      pagination: {},
      sorts: {},
      listData: [],
      toggleRowSelect: [],
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
        ],
        searchForm: {
          labelWidth: 90,
          forms: [
            { prop: 'Q^PROC_DEF_NAME_^SL', label: '流程名称', itemWidth: '200' },
            { prop: 'Q^SUBJECT_^SL', label: '实例标题', itemWidth: '200' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'subject', label: '实例标题' },
          { prop: 'procDefName', label: '流程名称' },
          { prop: 'procDefKey', label: '流程Key' },
          { prop: 'creator', label: '发起人' },
          { prop: 'createTime', label: '发起时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' },
          { prop: 'endTime', label: '结束时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ],
        rowHandle: {
          actions: [{
            key: 'detail',
            label: '表单'
          }]
        }
      }
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    value(val, oldVal) {

    }
  },
  created() {
    this.loadData()
  },
  methods: {
    toggleRowSelection(row, selected) {
      this.$refs['crud'].toggleRowSelection(row, selected)
      this.toggleRowSelect = [...this.$refs['crud'].$selections]
    },
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        response.data.dataResult.forEach(l => {
          l.subject = l.subject.replace('</p>', '')
          l.subject = l.subject.replace('<p>', '')
        })
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
      params['bpmDefScope'] = this.bpmDefScope
      params['bpmDefKey'] = this.bpmDefKey
      params['script'] = this.script
      params['starterScope'] = this.starterScope
      params['starter'] = this.starter
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
    /**
     * 查询
     */
    search() {
      this.loadData()
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
        case 'detail':// 表单明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleDetail(id)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    handleDetail(id) {
      this.instanceId = id
      this.dialogFormVisible = true
    },

    handleSelectionChange(selection) {
      this.toggleRowSelect = JSON.parse(JSON.stringify(selection))
      if (this.multiple) {
        // 是否在原来 列表里面
        const noListData = []
        this.value.forEach((item) => {
          const index = this.listData.find((data) => { return data[this.pkKey] === item[this.pkKey] })
          if (!index) { noListData.push(item) }
        })
        this.$emit('selected', noListData.concat(selection))
      } else {
        this.$emit('selected', selection)
      }
    },
    clearSelection() {
      this.$refs.crud.clearSelection()
    }

  }
}
</script>
