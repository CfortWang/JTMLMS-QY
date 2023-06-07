<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    top="5vh"
    class="dialog"
  >
    <ibps-tree
      ref="elTree"
      v-loading.body="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :width="width"
      :height="height"
      :data="treeData"
      :options="treeOptions"
      :load="loadNode"
      lazy
    />
    <div slot="footer" style="text-align: center;">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { findTreeData, saveMove } from '@/api/platform/org/position'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'

export default {
  props: {
    visible: Boolean,
    id: [String, Number],
    data: Array
  },
  data() {
    return {
      // tree 配置
      width: 600,
      height: document.clientHeight,
      dialogVisible: this.visible,
      treeOptions: {
        'default-expand-all': false,
        'expand-on-click-node': false,
        'default-expanded-keys': ['0'],
        props: {
          children: 'children',
          label: 'name'
        }
      },
      treeData: [],

      options: [],
      // 弹窗配置
      title: '移动节点',
      dialogLoading: false,
      editForm: {
        name: '',
        account: '',
        wcAccount: '',
        orgName: '',
        gender: '',
        createTime: ''
      },
      toolbars: [
        { key: 'save', label: '保存' },
        { key: 'cancel' }
      ]

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
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // onOpen() {
    //   this.treeData = JSON.parse(JSON.stringify(this.data))
    //   this.$nextTick(() => {
    //     this.$refs.elTree.remove(this.id)
    //   })
    // },
    loadNode(node, resolve) {
      this.loading = true
      findTreeData({
        type: 1,
        posId: node.level === 0 ? null : node.data.id
      }).then(res => {
        this.loading = false
        const data = res.data
        const treeData = []
        if (this.$utils.isNotEmpty(data)) {
          data.forEach(d => {
            if (d.id !== this.id) {
              treeData.push(d)
            }
          })
        }

        resolve(this.toTree(treeData))
      }).catch(res => {
        this.loading = false
        resolve([])
      })
    },
    toTree(data) {
      return TreeUtils.transformToTreeFormat(data, {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      })
    },
    // 保存数据
    saveData() {
      const destinationId = this.$refs.elTree.getCurrentKey()
      if (this.$utils.isEmpty(destinationId)) {
        ActionUtils.warning('请选择节点')
        return
      }
      this.dialogLoading = true
      saveMove({
        positionId: this.id,
        destinationId: destinationId
      })
        .then(response => {
          this.dialogLoading = false
          this.$emit('callback', this)
          // ActionUtils.saveSuccessMessage(response.message, r => {
          //   if (r) {
          //     this.closeDialog()
          //   }
          // })
          this.closeDialog()
          ActionUtils.success('移动节点成功！')
        })
        .catch(() => {
          this.$emit('callback', this)
          this.dialogLoading = false
        })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.editForm = {}
    }
  }
}
</script>
