<template>
  <div>
    <el-button v-if="!readonly" type="primary" icon="ibps-icon-add" @click="handleAdd">
      添加参数
    </el-button>
    <el-popover
      v-if="!readonly"
      trigger="hover"
      placement="right"
    >
      <i slot="reference" class="ibps-icon-help" style="font-size: 13px;" />
      用户解锁<br>
      任务类是 com.lc.ibps.cloud.timer.job.RevokeServiceJob<br>
      1、必须添加参数名称，且参数名称必须是“service-url<br>
      2、对应参数值为：http://IP:网关端口/访问项目/oauth2/v3/user/unlock，只需修改IP和网关端口以及项目名对应即可<br>
      流程催办<br>
      任务类是 com.lc.ibps.cloud.timer.job.RevokeServiceJob<br>
      流程催办：则只需要更改参数值为：http://[网关IP]:[网关端口]/[项目名]/business/v3/bpm/reminder/execute，将带有中文字眼的信息更改实际信息即可，其他参考用户解锁一致！
    </el-popover>
    <el-table
      :data="tableData"
      :empty-text="!readonly?'请添加参数':null"
      height="200px"
      border
      style="width: 100%;margin-top:10px;"
    >
      <el-table-column
        label="参数名称"
      >
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row['paramsName']" @change="data => scope.row.paramsName = data" />
          <span v-else>{{ scope.row['paramsName'] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="参数值"
      >
        <template slot-scope="scope">
          <el-input v-if="!readonly" v-model="scope.row['paramValue']" @change="data => scope.row.paramValue = data" />
          <span v-else>{{ scope.row['paramValue'] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!readonly" label="管理" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="ibps-icon-delete"
            @click="handleDelete(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    jobDataMap: Array
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    jobDataMap: {
      handler: function(val, oldVal) {
        if (val !== []) {
          this.tableData = val
        }
      },
      deppl: true
    }
  },
  methods: {
    handleAdd() {
      const rowParams = {
        paramsName: '',
        paramValue: ''
      }
      this.tableData.push(rowParams)
    },
    getData() {
      return this.tableData
    },
    initData() {
      this.tableData = []
    },
    handleDelete(index, row) {
      row.splice(index, 1)
    }
  }
}
</script>
