<template>
    <div class="pieView">
        <div style="  height:14%;line-height:30px;text-align: left;padding-left: 10px;padding-left: 10px;padding-top: 10px; margin-bottom: -50px;color: white;">
            {{ info.title || "" }}
        </div>
        <div style="width: 100%; height: 95%; display: inline-block; overflow: hidden">
            <div id="topRightChart" style="width: 100%; height: 100%; overflow: hidden" />
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        info: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data () {
        return {
            showChart: true,
            option: {
                grid: {
                    x: 50,
                    y: 50,
                    x2: 50,
                    y2: 50
                },
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom: 'bottom',
                    textStyle: {
                        color: '#ffff',
                        fontSize: 12
                    }
                },
                tooltip: {},
                dataset: {
                    source: [
                        ['product', '2015', '2016', '2017'],
                        ['Matcha Latte', 43.3, 85.8, 93.7],
                        ['Milk Tea', 83.1, 73.4, 55.1],
                        ['Cheese Cocoa', 86.4, 65.2, 82.5],
                        ['Walnut Brownie', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: { type: 'category' },
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [{ barMaxWidth: 30, type: 'bar' }, { barMaxWidth: 30, type: 'bar' }, { barMaxWidth: 30, type: 'bar' }, { barMaxWidth: 30, type: 'bar' }]
            }

        }
    },
    watch: {
        info: {
            handler (newVal, oldVal) {
                this.getMiddleLeft()
            },
            deep: true
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
            this.option.dataset.source = this.info.numArr
            const chartDom = document.getElementById(this.info.id)
            var myChart = echarts.init(chartDom)
            setTimeout(() => {
                myChart.setOption(this.option)
            }, 500)
        }
    }
}
</script>
<style lang="scss" scoped>
.pieView {
width: 100%;
height: 100%;
overflow: hidden;
background-color: rgba(6, 30, 93, 0.5);
}
</style>
