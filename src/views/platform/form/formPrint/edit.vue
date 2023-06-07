<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="form-print-edit-dialog"
      fullscreen
      append-to-body
      :show-close="false"
      @open="getFormData"
      @close="closeDialog"
    >
      <div
        v-if="dialogVisible"
        v-loading.fullscreen.lock="dialogLoading"
        :element-loading-text="$t('common.loading')"
      >
        <el-row class="print-header">
          <el-col :span="8">
            <div class="print-title_editor">
              <el-input v-model="formData.name" placeholder="请输入标题" />
            </div>
          </el-col>
          <el-col :span="16" class="ibps-tr">
            <el-button type="primary" icon="ibps-icon-save" @click="hanleSave">保存</el-button>
            <el-button icon="ibps-icon-close" @click="closeDialog">关闭</el-button>
          </el-col>
        </el-row>
        <el-row

          class="hot-table-wrap"
        >
          <el-col :span="4">
            <el-tabs v-model="activeName" class="hot-card" type="border-card">
              <el-tab-pane label="表单字段" name="formField">
                <el-scrollbar
                  :style="{
                    height:(ibpsDialogHeight-115)+'px'
                  }"
                >
                  <div class="ibps-p-5">
                    <template v-for="(item,i) in formFields">
                      <div v-if="item.field_type === 'table'" :key="item.id+i">
                        <el-divider class="ibps-mt-5 ibps-mb-5" />
                        <div class="print-field-subform">
                          <i class="ibps-icon-table" /><span>{{ item.label }}</span>
                        </div>
                        <div :key="item.id" class="subform-item">
                          <div
                            v-for="column in item.children"
                            :key="column.id"
                          >
                            <i class="ibps-icon-minus icon-subform-turn" />
                            <li
                              class="print-field-item"
                              draggable
                              @dragstart="onDragStart($event,column)"
                              @dragend="onDragEnd"
                            >
                              <i :class="getIcon(column.field_type)" /><span>{{ column.label }}</span>
                            </li>
                          </div>
                        </div>
                      </div>
                      <li
                        v-else
                        :key="item.id"
                        class="print-field-item"
                        draggable
                        @dragstart="onDragStart($event, item)"
                        @dragend="onDragEnd"
                      >
                        <i :class="getIcon(item.field_type)" /><span>{{ item.label }}</span>
                      </li>
                    </template>
                  </div>

                </el-scrollbar>
              </el-tab-pane>
              <!-- <el-tab-pane label="流程字段" name="flowField">
                <ul class="field-list">
                  <li
                    v-for="item in flowFields"
                    :key="item.name"
                    class="print-field-item"
                    draggable
                    @dragstart="onDragStart($event,item)"
                    @dragend="onDragEnd"
                  >
                    <i :class="item.icon" />
                    <span>{{ item.label }}</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="系统字段" name="systemField">
                <ul class="field-list">
                  <li class="print-field-item"><i class="el-icon-menu" /><span>条形码</span></li>
                </ul>
              </el-tab-pane> -->
            </el-tabs>
          </el-col>
          <el-col :span="20">
            <div class="hot-table-content">
              <!--工具栏-->
              <menu-tools
                ref="menu"
                @menu-click="onMenuClick"
              />
              <div
                class="hot-table-wrap"
              >
                <hot-table
                  ref="hotTableComponent"
                  :root="root"
                  :settings="hotSettings"
                  license-key="non-commercial-and-evaluation"
                  @drop.native.prevent="onDrop"
                  @dragover.prevent.native
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <print-page
      :visible="printPageVisible"
      :data="printPageData"
      :dpi="dpi"
      @close="handlePage"
    />
  </div>
</template>
<script>
import { save, get } from '@/api/platform/form/formPrint'
import { getFields } from '@/api/platform/form/formDef'
import { getImage } from '@/api/platform/file/attachment'
import fieldTypes from '@/business/platform/form/constants/fieldTypes'
import 'handsontable/dist/handsontable.full.css'
import { HotTable } from '@handsontable/vue'
// import Handsontable from 'handsontable'
// import VueDraggable from 'vuedraggable'

import PrintUtils from './utils/printUtils'
import DialogHeight from '@/mixins/dialogHeight'
import ActionUtils from '@/utils/action'
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'
import MenuTools from './components/menu-tools'

import PrintPage from './components/print-page'

