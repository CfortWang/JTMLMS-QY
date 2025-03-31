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
            fontSize: 24,
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
        bottom: '80px'
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
    }

}

export const colors = [
    '#d20962',
    '#f47721',
    '#7ac143',
    '#00a78e',
    '#00bce4',
    '#7d3f98',
    '#037ef3',
    '#f85a40',
    '#00c16e',
    '#12CBC4',
    '#b4a996',
    '#7552cc',
    '#67809f',
    '#f19066'
]

export function * getRandomColor (shuffledColors) {
    let index = 0
    while (index < shuffledColors.length) {
        yield shuffledColors[index]
        index++
    }
}

export const monthChartOptionbl = {
    ...basicChart,
    series: [{
        type: 'line',
        symbol: 'circle',
        name: '合格率',
        data: [],
        symbolSize: 8,
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
    },
    {
        type: 'line',
        symbol: 'circle',
        name: '合格率',
        symbolSize: 8,
        data: [],
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff4949' },
                { offset: 0.5, color: '#ff4949' },
                { offset: 1, color: '#ff4949' }
            ]),
            normal: {
                color: '#ff4949',
                lineStyle: {
                    // color: '#ff4949',
                    width: 3,
                    type: 'dotted' // 'dotted' 点型虚线 'solid' 实线 'dashed' 线型虚线
                }
            }
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff4949' },
                    { offset: 0.7, color: '#ff4949' },
                    { offset: 1, color: '#ff4949' }
                ])
            }
        },
        label: {
            show: true,
            position: 'bottom',
            textStyle: {
                color: '#ff4949',
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
    },
    legend: {
        data: [],
        y: 'bottom',
        textStyle: {
            color: '#fff',
            fontSize: 14
            // fontStyle: 'bold'
        }
    }
}

export const quarterChartOptionbl = {
    ...basicChart,
    series: [{
        type: 'line',
        symbol: 'circle',
        name: '',
        data: [],
        symbolSize: 8,

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
                // fontStyle: 'bold'
            },
            formatter (params) {
                return params.value ? params.value : ''
            }
        }
    },
    {
        type: 'line',
        symbol: 'circle',
        name: '',
        data: [],
        symbolSize: 8,

        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff4949' },
                { offset: 0.5, color: '#ff4949' },
                { offset: 1, color: '#ff4949' }
            ]),

            normal: {
                color: '#ff4949',
                lineStyle: {
                    // color: '#ff4949',
                    width: 3,
                    type: 'dotted' // 'dotted' 点型虚线 'solid' 实线 'dashed' 线型虚线
                }
            }
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff4949' },
                    { offset: 0.7, color: '#ff4949' },
                    { offset: 1, color: '#ff4949' }
                ])
            }
        },
        label: {
            show: true,
            position: 'bottom',
            textStyle: {
                color: '#ff4949',
                fontSize: 14
                // fontStyle: 'bold'

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
    },
    legend: {
        data: [],
        y: 'bottom',
        textStyle: {
            color: '#fff',
            fontSize: 14
            // fontStyle: 'bold'
        }
    }
}

