<template>
    <div class="pieView">
        <div style="  height:14%;line-height:30px;text-align: left;padding-left: 10px;color: white;">
            {{ info.config.title || "" }}
        </div>
        <div v-show="showChart" style="width: 100%; height: 86%; display: inline-block; overflow: hidden">
            <div :id="info.config.idSelector" style="width: 100%; height: 95%; overflow: hidden" />
        </div>
        <div v-if="!showChart" style="background: #061237;width: 100%;height: 70%;display: flex;justify-content: center;align-items: center;">
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
            showChart: true
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
            const chartDom = document.getElementById(this.info.config.idSelector)
            var myChart = echarts.init(chartDom)
            const radius = window.innerWidth > 1600 ? '60%' : '45%'
            const inData = this.info.data
            let num = 0
            for (const i in inData) {
                num += inData[i].value
            }
            // eslint-disable-next-line eqeqeq
            if (num == 0) {
                this.showChart = false
            } else {
                this.showChart = true
            }
            var option
            option = {
                title: {
                    show: true,
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: '600'
                    }
                },
                color: this.info.color,
                tooltip: {
                    trigger: 'item',
                    formatter: '{d}%'
                },
                label: {
                    formatter: '{b}\n{c}，{d}%',
                    edgeDistance: '20%'
                },

                legend: {
                    show: true,
                    // orient: 'vertical',
                    itemGap: 6,
                    z: 3,
                    left: 'left',
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: ['50%', '60%'],
                        data: this.info.data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            distanceToLabelLine: 0
                        }
                    }
                ]
            }
            myChart.setOption(option)
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
