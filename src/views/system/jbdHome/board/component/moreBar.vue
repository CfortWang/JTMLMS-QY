<template>
  <div class="pieView">
    <div style="height: 10%;line-height: 30px;text-align: left;padding-left: 6px;width: 100%;">
      {{info.config.title}}
    </div>   
    <div style="width:100%;height:90%;display: inline-block;"  v-show="showChart">
      <div :id="info.config.idSelector" style="width:100%;height:100%;"> </div>
    </div>
    <div style="background: #061237;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;" v-if="!showChart">
      <div style="color: #c7c7c7">目前无数据</div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      yAxisNum:1,
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
    this.$nextTick(()=>{
      this_.getMiddleLeft();
    })
  },
  methods: {
    getMiddleLeft() {
      let this_ = this;
      let series = [];
      
      if(this_.info.data.source[0] == 999 ){
        this.showChart = false;
        return
      }
      for(let item of this.info.config.colors){
        series.push({
            type: 'bar',
            color:item,            
            label:{
              show: true,
              position: 'top',
              color:"#fff"
            }, 
          })
      }
      var chartDom = document.getElementById(this.info.config.idSelector);
      var myChart = echarts.init(chartDom);
      let option = {
        legend: {
          left: "left",
          textStyle: {
            color: "#fff",
          },
        },
        grid:{ // 让图表占满容器
          top:"40px",
          left:"40px",
          right:"40px",
          bottom:"40px"
        },
        tooltip: {},
        dataset: {
        dimensions: this_.info.data.dimensions,
        source: this_.info.data.source,
      },
      xAxis: { 
        type: 'category' ,
        axisLabel: {
          color: "#fff",
          interval:0,  
          rotate:20 
        }
      },
      yAxis: {
        axisLabel: {
          color: "#fff",

        }
      },
      series: series
    };
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.pieView {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(6,30,93,.5);
}
</style>