<template>
    <div class="main-container">
        <ibps-crud
            v-if="showTable"
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
            <template slot="isRand" slot-scope="scope">
                <div>{{ scope.row.isRand==='1' ? '是' : '否' }}</div>
            </template>
            <template slot="randWay" slot-scope="{row}">
                <div>{{ row.isRand==='1' ?['未知','题型','难度'][+row.randWay]:'/' }}</div>
            </template>
        </ibps-crud>
        <exam-edit
            v-if="showEditDialog"
            :id="examInfo.examId"
            :visible.sync="showEditDialog"
            :is-disabled="examInfo.state !== '未发布'"
            @callback="search"
            @close="dialogClose"
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
import { examTypeOptions, statusOption, basicColumn, infoColumn, resultColumn } from '../constants'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { max, min, mean, sum, maxBy, minBy, meanBy, round, keyBy, mapValues } from 'lodash'

const sortField = {
    CREATE_TIME_: 'ex.chuang_jian_shi_j',
    PUBLISH_DATE_: 'ex.fa_bu_shi_jian_'
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
        const { first, second } = this.$store.getters.level || {}
        const hasRole = isSuper || role.some(r => roleList.includes(r.alias))
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const endColumn = [
            { prop: 'createTime', label: '创建时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 120 },
            { prop: 'publishDate', label: '发布时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 120 },
            { prop: 'createBy', label: '创建人', tags: userOption, width: 90 }
        ]
        const showType = 'info'
        return {
            userId,
            userList,
            userOption,
            hasRole,
            showType,
            endColumn,
            level: second || first,
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
            params: {},
            selection: '',
            examInfo: {
                examId: '',
                bankId: '',
                state: ''
            },
            examBankId: '',
            showTable: true,
            listConfig: {
                toolbars: [
                    { key: 'search' },
                    { key: 'create', label: '新建考试', type: 'success', icon: 'ibps-icon-plus' },
                    { key: 'remove' },
                    { key: 'judge', label: '试题评阅', type: 'info', icon: 'ibps-icon-adjust' },
                    { key: 'change', label: `${this.showType === 'info' ? '考试结果' : '考试信息'}`, type: 'warning', icon: 'el-icon-s-operation' }
                ],
                searchForm: {
                    forms: [
                        { prop: 'examName', label: '考试名称', itemWidth: 150 },
                        { prop: 'examType', label: '考试类型', itemWidth: 150, fieldType: 'select', multiple: 'Y', options: examTypeOptions },
                        { prop: 'examBank', label: '考试题库', fieldType: 'slot', slotName: 'examBankId', itemWidth: 150 },
                        { prop: 'examState', label: '考试状态', itemWidth: 150, fieldType: 'select', multiple: 'Y', options: statusOption },
                        { prop: ['createTime0', 'createTime1'], label: '创建时间', fieldType: 'daterange' },
                        { prop: ['publishDate0', 'publishDate1'], label: '发布时间', fieldType: 'daterange' }
                    ]
                },
                // 表格字段配置
                columns: [
                    ...basicColumn,
                    ...infoColumn,
                    ...endColumn
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
                                return row.examState !== '未发布' || row.examinee.includes(this.userId) || row.allowRegist !== '是'
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
                            icon: 'ibps-icon-list-alt',
                            hidden: (row, index) => {
                                return ['已取消', '未发布'].includes(row.examState)
                            }
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
        // 组件关闭事件
        dialogClose (visible, refresh) {
            this.showEditDialog = visible
            if (refresh) {
                this.loadData()
            }
        },
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
            const sql = `select qb.ti_ku_ming_cheng_ as bankName, ex.id_ as examId, ex.ti_ku_id_ as bankId, e.id_ as paperId, ex.zhuang_tai_ as examState, e.zhuang_tai_ as paperState, qb.ti_shu_ as questionCount, qb.zong_fen_ as totalScore, ex.kao_shi_ming_chen as examName, ex.kao_shi_lei_xing_ as examType, ex.can_kao_ren_yuan_ as examinee, e.kao_shi_ren_ as examineeId, ex.create_by_ as createBy, ex.chuang_jian_shi_j as createTime, ex.fa_bu_shi_jian_ as publishDate, ex.fa_bu_ren_ as publisher, ex.xian_kao_shi_jian as limitDate, ex.kao_shi_shi_chang as duration, ex.xian_kao_ci_shu_ as limitCount, ex.da_biao_zhan_bi_ as qualifiedRadio, ex.ji_fen_fang_shi_ as scoringType, ex.yun_xu_bao_ming_ as allowRegist, ex.kao_shi_miao_shu_ as examDesc, ex.shu_ju_yong_tu_ as dataType, ex.sui_ji_chou_ti_ as isRand,ex.chou_ti_fang_shi_ as randWay, ex.sui_ji_ti_shu_ as randNumber, ex.chou_ti_zong_fen_ as randScore, ex.ti_mu_zong_shu_ as randTotal, e.de_fen_ as score, e.bao_ming_shi_jian as applyTime, e.kai_shi_shi_jian_ as startTime, e.jie_shu_shi_jian_ as endTime from t_exams ex left join t_question_bank qb on ex.ti_ku_id_ = qb.id_ left join t_examination e on e.exam_id_ = ex.id_ where ex.di_dian_ = '${this.level}'${params} order by ${sortParams}`
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
                                bankName: item.bankName,
                                examinee: item.examinee,
                                questionCount: item.isRand === '1' ? parseFloat(item.randTotal) : parseFloat(item.questionCount),
                                duration: item.duration,
                                limitCount: item.limitCount,
                                limitDate: item.limitDate,
                                qualifiedRadio: item.qualifiedRadio,
                                scoringType: item.scoringType,
                                allowRegist: item.allowRegist,
                                isRand: item.isRand,
                                randWay: item.randWay,
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
                        item.examineeCount = item.examinee ? item.examinee.split(',').length : 0
                        item.examFinishCount = item.paperList.filter(i => i.examStatus === '已完成').length
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

            const addCondition = (condition, value, isArray = false) => {
                if (this.$utils.isNotEmpty(value)) {
                    if (isArray) {
                        const conditions = value.map(v => `${condition} = '${v}'`).join(' or ')
                        params += ` and (${conditions})`
                    } else {
                        params += ` and ${condition} like '%${value}%'`
                    }
                }
            }
            addCondition('ex.kao_shi_ming_chen', temp.examName)
            addCondition('ex.kao_shi_lei_xing_', temp.examType, true)
            addCondition('ex.zhuang_tai_', temp.examState, true)

            if (this.examBankId) {
                const conditions = this.examBankId.split(',').map(id => `ex.ti_ku_id_ = '${id}'`).join(' or ')
                params += ` and (${conditions})`
            }

            const addDateCondition = (key, field) => {
                const dateParam = parameters.find(i => i.key.includes(key))
                if (dateParam) {
                    params += ` and (${field} >= '${temp[key + '0']}' and ${field} <= '${temp[key + '1']}' or ${field} is null)`
                }
            }
            addDateCondition('createTime', 'ex.chuang_jian_shi_j')
            addDateCondition('publishDate', 'ex.fa_bu_shi_jian_')
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
        handleRowDblclick (row) {
            if (['已取消', '未发布'].includes(row.examState)) {
                return this.$message.info('暂无详情数据！')
            }
            this.examInfo = {
                examId: row.examId,
                bankId: row.bankId
            }
            this.showDetailDialog = true
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            const ids = data && data.length ? data.map(i => i.examId) : []
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
                    this.showJudgeDialog = true
                    break
                case 'change':
                    this.handleColumnChange()
                    break
                case 'publish':
                    this.handlePublish(data)
                    break
                case 'close':
                    this.handleClose(data)
                    break
                case 'attend':
                    this.handleAttend(data)
                    break
                case 'cancel':
                    this.handleCancel(data)
                    break
                case 'modify':
                    if (!this.hasRole && this.userId !== data.createBy) {
                        return this.$message.warning('您无权编辑这场考试，请联系考试创建人或系统管理员！')
                    }
                    this.examInfo = {
                        examId: data.examId,
                        state: data.examState
                    }
                    this.showEditDialog = true
                    break
                case 'info':
                    this.examInfo = {
                        examId: data.examId,
                        bankId: data.bankId
                    }
                    this.showDetailDialog = true
                    break
                default:
                    break
            }
        },
        /**
         * 切换显示信息
         */
        handleColumnChange () {
            let temp = []
            if (this.showType === 'info') {
                temp = resultColumn
                this.showType = 'result'
            } else {
                temp = infoColumn
                this.showType = 'info'
            }
            this.listConfig.columns = [
                ...basicColumn,
                ...temp,
                ...this.endColumn
            ]
            this.updateToolbarLabel()
            this.showTable = false
            setTimeout(() => {
                this.showTable = true
            }, 10)
        },
        /**
         * 更新按钮名称
         */
        updateToolbarLabel () {
            this.listConfig.toolbars = this.listConfig.toolbars.map(toolbar => {
                if (toolbar.key === 'change') {
                    toolbar.label = this.showType === 'info' ? '考试结果' : '考试信息'
                }
                return toolbar
            })
        },
        /**
         * 发布考试
         */
        async handlePublish (data) {
            const { examId, bankId, bankName, questionCount, totalScore, examName, limitCount, limitDate, duration, examinee, qualifiedRadio, scoringType, allowRegist, createBy } = data || {}
            if (!this.hasRole && this.userId !== createBy) {
                return this.$message.warning('您无权发布这场考试，请联系考试创建人或系统管理员！')
            }
            const examNameDesc = `<div><span style="font-weight: 600;">考试名称：</span><span style="color: #f56c6c;">${examName}</span></div>`
            const bankNameDesc = `<div><span style="font-weight: 600;">考试题库：</span><span style="color: #f56c6c;">${bankName}</span></div>`
            const quesitonCountDesc = `<div><span style="font-weight: 600;">题目数量：</span><span style="color: #f56c6c;">${questionCount || 0}</span></div>`
            const scoreDesc = `<div><span style="font-weight: 600;">考试总分：</span><span style="color: #f56c6c;">${totalScore || 0}</span></div>`
            const examineeDesc = `<div><span style="font-weight: 600;">考试人数：</span><span style="color: #f56c6c;">${examinee ? examinee.split(',').length : 0}</span></div>`
            const limitDateDesc = `<div><span style="font-weight: 600;">限考时间：</span><span style="color: #f56c6c;">${limitDate}</span></div>`
            const limitCountDesc = `<div><span style="font-weight: 600;">限考次数：</span><span style="color: #f56c6c;">${limitCount}</span></div>`
            const temp = duration === '不限' || !duration ? '不限' : this.transformTime(duration)
            const durationDesc = `<div><span style="font-weight: 600;">考试时长：</span><span style="color: #f56c6c;">${temp}</span></div>`
            const qualifiedRadioDesc = `<div><span style="font-weight: 600;">达标分数占比：</span><span style="color: #f56c6c;">${qualifiedRadio}%</span></div>`
            const scoringTypeDesc = `<div><span style="font-weight: 600;">计分方式：</span><span style="color: #f56c6c;">${scoringType}</span></div>`
            const allowRegistDesc = `<div><span style="font-weight: 600;">是否允许报名：</span><span style="color: #f56c6c;">${allowRegist}</span></div>`
            const tip = `<div style="font-size: 16px;">发布后将为所有参考人员发放试卷并通知考试，考试发布后不可取消，是否确认</div>`
            this.$confirm(`<p style="font-size: 16px;font-weight: 600;">当前考试信息如下：</p>${examNameDesc}${bankNameDesc}${quesitonCountDesc}${scoreDesc}${examineeDesc}${limitDateDesc}${limitCountDesc}${durationDesc}${qualifiedRadioDesc}${scoringTypeDesc}${allowRegistDesc}${tip}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                showClose: false,
                closeOnClickModal: false,
                dangerouslyUseHTMLString: true
            }).then(() => {
                const params = {
                    tableName: 't_exams',
                    updList: [{
                        where: {
                            id_: examId
                        },
                        param: {
                            fa_bu_ren_: this.userId,
                            fa_bu_shi_jian_: this.$common.getDateNow(19),
                            zhuang_tai_: '已发布'
                        }
                    }]
                }
                // 更新考试状态
                this.$common.request('update', params).then(() => {
                    this.$message.success('发布考试成功！')
                    this.search()
                    // 发放试卷
                    this.createPaper(data, examinee)
                })
            }).catch(() => {})
        },
        /**
         * 创建试卷
         */
        createPaper (data, examinees) {
            const { examId, bankId, examName, questionCount, totalScore, duration, qualifiedRadio, limitDate, limitCount } = data || {}
            const examineeList = examinees.split(',')
            const currentTime = this.$common.getDateNow(19)
            const paramWhere = examineeList.map(i => ({
                exam_id_: examId,
                ti_ku_id_: bankId,
                di_dian_: this.level,
                kao_shi_ren_: i,
                bu_men_: '',
                bao_ming_shi_jian: currentTime,
                ti_ku_zong_fen_: totalScore,
                zhuang_tai_: '未开始',
                sheng_yu_shi_chan: duration,
                da_biao_zhan_bi_: qualifiedRadio
            }))
            const addParams = {
                tableName: 't_examination',
                paramWhere
            }
            this.$common.request('add', addParams).then(() => {
                // 发送通知
                const limitTime = duration === '不限' || !duration ? '不限' : this.transformTime(duration)
                const msgContent = `您参加的考试【${examName}】已发布，该考试限考时间【${limitDate}】，限考次数【${limitCount}】，考试时长【${limitTime}】，题数【${questionCount}】，总分【${totalScore}】，请及时完成考试！`
                examineeList.map(i => this.$common.sendMsg({
                    subject: '考试信息提醒',
                    content: msgContent,
                    receiverId: i,
                    canreplay: '0'
                }))
                // 添加日程
                const now = this.$common.getDateNow(10)
                const paramsList = examineeList.map(i => ({
                    title_: `考试【${examName}】`,
                    content_: `考试名称：【${examName}】\n开始时间：【${now}】\n结束时间：【${limitDate}】\n限考次数：【${limitCount}】\n考试时长：【${limitTime}】\n题数：【${questionCount}】\n总分：【${totalScore}】`,
                    start_time_: now,
                    end_time_: limitDate !== '不限' ? limitDate.slice(0, 10) : now,
                    emergency_state_: '2',
                    user_id_: i,
                    user_name_: this.transformUser(i)
                }))
                this.$common.request('add', {
                    tableName: 'ibps_party_user_calendar',
                    paramWhere: paramsList
                }).then(() => {
                    console.log('添加日程数据成功')
                })
            })
        },
        /**
         * 取消考试
         */
        handleClose ({ examId, createBy }) {
            if (!this.hasRole && this.userId !== createBy) {
                return this.$message.warning('您无权取消这场考试，请联系考试创建人或系统管理员！')
            }
            const params = {
                tableName: 't_exams',
                updList: [{
                    where: {
                        id_: examId
                    },
                    param: {
                        zhuang_tai_: '已取消'
                    }
                }]
            }
            this.$common.request('update', params).then(() => {
                this.$message.success('取消考试成功！')
                this.search()
            })
        },
        /**
         * 报名考试
         */
        handleAttend (data) {
            const { examId, examState, examinee } = data
            const examineeList = examinee ? examinee.split(',') : []
            examineeList.push(this.userId)
            const params = {
                tableName: 't_exams',
                updList: [{
                    where: {
                        id_: examId
                    },
                    param: {
                        can_kao_ren_yuan_: examineeList.join(',')
                    }
                }]
            }
            // 更新参考人员
            this.$common.request('update', params).then(() => {
                if (examState === '未发布') {
                    this.$message.success('报名考试成功！该考试还未发布，请等待考试发布后再开始考试~')
                } else {
                    this.createPaper(data, this.userId)
                    this.$message.success('报名考试成功！请前往【我的考试】开始考试')
                }
                this.search()
            })
        },
        /**
         * 取消报名
         */
        handleCancel (data) {
            const { examId, examinee } = data
            const examineeList = examinee.split(',').filter(item => item !== this.userId).join(',')
            const params = {
                tableName: 't_exams',
                updList: [{
                    where: {
                        id_: examId
                    },
                    param: {
                        can_kao_ren_yuan_: examineeList
                    }
                }]
            }
            this.$common.request('update', params).then(() => {
                this.$message.success('取消报名成功！')
                this.search()
            })
        },
        /**
         * 删除考试
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
