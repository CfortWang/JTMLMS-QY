<template>
    <div :class="$style.container">
        <template v-for="(row, rowIndex) in rowData">
            <dv-decoration-10 v-if="rowIndex === 1" :key="`lineOne${rowIndex}`" />
            <div :key="`row${rowIndex}`" :class="$style.row" :style="`width: ${row.length / 4 * 100}%;`">
                <template v-for="(item, index) in row">
                    <div :key="`${rowIndex * 4 + index}`" :class="$style.column" :style="`width: ${1 / row.length * 100}%;`">
                        <div :id="`card${rowIndex * 4 + index}`" />
                    </div>
                    <dv-decoration-2
                        v-if="index !== row.length - 1"
                        :key="`line${rowIndex * 4 + index}`"
                        :reverse="true"
                        :dur="4 + index * 2"
                    />
                </template>
            </div>
            <dv-decoration-10 v-if="rowIndex === 1" :key="`lineTwo${rowIndex}`" />
        </template>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import { monthChartOption } from '../constants/option'
import { monthChartOptionbl } from '../constants/optionbl'

export default {
    name: 'chart',
    components: {},
    props: {
        info: {
            type: Array,
            default: () => []
        },
        fontSize: {
            type: Number,
            default: 18
        },
        chooseYear: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: () => ''
        }
    },
    data () {
        return {}
    },
    computed: {
        rowData () {
            const data = []
            for (let i = 0; i < this.info.length; i += 4) {
                data.push(this.info.slice(i, i + 4))
            }
            return data
        }
    },
    watch: {
        info: {
            handler () {
                this.init()
            },
            deep: true
        }
    },
    created () {},
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const D = new Date()
            // 控制数据显示，历史数据显示整年，本年度数据显示到上一个月
            const y = parseInt(D.toJSON().slice(0, 4))
            const m = parseInt(this.chooseYear) < y ? 12 : parseInt(D.toJSON().split('-')[1]) - 1
            const w = window.innerWidth
            this.fontSize = w >= 1600 ? 20 : w > 1366 && w < 1600 ? 18 : 16
            setTimeout(() => {
                this.info.forEach((item, index) => {
                    // console.log(item)
                    if (this.name !== '病理') {
                        const chart = echarts.init(document.getElementById(`card${index}`))
                        const option = JSON.parse(JSON.stringify(monthChartOption))
                        const xData = item.data.map((i, index) => `${index + 1}月`).slice(0, m)
                        const yData = item.data.map(i => i.result || 0).slice(0, m)
                        const yMax = Math.max(...yData)
                        const yMin = Math.min(...yData)
                        const limit = item.data.map(i => i.limitValue).filter(i => i !== undefined)[0]
                        const limitValue = item.data.map(i => i.originalData).filter(i => i)[0]
                        option.yAxis.max = Math.max(parseFloat(limit), parseFloat(yMax))
                        // option.yAxis.min = Math.min(parseFloat(limit), parseFloat(yMin))
                        // console.log(option.yAxis.max, option.yAxis.min, item.title)
                        // console.log(item.title, yData)
                        option.title.text = item.title
                        option.title.textStyle.fontSize = this.fontSize
                        option.title.subtext = `限值${limitValue.replace(/@/g, '')}`
                        option.xAxis.data = xData
                        option.series[0].data = yData
                        option.series[0].markLine.data[0].yAxis = limit
                        option.series[0].markLine.data[0].label.formatter = limit
                        chart.setOption(option)
                    } else {
                        const chart = echarts.init(document.getElementById(`card${index}`))
                        const option = JSON.parse(JSON.stringify(monthChartOptionbl))
                        const xData = item.data.map((i, index) => `${index + 1}月`).slice(0, m)
                        const yData = item.data.map(i => this.$utils.isEmpty(i.result) ? null : i.result)

                        const limit = item.data.map(i => i.limitValue).filter(i => i !== undefined)[0]
                        const limitValue = item.data.map(i => i.originalData).filter(i => i)[0]

                        option.title.text = item.title
                        option.title.textStyle.fontSize = this.fontSize
                        option.title.subtext = `限值${limitValue.replace(/@/g, '')}`
                        option.xAxis.data = xData
                        option.series[0].data = yData

                        option.series[0].name = item.title
                        const lData = item.data.map(i => this.$utils.isEmpty(i.limitValue) ? null : i.limitValue)
                        option.series[1].data = lData

                        option.series[1].name = '达标标准率'
                        option.legend.data = [item.title, '达标标准率']

                        chart.setOption(option)
                        // console.log(option)
                        // chart.setOption(option)
                    }
                })
            }, 100)
        }
    }
}
</script>
<style lang="scss" module>
    .container {
        width: 96%;
        height: calc(100% - 40px);
        padding: 20px 2%;
        .row {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: calc((100% - 70px) / 3);
            // margin: 15px 0 15px;
            .column {
                width: 24%;
                height: 100%;
                background-color: rgba(6, 30, 93, 0.5);
                > div {
                    width: 100%;
                    height: 100%;
                }
            }
        }
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
    }
</style>
