<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div style="height:8%;font-size:28px;font-weight: 600;"> {{title}} </div>
    <div style="height:90%;display:flex;justify-content: space-between;">
      <div :id="'staff'+id" :style="{height:'100%',width:'76%'}"/>
      <staff-list v-model="data" :style="{height:'80%',width:'22%'}"></staff-list>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import { getFormatDate } from '../utils/config.js'
  export default {
    components: {
        StaffList: () => import('./staffList.vue')
    },
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
        let yData1 = []
        let yData2 = []
        this.value.forEach(e => {
          xData.push(e.date)
          yData.push(e.numReal)
          yData1.push(e.numUn)
          yData2.push(e.numAll)
        })
        const that = this
        let staff = echarts.init(document.getElementById('staff'+this.id))
        let option
        option = {
          grid: {
            left: '3%',
            right: '1%',
            bottom: '20%',
            top: '10%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            formatter: function (params) {
              let str = `${that.value[params[0].dataIndex].date}`
              params.forEach(item =>{
                let nameNum = ''
                if(item.seriesName === 'numUn'){
                  nameNum = '未参加人数'
                }else if(item.seriesName === 'numReal'){
                  nameNum = '实际参训人数'
                }else if(item.seriesName === 'numAll'){
                  nameNum = '培训总人数'
                }
                str += `<br /> ${item.marker} ${nameNum}  ${item.data}`
              })
              return str
            }
          },
          legend: {
            data: ['numReal', 'numUn', 'numAll'],
            textStyle: {
              color: '#fff'
            },
            icon: 'circle',
            bottom: 0,
            formatter: function (name) {
              if(name === 'numUn'){
                return '未参加人数';
              }else if(name === 'numReal'){
                return '实际参训人数';
              }else if(name === 'numAll'){
                return '培训总人数';
              }
            }
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
            // boundaryGap:true,
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
              name: 'numReal',
              type: 'bar',
              barWidth: 10,
              color: 'rgb(78,203,115)',
              data: yData
            },
            {
              name: 'numUn',
              type: 'bar',
              barWidth: 10,
              color: 'rgb(251,211,55)',
              data: yData1
            },
            {
              name: 'numAll',
              type: 'line',
              color: 'rgb(16,142,233)',
              data: yData2
            }
          ]
       };
       option && staff.setOption(option);
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
