<template>
    <el-dialog
        v-loading="loading"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog paper-judge-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <div class="container">
            <div class="question">
                <div
                    v-for="(item, index) in questionList"
                    v-show="showIndex === index + 1"
                    :key="index"
                    class="question-item"
                >
                    <div class="type">{{ item.questionType }}</div>
                    <div class="stem">
                        <span>{{ `【${index + 1}】${item.stem}` }}</span>
                        <el-tag type="info" size="small">{{ `${item.score}分` }}</el-tag>
                    </div>
                    <div v-if="item.img && item.img.length" class="img">
                        <ibps-image
                            v-model="item.img"
                            height="100"
                            width="100"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                            download
                            disabled
                        />
                    </div>
                    <div class="answer">
                        <div class="mine">
                            <div class="title">考生答案：</div>
                            <div class="content">
                                <el-input
                                    v-for="(o, i) in item.answer"
                                    :key="`${index}${i}`"
                                    :value="o"
                                    :type="item.questionType === '简答题' ? 'textarea' : 'text'"
                                    :rows="item.questionType === '简答题' ? 12 : 1"
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="right">
                            <div class="title">参考答案：</div>
                            <div class="content">
                                <el-input
                                    v-for="(o, i) in item.rightKey"
                                    :key="`${index}${i}`"
                                    :value="o"
                                    :type="item.questionType === '简答题' ? 'textarea' : 'text'"
                                    :rows="item.questionType === '简答题' ? 12 : 1"
                                    readonly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="result">
                        <div class="title">试题得分
                            <el-tooltip effect="dark" content="请输入根据考生答案与参考答案给出题目得分" placement="top">
                                <i class="el-icon-question" />
                            </el-tooltip>
                        </div>
                        <el-tooltip effect="dark" content="错误，该题计0分" placement="top">
                            <el-button type="danger" icon="el-icon-close" circle @click="changeScore(index, 0)" />
                        </el-tooltip>
                        <el-input-number
                            v-model="item.resultScore"
                            :min="0"
                            :max="item.score"
                            :precision="1"
                            class="score-input"
                            placeholder=""
                        />
                        <el-tooltip effect="dark" content="正确，该题计满分" placement="top">
                            <el-button type="success" icon="el-icon-check" circle @click="changeScore(index, item.score)" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="取消已有评分，未评分的题目不会被提交" placement="top">
                            <el-button type="warning" icon="el-icon-delete" @click="changeScore(index, undefined)">取消评分</el-button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <div class="question-link">
                <div
                    v-for="(item, index) in questionList"
                    :key="index"
                    class="link-item"
                    :class="setClassName(item, index)"
                    @click="showIndex = index + 1"
                >{{ index + 1 }}</div>
            </div>
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
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        return {
            title: '试题评阅',
            dialogVisible: this.visible,
            loading: false,
            toolbars: [
                {
                    key: 'prev',
                    icon: 'ibps-icon-chevron-left',
                    label: '上一题',
                    disabled: () => {
                        return this.showIndex === 1
                    }
                },
                {
                    key: 'next',
                    icon: 'ibps-icon-chevron-right',
                    label: '下一题',
                    disabled: () => {
                        return this.showIndex === this.questionList.length
                    }
                },
                {
                    key: 'submit',
                    icon: 'ibps-icon-send',
                    label: '提交',
                    hidden: () => {
                        return this.readonly
                    }
                },
                { key: 'cancel', label: '退出' }
            ],
            questionList: [],
            showIndex: 1,
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
            // immediate: true
        },
        showIndex: {
            handler (val, oldVal) {
                const temp = this.questionList[oldVal - 1]
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
            this.questionList = await this.getQuestionData()
            console.log(this.questionList)
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'prev':
                    this.showIndex--
                    break
                case 'next':
                    this.showIndex++
                    break
                case 'submit':
                    this.handleSubmit()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        getQuestionData () {
            this.loading = true
            const param = this.id ? ` and find_in_set(exam_id_, '${this.id}')` : ''
            const sql = `select id_ as dataId, parent_id_ as paperId, ti_mu_id_ as questionId, ti_gan_ as stem, ti_xing_ as questionType, fu_tu_ as img, xuan_xiang_lei_xi as optionType, fen_zhi_ as score, ping_fen_fang_shi as rateType, ping_fen_ren_ as rater, hui_da_ as answer, can_kao_da_an_ as rightKey, shi_fou_yi_yue_ as isRate from t_examination_detail where ping_fen_ren_ = '${this.userId}' and shi_fou_yi_yue_ = '否' and parent_id_ in (select id_ from t_examination where zhuang_tai_ = '已交卷'${param}) order by field(ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        this.$message.error('获取题目信息失败！')
                        return this.closeDialog()
                    }
                    data.map(item => {
                        if (item.questionType === '填空题') {
                            item.rightKey = item.rightKey ? JSON.parse(item.rightKey) : []
                            item.answer = item.answer ? JSON.parse(item.answer) : Array(item.rightKey.length).fill('')
                        } else {
                            item.answer = [item.answer]
                            item.rightKey = [item.rightKey]
                        }
                        item.score = parseInt(item.score)
                        item.img = item.img ? JSON.parse(item.img) : ''
                        item.resultScore = undefined
                    })
                    this.loading = false
                    resolve(data)
                }).catch(error => {
                    this.loading = false
                    reject(error)
                })
            })
        },
        setClassName (item, index) {
            const result = []
            if (item.resultScore !== undefined) {
                result.push('finished')
            }
            if (this.showIndex === index + 1) {
                result.push('active')
            }
            return result.join(' ')
        },
        handleKeyPress (event) {
            if (event.keyCode === 37 || event.key === 'ArrowLeft') {
                if (this.showIndex === 1) {
                    this.$message.warning('已经是第一题了！')
                    return
                }
                this.showIndex--
            } else if (event.keyCode === 39 || event.key === 'ArrowRight') {
                if (this.showIndex === this.questionList.length) {
                    this.$message.warning('已经是最后一题了！')
                    return
                }
                this.showIndex++
            } else if (event.keyCode === 27 || event.key === 'Esc') {
                this.closeDialog()
            }
        },
        changeScore (index, score) {
            this.questionList[index].resultScore = score
            if (this.showIndex !== this.questionList.length) {
                this.showIndex++
            }
        },
        getScore ({ questionType, answer, rightKey, score }) {
            if (questionType === '多选题') {
                const temp = JSON.parse(rightKey)
                return answer.length === temp.length && answer.every(i => temp.includes(i)) ? score : 0
            } else {
                return answer === rightKey ? score : 0
            }
        },
        dealData (data) {
            const paperIdList = []
            const updList = []
            const time = this.$common.getDateNow(19)
            data.forEach(item => {
                if (paperIdList.indexOf(item.paperId) === -1) {
                    paperIdList.push(item.paperId)
                }
                updList.push({
                    where: {
                        id_: item.dataId
                    },
                    param: {
                        shi_fou_yi_yue_: '是',
                        ping_yue_shi_jian: time,
                        de_fen_: item.resultScore
                    }
                })
            })
            return { updList, paperIdList }
        },
        handleSubmit () {
            const completeList = this.questionList.filter(item => item.resultScore !== undefined && item.resultScore !== null && item.resultScore !== '')
            console.log(completeList)
            if (!completeList.length) {
                return this.$message.warning('您还未评阅试题！')
            }
            this.$confirm('提交后已评阅试题将不再显示，是否确认提交？', '提示', {
                type: 'info',
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                const submitData = this.dealData(completeList)
                this.submitForm(submitData)
            }).catch(() => {})
        },
        submitForm ({ updList, paperIdList }) {
            const updateParams = {
                tableName: 't_examination_detail',
                updList
            }
            console.log(updateParams)
            this.$common.request('update', updateParams).then(() => {
                this.$message.success('提交成功！')
                this.updatePaperInfo(paperIdList.join(','))
                this.closeDialog()
            })
        },
        updatePaperInfo (ids) {
            const sql = `select parent_id_ as paperId, shi_fou_yi_yue_ as isRate, de_fen_ as score from t_examination_detail where find_in_set(parent_id_, '${ids}')`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    return
                }
                const temp = {}
                data.forEach(item => {
                    if (temp[item.paperId]) {
                        temp[item.paperId].push(item)
                    } else {
                        temp[item.paperId] = [item]
                    }
                })
                const updateObj = {}
                Object.keys(temp).forEach(key => {
                    const isAllRate = temp[key].every(item => item.isRate === '是')
                    if (isAllRate) {
                        updateObj[key] = [{
                            where: { id_: key },
                            param: {
                                zhuang_tai_: '已完成',
                                de_fen_: temp[key].reduce((sum, item) => sum + parseFloat(item.score), 0)
                            }
                        }]
                    }
                })
                console.log(updateObj)
                // return
                Object.keys(updateObj).forEach(key => {
                    const updateParams = {
                        tableName: 't_examination',
                        updList: updateObj[key]
                    }
                    this.$common.request('update', updateParams)
                })
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .paper-judge-dialog {
        ::v-deep {
            .el-dialog__body {
                height: calc(100vh - 55px);
                width: 1080px;
                margin: 0 auto;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .el-radio {
                    display: block;
                    margin-bottom: 10px;
                }
                .el-radio__label, .el-checkbox__label {
                    font-size: 16px;
                    white-space: normal;
                    line-height: 1.5;
                }
                .el-input {
                    margin-bottom: 10px;
                }
                .el-tag {
                    margin-right: 0;
                }
                .list-group {
                    display: inline-block;
                    width: 100%;
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
            .question {
                font-size: 16px;
                .question-item {
                    margin-bottom: 10px;
                    .type {
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 20px;
                    }
                    .stem {
                        display: flex;
                        margin-bottom: 20px;
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
                        border: 1px solid #ccc;
                        display: flex;
                        .mine, .right {
                            flex: 1;
                            padding: 10px;
                            .title {
                                font-size: 16px;
                                color: #01a39e;
                                margin-bottom: 10px;
                            }
                        }
                        .mine {
                            background-color: #f5f5f5;
                            border-right: 1px solid #ccc;
                        }
                    }
                    .result {
                        margin-top: 20px;
                        .title {
                            display: inline-block;
                            font-size: 16px;
                            margin-right: 20px;
                            margin-bottom: 0;
                        }
                        .score-input {
                            margin: 0 10px;
                            width: 150px;
                        }
                    }
                }
            }
            .question-link {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                position: absolute;
                width: calc(100% - 40px);
                bottom: 20px;
                height: 80px;
                overflow-y: auto;
                .el-progress {
                    width: 100%;
                    margin-bottom: 10px;
                }
                .link-item {
                    width: 32px;
                    height: 32px;
                    text-align: center;
                    line-height: 32px;
                    border: 1px solid #DCDFE6;
                    margin: 3px;
                    border-radius: 2px;
                    cursor: pointer;
                    &:hover {
                        background-color: #F5F7FA;
                    }
                }
                $button-themes: (
                    active: (#409EFF, #fff, #409EFF),
                    incomplete: (#E6A23C, #fff, #E6A23C),
                    finished: (#67C23A, #fff, #67C23A)
                );
                @each $theme, $colors in $button-themes {
                    .#{$theme} {
                        background-color: nth($colors, 1);
                        color: nth($colors, 2);
                        border-color: nth($colors, 3);

                        &:hover {
                            background-color: lighten(nth($colors, 1), 10%);
                            border-color: lighten(nth($colors, 1), 10%);
                        }
                    }
                }
            }
        }
    }
</style>
