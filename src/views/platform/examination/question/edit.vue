<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog question-dialog"
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
            :class="readonly ? 'readonly-form' : ''"
            @submit.native.prevent
        >
            <div class="inline-item">
                <el-form-item label="题型：" prop="ti_xing_">
                    <el-select
                        v-model="form.ti_xing_"
                        filterable
                        allow-create
                        width="100%"
                        placeholder="请选择题型"
                        @change="changeQuestionType"
                    >
                        <el-option
                            v-for="item in questionType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="出题人：" prop="chu_ti_ren_">
                    <!-- <el-cascader v-model="form.chu_ti_ren_" :options="getRaterOptions(userList)" :show-all-levels="false" /> -->
                    <el-select
                        v-model="form.chu_ti_ren_"
                        filterable
                        allow-create
                        width="100%"
                        placeholder="请选择出题人"
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
            <div class="inline-item" :class="['单选题', '多选题', '判断题'].includes(form.ti_xing_) ? 'mb-20' : ''">
                <el-form-item label="评分方式：" prop="ping_fen_fang_shi">
                    <el-radio-group v-model="questionRateType" disabled>
                        <el-radio-button label="自动">自动</el-radio-button>
                        <el-radio-button label="手动">手动</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="questionRateType === '手动'" label="评分人：" prop="ping_fen_ren_">
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
            <el-form-item label="题干：" prop="ti_gan_">
                <el-input
                    v-model="form.ti_gan_"
                    type="textarea"
                    :maxlength="512"
                    :rows="2"
                    placeholder="请输入题干内容"
                />
            </el-form-item>
            <el-form-item label="标签：" prop="biao_qian_">
                <el-tag
                    v-for="tag in questionTags"
                    :key="tag"
                    closable
                    size="medium"
                    class="qustion-tag"
                    :disable-transitions="false"
                    @close="handleTagDelete(tag)"
                >
                    {{ tag }}
                </el-tag>
                <el-input
                    v-if="tagInputVisible"
                    ref="saveTagInput"
                    v-model="tagValue"
                    class="input-new-tag"
                    size="small"
                    @keyup.enter.native="handleTagConfirm"
                    @blur="handleTagConfirm"
                />
                <el-button v-else class="button-new-tag" size="small" @click="showTagEdit">+ 添 加</el-button>
            </el-form-item>
            <el-form-item label="附图：" prop="fu_tu_">
                <ibps-image
                    v-model="form.fu_tu_"
                    height="100"
                    width="100"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                    multiple
                    download
                    size=""
                />
            </el-form-item>
            <div class="inline-item" :class="['单选题', '多选题'].includes(form.ti_xing_) ? '' : 'mb-20'">
                <el-form-item label="分值：" prop="fen_zhi_" :maxlength="8">
                    <el-input-number
                        v-model="form.fen_zhi_"
                        :min="1"
                        :max="100"
                        :precision="0"
                        type="number"
                        placeholder="请输入题目分值"
                    />
                </el-form-item>
                <el-form-item v-if="['单选题', '多选题'].includes(form.ti_xing_)" label="选项类型：" prop="xuan_xiang_lei_xi">
                    <el-radio-group v-model="form.xuan_xiang_lei_xi" disabled>
                        <el-radio-button label="文本">文本</el-radio-button>
                        <el-radio-button label="图片">图片</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </div>
            <template v-if="['单选题', '多选题'].includes(form.ti_xing_)">
                <el-form-item
                    v-for="(item, index) in optionList"
                    :key="`${item.value}${index}`"
                    class="option-item"
                >
                    <template slot="label">
                        <div class="custom-label">{{ `选项${item.value}：` }}</div>
                    </template>
                    <el-input
                        v-model="item.content"
                        type="textarea"
                        :rows="1"
                        placeholder="请输入选项内容，最多可配置8个选项"
                    />
                    <el-radio-group v-if="form.ti_xing_ === '单选题'" v-model="item.radio">
                        <el-radio :label="item.value" @change="changeRadio(index, item.value)">正确选项</el-radio>
                    </el-radio-group>
                    <el-checkbox-group v-else-if="form.ti_xing_ === '多选题'" v-model="item.checkbox">
                        <el-checkbox :label="item.value">正确选项</el-checkbox>
                    </el-checkbox-group>
                    <div class="operate-btn">
                        <el-button
                            v-if="index === 0 && optionList.length < 8"
                            type="primary"
                            :tabindex="-1"
                            icon="el-icon-plus"
                            circle
                            @click="addOption"
                        />
                        <el-button
                            v-else-if="index === optionList.length - 1"
                            type="danger"
                            :tabindex="-1"
                            icon="el-icon-delete"
                            circle
                            @click="subOption"
                        />
                    </div>
                </el-form-item>
            </template>
            <template v-else-if="form.ti_xing_ === '填空题'">
                <el-form-item
                    v-for="(item, index) in optionList"
                    :key="`${item.value}${index}`"
                    class="option-item"
                >
                    <template slot="label">
                        <div class="custom-label">{{ `答案${index + 1}：` }}</div>
                    </template>
                    <el-input
                        v-model="item.content"
                        type="textarea"
                        :rows="1"
                        placeholder="请输入答案内容，最多可配置20个答案"
                    />
                    <div v-if="!readonly" class="operate-btn">
                        <el-button
                            v-if="index === 0 && optionList.length < 20"
                            type="primary"
                            :tabindex="-1"
                            icon="el-icon-plus"
                            circle
                            @click="addOption"
                        />
                        <el-button
                            v-else-if="index === optionList.length - 1"
                            type="danger"
                            :tabindex="-1"
                            icon="el-icon-delete"
                            circle
                            @click="subOption"
                        />
                    </div>
                </el-form-item>
            </template>
            <template v-else-if="form.ti_xing_ === '判断题'">
                <el-form-item prop="zheng_que_da_an_" label="答案：">
                    <el-radio-group v-model="form.zheng_que_da_an_">
                        <el-radio-button label="√">√</el-radio-button>
                        <el-radio-button label="×">×</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </template>
            <template v-else-if="form.ti_xing_ === '简答题'">
                <el-form-item prop="zheng_que_da_an_" label="答案：">
                    <el-input
                        v-model="form.zheng_que_da_an_"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入答案内容"
                    />
                </el-form-item>
            </template>
            <el-form-item label="备注：" prop="bei_zhu_">
                <el-input v-model="form.bei_zhu_" type="textarea" :rows="2" placeholder="请输入题目备注信息" />
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
import { questionType, rateType, defaultOptions } from '../constants'
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
        // 是否复制题目
        isCopy: {
            type: Boolean,
            default: false
        },
        // 题库题目ID
        quesIdList: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList = [], deptList = [], userId } = this.$store.getters || {}
        const defaultType = questionType.length ? questionType[0].value : ''
        return {
            userList,
            questionType,
            rateType,
            deptList: deptList.filter(i => i.depth === 4),
            title: this.readonly ? '题目详情' : this.id ? '编辑题目' : '添加题目',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            tagInputVisible: false,
            tagValue: '',
            form: {
                // bu_men_: '',
                parent_id_: this.bankId,
                chu_ti_ren_: userId,
                chu_ti_shi_jian_: this.$common.getDateNow(19),
                ti_gan_: '',
                ti_xing_: defaultType,
                fu_tu_: '',
                xuan_xiang_lei_xi: '文本',
                da_an_: '',
                xuan_xiang_shu_: '',
                zheng_que_da_an_: '',
                ping_fen_fang_shi: rateType[defaultType] || '',
                ping_fen_ren_: userId,
                fen_zhi_: '',
                bei_zhu_: '',
                zhuang_tai_: '启用'
            },
            questionTags: [],
            toolbars: [
                {
                    key: 'submit',
                    icon: 'ibps-icon-save',
                    label: '保存',
                    hidden: () => {
                        return this.readonly
                    }
                },
                {
                    key: 'submitAndContinue',
                    icon: 'ibps-icon-send',
                    label: '保存并继续',
                    type: 'warning',
                    hidden: () => {
                        return this.readonly || this.id
                    }
                },
                {
                    key: 'reset',
                    icon: 'ibps-icon-refresh',
                    label: '重置',
                    type: 'info',
                    hidden: () => {
                        return this.readonly || this.id
                    }
                },
                { key: 'cancel', label: '关闭' }
            ],
            rules: {
                ti_gan_: [{ required: true, message: this.$t('validate.required') }],
                ti_xing_: [{ required: true, message: this.$t('validate.required') }],
                da_an_: [{ required: true, message: this.$t('validate.required') }],
                zheng_que_da_an_: [{ required: true, message: this.$t('validate.required') }],
                xuan_xiang_lei_xi: [{ required: true, message: this.$t('validate.required') }],
                ping_fen_fang_shi: [{ required: true, message: this.$t('validate.required') }],
                ping_fen_ren_: [{ required: true, message: this.$t('validate.required') }],
                chu_ti_ren_: [{ required: true, message: this.$t('validate.required') }],
                fen_zhi_: [{ required: true, message: this.$t('validate.required') }]
            },
            optionList: JSON.parse(JSON.stringify(defaultOptions))
        }
    },
    computed: {
        formData () {
            return this.data
        },
        questionRateType () {
            return this.rateType[this.form.ti_xing_] || ''
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
            // immediate: true
        }
    },
    mounted () {
        this.getQuestionData()
    },
    methods: {
        addOption () {
            this.optionList.push({
                value: String.fromCharCode(this.optionList[0].value.charCodeAt(0) + this.optionList.length),
                radio: null,
                checkbox: [],
                content: ''
            })
        },
        subOption () {
            this.optionList.pop()
        },
        changeRadio (index, value) {
            this.optionList.map(i => (i.radio = null))
            this.optionList[index].radio = value
        },
        changeQuestionType (value) {
            if (value === '填空题') {
                this.optionList = [{
                    value: '',
                    radio: null,
                    checkbox: [],
                    content: ''
                }]
            } else {
                this.optionList = JSON.parse(JSON.stringify(defaultOptions))
            }
            this.form.da_an_ = ''
            this.form.zheng_que_da_an_ = ''
            this.questionTags = []
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
        handleTagDelete (tag) {
            this.questionTags.splice(this.questionTags.indexOf(tag), 1)
        },
        showTagEdit () {
            this.tagInputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        handleTagConfirm () {
            if (this.tagValue) {
                this.questionTags.push(this.tagValue)
            }
            this.tagInputVisible = false
            this.tagValue = ''
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'submit':
                    this.handleSubmit(key)
                    break
                case 'submitAndContinue':
                    this.handleSubmit(key)
                    break
                case 'reset':
                    this.resetForm()
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
            if (this.$utils.isEmpty(this.id)) {
                return
            }
            const sql = `select id_, chu_ti_ren_, bu_men_, chu_ti_shi_jian_, ti_gan_, ti_xing_, xuan_xiang_lei_xi, biao_qian_, da_an_, zheng_que_da_an_, ping_fen_fang_shi, ping_fen_ren_, fen_zhi_, zhuang_tai_, xuan_xiang_shu_, fu_tu_, bei_zhu_ from t_questions where id_ = '${this.id}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    return this.$message.error('获取题目数据失败！')
                }
                const item = data[0]
                if (item.ti_xing_ === '填空题') {
                    const rightKey = item.zheng_que_da_an_ ? JSON.parse(item.zheng_que_da_an_) : []
                    this.optionList = rightKey.map(i => ({
                        value: '',
                        radio: null,
                        checkbox: [],
                        content: i
                    }))
                } else if (item.ti_xing_ === '单选题') {
                    const rightKey = item.zheng_que_da_an_ || ''
                    const options = item.da_an_ ? JSON.parse(item.da_an_) : {}
                    this.optionList = []
                    Object.keys(options).forEach(key => {
                        this.optionList.push({
                            value: key,
                            radio: key === rightKey ? key : null,
                            checkbox: [],
                            content: options[key]
                        })
                    })
                } else if (item.ti_xing_ === '多选题') {
                    const rightKey = item.zheng_que_da_an_ ? item.zheng_que_da_an_.split(',') : []
                    const options = item.da_an_ ? JSON.parse(item.da_an_) : {}
                    this.optionList = []
                    Object.keys(options).forEach(key => {
                        this.optionList.push({
                            value: key,
                            radio: null,
                            checkbox: rightKey,
                            content: options[key]
                        })
                    })
                }
                item.fen_zhi_ = parseInt(item.fen_zhi_)
                item.fu_tu_ = item.fu_tu_ ? JSON.parse(item.fu_tu_) : ''
                this.questionTags = item.biao_qian_ ? item.biao_qian_.split(',') : []
                this.form = item
            })
        },
        handleSubmit (action) {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return ActionUtils.saveErrorMessage()
                }
                // 验证选项、答案内容（未被表单校验）
                const { ti_xing_: questionType } = this.form
                if (['单选题', '多选题', '填空题'].includes(questionType)) {
                    const emptyIndex = this.optionList.findIndex(item => !item.content)
                    if (emptyIndex !== -1) {
                        const tip1 = `答案${(emptyIndex + 1)}内容为空，请填写后再保存！`
                        const tip2 = `选项${(String.fromCharCode('A'.charCodeAt(0) + emptyIndex))}内容为空，请填写后再保存！`
                        return ActionUtils.saveErrorMessage(questionType === '填空题' ? tip1 : tip2)
                    }
                    const hasRadioKey = this.optionList.some(item => item.radio)
                    const hasMultipleKey = this.optionList.some(item => item.checkbox && item.checkbox.length)
                    const hasKey = {
                        '单选题': hasRadioKey,
                        '多选题': hasMultipleKey
                    }
                    if (['单选题', '多选题'].includes(questionType) && !hasKey[questionType]) {
                        return ActionUtils.saveErrorMessage('请至少选择一个正确答案！')
                    }
                }
                // 表单验证通过，提交表单
                this.submitForm(action)
            })
        },
        getSubmitData () {
            let a1 = ''
            const a2 = []
            const a3 = []
            const options = {}
            this.optionList.forEach(item => {
                options[item.value] = item.content
                if (item.radio) {
                    a1 = item.radio
                }
                if (item.checkbox && item.checkbox.length) {
                    a2.push(item.checkbox[0])
                }
                a3.push(item.content)
            })
            const { first, second } = this.$store.getters.level || {}
            this.form.di_dian_ = second || first
            this.form.biao_qian_ = this.questionTags.join(',')
            this.form.ping_fen_fang_shi = this.questionRateType
            switch (this.form.ti_xing_) {
                case '单选题':
                    this.form.ping_fen_ren_ = ''
                    this.form.da_an_ = JSON.stringify(options)
                    this.form.zheng_que_da_an_ = a1
                    break
                case '多选题':
                    this.form.ping_fen_ren_ = ''
                    this.form.da_an_ = JSON.stringify(options)
                    this.form.zheng_que_da_an_ = a2.join(',')
                    break
                case '填空题':
                    this.form.xuan_xiang_lei_xi = ''
                    this.form.da_an_ = ''
                    this.form.xuan_xiang_shu_ = a3.length
                    this.form.zheng_que_da_an_ = JSON.stringify(a3)
                    break
                case '判断题':
                    this.form.ping_fen_ren_ = ''
                    this.form.xuan_xiang_lei_xi = ''
                    this.form.da_an_ = ''
                    break
                case '简答题':
                    this.form.xuan_xiang_lei_xi = ''
                    this.form.da_an_ = ''
                    break
                default:
                    break
            }
        },
        submitForm (action) {
            this.getSubmitData()
            const addParams = {
                tableName: 't_questions',
                paramWhere: [this.form]
            }
            const updateParams = {
                tableName: 't_questions',
                updList: [
                    {
                        where: {
                            id_: this.id
                        },
                        param: this.form
                    }
                ]
            }
            const type = this.id && !this.isCopy ? 'update' : 'add'
            const params = type === 'add' ? addParams : updateParams
            // console.log(params)
            this.$common.request(type, params).then(() => {
                this.$message.success(this.id ? '保存题目成功' : '添加题目成功')
                this.updatePaper()
                if (action === 'submit') {
                    this.closeDialog()
                } else {
                    this.resetForm()
                }
            })
        },
        resetForm () {
            this.id = ''
            const quesType = this.form.ti_xing_
            this.$refs.form.resetFields()
            this.changeQuestionType(quesType)
        },
        updatePaper () {
            const sql = `select fen_zhi_ from t_questions where parent_id_ = '${this.bankId}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                const params = {
                    tableName: 't_question_bank',
                    updList: [
                        {
                            where: {
                                id_: this.bankId
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
    .question-dialog {
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
            .el-radio-button__orig-radio {
                &:disabled + .el-radio-button__inner {
                    color: #606266;
                }
                &:disabled:checked + .el-radio-button__inner {
                    color: #fff;
                    background-color: #409EFF;
                }
            }
        }
        .readonly-form {
            ::v-deep {
                .el-radio, .el-checkbox, .el-radio-button, .el-input, .el-select, .el-textarea, .el-input-number, .el-button, .el-upload {
                    pointer-events: none;
                }
            }
        }
        .qustion-tag {
            margin-right: 10px;
            height: 32px;
            line-height: 30px;
            ::v-deep {
                .el-icon-close {
                    top: 0px;
                }
            }
        }
        .button-new-tag {
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 100px;
            vertical-align: bottom;
        }
        .question-form {
            padding: 20px;
        }
        .ibps-image {
            font-size: 0;
            ::v-deep {
                .el-upload--picture-card {
                    font-size: 24px;
                }
            }
        }
        .inline-item {
            display: flex;
            .el-form-item {
                flex: 1;
                .el-select {
                    width: 100%;
                }
            }
        }
        .mb-20 {
            margin-bottom: 20px;
        }
        .option-item {
            ::v-deep {
                .el-form-item__content {
                    display: flex;
                    .el-input {
                        flex: 1;
                    }
                    .el-radio-group, .el-checkbox-group {
                        width: 100px;
                        margin-left: 10px;
                        line-height: 28px;
                        .el-radio {
                            line-height: 28px;
                        }
                    }
                    .operate-btn {
                        width: 32px;
                        min-width: 32px;
                        margin-left: 10px;
                        line-height: 30px;
                    }
                }
            }
            .custom-label {
                &::before {
                    content: '*';
                    color: #F56C6C;
                    margin-right: 4px;
                }
            }
        }
    }
</style>
