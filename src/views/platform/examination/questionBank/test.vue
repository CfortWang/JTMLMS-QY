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
        class="dialog test-dialog"
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
                        <el-radio-group v-if="item.questionType === '单选题'" v-model="item.answer" @change="goNext">
                            <el-radio
                                v-for="(o, i) in item.options"
                                :key="`${index}${i}`"
                                :label="o.label"
                            >{{ `${o.label}.${o.value}` }}</el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="item.questionType === '多选题'" v-model="item.answer" @change="changeOptions">
                            <el-checkbox
                                v-for="(o, i) in item.options"
                                :key="`${index}${i}`"
                                :label="o.label"
                            >{{ `${o.label}.${o.value}` }}</el-checkbox>
                        </el-checkbox-group>
                        <el-radio-group v-else-if="item.questionType === '判断题'" v-model="item.answer" @change="goNext">
                            <el-radio-button label="√">√</el-radio-button>
                            <el-radio-button label="×">×</el-radio-button>
                        </el-radio-group>
                        <template v-else-if="item.questionType === '填空题'">
                            <el-input
                                v-for="(o, i) in item.options"
                                :key="`${index}${i}`"
                                v-model="o.answer"
                                type="text"
                                placeholder="请输入您的答案"
                            />
                        </template>
                        <el-input
                            v-else-if="item.questionType === '简答题'"
                            v-model="item.answer"
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 8}"
                            placeholder="请输入您的答案"
                        />
                    </div>
                </div>
            </div>
            <div class="question-link">
                <el-progress
                    type="line"
                    class="progress"
                    :text-inside="true"
                    :stroke-width="20"
                    :percentage="getProgress()"
                />
                <div
                    v-for="(item, index) in questionList"
                    :key="index"
                    class="link-item"
                    :class="setClassName(item, index)"
                    @click="showIndex = index + 1"
                >{{ index + 1 }}</div>
            </div>
        </div>
        <div class="tips">
            <div>温馨提示：最下方题序方块无背景颜色时，表示该题还未作答；<br>题序方块背景颜色为<span style="background: #409EFF;">蓝色</span>时，表示题序对应题母为当前显示的题目；<br>题序方块背景颜色为<span style="background: #E6A23C;">黄色</span>时，表示该题已作答但是未完全答完（如填空题）；<br>题序方块背景颜色为<span style="background: #67C23A;">绿色</span>时，表示该题已作答完成。</div>
        </div>
        <div slot="title" class="custom-title">
            <div class="dialog-title">{{ title }}</div>
            <div class="countdown">
                <div class="desc">⏲距离考试结束还有：{{ formattedCountdown }}</div>
                <div class="countdown-tips">超时将自动提交, 请注意考试时间！</div>
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
// import Watermark from '@/layout/header-aside/components/header-message/watermark/watermark-cont'
import { round } from 'lodash'
export default {
    components: {
        IbpsImage: () => import('@/business/platform/file/image')
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
        id: {
            type: String,
            default: ''
        },
        examData: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        const { duration } = this.examData || {}
        const countdown = duration === '不限' ? 0 : parseInt(duration / 1000)
        return {
            countdown,
            title: this.examData.examName || '参加考试',
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
                    label: '交卷',
                    hidden: () => {
                        return this.readonly
                    }
                },
                { key: 'cancel', label: '退出' }
            ],
            questionList: [],
            showIndex: 1,
            userId,
            countdownNotify: false
        }
    },
    computed: {
        formData () {
            return this.data
        },
        formattedCountdown () {
            const h = this.formatNum(parseInt(this.countdown / 60 / 60))
            const m = this.formatNum(parseInt(this.countdown / 60 % 60))
            const s = this.formatNum(parseInt(this.countdown % 60))
            return `${h}时${m}分${s}妙`
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
                if (['填空题'].includes(temp.questionType)) {
                    temp.answer = temp.options.map(item => item.answer)
                }
            }
        }
    },
    mounted () {
        this.loadData()
        this.startCountdown()
        // Watermark.set(`123`, `123123`)
        // 监听键盘事件
        window.addEventListener('keyup', this.handleKeyPress)
        window.addEventListener('beforeunload', this.handleBeforeUnload)
    },
    beforeDestroy () {
        window.removeEventListener('keyup', this.handleKeyPress)
        window.removeEventListener('beforeunload', this.handleBeforeUnload)
        clearInterval(this.timer)
        // Watermark.set('', '')
    },
    methods: {
        // 获取题库数据
        async loadData () {
            if (!this.bankId) {
                this.$message.error('获取题目信息失败，请重试！')
                this.closeDialog()
                return
            }
            this.questionList = await this.getQuestionData()
            // console.log(this.questionList)
        },
        startCountdown () {
            const timer = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--
                    // 判断是否到达指定时间
                    if (this.countdown <= 60 && !this.countdownNotify) {
                        this.$notify({
                            title: '温馨提示',
                            message: `距离自动提交还有${this.countdown}秒，如有未完成的试题，请尽快填写答案！`,
                            type: 'warning'
                        })
                        this.countdownNotify = true
                    }
                    if (this.countdown === 0) {
                        this.submitForm(this.dealFormData())
                        clearInterval(timer)
                    }
                }
            }, 1000)
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
                    this.handleCancel()
                    break
                default:
                    break
            }
        },
        formatNum (num) {
            return num < 10 ? `0${num}` : num
        },
        getQuestionData () {
            this.loading = true
            const sql = `select id_ as questionId, ti_gan_ as stem, ti_xing_ as questionType, fu_tu_ as img, xuan_xiang_lei_xi as optionType, da_an_ as options, xuan_xiang_shu_ as optionsLength, fen_zhi_ as score, ping_fen_fang_shi as rateType, ping_fen_ren_ as rater, zheng_que_da_an_ as rightKey from t_questions where parent_id_ = '${this.bankId}' and zhuang_tai_ = '启用' order by field(ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        this.$message.error('获取题目信息失败！')
                        this.closeDialog()
                        return
                    }
                    data.map(item => {
                        if (item.options) {
                            const temp = JSON.parse(item.options) || {}
                            const o = []
                            Object.keys(temp).forEach(key => {
                                o.push({
                                    label: key,
                                    value: temp[key]
                                })
                            })
                            item.options = o
                        } else {
                            item.options = Array.from({ length: item.optionsLength }, (v, k) => {
                                return { answer: null }
                            })
                        }
                        item.img = item.img ? JSON.parse(item.img) : ''
                        item.answer = item.questionType === '多选题' ? [] : null
                    })
                    this.loading = false
                    resolve(data)
                }).catch(error => {
                    this.loading = false
                    reject(error)
                })
            })
        },
        getProgress () {
            const finished = []
            this.questionList.forEach(item => {
                if (item.questionType === '填空题') {
                    finished.push(item.answer && !item.answer.some(i => i === '' || i === null))
                } else if (item.questionType === '多选题') {
                    finished.push(item.answer.some(i => i) && true)
                } else {
                    finished.push(item.answer && true)
                }
            })
            // const finished = this.questionList.filter(item => (item.questionType !== '填空题' && item.answer) || (item.questionType === '填空题' && item.answer && !item.answer.some(i => i === '' || i === null))).length
            const finishedCount = finished.filter(i => i).length
            const progress = round(parseFloat(finishedCount / this.questionList.length * 100), 2)
            return progress ? progress > 100 ? 100 : progress : 0
        },
        changeOptions (val) {
            this.questionList[this.showIndex - 1].answer = val
        },
        setClassName (item, index) {
            const result = []
            if (item.answer) {
                // 填空题且未填写所有答案
                if (['填空题'].includes(item.questionType) && (item.options.every(i => !i.answer))) {
                    result.push('')
                } else if (['多选题'].includes(item.questionType) && !item.answer.length) {
                    result.push('')
                } else if (item.questionType === '填空题' && (item.options.some(i => !i.answer))) {
                    result.push('incomplete')
                } else {
                    result.push('finished')
                }
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
                this.handleCancel()
            }
        },
        handleBeforeUnload (event) {
            const confirmationMessage = '离开将自动提交当前数据，确定要离开吗？';
            (event || window.event).returnValue = confirmationMessage
            window.addEventListener('unload', this.submitDataAfterConfirmation)
            return confirmationMessage
        },
        submitDataAfterConfirmation () {
            this.submitData(this.dealFormData())
            // 移除事件监听器，避免重复触发提交逻辑
            window.removeEventListener('unload', this.submitDataAfterConfirmation)
        },
        goNext () {
            if (this.showIndex === this.questionList.length) {
                return
            }
            this.showIndex++
        },
        getScore ({ questionType, answer, rightKey, score }) {
            if (questionType === '多选题') {
                const temp = rightKey.split(',')
                return answer.length === temp.length && answer.every(i => temp.includes(i)) ? score : 0
            } else {
                return answer === rightKey ? score : 0
            }
        },
        handleSubmit () {
            let incompleteList = []
            this.questionList.forEach((item, index) => {
                if (item.questionType === '填空题') {
                    const t = item.answer && !item.answer.some(i => i === '' || i === null)
                    incompleteList.push(!t ? index + 1 : '')
                } else if (item.questionType === '多选题') {
                    const t = item.answer && item.answer.length
                    incompleteList.push(!t ? index + 1 : '')
                } else {
                    incompleteList.push(!item.answer ? index + 1 : '')
                }
            })
            incompleteList = incompleteList.filter(i => i)
            const tip = incompleteList.length ? `还有第${incompleteList.join('、')}题未作答，您确定要直接交卷吗？` : '您已完成作答，确定要交卷吗？'
            this.$confirm(tip, '提示', {
                type: incompleteList.length ? 'warning' : 'info',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                this.submitForm(this.dealFormData())
            }).catch(() => {})
        },
        dealFormData () {
            const submitData = []
            const time = this.$common.getDateNow(19)
            this.questionList.forEach((item, index) => {
                const autoType = ['单选题', '多选题', '判断题'].includes(item.questionType)
                const multipleType = ['多选题', '填空题'].includes(item.questionType)
                const selectType = ['多选题', '单选题'].includes(item.questionType)
                submitData.push({
                    parent_id_: this.id,
                    ti_mu_id_: item.questionId,
                    ti_gan_: item.stem,
                    ti_xing_: item.questionType,
                    fen_zhi_: item.score,
                    fu_tu_: item.img,
                    xuan_xiang_lei_xi: item.optionType,
                    xuan_xiang_: selectType ? JSON.stringify(item.options) : '',
                    can_kao_da_an_: item.rightKey,
                    ping_fen_fang_shi: item.rateType,
                    ping_fen_ren_: item.rater,
                    hui_da_: multipleType && item.answer ? JSON.stringify(item.answer) : item.answer,
                    shi_fou_yi_yue_: autoType ? '是' : '否',
                    ping_yue_shi_jian: autoType ? time : '',
                    de_fen_: autoType ? this.getScore(item) : '',
                    jie_xi_: ''
                })
            })
            return submitData
        },
        submitForm (data) {
            const addParams = {
                tableName: 't_examination_detail',
                paramWhere: data
            }
            const isAllReviewed = !data.some(i => i.shi_fou_yi_yue_ === '否')
            const updateParams = {
                tableName: 't_examination',
                updList: [
                    {
                        where: {
                            id_: this.id
                        },
                        param: {
                            jie_shu_shi_jian_: this.$common.getDateNow(19),
                            ti_ku_zong_fen_: data.reduce((sum, item) => sum + parseFloat(item.fen_zhi_), 0),
                            zhuang_tai_: isAllReviewed ? '已完成' : '已交卷',
                            de_fen_: isAllReviewed ? data.reduce((sum, item) => sum + parseFloat(item.de_fen_), 0) : ''
                            // sheng_yu_shi_chan: ''
                        }
                    }
                ]
            }
            console.log(addParams, updateParams)
            this.$common.request('add', addParams).then(() => {
                this.$common.request('update', updateParams).then(() => {
                    this.$message.success('提交成功！')
                    this.closeDialog()
                })
            })
        },
        handleCancel () {
            this.$confirm('中途退出将自动提交考试数据，是否确认操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
            }).then(() => {
                this.submitForm(this.dealFormData())
            })
        },
        hilarity () {
            this.$notify({
                title: '提示',
                message: '考试时间已到，即将自动交卷，请勿关闭页面防止数据丢失！',
                duration: 0
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
    .test-dialog {
        ::v-deep {
            .el-dialog__body {
                height: calc(100vh - 55px);
                width: 1080px;
                margin: 0 auto;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                .el-radio, .el-checkbox {
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
                }
            }
            .question-link {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                position: absolute;
                width: calc(100% - 40px);
                bottom: 20px;
                .progress {
                    width: 100%;
                    margin-bottom: 10px;
                    ::v-deep .el-progress-bar__innerText {
                        color: #fff !important;
                    }
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
        .tips {
            position: fixed;
            font-size: 12px;
            right: calc(1100px + (100% - 1080px) / 2);
            top: 50%;
            width: auto;
            max-width: 200px;
            transform: translate(0, -50%);
            background-color: rgba(0, 0, 0, .6);
            color: #DCDFE6;
            margin-left: 20px;
            padding: 10px;
            border-radius: 5px;
            > div {
                line-height: 20px;
                > span {
                    border-radius: 2px;
                    padding: 2px 5px;
                    margin: 0 2px;
                }
            }
        }
        .custom-title {
            display: flex;
            position: relative;
            justify-content: center;
            .dialog-title {
                font-size: 18px;
                line-height: 24px;
            }
            .countdown {
                position: absolute;
                // width: 200px;
                right: 0;
                top: -10px;
            }
        }
    }
</style>
