<template>
  <div class="print-page-menu">
    <div class="menu-tool">
      <div
        v-for="(tools,type) in MENU"
        :key="type"
        class="menu-group-wrapper"
        :class="{'has-select': tools.select}"
      >
        <template v-for="(menu,action) in tools">

          <template v-if="action === 'marginTop' || action === 'marginBottom'">
            <template v-if="menu.visible">
              <div :key="action+0" class="menu-item label">
                <div class="menu-icon">{{ menu.label }}</div>
              </div>
              <div
                :key="action+1"
                class="menu-item has-select"
                :class="action"
              >
                <div
                  class="menu-icon"
                  :class="action"
                >
                  <el-dropdown
                    trigger="click"
                    @command="(value)=>{
                      handleMenuClick(type,action,value)}"
                  >
                    <div>
                      {{ menu.value }}mm<i class="el-icon-caret-bottom el-icon--right" />
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(item,ci) in menu.combo.items">

                        <el-dropdown-item
                          :key="ci"
                          :command="ci"
                        >
                          {{ ci }}mm
                        </el-dropdown-item>

                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div
              v-if="menu.visible"
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
                  <el-dropdown
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
                            {{ item.value }}
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
                  <div

                    class="menu-icon"
                    :class="[menu.icon]"
                    @click="handleMenuClick(type,action,!menu.select)"
                  />
                </template>

              </el-tooltip>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { toFixed } from '../utils/index'
export default {
  data() {
    return {
      borderLineVisible: false,
      selectorVisible: false,
      curAction: '',
      pageDPI: 96,
      MENU: {
        style: {
          marginTop: {
            label: '页眉顶端距离：',
            enable: true,
            select: false,
            visible: true,
            defaultValue: 5,
            value: 5,
            combo: {
              items: [],
              width: 75,
              height: 180
            }
          },
          marginBottom: {
            label: '页脚底端距离：',
            enable: true,
            select: false,
            visible: false,
            defaultValue: 5,
            value: 5,
            combo: {
              items: [],
              width: 75,
              height: 180
            }
          }
        },
        fontStyle: {
          fontFamily: {
            tip: '字体',
            icon: 'family',
            value: 'SimSun',
            visible: true,
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
            visible: true,
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
            visible: true,
            enable: true,
            select: false

          },
          italic: {
            tip: '斜体',
            icon: 'italic',
            visible: true,
            enable: true,
            select: false
          },
          underline: {
            tip: '下划线',
            icon: 'underline',
            visible: true,
            enable: true,
            select: false
          }
        },
        align: {
          left: {
            tip: '左对齐',
            icon: 'align-left',
            visible: true,
            enable: true,
            select: false
          },
          center: {
            tip: '居中对齐',
            icon: 'align-center',
            visible: true,
            enable: true,
            select: false
          },
          right: {
            tip: '右对齐',
            icon: 'align-right',
            visible: true,
            enable: true,
            select: false
          }
        },
        page: {
          number: {
            tip: '插入页码',
            icon: 'paper-header-fork',
            visible: true,
            enable: true,
            select: false
          }
        },
        clean: {
          all: {
            tip: '清除所有',
            icon: 'clean-all',
            visible: true,
            enable: true,
            select: false
          },
          header: {
            tip: '清除页眉',
            icon: 'clean-header',
            enable: true,
            select: false,
            visible: true
          },
          footer: {
            tip: '清除页脚',
            icon: 'clean-footer',
            enable: true,
            select: false,
            visible: false
          }

        }
      }
    }
  },
  methods: {
    init({ fonts, pageDPI, margin }) {
      this._formatMargin('marginTop', margin.top)
      this._formatMargin('marginBottom', margin.bottom)
    },

    _formatMargin: function(action, margin) {
      margin = this._pt2MM(margin, 6)
      var c = margin - parseInt(margin)
      if (this.$utils.isEmpty(this.MENU.style[action].value)) {
        var d = Math.min(this.MENU.style[action].defaultValue, parseInt(margin))
        this.MENU.style[action].value = parseInt(d + c)
      }
      this.MENU.style[action].combo.items = []
      for (var e = 0; e <= margin; e++) {
        this.MENU.style[action].combo.items.push(e === 0 ? 0 : e + c)
      }
    },
    _clearMenuState: function() {
      for (const key in this.MENU) {
        for (const v in this.MENU[key]) {
          this.MENU[key][v].select = false
        }
      }
    },
    setMenuStyles: function(styles) {
      var _this = this
      this._clearMenuState()

      for (const key in styles) {
        const style = styles[key]
        if (this.$utils.isEmpty(style)) {
          continue
        }
        switch (key) {
          case 'text-align':
            if (_this.MENU.align[style]) {
              _this.MENU.align[style].select = true
            }
            break
          case 'font-weight':
          case 'font-style':
          case 'text-decoration':
            if (_this.MENU.fontStyle[style]) { _this.MENU.fontStyle[style].select = true }
            break
          case 'font-size':
            _this.MENU.fontStyle.fontSize.value = style
            break
          case 'font-family':
            _this.MENU.fontStyle.fontFamily.value = style
            break
          case 'margin-top':
            _this.MENU.style.marginTop.value = _this._pt2MM(style)
            break
          case 'margin-bottom':
            _this.MENU.style.marginBottom.value = _this._pt2MM(style)
        }
      }
    },
    setHeaderFooter(type) {
      switch (type) {
        case 'header':
          this.MENU.style.marginTop.visible = true
          this.MENU.style.marginBottom.visible = false

          this.MENU.clean.header.visible = true
          this.MENU.clean.footer.visible = false
          break
        case 'footer':
          this.MENU.style.marginBottom.visible = true
          this.MENU.style.marginTop.visible = false

          this.MENU.clean.header.visible = false
          this.MENU.clean.footer.visible = true
      }
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

    _setSelect: function(type, action, value) {
      var textAligns = ['center', 'left', 'right']
      var f = ['fontSize', 'fontFamily', 'marginTop', 'marginBottom']
      if (textAligns.some(function(align) {
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
            case 'marginTop':
            case 'marginBottom':
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
    handleMenuClick(type, action, value) {
      // 设置选中
      this._setSelect(type, action, value)
      if (action === 'marginTop' || action === 'marginBottom') {
        value = this._mm2PT(value)
      }

      this.emitMenuClick(type, action, value)
    },
    emitMenuClick(type, action, value) {
      this.$emit('menu-click', {
        type: type,
        action: action,
        value: value
      })
    }
  }
}
</script>
<style lang="scss" >
.print-page-menu{
    position: absolute;
    left: 0;
    right: 0;
    height: 45px;
    border-left: solid 1px #e0e0e0;
    background: #fafafa;
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
               width: 70px;
              .menu-icon {
                  width: 70px;
                background: 0 0
              }
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

</style>
