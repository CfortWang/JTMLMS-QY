<template>
  <div class="pieView">
    <div style="height: 10%;width: 100%;line-height: 30px;text-align: left;padding-left: 10px;">{{info.config.title}}</div>   
    <div style="width:100%;height:90%;display: inline-block;">
      <div :id="info.config.idSelector" style="width:100%;height:100%;"> </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      yAxisNum:1,
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
      console.log(this.info.config,"asdho")
      var chartDom = document.getElementById(this.info.config.idSelector);
      var myChart = echarts.init(chartDom);
      let ay =this.info.data;
      let yc;
      ay[0] > ay[1]?yc=ay[0]:yc=ay[1];
      this.yAxisNum =parseInt(yc / 6) ;
      this.yAxisNum ==0? this.yAxisNum =1:'';
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.info.xData,
            interval: 2,
            axisTick: {
              alignWithLabel: false,
            },
            axisLabel: {
              fontSize: 12,
              rotate: 25,
              formatter:function(value){  
                var str = ""; 
                var num = 6; //每行显示字数 
                var valLength = value.length; //该项x轴字数  
                var rowNum = Math.ceil(valLength / num); // 行数  
                if(rowNum > 1) {
                    for(var i = 0; i < rowNum; i++) {
                        var temp = "";
                        var start = i * num;
                        var end = start + num;
                        
                        temp = value.substring(start, end) + "\n";
                        str += temp; 
                    }
                    return str;
                } else {
                    return value;
                } 
            },
            },
            axisLine: {
            lineStyle: {
              color: "#fff",
              width:1
            }
          }
          },
        ],
        yAxis: [
          {
            type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          interval:15
        },
        ],
        series: [
          {
            type: "bar",
            data: this.info.data,
            barWidth: 30,
            label:{
              show: true,
              position: 'top',
              color:"#fff"
            },
            itemStyle: {
            normal: {
                color: function(params) {
                    var colorList = ['#5c7bd9', '#9fe080', '#339933', '#ffdc60','#f9210b', '#ff915a'];
                    return colorList[params.dataIndex]
                }
            }
        }
          },
          
        ],
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