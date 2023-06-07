/**
 * 窗口高度修复
 */
export default {
  mounted() {
    this.ibpsDialogHeight = this.fixIbpsDialogHeight()
    window.addEventListener('resize', this.handleDialogHeightResize)
  },
  methods: {
    handleDialogHeightResize() {
      this.ibpsDialogHeight = this.fixIbpsDialogHeight()
    },
    fixIbpsDialogHeight() {
      const h = document.documentElement.clientHeight || document.body.clientHeight
      return h
    }
  }
}
