<template>
  <div>
    <el-input
      v-model="value.nodeName"
      placeholder="请选择节点"
      readonly
      :disabled="disabled"
      @click.native="handleNode"
    >
      <el-button
        slot="append"
        type="primary"
        icon="el-icon-search"
        :style="buttonStyle"
      />
    </el-input>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      class="sameNode"
      append-to-body
      @open="loadNodeList"
      @close="closeDialog"
    >
      <template slot="title">
        相同节点执行人 <el-tooltip
          class="item"
          effect="light"
          placement="bottom"
        >
          <div slot="content">
            1、相同节点执行人，只能设置前置节点;<br>
            2、若选择分支网关、同步分支网关之后的节点，则有可能出现执行人为空;<br>
            3、该节点之前无其他节点，则无法设置相同节点执行人;</div>
          <span :style="{'textAlign':'center'}">
            <i class="header-icon el-icon-info" /></span>
        </el-tooltip>
      </template>
      <div
        v-loading.fullscreen.lock="dialogLoading"
        :element-loading-text="$t('common.loading')"
        class="same-node-content"
      >
        <table v-if="nodeList && nodeList.length >0" class="table table-striped table-bordered table-hover">
          <tbody>
            <tr
              v-for="item in nodeList"
              :key="item.nodeId"
              @click.stop="clickNodeId(item)"
            >
              <td>
                <el-radio
                  v-model="nodeId"
                  :label="item.nodeId"
                  @click.native.stop
                >{{ item.name }}</el-radio>

              </td>
            </tr>
          </tbody>
        </table>
        <el-alert
          v-else
          :closable="false"
          title="未有相同节点执行人！"
          type="warning"
          show-icon
          style="height:50px;"
        />
      </div>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="actions"
          @action-event="handleActionEvent"
        />
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { sameNodeDialog } from '@/api/platform/bpmn/bpmNodeDef'

export default {
  props: {
    value: {
      type: Object
    },
    disabled: {
      type: Boolean
    }
  },
  data() {
    return {
      nodeId: '',
      nodeList: [],
      dialogVisible: false,
      dialogLoading: false,
      actions: [
        { key: 'confirm', label: '确定' },
        { key: 'clean', label: '清空', type: 'info' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    ...mapState({
      curNode: state => state.ibps.bpmn.curNode,
      userNodeList: state => state.ibps.bpmn.userNodeList,
      defId: state => state.ibps.bpmn.defId
    }),

    buttonStyle() {
      if (this.disabled) {
        return {}
      }
      return {
        background: '#409eff',
        color: ' #ffffff'
      }
    }
  },
  methods: {
    loadNodeList() {
      if (this.$utils.isEmpty(this.curNode)) {
        this.nodeList = []
        for (let i = 0; i < this.userNodeList.length; i++) {
          const node = this.userNodeList[i]
          this.nodeList.push({
            nodeId: node.value,
            name: node.label
          })
        }
        return
      }
      this.dialogLoading = true
      sameNodeDialog({
        defId: this.defId,
        nodeId: this.curNode ? this.curNode.nodeId : null
      }).then(response => {
        this.dialogLoading = false
        this.nodeList = response.data.nodeDefList
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    handleNode() {
      if (this.disabled) { return }
      this.nodeId = this.value.nodeId
      this.dialogVisible = true
    },
    clickNodeId(item) {
      if (this.nodeId === item.nodeId) {
        this.nodeId = null
      } else {
        this.nodeId = item.nodeId
      }
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'clean':
          this.handleClean()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleClean() {
      this.nodeId = ''
    },
    handleConfirm() {
      if (this.$utils.isEmpty(this.nodeId)) {
        this.$message({
          message: '请选择节点',
          type: 'warning'
        })
        return
      }
      const data = JSON.parse(JSON.stringify(this.value))
      const node = this.nodeList.find((node) => {
        return node.nodeId === this.nodeId
      })

      data.nodeId = this.nodeId
      data.nodeName = node.name
      this.$emit('input', data)

      this.closeDialog()
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>
