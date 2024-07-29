<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div :id="'pre'+id" :style="{height:'100%',width:'100%'}"/>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import { getFormatDate } from '../utils/config.js'
  export default {
    props: {
      value: {
        type: Array,
      },
      width:{
        type:String,
        default:"100%"
      },
      height:{
        type:String,
        default: "100%"
      },
      id:{
        type:Number,
        default:0
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'#fff'
      },
      title:{
        type: String
      },
      data: {
        type: Array,
      }
    },
    data () {
      return {
      }
    },
    watch: {
        value: {
            handler () {
                this.drawLine()
            },
            deep: true
        }
    },
    mounted(){
      setTimeout(() => {
        this.drawLine()
      }, 100);
    },
    methods: {
      drawLine(){
        let xData = []
        let yData = []
        // let yData1 = []
        // let yData2 = []
        this.value.forEach(e => {
          xData.push(e.date)
          yData.push(e.num)
          // yData1.push(e.numUn)
          // yData2.push(e.numAll)
        })
        const that = this
        let pre = echarts.init(document.getElementById('pre'+this.id))
        let option
        option = {
          title: {
            text: this.title,
            left: 'left',
            textStyle:{ fontSize:28,color: this.colorw }
          },
          grid: {
            left: '3%',
            right: '1%',
            bottom: '10%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: xData,
            axisLabel: {
                color: '#fff'
            },
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
                color: '#fff'
            },
            splitLine:{
              show:true,
              lineStyle:{
                  type: [15,8],
                  color: ['#fff'],
              }
            }
          },
          series: [
            {
              // name: 'num',
              type: 'bar',
              barWidth: 20,
              color: 'rgb(16,142,233)',
              data: yData
            }
          ]
       };
       option && pre.setOption(option);
      },
    }
  }
</script>
<style scoped>
  /* #zlmbPie:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  } */
  .statisticsPage{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 1%;
      background-color: rgba(6, 30, 93, 0.5);
  }
</style>
