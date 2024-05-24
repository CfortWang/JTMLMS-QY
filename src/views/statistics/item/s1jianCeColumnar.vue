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
  import dialogView from '../properties/s1jianCePro.vue'
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
        default:"s1jianCe"
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
        title:'检测报告差错数量',
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
        var echarts = require('echarts');
        let s1jianCe = echarts.init(document.getElementById(this.id))

        //  let data = [];

        //  data.push(Number(this.data.t_gdyrqcwt5Begin.number<0?0-this.data.t_gdyrqcwt5Begin.number:this.data.t_gdyrqcwt5Begin.number)*100)
        //  data.push(Number(this.data.t_gdyrqcwt5End.number<0?0-this.data.t_gdyrqcwt5End.number:this.data.t_gdyrqcwt5End.number)*100)
        //  data.push(Number(this.data.t_gdyrqcwt6Begin.number<0?0-this.data.t_gdyrqcwt6Begin.number:this.data.t_gdyrqcwt6Begin.number)*100)
        //  data.push(Number(this.data.t_gdyrqcwt6End.number<0?0-this.data.t_gdyrqcwt6End.number:this.data.t_gdyrqcwt6End.number)*100)

        //  let dataAxis = [];

        //  dataAxis.push("准确率");
        //  dataAxis.push("准确率");
        //  dataAxis.push("完成率");
        // //  dataAxis.push("完成率");
        //  let beingDate=this.data.t_gdyrqcwt5Begin.date
        //  let endDate=this.data.t_gdyrqcwt5End.date
        // let e=[this.data.t_mjjcbgNum.number[0],this.data.t_mjjcbgNum.numberAll[0],this.data.t_mjjcbgNum.res[0]]
        let e=[this.data.t_mjjcbgNum.numberAll[0],this.data.t_mjjcbgNum.number[0]]


        let option = {
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
              // data:['报告差错数', '报告总数', '差错率']
              data:['检测报告总数','检测报告差错数']
            },
            yAxis: [
              {
                type: 'value',
                scale: true,
                name: '数量',
                max: this.data.t_mjjcbgNum.number[0]>this.data.t_mjjcbgNum.numberAll[0]?this.data.t_mjjcbgNum.number[0]+1:this.data.t_mjjcbgNum.numberAll[0]+1,
                min: 0,
                // boundaryGap: [0.2, 0.2]
              },
              // {
              //   type: 'value',
              //   scale: true,
              //   name: '差错率',
              //   max: this.data.t_mjjcbgNum.res[0],
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
                  color: '#9933cc'
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
        //v1
        //   grid: {
        //                top: '20%',
        //                left: '3%',
        //                right: '4%',
        //                bottom: '10%',
        //                containLabel: true
        //            },
        //  title: {
        //    text: this.title,
        //    subtext: "        "+beingDate+"-"+endDate+"年"
        //  },
        //  xAxis: {
        //    data: dataAxis,
        //    axisLabel: {
        //      inside: true,
        //      color: '#000'
        //    },
        //    axisTick: {
        //      show: true
        //    },
        //    axisLine: {
        //      show: true
        //    },
        //    axisLabel:{
        //       interval:0
        //     },
        //    z: 10
        //  },
        //  yAxis: {
        //    axisLine: {
        //      show: false
        //    },
        //    axisTick: {
        //      show: false
        //    },
        //    axisLabel: {
        //                           show: true,
        //                           textStyle:{color:'#000'},
        //                           interval: 'auto',
        //                           formatter: '{value} %'
        //                           },
        //  },
        //  dataZoom: [
        //    {
        //      type: 'inside'
        //    }
        //  ],
        //  tooltip: {
        //         trigger: 'axis',
        //         axisPointer: {
        //           type: 'shadow'
        //         },
        //         formatter: function (datas) {
        //             let year1 = datas[0].dataIndex==0||datas[0].dataIndex==2;
        //             var res=(year1?beingDate+':':endDate+':')+datas[0].name+':'+datas[0].value+"%"
        //             return res
        //         }
        //  },
        //  series: [
        //    {
        //      type: 'bar',
        //      showBackground: true,
        //      itemStyle: {
        //        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //          { offset: 0, color: '#83bff6' },
        //          { offset: 0.5, color: '#188df0' },
        //          { offset: 1, color: '#188df0' }
        //        ])
        //      },
        //      emphasis: {
        //        itemStyle: {
        //          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //            { offset: 0, color: '#2378f7' },
        //            { offset: 0.7, color: '#2378f7' },
        //            { offset: 1, color: '#83bff6' }
        //          ])
        //        }
        //      },
        //      data: data
        //    }
        //  ]
       };
       option && s1jianCe.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s1jianCe:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
