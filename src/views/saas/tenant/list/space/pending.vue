<template>
  <div class="admin-list">
    <ibps-crud
      ref="crud"
      :height="height"
      :data="listData"
      :toolbars="listConfig.toolbars"
      :pk-key="pkKey"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :loading="loading"
      :show-pagination="false"
      @action-event="handleAction"
    />
  </div>
</template>
<script>
import { schema, createSpace } from '@/api/saas/tenant/tenant'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { schemaStatusOptions } from '../constants'

export default {
  mixins: [FixHeight],
  props: {
    id: String
  },
  data() {
    return {

      listData: [],
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      height: document.clientHeight + document.clientHeight / 5,

      listConfig: {
        toolbars: [
          {
            key: 'created',
            label: this.$t('platform.saas.tenant.constants.button.createSpace')
          }
        ],
        // 表格字段配置
        columns: [
          { prop: 'providerId', label: this.$t('platform.saas.tenant.prop.providerId') },
          { prop: 'schemaStatus', label: this.$t('platform.saas.tenant.prop.schemaStatus'), tags: schemaStatusOptions }
        ],
        rowHandle: {
          actions: [{
            key: 'created',
            label: this.$t('platform.saas.tenant.constants.button.createSpace')
          }]
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
      schema(ActionUtils.formatParams({ 'tenantId': this.id })).then(response => {
        this.listData = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'created':
          this.handleCreated(position, selection, data)
          break
        default:
          break
      }
    },

    /**
     * 创建空间
     */
    handleCreated(position, selection, data) {
      if (position === 'toolbar') {
        ActionUtils.selectedMultiRecord(selection).then((selection) => {
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
      const result = []
      data.forEach(element => {
        const temp = {}
        temp.dsAlias = element.dsAlias
        temp.providerId = element.providerId
        temp.tenantId = element.tenantId
        result.push(temp)
      })
      return result
    }
  }
}
</script>
