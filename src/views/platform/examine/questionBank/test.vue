<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
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
                        <el-radio-group v-if="item.questionType === '单选题'" v-model="item.answer">
                            <el-radio
                                v-for="(o, i) in item.options"
                                :key="`${index}${i}`"
                                :label="o.label"
                            >{{ `${o.label}.${o.value}` }}</el-radio>
                        </el-radio-group>
                        <el-checkbox-group v-else-if="item.questionType === '多选题'" v-model="item.answer">
                            <el-checkbox
                                v-for="(o, i) in item.options"
                                :key="`${index}${i}`"
                                :label="o.label"
                            >{{ o.value }}</el-checkbox>
                        </el-checkbox-group>
                        <el-radio-group v-else-if="item.questionType === '判断题'" v-model="item.answer">
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
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
import { paperTypeOptions } from '../constants'
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
        },
        parentId: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userId } = this.$store.getters || {}
        return {
            paperTypeOptions,
            title: '参加考试',
            dialogVisible: this.visible,
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
            showIndex: 1
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
                if (temp.questionType === '填空题') {
                    temp.answer = temp.options.map(item => item.answer)
                }
            }
        }
    },
    created () {
        // this.getQuestionData()
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
            if (!this.parentId) {
                this.$message.error('获取题目信息失败，请重试！')
                this.closeDialog()
                return
            }
            this.questionList = await this.getQuestionData()
            // console.log(this.questionList)
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
            const sql = `select id_ as questionId, ti_gan_ as stem, ti_xing_ as questionType, fu_tu_ as img, xuan_xiang_lei_xi as optionType, da_an_ as options, xuan_xiang_shu_ as optionsLength, fen_zhi_ as score from t_questions where parent_id_ = '${this.parentId}' order by field(ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
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
                            const temp = item.options ? JSON.parse(item.options) : {}
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
                        item.answer = null
                    })
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getProgress () {
            const finished = []
            this.questionList.forEach(item => {
                if (item.questionType === '填空题') {
                    finished.push(item.answer && !item.answer.some(i => i === '' || i === null))
                } else {
                    finished.push(item.answer && 1)
                }
            })
            // const finished = this.questionList.filter(item => (item.questionType !== '填空题' && item.answer) || (item.questionType === '填空题' && item.answer && !item.answer.some(i => i === '' || i === null))).length
            const finishedCount = finished.filter(i => i).length
            return parseInt(finishedCount / this.questionList.length * 100)
        },
        setClassName (item, index) {
            const result = []
            if (item.answer) {
                // 填空题且未填写所有答案
                if (item.questionType === '填空题' && (item.options.every(i => !i.answer))) {
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
            }
        },
        handleSubmit () {
            console.log(this.questionList)
            let incompleteList = []
            this.questionList.forEach((item, index) => {
                if (item.questionType === '填空题') {
                    const t = item.answer && item.answer.some(i => i === '' || i === null)
                    incompleteList.push(!t ? index + 1 : '')
                } else {
                    incompleteList.push(!item.answer ? index + 1 : '')
                }
            })
            incompleteList = incompleteList.filter(i => i)
            if (incompleteList.length) {
                this.$confirm(`还有第${incompleteList.join('、')}题未作答，您确定要直接交卷吗？`, '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showClose: false,
                    closeOnClickModal: false
                }).then(() => {
                    this.submitForm()
                }).catch(() => {})
                return
            }
            this.$confirm('确定要交卷吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            })
            const submitData = []
            this.questionList.forEach((item, index) => {
                submitData.push({
                    parent_id_: this.parentId,
                    ti_mu_id_: item.questionId,
                    hui_da_: '',
                    pan_ding_jie_guo_: '',
                    de_fen_: ''
                })
            })
            this.submitForm()
        },
        submitForm () {
            console.log('顶内锅肺啊')
            return
            const addParams = {
                tableName: 't_question_bank',
                paramWhere: [this.form]
            }
            const updateParams = {
                tableName: 't_question_bank',
                updList: [
                    {
                        where: {
                            id_: this.id
                        },
                        param: this.form
                    }
                ]
            }
            const type = this.id ? 'update' : 'add'
            const params = type === 'add' ? addParams : updateParams
            this.$common.request(type, params).then(() => {
                this.$message.success(this.id ? '保存题库成功' : '新增题库成功')
                this.closeDialog()
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
                .el-radio {
                    display: block;
                    margin-bottom: 10px;
                }
                .el-radio__label, .el-checkbox__label {
                    font-size: 16px;
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
                // .active {
                //     background-color: #409EFF;
                //     color: #fff;
                //     border-color: #409EFF;
                //     &:hover {
                //         background-color: #66b1ff;
                //         color: #fff;
                //         border-color: #66b1ff;
                //     }
                // }
                // .incomplete {
                //     background-color: #E6A23C;
                //     color: #fff;
                //     border-color: #E6A23C;
                //     &:hover {
                //         background-color: #E6A23C;
                //         color: #fff;
                //         border-color: #E6A23C;
                //     }
                // }
                // .finished {
                //     background-color: #67C23A;
                //     color: #fff;
                //     border-color: #67C23A;
                //     &:hover {
                //         background-color: #85ce61;
                //         color: #fff;
                //         border-color: #85ce61;
                //     }
                // }
            }
        }
    }
</style>
