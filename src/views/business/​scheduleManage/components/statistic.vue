<template>
    <div class="statistic-container">
        <!-- 人员班次统计 -->
        <div class="header-container">
            <div class="title-wrapper">
                <div class="main-title">人员班次统计</div>
                <div class="sub-title">{{ userChartSubtitle }}</div>
            </div>
            <el-select
                v-model="userSelectedShifts"
                placeholder="选择班次"
                multiple
                @change="renderUserChart"
                class="shift-select"
            >
                <el-option label="总计" value="total" />
                <el-option
                    v-for="shift in scheduleShift"
                    :key="shift.name"
                    :label="shift.name"
                    :value="shift.name"
                />
            </el-select>
        </div>
        <div class="chart-wrapper">
            <div id="userChart" class="chart-content" />
        </div>

        <!-- 日期班次统计 -->
        <div class="header-container">
            <div class="title-wrapper">
                <div class="main-title">日期班次统计</div>
                <div class="sub-title">{{ dateChartSubtitle }}</div>
            </div>
            <el-select
                v-model="dateSelectedShifts"
                placeholder="选择班次"
                multiple
                @change="renderDateChart"
                class="shift-select"
            >
                <el-option label="总计" value="total" />
                <el-option
                    v-for="shift in scheduleShift"
                    :key="shift.name"
                    :label="shift.name"
                    :value="shift.name"
                />
            </el-select>
        </div>
        <div class="chart-wrapper">
            <div id="dateChart" class="chart-content" />
        </div>

        <!-- 人员班次详情统计 -->
        <div class="header-container">
            <div class="title-wrapper">
                <div class="main-title">人员班次详情统计</div>
                <div class="sub-title">{{ userDetailChartSubtitle }}</div>
            </div>
            <el-select
                v-model="selectedUser"
                placeholder="选择人员"
                @change="renderUserDetailChart"
                class="shift-select"
            >
                <el-option
                    v-for="user in userList"
                    :key="user.value"
                    :label="user.label"
                    :value="user.value"
                />
            </el-select>
            <el-date-picker
                v-model="selectedDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="renderUserDetailChart"
                class="date-range-select"
            />
        </div>
        <div class="chart-wrapper">
            <div id="userDetailChart" class="chart-content" />
        </div>

        <!-- 班次人数统计和班次数量统计 -->
        <div class="header-container">
            <!--<div class="title-wrapper">
                <div class="main-title" style="text-align: center;">班次人数统计</div>
            </div>
            <div class="title-wrapper">
                <div class="main-title" style="text-align: center;">班次数量统计</div>
            </div>-->
        </div>
        <div class="chart-wrapper" style="display: flex;">
            <div id="shiftChart" class="chart-content" style="flex: 1; height: 400px;" />
            <div id="shiftCountChart" class="chart-content" style="flex: 1; height: 400px;" />
        </div>
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
            default: () => ({})
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
        },
        scheduleShift: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data () {
        return {
            userSelectedShifts: ['total'],
            dateSelectedShifts: ['total'],
            userMaxYAxisValue: 0, // 人员统计图的最大值
            dateMaxYAxisValue: 0, // 日期统计图的最大值
            baseChartWidth: 1200,
            selectedUser: '', // 选择的人员
            selectedDateRange: [] // 选择的日期区间
        }
    },
    computed: {
        userChartSubtitle () {
            const avgValues = this.calculateUserAvgValues()
            const avgText = this.scheduleShift
                .map(shift => `${shift.name}【${avgValues[shift.name]}】`)
                .join('，')
            return `人数：${this.userList.length}人，班次类型：${this.scheduleShift.length}类，人均：${avgText}`
        },
        dateChartSubtitle () {
            const avgValues = this.calculateDateAvgValues()
            const avgText = this.scheduleShift
                .map(shift => `${shift.name}【${avgValues[shift.name]}】`)
                .join('，')
            return `日期：${this.dateList.length}天，班次类型：${this.scheduleShift.length}类，日均：${avgText}`
        },
        userDetailChartSubtitle () {
            return `班次类型：${this.scheduleShift.length}类`
        }
    },
    mounted () {
        if (this.userList.length > 0) {
            this.selectedUser = this.userList[0].value
        }

        // 默认选择排班的日期区间（第一个和最后一个日期）
        if (this.dateList.length > 0) {
            const startDate = new Date(this.dateList[0])
            const endDate = new Date(this.dateList[this.dateList.length - 1])
            this.selectedDateRange = [startDate, endDate]
        }
        this.init()
        // 手动调用 renderUserDetailChart 方法
        this.renderUserDetailChart()
    },
    methods: {
        init () {
            this.calculateUserMaxYAxisValue() // 计算人员统计图的最大值
            this.calculateDateMaxYAxisValue() // 计算日期统计图的最大值
            this.renderUserChart()
            this.renderDateChart()
            this.renderShiftChart()
            this.renderShiftCountChart()
        },

        calculateUserMaxYAxisValue () {
            const userData = this.userList.map(user =>
                this.scheduleData[user.value].flat().length
            )
            this.userMaxYAxisValue = Math.max(...userData) + 2 // 人员统计图的最大值
        },

        calculateDateMaxYAxisValue () {
            const dateData = this.dateList.map((_, i) =>
                this.userList.reduce((sum, user) => sum + this.scheduleData[user.value][i].length, 0)
            )
            this.dateMaxYAxisValue = Math.max(...dateData) + 2 // 日期统计图的最大值
        },

        calculateSeriesData (dataSource, dataLength) {
            const seriesData = {}
            this.scheduleShift.forEach(shift => {
                seriesData[shift.name] = Array(dataLength).fill(0)
            })

            dataSource.forEach((item, index) => {
                item.forEach(shift => {
                    seriesData[shift.name][index]++
                })
            })

            return seriesData
        },

        calculateUserAvgValues () {
            const seriesData = this.calculateSeriesData(
                this.userList.map(user => this.scheduleData[user.value].flat()),
                this.userList.length
            )
            return mapValues(seriesData, values => mean(values).toFixed(2))
        },

        calculateDateAvgValues () {
            const seriesData = this.calculateSeriesData(
                this.dateList.map((_, i) =>
                    this.userList.flatMap(user => this.scheduleData[user.value][i])
                ),
                this.dateList.length
            )
            return mapValues(seriesData, values => mean(values).toFixed(2))
        },

        renderUserChart () {
            const chart = echarts.init(document.getElementById('userChart'))
            chart.clear()
            const categories = this.userList.map(user => user.label)
            const seriesData = this.calculateSeriesData(
                this.userList.map(user => this.scheduleData[user.value].flat()),
                this.userList.length
            )

            const { series, legend } = this.getRenderSeries(seriesData, this.userSelectedShifts)
            const option = this.getBarOption({
                categories,
                series,
                legend,
                xName: '人员姓名',
                yName: '班次次数（次）',
                maxYAxisValue: this.userMaxYAxisValue // 使用人员统计图的最大值
            })
            if (this.userSelectedShifts.length === 1 && this.userSelectedShifts[0] === 'total') { // 人员统计只显示合计时,柱状图顶部显示数据。
                option.series = option.series.map(s => ({
                    ...s,
                    label: {
                        show: true,
                        position: 'top'
                    }
                }))
            }

            chart.setOption(option)
        },

        renderDateChart () {
            const chart = echarts.init(document.getElementById('dateChart'))
            chart.clear()
            const categories = this.dateList
            const seriesData = this.calculateSeriesData(
                this.dateList.map((_, i) =>
                    this.userList.flatMap(user => this.scheduleData[user.value][i])
                ),
                this.dateList.length
            )

            const { series, legend } = this.getRenderSeries(seriesData, this.dateSelectedShifts)
            const option = this.getBarOption({
                categories,
                series,
                legend,
                xName: '日期',
                yName: '班次次数（次）',
                maxYAxisValue: this.dateMaxYAxisValue // 使用日期统计图的最大值
            })

            chart.setOption(option)
        },

        getRenderSeries (seriesData, selectedShifts) {
            const series = []
            const legend = []
            const validShifts = selectedShifts.filter(s => s === 'total' || seriesData[s])

            if (validShifts.includes('total')) {
                const totalData = Object.values(seriesData).reduce((acc, cur) =>
                    cur.map((v, i) => (acc[i] || 0) + v), []
                )
                series.push({
                    name: '总计',
                    type: 'bar',
                    data: totalData,
                    itemStyle: { color: '#5470C6' }
                })
                legend.push('总计')
            }

            validShifts.forEach(shift => {
                if (shift !== 'total' && seriesData[shift]) {
                    series.push({
                        name: shift,
                        type: 'bar',
                        data: seriesData[shift],
                        itemStyle: { color: this.scheduleShift.find(s => s.name === shift)?.color }
                    })
                    legend.push(shift)
                }
            })

            return { series, legend }
        },

        getBarOption ({ categories, series, legend, xName, yName, maxYAxisValue }) {
            const option = JSON.parse(JSON.stringify(chartOption))
            // 动态计算柱子宽度
            const barCount = series.length
            const minBarWidth = 3
            const maxBarWidth = 100
            const calcWidth = this.baseChartWidth / categories.length / (barCount || 1) * 0.8
            const barWidth = Math.min(maxBarWidth, Math.max(minBarWidth, calcWidth))

            // 横坐标标签设置
            option.xAxis.axisLabel = {
                rotate: categories.length > 20 ? 45 : 0, // 大于20时才选择旋转横坐标标签
                fontSize: 12, // 字体缩小
                interval: 0, // 显示所有标签
                margin: 15 // 增加间距
            }

            option.xAxis.data = categories
            option.xAxis.name = xName
            option.yAxis.name = yName
            option.yAxis.max = maxYAxisValue // 使用传入的最大值
            // 显示纵坐标刻度线
            option.yAxis.axisTick = {
                show: true
            }
            option.yAxis.axisLine = {
                show: true
            }

            option.grid = {
                ...option.grid,
                top: '18%', // 增加顶部间距
                bottom: '15%' // 增加底部间距
            }

            option.legend = {
                show: true,
                data: legend,
                top: 0, // 图例放在顶部
                itemWidth: 14,
                itemHeight: 14
            }

            option.series = series.map(s => ({
                ...s,
                barWidth,
                barGap: '20%',
                barCategoryGap: '30%'
            }))
            // 修复tooltip总计显示问题
            option.tooltip = {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const index = params[0].dataIndex
                    let result = `${params[0].name}<br>`
                    const total = series.find(s => s.name === '总计')?.data[index] || 0
                    result += `总计: ${total}<br>`
                    params.forEach(p => {
                        if (p.seriesName !== '总计') { // 过滤掉总计的重复显示
                            result += `${p.seriesName}: ${p.value}<br>`
                        }
                    })
                    return result
                }
            }

            return option
        },

        renderShiftChart () {
            const chart = echarts.init(document.getElementById('shiftChart'))
            const seriesData = {}
            this.scheduleShift.forEach(shift => {
                seriesData[shift.name] = new Set() // 使用 Set 来存储每个班次的人员
            })

            this.userList.forEach(user => {
                this.scheduleData[user.value].flat().forEach(shift => {
                    seriesData[shift.name].add(user.value) // 将人员 ID 添加到对应的班次 Set 中
                })
            })

            const option = {
                title: { text: '班次人数统计', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: {
                    orient: 'vertical',
                    right: 80,
                    itemGap: 20, // 设置图例项之间的间距
                    top: 'middle',
                    itemWidth: 14,
                    itemHeight: 14
                },
                series: [{
                    name: '班次人数',
                    type: 'pie',
                    radius: '55%',
                    data: this.scheduleShift.map(shift => ({
                        name: shift.name,
                        value: seriesData[shift.name].size, // 使用 Set 的 size 来统计人数
                        itemStyle: { color: shift.color }
                    })),
                    label: {
                        show: true,
                        formatter: '{b}: {c} 人({d}%)'
                    }
                }]
            }

            chart.setOption(option)
        },

        renderShiftCountChart () {
            const chart = echarts.init(document.getElementById('shiftCountChart'))
            const seriesData = {}
            this.scheduleShift.forEach(shift => {
                seriesData[shift.name] = 0
            })

            this.dateList.forEach((_, i) => {
                this.userList.forEach(user => {
                    this.scheduleData[user.value][i].forEach(shift => {
                        seriesData[shift.name]++
                    })
                })
            })

            const option = {
                title: { text: '班次数量统计', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: {
                    orient: 'vertical',
                    right: 100,
                    itemGap: 20, // 设置图例项之间的间距
                    top: 'middle',
                    itemWidth: 14,
                    itemHeight: 14
                },
                series: [{
                    name: '班次数量',
                    type: 'pie',
                    radius: '55%',
                    data: this.scheduleShift.map(shift => ({
                        name: shift.name,
                        value: seriesData[shift.name],
                        itemStyle: { color: shift.color }
                    })),
                    label: {
                        show: true,
                        formatter: '{b}: {c} 次({d}%)'
                    }
                }]
            }

            chart.setOption(option)
        },

        renderUserDetailChart () {
            if (!this.selectedUser || this.selectedDateRange.length === 0) return

            const chart = echarts.init(document.getElementById('userDetailChart'))
            chart.clear()

            // 将 selectedDateRange 转换为字符串格式
            const startDate = this.selectedDateRange[0].toISOString().split('T')[0]
            const endDate = this.selectedDateRange[1].toISOString().split('T')[0]

            // 过滤出在日期区间内的日期
            const dateRange = this.dateList.filter(date =>
                date >= startDate && date <= endDate
            )

            // 获取选中人员的班次数据
            const userShifts = this.scheduleData[this.selectedUser]
            const shiftCount = {}

            // 初始化班次计数
            this.scheduleShift.forEach(shift => {
                shiftCount[shift.name] = 0
            })

            // 遍历日期区间，统计班次次数
            dateRange.forEach(date => {
                const dateIndex = this.dateList.indexOf(date)
                if (dateIndex !== -1) {
                    userShifts[dateIndex].forEach(shift => {
                        shiftCount[shift.name]++
                    })
                }
            })

            // 准备图表数据
            const categories = this.scheduleShift.map(shift => shift.name)
            const seriesData = this.scheduleShift.map(shift => shiftCount[shift.name])
            const self = this
            const option = {
                //title: { text: '人员班次详情统计', left: 'center' },
                tooltip: { trigger: 'axis' },
                xAxis: {
                    type: 'category',
                    data: categories,
                    name: '班次名称',
                    axisLabel: {
                        rotate: categories.length > 15 ? 45 : 0, // 当班次大于15时才选择旋转横坐标标签
                        fontSize: 12,
                        interval: 0,
                        margin: 15
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '班次次数（次）'
                },
                series: [{
                    name: '班次次数',
                    type: 'bar',
                    barMinWidth: 30,
                    barMaxWidth: 100,
                    data: seriesData,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // 返回该班次对应的颜色
                                return self.scheduleShift.find(s => s.name === params.name)?.color
                            }
                        }
                    },
                    label: { // 柱子顶部显示数字
                        show: true,
                        position: 'top'
                    }
                }]
            }
            // 显示纵坐标刻度线
            option.yAxis.axisTick = {
                show: true
            }
            option.yAxis.axisLine = {
                show: true
            }
            chart.setOption(option)
        }
    }
}
</script>

<style lang="scss" scoped>
.statistic-container {
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 0 120px;
    padding: 20px 0 15px;

    .title-wrapper {
      flex: 1;
      min-width: 0;

      .main-title {
        font-size: 18px;
        color: #333;
        font-weight: 600;
        line-height: 1.4;
      }

      .sub-title {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .shift-select {
      width: 400px;
      margin-left: 30px;
      flex-shrink: 0;
    }

    .date-range-select {
      width: 400px;
      margin-left: 30px;
      flex-shrink: 0;
    }
  }

  .chart-wrapper {
    overflow-x: auto;
    padding-bottom: 10px;

    .chart-content {
      min-width: 1200px;
      height: 400px;
    }
  }

  #shiftChart, #shiftCountChart {
    min-width: auto;
  }

}
</style>