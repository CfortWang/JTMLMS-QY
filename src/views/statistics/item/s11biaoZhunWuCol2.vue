<template>
  <!-- <div @click="toDetailed()" class="statisticsPage" :style="{width:width}"> -->
  <div class="statisticsPage" :style="{width:width}">
    <div :id="id" :style="{height:height}"/>
    <!-- 打开详情弹窗-->
    <div v-if="dialogOff">
      <dialogView
        :dialogOff = "dialogOff"
        @close = "close"
        :title="title"
        :data="data"
      />
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import dialogView from '../properties/s11biaoZhunWuPro.vue'
  import {GetPercent,GetMax} from  '../js/config.js'
  export default {
    components:{
      dialogView
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
        default: "100%"
      },
      id:{
        type:String,
        default:"s11biaoZhunWu"
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'true'
      }
    },
    data () {
      return {
        // title:'各个标准物质期间核查数量',
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
        let that = this
        let s11biaoZhunWu = echarts.init(document.getElementById(this.id))
        let barColor = ['#66FFCC','#FFCCCC','#33FF00','#FF66CC','#EC5800','#AAFF00','#F8DE7E','#B87333','#FF4433','	#9F2B68','#C9A9A6','#C3B1E1','#880808','#097969','#89CFF0','#5D3FD3','	#FBCEB1','#E49B0F','#ECFFDC','#A52A2A','#D27D2D','#FFBF00','#A0522D','#FF00FF','#FFB6C1','#F89880','#D8BFD8','#5D3FD3','#770737','#DA70D6']
        let barNum = []
        for (let i = 0; i < this.data.Num.title.length-1; i++) {
          barNum.push({
            type: 'bar',
            itemStyle: {color: barColor[i]},
            label:{
              normal:{
                show:true,
                position:'top',
                        
                textStyle:{
                  fontSize:12,
                  color:'#B0CEFC'
                }
              }
            },
            markLine: {
                  symbol: ['none', 'none'], // 去掉箭头
                  // label:{
                  //   show: true,
                  //   position: 'right',
                  //   color: barColor[i],
                  //   formatter: function (params) {
                  //     return that.data.Num.titleall[i].zhi_liang_mu_biao
                  //   },
                  // },
                  data: [
                    {
                      name: '阈值',
                      yAxis: this.data.Num.xianzhi[i]*1
                    }
                  ],
                  lineStyle: {
                    color: barColor[i]
                  }
                } 
          })
          
        }  
        // let that = this
        let option = {
           //v3
          title: {
            // text: this.title,
            textStyle:{ fontSize:14,color: this.colorw }
          },
          tooltip: {
                // 当trigger : axis 鼠标移入标线不会有悬浮框出现 params的值为一个数组，只会悬浮series
                // 当trigger : item 鼠标移入标线有悬浮框出现 params的值为一个对象，会区别鼠标移入的是series还是markLine
                // 使用axis 注释掉formatter 自己写也行 ；使用item放开formatter
                show: true,
                trigger: "item",//axis item
                axisPointer: {
                    type: "cross",
                    label: {
                        backgroundColor: "#6a7985",
                    },
                },
                formatter: (params) => {
                  return that.data.Num.titleall[params.seriesIndex].zhi_liang_mu_biao
                }
            },
          legend: {
            textStyle: {
              fontSize: 8,
              color: '#B0CEFC'  // 图例文字颜色
            }

          },
          grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
          },
          xAxis: { 
            splitLine:{show: false},
            type: 'category',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'   //这里用参数代替了
              }
            },
            axisLine:{
              lineStyle:{
                color:'#fff',
                width:1, //x轴线的宽度
              }
            }
          },
          yAxis: {
            splitLine:{show: false},
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'    //这里用参数代替了
              }
            },
            axisLine:{
              lineStyle:{
                color:'#fff',
                width:1, //x轴线的宽度
              }
            }
          },
          dataset: {
            dimensions: this.data.Num.title,
            source: this.data.Num.number
          },
          series: barNum,
          dataZoom: [
            {
                id: 'dataZoomY',
                type: 'inside',
                yAxisIndex: [0],
                filterMode: 'empty'
            }
          ],
       
       };
        
       option && s11biaoZhunWu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s10waiBuNengLi:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
