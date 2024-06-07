<template>
    <div class="info-container">
        <div class="chart info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>图表</span>
            </div>
            <div class="chart-container">
                <el-row :gutter="20" class="form-row">
                    <el-col v-for="(chart, index) in chartData" :key="index" :xl="12" :lg="12" :md="24">
                        <div :id="chart.id" class="chart-item" />
                        <div class="note">{{ chart.note }}</div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts/core'
import {
    DatasetComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    TransformComponent,
    MarkLineComponent
} from 'echarts/components'
import { ScatterChart, LineChart } from 'echarts/charts'
import { UniversalTransition, LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import ecStat from 'echarts-stat'

echarts.use([
    DatasetComponent,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    MarkLineComponent,
    TransformComponent,
    ScatterChart,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
    LabelLayout
])
echarts.registerTransform(ecStat.transform.regression)
import { LROption, SPOption } from '../constants/options'

export default {
    props: {
        chartData: {
            type: Array,
            default: () => []
        }
    },
    watch: {
        chartData: {
            handler (val) {
                this.initChart()
            },
            deep: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    methods: {
        initChart () {
            // console.log(LROption, SPOption)
            this.chartData.forEach(item => {
                const chart = echarts.init(document.getElementById(item.id))
                console.log(item.option)
                // const option = JSON.parse(item.option)
                // eslint-disable-next-line no-eval
                const option = eval('(' + item.option + ')')
                option.title.text = item.title
                option.grid = option.grid || {
                    left: '8%',
                    right: '4%',
                    bottom: '6%',
                    top: '12%',
                    containLabel: true
                }
                chart.setOption(option)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .chart {
            .chart-container {
                .form-row {
                    display: flex;
                    flex-wrap: wrap;
                    > *:only-child {
                        margin: 0 auto;
                    }
                    .chart-item {
                        height: 300px;
                        width: 100%;
                    }
                    .note {
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
