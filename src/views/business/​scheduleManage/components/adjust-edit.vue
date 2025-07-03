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
                <template slot="label">
                    <span>选择排班</span>
                    <el-tooltip content="只能选择已发布状态的排班" placement="top">
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>
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
            <el-form-item v-if="params.action == 'view' && formData.status == '已拒绝'" label="拒绝原因" prop="rejectReason">
                <el-input
                    v-model="formData.rejectReason"
                    type="textarea"
                    :rows="4"
                    clearable
                    show-word-limit
                    :maxlength="1024"
                    :disabled="readonly"
                    :placeholder="params.action + formData.status"
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
                                clearable
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
                                clearable
                                :multiple-limit="3"
                                :placeholder=" readonly ? '' : '请选择调班班次'"
                                @change="vaildBanci($event, scope.row, 'before')"
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
                                clearable
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
                                :disabled="readonly"
                                clearable
                                :placeholder=" readonly ? '' : '请选择目标日期'"
                                @change="handleDateChange($event, scope.$index, 'afterShiftList')"
                                @visible-change="(visible) => {getPaiBanDate(visible,scope.$index)}"
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
                                clearable
                                filterable
                                :multiple-limit="3"
                                :placeholder=" readonly ? '' : '请选择目标班次'"
                                @change="vaildBanci($event, scope.row, 'after')"
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
import { getAdjustment, saveAdjustment, queryStaffSchedule, getStaffSchedule, sendMessage, saveStaffSchedule } from '@/api/business/schedule'
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
            getAdjustmentData: null,
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
                const { scheduleId, reason, status, rejectReason, executor, executeDate, adjustmentDetailPoList } = data || {}
                this.reScheduleValue = data.type
                // this.reScheduleValue = 'paiban'
                setTimeout(() => {
                    self.formData = {
                        scheduleId,
                        reason,
                        status,
                        rejectReason,
                        adjustList: adjustmentDetailPoList.map((i, index) => ({
                            ...i,
                            beforeAdjust: i.beforeAdjust ? i.beforeAdjust.split(',') : [],
                            afterAdjust: i.afterAdjust ? i.afterAdjust.split(',') : [],
                            beforeShiftList: self.handleDateInit(i.beforeDate, index, 'beforeShiftList', i.createBy, i.beforeAdjust),
                            afterShiftList: self.handleDateInit(i.afterDate, index, 'afterShiftList', i.party, i.afterAdjust)
                        }))
                    }
                    console.log('formData', self.formData)
                }, 200)
            }
            self.loading = true
            try {
                // const res = await getAdjustment({ id: self.params.id })
                this.getAdjustmentData = await getAdjustment({ id: self.params.id })
                if (this.getAdjustmentData.data) {
                    initializeFormData(this.getAdjustmentData.data)
                }
            } catch (error) {
                console.error('加载排班配置失败', error)
            } finally {
                self.loading = false
            }
        },
        getScheduleList (self) { // 获取排班下拉的列表
            const { first, second } = this.$store.getters.level || {}
            const params = {
                parameters: [{
                    key: 'Q^di_dian_^S',
                    value: second || first
                }],
                requestPage: {
                    pageNo: 1,
                    limit: 99999
                },
                sorts: []
            }
            queryStaffSchedule(params).then((res) => {
                self.scheduleList = res.data.dataResult
                self.scheduleOptions = self.scheduleList.filter(s => s.status === '已发布').map(s => ({
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
                    scheduleStaff: this.params.action === 'view' ? self.userList : self.userList.filter(u => config.scheduleStaff.includes(u.userId) && u.userId !== this.userId),
                    shiftList: data.staffScheduleDetailPoList,
                    executor: JSON.stringify(config.approver) || ''
                }
                self.scheduleOptions = self.scheduleList.map(s => ({
                    label: s.title,
                    value: s.id
                }))
                if (this.params.action !== 'view') {
                    self.handleScheduleChange(id)
                }
            })
        },
        async getBlockAdjustRequest (self) { // 获取锁定班次
            const scheduleId = self.scheduleInfo.id
            // const sql = `select * from t_adjustment_detail where status_ in ( "待审核", "审核中", "待审批") and parent_id_ in (select id_ from t_adjustment where schedule_id_ = '${scheduleId}')`
            const res = await self.$common.request('query', {
                key: 'getLockedAdjustmentData',
                params: [scheduleId]
            }) // 获取当前审核状态中的申请单数据
            self.blockList = self.getBlockResult(res.variables.data || [], 'default')
            // 清除列表中被申请数据
            this.vaildExpireData(self.blockList)
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
        /** 校验数据中有无日期过期或班次被锁定数据，有则清空该条数据
         *
         * @param dateList 已经过滤的数据
         * */
        vaildExpireData (blockList) {
            this.formData.adjustList.forEach((adjustItem) => {
                const createBy = adjustItem.createBy
                if (blockList[createBy]) {
                    const blockListForUser = blockList[createBy] // 锁定数据中用户数据
                    const beforeDate = adjustItem.beforeDate
                    blockListForUser.forEach((blockEntry) => {
                        if (blockEntry.value === beforeDate) {
                            const banci = blockEntry.banci
                            if (adjustItem.beforeAdjust.includes(banci)) {
                                const nameObj = this.scheduleInfo.scheduleShift.find(obj => obj.alias === banci)
                                this.$message.warning(adjustItem.beforeDate + '调班班次【' + nameObj?.name + '】已被申请,请重新选择')
                                adjustItem.beforeAdjust = adjustItem.beforeAdjust.filter(item => item !== banci)
                            }
                        }
                    })
                }
                const party = adjustItem.party
                if (blockList[party]) {
                    const blockListForUser = blockList[party] // 锁定数据中用户数据
                    const afterDate = adjustItem.afterDate
                    blockListForUser.forEach((blockEntry) => {
                        if (blockEntry.value === afterDate) {
                            const banci = blockEntry.banci
                            if (adjustItem.afterAdjust.includes(banci)) {
                                const nameObj = this.scheduleInfo.scheduleShift.find(obj => obj.alias === banci)
                                this.$message.warning(adjustItem.afterDate + '目标班次【' + nameObj?.name + '】已被申请,请重新选择')
                                adjustItem.afterAdjust = adjustItem.afterAdjust.filter(item => item !== banci)
                            }
                        }
                    })
                }
            })
        },
        vaildBanci (chooseArr, row, type) {
            // 校验调班那天是否有重复班次
            if (this.reScheduleValue === 'diaoban' && chooseArr.length > 0) {
                const duplicateElements = [] // 用户重复班次数组
                const userAfterData = this.beforeDateList.find(obj => obj.value === row.afterDate)
                row.afterAdjust.some(element => {
                    if (userAfterData.banci.includes(element)) {
                        duplicateElements.push(element)
                    }
                })
                if (duplicateElements.length > 0) { // 用户当天有目标班次 不能换
                    const val = duplicateElements.map(el => {
                        const nameObj = this.scheduleInfo.scheduleShift.find(obj => obj.alias === el)
                        return nameObj?.name
                    }).filter(Boolean).join(', ')
                    // 把该重复元素从目标班次删除
                    row.afterAdjust = row.afterAdjust.filter(item => !duplicateElements.includes(item))
                    this.$message.warning(row.afterDate + '您已有【' + val + '】班次，不能作为目标班次！')
                    return true
                } else if (duplicateElements.length === 0 && type === 'after') {
                    const targetData1 = this.afterDateList.filter(obj => obj.value === row.beforeDate) // 目标人在调班日期的班次
                    let targetBanCiNum1 = 0 // 目标人在调班日期的班次数量
                    if (targetData1.length > 0) {
                        targetBanCiNum1 = targetData1[0].banci.split(',').length// 目标人在调班日期的班次数量
                    }
                    // 判断班次不能大于3个
                    if ((targetBanCiNum1 + row.beforeAdjust.length - row.afterAdjust.length) > 3) {
                        const name = this.userList.filter(obj => obj.userId === row.party)[0].userName
                        this.$message.warning('调班后【' + name + '】【 ' + row.afterDate + '】班次大于3个！')
                        row.afterAdjust = []
                        return true
                    }
                    const targetData2 = this.beforeDateList.filter(obj => obj.value === row.afterDate) // 调班人在目标日期的班次
                    let targetBanCiNum2 = 0
                    if (targetData2.length > 0) {
                        targetBanCiNum2 = targetData2[0].banci.split(',').length // 调班人在目标日期的班次数量
                    }
                    // 判断班次不能大于3个
                    if ((targetBanCiNum2 + row.afterAdjust.length - row.beforeAdjust.length) > 3) {
                        const name = this.userList.filter(obj => obj.userId === this.$store.getters.userId)[0].userName
                        this.$message.warning('调班后【' + name + '】【 ' + row.beforeDate + '】班次大于3个！')
                        row.beforeAdjust = []
                        return true
                    }

                    return false
                }
                const partyElements = []// 目标人员重复班次数组
                const partyBeforeData = this.afterDateList.find(obj => obj.value === row.beforeDate)
                row.beforeAdjust.some(element => {
                    if (partyBeforeData && partyBeforeData.banci.includes(element)) {
                        partyElements.push(element)
                    }
                    return false
                })
                if (partyElements.length > 0) { // 目标人员有重复班次 也不能换
                    const val = partyElements.map(el => {
                        const nameObj = this.scheduleInfo.scheduleShift.find(obj => obj.alias === el)
                        return nameObj?.name
                    }).filter(Boolean).join(', ')
                    // 把该重复元素从目标班次删除
                    row.beforeAdjust = row.beforeAdjust.filter(item => !partyElements.includes(item))
                    this.$message.warning(row.beforeDate + '目标人员已有【' + val + '】班次，不能作为调班班次！')
                    return true
                } else if (duplicateElements.length === 0 && type === 'before') {
                    const targetData1 = this.afterDateList.filter(obj => obj.value === row.beforeDate) // 目标人在调班日期的班次
                    let targetBanCiNum1 = 0 // 目标人在调班日期的班次数量
                    if (targetData1.length > 0) {
                        targetBanCiNum1 = targetData1[0].banci.split(',').length// 目标人在调班日期的班次数量
                    }
                    // 判断班次不能大于3个
                    if ((targetBanCiNum1 + row.beforeAdjust.length - row.afterAdjust.length) > 3) {
                        const name = this.userList.filter(obj => obj.userId === row.party)[0].userName
                        this.$message.warning('调班后【' + name + '】【 ' + row.afterDate + '】班次大于3个,请重新选择！')
                        row.afterAdjust = []
                        return true
                    }
                    const targetData2 = this.beforeDateList.filter(obj => obj.value === row.afterDate) // 调班人在目标日期的班次
                    let targetBanCiNum2 = 0
                    if (targetData2.length > 0) {
                        targetBanCiNum2 = targetData2[0].banci.split(',').length // 调班人在目标日期的班次数量
                    }
                    // 判断班次不能大于3个
                    if ((targetBanCiNum2 + row.afterAdjust.length - row.beforeAdjust.length) > 3) {
                        const name = this.userList.filter(obj => obj.userId === this.$store.getters.userId)[0].userName
                        this.$message.warning('调班后【' + name + '】【 ' + row.beforeDate + '】班次大于3个,请重新选择！')
                        row.beforeAdjust = []
                        return true
                    }

                    return false
                }
            }
        },
        rowValidate (row, index) { // 行必填检验
            if (!row.beforeDate) {
                this.$message.warning(`第${index}行` + '调班日期未选择！')
                return true
            }
            if (row.beforeAdjust.length < 1) {
                this.$message.warning(`第${index}行` + '调班班次未选择！')
                return true
            }
            if (this.reScheduleValue === 'diaoban') { // 排班变更目标人员不用填
                if (!row.afterDate) {
                    this.$message.warning(`第${index}行` + '目标人员未选择！')
                    return true
                }
                if (!row.party) {
                    this.$message.warning(`第${index}行` + '目标日期未选择！')
                    return true
                }
                if (row.afterAdjust.length < 1) {
                    this.$message.warning(`第${index}行` + '目标班次未选择！')
                    return true
                }
            }
        },
        initDateOptions (startDateStr, obj) { // 初始化日期下拉数据
            if (!obj) {
                return
            }
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
            // dateList.forEach((el) => {
            //     if (this.equalDate(el.value)) {
            //         el.disabled = true
            //     }
            // })
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
        /**
         * @param data 被锁定的数据
         * @param type 类型区分是初始化时还是编辑中，因为初始化数据的字段和编辑行的不一致
         */
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
                    if (this.reScheduleValue === 'paiban') { // 排班变更模式下 日期 班次初始化为全部日期班次
                        this.afterDateList = this.getDateArray(this.scheduleInfo.startDate, this.scheduleInfo.endDate)
                        const shiftArr = this.scheduleInfo.scheduleShift
                        shiftArr.push({})
                        return shiftArr
                    }
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
            if (!val) {
                return
            }
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
        getPaiBanDate (visible, index, afterAdjust) { // 排班变更方式，日期全部可选，目标人员不可选
            if (this.reScheduleValue === 'paiban' && visible === true) {
                const startDate = this.scheduleInfo.startDate
                const endDate = this.scheduleInfo.endDate
                const datearr = this.getDateArray(startDate, endDate)
                this.afterDateList = datearr
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
                const { scheduleId, reason, adjustList, rejectReason } = this.formData || {}
                let statusVal = '已暂存'
                const executorVal = this.scheduleInfo.executor.replace(/\[|\]|\"/g, '').replace(/,/g, ',') || ''
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
                    statusVal = adjustList.some((i) => { return this.$utils.isNotEmpty(i.party) && this.reScheduleValue !== 'paiban' }) ? '待审核' : (executorVal === '' ? '已通过' : '待审批')
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
                    rejectReason,
                    /*
                    dataStatus: "string",
                    delBeforeSave: true,
                    dsAlias: "string",
                    executeDate: '',
                    "type": "string",
                    */
                    executor: executorVal,
                    // type: this.reScheduleValue,
                    adjustmentDetailPoList: adjustList.map(i => ({
                        recordId: i.recordId,
                        beforeDate: i.beforeDate,
                        rejectReason: i.rejectReason,
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
            const self = this
            saveAdjustment(data).then(async (res) => {
                self.$message.success(`${self.params.action === 'edit' ? '提交' : '申请'}成功`)
                self.closeDialog()
                self.$emit('refresh')
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
                } else if (data.status === '已通过') { // 通过申请修改排班数据(只有排版变更且无排版审批人才可能在提交时变为已通过)
                    self.handleAccess(self)
                }
            })
        },
        /**
         * 处理已通过的申请单，修改排班数据
         * */
        async handleAccess (self) {
            const response = await getStaffSchedule({ id: self.formData.scheduleId })
            const submitData = response.data
            const { staffScheduleDetailPoList, startDate } = response.data
            const getIndexByDate = (date) => this.getDays(startDate, date)
            self.formData.adjustList.forEach(async (el) => {
                const userId = this.$store.getters.userId || ''
                const userResIndex = staffScheduleDetailPoList.findIndex(item => item.userId === userId)
                const index = getIndexByDate(el.afterDate)
                const partyIndex = getIndexByDate(el.beforeDate)
                this.removeScheduleDataForPaibanWithRegex(userResIndex, partyIndex, el.beforeAdjust, staffScheduleDetailPoList)
                this.updateScheduleDataForPaibanWithRegex(userResIndex, index, el.afterAdjust, staffScheduleDetailPoList)
            })
            submitData.staffScheduleDetailPoList = staffScheduleDetailPoList
            saveStaffSchedule(submitData).then(() => console.log('排班已更新')).catch(err => console.log(err))
        },

        // 用于排班变更时使用正则表达式更新排班数据的函数（避免重复添加班次），确保无多余逗号
        updateScheduleDataForPaibanWithRegex (index, targetIndex, adjustData, scheduleList) {
            const currentData = scheduleList[index][`d${targetIndex + 1}`] || ''
            const dataToAdd = adjustData.filter(item => !currentData.includes(item))
            const newData = [currentData, dataToAdd.join(',')].filter(Boolean).join(',')
            scheduleList[index][`d${targetIndex + 1}`] = newData.replace(/,$/, '')
        },

        // 用于排班变更时使用正则表达式移除排班数据的函数，确保无多余逗号
        removeScheduleDataForPaibanWithRegex (index, targetIndex, adjustData, scheduleList) {
            const targetData = scheduleList[index][`d${targetIndex + 1}`] || ''
            const updatedData = adjustData.reduce((acc, item) => {
                const pattern = new RegExp(`,?${item}(,|$)`, 'g') // 匹配逗号+要移除的项或者要移除的项+结尾逗号或结尾（全局匹配）
                return acc.replace(pattern, '')
            }, targetData)
            scheduleList[index][`d${targetIndex + 1}`] = updatedData.replace(/,$/, '') // 去除末尾可能出现的多余逗号
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
            // 把目标日期清空
            this.afterDateList = []
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
                            const mergedBanci = Array.from(new Set([...itemA.banci.split(','), ...itemB.banci.split(',')]))
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
                    const toDeleteIndex = []
                    blockList.forEach((itemA, index) => {
                        if (itemA.value === itemB.value) {
                            // 获取a中子项banci删除掉含有b中子项banci的部分后的新banci
                            const newBanci = itemA.banci.split(',').filter((banciA) => !itemB.banci.split(',').includes(banciA))
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
        /** 返回一个从开始日期到结束日期的日期数组(今天之前的不可用)
         * @param startDate
         * @param endDate
         * */
        getDateArray (startDate, endDate) {
            const dateArray = []
            const start = new Date(startDate)
            const end = new Date(endDate)
            // const currentDateNow = new Date() // 获取当前日期
            const aliasList = this.scheduleInfo.scheduleShift.map(item => item.alias)
            const banci = aliasList.join(',')
            for (let currentDate = start; currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
                const dateObj = {
                    banci: banci + ',休息',
                    disabled: false,
                    // currentDate < currentDateNow, // 修改此处判断，若日期小于当前日期则设为disabled:true,
                    key: `d${currentDate.getDate()}`,
                    label: currentDate.toISOString().split('T')[0],
                    value: currentDate.toISOString().split('T')[0]
                }
                dateArray.push(dateObj)
            }

            return dateArray
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
                self.delFilterList(delList) // 删除的数据解除班次锁定
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
