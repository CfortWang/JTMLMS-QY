<template>
    <div class="pieView">
        <div style="  height:12%;line-height:30px;text-align: left;padding-left: 10px;color: white;">
            {{ info.config.title || "" }}
        </div>
        <div style="width: 100%; height: 86%; display: inline-block; overflow: hidden">
            <div :id="info.config.idSelector" style="width: 100%; height: 95%; overflow: hidden" />
        </div>
        <!-- <div v-if="!showChart" style="background: #061237;width: 100%;height: 70%;display: flex;justify-content: center;align-items: center;">
          <div style="color: #c7c7c7">目前无数据</div>
      </div> -->
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        info: {
            type: Object,
            default: function () {
                return {
                }
            }
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
            const radius = window.innerWidth > 1600 ? '55%' : '45%'
            const inData = this.info.data
            let num = 0
            for (const i in inData) {
                num += inData[i].value
            }
            if (num === 0) {
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
                    formatter: ''
                },
                label: {
                    formatter: function (name) {
                        const text = name.name
                        let result = ''// 拼接加\n返回的类目项
                        const maxLength = 7// 每项显示文字个数
                        const valLength = text.length// X轴类目项的文字个数
                        const rowNumber = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                        if (rowNumber > 1) { // 如果文字大于3,
                            for (let i = 0; i < rowNumber; i++) {
                                let temp = ''// 每次截取的字符串
                                const start = i * maxLength// 开始截取的位置
                                const end = start + maxLength// 结束截取的位置
                                temp = text.substring(start, end) + (i === rowNumber - 1 ? '' : '\n')
                                result += temp // 拼接生成最终的字符串
                            }
                            return result + '(' + name.percent + '%)'
                        } else {
                            return text + '(' + name.percent + '%)'
                        }
                    },
                    edgeDistance: '20%',
                    color: '#fff',
                    fontSize: '12px'
                },
                legend: {
                    show: this.info.hasOwnProperty('legend') ? this.info.legend : true,
                    // show: true,
                    // orient: 'vertical',
                    itemGap: 6,
                    z: 3,
                    // type: this.info.hasOwnProperty('legend') && this.info.legend === false ? 'scroll' : 'plain',
                    // orient: this.info.hasOwnProperty('legend') && this.info.legend === false ? 'vertical' : 'horizontal',
                    // left: this.info.hasOwnProperty('legend') && this.info.legend === false ? 'left' : 'center',
                    textStyle: {
                        color: '#fff'
                    },
                    // pageIconColor: '#fff',
                    // pageIconInactiveColor: '#fff',
                    // pageTextStyle: {
                    //     color: '#fff'
                    // },
                    formatter: function (name) {
                        const text = name
                        let result = ''// 拼接加\n返回的类目项
                        const maxLength = 5// 每项显示文字个数
                        const valLength = text.length// X轴类目项的文字个数
                        const rowNumber = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                        if (rowNumber > 1) { // 如果文字大于3,
                            for (var i = 0; i < rowNumber; i++) {
                                let temp = ''// 每次截取的字符串
                                const start = i * maxLength// 开始截取的位置
                                const end = start + maxLength// 结束截取的位置
                                temp = text.substring(start, end) + '\n'
                                result += temp // 拼接生成最终的字符串
                            }
                            return result
                        } else {
                            return text
                        }
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: this.info.hasOwnProperty('legend') && this.info.legend === false ? ['50%', '40%'] : ['50%', '50%'],
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
