<template>
    <div class="pieView">
        <div style="height:10%;line-height:30px;text-align: left;padding-left: 10px;padding-top: 10px; margin-bottom: -50px; color: white;">
            {{ info.title || "" }}
        </div>
        <div style="width: 100%; height: 95%; display: inline-block; overflow: hidden">
            <div :id="info.id" style="width: 100%; height: 100%; overflow: hidden;padding-right: 10px;" />
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
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { show: true, readOnly: false,
                            optionToContent: function (opt) {
                                var axisData = opt.xAxis[0].data// x轴作为条件，y轴需改成yAxis[0].data;
                                var series = opt.series
                                var tdHeads = '<td  style="padding:0 10px">年份</td>'
                                series.forEach(function (item) {
                                    tdHeads += '<td style="padding: 0 10px">' + item.name + '</td>'
                                })
                                var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center;color:#666"><tbody><tr>' + tdHeads + '</tr>'
                                var tdBodys = ''
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                    for (var j = 0; j < series.length; j++) {
                                        if (typeof (series[j].data[i]) === 'object') {
                                            tdBodys += '<td>' + series[j].data[i].value + '</td>'
                                        } else {
                                            tdBodys += '<td>' + series[j].data[i] + '</td>'
                                        }
                                    }
                                    table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>'
                                    tdBodys = ''
                                }
                                table += '</tbody></table>'
                                return table
                            }
                        },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    },
                    iconStyle: {
                        borderColor: 'white'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom: 'bottom',
                    data: [],
                    textStyle: {
                        color: '#ffff',
                        fontSize: 12
                    }

                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '个数',
                        min: 0,
                        // max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '百分比',
                        min: 0,
                        max: 100,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        barMaxWidth: 30,
                        name: '',
                        type: 'line',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' %'
                            }
                        },
                        data: []
                    },
                    {
                        barMaxWidth: 30,
                        name: '',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value
                            }
                        },
                        data: []
                    },
                    {
                        barMaxWidth: 30,
                        name: '',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value
                            }
                        },
                        data: []
                    }

                ]
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
            this.option.xAxis[0].data = this.info.yearArr
            if (this.info.id === 'botLeftChart') {
                this.option.legend.data = ['不合格率', '项目总数', '不合格项目数']
                this.option.series[1].name = '项目总数'
                this.option.series[2].name = '不合格项目数'
                this.option.series[0].name = '不合格率'
                this.option.series[0].data = this.info.result3
                this.option.series[1].data = this.info.result1
                this.option.series[2].data = this.info.result2
            }
            if (this.info.id === 'botMiddChart') {
                this.option.legend.data = ['参加率', '检验项目总数', '室间质控项目数']
                this.option.series[1].name = '检验项目总数'
                this.option.series[2].name = '室间质控项目数'
                this.option.series[0].name = '参加率'
                this.option.series[0].data = this.info.list3
                this.option.series[1].data = this.info.list1
                this.option.series[2].data = this.info.list2
            }
            if (this.info.id === 'botRightChart') {
                this.option.legend.data = ['比对率', '无室间质评计划项目数', '室间比对项目数']
                this.option.series[1].name = '无室间质评计划项目数'
                this.option.series[2].name = '室间比对项目数'
                this.option.series[0].name = '比对率'
                this.option.series[0].data = this.info.data3
                this.option.series[1].data = this.info.data1
                this.option.series[2].data = this.info.data2
            }

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
