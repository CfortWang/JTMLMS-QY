<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane v-for="item in tabList" :key="item.key" :name="item.key">
                <span slot="label"><i :class="item.icon"></i> {{ item.label }}</span>
                <div class="tab-container">
                    <div slot="west" class="kind">
                        <ibps-type-tree
                            :width="width"
                            :height="height"
                            title=""
                            category-key="FLOW_TYPE"
                            @node-click="handleNodeClick"
                            @expand-collapse="handleExpandCollapse"
                        />
                    </div>
                    <div class="table-container">
                        <div class="search-container">
                            <div class="search-box">
                                <span class="label">事务名称</span>
                                <el-input
                                    v-model="searchParams.subject"
                                    class="input"
                                    placeholder="请输入内容"
                                    clearable
                                    @keyup.enter.native="search"
                                ></el-input>
                            </div>
                            <div class="search-box">
                                <span class="label">{{ item.time }}时间</span>
                                <el-date-picker
                                    v-model="searchParams.createTime"
                                    type="daterange"
                                    class="input"
                                    start-placeholder="请选择"
                                    end-placeholder="请选择"
                                    size="mini"
                                    clearable
                                    @keyup.enter.native="search"
                                ></el-date-picker>
                            </div>
                            <el-button class="btn" type="primary" @click="search">
                                <i class="ibps-icon-search"></i>查询
                            </el-button>
                            <el-button v-if="activeTab === 'save'" :key="Date.now() + Math.random()" class="btn" type="danger" @click="remove">
                                <i class="ibps-icon-close"></i>删除
                            </el-button>
                        </div>
                        <el-table
                            v-loading="loading"
                            :data="dataList"
                            ref="dataTable"
                            style="color: #000"
                            align="center"
                            size="mini"
                            border
                            class="jbd-home-task"
                            @row-click="handleLinkClick"
                            :row-class-name="tableRowClassName"
                            @selection-change="val => selection = val"
                        >
                            <el-table-column v-if="activeTab === 'save'" :key="Date.now() + Math.random()" type="selection" width="55"></el-table-column>
                            <el-table-column
                                prop="subject"
                                label="事务名称"
                                width="250"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">{{ scope.row.subject | getWorkInfo('name') }}</template>
                            </el-table-column>
                            <el-table-column label="事务说明" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.subject | getWorkInfo('desc') }}</template>
                            </el-table-column>
                            <template v-if="['wait'].includes(activeTab)">
                                <el-table-column
                                    show-overflow-tooltip
                                    width="120"
                                    label="事务状态"
                                >
                                    <template slot-scope="scope">{{ '待' + scope.row.name }}</template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip width="100">
                                    <template slot="header" slot-scope="scope">
                                        <span>办理进度</span>
                                        <el-tooltip effect="dark" placement="top">
                                            <div slot="content">
                                                普通事务：接收三天之内为待办理，三天之后为已超时
                                                <br/>
                                                计划事务：月底前七天内为即将超时，超过接收当月月底为已超时，其余为待办理
                                            </div>
                                            <i class="el-icon-info"></i>
                                        </el-tooltip>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-tag :type="scope.row.state ? stateOption[scope.row.state].type : ''">{{ scope.row.state ? stateOption[scope.row.state].label : '待办理' }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="startDept"
                                    show-overflow-tooltip
                                    width="120"
                                    label="发起部门"
                                />
                                <el-table-column
                                    :key="Date.now() + Math.random()"
                                    prop="submitBy"
                                    show-overflow-tooltip
                                    width="100"
                                >
                                    <template slot="header" slot-scope="scope">
                                        <span>发起人</span>
                                        <el-tooltip effect="dark" placement="top">
                                            <div slot="content">
                                                该事务对应流程的发起人
                                            </div>
                                            <i class="el-icon-info"></i>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :key="Date.now() + Math.random()"
                                    prop="forwardBy"
                                    show-overflow-tooltip
                                    width="100"
                                >
                                    <template slot="header" slot-scope="scope">
                                        <span>上节点</span><br/>
                                        <span>提交人</span>
                                        <el-tooltip effect="dark" placement="top">
                                            <div slot="content">
                                                该事务对应流程上一节点的提交人
                                            </div>
                                            <i class="el-icon-info"></i>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </template>
                            <template v-else-if="['over', 'finish'].includes(activeTab)">
                                <el-table-column
                                    show-overflow-tooltip
                                    label="事务状态"
                                    width="100"
                                >
                                    <template slot-scope="scope">{{ scope.row.curNode ? scope.row.status == 'running' ? '已发起' : '已' + scope.row.curNode : contOfValue(scope.row.status) }}</template>
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    label="发起部门"
                                    width="100"
                                >
                                    <template slot-scope="scope">{{ getParenthesesStr(scope.row.subject)[1] }}</template>
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    label="发起人"
                                    width="100"
                                >
                                    <template slot-scope="scope">{{ scope.row.createBy | getUserName(userList)}}</template>
                                </el-table-column>
                                <el-table-column
                                    show-overflow-tooltip
                                    label="提交人"
                                    width="100"
                                >
                                    <template slot-scope="scope">{{ getName(scope.row) }}</template>
                                </el-table-column>
                            </template>
                            <el-table-column show-overflow-tooltip width="160" :key="Date.now() + Math.random()">
                                <template slot="header" slot-scope="scope">
                                    <template v-if="['wait'].includes(activeTab)">
                                        <span>上节点</span><br/>
                                    </template>
                                    <span>{{ item.time + '时间' }}</span>
                                </template>
                                <template slot-scope="scope">{{ scope.row[item.field] ? scope.row[item.field].slice(0, 16) : scope.row.createTime.slice(0, 16) }}</template>
                            </el-table-column>
                        </el-table>
                        <div v-if="dataList.length">
                            <el-pagination
                                @current-change="changePage"
                                :current-page.sync="paginate.page"
                                :page-size="paginate.limit"
                                layout="total, prev, pager, next"
                                :total="paginate.totalCount"
                            >
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :task-id="activeTab === 'wait' ? taskId : null"
            :waiJian="activeTab === 'wait' ? waiJian : null"
            :instance-id="['over', 'finish'].includes(activeTab) ? instanceId : null"
            :def-id="activeTab === 'save' ? defId : null"
            :pro-inst-id="activeTab === 'save' ? proInstId : null"
            :title="['wait', 'save'].includes(activeTab) ? FlowName : null"
            :processName="processName"
            @callback="getData(activeTab)"
            @close="visible => (dialogFormVisible = visible)"
        />
    </div>
</template>

<script>
    import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
    import homeCalendar from './home-calendar'
    import { pending, handledTask } from '@/api/platform/office/bpmReceived'
    import { myDraft, removeDraft } from '@/api/platform/office/bpmInitiated'
    import { queryOrgManager } from '@/api/platform/org/employee'
    import { save } from '@/api/platform/message/innerMessage'
    import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
    import ActionUtils from '@/utils/action'
    import IbpsTypeTree from '@/business/platform/cat/type/tree'
    import { dateFormat } from '@/filters'

    const tabList = [
        {
            label: '待办事宜',
            key: 'wait',
            icon: 'el-icon-edit',
            time: '提交',
            field: 'createTime'
        },
        {
            label: '已办事宜',
            key: 'over',
            icon: 'el-icon-document-remove',
            time: '创建',
            field: 'updateTime'
        },
        {
            label: '办结事宜',
            key: 'finish',
            icon: 'el-icon-paperclip',
            time: '结束',
            field: 'updateTime'
        },
        {
            label: '暂存事宜',
            key: 'save',
            icon: 'el-icon-receiving',
            time: '暂存',
            field: 'createTime'
        }
    ]
    const taskState = {
        running: '已发起',
        end: '已结束',
        manualend: '人工结束'
    }
    const paramsType = {
        wait: 'temp.',
        over: '',
        finish: 'inst.',
        save: ''
    }
    const stateOption = {
        wait: {
            label: '待办理',
            type: ''
        },
        soon: {
            label: '即将超时',
            type: 'warning'
        },
        overtime: {
            label: '已超时',
            type: 'danger'
        }
    }
    const operate = {
        wait: pending,
        over: handledTask,
        finish: handledTask,
        save: myDraft
    }

    export default {
        components: { BpmnFormrender, homeCalendar, IbpsTypeTree },
        name: 'calendar',
        filters: {
            getWorkInfo (v, type) {
                let hasDesc = v.includes('#')
                let res = {
                    name: {
                        '0': v.includes('{') ? v.split('{')[0] : v.includes('(') ? v.split('(')[0] : v,
                        '1': v.split('#')[0]
                    },
                    // 无#返回空，有#返回(左边的字符串,
                    desc: {
                        '0': '',
                        '1': v.split('#')[1]
                    }
                }
                if (!hasDesc) {
                    return res[type]['0']
                }
                return res[type]['1']
            },
            getUserName (v, list) {
                let user = list.find(i => i.userId === v)
                return user ? user.userName : ''
            }
        },
        data() {
            return {
                tabList,
                stateOption,
                dataList: [],
                paginate: {},
                searchParams: {
                    typeId: '',
                    subject: '',
                    createTime: ''
                },
                selection: [],
                taskId: '', // 编辑dialog需要使用
                waiJian: '', // 编辑dialog需要使用
                instanceId: '',
                defId: '',
                proInstId: '',
                loading: false,
                drawer: false,
                dialogFormVisible: false,
                orgName: '',
                roleName: '',
                FlowName: '',
                posName: '',
                defaultPagination: { page: 1, limit: 15 },
                sorts: { CREATE_TIME_: 'DESC' },
                timer: null,
                processName: '',
                userList: [],
                orgInfo: {},
                activeTab: 'wait',
                width: 250,
                height: document.body.clientHeight - 130
            }
        },
        mounted: function () {
            this.loadData()
            this.getUserList()
            this.getOrgInfo()
            if (this.timer) {
                clearInterval(this.timer)
            }
            // 轮询刷新公告数据和任务数据
            this.timer = setInterval(() => {
                // this.getMessage()
                this.getData(this.activeTab)
            }, 180000)
        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
        // 路由离开时
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer)
        },
        methods: {
            loadData() {
                // let user = this.$store.getters.userInfo
                // let pos, role
                // this.orgName = user.employee.orgName
                // for (let i in user.positions) {
                //     if (i == 0) pos = user.positions[0].name
                //     else pos = pos + ',' + user.positions[i].name
                // }

                // let contRole = this.unique(user.role) //去重
                // for (let i in contRole) {
                //     if (i == 0) role = contRole[0].name
                //     else role = role + ',' + contRole[i].name
                // }
                // this.posName = pos
                // this.roleName = role

                // this.getMessage()
                // 获取任务数据
                this.getData(this.activeTab)
            },
	        // 获取系统用户信息
            getUserList() {
                const { userList } = this.$store.getters
                // store中有则无需请求
                if (userList && userList.length) {
                    this.userList = userList
                    return
                }
                let sql = 'select id_ as userId, name_ as userName, mobile_ as phone from ibps_party_employee'
                curdPost('sql', sql).then(res => {
                    this.userList = res.variables && res.variables.data
                })
            },
            // 获取用户部门信息
            getOrgInfo() {
                const { org = {} } = this.$store.getters
                if (!org || !org.id) {
                    return
                }
                let params = {
                    parameters: [{key: 'Q^MANAGER_ORG_ID_^S', value: org.id}]
                }
                queryOrgManager(params).then(res => {
                    this.orgInfo = {}
                    const data = res.data.dataResult
                    if (data && data.length) {
                        const { id, name, mobile, account, gender, groupID } = data[0]
                        this.orgInfo = { id, name, mobile, account, gender, groupID, orgName: org.name }
                    }
                })
            },
            handleNodeClick(typeId) {
                this.dataList = []
                this.paginate = {}
                this.searchParams.typeId = typeId
                this.loadData()
            },
            handleExpandCollapse(isExpand) {
                this.width = isExpand ? 230 : 30
            },
            getName ({createBy, updateBy}) {
                const id = updateBy ? updateBy : createBy
                const { name = '' } = this.$store.getters
                if (this.activeTab === 'finish') {
                    let t = this.userList.find(i => i.userId === id)
                    return t ? t.userName : ''
                }
                return name
            },
            tableRowClassName({ row, rowIndex }) {
                if (rowIndex % 2 === 1) return 'warning-row'
                return 'success-row'
            },
            // 获取表格数据
            getData(type) {
                this.loading = true
                operate[this.activeTab](this.getFormatParams(null, this.defaultPagination)).then(response => {
                    let {dataResult, pageResult} = response.data
                    if (dataResult && dataResult.length) {
                        // 待办事宜对任务发起人做额外处理
                        if (type === 'wait') {
                            let instList = []
                            dataResult.forEach(item => {
                                instList.push(item.bpmnInstId)
                            })
                            let sql = `select b.bpmn_inst_id_, b.create_by_, a.name_ from ibps_bpm_inst b left join ibps_party_employee a on a.id_ = b.create_by_ where b.bpmn_inst_id_ in (${instList.join(',')}) order by find_in_set(b.bpmn_inst_id_,'${instList.join(',')}')`
                            let currentTime = Date.now()
                            curdPost('sql', sql).then(res => {
                                const data = res.variables && res.variables.data
                                data.forEach((item, index) => {
                                    dataResult[index].submitBy = item.name_
                                    dataResult[index].workName = dataResult[index].subject.includes('#') ? dataResult[index].subject.split('#')[0] : dataResult[index].subject.split('(')[0]
                                    dataResult[index].workType = dataResult[index].workName.includes('计划') ? 'plan' : 'normal'
                                    dataResult[index].state = this.judgeExpire(dataResult[index].createTime, currentTime, dataResult[index].workType, '1')
                                })
                                this.dataList = dataResult.sort((a, b) => b.createTime.localeCompare(a.createTime))
                                this.paginate = pageResult
                            })
                            this.urgeToManager()
                        } else {
                            this.dataList = dataResult
                            this.paginate = pageResult
                        }
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            // 查询
            search() {
                this.dataList = []
                this.paginate = {}
                this.getData(this.activeTab)
            },
            // 删除暂存数据
            remove() {
                if (!this.selection.length) {
                    this.$message.warning('请选择暂存事务！')
                    return
                }
                let idList = []
                this.selection.forEach(i => idList.push(i.id))
                ActionUtils.removeRecord(idList).then(ids => {
                    removeDraft({ ids }).then(() => {
                        ActionUtils.removeSuccessMessage()
                        this.selection = []
                        this.search()
                    })
                }).catch(() => { })
            },
            // 切换tab
            changeTab() {
                // 数据、筛选条件初始化
                this.dataList = []
                this.paginate = {}
                this.selection = []
                this.typeId = ''
                this.defaultPagination.page = 1
                this.getData(this.activeTab)
            },
            // 数组去重
            unique(arr) {
                const res = new Map()
                return arr.filter(arr => !res.has(arr.id) && res.set(arr.id, 1))
            },
            // 分页
            changePage(val) {
                this.dataList = []
                this.paginate = {}
                this.defaultPagination.page = val
                this.getData(this.activeTab)
            },
            // 转换状态码
            contOfValue(cont) {
                let s = taskState[cont]
                return s ? s : '暂停'
            },
            getFormatParams(v, pagination) {
                const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
                
                if (this.$utils.isNotEmpty(this.searchParams.typeId)) {
                    params[`Q^${paramsType[this.activeTab]}TYPE_ID_^S`] = this.searchParams.typeId
                }
                if (this.$utils.isNotEmpty(this.searchParams.subject)) {
                    params[`Q^${paramsType[this.activeTab]}subject_^SL`] = this.searchParams.subject
                }
                if (this.searchParams.createTime && this.searchParams.createTime.length) {
                    params[`Q^${paramsType[this.activeTab]}create_time_^DL`] = dateFormat(this.searchParams.createTime[0]).slice(0, 10)
                    params[`Q^${paramsType[this.activeTab]}create_time_^DG`] = dateFormat(this.searchParams.createTime[1]).slice(0, 10)
                }
                if (this.activeTab === 'finish') {
                    params.end = '1'
                }
                return ActionUtils.formatParams(params, pagination, this.sorts)
            },
            // 处理表格点击事件
            handleLinkClick(data) {
                this.taskId = data.id || ''
                this.waiJian = data.waiJian || ''
                this.instanceId = data.id || ''
                this.defId = data.procDefId || ''
                this.proInstId = data.id || ''
                this.FlowName = data.name
                this.processName = this.getProjectName(data.procDefKey, data.subject)
                this.dialogFormVisible = true
            },
            // 开关右侧栏抽屉
            handleClose() {
                this.drawer = !this.drawer
            },
            // 文字替换
            getParenthesesStr(text) {
                let result = ''
                if (!text) return result
                let regex1 = /\{(.+?)\}/g
                let regex2 = /\((.+?)\)/g
                let options1 = text.match(regex1)
                let options2 = text.match(regex2)
                let options = options1 && options1.length ? options1 : options2
                if (options) {
                    let option = options[0]
                    if (option) {
                        result = option.substring(1, option.length - 1)
                    }
                    if (options[1]) {
                        let yersOption = options[1]
                        if (yersOption) {
                            result = result + '/' + yersOption.substring(1, yersOption.length - 1)
                        }
                    }
                }
                return result.split('/')
            },
            // 判断是否为检测项目流程，是则截取流程标题为表单名称
            getProjectName(key, subject) {
                // 从store中获取保存的检测流程信息数组，默认设置已知的四个流程key（三非通用一通用），流程key有变化需修改此处默认值
                const { testingList = ['Process_0idt26n', 'Process_1rwhy1r', 'Process_05lkhio', 'Process_140upmu'] } = this.$store.getters
                let res = testingList.includes(key)
                return res ? subject.includes('#') ? subject.split('#')[0] : '' : ''
            },
            /**
             * 主管提醒
             * 数据处理，将所有待办数据根据是否过期处理为两个数组
             * 过期判断依据：普通事务-创建时间到当前时间超过三天即为过期；计划事务【事务名称中含计划】-创建当月月末前七天
             * 逻辑说明：过期数组中不存于在主管提醒表中的数据插入主管提醒表，并发送内部通知，主管提醒表删除不存在于未过期数组中的数据
             */
            urgeToManager() {
                const { userId } = this.$store.getters
                let params = {
                    parameters: [],
                    sorts: []
                }
                let sql = `select id_, shi_wu_id_ as taskId from t_gqswb where position('${userId}' in chu_li_ren_id_)`
                Promise.all([pending(params), curdPost('sql', sql)]).then(([res1, res2]) => {
                    let workData = res1.data && res1.data.dataResult
                    let noticeData = res2.variables && res2.variables.data
                    if (!workData || !workData.length) {
                        return
                    }
                    this.dealData(workData, noticeData)
                })
            },
            // 处理数据
            dealData(workList, noticeList) {
                let result = {
                    expire: [],
                    unexpire: [],
                    all: []
                }
                let currentTime = Date.now()
                // 筛选已过期数据
                workList.forEach(item => {
                    // 截取流程名
                    item.workName = item.subject.includes('#') ? item.subject.split('#')[0] : item.subject.split('(')[0]
                    item.workType = item.workName.includes('计划') ? 'plan' : 'normal'
                    let isExpire = this.judgeExpire(item.createTime, currentTime, item.workType)
                    if (isExpire) {
                        result.expire.push(item)
                    } else {
                        result.unexpire.push(item)
                    }
                    result.all.push(item)
                })
                // 有过期数据才执行过期数据处理
                if (result.expire.length) {
                    this.dealExpile(result.expire, noticeList)
                }
                // 主管提醒表中有数据才执行数据删除
                if (noticeList && noticeList.length) {
                    this.dealUnexpile(result.all, noticeList)
                }
            },
            // 判断是否过期、获取办理状态
            judgeExpire(time, current, type, isState) {
                let D = new Date(time)
                let a = new Date(time).getTime()
                let b = new Date(current).getTime()
                // 创建时间当月最后一天的时间戳
                let c = new Date(D.getFullYear(), D.getMonth() + 1, 0).getTime() + 86400000
                // 返回办理状态
                if (isState) {
                    let state = ''
                    if (type === 'plan') {
                        state = b >= c ? 'overtime' : b + (86400000 * 7) > c ? 'soon' : 'wait'
                    } else {
                        state = a + (86400000 * 3) < b ? 'overtime' : 'wait'
                    }
                    return state
                }
                // 返回是否过期
                if (type === 'plan') {
                    return b + (86400000 * 7) > c
                } else {
                    return a + (86400000 * 3) < b
                }
            },
            // 处理已过期数据
            dealExpile(data, noticeList) {
                const { userId } = this.$store.getters
                let addList = []
                let sendList = []
                const msgContent = {
                    plan: '距离过期还剩七天，请及时处理！',
                    normal: '至今三天未处理，已超时，请及时处理！'
                }
                const msgTitle = {
                    plan: '计划事务即将到期提醒',
                    normal: '事务超时提醒'
                }
                const nowTime = new Date(new Date().getTime() + 28800000).toJSON().slice(0, 16).replace('T', ' ')
                data.forEach(item => {
                    let isExist = !!noticeList.find(i => i.taskId === item.taskId)
                    // 筛选出不存在于主管提醒表的过期数据
                    if (!isExist) {
                        // 无部门信息的用户不往过期事务表加数据
                        if (this.orgInfo.groupID) {
                            let obj = {
                                // 事务ID
                                shi_wu_id_: item.taskId,
                                // 完整名称
                                wan_zheng_ming_ch: item.subject,
                                // 事务说明
                                shi_wu_shuo_ming_: item.subject.includes('#') ? item.subject.split('#')[1] : '',
                                // 事务名称
                                shi_wu_ming_cheng: item.workName,
                                // 事务状态
                                shi_wu_zhuang_tai: `待${item.name}`,
                                // 事务类型
                                shi_wu_lei_xing_: item.workType,
                                chu_li_ren_ming_: item.ownerName,
                                chu_li_ren_id_: this.getInfoByName(item.ownerName, 'id'),
                                chu_li_ren_dian_h: this.getInfoByName(item.ownerName, 'phone'),
                                bu_men_: this.orgInfo.orgName,
                                bu_men_id_: this.orgInfo.groupID,
                                // 主管ID与当前用户id相等时将主管ID设置为主任【】的ID，主管电话设为空
                                zhu_guan_id_: this.orgInfo.id === userId ? '990927120278487040' : this.orgInfo.id,
                                zhu_guan_dian_hua: this.orgInfo.id === userId ? '' : this.orgInfo.mobile,
                                bian_zhi_shi_jian: item.createTime,
                                ti_xing_ci_shu_: 1,
                                duan_xin_ci_shu_: 0,
                                ti_xing_shi_jian_: nowTime
                            }
                            addList.push(obj)
                        }
                        let msg = {
                            subject: msgTitle[item.workType],
                            content: `<p>事务【${item.workName}】${msgContent[item.workType]}<p>`,
                            receiverId: userId,
                            canreply: '0'
                        }
                        sendList.push(msg)
                    }
                })
                let addParams = {
                    tableName: 't_gqswb',
                    paramWhere: addList
                }
                console.log(addList, sendList)
                if (addList.length) {
                    curdPost('add', JSON.stringify(addParams))
                }
                if (sendList.length) {
                    this.sendMsg(sendList)
                }
            },
            // 删除已办的提醒表数据
            dealUnexpile(data, noticeList) {
                // 清除存在于主管提醒表中【处理人含我】，但是不存在于待办中的数据
                let deleteList = []
                noticeList.forEach(item => {
                    let isExist = !!data.find(i => i.taskId === item.taskId)
                    if (!isExist) {
                        deleteList.push(item.id_)
                    }
                })
                if (!deleteList.length) {
                    return
                }
                let params = `{"tableName": "t_gqswb","paramWhere":"{id_:'${deleteList.join(',')}'}"}`
                curdPost('batchDelete', params).then(() => {}).catch(err => {
                    console.log(err)
                })
            },
            // 发送站内消息
            sendMsg(data) {
                data.forEach(item => {
                    save(item).then(() => {}).catch(err => {
                        console.log(err)
                    })
                })
            },
            // 通过名字获取id/电话
            getInfoByName(names, type) {
                let res = {
                    id: [],
                    phone: []
                }
                let temp = names.split(',')
                temp.forEach(item => {
                    let t = this.userList.find(i => i.userName === item)
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
        >div {
            display: inline-block;
        }
        .table-container {
            width: calc(100% - 250px);
            vertical-align: top;
            .search-container {
                display: flex;
                margin-bottom: 10px;
                .search-box {
                    display: flex;
                    align-items: center;
                    height: 30px;
                    margin-right: 20px;
                    .label {
                        margin: 0 6px 0 6px;
                        color: #606266;
                        font-size: 12px;
                    }
                    .input {
                        width: 200px;
                        font-size: 12px;
                        height: 28px !important;
                        line-height: 28px;
                        color: #606266;
                        ::v-deep .el-input__inner {
                            height: 28px;
                            line-height: 28px;
                        }
                    }
                }
                .btn {
                    height: 30px;
                    margin-left: 10px;
                    background-color: #409eff;
                    border-color: #409eff;
                    font-size: 12px;
                    border-radius: 3px;
                    padding: 7px 15px;
                }
                .el-button--danger {
                    background-color: #f56c6c;
                    border-color: #f56c6c;
                }
            }
        }
    }
</style>
<style>
    .app-container .el-drawer.rtl {
        overflow: scroll;
    }
    .app-container .el-table th {
        background-color: #a7d6f8 !important;
        font-size: 14px;
        font-weight: bold;
        color: #000000;
        border: 0px;
    }
    .app-container .el-table td {
        padding: 4px;
    }
    .app-container .el-table .warning-row {
        background: #d3ebfc;
        color: #000000;
    }
    .app-container .el-table .success-row {
        background: #f9ffff;
        color: #000000;
    }
</style>
