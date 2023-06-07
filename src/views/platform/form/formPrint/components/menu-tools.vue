<template>
  <div class="ibps-print-menu">
    <div class="menu-tool">
      <div
        v-for="(tools,type) in MENU"
        :key="type"
        class="menu-group-wrapper"
        :class="{'has-select':tools.select}"
      >
        <template v-for="(menu,action) in tools">

          <template v-if="type === 'merge'">
            <div
              v-show="menu.visible"
              :key="action"
              class="menu-item"
              :class="{
                [menu.icon]:true,
                'has-select':menu.select
              }"
            >
              <el-tooltip :content="menu.tip" placement="bottom">
                <div
                  class="menu-icon"
                  :class="[menu.icon]"
                  @click="handleMenuClick(type,action,menu.value)"
                />
              </el-tooltip>
            </div>
          </template>
          <template v-else>
            <div
              :key="action"
              class="menu-item"
              :class="{
                [action]:true,
                'has-select':menu.combo,
                'select':menu.select
              }"
            >
              <el-tooltip :content="menu.tip" placement="bottom">
                <div
                  v-if="menu.combo"
                  class="menu-icon"
                  :class="[menu.icon]"
                >
                  <!--边框--->
                  <template v-if="action === 'borderLine'">
                    <el-popover
                      v-model="borderLineVisible"
                      placement="bottom"
                      :width="menu.combo.width"
                      trigger="click"
                    >
                      <div slot="reference" class="menu-select menu-select-icon">
                        <i class="el-icon-caret-bottom el-icon--right" />
                      </div>
                      <div
                        v-for="(item,ci) in menu.combo.items"
                        :key="ci"
                        class="combo-item-icon"
                        @click="borderLineVisible = false
                                handleMenuClick(type,action,item.value)"
                      >
                        <div class="icon-content" :class="item.value" />
                      </div>
                    </el-popover>
                  </template>
                  <!--选择图片，纸张，高度--->
                  <template v-else-if="action==='setBgImg'|| action === 'page' || action === 'cellHeight'">
                    <el-popover
                      placement="bottom"
                      :width="menu.combo.width"
                      trigger="click"
                    >
                      <div slot="reference" class="menu-select menu-select-icon">
                        <i class="el-icon-caret-bottom el-icon--right" />
                      </div>
                      <set-bg-image
                        v-if="action === 'setBgImg'"
                        :value="menu.value"
                        @upload="handleImageClick(type,action)"
                        @callback="(d)=>{ _menuOnStopEdit(type,action,d)}"
                      />
                      <set-pages
                        v-else-if="action === 'page'"
                        :value="menu.value"
                        :design="pageDPI"
                        @callback="(d)=>{ _menuOnStopEdit(type,action,d)}"
                      />
                      <set-cell-height
                        v-else-if="action === 'cellHeight'"
                        :value.sync="menu.value"
                      />
                    </el-popover>
                  </template>

                  <el-dropdown
                    v-else
                    trigger="click"
                    @command="(value)=>{handleMenuClick(type,action,value)}"
                  >
                    <div>
                      <template v-if="action === 'fontFamily' || action === 'fontSize' ">
                        {{ menu.value | optionsFilter(menu.combo.items) }}
                        <i class="el-icon-caret-bottom el-icon--right" />
                      </template>
                      <div v-else class="menu-select menu-select-icon">
                        <i class="el-icon-caret-bottom el-icon--right" />
                      </div>
                    </div>

                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(item,ci) in menu.combo.items">
                        <el-dropdown-item
                          v-if="$utils.isObject(item)"
                          :key="ci"
                          :command="item.value"
                        >
                          <template v-if="item.label">
                            {{ item.label }}
                          </template>
                          <template v-else>
                            <template v-if="action === 'borderWeight'">
                              <div class="item-line-wrapper">
                                <div v-if="item.value === 0" class="item-text">无边框</div>
                                <div
                                  v-else
                                  class="item-line"
                                  :style="{
                                    'border-bottom-width':item.value+'px'
                                  }"
                                />
                              </div>
                            </template>
                            <template v-else>
                              {{ item.value }}
                            </template>
                          </template>
                        </el-dropdown-item>
                        <el-dropdown-item
                          v-else
                          :key="ci"
                          :command="item"
                        >
                          {{ item }}
                        </el-dropdown-item>
                      </template>
                    </el-dropdown-menu>

                  </el-dropdown>
                </div>
                <template v-else>
                  <!--图标类型-->
                  <div class="menu-icon" :class="[menu.icon]" @click="handleMenuClick(type,action,!menu.select)" />
                </template>

              </el-tooltip>
            </div>
          </template>
        </template>
      </div>
    </div>

    <ibps-uploader-selector-dialog
      :visible="selectorVisible"
      :multiple="false"
      accept="*"
      @close="visible => selectorVisible = visible"
      @action-event="handleSelectorActionEvent"
    />
  </div>
