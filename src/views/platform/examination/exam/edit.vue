<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog exam-dialog"
        top="6vh"
        @close="closeDialog"
        @open="getExamData"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="form"
            :rules="rules"
            class="exam-form"
            @submit.native.prevent
        >
            <el-form-item label="考试名称：" prop="kao_shi_ming_chen">
                <el-input
                    v-model="form.kao_shi_ming_chen"
                    type="text"
                    :maxlength="256"
                    placeholder="请输入考试名称"
                    :disabled="isDisabled"
                />
            </el-form-item>
            <!-- <el-form-item label="考试类型：" prop="kao_shi_lei_xing_">
                <el-select
                    v-model="form.kao_shi_lei_xing_"
                    filterable
                    allow-create
                    width="100%"
                    placeholder="请选择考试类型"
                >
                    <el-option
                        v-for="item in examTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item> -->
            <el-form-item label="考试题库：">
                <template slot="label">
                    考试题库
                    <el-tooltip
                        effect="dark"
                        content="如果选择多个题库或手动添加选题，最终生成的考试将是所选题目的总和，并将自动生成一个组合题库。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <div class="tiku">
                    <div class="item">
                        <ibps-custom-dialog
                            v-model="allQuestions.tiKu"
                            size="small"
                            template-key="tkdhk"
                            :multiple="true"
                            :disabled="isDisabled"
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择考试题库"
                            style="width:90%"
                        />
                        <div class="number">题数：{{ allQuestionsNumber.tiKuNumber }}</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="手动选题：">
                <template slot="label">
                    手动选题
                    <el-tooltip
                        effect="dark"
                        content="如果选择多个题库或手动添加选题，最终生成的考试将是所选题目的总和，并将自动生成一个组合题库。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <div class="tiku">
                    <div class="item">
                        <ibps-custom-dialog
                            v-model="allQuestions.handQuestions"
                            size="small"
                            template-key="tmlb"
                            multiple
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择考试题目"
                            style="width:90%"
                        />
                        <div class="number">题数：{{ allQuestions.handQuestions?allQuestions.handQuestions.split(',').length:0 }}</div>
                        <div class="number" style="margin-left:-20px">去重后：{{ allQuestionsNumber.handQuestionsNumber }}</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <template slot="label">
                    随机抽题
                    <el-tooltip
                        effect="dark"
                        content="是否开启从题库中随机抽题。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.sui_ji_chou_ti_" :disabled="isDisabled">
                    <el-radio label="0">关闭</el-radio>
                    <el-radio label="1" :disabled="allQuestionsNumber.tiKuNumber+allQuestionsNumber.handQuestionsNumber==0">开启</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.sui_ji_chou_ti_ === '1'">
                <template slot="label">
                    抽题方式
                    <el-tooltip
                        effect="dark"
                        content="随机抽题的依据。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.chou_ti_fang_shi_" :disabled="isDisabled">
                    <el-radio label="1">按照题型分类抽题</el-radio>
                    <el-radio label="2">按照难度分类抽题</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.sui_ji_chou_ti_ === '1'" class="handrand">
                <template slot="label">
                    抽题规则
                    <el-tooltip
                        effect="dark"
                        :content="ruleContent"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <template v-if="form.chou_ti_fang_shi_==='1'">
                    <div v-for="item in handList" :key="item.itemType" class="hand-item">
                        <template v-if="item.list.length>0">
                            <span>{{ item.itemType }}：</span>
                            <el-input-number
                                v-model="item.questionNumber"
                                style="width:120px"
                                :min="0"
                                :max="item.list.length"
                                :precision="0"
                                :disabled="form.sui_ji_chou_ti_ === '0' || isDisabled"
                                placeholder="请输入抽题数量"
                                :step="item.step"
                                step-strictly
                            />
                        </template>
                    </div>
                </template>
                <template v-if="form.chou_ti_fang_shi_==='2'">
                    <div v-for="item in levelList" :key="item.itemType" class="hand-item">
                        <template v-if="item.list.length>0">
                            <span>{{ item.label }}：</span>
                            <el-input-number
                                v-model="item.questionNumber"
                                style="width:120px"
                                :min="0"
                                :max="item.list.length"
                                :precision="0"
                                :disabled="form.sui_ji_chou_ti_ === '0' || isDisabled"
                                placeholder="请输入抽题数量"
                                :step="item.step"
                                step-strictly
                            />
                        </template>
                    </div>
                </template>

            </el-form-item>
            <el-form-item prop="xian_kao_shi_jian">
                <template slot="label">
                    限考时间
                    <el-tooltip
                        effect="dark"
                        content="设置该考试的提交截至时间。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group
                    v-model="form.isDateLimit"
                    @change="changeLimit(form.isDateLimit, 'xian_kao_shi_jian', null)"
                >
                    <el-radio label="0">不限</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
                <el-date-picker
                    v-if="form.isDateLimit === '1'"
                    v-model="form.xian_kao_shi_jian"
                    type="datetime"
                    placeholder="请选择考试限制提交时间"
                    align="right"
                    default-time="12:00:00"
                    class="date-picker"
                    :picker-options="pickerOptions"
                />
            </el-form-item>
            <el-form-item label="参考人员：" prop="can_kao_ren_yuan_">
                <ibps-custom-dialog
                    v-model="form.can_kao_ren_yuan_"
                    size="small"
                    template-key="gjxcxryk_copy"
                    multiple
                    :disabled="isDisabled"
                    type="dialog"
                    class="custom-dialog"
                    placeholder="请选择需参加考试的人员"
                />
            </el-form-item>
            <el-form-item prop="ping_fen_ren_">
                <template slot="label">
                    评分人
                    <el-tooltip effect="dark" content="设置该考试的评分人，选择的评分人与题目评分人都可以进行试题评阅" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <!-- <el-cascader
                    v-model="form.ping_fen_ren_"
                    :options="getRaterOptions()"
                    :show-all-levels="false"
                    collapse-tags
                    :props="{
                        value: 'value',
                        label: 'label',
                        multiple: true,
                        checkStrictly: false
                    }"
                /> -->
                <el-select
                    v-model="form.ping_fen_ren_"
                    filterable
                    style="width:100%"
                    clearable
                    multiple
                    :multiple-limit="16"
                    :disabled="isDisabled"
                    placeholder="请选择评分人"
                >
                    <el-option
                        v-for="item in userList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="isCountLimit" class="inline-item">
                <template slot="label">
                    限考次数
                    <el-tooltip
                        effect="dark"
                        content="限制是否可重复参加，以及可参加考试的最大次数。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group
                    v-model="form.isCountLimit"
                    :disabled="isDisabled"
                    @change="changeLimit(form.isCountLimit, 'xian_kao_ci_shu_', 1)"
                >
                    <el-radio label="0">不限</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
                <div v-if="form.isCountLimit === '1'" class="time">
                    <el-input-number
                        v-model="form.xian_kao_ci_shu_"
                        :min="1"
                        :precision="0"
                        :disabled="isDisabled"
                        placeholder="请输入单个用户最大限考次数"
                    />
                    <div class="unit">次</div>
                </div>
            </el-form-item>
            <el-form-item v-if="form.isCountLimit === '0' || form.isCountLimit === '1' && form.xian_kao_ci_shu_ > 1" prop="ji_fen_fang_shi_">
                <template slot="label">
                    计分方式
                    <el-tooltip
                        effect="dark"
                        content="设置对于可重复参加的考试，最终得分的计算方式（仅限考次数大于1时有效）。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.ji_fen_fang_shi_" :disabled="isDisabled">
                    <el-radio label="平均分">平均分</el-radio>
                    <el-radio label="最高分">最高分</el-radio>
                    <el-radio label="最近得分">最近得分</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="isTimeLimit" class="inline-item">
                <template slot="label">
                    考试时长
                    <el-tooltip
                        effect="dark"
                        content="设置该考试单次作答的最大时长。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.isTimeLimit" :disabled="isDisabled">
                    <el-radio label="0">不限</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
                <template v-if="form.isTimeLimit === '1'">
                    <div class="time">
                        <el-input-number
                            v-model="form.hours"
                            :min="0"
                            :max="72"
                            :precision="0"
                            :disabled="isDisabled"
                        />
                        <div class="unit">小时</div>
                    </div>
                    <div class="time">
                        <el-input-number
                            v-model="form.minutes"
                            :min="0"
                            :max="59"
                            :precision="0"
                            :disabled="isDisabled"
                        />
                        <div class="unit">分钟</div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item prop="da_biao_zhan_bi_">
                <template slot="label">
                    达标分值占比
                    <el-tooltip
                        effect="dark"
                        content="设置该考试的达标分数线占试题总分的百分比。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-input-number
                    v-model="form.da_biao_zhan_bi_"
                    :min="50"
                    :max="100"
                    :precision="0"
                    :disabled="isDisabled"
                    placeholder="请输入达标分值占比"
                />
                <div class="unit">%</div>
            </el-form-item>
            <el-form-item prop="yun_xu_bao_ming_">
                <template slot="label">
                    允许自主报名
                    <el-tooltip
                        effect="dark"
                        content="限制非本考试的参考人员是否可报名参加该考试。"
                        placement="top"
                    >
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.yun_xu_bao_ming_" :disabled="isDisabled">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="!isDisabled || form.guan_lian_id_" prop="guan_lian_id_">
                <template slot="label">
                    关联培训记录
                    <el-tooltip effect="dark" content="关联培训记录。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <ibps-custom-dialog
                    v-model="form.guan_lian_id_"
                    size="small"
                    template-key="pxjldhk"
                    :multiple="false"
                    :disabled="isDisabled"
                    type="dialog"
                    class="custom-dialog"
                    placeholder="请选择培训记录"
                />
            </el-form-item>
            <el-form-item
                v-if="!isDisabled || form.kao_shi_miao_shu_"
                label="考试描述："
                prop="kao_shi_miao_shu_"
            >
                <el-input
                    v-model="form.kao_shi_miao_shu_"
                    type="textarea"
                    :rows="4"
                    :maxlength="512"
                    placeholder="请输入描述内容"
                    :disabled="isDisabled"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import ActionUtils from '@/utils/action'
