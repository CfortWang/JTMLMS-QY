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
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick">
            <template slot="dateRange" slot-scope="scope">
                <span>{{ `${scope.row.startDate} 至 ${scope.row.endDate}` }}</span>
            </template>
            <template slot="partys" slot-scope="scope">
                <span v-for="party in scope.row.partys" :key="party.value">
                    <span :class="getTagClass(party)" class="el-tag el-tag--small el-tag--light" style="margin-left: 5px;">{{ party.label }}</span>
                </span>
            </template>
        </ibps-crud>
        <adjust-edit
            v-if = "showAdjustEdit"
            :visible.sync="showAdjustEdit"
            :params="params"
            :readonly="readonly"
            @refresh="loadData"
            @close="() => showAdjustEdit = false" />
    </div>
</template>

<script>
import { queryAdjustment, removeAdjustment, saveAdjustment, sendMessage, getStaffSchedule, saveStaffSchedule, getAdjustment, getAdjustmentDetail, saveAdjustmentDetail } from '@/api/business/schedule'
import { stateType } from '@/views/constants/schedule'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { status } from '@/api/platform/job/scheduler'

export default {
    components: {
        AdjustEdit: () => import('./components/adjust-edit')
    },
    mixins: [FixHeight],
    data () {
        const { userList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userOption,
            stateType,
            title: '调班审核记录',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            showAdjustEdit: false,
            showAgreeBtnList: [],
            readonly: false,
            params: {},
            listConfig: {
                /*  toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary', hidden: false },
                    { key: 'create', icon: 'ibps-icon-plus', label: '申请', type: 'success', hidden: false },
                    { key: 'remove', icon: 'ibps-icon-close', label: '删除', type: 'danger', hidden: false }
                ],*/
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary', hidden: false },
                    { key: 'massAgree', icon: 'ibps-icon-check', label: '批量同意', type: 'success', hidden: false },
                    { key: 'massDisagree', icon: 'ibps-icon-close', label: '批量不同意', type: 'danger', hidden: false },
                    { key: 'remove', icon: 'ibps-icon-close', label: '删除', type: 'danger', hidden: !this.isRoleFilter() }
                ],
                searchForm: {
                    labelWidth: 80,
                    itemWidth: 180,
                    forms: [
                        { prop: 'Q^reason_^SL', label: '调班原因' },
                        { prop: 'Q^status^S', label: '状态', fieldType: 'select', options: stateType.filter(item => item.value !== '已暂存' && item.value !== '已取消') },
                        { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '申请时间', fieldType: 'daterange', itemWidth: 200 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'createBy', label: '申请人', tags: userOption, width: 100 },
                    { prop: 'createTime', label: '申请时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 140 },
                    { prop: 'partys', label: '审核人', fieldType: 'slot', slotName: 'partys', minWidth: 120 },
                    { prop: 'executor', label: '审批人', tags: userOption, dataType: 'stringArray', separator: ',', minWidth: 100 },
                    { prop: 'executeDate', label: '审批时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 140 },
                    { prop: 'reason', label: '调班原因', width: 150 },
                    { prop: 'status', label: '状态', tags: stateType, width: 100 },
                    { prop: 'overview', label: '概览', minWidth: 200 }
                ],
                rowHandle: {
                    effect: 'deafult',
                    /* effect: 'display',
                    actions: [
                       { key: 'edit', label: '编辑', type: 'primary', icon: 'ibps-icon-edit' },
                        { key: 'detail', label: '详情', type: 'primary', icon: 'ibps-icon-list-alt' }
                    ]*/
                    actions: [
                        { key: 'agree', label: '同意', type: 'success', icon: 'ibps-icon-check', hidden: (row) => { return this.showAgreeBtn(row) } },
                        { key: 'disagree', label: '不同意', type: 'danger', icon: 'ibps-icon-close', hidden: (row) => { return this.showAgreeBtn(row) } },
                        { key: 'detail', label: '详情', type: 'primary', icon: 'ibps-icon-list-alt', hidden: function (row) { return false } }
                    ]
                }
            }
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData () {
            this.loading = true
            queryAdjustment(this.getSearchFormData()).then(res => {
                ActionUtils.handleListData(this, res.data)
                res.data.dataResult.forEach((el) => { // 遍历子表提取审核人字段
                    el.partys = this.getPartysList(el.adjustmentDetailPoList)
                })
                if (!this.isRoleFilter()) { // 如果不是高权限角色
                    // 审核人审批人过滤
                    this.listData = this.filteredData(res.data.dataResult)
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 判断当前用户是否为超级管理员和高权限角色
         */
        isRoleFilter () {
            const highRoles = this.$store.getters.userInfo.highRoles || [] // 高权限角色
            const userRole = this.$store.getters.userInfo.role || [] // 用户权限角色
            let isHighRole = false
            userRole.forEach(el => {
                const roleAlias = el.alias
                if (highRoles.includes(roleAlias)) {
                    isHighRole = true
                }
            })
            return (this.$store.getters.isSuper || isHighRole)
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const parameters = [{
                relation: 'AND',
                parameters: [
                    {
                        'key': 'Q^status^NE',
                        'value': '已取消',
                        'param': 'status'
                    },
                    {
                        'key': 'Q^status^NE',
                        'value': '已暂存',
                        'param': 'status1'
                    }
                ]
            }]
            // 加入搜索栏参数
            const searchParam = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (Object.keys(searchParam).length) { // 查询条件不为空，则加入parameters
                const statusArr = Object.keys(searchParam).filter(key => key.includes('status'))
                const notstatusArr = Object.keys(searchParam).filter(key => key.includes('status') === false)
                if (statusArr.length > 0) { // 加入状态查询
                    parameters[0].parameters.push({
                        'key': statusArr[0],
                        'value': searchParam[statusArr[0]],
                        'param': 'status2'
                    })
                }
                if (notstatusArr.length > 0) { // 加入其他查询
                    notstatusArr.forEach((el) => {
                        parameters[0].parameters.push({
                            'key': el,
                            'value': searchParam[el]
                        })
                    })
                }
            }
            const param = {
                parameters: parameters,
                ...ActionUtils.formatParams(null, this.pagination, this.sorts)
            }
            return param
        },
        // 审核人审批人过滤(审核人不在父表字段内所以没办法用数组)
        filteredData (data) {
            const { userId = '' } = this.$store.getters
            const result = data.reduce((acc, item) => {
                if (userId && (item.partys.some(obj => obj.value === userId && item.createBy !== userId) || (item.executor && item.executor.includes(userId)))) {
                    acc.push(item)
                }
                return acc
            }, [])
            return result
        },
        /**
         * 处理审核人数据
         */
        getPartysList (poList) {
            const self = this
            const result = poList.map(item => ({
                value: item.party,
                status: item.status,
                label: (self.userOption.filter(o => o.value === item.party))[0].label,
                type: 'success'
            }))
            return result
        },
        /**
         * 处理审核人样式
         */
        getTagClass (party) {
            switch (party.status) {
                case '已通过':
                    return 'el-tag--success'
                case '已拒绝':
                    return 'el-tag--danger'
                case '待审核':
                    return 'el-tag--primary'
                default:
                    return 'el-tag--primary'
            }
        },
        /**
         * 展示每行同意/不同意按钮 返回false则展示
         */
        showAgreeBtn (row) {
            const { userId = '' } = this.$store.getters
            const statusList = ['待审核', '审核中', '待审批']
            if (!statusList.includes(row.status)) { // 申请单不在审核审批状态 不展示
                return true
            }
            const partyObj = row.partys.find(item => item.value === userId)
            // 当前用户是未审核的审核人 是未审批的审批人 展示
            if (partyObj && partyObj.status === '待审核') {
                return false
            }
            // 当前用户是未审批的审批人 展示
            if (row.executor.includes(userId) && row.status !== '待审批') {
                return false
            }
            return false
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
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                /*
                case 'create':
                    this.handleEdit(command, {})
                    break
                case 'edit':
                    this.handleEdit(command, data)
                    break
                */
                case 'massAgree':
                    this.handleMassAgree(command, data)
                    break
                case 'massDisagree':
                    this.handleMassAgree(command, data)
                    break
                case 'agree':
                    this.handleAgree(command, data)
                    break
                case 'disagree':
                    this.handleAgree(command, data)
                    break
                case 'detail':
                    this.handleEdit(command, data)
                    break
                case 'remove':
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch((e) => { console.error(e) })
                    break
                default:
                    break
            }
        },
        /**
         * 处理编辑\详情
         */
        async handleEdit (key, { id, scheduleId }) {
            this.params = {
                id,
                scheduleId,
                action: key === 'detail' ? 'view' : 'edit'
            }
            this.readonly = key === 'detail'
            this.showAdjustEdit = true
        },
        /**
         * 状态变更发送系统消息
         */
        sendMsg (data) {
            switch (data.status) {
                case '待审批':
                { const executorList = data.executor.split(',')
                    executorList.forEach(el => {
                        sendMessage(data, el)
                    })
                    break }
                case '已拒绝':
                { // 已拒绝时视情况发送给审核人申请人(审核时拒绝消息对象需排除自己)
                    const parties = data.adjustmentDetailPoList.map(obj => obj.party)
                    if (parties.length > 0) { // 发给审核人
                        const { userId = '' } = this.$store.getters
                        const filteredParties = parties.filter(party => party !== userId)
                        filteredParties.forEach((el) => {
                            sendMessage(data, el)
                        })
                    }
                    sendMessage(data, data.createBy) // 发给申请人
                    break
                }
                case '已通过':
                { // 已通过时发送给申请人审核人
                    const parties = data.adjustmentDetailPoList.map(obj => obj.party)
                    if (parties.length > 0) { // 发给审核人
                        parties.forEach((el) => {
                            sendMessage(data, el)
                        })
                    }
                    sendMessage(data, data.createBy) // 发给申请人
                    break
                }
                default:
                    // 如果data.status的值不在上述列举的情况中，可以在这里添加默认处理逻辑
                    break
            }
        },
        /**
         * 判断是否由审核进入审批状态
         */
        isNextStep (data) {
            if (data.status === '待审核' || data.status === '审核中') {
                if (data.adjustmentDetailPoList.length > 0) { // 审核人数是否>0
                    const { userId = '' } = this.$store.getters
                    const i = data.adjustmentDetailPoList.findIndex(item => item.party === userId)
                    if (i !== -1) { // 把当前用户的调班申请审批状态改为已通过
                        data.adjustmentDetailPoList[i].status = '已通过'
                    }
                    if (data.adjustmentDetailPoList.every(item => item.status === '已通过')) { // 判断多个审核人状态
                        return '待审批'
                    } else {
                        return '审核中'
                    }
                } else {
                    return '待审批'
                }
            }
            // '待审批' 状态则直接通过
            return '已通过'
        },
        /**
         * 处理单条同意/不同意
         */
        async handleAgree (key, data) {
            // console.log(data)
            data.status = (key === 'agree' ? this.isNextStep(data) : '已拒绝')
            // 改为通用接口
            const tableName = 't_adjustment'
            const updateParams = {
                tableName,
                updList: [
                    {
                        where: {
                            id_: data.id
                        },
                        param: {
                            status: data.status,
                            execute_date_: data.status === ('已通过' || '已拒绝') ? this.getTimeNow() : ''
                        }
                    }]
            }
            this.$common.request('update', updateParams).then(async () => {
                const sonTableName = 't_adjustment_detail'
                const { userId = '' } = this.$store.getters
                const sonUpdateParams = {
                    tableName: sonTableName,
                    updList: [
                        {
                            where: {
                                parent_id_: data.id,
                                party_: userId
                            },
                            param: {
                                status_: key === 'agree' ? '已通过' : '已拒绝',
                                audit_time_: data.status === ('已通过' || '已拒绝') ? this.getTimeNow() : ''
                            }
                        }]
                }
                await this.$common.request('update', sonUpdateParams) // 更新调班子表
                ActionUtils.successMessage()
                if (data.status === '已通过') {
                    // 获取排班子表数据
                    const response = await getAdjustment({ id: data.id })
                    this.handleAccess(response.data)
                }
                this.sendMsg(data) // 发送系统通知
                this.search()
            }).catch((e) => { console.error(e) })
            /*
            saveAdjustment(data).then(() => {
                ActionUtils.successMessage()
                if (data.status === '已通过') {
                    this.handleAccess(data)
                }
                this.sendMsg(data) // 发送系统通知
                this.search()
            }).catch((e) => { console.error(e) })*/
        },
        /**
         * 批量处理同意/不同意
         */
        async handleMassAgree (key, data) {
            // console.log(key, data)
            if (data.length < 1) {
                ActionUtils.warning('请选择数据！')
                return
            }
            const tableName = 't_adjustment'
            let uparr = []
            let sonuparr = []
            const { userId = '' } = this.$store.getters
            data.forEach((el) => {
                if (el.status === '已通过' || el.status === '已拒绝') {
                    // this.$message.warning('所选数据中有已通过/已拒绝的申请单，请取消选择！')
                    return
                }
                el.status = key === 'massAgree' ? this.isNextStep(el) : '已拒绝'
                uparr.push({
                    where: {
                        id_: el.id
                    },
                    param: {
                        status: el.status,
                        execute_date_: el.status === ('已通过' || '已拒绝') ? this.getTimeNow() : ''
                    }
                })
                sonuparr.push({
                    where: {
                        parent_id_: el.id,
                        party_: userId
                    },
                    param: {
                        status_: key === 'massAgree' ? '已通过' : '已拒绝',
                        audit_time_: el.status === ('已通过' || '已拒绝') ? this.getTimeNow() : ''
                    }
                })
            })
            const updateParams = {
                tableName,
                updList: uparr
            }
            this.$common.request('update', updateParams).then(async () => {
                const sonTableName = 't_adjustment_detail'
                const sonUpdateParams = {
                    tableName: sonTableName,
                    updList: sonuparr
                }
                await this.$common.request('update', sonUpdateParams) // 更新调班子表
                ActionUtils.successMessage()
                data.forEach(async (el) => { // 给每个申请单发通知
                    if (el.status === '已通过') {
                        // 获取排班子表数据
                        const response = await getAdjustment({ id: el.id })
                        this.handleAccess(response.data)
                    }
                    this.sendMsg(el)
                })
                this.search()
            }).catch((e) => { console.error(e) })
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            // return this.$message.warning('避免误删测试数据，联系开发删除')
            removeAdjustment({ ids }).then(() => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch((e) => { console.error(e) })
        },
        /**
         * 处理已通过的申请单，修改排班数据
         */
        async handleAccess (data) {
            if (data.adjustmentDetailPoList.length > 0) {
                const scheduleId = data.scheduleId
                const response = await getStaffSchedule({ id: scheduleId })
                const submitData = response.data
                const { staffScheduleDetailPoList, startDate } = response.data
                data.adjustmentDetailPoList.forEach(async (el) => {
                    const userId = el.createBy
                    const partyId = el.party
                    const userResIndex = staffScheduleDetailPoList.findIndex(item => item.userId === userId) // 获取调班人的排班详情
                    const partyResIndex = staffScheduleDetailPoList.findIndex(item => item.userId === partyId) // 获取目标人的排班详情
                    // 修改调班人排班数据
                    const index = this.getDays(startDate, el.beforeDate) // 计算得出是d几天
                    staffScheduleDetailPoList[userResIndex][`d${index + 1}`] = staffScheduleDetailPoList[userResIndex][`d${index + 1}`].replace(el.beforeAdjust, el.afterAdjust)
                    if (data.type !== 'paiban') {
                        // 修改目标人排班数据
                        const partyIndex = this.getDays(startDate, el.afterDate) // 计算得出是d几天
                        staffScheduleDetailPoList[partyResIndex][`d${partyIndex + 1}`] = staffScheduleDetailPoList[partyResIndex][`d${partyIndex + 1}`].replace(el.afterAdjust, el.beforeAdjust)
                    }
                })
                // 保存修改后的排班
                submitData.staffScheduleDetailPoList = staffScheduleDetailPoList
                saveStaffSchedule(submitData).then(() => {
                    console.log('排班已更新')
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        getDays (start, end) { // 根据日期获取排序 d1、d2、d3...
            if (!start || !end) {
                return 0
            }
            return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
        },
        getTimeNow () {
            const currentDate = new Date()
            const year = currentDate.getFullYear()
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
            const day = currentDate.getDate().toString().padStart(2, '0')
            const hours = currentDate.getHours().toString().padStart(2, '0')
            const minutes = currentDate.getMinutes().toString().padStart(2, '0')
            // 拼接
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`
            return formattedDateTime
        },
        /**
         * 行双击事件
         *
         */
        handleRowDblclick (row) {
            // this.handleEdit(row, 'detail')
        }
    }
}
</script>
<style lang="scss"></style>
