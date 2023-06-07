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

    <collect-resource
      :system-id="this.$store.getters.systemid"
      :visible="dialogAssignResourceVisible"
      @callback="search"
      @close="visible => dialogAssignResourceVisible = visible"
    />

  </div>
</template>

<script>
import { getMenuFavorites, sortFavorites, removeFavorites } from '@/api/platform/auth/appres'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CollectResource from './collect-resources'

export default {
  components: {
    CollectResource
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      dialogAssignResourceVisible: false,
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
          },
          {
            key: 'collect'
          },
          {
            key: 'cancel',
            type: 'primary'
          },
          {
            key: 'toUp'
          },
          {
            key: 'up'
          },
          {
            key: 'down'
          },
          {
            key: 'toBottom'
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: '名称' },
            { prop: 'Q^ALIAS_^SL', label: '别名' },
            { fieldType: 'slot', prop: 'sign', value: 'personal' },
            { fieldType: 'slot', prop: 'systemId', value: this.$store.getters.systemid }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: '名称' },
          { prop: 'alias', label: '别名' },
          { prop: 'createTime', label: '收藏时间' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'cancel',
              type: 'primary'
            },
            {
              key: 'up'
            },
            {
              key: 'down'
            },
            {
              key: 'toUp'
            },
            {
              key: 'toBottom'
            }
          ]
        }
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
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : { 'sign': 'personal' },
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
        case 'collect':
          this.handleAsignResource()
          break
        case 'cancel':
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'up':// 上移
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSort(id, 'up')
          }).catch(() => { })
          break
        case 'down':// 下移
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSort(id, 'down')
          }).catch(() => { })
          break
        case 'toUp':// 移至第一条
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSort(id, 'first')
          }).catch(() => { })
          break
        case 'toBottom':// 移至最后一条
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleSort(id, 'last')
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 取消收藏
     */
    handleRemove(ids) {
      removeFavorites({ appresIds: ids, sign: 'personal' }).then(response => {
        ActionUtils.success('取消收藏成功')
        this.search()
      }).catch(() => {})
    },

    /**
     * 处理排序
     */
    handleSort(ids, sort) {
      sortFavorites({ appresIds: ids, sort: sort, sign: 'personal' }).then(response => {
        ActionUtils.success('操作成功')
        this.search()
      }).catch(() => {})
    },
    handleAsignResource() {
      this.dialogAssignResourceVisible = true
    },

    handleColumnLink(column, row) {
      this.$router.push('/router-alias/' + column.alias)
    }
  }
}
</script>
