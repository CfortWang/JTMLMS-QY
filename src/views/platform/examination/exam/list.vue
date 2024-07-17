<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            :display-field="title"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :index-row="false"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick"
        >
            <!-- 查询参数插槽 -->
            <template slot="examBankId">
                <ibps-custom-dialog
                    v-model="examBankId"
                    size="mini"
                    template-key="tkdhk"
                    :multiple="true"
                    :temp-search="true"
                    type="dialog"
                    class="custom-dialog"
                    placeholder="请选择"
                    icon="ibps-icon-search"
                    style="width: 150px;"
                />
            </template>
            <template slot="examBank" slot-scope="scope">
                <ibps-custom-dialog
                    v-model="scope.row.bankId"
                    size="mini"
                    template-key="tkdhk"
                    :multiple="true"
                    :readonly="true"
                    readonly-text="text"
                    disabled
                />
            </template>
            <template slot="time" slot-scope="scope">
                <div>起：{{ scope.row.kaiShiShiJian }}</div>
                <div>止：{{ scope.row.jieShuShiJian }}</div>
            </template>
        </ibps-crud>
        <exam-edit
            v-if="showEditDialog"
            :id="examInfo.examId"
            :visible.sync="showEditDialog"
            :is-disabled="examInfo.state !== '未发布'"
            @callback="search"
            @close="visible => showEditDialog = visible"
        />
        <exam-detail
            v-if="showDetailDialog"
            :visible.sync="showDetailDialog"
            :bank-id="examInfo.bankId"
            :exam-id="examInfo.examId"
            @close="visible => showDetailDialog = visible"
        />
        <exam-judge
            v-if="showJudgeDialog"
            :id="selection"
            :visible.sync="showJudgeDialog"
            @close="visible => showJudgeDialog = visible"
        />
    </div>
</template>

<script>
import { removeFormData } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { max, min, mean, sum, maxBy, minBy, meanBy, round, keyBy, mapValues } from 'lodash'
const qualifiedType = [
    {
        value: '达标',
        type: 'success'
    },
    {
        value: '未达标',
        type: 'danger'
    },
    {
        value: '考试未结束',
        type: 'warning'
    }
]

const sortField = {
    CREATE_TIME_: 'ex.chuang_jian_shi_j',
    PUBLISH_DATE_: 'ex.fa_bu_shi_jian_'
}

const paramsMap = {
    examName: 'ex.kao_shi_ming_chen',
    examType: 'ex.kao_shi_lei_xing_',
    bankId: 'ex.ti_ku_id_'
}

