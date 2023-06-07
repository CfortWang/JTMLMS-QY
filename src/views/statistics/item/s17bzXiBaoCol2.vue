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
        title:'各个标准细胞期间核查数量',
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
       let option = {
           //v3
          title: {
            text: this.title,
            textStyle:{ fontSize:14,color: this.colorw }

            // subtext: this.data.Num.date+"年"
          },
          tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'shadow'
                        },
                        formatter: function (datas) {
                          // console.log(datas)
                            var res=datas[0].name+"<BR>"+'期间核查次数:'+datas[0].data+"<BR>期间核查完成次数"+datas[1].data
                            // res+='百分比:'+(datas[1].value==null||datas[1].value==0?"0.00":(datas[0].value/datas[1].value*100).toFixed(2))+"%"
                            return res
                        }
          },
          legend: {},
          grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                bottom: '5%',
                containLabel: true
                    },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.data.Num.name,
            axisLabel: {
                show: true, // 是否显示X轴的内容，不包含两端的文字
                interval: 0,
                // rotate: '50', // 旋转50°
                lineHeight: 18,
                // formatter: function(params) {
                //   //  console.log('formatter', params, params.length)
                //   var newParamsName = ''// 最终拼接成的字符串
                //   var paramsNameNumber = params.length// 实际标签的个数
                //   var provideNumber = 3// 每行能显示的字的个数
                //   // 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                //   if (paramsNameNumber > provideNumber) {
                //   // ********重点在这里********
                //     newParamsName = params.substring(0, 3) + '..'// 最终拼成的字符串
                //   } else { // 将旧标签的值赋给新标签
                //     newParamsName = params
                //   }
                //   // 将最终的字符串返回
                //   return newParamsName
                // }
              },
          },
          series: [
            {
              type: 'bar',
              data: this.data.Num.number,
              itemStyle: {color: '#006699'},
              label: {
                show: true,
                position: 'right'
              },
            },
            {
              type: 'bar',
              data: this.data.Num.numberAll,
              itemStyle: {color: '#006633'},
              label: {
                show: true,
                position: 'right'
              },
            },
            // {
            //   type: 'bar',
            //   data: this.data.Num.numberAll
            // },
          ],
                dataZoom: [
        {
            id: 'dataZoomY',
            type: 'inside',
            yAxisIndex: [0],
            filterMode: 'empty'
        }
      ],
       
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
