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
        :beginDate="beginDate" :endDate="endDate"
      />
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {GetPercent,GetMax} from  '../js/config.js'
  import dialogView from '../properties/s4renYuanPeiXunPro.vue'
  import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js'

  export default {
    components:{
       dialogView
    },
    props: {
      data: {
        type: Object,
      },
      beginDate:String,
      endDate:String,
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
        default:"s4renyuanPeiXun2"
      },
      click:{
        type:String,
        default:'true'
      },
    },
    data () {
      return {
        title:'人员培训',
        dialogOff:false,
      }
    },
    mounted(){
      this.drawLine();
    },
    watch: {

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
      // prettier-ignore
      let dataAxis = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      // prettier-ignore
      let data = [120, 132, 141, 154, 160, 170, 180, 193, 202, 211, 220, 239];
      repostCurd('sql', "select SUBSTRING(ji_hua_shi_jian_,1,7) as mon,COUNT(1) AS cnt FROM t_ryndpxjh where ji_hua_shi_jian_ between '"+this.beginDate+"' and '"+this.endDate+"' GROUP  BY SUBSTRING(ji_hua_shi_jian_,1,7) order by SUBSTRING(ji_hua_shi_jian_,1,7)").then(response => {
            let dbData = response.variables.data
            if(dbData){
               data = []
               dataAxis=[]
               let startY=parseInt(this.beginDate.substring(0,4))
               let endY=parseInt(this.endDate.substring(0,4))
               let startM = parseInt(this.beginDate.substring(5,7))
               let startMon = startY*100+parseInt(this.beginDate.substring(5,7))
               let endMon = endY*100+parseInt(this.endDate.substring(5,7))
               var i=startMon;
               while(i<=endMon){
                 let flag = false
                 dbData.forEach(function(e){
                    if(e.mon==parseInt(i/100)+((i%100)>=10?("-"+(i%100)):("-0"+i%100))){
                      dataAxis.push(((i%100)>=10?((i%100)):(i%100)))
                      data.push(e.cnt)
                      flag=true
                    }
                 })
                 if(!flag){
                   dataAxis.push(((i%100)>=10?((i%100)):(i%100)))
                   data.push(0)
                 }
                 if(i%100<12)
                    i=i+1
                 else
                    i=(startY+1)*100+1
               }
             }
             let option = {
               title: {
                 text: '人员培训',
                 subtext: '培训次数'
               },
               tooltip: {
                 trigger: 'axis',
                 axisPointer: {
                   type: 'shadow'
                 },
                              formatter: function (datas) {
                                  var res='培训次数:'+datas[0].value
                                  return res
                              }
               },
               xAxis: {
                 data: dataAxis,

                 z: 10,
                 Interval: 1
               },
               yAxis: {

                 axisLabel: {
                   color: '#000'
                 }
               },
               dataZoom: [
                 {
                   type: 'inside'
                 }
               ],
               series: [
                 {
                   type: 'bar',
                   showBackground: true,
                   itemStyle: {
                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                       { offset: 0, color: '#2378f7' },
                       { offset: 0.5, color: '#83bff6' },
                       { offset: 1, color: '#188df0' }
                     ])
                   },
                   emphasis: {
                     itemStyle: {
                       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                         { offset: 0, color: '#2378f7' },
                         { offset: 0.7, color: '#83bff6' },
                         { offset: 1, color: '#83bff6' }
                       ])
                     }
                   },
                   data: data
                 }
               ]
             };
             // Enable data zoom when user click bar.
             const zoomSize = 6;
             // s4renYuanPeiXun.on('click', function (params) {
             //   s4renYuanPeiXun.dispatchAction({
             //     type: 'dataZoom',
             //     startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
             //     endValue:
             //       dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
             //   });
             // });
              option && s4renYuanPeiXun.setOption(option);
      })

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
