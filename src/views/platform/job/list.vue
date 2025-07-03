<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <template slot="description" slot-scope="scope">
                <pre class="ibps-m-0">{{ scope.row.description }}</pre>
            </template>
            <template slot="jobName">
                <el-input v-model="searchJobName" clearable />
            </template>
            <template slot="group">
                <el-select v-model="searchGroup" clearable placeholder="请选择">
                    <el-option
                        v-for="item in groups"
                        :key="item"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </template>
        </ibps-crud>
        <!-- 添加 -->
        <edit
            :params="params"
            :title="title"
            :visible="dialogFormVisible"
            :readonly="readonly"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
        <!-- 添加计划 -->
        <trigger-edit
            :visible="addTriggerVisible"
            :job-name="jobName"
            :group="jobGroup"
            @callback="data => triggerListLoading = !triggerListLoading"
            @close="visible => addTriggerVisible = visible"
        />

        <!-- 计划列表 -->
        <trigger-list
            :visible="triggerListVisible"
            :job-name="jobName"
            :group="jobGroup"
            :search-data="triggerListLoading"
            @add="handleEditTrigger"
            @log="handleLog"
            @close="visible => triggerListVisible = visible"
        />
        <!-- 日志 -->
        <log
            :visible="logVisible"
            :height="logHeight"
            :job-name="jobName"
            :group="jobGroup"
            :trig-name="trigName"
            @close="visible => logVisible = visible"
        />
    </div>
</template>
<script>
import { getGroups, queryPageList, execute, remove } from '@/api/platform/job/job'
import { start, stop, status } from '@/api/platform/job/scheduler'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import Edit from './edit/index'
import TriggerEdit from './trigger/edit'
import TriggerList from './trigger/list'
import Log from './log'

