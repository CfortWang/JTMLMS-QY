<template>
    <div>
        <div id="chart" style="width:100%;height:85%"></div>
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
            default: []
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
            let myChart =  echarts.init(document.getElementById("chart"))
            let option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center',
                    textStyle:{
                        color:'#fff',
                        fontSize: 15,
                        fontWeight: 'bold'
                    }
                },
                color:['#FF3366','#66FFFF','#66CC00'],
                series: [
                    {
                        type: 'pie',
                        // radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            // show: true,
                            formatter: '{b}: {@2012} ({d}%)',
                            position: 'inner',
                            textStyle: {
                                fontSize: 18,
                                fontWeight: 'bold'
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.data
                    }
                ]
                // legend: {                  
                //     textStyle:{
                //         color:'#fff'
                //     }
                // },
                // tooltip: {},
                // color:['#FF3366','#66FFFF','#66CC00'],
                // dataset: {
                //     dimensions: ['lei_bie_', 'qznum', 'ynnum', 'khnum'],
                //     source: this.data
                // },
                // xAxis: { 
                //     type: 'category',
                //     axisLabel:{//修改坐标系字体颜色
                //         show:true,
                //         textStyle:{
                //             color:"#fff"
                //         }
                //     },
                //     axisLine: {
                //         show: true,
                //         lineStyle: {
                //             color: "rgba(255,255,255,1)",
                //             type: "solid"
                //         }
                //     }
                // },
                // yAxis: {
                //     axisLabel:{//修改坐标系字体颜色
                //         show:true,
                //         textStyle:{
                //             color:"#fff"
                //         }
                //     },
                //     axisLine: {//y轴线的颜色以及宽度
                //         show: true,
                //         lineStyle: {
                //             color: "rgba(255,255,255,1)",
                //             type: "solid"
                //         },
                //     },
                //     splitLine: {
                //         show: false
                //     }
                // },
                // // Declare several bar series, each will be mapped
                // // to a column of dataset.source by default.
                // series: [
                //     { 
                //         name: '潜在客户数量',
                //         type: 'bar',
                //         label: {
                //             show: true,
                //             position: 'top'
                //         } 
                //     }, { 
                //         name: '意向客户数量',
                //         type: 'bar', 
                //         label: {
                //             show: true,
                //             position: 'top'
                //         } 
                //     }, {
                //         name: '已签约客户数量',
                //         type: 'bar',
                //         label: {
                //             show: true,
                //             position: 'top'
                //         } 
                //     }
                // ]
            };
            option && myChart.setOption(option);
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

</style>