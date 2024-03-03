<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog question-detail-dialog"
        top="6vh"
        @close="closeDialog"
        @open="getQuestionData"
    >
        <el-form
            ref="form"
            :label-width="formLabelWidth"
            :model="form"
            :rules="rules"
            class="question-form"
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
                <el-radio-group v-model="form.isLimit">
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
            <el-form-item label="考试时长：" prop="kao_shi_shi_chang" class="inline-item">
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
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        id: String,
        data: [Object, String]
    },
    data () {
        const { userList = [], deptList = [], userId } = this.$store.getters || {}
        return {
            userList,
            paperTypeOptions,
            deptList: deptList.filter(i => i.depth === 4),
            title: '创建题库',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            filePreviewVisible: false,
            form: {
                bian_zhi_bu_men_: '',
                bian_zhi_ren_: userId,
                bian_zhi_shi_jian: this.$common.getDateNow(19),
                ti_ku_ming_cheng_: '',
                suo_shu_fan_wei_: '科级',
                ti_ku_fen_lei_: paperTypeOptions.length ? paperTypeOptions[0].value : '',
                ti_ku_zhuang_tai_: '可用',
                xian_kao_ci_shu_: '不限',
                ping_fen_ren_: '',
                da_biao_zhan_bi_: 60,
                miao_shu_: '',
                ti_shu_: 0,
                isLimit: '0',
                limitTime: '0',
                hours: null,
                minutes: null
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
            this.form.xian_kao_ci_shu_ = e ? 1 : '不限'
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
            const sql = `select id_, bian_zhi_ren_, bian_zhi_bu_men_, bian_zhi_shi_jian, ti_ku_ming_cheng_, ti_ku_fen_lei_, ti_ku_zhuang_tai_, xian_kao_ci_shu_, ping_fen_ren_, miao_shu_, suo_shu_fan_wei_, kao_shi_shi_chang, da_biao_zhan_bi_ from t_question_bank where id_ = '${this.formId}'`
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
    .question-detail-dialog {
        ::v-deep {
            .el-dialog__body {
                height: calc(88vh - 200px);
            }
            .el-form-item {
                margin-bottom: 14px !important;
                padding: 0 20px;
            }
            .el-form-item--small .el-form-item__error {
                padding-top: 6px;
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
    }
</style>
