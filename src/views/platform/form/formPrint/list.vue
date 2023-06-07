<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-print-dialog"
    fullscreen
    append-to-body
    @open="loadData"
    @close="closeDialog"
  >
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
      <template slot="item-symbol" slot-scope="scope">
        <i
          :key="scope.id"
          :class="'ibps-icon-table'"
          class="symbol-icon"
        />
      </template>
    </ibps-card-list>
    <edit-print
      :id="editId"
      :visible="dialogFormVisible"
      :form-key="formKey"
      @close="dialogFormVisible = false"
      @callback="search"
    />

    <form-print-template
      :id="editId"
      :visible="formPrintTemplateDialogVisible"
      @close="visible => formPrintTemplateDialogVisible = visible"
    />
  </el-dialog>
</template>
<script>
import EditPrint from './edit'
import { queryPageList, remove } from '@/api/platform/form/formPrint'
import ActionUtils from '@/utils/action'
import IbpsCardList from '@/components/ibps-card-list'
import FormPrintTemplate from '@/business/platform/form/form-print/template'

export default {
  components: {
    IbpsCardList,
    EditPrint,
    FormPrintTemplate
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formKey: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogFormVisible: false,
      formPrintTemplateDialogVisible: false,
      width: 200,
      height: 500,
      title: '表单打印管理',
      createText: '创建表单打印模版',
      query: '',
      typeId: '',
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
      editId: '',
      listData: [],
      listConfig: {
        // 查询条件
        searchForm: { prop: 'Q^name_^SL', label: '模版名称' },
        // 工具栏
        toolbars: [
          { key: 'close', type: 'primary' }
        ],

        // 表格字段配置
        columns: [
          { prop: 'name', label: '模版名称' }
        ],
        // 管理列
        rowHandle: {
          actions: [
            { key: 'preview', label: '预览', icon: 'el-icon-view' },
            { key: 'edit', label: '编辑', icon: 'ibps-icon-edit', divided: true },
            { key: 'remove', label: '删除', icon: 'ibps-icon-remove' }
            // { key: 'copy', label: '复制', icon: 'ibps-icon-copy' }
          ]
        }
      },
      pagination: {},
      sorts: {}
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
    closeDialog() {
      this.$emit('close', false)
    },
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
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      params['Q^FORM_KEY_^S'] = this.formKey
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
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          ActionUtils.setFirstPagination(this.pagination)
          this.search()
          break
        case 'add':// 添加
          this.handleEdit()
          break
        case 'edit':// 编辑
          this.handleEdit(selection)
          break
        case 'remove':// 删除
          ActionUtils.removeRecord(selection).then((ids) => {
            this.handleRemove(ids)
          }).catch(() => { })
          break
        case 'preview':// 预览
          this.handlePreview(selection)
          break
        case 'copy':// 复制
          this.handleCopy()
          break
        case 'close':// 关闭
          this.closeDialog()
          break
      }
    },
    /**
     * 编辑
     */
    handleEdit(id) {
      this.dialogFormVisible = true
      this.editId = id
    },
    /**
     * 处理删除
     */
    handleRemove(ids) {
      remove({ formPrintTemplateIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {})
    },
    handlePreview(id) {
      this.editId = id
      this.formPrintTemplateDialogVisible = true
    }
  }
}
</script>
<style lang="scss">
  .form-print-dialog{
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding: 10px;
    }

    .ibps-container-full__header {
      border-bottom: 1px solid #cfd7e5;
      background: #FFF;
      padding-bottom: 10px;
    }
    .ibps-container-full__body{
      padding-top: 10px;
    }
  }
</style>

