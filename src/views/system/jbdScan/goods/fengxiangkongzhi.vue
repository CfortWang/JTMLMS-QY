<template>
    <div class="bg">
        <el-dialog width="70vw" height="50vh" :modal-append-to-body="false" title="风险评估进度查询" :visible.sync="scan">
            <!-- 表单是否显示 -->
            <div style="height: 75vh; width: 98%">
                <div id="box">
                    <div class="overall">
                        <!-- 步骤条盒子 -->
                        <div class="steps-box">
                            <div class="Article-steps">
                                <!-- 步骤条背景进度条 -->
                                <div class="line">
                                    <span class="plan" :style="`width:${activeIndex * (100 / (stepList.length - 1)) -100 / (stepList.length - 1) / 2}%`" />
                                </div>
                                <!-- 每步部分底部文字描述 -->
                                <span v-for="(i, index) in stepList" :key="index" class="step" :class="(i.stepIndex < activeIndex || activeIndex == 100? 'step-active': (i.stepIndex == activeIndex ? 'current-active':''))">
                                    <span class="step-num">
                                        <i v-if="index != 0" class="el-icon-caret-right icon" />
                                        <p cla>{{ i.title }}</p>
                                    </span>
                                    <p class="post">{{ i.post }}</p>
                                </span>
                            </div>
                            <!-- 步骤条对应内容 -->
                            <div class="Article-content" />
                        </div>
                    </div>
                </div>
                <template>
                    <el-tabs v-model="activeName" class="count" @tab-click="handleClick">
                        <el-tab-pane label="风险等级统计表" name="first">
                            <div v-show="riskLeveChange" style="width: 50%;">
                                <tableCom :table-prop="RiskLevelProp" :table-list="RiskLevelList" />
                            </div>
                            <div v-show="!riskLeveChange" style="width: 45%; height:350px">
                                <div id="idSelector1" style="width: 300px; height: 300px; margin:0 auto" />
                                <PieView ref="firstPieView" :info="riskLevePieView" />
                            </div>
                            <div v-show="RiskLevelList.length" class="change" @click="changeFn('first')">切换 <i class="el-icon-refresh" /></div>
                        </el-tab-pane>
                        <el-tab-pane label="涉及条款统计表" name="second"><tableCom :table-prop="[]" :table-list="[]" :table-with="50" /></el-tab-pane>
                        <el-tab-pane label="责任部门统计表统计表" name="third"><tableCom :table-prop="[]" :table-list="[]" /></el-tab-pane>
                        <el-tab-pane label="风险应对措施统计表" name="fourth">
                            <div v-show="riskReChange" style="width: 50%;">
                                <tableCom :table-prop="riskReProp" :table-list="riskReList" />
                            </div>
                            <div v-show="!riskReChange" style="width: 45%; height:350px">
                                <div id="idSelector2" style="width: 300px; height: 300px; margin:0 auto" />
                                <PieView ref="riskRePieView" :info="riskRePieView" />
                            </div>
                            <div v-show="riskReList.length" class="change" @click="changeFn('fourth')">切换 <i class="el-icon-refresh" /></div>
                        </el-tab-pane>
                        <el-tab-pane label="剩余风险等级统计表" name="fine">
                            <div v-show="riskReChange" style="width: 50%;">
                                <tableCom :table-prop="riskReProp" :table-list="riskReList" />
                            </div>
                            <div v-show="!riskReChange" style="width: 45%; height:350px">
                                <div id="idSelector2" style="width: 300px; height: 300px; margin:0 auto" />
                                <PieView :info="riskRePieView" />
                            </div>
                            <div v-show="riskReList.length" class="change" @click="changeFn('fine')">切换 <i class="el-icon-refresh" /></div>
                        </el-tab-pane>
                        <el-tab-pane label="降低风险登记表表" name="six"><tableCom :table-prop="[]" :table-list="[]" :table-with="50" /></el-tab-pane>
                    </el-tabs>
                </template>
                <div>
                    <div class="tableTitle">风险识别评估</div>
                    <tableCom :table-prop="RiskIdenProp" :table-list="RiskIdenList" :page-show="true" />
                    <div v-if="pageShow" class="block">
                        <el-pagination
                            :current-page="currentPage"
                            :page-sizes="[15, 20, 50, 100]"
                            :page-size="15"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        />
                    </div>
                </div>
                <div>
                    <div class="tableTitle">部门风险改进记录</div>
                    <tableCom :table-prop="ImproRecordsProp" :table-list="ImproRecordsList " :control-schedule="true" :page-show="true" />
                </div>

            </div>

        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import tableCom from '../../jbdHome/board/component/tableCom.vue'
