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
  import * as echarts from 'echarts'
  import dialogView from '../properties/s13shengWuPro.vue'
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
        default:"s13shengWu"
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
        title:'投诉回复及时率',
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
        let s13shengWu = echarts.init(document.getElementById(this.id))
        // let beingDate=this.data.t_complaintBegin.date
        // let endDate=this.data.t_complaintEnd.date
        var option;

        //v3
        // let e=[this.data.t_mjsyshdfxsbykzjhxbNum.number[0],this.data.t_mjsyshdfxsbykzjhxbNum.numberAll[0],this.data.t_mjsyshdfxsbykzjhxbNum.res[0]]
        let e = 100 -this.data.t_complaintNum.res1[0]


        option = {
          title: {
            text: this.title,
            // subtext: 'Fake Data',
            left: 'left',
            textStyle:{ fontSize:14,color: this.colorw }
          },
          tooltip: {
            trigger: 'item'
          },
          color:['#9966CC','#FFFF33'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.t_complaintNum.res1[0], name: '及时率' },
                { value: e, name: '不及时率' }
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

        option && s13shengWu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s13shengWu:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
