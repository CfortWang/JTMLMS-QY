<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div style="height:8%;font-size:24px;font-weight: 600;"> {{ title }} </div>
    <div v-show="show" style="height:92%;display:flex">
      <div style="width:28%;margin: 4% 5% 0 0;">
        <div class="leftSty">
          <div class="numSize">非计划<div class="numColor"> {{ data.manual + ' ' }} ({{calculatedPercentage(data.manual, data.total)}}%) </div></div>
          <div style="flex: 1;"></div>
          <div class="numSize">计划内<div class="numColor" >{{ data.autoNum + ' ' }} ({{calculatedPercentage(data.autoNum, data.total)}}%) </div></div>
          <div style="flex: 6;"><div :id="'jobPie'+id" :style="{height:'8vh',width:'100%'}"/></div>
          <!-- <div style="width: 100%;font-size: 2vh;">自动创建培训计划</div>
          <div style="display:flex;display: flex;align-items: center;width:100%">
            <div style="width: 46%;display:flex;flex-flow: column;height: 100%;font-size: 2vh;">
              <div style="line-height: 250%;color: rgb(250, 200, 88);">{{data.autoNum}}</div>
              <div style="color: rgb(250, 200, 88);">占比{{data.rate}}%</div>
            </div>
            <div :id="'jobPie'+id" :style="{height:'8vh',width:'64%'}"/>
          </div> -->
        </div>
      </div>
      <div :id="'job'+id" :style="{height:'100%',width:'72%'}"/>
    </div>
    <div v-show="!show" class="nullShow">暂无数据</div>
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
        type: Object,
      }
    },
    data () {
      return {
        show: false
      }
    },
    watch: {
        value: {
            handler (val, old) {
              if(val.length>0){
                this.show = true
                setTimeout(() => {
                  this.drawLine()
                  this.drawLinePie()
                }, 100)
              }else{
                this.show = false
              }
            },
            deep: true
        },
        // data: {
        //     handler () {
        //         this.drawLinePie()
        //     },
        //     deep: true
        // }
    },
    mounted(){
      // setTimeout(() => {
      //   this.drawLine()
      //   this.drawLinePie()
      // }, 100);
      
    },
    methods: {
      drawLine(){
        let xData = []
        let yData = []
        this.value.forEach(e => {
          xData.push(getFormatDate('string', 5, 10, e.date)+'\n'+e.dayName)
          yData.push(e.value)
        })
        const that = this
        echarts.dispose(document.getElementById('job'+this.id))
        let job = echarts.init(document.getElementById('job'+this.id))
        let option;
        option = {
          title: {
            text: '近一周计划发布',
            left: 'left',
            textStyle:{ fontSize:18,color: this.colorw },
            itemGap: 20
          },
          grid: {
            left: '5%',
            right: '3%',
            bottom: '15%',
            top: '20%'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              return `${that.value[params[0].dataIndex].date} <br /> ${params[0].marker} ${params[0].data}`
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLabel: {
                color: '#fff'
            }
          },
          yAxis: {
            type: 'value',
            // minInterval: 1,
            min:0,
            axisLabel: {
                color: '#fff',
                formatter: function(value) {
                  console.log(value)
                  return (value+'').indexOf('.')===-1?value: ''
                }
            },
            splitLine:{
              show:true,
              lineStyle:{
                  type: [15,8],
                  color: ['rgba(255,255,255,0.5)'],
              }
            }
          },
          series: [
            {
              data: yData,
              type: 'line',
              smooth: true,
              itemStyle: {
                color: 'rgba(24,146,234,1)'
              },
              areaStyle: {
                opacity: 0.8,
                color: 'rgba(24,146,234,0.5)'
              }
            }
          ]
       };
       option && job.setOption(option);
      },
      drawLinePie(){
        const that = this
        echarts.dispose(document.getElementById('jobPie'+this.id))
        let jobPie = echarts.init(document.getElementById('jobPie'+this.id))
        let option
        option = {
          tooltip: {
            show: false,
            trigger: 'item'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['60%', '90%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              itemStyle:{
                color: function(params) {
                  let colorList = ['#1892ea','#e9e9e9'];
                  return colorList[params.dataIndex];
                }
              },
              emphasis: {
                scale: false
              },
              labelLine: {
                show: false
              },
              data: [
                { value: this.data.rate, name: 'Search Engine' },
                { value: 100-this.data.rate, name: 'Direct' }
              ]
            }
          ]
       }
       option && jobPie.setOption(option)
      },
      calculatedPercentage(up, down){
        console.log(typeof (up*100/down),'(up/down).toFixed(2)')
        if(down !== 0){
          let a = (up*100/down).toFixed(2)

          if(this.isInfinit(a)){
            return '0.00'
          }else{
            return a
          }
          
        }else{
          return '0.00'
        }
        
      },
      isInfinit(num) {
        return isNaN(num) || Math.abs(num) === Infinity;
      }
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
    /* background-color: rgba(6, 30, 93, 0.5); */
  }
  .leftSty{
    width: 90%;
    display:flex;
    background-color: rgba(84, 112, 198, 0.3);
    border-radius: 10px;
    padding: 10%;
    /* height: 50%; */
    display: flex;
    align-items: center;
    /* flex-flow: column; */
  }
  .nullShow{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    height: 92%;
  }
  .numColor{
    color: rgb(250, 200, 88);
    margin: 2vh 0;
    letter-spacing: normal;
  }
  .numSize{
    font-size: 2vh;
    flex: 5;
    letter-spacing: 3px;
  }
</style>
