<template>
  <div class="admin-list">
    <ibps-crud
      ref="crud"
      :height="530"
      :data="listData"
      :pk-key="pkKey"
      :toolbars="listConfig.toolbars"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :search-form="listConfig.searchForm"
      :loading="loading"
      :pagination="pagination"
      :index-row="false"
      @action-event="handleAction"
      @pagination-change="handlePaginationChange"
    />
    <error
      :id="editId"
      :title="title"
      :visible="errorFormVisible"
      :readonly="readonly"
      @close="visible => errorFormVisible = visible"
    />
  </div>
</template>
<script>
import { query, createSpace, removeSpace, dropSpace } from '@/api/saas/tenant/tenant'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { schemaStatusOptions } from '../constants'
import Error from './error'

export default {
  components: {
    Error
  },
  mixins: [FixHeight],
  props: {
    id: String
  },
  data() {
    return {
      readonly: false, // 是否只读
      errorFormVisible: false,
      title: '',
      editId: '',

      loading: true,
      listData: [],
      pagination: {},
      sorts: {},
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      height: document.clientHeight + document.clientHeight / 5,

      listConfig: {
        toolbars: [
          {
            key: 'search'
          },
          {
            key: 'created',
            label: this.$t('platform.saas.tenant.constants.button.createSpace')
          }
        ],
        // 表格字段配置
        columns: [
          { prop: 'providerId', label: this.$t('platform.saas.tenant.prop.providerId') },
          { prop: 'dsAlias', label: this.$t('platform.saas.tenant.prop.dsAlias') },
          { prop: 'schema', label: this.$t('platform.saas.tenant.prop.schema') },
          { prop: 'schemaStatus', label: this.$t('platform.saas.tenant.prop.schemaStatus'), tags: schemaStatusOptions },
          { prop: 'createTime', label: this.$t('platform.saas.tenant.prop.createTime') }
        ],
        rowHandle: {
          actions: [{
            key: 'created',
            label: this.$t('platform.saas.tenant.constants.button.createSpace'),
            hidden: (data) => {
              if (data.schemaStatus !== 'FAILED' && data.schemaStatus !== 'WAIT') return true
            }
          }, {
            key: 'delete',
            label: this.$t('platform.saas.tenant.constants.button.delSpace'),
            hidden: (data) => {
              if (data.schemaStatus !== 'CREATED' && data.schemaStatus !== 'ERROR') return true
            }
          }, {
            key: 'drop',
            label: this.$t('platform.saas.tenant.constants.button.dropSpace'),
            hidden: (data) => {
              if (data.schemaStatus !== 'CREATED' && data.schemaStatus !== 'DROPED' && data.schemaStatus !== 'ERROR') return true
            }
          }, {
            key: 'error',
            label: this.$t('platform.saas.tenant.constants.button.error'),
            hidden: (data) => {
              if (data.schemaStatus !== 'FAILED' && data.schemaStatus !== 'ERROR') return true
            }
          }]
        },
        searchForm: {
          forms: [
            { prop: 'Q^PROVIDER_ID_^SL', label: this.$t('platform.saas.tenant.prop.providerId') },
            { prop: 'Q^DS_ALIAS_^SL', label: this.$t('platform.saas.tenant.prop.dsAlias') },
            { prop: 'Q^SCHEMA_STATUS_^SL',
              label: this.$t('platform.saas.tenant.prop.schemaStatus'),
              fieldType: 'select',
              options: schemaStatusOptions
            },
            { fieldType: 'slot', prop: 'Q^TENANT_ID_^S', value: this.id }
          ]
        }
      }
    }
  },
  created() {
    // this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      let formParams = { 'Q^TENANT_ID_^S': this.id }
      if (this.$refs['crud']) {
        formParams = this.$refs['crud'].getSearcFormData() || {}
      }
      query(ActionUtils.formatParams(
        formParams,
        this.pagination,
        this.sorts)
      ).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
        case 'created':
          this.handleCreated(position, selection, data)
          break
        case 'error':// 错误明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleError(id)
            this.title = this.$t('platform.saas.tenant.constants.button.error')
          }).catch(() => { })
          break
        case 'delete':// 逻辑删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleDelete(ids)
          }).catch(() => { })
          break
        case 'drop':// 物理删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理创建按钮
     */
    handleCreated(position, selection, data) {
      if (position === 'toolbar') {
        ActionUtils.selectedMultiRecord(selection).then((selection) => {
          if (this.handleData(this.$refs.crud.$selections) === 'error') {
            ActionUtils.error('包含不可创建的空间,请重新选择')
            return
          }
          createSpace(this.handleData(this.$refs.crud.$selections)).then(response => {
            ActionUtils.successMessage(response.message)
            this.loadData()
          })
        }).catch(() => {})
      } else {
        createSpace(this.handleData([data])).then(response => {
          ActionUtils.successMessage(response.message)
          this.loadData()
        }).catch(() => {})
      }
    },
    /**
     * 处理创建空间所需要的数据
     */
    handleData(data) {
      let result = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.schemaStatus !== 'WAIT' && element.schemaStatus !== 'FAILED') {
          result = 'error'
          break
        }
        const temp = {}
        temp.dsAlias = element.dsAlias
        temp.providerId = element.providerId
        temp.tenantId = element.tenantId
        result.push(temp)
      }
      return result
    },
    /**
     * 处理错误信息按钮操作
     */
    handleError(id = '') {
      this.title = this.$t('platform.saas.tenant.constants.button.error')
      this.editId = id
      this.errorFormVisible = true
    },
    /**
     * 处理删除
     */
    handleDelete(ids) {
      removeSpace({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      dropSpace({ ids: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.search()
    }
  }
}
</script>
