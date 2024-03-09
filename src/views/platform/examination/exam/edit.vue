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
        @open="getQuestionData"
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
                <el-input v-model="form.kao_shi_ming_chen" type="text" :maxlength="256" />
            </el-form-item>
            <el-form-item label="考试类型：" prop="kao_shi_lei_xing_">
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
            </el-form-item>
            <el-form-item label="考试题库：" prop="ti_ku_id_">
                <ibps-custom-dialog
                    v-model="form.ti_ku_id_"
                    size="mini"
                    template-key="tkdhk"
                    style="width: 200px;"
                    :multiple="false"
                    type="dialog"
                    placeholder="请选择考试题库"
                />
            </el-form-item>
            <el-form-item label="限考时间：" prop="xian_kao_shi_jian">
                <el-radio-group v-model="form.xian_kao_shi_jian">
                    <el-radio label="可用">可用</el-radio>
                    <el-radio label="不可用">不可用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="参考人员：" prop="can_kao_ren_yuan_">
                <ibps-custom-dialog
                    v-model="form.can_kao_ren_yuan_"
                    size="mini"
                    template-key="gjxcxryk"
                    style="width: 200px;"
                    multiple
                    type="dialog"
                    placeholder="请选择需参加考试的人员"
                />
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
            <el-form-item label="计分方式：" prop="ji_fen_fang_shi_">
                <template slot="label">
                    <el-tooltip effect="dark" content="仅限考次数大于1时有效" placement="top">
                        <i class="el-icon-question" />
                    </el-tooltip>
                </template>
                <el-radio-group v-model="form.ji_fen_fang_shi_">
                    <el-radio label="平均分">平均分</el-radio>
                    <el-radio label="最高分">最高分</el-radio>
                    <el-radio label="最近得分">最近得分</el-radio>
                </el-radio-group>
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
            <el-form-item label="考试描述：" prop="kao_shi_miao_shu_">
                <el-input v-model="form.kao_shi_miao_shu_" type="textarea" :rows="4" placeholder="请输入描述内容" />
            </el-form-item>
        </el-form>
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
        }
    },
    data () {
        const { userList = [], deptList = [], userId, level } = this.$store.getters || {}
        return {
            userList,
            examTypeOptions,
            deptList: deptList.filter(i => i.depth === 4),
            title: '新建考试',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            form: {
                di_dian_: level.second || level.first,
                chuang_jian_shi_j: '',
                kao_shi_ming_chen: '',
                kao_shi_lei_xing_: examTypeOptions.length ? examTypeOptions[0].value : '',
                ti_ku_id_: '',
                xian_kao_shi_jian: '',
                xian_kao_ci_shu_: '不限',
                can_kao_ren_yuan_: '',
                kao_shi_shi_chang: '',
                zhuang_tai_: '未发布',
                da_biao_zhan_bi_: 60,
                ji_fen_fang_shi_: scoringType.length ? scoringType[0].value : '',
                kao_shi_miao_shu_: '',
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
                kao_shi_ming_chen: [{ required: true, message: this.$t('validate.required') }],
                kao_shi_lei_xing_: [{ required: true, message: this.$t('validate.required') }],
                ti_ku_id_: [{ required: true, message: this.$t('validate.required') }],
                xian_kao_shi_jian: [{ required: true, message: this.$t('validate.required') }],
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
        formData () {
            return this.data
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
            const sql = `select id_, bian_zhi_ren_, bian_zhi_bu_men_, bian_zhi_shi_jian, kao_shi_ming_chen, kao_shi_lei_xing_, ti_ku_id_, xian_kao_ci_shu_, ping_fen_ren_, kao_shi_miao_shu_, suo_shu_fan_wei_, kao_shi_shi_chang, da_biao_zhan_bi_ from t_question_bank where id_ = '${this.formId}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    this.$message.error('数据不存在')
                    return
                }
                data[0].isLimit = data[0].xian_kao_ci_shu_ === '不限' ? '0' : '1'
                if (data[0].kao_shi_shi_chang === '不限') {
                    data[0].limitTime = '0'
                    data[0].hours = null
                    data[0].minutes = null
                } else {
                    data[0].limitTime = '1'
                    data[0].hours = Math.floor(data[0].kao_shi_shi_chang / (1000 * 60 * 60))
                    data[0].minutes = (data[0].kao_shi_shi_chang % (1000 * 60 * 60)) / (60 * 1000)
                }
                this.form = data[0]
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
    .exam-dialog {
        ::v-deep {
            .el-dialog {
                max-width: 1080px;
            }
            .el-dialog__body {
                height: calc(88vh - 200px);
            }
            .el-form-item {
                margin-bottom: 14px !important;
                &:last-child {
                    margin-bottom: 0 !important;
                }
            }
            .el-form-item--small .el-form-item__error {
                padding-top: 6px;
            }
        }
        .exam-form {
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
    }
</style>
