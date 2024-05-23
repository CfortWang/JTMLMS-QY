const grid = {
    left: '2%',
    right: '2%',
    bottom: '2%',
    top: '12%',
    containLabel: true
}

const titleStyle = {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
}

export const LROption = {
    grid,
    dataset: [
        {
            source: [
                [96.24, 11.35],
                [33.09, 85.11],
                [57.6, 36.61],
                [36.77, 27.26],
                [20.1, 6.72],
                [45.53, 36.37],
                [110.07, 80.13],
                [72.05, 20.88],
                [39.82, 37.15],
                [48.05, 70.5],
                [0.85, 2.57],
                [51.66, 63.7],
                [61.07, 127.13],
                [64.54, 33.59],
                [35.5, 25.01],
                [226.55, 664.02],
                [188.6, 175.31],
                [81.31, 108.68]
            ]
        },
        {
            transform: {
                type: 'ecStat:regression',
                config: { method: 'polynomial', order: 1 }
            }
        },
        {
            transform: {
                type: 'ecStat:regression',
                config: { method: 'polynomial', order: 2 }
            }
        }
    ],
    title: {
        text: '线性回归图',
        subtext: '',
        sublink: '',
        left: 'center',
        top: 8,
        textStyle: titleStyle
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    xAxis: {
        name: 'x轴',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 14
        },
        nameGap: 20,
        splitLine: {
            show: false
        }
    },
    yAxis: {
        name: 'y轴',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 14
        },
        nameGap: 20,
        min: 0,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [
        {
            name: 'scatter',
            type: 'scatter'
        },
        {
            name: 'line',
            type: 'line',
            smooth: true,
            datasetIndex: 1,
            symbolSize: 0.1,
            symbol: 'circle',
            label: { show: true, fontSize: 14 },
            labelLayout: { dx: -20 },
            encode: { label: 2, tooltip: 1 }
        },
        {
            name: 'line2',
            type: 'line',
            smooth: true,
            datasetIndex: 2,
            symbolSize: 0.1,
            symbol: 'circle',
            label: { show: true, fontSize: 14 },
            labelLayout: { dx: -20 },
            encode: { label: 2, tooltip: 1 }
        }
    ]
}

export const SPOption = {
    xAxis: {},
    yAxis: {},
    grid,
    title: {
        text: '散点图',
        left: 'center',
        top: 8,
        textStyle: titleStyle
    },
    series: [
        {
            symbolSize: 10,
            data: [
                [10.0, 8.04],
                [8.07, 6.95],
                [13.0, 7.58],
                [9.05, 8.81],
                [11.0, 8.33],
                [14.0, 7.66],
                [13.4, 6.81],
                [10.0, 6.33],
                [14.0, 8.96],
                [12.5, 6.82],
                [9.15, 7.2],
                [11.5, 7.2],
                [3.03, 4.23],
                [12.2, 7.83],
                [2.02, 4.47],
                [1.05, 3.33],
                [4.05, 4.96],
                [6.03, 7.24],
                [12.0, 6.26],
                [12.0, 8.84],
                [7.08, 5.82],
                [5.02, 5.68]
            ],
            type: 'scatter',
            markLine: {
                symbol: ['none', 'none'], // 去掉箭头
                itemStyle: {
                    normal: { lineStyle: { type: 'solid', color: 'blue' },
                        label: { show: false, position: 'left' }}
                },
                data: [{
                    name: 'Y 轴值为 100 的水平线',
                    yAxis: 7.24
                    // valueDim: 'close'
                }, {
                    name: 'Y 轴值为 100 的水平线',
                    yAxis: 1.24
                    // valueDim: 'close'
                }
                ]
            }
        }
    ]
}
