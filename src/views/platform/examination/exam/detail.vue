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
                    <span class="label">参考人数：</span>
                    <span class="value">{{ paperList.length }}</span>
                </div>
                <div class="info-item">
                    <span class="label">题库名称：</span>
                    <span class="value">{{ paperData.bankName }}</span>
                </div>
                <div class="info-item">
                    <span class="label">题目数量：</span>
                    <span class="value">{{ paperData.totalCount }}</span>
                </div>
                <div class="info-item">
                    <span class="label">总分：</span>
                    <span class="value">{{ paperData.totalScore }}分</span>
                </div>
                <div class="info-item">
                    <el-tooltip effect="dark" content="达标分值占总分的比率" placement="top">
                        <span class="label">达标占比：</span>
                    </el-tooltip>
                    <span class="value">{{ paperData.qualifiedRadio }}%</span>
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
                    <span class="label">达标率：</span>
                    <span class="value">-</span>
                </div>
            </div>
            <div class="paper-table">
                <el-table
                    ref="elTable"
                    :data="paperList"
                    border
                    stripe
                    highlight-current-row
                    header-row-class-name="exam-table-header"
                    style="width: 100%"
                    class="exam-table"
                    @row-dblclick="handleRowDblclick"
                >
                    <el-table-column label="序号" type="index" width="50" />
                    <el-table-column
                        prop="userName"
                        label="考生姓名"
                        width="100"
                    />
                    <el-table-column
                        prop="count"
                        label="参考次数/完成次数"
                        width="90"
                    />
                    <el-table-column
                        prop=""
                        label="考试成绩"
                    >
                        <el-table-column
                            prop="max"
                            label="最高得分"
                            width="90"
                        />
                        <el-table-column
                            prop="min"
                            label="最低得分"
                            width="90"
                        />
                        <el-table-column
                            prop="avg"
                            label="平均得分"
                            width="90"
                        />
                        <el-table-column
                            prop="latest"
                            label="最近得分"
                            width="90"
                        />
                    </el-table-column>
                    <el-table-column
                        prop="latest"
                        label="最终成绩"
                        width="90"
                    />
                    <el-table-column prop="isQualified" label="是否达标">
                        <template slot-scope="scope">
                            <el-tag :type="getTagType(scope.row)" size="medium" class="score">{{ scope.row.isQualified }}</el-tag>
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
            </div>
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
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
    </el-dialog>
</template>

<script>
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
        PaperDetail: () => import('../questionBank/detail')
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
        return {
            title: '考试详情',
            dialogVisible: this.visible,
            paperDialogVisible: false,
            toolbars: [
                { key: 'cancel', label: '退出' }
            ],
            paperList: [],
            paperData: [],
            paperId: '',
            examineeId: '',
            maxScore: '',
            minScore: '',
            avgScore: ''
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
            const { userList = [] } = this.$store.getters
            const user = userList.find(u => u.userId === userId) || {}
            return user.userName || '-'
        },
        transformTime (timeStamp) {
            if (timeStamp === '不限') return timeStamp
            const hours = Math.floor(parseInt(timeStamp) / 3600000)
            const minutes = Math.floor((parseInt(timeStamp) % 3600000) / 60000)
            return hours + '小时' + minutes + '分钟'
        },
        getQuestionData () {
            const sql = `select qb.ti_ku_ming_cheng_ as bankName, ex.id_ as examId, ex.ti_ku_id_ as bankId, e.id_ as paperId, ex.zhuang_tai_ as examState, e.zhuang_tai_ as paperState, qb.ti_shu_ as questionCount, qb.zong_fen_ as totalScore, ex.kao_shi_ming_chen as examName, ex.can_kao_ren_yuan_ as examinee, e.kao_shi_ren_ as examineeId, ex.create_by_ as createBy, ex.chuang_jian_shi_j as createTime, ex.fa_bu_shi_jian_ as publishDate, ex.xian_kao_shi_jian as limitDate, ex.kao_shi_shi_chang as duration, ex.xian_kao_ci_shu_ as limitCount, ex.da_biao_zhan_bi_ as qualifiedRadio, ex.ji_fen_fang_shi_ as scoringType, ex.yun_xu_bao_ming_ as allowRegist, ex.kao_shi_miao_shu_ as examDesc, e.de_fen_ as score, e.bao_ming_shi_jian as applyTime, e.kai_shi_shi_jian_ as startTime, e.jie_shu_shi_jian_ as endTime from t_exams ex, t_question_bank qb, t_examination e where ex.ti_ku_id_ = qb.id_ and e.exam_id_ = ex.id_ and ex.id_ = '${this.examId}' order by e.kao_shi_ren_ desc, e.jie_shu_shi_jian_ desc`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        this.$message.error('未查询到已提交的考试记录，请先完成考试！')
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
                                totalScore: parseFloat(item.totalScore),
                                statusList: [item.paperState],
                                scoreList: [parseFloat(item.score || -1)]
                            })
                        } else {
                            result[index].scoreList.push(parseFloat(item.score || -1))
                            result[index].statusList.push(item.paperState)
                        }
                    })
                    const nodatadesc = '无已完成考试'
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
                    this.avgScore = finishList.length ? meanBy(finishList, 'avg').avg : nodatadesc
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleRowDblclick (row) {
            console.log('???')
            this.paperId = row.paperId
            this.examineeId = row.examineeId
            this.paperDialogVisible = true
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
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
        }
    }
</style>
