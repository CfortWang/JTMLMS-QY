import { mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import { createMenu } from '../libs/util.menu'
import BScroll from 'better-scroll'

export default {
  name: 'ibps-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render(h) {
    return <div class='ibps-layout-header-aside-menu-side'>
      <el-menu
        collapse={ this.asideCollapse }
        collapseTransition={ this.asideTransition }
        uniqueOpened={ true }
        defaultActive={ this.$route.fullPath }
        ref='menu'
        onSelect={ this.handleMenuSelect }>
        { this.aside.map(menu => createMenu.call(this, h, menu)) }
      </el-menu>
      {
        this.aside.length === 0 && !this.asideCollapse
          ? <div class='ibps-layout-header-aside-menu-empty' flex='dir:top main:center cross:center'>
            <ibps-icon name='inbox'></ibps-icon>
            <span>{this.$t('layout.header-aside.menu-side.empty')}</span>
          </div>
          : null
      }
    </div>
  },
  data() {
    return {
      asideHeight: 300,
      BS: null
    }
  },
  computed: {
    
    ...mapState('ibps/menu', [
      'aside',
      'asideCollapse',
      'asideTransition'
    ])
  },
  watch: {
    
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse(val) {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    },

  },
  mounted() {
    // 这个插件会影响到滚动效果 修复菜单栏无法滚动的bug 先注释掉
    // this.scrollInit()
  },
  beforeDestroy() {
    this.scrollDestroy()
  },
  methods: {
    scrollInit() {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy() {
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
