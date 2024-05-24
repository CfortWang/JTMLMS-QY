import * as echarts from 'echarts'
export default {
    data () {
        return {
            barLable: {
                show: true,
                position: 'right',
                textStyle: { // 数值样式
                    color: 'black',
                    fontSize: 12
                },
                formatter: (params) => {
                    // 这个回调函数不起作用了
                    return params.value === '0' ? '' : params.value
                }

            },
            tooltip: {
                show: true,
                trigger: 'axis'
                // axisPointer: {
                //     type: 'none'
                // }
            }
        }
    },
    methods: {
        getOption (leftData) {
            const option = {
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: 100,
                        animationDuration: 3000,
                        center: ['50%', '65%'],
                        axisLine: {
                            lineStyle: {
                                width: 30,
                                color: [
                                    [0.3, '#fd666d'],
                                    [0.7, '#37a2da'],
                                    [1, '#67e0e3']
                                ]
                            }
                        },
                        pointer: {
                            itemStyle: {
                                color: 'auto'
                            }
                        },
                        axisTick: {
                            distance: -30,
                            length: 8,
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        splitLine: {
                            distance: -30,
                            length: 30,
                            lineStyle: {
                                color: '#fff',
                                width: 4
                            }
                        },
                        axisLabel: {
                            show: true
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value} %',
                            color: 'auto',
                            top: '100%',
                            offsetCenter: [0, '65%']
                        },
                        title: {
                            offsetCenter: [0, '-120%'],
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                        data: [{ value: leftData.leftTotal <= 100 ? leftData.leftTotal : 100, name: leftData.title || '', top: '100%' }]
                    }
                ]
            }
            const accept = echarts.init(this.$refs.chart1)
            accept.setOption(JSON.parse(JSON.stringify(option)))
            // this.show1 = true
        },
        barDataPlan (data, rightShow, direction) {
            let barDataTy = null
            if (!rightShow) {
                data.series.forEach(item => {
                    item.label = item.label || this.barLable
                    item.type = 'bar'
                    item.barGap = 0
                    item.emphasis = {
                        focus: 'series'
                    }
                })
                const xAxis = {
                    type: 'value',
                    name: data.xAxisName || '数量（个）',
                    minInterval: 1,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
                const yAxis = {
                    type: 'category',
                    name: data.yAxisName || '部门',
                    nameTextStyle: {
                        fontSize: 14
                    },
                    splitLine: {
                        show: false
                    },
                    data: data.yAxisData
                }
                barDataTy = {
                    // 图例设置
                    legend: {
                        textStyle: {
                            fontSize: 12,
                            color: '#333'
                        }
                    },
                    title: {
                        show: true,
                        text: data.title,
                        textStyle: {
                            // color: '#fff',
                            fontSize: 20,
                            fontWeight: '600'
                        },
                        textAlign: 'center',
                        left: '50%',
                        top: '20px'
                    },
                    xAxis: direction === 'x' ? yAxis : xAxis,
                    yAxis: direction === 'x' ? xAxis : yAxis,
                    series: data.series,
                    color: data.color,
                    tooltip: data.tooltip || this.tooltip
                }
            } else {
                barDataTy = data
            }

            const accept = echarts.init(this.$refs.chart2)
            accept.setOption(JSON.parse(JSON.stringify(barDataTy)))
        }
    }

}

