<template>
    <div>
        <el-dialog
            :title="generalData.title || '计划进度'"
            :visible.sync="generalShow"
            width="80%"
            top="5vh"
            append-to-body
            :center="generalData.titleCenter || false"
            custom-class="customClass"
            @close="close"
        >
            <div class="stopCenter">
                <div v-if="generalData.alertShow" class="tableTop">
                    <el-alert
                        :title="generalData.alert.title || ''"
                        type="success"
                        :description="generalData.alert.description || ''"
                        :closable="false"
                    />
                </div>

                <el-row>
                    <el-col :span="6">
                        <div :style="{ height: height + 'px'}">
                            <div ref="chart1" class="chart" />
                        </div>

                    </el-col>
                    <el-col :span="18">
                        <div id="chart2" ref="chart2" class="chart2" :style="{ height: height + 'px'}" />
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import planImplementationJS from './planImplementationJS'
export default {
    mixins: [planImplementationJS],
    props: {
        show: {
            type: Boolean,
            default: false
        },
        generalList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            generalShow: this.show,
            id: '',
            generalData: {
                title: '', // 弹出框标题
                titleCentr: false, // 弹出框标题是否区中
                alertShow: false, // 提示是否显示
                alert: {
                    title: '', // 提示标题
                    description: '' // 提示内容
                },
                leftData: {
                    leftTotal: 0, // 左图数量
                    title: '' // 左图标题，默认"完成率"
                },
                rightCustomShow: false, // 右图自定义
                rightData: {
                    title: '人数', // 右图标题
                    xAxisName: '', // 右图x轴标题
                    yAxisName: '', // 右图y轴标题
                    yAxisData: ['金源信通'], // 右图y轴项
                    series: [{
                        name: '总数', // 右图x轴项
                        data: [''], // 右图x轴数量
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: { // 数值样式
                                color: 'black',
                                fontSize: 12
                            },
                            formatter: (params) => {
                                // 这个回调函数不起作用了
                                return params.value === '0' ? '' : params.value
                            }

                        }
                    }],
                    color: ['rgb(55, 162, 218)', 'rgb(103, 224, 227)', 'rgb(253, 102, 109)'], // 颜色
                    tooltip: { // 右图弹出框
                        show: true,
                        trigger: 'axis'
                    }
                }
            },
            height: 300
        }
    },
    watch: {
        show: {
            handler () {
                // this.generalShow = this.show
            },
            deep: true,
            immediate: true
        }
    },
    created () {
        this.generalData = this.generalList[0]
        const height = this.generalData.rightData.yAxisData.length * 100
        this.height = height > 300 ? height : 300

        setTimeout(() => {
            this.getOption(this.generalData.leftData)
            this.barDataPlan(this.generalData.rightData, this.generalData.rightCustomShow)
        }, 100)
    },
    methods: {
        close () {
            this.$emit('generalClose', false)
        }
    }
}
</script>

<style  scoped>
.stopCenter{
    max-height: 800px;
    margin: 20px 30px 20px 30px;
}

.tableTop{
    margin: 0 0 10px 0;
}

.chart{
    width: 100%;
    height: 300px;
}

.chart2{
    width: 100%;
    min-height: 300px;
}
</style>
