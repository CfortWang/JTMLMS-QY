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

const fontColor = '#333'

export const chartOption = {
    title: {
        show: true,
        text: '',
        subtext: '',
        textStyle: {
            color: fontColor,
            fontSize: 24,
            fontWeight: '600'
        },
        subtextStyle: {
            color: fontColor,
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
        bottom: '30px',
        containLabel: true
    },
    legend: {
        data: [],
        bottom: 0
    },
    xAxis: {
        type: 'category',
        data: [],
        axisTick: {
            alignWithLabel: false
        },
        axisLabel: {
            style: {
                fill: fontColor
            },
            formatter (params) {
                return rowLimit(params, 4)
            }
        },
        axisLine: {
            lineStyle: {
                color: fontColor
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '',
        nameTextStyle: {
            color: fontColor,
            fontSize: 14
        },
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: fontColor
            }
        }
    },
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
            color: null
        },
        label: {
            show: true,
            position: 'top',
            textStyle: {
                color: fontColor,
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
        axisPointer: {
            type: 'shadow'
        }
        // formatter: ''
    }
}
