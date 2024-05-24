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
  import dialogView from '../properties/s6sheBeiWeiHuPro.vue'
  import {GetPercent} from  '../js/config.js'
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
      width2:{
        type:String,
        default:"40%"
      },
       width3:{
        type:String,
        default:"100%"
      },
      height:{
        type:String,
        default: window.screen.height/4+"px"
      },
      id:{
        type:String,
        default:"s6sheBeiWeiHu"
      },
      click:{
        type:String,
        default:'true'
      },
    },
    data () {
      return {
        title:'设备维护完成率',
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
        let s6sheBeiWeiHu = echarts.init(document.getElementById(this.id))
        
        let beginInof = GetPercent(Number(this.data.t_yqsbwhjlfbBegin.number),Number(this.data.t_yqsbwhjhfbBegin.number))
        let endInof = GetPercent(Number(this.data.t_yqsbwhjlfbEnd.number),Number(this.data.t_yqsbwhjhfbEnd.number))

         let data1 = [];
         data1.push(this.data.t_yqsbwhjhfbBegin.number);
         data1.push(this.data.t_yqsbwhjhfbEnd.number);
 
         let data2 = [];
         data2.push(this.data.t_yqsbwhjlfbBegin.number);
         data2.push(this.data.t_yqsbwhjlfbEnd.number);

         let data3 = [];
         data3.push(this.data.t_yqsbwhjhfbBegin.date);
         data3.push(this.data.t_yqsbwhjhfbEnd.date);

        const posList = [
  'left',
  'right',
  'top',
  'bottom',
  'inside',
  'insideTop',
  'insideLeft',
  'insideRight',
  'insideBottom',
  'insideTopLeft',
  'insideTopRight',
  'insideBottomLeft',
  'insideBottomRight'
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
    options: posList.reduce(function (map, pos) {
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
    const labelOption = {
      rotate: app.config.rotate,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      position: app.config.position,
      distance: app.config.distance
    };
    myChart.setOption({
      series: [
        {
          label: labelOption
        },
        {
          label: labelOption
        },
        {
          label: labelOption
        },
        {
          label: labelOption
        }
      ]
    });
  }
};
const labelOption = {
  show: true,
  position: app.config.position,
  distance: app.config.distance,
  align: app.config.align,
  verticalAlign: app.config.verticalAlign,
  rotate: app.config.rotate,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
      name: {
          textBorderColor: '#fff'
      }
  }
};
let option = {
  title: {
            text: this.title,
            subtext: this.data.t_yqsbwhjlfbBegin.date+"-"+this.data.t_yqsbwhjlfbEnd.date+"年维护次数"
          },
   grid: {
                top: '20%',
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
  tooltip: {
         trigger: 'axis',
         axisPointer: {
           type: 'shadow'
         },
         formatter: function (datas) {
             var res='计划:'+datas[0].value+"<BR>"
             res+='记录:'+datas[1].value+"<BR>"
             res+='百分比:'+(datas[0].value==null||datas[0].value==0?"0.00":(datas[1].value/datas[0].value*100).toFixed(2))+"%"
             return res
         }
  },
  legend: {
    show:false
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data:data3
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '计划',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: data1
    },
    {
      name: '记录',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: data2
    }
  ]
}; 

       option && s6sheBeiWeiHu.setOption(option);
      }
    }
  }
</script>
<style scoped>
  #s6sheBeiWeiHu:hover{
    transition: all 0.5s;
    transform:scale(1.03);
  }
  .statisticsPage{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     float: left;
  }
</style>
