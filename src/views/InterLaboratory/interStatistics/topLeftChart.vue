<template>
    <div class="pieView">
        <div style="  height:14%;line-height:30px;text-align: left;padding-left: 10px;padding-left: 10px;padding-top: 10px; margin-bottom: -50px;color: white;">
            {{ info.title || "" }}
        </div>
        <div style="width: 100%; height: 95%; display: inline-block; overflow: hidden;padding-left: 10px;">
            <div id="topLeftChart" style="width: 100%; height: 100%; overflow: hidden" />
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        info: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data () {
        return {
            showChart: true,
            option: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true
                // },
                grid: {
                    x: 50,
                    y: 50,
                    x2: 50,
                    y2: 50
                },
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom: 'bottom',
                    textStyle: {
                        color: '#ffff',
                        fontSize: 12
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        interval: 10,
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '计划项目',
                        type: 'bar',
                        barWidth: '60%',
                        barMaxWidth: 30,
                        data: []
                    }
                ]
            }
        }
    },
    watch: {
        info: {
            handler (newVal, oldVal) {
                this.getMiddleLeft()
            },
            deep: true
        }
    },
    mounted () {
        const this_ = this
        this.$nextTick(() => {
            this_.getMiddleLeft()
        })
    },
    methods: {
        getMiddleLeft () {
            this.option.xAxis[0].data = this.info.yearArr
            this.option.series[0].data = this.info.numArr
            const chartDom = document.getElementById(this.info.id)
            var myChart = echarts.init(chartDom)
            console.log(this.option)
            setTimeout(() => {
                myChart.setOption(this.option)
            }, 500)
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
</style>