export default {
    components: {
        ExamEdit: () => import('./edit'),
        ExamDetail: () => import('./detail'),
        ExamJudge: () => import('../question/judge'),
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    mixins: [FixHeight],
    data () {
        const roleList = ['xtgljs', 'pxglxzfzr']
        const { isSuper, role, userId, userList = [] } = this.$store.getters || {}
        const hasRole = isSuper || role.some(r => roleList.includes(r.alias))
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userId,
            userList,
            userOption,
            hasRole,
            title: '考试管理',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            showEditDialog: false,
            showDetailDialog: false,
            showJudgeDialog: false,
            readonly: false,
            params: {},
            targetOption: [],
            methodOption: [],
            selection: '',
            examInfo: {
                examId: '',
                bankId: '',
                state: ''
            },
            examBankId: '',
            listConfig: {
                toolbars: [
                    { key: 'search' },
                    { key: 'create', label: '新建考试', type: 'success', icon: 'ibps-icon-plus' },
                    { key: 'remove' },
                    { key: 'judge', label: '试题评阅', type: 'info', icon: 'ibps-icon-adjust' },
                    { key: 'change', label: '考试结果', type: 'warning', icon: 'el-icon-s-operation' }
                ],
                searchForm: {
                    forms: [
                        { prop: 'examName', label: '考试名称', itemWidth: 150 },
                        { prop: 'examType', label: '考试类型', itemWidth: 150 },
                        { prop: 'examBank', label: '考试题库', fieldType: 'slot', slotName: 'examBankId', itemWidth: 150 },
                        { prop: ['createTime0', 'createTime1'], label: '创建时间', fieldType: 'daterange' },
                        { prop: ['publishDate0', 'publishDate1'], label: '发布时间', fieldType: 'daterange' }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'examName', label: '考试名称', minWidth: 200 },
                    { prop: 'examType', label: '考试类型', width: 90 },
                    { prop: 'bankName', label: '考试题库', slotName: 'examBank', width: 160 },
                    { prop: 'duration', label: '考试时长', width: 100 },
                    { prop: 'limitCount', label: '限考次数', width: 85 },
                    { prop: 'qualifiedRadio', label: '达标占比', width: 65 },
                    { prop: 'scoringType', label: '计分方式', width: 85 },
                    { prop: 'isRand', label: '是否随机', width: 65 },
                    { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 120 },
                    { prop: 'publishDate', label: '发布时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 120 },
                    { prop: 'limitDate', label: '限考时间', width: 120 },
                    { prop: 'createBy', label: '创建人', tags: userOption, width: 90 },
                    { prop: 'examState', label: '状态', width: 80 }
                ],
                rowHandle: {
                    // effect: 'display',
                    actions: [
                        {
                            key: 'publish',
                            label: '发布考试',
                            type: 'primary',
                            icon: 'ibps-icon-send',
                            hidden: (row, index) => {
                                return row.examState !== '未发布'
                            }
                        },
                        {
                            key: 'close',
                            label: '取消考试',
                            type: 'primary',
                            icon: 'ibps-icon-trash',
                            hidden: (row, index) => {
                                return row.examState !== '未发布'
                            }
                        },
                        {
                            key: 'attend',
                            label: '报名考试',
                            type: 'primary',
                            icon: 'ibps-icon-bookmark',
                            hidden: (row, index) => {
                                // 未发布且未报名
                                return row.examState !== '未发布' || row.examinee.includes(this.userId)
                            }
                        },
                        {
                            key: 'cancel',
                            label: '取消报名',
                            type: 'primary',
                            icon: 'ibps-icon-minus-square',
                            hidden: (row, index) => {
                                return row.examState !== '未发布' || !row.examinee.includes(this.userId)
                            }
                        },
                        {
                            key: 'modify',
                            label: '编辑考试',
                            type: 'primary',
                            icon: 'ibps-icon-edit',
                            hidden: (row, index) => {
                                return row.examState !== '未发布'
                            }
                        },
                        {
                            key: 'info',
                            label: '考试明细',
                            type: 'primary',
                            icon: 'ibps-icon-list-alt'
                        }
                    ]
                }
            }
        }
    },
    created () {
    },
    mounted () {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData () {
            this.loading = true
            this.getData(this.getSearchFormData()).then(res => {
                this.loading = false
                ActionUtils.handleListData(this, res.data)
            })
        },
        getData ({ parameters, requestPage, sorts }) {
            const { pageNo = 1, limit = 20 } = requestPage || {}
            let sortParams = ''
            if (sorts && sorts.length) {
                sortParams = sorts.map(i => `${sortField[i.field]} ${i.order}`).join(',')
            } else {
                sortParams = 'ex.chuang_jian_shi_j desc, ex.fa_bu_shi_jian_ desc'
            }
            const params = this.getParams(parameters)
            const sql = `select qb.ti_ku_ming_cheng_ as bankName, ex.id_ as examId, ex.ti_ku_id_ as bankId, e.id_ as paperId, ex.zhuang_tai_ as examState, e.zhuang_tai_ as paperState, qb.ti_shu_ as questionCount, qb.zong_fen_ as totalScore, ex.kao_shi_ming_chen as examName, ex.kao_shi_lei_xing_ as examType, ex.can_kao_ren_yuan_ as examinee, e.kao_shi_ren_ as examineeId, ex.create_by_ as createBy, ex.chuang_jian_shi_j as createTime, ex.fa_bu_shi_jian_ as publishDate, ex.fa_bu_ren_ as publisher, ex.xian_kao_shi_jian as limitDate, ex.kao_shi_shi_chang as duration, ex.xian_kao_ci_shu_ as limitCount, ex.da_biao_zhan_bi_ as qualifiedRadio, ex.ji_fen_fang_shi_ as scoringType, ex.yun_xu_bao_ming_ as allowRegist, ex.kao_shi_miao_shu_ as examDesc, ex.shu_ju_yong_tu_ as dataType, ex.sui_ji_chou_ti_ as isRand, ex.sui_ji_ti_shu_ as randNumber, ex.chou_ti_zong_fen_ as randScore, ex.ti_mu_zong_shu_ as randTotal, e.de_fen_ as score, e.bao_ming_shi_jian as applyTime, e.kai_shi_shi_jian_ as startTime, e.jie_shu_shi_jian_ as endTime from t_exams ex left join t_question_bank qb on ex.ti_ku_id_ = qb.id_ left join t_examination e on e.exam_id_ = ex.id_ where ex.id_ is not null${params} order by ${sortParams}`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        resolve({
                            dataResult: [],
                            pageResult: {
                                limit: 20,
                                page: 1,
                                totalCount: 0,
                                totalPages: 0
                            }
                        })
                        return
                    }
                    const archiveData = []
                    const scorrType = {
                        '最高分': 'max',
                        '平均分': 'avg',
                        '最近得分': 'latest'
                    }
                    data.forEach(item => {
                        const examIndex = archiveData.findIndex(i => i.examId === item.examId)
                        const temp = {
                            paperId: item.paperId,
                            paperState: item.paperState,
                            examineeId: item.examineeId,
                            score: item.score,
                            applyTime: item.applyTime,
                            startTime: item.startTime,
                            endTime: item.endTime
                        }
                        if (examIndex === -1) {
                            archiveData.push({
                                examId: item.examId,
                                examName: item.examName,
                                examType: item.examType,
                                examState: item.examState,
                                bankId: item.bankId,
                                examBank: item.examBank,
                                examinee: item.examinee,
                                questionCount: item.isRand === '1' ? parseFloat(item.randNumber) : parseFloat(item.questionCount),
                                duration: item.duration,
                                limitCount: item.limitCount,
                                qualifiedRadio: item.qualifiedRadio,
                                scoringType: item.scoringType,
                                allowRegist: item.allowRegist,
                                isRand: item.isRand,
                                examDesc: item.examDesc,
                                createTime: item.createTime,
                                publishDate: item.publishDate,
                                publisher: item.publisher,
                                createBy: item.createBy,
                                dataType: item.dataType,
                                totalScore: item.isRand === '1' ? parseFloat(item.randScore) : parseFloat(item.totalScore),
                                paperList: [temp],
                                scoreList: [parseFloat(item.score || -1)],
                                statusList: [item.paperState]
                            })
                        } else {
                            archiveData[examIndex].scoreList.push(parseFloat(item.score || -1))
                            archiveData[examIndex].statusList.push(item.paperState)
                            archiveData[examIndex].paperList.push(temp)
                        }
                    })
                    const nodatadesc = '/'
                    archiveData.forEach((item, index) => {
                        const finishScore = item.scoreList.filter(i => i !== -1)
                        const examCount = item.scoreList.length
                        item.paperList.forEach(paper => {
                            paper.userName = this.transformUser(item.examineeId)
                            paper.max = finishScore.length ? round(max(finishScore), 2) : nodatadesc
                            paper.min = finishScore.length ? round(min(finishScore), 2) : nodatadesc
                            paper.avg = finishScore.length ? round(mean(finishScore), 2) : nodatadesc
                            paper.sum = finishScore.length ? round(sum(finishScore), 2) : nodatadesc
                            paper.latest = finishScore.length ? round(finishScore[0], 2) : nodatadesc
                            paper.examCount = examCount
                            paper.finishCount = finishScore.length
                            paper.count = `${paper.examCount}/${paper.finishCount}`
                            paper.examStatus = paper.examCount === paper.finishCount ? '已完成' : '未完成'
                            paper.resultScore = paper[scorrType[paper.scoringType]]
                            paper.isQualified = paper.examStatus === '已完成' ? paper.resultScore >= (parseFloat(paper.qualifiedRadio) / 100 * parseFloat(paper.totalScore)) ? '达标' : '未达标' : '考试未结束'
                        })
                        const finishList = item.paperList.filter(i => i.examStatus === '已完成')
                        item.maxScore = finishList.length ? maxBy(finishList, 'max').max : nodatadesc
                        item.minScore = finishList.length ? minBy(finishList, 'min').min : nodatadesc
                        item.avgScore = finishList.length ? meanBy(finishList, 'avg').toFixed(2) : nodatadesc
                        item.passRate = finishList.length ? this.getPassRate(finishList) : nodatadesc
                    })
                    const page = {
                        limit,
                        page: pageNo,
                        totalCount: archiveData.length,
                        totalPages: Math.ceil(archiveData.length / limit)
                    }
                    const result = {
                        data: {
                            dataResult: archiveData.slice((pageNo - 1) * limit, pageNo * limit),
                            pageResult: page
                        }
                    }
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 组装SQL查询参数
        getParams (parameters) {
            const temp = mapValues(keyBy(parameters, 'key'), 'value')
            let params = ''
            if (this.$utils.isNotEmpty(temp.examName)) {
                params += ` and ex.kao_shi_ming_chen like '%${temp.examName}%'`
            }
            if (this.$utils.isNotEmpty(temp.examType)) {
                params += ` and ex.kao_shi_lei_xing_ like '%${temp.examType}%'`
            }
            if (this.examBankId) {
                const t = []
                this.examBankId.split(',').forEach(p => {
                    t.push(`ex.ti_ku_id_ = '${p}'`)
                })
                params += ` and (${t.join(' or ')})`
            }
            const createTimeParam = parameters.find(i => i.key.includes('createTime'))
            const publishDateParam = parameters.find(i => i.key.includes('publishDate'))
            if (createTimeParam) {
                params += ` and (ex.chuang_jian_shi_j >= '${temp.createTime0}' and ex.chuang_jian_shi_j <= '${temp.createTime1}'  or ex.chuang_jian_shi_j is null)`
            }
            if (publishDateParam) {
                params += ` and (ex.fa_bu_shi_jian_ >= '${temp.publishDate0}' and ex.fa_bu_shi_jian_ <= '${temp.publishDate1}' or ex.fa_bu_shi_jian_ is null)`
            }
            console.log(params)
            return params
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            return ActionUtils.formatParams(
                this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
                this.pagination,
                this.sorts
            )
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        /**
         * 查询
         */
        search () {
            this.loadData()
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            const ids = data.map(i => i.examId)
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'create':
                    this.examInfo = {
                        examId: '',
                        state: '未发布'
                    }
                    this.showEditDialog = true
                    break
                case 'remove':
                    this.handleRemove(ids)
                    break
                case 'judge':
                    this.selection = ids.join(',')
                    console.log(this.selection)
                    this.showJudgeDialog = true
                    break
                case 'change':
                    this.handleReport(data)
                    break
                case 'publish':
                    this.handleReport(data)
                    break
                case 'close':
                    this.handleReport(data)
                    break
                case 'attend':
                    this.handleReport(data)
                    break
                case 'cancel':
                    this.handleReport(data)
                    break
                case 'modify':
                    this.handleReport(data)
                    break
                case 'info':
                    this.handleReport(data)
                    break
                default:
                    break
            }
        },
        /**
         * 处理编辑
         */
        async handleEdit ({ id, zhiBiaoId, fangFaId, fangFaKey }, key) {
            this.params = {
                targetId: zhiBiaoId,
                methodId: fangFaId,
                methodKey: fangFaKey,
                recordId: id
            }
            this.readonly = key === 'detail'
            this.showConfig = true
        },
        handleReport (data) {
            console.log('wwww')
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            if (!ids || !ids.length) {
                return this.$message.warning('请选择要删除的考试！')
            }
            this.$confirm('数据一旦删除无法恢复，确定要删除选中的考试吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                this.$common.request('delete', {
                    tableName: 't_exams',
                    paramWhere: { id_: ids.join(',') }
                }).then(() => {
                    ActionUtils.removeSuccessMessage()
                    this.search()
                })
            })
        },
        handleRowDblclick (row) {
            this.handleEdit(row, 'detail')
        },
        transformUser (userId) {
            const user = this.userList.find(u => u.userId === userId) || {}
            return user.userName || '-'
        },
        getPassRate (list) {
            const passScore = parseFloat(list[0].qualifiedRadio) / 100 * parseFloat(list[0].totalScore)
            const passList = list.filter(i => i.resultScore >= passScore)
            return (passList.length / list.length * 100).toFixed(2) + '%'
        }
    }
}
</script>
<style lang="scss">
    .attachment-uploader-dialog {
        .el-dialog__body {
            height: calc(57vh - 100px) !important;
        }
    }
</style>