</template>
<script>
import { toFixed } from '../utils/index'
import SetPages from './set-pages'
import SetBgImage from './set-bg-image'
import SetCellHeight from './set-cell-height'
import IbpsUploaderSelectorDialog from '@/business/platform/file/uploader'
export default {
  components: {
    SetPages,
    SetBgImage,
    SetCellHeight,
    IbpsUploaderSelectorDialog
  },
  data() {
    return {
      borderLineVisible: false,
      selectorVisible: false,
      curAction: '',
      pageDPI: 96,
      MENU: {
        undoRedo: {
          undo: {
            tip: '撤销',
            icon: 'undo',
            enable: false,
            select: false
          },
          redo: {
            tip: '重做',
            icon: 'redo',
            enable: false,
            select: false
          }
        },
        fontStyle: {
          fontFamily: {
            tip: '字体',
            icon: 'family',
            value: 'SimSun',
            combo: {
              items: [{
                value: 'SimSun',
                label: '宋体'
              }, {
                value: 'KaiTi',
                label: '楷体'
              }, {
                value: 'SimHei',
                label: '黑体'
              }],
              width: 75
            },
            enable: true,
            select: false
          },
          fontSize: {
            tip: '字号',
            icon: 'size',
            value: 9,
            combo: {
              items: [9, 10, 11, 12, 14, 18, 24, 30, 36],
              width: 75
            },
            enable: true,
            select: false
          },
          bold: {
            tip: '粗体',
            icon: 'bold',
            enable: true,
            select: false
          },
          italic: {
            tip: '斜体',
            icon: 'italic',
            enable: true,
            select: false
          },
          underline: {
            tip: '下划线',
            icon: 'underline',
            enable: true,
            select: false
          }
        },
        align: {
          top: {
            tip: '顶部对齐',
            icon: 'top',
            enable: true,
            select: false
          },
          middle: {
            tip: '居中对齐',
            icon: 'center',
            enable: true,
            select: false
          },
          bottom: {
            tip: '底部对齐',
            icon: 'bottom',
            enable: true,
            select: false
          },
          left: {
            tip: '左对齐',
            icon: 'align-left',
            enable: true,
            select: false
          },
          center: {
            tip: '居中对齐',
            icon: 'align-center',
            enable: true,
            select: false
          },
          right: {
            tip: '右对齐',
            icon: 'align-right',
            enable: true,
            select: false
          }
        },
        border: {
          borderLine: {
            tip: '边框线',
            icon: 'border-left',
            enable: true,
            combo: {
              items: [{
                value: 'bottom'
              }, {
                value: 'top'
              }, {
                value: 'left'
              }, {
                value: 'right'
              }, {
                value: 'none'
              }, {
                value: 'all'
              }, {
                value: 'outer'
              }],
              width: 163,
              customCls: 'padding-large'
            },
            select: false
          },
          borderWeight: {
            tip: '边框线粗细',
            icon: 'border',
            value: 0,
            enable: true,
            combo: {
              items: [{
                value: 0
              }, {
                value: 1
              }, {
                value: 2
              }, {
                value: 3
              }, {
                value: 4
              }],
              width: 116
            },
            select: false
          }
        },
        insert: {
          insert: {
            tip: '插入/删除',
            icon: 'insert-row',
            value: 'insertRow',
            enable: true,
            combo: {
              items: [{
                icon: 'insert-row',
                value: 'insertRow',
                label: '插入行'
              }, {
                icon: 'insert-col',
                value: 'insertCol',
                label: '插入列'
              }, {
                icon: 'del-row',
                value: 'delRow',
                label: '删除行'
              }, {
                icon: 'del-col',
                value: 'delCol',
                label: '删除列'
              }],
              width: 116
            },
            select: false
          }
        },
        merge: {
          merge: {
            tip: '合并',
            icon: 'merge',
            enable: true,
            visible: true,
            select: false
          },
          unmerge: {
            tip: '取消合并',
            icon: 'unmerge',
            enable: true,
            visible: false,
            select: false
          }
        },
        img: {
          insertImg: {
            tip: '插入图片',
            icon: 'insert-img',
            enable: true,
            select: false,
            value: {
              file: null
            }
          },
          setBgImg: {
            tip: '设置背景图',
            icon: 'set-img',
            enable: true,
            value: {
              file: null,
              printable: false
            },
            combo: {
              width: 208
            },
            select: false
          }
        },
        paper: {
          page: {
            tip: '纸张设置',
            icon: 'paper',
            value: {
              pageSize: 'A4',
              pageDir: 'portrait',
              pageWidth: 210,
              pageHeight: 297,
              pagePaddingLeft: 17.8,
              pagePaddingRight: 17.8,
              pagePaddingTop: 19.1,
              pagePaddingBottom: 19.1
            },
            enable: true,
            combo: {
              width: 300
            },
            select: false
          }
        },
        global: {
          cellHeight: {
            tip: '单元格高度设置',
            icon: 'auto_cell_height',
            value: false,
            enable: true,
            combo: {
              width: 300
            },
            select: false
          },
          headerFooter: {
            tip: '页眉页脚',
            icon: 'header-footer',
            enable: true
          }
        }
      }
    }
  },
  methods: {
    setMerge(a) {
      switch (a) {
        case 'merge':
          this.MENU.merge.merge.visible = true
          this.MENU.merge.unmerge.visible = false
          break
        case 'unmerge':
          this.MENU.merge.unmerge.visible = true
          this.MENU.merge.merge.visible = false
      }
    },
    setEnable(enable) {
      this.enable = enable
      for (const key in this.MENU) {
        for (const v in this.MENU[key]) {
          this.MENU[key][v].enable = enable
        }
      }
    },
    setMenuEnable(a, b, c) {
      if (this.MENU[a] && this.MENU[a][b]) {
        this.MENU[a][b].enable = c
      }
    },
    setMenuStyles(styles) {
      this._clearMenuState()
      for (const key in styles) {
        const style = styles[key]
        if (this.$utils.isEmpty(style)) {
          continue
        }
        switch (key) {
          case 'vertical-align':
          case 'text-align':
            if (this.MENU.align[style]) {
              this.MENU.align[style].select = true
            }
            break
          case 'font-weight':
          case 'font-style':
          case 'text-decoration':
            if (this.MENU.fontStyle[style]) {
              this.MENU.fontStyle[style].select = true
            }
            break
          case 'font-size':
            this.MENU.fontStyle.fontSize.value = style
            break
          case 'font-family':
            this.MENU.fontStyle.fontFamily.value = style
            break
        }
      }
    },
    _clearMenuState: function() {
      for (const key in this.MENU) {
        for (const v in this.MENU[key]) {
          this.MENU[key][v].select = false
        }
      }
    },
    _setSelect: function(type, action, value) {
      var verticalAligns = ['top', 'middle', 'bottom']
      var textAligns = ['center', 'left', 'right']
      var f = ['merge', 'unmerge', 'undo', 'redo', 'fontSize', 'fontFamily', 'borderLine', 'borderWeight']
      if (verticalAligns.some(function(align) {
        return align === action
      })) {
        this._setMutexSelect(verticalAligns, type, action, value)
      } else if (textAligns.some(function(align) {
        return align === action
      })) {
        this._setMutexSelect(textAligns, type, action, value)
      } else {
        if (f.some(function(a) {
          return a === action
        })) {
          switch (action) {
            case 'fontSize':
            case 'fontFamily':
              this.MENU[type][action].value = value
              break
          }

          return
        }

        this.MENU[type][action].select = value
      }
    },

    _setMutexSelect: function(styles, type, action, value) {
      // 其他类型设置为false
      styles.forEach(style => {
        this.MENU[type][style].select = false
      })
      this.MENU[type][action].select = value
    },
    _menuOnStopEdit(type, action, data) {
      var value
      switch (action) {
        case 'setBgImg':
          value = this.MENU[type][action].value
          break
        case 'page':
          this.MENU[type][action].value = data
          value = this._formatPageValue(data)
          break
      }
      this.handleMenuClick(type, action, value)
    },
    handleImageClick(type, action) {
      this.curAction = action
      this.selectorVisible = true
    },

    handleMenuClick(type, action, value) {
      if (action === 'insertImg') {
        this.handleImageClick(type, action)
      } else {
        // 设置选中
        this._setSelect(type, action, value)
        this.emitMenuClick(type, action, value)
      }
    },
    emitMenuClick(type, action, value) {
      this.$emit('menu-click', {
        type: type,
        action: action,
        value: value
      })
    },
    _mm2PT: function(a, b) {
      if (this.$utils.isNumber(a)) {
        return parseFloat(toFixed((a / 25.4 * this.pageDPI), b))
      }
    },
    _pt2MM: function(a, b) {
      if (this.$utils.isNumber(a)) {
        return parseFloat(toFixed((a / this.pageDPI * 25.4), b))
      }
    },
    _formatPageValue: function(page) {
      var size = page.pageSize === 'auto' ? [this._mm2PT(page.pageWidth, 6), this._mm2PT(page.pageHeight, 6)] : page.pageSize
      return {
        size: size,
        layout: page.pageDir,
        margin: [
          this._mm2PT(page.pagePaddingTop, 6),
          this._mm2PT(page.pagePaddingRight, 6),
          this._mm2PT(page.pagePaddingBottom, 6),
          this._mm2PT(page.pagePaddingLeft, 6)]
      }
    },
    setMenuValue(content) {
      if (this.$utils.isEmpty(content)) {
        return
      }
      this.pageDPI = content.dpi.design
      for (const key in content) {
        const c = content[key]
        switch (key) {
          case 'page':// 页面
            if (Array.isArray(c.size)) {
              this.MENU.paper.page.value.pageSize = 'auto'
              this.MENU.paper.page.value.pageWidth = this._pt2MM(c.size[0], 1)
              this.MENU.paper.page.value.pageHeight = this._pt2MM(c.size[1], 1)
            } else {
              this.MENU.paper.page.value.pageSize = c.size
              this.MENU.paper.page.value.pageDir = c.layout
            }
            if (Array.isArray(c.margin)) {
              var top = 0
              var right = 1
              var bottom = 2
              var left = 3
              if (c.margin.length === 2) {
                bottom = 0
                left = 1
              }
              this.MENU.paper.page.value.pagePaddingTop = this._pt2MM(c.margin[top], 1)
              this.MENU.paper.page.value.pagePaddingRight = this._pt2MM(c.margin[right], 1)
              this.MENU.paper.page.value.pagePaddingBottom = this._pt2MM(c.margin[bottom], 1)
              this.MENU.paper.page.value.pagePaddingLeft = this._pt2MM(c.margin[left], 1)
            }
            break
          case 'images':// 图片
            if (this.$utils.isNotEmpty(c.background)) {
              this.MENU.img.setBgImg.value.file = c.background
            }
            break
          case 'background':// 背景
            this.MENU.img.setBgImg.value.printable = c.printable
            break
          case 'global':// 全局  [单元格高度]
            this.MENU.global.cellHeight.value = c.auto_cell_height
            break
          default:
            break
        }
      }
    },
    getMenuValue() {
      return {
        background: {
          printable: this.MENU.img.setBgImg.value.printable,
          image: 'background'
        },
        images: {
          background: this.MENU.img.setBgImg.value.file
        },
        page: this._formatPageValue(this.MENU.paper.page.value),
        global: {
          auto_cell_height: this.MENU.global.cellHeight.value
        }
      }
    },
    handleSelectorActionEvent(buttonKey, data) {
      const type = 'img'
      const action = this.curAction
      switch (buttonKey) {
        case 'confirm':// 确定
          this.selectorVisible = false
          this.MENU[type][action].value.file = {
            id: data.id,
            fileName: data.fileName
          }
          this.emitMenuClick(type, action, this.MENU[type][action].value.file)
          break
      }
    }
  }
}
</script>
<style lang="scss" >
.ibps-print-menu{
  .menu-tool{
      display: inline-block;
      padding-left: 10px;
      height: 45px;
      border-left: 1px solid #e0e0e0;
      .menu-group-wrapper{
        padding: 0 10px;
        display: inline-block;
        position: relative;
        height: 45px;

        &:after{
          content: '';
          background: #BEBEBE;
          width: 1px;
          height: 18px;
          position: absolute;
          top: 14px;
          right: 1px
        }

        &:last-child:after {
            content: none
        }

        .menu-item {
            color:#000000;
            position: relative;
            margin: 10px 0;
            width: 30px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            display: inline-block;
            cursor: pointer;
            border: solid 1px transparent;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
             &.select,
             &:hover {
              border-color: #e0e0e0;
          }
            &.label{
              width: 125px;
              .menu-icon{
                background: 0 0;
                width: 125px
              }
            }
            &.label.select{
              border: none;
              cursor: auto;
            }
            &.has-select {
              width: 40px;
            }

            &.fontFamily {
              width: 50px;
            }
            &.fontSize {
              width: 50px;
            }

            &.fontSize>.menu-icon {
             width: 40px
            }

            &.marginBottom,
            &.marginTop{
                width: 70px
            }

            &.marginBottom ,
            &.marginTop  {
              width: 40px;
              background: 0 0
            }

            .menu-select-icon{
              display: flex;
              align-items: center;
              i{
                margin-top: 2px;
                margin-left: 18px;
              }
            }

      //图标
        .menu-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 18px;
            height: 18px;
            line-height: 20px;
            -webkit-transform: translate(-50%,-50%);
            -moz-transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
            -o-transform: translate(-50%,-50%);
            transform: translate(-50%,-50%);
            font-size: 14px;
            background-size: 243px 54px;
            background-image: url(../../../../../assets/images/form/print_menu_tool_icon.png);

            &.undo{
              background-position: 41.65% 0
            }

            &.redo {
              background-position: 0 100%
            }

            &.family,
            &.size {
              background: 0 0
            }
             &.family{
               width: 60px;
             }

            &.bold{
              background-position: 58.31% 0
            }

            &.italic {
              background-position: 16.66% 50%
            }

            &.underline {
              background-position: 33.32% 50%
            }

            &.top {
              background-position: 91.63% 50%
            }

            &.bottom {
                background-position: 41.65% 50%
            }

            &.center{
                background-position: 74.97% 50%
            }

            &.align-center{
                background-position: 66.64% 0
            }

            &.align-left{
                background-position: 83.3% 0
            }

            &.align-right {
                background-position: 74.97% 0
            }

            &.border-left {
                background-position: 8.33% 100%
            }

            &.borde{
              background-position: 0 0
            }

            &.insert-row{
              background-position: 33.32% 0
            }

            &.merge{
              background-position: 49.98% 0
            }

            &.unmerge {
                background-position: 91.63% 0
            }

            &.insert-img {
              background-position: 24.99% 0
            }

            &.set-img{
              background-position: 8.33% 0
            }

            &.paper {
               background-position: 0 50%
            }

            &.auto_cell_height {
              background-position: 24.99% 100%
            }

            &.header-footer {
                background-position: 16.66% 100%
            }

            &.paper-header-fork {
              background-position: 33.32% 100%
            }

            &.clean-all {
              background-position: 33.32% 0
            }
            &.clean-header{
              background-position: 99.96% 50%;
            }
            &.clean-footer{
              background-position: 99.96% 0;
            }
          }

        }
    }

  }

  //  .menu-tool .menu-group-wrapper .menu-item.has-select,.fx_print_page_menu .menu-tool .menu-group-wrapper .menu-item.has-select {
  //     width: 40px;
  //     text-align: left;
  //     padding-left: 5px
  // }

  //  .menu-tool .menu-group-wrapper .menu-item.has-select:after,.fx_print_page_menu .menu-tool .menu-group-wrapper .menu-item.has-select:after {
  //     font-family: FontAwesome;
  //     content: '\e677 ';
  //     position: absolute;
  //     top: -1px;
  //     right: 2px;
  //     font-size: 12px
  // }

  //  .menu-tool .menu-group-wrapper .menu-item.has-select .menu-icon,.fx_print_page_menu .menu-tool .menu-group-wrapper .menu-item.has-select .menu-icon {
  //     -webkit-transform: translate(-70%,-50%);
  //     -moz-transform: translate(-70%,-50%);
  //     -ms-transform: translate(-70%,-50%);
  //     -o-transform: translate(-70%,-50%);
  //     transform: translate(-70%,-50%)
  // }

  //  .menu-tool .menu-group-wrapper .menu-item .x-loader-icon,.fx_print_page_menu .menu-tool .menu-group-wrapper .menu-item .x-loader-icon {
  //     margin: 5px auto 0 auto;
  //     width: 18px;
  //     height: 18px
  // }

}

