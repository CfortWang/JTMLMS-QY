<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-tree
        ref="tree"
        :width="width"
        :height="height"
        :loading="loading"
        :contextmenus="orgTreeContextmenus"
        :options="{
          'default-expand-all': false,
          'expand-on-click-node': false,
          'default-expanded-keys':['0'],
          props: {
            children: 'children',
            label: 'name'
          }
        }"
        :load="loadNode"
        lazy
        title="组织管理"
        @action-event="handleTreeAction"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
      <ibps-container
        :margin-left="width+'px'"
        class="page"
      >
        <detail
          v-if="show==='detail'"
          :id="orgId"
          :org-name="orgName"
          :row-handle="rowHandle"
          :rights-arr="rightsArr"
          :show-tree="false"
          :is-edit="true"
        />
        <edit
          v-else-if="show==='edit'"
          :id="orgId"
          :parent-id="parentId"
          @callback="search"
          @success="successCallback"
        />

        <edit-position
          v-else-if="show==='addPosition'"
          :org-id="orgId"
          :parent-id="parentId"
          @success="successCallback"
        />

        <el-alert
          v-else
          :closable="false"
          title="尚未指定一个组织"
          type="warning"
          show-icon
          style="height:50px;"
        />
      </ibps-container>
      <!--设置管理员-->
      <auth-edit
        :visible="authEditVisible"
        :org-id="orgId"
        :org-name="orgName"
        @close="visible => authEditVisible = false"
      />
      <!--移动节点-->
      <move-node
        :id="orgId"
        :visible="moveNodeVisible"
        :data="orgTreeData"
        class="org-tree-move-node-dialog"
        @callback="refreshTree"
        @close="visible => moveNodeVisible = visible"
      />
      <!--节点排序-->
      <node-sort
        :data="sortData"
        :visible="nodeSortVisible"
        title="组织排序"
        @close="visible => nodeSortVisible = visible"
        @callback="refreshTree"
      />
    </div>
  </ibps-layout>
</template>
<script>
import { findTreeData, remove } from '@/api/platform/org/org'
import ActionUtils from '@/utils/action'
import TreeUtils from '@/utils/tree'
import FixHeight from '@/mixins/height'

import Edit from './edit'
import Detail from './detail'
import AuthEdit from '../auth/edit'
import EditPosition from '../position/edit'
import MoveNode from './move-node'
import NodeSort from './sort'

export default {
  components: {
    Edit,
    Detail,
    AuthEdit,
    EditPosition,
    MoveNode,
    NodeSort
  },
  mixins: [FixHeight],
  data() {
    return {
      show: '',
      rightsArr: ['join', 'delete'],
      rowHandle: true,
      width: 230,
      height: document.clientHeight,
      orgId: '',
      orgName: '',
      // 设置分级管理员
      authEditVisible: false,
      // 移动节点
      moveNodeVisible: false,
      // 节点排序
      sortData: [],
      nodeSortVisible: false,

      loading: false,
      orgTreeContextmenus: [
        { icon: 'add', label: '添加', value: 'add' },
        { icon: 'edit', label: '编辑', value: 'edit', rights: ['node'] },
        { icon: 'remove', label: '删除', value: 'remove', rights: ['node'] },
        { type: 'divided', rights: ['node'] },
        { icon: 'arrows-v', label: '移动节点', value: 'moveNode', rights: ['node'] },
        { type: 'divided', rights: ['node'] },
        { icon: 'cog', label: '设置分级管理员', value: 'authEdit', rights: ['node'] },
        { icon: 'add', label: '新增岗位', value: 'addPosition', rights: ['node'] },
        { type: 'divided' },
        { icon: 'sort', label: '节点排序', value: 'nodeSort' }
      ],
      orgTreeData: []
    }
  },
  // mounted() {
  //   // this.loadTreeData()
  // },
  methods: {
    loadNode(node, resolve) {
      this.loading = true
      findTreeData({
        type: 1,
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
    refreshTree() {
      this.parentId = '0'
      this.search()
    },
    // 查询
    search() {
      this.$refs.tree.refreshNode(this.parentId)
    },
    // 返回右明细模块未显示
    successCallback(rtn) {
      if (rtn) {
        this.orgId = ''
        this.show = 'no'
      }
    },
    handleTreeAction(command, position, selection, data) {
      if (position === 'toolbar') {
        if (command === 'refresh') {
          this.refreshTree()
        }
      } else {
        const id = data.id
        this.parentId = data.parentId
        switch (command) {
        // 组织负责人
          case 'add':// 添加
            this.parentId = id
            this.handleEdit('')
            break
          case 'edit':// 编辑
            this.handleEdit(id)
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(id).then((ids) => {
              this.handleRemove(ids)
            }).catch(() => { })
            break
          case 'moveNode':// 移动节点
            this.handleMoveNode(id)
            break
          case 'authEdit':// 设置分级管理员
            this.handleAuthEdit(id, data.name)
            break
          case 'addPosition':// 新增岗位
            this.handleAddPosition(id)
            break
          case 'nodeSort':// 排序
            this.handleNodeSort(data)
            break
          default:
            break
        }
      }
    },
    // 添加 编辑
    handleEdit(id = '') {
      this.show = 'edit'
      this.orgId = id
    },
    // 处理删除
    handleRemove(ids) {
      remove({ orgIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    // 设置分级管理员
    handleAuthEdit(id = '', orgName) {
      this.orgId = id
      this.orgName = orgName
      this.authEditVisible = true
    },
    // 移动节点
    handleMoveNode(id = '') {
      this.moveNodeVisible = true
      this.orgId = id
    },
    // 新增岗位
    handleAddPosition(id = '', parentId) {
      this.orgId = id
      this.parentId = parentId
      this.show = 'addPosition'
    },
    // 树点击
    handleNodeClick(data) {
      if (data.id === 0 || data.id === '0') {
        this.show = 'empty'
        return
      }
      this.orgId = data.id
      this.orgName = data.name
      this.show = 'detail'
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    handleNodeSort(data) {
      findTreeData({
        type: 1,
        orgId: data.id
      }).then(res => {
        const children = res.data
        if (children && children.length > 0) {
          if (children.length === 1) {
            ActionUtils.warning('只有一个节点无需排序')
          } else {
            this.nodeSortVisible = true
            this.sortData = children
          }
        } else {
          ActionUtils.warning('无子节点排序')
        }
      }).catch(res => { })
    }
  }
}
</script>
<style lang="scss" >
// .org-tree-move-node-dialog{
//   .el-dialog__body{
//      height:  calc(50vh - 95px) !important;
//   }
// }
</style>
