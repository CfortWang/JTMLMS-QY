<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" class="tabs" :before-leave="handleChange" @tab-click="changeTab">
            <el-tab-pane v-for="item in tabList" :key="item.key" :name="item.key">
                <span slot="label"><i :class="item.icon" /> {{ item.label }}</span>
                <div v-if="activeTab === item.key" class="tab-container">
                    <div class="table-container">
                        <ibps-crud
                            :ref="item.key"
                            :data="dataList"
                            :toolbars="item.key === 'save' ? listConfig.darftTool : listConfig.toolbars"
                            :search-form="listConfig.searchForm[item.key]"
                            :pk-key="pkKey"
                            :columns="listConfig.columns[item.key]"
                            :pagination="pagination"
                            :loading="loading"
                            :index-row="false"
                            :selection-row="item.key === 'save'"
                            @row-click="handleRowClick"
                            @action-event="handleAction"
                            @sort-change="handleSortChange"
                            @pagination-change="handlePaginationChange"
                        >
                            <template slot="name" slot-scope="scope">{{ getWorkInfo(scope.row.subject, 'name') }}</template>
                            <template slot="desc" slot-scope="scope">{{ getWorkInfo(scope.row.subject, 'desc') }}</template>
                            <!-- 待办字段处理 -->
                            <template slot="waitStatus" slot-scope="scope">{{ '待' + scope.row.name }}</template>
                            <template slot="stateLabel" slot-scope="scope">
                                <span>{{ scope.column.label }}</span>
                                <el-tooltip effect="dark" placement="top">
                                    <div slot="content">
                                        普通事务：接收三天之内为待办理，三天之后为已超时
                                        <br>
                                        计划事务：月底前七天内为即将超时，超过接收当月月底为已超时，其余为待办理
                                    </div>
                                    <i class="el-icon-info" />
                                </el-tooltip>
                            </template>
                            <template slot="state" slot-scope="scope">
                                <el-tag :type="scope.row.state ? stateOption[scope.row.state].type : ''">{{ scope.row.state ? stateOption[scope.row.state].label : '待办理' }}</el-tag>
                            </template>
                            <template slot="submitBy" slot-scope="scope">
                                <span>{{ scope.column.label }}</span>
                                <el-tooltip effect="dark" placement="top">
                                    <div slot="content">
                                        该事务对应流程的发起人
                                    </div>
                                    <i class="el-icon-info" />
                                </el-tooltip>
                            </template>
                            <template slot="forwardBy" slot-scope="scope">
                                <span>上节点</span><br>
                                <span>提交人</span>
                                <el-tooltip effect="dark" placement="top">
                                    <div slot="content">
                                        该事务对应流程上一节点的提交人
                                    </div>
                                    <i class="el-icon-info" />
                                </el-tooltip>
                            </template>
                            <!-- 已办、办结字段处理 -->
                            <template slot="overStatus" slot-scope="scope">{{ getStatus(scope.row.status) }}</template>
                            <template slot="overDept" slot-scope="scope">{{ getAttr(scope.row.subject, 'deptName') }}</template>
                            <template slot="creator" slot-scope="scope">{{ scope.row.createBy | getUserName(userList) }}</template>
                            <template slot="updateBy" slot-scope="scope">{{ getName(scope.row) }}</template>
                            <template slot="time" slot-scope="scope">{{ scope.row.endTime || scope.row.updateTime || scope.row.createTime }}</template>
                        </ibps-crud>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :task-id="activeTab === 'wait' ? taskId : null"
            :wai-jian="activeTab === 'wait' ? waiJian : null"
            :instance-id="['over', 'finish'].includes(activeTab) ? instanceId : null"
            :def-id="activeTab === 'save' ? defId : null"
            :pro-inst-id="activeTab === 'save' ? proInstId : null"
            :title="['wait', 'save'].includes(activeTab) ? FlowName : null"
            @callback="updateList"
            @close="visible => (dialogFormVisible = visible)"
        />
        <news-detail
            :id="newsId"
            :title="newsTitle"
            :visible="newsDialogVisible"
            readonly
            @close="visible => newsDialogVisible = visible"
        />
    </div>
