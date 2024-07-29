<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div style="height:8%;font-size:28px;font-weight: 600;"> {{ title }} </div>
    <div style="height:92%;display:flex">
      <div style="width:30%;display: flex;margin-top: 5%;">
        <div style="width: 100%;display:flex;border: 1px solid #fff;padding: 5%;height: 50%;display: flex;align-items: center;flex-flow: column;">
          <div style="width: 100%;height:20%;font-size: 20px;">自动创建培训计划</div>
          <div style="display:flex;height: 90%;display: flex;align-items: center;width:100%">
            <div style="width: 46%;display:flex;flex-flow: column;height: 100%;font-size: 20px;">
              <div style="line-height: 250%;">{{data.num}}</div>
              <div>占比{{data.proportion}}%</div>
            </div>
            <div :id="'jobPie'+id" :style="{height:'100%',width:'64%'}"/>
          </div>
        </div>
      </div>
      <div :id="'job'+id" :style="{height:'100%',width:'70%'}"/>
    </div>
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
      }
    },
    watch: {
        value: {
            handler () {
                this.drawLine()
            },
            deep: true
        },
        data: {
            handler () {
                this.drawLinePie()
            },
            deep: true
        }
    },
    mounted(){
      setTimeout(() => {
        this.drawLine()
        this.drawLinePie()
      }, 100);
      
    },
    methods: {
      drawLine(){
        let xData = []
        let yData = []
        this.value.forEach(e => {
          xData.push(getFormatDate('string', 5, 10, e.date)+'\n'+e.week)
          yData.push(e.value)
        })
        const that = this
        let job = echarts.init(document.getElementById('job'+this.id))
        let option;
        option = {
          title: {
            text: '近一周计划发布',
            left: 'left',
            textStyle:{ fontSize:20,color: this.colorw }
          },
          grid: {
            left: '5%',
            right: '3%',
            bottom: '15%',
            top: '15%'
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
                { value: this.data.proportion, name: 'Search Engine' },
                { value: 100-this.data.proportion, name: 'Direct' }
              ]
            }
          ]
       }
       option && jobPie.setOption(option)
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
      background-color: rgba(6, 30, 93, 0.5);
  }
</style>
