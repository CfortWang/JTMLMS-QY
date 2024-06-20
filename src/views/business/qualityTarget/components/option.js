import * as echarts from 'echarts'

const rowLimit = (params, max) => {
    let result = ''
    // 一行显示几个字
    const rowMax = max
    const rowNumber = Math.ceil(params.length / rowMax)
    // 超过 3 个字换行
    if (params.length > 3) {
        for (let p = 0; p < rowNumber; p++) {
            let tempStr = ''
            const start = p * rowMax
            const end = start + rowMax
            if (p === rowNumber - 1) {
                tempStr = params.substring(start, params.length)
            } else {
                tempStr = params.substring(start, end) + '\n'
            }
            result += tempStr
        }
    } else {
        result = params
    }
    return result
}

const basicChart = {
    title: {
        show: true,
        text: '',
        subtext: '',
        textStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '600'
        },
        subtextStyle: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '400',
            align: 'center'
        },
        textAlign: 'center',
        left: '50%',
        top: '5px'
    },
    grid: {
        top: '80px',
        bottom: '30px'
    },
    xAxis: {
        type: 'category',
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
            style: {
                fill: '#fff'
            },
            formatter (params) {
                return rowLimit(params, 4)
            }
        },
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '',
        nameTextStyle: {
            color: '#fff',
            fontSize: 14
        },
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    series: [{
        type: 'line',
        name: '',
        data: [],
        markLine: {
            data: [
                {
                    yAxis: '',
                    tooltip: {
                        formatter: ''
                    },
                    label: {
                        show: true, position: 'inside',
                        color: '#83bff6',
                        formatter: ''
                    },
                    lineStyle: {
                        color: '#ff4757',
                        type: 'dashed'
                    }
                }
            ]
        },
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
            ])
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                ])
            }
        },
        label: {
            show: true,
            position: 'top',
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter (params) {
                return params.value ? params.value : ''
            }
        }
    }],
    tooltip: {
        show: true,
        trigger: 'axis',
        formatter: '指标详情<br/>{b}月：{c}'
    }
}

export const monthChartOption = basicChart

export const quarterChartOption = {
    ...basicChart,
    series: [{
        type: 'bar',
        name: '',
        data: [],
        markLine: {
            data: [
                {
                    yAxis: '',
                    tooltip: {
                        formatter: ''
                    },
                    label: {
                        show: true, position: 'inside',
                        color: '#83bff6',
                        formatter: ''
                    },
                    lineStyle: {
                        color: '#ff4757',
                        type: 'dashed'
                    }
                }
            ]
        },
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
            ])
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                ])
            }
        },
        label: {
            show: true,
            position: 'top',
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter (params) {
                return params.value ? params.value : ''
            }
        }
    }],
    tooltip: {
        show: true,
        trigger: 'axis',
        formatter: '指标详情<br/>{b}：{c}'
    }
}

export const yearChartOption = {
    ...basicChart,
    series: [{
        type: 'bar',
        name: '',
        data: [],
        markLine: {
            data: [
                {
                    yAxis: '',
                    tooltip: {
                        formatter: ''
                    },
                    label: {
                        show: true, position: 'inside',
                        color: '#83bff6',
                        formatter: ''
                    },
                    lineStyle: {
                        color: '#ff4757',
                        type: 'dashed'
                    }
                }
            ]
        },
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
            ])
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                ])
            }
        },
        label: {
            show: true,
            position: 'top',
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            formatter (params) {
                return params.value ? params.value : ''
            }
        }
    }],
    tooltip: {
        show: true,
        trigger: 'axis',
        formatter: '指标详情<br/>{b}年度：{c}'
    }
}
