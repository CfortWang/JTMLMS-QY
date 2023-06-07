<template>
  <div class="inst-his-module">
    <el-table
      ref="elTable"
      :data="instHisData"
      border
      stripe
      highlight-current-row
      style="width: 100%"
      class="inst-his-table"
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
        :width="!(disabled|| readonly)?70:50"
        label="操作"
        fixed="right"
        label-class-name="hidden-print"
        class-name="hidden-print"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip v-if="!(disabled|| readonly)" class="item" effect="dark" content="移除" placement="bottom">
              <el-button type="text" class="ibps-mr-5" @click="handleDelete(scope.$index)"><i class="ibps-icon-remove el-link el-link--danger" /></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="明细" placement="bottom">
              <el-button type="text" @click="handleDetail(scope.row.id)"><i class="ibps-icon-detail el-link el-link--primary " /></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
      <template v-if="!readonly" slot="append">
        <bpm-inst-his-selector
          :bpm-def-scope="bpmDefScope"
          :bpm-def-key="bpmDefKey"
          :script="script"
          :starter-scope="starterScope"
          :starter="starter"
          :disabled="disabled"
          :placeholder="placeholder"
          multiple
          label-key="subject"
          style="width:99.5%;margin:4px;"
          store="bind"
          @callback="editInstHis"
        >
          <template slot="title">
            流程实例选择器
            <div class="inst-his-title-help">
              <el-tooltip placement="bottom" effect="light">
                <div slot="content">
                  1、只显示最后一个节点的审批状态为“同意”的结束实例<br>
                  2、当最后一个节点审批状态为“跳过执行”时，就显示前一个节点的审批动作为“同意”的结束实例
                </div>
                <el-link :underline="false"><i class="ibps-icon-help" /></el-link>
              </el-tooltip>
            </div>
          </template>
        </bpm-inst-his-selector>
      </template>
    </el-table>
    <bpmn-formrender
      :visible="dialogFormVisible"
      :instance-id="instanceId"
      @close="visible => dialogFormVisible = visible"
    />
  </div>
</template>

<script>
import BpmInstHisSelector from './selector'
import Vue from 'vue'
Vue.component('bpmn-formrender', () => import('@/business/platform/bpmn/form/dialog'))

export default {
  components: {
    BpmInstHisSelector
  },
  props: {
    value: [Array, String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    bpmDefScope: String,
    bpmDefKey: String,
    script: String,
    starterScope: String,
    starter: String
  },
  data() {
    return {
      instHisData: [],
      currentRow: null,
      instHisId: '',
      instanceId: '',
      dialogFormVisible: false
    }
  },
  watch: {
    bpmDefKey: {
      handler(val) {
        if ((this.bpmDefScope === 'spec' && this.starterScope !== 'spec') && val === '') {
          this.$message({
            message: '流程实例控件未指定流程范围！',
            type: 'warning'
          })
        }
      },
      immediate: true
    },
    starter: {
      handler(val) {
        if ((this.bpmDefScope !== 'spec' && this.starterScope === 'spec') && val === '') {
          this.$message({
            message: '流程实例控件未指定发起人范围！',
            type: 'warning'
          })
        }
        if ((this.bpmDefScope === 'spec' && this.starterScope === 'spec') && (val === '' && this.bpmDefKey === '')) {
          this.$message({
            message: '流程实例控件未指定流程范围！流程实例控件未指定发起人范围！',
            type: 'warning'
          })
        }
      },
      immediate: true
    },
    value: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          if (val && !this.$utils.isArray(val)) {
            this.instHisData = []
          } else {
            this.instHisData = val === '' ? [] : val
          }
        }
      },
      immediate: true
    },
    instHisData: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          const value = val.length === 0 ? '' : val
          this.initEmptyBlock()
          this.$emit('input', value)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.elTable) {
        this.$refs.elTable.doLayout()
      }
      this.initEmptyBlock()
    })
  },

  methods: {
    initEmptyBlock() {
      this.$nextTick(() => {
        let display = 'none'
        if (this.readonly && this.instHisData.length === 0) {
          display = 'block'
        }
        if (this.$refs.elTable && this.$refs.elTable.$refs.emptyBlock) {
          this.$refs.elTable.$refs.emptyBlock.style.display = display
        }
      })
    },
    editInstHis(data) {
      const newArr = this.instHisData.concat(data)
      const n = {}
      const r = []
      for (var i = 0; i < newArr.length; i++) {
        if (!n[newArr[i].id]) {
          n[newArr[i].id] = true
          r.push(newArr[i])
        }
      }
      this.instHisData = r
    },
    handleDetail(id) {
      this.instanceId = id
      this.dialogFormVisible = true
    },
    handleDelete(index) {
      this.instHisData.splice(index, 1)
    },
    handleCurrentChange(val) {
      this.currentRow = val
    }
  }
}
</script>
<style lang="scss">
.inst-his-title-help{
  display: inline-block;
}
</style>
