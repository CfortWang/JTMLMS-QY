<template>
  <div class="pieView">
    <div style="
        line-height: 30px;
        text-align: left;
        padding-left: 10px;
        width: 100%;
        color: white;
      ">
      {{ config.title }}
    </div>
    <div v-if="config.state=='100'" style="
        width: 100%;
        height: 95%;
        display: inline-block;
        overflow: hidden;
        box-sizing: border-box;
      ">
      <div :id="config.id"
           style="width: 100%; height: 100%"></div>
    </div>
    <div v-else style="
        width: 100%;
        height: 90%;
        display: inline-block;
        overflow: hidden;
        box-sizing: border-box;
        margin-top:5%;
      ">
      <div :id="config.id"
           style="width: 100%; height:90%"></div>
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
  padding-bottom: -10px;
  box-sizing: border-box;
  overflow: hidden;
  color: white;
  background-color: rgba(6, 30, 93, 0.5);
}
</style>