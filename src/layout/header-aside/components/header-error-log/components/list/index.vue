<template>
  <ibps-container>
    <el-table
      :data="log"
      size="mini"
      style="width: 100%"
      max-height="550"
      :empty-text="$t('layout.header-aside.header-error-log.table.empty-text')"
      stripe
      border
    >
      <el-table-column
        type="index"
        width="50"
      />
      <!-- 时间 -->
      <el-table-column
        prop="time"
        :label="$t('layout.header-aside.header-error-log.table.label.time')"
        width="140"
      />
      <!-- 信息 -->
      <el-table-column
        :label="$t('layout.header-aside.header-error-log.table.label.message')"
      >
        <pre slot-scope="scope">
          {{ get(scope.row, 'message') }}
        </pre>
      </el-table-column>
      <!-- 触发页面 -->
      <el-table-column
        :label="$t('layout.header-aside.header-error-log.table.label.url')"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          {{ get(scope.row, 'meta.url') }}
        </template>
      </el-table-column>
      <!-- 触发组件 -->
      <el-table-column
        :label="$t('layout.header-aside.header-error-log.table.label.component')"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="get(scope.row, 'meta.instance.$vnode.componentOptions.tag')"
            type="info"
            size="mini"
          >
            &#60;{{ get(scope.row, 'meta.instance.$vnode.componentOptions.tag') }}&gt;
          </el-tag>
        </template>
      </el-table-column>
      <!-- 查看详情 -->
      <el-table-column
        fixed="right"
        align="center"
        :label="$t('layout.header-aside.header-error-log.table.label.more')"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleShowMore(scope.row)"
          >
            <ibps-icon name="eye" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </ibps-container>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
export default {
  computed: {
    ...mapState('ibps/log', [
      'log'
    ])
  },
  methods: {
    get,
    handleShowMore(log) {
      // Print all information from a log to the console
      this.$notify({
        type: 'info',
        title: this.$t('notify.special.show-log.title'),
        message: this.$t('notify.special.show-log.message')
      })
      this.$log.capsule('IBPS', 'handleShowMore', 'primary')
      console.group(log.message)
      console.log('time: ', log.time)
      console.log('type: ', log.type)
      console.log(log.meta)
      console.groupEnd()
    }
  }

}
</script>
