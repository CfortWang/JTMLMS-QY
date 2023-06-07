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
  import dialogView from '../properties/s7sheBeiJiaoZhunPro.vue'

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
        default:"s7sheBeiJiaoZhun"
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
        title:'各个设备检定/校准计划数量',
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
        let s7sheBeiJiaoZhun = echarts.init(document.getElementById(this.id))

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


        var option;
        option = {
          //v3
          title: {
            text: this.title,
            textStyle:{ fontSize:14,color: this.colorw }

            // subtext: this.data.t_mjsbjdxzjhzbNum.date+"年校准次数"
          },
          tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        },
                        formatter: function (datas) {
                            var res=datas[0].name+"<BR>"+'完成:'+datas[0].value+"<BR>"
                            res+='计划:'+datas[1].value+"<BR>"
                            res+='百分比:'+(datas[1].value==null||datas[1].value==0?"0.00":(datas[0].value/datas[1].value*100).toFixed(2))+"%"
                            return res
                        }
          },
          legend: {},
          grid: {
                        top: '10%',
                        left: '3%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.data.t_mjsbjdxzjhzbNum.name,
            axisLabel: {
                show: true, // 是否显示X轴的内容，不包含两端的文字
                interval: 0,
                // rotate: '50', // 旋转50°
                lineHeight: 18,
                // formatter: function(params) {
                //   //  console.log('formatter', params, params.length)
                //   var newParamsName = ''// 最终拼接成的字符串
                //   var paramsNameNumber = params.length// 实际标签的个数
                //   var provideNumber = 3// 每行能显示的字的个数
                //   // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                //   if (paramsNameNumber > provideNumber) {
                //   // ********重点在这里********
                //     newParamsName = params.substring(0, 3) + '..'// 最终拼成的字符串
                //   } else { // 将旧标签的值赋给新标签
                //     newParamsName = params
                //   }
                //   // 将最终的字符串返回
                //   return newParamsName
                // }
              },
          },
          series: [
            {
              type: 'bar',
              data: this.data.t_mjsbjdxzjhzbNum.number,
              label: {
                show: true,
                position: 'right'
              },
              itemStyle: {
                color: '#66CC00'
              },
            },
            {
              type: 'bar',
              data: this.data.t_mjsbjdxzjhzbNum.numberAll,
              label: {
                show: true,
                position: 'right'
              },
              itemStyle: {
                color: '#FFCC00'
              },
            },
          ],dataZoom: [
        {
            id: 'dataZoomY',
            type: 'inside',
            yAxisIndex: [0],
            filterMode: 'empty'
        }
      ],
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


       option && s7sheBeiJiaoZhun.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s7sheBeiJiaoZhun:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
