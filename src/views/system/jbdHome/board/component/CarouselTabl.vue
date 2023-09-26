<template>
  <div style="width: 100%;height: 100%;overflow: hidden;">
    <div class="title"
         style="vertical-align: top; height: 10%;font-size: 16px;color: white;">{{ title }}</div>
    <div style="width:100%;height: 90%;display: inline-block;background-color: #06163f;">
      <dv-scroll-board :config="configData"
                       style="width:100%;height:100%" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      configData: {}
    };
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: "",
    },
  },
  watch: {
    info: {
      handler(newVal, oldVal) {
        this.configData = { ...newVal }
      },
      deep: true,
      immediate: true
    }
  }

};
</script>
<style lang="scss" module>
.pieView {
  width: 100%;
}
</style>