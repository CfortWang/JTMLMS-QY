const loadMore = {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const selectWrapDom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    selectWrapDom.addEventListener('scroll', function() {
      const condition = this.scrollHeight - this.scrollTop - 1 <= this.clientHeight
      if (condition) {
        binding.value()
      }
    })
  }
}

const install = function(Vue) {
  Vue.directive('load-more', loadMore)
}

if (window.Vue) {
  window['load-more'] = loadMore
  window.Vue.use(install)
}

loadMore.install = install
export default loadMore
