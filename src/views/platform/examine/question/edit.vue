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
            <el-form-item label="题干：" prop="ti_gan_">
                <el-input
                    v-model="form.ti_gan_"
                    type="textarea"
                    :maxlength="512"
                    :rows="4"
                    placeholder="请输入题干内容"
                />
            </el-form-item>
            <div class="inline-item">
                <el-form-item label="题型：" prop="ti_xing_">
                    <el-select
                        v-model="form.ti_xing_"
                        filterable
                        allow-create
                        width="100%"
                        placeholder="请选择题型"
                    >
                        <el-option
                            v-for="item in questionType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="评分方式：" prop="ping_fen_fang_shi">
                    <el-radio-group v-model="questionRateType" disabled>
                        <el-radio-button label="自动">自动</el-radio-button>
                        <el-radio-button label="手动">手动</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="评分人：" prop="ping_fen_ren_">
                    <!-- <el-cascader v-model="form.ping_fen_ren_" :options="getRaterOptions(userList)" :show-all-levels="false" /> -->
                    <el-select
                        v-model="form.ping_fen_ren_"
                        filterable
                        allow-create
                        width="100%"
                        placeholder="请选择评分人"
                    >
                        <el-option
                            v-for="item in getRaterOptions(userList)"
                            :key="item.userId"
                            :label="item.userName"
                            :value="item.userId"
                        />
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="附图：" prop="fu_tu_">
                <ibps-image
                    v-model="form.fu_tu_"
                    height="100"
                    width="100"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                    multiple
                    download
                    tip=""
                    size=""
                    :disabled="false"
                />
            </el-form-item>
            <el-form-item label="选项类型：" prop="xuan_xiang_lei_xi">
                <el-radio-group v-model="form.xuan_xiang_lei_xi">
                    <el-radio-button label="文本">文本</el-radio-button>
                    <el-radio-button label="图片">图片</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选项：" prop="da_an_">
                <!-- <el-radio-group v-model="form.da_an_">
                    <el-radio label="自动">自动</el-radio>
                    <el-radio label="手动">手动</el-radio>
                </el-radio-group> -->
            </el-form-item>
            <el-form-item label="备注：" prop="bei_zhu_">
                <el-input v-model="form.bei_zhu_" type="textarea" :rows="4" placeholder="请输入题目备注信息" />
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
import { questionType, rateType } from '../constants'
export default {
    components: {
        IbpsImage: () => import('@/business/platform/file/image')
    },
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
        const defaultType = questionType.length ? questionType[0].value : ''
        return {
            userList,
            questionType,
            rateType,
            deptList: deptList.filter(i => i.depth === 4),
            title: '添加题目',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            filePreviewVisible: false,
            form: {
                bian_zhi_bu_men_: '',
                bian_zhi_ren_: userId,
                bian_zhi_shi_jian: this.$common.getDateNow(19),
                ti_gan_: '',
                ti_xing_: defaultType,
                fu_tu_: '',
                xuan_xiang_lei_xi: '文本',
                da_an_: '',
                zheng_que_da_an_: '',
                ping_fen_fang_shi: rateType[defaultType] || '',
                ping_fen_ren_: '',
                bei_zhu_: ''
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
                ti_gan_: [{ required: true, message: this.$t('validate.required') }],
                ti_xing_: [{ required: true, message: this.$t('validate.required') }],
                xuan_xiang_lei_xi: [{ required: true, message: this.$t('validate.required') }],
                da_an_: [{ required: true, message: this.$t('validate.required') }],
                zheng_que_da_an_: [{ required: true, message: this.$t('validate.required') }],
                ping_fen_fang_shi: [{ required: true, message: this.$t('validate.required') }],
                ping_fen_ren_: [{ required: true, message: this.$t('validate.required') }]
            }

        }
    },
    computed: {
        formId () {
            return this.id
        },
        formData () {
            return this.data
        },
        questionRateType () {
            return this.rateType[this.form.ti_xing_] || ''
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
        uploadCallback (data) {
            console.log(data)
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
            console.log(this.formId)
            if (this.$utils.isEmpty(this.formId)) {
                return
            }
            const sql = `select id_, bian_zhi_ren_, bian_zhi_bu_men_, bian_zhi_shi_jian, ti_gan_, ti_xing_, xuan_xiang_lei_xi, xian_kao_ci_shu_, ping_fen_ren_, bei_zhu_, suo_shu_fan_wei_ from t_question_bank where id_ = '${this.formId}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    this.$message.error('数据不存在')
                    return
                }
                this.form = data[0]
                this.form.isLimit = data[0].xian_kao_ci_shu_ === '不限' ? 0 : 1
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
            delete this.form.isLimit
            const addParams = {
                tableName: 't_question_bank',
                paramWhere: [this.form]
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
            .question-form > .el-form-item:first-child {
                margin-top: 20px;
            }
            .el-form-item {
                margin-bottom: 14px !important;
                padding: 0 20px;
            }
            .el-form-item--small .el-form-item__error {
                padding-top: 6px;
            }
            .el-radio-button__orig-radio {
                &:disabled + .el-radio-button__inner {
                    color: #606266;
                    &:checked {
                        color: #fff;
                        background-color: #409EFF;
                    }
                }
            }
            .ibps-image {
                font-size: 0;
                .el-upload--picture-card {
                    font-size: 24px;
                }
            }
        }
        .inline-item {
            display: flex;
            .el-form-item {
                flex: 1;
            }
        }
    }
</style>
