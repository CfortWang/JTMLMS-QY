<template>
    <div class="pieView">
        <div style="height: 10%;line-height: 30px;text-align: left;padding-left: 6px;width: 100%;">
            {{ info.config.title }}
        </div>
        <div v-show="showChart" style="width:100%;height:90%;display: inline-block;">
            <div :id="info.config.idSelector" style="width:100%;height:100%;" />
        </div>
        <div v-if="!showChart" style="background: #061237;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">
            <div style="color: #c7c7c7">目前无数据</div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        info: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {}
        }
    },
    data () {
        return {
            yAxisNum: 1,
            showChart: true
        }
    },
    mounted () {
        const this_ = this
        this.$nextTick(() => {
            this_.getMiddleLeft()
        })
    },
    methods: {
        getMiddleLeft () {
            const this_ = this
            const series = []
            if (this_.info.data.source[0] === 999) {
                this.showChart = false
                return
            }
            for (const item of this.info.config.colors) {
                series.push({
                    type: 'bar',
                    color: item,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff'
                    }
                })
            }
            var chartDom = document.getElementById(this.info.config.idSelector)
            var myChart = echarts.init(chartDom)
            let interval = 7
            if (this_.info.config.idSelector === 'eqFinish') {
                let max = 0
                this_.info.data.source.forEach(item => {
                    if (item.设备总数 > max) {
                        max = item.设备总数
                    }
                })
                if (max < 7) {
                    interval = 1
                } else {
                    interval = Math.ceil((parseInt(max / 7) / 10)) * 10
                }
            }
            if (this_.info.config.idSelector === 'eqWeihu') {
                let jihuamax = 0
                let wanchengmax = 0
                let max = 0
                this_.info.data.source.forEach(item => {
                    if (item.计划数 > max) {
                        jihuamax = item.计划数
                    }
                })
                this_.info.data.source.forEach(item => {
                    if (item.完成数 > wanchengmax) {
                        wanchengmax = item.完成数
                    }
                })
                max = wanchengmax > jihuamax ? wanchengmax : jihuamax
                if (max < 7) {
                    interval = 1
                } else {
                // interval = parseInt(max / 7)
                    interval = Math.ceil((parseInt(max / 7)))
                }
            }
            const option = {
                legend: {
                    left: 'left',
                    textStyle: {
                        color: '#fff'
                    }
                },
                grid: { // 让图表占满容器
                    top: '40px',
                    left: '65px',
                    right: '60px',
                    bottom: '40px'
                },
                tooltip: {},
                dataset: {
                    dimensions: this_.info.data.dimensions,
                    source: this_.info.data.source
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        color: '#fff',
                        interval: 0,
                        rotate: 20
                    }
                },
                yAxis: {
                    axisLabel: {
                        color: '#fff'

                    },
                    interval: interval
                },
                series: series
            }
            myChart.setOption(option)
        }
    }
}
</script>
<style lang="scss" scoped>
.pieView {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: rgba(6,30,93,.5);
}
</style>
