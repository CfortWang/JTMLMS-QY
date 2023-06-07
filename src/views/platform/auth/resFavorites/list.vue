<template>
  <div class="main-container">
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
      @action-event="handleAction"
      @pagination-change="handlePaginationChange"
      @column-link-click="handleColumnLink"
    />
  </div>
</template>

<script>
import { getMenuFavorites } from '@/api/platform/auth/resources'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
  components: {
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listData: [],
      title: '',
      loading: true,
      width: 0,
      height: document.clientHeight,
      pagination: {},
      sorts: {},

      listConfig: {
        toolbars: [
          {
            key: 'search'
          }
          // {
          //   key: 'toUp'
          // },
          // {
          //   key: 'up'
          // },
          // {
          //   key: 'down'
          // },
          // {
          //   key: 'toBottom'
          // }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '名称' },
            { prop: 'Q^ALIAS_^SL', label: '别名' },
            { fieldType: 'slot', prop: 'sign', value: 'sys' },
            { fieldType: 'slot', prop: 'systemId', value: this.$store.getters.systemid }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称', link: 'tab' },
          { prop: 'alias', label: '别名' },
          { prop: 'createTime', label: '收藏时间' }
        ]
        // rowHandle: {
        //   actions: [
        //     {
        //       key: 'up'
        //     },
        //     {
        //       key: 'down'
        //     },
        //     {
        //       key: 'toUp'
        //     },
        //     {
        //       key: 'toBottom'
        //     }
        //   ]
        // }
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      getMenuFavorites(this.getSearcFormData()).then(response => {
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
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : { 'sign': 'sys', 'systemId': this.$store.getters.systemid },
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
        // case 'up':// 上移
        //   ActionUtils.selectedRecord(selection).then((id) => {
        //     this.handleSort(id, 'up')
        //   }).catch(() => { })
        //   break
        // case 'down':// 下移
        //   ActionUtils.selectedRecord(selection).then((id) => {
        //     this.handleSort(id, 'down')
        //   }).catch(() => { })
        //   break
        // case 'toUp':// 移至第一条
        //   ActionUtils.selectedRecord(selection).then((id) => {
        //     this.handleSort(id, 'first')
        //   }).catch(() => { })
        //   break
        // case 'toBottom':// 移至最后一条
        //   ActionUtils.selectedRecord(selection).then((id) => {
        //     this.handleSort(id, 'last')
        //   }).catch(() => { })
        //   break
        default:
          break
      }
    },
    /**
     * 处理排序
     */
    // handleSort(ids, sort) {
    //   sortFavorites({ resourceIds: ids, sort: sort, sign: 'sys' }).then(response => {
    //     ActionUtils.success('操作成功')
    //     this.search()
    //   }).catch(() => {})
    // },
    handleColumnLink(column, row) {
      this.$router.push('/router-alias/' + column.alias)
    }
  }
}
</script>
