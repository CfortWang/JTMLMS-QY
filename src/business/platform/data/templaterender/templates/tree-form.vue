<template>
  <ibps-layout
    ref="layout"
    v-loading.fullscreen.lock="dialogLoading"
    :element-loading-text="$t('common.loading')"
    class="template-tree-list template-tree-form"
  >
    <div slot="west">
      <div
        ref="ibpsTree"
        :style="{width:treeWidth+'px'}"
      >
        <div
          ref="header"
          :class="['layout-header--' +$ELEMENT.size]"
          class="layout-header"
        >
          <div
            v-show="isExpand"
            :style="{width:treeWidth-55+'px'}"
            class="layout-header-title-left ibps-ellipsis"
          >{{ dataTemplate.name }}
          </div>
          <div
            v-if="angleDouble"
            class="layout-header-tools-left"
          >
            <el-tooltip
              :content="isExpand?'收缩':'展开'"
              placement="bottom-start"
            >
              <a
                herf="javascript:void(0);"
                class="pinBtn"
                @click="handleExpandCollapse"
              >
                <ibps-icon :name="isExpand ? 'angle-double-left' : 'angle-double-right' " />
              </a>
            </el-tooltip>
          </div>
        </div>
        <div v-if="toolbars&&isExpand" ref="toolbar" class="ibps-tree-toolbar">
          <ibps-toolbar
            :actions="toolbars"
            type="icon"
            @action-event="handleTreeAction"
          />
        </div>
        <div
          v-show="isExpand"
          class="ibps-tree-search-form"
        >
          <el-row>
            <el-col :span="17">
              <el-input
                v-model="filterText"
                placeholder="输入关键字进行过滤"
                class="ibps-tree-search-input"
              />
            </el-col>
            <el-col :span="6">
              <el-button type="primary" class="ibps-tree-search-buttom ibps-icon ibps-icon-search" @click="filter">查询</el-button>
            </el-col>
          </el-row>
          <!-- size="small"  -->
        </div>
        <div
          :style="{ height: treeHeight + 'px'}"
          class="ibps-tree-content"
        >
          <el-scrollbar
            style="height: 100%;"
            wrap-class="ibps-tree-wrapper"
          >
            <template v-if="templateType==='dialog'">
              <!-- 多选-->
              <el-tree
                v-if="multiple"
                ref="elTree"
                v-loading="loading"
                :class="$utils.isEmpty(treeData)||!hasResult?'init-style':''"
                :data="treeData"
                :expand-on-click-node="false"
                :props="{ children:childrenKey, label: nameKey}"
                :show-checkbox="multiple"
                :check-strictly="true"
                :filter-node-method="filterNode"
                :node-key="pkKey"
                :pid-key="pidKey"
                highlight-current
                check-on-click-node
                @check-change="handleCheckChange"
                @node-contextmenu="handleNodeContextmenu"
              />
              <!-- 单选-->
              <el-tree
                v-else
                ref="elTree"
                v-loading="loading"
                :class="$utils.isEmpty(treeData)||!hasResult?'init-style':''"
                :data="treeData"
                :expand-on-click-node="false"
                :props="{ children: childrenKey, label: nameKey}"
                :show-checkbox="multiple"
                :filter-node-method="filterNode"
                :node-key="pkKey"
                :pid-key="pidKey"
                highlight-current
                @node-click="onNodeClick"
                @node-contextmenu="handleNodeContextmenu"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <el-radio v-model="radio" :label="data[pkKey]" :disabled="data.disabled" @change="changeRadio(data)">{{ node.label }}</el-radio>
                </span>
              </el-tree>
            </template>
            <template v-else>
              <!--默认模版-->
              <el-tree
                v-if="isExpand"
                ref="elTree"
                v-loading="loading"
                :class="$utils.isEmpty(treeData)||!hasResult?'init-style':''"
                :data="treeData"
                :props="{ children: childrenKey, label: nameKey}"
                :check-strictly="true"
                :filter-node-method="filterNode"
                :node-key="pkKey"
                :pid-key="pidKey"
                :default-expand-all="template?template.attrs.expand === 'Y':true"
                highlight-current
                @node-click="onNodeClick"
                @node-contextmenu="handleNodeContextmenu"
              />
            </template>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <ibps-container
      :margin-left="isExpand?'300px':'30px'"
      class="page"
    >
      <template v-if="$utils.isNotEmpty(formKey)">
        <data-template-formrender
          v-if="$utils.isNotEmpty(buttonsKey)"
          ref="formrender"
          :form-key="formKey"
          :default-data="defaultFormData"
          :pk-value="pkValue"
          :toolbars="editToolbars"
          :readonly="readonly"
          class="tree-form-edit"
          @callback="search"
          @close="close => buttonsKey = ''"
        />
        <el-alert
          v-else
          :closable="false"
          title="尚未指定一个节点"
          type="warning"
          show-icon
          style="height:50px;width:97%; margin:10px 0 0 10px;"
        />
      </template>
      <template v-else>
        <el-alert
          :closable="false"
          title="请绑定表单"
          type="warning"
          show-icon
          style="height:50px;width:97%; margin:10px 0 0 10px;"
        />
      </template>
    </ibps-container>
    <!--右键菜单-->
    <ibps-contextmenu
      v-if="contextmenus"
      ref="contextmenu"
      :visible.sync="contextmenuFlag"
      :menulist="contextmenuList"
      :x="contentmenuX"
      :y="contentmenuY"
      :z-index="zIndex"
    >
      <ibps-contextmenu-list
        :menulist="contextmenuList"
        :color-filters="colorFilters"
        @row-click="handleContextmenuClick"
      />
    </ibps-contextmenu>
  </ibps-layout>
