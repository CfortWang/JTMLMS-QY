<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="form-print-page-dialog"
    append-to-body
    title="页眉页脚设置"
    center
    top="6vh"
    width="100%"
    @open="openDialog"
    @close="closeDialog"
  >
    <!--工具栏-->
    <menu-tools
      ref="menu"
      @menu-click="onMenuClick"
    />
    <div class="print-body">
      <div
        class="print-page"
        :style="pageStyles"
      >
        <div
          class="table-content"
          :style="bodyStyles"
        />
        <!--页眉 -->
        <div
          class="header"
          :style="headerStyles"
        >
          <editable
            v-for="(column,i) in header.columns"
            :key="i"
            v-model="column.content"
            class="column"
            :class="[column.className||'',curSelect==='header|'+i?'select':'']"
            @click.native="columnClick('header',i)"
          />
        </div>
        <!--页脚 -->
        <div
          class="footer"
          :style="footerStyles"
        >
          <editable
            v-for="(column,i) in footer.columns"
            :key="i"
            v-model="column.content"
            class="column"
            :class="[column.className||'',curSelect==='footer|'+i?'select':'']"
            @click.native="columnClick('footer',i)"
          />

        </div>
      </div>

    </div></el-dialog>
</template>
<script>
import PrintUtils from '../utils/printUtils'
import MenuTools from './print-page-tools'
import Editable from './editable'

