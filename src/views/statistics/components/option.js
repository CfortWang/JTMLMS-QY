import * as echarts from 'echarts'

export const chartOption = {
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
        formatter: '任务情况<br/>{b}：{c}<br/>'
    }
}
