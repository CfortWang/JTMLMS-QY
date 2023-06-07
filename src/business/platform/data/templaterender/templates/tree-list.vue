<template>
  <ibps-layout
    ref="layout"
    :element-loading-text="$t('common.loading')"
    class="template-tree-list"
  >
    <div v-if="dataTemplate.composeType!=='listTree'" slot="west">
      <template-tree
        :title="lefttDataTemplate.name"
        position="west"
        :width="treeWidth"
        :height="dataTemplate.type === 'dialog'?templateHeight-(templateHeight/5):templateHeight-90"
        :template="callbackTemplate(lefttDataTemplate)"
        :data-template="lefttDataTemplate"
        :fields="fields(lefttDataTemplate)"
        :preview="preview"
        show-contextmenus
        combination
        :class="preview?'tree-border':null"
        @expand-collapse="handleExpandCollapse"
        @selected="handlerSelected"
      />
    </div>
    <div v-else slot="east">
      <template-tree
        :title="rightDataTemplate.name"
        position="east"
        :width="treeWidth"
        :height="dataTemplate.type === 'dialog'?templateHeight-(templateHeight/5):templateHeight-90"
        :template="callbackTemplate(rightDataTemplate)"
        :data-template="rightDataTemplate"
        :fields="fields(rightDataTemplate)"
        :preview="preview"
        show-contextmenus
        combination
        :class="preview?'east-tree':null"
        @expand-collapse="handleExpandCollapse"
        @selected="handlerSelected"
      />
    </div>

    <ibps-container
      v-if="dataTemplate.composeType!=='listTree'"
      :margin-left="treeWidth+'px'"
      :margin-right="preview?51+'px':'0'"
      class="page"
    >
      <template-list
        ref="templateList"
        apply-modle="dataTemplate"
        :class="callbackClass(rightDataTemplate)"
        :value="value"
        :data-template="rightDataTemplate"
        :template="callbackTemplate(rightDataTemplate)"
        :fields="fields(rightDataTemplate)"
        :preview="preview"
        :height="dataTemplate.type === 'dialog'?templateHeight-(templateHeight/12):templateHeight+(templateHeight/4)"
        :related-tree-fields="relatedTreeFields"
        :related-list-fields="relatedListFields"
        :default-data="defaultData"
        :dynamic-params="dynamicParams"
        :compose-params="composeParams"
        :multiple="multiple"
        @selected="handlerSelectedRow"
      />
    </ibps-container>
    <ibps-container
      v-else
      :margin-right="preview?51+treeWidth+'px':treeWidth+'px'"
      class="page"
    >
      <template-list
        ref="templateList"
        apply-modle="dataTemplate"
        :class="callbackClass(lefttDataTemplate)"
        :value="value"
        :data-template="lefttDataTemplate"
        :template="callbackTemplate(lefttDataTemplate)"
        :fields="fields(lefttDataTemplate)"
        :preview="preview"
        :height="dataTemplate.type === 'dialog'?templateHeight-(templateHeight/12):templateHeight+(templateHeight/4)"
        :related-tree-fields="relatedTreeFields"
        :related-list-fields="relatedListFields"
        :default-data="defaultData"
        :dynamic-params="dynamicParams"
        :compose-params="composeParams"
        :multiple="multiple"
        @selected="handlerSelectedRow"
      />
    </ibps-container>
  </ibps-layout>
</template>
<script>
import { getFormDataByFormKey } from '@/api/platform/form/formDef'
import { buildFelds } from '../utils'
import { getByKey } from '@/api/platform/data/dataTemplate'
import JComposeTemplate from '../utils/JComposeTemplate'// 自定义脚本
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'

