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
  import * as echarts from 'echarts'
  import dialogView from '../properties/s8sheBeiHeChaPro.vue'
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
        default: window.screen.height/5+"px"
      },
      id:{
        type:String,
        default:"s8sheBeiHeCha"
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
        title:'各个设备期间核查计划数量',
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
        let s8sheBeiHeCha = echarts.init(document.getElementById(this.id))
         

          
        // let beginInof = GetPercent(Number(this.data.t_sbhcjlbBegin.number),Number(this.data.t_sbhcjhBegin.number))
        // let endInof = GetPercent(Number(this.data.t_sbhcjlbEnd.number),Number(this.data.t_sbhcjhEnd.number))
         
        //  let data1 = [];
        //  data1.push(this.data.t_sbhcjhBegin.number);
        //  data1.push(this.data.t_sbhcjhEnd.number);
        //  let data2 = [];
        //  data2.push(this.data.t_sbhcjlbBegin.number);
        //  data2.push(this.data.t_sbhcjlbEnd.number);
        //  let data3 = [];
        //  data3.push(this.data.t_sbhcjlbBegin.date);
        //  data3.push(this.data.t_sbhcjlbEnd.date);
        //  let max1=GetMax(data1)+1;
        //  let max2=GetMax(data2)+1;
        //  let maxVal=max1>max2?max1:max2;
        //  console.log("max1:",max1,"max2:",max2);

       let option = {
           //v3
          title: {
            text: this.title,
            textStyle:{ fontSize:14,color: this.colorw }

            // subtext: this.data.t_sbhcjlbNum.date+"年核查次数"
          },
          tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        },
                        formatter: function (datas) {
                          // console.log(datas)
                            var res=datas[0].data.mz+"<BR>"+'完成:'+datas[0].data.wnum+"<BR>"
                            res+='计划:'+datas[0].data.num+"<BR>"
                            // res+='百分比:'+(datas[1].value==null||datas[1].value==0?"0.00":(datas[0].value/datas[1].value*100).toFixed(2))+"%"
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
          dataset: {
            dimensions: ['mz','num','wnum'],
            source: this.data.t_sbhcjlbNum.nummg
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            // data: this.data.t_sbhcjlbNum.name,
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
              // data: this.data.t_sbhcjlbNum.number,
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
              // data: this.data.t_sbhcjlbNum.numberAll,
              label: {
                show: true,
                position: 'right'
              },
              itemStyle: {
                color: '#FFCC00'
              },
            },
          ],
                dataZoom: [
        {
            id: 'dataZoomY',
            type: 'inside',
            yAxisIndex: [0],
            filterMode: 'empty'
        }
      ],
         //v1
        //   grid: {
        //         top: '20%',
        //         left: '3%',
        //         right: '4%',
        //         bottom: '10%',
        //         containLabel: true
        //     },
        //    tooltip: {
        //           trigger: 'axis',
        //           axisPointer: {
        //             type: 'shadow'
        //           },
        //           formatter: function (datas) {
        //               var res='计划:'+datas[0].value+"<BR>"
        //               res+='记录:'+datas[1].value+"<BR>"
        //               res+='百分比:'+(datas[0].value==null||datas[0].value==0?"0.00":(datas[1].value/datas[0].value*100).toFixed(2))+"%"
        //               return res
        //           }
        //    },
        // title: {
        //      text: this.title,
        //      subtext: this.data.t_sbhcjlbBegin.date+"-"+this.data.t_sbhcjlbEnd.date+"年核查次数"
        //      //subtext: this.data.t_sbhcjhBegin.date+'完成率为:' + beginInof +'\n'+this.data.t_sbhcjhEnd.date+'完成率为:'+endInof,
        // },
        // color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        //    legend: {
        //      show:false
        //  },
        //  xAxis: [
        //      {
        //          type: 'category',
        //          axisTick: {show: false},
        //          data: data3
        //      }
        //  ],
        //  yAxis:  [
        //      {
        //        max:maxVal,
        //        min:0,
        //          type: 'value'
        //      }
        //  ] 
        //  ,
        //  series: [
        //     {
        //          name: '计划条数',
        //          type: 'bar',
        //          barGap: 0,
        //          data: data1
        //    },
        //     {
        //          name: '记录条数',
        //          type: 'bar',
        //          barGap: 0,
        //          data: data2
        //    },
        //  ]
       };

       option && s8sheBeiHeCha.setOption(option);
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
