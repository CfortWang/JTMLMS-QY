<template>
    <div class="statisticsPage" :style="{width:width,height:height}">
        <div :id="'mid'+id" :style="{height:'100%'}"/>
    </div>
    <!-- <div class="pieView">
        <div style="  height:14%;line-height:30px;text-align: left;padding-left: 10px;color: white;">
            {{ title || "" }}
        </div>
        <div v-show="showChart" style="width: 100%; height: 86%; display: inline-block; overflow: hidden">
            <div :id="'mid'+id" style="width: 100%; height: 95%; overflow: hidden" />
        </div>
        <div v-if="!showChart" style="background: #061237;width: 100%;height: 70%;display: flex;justify-content: center;align-items: center;">
            <div style="color: #c7c7c7">目前无数据</div>
        </div>
    </div> -->
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        value: {
            type: Array,
            default: {}
        },
        width:{
            type:String,
            default:"100%"
        },
        height:{
            type:String,
            default: "100%"
        },
        title:{
            type: String
        },
        id:{
            type:Number,
            default:0
        },
        colorw:{
            type:String,
            default:'#fff'
        },
    },
    data () {
        return {
            showChart: true
        }
    },
    watch: {
        value: {
            handler (newVal, oldVal) {
                this.getMiddleLeft()
            },
            deep: true
        }
    },
    mounted () {
        const this_ = this
        setTimeout(() => {
            this_.getMiddleLeft()
        }, 100);
    },
    methods: {
        getMiddleLeft () {
            const chartDom = document.getElementById('mid'+this.id)
            let myChart = echarts.init(chartDom)
            const radius = window.innerWidth > 1600 ? '60%' : '45%'
            let option
            option = {
                title: {
                    text: this.title,
                    left: 'left',
                    textStyle:{ fontSize:24,color: this.colorw }
                },
                color: ['#339933', '#3366CC', '#FF9933', '#FFFF00'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{d}%'
                },
                label: {
                    formatter: '{c}，{d}%\n{b}',
                    edgeDistance: '20%',
                    color: '#fff',
                    fontSize: '12px'
                },

                legend: {
                    show: true,
                    // orient: 'vertical',
                    itemGap: 6,
                    z: 3,
                    left: 'left',
                    top: '45',
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: ['50%', '60%'],
                        data: this.value,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            distanceToLabelLine: 0
                        }
                    }
                ]
            }
            myChart.setOption(option)
        }
    }
}
</script>
<style lang="scss" scoped>
.pieView {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(6, 30, 93, 0.5);
}
.statisticsPage{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 1%;
    // background-color: rgba(6, 30, 93, 0.5);
}
</style>
