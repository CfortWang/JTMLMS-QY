<template>
  <!-- <div @click="toDetailed()" class="statisticsPage" :style="{width:width}"> -->
  <div class="statisticsPage" :style="{width:width}">
    <div :id="id" :style="{height:height}"/>
    <!-- 打开详情弹窗-->
    <!-- <div>2323</div> -->
    <div v-if="dialogOff">
      <dialogView
        :dialogOff = "dialogOff"
        @close = "close"
        :title="title"
        :data="data"
        :mubiao="mubiao"
      />
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import {GetPercent,GetMax} from  '../js/config.js'
  import dialogView from '../properties/s1zhiLiangMuBiaoPro.vue'

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
        default:"25%"
      },
      height:{
        type:String,
        default: "100%"
      },
      id:{
        type:String,
        default:"s1zhiLiangMuBiao"
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'true'
      },
      mubiao:{
        type:String,
        default:''
      }
    },
    data () {
      return {
        title:'管理评审完成情况',
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
        let s5zhiLiangMuBiao = echarts.init(document.getElementById(this.id))

        // let barData = []
        // for (let i = 0; i < this.data.t_jchzbNum.date.length; i++) {
          // let e=[]
          // e=[this.data.t_jchzbNum.number[0],this.data.t_jchzbNum.numberAll[0],this.data.t_jchzbNum.res[0]]
          // if (this.data.t_jchzbNum.numberAll[i]===0) {
          //   e =[this.data.t_jchzbNum.date[i], 0]
          // } else {
          //   e =[this.data.t_jchzbNum.date[i], Math.floor(this.data.t_jchzbNum.number[i]/this.data.t_jchzbNum.numberAll[i] * 10000) / 100]
          // }
          // barData.push(e)
        // }
        let e = 100 -this.data.t_jchzbNum.val
        // let n = 100 -this.data.t_jchzbNum.res[1]
        // let d = 100 -this.data.t_jchzbNum.res[2]
        let option = {
          title: {
            text: this.title,
            // subtext: 'Fake Data',
            left: 'left',
            textStyle:{ fontSize:14,color: this.colorw }
          },
          tooltip: {
            trigger: 'item'
          },
          color:['#66CC00','#CC0000'],
          // color:['#ffcc00','#66cc66','#999999'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%',
                color: '#fff',
                fontSize: '12px'
              },
              data: [
                { value: this.data.t_jchzbNum.val, name: '完成率' },
                { value: e, name: '未完成率' },
                // { value: this.data.t_jchzbNum.res[2], name: '未完成率' },
                // { value: e, name: '未完成率' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
          //v3
          // legend: {},
          //   tooltip: {
          //     trigger: 'axis',
          //     axisPointer: {
          //       type: 'shadow'
          //     },
          //     // formatter: function (params) {
          //     //   return params[0].data[0] + '<br/>满意份数：' + params[0].data[1] + '<br/>调查总份数: ' + params[0].data[2];
          //     // }
          //   },
          //   // dataset: {
          //   //   source: barData
          //   // },
          //   xAxis: { type: 'category',data:['按时完成数', '有效任务数', '及时完成率']},
          //   yAxis: [
          //     {
          //       type: 'value',
          //       scale: true,
          //       name: '数量',
          //       max: this.data.t_jchzbNum.number[0]>this.data.t_jchzbNum.numberAll[0]?this.data.t_jchzbNum.number[0]+1:this.data.t_jchzbNum.numberAll[0]+1,
          //       min: 0,
          //       // boundaryGap: [0.2, 0.2]
          //     },
          //     {
          //       type: 'value',
          //       scale: true,
          //       name: '任务及时完成率',
          //       max: this.data.t_jchzbNum.res[0],
          //       min: 0,
          //       axisLabel: {
          //         formatter: '{value} %'
          //       }
          //     }
          //   ],
          //   // Declare several bar series, each will be mapped
          //   // to a column of dataset.source by default.
          //   // series: [{ type: 'bar' }],
          //   series: [
          //     {
          //       data: e,
          //       type: 'bar',
          //       itemStyle: {
          //         color: '#0099ff'
          //       },
          //       label: {
          //         show: true,
          //         position: 'top'
          //       },
          //     }
          //   ],
          //   grid: {
          //     top: '20%',
          //     left: '3%',
          //     right: '4%',
          //     bottom: '10%',
          //     containLabel: true
          //   },
          //   title: {
          //     text: this.title,
          //     // subtext: "        "+beingDate+"-"+endDate
          //   },

        };
        option && s5zhiLiangMuBiao.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s5zhiLiangMuBiao:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
