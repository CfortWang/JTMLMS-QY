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
                barWidth: 'auto', // 设置为自适应模式
                barMaxWidth: 100, // 柱子最大宽度（像素）
                barMinWidth: 15, // 柱子最小宽度（像素）
                stack: 'stack1',
                emphasis: {
                    focus: 'series'
                }
            }))
            // 在 xAxis 配置中添加 axisLabel 配置
            const avg = mapValues(seriesData, values => mean(values).toFixed(2))
            const avgText = Object.entries(avg).map(([shift, avg]) => `${shift}【${avg}】`).join('，')
            const userOption = JSON.parse(JSON.stringify(chartOption))
            userOption.title.text = '人员班次统计'
            userOption.title.subtext = `人数共计：${this.userList.length}人，班次共计：${series.length}类，人均班次为：${avgText}`
            userOption.legend.data = Object.keys(seriesData)
            userOption.xAxis.data = categories
            userOption.xAxis.name = '人员姓名'
            userOption.yAxis.name = '班次次数（次）'
            userOption.series = series
            console.log(userOption)
            // 在 xAxis 配置中添加 axisLabel 配置
            if (categories.length > 20) { // 当人数超过20人时缩小字体
                userOption.xAxis.axisLabel = {
                    interval: 0, // 强制显示所有标签
                    rotate: 45, // 标签旋转 45 度避免重叠
                    fontSize: 12 // 适当缩小字体
                }
            }

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
                barWidth: 'auto', // 设置为自适应模式
                barMaxWidth: 100, // 柱子最大宽度（像素）
                barMinWidth: 15, // 柱子最小宽度（像素）
                stack: 'stack1',
                emphasis: {
                    focus: 'series'
                }
            }))
            const avg = mapValues(seriesData, values => mean(values).toFixed(2))
            const avgText = Object.entries(avg).map(([shift, avg]) => `${shift}【${avg}】`).join('，')
            const dateOption = JSON.parse(JSON.stringify(chartOption))
            dateOption.title.text = '日期班次统计'
            dateOption.title.subtext = `日期共计：${categories.length}天，班次共计：${series.length}类，日均班次为：${avgText}`
            dateOption.legend.data = Object.keys(seriesData)
            dateOption.xAxis.data = categories
            dateOption.xAxis.name = '日期'
            dateOption.yAxis.name = '班次次数（次）'
            dateOption.series = series
            if (categories.length > 20) { // 当数据超过20时缩小字体
                dateOption.xAxis.axisLabel = {
                    interval: 0, // 强制显示所有标签
                    rotate: 45, // 标签旋转 45 度避免重叠
                    fontSize: 12 // 适当缩小字体
                }
            }
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
                    type: 'pie',
                    data: Object.keys(seriesData).map(name => ({
                        name: name,
                        value: seriesData[name]
                    })),
                    itemStyle: {
                        color: params => colors[params.data.name]
                    }
                }
            ]
            const option = {
                title: chartOption.title,
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                textStyle: chartOption.textStyle,
                legend: {
                    orient: 'vertical',
                    x: '80%',
                    y: 'center',
                    textStyle: {
                        fontSize: 14
                    },
                    itemGap: 20,
                    data: categories
                }
            }
            option.title.text = '班次人数统计'
            const shiftOption = option
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
        //width: 100%;
        height: 400px;
    }
    #dateChart, #shiftChart {
        margin-top: 50px;
    }
}
</style>
