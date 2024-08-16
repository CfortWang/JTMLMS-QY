<template>
  <div class="statisticsPage" :style="{width:width,height:height}">
    <!-- <div style="height:8%;font-size:28px;font-weight: 600;"> {{title}} </div> -->
    <!-- <div style="height:90%;display:flex;justify-content: space-between;"> -->
      <div :id="'staff'+id" :style="{height:'100%'}"/>
    <!-- </div> -->
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import { getFormatDate } from '../utils/config.js'
  export default {
    components: {
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
        correspondence: {
          numO: '1年以下',
          numOT: '1-3年',
          numTF: '3-5年',
          numF: '5年以上',
          numAll: '设备总数',
          numR: '良好数',
          numS: '停用数',
          numP: '待处理',
          numC: '已完成',
          numJ: '计划数',
          numW: '完成数',
        },
        // color: ['rgb(78,203,115)', 'rgb(251,211,55)', 'rgb(16,142,233)']
        color: ['#5470c6', '#339933', '#FF0033', 'rgb(251,211,55)']
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
        const that = this
        let xData = []
        for (const key in this.value[0]) {
          // if (this.value[0].hasOwnProperty.call(object, key)) {
            xData.push(key)
          // }
        }
        
        let serArr = []
        for (let i = 1; i < xData.length; i++) {
          let ser = {
            name: '',
            type: 'bar',
            barWidth: 10,
            color: ''
          }
          ser.name = xData[i]
          ser.color = this.color[i-1]
          serArr.push(ser)
        }
        let staff = echarts.init(document.getElementById('staff'+this.id))
        let option

        option = {
          title: {
            text: this.title,
            left: 'left',
            textStyle:{ fontSize:24,color: this.colorw }
          },
          legend: {
            left: 'left',
            top: '40',
            textStyle: {
              color: '#fff'
            },
            formatter: function (name) {
              return that.correspondence[name]
            }
          },
          grid: { // 让图表占满容器
              top: '80px',
              left: '65px',
              right: '60px',
              bottom: '40px'
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
              let str = `${that.value[params[0].dataIndex].org}`
              params.forEach(item =>{
                let nameNum = ''
                nameNum = that.correspondence[item.seriesName]
                str += `<br /> ${item.marker} ${nameNum}  ${item.data[item.seriesName]}`
              })
              return str
            }
          },
          dataset: {
            dimensions: xData,
            source: this.value
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              color: '#fff',
              interval: 0,
              rotate: 20
            }
          },
          yAxis: {
            axisLabel: {
              color: '#fff'
            },
            // interval: interval
          },
          series: serArr
        }
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
      /* background-color: rgba(6, 30, 93, 0.5); */
  }
</style>
