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
        title:'标准物质期间核查数量',
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
                  fontSize:16,
                  color:'#B0CEFC'
                }
              }
            }
          })
          
        }  

        let option = {
           //v3
          title: {
            // text: this.title,
            textStyle:{ fontSize:14,color: this.colorw }
          },
          // tooltip: {
          //               trigger: 'axis',
          //               axisPointer: {
          //                 type: 'shadow'
          //               },
          //               formatter: function (datas) {
          //                 // console.log(datas)
          //                   var res=datas[0].name+"<BR>"+'期间核查次数:'+datas[0].data+"<BR>期间核查完成次数"+datas[1].data
          //                   // res+='百分比:'+(datas[1].value==null||datas[1].value==0?"0.00":(datas[0].value/datas[1].value*100).toFixed(2))+"%"
          //                   return res
          //               }
          // },
          legend: {
            textStyle: {
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
