<template>
  <div>
    <ibps-card-list
      ref="crud"
      :title="title"
      :height="height"
      :data="listData"
      :pagination="pagination"
      :pk-key="pkKey"
      :toolbars="listConfig.toolbars"
      :search-form="listConfig.searchForm"
      :columns="listConfig.columns"
      :row-handle="listConfig.rowHandle"
      :loading="loading"
      :create-text="createText"
      @action-event="handleAction"
      @sort-change="handleSortChange"
      @pagination-change="handlePaginationChange"
    >
      <template slot="east">
        <ibps-type-tree
          :width="width"
          :height="treeHeight"
          title="表单分类"
          position="east"
          category-key="BO_TYPE"
          :has-contextmenu="true"
          @node-click="handleNodeClick"
          @expand-collapse="handleExpandCollapse"
        />
      </template>
      <template slot="searchForm">
        <el-form class="search-form" inline @keyup.enter.native.stop="search">
          <el-form-item>
            <el-input v-model="searchField" placeholder="请输入" clearable class="input-with-select">
              <el-select slot="prepend" v-model="searchName" placeholder="请选择">
                <el-option label="表单名称" value="Q^name_^SL" />
                <el-option label="表单key" value="Q^key_^SL" />
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="search" />
            </el-input>
          </el-form-item>

          <el-form-item>
            <ibps-toolbar
              :actions="listConfig.toolbars"
              @action-event="handleActionEvent"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="item-symbol" slot-scope="scope">
        <i
          :class="scope.data.mode == 'bo'?'ibps-icon-table':'ibps-icon-list-alt'"
          class="symbol-icon"
        />
      </template>
    </ibps-card-list>

    <!-- 导入表单定义 -->
    <import-form
      :id="editId"
      :visible="importFormVisible"
      @callback="search"
      @close="visible => importFormVisible = visible"
    />
    <!-- 新建表单定义 -->
    <create-form
      :title="createText"
      :type-id="typeId"
      :visible="dialogFormVisible"
      @callback="search"
      @close="visible => dialogFormVisible = visible"
    />
    <!-- 复制表单定义 -->
    <copy-form
      :id="editId"
      :visible="copyDialogFormVisible"
      @callback="search"
      @close="visible => copyDialogFormVisible = visible"
    />
    <!-- 表单权限 -->
    <form-rights
      ref="formRights"
      :title="createText"
      :visible="rightsDialogFormVisible"
      :form-key="formKey"
      is-save
      @close="visible => rightsDialogFormVisible = visible"
    />
    <!-- 表单设置 -->
    <form-builder
      :id="editId"
      :visible="formbuilderDialogVisible"
      @callback="search"
      @close="visible => formbuilderDialogVisible = visible"
    />
    <!-- 表单渲染 -->
    <formrender-preview
      :visible="formrenderDialogVisible"
      :form-key="formKey"
      @close="visible => formrenderDialogVisible = visible"
    />
    <!-- 表单打印 -->
    <form-print
      :visible="formPrintDialogVisible"
      :form-key="formKey"
      @close="visible => formPrintDialogVisible = visible"
    />
  </div>
</template>
<script>
import { queryPageList, remove, exportFile } from '@/api/platform/form/formDef'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'
import FixHeight from '@/mixins/height'

export default {
  components: {
    'ibps-type-tree': () => import('@/business/platform/cat/type/tree'),
    'ibps-card-list': () => import('@/components/ibps-card-list'),
    'create-form': () => import('./create'),
    'copy-form': () => import('./copy'),
    'import-form': () => import('./import'),
    'form-rights': () => import('@/business/platform/form/form-rights'),
    'form-builder': () => import('@/business/platform/form/formbuilder/dialog'),
    'formrender-preview': () => import('@/business/platform/form/formrender/preview/index'),
    'form-print': () => import('../formPrint/list')
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 220,
      height: 500,
      title: '表单管理',
      createText: '创建表单',
      query: '',
      typeId: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      dialogFormVisible: false,
      copyDialogFormVisible: false,
      rightsDialogFormVisible: false,
      formbuilderDialogVisible: false,
      formrenderDialogVisible: false,
      importFormVisible: false,
      formPrintDialogVisible: false,

      editId: '',
      formKey: '',
      searchField: '',
      searchName: 'Q^name_^SL',

      listData: [],
      listConfig: {
        // 查询条件
        searchForm: { prop: 'Q^name_^SL', label: '表单名称' },
        // 工具栏
        toolbars: [
          { key: 'import' },
          { key: 'export' }
        ],

        // 表格字段配置
        columns: [
          { prop: 'name', label: '表单名称' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            { key: 'preview', label: '预览', icon: 'el-icon-view' },
            { key: 'edit', label: '编辑', icon: 'ibps-icon-edit', divided: true },
            { key: 'remove', label: '删除', icon: 'ibps-icon-remove' },
            { key: 'copy', label: '复制', icon: 'ibps-icon-copy' },
            { key: 'rights', label: '表单权限', icon: 'ibps-icon-cog', divided: true },
            { key: 'print', label: '表单打印', icon: 'ibps-icon-print' }
          ]
        }
      },
      pagination: {},
      sorts: {}
    }
  },
  computed: {
    treeHeight() {
      return this.height - 75
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = {}
      if (this.$utils.isNotEmpty(this.searchField)) {
        params[this.searchName] = this.searchField
      }
      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }

      return ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    /**
     * 查询
     */
    search() {
      this.loadData()
    },
    /**
     * @description 处理按钮的事件 【包含增删改查】
     * @param {*} buttonKey
     * @param {*} position
     * @param {*} data
     */
    handleActionEvent(action, position, data, index) {
      const buttonKey = action.key
      let selection = []
      if (this.$refs.crud) {
        selection = this.$refs.crud.getSelectedIds()
      }
      this.handleAction(buttonKey, position, selection, data)
    },
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'add':// 添加
          this.dialogFormVisible = true
          break
        case 'edit':// 编辑
          this.handleEdit(selection)
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'import':// 导入
          this.handleImport()
          break
        case 'export':// 导出
          ActionUtils.selectedMultiRecord(selection).then((ids) => {
            this.handleExport(ids)
          }).catch(() => { })
          break
        case 'preview':// 预览
          this.handlePreview(data.key)
          break
        case 'copy':// 复制
          this.handleCopy(selection)
          break
        case 'rights':// 权限
          this.createText = '表单权限'
          this.handleFormRights(data.key)
          this.$nextTick(() => { this.$refs['formRights'].getFormData() })
          break
        case 'print':// 打印
          this.handlePrint(data.key)
          break
      }
    },
    handleImport() {
      this.importFormVisible = true
    },
    handleExport(ids) {
      const loading = this.$loading('导出中...')
      exportFile({ formDefIds: ids }).then((response) => {
        loading.close()
        if (!response) {
          return
        }

        ActionUtils.exportFile(
          response.data,
          'formDef_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
        )
      }).catch(() => {
        loading.close()
      })
    },
    handleEdit(id) {
      this.formbuilderDialogVisible = true
      this.editId = id
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ formDefIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    handleNodeClick(typeId) {
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 200 : 30
    },
    handlePreview(formKey) {
      this.formrenderDialogVisible = true
      this.formKey = formKey
    },
    handleCopy(id) {
      this.copyDialogFormVisible = true
      this.editId = id
    },
    handleFormRights(formKey) {
      this.rightsDialogFormVisible = true
      this.formKey = formKey
    },
    handlePrint(formKey) {
      this.formPrintDialogVisible = true
      this.formKey = formKey
    }
  }
}
</script>
