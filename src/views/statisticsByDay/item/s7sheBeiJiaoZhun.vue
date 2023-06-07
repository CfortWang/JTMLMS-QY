<template>
  <div @click="toDetailed()" class="statisticsPage" :style="{width:width}">
    <div :id="id" :style="{height:height}"/>
    <!-- 打开详情弹窗-->
     
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {GetPercent,GetMax} from  '../js/config.js'
 
  export default {
    components:{
       
    },
    props: {
      data: {
        type: Object,
      },
      width:{
        type:String,
        default:"20%"
      },
      height:{
        type:String,
        default: window.screen.height/4+"px"
      },
      id:{
        type:String,
        default:"s7sheBeiJiaoZhun2"
      },
      click:{
        type:String,
        default:'true'
      },
    },
    data () {
      return {
        title:'设备校准',
        dialogOff:false,
      }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
      close(){
        this.dialogOff = false
      },
      /* 跳转统计页面*/
      toDetailed(){
        if(this.click == "true"){
        this.dialogOff = true
       }
      },
      drawLine(){
        let s7sheBeiJiaoZhun = echarts.init(document.getElementById(this.id))
// prettier-ignore
let dataAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
// prettier-ignore
let data = [120, 132, 141, 154, 160, 170, 180, 193, 202, 211, 220, 239];
let yMax = 500;
let dataShadow = [];
for (let i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}
let option = {
  title: {
    text: '设备校准',
    subtext: '校准次数'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
                 formatter: function (datas) {
                     var res='校准次数:'+datas[0].value
                     return res
                 }
  },
  xAxis: {
    data: dataAxis,

    z: 10,
    Interval: 1
  },
  yAxis: {

    axisLabel: {
      color: '#000'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#27727B' },
          { offset: 0.5, color: '#27727B' },
          { offset: 1, color: '#27727B' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#27727B' },
            { offset: 0.7, color: '#27727B' },
            { offset: 1, color: '#27727B' }
          ])
        }
      },
      data: data
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize = 6;
s7sheBeiJiaoZhun.on('click', function (params) {
  console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
  s7sheBeiJiaoZhun.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
    endValue:
      dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
  });
});
 option && s7sheBeiJiaoZhun.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s4renyuanPeiXun:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
