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
        :mubiao="mubiao"
      />
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {GetPercent,GetMax} from  '../js/config.js'
  import dialogView from '../properties/s2manYiDuPro.vue'

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
        default: window.screen.height/5+"px"
        // default: "100%"
      },
      id:{
        type:String,
        default:"s2manYiDu"
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
        title:'客户满意度',
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
        let s2manYiDu = echarts.init(document.getElementById(this.id))

        // let data2 = [];
        // data2.push(Number(this.data.t_myddc2Begin.number*100))
        // data2.push(Number(this.data.t_myddc2End.number*100))
        // data2.push(Number(this.data.t_myddc3Begin.number*100))
        // data2.push(Number(this.data.t_myddc3End.number*100))

        // let dataAxis = [];
        // dataAxis.push("检测")
        // dataAxis.push("检测")
        // dataAxis.push("满意率")
        // dataAxis.push("满意率")
        // let barData = []
        // for (let i = 0; i < this.data.t_khmydtjbNum.date.length; i++) {
        //   let e=[]
        //   if (this.data.t_khmydtjbNum.numberAll[i]===0) {
        //     e =[this.data.t_khmydtjbNum.date[i], 0]
        //   } else {
        //     e =[this.data.t_khmydtjbNum.date[i], Math.floor(this.data.t_khmydtjbNum.number[i]/this.data.t_khmydtjbNum.numberAll[i] * 10000) / 100]
        //   }
        //   barData.push(e)
        // }
        // let e=[this.data.t_khmydtjbNum.number[0],this.data.t_khmydtjbNum.numberAll[0],this.data.t_khmydtjbNum.res[0]]
        let e=100-this.data.t_khmydtjbNum.res[0]

        let beingDate=this.data.t_myddc2Begin.date
        let endDate=this.data.t_myddc2End.date
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
          color:['#009933','#99FF66'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.t_khmydtjbNum.res[0], name: '客户满意率' },
                { value: e, name: '客户不满意率' }
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
            // tooltip: {
            //   trigger: 'axis',
            //   axisPointer: {
            //     type: 'shadow'
            //   },
            //   // formatter: function (params) {
            //   //   return params[0].data[0] + '<br/>满意份数：' + params[0].data[1] + '<br/>调查总份数: ' + params[0].data[2];
            //   // }
            // },
            // // dataset: {
            // //   source: barData
            // // },
            // xAxis: { type: 'category',data:['满意份数', '调查份数', '满意度']},
            // yAxis: [
            //   {
            //     type: 'value',
            //     scale: true,
            //     name: '份数',
            //     max: this.data.t_khmydtjbNum.number[0]>this.data.t_khmydtjbNum.numberAll[0]?this.data.t_khmydtjbNum.number[0]+1:this.data.t_khmydtjbNum.numberAll[0]+1,
            //     min: 0,
            //     // boundaryGap: [0.2, 0.2]
            //   },
            //   {
            //     type: 'value',
            //     scale: true,
            //     name: '满意度',
            //     max: this.data.t_khmydtjbNum.res[0],
            //     min: 0,
            //     axisLabel: {
            //       formatter: '{value} %'
            //     }
            //   }
            // ],
            // // Declare several bar series, each will be mapped
            // // to a column of dataset.source by default.
            // // series: [{ type: 'bar' }],
            // series: [
            //   {
            //     data: e,
            //     type: 'bar',
            //     itemStyle: {
            //       color: '#66CCCC'
            //     },
            //     label: {
            //       show: true,
            //       position: 'top'
            //     },
            //   }
            // ],
            // grid: {
            //   top: '20%',
            //   left: '3%',
            //   right: '4%',
            //   bottom: '10%',
            //   containLabel: true
            // },
            // title: {
            //   text: this.title,
            //   // subtext: "        "+beingDate+"-"+endDate
            // },
        //v1
        // xAxis: {
        //   data: dataAxis,
        //   axisLabel: {
        //     inside: false,
        //     color: '#000',
        //     interval:0
        //   },
        //   axisTick: {
        //     show: true
        //   },
        //   axisLine: {
        //     show: true
        //   },
        //   z: 10
        // },
        // yAxis: {
        //   axisLine: {
        //     show: false
        //   },
        //   axisTick: {
        //     show: false
        //   },
        //   axisLabel: {
        //                          show: true,
        //                          textStyle:{color:'#000'},
        //                          interval: 'auto',
        //                          formatter: '{value} %'
        //                          },
        // },
        // dataZoom: [
        //   {
        //     type: 'inside'
        //   }
        // ],
        // tooltip: {
        //        trigger: 'axis',
        //        axisPointer: {
        //          type: 'shadow'
        //        },
        //        formatter: function (datas) {
        //            let year1 = datas[0].dataIndex==0||datas[0].dataIndex==2;
        //            var res=(year1?beingDate+':':endDate+':')+datas[0].name+':'+((datas[0].value-1))+"%"
        //            return res
        //        }
        // },
        // series: [
        //   {
        //     type: 'bar',
        //     showBackground: true,
        //     itemStyle: {
        //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //         { offset: 0, color: '#83bff6' },
        //         { offset: 0.5, color: '#188df0' },
        //         { offset: 1, color: '#188df0' }
        //       ])
        //     },
        //     emphasis: {
        //       itemStyle: {
        //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //           { offset: 0, color: '#2378f7' },
        //           { offset: 0.7, color: '#2378f7' },
        //           { offset: 1, color: '#83bff6' }
        //         ])
        //       }
        //     },
        //     data: data2
        //   }
        // ]
      };
      option && s2manYiDu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s2manYiDu:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>