export default {
  components: {
    MenuTools,
    PrintPage,
    HotTable
  },
  mixins: [DialogHeight],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: String,
    formKey: String
  },
  data() {
    return {
      dialogVisible: this.visible,
      dialogLoading: true,
      ibpsDialogHeight: 400,
      activeName: 'formField',
      formFields: [],
      flowFields: [{
        field_type: 'flow',
        name: 'flow_diagram',
        icon: 'ibps-icon-image',
        label: '流程图'
      }, {
        field_type: 'flow',
        name: 'approval_history',
        icon: 'ibps-icon-list-alt',
        label: '审批历史'
      }],
      systemFields: [{
        field_type: 'system',
        name: 'system_barcode',
        label: '条形码'
      }, {
        field_type: 'system',
        name: 'system_qrcode',
        label: '二维码'
      }],

      root: 'hot',
      hotSettings: {},

      formData: {
        name: '未命名模版',
        content: {}
      },

      defaultForm: {
        content: {
          'page': {
            'size': 'A4',
            'layout': 'portrait',
            'margin': [
              72.188934,
              67.2756
            ]
          },
          'header': {
            'columns': [],
            'margin': 18.8976
          },
          'footer': {
            'columns': [],
            'margin': 18.8976
          },
          'background': {
            'printable': false
          },
          'default': {
            'col_width': 100,
            'row_height': 24
          },
          'global': {
            'auto_cell_height': false
          },
          'cols': [],
          'rows': [],
          'range': {
            's': '0:0',
            'e': '0:0'
          },
          'styles': {
            'default': {
              'font-family': 'SimSun',
              'font-size': 12,
              'font-style': 'normal',
              'font-weight': 'normal',
              'color': '#000',
              'line-height': 14.4,
              'text-align': 'left',
              'vertical-align': 'top',
              'text-decoration': [],
              'opacity': 1,
              'padding': [
                4
              ],
              'border-style': 'none',
              'border-width': 1,
              'border-color': '#000'
            }
          },
          'dpi': {
            'design': 96,
            'print': 72
          },
          'watermark': {},
          'cells': {},
          'merge': {},
          'images': {}
        },
        name: '未命名模版'
      },

      tableOptions: {
        rowHeaderWidth: 50,
        columnHeaderHeight: 30,
        rowHeight: 24,
        colWidth: 100,
        onAfterChange: null,
        onAfterSelect: null,
        colHeaders: true,
        rowHeaders: true,
        hasEditor: true,
        hasPaperBorder: true,
        minRows: 100,
        minCols: 25,
        maxRows: 200,
        maxCols: 50,
        rows: [],
        cols: [],
        style: {},
        image: {}
      },
      // 页眉页脚数据
      pageValue: {},
      // 表格数据
      tableValue: {},
      defaultValue: {
        rows: [],
        cols: [],
        merge: {},
        images: {},
        cells: {},
        styles: {},
        background: {},
        page: {
          size: 'A4',
          layout: 'portrait'
        }
      },
      currentCell: null,
      fieldNameMap: [],
      // 表格数据
      tableData: null,

      dataMap: {},
      imageMap: {},
      styleMap: {},
      fieldMap: {},
      borderState: {},
      printUtils: null,

      dpi: {
        'design': 96,
        'print': 72
      },
      DEFAULT_STYLE: {
        'font-family': 'SimSun',
        'font-size': 12,
        'font-style': 'normal',
        'font-weight': 'normal',
        'color': '#000',
        'line-height': 14.4,
        'padding': [4],
        'text-align': 'left',
        'vertical-align': 'middle',
        'text-decoration': [],
        'opacity': 1,
        'border-style': 'none',
        'border-color': '#000'
      },
      BORDER_POSITION: ['top', 'right', 'bottom', 'left'],
      printPageVisible: false,
      printPageData: {}

    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  beforeDestroy() {
    // this.getPrintTable().destroy()
  },
  methods: {
    getIcon(fieldType) {
      return fieldTypes[fieldType].icon
    },
    getPrintTable() {
      return this.$refs.hotTableComponent.hotInstance
    },
    closeDialog() {
      this.dataMap = {}
      this.styleMap = {}
      this.fieldMap = {}
      this.borderState = {}
      this.printUtils = null

      this.tableData = null

      this.formFields = []

      this.getPrintTable().render()

      this.$emit('close', false)
    },
    callback() {
      this.$emit('callback')
    },
    hanleSave() {
      const formData = this.formData
      formData['content'] = this.getValue()
      save({
        data: JSON.stringify(formData),
        formKey: this.formKey,
        formPrintTemplateId: this.id
      }).then(response => {
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          this.callback()
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch(() => {
      })
    },
    onDragStart(e, field) {
      e.dataTransfer.setData('fieldData', JSON.stringify({
        field: field
      }))
    },
    onDragEnd(e) {
      e.dataTransfer.clearData()
    },
    onDrop(e) {
      var data = e.dataTransfer.getData('fieldData')
      if (data) {
        const fieldData = JSON.parse(data)
        const field = fieldData.field
        const targetDom = e.target
        const row = targetDom.parentElement.rowIndex - 1
        const col = targetDom.cellIndex - 1

        this.currentCell = {
          row: row,
          col: col
        }
        this.setCurrentCellData(field)
      }
    },
    setCurrentCellData(field) {
      if (this.currentCell && field) {
        this.getPrintTable().setDataAtCell(this.currentCell.row, this.currentCell.col, {
          label: '${' + field.name + '}',
          fields: [field.name]
        })
      }
    },
    loadFields() {
      getFields({
        formKey: this.formKey
      }).then(response => {
        const data = this.$utils.parseData(response.data)
        this.formFields = FormFieldUtil.getAllFormFields(data)

        this.setFieldNameMap(this.formFields)
        this.loadData()
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    setFieldNameMap(fields) {
      this.fieldNameMap = {}
      fields.forEach((field) => {
        if (field.field_type === 'table') { // 子表
          field.children.forEach((column) => {
            this.putFieldNameMap(column.name, field.label + '.' + column.label)
          })
        } else {
          this.putFieldNameMap(field.name, field.label)
        }
      })
    },
    putFieldNameMap(key, label) {
      this.fieldNameMap['${' + key + '}'] = '${' + label + '}'
    },
    getFormData() {
      this.dialogLoading = true
      this.formData = JSON.parse(JSON.stringify(this.defaultForm))
      this.$nextTick(() => {
        this._initTable()
        this.loadFields()
      })
    },
    loadData() {
      if (this.$utils.isEmpty(this.formId)) {
        this.setValue(this.formData.content)
        this.getPrintTable().render()
        setTimeout(() => {
          this.dialogLoading = false
        }, 100)
      } else {
        get({
          formPrintTemplateId: this.formId
        }).then(response => {
          const data = response.data
          this.formData.name = data.name
          this.formData.content = this.$utils.parseData(data.content)
          this.setValue(this.formData.content)
          this.getPrintTable().render()
          setTimeout(() => {
            this.dialogLoading = false
          }, 100)
        }).catch(() => {
          this.dialogLoading = false
        })
      }
    },

    getValue() {
      const tableValue = this.tableValue
      var value = Object.assign({
        type: tableValue.type,
        header: tableValue.header,
        footer: tableValue.footer,
        dpi: tableValue.dpi, // 增加dpi
        watermark: tableValue.watermark, // 增加水印
        default: tableValue.default
      },
      this.getMenuValue(),
      this.getTableValue())

      if (this.pageValue) {
        Object.assign(value, {
          footer: this.pageValue.footer,
          header: this.pageValue.header
        })
        var styles = {}
        for (const key in this.pageValue.styles) {
          if (/hf_/.test(key)) {
            styles[key] = this.pageValue.styles[key]
          }
        }
        Object.assign(value.styles, styles)
      }
      return value
    },
    setValue(content) {
      this.tableValue = Object.assign({}, content)
      if (content.default) {
        this.tableOptions.rowHeight = content.default.row_height
        this.tableOptions.colWidth = content.default.col_width
      }

      this.setPageValue(content)
      this.setMenuValue(content)
      this.setTableValue(content)
    },
    /**
     * 设置菜单
     */
    setMenuValue(content) {
      this.$refs.menu.setMenuValue(content)
    },
    /**
     * 获取菜单数据
     */
    getMenuValue() {
      return this.$refs.menu.getMenuValue()
    },
    /**
     * 设置打印页
     */
    setPageValue(content) {
      this.pageValue = {
        footer: content.footer,
        header: content.header,
        styles: content.styles
      }
    },
    handlePage(data) {
      this.printPageVisible = false
      this.setPageValue(data)
    },
    getTableValue() {
      var options = this.tableOptions
      var printTable = this.getPrintTable()
      this.printUtils.initStyles()
      var countRows = printTable.countRows()
      var countCols = printTable.countCols()
      var merge = {}
      var g = {}
      const mergeCells = printTable.getPlugin('MergeCells').mergedCellsCollection.mergedCells
      for (let i = 0; i < mergeCells.length; i++) {
        const mergeCell = mergeCells[i]
        if (!(mergeCell.row > countRows || mergeCell.col > countCols)) {
          var h = this._getCellTag(mergeCell.row, mergeCell.col)
          var j = this._getCellTag(mergeCell.row + mergeCell.rowspan - 1, mergeCell.col + mergeCell.colspan - 1)
          merge[h] = j
          for (let row = 0; row <= mergeCell.rowspan - 1; row++) {
            for (let col = 0; col <= mergeCell.colspan - 1; col++) {
              if	(row || col) {
                g[this._getCellTag(mergeCell.row + row, mergeCell.col + col)] = true
              }
            }
          }
        }
      }

      var cells = {}
      var maxRow = 0
      var maxCol = 0
      var styleName = {}
      var systemFields = {}
      styleName[this.printUtils.DEFAULT_STYLE_NAME] = true
      const cellsMeta = printTable.getCellsMeta()
      for (let i = 0; i < cellsMeta.length; i++) {
        const cellMeta = cellsMeta[i]
        if (cellMeta && this.$utils.isNumber(cellMeta.row) && this.$utils.isNumber(cellMeta.col)) {
          var tag = this._getCellTag(cellMeta.row, cellMeta.col)
          if (g[tag]) {
            continue
          }
          var content = this.dataMap[tag]
          var styleKey = this.printUtils.getStyleNameByCell(cellMeta)
          var hasField = false
          var hasContent = false
          var hasBorder = this.printUtils.hasBorder(styleKey)
          if (this.$utils.isNotEmpty(content)) {
            // 是否有字段
            for (let i = 0; i < content.length; i++) {
              const val = content[i]
              if (val && val.fields) {
                if (val.fields === 'system_barcode') { systemFields[val.fields] = 'true' }
                if (val.fields === 'system_qrcode') { systemFields[val.fields] = 'true' }
                hasField = true
                break
              }
            }
            // 是否有内容
            for (let i = 0; i < content.length; i++) {
              const val = content[i]
              if (this.$utils.isNotEmpty(val)) {
                hasContent = true
                break
              }
            }
          }

          if (hasContent) {
            content = this.printUtils.formatData(content)
          }

          if (hasContent || hasBorder) {
            styleName[styleKey] = true
            var row = cellMeta.row
            var col = cellMeta.col
            if (merge[tag]) {
              var r = this._splitCellTag(merge[tag])
              row = r[0]
              col = r[1]
            }
            if (row > maxRow) {
              maxRow = row
            }
            if (col > maxCol) {
              maxCol = col
            }

            cells[tag] = {
              content: content,
              style: styleKey,
              hasField: hasField
            }
          }
        }
      }

      var images = Object.assign({
        background: this.imageMap.background
      }, this.printUtils.getImages())
      var styles = {}
      const printStyles = this.printUtils.getStyles()
      for (const key in printStyles) {
        if (styleName[key]) {
          styles[key] = printStyles[key]
        }
      }
      var rows = []
      var cols = []
      for (let i = 0; i <= maxRow; i++) {
        rows.push(printTable.getRowHeight(i) || options.rowHeight)
      }
      for (let i = 0; i <= maxCol; i++) {
        cols.push(printTable.getColWidth(i) || options.colWidth)
      }
      return {
        cols: cols,
        rows: rows,
        cells: cells,
        merge: merge,
        range: {
          s: this._getCellTag(this.range.s[0], this.range.s[1]),
          e: this._getCellTag(maxRow, maxCol)
        },
        images: images,
        styles: styles,
        systemFields: systemFields
      }
    },
    _getDefaultValue() {
      return JSON.parse(JSON.stringify(this.defaultValue))
    },

    setTableValue(value) {
      var _this = this
      var options = this.tableOptions

      if (this.$utils.isEmpty(value)) {
        value = this._getDefaultValue()
      }

      this.tableValue = value
      this.imageMap = value.images || {}
      this.dataMap = {}
      this.styleMap = {}
      this.fieldMap = {}
      this.borderState = {}
      this.printUtils = new PrintUtils(value.styles, this.imageMap, value.dpi)

      var data = []
      for (const key in value.cells) {
        const val = value.cells[key]
        var tag = _this._splitCellTag(key)
        if (this.$utils.isEmpty(tag)) {
          continue
        }
        var row = tag[0]
        var col = tag[1]
        _this.dataMap[key] = val.content
        _this.styleMap[key] = _this.printUtils.style2ClassName(val.style)
        _this.borderState[key] = _this._createBordersByStyle(row, col, value.styles[val.style])

        if (val.content) {
          _this._setCellData(row, col, val.content[0])
        }
        var clz = []
        if (_this.styleMap[key]) { clz.push(_this.styleMap[key]) }
        if (_this.borderState[key]) { clz.push(_this.borderState[key]) }
        var className = ''
        if (this.$utils.isNotEmpty(clz)) {
          className = clz.join(' ')
        }

        data.push({
          row: row,
          col: col,
          prop: {
            className: className
          }
        })
      }

      var minRows = options.minRows
      var f = []
      for (const key in value.merge) {
        var val = value.merge[key]
        var d = _this._splitCellTag(key)
        var g = _this._splitCellTag(val)
        var h = g[0] - d[0] + 1
        var i = g[1] - d[1] + 1
        if (h > 1 || i > 1) {
          f.push({
            row: d[0],
            col: d[1],
            rowspan: h,
            colspan: i
          })
        }
        if (g[0] + 1 > minRows) {
          minRows = g[0] + 1
        }
      }

      var settings = {
        data: this.tableData
      }
      if (minRows > options.minRows) {
        settings.minRows = minRows
      }
      if (this.$utils.isNotEmpty(f)) {
        settings.mergeCells = f
      }
      this.getPrintTable().updateSettings(settings)

      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        this.getPrintTable().setCellMetaObject(d.row, d.col, d.prop)
      }
      this.clearUndoRedo()
      this.setPage(value.page)
      this.setBackground(value.background)
    },
    _setCellData: function(row, col, value) {
      if (!value) { return }
      if (value.label && this.$utils.isEmpty(this.fieldNameMap[value.label])) {
        value = ''
      }

      if (!this.tableData) {
        this.tableData = []
        var d = this._splitCellTag(this.tableValue.range.e)
        for (var i = 0; i <= d[0]; i++) {
          this.tableData[i] = []
          this.tableData[i].length = d[1]
        }
      }
      this.tableData[row][col] = value
    },
    _getCellTag(row, col) {
      return [row, col].join(':')
    },
    _splitCellTag(tag) {
      var tags = tag.split(':')
      var row = parseInt(tags[0])
      var col = parseInt(tags[1])
      if (this.$utils.isNumber(row) && this.$utils.isNumber(col)) {
        return [row, col]
      } else {
        return []
      }
    },
    _initTable() {
      const options = this.tableOptions
      const _this = this
      this.hotSettings = {
        renderAllRows: true,
        minRows: options.minRows,
        minCols: options.minCols,
        maxRows: options.maxRows,
        maxCols: options.maxCols,
        cells(row, col, prop) { // 单元格渲染
          const hasData = _this.dataMap && _this.dataMap[_this._getCellTag(row, col)]

          if (!options.hasEditor || hasData && !_this.$utils.isString(hasData[0])) {
            this.editor = false
          } else {
            this.editor = 'text'
          }
        },
        renderer(instance, td, row, col, prop, value, cellProperties) { // 单元格渲染
          let text = ''
          if (_this.loadingMap && _this.loadingMap[_this._getCellTag(row, col)]) {
            text += _this._getCellText({
              loading: true
            })
          } else if (value) {
            text += _this._getCellText(value)
          }
          td.innerHTML = '<div class="content"><div class="data">' + text + '</div></div>'

          td.className = instance.getCellMeta(row, col).className || ''
          return td
        },
        colWidths(row) {
          const col = _this.tableValue.cols
          return col && col.length > row && col[row] ? col[row] : options.colWidth
        },
        rowHeights(col) {
          const rows = _this.tableValue.rows
          return rows && rows.length > col && rows[col] ? rows[col] : options.rowHeight
        },
        columnHeaderHeight: options.columnHeaderHeight,
        rowHeaderWidth: options.rowHeaderWidth,
        rowHeaders: options.rowHeaders,
        colHeaders: options.colHeaders,
        manualColumnResize: true, // 拖拽行头或列头改变行或列的大小
        manualRowResize: true, // 拖拽行头或列头改变行或列的大小
        mergeCells: true,
        outsideClickDeselects: false,
        customBorders: true,
        contextMenu: this._getContextMenu() // 右键菜单
      }

      this._addTableHook()
    },
    _addTableHook() {
      const _this = this
      // const options = this.tableOptions
      const printTable = this.getPrintTable()
      // 在选择一个或多个单元格后触发（例如，将鼠标放在上方）。
      printTable.addHook('afterSelectionEnd', (row, column, row2, column2, selectionLayerLevel) => {
        _this.selectRange = [row, column, row2, column2]
        _this._setMenuState(row, column, row2, column2)
      })

      printTable.addHook('afterBeginEditing', (row, column) => {
        _this._setMenuEnable(false)
      })

      printTable.addHook('afterColumnResize', function(col, newSize) {
        printTable.getPlugin('ManualColumnResize').setManualSize(col, newSize)
        // var e = new Handsontable.plugins.UndoRedo.ColWidthAction({
        //   col: col,
        //   size: _this.tableValue.cols[col] || options.colWidth,
        //   newSize: newSize
        // })
        _this.tableValue.cols[col] = newSize
        // printTable.undoRedo.done(e)
        printTable.render()
        _this.setPage(_this.page)
        // IBPS.Utils.applyFunc(_this, options.onAfterChange, [], false)
      })

      printTable.addHook('afterRowResize', function(row, newSize) {
        printTable.getPlugin('ManualRowResize').setManualSize(row, newSize)
        // var e = new Handsontable.plugins.UndoRedo.RowHeightAction({
        //   row: row,
        //   size: _this.tableValue.rows[row] || options.rowHeight,
        //   newSize: newSize
        // })
        _this.tableValue.rows[row] = newSize
        // printTable.undoRedo.done(e)
        printTable.render()
        _this.setPage(_this.page)
        // IBPS.Utils.applyFunc(_this, options.onAfterChange, [], false)
      })

      printTable.addHook('beforeChange', (changes, source) => {
        changes.forEach(([row, column, oldValue, newValue]) => {
          var tag = _this._getCellTag(row, column)
          let val = void 0
          if (_this.$utils.isNotEmpty(newValue)) {
            val = [newValue]
          }
          _this.dataMap[tag] = val
        })
      })

      printTable.addHook('afterChange', (changes, source) => {
        if (changes) {
          changes.forEach(([row, column, oldValue, newValue]) => {
            if (newValue && newValue.fields) {
              _this.fieldMap[newValue.fields[0]] = [row, column]
            }
          })
        // IBPS.Utils.applyFunc(_this, options.onAfterChange, [oldValue, newValue], false)
        }
      })
    },
    _setMenuMerge(row, col, row2, col2) {
      this.$refs.menu.setMerge(this._isCellMerge(row, col, row2, col2) ? 'unmerge' : 'merge')
    },
    _setMenuState(row, col, row2, col2) {
      var cell = this.getPrintTable().getCellMeta(row, col)
      if (this.printUtils) {
        const styles = this.printUtils.getStyleByClassName(cell.className)
        this.$refs.menu.setMenuStyles(styles)
      }
    },
    _setMenuEnable(flag) {
      this.$refs.menu.setEnable(flag)
    },

    /**
     * 右键菜单
     */
    _getContextMenu() {
      const _this = this
      const menu = {
        callback(key, selection, clickEvent) {
          switch (key) {
            case 'insertRow':
            case 'insertCol':
            case 'delRow':
            case 'delCol':
              _this.insertOrDelete({
                value: key
              })
              break

            case 'merge':
            case 'unMerge':
              _this.mergeOrUnMerge()
              break

            case 'rowHeight':
            case 'colWidth':
              _this.setSize({
                value: key
              })
              break
            case 'empty':
              _this.clearCellData()
          }
        },
        items: {
          insertRow: {
            name: '插入行'
          },

          delRow: {
            name: '删除行'
          },
          'hsep1': '---------',
          insertCol: {
            name: '插入列'
          },

          delCol: {
            name: '删除列'
          },
          'hsep2': '---------',
          'rowHeight': {
            name: '行高(R)'
          },
          'colWidth': {
            name: '列宽(C)'
          },
          'hsep3': '---------',
          merge: {
            name: '合并',
            disabled() {
              const range = this.getSelectedRange()
              if (Array.isArray(range) && range.length) {
                return _this._isCellMergeRange(range[0])
              }
              return false
            }
          },
          unMerge: {
            name: '取消合并',
            disabled() {
              const range = this.getSelectedRange()
              if (Array.isArray(range) && range.length) {
                return !_this._isCellMergeRange(range[0])
              }
              return true
            }
          },
          empty: {
            name: '清除内容'
          }
        }
      }
      return menu
    },
    // 设置尺寸(行高和列宽)
    setSize(options) {
      const printTable = this.getPrintTable()
      var selected = printTable.getSelected()
      if (!selected) { return }
      const select = selected[0]
      var row0 = select[0]
      var col0 = select[1]
      var row1 = select[2]
      var col1 = select[3]
      switch (options.value) {
        case 'rowHeight':
          this.$prompt('请输入行高', '行高', {
            inputType: 'number',
            inputValue: printTable.getRowHeight(row0),
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false
          }).then(({ value }) => {
            for (var r = row0; r <= row1; r++) {
              printTable.runHooks('afterRowResize', r, parseInt(value))
            }
          }).catch(() => {
          })
          break
        case 'colWidth':
          this.$prompt('请输入列宽', '列宽', {
            inputType: 'number',
            inputValue: printTable.getColWidth(col0),
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false
          }).then(({ value }) => {
            for (var c = col0; c <= col1; c++) {
              printTable.runHooks('afterColumnResize', c, parseInt(value))
            }
          }).catch(() => {
          })

          break
      }
    },
    // 插入或者删除
    insertOrDelete(options) {
      var selected = this.getPrintTable().getSelected()
      if (selected) {
        var countRows = this.getPrintTable().countRows()
        var countCols = this.getPrintTable().countCols()
        var selRow = Math.abs(selected[0] - selected[2])
        var selCol = Math.abs(selected[1] - selected[3])
        var isRow = countRows - 1 <= selRow
        var isCol = countCols - 1 <= selCol

        switch (options.value) {
          case 'insertRow':
            this.insertRow()
            break
          case 'delRow':
            if (isRow) { return }
            this.removeRow()
            break
          case 'insertCol':
            this.insertColumn()
            break
          case 'delCol':
            if (isCol) { return }
            this.removeColumn()
        }
        this._refreshDataMap()
        this.getPrintTable().selectCell(selected[0], selected[1], selected[2], selected[3])
        this.getPrintTable().render()
        this._selectedField()
      }
    },
    // 删除列
    removeColumn() {
      var range = this._getSelection()
      if (range) {
        var end = range.end.col - range.start.col + 1
        this.getPrintTable().alter('remove_col', range.start.col, end)
      }
    },
    // 删除行
    removeRow() {
      var range = this._getSelection()
      if (range) {
        var end = range.end.row - range.start.row + 1
        this.getPrintTable().alter('remove_row', range.start.row, end)
      }
    },
    insertColumn() {
      var range = this._getSelection()
      if (range) { this.getPrintTable().alter('insert_col', range.start.col) }
    },
    insertRow() {
      var range = this._getSelection()
      if (range) { this.getPrintTable().alter('insert_row', range.start.row) }
    },
    /**
         * 撤销、重做
         */
    undoRedo(key) {
      switch (key) {
        case 'undo':
          this.getPrintTable().undo()
          break
        case 'redo':
          this.getPrintTable().redo()
      }
    },
    checkUndoRedo(key) {
      switch (key) {
        case 'undo':
          return this.getPrintTable().undoRedo.isUndoAvailable()
        case 'redo':
          return this.getPrintTable().undoRedo.isRedoAvailable()
      }
    },
    clearUndoRedo() {
      // var options = this.tableOptions
      this.getPrintTable().undoRedo.clear()
      // IBPS.Utils.applyFunc(this, options.onAfterChange, [], false)
    },
    _getCellText(value) {
      var _this = this
      var html = ''
      if (this.$utils.isArray(value)) {
        value.forEach(val => {
          html += _this._getCellText(val)
        })
      } else if (this.$utils.isString(value)) {
        html += `<span>${value}</span>`
      } else if (value.label) {
        html += this._getCellText(_this.fieldNameMap[value.label] || '无效字段')
      } else if (value.image) {
        var image = this.imageMap[value.image] || value.image
        if (image) {
          this.getFileDownloadURL(image, function(url) {
            html += '<div class="background-img" style="background-image:url(' + url + ')"/>'
          })
        }
      } else {
        if (value.loading) { html += '<div class=" el-icon-loading"/>' }
      }
      return html
    },
    getFileDownloadURL(file, callback) {
      if (!file) { return '' }
      callback(getImage(file.id))
    },
    clearCellData() {
      var selection = this.getPrintTable().selection
      if (selection) {
        this.getPrintTable().emptySelectedCells()
        this._refreshDataMap()
      }
    },
    _refreshDataMap: function() {
      // var options = this.tableOptions
      var printTable = this.getPrintTable()
      var data = printTable.getData(this.range.s[0], this.range.s[1], printTable.countRows(), printTable.countCols())
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        for (let j = 0; j < row.length; j++) {
          const val = row[j]
          var key = this._getCellTag(i, j)
          if (this.$utils.isEmpty(val)) {
            if (this.dataMap[key]) {
              // IBPS.Utils.applyFunc(_this, options.onAfterChange, [_this.dataMap[key][0], val], false)
              this.dataMap[key] = void 0
            }
          } else {
            this.dataMap[key] = [val]
          }
        }
      }
    },
    _selectedField: function() {
      var printTable = this.getPrintTable()
      for (const key in this.dataMap) {
        const data = this.dataMap[key]
        if (data && data[0] && data[0].fields) {
          var tags = key.split(':')
          var row = parseInt(tags[0])
          var column = parseInt(tags[1])
          printTable.setDataAtCell(row, column, {
            label: data[0].label,
            fields: data[0].fields
          })
          if (this.fieldMap[data[0].fields[0]]) {
            this.fieldMap[data[0].fields[0]][0] = row
            this.fieldMap[data[0].fields[0]][1] = column
          }
        }
      }
    },

    /**
     * 处理顶部菜单
     */
    onMenuClick(data) {
      switch (data.type) {
        case 'merge':// 合并
          this.mergeOrUnMerge()
          break
        case 'fontStyle':// 字体
          this.setCellStyle(data)
          break
        case 'align':// 位置
          this.setCellAlign(data)
          break
        case 'border':// 边框
          this.setCellBorder(data)
          break
        case 'undoRedo':// 撤销、重做
          this.undoRedo(data.action)
          break
        case 'insert':// 插入/删除
          this.insertOrDelete(data)
          break
        case 'paper':// 纸张设置
          this.setPage(data.value)
          break
        case 'img':// 图片设置
          if (data.action === 'setBgImg') { // 设置背景图
            if (this.$utils.isEmpty(data.value.file)) {
              this.removeBackground()
            } else {
              this.setBackground(data.value)
            }
          } else if (data.action === 'insertImg') { // 插入图片
            this.setCurrentCellImage(data.value)
          }
          break
        case 'global':// 全局设置
          if (data.action === 'headerFooter') { // 页眉页脚设置
            this.printPageData = this.getValue()
            this.printPageVisible = true
          }
      }
      this._checkMenuEnable()
    },
    // 设置背景图
    setBackground: function(image) {
      this.removeBackground()
      if (this.$utils.isEmpty(image)) {
        return
      }
      var options = this.tableOptions
      const $el = document.querySelector(`.ht_master .wtHider`)
      var file = image.file || this.imageMap.background
      this.imageMap.background = file
      if (file) {
        this.getFileDownloadURL(file, (url) => {
          this.createElement($el, 'paper-background', {
            left: options.rowHeaderWidth,
            top: options.columnHeaderHeight
          })
          const el = document.querySelector('.paper-background')
          const div = document.createElement('div')
          div.className = 'background-img'
          div.style.backgroundImage = 'url("' + url + '")'
          el.appendChild(div)
          this._resizeBackground({
            width: this.pageSize.width,
            height: this.pageSize.height,
            rowHeaderWidth: options.rowHeaderWidth,
            columnHeaderHeight: options.columnHeaderHeight
          }, this.page.margin)
        })
      }
    },
    // 删除背景图
    removeBackground: function() {
      const el = document.querySelector('.paper-background')
      if (el) el.parentNode.removeChild(el)
      this.imageMap.background = null
    },
    _resizeBackground: function(options, pageMargin) {
      const $el = document.querySelector('.paper-background')
      var margin = ''
      pageMargin.forEach((val) => {
        margin += -val + 'px '
      })
      if ($el) {
        $el.style.width = options.width + 'px'
        $el.style.height = options.height - options.columnHeaderHeight + 'px'
        $el.children[0].style.margin = margin
      }
    },
    /**
     * 设置当前图片
     */
    setCurrentCellImage: function(image) {
      const printTable = this.getPrintTable()
      var range = printTable.getSelectedRange()[0]
      if (range) {
        var row = range.from.row
        var col = range.from.col
        if (!this.loadingMap) { this.loadingMap = {} }
        if (image) {
          this.loadingMap[this._getCellTag(row, col)] = false
          printTable.setDataAtCell(row, col, {
            image: image
          })
        } else {
          this.loadingMap[this._getCellTag(row, col)] = true
          printTable.render()
        }
      }
    },
    _checkMenuEnable() {

    },
    _formatRange(rang) {
      if (this.$utils.isEmpty(rang) || rang.from || rang.to) {
        return rang
      }
      var from = {
        row: rang.from.row,
        col: rang.from.col
      }
      var to = {
        row: rang.to.row,
        col: rang.to.col
      }

      rang.from.row = from.row <= to.row ? from.row : to.row
      rang.to.row = from.row <= to.row ? to.row : from.row
      rang.from.col = from.col <= to.col ? from.col : to.col
      rang.to.col = from.col <= to.col ? to.col : from.col
      return rang
    },
    _getSelection() {
      var range = this.getPrintTable().getSelectedRange()
      return range ? {
        start: range[0].getTopLeftCorner(),
        end: range[0].getBottomRightCorner()
      } : null
    },

    setCellStyle(data, rang) {
      if (!rang) {
        rang = this.getPrintTable().getSelectedRange()[0]
      }
      if (rang) {
        switch (data.action) {
          case 'fontSize':
            this._dealFontSize(rang, data.value)
            break
          case 'fontFamily':
            this._dealFontFamily(rang, data.value)
            break
          default:
            this._dealFontStyle(rang, data.action)
        }
      }
    },
    _dealFontSize(range, value) {
      if (range.from.row === range.to.row && range.from.col === range.to.col) {
        this._dealFontSizeClass(range.from.row, range.from.col, value)
      } else {
        range = this._formatRange(range)
        for (var row = range.from.row; row <= range.to.row; row++) {
          for (var col = range.from.col; col <= range.to.col; col++) {
            this._dealFontSizeClass(row, col, value)
          }
        }
      }
      this.getPrintTable().render()
    },
    _dealFontFamily(range, value) {
      if (range.from.row === range.to.row && range.from.col === range.to.col) {
        this._dealFontFamilyClass(range.from.row, range.from.col, value)
      } else {
        range = this._formatRange(range)
        for (var row = range.from.row; row <= range.to.row; row++) {
          for (var col = range.from.col; col <= range.to.col; col++) {
            this._dealFontFamilyClass(row, col, value)
          }
        }
      }
      this.getPrintTable().render()
    },
    /**
     * 字体
     */
    _dealFontFamilyClass(row, col, val) {
      var cell = this.getPrintTable().getCellMeta(row, col)
      var className = 'ff-' + val
      if (cell.className) {
        cell.className = cell.className.replace(/ff-[a-zA-Z]{3,}/, '').replace('  ', ' ')
        className = cell.className + ' ' + className
      }
      cell.className = className
    },
    /**
       * 字体大小
       */
    _dealFontSizeClass(row, col, val) {
      var cell = this.getPrintTable().getCellMeta(row, col)
      var className = 'font-size-' + val
      if (cell.className) {
        cell.className = cell.className.replace(/font-size-[0-9]{1,2}/, '').replace('  ', ' ')
        className = cell.className + ' ' + className
      }
      cell.className = className
    },
    _dealFontStyle(rang, val) {
      if (rang.from.row === rang.to.row && rang.from.col === rang.to.col) {
        this._applyStyleClassName(rang.from.row, rang.from.col, val, true)
      } else {
        var selected = this.getPrintTable().getSelected()[0]
        var cell = this.getPrintTable().getCellMeta(selected[0], selected[1])
        var isExist = true
        if (cell.className) { isExist = cell.className.indexOf(val) === -1 }
        rang = this._formatRange(rang)
        for (var row = rang.from.row; row <= rang.to.row; row++) {
          for (var col = rang.from.col; col <= rang.to.col; col++) {
            this._applyStyleClassName(row, col, val, false, isExist)
          }
        }
      }
      this.getPrintTable().render()
    },
    _applyStyleClassName(row, col, val, d, e) {
      var cellMeta = this.getPrintTable().getCellMeta(row, col)
      cellMeta.className = this._prepareStyleClass(cellMeta.className, val, d, e)
    },
    _prepareStyleClass(className, val, c, d) {
      className ? c && className.indexOf(val) !== -1 || !c && !d ? className = className.replace('' + val, '').replace('  ', ' ')
        : (c || !c && d && className.indexOf(val) === -1) && (className += ' ' + val)
        : (c || d) && (className = val)
      return	className
    },
    /**
     * 设置单元格对齐
     */
    setCellAlign(data) {
      var range = this.getPrintTable().getSelectedRange()
      if (range) {
        var style = this._prepareAlignStyle(data.action)
        this._dealAlignment(range[0], style.type, style.alignment)
      }
    },

    _dealAlignment(range, type, align) {
      // var d = this._getCellClasses(range)
      // this.getPrintTable().runHooks('beforeCellAlignment', d, range, data, align),
      if (range.from.row === range.to.row && range.from.col === range.to.col) {
        this._applyAlignClassName(range.from.row, range.from.col, type, align)
      } else {
        range = this._formatRange(range)
        for (var row = range.from.row; row <= range.to.row; row++) {
          for (var col = range.from.col; col <= range.to.col; col++) {
            this._applyAlignClassName(row, col, type, align)
          }
        }
      }
      this.getPrintTable().render()
    },
    _applyAlignClassName(row, col, type, align) {
      var cell = this.getPrintTable().getCellMeta(row, col)
      var 	className = align
      if (cell.className) {
        if (type === 'vertical') {
          className = this._prepareVerticalAlignClass(cell.className, align)
        } else {
          className = this._prepareHorizontalAlignClass(cell.className, align)
        }
      }
      cell.className = className
    },
    _prepareVerticalAlignClass(className, align) {
      if (className.indexOf(align) !== -1) {
        return className
      } else {
        className = className.replace('htTop', '').replace('htMiddle', '').replace('htBottom', '').replace('  ', ' ')
        className += ' ' + align
        return className
      }
    },
    _prepareHorizontalAlignClass(className, align) {
      if (className.indexOf(align) !== -1) {
        return className
      } else {
        className = className.replace('htLeft', '').replace('htCenter', '').replace('htRight', '').replace('htJustify', '').replace('  ', ' ')
        className += ' ' + align
        return className
      }
    },
    _prepareAlignStyle(align) {
      switch (align) {
        case 'top':
          return {
            type: 'vertical',
            alignment: 'htTop'
          }
        case 'bottom':
          return {
            type: 'vertical',
            alignment: 'htBottom'
          }
        case 'middle':
          return {
            type: 'vertical',
            alignment: 'htMiddle'
          }
        case 'left':
          return {
            type: 'horizontal',
            alignment: 'htLeft'
          }
        case 'right':
          return {
            type: 'horizontal',
            alignment: 'htRight'
          }
        case 'center':
          return {
            type: 'horizontal',
            alignment: 'htCenter'
          }
      }
    },
    _getCellBorders(range) {
      const printTable = this.getPrintTable()
      var borders = {}
      for (var row = range.from.row; row <= range.to.row; row++) {
        for (var col = range.from.col; col <= range.to.col; col++) {
          var tag = this._getCellTag(row, col)
          borders[tag] = printTable.getCellMeta(row, col).className
        }
      }
      return borders
    },
    _dealBorderWeight(range, value) {
      const printTable = this.getPrintTable()
      var borderWidth = ''
      if (value > 0) { borderWidth = 'border-width-' + value }
      for (var row = range.from.row; row <= range.to.row; row++) {
        for (var col = range.from.col; col <= range.to.col; col++) {
          var className = printTable.getCellMeta(row, col).className
          if (className) {
            className = className.replace(/border-width-[0-4]{1}/, '').replace('  ', ' ')
            className = [className, borderWidth].join(' ')
          } else {
            className = borderWidth
          }
          printTable.setCellMeta(row, col, 'className', className)
        }
      }
      printTable.render()
    },
    // 处理边框
    _dealBorder(range, value) {
      switch (value) {
        case 'none':
          this._removeAllBorders(range)
          break
        case 'top':
          for (let col = range.from.col; col <= range.to.col; col++) {
            this._setBorder(range.from.row, col, value)
          }
          break
        case 'right':
          for (let row = range.from.row; row <= range.to.row; row++) {
            this._setBorder(row, range.to.col, value)
          }
          break
        case 'bottom':
          for (let col = range.from.col; col <= range.to.col; col++) {
            this._setBorder(range.to.row, col, value)
          }
          break
        case 'left':
          for (let row = range.from.row; row <= range.to.row; row++) {
            this._setBorder(row, range.from.col, value)
          }
          break
        case 'all':
          this._setAllBorder(range)
          break
        case 'outer':
          this._setOuterBorder(range)
      }
      const printTable = this.getPrintTable()
      printTable.render()
    },
    setCellBorder(data, range) {
      const printTable = this.getPrintTable()
      if (!range) { range = printTable.getSelectedRange()[0] }
      if (range) {
        range = this._formatRange(range)
        var state = this._getCellBorders(range)
        printTable.runHooks('beforeCellBorder', state, range, data)
        switch (data.action) {
          case 'borderLine':
            this._dealBorder(range, data.value)
            break
          case 'borderWeight':
            this._dealBorderWeight(range, data.value)
        }
      }
    },

    _setOuterBorder: function(range) {
      for (var row = range.from.row; row <= range.to.row; row++) {
        for (var col = range.from.col; col <= range.to.col; col++) {
          var border = []
          if (row === range.from.row) border.push('border-top')
          if (row === range.to.row) border.push('border-bottom')
          if (col === range.from.col) border.push('border-left')
          if (col === range.to.col) border.push('border-right')

          var className = this.getPrintTable().getCellMeta(row, col).className
          if (this.$utils.isNotEmpty(border)) {
            if (className) {
              border.forEach(val => {
                if (!new RegExp(val).test(className)) {
                  className += ' ' + val
                }
              })
              className = className.replace('  ', ' ')
            } else {
              className = border.join(' ')
            }
          }
          if (!className) { className = '' }
          this.getPrintTable().setCellMeta(row, col, 'className', className)
        }
      }
      // 合并单元格的bug

      this.getPrintTable().render()
    },
    _setAllBorder: function(range) {
      var borders = []
      for (let i = 0; i < this.BORDER_POSITION.length; i++) {
        const position = this.BORDER_POSITION[i]
        borders.push(['border', position].join('-'))
      }

      for (var row = range.from.row; row <= range.to.row; row++) {
        for (var col = range.from.col; col <= range.to.col; col++) {
          var className = this.getPrintTable().getCellMeta(row, col).className
          if (className) {
            for (let i = 0; i < borders.length; i++) {
              const border = borders[i]
              if (!new RegExp(border).test(className)) {
                className += ' ' + border
              }
            }

            className = className.replace('  ', ' ')
          } else {
            className = borders.join(' ')
          }
          this.getPrintTable().setCellMeta(row, col, 'className', className)
        }
      }
    },
    _removeAllBorders: function(range) {
      for (var row = range.from.row; row <= range.to.row; row++) {
        for (var col = range.from.col; col <= range.to.col; col++) {
          var className = this.getPrintTable().getCellMeta(row, col).className
          if (className) {
            className = className.replace('border-left', '').replace('border-right', '').replace('border-top', '').replace('border-bottom', '').replace('  ', ' ')
          }
          this.getPrintTable().setCellMeta(row, col, 'className', className || '')
        }
      }
    },
    _setBorder: function(row, col, value) {
      var boder = 'border-' + value
      var className = this.getPrintTable().getCellMeta(row, col).className

      if (className && !new RegExp(boder).test(className)) {
        className += ' ' + boder
      } else {
        className = boder
      }
      this.getPrintTable().setCellMeta(row, col, 'className', className)
    },
    _createBordersByStyle: function(row, col, style) {
      if (style) {
        var borderStyle = style['border-style']
        if (borderStyle && borderStyle !== 'none') {
          var border = []
          var borderWidth = style['border-width']
          if (borderWidth) { border.push('border-width-' + borderWidth) }
          for (let i = 0; i < this.BORDER_POSITION.length; i++) {
            const position = this.BORDER_POSITION[i]
            var d = ['border', position, 'width'].join('-')
            if (style[d] || style[d] !== 0 && borderWidth) {
              border.push(['border', position].join('-'))
            }
          }

          return border.join(' ')
        }
      }
    },

    // ============合并单元格========
    _isCellMergeRange(range) {
      const r1 = range.from.row
      const c1 = range.from.col
      const r2 = range.to.row
      const c2 = range.to.col
      return this._isCellMerge(r1, c1, r2, c2)
    },
    _isCellMerge(r1, c1, r2, c2) {
      const mergeCells = this.getPrintTable().getPlugin('MergeCells').mergedCellsCollection.mergedCells
      const isCellMerge = mergeCells.some(cell => {
        return cell && r1 + cell.rowspan - 1 === r2 && c1 + cell.colspan - 1 === c2
      })
      return isCellMerge
    },
    /**
     * 合并和取消合并
     */
    mergeOrUnMerge(range) {
      const printTable = this.getPrintTable()
      if (!range) {
        const ranges = printTable.getSelectedRange()
        if (ranges) { range = ranges[0] }
      }
      if (!range || range.isSingle()) { return }

      const mergeCells = printTable.getPlugin('MergeCells')
      // 如果是合并则取消
      if (this._isCellMergeRange(range)) {
        mergeCells.unmergeSelection(range)
        printTable.render()
        return
      }

      var value = []
      range = this._formatRange(range)
      for (var row = range.from.row; row <= range.to.row; row++) {
        for (var col = range.from.col; col <= range.to.col; col++) {
          // printTable.getCell(row, col).is(':visible')
          if (printTable.getCell(row, col) && printTable.getDataAtCell(row, col)) {
            value.push({
              row: row,
              col: col
            })
          }
        }
      }

      if (value.length <= 1) {
        this.merge(range, value)
      } else {
        this.$confirm('选择的区域包含多个数据，合并单元格后将只保留编辑过的所有单元格中最左上角的数值', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.merge(range, value)
        }).catch(() => { })
      }
    },
    merge(rang, value) {
      const printTable = this.getPrintTable()
      // this.unMerge(rang)
      printTable.getPlugin('MergeCells').mergeSelection(rang)

      var data = {}
      var val = null
      value.forEach((a, b) => {
        var tag = this._getCellTag(b.row, b.col)
        data[tag] = this.dataMap[tag] && this.dataMap[tag][0]
        if (!val) { val = data[tag] }
      })

      printTable.selectCell(rang.from.row, rang.from.col, rang.to.row, rang.to.col)
      this.clearCellData()
      printTable.undoRedo.doneActions.pop()
      if (val) {
        printTable.setDataAtCell(rang.from.row, rang.from.col, val)
        printTable.undoRedo.doneActions.pop()
      }
      // printTable.runHooks('beforeCellMerge', cells, rang, data)
      printTable.render()
    },
    unMerge(rang) {
      const printTable = this.getPrintTable()
      var mergeCells = printTable.getPlugin('MergeCells')
      var cells = []
      mergeCells.mergedCellInfoCollection.forEach((b, d) => {
        if (d.row < rang.from.row || d.col < rang.from.col || d.row > rang.to.row || d.col > rang.to.col) {
          cells.push(d)
        }
      })
      cells.forEach((a, c) => {
        mergeCells.mergedCellInfoCollection.removeInfo(cells.row, cells.col)
      })
      return cells
    },
    setPage(page) {
      const printTable = this.getPrintTable()

      this.page = page
      this.pageSize = this.printUtils.getPageSize(page)

      var options = this.tableOptions || {}
      const $el = document.querySelector(`.ht_master .wtHider`)
      var rows = printTable.countRows()
      var height = 0
      var row = 0
      var cols = printTable.countCols()
      var width = 0
      var col = 0

      this.rows = []
      for (var r = 0; r < rows; r++) {
        var rowHeight = printTable.getRowHeight(r) || options.rowHeight
        height += rowHeight
        if (height > this.pageSize.height) {
          height -= rowHeight
          break
        }
        this.rows.push(rowHeight)
        row = r
      }

      this.cols = []
      for (var c = 0; c < cols; c++) {
        var colWidth = printTable.getColWidth(c) || options.colWidth
        width += colWidth
        if (width > this.pageSize.width) {
          width -= colWidth
          break
        }
        this.cols.push(colWidth)
        col = c
      }

      this.range = {
        s: [0, 0],
        e: [row, col]
      }
      if (options.hasPaperBorder) {
        this.createElement($el, 'paper-horizontal', {
          top: height + options.columnHeaderHeight,
          left: options.rowHeaderWidth
        })
        this.createElement($el, 'paper-vertical', {
          left: width + options.rowHeaderWidth,
          top: options.columnHeaderHeight
        })
      }

      this._resizeBackground(this.pageSize, page.margin)
    },
    // 生成标线
    createElement($el, className, styles) {
      const el = document.querySelector(`.${className}`)
      if (el) {
        for (const key in styles) {
          el.style[key] = styles[key] + 'px'
        }
      } else {
        const div = document.createElement('div')
        div.className = className
        for (var key in styles) {
          div.style[key] = styles[key] + 'px'
        }
        $el.appendChild(div)
      }
    }
  }
}
</script>
<style lang="scss" >
@import './formPrint.scss';
</style>

