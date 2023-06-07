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
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    />
    <edit
      :id="editId"
      :tenant-id="tenantId"
      :title="title"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <error
      :id="editId"
      :tenant-id="tenantId"
      :title="title"
      :visible="errorFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => errorFormVisible = visible"
    />
    <assert
      :id="editId"
      :tenant-name="tenantName"
      :title="title"
      :visible="assertFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => assertFormVisible = visible"
    />

    <correlation
      :id="correlationId"
      title="设置关联配置"
      :visible="correlationVisible"
      @callback="search"
      @close="visible => correlationVisible = visible"
    />

    <space
      :id="tenantId"
      :visible="spaceVisible"
      :title="title"
      @close="visible => spaceVisible = visible"
    />
  </div>
</template>

<script>
import { queryPageList, remove, save, schemaCreate, schemaDrop } from '@/api/saas/tenant/tenant'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { approveStatusOptions, statusOptions } from './constants'
import Edit from './edit'
import Error from './error'
import Assert from './admin/index'
import Space from './space/index'
import Correlation from './correlation'

export default {
  components: {
    Edit,
    Assert,
    Correlation,
    Error,
    Space
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      errorFormVisible: false,
      assertFormVisible: false,
      spaceVisible: false,
      editId: '', // 编辑dialog需要使用
      tenantId: '', // 主租户id
      tenantName: '', // 租户名称
      correlationVisible: false, // 设置关联弹窗
      correlationId: '', // 设置关联需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      title: '',
      loading: true,
      height: document.clientHeight,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'add'
          },
          {
            key: 'edit'
          },
          {
            key: 'remove'
          },
          {
            key: 'designCorrelation',
            label: '用户关联'
            // hidden: () => {
            //   var vm = this
            //   return !vm.$utils.isEmpty(vm.listData) || vm.listData.length <= 1
            // }
          }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^NAME_^SL', label: this.$t('platform.saas.tenant.prop.name') }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'name', label: this.$t('platform.saas.tenant.prop.name') },
          { prop: 'scale', label: this.$t('platform.saas.tenant.prop.scale') },
          { prop: 'status', label: this.$t('platform.saas.tenant.prop.status'), tags: statusOptions },
          { prop: 'approveStatus', label: this.$t('platform.saas.tenant.prop.approveStatus'), tags: approveStatusOptions },
          { prop: 'createTime', label: this.$t('common.field.createTime'), sortable: 'custom' }

        ],
        rowHandle: {
          actions: [{
            key: 'enabled',
            label: this.$t('platform.saas.tenant.constants.button.enabled'),
            hidden: (data) => {
              if (data.status === 'DISABLED' && data.schemaStatus !== 'CREATING') {
                return false
              }
              return true
            }
          }, {
            key: 'disabled',
            label: this.$t('platform.saas.tenant.constants.button.disabled'),
            hidden: (data) => {
              if (this.$store.getters.tenant.id === data.id) {
                return true
              }
              if (data.status === 'ENABLED' && data.schemaStatus !== 'CREATING') {
                return false
              }
              return true
            }
          }, {
            key: 'remove',
            hidden: (data) => {
              if (data.schemaStatus === 'CREATING') {
                return true
              }
              return false
            }
          }, {
            key: 'detail'
          }, {
            key: 'error',
            label: this.$t('platform.saas.tenant.constants.button.error'),
            type: 'danger',
            hidden: (data) => {
              if (data.schemaStatus === 'FAILED' || data.schemaStatus === 'ERROR') {
                return false
              }
              return true
            }
          }, {
            key: 'assert',
            label: this.$t('platform.saas.tenant.constants.button.assert')
          }, {
            key: 'maintainSpace',
            label: this.$t('platform.saas.tenant.constants.button.maintainSpace')
          }]
        }
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
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
      return ActionUtils.formatParams(
        this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
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
        case 'add':// 添加
          if (this.$store.getters.isTenantAdmin === false && (!selection || this.$utils.isEmpty(selection))) {
            selection = 'admin'
          } else if (this.$store.getters.isTenantAdmin === true && (selection && selection === [])) {
            selection = ''
          }
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, false, 'add')
            this.title = this.$t('common.title.add', { title: this.$t('platform.saas.tenant.title') })
          }).catch(() => { })
          break
        case 'edit':// 编辑
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = this.$t('common.title.edit', { title: this.$t('platform.saas.tenant.title') })
          }).catch(() => { })
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id, true)
            this.title = this.$t('common.title.detail', { title: this.$t('platform.saas.tenant.title') })
          }).catch(() => { })
          break
        case 'error':// 错误明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleError(id)
            this.title = this.$t('platform.saas.tenant.constants.button.error')
          }).catch(() => { })
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'designCorrelation':// 设置关联
          this.handleCorrelation()
          break
        case 'createSpace':// 创建空间
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleCreateSpace(ids)
          }).catch(() => { })
          break
        case 'delSpace':// 删除空间
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleDelSpace(ids)
          }).catch(() => { })
          break
        case 'enabled':// 启用
        case 'disabled':// 禁用
          ActionUtils.selectedRecord(data).then((data) => {
            this.handleBatch(data, command === 'disabled')
          }).catch(() => { })
          break
        case 'assert':// 租户管理
          ActionUtils.selectedRecord(data).then((data) => {
            this.handleAssert(data.id, false, data.name)
            this.title = '租户管理'
          }).catch(() => { })
          break
        case 'maintainSpace':
          ActionUtils.selectedRecord(data).then((data) => {
            this.handleSpace(data.id, data.name)
          })
          break
        default:
          break
      }
    },
    /**
     * 处理设置关联
     */
    handleCorrelation() {
      this.correlationVisible = true
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '', readonly = false, tag = '') {
      if (tag !== 'add') {
        this.editId = id
        this.tenantId = null
      } else {
        this.editId = ''
        id === 'admin' ? this.tenantId = null : this.tenantId = id
      }
      this.readonly = readonly
      this.dialogFormVisible = true
    },
    handleError(id = '') {
      this.editId = id
      this.errorFormVisible = true
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理状态
     */
    handleBatch(tenant, disabled) {
      if (disabled) {
        tenant.status = 'DISABLED'
      } else {
        tenant.status = 'ENABLED'
      }
      save(tenant).then(response => {
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理创建空间
     */
    handleCreateSpace(ids) {
      schemaCreate({ ids: ids }).then(response => {
        ActionUtils.success(response.message)
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理删除空间
     */
    handleDelSpace(ids) {
      schemaDrop({ ids: ids }).then(response => {
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理编辑
     */
    handleAssert(id = '', readonly = false, name = '') {
      this.editId = id
      this.readonly = readonly
      this.tenantName = name
      this.assertFormVisible = true
    },
    /**
     * 管理空间
     */
    handleSpace(id = '', name = '') {
      this.tenantId = id
      this.spaceVisible = true
      this.title = name + '的' + this.$t('platform.saas.tenant.constants.title.spaceTitle')
    }
  }

}
</script>
