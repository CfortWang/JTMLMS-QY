<template>
    <div class="echart" style="width:100%">
        <div class="pie" style="width: 50%;height:420px;">
            <div ref="echart1" style="width: 100%;height:100%;" />
        </div>
        <div class="bar" style="width: 50%;height:420px;">
            <div ref="echart2" style="width: 100%;height:100%" />
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        statisItemData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {

        }
    },
    mounted () {
        const echart1 = echarts.init(this.$refs.echart1)
        const echart2 = echarts.init(this.$refs.echart2)
        const option1 = this.formatData1()
        const option2 = this.formatData2()
        echart1.setOption(option1)
        echart2.setOption(option2)
        echart1.resize()
        echart2.resize()
    },
    methods: {
        formatData1 () {
            let t = {}
            const data = []
            if (this.statisItemData[0].xuan_xiang_) {
                t = JSON.parse(this.statisItemData[0].xuan_xiang_)
                let cnt = 1
                for (const key in t) {
                    data.push({
                        value: this.statisItemData.filter(item => item.da_an_.includes(key)).length,
                        name: `选项${cnt}`
                    })
                    cnt++
                }
            }
            return {
                title: {
                    // text: this.statisItemData[0].ti_gan_,
                    subtext: this.statisItemData[0].ti_gan_,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        // name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        },
        formatData2 () {
            let t = {}
            const data = []
            if (this.statisItemData[0].xuan_xiang_) {
                t = JSON.parse(this.statisItemData[0].xuan_xiang_)
                let cnt = 1
                for (const key in t) {
                    data.push({
                        value: this.statisItemData.filter(item => item.da_an_.includes(key)).length,
                        name: `选项${cnt}`
                    })
                    cnt++
                }
            }
            return {
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    type: 'category',
                    name: '选项',
                    data: data.map(item => item.name)
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    minInterval: 1
                },
                series: [
                    {
                        data: data.map(item => item.value),
                        type: 'bar',
                        barWidth: 30
                    }
                ]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .echart{
        display: flex;
        justify-content: center;
    }
</style>
