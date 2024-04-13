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
                color: info.color,
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
                    orient: orient || 'vertical',
                    itemGap: 6,
                    z: 3,
                    left: '20',
                    textStyle: {
                        color: '#1f1f1f'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: ['50%', '50%'],
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