.item-line-wrapper {
    width: 105px;
    height: 27px;
    .item-text{
      text-align: center;
      font-size: 12px;
    }
  .item-line {
    padding-top: 15px;
    border-bottom: solid #000
  }
}

 .padding-large {
    padding: 15px 9px;
    overflow: hidden
}

 .combo-item-icon {
    position: relative;
    float: left;
    left: 0;
    margin: 6px;
    cursor: pointer
}

 .combo-item-icon:hover {
    background: #ecf5ff
}

.combo-item-icon .icon-content {
    width: 23px;
    height: 23px;
    background-size: 300px 69px;
       background-image: url(../../../../../assets/images/form/print_menu_tool_icon.png);
}

 .combo-item-icon .icon-content.left {
    background-position: 8.33% 100%
}

.combo-item-icon .icon-content.right {
    background-position: 8.33% 50%
}

.combo-item-icon .icon-content.top {
    background-position: 83.3% 50%
}

.combo-item-icon .icon-content.bottom {
    background-position: 24.99% 50%
}
 .combo-item-icon .icon-content.all {
    background-position: 66.64% 50%
}

 .combo-item-icon .icon-content.none {
    background-position: 49.98% 50%
}

 .combo-item-icon .icon-content.outer {
    background-position: 58.31% 50%
}

</style>
