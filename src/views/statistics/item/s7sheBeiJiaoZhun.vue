<template>
  <!-- <div @click="toDetailed()" class="statisticsPage" :style="{width:width}"> -->
  <div class="statisticsPage" :style="{width:width}">
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
        default: "100%"
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
        title:'设备检定/校准完成情况',
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
        let e=100-this.data.t_mjsbjdxzjhzbNum.val



        var option;
        option = {
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
          color:['#9999ff','#cccc00'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.t_mjsbjdxzjhzbNum.val, name: '完成率' },
                { value: e, name: '未完成率' }
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
