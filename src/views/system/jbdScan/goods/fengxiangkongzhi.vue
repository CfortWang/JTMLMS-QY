<template>
    <div class="bg">
        <el-dialog width="70vw" height="50vh" :modal-append-to-body="false" title="风险评估进度查询" :visible.sync="scan">
            <!-- 表单是否显示 -->
            <div ref="childComponent" style="height: 75vh; width: 100%">
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
                        <el-tab-pane label="风险等级统计表" name="first" style="display: flex;">
                            <div style="width: 50%;height:320px;display: inline-block">
                                <tableCom :table-prop="RiskLevelProp" :table-list="riskLevelList" />
                            </div>
                            <div style="width: 50%; height:320px;display: inline-block;">
                                <div id="riskLevePieView" style="width: 500px; height: 300px; margin:0 auto" />
                                <PieView ref="riskLevePieView" :info="riskLevePieView" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="涉及条款统计表" name="second">
                            <div style="width: 45%;height:320px;display: inline-block">
                                <tableCom :table-prop="termProp" :table-list="termList" />
                            </div>
                            <div style="width: 51%; height:320px;display: inline-block">
                                <div id="termPieView" style="width: 100%; height: 300px; margin:0 auto" />
                                <PieView ref="termPieView" :info="termPieView" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="责任部门统计表" name="third">
                            <div style="width: 50%;height:320px;display: inline-block">
                                <tableCom :table-prop="departProp" :table-list="departList" />
                            </div>
                            <div style="width: 45%; height:320px;display: inline-block">
                                <div id="departPieView" style="width: 500px; height: 300px; margin:0 auto" />
                                <PieView ref="departPieView" :info="departPieView" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="风险应对措施统计表" name="fourth">
                            <div style="width: 50%;height:320px;display: inline-block">
                                <tableCom :table-prop="riskReProp" :table-list="riskReList" />
                            </div>
                            <div style="width: 45%; height:320px;display: inline-block">
                                <div id="riskRePieView" style="width: 500px; height: 300px; margin:0 auto" />
                                <PieView ref="riskRePieView" :info="riskRePieView" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="剩余风险等级统计表" name="fine">
                            <div style="width: 100%; height:350px;display: flex;justify-content: center; overflow-x: scroll;">
                                <div id="remainingRiskCD" style="width: 33%; height: 300px; " />
                                <PieView ref="remainingRiskCD" :info="remainingRiskCD" />
                                <div id="remainingRiskDJ" style="width: 33%; height: 300px; " />
                                <PieView ref="remainingRiskDJ" :info="remainingRiskDJ" />
                                <div id="remainingRiskYD" style="width: 33%; height: 300px; " />
                                <PieView ref="remainingRiskYD" :info="remainingRiskYD" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="降低风险登记表" name="six">
                            <div style="width: 100%;">
                                <tableCom :table-prop="reduceeProp" :table-list="reduceList" />
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </template>
                <div v-if="obj[0].zhuang_tai_ ==='识别中'" style="padding: 5px">
                    <div class="tableTitle">风险识别评估</div>
                    <tableCom ref="RiskIdenList" :table-prop="RiskIdenProp" :table-list="RiskIdenList" :page-show="true" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
                </div>
                <div v-if="obj[0].zhuang_tai_ ==='改进中'" style="padding: 5px">
                    <div class="tableTitle">部门风险改进记录</div>
                    <tableCom ref="ImproRecords" :table-prop="ImproRecordsProp" :table-list="ImproRecordsList " :control-schedule="true" :page-show="true" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange" />
                </div>

            </div>

        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import request from '@/utils/request'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import tableCom from '../../jbdHome/board/component/tableCom.vue'