import PieView from '../../jbdHome/board/component/fengxianPie.vue'
export default {
    components: { tableCom, PieView },
    filters: {
    },
    props: {
        obj: {
            type: Array
        },
        scanVisible: {
            type: Boolean
        }
    },
    data () {
        return {
            value: '',
            zongid: '',
            deptList: [],
            userList: [],
            visible: true,
            jieduanValue: 0,
            // 当前位置
            activeIndex: 20,
            // 步骤条步数
            stepList: [
                {
                    stepIndex: 20,
                    title: '评估计划'
                    // post: '质量负责人'
                },
                {
                    stepIndex: 40,
                    title: '实施计划'
                    // post: '内审组长'
                },
                {
                    stepIndex: 60,
                    title: '项目登记'
                    // post: '内审员'
                },
                {
                    stepIndex: 80,
                    title: '风险改进'
                    // post: '内审组长'
                },
                {
                    stepIndex: 100,
                    title: '风险报告'
                    // post: '内审员'
                }
            ],
            loading: true,
            scan: true,
            activeName: 'first',
            tableProp: [],
            tableList: [],
            RiskIdenList: [],
            RiskIdenProp: [],
            ImproRecordsList: [],
            ImproRecordsProp: [],
            RiskLevelList: [],
            RiskLevelProp: [],
            riskLevePieView: {},
            riskLeveChange: true,
            riskReList: [],
            riskReProp: [],
            riskRePieView: {},
            riskReChange: true
        }
    },
    watch: {
        obj (newVal, oldVal) {
            alert('obj')
            this.zongid = newVal[0].id_
            this.getInits()
        },
        activeName (newVal, oldVal) {
            if (newVal === 'first') {
                this.getRiskLevel()
            } else if (newVal === 'second') {
                this.getClauseStatistics()
            } else if (newVal === 'third') {
                this.getDepartmentStatistics()
            } else if (newVal === 'fourth') {
                this.getRiskResponse()
            }
        }
    },
    created () {
        this.zongid = this.obj[0].id_
        alert('created')
        this.getInits()
    },
    mounted () {
        const this_ = this
    },
    destroyed () {
        this.$destroy()
    },
    methods: {
        changeFn (type) {
            if (type === 'first') {
                this.riskLeveChange = !this.riskLeveChange
                this.$refs.firstPieView.getMiddleLeft('idSelector1')
            } else if (type === 'fourth') {
                this.riskReChange = !this.riskReChange
                this.$refs.riskRePieView.getMiddleLeft('idSelector2')
            }
        },
        findDept (depId) {
            const dept = this.deptList.find(i => i.positionId === depId)
            return dept.positionName
        },
        findUser (userId) {
            const user = this.userList.find(i => i.userId === userId)
            return user.userName
        },
        FindImprovementRecords (guo_shen_) {
            if (guo_shen_ === '未编制') {
                return 0
            } else if (guo_shen_ === '已编制') {
                return 25
            } else if (guo_shen_ === '已评估') {
                return 50
            } else if (guo_shen_ === '已审核') {
                return 75
            } else if (guo_shen_ === '已完成') {
                return 100
            }
        },
        getInits () {
            this.getRiskLevel() // 风险等级
            this.getRiskIdentification()// 风险识别评估表
            this.getImprovementRecords()// 风险改进记录
            this.scan = this.scanVisible
            this.userList = this.$store.getters.userList
            this.deptList = this.$store.getters.deptList
        },
        handleClick (tab, event) {
            // console.log(tab, event)
        },
        // 风险等级
        async getRiskLevel () {
            const sql1 = `select COUNT(a.feng_xian_deng_ji) AS total FROM t_fxsbpgbzb AS a,t_fxsbpgb AS b WHERE a.parent_id_ = b.id_ AND a.feng_xian_deng_ji = '低风险'`
            const sql2 = `select COUNT(a.feng_xian_deng_ji) AS total FROM t_fxsbpgbzb AS a,t_fxsbpgb AS b WHERE a.parent_id_ = b.id_ AND a.feng_xian_deng_ji = '中风险'`
            const sql3 = `select COUNT(a.feng_xian_deng_ji) AS total FROM t_fxsbpgbzb AS a,t_fxsbpgb AS b WHERE a.parent_id_ = b.id_ AND a.feng_xian_deng_ji = '高风险'`
            let list1, list2, list3
            await Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2), this.$common.request('sql', sql3)]).then((res) => {
                list1 = res[0].variables.data[0]
                list2 = res[0].variables.data[0]
                list3 = res[0].variables.data[0]
            })
            console.log(list1, 111)
            const total = parseInt(list1.total) + parseInt(list2.total) + parseInt(list3.total)
            const gao = list1.total
            const gao_zhan_bi_ = parseFloat(gao / total * 100).toFixed(2) + '%'
            const zhong = list2.total
            const zhong_zhan_bi_ = parseFloat(zhong / total * 100).toFixed(2) + '%'
            const di = list3.total
            const di_zhan_bi_ = parseFloat(di / total * 100).toFixed(2) + '%'
            this.RiskLevelList = [
                { deng_ji_: '高风险', shu_liang_: gao, zhan_bi_: gao_zhan_bi_ },
                { deng_ji_: '中风险', shu_liang_: zhong, zhan_bi_: zhong_zhan_bi_ },
                { deng_ji_: '低风险', shu_liang_: di, zhan_bi_: di_zhan_bi_ },
                { deng_ji_: '合计', shu_liang_: total, zhan_bi_: '' }
            ]
            this.RiskLevelProp = [
                { prop: 'deng_ji_', label: '风险等级' },
                { prop: 'shu_liang_', label: '数量' },
                { prop: 'zhan_bi_', label: '占比' }
            ]
            this.riskLevePieView = {
                data: [{ name: '高风险', value: gao }, { name: '中风险', value: zhong }, { name: '低风险', value: di }],
                idSelector: 'adhjaodh',
                color: ['#FF0033', '#3870e0', '#339933']
            }
            console.log(this.riskLevePieView, 'this.riskLevePieView')
        },
        // 涉及条款统计表
        getClauseStatistics () {
            this.tableProp = []
            this.tableList = []
        },
        // 责任部门统计表统计表
        getDepartmentStatistics () {
            this.tableProp = []
            this.tableList = []
        },
        // 风险应对措施统计表
        async getRiskResponse () {
            const sql1 = `select COUNT(a.feng_xian_ying_du) AS total FROM t_fxsbpgbzb AS a,t_fxsbpgb AS b WHERE a.parent_id_ = b.id_ AND a.feng_xian_ying_du = '风险降低'`
            const sql2 = `select COUNT(a.feng_xian_ying_du) AS total FROM t_fxsbpgbzb AS a,t_fxsbpgb AS b WHERE a.parent_id_ = b.id_ AND a.feng_xian_ying_du = '风险接受'`
            const sql3 = `select COUNT(a.feng_xian_ying_du) AS total FROM t_fxsbpgbzb AS a,t_fxsbpgb AS b WHERE a.parent_id_ = b.id_ AND a.feng_xian_ying_du = '风险回避'`
            let list1, list2, list3
            await Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2), this.$common.request('sql', sql3)]).then((res) => {
                list1 = res[0].variables.data[0]
                list2 = res[0].variables.data[0]
                list3 = res[0].variables.data[0]
            })
            const total = parseInt(list1.total) + parseInt(list2.total) + parseInt(list3.total)
            const jiang_di_ = list1.total
            const jiang_di_zhan_bi_ = parseFloat(jiang_di_ / total * 100).toFixed(2) + '%'
            const jie_shou_ = list2.total
            const jie_shou_zhan_bi_ = parseFloat(jie_shou_ / total * 100).toFixed(2) + '%'
            const hui_bi_ = list3.total
            const hui_bi_zhan_bi_ = parseFloat(hui_bi_ / total * 100).toFixed(2) + '%'
            this.riskReList = [
                { cuo_shi_: '风险降低', shu_liang_: jiang_di_, zhan_bi_: jiang_di_zhan_bi_ },
                { cuo_shi_: '风险接受', shu_liang_: jie_shou_, zhan_bi_: jie_shou_zhan_bi_ },
                { cuo_shi_: '风险回避', shu_liang_: hui_bi_, zhan_bi_: hui_bi_zhan_bi_ }
            ]
            this.riskReProp = [
                { prop: 'cuo_shi_', label: '应对措施' },
                { prop: 'shu_liang_', label: '数量' },
                { prop: 'zhan_bi_', label: '占比' }
            ]
            this.riskRePieView = {
                data: [{ name: '风险降低', value: jiang_di_ }, { name: '风险接受', value: jie_shou_ }, { name: '风险回避', value: hui_bi_ }],
                config: { title: '', idSelector: 'riskResponse222' },
                color: ['#339933', '#3870e0', '#FF0033']
            }
            console.log(this.riskRePieView, 1231231)
        },
        // 风险识别评估表
        async getRiskIdentification () {
            const this_ = this
            const sql = `select bian_zhi_bu_men_,bian_zhi_shi_jian,bian_zhi_ren_,shi_fou_guo_shen_ from t_fxsbpgb where zong_id_ = '${this.zongid}'`
            await curdPost('sql', sql).then((res) => {
                this_.RiskIdenList = res.variables.data
            })
            for (const item of this_.RiskIdenList) {
                item.bian_zhi_ren_ = this.findUser(item.bian_zhi_ren_)
                item.bian_zhi_bu_men_ = this.findDept(item.bian_zhi_bu_men_)
                item.bian_zhi_shi_jian = item.bian_zhi_shi_jian || '/'
                item.shi_fou_guo_shen_ = item.shi_fou_guo_shen_ || '未编制'
            }
            this.RiskIdenProp = [
                { prop: 'bian_zhi_bu_men_', label: '编制部门' },
                { prop: 'bian_zhi_shi_jian', label: '编制时间' },
                { prop: 'bian_zhi_ren_', label: '编制人' },
                { prop: 'shi_fou_guo_shen_', label: '状态' }
            ]
        },
        // 风险改进记录
        async getImprovementRecords () {
            const this_ = this
            const sql = `select * from t_bmfxgjjl where zong_id_ = '${this.zongid}' `
            await curdPost('sql', sql).then((res) => {
                this_.ImproRecordsList = res.variables.data
            })
            for (const item of this_.ImproRecordsList) {
                item.bian_zhi_ren_ = this.findUser(item.bian_zhi_ren_)
                item.bian_zhi_bu_men_ = this.findDept(item.bian_zhi_bu_men_)
                item.bian_zhi_shi_jian = item.bian_zhi_shi_jian || '/'
                item.shi_fou_guo_shen_ = item.shi_fou_guo_shen_ || '未编制'
                item.percentage = this.FindImprovementRecords(item.shi_fou_guo_shen_)
            }
            this.ImproRecordsProp = [
                { prop: 'bian_zhi_bu_men_', label: '编制部门' },
                { prop: 'bian_zhi_shi_jian', label: '编制时间' },
                { prop: 'bian_zhi_ren_', label: '编制人' },
                { prop: 'shi_fou_guo_shen_', label: '状态' },
                { prop: 'yao_su_tiao_kuan_', label: '要素条款' },
                { prop: 'yan_zhong_cheng_d', label: '严重程度' }

            ]
            // this.tableList = []
        }

    }
}
</script>
<style lang="scss" scoped>

