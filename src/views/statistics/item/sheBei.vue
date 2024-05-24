<template>
  <div @click="toDetailed()" class="statisticsPage" :style="{width:width}">
    <div id="sheBei" :style="{height:height}"/>
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
        title:'设备管理',
        year:'2021-2022年数据统计',
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
         let sheBei = echarts.init(document.getElementById('sheBei'))
         var option;

     var posList = [
         'left', 'right', 'top', 'bottom',
         'inside',
         'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
         'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
     ];

     app.configParameters = {
         rotate: {
             min: -90,
             max: 90
         },
         align: {
             options: {
                 left: 'left',
                 center: 'center',
                 right: 'right'
             }
         },
         verticalAlign: {
             options: {
                 top: 'top',
                 middle: 'middle',
                 bottom: 'bottom'
             }
         },
         position: {
             options: echarts.util.reduce(posList, function (map, pos) {
                 map[pos] = pos;
                 return map;
             }, {})
         },
         distance: {
             min: 0,
             max: 100
         }
     };

     app.config = {
         rotate: 90,
         align: 'left',
         verticalAlign: 'middle',
         position: 'insideBottom',
         distance: 15,
         onChange: function () {
             var labelOption = {
                 normal: {
                     rotate: app.config.rotate,
                     align: app.config.align,
                     verticalAlign: app.config.verticalAlign,
                     position: app.config.position,
                     distance: app.config.distance
                 }
             };
             myChart.setOption({
                 series: [{
                     label: labelOption
                 }, {
                     label: labelOption
                 }, {
                     label: labelOption
                 }, {
                     label: labelOption
                 }]
             });
         }
     };


     var labelOption = {
         show: true,
         position: app.config.position,
         distance: app.config.distance,
         align: app.config.align,
         verticalAlign: app.config.verticalAlign,
         rotate: app.config.rotate,
         formatter: '{c}  {name|{a}}',
         fontSize: 12,
         rich: {
             name: {
                 textBorderColor: '#fff'
             }
         }
     };

     option = {
          grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
       title: {
          text: this.title,
          subtext: this.year
        },
         color: ['#003366', '#006699', '#4cabce', '#e5323e'],
         tooltip: {
             trigger: 'axis',
             axisPointer: {
                 type: 'shadow'
             }
         },
         legend: {
             data: ['Forest', 'Steppe', 'Desert', 'Wetland']
         },
         toolbox: {
             show: true,
             orient: 'vertical',
             left: 'right',
             top: 'center',
             feature: {
                 mark: {show: true},
                 dataView: {show: true, readOnly: false},
                 magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                 restore: {show: true},
                 saveAsImage: {show: true}
             }
         },
         xAxis: [
             {
                 type: 'category',
                 axisTick: {show: false},
                 data: ['2021', '2022']
             }
         ],
         yAxis: [
             {
                 type: 'value'
             }
         ],
         series: [
             {
                 name: '采购',
                 type: 'bar',
                 barGap: 0,
                 label: labelOption,
                 data: [320, 332]
             },
             {
                 name: '维修',
                 type: 'bar',
                 label: labelOption,
                 data: [220, 182]
             },
             {
                 name: '使用',
                 type: 'bar',
                 label: labelOption,
                 data: [150, 232]
             },
             {
                 name: '校准',
                 type: 'bar',
                 label: labelOption,
                 data: [98, 77]
             },
             {
                 name: '报废',
                 type: 'bar',
                 label: labelOption,
                 data: [2, 1]
             }
         ]
     };
       option && sheBei.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #sheBei:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     width: 20%;
     float: left;

  }
</style>
