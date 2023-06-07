<template>
  <div>
    <ibps-crud
      ref="crud"
      :height="tableHeight"
      :data="listData"
      :toolbars="dataType === 'bo'?null:listConfig.toolbars"
      :search-form="dataType === 'bo'?null:listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :pagination="dataType === 'bo'?null:pagination"
      :loading="loading"
      :selection-type="multiple?'checkbox':'radio'"
      @selection-change="handleSelectionChange"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
  </div>
</template>
<script>
import { queryPageList, findFormJsonByBo } from '@/api/platform/form/formDef'
import ActionUtils from '@/utils/action'
import SelectionMixin from '@/components/ibps-selector/mixins/selection'

export default {
  mixins: [SelectionMixin],
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },

    boCode: String,
    dataType: {
      type: String
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
            { prop: 'Q^name_^SL', label: '名称', itemWidth: '200' },
            { prop: 'Q^key_^SL', label: '编码', itemWidth: '200' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称' },
          { prop: 'key', label: '编码' }
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
  watch: {
    dataType: {
      handler(val, oldVal) {
        this.loadListData()
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 加载数据
     */
    loadListDataByBo() {
      this.loading = true
      findFormJsonByBo({ boCode: this.boCode }).then(response => {
        this.loading = false
        this.listData = response.data
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 加载数据
     */
    loadListDataByPage() {
      this.loading = true
      queryPageList(this.getFormatParams()).then(response => {
        this.loading = false
        ActionUtils.handleListData(this, response.data)
        this.setSelectRow()
      }).catch(() => {
        this.loading = false
      })
    },
    loadListData() {
      if (this.dataType === 'bo') {
        this.loadListDataByBo()
      } else {
        this.loadListDataByPage()
      }
    },

    /**
     * 获取格式化参数
     */
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
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
