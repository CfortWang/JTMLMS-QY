<template>
  <ibps-crud
    ref="crud"
    :data="listData"
    :toolbars="listConfig.toolbars"
    :search-form="listConfig.searchForm"
    :columns="listConfig.columns"
    :pagination="pagination"
    :loading="loading"
    :selection-row="false"
    class="reply-list"
    @sort-change="handleSortChange"
    @pagination-change="handlePaginationChange"
  >
    <template slot="content" slot-scope="scope">
      <span class="original-content" v-html="$utils.formatText(scope.row.content)" />
    </template></ibps-crud>
</template>
<script>
import ActionUtils from '@/utils/action'
import { getReplyPageList } from '@/api/platform/message/innerMessage'
export default {
  props: {
    id: String
  },
  data() {
    return {
      loading: true,
      listData: [],
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      listConfig: {
        toolbars: [],
        searchForm: {},
        // 表格字段配置
        columns: [
          { prop: 'content', label: '内容', fieldType: 'slot', slotName: 'content' },
          { prop: 'reply', label: '回复人' },
          { prop: 'replyTime', label: '回复时间', dateFormat: 'yyyy-MM-dd HH:mm:ss' }
        ]
      },
      pagination: {},
      sorts: {}
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载已回复数据
    loadData() {
      this.loading = true
      getReplyPageList(this.getSearcFormData()).then(response => {
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
      return ActionUtils.formatParams({
        'Q^MSG_ID_^S': this.id
      }, this.pagination, this.sorts)
    },
    /**
     * 处理已回复分页事件
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
    }
  }
}
</script>
<style lang="scss">
.reply-list{
  .inner-detail{
    .original-content{
      p{
        margin:0;
      }
    }
  }
}
</style>
