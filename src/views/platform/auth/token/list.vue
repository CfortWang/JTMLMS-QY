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
    >
      <el-alert
        v-show="true"
        slot="header"
        :closable="false"
        title="到达过期时间和续期过期时间，对应的令牌会自动删除。"
        type="warning"
        show-icon
        style="height:30px;"
      />
    </ibps-crud>
  </div>
</template>

<script>
import { queryPageList, remove } from '@/api/platform/auth/token'
import ActionUtils from '@/utils/action'
import { instIdentityTypes } from './constants'
import FixHeight from '@/mixins/height'

export default {
  components: {
  },
  mixins: [FixHeight],
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      instanceId: '', // 编辑dialog需要使用
      pkKey: 'refreshToken', // 主键  如果主键不是pk需要传主键
      title: '',
      loading: true,
      height: document.clientHeight,
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [{
          key: 'search'
        }, {
          key: 'remove'
        }],
        // searchForm: {
        //   forms: [
        //     { prop: 'identity', label: '标识', placeholder: '请输入内容' },
        //     { prop: 'identityType',
        //       label: '标识类型',
        //       fieldType: 'select',
        //       options: instIdentityTypes }
        //   ]
        // },
        // 表格字段配置
        columns: [
          { prop: 'identityType', label: '标识类型', tags: instIdentityTypes, width: 150 },
          { prop: 'identity', label: '标识', width: 150 },
          { prop: 'accessToken', label: '令牌' },
          { prop: 'accessTokenTtlDate', label: '过期时间', width: 150 },
          { prop: 'refreshToken', label: '续期令牌' },
          { prop: 'refreshTokenTtlDate', label: '续期过期时间', width: 150 }
        ],
        rowHandle: {
          actions: [{
            key: 'removeToken',
            hidden: (data) => {
              if (data.accessToken == null) {
                return true
              }
              return false
            }
          }, {
            key: 'removeAllToken'
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
        case 'removeToken':// 删除令牌
          ActionUtils.removeRecord(selection).then(() => {
            const results = {}
            results.tokens = [data.accessToken]
            results.type = 'token'
            this.handleRemove(results)
          }).catch(() => { })
          break
        case 'removeAllToken':// 删除全部令牌
          ActionUtils.removeRecord(selection).then(() => {
            const results = {}
            results.tokens = /,/.test(selection) ? selection : [selection]
            results.type = 'refresh'
            this.handleRemove(results)
          }).catch(() => { })
          break
        case 'remove':// 工具栏中的删除全部令牌
          ActionUtils.removeRecord(selection).then(() => {
            const results = {}
            results.tokens = selection
            results.type = 'refresh'
            this.handleRemove(results)
          }).catch(() => { })
          break
        default:
          break
      }
    },
    /**
     * 处理删除
     */
    handleRemove(results) {
      remove(results).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    }
  }
}
</script>
