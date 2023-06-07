<template>
  <div class="templates-tree-list">
    <div v-if="dataTemplate.composeType==='treeList'">
      <div style="padding:4px;">
        <el-input v-model="treeInput" :autosize="{ minRows: 10, maxRows: 11}" type="textarea" readonly resize="none" @focus="handleClickTree" />
      </div>
      <div style="padding:4px;">
        <el-input v-model="listInput" :autosize="{ minRows: 10, maxRows: 11}" type="textarea" readonly resize="none" @focus="handleClickList" />
      </div>
    </div>
    <div v-if="dataTemplate.composeType==='listTree'">
      <div style="padding:4px;">
        <el-input v-model="listInput" :autosize="{ minRows: 10, maxRows: 11}" type="textarea" readonly resize="none" @focus="handleClickTree" />
      </div>
      <div style="padding:4px;">
        <el-input v-model="treeInput" :autosize="{ minRows: 10, maxRows: 11}" type="textarea" readonly resize="none" @focus="handleClickList" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataTemplate: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      treeInput: '[树形结构]未绑定模版',
      listInput: '[列表结构]未绑定模版'
    }
  },
  watch: {
    dataTemplate: {
      handler: function(val, oldval) {
        this.bindTemplate(val.templates)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    bindTemplate(templates) {
      if (this.$utils.isEmpty(templates)) return
      templates.forEach(t => {
        if (t.template_type === 'composeTree') {
          this.treeInput = t.attrs.bind_template_key !== '' ? '[树形结构]已绑定模版' + '【' + t.attrs.bind_template_name + '】' : '[树形结构]未绑定模版'
        }
        if (t.template_type === 'composeList') {
          this.listInput = t.attrs.bind_template_key !== '' ? '[列表结构]已绑定模版' + '【' + t.attrs.bind_template_name + '】' : '[列表结构]未绑定模版'
        }
      })
    },
    handleClickTree() {
      this.$emit('cloumClick', this.dataTemplate.composeType === 'treeList' ? 'composeTree' : 'composeList')
    },
    handleClickList() {
      this.$emit('cloumClick', this.dataTemplate.composeType === 'treeList' ? 'composeList' : 'composeTree')
    }
  }
}
</script>
<style lang="scss">
.templates-tree-list{
  .el-textarea__inner{
    text-align:center !important;
  }
}
</style>
