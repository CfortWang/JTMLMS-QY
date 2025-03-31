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
            <el-form-item label="问卷名称：" prop="wen_juan_ming_che">
                <el-input
                    v-model="form.wen_juan_ming_che"
                    type="text"
                    :maxlength="128"
                    :disabled="readonly"
                />
            </el-form-item>
            <el-form-item label="问候语：" prop="wen_hou_yu_">
                <el-input
                    v-model="form.wen_hou_yu_"
                    type="textarea"
                    :disabled="readonly"
                />
            </el-form-item>
            <el-form-item label="备注：" prop="bei_zhu_">
                <el-input
                    v-model="form.bei_zhu_"
                    type="textarea"
                    :disabled="readonly"
                />
            </el-form-item>
        </el-form>
        <div class="question-table">
            <div class="table-title">
                <span>问卷试题信息</span>
                <div class="table-btn">
                    <el-button v-if="!readonly" type="success" size="mini" icon="el-icon-plus" @click="addItems">添加</el-button>
                    <el-button v-if="!readonly" type="danger" size="mini" icon="el-icon-delete" @click="removeItems">删除</el-button>
                </div>
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
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    v-if="!readonly"
                    width="50"
                    type="selection"
                />
                <el-table-column label="序号" type="index" :index="showIndex" width="60" />
                <el-table-column
                    prop="pai_xu_"
                    label="排序"
                    width="100"
                >
                    <template slot-scope="{row}">
                        <el-input v-if="!readonly" v-model.number="row.pai_xu_" type="number" size="mini" />
                        <span v-else>{{ row.pai_xu_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="ti_gan_"
                    label="题干"
                    min-width="150"
                >
                    <!-- <template slot-scope="scope">
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
                    </template> -->
                </el-table-column>
                <el-table-column
                    prop="ti_xing_"
                    label="题型"
                    width="70"
                />
                <el-table-column
                    prop="shi_fou_bi_tian_"
                    label="是否必填"
                    width="100"
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
                            @click="handleColumnAction(scope, false)"
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
                            @click="handleColumnAction(scope, true)"
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
            :visible.sync="questionDialogVisible"
            :ques-data="quesData"
            :readonly="quesReadonly"
            @close="questionDialogClose"
        />
    </el-dialog>
</template>

<script>
import ActionUtils from '@/utils/action'
export default {
    components: {
        QuesEdit: () => import('../question/survey'),
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
        const { userList = [], deptList = [], userId, level = {}, position } = this.$store.getters || {}
        return {
            multipleSelection: [],
            pageSize: 10,
            currentPage: 1,
            userList,
            level: level.second || level.first,
            deptList: deptList.filter(i => i.depth === 4),
            title: this.readonly ? '问卷明细' : this.id ? '编辑问卷' : '创建问卷',
            formLabelWidth: '150px',
            dialogVisible: this.visible,
            dialogLoading: false,
            questionData: [],
            quesData: {},
            questionDialogVisible: false,
            quesId: '',
            quesIdList: [],
            quesReadonly: false,
            form: {
                bian_zhi_bu_men_: position && position.split(',').at(-1),
                bian_zhi_ren_: userId,
                bian_zhi_shi_jian: this.$common.getDateNow(19),
                di_dian_: level.second || level.first,
                wen_juan_ming_che: '',
                wen_hou_yu_: '',
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
                wen_juan_ming_che: [{ required: true, message: this.$t('validate.required') }]
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
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        questionDialogClose (visible, scope) {
            this.questionDialogVisible = visible
            if (scope) {
                const data = JSON.parse(JSON.stringify(scope.row))
                if (scope.$index >= 0) {
                    this.$set(this.questionData, scope.$index, data)
                } else {
                    this.questionData.push(data)
                }
            }
        },
        addItems () {
            this.quesData = {}
            this.questionDialogVisible = true
        },
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
        transformUser (user) {
            const idList = user.split(',')
            const { userList = [] } = this.$store.getters
            const nameList = idList.map(id => {
                const user = userList.find(u => u.userId === id) || {}
                return user.userName || '-'
            })
            return nameList.join('，')
        },
        handleColumnAction (scope, readonly) {
            this.quesReadonly = readonly
            this.questionDialogVisible = true
            this.quesData = scope
        },
        handleRemove (row) {
            this.$confirm('确定要删除该题目吗？删除操作将在问卷信息保存后生效', '提示', {
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
        // 获取问卷数据
        async getData () {
            if (this.$utils.isEmpty(this.formId)) {
                return
            }
            const sql = `select * from t_myddcwjb where id_='${this.formId}'`
            const { variables: { data = [] } = {}} = await this.$common.request('sql', sql)
            data.length && (this.form = data[0])

            const sql2 = `select * from t_myddcwjtmb where parent_id_='${this.formId}' order by pai_xu_+0 asc`
            const { variables: { data: data2 = [] } = {}} = await this.$common.request('sql', sql2)
            data2.length && (this.questionData = data2) && (this.quesIdList = data2.map(i => i.id_))
        },
        handleSubmit () {
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    await this.submitForm()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        async submitForm () {
            if (this.formId) {
                await this.goUpdate()
            } else {
                await this.goAdd()
            }
            this.closeDialog(true)
        },
        async goUpdate () {
            const updateParamsRecord = {
                tableName: 't_myddcwjb',
                updList: [{
                    where: {
                        id_: this.formId
                    },
                    param: {
                        wen_juan_ming_che: this.form.wen_juan_ming_che,
                        wen_hou_yu_: this.form.wen_hou_yu_,
                        bei_zhu_: this.form.bei_zhu_
                    }
                }]
            }
            await this.$common.request('update', updateParamsRecord)

            const updateArr = []
            const deleteArr = []
            const addArr = []
            this.questionData.forEach(i => {
                if (i.id_) {
                    updateArr.push(i)
                } else {
                    addArr.push(i)
                }
            })
            this.quesIdList.forEach(i => {
                const t = updateArr.find(item => item.id_ === i)
                if (!t) deleteArr.push(i)
            })

            // 增
            const addParams = {
                tableName: 't_myddcwjtmb',
                paramWhere: addArr.map(i => ({
                    ...i,
                    parent_id_: this.formId
                }))
            }
            addArr.length > 0 && (await this.$common.request('add', addParams))
            // 删
            const params = {
                tableName: 't_myddcwjtmb',
                paramWhere: {
                    id_: deleteArr.join(',')
                }
            }
            deleteArr.length > 0 && (await this.$common.request('delete', params))
            // 改
            const updateParamsRecord2 = {
                tableName: 't_myddcwjtmb',
                updList: updateArr.map(i => ({
                    where: {
                        id_: i.id_
                    },
                    param: {
                        ti_gan_: i.ti_gan_,
                        ti_xing_: i.ti_xing_,
                        bei_zhu_: i.bei_zhu_,
                        xuan_xiang_: i.xuan_xiang_,
                        pai_xu_: i.pai_xu_,
                        shi_fou_bi_tian_: i.shi_fou_bi_tian_
                    }
                }))
            }

            updateArr.length > 0 && (await this.$common.request('update', updateParamsRecord2))
            this.$message.success('编辑问卷成功！')
        },
        async goAdd () {
            // 新增问卷
            const addParams = {
                tableName: 't_myddcwjb',
                paramWhere: [this.form]
            }
            const { variables: { cont }} = await this.$common.request('add', addParams)
            if (cont.length > 0) {
                if (this.questionData.length > 0) {
                    // 给问卷新增题目
                    const addParams2 = {
                        tableName: 't_myddcwjtmb',
                        paramWhere: this.questionData.map(i => ({
                            ...i,
                            parent_id_: cont[0].id_
                        }))
                    }
                    await this.$common.request('add', addParams2)
                }
                this.$message.success('新增问卷成功！')
            }
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
            this.$confirm('确定要删除所选中的题目吗？删除操作将在问卷信息保存后生效', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.questionData = this.questionData.filter(item => !this.multipleSelection.includes(item))
                this.multipleSelection = []
            })
        },
        // 关闭当前窗口
        closeDialog (refresh) {
            this.$emit('update:visible', false, refresh)
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
