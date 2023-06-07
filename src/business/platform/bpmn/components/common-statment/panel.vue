<template>
  <ibps-crud
    ref="crud"
    :height="tableHeight"
    :data="listData"
    :toolbars="listConfig.toolbars"
    :search-form="listConfig.searchForm"
    :pk-key="pkKey"
    :columns="listConfig.columns"
    :pagination="pagination"
    :loading="loading"
    :selection-type="multiple?'checkbox':'radio'"
    @selection-change="handleSelectionChange"
    @action-event="handleAction"
    @sort-change="handleSortChange"
    @pagination-change="handlePaginationChange"
  />
</template>
<script>
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import { actionOptions, isDefaultOptions } from '@/views/platform/bpmn/bpmCommonStatment/constants'
import ActionUtils from '@/utils/action'
import SelectionMixin from '@/components/ibps-selector/mixins/selection'

export default {
  mixins: [SelectionMixin],
  props: {
    value: [Object, Array],
    action: {
      type: String
    },
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          labelWidth: 100,
          forms: [
            { prop: 'Q^VALUE_^SL', label: '内容:', labelWidth: 80 },
            {
              prop: 'Q^IS_DEFAULT_^S',
              label: '是否默认:',
              fieldType: 'select',
              options: isDefaultOptions,
              labelWidth: 80
            }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'value', label: '内容' },
          { prop: 'action', label: '动作类型', tags: actionOptions },
          { prop: 'isDefault', label: '是否默认', tags: isDefaultOptions }
        ]
      },
      pagination: {},
      sorts: {}

    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  created() {
    this.loadListData()
  },
  methods: {
    /**
     * 加载数据
     */
    loadListData() {
      this.loading = true
      queryIncludeNull(this.getSearcFormData()).then(response => {
        this.loading = false
        ActionUtils.handleListData(this, response.data)
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (this.action === 'endProcess' || this.action === 'stop') {
        params['Q^ACTION_^S'] = 'manualend'
      } else {
        params['Q^ACTION_^S'] = this.action
      }
      params['Q^CREATE_BY_^S'] = this.$store.getters.userId
      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.changePageCoreRecordData()
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadListData()
    },
    /**
     * 查询
     */
    search() {
      this.loadListData()
    },
    /**
     * 重置查询条件
     */
    reset() {
      this.$refs['crud'].handleReset()
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
    }
  }
}
</script>