import templateList from './list.vue'
import templateTree from './tree.vue'
export default {
  components: {
    templateList,
    templateTree
  },
  props: {
    value: [String, Number, Array, Object],
    dataTemplate: Object,
    template: [Object, Array],
    dynamicParams: Object,
    width: [String, Number],
    height: [String, Number],
    preview: {
      type: Boolean,
      default: false
    },
    multiple: Boolean
  },
  data() {
    return {
      lefttDataTemplate: {},
      rightDataTemplate: {},
      composeParams: {},
      defaultData: {},
      relatedTreeFields: '',
      relatedListFields: '',
      rootIndex: 0,
      treeWidth: 250,
      templateHeight: document.body.clientHeight - (document.body.clientHeight / 5),
      // templateHeight: document.body.clientHeight,
      initialization: false,
      dialogLoading: false
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        this.initDataTempla(val)
        this.initUI()
        this.composeParams = {}
        setTimeout(() => {
          this.$refs['templateList'] ? this.$refs['templateList'].loadData('outside') : null
        }, 10)
        if (this.$utils.isNotEmpty(this.height)) {
          this.templateHeight = this.dataTemplate.type === 'dialog' ? this.fixHeight() : this.height
        } else {
          if (this.preview) {
            this.templateHeight = document.body.clientHeight - (document.body.clientHeight / 15)
          } else {
          // this.templateHeight = this.fixHeight()
          // window.addEventListener('resize', this.handleResize)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleResize() {
      this.templateHeight = this.fixHeight()
    },
    // 获取左右组合模板的数据模板数据
    getTemplateData(key, location) {
      this.dialogLoading = true
      getByKey({
        dataTemplateKey: key
      }).then(response => {
        const data = this.$utils.parseJSON(response.data)
        if (this.$utils.isNotEmpty(this.dataTemplate.attrs) && this.dataTemplate.attrs.script !== '') {
          if (this.$utils.isNotEmpty(data.attrs) && data.script !== '') {
            data.attrs.script = ''
          }
        }
        this.dialogLoading = false
        if (data.showType === 'list') {
          this.initData(data)
        } else {
          if (location === 'left') {
            this.lefttDataTemplate = data
          } else {
            this.rightDataTemplate = data
          }
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    callbackTemplate(data) {
      if (this.$utils.isEmpty(data)) return
      return data.templates[0]
    },
    callbackClass(data) {
      if (this.$utils.isNotEmpty(data) && (this.$utils.isNotEmpty(data.templates[0].query_columns) && data.templates[0].query_columns.length > 27)) {
        return 'special-list-height'
      } else {
        return null
      }
    },
    initDataTempla(data) {
      const location = ['left', 'right']
      data.forEach((d, i) => {
        this.getTemplateData(d.attrs.bind_template_key, location[i])
      })
    },
    fields(dataTemplate) {
      const fields = {}
      if (dataTemplate.datasets && dataTemplate.datasets.length > 0) {
        dataTemplate.datasets.forEach(dataset => {
          if (dataset.parentId !== '0') {
            fields[dataset.name] = dataset
          }
        })
      }
      return fields
    },
    handleExpandCollapse(isExpand) {
      this.treeWidth = isExpand ? 250 : 30
    },
    // 点击树节点操作
    handlerSelected(data) {
      const treeData = this.dataTemplate.composeType !== 'listTree' ? this.lefttDataTemplate : this.rightDataTemplate
      const listData = this.dataTemplate.composeType !== 'listTree' ? this.rightDataTemplate : this.lefttDataTemplate
      if (this.$utils.isEmpty(treeData.templates[0].display_columns)) {
        this.$message({
          message: '请检查是否配置显示字段！',
          type: 'warning'
        })
        return
      }
      const treeIndex = this.template.findIndex(t => t.template_type === 'composeTree')
      const treeParams = this.template[treeIndex].attrs.ref_field
      this.relatedTreeFields = treeParams
      const res = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/)
      if (res.test(data[treeData.templates[0].orig_display_columns.pid_key])) {
        this.composeParams = {}
        this.defaultData = {}
        this.initData(listData)
        setTimeout(() => {
          this.$refs['templateList'].loadData('outside')
        }, 10)
        return
      }
      if (this.$utils.isEmpty(treeParams)) {
        this.$message({
          message: '关联字段为空！',
          type: 'warning'
        })
        return
      }
      if (!data[treeParams]) {
        this.$message({
          message: '关联字段【' + treeParams + '】值为空！',
          type: 'warning'
        })
        return
      }
      const listIndex = this.template.findIndex(t => t.template_type === 'composeList')
      const listParams = this.template[listIndex].attrs.ref_field
      this.initData(listData, listParams)
      this.defaultData = data
      if (this.$utils.isEmpty(listParams)) {
        this.$message({
          message: '请检查列表模板是否配置关联字段',
          type: 'warning'
        })
        this.$refs['templateList'].loadData('outside')
        return
      }
      this.composeParams['Q^' + listParams + '^SL'] = data[treeParams]
      this.$refs['templateList'].loadData('outside')
    },
    // 点击列表节点回传【自定义对话框】
    handlerSelectedRow(selection) {
      const listData = this.dataTemplate.composeType !== 'listTree' ? this.rightDataTemplate : this.lefttDataTemplate
      this.$emit('selected', selection, listData)
    },
    clearSelection() {
      this.$refs['templateList'].clearSelection()
      this.$emit('selected', this.multiple ? [] : '')
    },
    // 匹配字段处理
    initData(data, fieldName) {
      if (data.attrs && this.$utils.isNotEmpty(data.attrs.form_key)) {
        this.dialogLoading = true
        getFormDataByFormKey({
          formKey: data.attrs.form_key
        }).then(response => {
          const formData = this.$utils.parseData(response.data)
          const datasets = buildFelds(formData.fields, data.datasets)
          data.datasets = datasets
          if (this.$utils.isNotEmpty(fieldName)) {
            const fieldsArr = FormFieldUtil.getColumns(formData.fields)
            const field = fieldsArr.find(f => f.field_name === fieldName)
            if (this.$utils.isNotEmpty(field)) {
              this.relatedListFields = field.name
            }
          }
          if (this.dataTemplate.composeType !== 'listTree') {
            this.rightDataTemplate = data
          } else {
            this.lefttDataTemplate = data
          }
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    },
    // 高度获取
    getParentEl(parentEl) {
      if (parentEl.$el && parentEl.$el.nodeName !== '#comment') {
        return this.dataTemplate.type === 'dialog' ? parentEl.$parent.$el : parentEl.$el
      } else {
        return this.getParentEl(parentEl.$parent)
      }
    },
    fixHeight() {
      const dataTemplate = this.dataTemplate
      const parentEl = this.getParentEl(this.$parent)
      const parentHeight = dataTemplate.type === 'dialog' ? this.height : parentEl.offsetHeight
      // header 高度
      var header
      let headerHeight = 0
      if (dataTemplate.type === 'dialog') {
        headerHeight = parentEl.children[0].children[0].offsetHeight || 54
      } else {
        header = parentEl.getElementsByClassName('ibps-theme-header')
        if (header && header[0]) {
          headerHeight = header[0].offsetHeight || 60
        }
      }
      // tab 高度
      var tabs
      let selectedHeight = 0
      let tabHeight = 0

      if (dataTemplate.type === 'dialog') {
        selectedHeight = parentEl.children[0].children[1].children[0].offsetHeight || 60
      } else {
        tabs = parentEl.getElementsByClassName('ibps-multiple-page-control-group')
        if (tabs && tabs[0]) {
          tabHeight = 40
        }
      }
      const otherHeight = dataTemplate.type === 'dialog' ? selectedHeight : tabHeight
      return parentHeight - headerHeight - otherHeight
    },
    initUI() {
      this.initialization = false
      if (!this.initialization) {
        this.initJComposeTemplate()
        this.initialization = true
      }
    },
    // =================================处理脚本================================
    /**
     * 初始化脚本
     */
    initJComposeTemplate() {
      const id = 'JComposeTemplate'
      let script = document.getElementById(id)
      if (script) {
        script.parentNode.removeChild(script)
      }
      if (this.dataTemplate.attrs && this.dataTemplate.attrs.script) {
        const codeScript = this.dataTemplate.attrs.script
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = id
        document.body.appendChild(script)
        try {
          script.appendChild(document.createTextNode(codeScript))
        } catch (ex) {
          console.error(ex)
          script.text = codeScript
        }
        document.body.appendChild(script)
        setTimeout(() => {
          this.loadScript()
        }, 10)
      }
    },
    // 处理脚本
    hasScript() {
      return true
    },
    // 加载脚本
    loadScript() {
      if (!this.hasScript()) {
        return
      }
      JComposeTemplate._onLoad(this)
    },
    // 前置脚本
    beforeScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      JComposeTemplate._beforeSubmit(this, action, position, selection, data, callback)
    },
    // 后置脚本
    afterScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      JComposeTemplate._afterSubmit(this, action, position, selection, data, callback)
    }
  }
}
</script>
<style lang="scss">
.template-tree-list{
  .container-component{
    position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
  }
  .tree-border,
  .east-tree{
    border:1px solid #e5e6e6{
      top: 0px;
      bottom: 0px;
    }
  }
  .east-tree{
    margin-right: 41px;
  }
  .special-list-height{
    .el-table{
      height:300px !important;
    }
  }
}
</style>
