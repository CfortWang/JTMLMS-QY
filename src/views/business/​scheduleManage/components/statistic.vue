<template>
    <div class="statistic-container">
        <div id="userChart" />
        <div class="inline-chart">
            <div id="dateChart" />
            <div id="shiftCountChart" />
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { option1 } from '../constants/options'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        scheduleData: {
            type: Object,
            default: () => {}
        },
        dateList: {
            type: Array,
            default: () => []
        },
        userList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            userShiftCounts: [],
            dateShiftCounts: [],
            shiftPersonCounts: {},
            shiftTypes: []
        }
    },
    watch: {
        visible: {
            handler (val) {
                console.log(val)
            },
            immediate: true
        }
    },
    mounted () {
        this.processData()
        this.initCharts()
    },
    methods: {
        processData () {
            // 动态提取班次类型
            this.shiftTypes = new Set()

            // 统计用户班次数量
            this.userShiftCounts = this.userList.map(user => {
                const shifts = this.scheduleData[user.value]
                const shiftCount = {}

                shifts.forEach(shiftArray => {
                    shiftArray.forEach(shift => {
                        if (shift.isEnabled === 'Y') {
                            this.shiftTypes.add(shift.alias) // 收集班次类型
                            shiftCount[shift.alias] = (shiftCount[shift.alias] || 0) + 1

                            // 统计班次人数
                            this.shiftPersonCounts[shift.alias] = (this.shiftPersonCounts[shift.alias] || new Set())
                            this.shiftPersonCounts[shift.alias].add(user.label)
                        }
                    })
                })

                return { label: user.label, ...shiftCount }
            })

            // 统计日期班次数量
            this.dateShiftCounts = this.dateList.map((date, index) => {
                const count = {}

                Object.values(this.scheduleData).forEach(shifts => {
                    if (shifts[index]) {
                        shifts[index].forEach(shift => {
                            if (shift.isEnabled === 'Y') {
                                count[shift.alias] = (count[shift.alias] || 0) + 1
                                this.shiftTypes.add(shift.alias) // 收集班次类型
                            }
                        })
                    }
                })

                return { date, ...count }
            })
        },
        initCharts () {
            // 图表1：人员班次统计
            const userChart = echarts.init(document.getElementById('userChart'))
            userChart.setOption({
                title: { text: '人员班次统计' },
                tooltip: {},
                legend: { data: Array.from(this.shiftTypes) }, // 动态生成图例
                xAxis: {
                    type: 'category',
                    data: this.userShiftCounts.map(user => user.label)
                },
                yAxis: { type: 'value' },
                series: Array.from(this.shiftTypes).map(shift => ({
                    name: shift,
                    type: 'bar',
                    data: this.userShiftCounts.map(user => user[shift] || 0) // 动态获取数据
                }))
            })

            // 图表2：日期班次统计
            const dateChart = echarts.init(document.getElementById('dateChart'))
            dateChart.setOption({
                title: { text: '日期班次统计' },
                tooltip: {},
                legend: { data: Array.from(this.shiftTypes) }, // 动态生成图例
                xAxis: {
                    type: 'category',
                    data: this.dateShiftCounts.map(date => date.date)
                },
                yAxis: { type: 'value' },
                series: Array.from(this.shiftTypes).map(shift => ({
                    name: shift,
                    type: 'bar',
                    data: this.dateShiftCounts.map(date => date[shift] || 0) // 动态获取数据
                }))
            })

            // 图表3：班次人数统计
            const shiftCountChart = echarts.init(document.getElementById('shiftCountChart'))
            shiftCountChart.setOption({
                title: { text: '班次人数统计' },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: Array.from(this.shiftTypes)
                },
                yAxis: { type: 'value' },
                series: [{
                    name: '人数',
                    type: 'bar',
                    data: Array.from(this.shiftTypes).map(shift => this.shiftPersonCounts[shift] ? this.shiftPersonCounts[shift].size : 0) // 统计人数
                }]
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .statistic-container {
        width: 100%;
        height: calc(100vh - 150px);
        #userChart {
            width: 100%;
            height: calc(50% - 10px);
            margin-bottom: 20px;
            background-color: #fff
        }
        .inline-chart {
            width: 100%;
            height: calc(50% - 10px);
            display: flex;
            justify-content: space-between;
            #dateChart, #shiftCountChart {
                flex: 1;
                width: 50%;
                height: 100%;
                background-color: #fff
            }
        }
    }
</style>