export default {
    components: {
        Edit,
        TriggerList,
        TriggerEdit,
        Log
    },
    mixins: [FixHeight],
    data () {
        return {
            dialogFormVisible: false, // 弹窗
            addTriggerVisible: false,
            triggerListVisible: false,
            logVisible: false,
            triggerListLoading: false,
            readonly: false,

            jobName: '',
            jobGroup: '',
            trigName: '',
            isStarted: false,

            params: {},

            groups: [],
            searchJobName: '',
            searchGroup: '',

            title: '',
            editId: '', // 编辑dialog需要使用
            pkKey: 'jobName', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            logHeight: 600,
            listData: [],
            pagination: {
                limit: 20,
                page: 1
            },
            sorts: {},
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'add'
                    },
                    {
                        key: 'remove'
                    },
                    {
                        key: 'start',
                        label: '启动调度器',
                        icon: 'ibps-icon-play',
                        type: 'success',
                        hidden: (data) => {
                            return this.isStarted
                        }
                    },
                    {
                        key: 'stop',
                        label: '停止调度器',
                        icon: 'ibps-icon-stop',
                        type: 'info',
                        hidden: (data) => {
                            return !this.isStarted
                        }
                    }
                ],
                searchForm: {
                    forms: [
                        { prop: 'jobName', label: '任务名称', fieldType: 'slot', slotName: 'jobName' },
                        { prop: 'group', label: '分组', fieldType: 'slot', slotName: 'group' }
                    ]
                },
                columns: [
                    { prop: 'jobName', label: '任务名称' },
                    { prop: 'group', label: '分组' },
                    { prop: 'jobClass', label: '任务类' },
                    { prop: 'description', label: '任务描述', slotName: 'description' }
                ],
                rowHandle: {
                    actions: [{
                        key: 'remove'
                    }, {
                        key: 'addTrigger',
                        icon: 'ibps-icon-add',
                        label: '添加计划'
                    }, {
                        key: 'triggerList',
                        icon: 'ibps-icon-detail',
                        label: '计划列表'
                    }, {
                        key: 'executeJob',
                        icon: 'ibps-icon-play-circle',
                        label: '执行任务'
                    }, {
                        key: 'log',
                        icon: 'ibps-icon-calendar',
                        label: '日志'
                    },
                    {
                        key: 'edit'
                    }, {
                        key: 'detail'
                    }]
                }
            }
        }
    },
    created () {
        this.loadStatus()
        this.loadData()
        this.loadGroups()
    },
    methods: {
        loadGroups () {
            getGroups().then(response => {
                this.groups = response.data
            })
        },
        loadStatus () {
            status().then(response => {
                this.isStarted = !response.variables.isShutdown
            }).catch(() => {})
        },
        // 加载数据
        loadData () {
            this.loading = true
            const jobName = this.searchJobName
            const group = this.searchGroup
            const page = {
                requestPage: {
                    limit: this.pagination.limit || 20,
                    pageNo: this.pagination.page || 1
                }
            }
            queryPageList({
                jobName,
                group
            }, page).then(response => {
                const data = response.data
                data.pageResult = {
                    'limit': this.pagination.limit || 20,
                    'page': this.pagination.page || 1,
                    'totalCount': data.dataResult.length || 0,
                    'totalPages': Math.ceil(data.dataResult.length / (this.pagination.limit || 20))
                }
                data.dataResult = data.dataResult.slice((this.pagination.page - 1) * this.pagination.limit, this.pagination.page * this.pagination.limit)
                ActionUtils.handleListData(this, data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
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
        handleAction (command, position, selection, data, index) {
            switch (command) {
                case 'start':// 启动调度器
                case 'stop':// 停止调度器
                    this.toggleScheduler()
                    break
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add':// 添加
                    this.title = '添加定时计划'
                    this.params = {}
                    this.handleEdit({})
                    break
                case 'edit':// 编辑
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(data)
                        this.title = '编辑定时计划'
                    }).catch(() => { })
                    break
                case 'detail':// 明细
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(data, true)
                        this.title = '明细定时计划'
                    }).catch(() => { })
                    break
                case 'addTrigger':// 添加计划
                    this.handleEditTrigger(data)
                    break
                case 'triggerList':// 计划列表
                    this.handleTriggerList(data)
                    break
                case 'executeJob':// 执行
                    this.handleExecuteJob(data)
                    break
                case 'log':// 日志
                    this.handleLog(data)
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.rowRemove(position, selection, data)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        rowRemove (position, selection, data) {
            const listData = this.listData
            if (position === 'manage') {
                this.handleRemove(data)
            } else if (position === 'toolbar') {
                if (!selection) {
                    this.$message({
                        message: '请选择记录!',
                        type: 'warning'
                    })
                } else {
                    selection.forEach(i => {
                        listData.forEach(l => {
                            if (i === l.jobName) {
                                this.handleRemove(l)
                            }
                        })
                    })
                }
            }
        },
        toggleScheduler () {
            if (!this.isStarted) {
                start().then(response => {
                    ActionUtils.success('启动定时计划成功')
                    this.isStarted = true
                    this.$router.replace('/refresh')
                }).catch(() => {})
            } else {
                stop().then(response => {
                    ActionUtils.success('停止定时计划成功')
                    this.isStarted = false
                    this.$router.replace('/refresh')
                }).catch(() => {})
            }
        },
        /**
         * 处理编辑
         */
        handleEdit (data = {}, readonly = false) {
            if (data !== {}) {
                this.params.jobName = data.jobName
                this.params.group = data.group
            } else {
                this.params = {}
            }
            this.dialogFormVisible = true
            this.readonly = readonly
        },
        /**
         * 处理添加计划
         */
        handleEditTrigger ({ jobName, group }) {
            this.jobName = jobName
            this.jobGroup = group
            this.addTriggerVisible = true
        },
        /**
         * 处理计划列表
         */
        handleTriggerList ({ jobName, group }) {
            this.jobName = jobName
            this.jobGroup = group
            this.triggerListVisible = true
        },
        /**
         *  执行计划
         */
        handleExecuteJob ({ jobName, group }) {
            execute({
                jobName: jobName,
                group: group
            }).then(response => {
                ActionUtils.success('执行任务成功！')
            }).catch(() => {})
        },
        /**
         * 日志明细
         */
        handleLog ({ jobName, group, trigName }) {
            this.jobName = jobName
            this.jobGroup = group
            this.trigName = trigName || ''
            this.logVisible = true
        },
        /**
         * 计划列表明细
         */
        detail () {
            this.handleDetail()
        },
        /**
         * 处理删除
         */
        handleRemove ({ jobName, group }) {
            remove({ jobNames: jobName, groups: group }).then(response => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        }
    }
}
</script>