export default {
  components: {
    MenuTools,
    Editable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    },
    dpi: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      printUtils: null,
      pageSize: {
        width: 500,
        height: 600
      },
      margin: {},
      header: {
        columns: [{}, {}, {}]
      },
      footer: {
        columns: [{}, {}, {}]
      },
      curSelect: 'header|0'
    }
  },
  computed: {
    pageStyles() {
      var margin = this.margin
      return {
        width: (this.pageSize.width + margin.left + margin.right) + 'px',
        height: (this.pageSize.height + margin.top + margin.bottom) + 'px'
      }
    },
    bodyStyles() {
      return {
        'padding-right': this.margin.right + 'px',
        'padding-left': this.margin.left + 'px',
        'top': this.margin.top + 'px',
        'bottom': this.margin.bottom + 'px'
      }
    },
    headerStyles() {
      return {
        'padding-right': this.margin.right + 'px',
        'padding-left': this.margin.left + 'px',
        'top': this.header.margin + 'px'
      }
    },
    footerStyles() {
      return {
        'padding-right': this.margin.right + 'px',
        'padding-left': this.margin.left + 'px',
        'bottom': this.footer.margin + 'px'
      }
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
  created() {
    this.printUtils = new PrintUtils(this.data.styles || {}, {}, this.dpi)
  },
  methods: {
    closeDialog() {
      this.$emit('close', this.getValue())
    },
    getValue() {
      this.printUtils.initStyles()

      var header = this._getData(this.header)

      var footer = this._getData(this.footer)

      var styles = {}

      const clzs = this.printUtils.getStyles()
      for (const key in clzs) {
        const style = clzs[key]
        if (/s_/.test(key)) {
          const key1 = key.replace(/s_/, 'hf_')
          styles[key1] = style
        }
      }

      return {
        header: header,
        footer: footer,
        styles: styles
      }
    },
    _getData(data) {
      var columns = []
      const dataColumns = data.columns

      dataColumns.forEach((column) => {
        var style = this.printUtils.getStyleNameByCell({
          className: column.className
        })

        if (/s_/.test(style)) {
          style = style.replace(/s_/, 'hf_')
        }
        columns.push({
          content: column.content,
          style: style
        })
      })
      return {
        columns: columns,
        margin: data.margin
      }
    },
    setData(data) {
      let columns = []
      const dataColumns = data.columns
      if (this.$utils.isEmpty(dataColumns)) {
        columns = [{
          content: [],
          className: ''
        }, {
          content: [],
          className: ''
        }, {
          content: [],
          className: ''
        }]
      } else {
        dataColumns.forEach((column) => {
          var clz = this.printUtils.style2ClassName(column.style)
          columns.push({
            content: column.content,
            className: clz
          })
        })
      }
      return {
        columns: columns,
        margin: data.margin
      }
    },
    openDialog() {
      this.printUtils = new PrintUtils(this.data.styles, {}, this.dpi)
      this.pageSize = this.printUtils.getPageSize(this.data.page)
      this.margin = this.printUtils.getPageMargin(this.data.page)
      this.header = this.setData(this.data.header)

      this.footer = this.setData(this.data.footer)

      this.$nextTick(() => {
        this.$refs.menu.init({
          fonts: this.fonts,
          pageDPI: this.dpi.design,
          margin: this.margin
        })
        this.$refs.menu.setMenuStyles({
          'margin-top': this.data.header.margin,
          'margin-bottom': this.data.footer.margin
        })
      })
    },
    columnClz(type, i) {
      const clz = ''
      const style = this[type].columns[i].style

      if (this.$utils.isEmpty(style)) {
        return clz
      }
      return this.printUtils.style2ClassName(style)
    },
    columnClick(type, i) {
      this.curSelect = type + '|' + i

      this.$refs.menu.setHeaderFooter(type)

      this.setMenuStyles()
    },
    setMenuStyles() {
      const clz = this.getSelectValue()
      this.$refs.menu.setMenuStyles(this.printUtils.getStyleByClassName(clz))
    },
    onMenuClick(menu) {
      switch (menu.type) {
        case 'fontStyle':
          this._setCellStyle(menu)
          break
        case 'style':
          if (menu.action === 'marginTop') {
            this._setHeaderMargin({
              margin: menu.value
            })
          } else {
            this._setFooterMargin({
              margin: menu.value
            })
          }
          break
        case 'align':
          this._setCellAlign(menu.action)
          break
        case 'clean':
          this._clean(menu.action)
          break
        case 'page':
          this.insertAtCursor('{页码}')
          break
      }
    },
    insertAtCursor(v) {
      if (!this.curSelect) { return }

      const value = this.getSelectValue('content')
      var content = ''
      if (this.$utils.isNotEmpty(value)) {
        content = value.join('')
      }
      content += v

      this.setSelectValue([content], 'content')
    },
    _clean(action) {
      if (action === 'all') {
        const types = ['header', 'footer']
        types.forEach((type) => {
          for (let i = 0; i < 3; i++) {
            const columns = this[type]['columns']
            columns[i].content = []
            columns[i].className = []
            this[type]['columns'].splice(i, 1, columns[i])
          }
        })
      } else {
        for (let i = 0; i < 3; i++) {
          const columns = this[action]['columns']
          columns[i].content = []
          columns[i].className = []
          this[action]['columns'].splice(i, 1, columns[i])
        }
      }
    },
    _setHeaderMargin(data) {
      this.header.margin = data.margin
      this.$refs.menu.setMenuStyles({
        'margin-top': data.margin
      })
    },
    _setFooterMargin(data) {
      this.footer.margin = data.margin
      this.$refs.menu.setMenuStyles({
        'margin-bottom': data.margin
      })
    },
    _setCellAlign(align) {
      if (!this.curSelect) { return }
      switch (align) {
        case 'left':
          align = 'htLeft'
          break
        case 'right':
          align = 'htRight'
          break
        case 'center':
          align = 'htCenter'
      }

      var clz = this.getSelectValue()
      if (clz.indexOf(align) === -1) {
        clz = clz.replace('htLeft', '').replace('htCenter', '').replace('htRight', '').replace('  ', ' ')
        clz += ' ' + align
        this.setSelectValue(clz)
        this.setMenuStyles()
      }
    },
    getSelectValue(key = 'className') {
      const select = this.curSelect.split('|')
      const type = select[0]
      const i = parseInt(select[1])
      return this[type]['columns'][i][key] || ''
    },
    setSelectValue(val, key = 'className') {
      const select = this.curSelect.split('|')
      const type = select[0]
      const i = parseInt(select[1])
      const columns = this[type]['columns']
      columns[i][key] = val
      this[type]['columns'].splice(i, 1, columns[i])
    },
    _setCellStyle(style) {
      if (!this.curSelect) { return }

      var clz = this.getSelectValue()

      var temp = ''
      switch (style.action) {
        case 'fontSize':
          temp = 'font-size-' + style.value
          clz = clz.replace(/font-size-[0-9]{1,2}/, '').replace('  ', ' ')
          clz = clz + ' ' + temp
          break
        case 'fontFamily':
          temp = 'ff-' + style.value
          clz = clz.replace(/ff-[a-zA-Z]{3,}/, '').replace('  ', ' ')
          clz = clz + ' ' + temp
          break
        default:
          var action = style.action
          if (clz.indexOf(action) !== -1) {
            clz = clz.replace('' + action, '').replace('  ', ' ')
          } else {
            clz += ' ' + action
          }
      }
      this.setSelectValue(clz)
      this.setMenuStyles()
    }
  }
}
</script>
<style lang="scss">
.form-print-page-dialog{
    .el-dialog__body{
      padding:0;
      height:  calc(94vh - 55px) !important;
    }

  .print-head {
      height: 45px
  }

  .print-body {
      border-top: solid 1px #e0e0e0;
      position: absolute;
      top: 100px;
      left: 0;
      right: 0;
      bottom: 0;
      background: #f0f0f0;
      overflow: auto
  }

  .print-page {
      background: #fff;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.4);
      margin: 20px auto;
      position: relative;
      overflow: hidden
  }

  .print-page .header {
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px
  }

  .print-page .header .column {
      vertical-align: top
  }

  .print-page .header .column.font-size-36 {
      line-height: 38px
  }

  .print-page .footer {
      z-index: 10;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px
  }

  .print-page .footer .column {
      vertical-align: bottom
  }

  .print-page .footer .column.font-size-36 {
      line-height: 24px
  }

  .print-page .column {
      width: 31.33%;
      height: 40px;
      position: relative;
      font-size: 12px;
      line-height: 32px;
      border: solid 1px #e0e0e0;
      display: inline-block;
      margin-right: -1px;
      padding: 4px;
      outline: 0;
      white-space: nowrap;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      cursor: default
  }

  .print-page .column.select:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: -1px;
      border: solid 2px #0DB3A6;
      z-index: 10
  }

  .print-page .column .data {
      pointer-events: none
  }

  .print-page .column.bold {
      font-weight: 700
  }

  .print-page .column.italic {
      font-style: italic
  }

  .print-page .column.underline .data {
      text-decoration: underline
  }

  .print-page .column.htLeft {
      text-align: left
  }

  .print-page .column.htLeft .data {
      position: absolute;
      left: 0
  }

  .print-page .column.htCenter {
      text-align: center
  }

  .print-page .column.htCenter .data {
      position: absolute;
      left: -1000px;
      right: -1000px
  }

  .print-page .column.htRight {
      text-align: right
  }

  .print-page .column.htRight .data {
      position: absolute;
      right: 0
  }

  .print-page .column.font-size-9 {
      font-size: 12px
  }

  .print-page .column.font-size-10 {
      font-size: 13.33px
  }

  .print-page .column.font-size-11 {
      font-size: 14.67px
  }

  .print-page .column.font-size-12 {
      font-size: 16px
  }

  .print-page .column.font-size-13 {
      font-size: 17.33px
  }

  .print-page .column.font-size-14 {
      font-size: 18.67px
  }

  .print-page .column.font-size-15 {
      font-size: 20px
  }

  .print-page .column.font-size-16 {
      font-size: 21.33px
  }

  .print-page .column.font-size-17 {
      font-size: 22.67px
  }

  .print-page .column.font-size-18 {
      font-size: 24px
  }

  .print-page .column.font-size-19 {
      font-size: 25.33px
  }

  .print-page .column.font-size-20 {
      font-size: 26.67px
  }

  .print-page .column.font-size-21 {
      font-size: 28px
  }

  .print-page .column.font-size-22 {
      font-size: 29.33px
  }

  .print-page .column.font-size-23 {
      font-size: 30.67px
  }

  .print-page .column.font-size-24 {
      font-size: 32px
  }

  .print-page .column.font-size-25 {
      font-size: 33.33px
  }

  .print-page .column.font-size-26 {
      font-size: 34.67px
  }

  .print-page .column.font-size-27 {
      font-size: 36px
  }

  .print-page .column.font-size-28 {
      font-size: 37.33px
  }

  .print-page .column.font-size-29 {
      font-size: 38.67px
  }

  .print-page .column.font-size-30 {
      font-size: 40px
  }

  .print-page .column.font-size-31 {
      font-size: 41.33px
  }

  .print-page .column.font-size-32 {
      font-size: 42.67px
  }

  .print-page .column.font-size-33 {
      font-size: 44px
  }

  .print-page .column.font-size-34 {
      font-size: 45.33px
  }

  .print-page .column.font-size-35 {
      font-size: 46.67px
  }

  .print-page .column.font-size-36 {
      font-size: 48px
  }

.ff-SimSum {
  font-family: SimSun,STSong
}

.ff-SimHei {
  font-family: SimHei,STHeiti
}

.ff-KaiTi {
  font-family: KaiTi,STKaiti
}

  .editor {
      z-index: 10;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 12px;
      outline: 0;
      line-height: 32px;
      padding: 3px 5px 3px 3px;
      border: none;
      background: 0 0;
      cursor: text
  }

  .table-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-top: dashed 1px #0DB3A6;
      border-bottom: dashed 1px #0DB3A6;
      overflow: hidden
  }

  .table-content table {
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
      width: 100%
  }

  .table-content table tr:first-child td {
      border-top: solid 1px #e0e0e0
  }

  .table-content table td {
      border-right: solid 1px #e0e0e0;
      border-bottom: solid 1px #e0e0e0
  }

  .table-content table td:first-child {
      border-left: solid 1px #e0e0e0
  }

}

</style>

