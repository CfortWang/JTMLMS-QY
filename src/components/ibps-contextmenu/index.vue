<template>
  <div
    v-show="flag"
    :style="style"
    class="ibps-contextmenu"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ibps-contextmenu',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    menulist: {
      type: Array,
      default: () => []
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number
    }
  },
  data() {
    return {
      borderStyle: '',
      flag: false
    }
  },
  computed: {
    style() {
      return {
        left: this.x + 'px',
        top: this.y + 'px',
        display: this.visible ? 'block' : 'none ',
        zIndex: this.zIndex,
        border: this.menulist.length === 0 ? 'none' + '!important' : '1px solid #cfd7e5'
      }
    }
  },
  watch: {
    visible(val) {
      this.flag = val
      if (this.flag) {
        // 注册全局监听事件 [ 目前只考虑鼠标解除触发 ]
        window.addEventListener('mousedown', this.watchContextmenu)
      }
    },
    flag: {
      handler(val) {
        this.$emit('update:visible', val)
      },
      deep: true
    }
  },
  mounted() {
    // 将菜单放置到body下
    document.querySelector('body').appendChild(this.$el)
  },
  destroyed() {
    if (this.$el && this.$el.remove) { this.$el.remove() }
  },
  methods: {
    watchContextmenu(event) {
      if (!this.$el.contains(event.target) || event.button !== 0) this.flag = false
      window.removeEventListener('mousedown', this.watchContextmenu)
    }
  }
}
</script>

<style lang="scss">
.ibps-contextmenu {
  position: absolute;
  padding: 5px 0;
  z-index: 2018;
  background: #FFF;
  border: 1px solid #cfd7e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
</style>
