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
  import dialogView from '../properties/s16bzJunZhuPro.vue'
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
        default:"s16bzJunZhu"
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
        title:'标准菌株期间核查完成情况',
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
        let s16bzJunZhu = echarts.init(document.getElementById(this.id))
         

          
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
        let e = 100 -this.data.Num.valna
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
          color:['#FF99CC','#333366'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%'
              },
              data: [
                { value: this.data.Num.valna, name: '完成率' },
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

       option && s16bzJunZhu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s16bzJunZhu:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
