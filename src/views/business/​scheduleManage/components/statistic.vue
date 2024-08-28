<template>
    <div class="statistic-container">
        <div id="userChart" />
        <div id="dateChart" />
        <div id="shiftChart" />
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { chartOption } from '../constants/options'
import { mapValues, mean } from 'lodash'

export default {
    props: {
        scheduleData: {
            type: Object,
            required: true,
            default: () => {}
        },
        dateList: {
            type: Array,
            required: true,
            default: () => []
        },
        userList: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.renderUserChart()
            this.renderDateChart()
            this.renderShiftChart()
        },
        renderUserChart () {
            const userChart = echarts.init(document.getElementById('userChart'))
            const categories = this.userList.map(user => user.label)
            const seriesData = {}
            const colors = {}

            // 统计每个人各班次的数量
            this.userList.forEach(user => {
                const userId = user.value
                const schedules = this.scheduleData[userId]
                schedules.forEach(schedule => {
                    schedule.forEach(shift => {
                        const name = shift.name
                        if (!seriesData[name]) {
                            seriesData[name] = Array(this.userList.length).fill(0)
                            colors[name] = shift.color
                        }
                        const userIndex = this.userList.findIndex(u => u.value === userId)
                        seriesData[name][userIndex]++
                    })
                })
            })

            const series = Object.keys(seriesData).map(key => ({
                name: key,
                type: 'bar',
                data: seriesData[key],
                itemStyle: {
                    color: colors[key]
                },
                barMaxWidth: '50px',
                barMinWidth: '20px',
                markLine: {
                    silent: true,
                    precision: 2,
                    data: [
                        {
                            name: '平均值',
                            type: 'average'
                        }
                    ]
                }
                // label: {
                //     show: true,
                //     position: 'top',
                //     textStyle: {
                //         color: '#333',
                //         fontSize: 14
                //     }
                // }
            }))

            const avg = mapValues(seriesData, values => mean(values).toFixed(2))
            const avgText = Object.entries(avg).map(([shift, avg]) => `${shift}【${avg}】`).join('，')
            const userOption = JSON.parse(JSON.stringify(chartOption))
            userOption.title.text = '人员班次统计'
            userOption.title.subtext = `人数共计：${this.userList.length}，班次共计：${series.length}，人均班次为：${avgText}`
            userOption.legend.data = Object.keys(seriesData)
            userOption.xAxis.data = categories
            userOption.series = series
            console.log(userOption)
            userChart.setOption(userOption)
        },
        renderDateChart () {
            const dateChart = echarts.init(document.getElementById('dateChart'))
            const categories = this.dateList
            const seriesData = {}
            const colors = {}

            this.dateList.forEach((date, dateIndex) => {
                this.userList.forEach(user => {
                    const userId = user.value
                    const schedules = this.scheduleData[userId][dateIndex]
                    schedules.forEach(shift => {
                        const name = shift.name
                        if (!seriesData[name]) {
                            seriesData[name] = Array(this.dateList.length).fill(0)
                            colors[name] = shift.color
                        }
                        seriesData[name][dateIndex]++
                    })
                })
            })

            const series = Object.keys(seriesData).map(key => ({
                name: key,
                type: 'bar',
                data: seriesData[key],
                itemStyle: {
                    color: colors[key]
                },
                barMaxWidth: '50px',
                barMinWidth: '20px',
                markLine: {
                    silent: true,
                    precision: 2,
                    data: [
                        {
                            name: '平均值',
                            type: 'average'
                        }
                    ]
                }
            }))

            const avg = mapValues(seriesData, values => mean(values).toFixed(2))
            const avgText = Object.entries(avg).map(([shift, avg]) => `${shift}【${avg}】`).join('，')
            const dateOption = JSON.parse(JSON.stringify(chartOption))
            dateOption.title.text = '日期班次统计'
            dateOption.title.subtext = `日期共计：${this.userList.length}，班次共计：${series.length}，日均班次为：${avgText}`
            dateOption.legend.data = Object.keys(seriesData)
            dateOption.xAxis.data = categories
            dateOption.series = series
            dateChart.setOption(dateOption)
        },
        // 渲染班次人数统计图
        renderShiftChart () {
            const shiftChart = echarts.init(document.getElementById('shiftChart'))
            const categories = []
            const seriesData = {}
            const colors = {}

            this.userList.forEach(user => {
                const userId = user.value
                const schedules = this.scheduleData[userId]
                schedules.forEach(schedule => {
                    schedule.forEach(shift => {
                        const name = shift.name
                        if (!seriesData[name]) {
                            seriesData[name] = 0
                            colors[name] = shift.color
                            categories.push(name)
                        }
                        seriesData[name]++
                    })
                })
            })

            const series = [
                {
                    name: '人数',
                    type: 'bar',
                    data: categories.map(name => seriesData[name]),
                    itemStyle: {
                        color: params => colors[categories[params.dataIndex]]
                    },
                    barMaxWidth: '50px',
                    barMinWidth: '20px'
                }
            ]

            const shiftOption = JSON.parse(JSON.stringify(chartOption))
            shiftOption.title.text = '班次人数统计'
            shiftOption.legend.data = Object.keys(seriesData)
            shiftOption.xAxis.data = categories
            shiftOption.series = series
            shiftChart.setOption(shiftOption)
        }
    }
}
</script>

<style lang="scss" scoped>
.statistic-container {
    width: 100%;
    min-height: calc(100vh - 150px);
    #userChart, #dateChart, #shiftChart {
        width: 100%;
        height: 400px;
    }
    #dateChart, #shiftChart {
        margin-top: 20px;
    }
}
</style>
