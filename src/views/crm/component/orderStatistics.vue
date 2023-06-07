<template>
    <div>
        <div id="chartOR" style="width:100%;height:100%"></div>
    </div>
</template>
<script>
import echarts from 'echarts'
  export default {
    data() {
        return {
            // title:'人员培训',
            dialogOff:false,
       }
    },
    props:{
        data: {
            type: Array,
        }
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
      getEchartData() {
        
        if (true) {
            let ors=  echarts.init(document.getElementById("chartOR"))
            let option = {
                legend: {                  
                    textStyle:{
                        color:'#fff'
                    }
                },
                tooltip: {},
                color:['#FF33FF','#66FFFF','#33CC00'],
                dataset: {
                    dimensions: ['lei_bie_', 'qznum', 'ynnum', 'khnum'],
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
                series: [{ name: '潜在客户数量',type: 'bar' }, { name: '意向客户数量',type: 'bar' }, { name: '已签约客户数量',type: 'bar' }]
            };
            option && ors.setOption(option);
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>