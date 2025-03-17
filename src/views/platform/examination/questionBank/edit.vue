<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog paper-dialog"
        top="6vh"
        @close="closeDialog"
        @open="getQuestionData"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="form"
            :rules="rules"
            class="paper-form"
            :class="readonly ? 'readonly-form' : ''"
            @submit.native.prevent
        >
            <el-form-item label="题库名称：" prop="ti_ku_ming_cheng_">
                <el-input
                    v-model="form.ti_ku_ming_cheng_"
                    type="text"
                    :maxlength="128"
                    :disabled="readonly"
                />
            </el-form-item>
            <el-form-item label="题库分类：" prop="ti_ku_fen_lei_">
                <el-select
                    v-model="form.ti_ku_fen_lei_"
                    filterable
                    allow-create
                    width="100%"
                    :disabled="readonly"
                    placeholder="请选择题库分类"
                >
                    <el-option
                        v-for="item in paperTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="ti_ku_zhuang_tai_">
                <template slot="label">
                    题库状态
                    <el-tooltip effect="dark" content="限制该题库是否可用于创建考试及自主考核。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.ti_ku_zhuang_tai_" :disabled="readonly">
                    <el-radio label="可用">可用</el-radio>
                    <el-radio label="禁用">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="shi_fou_gong_kai_">
                <template slot="label">
                    是否公开
                    <el-tooltip effect="dark" content="限制该题库是否可自主考核。若您希望该题库仅用于考试中，则需要设置为“否”。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.shi_fou_gong_kai_" :disabled="readonly">
                    <el-radio label="是">是&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
                    <el-radio label="否">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="suo_shu_fan_wei_" class="inline-item">
                <template slot="label">
                    所属范围
                    <el-tooltip effect="dark" content="设置题库的所属范围，组级则需要选择具体的专业组。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.suo_shu_fan_wei_" :disabled="readonly">
                    <el-radio label="科级">科级</el-radio>
                    <el-radio label="组级">组级</el-radio>
                </el-radio-group>
                <el-select
                    v-if="form.suo_shu_fan_wei_ === '组级'"
                    v-model="form.bian_zhi_bu_men_"
                    width="100%"
                    :disabled="readonly"
                    placeholder="请选择专业组"
                >
                    <el-option
                        v-for="item in deptList"
                        :key="item.positionId"
                        :label="item.positionName"
                        :value="item.positionId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="isLimit" class="inline-item">
                <template slot="label">
                    限考次数
                    <el-tooltip effect="dark" content="限制是否可重复考核，以及可自主考核的最大次数。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.isLimit" :disabled="readonly" @change="changeLimit">
                    <el-radio label="0">不限</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
                <div v-if="form.isLimit === '1'" class="time">
                    <el-input-number
                        v-model="form.xian_kao_ci_shu_"
                        :min="1"
                        :precision="0"
                        :disabled="readonly"
                        placeholder="请输入单个用户最大限考次数"
                    />
                    <div class="unit">次</div>
                </div>
            </el-form-item>
            <el-form-item prop="limitTime" class="inline-item">
                <template slot="label">
                    考试时长
                    <el-tooltip effect="dark" content="设置该题库对于单次用户自主考核的最大考试时长。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.limitTime" :disabled="readonly">
                    <el-radio label="0">不限</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
                <template v-if="form.limitTime === '1'">
                    <div class="time">
                        <el-input-number
                            v-model="form.hours"
                            :min="0"
                            :max="72"
                            :precision="0"
                            :disabled="readonly"
                        />
                        <div class="unit">小时</div>
                    </div>
                    <div class="time">
                        <el-input-number
                            v-model="form.minutes"
                            :min="0"
                            :max="59"
                            :precision="0"
                            :disabled="readonly"
                        />
                        <div class="unit">分钟</div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item prop="da_biao_zhan_bi_">
                <template slot="label">
                    达标分值占比
                    <el-tooltip effect="dark" content="设置该题库的达标分数线占题库总分的百分比。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-input-number
                    v-model="form.da_biao_zhan_bi_"
                    :min="50"
                    :max="100"
                    :precision="0"
                    :disabled="readonly"
                    placeholder="请输入达标分值占比"
                />
                <div class="unit">%</div>
            </el-form-item>
            <!-- <el-form-item v-if="!readonly || form.ping_fen_ren_" prop="ping_fen_ren_">
                <template slot="label">
                    默认评分人
                    <el-tooltip effect="dark" content="设置该题库试题的默认评分人，该题库下所有未设置评分人的题目都以该评分人为准。" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template> -->
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
            <!-- <el-select
                    v-model="form.ping_fen_ren_"
                    filterable
                    width="100%"
                    clearable
                    multiple
                    collapse-tags
                    :multiple-limit="16"
                    :disabled="readonly"
                    placeholder="请选择默认评分人"
                >
                    <el-option
                        v-for="item in userList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item> -->
            <el-form-item v-if="!readonly || form.miao_shu_" label="题库描述：" prop="miao_shu_">
                <el-input
                    v-model="form.miao_shu_"
                    type="textarea"
                    :autosize="readonly"
                    :rows="4"
                    :disabled="readonly"
                    placeholder="请输入描述内容"
                />
            </el-form-item>
        </el-form>
        <div class="question-table">
            <div v-if="!readonly" class="question-select">
                <div class="label">选择试题：</div>
                <ibps-custom-dialog
                    v-model="quesIdList"
                    size="small"
                    template-key="tmlb"
                    multiple
                    type="dialog"
                    class="custom-dialog"
                    placeholder="请选择需要关联的题目信息"
                />
            </div>
            <div class="table-title">
                <span>题库试题信息</span>
                <el-button v-if="!readonly" type="danger" size="mini" icon="el-icon-delete" @click="removeItems">删除</el-button>
            </div>
            <el-table
                ref="elTable"
                :data="showPaperList"
                border
                stripe
                highlight-current-row
                style="width: 100%"
                max-height="400px"
                class="exam-table"
                @row-dblclick="handleRowDblclick"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    v-if="!readonly"
                    width="50"
                    type="selection"
                />
                <el-table-column label="序号" type="index" :index="showIndex" width="60" />
                <el-table-column
                    prop="content"
                    label="题干"
                    min-width="150"
                >
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <div class="question-info">
                                <div class="left">
                                    <div class="question-info-item">
                                        <div class="label">出题人</div>
                                        <div class="value">{{ transformUser(scope.row.creator) }}</div>
                                    </div>
                                    <div class="question-info-item">
                                        <div class="label">选项类型</div>
                                        <div class="value">{{ scope.row.optionType || '—' }}</div>
                                    </div>
                                    <div class="question-info-item">
                                        <div class="label">评分方式</div>
                                        <div class="value">{{ scope.row.rateType }}</div>
                                    </div>
                                    <div class="question-info-item">
                                        <div class="label">评分人</div>
                                        <div class="value">{{ transformUser(scope.row.rater) }}</div>
                                    </div>
                                    <div class="question-info-item">
                                        <div class="label">标签</div>
                                        <div class="value">{{ scope.row.quesTag }}</div>
                                    </div>
                                    <div class="question-info-item">
                                        <div class="label">状态</div>
                                        <div class="value">{{ scope.row.quesState }}</div>
                                    </div>
                                </div>
                                <div class="right">
                                    <ibps-image
                                        :value="showImgs(scope,3)"
                                        height="180"
                                        width="180"
                                        :disabled="true"
                                    />
                                </div>

                            </div>
                            <div slot="reference" class="name-wrapper">{{ scope.row.content }}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="quesType"
                    label="题型"
                    width="70"
                />
                <el-table-column
                    prop="score"
                    label="分值"
                    width="75"
                    sortable
                />
                <el-table-column
                    prop="questionLevel"
                    label="难度"
                    width="75"
                    sortable
                >
                    <template slot-scope="{row}">
                        <span>{{ ['未知','易','偏易','适中','偏难','难'][+row.questionLevel] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="出题时间"
                    width="160"
                    sortable
                />
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-if="!readonly"
                            type="text"
                            size="medium"
                            @click="handleColumnAction(scope.row, false)"
                        >修改</el-button>
                        <!-- <el-button
                            v-if="!readonly"
                            type="text"
                            style="color: #f56c6c;"
                            size="medium"
                            @click="handleRemove(scope.row)"
                        >删除</el-button> -->
                        <el-button
                            v-if="readonly"
                            type="text"
                            style="color: #909399;"
                            size="medium"
                            @click="handleColumnAction(scope.row, true)"
                        >详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                style="margin-top: 5px; padding-bottom: 10px"
                :current-page="currentPage"
                :page-sizes="[10, 20,30, 50,100]"
                :page-size="pageSize"
                layout="prev,pager,next,jumper,sizes,->,total"
                :total="questionData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />

        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
        <ques-edit
            v-if="questionDialogVisible"
            :id="quesId"
            :bank-id="id"
            :visible.sync="questionDialogVisible"
            :is-copy="isCopy"
            :ques-data="questionData"
            :readonly="quesReadonly"
            @update="updateData"
            @close="questionDialogVisible = false"
        />
    </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
import { paperTypeOptions } from '../constants'
export default {
    components: {
        QuesEdit: () => import('../question/edit'),
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog'),
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
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList = [], deptList = [], userId, level = {}} = this.$store.getters || {}
        return {
            multipleSelection: [],
            pageSize: 10,
            currentPage: 1,
            userList,
            paperTypeOptions,
            level: level.second || level.first,
            deptList: deptList.filter(i => i.depth === 4),
            title: this.readonly ? '题库明细' : this.id ? '编辑题库' : '创建题库',
            formLabelWidth: '150px',
            dialogVisible: this.visible,
            dialogLoading: false,
            questionData: [],
            initialData: [],
            questionDialogVisible: false,
            quesId: '',
            quesIdList: '',
            isCopy: false,
            quesReadonly: false,
            form: {
                bian_zhi_bu_men_: '',
                bian_zhi_ren_: userId,
                bian_zhi_shi_jian: this.$common.getDateNow(19),
                ti_ku_ming_cheng_: '',
                suo_shu_fan_wei_: '科级',
                ti_ku_fen_lei_: paperTypeOptions.length ? paperTypeOptions[0].value : '',
                ti_ku_zhuang_tai_: '可用',
                xian_kao_ci_shu_: '不限',
                shi_fou_gong_kai_: '是',
                ping_fen_ren_: '',
                da_biao_zhan_bi_: 60,
                miao_shu_: '',
                ti_shu_: 0,
                isLimit: '0',
                limitTime: '0',
                hours: 2,
                minutes: 30
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
                ti_ku_ming_cheng_: [{ required: true, message: this.$t('validate.required') }],
                suo_shu_fan_wei_: [{ required: true, message: this.$t('validate.required') }],
                bian_zhi_bu_men_: [{ required: true, message: this.$t('validate.required') }],
                ti_ku_fen_lei_: [{ required: true, message: this.$t('validate.required') }],
                shi_fou_gong_kai_: [{ required: true, message: this.$t('validate.required') }],
                ti_ku_zhuang_tai_: [{ required: true, message: this.$t('validate.required') }],
                xian_kao_ci_shu_: [{ required: true, message: this.$t('validate.required') }],
                kao_shi_shi_chang: [{ required: true, message: this.$t('validate.required') }],
                da_biao_zhan_bi_: [{ required: true, message: this.$t('validate.required') }]
            }

        }
    },
    computed: {
        formId () {
            return this.id
        },
        showPaperList () {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.questionData.slice(start, end)
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
            // immediate: true
        },
        quesIdList: {
            handler (val, oldVal) {
                this.addSelectQuestion(val)
            }
        }
    },
    mounted () {
        this.getQuestionData()
    },
    methods: {
        // 默认展示三张图片
        showImgs (scope, showNumber = 3) {
            if (scope.row.img) {
                return JSON.parse(scope.row.img).slice(0, showNumber)
            }
            return ''
        },
        // 分页连续序号
        showIndex (index) {
            return index + 1 + (this.currentPage - 1) * this.pageSize
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
        changeLimit (e) {
            this.form.xian_kao_ci_shu_ = e === '1' ? 1 : '不限'
        },
        getRaterOptions () {
            const { userList = [], deptList = [] } = this.$store.getters || {}
            const depts = deptList.filter(i => i.depth > 2)
            const temp = depts.map(item => {
                item.value = item.positionId
                item.label = item.positionName
                item.children = userList.map(i => {
                    if (i.positionId.includes(item.positionId)) {
                        i.value = i.userId
                        i.label = i.userName
                        return i
                    }
                }).filter(i => i)
                return item
            })
            const res = []
            temp.forEach(item => {
                const index = res.findIndex(i => item.path === `${i.path}${item.value}.`)
                if (index !== -1) {
                    res[index].children.unshift(item)
                } else {
                    res.push(item)
                }
            })
            return res
        },
        transformUser (user) {
            const idList = user.split(',')
            const { userList = [] } = this.$store.getters
            const nameList = idList.map(id => {
                const user = userList.find(u => u.userId === id) || {}
                return user.userName || '-'
            })
            return nameList.join('，')
        },
        formatNum (num) {
            return num === null || num === undefined || num === '' ? 0 : num
        },
        handleRowDblclick (row) {
            this.handleColumnAction(row, true)
        },
        handleColumnAction (row, readonly) {
            this.quesId = row.quesId
            this.quesReadonly = readonly
            this.isCopy = this.quesIdList.includes(this.quesId)
            this.questionDialogVisible = true
        },
        handleRemove (row) {
            this.$confirm('确定要删除该题目吗？删除操作将在题库信息保存后生效', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.questionData = this.questionData.filter(item => item.quesId !== row.quesId)
            })
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
        // 获取题库数据
        getQuestionData () {
            if (this.$utils.isEmpty(this.formId)) {
                return
            }
            const sql1 = `select id_, bian_zhi_ren_, bian_zhi_bu_men_, bian_zhi_shi_jian, ti_ku_ming_cheng_, ti_ku_fen_lei_, ti_ku_zhuang_tai_, shi_fou_gong_kai_, xian_kao_ci_shu_, ping_fen_ren_, miao_shu_, suo_shu_fan_wei_, kao_shi_shi_chang, da_biao_zhan_bi_ from t_question_bank where id_ = '${this.formId}'`
            const sql2 = `select id_ as quesId, chu_ti_ren_ as creator, bu_men_ as createDept, chu_ti_shi_jian_ as createTime, xu_hao_ as sn, ti_gan_ as content, ti_xing_ as quesType, fu_tu_ as img, xuan_xiang_lei_xi as optionType, da_an_ as answer, zheng_que_da_an_ as rightKey, ping_fen_fang_shi as rateType, ping_fen_ren_ as rater, fen_zhi_ as score, bei_zhu_ as note, xuan_xiang_shu_ as optionCount, biao_qian_ as quesTag, zhuang_tai_ as quesState,nan_du_ as questionLevel,da_an_jie_xi_ as resolution, from t_questions where parent_id_ = '${this.formId}' order by chu_ti_shi_jian_ desc`
            Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2)]).then(([res1, res2]) => {
                const { data: bankData = [] } = res1.variables || {}
                const { data: questionData = [] } = res2.variables || {}
                if (!bankData.length) {
                    this.$message.error('数据不存在')
                    return
                }
                const bank = bankData[0]
                bank.isLimit = bank.xian_kao_ci_shu_ === '不限' ? '0' : '1'
                bank.ping_fen_ren_ = bank.ping_fen_ren_ ? bank.ping_fen_ren_.split(',') : []
                // bank.suo_shu_fan_wei_ = bank.suo_shu_fan_wei_ === '不限' ? '不限' : '科级'
                if (bank.kao_shi_shi_chang === '不限') {
                    bank.limitTime = '0'
                    bank.hours = null
                    bank.minutes = null
                } else {
                    bank.limitTime = '1'
                    bank.hours = Math.floor(bank.kao_shi_shi_chang / (1000 * 60 * 60))
                    bank.minutes = (bank.kao_shi_shi_chang % (1000 * 60 * 60)) / (60 * 1000)
                }
                // console.log(questionData)
                this.questionData = questionData
                this.initialData = JSON.parse(JSON.stringify(questionData))
                this.form = bank
            })
        },
        addSelectQuestion () {
            const sql = `select id_ as quesId, chu_ti_ren_ as creator, bu_men_ as createDept, chu_ti_shi_jian_ as createTime, xu_hao_ as sn, ti_gan_ as content, ti_xing_ as quesType, fu_tu_ as img, xuan_xiang_lei_xi as optionType, da_an_ as answer, zheng_que_da_an_ as rightKey, ping_fen_fang_shi as rateType, ping_fen_ren_ as rater, fen_zhi_ as score, bei_zhu_ as note, xuan_xiang_shu_ as optionCount, biao_qian_ as quesTag, zhuang_tai_ as quesState,nan_du_ as questionLevel,da_an_jie_xi_ as resolution from t_questions where find_in_set(id_, '${this.quesIdList}')`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                this.questionData = data.concat(this.questionData)
            })
        },
        // 查询使用该题库的考试
        async checkExistExam () {
            if (this.formId) {
                const sql = `select id_,kao_shi_ming_chen from t_exams where ti_ku_id_='${this.formId}' order by create_time_ desc`
                const { variables: { data = [] } = {}} = await this.$common.request('sql', sql)
                return data
            }
            return []
        },
        handleSubmit () {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    if (this.form.suo_shu_fan_wei_ === '组级' && !this.form.bian_zhi_bu_men_) {
                        this.$message.warning('所属范围为组级，请选择对应的专业组！')
                    } else {
                        const examsList = await this.checkExistExam()
                        if (examsList.length > 0) {
                            this.$confirm(`当前题库存在正在进行中的“${examsList.length}场”考试，考试名称为：【${examsList.map(i => i.kao_shi_ming_chen).join('，')}】，考试中更改题库可能会影响考试数据结果，是否继续?`, '提示', {
                                confirmButtonText: '继续',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.submitForm()
                            }).catch(() => {})
                        } else {
                            this.submitForm()
                        }
                    }
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        async updatePaper (bankId) {
            const sql = `select fen_zhi_ from t_questions where parent_id_ = '${bankId}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                const params = {
                    tableName: 't_question_bank',
                    updList: [
                        {
                            where: {
                                id_: bankId
                            },
                            param: {
                                ti_shu_: data.length,
                                zong_fen_: data.reduce((sum, item) => sum + parseInt(item.fen_zhi_), 0)
                            }
                        }
                    ]
                }
                this.$common.request('update', params).then(() => {
                    console.log('更新题库信息成功')
                    this.closeDialog()
                })
            })
        },
        async createQuestion (list, bankId) {
            const paramWhere = list.map(item => ({
                di_dian_: this.level,
                parent_id_: bankId,
                bu_men_: item.createDept || '',
                chu_ti_ren_: item.creator,
                chu_ti_shi_jian_: item.createTime,
                xu_hao_: item.sn || '',
                ti_gan_: item.content,
                ti_xing_: item.quesType,
                fu_tu_: item.img || '',
                xuan_xiang_lei_xi: item.optionType || '',
                da_an_: item.answer || '',
                fen_zhi_: item.score,
                xuan_xiang_shu_: item.optionCount || '',
                zheng_que_da_an_: item.rightKey,
                ping_fen_fang_shi: item.rateType || '',
                ping_fen_ren_: item.rater || '',
                bei_zhu_: item.note || '',
                zhuang_tai_: item.quesState,
                biao_qian_: item.quesTag || '',
                nan_du_: item.questionLevel || 0,
                da_an_jie_xi_: item.resolution || ''
            }))
            await this.$common.request('add', {
                tableName: 't_questions',
                paramWhere
            })
        },
        // 软删除，删除关联关系
        async deleteQuestion (list) {
            const updList = list.map(item => ({
                where: {
                    id_: item.quesId
                },
                param: {
                    parent_id_: ''
                }
            }))
            await this.$common.request('update', {
                tableName: 't_questions',
                updList
            })
        },
        submitForm () {
            if (this.form.limitTime === '0') {
                this.form.kao_shi_shi_chang = '不限'
            } else {
                this.form.kao_shi_shi_chang = (this.formatNum(this.form.hours) * 60 + this.formatNum(this.form.minutes)) * 60 * 1000
            }
            this.form.bian_zhi_bu_men_ = this.form.suo_shu_fan_wei_ === '科级' ? '' : this.form.bian_zhi_bu_men_
            this.form.di_dian_ = this.level
            this.form.ping_fen_ren_ = this.form.ping_fen_ren_ ? this.form.ping_fen_ren_.join(',') : ''
            delete this.form.isLimit
            delete this.form.limitTime
            delete this.form.hours
            delete this.form.minutes
            const addParams = {
                tableName: 't_question_bank',
                paramWhere: [{
                    ...this.form,
                    ti_shu_: 0,
                    zong_fen_: 0
                }]
            }
            const updateParams = {
                tableName: 't_question_bank',
                updList: [
                    {
                        where: {
                            id_: this.formId
                        },
                        param: this.form
                    }
                ]
            }
            const type = this.formId ? 'update' : 'add'
            const params = type === 'add' ? addParams : updateParams
            const temp = this.questionData.filter(i => !this.quesIdList.includes(i.quesId)).map(i => i.quesId)
            const deleteList = this.initialData.filter(item => !temp.includes(item.quesId))
            const createList = this.questionData.filter(i => this.quesIdList.includes(i.quesId))
            this.$common.request(type, params).then(async res => {
                const { cont = [] } = res.variables || {}
                let dataId = this.id
                if (cont.length) {
                    dataId = cont[0].id_
                }
                const PromiseList = []
                if (createList.length) {
                    PromiseList.push(this.createQuestion(createList, dataId))
                }
                if (deleteList.length) {
                    PromiseList.push(this.deleteQuestion(deleteList))
                }
                Promise.all(PromiseList).then(() => {
                    this.updatePaper(dataId)
                })
                this.$message.success(this.formId ? '保存题库信息成功' : '新增题库成功')
            })
        },
        // table复选框
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        // 批量删除
        removeItems () {
            if (this.multipleSelection.length === 0) {
                return this.$message.warning('请选择需要删除的题目！')
            }
            this.$confirm('确定要删除所选中的题目吗？删除操作将在题库信息保存后生效', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.questionData = this.questionData.filter(item => !this.multipleSelection.includes(item))
                this.multipleSelection = []
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        updateData (data) {
            this.questionData = data
        }
    }
}
</script>
<style lang="scss" scoped>
    .paper-dialog {
        ::v-deep {
            .el-dialog {
                min-width: 1080px;
            }
            .el-dialog__body {
                height: calc(88vh - 200px);
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
        .readonly-form {
            ::v-deep {
                .el-radio, .el-checkbox, .el-radio-button, .el-input, .el-select, .el-textarea, .el-input-number {
                    pointer-events: none;
                }
            }
        }
        .paper-form {
            padding: 20px 20px 14px 20px;
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
        .question-table {
            margin-bottom: 20px;
            padding: 0 20px;
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
            .question-select {
                display: flex;
                align-items: center;
                .label {
                    width: 138px;
                    padding-right: 12px;
                    text-align: right;
                }
                .custom-dialog {
                    flex: 1;
                }
                margin-bottom: 10px;
            }
            .table-title {
                font-size: 16px;
                font-weight: 600;
                margin: 20px 0 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
    .question-info {
        overflow:auto;
        max-width: 536px;
        display: flex;
        .question-info-item {
            display: flex;
            margin-bottom: 10px;
            max-width: 200px;
            font-size: 14px;
            .label {
                width: 100px;
                font-size: 14px;
                color: #606266;
                text-align: left;
            }
            .value {
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .right{
            display: flex;
            margin-left: 20px;
            .ibps-image{
                font-size: 0;
                ::v-deep{
                    .list-group{
                        display: flex;
                    }
                }

            }
        }
    }
</style>
