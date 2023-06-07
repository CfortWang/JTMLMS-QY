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
  import dialogView from '../properties/s9neiBuZhiLiangPro.vue'
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
        default:"s9neibu"
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
        title:'质量控制数量',
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
        let s9neibu = echarts.init(document.getElementById(this.id))
        // let beingDate=this.data.t_complaintBegin.date
        // let endDate=this.data.t_complaintEnd.date
        var option;
        let e = []
        e.push(this.data.t_mjzlkzxbNum.val[0])
        //v3
        // let e=[this.data.t_complaintNum.number[0],this.data.t_complaintNum.numberAll[0],this.data.t_complaintNum.res[0]]

        option = {
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
            legend: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                },
                formatter: function (datas) {
                    console.log(datas,'sdsdds')
                    var res=datas[0].data[0]+"<BR>"+'已完成：'+datas[0].data[2]+"<BR>"
                    res+='总计划：'+datas[0].data[1]+"<BR>"
                    res+='百分比:'+(datas[0].data[1]==null||datas[0].data[1]==0?"0.00":(datas[0].data[2]/datas[0].data[1]*100).toFixed(2))+"%"
                    return res
                }
            },
            dataset: {
                source: e
            },
            xAxis: { type: 'category' },
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [{ 
              type: 'bar',
              itemStyle: {color: '#cccc33'},
              barWidth: '20%',
              label: {
                show: true,
                position: 'top'
              },
            },
            { 
              type: 'bar',
              itemStyle: {color: '#66CCCC'},
              barWidth: '20%',

              label: {
                show: true,
                position: 'top'
              },
            }
            ]
        };

        option && s9neibu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s9neibu:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
