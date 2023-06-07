<template>
<div @click="toDetailed()" class="statisticsPage" style="width:100%;height:85%">
    <div id="chartOR" style="width:100%;height:100%"></div>
        <div v-if="dialogOff">
      <dialogView
        :dialogOff = "dialogOff"
        @close = "close"
        :data="userInfo"
        :date="date"
      />
    </div>
</div>
</template>
<script>
import echarts from 'echarts'
import dialogView from '../messageBox/teamMonthDetails'

  export default {
    data() {
        return {
            // title:'人员培训',
            dialogOff:false,
            userInfo:[]
       }
    },
    props:{
        data: {
            type: Array,
        },
        date: {
            type: String,
        },
        click:{
            type:String,
            default:'true'
        },
    },
    components:{
      dialogView
    },
    watch: {
        data(v) {
            this.getEchartData()
        }
    },
    mounted() {
      this.getEchartData()
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
      getEchartData() {
        if (true) {
            let that = this
            let ors=  echarts.init(document.getElementById("chartOR"))
            let option = {
                legend: {                  
                    textStyle:{
                        color:'#fff'
                    }
                },
                tooltip: {},
                color:['#99FFFF'],
                dataset: {
                    dimensions: ['NAME_', 'jiage'],
                    source: this.data
                },
                xAxis: { 
                    type: 'category',
                    axisLabel:{//修改坐标系字体颜色
                        show:true,
                        textStyle:{
                            color:"#fff"
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,1)",
                            type: "solid"
                        }
                    }
                },
                yAxis: {
                    axisLabel:{//修改坐标系字体颜色
                        show:true,
                        textStyle:{
                            color:"#fff"
                        }
                    },
                    axisLine: {//y轴线的颜色以及宽度
                        show: true,
                        lineStyle: {
                            color: "rgba(255,255,255,1)",
                            type: "solid"
                        },
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [{ name: '销量',type: 'bar',barWidth:'10%',label: {show: true,position: 'top'} }]
            };
            ors.on('click', function (params) {
                // console.log(params.data.bian_zhi_ren_)
                that.userInfo[0] = params.data.bian_zhi_ren_
                that.userInfo[1] = params.data.NAME_
                // console.log(params.dataIndex);
            })
            option && ors.setOption(option);
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>