import PieView from '../../jbdHome/board/component/fengxianPie.vue'
import js from '@/views/scientificPayoffs/js'
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
            id: '',
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
                    stepIndex: 0,
                    title: '评估计划'
                    // post: '质量负责人'
                },
                {
                    stepIndex: 25,
                    title: '实施计划'
                    // post: '内审组长'
                },
                {
                    stepIndex: 50,
                    title: '风险识别'
                    // post: '内审员'
                },
                {
                    stepIndex: 75,
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
            pageTotal: 0,
            ImproRecordsList: [],
            ImproRecordsProp: [],
            riskLevelList: [], // 风险等级
            RiskLevelProp: [],
            riskLevePieView: {},
            riskLeveChange: true,
            termList: [], // 条款统计表
            termProp: [],
            termPieView: {},
            termChange: true,
            departList: [], // 责任部门统计
            departProp: [],
            departPieView: {},
            departChange: true,
            riskReList: [], // 风险应对措施统计
            riskReProp: [],
            riskRePieView: {},
            riskReChange: true,
            residueList: [], // 剩余风险等级统计
            residueProp: [],
            remainingRiskDJ: {},
            remainingRiskYD: {},
            remainingRiskCD: {},
            residueChange: true,
            reduceList: [], // 降低风险登记表
            reduceeProp: [],
            reducePieView: {},
            reduceChange: true,
            currentPage: 1,
            pagesize: 5
        }
    },
    computed: {
        findSchedule: function (guo_shen_) { // 进度返回值
            if (guo_shen_ === '未编制' || guo_shen_ === '') {
                return 25
            } else if (guo_shen_ === '识别中') {
                return 50
            } else if (guo_shen_ === '改进中') {
                return 75
            } else if (guo_shen_ === '已完成') {
                return 100
            } else {
                return ''
            }
        }
    },
    watch: {
        obj (newVal, oldVal) {
            this.id = newVal[0].id_
            this.zongid = newVal[0].zong_id_
            this.getInits()
        }
    },
    created () {
        this.id = this.obj[0].id_
        this.zongid = this.obj[0].zong_id_
        this.$nextTick(() => {
            this.getInits()
        })
    },
    destroyed () {
        this.$destroy()
    },
    methods: {
        findDept (depId) {
            const dept = this.deptList.find(i => i.positionId === depId)
            return dept.positionName
        },
        findUser (userId) {
            const user = this.userList.find(i => i.userId === userId)
            return user.userName
        },
        getInits () {
            // this.getRiskLevel() // 风险等级
            this.getRiskIdentification()// 风险识别评估表
            this.getImprovementRecords()// 风险改进记录
            // this.remainingRisk()
            // this.getReduceChange()
            this.handleClick()
            this.getSchedule(this.obj[0].zhuang_tai_)
            this.currentPage = 1
            this.pagesize = 5
            this.scan = this.scanVisible
            // this.activeName = 'first'
            this.userList = this.$store.getters.userList
            this.deptList = this.$store.getters.deptList
            this.riskLeveChange = true
            this.termChange = true
            this.departChange = true
            this.riskReChange = true
        },
        getSchedule (guo_shen_) {
            if (guo_shen_ === '未编制' || guo_shen_ === '') {
                this.activeIndex = 25
            } else if (guo_shen_ === '识别中') {
                this.activeIndex = 50
            } else if (guo_shen_ === '改进中') {
                this.activeIndex = 75
            } else if (guo_shen_ === '已完成') {
                this.activeIndex = 100
            } else {
                this.activeIndex = 25
            }
        },
        handleClick () {
            console.log(111111111111111111, this.activeName)
            if (this.activeName === 'first') {
                this.getRiskLevel()
            } else if (this.activeName === 'second') {
                this.getClauseStatistics()
            } else if (this.activeName === 'third') {
                this.getDepartmentStatistics()
            } else if (this.activeName === 'fourth') {
                this.getRiskResponse()
            } else if (this.activeName === 'fine') {
                this.remainingRisk()
            } else if (this.activeName === 'six') {
                this.getReduceChange()
            }
        },
        async countApi (riskId, type) {
            const res = await request({
                // 接口地址
                url: '/business/v3/report/statistic/risk',
                // 接口方法
                method: 'get',
                // 接口参数，data、params
                params: {
                    riskId: riskId,
                    type: type
                }
            })
            return res.data
        },
        // 风险等级
        async getRiskLevel () {
            const res = await this.countApi(this.zongid, 'FXDJ')
            this.riskLevePieView = {
                data: [],
                idSelector: 'riskLevePieView',
                color: ['#d72828', '#2077b5', '#ff7f0d']
            }
            this.riskLevePieView.data = []
            this.riskLevelList = []
            const addCount = res.reduce((acc, item) => acc + item.total, 0)
            for (const item of res) {
                this.riskLevelList.push({ deng_ji_: item.feng_xian_deng_ji, shu_liang_: item.total, zhan_bi_: parseFloat(Number(item.total) / Number(addCount) * 100).toFixed(1) + '%' })
                this.riskLevePieView.data.push({ name: item.feng_xian_deng_ji, value: item.total })
            }
            this.riskLevelList.push({ deng_ji_: '合计', shu_liang_: addCount, zhan_bi_: '/' })
            this.RiskLevelProp = [
                { prop: 'deng_ji_', label: '风险等级' },
                { prop: 'shu_liang_', label: '数量' },
                { prop: 'zhan_bi_', label: '占比' }
            ]

            this.$refs.riskLevePieView.getMiddleLeft('riskLevePieView', this.riskLevePieView)
        },
        // 涉及条款统计表
        async getClauseStatistics () {
            const res = await this.countApi(this.zongid, 'SJTK')
            this.termPieView = {
                data: [],
                idSelector: 'termPieView',
                color: ['#d72828', '#2077b5', '#afc7e8', '#ff7f0d', '#ffbb7a', '#2ba02b', '#98df8a', '#9e9fa3', '#f19066']
            }
            this.termPieView.data = []
            this.termList = []
            const addCount = res.reduce((acc, item) => acc + item.total, 0)
            for (const item of res) {
                this.termList.push({ yao_su_tiao_kuan_: item.yao_su_tiao_kuan_, shu_liang_: item.total, zhan_bi_: parseFloat(Number(item.total) / Number(addCount) * 100).toFixed(1) + '%' })
                this.termPieView.data.push({ name: item.yao_su_tiao_kuan_, value: item.total })
            }
            this.termList.push({ yao_su_tiao_kuan_: '合计', shu_liang_: addCount, zhan_bi_: '/' })
            this.termProp = [
                { prop: 'yao_su_tiao_kuan_', label: '条款' },
                { prop: 'shu_liang_', label: '数量' },
                { prop: 'zhan_bi_', label: '占比' }
            ]
            this.$refs.termPieView.getMiddleLeft('termPieView', this.termPieView)
        },
        // 责任部门统计表统计表
        async getDepartmentStatistics () {
            const res = await this.countApi(this.zongid, 'ZRBM')
            this.departPieView = {
                data: [],
                idSelector: 'departPieView',
                color: ['#d72828', '#2077b5', '#afc7e8', '#ff7f0d']
            }
            this.departPieView.data = []
            this.departList = []
            const addCount = res.reduce((acc, item) => acc + item.total, 0)
            for (const item of res) {
                this.departList.push({ bian_zhi_bu_men_: item.name_, shu_liang_: item.total, zhan_bi_: parseFloat(Number(item.total) / Number(addCount) * 100).toFixed(1) + '%' })
                this.departPieView.data.push({ name: item.name_, value: item.total })
            }
            this.riskLevelList.push({ bian_zhi_bu_men_: '合计', shu_liang_: addCount, zhan_bi_: '/' })
            this.departProp = [
                { prop: 'bian_zhi_bu_men_', label: '部门' },
                { prop: 'shu_liang_', label: '数量' },
                { prop: 'zhan_bi_', label: '占比' }
            ]
            this.$refs.departPieView.getMiddleLeft('departPieView', this.departPieView)
        },
        // 风险应对措施统计表
        async getRiskResponse () {
            const res = await this.countApi(this.zongid, 'YDCS')
            this.riskRePieView = {
                data: [],
                idSelector: 'riskRePieView',
                color: ['#d72828', '#2077b5', '#ff7f0d']
            }
            this.riskRePieView.data = []
            this.riskReList = []
            const addCount = res.reduce((acc, item) => acc + item.total, 0)
            for (const item of res) {
                this.riskReList.push({ cuo_shi_: item.feng_xian_ying_du, shu_liang_: item.total, zhan_bi_: parseFloat(Number(item.total) / Number(addCount) * 100).toFixed(1) + '%' })
                this.riskRePieView.data.push({ name: item.feng_xian_ying_du, value: item.total })
            }
            this.riskReList.push({ cuo_shi_: '合计', shu_liang_: addCount, zhan_bi_: '/' })
            this.riskReProp = [
                { prop: 'cuo_shi_', label: '应对措施' },
                { prop: 'shu_liang_', label: '数量' },
                { prop: 'zhan_bi_', label: '占比' }
            ]
            this.$refs.riskRePieView.getMiddleLeft('riskRePieView', this.riskRePieView)
        },
        // 剩余风险统计表
        async remainingRisk () {
            const sql = `select * FROM t_yzcdfjbzb where zi_fen_lei_ = '严重程度'`
            let riskCount = []
            await curdPost('sql', sql).then((res) => {
                riskCount = res.variables.data
            })
            const riskCD = await this.countApi(this.zongid, 'SYFX_CD')
            const cdData = []
            for (const item of riskCD) {
                const findData = riskCount.find(i => i.fen_ji_ === item.yan_zhong_cheng_d)
                cdData.push({ name: findData.fen_ji_ + '、' + findData.yan_zhong_cheng_d, value: item.total })
            }
            this.remainingRiskCD = {
                data: cdData,
                idSelector: 'remainingRiskCD',
                title: '严重程度分布',
                color: ['#d72828', '#2077b5', '#afc7e8', '#ff7f0d', '#2ba02b']
            }
            const riskDJ = await this.countApi(this.zongid, 'SYFX_DJ')
            const djData = []
            for (const item of riskDJ) {
                djData.push({ name: item.feng_xian_deng_ji, value: item.total })
            }
            this.remainingRiskDJ = {
                data: djData,
                idSelector: 'remainingRiskDJ',
                title: '风险等级分布',
                color: ['#d72828', '#2077b5', '#ff7f0d']
            }
            const riskYD = await this.countApi(this.zongid, 'SYFX_YD')
            const ydData = []
            for (const item of riskYD) {
                ydData.push({ name: item.feng_xian_ying_du, value: item.total })
            }
            this.remainingRiskYD = {
                data: ydData,
                title: '风险应对分布',
                idSelector: 'remainingRiskYD',
                color: ['#d72828', '#2077b5', '#ff7f0d']
            }
            this.$refs.remainingRiskCD.getMiddleLeft('remainingRiskCD', this.remainingRiskCD)
            this.$refs.remainingRiskDJ.getMiddleLeft('remainingRiskDJ', this.remainingRiskDJ)
            this.$refs.remainingRiskYD.getMiddleLeft('remainingRiskYD', this.remainingRiskYD)
        },
        // 风险识别评估表
        async getRiskIdentification () {
            const this_ = this
            const riskCountSql = `select COUNT(*) as count from t_fxsbpgb where zong_id_ = '${this.zongid}'`
            let riskCount = []
            await curdPost('sql', riskCountSql).then((res) => {
                riskCount = res.variables.data
            })

            // this_.$refs.RiskIdenList.curreFn(riskCount[0].count)
            this.pageTotal = Number(riskCount[0].count)

            const sql = `select bian_zhi_bu_men_,bian_zhi_shi_jian,bian_zhi_ren_,shi_fou_guo_shen_ from t_fxsbpgb where zong_id_ = '${this.zongid}' order by shi_fou_guo_shen_ desc limit ${(this.currentPage - 1) * this.pagesize},${this.pagesize}`
            await curdPost('sql', sql).then((res) => {
                this_.RiskIdenList = res.variables.data
            })
            for (const item of this_.RiskIdenList) {
                item.bian_zhi_ren_ = item.bian_zhi_ren_ ? this.findUser(item.bian_zhi_ren_) : '/'
                item.bian_zhi_bu_men_ = item.bian_zhi_bu_men_ ? this.findDept(item.bian_zhi_bu_men_) : '/'
                item.bian_zhi_shi_jian = item.bian_zhi_shi_jian.split(' ')[0] || '/'
                item.shi_fou_guo_shen_ = item.shi_fou_guo_shen_ || '未编制'
            }
            this.RiskIdenProp = [
                { prop: 'bian_zhi_bu_men_', label: '编制部门' },
                { prop: 'bian_zhi_shi_jian', label: '编制时间' },
                { prop: 'bian_zhi_ren_', label: '编制人' },
                { prop: 'shi_fou_guo_shen_', label: '状态' }
            ]
        },
        // 降低风险等记表
        async getReduceChange () {
            const this_ = this
            const riskCountSql = `select COUNT(*) as count from t_djbzb where zong_id_ = '${this.zongid}'`
            let riskCount = []
            await curdPost('sql', riskCountSql).then((res) => {
                riskCount = res.variables.data
            })
            this.pageTotal = Number(riskCount[0].count)

            const sql = `select * from t_djbzb where zong_id_ = '${this.zongid}' order by shi_fou_guo_shen_ desc limit ${(this.currentPage - 1) * this.pagesize},${this.pagesize}`
            await curdPost('sql', sql).then((res) => {
                this_.reduceList = res.variables.data
            })
            for (const item of this_.reduceList) {
                item.bian_zhi_ren_ = item.bian_zhi_ren_ ? this.findUser(item.bian_zhi_ren_) : '/'
                item.bian_zhi_bu_men_ = item.bian_zhi_bu_men_ ? this.findDept(item.bian_zhi_bu_men_) : '/'
                item.bian_zhi_shi_jian = item.bian_zhi_shi_jian.split(' ')[0] || '/'
                item.yao_su_tiao_kuan_ = item.yao_su_tiao_kuan_ || '/'
                item.feng_xian_zhi_shu = item.feng_xian_zhi_shu || '/'
                item.gong_zuo_huan_jie = item.gong_zuo_huan_jie || '/'
                item.gong_zuo_miao_shu = item.gong_zuo_miao_shu || '/'
                item.feng_xian_miao_sh = item.feng_xian_miao_sh || '/'
            }
            this.reduceeProp = [
                { prop: 'bian_zhi_bu_men_', label: '编制部门' },
                { prop: 'bian_zhi_shi_jian', label: '编制时间' },
                { prop: 'yao_su_tiao_kuan_', label: '要素条款' },
                { prop: 'feng_xian_zhi_shu', label: '初评风险指数' },
                { prop: 'gong_zuo_huan_jie', label: '工作环节', width: 120 },
                { prop: 'gong_zuo_miao_shu', label: '工作描述', width: 300 },
                { prop: 'feng_xian_miao_sh', label: '风险描述', width: 250 }
            ]
        },
        // 风险改进记录
        async getImprovementRecords () {
            const this_ = this
            this_.pageTotal = 0
            const sql1 = `select * from t_bmfxgjjl where zong_id_ = '${this.zongid}' limit ${(this.currentPage - 1) * this.pagesize},${this.pagesize}`
            const sql2 = `select count(*) as count from t_bmfxgjjl where zong_id_ = '${this.zongid}'`
            await Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2)]).then((res) => {
                this_.ImproRecordsList = res[0].variables.data
                if (this_.ImproRecordsList === 0) {
                    return
                }
                this_.pageTotal = res[1].variables.data[0].count
                if (this_.pageTotal !== 0) {
                    this_.$refs.ImproRecords.curreFn(res[1].variables.data[0].count)
                }
            })
            for (const item of this_.ImproRecordsList) {
                item.bian_zhi_ren_ = item.bian_zhi_ren_ ? this.findUser(item.bian_zhi_ren_) : '/'
                item.ping_gu_ren_ = item.ping_gu_ren_ ? this.findUser(item.ping_gu_ren_) : '/'
                item.bian_zhi_bu_men_ = item.bian_zhi_bu_men_ ? this.findDept(item.bian_zhi_bu_men_) : '/'
                item.bian_zhi_shi_jian = item.bian_zhi_shi_jian.split(' ')[0] || '/'
                item.shi_fou_guo_shen_ = item.shi_fou_guo_shen_ || '未编制'
                item.yao_su_tiao_kuan_ = item.yao_su_tiao_kuan_ || '/'
                item.gai_jin_bian_hao_ = item.gai_jin_bian_hao_ || '/'
                item.zheng_gai_qi_xian = item.zheng_gai_qi_xian || '/'
                item.wan_cheng_shi_jia = item.wan_cheng_shi_jia || '/'
                item.yan_zhong_cheng_d = item.yan_zhong_cheng_d || '/'
                item.percentage = this.getImpRecordsSchedule(item.shi_fou_guo_shen_)
            }
            this.ImproRecordsProp = [
                { prop: 'bian_zhi_bu_men_', label: '编制部门' },
                { prop: 'bian_zhi_shi_jian', label: '编制时间' },
                { prop: 'bian_zhi_ren_', label: '编制人' },
                { prop: 'ping_gu_ren_', label: '评估人' },
                { prop: 'shi_fou_guo_shen_', label: '状态' },
                { prop: 'yao_su_tiao_kuan_', label: '要素条款', width: 120 },
                { prop: 'gai_jin_bian_hao_', label: '改进编号', width: 120 },
                { prop: 'zheng_gai_qi_xian', label: '整改期限' },
                { prop: 'wan_cheng_shi_jia', label: '完成日期' },
                { prop: 'yan_zhong_cheng_d', label: '严重程度' }
            ]
        },
        getImpRecordsSchedule (value) {
            if (value === '已改进') {
                return 25
            } else if (value === '已评估') {
                return 50
            } else if (value === '已审核') {
                return 75
            } else if (value === '已完成') {
                return 100
            } else {
                return 0
            }
        },
        handleSizeChange (val) {
            this.currentPage = 1
            this.pagesize = val
            this.turnPage()
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.turnPage()
        },
        turnPage () {
            const zhuang_tai_ = this.obj[0].zhuang_tai_
            if (zhuang_tai_ === '识别中') {
                this.getRiskIdentification()
            } else if (zhuang_tai_ === '改进中') {
                this.getImprovementRecords()
            }
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
    padding: 5px;
    width: 100%;
}
</style>