import { examTypeOptions, scoringType } from '../constants'
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
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
        isDisabled: {
            type: Boolean,
            default: false
        },
        userIds: {
            type: String,
            default: ''
        }
    },
    data () {
        const {
            userList = [],
            deptList = [],
            userId,
            level
        } = this.$store.getters || {}
        return {
            level: level.second || level.first,
            userId: userId,
            allQuestions: {
                handQuestions: '',
                tiKu: ''
            },
            allQuestionsNumber: {
                handQuestionsNumber: 0,
                tiKuNumber: 0
            },
            curQuestions: [],
            handList: [
                { itemType: '单选题', questionNumber: 0, list: [], step: 1 },
                { itemType: '多选题', questionNumber: 0, list: [], step: 1 },
                { itemType: '判断题', questionNumber: 0, list: [], step: 1 },
                { itemType: '填空题', questionNumber: 0, list: [], step: 1 },
                { itemType: '简答题', questionNumber: 0, list: [], step: 1 }
            ],
            levelList: [
                { label: '未知', itemType: '0', questionNumber: 0, list: [], step: 1 },
                { label: '易', itemType: '1', questionNumber: 0, list: [], step: 1 },
                { label: '偏易', itemType: '2', questionNumber: 0, list: [], step: 1 },
                { label: '适中', itemType: '3', questionNumber: 0, list: [], step: 1 },
                { label: '偏难', itemType: '4', questionNumber: 0, list: [], step: 1 },
                { label: '难', itemType: '5', questionNumber: 0, list: [], step: 1 }
            ],
            userList,
            examTypeOptions,
            deptList: deptList.filter((i) => i.depth === 4),
            title: this.id ? '编辑考试' : '新建考试',
            formLabelWidth: '150px',
            dialogVisible: this.visible,
            dialogLoading: false,
            randButtonDisabled: false,
            isFirst: true,
            form: {
                di_dian_: level.second || level.first,
                chuang_jian_shi_j: '',
                kao_shi_ming_chen: '',
                kao_shi_lei_xing_: '常规',
                ti_ku_id_: '',
                guan_lian_id_: '',
                xian_kao_shi_jian: '不限',
                xian_kao_ci_shu_: '不限',
                can_kao_ren_yuan_: this.userIds || '',
                kao_shi_shi_chang: '',
                zhuang_tai_: '未发布',
                da_biao_zhan_bi_: 80,
                ji_fen_fang_shi_: scoringType.length ? scoringType[1].value : '',
                kao_shi_miao_shu_: '',
                yun_xu_bao_ming_: '否',
                isCountLimit: '0',
                isTimeLimit: '0',
                isDateLimit: '0',
                sui_ji_chou_ti_: '0',
                chou_ti_zong_fen_: 0,
                ti_mu_zong_shu_: 0,
                sui_ji_ti_shu_: [],
                hours: 2,
                minutes: 30,
                chou_ti_fang_shi_: '1',
                ping_fen_ren_: ''
            },
            pickerOptions: {
                disabledDate (time) {
                    // 禁用当前日期之前的日期
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            toolbars: [
                {
                    key: 'submit',
                    icon: 'ibps-icon-save',
                    label: '保存',
                    hidden: () => {
                        return this.readonly
                    }
                },
                { key: 'cancel', label: '关闭' }
            ],
            rules: {
                kao_shi_ming_chen: [
                    { required: true, message: this.$t('validate.required') }
                ],
                // kao_shi_lei_xing_: [{ required: true, message: this.$t('validate.required') }],
                ti_ku_id_: [{ required: true, message: this.$t('validate.required') }],
                xian_kao_shi_jian: [
                    { required: true, message: this.$t('validate.required') }
                ],
                xian_kao_ci_shu_: [
                    { required: true, message: this.$t('validate.required') }
                ],
                can_kao_ren_yuan_: [
                    { required: true, message: this.$t('validate.required') }
                ],
                kao_shi_shi_chang: [
                    { required: true, message: this.$t('validate.required') }
                ],
                da_biao_zhan_bi_: [
                    { required: true, message: this.$t('validate.required') }
                ]
            }
        }
    },
    computed: {
        ruleContent () {
            switch (this.form.chou_ti_fang_shi_) {
                case '1':
                    return '设置每类题型的抽题数量，相同题型相同分值可以自由选择抽题数量，相同题型不同分值只能全抽或不抽。'
                case '2':
                    return '设置每种难度的抽题数量，相同难度相同分值可以自由选择抽题数量，相同难度不同分值只能全抽或不抽。未设置难度的题目会自动过滤。'
            }
            return '设置每类题型的抽题数量，相同题型相同分值可以自由选择抽题数量，相同题型不同分值只能全抽或不抽。'
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            }
            // immediate: true
        },
        'allQuestions': {
            handler (val) {
                const allRequests = []
                const { tiKu, handQuestions } = val
                if (tiKu) {
                    // const sql = `select * from t_questions where find_in_set(parent_id_, '${tiKu}') and zhuang_tai_ = '启用' order by field(ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
                    allRequests.push(this.$common.request('query', {
                        key: 'getExamQuestionByBid',
                        params: [tiKu]
                    }))
                }
                if (handQuestions) {
                    // let sql = ''
                    // if (tiKu) {
                    //     sql = `select * from t_questions where find_in_set(id_, '${handQuestions}') and find_in_set(parent_id_, '${tiKu}') = 0 and zhuang_tai_ = '启用' order by field(ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
                    // } else {
                    //     sql = `select * from t_questions where find_in_set(id_, '${handQuestions}') and zhuang_tai_ = '启用' order by field(ti_xing_, '单选题', '多选题', '判断题', '填空题', '简答题')`
                    // }
                    const key = tiKu ? 'getExamQuestionByQidBid' : 'getExamQuestionByQid'
                    const params = tiKu ? [handQuestions, tiKu] : [handQuestions]

                    allRequests.push(this.$common.request('query', { key, params }))
                }
                if (allRequests.length) {
                    Promise.all(allRequests).then(res => {
                        const { data: data1 = [] } = res?.[0]?.variables || {}
                        const { data: data2 = [] } = res?.[1]?.variables || {}
                        if (!this.allQuestions.tiKu) {
                            this.allQuestionsNumber.handQuestionsNumber = data1.length
                        } else if (!this.allQuestions.handQuestions) {
                            this.allQuestionsNumber.tiKuNumber = data1.length
                        } else {
                            this.allQuestionsNumber.tiKuNumber = data1.length
                            this.allQuestionsNumber.handQuestionsNumber = data2.length
                        }
                        this.curQuestions = [...data1, ...data2]
                        this.getHandList()
                    }).catch(err => {
                        console.error(err)
                    })
                } else {
                    this.allQuestionsNumber.tiKuNumber = 0
                    this.allQuestionsNumber.handQuestionsNumber = 0
                    this.form.sui_ji_chou_ti_ = '0'
                    this.curQuestions = []
                    this.getHandList()
                }
            },
            deep: true
        }
    },
    mounted () {
        this.getExamData()
    },
    methods: {
        // 分类计算
        getHandList () {
            const data = this.curQuestions
            // 确定每种类型的题目
            this.handList.forEach(hand => {
                hand.list = data.filter(item => item.ti_xing_ === hand.itemType)
            })
            // 确定每种难度的题目
            this.levelList.forEach(level => {
                level.list = data.filter(item => item.nan_du_ === level.itemType)
            })

            if (this.$utils.isEmpty(this.id)) {
                // 设置每种类型题目的默认题数
                this.handList.forEach(hand => {
                    hand.questionNumber = hand.list.length
                })
                // 设置每种难度题目的默认题数
                this.levelList.forEach(level => {
                    level.questionNumber = level.list.length
                })
            } else {
                if (!this.isFirst) {
                    this.handList.forEach(hand => {
                        hand.questionNumber = hand.list.length
                    })
                    this.levelList.forEach(level => {
                        level.questionNumber = level.list.length
                    })
                } else {
                    // 根据当前的抽题方式给另外一种抽题方式填充默认值
                    this.isFirst = false
                    if (this.form.chou_ti_fang_shi_ === '1') {
                        this.levelList.forEach(level => {
                            level.questionNumber = level.list.length
                        })
                    } else if (this.form.chou_ti_fang_shi_ === '2') {
                        this.handList.forEach(hand => {
                            hand.questionNumber = hand.list.length
                        })
                    }
                }
            }

            // 设置每种类型题目的步数
            this.handList.forEach(hand => {
                if (hand.list.length > 0) {
                    const isSame = hand.list.every(item => item.fen_zhi_ === hand.list[0].fen_zhi_)
                    hand.step = isSame ? 1 : hand.list.length
                }
            })
            // 设置每种难度题目的步数
            this.levelList.forEach(level => {
                if (level.list.length > 0) {
                    const isSame = level.list.every(item => item.fen_zhi_ === level.list[0].fen_zhi_)
                    level.step = isSame ? 1 : level.list.length
                }
            })
        },
        changeLimit (e, type, defaultValue) {
            this.form[type] = e === '1' ? defaultValue : '不限'
        },
        handleActionEvent ({ key }) {
            switch (key) {
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
        // 获取考试数据
        getExamData () {
            if (this.$utils.isEmpty(this.id)) {
                return
            }
            if (this.isDisabled) {
                this.randButtonDisabled = true
                this.$message.info('非未发布状态的考试仅可修改限考时间！')
            }
            // const sql = `select id_, create_by_, ti_ku_id_, guan_lian_id_, kao_shi_ming_chen, kao_shi_lei_xing_, chuang_jian_shi_j, fa_bu_shi_jian_, fa_bu_ren_, xian_kao_shi_jian, xian_kao_ci_shu_, kao_shi_shi_chang, can_kao_ren_yuan_, zhuang_tai_, da_biao_zhan_bi_, ji_fen_fang_shi_, kao_shi_miao_shu_, yun_xu_bao_ming_, sui_ji_chou_ti_, sui_ji_ti_shu_,chou_ti_zong_fen_,ti_mu_zong_shu_,chou_ti_fang_shi_,ping_fen_ren_ from t_exams where id_ = '${this.id}'`
            this.$common.request('query', {
                key: 'getExamDataById',
                params: [this.id]
            }).then((res) => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    this.$message.error('数据不存在')
                    return
                }
                data[0].isCountLimit = data[0].xian_kao_ci_shu_ === '不限' ? '0' : '1'
                data[0].isDateLimit = data[0].xian_kao_shi_jian === '不限' ? '0' : '1'
                if (data[0].kao_shi_shi_chang === '不限') {
                    data[0].isTimeLimit = '0'
                    data[0].hours = null
                    data[0].minutes = null
                } else {
                    data[0].isTimeLimit = '1'
                    data[0].hours = Math.floor(data[0].kao_shi_shi_chang / (1000 * 60 * 60))
                    data[0].minutes = (data[0].kao_shi_shi_chang % (1000 * 60 * 60)) / (60 * 1000)
                }
                if (data[0].ping_fen_ren_) {
                    data[0].ping_fen_ren_ = data[0].ping_fen_ren_.split(',') || []
                }
                this.form = data[0]
                if (this.form.sui_ji_chou_ti_ === '1') {
                    this.form.sui_ji_ti_shu_ = this.form.sui_ji_ti_shu_.split(',')
                    if (this.form.chou_ti_fang_shi_ === '1') {
                        this.form.sui_ji_ti_shu_.forEach((item, index) => {
                            this.handList[index].questionNumber = item
                        })
                    } else if (this.form.chou_ti_fang_shi_ === '2') {
                        this.form.sui_ji_ti_shu_.forEach((item, index) => {
                            this.levelList[index].questionNumber = item
                        })
                    }
                }
                this.allQuestions.tiKu = this.form.ti_ku_id_
            })
        },
        handleSubmit () {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    if (this.allQuestionsNumber.tiKuNumber + this.allQuestionsNumber.handQuestionsNumber === 0) {
                        return this.$message.warning('请先选择题目！')
                    }
                    this.form.sui_ji_ti_shu_ = []
                    this.form.chou_ti_zong_fen_ = 0
                    this.form.ti_mu_zong_shu_ = 0
                    if (this.form.sui_ji_chou_ti_ === '1') {
                        // 计算总分 总数量
                        if (this.form.chou_ti_fang_shi_ === '1') {
                            this.handList.forEach(item => {
                                if (item.list.length > 0) {
                                    this.form.sui_ji_ti_shu_.push(item.questionNumber || 0)
                                    this.form.ti_mu_zong_shu_ += item.questionNumber || 0
                                    this.form.chou_ti_zong_fen_ += item.list.slice(0, item.questionNumber || 0).reduce((pre, cur) => {
                                        return pre + +cur.fen_zhi_
                                    }, 0)
                                } else {
                                    this.form.sui_ji_ti_shu_.push(0)
                                }
                            })
                        } else if (this.form.chou_ti_fang_shi_ === '2') {
                            this.levelList.forEach(item => {
                                if (item.list.length > 0) {
                                    this.form.sui_ji_ti_shu_.push(item.questionNumber || 0)
                                    this.form.ti_mu_zong_shu_ += item.questionNumber || 0
                                    this.form.chou_ti_zong_fen_ += item.list.slice(0, item.questionNumber || 0).reduce((pre, cur) => {
                                        return pre + +cur.fen_zhi_
                                    }, 0)
                                } else {
                                    this.form.sui_ji_ti_shu_.push(0)
                                }
                            })
                        }

                        if (this.form.ti_mu_zong_shu_ === 0) {
                            return this.$message.warning('请填写需要抽取的题目数量！')
                        }
                    }
                    this.form.sui_ji_ti_shu_ = this.form.sui_ji_ti_shu_.join(',')
                    this.form.ping_fen_ren_ = this.form.ping_fen_ren_ ? this.form.ping_fen_ren_.join(',') : ''

                    const { isTimeLimit, xian_kao_shi_jian = '' } = this.form || {}
                    // 转换考试时长
                    if (isTimeLimit === '0') {
                        this.form.kao_shi_shi_chang = '不限'
                    } else {
                        this.form.kao_shi_shi_chang = (this.form.hours * 60 + this.form.minutes) * 60 * 1000
                    }
                    delete this.form.isDateLimit
                    delete this.form.isCountLimit
                    delete this.form.isTimeLimit
                    delete this.form.hours
                    delete this.form.minutes
                    this.form.chuang_jian_shi_j = this.$common.getDateNow(19)
                    this.form.xian_kao_shi_jian = xian_kao_shi_jian !== '不限' ? this.$common.getFormatDate('string', 16, xian_kao_shi_jian) : xian_kao_shi_jian
                    // 这里表示为组合题 需要生成一个新的题库
                    if (this.allQuestions.tiKu.indexOf(',') !== -1 || this.allQuestions.handQuestions) {
                        const tiKuId = await this.createBank()
                        console.log(tiKuId)
                        this.form.ti_ku_id_ = tiKuId
                    } else {
                        this.form.ti_ku_id_ = this.allQuestions.tiKu
                    }

                    // 表单验证通过，提交表单
                    this.submitForm()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        async createBank () {
            // 1. 新建题库
            const addParams = {
                tableName: 't_question_bank',
                paramWhere: [{
                    ti_ku_ming_cheng_: '组合题库' + dayjs().format('YYYYMMDDHHmmss'),
                    shi_fou_gong_kai_: '是',
                    bian_zhi_ren_: this.userId,
                    bian_zhi_shi_jian: this.$common.getDateNow(19),
                    ti_ku_fen_lei_: '专业组考试',
                    suo_shu_fan_wei_: '科级',
                    ti_ku_zhuang_tai_: '可用',
                    xian_kao_ci_shu_: this.form.xian_kao_ci_shu_,
                    da_biao_zhan_bi_: this.form.da_biao_zhan_bi_,
                    miao_shu_: this.form.kao_shi_miao_shu_,
                    ping_fen_ren_: '',
                    di_dian_: this.level,
                    bian_zhi_bu_men_: '',
                    kao_shi_shi_chang: this.form.kao_shi_shi_chang,
                    ti_shu_: this.curQuestions.length,
                    zong_fen_: this.curQuestions.reduce((sum, item) => sum + parseInt(item.fen_zhi_), 0)
                }]
            }
            const { variables: { cont }} = await this.$common.request('add', addParams)
            if (cont.length > 0) {
                const addParams = {
                    tableName: 't_questions',
                    paramWhere: this.curQuestions.map(item => ({
                        di_dian_: this.level,
                        parent_id_: cont[0].id_,
                        bu_men_: item.bu_men_ || '',
                        chu_ti_ren_: item.chu_ti_ren_,
                        chu_ti_shi_jian_: item.chu_ti_shi_jian_,
                        xu_hao_: item.xu_hao_ || '',
                        ti_gan_: item.ti_gan_,
                        ti_xing_: item.ti_xing_,
                        fu_tu_: item.fu_tu_ || '',
                        xuan_xiang_lei_xi: item.xuan_xiang_lei_xi || '',
                        da_an_: item.da_an_ || '',
                        fen_zhi_: item.fen_zhi_,
                        xuan_xiang_shu_: item.xuan_xiang_shu_ || '',
                        zheng_que_da_an_: item.zheng_que_da_an_,
                        ping_fen_fang_shi: item.ping_fen_fang_shi || '',
                        ping_fen_ren_: item.ping_fen_ren_ || '',
                        bei_zhu_: item.bei_zhu_ || '',
                        zhuang_tai_: item.zhuang_tai_,
                        biao_qian_: item.biao_qian_ || '',
                        nan_du_: item.nan_du_ || 0,
                        da_an_jie_xi_: item.da_an_jie_xi_ || ''
                    }))
                }
                await this.$common.request('add', addParams)
                return cont[0].id_
            }

            // 2.新建题目
        },
        submitForm () {
            const addParams = {
                tableName: 't_exams',
                paramWhere: [this.form]
            }
            const updateParams = {
                tableName: 't_exams',
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
                this.$message.success(this.id ? '修改考试成功' : '新建考试成功')
                this.closeDialog(true)
            })
        },
        // 关闭当前窗口
        closeDialog (refresh) {
            this.$emit('close', false, refresh)
        }
    }
}
</script>
<style lang="scss" scoped>
    .exam-dialog {
        ::v-deep {
            .el-dialog {
                max-width: 1080px;
            }
            .el-dialog__body {
                height: calc(88vh - 150px);
            }
            .el-form-item {
                margin-bottom: 14px !important;
                &:last-child {
                    margin-bottom: 0 !important;
                }
                .el-form-item__label {
                    font-size: 14px !important;
                }
            }
            .el-form-item--small .el-form-item__error {
                padding-top: 6px;
            }
        }
        .exam-form {
            padding: 20px;
            .question-icon {
                font-size: 13px;
                color: #606060;
            }
            .date-picker {
                margin-left: 20px;
            }
            .custom-dialog {
                ::v-deep {
                    .el-input--prefix .el-input__inner {
                        padding-left: 15px;
                    }
                }
            }
        }
        .inline-item {
            ::v-deep {
                .el-radio-group {
                    margin-right: 20px;
                }
            }
            .time {
                display: inline-block;
            }
        }
        .unit {
            display: inline-block;
            margin: 0 20px 0 5px;
        }
        .handrand{
            ::v-deep .el-form-item__content{
                display: flex;
                flex-wrap: wrap;
            }
            .hand-item{
                display: flex;
                margin-right: 20px;
                margin-bottom: 10px;
            }
        }
    }
    .tiku {
        .el-button {
            margin-left: 20px;
        }
        .item{
            display: flex;
            gap: 20px;
            .number{
                width: 100px;
            }
        }
    }
</style>
