<template>
    <div :class="$style.box">
        <div :class="$style.left">
            <div
                v-for="(item, index) in statData"
                :key="index"
                :class="$style.stat"
            >
                <div :class="$style.title">{{ item.title }}</div>
                <div
                    v-for="(v, i) in item.children"
                    :key="i"
                    :class="$style['stat-item']"
                >
                    <div :class="$style.label">{{ v.label }}</div>
                    <div :class="$style.count">
                        <dv-digital-flop
                            :config="v.data"
                            :class="$style.flop"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style.chart">
            <div
                v-for="(item, index) in chartList"
                :id="`chart${index}`"
                :key="index"
                :class="$style['chart-item']"
            />
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { colors, getRandomColor, lineChartOption } from '../constants/option'
export default {
    components: {},
    props: {
        list: {
            type: Array,
            default: () => []
        },
        range: {
            type: Array,
            default: () => []
        },
        fontSize: {
            type: Number,
            default: 18
        }
    },
    data () {
        return {
            stat: [
                {
                    title: '急查血常规实验室内周转时间中位数（min）',
                    target: '≤60min',
                    children: [
                        {
                            label: '本周',
                            value: 34
                        },
                        {
                            label: '本月',
                            value: 30
                        },
                        {
                            label: '本季度',
                            value: 32
                        }
                    ]
                },
                {
                    title: '急查血常规实验室内TAT合格率（%）',
                    target: '≥90%',
                    children: [
                        {
                            label: '本周',
                            value: 95
                        },
                        {
                            label: '本月',
                            value: 92
                        },
                        {
                            label: '本季度',
                            value: 96
                        }
                    ]
                },
                {
                    title: '急查凝血实验室内周转时间中位数（min）',
                    target: '≤60min',
                    children: [
                        {
                            label: '本周',
                            value: 34
                        },
                        {
                            label: '本月',
                            value: 30
                        },
                        {
                            label: '本季度',
                            value: 32
                        }
                    ]
                },
                {
                    title: '急查凝血实验室内TAT合格率（%）',
                    target: '≥90%',
                    children: [
                        {
                            label: '本周',
                            value: 95
                        },
                        {
                            label: '本月',
                            value: 92
                        },
                        {
                            label: '本季度',
                            value: 96
                        }
                    ]
                },
                {
                    title: '急查生化免疫实验室内周转时间中位数（min）',
                    target: '≤60min',
                    children: [
                        {
                            label: '本周',
                            value: 34
                        },
                        {
                            label: '本月',
                            value: 30
                        },
                        {
                            label: '本季度',
                            value: 32
                        }
                    ]
                },
                {
                    title: '急查生化免疫实验室内TAT合格率（%）',
                    target: '≥90%',
                    children: [
                        {
                            label: '本周',
                            value: 95
                        },
                        {
                            label: '本月',
                            value: 92
                        },
                        {
                            label: '本季度',
                            value: 96
                        }
                    ]
                }
            ],
            statData: [],
            chartList: [
                {
                    limit: 60,
                    limitValue: '≤60min',
                    title: '急查血常规'
                },
                {
                    limit: 90,
                    limitValue: '≥90%',
                    title: '急查凝血'
                },
                {
                    limit: 90,
                    limitValue: '≥90%',
                    title: '急查生化免疫'
                }
            ]
        }
    },
    computed: {},
    watch: {
        range: {
            handler () {
                this.init()
            },
            deep: true
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const fontColor = [...colors].sort(() => Math.random() - 0.5)
            const colorGenerator = getRandomColor(fontColor)
            console.log(colorGenerator.next().value)
            this.stat.forEach(item => {
                item.children.forEach(i => {
                    i.data = {
                        number: [i.value],
                        content: '{nt}',
                        textAlign: 'right',
                        style: {
                            fill: colorGenerator.next().value,
                            fontWeight: 'bold'
                        }
                    }
                })
            })
            this.statData = JSON.parse(JSON.stringify(this.stat))
            console.log(this.statData)
            const D = new Date()
            const w = window.innerWidth
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
            console.log(lineChartOption)
            setTimeout(() => {
                this.chartList.forEach((item, index) => {
                    const chart = echarts.init(document.getElementById(`chart${index}`))
                    const option = JSON.parse(JSON.stringify(lineChartOption))
                    const xData = this.getDatesInRange(this.range[0], this.range[1])
                    const yData1 = Array.from({ length: xData.length }, () => Math.floor(Math.random() * 100) + 1)
                    const yData2 = Array.from({ length: xData.length }, () => Math.floor(Math.random() * 100) + 1)
                    const yMax = Math.max(...yData2)
                    const yMin = Math.min(...yData2)
                    const limit = item.limit
                    option.yAxis.max = Math.max(parseFloat(limit), parseFloat(yMax))
                    option.title.text = item.title
                    option.title.textStyle.fontSize = this.fontSize
                    option.title.subtext = `限值${item.limitValue.replace(/@/g, '')}`
                    option.xAxis.data = xData
                    option.series[0].data = yData1
                    option.series[1].data = yData2
                    option.series[1].markLine.data[0].yAxis = limit
                    option.series[1].markLine.data[0].label.formatter = limit
                    chart.setOption(option)
                })
            }, 100)
        },
        getDatesInRange (startDate, endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            const dates = []

            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                const month = (d.getMonth() + 1) + '月' // 月份从 0 开始
                const day = d.getDate() + '日'
                dates.push(month + day)
            }
            return dates
        }
    }
}
</script>
<style lang="scss" module>
    .box {
        width: 96%;
        height: calc(100% - 40px);
        padding: 20px 2%;
        display: flex;
        :global {
            .dv-decoration-10 {
                width: 96%;
                height: 5px;
                margin: 15px 2%;
            }
            .dv-decoration-2 {
                width:5px;
                height:100%;
            }
        }
        .left {
            position: relative;
            width: calc(20% - 32px);
            height: 100%;
            display: flex;
            // flex-shrink: 0;
            flex-direction: column;
            background-color: rgba(6, 30, 93, 0.4);
            .stat {
                flex: 1;
                height: 16.35%;
                padding: 0 16px;
                border-bottom: 5px solid rgb(6, 30, 93);
                &:last-child {
                    border-bottom: none;
                }
                .title {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 16px 0;
                }
                .stat-item {
                    display: inline-block;
                    width: 33%;
                    .label{
                        text-align: center;
                        font-size: 16px;
                    }
                    .count {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .flop {
                            width: 60px;
                            height: 40px;
                            margin-left: -20px;
                            font-size: 18px;
                        }
                        .unit {
                            margin-left: 10px;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }
        .chart {
            height: 100%;
            flex: 1;
            margin: 20px 1%;
            .chart-item {
                height: 33%;
                width: 100%;
            }
        }
    }
</style>
