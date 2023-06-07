<template>
  <table class="table table-striped table-bordered table-hover">
    <tbody>
      <tr>
        <td colspan="2">
          等级类型：
          <el-radio-group v-model="formData.levelType" @change="changeLevelType">
            <el-radio label="position">岗位</el-radio>
            <el-radio label="org">组织</el-radio>
          </el-radio-group>

        </td>
      </tr>
      <tr
        v-for="item in userTypeOptions"
        :key="item.value"
      >
        <td :colspan="item.colspan?item.colspan:2">
          <el-radio
            v-model="formData.source"
            :label="item.value"
            @change="changeSource"
          >{{ item.label | filterLabel(formData.levelType) }}
          </el-radio>
        </td>
        <td v-if="item.value === 'spec'">
          <ibps-level-selector
            v-model="formData.levelValue"
            :disabled="formData.source!=='spec'"
            :level-type="formData.levelType"
            placeholder="请选择指定等级"
            multiple
            @callback="handleSpec"
          />
        </td>
        <td v-if="item.value === 'var'">
          <bpmn-form-var :value="executorVar" :disabled="formData.source!=='var'" @input="handleVar" />
        </td>

        <td v-if="item.value === 'node'">
          <bpmn-same-node v-model="formData" :disabled="formData.source!=='node'" />
        </td>
      </tr>
      <tr v-if="formData.levelType ==='position'">
        <td colspan="2">
          <span class="el-radio last-org">
            是否主岗位：
          </span>
          <el-switch
            v-model="formData.mainPost"
            active-text="是"
            inactive-text="否"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import pluginMixin from '../mixins/plugin'
/* 等级选择器 */
import IbpsLevelSelector from '@/business/platform/org/level/selector'
/** 表单变量树 */
import BpmnFormVar from '@/business/platform/bpmn/setting/bpmn-setting/components/form-var-select'
/** 相同节点 */
import BpmnSameNode from '@/business/platform/bpmn/setting/bpmn-setting/components/user-setting/components/same-node'

function filterLabel(value, levelType) {
  return value.replace('{levelType}', levelType === 'position' ? '岗位' : '组织')
}

export default {
  components: {
    IbpsLevelSelector,
    BpmnFormVar,
    BpmnSameNode
  },
  filters: {
    filterLabel(value, levelType) {
      return filterLabel(value, levelType)
    }
  },
  mixins: [pluginMixin],
  methods: {
    changeLevelType() {
      if (this.formData.source === 'spec') {
        this.formData.levelValue = ''
        this.formData.levelName = ''
      }
    },
    changeSource(source) {
      if (source !== 'spec') {
        this.formData.levelValue = ''
        this.formData.levelName = ''
      }
      if (source !== 'var') {
        this.formData.executorVar = ''
      }
      if (source !== 'node') {
        this.formData.nodeId = ''
        this.formData.nodeName = ''
      }
    },
    handleSpec(data) {
      if (this.$utils.isEmpty(data)) {
        this.formData.levelValue = ''
        this.formData.levelName = ''
      } else {
        const levelName = []
        data.forEach(el => {
          levelName.push(el.name)
        })
        this.formData.levelName = levelName.join(',')
      }
    },
    getData() {
      const source = this.formData.source
      if (this.$utils.isEmpty(source)) {
        return {
          result: false,
          message: '请选择来源！'
        }
      }

      let description = filterLabel(this.userTypeMap[source].label, this.formData.levelType)
      switch (source) {
        case 'spec':
          if (this.$utils.isEmpty(this.formData.levelValue)) {
            return {
              result: false,
              message: '请选择指定等级'
            }
          }
          description += '【' + this.formData.levelName + '】'
          break
        case 'var':
          if (this.$utils.isEmpty(this.formData.executorVar) && this.$utils.isEmpty(this.formData.executorVar.name)) {
            return {
              result: false,
              message: '请选择等级变量'
            }
          }
          description += '【' + this.formData.executorVar.name + '】'
          break
        case 'node':
          if (this.$utils.isEmpty(this.formData.nodeId)) {
            return {
              result: false,
              message: '请指定节点'
            }
          }
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
