<template>
  <div class="statisticsPage" :style="{width:width}">
  <!-- <div @click="toDetailed()" class="statisticsPage" :style="{width:width}"> -->
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
        default:"25%"
      },
      height:{
        type:String,
        default: window.screen.height/5+"px"
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
      },
      mubiao:{
        type:String,
        default:''
      }
    },
    data () {
      return {
        title:'检测报告差错率',
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
        
        let e = 100 -this.data.t_mjjcbgNum.res[0]
        let option = {
        //v3
          title: {
            text: this.title,
            // subtext: 'Fake Data',
            left: 'left',
            textStyle:{ fontSize:14,color: this.colorw }
          },
          tooltip: {
            trigger: 'item'
          },
          color:['#ffcc00','#33FFFF'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.t_mjjcbgNum.res[0], name: '差错率' },
                { value: e, name: '正确率' }
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
