<template>
  <div class="pieView">
    <div style="  height:14%;line-height:30px;text-align: left;padding-left: 10px;color: white;">
      {{ info.config.title || "" }}
    </div>
    <div style="width: 100%; height: 86%; display: inline-block; overflow: hidden" v-show="showChart">
      <div :id="info.config.idSelector" style="width: 100%; height: 95%; overflow: hidden" ></div>
    </div>
    <div style="background: #061237;width: 100%;height: 70%;display: flex;justify-content: center;align-items: center;" v-if="!showChart">
      <div style="color: #c7c7c7">目前无数据</div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      showChart: true,
    };
  },
  props: {
    info: {
      type: Object,
      default: {},
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
      let chartDom = document.getElementById(this.info.config.idSelector);
      var myChart = echarts.init(chartDom);
      const radius = window.innerWidth > 1600 ? "55%" : "45%";
      let inData = this.info.data;
      let num = 0;
      for (let i in inData) {
        num += inData[i].value;
      }
      if (num == 0) {
        this.showChart = false;
      } else {
        this.showChart = true;
      }
      var option;
      option = {
        title: {
          show: true,
          left: "center",
          textStyle: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "600",
          },
        },
        color: this.info.color,
        tooltip: {
          trigger: "item",
          formatter: "{d}%",
        },
        label: {
          formatter: "{b}\n({d}%)",
          edgeDistance: "20%",
        },

        legend: {
          show: true,
          // orient: 'vertical',
          itemGap: 6,
          z: 3,
          left: "left",
          textStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            type: "pie",
            radius: radius,
            center: ["50%", "50%"],
            data: this.info.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            labelLine: {
              distanceToLabelLine: 0,
            },
          },
        ],
      };
      myChart.setOption(option);
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
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(6, 30, 93, 0.5);
}
</style>