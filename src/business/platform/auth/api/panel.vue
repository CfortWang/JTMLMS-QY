<template>
  <ibps-layout ref="layout" class="api-layout">
    <div slot="west">
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
        style="width:100%;"
        @selection-change="handleSelectionChange"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      >
        <template slot="appKey">
          <app-key-selector
            style="width:193px;"
            class="app-key-selector"
            @input="getAppKey"
            @callback="data => formId= data.id"
          />
        </template>
      </ibps-crud>
    </div>
  </ibps-layout>
</template>
<script>
import { queryPageList } from '@/api/platform/auth/api'
import { addAllApi } from '@api/platform/auth/apiGrant'
import ActionUtils from '@/utils/action'
import AppKeySelector from '@/business/platform/auth/app/selector'
import SelectionMixin from '@/components/ibps-selector/mixins/selection'

export default {
  components: {
    AppKeySelector
  },
  mixins: [SelectionMixin],
  props: {
    value: [Object, Array],
    multiple: Boolean,
    height: {
      type: String,
      default: '400px'
    },
    defaultParams: Object,
    grantType: String
  },
  data() {
    return {
      partyId: '',

      appKey: '',

      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      listData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' },
          { key: 'addAll', label: '全部授权' }
        ],
        // 查询条件
        searchForm: {
          labelWidth: 100,
          forms: [
            { prop: 'Q^APP_KEY_^SL', label: '应用标识', fieldType: 'slot', slotName: 'appKey' },
            { prop: 'Q^API_KEY_^SL', label: '接口标识' },
            { prop: 'Q^API_NAME_^SL', label: '接口名称' },
            { prop: 'Q^API_URI_^SL', label: '接口地址' }
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'appKey', label: '应用标识' },
          { prop: 'apiKey', label: '接口标识' },
          { prop: 'apiName', label: '接口名称' },
          { prop: 'apiUri', label: '接口地址' },
          { prop: 'limit', label: '频次' },
          { prop: 'testLimit', label: '测试频次' }
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
    grantType: {
      handler: function(val, oldVal) {
        if (val === 'user') {
          this.listConfig.searchForm.forms.splice(0, 1)
        }
      },
      immediate: true
    }
  },
  created() {
    this.loadListData()
  },
  methods: {
    getAppKey(getValue) {
      this.appKey = getValue
    },
    /**
     * 加载数据
     */
    loadListData() {
      this.loading = true
      queryPageList(this.getFormatParams()).then(response => {
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
    getFormatParams() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      const defaultParams = this.defaultParams
      if (defaultParams.grantType !== 'user') {
        params['Q^APP_KEY_^SL'] = this.appKey
      }
      for (var i in defaultParams) {
        params[i] = defaultParams[i]
      }
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
     * 添加全部授权
     */
    addAll() {
      ActionUtils.removeRecord('0', '是否添加全部接口到该角色中', true).then(() => {
        addAllApi(this.getFormatParams()).then(response => {
          ActionUtils.saveSuccessAlert(response.message, () => {
            this.$emit('closeAll')
          })
        }).catch((err) => {
          console.error(err)
        })
      })
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
        case 'addAll':// 添加全部接口
          this.addAll()
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="scss">
.api-layout{
  .ibps-layout_west{
    width:100%;
    .app-key-selector{
      .selector-list{
        .selector-empty{
          line-height:1.3 !important;
        }
      }
    }
  }
}
</style>
