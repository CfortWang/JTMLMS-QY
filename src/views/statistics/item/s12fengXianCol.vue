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
  import * as echarts from 'echarts'
  import dialogView from '../properties/s12fengXianPro.vue'
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
        default:"s12fengXianfb"
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'true'
      },
      direction:{
        type:String,
        default:'y'
      }
    },
    data () {
      return {
        title:'实验室活动风险识别与控制各部门完成情况',
        dialogOff:false,
        measured:[]
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

        // let beginInof = Number(this.data.t_complaintBegin.number)
        // let endInof = Number(this.data.t_complaintEnd.number)
        let s12fengXiancol = echarts.init(document.getElementById(this.id))
        let option;
        let that = this
        let barColor = ['#00CCFF','#33FF00','#FF0000','#FFBF00','#097969','#FF66CC','#EC5800','#AAFF00','#F8DE7E','#B87333','#FF4433','	#9F2B68','#C9A9A6','#C3B1E1','#880808','#097969','#89CFF0','#5D3FD3','	#FBCEB1','#E49B0F','#ECFFDC','#A52A2A','#D27D2D','#FFBF00','#A0522D','#FF00FF','#FFB6C1','#F89880','#D8BFD8','#5D3FD3','#770737','#DA70D6']
        let barNum = []
        for (let i = 0; i < this.data.num.title.length-1; i++) {
          if(i==this.data.num.title.length-3){
            barNum.push({
              type: 'bar',
              itemStyle: {color: barColor[i]},
              label:{
                show: true,
				        formatter:function(params){ //标签内容
                  let str = that.direction=='x'?params.value[params.seriesName]+' '+params.data.chu+'%':params.data.chu+'%\n'+params.value[params.seriesName]
					        return str
					      },
                position: this.direction=='x'?'right':'top',
                textStyle:{
                    fontSize: 12,
                    color:'#B0CEFC'
                  }
              }
            })
          }else{
            barNum.push({
              type: 'bar',
              itemStyle: {color: barColor[i]},
              label:{
                normal:{
                  show:true,
                  position:this.direction=='x'?'right':'top',
                          
                  textStyle:{
                    fontSize: 12,
                    color:'#B0CEFC'
                  }
                }
              }
            })
          }
          
        }  
        let heng = { 
            splitLine:{show: false},
            type: 'category',
            minInterval: 1,
            min: 0,
            axisLabel: {
              show: true,
              textStyle: {
                color: this.colorw   //这里用参数代替了
              },
              fontSize: 12
            },
            axisLine:{
              show: true,
              lineStyle:{
                color:this.colorw,
                width:1, //x轴线的宽度
              }
            },
            axisTick:{
              show:true
            }
          }
        let zong = {
            splitLine:{show: false},
            minInterval: 1,
            min: 0,
            axisLabel: {
              show: true,
              textStyle: {
                color: this.colorw    //这里用参数代替了
              },
              fontSize: 12
            },
            axisLine:{
              show: true,
              lineStyle:{
                color:this.colorw,
                width:1, //x轴线的宽度
              }
            },
            axisTick:{
              show:true
            }
          }
        option = {
            title: {
            text: this.title,
            textStyle:{ fontSize:14,color: this.colorw }
          },
          legend: {
                textStyle: {
                  fontSize: 12,
                  color: '#B0CEFC'  // 图例文字颜色
                },
                top:"5%",
                formatter: function (name) {
                  if(name === 'wnum'){
                    return '未完成数量';
                  }else if(name === 'num'){
                    return '已完成数量（完成率）';
                  }else if(name === 'numA'){
                    return '计划数量';
                  }
                    
                }

          },
          grid: {
                top: '15%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
          },
          xAxis: this.direction=='x'?zong:heng,
          yAxis: this.direction=='x'?heng:zong,
          dataset: {
            dimensions: this.data.num.title,
            source: this.data.num.number
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

        option && s12fengXiancol.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s12fengXian:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