</template>
<script>
import { queryTreeData, removeFormData } from '@/api/platform/data/dataTemplate'
import { getScriptValue } from '@/api/platform/form/common.js'
import ButtonsConstants, { hasButton } from '@/business/platform/data/constants/buttons'
import TreeUtils from '@/utils/tree'
import ActionUtils from '@/utils/action'
import PopupManager from '@/utils/popup'
import { camelCase } from 'lodash'

import IbpsContextmenu from '@/components/ibps-contextmenu'
import IbpsContextmenuList from '@/components/ibps-contextmenu/components/contentmenu-list'
import JTreeTemplate from '../utils/JTreeTemplate'// 自定义脚本
import DataTemplateFormrender from '../form/index'

export default {
  name: 'tree-form',
  components: {
    DataTemplateFormrender,
    IbpsContextmenu,
    IbpsContextmenuList
  },
  props: {
    title: String,
    angleDouble: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'west'
    },
    // width: {
    //   type: Number,
    //   default: 300
    // },
    // height: {
    //   type: Number,
    //   default: 400
    // },
    dataTemplate: Object,
    template: Object,
    dynamicParams: Object,
    value: [String, Number, Array, Object],
    showContextmenus: {
      type: Boolean,
      default: true
    },
    combination: {
      type: Boolean,
      default: false
    },
    multiple: Boolean,
    fields: Object
  },
  data() {
    return {
      loading: false,
      dialogLoading: false,
      treeData: [],
      toolbars: [],
      contextmenus: [],
      colorFilters: [
        { type: 'default', color: '#606266' },
        { type: 'primary', color: '#409EFF' },
        { type: 'success', color: '#67C23A' },
        { type: 'info', color: '#909399' },
        { type: 'warning', color: '#E6A23C' },
        { type: 'danger', color: '#F56C6C' }
      ],
      options: {
        emptyText: '未设置显示字段'
      },
      treeWidth: 300,
      buttonsKey: '',
      radio: '',
      rootTreeId: '',
      rootTreeName: '',
      pkKey: 'id',
      pidKey: 'parentId',
      childrenKey: '___children',
      nameKey: '',
      filterText: '',
      treeHeight: document.body.clientHeight - (document.body.clientHeight / 6.5),

      isExpand: true,
      // 右键菜单数据
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuData: {},
      contextmenuList: [],
      zIndex: 2003,

      pkValue: '',
      readonly: false,
      dialogFormVisible: false,
      editButtons: [], // 表单按钮
      editToolbars: [],
      filterConditionKey: '',
      defaultFormData: {}, // 默认表单数据
      initialization: false,
      hasResult: true
    }
  },
  computed: {
    templateType() {
      if (this.dataTemplate.showType === 'compose') {
        // TODO:
        return null
      } else {
        return this.dataTemplate.type
      }
    },
    formKey() {
      return this.dataTemplate.attrs ? this.dataTemplate.attrs.form_key || '' : ''
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template) { return }
        this.isExpand = false
        setTimeout(() => {
          this.isExpand = true
        }, 10)
        if (this.template.display_columns) {
          this.rootTreeId = this.template.display_columns.root_pid
          // this.rootTreeName = this.template.display_columns.root_label
          this.rootTreeName = ''
          this.filterRootTreeName()

          this.pkKey = this.template.display_columns.id_key
          this.pidKey = this.template.display_columns.pid_key
          this.nameKey = this.template.display_columns.name_key
        }
        const toolbarButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
        // 工具栏
        const toolbars = []
        toolbarButtons.forEach(button => {
          const btn = {}
          btn.key = button.button_type
          btn.label = button.label
          if (button.icon) {
            btn.icon = 'ibps-icon ibps-icon-' + button.icon
          }
          if (button.style) {
            btn.type = button.style
          }
          toolbars.push(btn)
        })

        this.toolbars = toolbars

        // 右键菜单
        // const contextmenuButtons = this.template.buttons ? this.template.buttons.contextmenu_buttons || [] : []
        const contextmenuButtons = this.showContextmenus ? this.template.buttons ? this.template.buttons.contextmenu_buttons || [] : [] : []
        const contextmenus = []
        contextmenuButtons.forEach(button => {
          const btn = this.buildButton(button)
          btn.icon = btn.icon ? btn.icon.substr(10, btn.icon.length) : ''
          btn.value = btn.key // TODO:自定义按钮事件处理
          contextmenus.push(btn)
        })

        this.contextmenus = contextmenus
        if (this.contextmenus && this.contextmenus.length > 0) {
          this.fixZIndex()
        }
        this.editButtons = this.template.buttons ? this.template.buttons.edit_buttons || [] : []

        this.initUI()
        this.loadData()
        this.buttonsKey = ''
      },
      immediate: true
    },
    value(val, oldVal) {
      if (this.$utils.isEmpty(val)) {
        // this.$refs['tree'].clearSelection()
        if (this.multiple) {
          oldVal.forEach(data => {
            this.$refs.elTree.setChecked(data[this.pkKey], false)
          })
        } else {
          this.$refs.elTree.setChecked(oldVal[this.pkKey], false)
          this.radio = ''
        }
      } else {
        if (this.multiple) {
          if (val.length < oldVal.length) {
            oldVal.forEach(row => {
              const index = val.find(item => { return item[this.pkKey] === row[this.pkKey] })
              if (!index) {
                this.$refs['elTree'].setChecked(row[this.pkKey], false)
              }
            })
          }
        }
      }
    }
  },
  methods: {
    filterRootTreeName() {
      const display_columns = this.template.display_columns
      const is_script = display_columns.is_script
      if (is_script) {
        getScriptValue({
          script: display_columns.root_label,
          // vars: JSON.stringify(vars) || ''
          vars: ''
        }).then(res => {
          this.rootTreeName = res.data
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.rootTreeName = display_columns.root_label
      }
    },
    initUI() {
      this.initialization = false
      if (!this.initialization) {
        this.initJTreeTemplate()
        this.initialization = true
        setTimeout(() => {
          this.loadScript()
        }, 10)
      }
    },
    /**
     * zxh 修复zindex 不是最高的被遮住
     */
    fixZIndex() {
      this.zIndex = PopupManager.getZIndex()
    },
    loadData() {
      this.loading = true
      if (!this.template.display_columns) {
        this.$message({
          message: '未配置显示字段!',
          type: 'warning'
        })
        this.loading = false
        return
      }
      queryTreeData(this.getFormatParams()).then(response => {
        const data = response.data
        if (this.$utils.isNotEmpty(this.rootTreeName)) {
          data.unshift({
            [this.pkKey]: this.rootTreeId,
            [ this.nameKey]: this.rootTreeName,
            [this.pidKey]: this.$utils.guid()
          })
        }
        this.treeData = TreeUtils.transformToTreeFormat(data, {
          idKey: this.pkKey,
          pIdKey: this.pidKey,
          nameKey: this.nameKey,
          childrenKey: this.childrenKey
        })

        this.loading = false
        this.$nextTick(function() {
          this.initCheck()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getFormatParams() {
      let formParams = {}
      if (this.$refs['searchForm']) {
        formParams = this.$refs['searchForm'].getSearcFormData() || {}
      }
      const responseData = JSON.parse(JSON.stringify(this.template))
      responseData.datasetKey = this.dataTemplate.datasetKey
      responseData.unique = this.pkKey
      responseData['dynamic_params'] = this.dynamicParams
      formParams['response_data'] = JSON.stringify(responseData)
      formParams['filter_condition_key'] = this.filterConditionKey
      return ActionUtils.formatParams(formParams, null, this.sorts)
    },
    search() {
      this.readonly = true
      this.loadData()
      this.editToolbars = [{ button_type: 'close', label: '关闭', type: 'default', notInit: true }]
    },
    /**
     * 初始化默认选中状态
     */
    initCheck() {
      if (this.$utils.isNotEmpty(this.value)) {
        if (this.multiple) {
          Array.isArray(this.value) && this.value.forEach(data => {
            const pkKey = typeof data === 'string' ? data : data[this.pkKey]
            this.$refs.elTree.setChecked(pkKey, true)
          })
        } else {
          if (Array.isArray(this.value)) { return }
          const pkKey = typeof this.value === 'string' ? this.value : this.value[this.pkKey]
          this.$refs.elTree.setChecked(pkKey, true)
        }
      }
    },
    filter() {
      this.$refs.elTree.filter(this.filterText)
    },
    filterNode(value, data) {
      this.hasResult = data[this.nameKey].indexOf(value) !== -1
      if (!value) return true
      return data[this.nameKey].indexOf(value) !== -1
    },
    handleTreeAction(action, position, selection, data) {
      const command = action.key
      if (position === 'toolbar' && command === 'refresh') {
        this.loadData()
      }
      if (command === 'expand') {
        this.expandCompressTree(true)
      } else if (command === 'compress') {
        this.expandCompressTree(false)
      }
    },
    expandCompressTree(expanded) {
      for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
        this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
      }
    },
    /**
     * 清空选择的
     */
    clearSelection() {
      if (this.multiple) {
        this.$refs.elTree.setCheckedKeys([])
      } else {
        this.radio = ''
      }
    },
    handleCheckChange(data, checked) {
      const checkedNodes = this.$refs.elTree.getCheckedNodes()
      const result = []
      checkedNodes.forEach(node => {
        if (node[this.pkKey] !== this.rootTreeId) {
          delete node[this.childrenKey]
          result.push(node)
        }
      })
      this.$emit('selected', result)
    },
    changeRadio(data) {
      if (data[this.pkKey] === this.rootTreeId) return
      const result = JSON.parse(JSON.stringify(data))
      delete result[this.childrenKey]
      this.$emit('selected', result)
    },
    onNodeClick(data, node, obj) {
      this.radio = data[this.pkKey]
      this.$emit('selected', data)
      const res = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/)
      if (!res.test(data[this.pidKey])) {
        this.handleEdit(data[this.pkKey], 'detail')
        this.buttonsKey = 'detail'
        this.loadFormData()
      }
    },
    loadFormData() {
      this.$nextTick(() => {
        this.$refs.formrender.loadFormData()
      })
    },
    /**
     * 处理节点右键菜单
     */
    handleNodeContextmenu(event, data) {
      if (!this.contextmenus || this.contextmenus.length === 0) return
      let target = event.target
      let flag = false
      if (target && (target.className.indexOf('el-tree-node__content') > -1 ||
      target.className.indexOf('ibps-custom-tree-node') > -1)) {
        flag = true
      } else if (target && (target.parentNode.className.indexOf('el-tree-node__content') > -1 ||
      target.parentNode.className.indexOf('ibps-custom-tree-node') > -1)) {
        target = target.parentNode
        flag = true
      }
      if (flag) {
        event.preventDefault()
        event.stopPropagation()
        this.handleContextmenuList(data)
        this.contextmenuData = data
        this.contextmenuFlag = true
        this.handleReferenceContextmenu(event)
      }
    },
    filterContextmenuList(menu) {
      const pk = this.template.display_columns.pid_key
      let str
      let arr = []
      for (var m in menu) {
        if (pk === m) {
          str = menu[m]
        }
      }
      const res = new RegExp(/^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/)
      if (this.$utils.isNotEmpty(str) && res.test(str)) {
        const index = this.contextmenus.findIndex(c => c.button_type === 'add')
        index > -1 ? arr.push(this.contextmenus[index]) : arr = []
      } else if (!res.test(str)) {
        arr = this.contextmenus
      }
      return arr
    },
    handleContextmenuList(data) {
      this.contextmenuList = []
      const isRoot = data[this.pidKey] === this.rootTreeId
      const contextmenus = this.filterContextmenuList(data)
      contextmenus.forEach((menu) => {
        if (!menu.rights) {
          this.contextmenuList.push(menu)
        } else {
          if (Array.isArray(menu.rights)) {
            if (menu.rights.indexOf('node') > -1 && !isRoot) {
              this.contextmenuList.push(menu)
            }
          } else if (typeof menu.rights === 'function') {
            if (menu.rights.call(this, menu, data, isRoot)) {
              this.contextmenuList.push(menu)
            }
          }
        }
      })
    },
    // 处理菜单位置
    handleReferenceContextmenu(event) {
      const eventX = event.pageX
      const eventY = event.pageY
      this.$nextTick(() => {
        const contextmenuPosition = {
          top: eventY,
          left: eventX
        }
        if (this.autoPlacement) {
          const el = this.$refs.contextmenu.$el
          const contextmenuWidth = el.clientWidth
          const contextmenuHeight = el.clientHeight
          if (contextmenuHeight + eventY >= window.innerHeight) {
            contextmenuPosition.top -= contextmenuHeight
          }
          if (contextmenuWidth + eventX >= window.innerWidth) {
            contextmenuPosition.left -= contextmenuWidth
          }
        }

        this.contentmenuX = contextmenuPosition.left
        this.contentmenuY = contextmenuPosition.top
      })
    },
    // 增删改查表单处理
    handleContextmenuClick(command) {
      this.contextmenuFlag = false
      this.handleAction(command, 'contextmenu', this.contextmenuData[this.pkKey], this.contextmenuData)
    },
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'add':// 添加
        case 'edit':// 编辑
        case 'detail':// 明细
          this.buttonsKey = command
          this.readonly = false
          this.handleEdit(selection, command)
          this.loadFormData()
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            if (data.___children && data.___children.length > 0) {
              this.$message({
                message: '请先删除子节点',
                type: 'warning'
              })
              return
            }
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'custom':// 自定义按钮
          // TODO: 自定义按钮事件
          break
        default:
          break
      }
    },
    getDefaultFormData(selection) {
      const parentIdField = this.fields[this.pidKey] || {}
      const pidKey = parentIdField ? this.combination ? camelCase(parentIdField.name) : parentIdField.form_field_name || this.pidKey : this.pidKey // 如果不是就按命名规律
      return {
        [pidKey]: selection
      }
    },
    /**
     * 添加、编辑表单
     */
    handleEdit(selection, action) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      this.defaultFormData = action === 'add' ? this.getDefaultFormData(selection) : null
      this.readonly = action === 'detail'
      const editToolbars = []
      this.editButtons.forEach(rf => {
        const btn = this.buildButton(rf)
        // 编辑页顶部按钮
        if (hasButton(rf.button_type, action === 'detail' ? 'detail' : 'edit', rf.position)) {
          editToolbars.push(btn)
        }
      })
      this.editToolbars = editToolbars
      this.pkValue = action === 'add' ? null : (selection || '')
      this.dialogFormVisible = true
    },
    /**
     * 构建按钮
     */
    buildButton(rf, i) {
      const defaultButton = ButtonsConstants[rf.button_type] || {}
      let key = rf.button_type

      if (rf.button_type === 'custom') {
        key = rf.code ? rf.code : 'custom' + i
      }
      if (rf.button_type === 'sefStartFlow') {
        key = rf.code ? rf.code : 'sefStartFlow' + i
      }
      if (rf.button_type === 'export') {
        rf.menus = ButtonsConstants[rf.button_type].menus
      }
      return {
        '$index': i,
        key: key,
        button_type: rf.button_type,
        code: rf.code,
        label: rf.label || defaultButton.style,
        icon: rf.icon ? 'ibps-icon-' + rf.icon : defaultButton.icon,
        type: rf.style || defaultButton.type,
        deflow: rf.deflow || null
      }
    },
    handleExpandCollapse() {
      this.isExpand = !this.isExpand
      this.treeWidth = this.isExpand ? 300 : 30
    },
    /**
     * 删除表单
     */
    handleRemove(ids) {
      if (this.$utils.isEmpty(this.formKey)) {
        ActionUtils.warning('请绑定表单')
        return
      }
      removeFormData({
        formKey: this.formKey,
        ids: ids
      }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {
      })
    },
    // =================================处理脚本================================
    /**
     * 初始化脚本
     */
    initJTreeTemplate() {
      const id = 'JTreeTemplate'
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
      JTreeTemplate._onLoad(this)
    },
    // 前置脚本
    beforeScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      JTreeTemplate._beforeSubmit(this, action, position, selection, data, callback)
    },
    // 后置脚本
    afterScript(action, position, selection, data, callback) {
      if (!this.hasScript()) {
        const flag = true
        callback(flag)
        return
      }
      JTreeTemplate._afterSubmit(this, action, position, selection, data, callback)
    }
  }
}
</script>
<style lang="scss" >
$border-color: #e5e6e7;
.template-tree-form{
  .container-component{
    overflow: hidden;
    overflow-y: scroll;
  }
  .ibps-container-full__body{
    padding:0 !important;
  }
}
.template-tree-list{
  padding:0 !important;
  .layout-header {
    background: #e7eaec;
    height: 35px;
    border-left: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    font-weight: bold;
    text-align: center;
    padding: 5px;
    position: relative;
    overflow: hidden;
    &--medium {
      height: 40px;
    }
    &--small {
        height: 35px;
    }
    &--mini {
        height: 30px;
    }
    .layout-header-title-left {
      float: left;
      text-align: left;
      font-size: 14px;
      margin: 10px 5px 5px;
      padding: 0;
    }
    .layout-header-title-right {
      float: right;
      text-align: right;
      font-size: 14px;
      margin: 10px 5px 5px;
      padding: 0;
    }
    .layout-header-tools-left {
      float: right;
      margin-top: 5px;
      position: relative;
      padding: 0;
      .pinBtn {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
        font-size: 25px;
      }
    }
    .layout-header-tools-right {
      float: left;
      margin-top: 5px;
      position: relative;
      padding: 0;
      .pinBtn {
        cursor: pointer;
        margin-left: 5px;
        color: #c4c4c4;
        font-size: 25px;
      }
    }
  }
  .ibps-show {
    height: 42px;
    background: white;
  }
  .ibps-tree-toolbar {
    border: 1px solid $border-color;
    height: 35px;
    padding: 5px;
  }

  .ibps-tree-search-form {
    padding: 5px;
    border-right: 1px solid $border-color;
    background: #ffffff;
    // .ibps-tree-search-input{
      // width:72%
    // }
    .ibps-tree-search-buttom{
      margin-left: 6px;
      width:74px;
      height:34px;
      font-size: 14px;
    }
  }
  .ibps-tree-content{
    border-right: 1px solid $border-color;
  }
  .ibps-tree-main {
    border: 1px solid $border-color;
  }
  .ibps-tree-wrapper {
    background: #ffffff;
    .el-tree {
      display: inline-block;
    }
  }
  .ibps-custom-tree-node {
    font-size: 14px;
    padding-right: 8px;
  }
  .init-style{
    width:100%;
  }

  .tree-form-edit{
    .form-toolbar{
      top:auto!important;
      z-index:999!important;
    }
    .edui-default .edui-editor{
      z-index:999!important;
    }
    .ibps-fr-important{
      float: left !important;
    }
  }

}
</style>