.bg {
    .tableTitle{
        padding: 10px;
    }
    .change{
        position: absolute;
        top: 2px;
        right: 46%;
        cursor: pointer;
    }
  .check-progress{
    width: 92%;
    position: relative;
    line-height: 1;
    margin: 0 auto;
    margin-left: 5%;
  }
  .steps-box {
    user-select: none;
    width: 90%;
    height: 2px;
    position: relative;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    // <!-- 步骤条背景进度条 -->
    .line {
      display: block;
      margin: 0 auto;
      position: absolute;
      top: 27px;
      left: 5%;
      background: #67c23a;
      width: 95%;
      height: 2px;
      overflow: hidden;
      .plan {
        position: absolute;
        top: 0;
        left: 0;
        height: 2px;
        transition: 0.5s;
        background: #37a2da;
      }
    }
    .Article-steps {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .step {
        .title {
          font-size: 17px;
          font-weight: bold;
          color: #808080;
        }
        .step-num {
          position: absolute;
          width: 58px;
          height: 58px;
          display: inline-block;
          line-height: 50px;
          background: #808080;
          // clip-path: polygon(50% 0, 100% 85%, 0 85%);
          color: white;
          font-weight: bold;
          z-index: 999;
          border-radius: 50%;
          text-align: center;
          // transition: 0.5s;
          font-size: 10px;
          display: flex;
          align-items: center;
          .icon {
            position: absolute;
            left: -12px;
            color: #8ab;
            font-size: 16px;
            font-weight: bold;
            top: 35%;
          }
          p {
            line-height: 20px;
            width: 40px;
            overflow: hidden;
            line-height: 18px;
            white-space: normal;
            margin: 0 auto;
            text-align: center;
          }
          .num {
            transition: 0.5s;
            display: inline-block;
          }
        }
        .post{
          text-align: center;
          font-size: 12px;
          margin-top: 5px;
          position: absolute;
          top: 60px;
          color: #2d7df5;
          width: 60px;
          overflow: hidden;
        }
      }
    }
    // //当前所在位置样式
    .current-active
    {
      .step-num {
        background: #2d7df5 !important;
      }
      .title {
        color: #2d7df5 !important;
      }
    }
    .step-active
    {
      .step-num {
        background: #00CC00 !important;
      }
      .title {
        color: #2d7df5 !important;
      }
    }
    .Article-content {
      padding: 20px;
      .btn {
        width: 150px;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
        background: #2d7df5;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
      }
      .content {
        padding: 20px;
      }
    }
  }
}
.count{
    margin: 0 auto;
    margin-top: 80px;
    width: 98%;
}
</style>
