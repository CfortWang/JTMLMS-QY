<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        class="dialog adjust-dialog"
        top="5vh"
        width="60%"
        :title="title"
        @open="loadData"
        @close="closeDialog"
    >
        <el-form
            ref="adjustForm"
            :label-width="formLabelWidth"
            label-position="left"
            :model.sync="formData"
            :rules="rules"
            class="adjust-form"
            @submit.native.prevent
        >
            <el-form-item label="调班方式">
                <template slot="label">
                    <span>调班方式</span>
                    <el-tooltip content="调班方式为调班时目标人员、目标日期、目标班次必填。调班方式为排班变更时，目标人员、日期不可填写。" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>

                <el-select
                    v-model="reScheduleValue"
                    :disabled="readonly"
                    filterable
                    clearable
                    :placeholder=" readonly ? '' : '请选择调班方式'"
                >
                    <el-option
                        v-for="item in reScheduleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="选择排班" prop="scheduleId">
                <el-select
                    v-model="formData.scheduleId"
                    :disabled="readonly"
                    filterable
                    clearable
                    :placeholder=" readonly ? '' : '请选择排班'"
                    @clear="clearSchedule"
                    @change="handleScheduleChange"
                >
                    <el-option
                        v-for="item in scheduleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="调班原因" prop="reason">
                <el-input
                    v-model="formData.reason"
                    type="textarea"
                    :rows="4"
                    clearable
                    show-word-limit
                    :maxlength="1024"
                    :disabled="readonly"
                    :placeholder=" readonly ? '' : '请输入调班原因'"
                />
            </el-form-item>
            <el-form-item label="调班班次">
                <div v-if="!readonly" class="operate-btn">
                    <el-button
                        v-for="btn in tableToolbars"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        plain
                        @click="handleTableAction(btn.key)"
                    >
                        {{ btn.label }}
                    </el-button>
                </div>
                <el-table
                    ref="adjustTable"
                    :key="reScheduleValue"
                    :data="formData.adjustList"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :max-height="maxHeight"
                    class="adjust-table"
                    @selection-change="selection => handleSelectionChange(selection)"
                >
                    <el-table-column type="selection" width="45" v-if=!readonly header-align="center" align="center" />
                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                    <el-table-column
                        prop="beforeDate"
                        label="调班日期"
                        width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot="header">
                            <span>调班日期</span>
                            <el-tooltip content="仅可选择当前排班范围内且您有可选班次的日期" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>

                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.beforeDate"
                                :disabled="readonly"
                                :placeholder=" readonly ? '' : '请选择调班日期'"
                                @change="handleDateChange($event, scope.$index, 'beforeShiftList')"
                            >
                                <el-option
                                    v-for="item in beforeDateList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                />
                            </el-select>

                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="beforeAdjust"
                        label="调班班次"
                        min-width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot="header">
                            <span>调班班次</span>
                            <el-tooltip content="仅展示您的可选班次" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.beforeAdjust"
                                :disabled="readonly"
                                multiple
                                filterable
                                :placeholder=" readonly ? '' : '请选择调班班次'"
                            >
                                <el-option
                                    v-for="item in scope.row.beforeShiftList"
                                    :key="item.alias"
                                    :label="item.name"
                                    :value="item.alias"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if= "reScheduleValue!=='paiban'"
                        prop="party"
                        label="目标人员"
                        width="130"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.party"
                                :disabled="readonly || reScheduleValue==='paiban'"
                                filterable
                                :placeholder=" readonly ? '' : '请选择目标人员'"
                                @change="handlePartyChange($event, scope.row, scope.$index, 'change')"
                            >
                                <el-option
                                    v-for="item in scheduleInfo.scheduleStaff"
                                    :key="item.userId"
                                    :label="item.userName"
                                    :value="item.userId"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if= "reScheduleValue!=='paiban'"
                        prop="afterDate"
                        label="目标日期"
                        width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot="header">
                            <span>目标日期</span>
                            <el-tooltip content="仅可选择当前排班范围内且目标人员有可选班次的日期" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.afterDate"
                                :disabled="readonly || reScheduleValue==='paiban'"
                                :placeholder=" readonly ? '' : '请选择目标日期'"
                                @change="handleDateChange($event, scope.$index, 'afterShiftList')"
                            >
                                <el-option
                                    v-for="item in afterDateList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="afterAdjust"
                        label="目标班次"
                        min-width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot="header">
                            <span>目标班次</span>
                            <el-tooltip content="仅展示目标人员可选班次" placement="top">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.afterAdjust"
                                :disabled="readonly"
                                multiple
                                filterable
                                :placeholder=" readonly ? '' : '请选择目标班次'"
                                @visible-change="(visible) => {getPaiBanBanci(visible,scope.$index)}"
                            >
                                <el-option
                                    v-for="item in scope.row.afterShiftList"
                                    :key="item.alias"
                                    :label="item.name"
                                    :value="item.alias"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleFormAction" />
        </div>
    </el-dialog>
