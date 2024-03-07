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
                    <span class="label">题库名称：</span>
                    <span class="value">{{ paperData.paperName }}</span>
                </div>
                <div class="info-item">
                    <span class="label">题目数量：</span>
                    <span class="value">{{ paperData.totalCount }}</span>
                </div>
                <div class="info-item">
                    <span class="label">总分</span>
                    <span class="value">{{ paperData.totalScore }}分</span>
                </div>
                <div class="info-item">
                    <span class="label">达标分数占比：</span>
                    <span class="value">{{ paperData.qualifiedRadio }}%</span>
                </div>
                <div class="info-item">
                    <span class="label">计分方式：</span>
                    <span class="value">{{ paperData.scoringType }}</span>
                </div>
                <div class="info-item">
                    <span class="label">得分：</span>
                    <span class="value">{{ paperData.status !== '已完成' ? '未评分' : `${paperData.resultScore}分` }}</span>
                </div>
                <div class="info-item">
                    <span class="label">报考时间：</span>
                    <span class="value">{{ paperData.applyTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">开考时间：</span>
                    <span class="value">{{ paperData.startTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">结束时间：</span>
                    <span class="value">{{ paperData.endTime }}</span>
                </div>
                <div class="info-item">
                    <span class="label">考生姓名：</span>
                    <span class="value">{{ transformUser(paperData.examinee) }}</span>
                </div>
                <div class="info-item">
                    <span class="label">部门：</span>
                    <span class="value">{{ paperData.dept }}</span>
                </div>
            </div>
            <div class="question">
                <div
                    v-for="(item, index) in paperData.list"
                    :key="index"
                    class="question-item"
                >
                    <div class="type">{{ item.type }}<el-tag type="primary" size="small" class="score">{{ `共${item.totalScore}分` }}</el-tag></div>
                    <div
                        v-for="(q, qIndex) in item.questions"
                        :key="`${index}${qIndex}`"
                        class="card"
                    >
                        <div class="stem">
                            <span>{{ `【${qIndex + 1}】${q.stem}` }}</span>
                            <el-tag type="info" size="small">{{ `${q.questionScore}分` }}</el-tag>
                        </div>
                        <div v-if="q.img && q.img.length" class="img">
                            <ibps-image
                                v-model="q.img"
                                height="100"
                                width="100"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                                download
                                disabled
                            />
                        </div>
                        <div class="answer">
                            <div class="mine">
                                <div class="title">考生答案：<el-tag type="success" size="small" class="score">{{ !q.score && q.score !== '0' ? '未评分' : `得${q.score}分` }}</el-tag></div>
                                <div class="answer-content">
                                    <el-radio-group v-if="q.questionType === '单选题'" :value="q.answer">
                                        <el-radio
                                            v-for="(o, i) in q.options"
                                            :key="`${index}${qIndex}${i}`"
                                            :label="o.label"
                                        >{{ `${o.label}.${o.value}` }}</el-radio>
                                    </el-radio-group>
                                    <el-checkbox-group v-else-if="q.questionType === '多选题'" :value="q.answer">
                                        <el-checkbox
                                            v-for="(o, i) in q.options"
                                            :key="`${index}${qIndex}${i}`"
                                            :label="o.label"
                                        >{{ `${o.label}.${o.value}` }}</el-checkbox>
                                    </el-checkbox-group>
                                    <el-radio-group v-else-if="q.questionType === '判断题'" :value="q.answer">
                                        <el-radio-button label="√">√</el-radio-button>
                                        <el-radio-button label="×">×</el-radio-button>
                                    </el-radio-group>
                                    <template v-else>
                                        <el-input
                                            v-for="(o, i) in q.answer"
                                            :key="`${index}${qIndex}${i}`"
                                            :value="o"
                                            :type="q.questionType === '简答题' ? 'textarea' : 'text'"
                                            :rows="q.questionType === '简答题' ? 12 : 1"
                                            readonly
                                        />
                                    </template>
                                </div>
                            </div>
                            <div class="right">
                                <div class="title">参考答案：</div>
                                <div class="answer-content">
                                    <el-radio-group v-if="q.questionType === '单选题'" :value="q.rightKey">
                                        <el-radio
                                            v-for="(o, i) in q.options"
                                            :key="`${index}${qIndex}${i}`"
                                            :label="o.label"
                                        >{{ `${o.label}.${o.value}` }}</el-radio>
                                    </el-radio-group>
                                    <el-checkbox-group v-else-if="q.questionType === '多选题'" :value="q.rightKey">
                                        <el-checkbox
                                            v-for="(o, i) in q.options"
                                            :key="`${index}${qIndex}${i}`"
                                            :label="o.label"
                                        >{{ `${o.label}.${o.value}` }}</el-checkbox>
                                    </el-checkbox-group>
                                    <el-radio-group v-else-if="q.questionType === '判断题'" :value="q.rightKey">
                                        <el-radio-button label="√">√</el-radio-button>
                                        <el-radio-button label="×">×</el-radio-button>
                                    </el-radio-group>
                                    <template v-else>
                                        <el-input
                                            v-for="(o, i) in q.rightKey"
                                            :key="`${index}${qIndex}${i}`"
                                            :value="o"
                                            :type="q.questionType === '简答题' ? 'textarea' : 'text'"
                                            :rows="q.questionType === '简答题' ? 12 : 1"
                                            readonly
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="date-line">
            <el-timeline>
                <el-timeline-item
                    v-for="(paper, index) in paperList"
                    :key="index"
                    :timestamp="paper.applyTime"
                    :icon="paper.status === '已完成' ? 'el-icon-circle-check' : 'el-icon-view'"
                    :type="paper.status === '已完成' ? 'success' : 'primary'"
                    placement="top"
                    size="large"
                >
                    <el-card class="timeline-card" :class="paper.dataId === showPaperId ? 'active-card' : ''" @click.native="changePaper(paper.dataId)">
                        <div class="card-item">{{ `开始时间：${paper.startTime}` }}</div>
                        <div class="card-item">{{ `结束时间：${paper.endTime}` }}</div>
                        <div v-if="paper.status === '已完成'" class="card-item">
                            <span>{{ `得分：${paper.resultScore}` }}</span>
                            <el-tag :type="paper.isQualified ? 'success' : 'danger'" size="mini" class="score">{{ paper.isQualified ? `达标` : '未达标' }}</el-tag>
                            <el-tag v-if="paper.resultScore === maxScore" type="success" size="mini" class="score">{{ `最高分` }}</el-tag>
                            <el-tag v-if="paper.resultScore === minScore" type="warning" size="mini" class="score">{{ `最低分` }}</el-tag>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>

<script>
export default {
    components: {
        IbpsImage: () => import('@/business/platform/file/image')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        paperId: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        return {
            title: '考试详情',
            dialogVisible: this.visible,
            toolbars: [
                { key: 'cancel', label: '退出' }
            ],
            paperList: [],
            paperData: [],
            maxScore: '',
            minScore: '',
            showPaperId: '',
            userId
        }
    },
    computed: {
        formData () {
            return this.data
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
            if (!this.paperId) {
                this.$message.error('获取题目信息失败，请重试！')
                this.closeDialog()
                return
            }
            this.paperList = await this.getQuestionData()
            this.paperData = this.paperList.find(i => i.dataId === this.id)
            this.showPaperId = this.id
            console.log(this.paperData)
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
        transformUser (userId) {
            const { userList = [] } = this.$store.getters
            const user = userList.find(u => u.userId === userId) || {}
            return user.userName || '-'
        },
        getQuestionData () {
            const sql = `select e.id_ as dataId, e.kao_shi_ren_ as examinee, e.bu_men_ as dept, e.zhuang_tai_ as status, e.bao_ming_shi_jian as applyTime, e.kai_shi_shi_jian_ as startTime, e.jie_shu_shi_jian_ as endTime, e.ti_ku_zong_fen_ as totalScore, e.da_biao_zhan_bi_ as qualifiedRadio, e.de_fen_ as resultScore, ed.ti_mu_id_ as questionId, ed.ti_gan_ as stem, ed.ti_xing_ as questionType, ed.fen_zhi_ as questionScore, ed.fu_tu_ as img, ed.xuan_xiang_lei_xi as optionsType, ed.xuan_xiang_ as options, ed.can_kao_da_an_ as rightKey, ed.ping_fen_fang_shi as rateType, ed.ping_fen_ren_ as rater, ed.hui_da_ as answer, ed.ping_yue_shi_jian as rateTime, ed.de_fen_ as score, ed.jie_xi_ as analysis, q.ti_ku_ming_cheng_ as paperName, q.ji_fen_fang_shi_ as scoringType from t_examination e, t_examination_detail ed, t_question_bank q where e.id_ = ed.parent_id_ and e.ti_ku_id_ = q.id_ and e.ti_ku_id_ = '${this.paperId}' and (e.zhuang_tai_ = '已完成' or e.zhuang_tai_ = '已交卷') order by field(ed.ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        this.$message.error('获取题目信息失败！')
                        this.closeDialog()
                        return
                    }
                    const result = []
                    data.map(item => {
                        // 数据转换
                        if (['单选题', '多选题'].includes(item.questionType)) {
                            item.options = JSON.parse(item.options)
                            item.rightKey = item.questionType === '多选题' ? item.rightKey.split(',') : item.rightKey
                            item.answer = item.questionType === '多选题' ? JSON.parse(item.answer) : item.answer
                        } else if (item.questionType === '填空题') {
                            item.rightKey = item.rightKey ? JSON.parse(item.rightKey) : []
                            item.answer = item.answer ? JSON.parse(item.answer) : Array(item.rightKey.length).fill('')
                        } else if (item.questionType === '简答题') {
                            item.rightKey = [item.rightKey]
                            item.answer = [item.answer]
                        }
                        item.img = item.img ? JSON.parse(item.img) : ''

                        // 数据分组
                        const index = result.findIndex(i => i.dataId === item.dataId)
                        if (index === -1) {
                            const { dataId, examinee, dept, status, applyTime, startTime, endTime, qualifiedRadio, paperName, totalScore, resultScore, scoringType } = item || {}
                            result.push({
                                dataId,
                                examinee,
                                dept,
                                status,
                                applyTime,
                                startTime,
                                endTime,
                                qualifiedRadio,
                                isQualified: status === '已完成' ? parseFloat(resultScore) >= (parseFloat(qualifiedRadio) / 100 * parseFloat(totalScore)) : '',
                                paperName,
                                totalScore: parseFloat(resultScore),
                                resultScore: parseFloat(resultScore),
                                totalCount: data.length,
                                scoringType,
                                list: [{
                                    type: item.questionType,
                                    questions: [item]
                                }]
                            })
                        } else {
                            const qIndex = result[index].list.findIndex(i => i.type === item.questionType)
                            if (qIndex === -1) {
                                result[index].list.push({
                                    type: item.questionType,
                                    questions: [item]
                                })
                            } else {
                                result[index].list[qIndex].questions.push(item)
                            }
                        }
                    })
                    result.forEach(item => {
                        item.list.forEach(i => {
                            i.totalScore = i.questions.reduce((a, b) => a + parseFloat(b.questionScore), 0)
                        })
                    })
                    // 获取最高分最低分
                    const { maxScore, minScore } = result.filter(i => i.status === '已完成').reduce((acc, curr) => {
                        if (curr.resultScore > acc.maxScore) {
                            acc.maxScore = curr.resultScore
                        }
                        if (curr.resultScore < acc.minScore) {
                            acc.minScore = curr.resultScore
                        }
                        return acc
                    }, { maxScore: -Infinity, minScore: Infinity })
                    this.maxScore = maxScore
                    this.minScore = minScore
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        changePaper (id) {
            this.showPaperId = id
            this.paperData = this.paperList.find(i => i.dataId === id)
            console.log(id)
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
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                .label {
                    width: 120px;
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

            .question {
                font-size: 16px;
                .question-item {
                    padding-top: 20px;
                    &:last-child {
                        padding-bottom: 20px;
                    }
                    .card {
                        padding-bottom: 10px;
                        &:last-child {
                            padding-bottom: 0;
                        }
                    }
                    .type {
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 20px;
                        .score {
                            margin-left: 10px;
                            vertical-align: bottom;
                        }
                    }
                    .stem {
                        display: flex;
                        margin-bottom: 10px;
                        align-items: flex-start;
                        > span:first-child {
                            line-height: 1.5;
                            margin-right: 10px;
                        }
                    }
                    .img {
                        position: relative;
                        width: 100%;
                        margin-bottom: 10px;
                    }
                    .answer {
                        display: flex;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        .mine, .right {
                            flex: 1;
                            padding: 10px;
                            .title {
                                font-size: 16px;
                                color: #01a39e;
                                margin-bottom: 10px;
                                .score {
                                    vertical-align: middle;
                                }
                            }
                        }
                        .mine {
                            background-color: #f5f5f5;
                            border-right: 1px solid #ccc;
                        }
                    }
                }
            }
        }
        .date-line {
            position: fixed;
            width: 280px;
            height: calc(100vh - 120px);
            overflow-y: auto;
            top: 60px;
            left: calc(50vw + 540px);
            ::v-deep {
                .el-timeline {
                    padding-left: 10px;
                }
                .el-card__body {
                    padding: 10px 10px;
                }
                .el-tag {
                    margin-left: 5px;
                }
            }
            .timeline-card {
                cursor: pointer;
                .card-item {
                    margin-bottom: 10px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
            .active-card {
                box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 1);
            }
        }
    }
    @media screen and (max-width: 1600px) {
        .paper-detail-dialog {
            ::v-deep {
                .el-dialog__body {
                    width: 880px;
                }
            }
            .date-line {
                left: calc(50vw + 440px);
            }
        }
    }
    @media screen and (max-width: 1400px) {
        .paper-detail-dialog {
            ::v-deep {
                .el-dialog__body {
                    width: 800px;
                }
            }
            .date-line {
                left: calc(50vw + 400px);
            }
        }
    }
</style>
