<template>
    <div>
        <div id="chartM" style="width:100%;height:85%"></div>
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
            let mcm =  echarts.init(document.getElementById("chartM"))
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
                series: [
                    { 
                        name: '潜在客户数量',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        } 
                    }, { 
                        name: '意向客户数量',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        } 
                    }, { 
                        name: '已签约客户数量',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        } 
                    }
                ]
            };
            option && mcm.setOption(option);
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>