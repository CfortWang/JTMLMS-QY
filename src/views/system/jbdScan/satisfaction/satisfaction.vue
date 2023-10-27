<template>
    <div>
        <el-dialog
            :title="`满意度统计（时间范围：${generalList[0].kai_shi_shi_jian_} - ${generalList[0].jie_shu_shi_jian_}）`"
            :visible.sync="generalShow"
            width="80%"
            top="0"
            append-to-body
            custom-class="customClass"
            @close="close"
        >
            <div>
                <div class="topBorder">
                    <div ref="Echart" class="chart" />
                </div>
                <div class="centerBorder">
                    <div class="cenSin" style="border-right: 1px solid #ccc">
                        <div v-if="show1" ref="Echart1" class="chart" />
                        <div v-else class="chart">
                            <div class="chartName" style="color: #00c16e">住院患者</div>
                            <div class="chartA">
                                暂无数据
                            </div>
                        </div>

                    </div>
                    <div class="cenSin">
                        <div v-if="show2" ref="Echart2" class="chart" />
                        <div v-else class="chart">
                            <div class="chartName" style="color: #d20962">门诊患者</div>
                            <div class="chartA">
                                暂无数据
                            </div>
                        </div>
                    </div>
                </div>
                <div class="centerBorder">
                    <div class="cenSin" style="border-right: 1px solid #ccc">
                        <div v-if="show3" ref="Echart3" class="chart" />
                        <div v-else class="chart">
                            <div class="chartName" style="color: #0cb9c1">医务人员</div>
                            <div class="chartA">
                                暂无数据
                            </div>
                        </div>
                    </div>
                    <div class="cenSin">
                        <div v-if="show4" ref="Echart4" class="chart" />
                        <div v-else class="chart">
                            <div class="chartName" style="color: #7552cc">员工</div>
                            <div class="chartA">
                                暂无数据
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import satisfactionJS from './satisfactionJS'
export default {
    mixins: [satisfactionJS],
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
            id: ''
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
    methods: {
        close () {
            this.$emit('generalClose', false)
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .customClass .el-dialog__header{
    border-bottom: none;
}
/deep/ .customClass .el-dialog__footer{
    border-top: none;
}

.topBorder{
    // border-bottom: 1px solid #ccc;
}
.chart{
    width: 100%;
    height: 300px;
}
.centerBorder{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    .cenSin{
        width: 48%;
    }
}
.chartA{
    display: flex;
    align-items: center;
    justify-content: center;
}

.chartName{
    text-align: center;
    font-size: 20px;
    padding: 15px 0;
    font-weight: bold;
}
</style>
