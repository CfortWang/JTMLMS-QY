<template>
    <div>
        <el-dialog
            center
            append-to-body
            title="数据统计"
            :visible.sync="dialogVisible"
            width="80%"
            top
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <div class="chart">
                <div class="chart1">
                    <div id="echart1" style="width: 1000px;height:420px;" />

                </div>
                <div class="chart2">
                    <div id="echart2" style="width: 1000px;height:420px;" />
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    props: {
        departmentData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            dialogVisible: false
        }
    },
    watch: {
        departmentData () {
            if (this.departmentData.length) {
                this.$nextTick(() => {
                    console.log(this.departmentData)
                    const echart1 = echarts.init(document.getElementById('echart1'))
                    const echart2 = echarts.init(document.getElementById('echart2'))
                    const option1 = this.formatData1()
                    const option2 = this.formatData2()
                    echart1.setOption(option1)
                    echart2.setOption(option2)
                    echart1.resize({ width: 1000, height: 420 })
                    echart2.resize({ width: 1000, height: 420 })
                })
            }
        }
    },
    methods: {
        open () {
            this.dialogVisible = true
        },
        close () {
            this.dialogVisible = false
        },
        formatData1 () {
            const xAxisData = this.departmentData.map(item => item.department)
            const seriesData = [
                {
                    name: '应参考人数',
                    type: 'bar',
                    data: this.departmentData.map(item => item.plannedAttendees)
                },
                {
                    name: '实参考人数',
                    type: 'bar',
                    data: this.departmentData.map(item => item.actualAttendees)
                },
                {
                    name: '参考率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.departmentData.map(item => (item.joinRate * 100).toFixed(2)),
                    label: {
                        show: true,
                        color: '#1f1f1f',
                        fontSize: 12,
                        formatter: '{c}%'
                    }
                }
            ]

            return {
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 200
                    }
                ],
                title: {
                    text: '各部门参考人数信息统计'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['应参考人数', '实参考人数', '参考率']
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        rotate: 20
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '人数',
                        axisLabel: {
                            formatter: '{value}'
                        },
                        minInterval: 1 // 人数最少为1 不能为小数
                    },
                    {
                        type: 'value',
                        name: '参考率 (%)',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: seriesData
            }
        },
        formatData2 () {
            const xAxisData = this.departmentData.map(item => item.department)
            const seriesData = [
                {
                    name: '最高分',
                    type: 'bar',
                    data: this.departmentData.map(item => item.maxScore)
                },
                {
                    name: '最低分',
                    type: 'bar',
                    data: this.departmentData.map(item => item.minScore)
                },
                {
                    name: '平均分',
                    type: 'bar',
                    data: this.departmentData.map(item => item.avgScore.toFixed(2))
                },
                {
                    name: '合格率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.departmentData.map(item => (item.passRate * 100).toFixed(2)),
                    label: {
                        show: true,
                        color: '#1f1f1f',
                        fontSize: 12,
                        formatter: '{c}%'
                    }
                }
            ]

            return {
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 200
                    }
                ],
                title: {
                    text: '各部门成绩信息统计'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['最高分', '最低分', '平均分', '合格率']
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    axisLabel: {
                        rotate: 20
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '分数',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '合格率 (%)',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: seriesData
            }
        }
    }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: center;
}
.chart {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
  width: 100%;
  // height: 60vh;
  .chart1,
  .chart2 {
    display: flex;
    justify-content: center;
    margin: 10px 0 10px 0;
  }
  .chart1 {
    margin-bottom: 60px;
  }
}
</style>
