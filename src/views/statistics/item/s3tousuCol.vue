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
  import dialogView from '../properties/s3tousuPro.vue'
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
        default:"s3tousu"
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
        title:'客户投诉数量',
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
        let s3tousu = echarts.init(document.getElementById(this.id))
        // let beingDate=this.data.t_complaintBegin.date
        // let endDate=this.data.t_complaintEnd.date
        var option;
        //v2
        // let that = this
        // for (let i = 0; i < that.data.t_complaintNum.date.length; i++) {
        //   let result = 0
        //   if(that.data.t_mjwtsqbNum.number[i] === 0){
        //     result = Math.floor(that.data.t_complaintNum.number[i]/1 * 10000) / 100
        //   }else{
        //     result = Math.floor(that.data.t_complaintNum.number[i]/that.data.t_mjwtsqbNum.number[i] * 10000) / 100
        //   }
        //   that.measured.push(result)
        //   // console.log(that.data.t_complaintNum.number[i], that.data.t_mjwtsqbNum.number[i], result, 'res')
        // }
        //v3
        //  let e=[this.data.t_complaintNum.number[0],this.data.t_complaintNum.numberAll[0],this.data.t_complaintNum.res[0]]
         let e=[this.data.t_complaintNum.numberAll[0],this.data.t_complaintNum.number[0]]
        

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
              // data:['投诉总数', '委托总数', '客户投诉率']
              data:['委托总数','投诉总数']
            },
            yAxis: [
              {
                type: 'value',
                scale: true,
                name: '次数',
                max: this.data.t_complaintNum.number[0]>this.data.t_complaintNum.numberAll[0]?this.data.t_complaintNum.number[0]+1:this.data.t_complaintNum.numberAll[0]+1,
                min: 0,
                // boundaryGap: [0.2, 0.2]
              },
              // {
              //   type: 'value',
              //   scale: true,
              //   name: '客户投诉率',
              //   max: this.data.t_complaintNum.res[0],
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
                  color: '#cccc33'
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
        //   rotate: {
        //     min: -90,
        //     max: 90
        //   },
        //   grid: {
        //         top: '20%',
        //         left: '3%',
        //         right: '4%',
        //         bottom: '10%',
        //         containLabel: true
        //     },
        //   title: {
        //      text: this.title,
        //      subtext: '    '+this.data.t_complaintNum.date[0]+'-'+this.data.t_complaintNum.date[this.data.t_complaintNum.date.length-1],
        //    },
        //  xAxis: {
        //    type: 'category',
        //    data: this.data.t_complaintNum.date
        //  },
        //  yAxis: {
        //   //  max:this.data.t_complaintBegin.number>this.data.t_complaintEnd.number?this.data.t_complaintBegin.number+1:this.data.t_complaintEnd.number+1,
        //   // max: Math.max(...this.measured),
        //   // min:0,
        //   type: 'value',
        //   axisLabel: {
        //     show: true,
        //     textStyle:{color:'#000'},
        //     interval: 'auto',
        //     formatter: '{value} %'
        //   },
        //  },
        //  tooltip: {
        //         trigger: 'axis',
        //         axisPointer: {
        //           type: 'shadow'
        //         },
        //         formatter: function (params) {
        //           // console.log(params,'tousu ')
        //           return params[0].axisValue + '<br/>客户投诉率：' + params[0].data;
        //         }
        //         // formatter: 
        //         // function (datas) {
        //         //     let year1 = datas[0].dataIndex==0||datas[0].dataIndex==2;
        //         //     var res=(year1?beingDate+':':endDate+':')+datas[0].name+':'+datas[0].value
        //         //     return res
        //         // }
        //  },
        //  series: [
        //    {
        //      itemStyle: {
        //             normal: {
        //                 color: function(params) {
        //                     var colorList = [
        //                       '#F0805A','#B5C334','#FCCE10','#E87C25','#27727B',
        //                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
        //                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
        //                     ];
        //                     return colorList[params.dataIndex]
        //                 },
        //             }
        //         },

        //      data: this.measured,
        //      type: 'bar',
        //      barWidth:50
        //    }
        //  ]
       };

       option && s3tousu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s3tousu:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
