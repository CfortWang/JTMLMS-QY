<template>
  <div @click="toDetailed()" class="statisticsPage" :style="{width:width}">
    <div id="jianCe" :style="{height:height}"/>
  </div>
</template>

<script>
  import * as echarts from 'echarts'


  export default {
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
        default:"s2manYiDu"
      },
      click:{
        type:String,
        default:'true'
      },
    },
    data () {
      return {
        title:'检测管理',
        year:'2021-2022年检测总次数',
        initStyle:{ height: window.screen.height/4+"px"}
      }
    },
    mounted(){
      this.drawLine();
    },
    methods: {
      /* 跳转统计页面*/
      toDetailed(){
        console.log('跳转')
      },
      drawLine(){ 
      }
    }
  }
</script>
<style scoped>
  #jianCe:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     width: 20%;
     float: left;

  }
</style>