</template>

<script>
import { pending, handledTask } from '@/api/platform/office/bpmReceived'
import { myDraft, removeDraft } from '@/api/platform/office/bpmInitiated'
import { queryPageList as newsList } from '@/api/platform/system/news'
import { save } from '@/api/platform/message/innerMessage'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import ActionUtils from '@/utils/action'
import { typeOptions } from '@/views/platform/system/news/constants'
import NewsDetail from '@/views/platform/system/news/detail'
import { tabList, taskState, stateOption, taskTypeOptions } from './workbench'

const paramsType = {
    wait: 'temp.',
    over: '',
    finish: 'inst.',
    save: '',
    news: '',
    guide: ''
}

const operate = {
    wait: pending,
    over: handledTask,
    finish: handledTask,
    save: myDraft,
    news: newsList,
    guide: ''
}

export default {
    name: 'calendar',
    components: { BpmnFormrender, NewsDetail },
    filters: {
        getUserName (v, list) {
            const user = list.find(i => i.userId === v)
            return user ? user.userName : ''
        }
    },
    props: {
        plan: {
            type: Array,
            default: () => []
        }
    },
    data () {
        const fieldWidth = window.innerWidth > 1600 ? 150 : 120
        const { first = '', second = '' } = this.$store.getters.level || {}
        const level = second || first
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const getGuide = ({ parameters, requestPage, sorts }) => {
            // 获取查询字段
            const params = parameters.reduce((acc, curr) => {
                return `${acc} and ${curr.key} like '%${curr.value}%'`
            }, '')
            // and di_dian_ = '${level}'
            const sql = `select sn_ as sn, suo_shu_xi_tong_ as sysName, gong_neng_mo_kuai as module, biao_dan_ming_che as tableName, biao_dan_bian_hao as tableNo, tian_xie_shi_ji_ as timing, shi_wu_lei_xing_ as taskType, cheng_xu_wen_jian as fileName, bian_zhi_ren_ as creator, shen_he_ren_ as reviewer, shen_pi_ren_ as approver from t_bdbhpzb where sn_ + 0 > 0 ${params} order by sn_ + 0 asc`
            const { pageNo = 1, limit = 15 } = requestPage || {}
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    const page = {
                        limit,
                        page: pageNo,
                        totalCount: data.length,
                        totalPages: Math.ceil(data.length / limit)
                    }
                    const result = {
                        data: {
                            dataResult: data.slice((pageNo - 1) * limit, pageNo * limit),
                            pageResult: page
                        }
                    }
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        }
        operate.guide = getGuide
        return {
            level,
            tabList,
            stateOption,
            userList,
            deptList,
            pkKey: 'id',
            taskId: '', // 编辑dialog需要使用
            waiJian: '', // 编辑dialog需要使用
            instanceId: '',
            defId: '',
            proInstId: '',
            newsId: '',
            loading: false,
            dialogFormVisible: false,
            newsDialogVisible: false,
            newsTitle: '公告明细',
            orgName: '',
            roleName: '',
            FlowName: '',
            posName: '',
            timer: null,
            orgInfo: {},
            activeTab: tabList[0].key,
            height: document.body.clientHeight,
            selection: [],
            defaultPagination: { page: 1, limit: 15 },
            sorts: { },
            dataList: [],
            pagination: {},
            searchParams: {
                typeId: '',
                subject: '',
                createTime: ''
            },
            listConfig: {
                searchForm: {
                    wait: {
                        forms: [
                            { prop: 'Q^subject_^SL', name: 'Q^temp.subject_^SL', label: '事务名称', fieldType: 'input' },
                            { prop: ['Q^temp.create_time_^DL', 'Q^temp.create_time_^DG'], label: '提交时间', fieldType: 'daterange' }
                        ]
                    },
                    over: {
                        forms: [
                            { prop: 'Q^subject_^SL', label: '事务名称', fieldType: 'input' },
                            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '创建时间', fieldType: 'daterange' }
                        ]
                    },
                    finish: {
                        forms: [
                            { prop: 'Q^subject_^SL', name: 'Q^inst.subject_^SL', label: '事务名称', fieldType: 'input' },
                            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], name: ['Q^inst.create_time_^DL', 'Q^inst.create_time_^DG'], label: '结束时间', fieldType: 'daterange' }
                        ]
                    },
                    save: {
                        forms: [
                            { prop: 'Q^subject_^SL', label: '事务名称', fieldType: 'input' },
                            { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '提交时间', fieldType: 'daterange' }
                        ]
                    },
                    news: {
                        forms: [
                            { prop: 'Q^title_^SL', label: '标题', fieldType: 'input' },
                            { prop: 'Q^dep_name_^SL', label: '发布部门', fieldType: 'input' },
                            { prop: 'Q^user_name_^SL', label: '发布人', fieldType: 'input' },
                            { prop: ['Q^public_date_^DL', 'Q^public_date_^DG'], label: '发布时间', fieldType: 'daterange' }
                        ]
                    },
                    guide: {
                        forms: [
                            { prop: 'suo_shu_xi_tong_', label: '所属子系统', labelWidth: 100, fieldType: 'input' },
                            { prop: 'gong_neng_mo_kuai', label: '所属功能模块', labelWidth: 100, fieldType: 'input' },
                            { prop: 'biao_dan_ming_che', label: '记录表单', fieldType: 'input' },
                            { prop: 'shi_wu_lei_xing_', label: '事务类型', fieldType: 'select', options: taskTypeOptions }
                        ]
                    }
                },
                toolbars: [
                    {
                        key: 'search'
                    }
                ],
                darftTool: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'remove'
                    }
                ],
                // 表格字段配置
                columns: {
                    wait: [
                        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
                        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
                        { prop: 'scope', label: '事务状态', slotName: 'waitStatus', width: 120 },
                        { prop: 'scope', label: '办理进度', headerName: 'stateLabel', slotName: 'state', width: 120 },
                        // { prop: 'startDept', label: '发起部门', width: 120 },
                        { prop: 'scope', label: '发起部门', slotName: 'overDept', width: 120 },
                        { prop: 'submitBy', label: '发起人', headerName: 'submitBy', width: 100 },
                        { prop: 'forwardBy', label: `上节点提交人`, headerName: 'forwardBy', width: 100 },
                        { prop: 'createTime', label: '上节点提交时间', width: 150 }
                    ],
                    over: [
                        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
                        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
                        { prop: 'scope', label: '事务状态', slotName: 'overStatus', width: 120 },
                        { prop: 'scope', label: '发起部门', slotName: 'overDept', width: 120 },
                        { prop: 'scope', label: '发起人', headerName: 'submitBy', slotName: 'creator', width: 100 },
                        { prop: 'scope', label: `提交人`, slotName: 'updateBy', width: 100 },
                        { prop: 'scope', label: '办理时间', slotName: 'time', width: 150 }
                    ],
                    finish: [
                        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
                        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
                        { prop: 'scope', label: '事务状态', slotName: 'overStatus', width: 120 },
                        { prop: 'scope', label: '发起部门', slotName: 'overDept', width: 120 },
                        { prop: 'scope', label: '发起人', headerName: 'submitBy', slotName: 'creator', width: 100 },
                        { prop: 'scope', label: `提交人`, slotName: 'updateBy', width: 100 },
                        { prop: 'scope', label: '结束时间', slotName: 'time', width: 150 }
                    ],
                    save: [
                        { prop: 'scope', label: '事务名称', slotName: 'name', width: 250 },
                        { prop: 'scope', label: '事务说明', slotName: 'desc', minWidth: 250 },
                        { prop: 'createTime', label: '暂存时间', width: 150 }
                    ],
                    news: [
                        { prop: 'title', label: '标题', minWidth: 250 },
                        { prop: 'depName', label: '发布部门', sortable: 'custom', width: 120 },
                        { prop: 'userName', label: '发布人', width: 120 },
                        { prop: 'publicDate', label: '发布日期', sortable: 'custom', dateFormat: 'yyyy-MM-dd', width: 120 },
                        { prop: 'loseDate', label: '有效截至日期', sortable: 'custom', dateFormat: 'yyyy-MM-dd', width: 120 },
                        { prop: 'status', label: '发布状态', tags: typeOptions, width: 100 }
                    ],
                    guide: [
                        { prop: 'sn', label: '序号', width: 60 },
                        { prop: 'sysName', label: '所属子系统', width: 100 },
                        { prop: 'module', label: '所属功能模块', width: fieldWidth },
                        { prop: 'tableName', label: '记录表单', width: 200 },
                        // { prop: 'tableNo', label: '表单编号', width: 100 },
                        { prop: 'timing', label: '填写时机/记录频次', minWidth: fieldWidth },
                        { prop: 'taskType', label: '事务类型', tags: taskTypeOptions, width: 100 },
                        { prop: 'fileName', label: '程序文件', width: 160 },
                        { prop: 'creator', label: '编制人', width: fieldWidth },
                        { prop: 'reviewer', label: '审核人', width: fieldWidth },
                        { prop: 'approver', label: '审批人', width: fieldWidth }
                    ]
                }
            }
        }
    },
    mounted () {
        this.getData(this.activeTab)
        if (this.timer) {
            clearInterval(this.timer)
        }
        // 轮询刷新公告数据和任务数据
        this.timer = setInterval(() => {
            // this.getMessage()
            this.getData(this.activeTab)
        }, 30 * 1000)
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    // 路由离开时
    beforeRouteLeave (to, from, next) {
        clearInterval(this.timer)
    },
    methods: {
        getWorkInfo (v, type) {
            if (!v.includes('#')) {
                return ''
            }
            const res = {
                name: v.split('#')[0],
                // 无#返回空，有#返回(左边的字符串,
                desc: v.split('#')[1] ? v.split('#')[1] : ''
            }
            return res[type]
        },
        getName ({ createBy, updateBy }) {
            const id = updateBy || createBy
            const { name = '' } = this.$store.getters || {}
            if (this.activeTab === 'finish') {
                const t = this.userList.find(i => i.userId === id)
                return t ? t.userName : ''
            }
            return name
        },
        getStatus (val) {
            const s = taskState[val]
            return s || '暂停'
        },
        getAttr (val, arg) {
            const arr = val.split('#')
            if (!arr[2]) {
                return ''
            }
            const result = JSON.parse(`{${arr[2]}}`)
            if (!result.dept) {
                return ''
            }
            const depts = result.dept.split(',')
            const deptNames = []
            depts.forEach(item => {
                const t = this.deptList.find(i => i.positionId === item)
                deptNames.push(t ? t.positionName : result.dept)
            })
            result.deptName = deptNames.join(',')
            return result[arg]
        },
        getDept (v, arg = 'positionName') {
            if (!v) {
                return ''
            }
            const t = this.deptList.find(i => i.positionId === v)
            return t ? t[arg] : ''
        },
        tableRowClassName ({ row, rowIndex }) {
            if (rowIndex % 2 === 1) return 'warning-row'
            return 'success-row'
        },
        // 获取表格数据
        getData (type) {
            this.loading = true
            const pageParams = this.pagination && this.pagination.page ? this.pagination : this.defaultPagination
            operate[this.activeTab](this.getFormatParams(null, pageParams)).then(response => {
                const { dataResult, pageResult } = response.data
                // 待办事宜对任务发起人做额外处理
                if (type === 'wait') {
                    const instList = []
                    dataResult.forEach(item => {
                        instList.push(item.bpmnInstId)
                    })
                    const sql = `select b.bpmn_inst_id_, b.create_by_, a.name_ from ibps_bpm_inst b left join ibps_party_employee a on a.id_ = b.create_by_ where b.bpmn_inst_id_ in (${instList.length ? instList.join(',') : `''`}) order by find_in_set(b.bpmn_inst_id_,'${instList.join(',')}')`
                    const currentTime = Date.now()
                    this.$common.request('sql', sql).then(res => {
                        const data = res.variables && res.variables.data
                        data.forEach((item, index) => {
                            dataResult[index].submitBy = item.name_
                            dataResult[index].workName = this.getWorkInfo(dataResult[index].subject, 'name')
                            dataResult[index].workDesc = this.getWorkInfo(dataResult[index].subject, 'desc')
                            dataResult[index].workType = this.plan.includes(dataResult[index].procDefKey) ? 'plan' : 'normal'
                            const limit = this.getAttr(dataResult[index].subject, 'loseDate') || this.getAttr(dataResult[index].subject, 'timeLimit') || 3
                            dataResult[index].state = this.judgeExpire(dataResult[index].createTime, currentTime, dataResult[index].workType, limit)
                        })
                        this.dataList = dataResult.sort((a, b) => b.createTime.localeCompare(a.createTime))
                        this.pagination = pageResult
                    })
                    this.urgeToManager()
                } else {
                    this.dataList = dataResult
                    this.pagination = pageResult || {}
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        // 延迟更新列表数据
        updateList () {
            setTimeout(() => {
                this.getData(this.activeTab)
            }, 750)
        },
        // 查询
        search () {
            this.dataList = []
            this.pagination = {}
            this.getData(this.activeTab)
        },
        handleChange (activeName, oldActiveName) {
            // this.$refs[oldActiveName][0].handleReset()
        },
        // 切换tab
        changeTab () {
            // 数据、筛选条件初始化
            this.dataList = []
            this.selection = []
            this.pagination = { }
            this.getData(this.activeTab)
        },
        handleSortChange (sort) {
            console.log(sort)
            ActionUtils.setSorts(this.sorts, sort)
            this.getData(this.activeTab)
        },
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.getData(this.activeTab)
        },
        getFormatParams (v, page) {
            const params = this.$refs[this.activeTab] && this.$refs[this.activeTab].length ? this.$refs[this.activeTab][0].getSearcFormData() : {}
            if (this.activeTab === 'finish') {
                params.end = '1'
            }
            if (this.activeTab === 'news') {
                // 公告限制显示当前医院且状态为已发布的数据，过滤草稿及失效公告
                params['Q^type_^SL'] = this.level
                params['Q^status_^SL'] = 'publish'
            }
            let pageParams
            if (this.activeTab === 'guide') {
                pageParams = { ...page, limit: 100 }
            } else {
                pageParams = page
            }
            // const s = this.activeTab === 'news' ? this.sorts { 'PUBLIC_DATE_': 'DESC' } : this.sorts
            return ActionUtils.formatParams(params, pageParams, this.sorts)
        },
        // 处理表格点击事件
        handleRowClick (data) {
            if (this.activeTab === 'guide') {
                return
            }
            if (this.activeTab === 'news') {
                this.newsId = data.id
                this.newsDialogVisible = true
                this.newsTitle = data.title
                return
            }
            this.taskId = data.id || ''
            this.waiJian = data.waiJian || ''
            this.instanceId = data.id || ''
            this.defId = data.procDefId || ''
            this.proInstId = data.id || ''
            this.FlowName = data.name
            this.dialogFormVisible = true
        },
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination || {})
                    this.search()
                    break
                case 'remove':// 删除
                    if (!data || !data.length) {
                        this.$message.warning('请选择数据！')
                        return
                    }
                    if (data.length > 20) {
                        this.$message.warning('单次最多只能删除二十条！')
                        return
                    }
                    this.handleRemove(data, selection)
                    break
                default:
                    break
            }
        },
        // 删除暂存数据
        handleRemove (datas, selection) {
            this.$confirm('将删除选中暂存记录与对应数据表数据，删除之后无法恢复， 是否确定？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                const defKeyArr = []
                const delList = {}
                const idList = []
                datas.forEach(item => {
                    const { id, bizKey, procDefKey } = item
                    idList.push(id)
                    if (!delList[procDefKey]) {
                        delList[procDefKey] = []
                        defKeyArr.push(procDefKey)
                    }
                    delList[procDefKey].push(bizKey)
                })
                console.log(idList, delList, defKeyArr)
                const sql = `select bo_code_, def_key_ from ibps_bpm_def where find_in_set(def_key_, '${defKeyArr.join(',')}')`
                // const sql = `select a.bo_code_, b.key_ from ibps_form_bo a, ibps_form_def b where a.form_id_ = b.id_ and find_in_set(b.key_, '${formKeyArr.join(',')}')`
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        return
                    }
                    const codes = {}
                    data.forEach(item => {
                        const { bo_code_, def_key_ } = item
                        codes[def_key_] = bo_code_
                    })
                    // 删除选中记录
                    removeDraft({ ids: idList.join(',') }).then(() => {
                        ActionUtils.removeSuccessMessage()
                        this.selection = []
                        // 循环删除对应数据表数据
                        defKeyArr.forEach(k => {
                            const deleteParams = {
                                tableName: `t_${codes[k]}`,
                                paramWhere: { id_: delList[k].join(',') }
                            }
                            this.$common.request('delete', deleteParams)
                        })
                        this.$message.success('删除成功！')
                        this.search()
                    })
                }).catch(() => {
                    this.$message.error('获取数据表key值出错，请联系开发人员！')
                })
            })
        },
        // 数组去重
        unique (arr) {
            const res = new Map()
            return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1))
        },
        /**
         * 主管提醒
         * 数据处理，将所有待办数据根据是否过期处理为两个数组
         * 过期判断依据：普通事务-创建时间到当前时间超过三天即为过期；计划事务【事务名称中含计划】-创建当月月末前七天
         * 逻辑说明：过期数组中不存于在主管提醒表中的数据插入主管提醒表，并发送内部通知，主管提醒表删除不存在于未过期数组中的数据
         */
        urgeToManager () {
            const { userId } = this.$store.getters
            const params = {
                parameters: [],
                sorts: []
            }
            const sql = `select id_, shi_wu_id_ as taskId from t_gqswb where position('${userId}' in chu_li_ren_id_)`
            // Promise.all([pending(params), this.$common.request('sql', sql)]).then(([res1, res2]) => {
            //     let workData = res1.data && res1.data.dataResult
            //     let noticeData = res2.variables && res2.variables.data
            //     if (!workData || !workData.length) {
            //         return
            //     }
            //     this.dealData(workData, noticeData)
            // })
            pending(params).then(res1 => {
                const workData = res1.data && res1.data.dataResult
                this.$common.request('sql', sql).then(res2 => {
                    const noticeData = res2.variables && res2.variables.data
                    if (!workData || !workData.length) {
                        return
                    }
                    this.dealData(workData, noticeData)
                })
            })
        },
        // 处理数据
        dealData (workList, noticeList) {
            const result = {
                expire: [],
                unexpire: [],
                all: []
            }
            const currentTime = Date.now()
            // 筛选已过期数据
            workList.forEach(item => {
                // 截取流程名
                item.workName = this.getWorkInfo(item.subject, 'name')
                item.workDesc = this.getWorkInfo(item.subject, 'desc')
                item.workType = this.plan.includes(item.procDefKey) ? 'plan' : 'normal'
                item.deptId = this.getAttr(item.subject, 'dept')
                item.state = this.judgeExpire(item.createTime, currentTime, item.workType, limit)
                const limit = this.getAttr(item.subject, 'loseDate') || this.getAttr(item.subject, 'timeLimit')
                if (['overtime', 'soon'].includes(item.state)) {
                    result.expire.push(item)
                } else {
                    result.unexpire.push(item)
                }
                result.all.push(item)
            })
            // console.log('处理后数据：', result)
            // 有过期数据才执行过期数据处理
            if (result.expire.length) {
                this.dealExpile(result.expire, noticeList)
            }
            // 主管提醒表中有数据才执行数据删除
            if (noticeList && noticeList.length) {
                this.dealUnexpile(result.all, noticeList)
            }
        },
        /**
         * 判断是否过期、获取办理状态
         * @param {string} time 比较时间
         * @param {number} current 当前时间戳
         * @param {string} type 事务类型
         * @param {string} limit 限时，值分为两种类型，传值为字符串格式的时间时，判定逻辑为当前时间小于该时间，传值为字符串类型数字时，判定逻辑为创建limit天后，大于当前时间
         * @param {string} isState 调用类型
         */
        judgeExpire (time, current, type, limit) {
            const D = new Date(time)
            const a = new Date(time).getTime()
            const b = new Date(current).getTime()
            const l = limit || 3
            // 创建时间当月最后一天的时间戳
            const c = new Date(D.getFullYear(), D.getMonth() + 1, 0).getTime() + 86400000
            const isDate = l.toString().includes('-')
            // 返回办理状态
            let state = ''
            if (type === 'plan') {
                const M = isDate ? new Date(l).getTime() : c
                state = b >= M ? 'overtime' : b + (86400000 * 7) > M ? 'soon' : 'wait'
            } else {
                if (isDate) {
                    const L = new Date(l).getTime()
                    state = b >= L ? 'overtime' : 'wait'
                } else {
                    state = a + (86400000 * parseInt(l)) < b ? 'overtime' : 'wait'
                }
            }
            return state
        },
        // 处理已过期数据
        dealExpile (data, noticeList) {
            // console.log('已过期流程数据：', data)
            // console.log('过期事务表数据：', noticeList)
            const { userId } = this.$store.getters
            const addList = []
            const sendList = []
            const msgContent = {
                soon: '即将超时，请及时处理！',
                overtime: '已超时，请及时处理！'
            }
            const msgTitle = {
                soon: '计划事务即将到期提醒',
                overtime: '事务超时提醒'
            }
            const nowTime = new Date(new Date().getTime() + 28800000).toJSON().slice(0, 16).replace('T', ' ')
            data.forEach(item => {
                const isExist = !!noticeList.find(i => i.taskId === item.taskId)
                // 筛选出不存在于主管提醒表的过期数据
                if (!isExist) {
                    const obj = {
                        // 事务ID
                        shi_wu_id_: item.taskId,
                        // 完整名称
                        wan_zheng_ming_ch: item.subject,
                        // 事务说明
                        shi_wu_shuo_ming_: item.workDesc,
                        // 事务名称
                        shi_wu_ming_cheng: item.workName,
                        // 事务状态
                        shi_wu_zhuang_tai: `待${item.name}`,
                        // 事务类型
                        shi_wu_lei_xing_: item.workType,
                        chu_li_ren_ming_: item.ownerName,
                        chu_li_ren_id_: this.getInfoByName(item.ownerName, 'id'),
                        chu_li_ren_dian_h: this.getInfoByName(item.ownerName, 'phone'),
                        bu_men_: this.getDept(item.deptId),
                        bu_men_id_: item.deptId,
                        zhu_guan_id_: this.getDept(item.deptId, 'managerId'),
                        zhu_guan_dian_hua: this.getInfoByName(this.getDept(item.deptId, 'manager'), 'phone'),
                        bian_zhi_shi_jian: item.createTime,
                        ti_xing_ci_shu_: 1,
                        duan_xin_ci_shu_: 0,
                        ti_xing_shi_jian_: nowTime,
                        guo_qi_zhuang_tai: item.state
                    }
                    addList.push(obj)
                    const msg = {
                        subject: msgTitle[item.state],
                        content: `${item.workName}【${item.workDesc}】${msgContent[item.state]}`,
                        receiverId: userId,
                        canreply: '0',
                        taskId: item.taskId
                    }
                    sendList.push(msg)
                }
            })
            const addParams = {
                tableName: 't_gqswb',
                paramWhere: addList
            }
            // console.log('新增过期事务表数据：', addList, '发送消息数据', sendList)
            if (addList.length) {
                this.$common.request('add', addParams)
            }
            if (sendList.length) {
                this.sendMsg(sendList)
            }
        },
        // 删除已办的提醒表数据
        dealUnexpile (data, noticeList) {
            // 清除存在于主管提醒表中【处理人含我】，但是不存在于待办中的数据
            const deleteList = []
            noticeList.forEach(item => {
                const isExist = !!data.find(i => i.taskId === item.taskId)
                if (!isExist) {
                    deleteList.push(item.id_)
                }
            })
            // console.log('过期事务表中需删除的数据：', deleteList)
            if (!deleteList.length) {
                return
            }
            const params = {
                tableName: 't_gqswb',
                paramWhere: {
                    id_: deleteList.join(',')
                }
            }
            this.$common.request('delete', params).then(() => {}).catch(err => {
                console.log(err)
            })
        },
        // 发送站内消息
        sendMsg (data) {
            data.forEach(item => {
                save(item).then(() => {}).catch(err => {
                    console.log(err)
                })
            })
        },
        // 通过名字获取id/电话
        getInfoByName (names, type) {
            const res = {
                id: [],
                phone: []
            }
            const temp = names.split(',')
            temp.forEach(item => {
                const t = this.userList.find(i => i.userName === item)
                if (t) {
                    res.id.push(t.userId)
                    res.phone.push(t.phone)
                }
            })
            return res[type].filter(i => i).join(',')
        }
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep .el-table__row {
        cursor: pointer;
    }
    ::v-deep .el-tabs__header {
        margin-bottom: 0;
    }
    .el-completing {
        background: #409eff !important;
    }
    .el-col {
        min-height: 1px;
    }
    .firstcol {
        padding-right: 10px;
    }
    .el-nothing {
        font-size: 13px;
    }
    .calendar-day {
        text-align: center;
        color: #202535;
        line-height: 30px;
        font-size: 12px;
    }
    .is-selected {
        color: #f8a535;
        font-size: 10px;
        margin-top: 5px;
    }
    #calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {
        content: '当月';
    }
    #calendar .item {
        position: relative;
        margin: 0;
        padding: 0;
        height: auto;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        overflow: hidden;
        color: #f8a535;
    }
    .ibps-list-split .ibps-list-item {
        border-bottom: 1px solid #dcdfe6;
        padding: 6px 0;
    }
    .jbd-font-style {
        font-weight: bold;
    }
    .home-text-border {
        color: #999999;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.1);
        min-height: 20px;
        font-size: 14px;
        margin-left: 60px;
        margin-bottom: 5px;
    }
    .jbd-home-card {
        overflow: auto;
    }
    .jbd-home-task {
        width: 100%;
        padding: 10px;
        cursor: pointer;
        font-size: 12px;
        margin-bottom: 35px;
    }
    .jbd-home-card::-webkit-scrollbar {
        display: none;
    }
    .jbd-control-cont {
        text-align: center;
        position: absolute;
        z-index: 10;
        right: 0px;
        top: 50%;
    }
    .tab-container {
        height: calc(100vh - 160px);
        min-height: 600px;
        >div {
            display: inline-block;
        }
        .table-container {
            width: 100%;
            vertical-align: top;
        }
    }
</style>
