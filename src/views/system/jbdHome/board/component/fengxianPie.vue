<template>
    <div class="pieView">
        <div style="width: 100%; height: 100%;" />
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data () {
        return {
            showChart: true
        }
    },
    mounted () {
    },
    methods: {
        getMiddleLeft (idSelector, info, orient) {
            const chartDom = document.getElementById(idSelector)
            var myChart = echarts.init(chartDom)
            const radius = '50%'
            const inData = info.data
            var leftDistance = info.title ? '50%' : '60%'
            var option
            option = {
                title: {
                    show: true,
                    text: info.title,
                    left: '41%',
                    top: 'bottom',
                    textStyle: {
                        color: '#1f1f1f',
                        fontSize: 18,
                        fontWeight: '600'
                    }
                },
                color: info.color,
                tooltip: {
                    trigger: 'item',
                    formatter: '{d}%'
                },
                label: {
                    formatter: '{b}\n{d}%',
                    edgeDistance: '20%',
                    fontSize: 12,
                    color: '#1f1f1f'
                },
                legend: {
                    show: true,
                    orient: orient || 'vertical',
                    itemGap: 6,
                    z: 3,
                    left: '10',
                    textStyle: {
                        color: '#1f1f1f'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: [leftDistance, '50%'],
                        data: inData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            distanceToLabelLine: 0
                        },
                        left: '50px'
                    }
                ]
            }
            myChart.setOption(option)
        }
    }
}
</script>

