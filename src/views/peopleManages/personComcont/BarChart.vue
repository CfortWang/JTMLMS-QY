<template>
  <div class="pieView">
    <div
      style="
        height: 10%;
        line-height: 30px;
        text-align: left;
        padding-left: 10px;
        width: 100%;
        color: white;
      "
    >
      {{ config.title }}
    </div>
    <div
      style="
        width: 100%;
        height: 90%;
        display: inline-block;
        overflow: hidden;
        box-sizing: border-box;
      "
    >
      <div :id="config.id" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {};
  },
  props: {
    info: {
      type: Object,
      default: {},
    },
    config: {
      type: Object,
      default: {
        title: "title",
        id: "idSelector",
      },
    },
  },
  mounted() {
    let this_ = this;
    this.$nextTick(() => {
      this_.getMiddleLeft();
    });
  },
  methods: {
    getMiddleLeft() {
      var chartDom = document.getElementById(this.config.id);
      var myChart = echarts.init(chartDom);
      setTimeout(() => {
        this.info && myChart.setOption(this.info);
      }, 500);
    },
  },
  watch: {
    info: {
      handler(newVal, oldVal) {
        console.log("11111");
        this.getMiddleLeft();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.pieView {
  // display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  color: white;
  background-color: rgba(6, 30, 93, 0.5);
}
</style>