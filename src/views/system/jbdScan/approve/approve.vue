<template>
    <div>
        <el-dialog
            title="核查计划进度情况"
            :visible.sync="generalShow"
            width="80%"
            top="0"
            append-to-body
            custom-class="customClass"
            @close="close"
        >
            <div>
                <div class="step">
                    <el-steps :active="activeIndex" finish-status="success" align-center>
                        <el-step v-for="(item,index) in stepList" :key="index" :title="item.title" :description="item.post" @click.native="activeClick(index + 1)" />
                    </el-steps>
                </div>
                <div class="stopCenter">
                    <div>
                        <div class="tableTop">
                            <el-alert
                                title="核查进度率"
                                type="success"
                                :description="description"
                                :closable="false"
                            />
                        </div>
                        <div style="display: flex;justify-content: space-between;width: 100%;">
                            <!-- <div v-if="activeIndex != 5" style="width: 100%">
                                <div ref="Echart" class="chart" />
                            </div>
                            <div v-if="activeIndex == 5" style="width:40%;position: relative;">
                                <div ref="Echart" class="chart" />
                            </div>
                            <div v-if="activeIndex == 5" style="width: 60%;position: relative;">
                                <div ref="Echart2" class="chart" />
                            </div> -->
                            <div style="width:40%;position: relative;">
                                <div ref="Echart" class="chart" />
                            </div>
                            <div style="width: 60%;position: relative;">
                                <div ref="Echart2" class="chart" />
                            </div>

                        </div>

                    </div>
                </div>
                <div v-if="activeIndex == 5" class="tableLin">
                    <div class="tableTop">
                        <el-alert
                            title="不符合条款清单"
                            type="success"
                            :closable="false"
                        />
                    </div>
                    <div>
                        <appComOne ref="appBuCom" :click-index="7" :table-data="buTableData" :type="false" />
                    </div>
                </div>
                <div class="tableLin">
                    <div class="tableTop">
                        <el-alert
                            :title="getIndexName(clickIndex)"
                            type="success"
                            :closable="false"
                        />
                    </div>
                    <div>
                        <appComOne ref="appCom" :type="true" :general-list="generalList" :click-index="clickIndex" :active-index="activeIndex" :table-data="tableData" />
                    </div>
                </div>
                <div v-if="activeIndex != 5" class="tyongj">
                    暂无不符合项统计，请等待本次认可准则条款确认结束后统计
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import approveJS from './approveJS'
import appComOne from './compnent/appComOne'
export default {
    components: { appComOne },
    mixins: [approveJS],
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
            clickIndex: 2,
            activeIndex: 5,
            stepList: [
                {
                    stepIndex: 11,
                    title: '计划编制',
                    post: '质量负责人'
                },
                {
                    stepIndex: 22,
                    title: '实施计划编制',
                    post: '组长'
                },
                {
                    stepIndex: 33,
                    title: '条款核查',
                    post: '组员'
                },
                {
                    stepIndex: 44,
                    title: '实施计划审核',
                    post: '组长'
                },
                {
                    stepIndex: 55,
                    title: '结果确认',
                    post: '质量负责人'
                }
            ],
            tableData: [],
            description: `核查计划项目进度计分：'待分配'计1分, '待核查'计2分, '待审核'计3分, '待确认'计4分, '已结束'计5分，核查进度率 = 各项计划项目进度计分之和 / 计划项目总数 / 5 * 100`,
            buTableData: [],
            show1: false,
            show2: false,
            innerWidth
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
        this.getPosition()
        this.id = this.generalList[0].id_
        this.getJiHuaZhuangTai(this.id)
        this.innerWidth = window.innerWidth / 2
    },
    methods: {
        close () {
            this.$emit('generalClose', false)
        },
        activeClick (index) {
            if (this.activeIndex < index - 1) {
                return this.$message.error('任务进度没到，请点击其他节点切换')
            }
            this.getShiShiData(this.id)
            this.$refs.appCom.switchWatch(index)
            this.clickIndex = index
        },
        getIndexName (index) {
            const name = this.stepList[this.clickIndex - 1 === 5 ? 4 : this.clickIndex - 1].title || ''
            return name
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
.step{
    position: relative;
    margin: 20px 30px;
}
.tableLin{
    margin: 0 30px 20px 30px;
}
.stopCenter{
    margin: 0 30px 20px 30px;
}
.tableTop{
    margin-bottom: 10px;
}
.chart{
    width: 100%;
    height: 300px;
}

.tyongj{
    color: #606266;
    margin: 20px auto;
    text-align: center;
    font-size: 16px;
}

.buFuHu{
    display: flex;
    justify-content: space-between;
    margin: 20px 30px;
    .buLeft{
        width: 100%;

        .textLeft{
            color: #606266;
            margin-bottom: 20px;
        }
    }
}
</style>
