<template>
  <div @click="toDetailed()" class="statisticsPage" :style="{width:width}">
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
        default: window.screen.height/4+"px"
      },
      id:{
        type:String,
        default:"s12fengXian"
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
        title:'实验室活动风险识别与控制数量',
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
        let s12fengXian = echarts.init(document.getElementById(this.id))
        // let beingDate=this.data.t_complaintBegin.date
        // let endDate=this.data.t_complaintEnd.date
        var option;

        //v3
        let e=[this.data.t_mjsyshdfxsbykzjhxbNum.numberAll,this.data.t_mjsyshdfxsbykzjhxbNum.numbe]
        // let e=[this.data.t_mjsyshdfxsbykzjhxbNum.number[0],this.data.t_mjsyshdfxsbykzjhxbNum.numberAll[0],this.data.t_mjsyshdfxsbykzjhxbNum.res[0]]

        option = {
            legend: {},
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              // formatter: function (params) {
              //   return params[0].data[0] + '<br/>满意份数：' + params[0].data[1] + '<br/>调查总份数: ' + params[0].data[2];
              // }
            },
            // dataset: {
            //   source: barData
            // },
            xAxis: { 
              type: 'category',
              data:[ '风险控制总数','风险控制已完成数量']
              // data:['已完成', '总数量', '完成率']
            },
            yAxis: [
              {
                type: 'value',
                scale: true,
                name: '数量',
                max: this.data.t_mjsyshdfxsbykzjhxbNum.number[0]>this.data.t_mjsyshdfxsbykzjhxbNum.numberAll[0]?this.data.t_mjsyshdfxsbykzjhxbNum.number[0]+1:this.data.t_mjsyshdfxsbykzjhxbNum.numberAll[0]+1,
                min: 0,
                // boundaryGap: [0.2, 0.2]
              },
              // {
              //   type: 'value',
              //   scale: true,
              //   name: '完成率',
              //   max: this.data.t_mjsyshdfxsbykzjhxbNum.res[0],
              //   min: 0,
              //   axisLabel: {
              //     formatter: '{value} %'
              //   }
              // }
            ],
            series: [
              {
                data: e,
                type: 'bar',
                barWidth: '20%',

                itemStyle: {
                  color: '#cc6633'
                },
                label: {
                show: true,
                position: 'top'
              },
              }
            ],
            grid: {
              top: '20%',
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            title: {
              text: this.title,
              textStyle:{ fontSize:14,color: this.colorw }

              // subtext: "        "+beingDate+"-"+endDate
            }
        };

        option && s12fengXian.setOption(option);
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
