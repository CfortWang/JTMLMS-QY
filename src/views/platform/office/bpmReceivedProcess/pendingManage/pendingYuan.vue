<template>
  <ibps-layout ref="layout">
    <div slot="west">
      <ibps-type-tree
        :width="width"
        :height="height"
        title="任务分类"
        ref = "typeTree"
        category-key="FLOW_TYPE"
        @node-click="handleNodeClick"
        @expand-collapse="handleExpandCollapse"
      />
      <ibps-container
        :margin-left="width+'px'"
        class="page padding-page"
      >
        <detail :id="typeId" :height="height" />
      </ibps-container>
    </div>
  </ibps-layout>
</template>
<script>
import TreeUtils from '@/utils/tree'
import FixHeight from '@/mixins/height'

import IbpsTypeTree from '@/business/platform/cat/type/tree'
import Detail from './detail'

export default {
  components: {
    Detail,
    IbpsTypeTree
  },
  mixins: [FixHeight],
  data() {
    return {
      typeId: '',
      show: '',
      rightsArr: ['join', 'delete'],
      rowHandle: true,
      width: 230,
      height: document.clientHeight,
      orgName: '',
      loading: false,
      orgTreeData: []
    }
  },
  methods: {
    toTree(data) {
      return TreeUtils.transformToTreeFormat(data, {
        idKey: 'id',
        pIdKey: 'parentId',
        childrenKey: 'children'
      })
    },
    // 查询
    search() {
      this.$refs.tree.refreshNode(this.parentId)
    },
    // 返回右明细模块未显示
    successCallback(rtn) {
      if (rtn) {
        this.typeId = ''
        this.show = 'no'
      }
    },
    // 添加 编辑
    handleEdit(id = '') {
      this.show = 'edit'
      this.typeId = id
    },
    // 树点击
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.show = 'detail'
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    }
  }
}
</script>
<style lang="scss" >
.padding-page{
  .container-component{
    margin-left:0 !important;
  }
}
// .org-tree-move-node-dialog{
//   .el-dialog__body{
//      height:  calc(50vh - 95px) !important;
//   }
// }
</style>
<style scoped>
.page  >>> .ibps-container-full__body{padding:0  0  10px  0!important;}

</style>
