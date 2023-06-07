<template>
  <div class="admin-approve-list">
    <ibps-crud
      ref="crud"
      :height="630"
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
      :tenant="formId"
      :title="title"
      :tenant-name="tenantName"
      :visible="dialogFormVisible"
      :readonly="readonly"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import { queryWaitPageList, remove, approve, save } from '@/api/saas/tenant/user'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { approveStatusOptions } from '../constants'
import Edit from './edit'

export default {
  components: {
    Edit
  },
  mixins: [FixHeight],
  props: {
    tenantName: String,
    id: {
      type: [String]
    }
  },
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      editId: '', // 编辑dialog需要使用
      readonly: false, // 是否只读
      pkKey: 'id', // 主键  如果主键不是pk需要传主键

      tenantId: '',
      title: '',
      loading: true,

      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          {
            key: 'search'
          }, /* {
            key: 'add'
          },*/
          // {
          //   key: 'pass',
          //   label: '通过',
          //   icon: 'ibps-icon-legal'
          // },
          // {
          //   key: 'refuse',
          //   label: '拒绝',
          //   icon: 'ibps-icon-legal'
          // },
          {
            key: 'remove'
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
          { prop: 'account', label: this.$t('platform.saas.tenant.prop.account') },
          { prop: 'email', label: this.$t('platform.saas.tenant.prop.email') },
          { prop: 'status', label: this.$t('platform.saas.tenant.prop.status'), tags: approveStatusOptions },
          { prop: 'createTime', label: this.$t('common.field.createTime'), sortable: 'custom' }
        ],
        rowHandle: {
          actions: [{
            key: 'pass',
            label: '通过',
            icon: 'ibps-icon-legal',
            hidden: (data) => {
              if (data.status === 'WAIT') {
                return false
              }
              return true
            }
          }, {
            key: 'refuse',
            label: '拒绝',
            icon: 'ibps-icon-legal',
            hidden: (data) => {
              if (data.status === 'REFUSED') {
                return false
              }
              return true
            }
          }, {
            key: 'edit'
          }, {
            key: 'remove'
          }, {
            key: 'detail'
          }]
        }
      }
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {

  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      queryWaitPageList(this.getSearcFormData()).then(response => {
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
      let formParam = { 'Q^tenant_Id_^S': this.formId }
      if (this.$refs['crud']) {
        formParam = this.$refs['crud'].getSearcFormData()
        this.$set(formParam, 'Q^tenant_Id_^S', this.formId)
      }
      return ActionUtils.formatParams(formParam, this.pagination, this.sorts)
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
          this.handleEdit()
          this.title = this.$t('common.title.add', { title: this.$t('platform.saas.tenant.title') })
          break
        case 'pass':// 通过
        case 'refuse':// 拒绝
          ActionUtils.selectedRecord(data).then((data) => {
            this.handleBatchAudit(data, command === 'refuse')
          }).catch(() => { })
          break
        // case 'enabled':// 启动
        // case 'disabled':// 禁用
        //   ActionUtils.selectedRecord(data).then((data) => {
        //     this.handleBatch(data, command === 'disabled')
        //   }).catch(() => { })
        //   break
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
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '', readonly = false) {
      this.editId = id
      this.tenantId = this.id
      this.readonly = readonly
      this.dialogFormVisible = true
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
     * 处理审核
     */
    handleBatchAudit(tenant, refuse) {
      if (refuse) {
        tenant.status = 'REFUSED'
      } else {
        tenant.status = 'PASSED'
      }
      approve(tenant).then(response => {
        ActionUtils.success(response.message)
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
    }
  }
}
</script>
<style lang="scss">
.admin-approve-list{
  height: calc(75vh) !important;
}
</style>
