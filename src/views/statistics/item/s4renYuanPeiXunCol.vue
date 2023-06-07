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
  import {GetPercent,GetMax} from  '../js/config.js'
  import dialogView from '../properties/s4renYuanPeiXunPro.vue'

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
        default: window.screen.height/5+"px"
      },
      id:{
        type:String,
        default:"s4renyuanPeiXun"
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
        title:'人员培训数量',
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
        let s4renYuanPeiXun = echarts.init(document.getElementById(this.id))

        // let beginInof = GetPercent(Number(this.data.t_rypxjlnkBegin.number),Number(this.data.t_ryndpxjhBegin.number))
        // let endInof = GetPercent(Number(this.data.t_rypxjlnkEnd.number),Number(this.data.t_ryndpxjhEnd.number))

        //  let data1 = [];
        //  data1.push(this.data.t_ryndpxjhBegin.number);
        //  data1.push(this.data.t_ryndpxjhEnd.number);
        //  let data2 = [];
        //  data2.push(this.data.t_rypxjlnkBegin.number);
        //  data2.push(this.data.t_rypxjlnkEnd.number);
        //  let data3 = [];
        //  data3.push(this.data.t_rypxjlnkBegin.date);
        //  data3.push(this.data.t_rypxjlnkEnd.date);


        // let barData = []
        // for (let i = 0; i < this.data.t_ryywpxjlNum.date.length; i++) {
        //   let e=[this.data.t_ryywpxjlNum.date[i],this.data.t_ryywpxjlNum.number[i],this.data.t_ryywpxjlNum.numberAll[i]]
        //   barData.push(e)
        // }
        //  let e=[this.data.t_ryywpxjlNum.number[0],this.data.t_ryywpxjlNum.numberAll[0],this.data.t_ryywpxjlNum.res[0]]
         let e=[this.data.t_ryywpxjlNum.numberAll[0],this.data.t_ryywpxjlNum.number[0]]


        var option;
        option = {
          //v3
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
              // data:['已完成数量', '所有数量', '培训完成率']
              data:['所有培训数量','已完成培训数量']

            },
            yAxis: [
              {
                type: 'value',
                scale: true,
                name: '次数',
                max: this.data.t_ryywpxjlNum.number[0]>this.data.t_ryywpxjlNum.numberAll[0]?this.data.t_ryywpxjlNum.number[0]+1:this.data.t_ryywpxjlNum.numberAll[0]+1,
                min: 0,
                // boundaryGap: [0.2, 0.2]
              },
              // {
              //   type: 'value',
              //   scale: true,
              //   name: '培训完成率',
              //   max: this.data.t_ryywpxjlNum.res[0],
              //   min: 0,
              //   axisLabel: {
              //     formatter: '{value} %'
              //   }
              // }
            ],
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            // series: [{ type: 'bar' }],
            series: [
              {
                data: e,
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                  color: '#cc3366'
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
            },
          //v2
        //     legend: {},
        //     tooltip: {
        //       trigger: 'axis',
        //       axisPointer: {
        //         type: 'shadow'
        //       },
        //       formatter: function (params) {
        //         return params[0].data[0] + '<br/>已完成培训数量：' + params[0].data[1]+ '<br/>所有培训数量：' + params[0].data[2];
        //       }
        //     },
        //     dataset: {
        //       source: barData
        //     },
        //     xAxis: { type: 'category' },
        //     yAxis: {
        //       type: 'value',
        //       axisLabel: {
        //         show: true,
        //         textStyle:{color:'#000'},
        //         interval: 'auto',
        //         // formatter: '{value} %'
        //       },
            
        //     },
        //     // Declare several bar series, each will be mapped
        //     // to a column of dataset.source by default.
        //     series: [{ type: 'bar'},{ type: 'bar'}],
        //     grid: {
        //       top: '20%',
        //       left: '3%',
        //       right: '4%',
        //       bottom: '10%',
        //       containLabel: true
        //     },
        //     title: {
        //       text: this.title,
        //       subtext: "        "+this.data.t_ryywpxjlNum.date[0]+"-"+this.data.t_ryywpxjlNum.date[this.data.t_ryywpxjlNum.date.length-1]
        //     },
        //v1
          // title: {
          //   text: this.title,
          //   subtext: this.data.t_rypxjlnkBegin.date+"-"+this.data.t_rypxjlnkEnd.date+"年培训次数"
          // },
          // tooltip: {
          //        trigger: 'axis',
          //        axisPointer: {
          //          type: 'shadow'
          //        },
          //        formatter: function (datas) {
          //            var res='计划:'+datas[0].value+"<BR>"
          //            res+='记录:'+datas[1].value+"<BR>"
          //            res+='百分比:'+(datas[0].value==null||datas[0].value==0?"0.00":(datas[1].value/datas[0].value*100).toFixed(2))+"%"
          //            return res
          //        }
          // },
          // legend: {show:false},
          //  grid: {
          //       top: '20%',
          //       left: '3%',
          //       right: '4%',
          //       bottom: '10%',
          //       containLabel: true
          //   },
          // xAxis: {
          //   type: 'category',
          //   data: data3
            
          // },
          // yAxis: {
          //   type: 'value',
          //   boundaryGap: [0, 0.01]
          // },
          // series: [

          //   {
          //     name: ['计划'],
          //     type: 'bar',
          //     data: data1,
          //     itemStyle: {
          //           normal: {
          //               color: function(params) {
          //                   var colorList = [
          //                     '#FE8463','#9BCA63','#FCCE10','#E87C25','#27727B',
          //                      '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
          //                      '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
          //                   ];
          //                   return colorList[params.dataIndex]
          //               },
          //           }
          //       },
          //   },
          //   {
          //     name: ['记录'],
          //     type: 'bar',
          //     data: data2,
          //     itemStyle: {
          //           normal: {
          //               color: function(params) {
          //                   var colorList = [
          //                     '#E87C25','#FAD860','#FCCE10','#E87C25','#27727B',
          //                      '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
          //                      '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
          //                   ];
          //                   return colorList[params.dataIndex]
          //               },
          //           }
          //       },
          //   }
          // ]
        };


       option && s4renYuanPeiXun.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s4renyuanPeiXun:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
