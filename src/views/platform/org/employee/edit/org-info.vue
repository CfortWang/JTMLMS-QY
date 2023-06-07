<template>
  <el-row :gutter="10">
    <el-col v-if="!readonly" :span="8" border>
      <div class="grid-content">
        <tree
          ref="elTree"
          :height="height"
          :data="treeData"
          :multiple="false"
          :check-strictly="false"
          :check-on-click-node="true"
          :options="{
            'default-expand-all': false,
            'expand-on-click-node': false,
            'default-expanded-keys':['0'],
            lazy:true,
            load:loadNode,
            props: {
              children: 'children',
              label: 'name'
            }
          }"
          node-key="id"
          @action-event="handleTreeAction"
        />
      </div>
    </el-col>
    <el-col v-if="!readonly" :span="3">
      <el-button type="primary" icon="el-icon-d-arrow-right" class="ibps-ml-10" @click="handleBelongTo">属于</el-button>
      <el-button type="info" icon="el-icon-d-arrow-left" class="ibps-ml-10 ibps-mt-10" @click="handleClear">清空</el-button>
    </el-col>
    <el-col :span="!readonly? 11 : 24" border>
      <div class="grid-content">
        <el-form label-width="120px">
          <el-form-item>
            <div slot="label" style="font-weight: bold;">组织名称：</div>
            {{ orgData.name }}
          </el-form-item>
          <el-form-item>
            <div slot="label" style="font-weight: bold;">组织路径：</div>
            {{ orgData.pathName }}
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { findTreeData } from '@/api/platform/org/org'
import TreeUtils from '@/utils/tree'
import Tree from '../../components/tree'
import ActionUtils from '@/utils/action'

export default {
  components: {
    Tree
  },
  props: {
    data: [Object, String],
    readonly: {
      type: Boolean,
      default: false
    },
    span: [Number, String],
    groupID: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      parentId: '0',
      pkKey: 'id',
      nameKey: 'name',
      treeData: [],
      orgData: {
        name: '',
        pathName: ''
      },
      height: document.clientHeight
    }
  },
  computed: {
    spanNumber() {
      return this.span
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.orgData = val
        if (val !== {}) {
          const tree = this.$refs.elTree ? this.$refs.elTree : null
          if (tree !== null) {
            tree.radio = val.id
          }
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      this.orgData = {}
      if (this.$refs.elTree) {
        this.$refs.elTree.initRadio()
      }
    },
    loadNode(node, resolve) {
      this.loading = true
      findTreeData({
        type: '1',
        orgId: node.level === 0 ? null : node.data.id
      }).then(res => {
        this.loading = false
        resolve(this.toTree(res.data))
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
    // 查询
    refreshNode() {
      const node = this.$refs.elTree.getNode(this.parentId) // 通过节点id找到对应树节点对象
      node.loaded = false
      node.expand()
    },
    // 组织树事件
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.refreshNode()
        }
      }
    },
    // 属于
    handleBelongTo() {
      const tree = this.$refs.elTree
      const checkedId = tree.getCheckedId()
      if (this.$utils.isEmpty(checkedId)) {
        ActionUtils.warning('请选择节点后操作 ！')
        return
      }
      const curNode = tree.getNode(checkedId)
      if (curNode === null || curNode.parent.key === undefined) { return }
      this.orgData = {
        id: curNode.data[this.pkKey],
        name: curNode.data[this.nameKey],
        pathName: this.getPathName(curNode)
      }
      this.$emit('input', this.orgData)
    },
    getPathName(curNode) {
      const nameKey = this.nameKey
      const namePrefix = []
      const push = function(node) {
        const name = node.data[nameKey]
        if (node.parent && name) {
          namePrefix.unshift(name)
          push(node.parent)
        }
      }
      push(curNode)
      if (namePrefix.length > 0) {
        namePrefix.splice(0, 1)
      }
      return namePrefix.join('.')
    },
    handleClear() {
      this.orgData = {}
      this.$emit('input', '')
      this.init()
    }
  }
}
</script>
