<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <div style="height:10%;font-size:24px;font-weight: 600;"> {{title}} </div>
    <div v-show="show" style="height:92%;display:flex;justify-content: space-between;">
      <div :id="'staff'+id" :style="{height:'100%',width:'76%'}"/>
      <staff-list v-model="staffData" :style="{height:'80%',width:'22%'}"></staff-list>
    </div>
    <div v-show="!show" class="nullShow">暂无数据</div>
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
        valueArr:[],
        show: false,
        staffData: []
      }
    },
    watch: {
        value: {
            handler (val,old) {
              if(val.length>0){
                this.show = true
                this.valueArr.length=0
                val.forEach((item, i) => {
                  let mid = {date: getFormatDate('string', 5, 10, item.date)+'\n'+ item.dayName, numAll: item.numAll, numReal: item.numReal, numUn: item.numUn}
                  this.valueArr.push(mid)
                })
                setTimeout(() => {
                  this.drawLine()
                  this.staffData = this.data
                }, 100)
              }else{
                this.show = false
              }
            },
            deep: true
        }
    },
    mounted(){
      // setTimeout(() => {
      //   this.drawLine()
      // }, 100);
    },
    methods: {
      drawLine(){
        let xData = []
        let yData = []
        let yData1 = []
        let yData2 = []
        this.valueArr.forEach(e => {
          xData.push(e.date)
          yData.push(e.numReal)
          yData1.push(e.numUn)
          yData2.push(e.numAll)
        })
        const that = this
        echarts.dispose(document.getElementById('staff'+this.id))
        let staff = echarts.init(document.getElementById('staff'+this.id))
        let option
        option = {
          grid: {
            left: '3%',
            right: '1%',
            bottom: '25%',
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
              let str = `${that.valueArr[params[0].dataIndex].date}`
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
      padding: 1% 1% 0 1%;
      /* background-color: rgba(6, 30, 93, 0.5); */
  }
  .nullShow{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    height: 92%;
  }
</style>
