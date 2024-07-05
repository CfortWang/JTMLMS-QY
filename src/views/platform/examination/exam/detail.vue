<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog paper-detail-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <div class="container">
            <div class="paper-info">
                <div class="info-item">
                    <span class="label">考试名称：</span>
                    <span class="value">{{ paperData.examName }}</span>
                </div>
                <div class="info-item">
                    <span class="label">创建人：</span>
                    <span class="value">{{ transformUser(paperData.createBy) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">创建时间：</span>
                    <span class="value">{{ paperData.createTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">发布时间：</span>
                    <span class="value">{{ paperData.publishDate }}</span>
                </div>
                <div class="info-item">
                    <span class="label">限考时间：</span>
                    <span class="value">{{ paperData.limitDate }}</span>
                </div>
                <div class="info-item">
                    <span class="label">考试时长：</span>
                    <span class="value">{{ transformTime(paperData.duration) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">限考次数：</span>
                    <span class="value">{{ paperData.limitCount }}</span>
                </div>
                <div class="info-item">
                    <span class="label">题库名称：</span>
                    <span class="value">{{ paperData.bankName }}</span>
                </div>
                <div class="info-item">
                    <span class="label">题目数量：</span>
                    <span class="value">{{ paperData.isRand==='1'?paperData.randTotal:paperData.questionCount }}</span>
                </div>
                <div class="info-item">
                    <span class="label">总分：</span>
                    <span class="value">{{ paperData.isRand==='1'?paperData.randScore:paperData.totalScore }}分</span>
                </div>
                <div class="info-item">
                    <el-tooltip
                        effect="dark"
                        content="达标分值占总分的比率"
                        placement="top"
                    >
                        <span class="label">达标占比：</span>
                    </el-tooltip>
                    <span class="value">{{ paperData.qualifiedRadio }}%</span>
                </div>
                <div class="info-item">
                    <span class="label">是否随机：</span>
                    <span class="value">{{ paperData.isRand==='1'?'是':'否' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">最高分：</span>
                    <span class="value">{{ maxScore }}</span>
                </div>
                <div class="info-item">
                    <span class="label">最低分：</span>
                    <span class="value">{{ minScore }}</span>
                </div>
                <div class="info-item">
                    <span class="label">平均分：</span>
                    <span class="value">{{ avgScore }}</span>
                </div>
                <div class="info-item">
                    <span class="label">计分方式：</span>
                    <span class="value">{{ paperData.scoringType }}</span>
                </div>
                <div class="info-item">
                    <span class="label">应参考人数：</span>
                    <span class="value">{{ paperList.length }}</span>
                </div>
                <div class="info-item">
                    <span class="label">实参考人数：</span>
                    <span class="value">{{ joinRate.count }}</span>
                </div>
                <div class="info-item">
                    <span class="label">参考率：</span>
                    <span class="value">{{ joinRate.rate }}</span>
                </div>
                <div class="info-item">
                    <span class="label">达标率：</span>
                    <span class="value">{{ passRate }}</span>
                </div>
            </div>
            <div class="paper-status">
                <div>
                    考试状态：<el-select
                        v-model="selectValue"
                        placeholder="请选择查询状态"
                        @change="onSelectChange"
                    >
                        <el-option
                            v-for="item in paperOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
                <div class="table-bar">
                    <el-button
                        type="primary"
                        size="mini"
                        icon="ibps-icon-sign-out"
                        @click="exportData()"
                    >导出数据</el-button>
                    <el-button
                        type="success"
                        size="mini"
                        icon="el-icon-s-data"
                        @click="showStatistics"
                    >数据统计</el-button>
                </div>
            </div>
            <div class="paper-table">
                <el-table
                    ref="elTable"
                    :data="showPaperList"
                    border
                    stripe
                    highlight-current-row
                    header-row-class-name="exam-table-header"
                    style="width: 100%"
                    class="exam-table"
                    @row-dblclick="handleRowDblclick"
                >
                    <el-table-column label="序号" type="index" :index="showIndex" width="50" />
                    <el-table-column prop="userName" label="考生姓名" width="100" />
                    <el-table-column prop="positionId" label="部门" width="100">
                        <template slot-scope="{ row }">
                            <ibps-user-selector
                                type="position"
                                :value="row.positionId"
                                readonly-text="text"
                                :disabled="true"
                                :multiple="true"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="count" label="参考次数/完成次数" width="90" />
                    <el-table-column prop="" label="考试成绩">
                        <el-table-column prop="max" label="最高得分" width="90" />
                        <el-table-column prop="min" label="最低得分" width="90" />
                        <el-table-column prop="avg" label="平均得分" width="90" />
                        <el-table-column prop="latest" label="最近得分" width="90" />
                    </el-table-column>
                    <el-table-column prop="resultScore" label="最终成绩" width="90" />
                    <el-table-column prop="isQualified" label="是否达标">
                        <template slot-scope="scope">
                            <el-tag
                                :type="getTagType(scope.row)"
                                size="medium"
                                class="score"
                            >{{ scope.row.isQualified }}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        fixed="right"
                        label="操作"
                        width="60"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleRowDblclick(scope.row)">详情</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>

                <el-pagination
                    style="margin-top: 5px; padding-bottom: 10px"
                    :current-page="currentPage"
                    :page-sizes="[10, 15, 20, 25, 30, 50]"
                    :page-size="pageSize"
                    layout="prev,pager,next,jumper,sizes,->,total"
                    :total="filterPaperList.length"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
        <paper-detail
            v-if="paperDialogVisible"
            :id="paperId"
            :visible.sync="paperDialogVisible"
            :bank-id="bankId"
            :exam-id="examId"
            :examinee-id="examineeId"
            @close="paperDialogVisible = false"
        />
        <Statistics
            ref="statisticsRef"
            :department-data="departmentData"
        />
    </el-dialog>
</template>

<script>
import IbpsUserSelector from '@/business/platform/org/selector'
// 数据统计组件
import Statistics from './statistics.vue'
import IbpsExport from '@/plugins/export'
import ActionUtils from '@/utils/action'
import { max, min, mean, sum, maxBy, minBy, meanBy, round } from 'lodash'
const qualifiedType = [
    {
        value: '达标',
        type: 'success'
    },
    {
        value: '未达标',
        type: 'danger'
    },
    {
        value: '考试未结束',
        type: 'warning'
    }
]
export default {
    components: {
        IbpsImage: () => import('@/business/platform/file/image'),
        PaperDetail: () => import('../questionBank/detail'),
        IbpsUserSelector,
        Statistics
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        bankId: {
            type: String,
            default: ''
        },
        examId: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userList } = this.$store.getters || {}
        return {
            userList,
            title: '考试详情',
            dialogVisible: this.visible,
            paperDialogVisible: false,
            toolbars: [{ key: 'cancel', label: '退出' }],
            paperList: [],
            paperData: [],
            paperId: '',
            examineeId: '',
            maxScore: '',
            minScore: '',
            avgScore: '',
            passRate: '',
            paperOptions: [
                {
                    value: 'all',
                    label: '全部'
                },
                {
                    value: 'good',
                    label: '达标'
                },
                {
                    value: 'bad',
                    label: '未达标'
                },
                {
                    value: 'noFinish',
                    label: '考试未结束'
                }
            ],
            selectValue: 'all',
            pageSize: 10,
            currentPage: 1,
            departmentData: [] // 数据统计
        }
    },
    computed: {
        filterPaperList () {
            return this.paperList.filter((paper) => {
                if (this.selectValue === 'all') return this.paperList
                const { label } = this.paperOptions.find((option) => option.value === this.selectValue)
                return paper.isQualified === label
            })
        },
        showPaperList () {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.filterPaperList.slice(start, end)
        },
        joinRate () {
            let count = 0
            this.paperList.forEach((item) => {
                if (item.count && item.count.split('/')[1] !== '0') {
                    count++
                }
            })
            return {
                count,
                rate: ((count / this.paperList.length) * 100).toFixed(2) + '%'
            }
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        }
    },
    mounted () {
        this.loadData()
        // 监听键盘事件
        window.addEventListener('keyup', this.handleKeyPress)
    },
    beforeDestroy () {
        window.removeEventListener('keyup', this.handleKeyPress)
    },
    methods: {
        // 获取题库数据
        async loadData () {
            if (!this.examId) {
                this.$message.error('获取题目信息失败，请重试！')
                this.closeDialog()
                return
            }
            this.paperList = await this.getQuestionData()
            console.log(this.paperList)
            this.paperData = this.paperList[0]
            this.posData()
        },
        // 获取部门数据
        posData () {
            this.paperList.forEach((item) => {
                const user = this.userList.find((u) => u.userName === item.userName)
                item.positionId = user.positionId
                item.positionName = user.positions
            })
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleKeyPress (event) {
            if (event.keyCode === 27 || event.key === 'Esc') {
                this.closeDialog()
            }
        },
        getTagType (row) {
            const temp = qualifiedType.find(i => i.value === row.isQualified)
            return temp ? temp.type : 'default'
        },
        transformUser (userId) {
            const user = this.userList.find(u => u.userId === userId) || {}
            return user.userName || '-'
        },
        transformTime (timeStamp) {
            if (timeStamp === '不限' || !timeStamp) return '不限'
            const hours = Math.floor(parseInt(timeStamp) / 3600000)
            const minutes = Math.floor((parseInt(timeStamp) % 3600000) / 60000)
            return hours + '小时' + minutes + '分钟'
        },
        getPassRate (list) {
            const passScore = parseFloat(list[0].qualifiedRadio) / 100 * parseFloat(list[0].totalScore)
            const passList = list.filter(i => i.resultScore >= passScore)
            return (passList.length / list.length * 100).toFixed(2) + '%'
        },
        getQuestionData () {
            const sql = `select qb.ti_ku_ming_cheng_ as bankName, ex.id_ as examId, ex.ti_ku_id_ as bankId, e.id_ as paperId, ex.zhuang_tai_ as examState, e.zhuang_tai_ as paperState, qb.ti_shu_ as questionCount, qb.zong_fen_ as totalScore, ex.kao_shi_ming_chen as examName, ex.can_kao_ren_yuan_ as examinee, e.kao_shi_ren_ as examineeId, ex.create_by_ as createBy, ex.chuang_jian_shi_j as createTime, ex.fa_bu_shi_jian_ as publishDate, ex.xian_kao_shi_jian as limitDate, ex.kao_shi_shi_chang as duration, ex.xian_kao_ci_shu_ as limitCount, ex.da_biao_zhan_bi_ as qualifiedRadio, ex.ji_fen_fang_shi_ as scoringType, ex.yun_xu_bao_ming_ as allowRegist, ex.kao_shi_miao_shu_ as examDesc,ex.sui_ji_chou_ti_ as isRand, ex.sui_ji_ti_shu_ as randNumber,ex.chou_ti_zong_fen_ as randScore,ex.ti_mu_zong_shu_ as randTotal, e.de_fen_ as score, e.bao_ming_shi_jian as applyTime, e.kai_shi_shi_jian_ as startTime, e.jie_shu_shi_jian_ as endTime from t_exams ex, t_question_bank qb, t_examination e where ex.ti_ku_id_ = qb.id_ and e.exam_id_ = ex.id_ and ex.id_ = '${this.examId}' order by e.kao_shi_ren_ desc, e.jie_shu_shi_jian_ desc`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        this.$message.warning('未查询到已提交的考试记录，请先完成考试！')
                        this.closeDialog()
                        return
                    }
                    const result = []
                    const scorrType = {
                        '最高分': 'max',
                        '平均分': 'avg',
                        '最近得分': 'latest'
                    }
                    data.forEach(item => {
                        const index = result.findIndex(i => i.examineeId === item.examineeId)
                        if (index === -1) {
                            result.push({
                                ...item,
                                totalCount: data.length,
                                totalScore: item.isRand === '1' ? parseFloat(item.randScore) : parseFloat(item.totalScore),
                                statusList: [item.paperState],
                                scoreList: [parseFloat(item.score || -1)]
                            })
                        } else {
                            result[index].scoreList.push(parseFloat(item.score || -1))
                            result[index].statusList.push(item.paperState)
                        }
                    })
                    const nodatadesc = '/'
                    result.forEach((item, index) => {
                        const finishScore = item.scoreList.filter(i => i !== -1)
                        item.userName = this.transformUser(item.examineeId)
                        item.max = finishScore.length ? round(max(finishScore), 2) : nodatadesc
                        item.min = finishScore.length ? round(min(finishScore), 2) : nodatadesc
                        item.avg = finishScore.length ? round(mean(finishScore), 2) : nodatadesc
                        item.sum = finishScore.length ? round(sum(finishScore), 2) : nodatadesc
                        item.latest = finishScore.length ? round(finishScore[0], 2) : nodatadesc
                        item.examCount = item.scoreList.length
                        item.finishCount = finishScore.length
                        item.count = `${item.examCount}/${item.finishCount}`
                        item.examStatus = item.examCount === item.finishCount ? '已完成' : '未完成'
                        item.resultScore = item[scorrType[item.scoringType]]
                        item.isQualified = item.examStatus === '已完成' ? item.resultScore >= (parseFloat(item.qualifiedRadio) / 100 * parseFloat(item.totalScore)) ? '达标' : '未达标' : '考试未结束'
                    })
                    const finishList = result.filter(i => i.examStatus === '已完成')
                    this.maxScore = finishList.length ? maxBy(finishList, 'max').max : nodatadesc
                    this.minScore = finishList.length ? minBy(finishList, 'min').min : nodatadesc
                    this.avgScore = finishList.length ? meanBy(finishList, 'avg').toFixed(2) : nodatadesc
                    this.passRate = finishList.length ? this.getPassRate(finishList) : nodatadesc
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleRowDblclick (row) {
            this.paperId = row.paperId
            this.examineeId = row.examineeId
            this.paperDialogVisible = true
        },
        // 关闭当前窗口
        closeDialog () {
            window.removeEventListener('keyup', this.handleKeyPress)
            this.$emit('close', false)
        },
        // 选择器状态改变
        onSelectChange (select) {
            this.pageSize = 10
            this.currentPage = 1
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.currentPage = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.currentPage - 1) * this.pageSize
        },
        // 部门参考人数
        deptJoined (dept) {
            return this.paperList.filter(paper => paper.positionName.split(',').includes(dept)).length
        },
        // 部门已考人数
        deptFinished (dept) {
            return this.paperList.filter(paper => paper.positionName.split(',').includes(dept) && paper.finishCount !== 0).length
        },
        // 部门达标人数
        deptPassRate (dept) {
            return this.paperList.filter(paper => paper.positionName.split(',').includes(dept) && paper.isQualified === '达标').length
        },
        // 部门分数，最高分、最低分、总分
        deptScore (dept) {
            const validPapers = this.paperList.filter(paper => paper.positionName.split(',').includes(dept) && paper.resultScore !== '/')
            const scores = validPapers.map(paper => +paper.resultScore)
            return {
                max: Math.max(...scores, 0),
                min: scores.length ? Math.min(...scores) : 0,
                sum: validPapers.reduce((sum, paper) => sum + +paper.resultScore, 0)
            }
        },
        departmentMinScore (dept) {
            const validPapers = this.paperList.filter(paper => paper.positionName.split(',').includes(dept) && paper.resultScore !== '/')
            const scores = validPapers.map(paper => +paper.resultScore)
            return scores.length ? Math.min(...scores) : 0
        },
        // 数据统计
        showStatistics () {
            let deptList = this.paperList.map(paper => paper.positionName).join(',').split(',')
            deptList = [...new Set(deptList)]
            this.departmentData = deptList.map(item => {
                const plannedAttendees = this.deptJoined(item)
                const actualAttendees = this.deptFinished(item)
                const PassPeople = this.deptPassRate(item)
                const score = this.deptScore(item)

                return {
                    department: item,
                    plannedAttendees,
                    actualAttendees,
                    joinRate: actualAttendees / plannedAttendees,
                    minScore: score.min,
                    maxScore: score.max,
                    passRate: actualAttendees === 0 ? 0 : PassPeople / actualAttendees,
                    avgScore: actualAttendees === 0 ? 0 : score.sum / actualAttendees
                }
            })
            this.$refs.statisticsRef.open()
        },
        // 导出统计数据
        exportData () {
            const exportColumns = [
                {
                    field_name: 'userName',
                    label: '考生姓名',
                    name: 'userName'
                },
                {
                    field_name: 'positionName',
                    label: '部门',
                    name: 'positionName'
                },
                {
                    field_name: 'examCount',
                    label: '参考次数',
                    name: 'examCount'
                },
                {
                    field_name: 'finishCount',
                    label: '完成次数',
                    name: 'finishCount'
                },
                {
                    field_name: 'max',
                    label: '最高得分',
                    name: 'max'
                },
                {
                    field_name: 'min',
                    label: '最低得分',
                    name: 'min'
                },
                {
                    field_name: 'avg',
                    label: '平均得分',
                    name: 'avg'
                },
                {
                    field_name: 'latest',
                    label: '最近得分',
                    name: 'latest'
                },
                {
                    field_name: 'resultScore',
                    label: '最终成绩',
                    name: 'resultScore'
                },
                {
                    field_name: 'isQualified',
                    label: '是否达标',
                    name: 'isQualified'
                }
            ]
            this.handleExport(exportColumns, this.filterPaperList, `考试【${this.paperData.examName}】统计数据`)
        },
        handleExport (columns, data, title, message, nameKey = 'name') {
            IbpsExport.excel({
                columns: columns,
                data: data,
                nameKey: nameKey,
                title: title
            }).then(() => {
                const msg = message || '导出成功'
                ActionUtils.success(msg)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .paper-detail-dialog {
        ::v-deep {
            .el-dialog__body {
                position: relative;
                height: calc(100vh - 115px);
                width: 1080px;
                margin: 0 auto;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .el-radio, .el-checkbox {
                    display: block;
                    margin-bottom: 10px;
                    pointer-events: none;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                .el-radio-button {
                    pointer-events: none;
                }
                .el-radio__label, .el-checkbox__label {
                    font-size: 16px;
                    white-space: normal;
                    line-height: 1.5;
                }
                .el-input {
                    margin-bottom: 10px;
                    pointer-events: none;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                .el-tag {
                    margin-right: 0;
                }
                .ibps-p-0 {
                    margin: 0;
                    .list-group {
                        display: inline-block;
                        width: 100%;
                    }
                }
            }
            .el-dialog__header {
                text-align: center;
            }
        }
        .container {
            position: relative;
            height: calc(100vh - 160px);
            padding: 20px;
            .paper-info {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                margin-bottom: 20px;
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
                font-size: 16px;
            }

            .info-item {
                width: 33.3%;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                .label {
                    width: 100px;
                    font-weight: bold;
                    color: #333;
                }
                .value {
                    flex: 1;
                    color: #666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .paper-table {
                .exam-table-header {
                    text-align: center;
                }
                ::v-deep {
                    .el-table {
                        th {
                            font-size: 14px !important;
                            text-align: center;
                        }
                        td {
                            font-size: 14px !important;
                        }
                        .el-table__row {
                            cursor: pointer;
                        }
                    }
                }
            }
            .paper-status {
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>
