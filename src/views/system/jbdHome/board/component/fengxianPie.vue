<template>
    <div class="pieView">
        <div style="width: 100%; height: 100%;" />
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        info: {
            type: Object
        }
    },
    data () {
        return {
            showChart: true
        }
    },
    mounted () {
    },
    methods: {
        getMiddleLeft (idSelector) {
            const chartDom = document.getElementById(idSelector)
            var myChart = echarts.init(chartDom)
            const radius = '50%'
            const inData = this.info.data
            var option
            option = {
                title: {
                    show: true,
                    left: 'left',
                    textStyle: {
                        color: '#1f1f1f',
                        fontSize: 18,
                        fontWeight: '600'
                    }
                },
                color: this.info.color,
                tooltip: {
                    trigger: 'item',
                    formatter: '{d}%'
                },
                label: {
                    formatter: '{b}\n{d}%',
                    edgeDistance: '20%'
                },

                legend: {
                    show: true,
                    orient: 'vertical',
                    itemGap: 6,
                    z: 3,
                    left: 'left',
                    textStyle: {
                        color: '#1f1f1f'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: ['50%', '50%'],
                        data: this.info.data,
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
}
</style>
