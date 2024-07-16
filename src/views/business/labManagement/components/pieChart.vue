<template>
  <div class="statisticsPage" :style="{width:width}">
    <div :id="'pie'+id" :style="{height:height}"/>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    props: {
      value: {
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
        type:Number,
        default:0
      },
      click:{
        type:String,
        default:'true'
      },
      colorw:{
        type:String,
        default:'true'
      },
      wancheng:{
        type:String,
        default:'完成率'
      },
      weiwancheng:{
        type:String,
        default:'未完成率'
      },
      title:{
        type: String
      }
    },
    data () {
      return {
        dialogOff:false,
        measured:[]
      }
    },
    watch: {
        value: {
            handler () {
                this.drawLine()
            },
            deep: true
        }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
      close(){
        this.dialogOff = false
      },
      drawLine(){
        let pie = echarts.init(document.getElementById('pie'+this.id))
        let option;
        let e = (100-this.value.rate).toFixed(2)
        option = {
          title: {
            text: this.title+'完成率',
            left: 'left',
            textStyle:{ fontSize:14,color: this.colorw }
          },
          tooltip: {
            trigger: 'item'
          },
          color:['#66CC00','#CC0000'],
          series: [
            {
              type: 'pie',
              radius: '50%',
              label: {
                formatter: '{b}: {d}%',
                color: '#000',
                fontSize: '12px'
              },
              data: [
                { value: this.value.rate, name: this.wancheng },
                { value: e, name: this.weiwancheng }
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

       option && pie.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #zlmbPie:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
