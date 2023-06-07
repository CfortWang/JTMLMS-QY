<template>
  <div class="ibps-multiple-page-control-group" flex>
    <div class="ibps-multiple-page-control-content" flex-box="1">
      <div class="ibps-multiple-page-control-content-inner">
        <ibps-contextmenu
          :visible.sync="contextmenuFlag"
          :x="contentmenuX"
          :y="contentmenuY"
        >
          <ibps-contextmenu-list
            :menulist="menulist"
            @row-click="contextmenuClick"
          />
        </ibps-contextmenu>
        <el-tabs
          :value="current"
          class="ibps-multiple-page-control  ibps-multiple-page-sort"
          type="card"
          @tab-click="handleClick"
          @tab-remove="handleTabRemove"
          @click.middle.native="handleCloseSelectedTag"
          @dblclick.native="handleRefresh"
          @contextmenu.native="handleContextmenu"
        >
          <el-tab-pane
            v-for="(page, index) in opened"
            :key="page.name+index"
            :label="generateTitle(page.meta.name,page.meta.title) || generateTitle('untitled')"
            :name="page.fullPath"
            :closable="tabClosabele(page)"
          />
        </el-tabs>
      </div>
    </div>
    <div
      class="ibps-multiple-page-control-btn"
      flex-box="0"
    >
      <el-dropdown
        size="default"
        @command="command => handleControlItemClick(command)"
      >
        <el-button size="default">
          <ibps-icon name="angle-down" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="menu in contextmenuList"
            :key="menu.value"
            :divided="menu.divided"
            :command="menu.value"
          >
            <template v-if="menu.type === 'divided'" />
            <span v-else>
              <ibps-icon :name="menu.icon" class="ibps-mr-10" />
              {{ menu.label }}
            </span>

          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Sortable from 'sortablejs'
import I18n from '@/utils/i18n'
import IbpsContextmenu from '@/components/ibps-contextmenu'
import IbpsContextmenuList from '@/components/ibps-contextmenu/components/contentmenu-list'
import setting from '@/setting.js'

export default {
  components: {
    IbpsContextmenu,
    IbpsContextmenuList
  },
  data() {
    const defaultIndex = setting.page.opened[0]
    return {
      defaultIndex: defaultIndex,
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuListDashboard: [
        { icon: 'times', label: I18n.t('layout.header-aside.tags.closeOther'), value: 'all' }
      ],
      contextmenuList: [
        { icon: 'arrow-left', label: I18n.t('layout.header-aside.tags.closeLeft'), value: 'left' },
        { icon: 'arrow-right', label: I18n.t('layout.header-aside.tags.closeRight'), value: 'right' },
        { type: 'divided' },
        { icon: 'times-circle-o', label: I18n.t('layout.header-aside.tags.close'), value: 'close', divided: true },
        { icon: 'times', label: I18n.t('layout.header-aside.tags.closeOther'), value: 'other' },
        { icon: 'times-circle', label: I18n.t('layout.header-aside.tags.closeAll'), value: 'all' }
      ],
      tagName: defaultIndex.fullPath
    }
  },
  computed: {
    ...mapState('ibps/page', [
      'opened',
      'current'
    ]),
    menulist() {
      return this.tagName === this.defaultIndex.fullPath || this.tagName === this.defaultIndex.name || this.tagName === '/refresh' ? this.contextmenuListDashboard : this.contextmenuList
    }
  },
  mounted() {
    const el = document.querySelectorAll('.ibps-multiple-page-sort .el-tabs__nav')[0]
    Sortable.create(el, {
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt
        this.openedSort({ oldIndex, newIndex })
      }
    })
  },
  methods: {
    ...mapActions('ibps/page', [
      'close',
      'closeLeft',
      'closeRight',
      'closeOther',
      'closeAll',
      'openedSort'
    ]),
    tabClosabele(page) {
      return !(page.fullPath === this.defaultIndex.fullPath || page.name === this.defaultIndex.name)
    },
    generateTitle(name, title, ...values) {
      return I18n.generateTitle(name, title, values)
    },
    /**
     * 获取选择的节点
     */
    getEventTarget(event) {
      const target = event.target
      if (target.className.indexOf('el-tabs__item') > -1) return target
      else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
        return target.parentNode
      }
    },
    /**
     * @description 右键菜单功能点击
     */
    handleContextmenu(event) {
      const target = this.getEventTarget(event)
      if (target) {
        event.preventDefault()
        event.stopPropagation()
        this.contentmenuX = event.clientX
        this.contentmenuY = event.clientY
        this.tagName = target.getAttribute('aria-controls').slice(5)
        this.contextmenuFlag = true
      }
    },
    /**
     * @description 右键菜单的row-click事件
     */
    contextmenuClick(command) {
      this.handleControlItemClick(command, this.tagName)
    },
    /**
     * @description 接收点击关闭控制上选项的事件
     */
    handleControlItemClick(command, tagName = null) {
      if (tagName) {
        this.contextmenuFlag = false
      }
      const params = {
        pageSelect: tagName
      }
      switch (command) {
        case 'left':
          this.closeLeft(params)
          break
        case 'right':
          this.closeRight(params)
          break
        case 'other':
          this.closeOther(params)
          break
        case 'all':
          this.closeAll()
          break
        case 'close':
          this.close(params)
          break
        default:
          this.$message.closeAll()
          this.$message.error('无效的操作')
          break
      }
    },
    /**
     * @description 接收点击关闭控制上按钮的事件
     */
    handleControlBtnClick() {
      this.closeAll()
    },
    /**
     * @description 接收点击 tab 标签的事件
     */
    handleClick(tab, event) {
      // 找到点击的页面在 tag 列表里是哪个
      const page = this.opened.find(page => page.fullPath === tab.name)
      if (page) {
        const { name, params, query } = page
        this.$router.push({ name, params, query })
      }
    },
    /**
     * @description 点击 tab 上的删除按钮触发这里
     * @param {String} tagName tab 名称
     */
    handleTabRemove(tagName) {
      this.close({ pageSelect: tagName })
    },
    handleCloseSelectedTag(event) {
      const target = this.getEventTarget(event)
      if (target) {
        const tagName = target.getAttribute('aria-controls').slice(5)
        this.handleTabRemove(tagName)
      }
    },
    /**
     * @description 仅刷新当前router组件 不影响其他已缓存的组件
     */
    handleRefresh() {
      this.$router.push({ name: 'refresh' })
    }
  }
}
</script>
