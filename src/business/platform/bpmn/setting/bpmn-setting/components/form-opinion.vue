<template>
  <el-dialog
    :title="'表单意见设置'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="ibps-form-opinion"
    top="5%"
    width="65%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-table
      v-loading="loading"
      :element-loading-text="$t('common.loading')"
      :data="formData"
      border
      stripe
    >
      <el-table-column label="表单流程意见字段" prop="label" />
      <el-table-column prop="nodeId">
        <template slot="header">绑定节点
          <ibps-help
            content="不选择节点默认是“全局”。当设置全局的意见，在其他节点显示时，需要人工设置该审批意见为只读，否则数据提交不成功！"
          />
        </template>
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.nodeId"
            multiple
            placeholder="默认全局"
            @change="(val)=>{changeNodeId(val,scope.row)}"
          >
            <template v-for="item of nodeList">
              <el-option
                v-if="item.nodeType==='userTask' || item.nodeType==='signTask'"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </template>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="bpmOpinionHide">
        <template slot="header">流程审批意见</template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.bpmOpinionHide"
            :disabled="$utils.isEmpty(scope.row.nodeId)"
            active-text="隐藏"
            inactive-text="显示"
          />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { findFormOptionField } from '@/api/platform/form/formDef'
export default {
  props: {
    defId: String,
    visible: {
      type: Boolean,
      default: false
    },
    formKey: String,
    data: Object
  },
  data() {
    return {
      dialogVisible: this.visible,
      loading: true,
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: []
    }
  },
  computed: {
    ...mapState({
      nodeList: state => state.ibps.bpmn.nodeList
    }),
    nodeMap() {
      const nodeMap = {}
      if (this.$utils.isEmpty(this.nodeList)) {
        return nodeMap
      }
      this.nodeList.forEach(node => {
        nodeMap[node.value] = node.label
      })
      return nodeMap
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    changeNodeId(val, row) {
      if (this.$utils.isEmpty(val)) {
        row.bpmOpinionHide = true
      }
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    saveData() {
      const formData = JSON.parse(JSON.stringify(this.formData))
      // 检查有没有重复节点
      const nodeMap = {}
      const data = {}
      for (let i = 0; i < formData.length; i++) {
        const d = formData[i]
        const nodeId = d.nodeId
        if (this.$utils.isNotEmpty(nodeId)) {
          if (this.$utils.isArray(nodeId)) {
            for (let i = 0; i < nodeId.length; i++) {
              const node = nodeId[i]
              if (this.$utils.isNotEmpty(nodeMap[node])) {
                const label = this.nodeMap[node]
                this.$message({
                  message: `节点[${label}]只能绑定一个表单意见，请修正设置！`,
                  type: 'warning'
                })
                return
              } else {
                nodeMap[node] = d
              }
            }
          }
          data[d.name] = {
            bpmOpinionHide: d.bpmOpinionHide,
            nodeId: d.nodeId
          }
        } else {
          // 全局时去掉约束，全局可以绑定多个
          // const node = ''
          // if (this.$utils.isNotEmpty(nodeMap[node])) {
          //   this.$message({
          //     message: '【全局】只能绑定一个表单意见，请修正设置！',
          //     type: 'warning'
          //   })
          //   return
          // } else {
          //   nodeMap[node] = d
          // }
        }
      }

      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.formData = []
      this.$emit('close', false)
    },
    getFormData() {
      this.formData = []
      this.loading = true
      findFormOptionField({
        formKey: this.formKey
      }).then(response => {
        const opinionList = response.data
        const formData = []
        for (let i = 0; i < opinionList.length; i++) {
          const opinion = opinionList[i]
          const name = opinion.name
          let data = {
            bpmOpinionHide: true,
            nodeId: []
          }
          if (this.$utils.isNotEmpty(this.data) && this.data[name]) {
            data = this.data[name] || {
              bpmOpinionHide: true,
              nodeId: []
            }
          }
          data.name = name
          data.label = opinion.label
          formData.push(data)
        }
        this.formData = JSON.parse(JSON.stringify(formData))

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
