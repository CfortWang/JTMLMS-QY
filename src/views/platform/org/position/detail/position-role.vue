<template>
  <div :style="{height:height+'px'}">
    <ibps-crud
      v-if="visible"
      ref="crud"
      :data="listData"
      :height="tableHeight"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :pagination="pagination"
      :loading="loading"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <!-- 角色选择器 -->
    <ibps-role-selector-dialog
      :visible="selectorVisible"
      :value="[]"
      multiple
      class="position-role-dialog"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { queryByPositionId as queryPageList } from '@/api/platform/org/role'
import { assignRole, removeRole } from '@/api/platform/org/position'
import ActionUtils from '@/utils/action'

import IbpsRoleSelectorDialog from '@/business/platform/org/role/dialog'

export default {
  components: {
    IbpsRoleSelectorDialog
  },
  props: {
    id: [String, Number],
    height: Number,
    visible: Boolean
  },
  data() {
    return {
      selectorVisible: false,

      pkKey: 'id',
      loading: false,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'add',
            label: '添加角色'
          }
        ],
        searchForm: {},
        // 表格字段配置
        columns: [
          { prop: 'name', label: '角色名' },
          { prop: 'roleAlias', label: '别名' },
          { prop: 'subSystemName', label: '子系统名称' },
          { prop: 'source', label: '角色来源' }
        ],
        rowHandle: {
          actions: [
            {
              key: 'remove',
              label: '移除',
              icon: 'el-icon-delete',
              hidden: (row, index) => {
                if (row.canDelete === true) return false
                return true
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    tableHeight() {
      return this.height
    }
  },
  watch: {
    visible: {
      handler() {
        if (this.visible && this.$utils.isNotEmpty(this.id)) {
          this.loadData()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 初始化数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['positionId'] = this.id
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
    handleAction(buttonKey, position, selection, data) {
      switch (buttonKey) {
        // 组织负责人
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'add':// 设置
          this.handleAdd()
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    // 新增角色
    handleAdd() {
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
        ActionUtils.warning('请选择角色')
        return
      }
      assignRole({
        positionId: this.id,
        roleIds: data.map((d) => { return d.id }).join(',')
      }).then(response => {
        this.selectorVisible = false
        ActionUtils.success('设置角色成功!')
        this.search()
      })
    },
    handleRemove(ids) {
      removeRole({
        positionId: this.id,
        roleIds: ids
      }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      })
    }
  }
}
</script>

<style lang="scss">
.position-role-dialog{
  .el-dialog__body{
    height:  calc(70vh - 190px) !important;
  }
}
</style>
