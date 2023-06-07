<template>
  <div style="height: 60vh;">
    <el-form label-width="120px" @submit.native.prevent>
      <el-form-item label="人员类型：" required>
        <el-radio-group v-model="formData.source" @change="SameNode=>handleSameNode=SameNode">
          <el-radio
            v-for="item in userTypeOptions"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.source==='node'" label="节点：" required>
        <!-- <el-select v-model="formData.nodeId" @change="handleNode">
          <el-option
            v-for="node in nodeList"
            :key="node.value"
            :label="node.label"
            :value="node.value"
          />
        </el-select> -->
        <bpmn-same-node v-model="formData" :disabled="formData.source!=='node'" />
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button
        class="ibps-mb-5"
        icon="ibps-icon-add"
        type="primary"
        plain
        @click="addUser"
      >添加</el-button>
    </div>
    <div class="tableContent">
      <el-table :data="formData.settings" border style="width: 100%">
        <el-table-column align="center" prop="graderel" label="组织上下级">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.graderel"
              placeholder="请选择组织上下级"
            >
              <el-option
                label="同级"
                value="s"
              />
              <el-option
                label="上级"
                value="u"
              />
              <el-option
                label="下级"
                value="d"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="grade" label="级数">
          <template slot-scope="scope">
            <el-input v-model="scope.row.grade" :disabled="scope.row.graderel==='s'" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="principal" label="组织负责人">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.principal"
              active-value="Y"
              inactive-value="N"
              active-text="是"
              inactive-text="否"
            />
            <!-- <el-select v-model="scope.row.principal" placeholder="请选择">
              <el-option
                label="是"
                value="Y"
              />
              <el-option
                label="否"
                value="N"
              />
            </el-select> -->
          </template>

        </el-table-column>
        <el-table-column align="center" label="管理" width="100">
          <template slot-scope="scope">
            <el-button type="danger" plain size="small" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import BpmnSameNode from '@/business/platform/bpmn/setting/bpmn-setting/components/user-setting/components/same-node'
import pluginMixin from '../mixins/plugin'
export default {
  components: { BpmnSameNode },
  mixins: [pluginMixin],
  methods: {
    addUser() {
      this.formData.settings.push({
        graderel: 's',
        grade: '1',
        gradeid: this.$utils.guid(),
        principal: 'N'
      })
    },
    deleteRow(index, rows) {
      this.formData.settings.splice(index, 1)
    },
    getData() {
      const source = this.formData.source
      if (this.$utils.isEmpty(source)) {
        return {
          result: false,
          message: '请选择人员类型！'
        }
      }
      if (source === 'node' && this.$utils.isEmpty(this.formData.nodeId)) {
        return {
          result: false,
          message: '请指定节点'
        }
      }
      if (this.$utils.isEmpty(this.formData.settings)) {
        return {
          result: false,
          message: '请添加上下级设置！'
        }
      }

      let description = this.userTypeMap[source].label

      switch (source) {
        case 'node':
          description += '【' + this.formData.nodeName + '】'
          break
        default:
          break
      }

      this.formData['description'] = description
      return {
        data: this.formData,
        result: true
      }
    }
  }
}
</script>