</template>

<script>
// import {  } from '@/views/constants/schedule'
import { getAdjustment, saveAdjustment, queryStaffSchedule, getStaffSchedule, sendMessage } from '@/api/business/schedule'
import { queryDataById } from '@/api/platform/data/dataTemplate'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { isSuper, userId, userList = [], deptList = [] } = this.$store.getters || {}
        return {
            isSuper,
            userId,
            userList,
            deptList,
            title: '调班申请',
            maxHeight: document.body.clientHeight - 438 + 'px',
            dialogVisible: this.visible,
            formLabelWidth: '110px',
            formData: {
                scheduleId: '',
                reason: '',
                adjustList: []
            },
            rules: {},
            loading: false,
            scheduleList: [],
            scheduleInfo: {},
            currentShift: {},
            targetShift: {},
            beforeDateList: [], // 调班日期下拉数据
            afterDateList: [], // 目标日期下拉数据
            blockList: [], // 被锁定数据
            scheduleOptions: [],
            reScheduleOptions: [{ key: 'diaoban', value: 'diaoban', label: '调班' }, { key: 'paiban', value: 'paiban', label: '排班变更' }],
            reScheduleValue: '',
            selectionIndex: [],
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '提交', type: 'success', visible: !this.readonly },
                { key: 'tempSave', icon: 'ibps-icon-save', label: '暂存', type: 'primary', visible: !this.readonly },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            tableToolbars: [
                { key: 'add', icon: 'ibps-icon-plus', label: '添加', type: 'success' },
                { key: 'remove', icon: 'ibps-icon-trash', label: '删除', type: 'danger' }
            ],
            pickerOptions: {}
        }
    },
    computed: {
        /*
        beforeShiftList () {
            return []
        },
        afterShiftList () {
            return []
        }*/
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        },
        reScheduleValue (newValue, oldValue) {
            if (oldValue !== '') { // 当reScheduleValue发生变化时，清空调班数组(初始化除外)
                this.formData.adjustList = []
            }
        }
    },
    async mounted () {
        await this.loadData(this)
    },
    methods: {
        // 获取数据
        async loadData (self) {
            const { id, scheduleId } = self.params || {}
            self.formData.scheduleId = scheduleId
            if (self.$utils.isEmpty(scheduleId)) {
                await self.getScheduleList(self)
            } else {
                await self.getScheduleInfo(scheduleId, self)
                if (self.params.action === 'edit') { // 编辑时获取排版列表
                    await self.getScheduleList(self)
                }
            }
            if (self.$utils.isEmpty(id)) {
                return
            }
            // 初始化表单数据的方法
            const initializeFormData = (data) => {
                const { scheduleId, reason, executor, executeDate, adjustmentDetailPoList } = data || {}
                this.reScheduleValue = data.type
                // this.reScheduleValue = 'paiban'
                self.formData = {
                    scheduleId,
                    reason,
                    adjustList: adjustmentDetailPoList.map((i, index) => ({
                        ...i,
                        beforeAdjust: i.beforeAdjust ? i.beforeAdjust.split(',') : [],
                        afterAdjust: i.afterAdjust ? i.afterAdjust.split(',') : [],
                        beforeShiftList: self.handleDateInit(i.beforeDate, index, 'beforeShiftList', i.createBy, i.beforeAdjust),
                        afterShiftList: this.reScheduleValue === 'paiban' ? self.getPaiBanBanci(true, index, i.afterAdjust.split(',')) : self.handleDateInit(i.afterDate, index, 'afterShiftList', i.party, i.afterAdjust)
                    }))
                }
                console.log('formData', self.formData)
            }
            self.loading = true
            try {
                const res = await getAdjustment({ id: self.params.id })
                if (res.data) {
                    initializeFormData(res.data)
                }
            } catch (error) {
                console.error('加载排班配置失败', error)
            } finally {
                self.loading = false
            }
        },
        getScheduleList (self) { // 获取排班下拉的列表
            const params = {
                parameters: [],
                requestPage: {
                    pageNo: 1,
                    limit: 99999
                },
                sorts: []
            }
            queryStaffSchedule(params).then((res) => {
                self.scheduleList = res.data.dataResult
                self.scheduleOptions = self.scheduleList.map(s => ({
                    label: s.title,
                    value: s.id
                }))
            })
        },
        async getScheduleInfo (id, self) { // 获取排班下拉的列表
            await getStaffSchedule({ id }).then(async (res) => {
                const { data } = res
                self.scheduleList = [data]
                const config = data.config ? JSON.parse(data.config) : {}
                self.scheduleInfo = {
                    startDate: data.startDate,
                    scheduleShift: config.scheduleShift,
                    scheduleStaff: self.userList.filter(u => config.scheduleStaff.includes(u.userId) && u.userId !== this.userId),
                    shiftList: data.staffScheduleDetailPoList,
                    executor: JSON.stringify(config.approver) || ''
                }
                self.scheduleOptions = self.scheduleList.map(s => ({
                    label: s.title,
                    value: s.id
                }))
                if (this.params.action !== 'view') {
                    await self.handleScheduleChange(id)
                }
            })
        },
        async getBlockAdjustRequest (self) { // 获取锁定班次
            const scheduleId = self.scheduleInfo.id
            const sql = 'select * from t_adjustment_detail where status_ in ( "待审核", "审核中", "待审批") and parent_id_ in (select id_ from t_adjustment where schedule_id_ = ' + scheduleId + ' )'
            const res = await self.$common.request('sql', sql) // 获取当前审核状态中的申请单数据
            self.blockList = self.getBlockResult(res.variables.data || [], 'default')
        },
        clearSchedule () { // 清空操作 清空排班数据
            this.formData.adjustList = []
        },
        async handleScheduleChange (val) { // 排班改变刷新数据
            const self = this
            if (val) {
                await getStaffSchedule({ id: val }).then((res) => {
                    const schedule = res.data
                    if (self.$utils.isEmpty(schedule)) {
                        return self.$message.error('数据有误！所选排班不存在！')
                    }
                    const config = schedule.config ? JSON.parse(schedule.config) : {}
                    self.scheduleInfo = {
                        id: schedule.id,
                        startDate: schedule.startDate,
                        endDate: schedule.endDate,
                        scheduleShift: config.scheduleShift,
                        scheduleStaff: self.userList.filter(u => config.scheduleStaff.includes(u.userId) && u.userId !== self.userId),
                        shiftList: schedule.staffScheduleDetailPoList,
                        executor: JSON.stringify(config.approver) || ''
                    }
                    self.currentShift = self.scheduleInfo.shiftList.find(s => s.userId === self.userId) // 当前排班中我的排版表
                    if (!self.currentShift) {
                        return self.$message.warning('所选排班中未含有您的信息，请重新选择！')
                    }
                    self.$set(self, 'pickerOptions', {
                        disableDate: (time) => {
                            const startDate = new Date(schedule.startDate)
                            const endDate = new Date(schedule.endDate)
                            return time < startDate || time > endDate
                        }
                    })
                    if (self.formData.adjustList.length < 1) { // 编辑新增状态初始化
                        self.formData.adjustList = []
                    }
                    if (this.params.action !== 'view') {
                        self.getBlockAdjustRequest(self).then(() => { // 获取被锁定的班次
                            self.beforeDateList = self.initDateOptions(schedule.startDate, self.currentShift)
                            const filterid = self.$store.getters.userId || ''
                            if (self.beforeDateList.length > 0 && Object.keys(self.blockList).length > 0) {
                                // 过滤当前自己被占用的日期和班次
                                self.beforeDateList = self.filterBlockList(self.blockList, self.beforeDateList, filterid)
                            }
                        })
                    }
                })
            }

            // this.scheduleList.find(i => i.id === val)
            // this.pickerOptions = {
            //     disableDate: (time) => {
            //         const startDate = new Date(schedule.startDate)
            //         const endDate = new Date(schedule.endDate)
            //         console.log('startDate:', startDate, 'endDate:', endDate, 'time:', time);
            //         return time < startDate || time > endDate
            //     }
            // }
        },
        rowValidate (row, index) {
            if (!row.beforeDate) {
                this.$message.warning(`第${index}行` + '调班日期未选择！')
                return true
            }
            if (row.beforeAdjust.length < 1) {
                this.$message.warning(`第${index}行` + '调班班次未选择！')
                return true
            }
            if (this.reScheduleValue === 'diaoban') { // 排班变更目标日期目标人员不用填
                if (!row.afterDate) {
                    this.$message.warning(`第${index}行` + '目标人员未选择！')
                    return true
                }
                if (!row.party) {
                    this.$message.warning(`第${index}行` + '目标日期未选择！')
                    return true
                }
            }
            if (row.afterAdjust.length < 1) {
                this.$message.warning(`第${index}行` + '目标班次未选择！')
                return true
            }
        },
        initDateOptions (startDateStr, obj) { // 初始化日期下拉数据
            const result = []
            const startDate = new Date(startDateStr)
            // 筛选出以'd'开头且后面跟数字的键组成数组
            const dKeysArray = Object.keys(obj).filter(key => /^d\d+$/.test(key))
            dKeysArray.forEach(key => {
                const banci = obj[key]
                const date = new Date(startDate)
                const daysToAdd = parseInt(key.slice(1))
                date.setDate(startDate.getDate() + (daysToAdd - 1))
                if (banci) {
                    result.push({
                        key,
                        banci,
                        // date: date.toISOString().split('T')[0],
                        value: date.toISOString().split('T')[0],
                        label: date.toISOString().split('T')[0]
                    })
                } else { // 没有班次的日期禁用
                    result.push({
                        key,
                        banci,
                        // date: date.toISOString().split('T')[0],
                        value: date.toISOString().split('T')[0],
                        label: date.toISOString().split('T')[0],
                        disabled: true
                    })
                }
            })
            return result
        },
        /**
         * 过滤锁定班次，返回被过滤后的排班van数据
         * @param bList  锁定班次数组
         * @param dateList 需要过滤的用户数组
         * @param filterid 需要过滤的用户id
         */
        filterBlockList (bList, dateList, filterid) { // 根据锁定数据，过滤当前列表
            const filterBList = bList[filterid] || []
            const { startDate } = this.scheduleInfo
            // 将日期在今天之前的排班也锁定
            dateList.forEach((el) => {
                if (this.equalDate(el.value)) {
                    el.disabled = true
                }
            })
            filterBList.forEach((el) => {
                const index = this.getDays(startDate, el.value)
                if (dateList[index].value === el.value && dateList[index].disabled !== true) {
                    const arr1 = dateList[index].banci.split(',')
                    const arr2 = el.banci.split(',')
                    const result = arr2.some(item => arr1.includes(item))
                    if (result) { // 包含被锁定班次
                        // dateList[index].banci = dateList[index].banci.replace(el.banci, '')
                        arr2.forEach(item => { // 替换班次为空格
                            const index = arr1.indexOf(item)
                            if (index !== -1) {
                                arr1[index] = ''
                            }
                        })
                        // if (dateList[index].banci === '') {
                        if (arr1.length > 0 && arr1.join('') === '') { // 全被替换为空格说明当天班次已锁定完，该日期不可用
                            dateList[index].disabled = true
                        } else {
                            dateList[index].banci = arr1.join(',')
                        }
                    }
                }
            })
            console.log('已过滤日期班次：', dateList)
            return dateList
        },
        getBlockResult (data, type) {
            if (data.length < 1) {
                return {}
            }
            const blockResult = []
            const tempMap = {}
            data.forEach(item => {
                let { create_by_, before_date_, before_adjust_ } = item
                let key = `${create_by_}-${before_date_}`
                if (type === 'adjustList') { // 如果是给编辑行分组
                    create_by_ = item.createBy || this.$store.getters.userId
                    before_date_ = item.beforeDate
                    before_adjust_ = item.beforeAdjust.join(',')
                    key = `${create_by_}-${before_date_}`
                }
                if (!tempMap[key]) {
                    tempMap[key] = {
                        userid: create_by_,
                        value: before_date_,
                        banci: before_adjust_
                    }
                    blockResult.push(tempMap[key])
                } else {
                    tempMap[key].banci += `,${before_adjust_}`
                }
            })
            data.forEach(item => {
                let { party_, after_date_, after_adjust_ } = item
                let key2 = `${party_}-${after_date_}`
                if (type === 'adjustList') { // 如果是给编辑行分组
                    party_ = item.party
                    after_date_ = item.afterDate
                    after_adjust_ = item.afterAdjust.join(',')
                    key2 = `${party_}-${after_date_}`
                }
                if (!tempMap[key2]) {
                    tempMap[key2] = {
                        userid: party_,
                        value: after_date_,
                        banci: after_adjust_
                    }
                    blockResult.push(tempMap[key2])
                } else {
                    tempMap[key2].banci += `,${after_adjust_}`
                }
            })

            // 按userid分组
            const blockGrouped = {}
            blockResult.forEach((item) => {
                const userid = item.userid
                if (!blockGrouped[userid]) {
                    blockGrouped[userid] = []
                }
                blockGrouped[userid].push(item)
            })
            return blockGrouped
        },
        getDays (start, end) { // 根据日期获取排序 d1、d2、d3...
            if (!start || !end) {
                return 0
            }
            return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
        },
        handleDateInit (val, index, type, userid, Adjust) { // 编辑、详情状态时给行初始化
            const shiftMap = {
                beforeShiftList: 'beforeAdjust',
                afterShiftList: 'afterAdjust'
            }
            // 更新日期时，同步清除班次及option
            // this.formData.adjustList[index][type] = []
            if (!this.formData.adjustList[index]) { // 页面初始化时
                this.formData.adjustList[index] = {}
                this.formData.adjustList[index][type] = []
            }
            if (!this.formData.adjustList[index][shiftMap[type]]) { // 页面初始化时
                this.formData.adjustList[index][shiftMap[type]] = Adjust ? Adjust.split(',') : []
            }
            const { scheduleShift } = this.scheduleInfo
            if (this.params.action === 'view') { // 详情状态初始化beforeShiftList，afterShiftList,不用过滤数据
                this.formData.adjustList[index][type] = scheduleShift
                return this.formData.adjustList[index][type]
            } else { // 编辑状态初始化beforeShiftList，afterShiftList
                // 获取所选日期对应数据
                let selectObj = this.beforeDateList.filter(item => item.value === val) // 调班人自己的数据
                if (type === 'afterShiftList') {
                    this.handlePartyChange(userid, this.formData.adjustList[index], index, 'init')
                    selectObj = this.afterDateList.filter(item => item.value === val) // 目标人员数据
                }
                const shifts = selectObj[0]?.banci?.split(',') || []
                const temp = scheduleShift.filter(i => shifts.includes(i.alias))
                this.formData.adjustList[index].recordId = this.currentShift.id
                this.formData.adjustList[index][type] = temp
                return temp
            }
        },
        handleDateChange (val, index, type) {
            console.log(val, index, type)
            const shiftMap = {
                beforeShiftList: 'beforeAdjust',
                afterShiftList: 'afterAdjust'
            }
            // 更新日期时，同步清除班次及option
            // this.formData.adjustList[index][type] = []
            this.formData.adjustList[index][type] = []
            this.formData.adjustList[index][shiftMap[type]] = []
            if (!val) {
            // 第一次选目标人/切换目标人，目标日期班次清空，不用再往下走了
                return
            }
            const { startDate, scheduleShift } = this.scheduleInfo
            // 获取所选日期对应数据
            let selectObj = this.afterDateList.filter(item => item.value === val) // 目标人员数据
            if (type === 'beforeShiftList') {
                selectObj = this.beforeDateList.filter(item => item.value === val) // 调班人自己的数据
            }
            const shifts = selectObj[0].banci.split(',')
            const temp = scheduleShift.filter(i => shifts.includes(i.alias))
            this.formData.adjustList[index].recordId = this.currentShift.id
            this.formData.adjustList[index][type] = temp
        },
        handlePartyChange (val, row, index, type) {
            this.targetShift = this.scheduleInfo.shiftList.find(i => i.userId === val) // 获取目标人班次
            this.afterDateList = this.initDateOptions(this.scheduleInfo.startDate, this.targetShift) // 转换目标人能选择的日期
            this.formData.adjustList[index]['afterDate'] = '' // 更换目标人时刷新目标日期
            const filterid = val || ''
            if (this.afterDateList.length > 0 && Object.keys(this.blockList).length > 0 && this.params.action !== 'view') {
                // 过滤当前目标人被占用的日期和班次
                this.afterDateList = this.filterBlockList(this.blockList, this.afterDateList, filterid)
            }
            if (type === 'change') {
                this.handleDateChange(row.afterDate, index, 'afterShiftList')
            }
        },
        getPaiBanBanci (visible, index, afterAdjust) { // 排班变更方式，班次全部可选，目标人员和日期不可选
            if (this.reScheduleValue === 'paiban' && visible === true) {
                this.formData.adjustList[index]['afterShiftList'] = this.scheduleInfo.scheduleShift
                if (afterAdjust) {
                    this.formData.adjustList[index]['afterAdjust'] = afterAdjust
                    return this.formData.adjustList[index]['afterShiftList']
                }
            } else {
                return
            }
        },
        handleFormAction ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave(key)
                    break
                case 'tempSave':
                    this.handleSave(key)
                    break
                case 'cancel':
                    this.handleCancel()
                    break
                default:
                    break
            }
        },
        handleTableAction (key, type, data) {
            switch (key) {
                case 'add':
                    this.handleAddParam(type)
                    break
                case 'edit':
                    this.handleAddParam(type, data)
                    break
                case 'remove':
                    if (!this.selectionIndex.length) {
                        return this.$message.warning('请选择要删除的数据')
                    }
                    this.handleRemove(this.selectionIndex, type)
                    break
                default:
                    break
            }
        },
        handleSave (key) {
            const getOverview = (data) => {
                const result = []
                data.forEach(i => {
                    const partyName = this.transformData(this.userList, i.party, 'userId', 'userName')
                    const beforeAdjust = i.beforeAdjust.map(item => `【${item}】`).join('')
                    const afterAdjust = i.afterAdjust.map(item => `【${item}】`).join('')
                    let desc = ''
                    if (i.party && i.party !== this.$store.getters.userId) {
                        desc = `${i.beforeDate}班次${beforeAdjust}与${partyName}${i.afterDate}班次${afterAdjust}调换`
                    } else {
                        desc = `${i.beforeDate}班次${beforeAdjust}调换到${i.afterAdjust}`
                    }
                    result.push(desc)
                })
                return result.join('\n')
            }
            this.$refs.adjustForm.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项信息！')
                }
                const { first, second } = this.$store.getters.level || {}
                const { scheduleId, reason, adjustList } = this.formData || {}
                let statusVal = '已暂存'
                if (key === 'tempSave') { // 暂存
                } else { // 提交
                    // 对最后一行进行行校验
                    if (this.formData.adjustList.length < 1) { // 校验不通过则返回true
                        this.$message.warning('调班表未填写数据！')
                        return
                    }
                    if (this.rowValidate(this.formData.adjustList[this.formData.adjustList.length - 1], this.formData.adjustList.length)) {
                        return
                    }
                    statusVal = adjustList.some((i) => { return this.$utils.isNotEmpty(i.party) && this.reScheduleValue !== 'paiban' }) ? '待审核' : '待审批'
                }
                // return
                const submitData = {
                    id: this.params.id,
                    pk: this.params.id,
                    scheduleId,
                    reason,
                    diDian: second || first,
                    overview: getOverview(adjustList),
                    status: statusVal,
                    type: this.reScheduleValue,
                    /*
                    dataStatus: "string",
                    delBeforeSave: true,
                    dsAlias: "string",
                    executeDate: '',
                    "type": "string",
                    */
                    executor: this.scheduleInfo.executor.replace(/\[|\]|\"/g, '').replace(/,/g, ',') || '',
                    // type: this.reScheduleValue,
                    adjustmentDetailPoList: adjustList.map(i => ({
                        recordId: i.recordId,
                        beforeDate: i.beforeDate,
                        beforeAdjust: i.beforeAdjust ? i.beforeAdjust.join(',') : '',
                        party: i.party ? i.party : this.$store.getters.userId,
                        status: statusVal,
                        afterDate: i.afterDate ? i.afterDate : i.beforeDate,
                        afterAdjust: i.afterAdjust ? i.afterAdjust.join(',') : ''
                    }))
                }
                this.submitForm(submitData)
                // sendMessage(submitData, '1169304256906264576')
            })
        },
        // 提交数据
        submitForm (data) {
            saveAdjustment(data).then(res => {
                this.$message.success(`${this.params.action === 'edit' ? '提交' : '申请'}成功`)
                this.closeDialog()
                this.$emit('refresh')
                // 提交后通知审核人、审批人
                if (data.status === '待审核') {
                    const partyArray = data.adjustmentDetailPoList.map(obj => obj.party)
                    partyArray.forEach(el => {
                        sendMessage(data, el)
                    })
                } else if (data.status === '待审批') {
                    const executorList = data.executor.split(',')
                    executorList.forEach(el => {
                        sendMessage(data, el)
                    })
                }
            })
        },
        handleAddParam () {
            // 把前面填写的行加入班次日期锁定
            if (this.formData.adjustList.length > 0) {
                this.addFilterList(this.formData.adjustList)
            }
            // 对上一行进行行校验
            if (this.formData.adjustList.length > 0 && this.rowValidate(this.formData.adjustList[this.formData.adjustList.length - 1], this.formData.adjustList.length)) { // 校验不通过则返回true
                return
            }
            this.formData.adjustList.push({
                recordId: '',
                beforeDate: '',
                beforeAdjust: '',
                beforeShiftList: [],
                afterDate: '',
                afterAdjust: '',
                afterShiftList: [],
                status: '',
                party: ''
            })
        },
        addOrDelBlockItem (blockList, blockGrouped, type) {
            if (type === 'add') {
                blockGrouped.forEach((itemB) => {
                    let found = false
                    blockList.forEach((itemA, index) => {
                        if (itemA.value === itemB.value) {
                            // 合并banci并去重
                            let mergedBanci = Array.from(new Set([...itemA.banci.split(','), ...itemB.banci.split(',')]))
                            blockList[index].banci = mergedBanci.join(',')
                            found = true
                        }
                    })
                    if (!found) {
                        // 如果没找到相同的value，直接添加新项
                        blockList.push(itemB)
                    }
                })
            } else if (type === 'del') {
                blockGrouped.forEach((itemB) => {
                    let toDeleteIndex = []
                    blockList.forEach((itemA, index) => {
                        if (itemA.value === itemB.value) {
                            // 获取a中子项banci删除掉含有b中子项banci的部分后的新banci
                            let newBanci = itemA.banci.split(',').filter((banciA) => !itemB.banci.split(',').includes(banciA))
                            if (newBanci.length === 0) {
                                // 如果新banci为空，标记该项需要删除
                                toDeleteIndex.push(index)
                            } else {
                                // 更新a中的banci
                                blockList[index].banci = newBanci.join(',')
                            }
                        }
                    })
                    // 根据标记删除相应的项
                    toDeleteIndex.reverse().forEach((index) => {
                        blockList.splice(index, 1)
                    })
                })
            }

            return blockList
        },
        addFilterList (adjustList) { // 把前面填写的行加入班次日期锁定
            const blockGrouped = this.getBlockResult(adjustList, 'adjustList') // 每次把前面的行数据分组
            // 加入锁定数据
            for (const key in blockGrouped) {
                if (!this.blockList[key]) {
                    this.blockList[key] = blockGrouped[key] // key不存在直接新增
                } else { // key存在则合并新旧数据
                    this.blockList[key] = this.addOrDelBlockItem(this.blockList[key], blockGrouped[key], 'add')
                }
            }
            // 刷新当前用户的过滤数据
            const filterid = this.$store.getters.userId || ''
            if (this.beforeDateList.length > 0 && Object.keys(this.blockList).length > 0) {
                // 过滤当前自己被占用的日期和班次
                this.beforeDateList = this.filterBlockList(this.blockList, this.beforeDateList, filterid)
            }
        },
        delFilterList (adjustList) { // 把删除的行从班次日期锁定删除
            const blockGrouped = this.getBlockResult(adjustList, 'adjustList') // 数据分组
            // 加入锁定数据
            for (const key in blockGrouped) {
                this.blockList[key] = this.addOrDelBlockItem(this.blockList[key], blockGrouped[key], 'del')
            }
            // 刷新当前用户的过滤数据
            const filterid = this.$store.getters.userId || ''
            if (this.beforeDateList.length > 0 && Object.keys(this.blockList).length > 0) {
                // 过滤当前自己被占用的日期和班次
                this.beforeDateList = this.filterBlockList(this.blockList, this.beforeDateList, filterid)
            }
        },
        handleSelectionChange (v) {
            this.selectionIndex = v.map(item => this.formData.adjustList.indexOf(item))
        },
        equalDate (dateStr) { // 比较传参是否在今天日期之前，是则返回true
            // 获取今天的日期，只保留年月日部分
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            // 要比较的日期字符串
            // 将日期字符串解析为日期对象
            const dateObj = new Date(dateStr.split('-')[0], parseInt(dateStr.split('-')[1]) - 1, dateStr.split('-')[2])
            // 进行比较
            if (dateObj >= today) {
                return false
            } else {
                return true
            }
        },
        handleRemove (removeIndex, type) {
            const self = this
            let indexList = []
            if (typeof removeIndex === 'number') {
                indexList = [removeIndex]
            } else {
                indexList = removeIndex
            }
            indexList.sort((a, b) => b - a)
            this.$confirm('确定要删除选中数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const delList = []
                indexList.forEach((i) => {
                    delList.push(self.formData.adjustList[i])
                    self.formData.adjustList.splice(i, 1)
                })
                this.delFilterList(delList) // 删除的数据解除班次锁定
            }).catch(() => {})
        },
        transformData (dataset, data, from, to) {
            if (!data) {
                return ''
            }
            const list = data.split(',')
            const names = list.map(item => {
                const temp = dataset.find(i => i[from] === item)
                return temp ? temp[to] : ''
            })
            return names.filter(i => i).join(',')
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .adjust-dialog {
        ::v-deep {
            .el-dialog {
                min-width: 1024px;
                &__header {
                    padding: 15px 20px 16px;
                }
            }
            .adjust-table {
                .el-input, .el-select {
                    width: 100%;
                }
            }
        }
        .adjust-form {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;
            min-Height: 400px;
            height: 60vh;
            .operate-btn {
                text-align: right;
                margin-bottom: 5px;
            }
        }
    }
</style>
