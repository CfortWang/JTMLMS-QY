
export default {
  props: {
    /**
     * @description 管理列
     */
    rowHandle: {
      /* type: Object,
      default: null */
    }
  },
  computed: {
    rowHandleDisplayButtonnumber() {
      if (!this.rowHandle) return 2
      return this.rowHandle.buttonNumber || 2
    },
    rowHandleDisplay() {
      return this.rowHandle.effect === 'display'
    },
    rowHandleActions() {
      if (!this.rowHandle || !this.rowHandle.actions) return null
      if (this.rowHandleDisplay) {
        return this.rowHandle.actions.length >= this.rowHandleDisplayButtonnumber ? this.rowHandle.actions.slice(0, this.rowHandleDisplayButtonnumber) : this.rowHandle.actions
      } else {
        return this.rowHandle.actions
      }
    },
    rowHandleMoreActions() {
      return this.rowHandle && this.rowHandle.actions.length >= this.rowHandleDisplayButtonnumber ? this.rowHandle.actions.slice(this.rowHandleDisplayButtonnumber, this.rowHandle.actions.length) : null
    },
    rowHandleDefaultWidth() {
      if (this.rowHandleDisplay) {
        return this.rowHandleDisplayButtonnumber * 70 + 50
      } else {
        return this.$i18n.locale === 'en' ? 75 : 50
      }
    }
  },
  methods: {
    /**
     * 是否有按钮
     * @param {*} row  行的数据
     * @param {*} data
     */
    hasRowHandleActions(row, data) {
      if (!this.rowHandleActions) return false
      for (let i = 0; i < this.rowHandleActions.length; i++) {
        if (this.handleActionHidden(this.rowHandleActions[i].hidden, row, data)) {
          return true
        }
      }
      return false
    },
    /**
     * 处理按钮隐藏，显示
     */
    handleActionHidden(hidden = false, row, data) {
      let isHidden = !hidden
      if (typeof hidden === 'boolean') {
        isHidden = !hidden
      } else if (typeof hidden === 'function') {
        isHidden = !hidden.call(this, row, data)
      }
      return isHidden
    }
  }
}
