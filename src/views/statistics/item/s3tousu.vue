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
  import echarts from 'echarts'
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
        default: window.screen.height/5+"px"
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
      },
      mubiao:{
        type:String,
        default:''
      }
    },
    data () {
      return {
        title:'客户投诉率',
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
        let option;
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
        let e = 100-this.data.t_complaintNum.res[0]
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
          color:['#00ccff','#cc3333'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.t_complaintNum.res[0], name: '客户投诉率' },
                { value: e, name: '客户未投诉率' }
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
