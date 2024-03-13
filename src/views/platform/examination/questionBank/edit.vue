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
            @submit.native.prevent
        >
            <el-form-item label="题库名称：" prop="ti_ku_ming_cheng_">
                <el-input v-model="form.ti_ku_ming_cheng_" type="text" :maxlength="128" />
            </el-form-item>
            <el-form-item label="题库分类：" prop="ti_ku_fen_lei_">
                <el-select
                    v-model="form.ti_ku_fen_lei_"
                    filterable
                    allow-create
                    width="100%"
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
            <el-form-item label="题库状态：" prop="ti_ku_zhuang_tai_">
                <el-radio-group v-model="form.ti_ku_zhuang_tai_">
                    <el-radio label="可用">可用</el-radio>
                    <el-radio label="不可用">不可用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item prop="shi_fou_gong_kai_">
                <template slot="label">
                    是否公开
                    <el-tooltip effect="dark" content="限制该题库是否可自主考核。若您希望该题库仅用于考试中，则需要设置为“否" placement="top">
                        <i class="el-icon-question question-icon">：</i>
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.shi_fou_gong_kai_">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="所属范围：" prop="suo_shu_fan_wei_" class="inline-item">
                <el-radio-group v-model="form.suo_shu_fan_wei_">
                    <el-radio label="科级">科级</el-radio>
                    <el-radio label="组级">组级</el-radio>
                </el-radio-group>
                <el-select
                    v-if="form.suo_shu_fan_wei_ === '组级'"
                    v-model="form.bian_zhi_bu_men_"
                    width="100%"
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
            <el-form-item label="限考次数：" prop="isLimit" class="inline-item">
                <el-radio-group v-model="form.isLimit" @change="changeLimit">
                    <el-radio label="0">不限</el-radio>
                    <el-radio label="1">限制</el-radio>
                </el-radio-group>
                <div v-if="form.isLimit === '1'" class="time">
                    <el-input-number
                        v-model="form.xian_kao_ci_shu_"
                        :min="1"
                        :precision="0"
                        placeholder="请输入单个用户最大限考次数"
                    />
                    <div class="unit">次</div>
                </div>
            </el-form-item>
            <el-form-item label="考试时长：" prop="limitTime" class="inline-item">
                <el-radio-group v-model="form.limitTime">
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
                        />
                        <div class="unit">小时</div>
                    </div>
                    <div class="time">
                        <el-input-number
                            v-model="form.minutes"
                            :min="0"
                            :max="59"
                            :precision="0"
                        />
                        <div class="unit">分钟</div>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="达标分值占比：" prop="da_biao_zhan_bi_">
                <el-input-number
                    v-model="form.da_biao_zhan_bi_"
                    :min="50"
                    :max="100"
                    :precision="0"
                    placeholder="请输入达标分值占比"
                />
                <div class="unit">%</div>
            </el-form-item>
            <el-form-item label="默认评分人：" prop="ping_fen_ren_">
                <!-- <el-cascader v-model="form.ping_fen_ren_" :options="getRaterOptions(userList)" :show-all-levels="false" /> -->
                <el-select
                    v-model="form.ping_fen_ren_"
                    filterable
                    allow-create
                    width="100%"
                    placeholder="请选择默认评分人"
                >
                    <el-option
                        v-for="item in getRaterOptions(userList)"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="题库描述：" prop="miao_shu_">
                <el-input v-model="form.miao_shu_" type="textarea" :rows="4" placeholder="请输入描述内容" />
            </el-form-item>
        </el-form>
        <div class="question-table">
            <el-table
                ref="elTable"
                :data="questionData"
                border
                stripe
                highlight-current-row
                style="width: 100%"
                max-height="400px"
                class="exam-table"
                @row-dblclick="handleRowDblclick"
            >
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column
                    prop="content"
                    label="题干"
                    min-width="150"
                >
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <div class="question-info">
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
                                    <div class="value">{{ scope.row.rater || '—' }}</div>
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
                            <div slot="reference" class="name-wrapper">{{ scope.row.content }}</div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="quesType"
                    label="题型"
                    width="70"
                />
                <!-- <el-table-column
                    prop="optionType"
                    label="选项类型"
                    width="70"
                />
                <el-table-column
                    prop="rateType"
                    label="评分方式"
                    width="70"
                />
                <el-table-column
                    prop="rater"
                    label="评分人"
                    width="70"
                >
                    <template slot-scope="scope">
                        <div>{{ transformUser(scope.row.rater) }}</div>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="score"
                    label="分值"
                    width="75"
                    sortable
                />
                <!-- <el-table-column
                    prop="creator"
                    label="出题人"
                    width="70"
                >
                    <template slot-scope="scope">
                        <div>{{ transformUser(scope.row.creator) }}</div>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="createTime"
                    label="出题时间"
                    width="150"
                    sortable
                />
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="60"
                >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleRowDblclick(scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            :visible.sync="questionDialogVisible"
            @close="questionDialogVisible = false"
        />
    </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
import { paperTypeOptions } from '../constants'
export default {
    components: {
        QuesEdit: () => import('../question/edit')
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
        const { userList = [], deptList = [], userId } = this.$store.getters || {}
        return {
            userList,
            paperTypeOptions,
            deptList: deptList.filter(i => i.depth === 4),
            title: this.id ? '编辑题库' : '创建题库',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            questionData: [],
            questionDialogVisible: false,
            quesId: '',
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
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            }
            // immediate: true
        }
    },
    created () {
        this.getQuestionData()
    },
    methods: {
        changeLimit (e) {
            this.form.xian_kao_ci_shu_ = e === '1' ? 1 : '不限'
        },
        getRaterOptions (list) {
            const data = [
                {
                    value: '',
                    label: '',
                    children: [
                        {
                            value: '',
                            label: ''
                        },
                        {
                            value: '',
                            label: ''
                        }
                    ]
                },
                {
                    value: '',
                    label: '',
                    children: [
                        {
                            value: '',
                            label: ''
                        },
                        {
                            value: '',
                            label: ''
                        }
                    ]
                }
            ]
            return this.userList
        },
        transformUser (userId) {
            const { userList = [] } = this.$store.getters
            const user = userList.find(u => u.userId === userId) || {}
            return user.userName || '-'
        },
        handleRowDblclick (row) {
            this.quesId = row.quesId
            this.questionDialogVisible = true
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
            const sql2 = `select id_ as quesId, chu_ti_ren_ as creator, bu_men_ as createDept, chu_ti_shi_jian_ as createTime, xu_hao_ as sn, ti_gan_ as content, ti_xing_ as quesType, xuan_xiang_lei_xi as optionType, zheng_que_da_an_ as answer, ping_fen_fang_shi as rateType, ping_fen_ren_ as rater, fen_zhi_ as score, biao_qian_ as quesTag, zhuang_tai_ as quesState from t_questions where parent_id_ = '${this.formId}'`
            Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2)]).then(([res1, res2]) => {
                const { data: bankData = [] } = res1.variables || {}
                const { data: questionData = [] } = res2.variables || {}
                if (!bankData.length) {
                    this.$message.error('数据不存在')
                    return
                }
                const bank = bankData[0]
                bank.isLimit = bank.xian_kao_ci_shu_ === '不限' ? '0' : '1'
                if (bank.kao_shi_shi_chang === '不限') {
                    bank.limitTime = '0'
                    bank.hours = null
                    bank.minutes = null
                } else {
                    bank.limitTime = '1'
                    bank.hours = Math.floor(bank.kao_shi_shi_chang / (1000 * 60 * 60))
                    bank.minutes = (bank.kao_shi_shi_chang % (1000 * 60 * 60)) / (60 * 1000)
                }
                console.log(questionData)
                this.questionData = questionData
                this.form = bank
            })
        },
        handleSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // 表单验证通过，提交表单
                    this.submitForm()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        submitForm () {
            if (this.form.limitTime === '0') {
                this.form.kao_shi_shi_chang = '不限'
            } else {
                this.form.kao_shi_shi_chang = (this.form.hours * 60 + this.form.minutes) * 60 * 1000
            }
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
            this.$common.request(type, params).then(() => {
                this.$message.success(this.formId ? '保存题库成功' : '新增题库成功')
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
        .paper-form {
            padding: 20px;
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
        }
    }
    .question-info {
        .question-info-item {
            display: flex;
            margin-bottom: 10px;
            max-width: 200px;
            .label {
                width: 100px;
                font-size: 14px;
                color: #606266;
                text-align: right;
                margin-right: 10px;
            }
            .value {
                font-weight: 600;
            }
        }
    }
</style>
