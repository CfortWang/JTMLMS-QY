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
        default:"20%"
      },
      height:{
        type:String,
        default: window.screen.height/4+"px"
      },
      id:{
        type:String,
        default:"s1zhiLiang1"
      },
      click:{
        type:String,
        default:'true'
      },
    },
    data () {
      return {
        title:'质量目标',
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
        let s1zhiLiang1 = echarts.init(document.getElementById(this.id))
 let option = {
   color : [
                               '#FE8463','#9BCA63','#FCCE10','#E87C25','#27727B',
                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                             ],
   grid: {
                 top: '20%',
                 left: '3%',
                 right: '4%',
                 bottom: '10%',
                 containLabel: true
             },
   title: {
             text: '投诉处理率',
             subtext: "2021-2022",
          },

    tooltip: {
                 trigger: 'item',
                 formatter: function (datas) {
                     return datas.name+':'+(datas.value*100).toFixed(2)+"%"
                 }
       },
   legend: {
     top: '5%',
     left: 'center'
   },
   series: [
     {
       name: '投诉处理率',
       type: 'pie',
       radius: ['40%', '70%'],
       avoidLabelOverlap: false,
       itemStyle: {
         borderRadius: 10,
         borderColor: '#fff',
         borderWidth: 2
       },
       label: {
         show: false,
         position: 'center'
       },

       emphasis: {
         label: {
           show: true,
           fontSize: '40',
           fontWeight: 'bold'
         }
       },
       labelLine: {
         show: false
       },
       data: [
         { value: '0.92', name: '处理率' },
         { value: '0.08', name: '未处理' },

       ]
     }
   ]
 };

       option && s1zhiLiang1.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s1zhiLiang1:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
