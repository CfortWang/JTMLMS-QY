<template>
  <!-- <div @click="toDetailed()" class="statisticsPage" :style="{width:width}"> -->
  <div class="statisticsPage" :style="{width:width}">
    <div :id="'bar'+id" :style="{height:height}"/>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    props: {
      value: {
        type: Array,
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
        type:Number,
        default:1
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
      },
      title:{
        type: String
      }
    },
    data () {
      return {
        dialogOff:false,
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
        let bar = echarts.init(document.getElementById('bar'+this.id))
        let option;
        let that = this
        let barColor = ['#00CCFF','#33FF00','#FF0000','#FFBF00','#097969','#FF66CC','#EC5800','#AAFF00','#F8DE7E','#B87333','#FF4433','	#9F2B68','#C9A9A6','#C3B1E1','#880808','#097969','#89CFF0','#5D3FD3','	#FBCEB1','#E49B0F','#ECFFDC','#A52A2A','#D27D2D','#FFBF00','#A0522D','#FF00FF','#FFB6C1','#F89880','#D8BFD8','#5D3FD3','#770737','#DA70D6']
        let barNum = []
        const title = ['name', 'numAll', 'numSuccess', 'numUn']
        for (let i = 0; i < title.length-1; i++) {
          if(i==title.length-3){
            barNum.push({
              type: 'bar',
              itemStyle: {color: barColor[i]},
              label:{
                show: true,
				formatter:function(params){ //标签内容
                    let str = that.direction=='x'?params.value[params.seriesName]+' '+params.data.rate+'%':params.data.rate+'%\n'+params.value[params.seriesName]
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
              show:true,
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
              show:true,
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
            text: this.title+'各组完成情况',
            textStyle:{ fontSize:14,color: this.colorw }
          },
          legend: {
                textStyle: {
                  fontSize: 12,
                  color: '#B0CEFC'  // 图例文字颜色
                },
                top:"5%",
                formatter: function (name) {
                  if(name === 'numUn'){
                    return '未完成数量';
                  }else if(name === 'numSuccess'){
                    return '已完成数量（完成率）';
                  }else if(name === 'numAll'){
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
            dimensions: title,
            source: this.value
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
       option && bar.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s8sheBeiHeCha:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
