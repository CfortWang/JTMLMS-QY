<template>
  <div class="inst-his-module">
    <el-table
      ref="elTable"
      :data="bpmLinkData"
      border
      stripe
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="subject"
        label="实例标题"
      >
        <template slot-scope="scope">
          <el-link :underline="false" type="primary" @click="handleDetail(scope.row.id)">
            {{ scope.row['subject'] |removeHtmlTag }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="procDefName"
        label="流程名称"
        width="150"
      />
      <el-table-column
        prop="procDefKey"
        label="流程Key"
        width="120"
      />
      <el-table-column
        prop="status"
        label="流程状态"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.status|optionsFilter(statusOptions,'label') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="发起人"
        width="120"
      />
      <el-table-column
        prop="createTime"
        label="发起时间"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column
        width="70"
        label="操作"
        fixed="right"
        class-name="hidden-print"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="表单" placement="bottom">
              <el-button type="text" class="ibps-mr-5" @click="handleDetail(scope.row.id)"><i class="ibps-icon-detail el-link el-link--primary" /></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="流程历史" placement="bottom">
              <el-button type="text" @click="handleBpmHistory(scope.row.id)"><i class="ibps-icon-bars el-link el-link--success" /></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表单 -->
    <bpmn-formrender
      :visible="dialogFormVisible"
      :instance-id="instanceId"
      @close="visible => dialogFormVisible = visible"
    />
    <!--流程历史-->
    <approval-history-dialog
      :visible="approvalHistoryVisible"
      :inst-id="instanceId"
      @close="visible => approvalHistoryVisible= visible"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import ApprovalHistoryDialog from '@/business/platform/bpmn/components/approval-history/dialog'
import { statusOptions } from '@/business/platform/bpmn/constants'
Vue.component('bpmn-formrender', () => import('@/business/platform/bpmn/form/dialog'))

export default {
  components: {
    ApprovalHistoryDialog
  },
  props: {
    data: Object,
    bpmLinkType: String
  },
  data() {
    return {
      statusOptions: statusOptions,
      dialogFormVisible: false,
      approvalHistoryVisible: false,
      currentRow: null,
      taskId: '',
      instanceId: '',
      bpmLinkData: []
    }
  },
  watch: {
    data: {
      handler: function(val) {
        if (this.$utils.isEmpty(val)) return
        if (this.bpmLinkType === 'current') {
          this.bpmLinkData = val.currentBpmLink || []
        } else {
          this.bpmLinkData = val.postBpmLink || []
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.elTable.doLayout()
    })
  },
  methods: {
    handleDetail(id) {
      this.instanceId = id
      this.dialogFormVisible = true
    },
    handleBpmHistory(id) {
      this.instanceId = id
      this.approvalHistoryVisible = true
    },
    handleCurrentChange(val) {
      this.currentRow = val
    }
  }
}
</script>
