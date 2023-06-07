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
  import dialogView from '../properties/s17bzXiBaoPro.vue'
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
        default: window.screen.height/2+"px"
      },
      id:{
        type:String,
        default:"s17bzXiBao"
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
        title:'标准细胞期间核查数量',
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
        let s17bzXiBao = echarts.init(document.getElementById(this.id))
         

          
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
        let e=[this.data.Num.valnum,this.data.Num.valAll]

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
              data:['标准细胞期间核查总数', '标准细胞已完成期间核查数量']

            },
            yAxis: [
              {
                type: 'value',
                scale: true,
                name: '数量',
                max: this.data.Num.valnum>this.data.Num.valAll?this.data.Num.valnum+1:this.data.Num.valAll+1,
                min: 0,
              },
            ],
            series: [
              {
                data: e,
                type: 'bar',
                barWidth: '20%',
                itemStyle: {
                  color: '#0099ff'
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
       };

       option && s17bzXiBao.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s17bzXiBao:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
