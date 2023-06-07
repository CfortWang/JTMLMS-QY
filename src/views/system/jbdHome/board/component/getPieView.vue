<template>
  <div class="pieView">
    <div style="height: 14%;line-height: 30px;text-align: left;padding-left: 10px;color: white;">{{info.config.title||""}}</div>   
    <div style="width:100%;height:86%;display: inline-block; overflow: hidden;">
      <div :id="info.config.idSelector" style="width:100%;height:95%;overflow: hidden;"> </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data(){
    return{
    }
  },
  props:{
    info:{
      type:Object,
      default:{}
    }
  },
  mounted() {
    let this_ = this;
    this.$nextTick(()=>{
      this_.getMiddleLeft();
    })
    
  },
  methods:{
    getMiddleLeft(){ 
      let chartDom = document.getElementById(this.info.config.idSelector);
      // const setEchartWH = {
      //   //设置控制图表大小变量
      //   width: 350,
      //   height: 320,
      // };
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          show: true,
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: '600'
        },
        },
        
        color:this.info.color,
        tooltip: {
          trigger: 'item',
          formatter: '{d}%'
        },
        label: {
          formatter: '{b}\n({d}%)',
          edgeDistance: "20%"
        },
        
        legend: {
          show: true,
          z: 3,
          
          // orient: 'vertical', 标题横竖//
          left: 'right',
          textStyle:{
            color: '#fff'
          }
        },
        series: [{
          type: 'pie',
          radius: '50%',
          center: ['50%', '50%'],
          data:this.info.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
              distanceToLabelLine: 0,
             
            },
        }]
      };
      myChart.setOption(option);
    },

  }
};
</script>
<style lang="scss" scoped>
.pieView{
  // display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(6,30,93,.5);
}
</style>