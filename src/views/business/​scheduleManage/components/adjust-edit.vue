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
            <el-form-item label="选择排班" prop="scheduleId">
                <el-select
                    v-model="formData.scheduleId"
                    :disabled="readonly"
                    filterable
                    clearable
                    placeholder="请选择排班"
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
                    placeholder="请输入调班原因"
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
                    :data="formData.adjustList"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    :max-height="maxHeight"
                    class="adjust-table"
                    @selection-change="selection => handleSelectionChange(selection)"
                >
                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                    <el-table-column
                        prop="beforeDate"
                        label="调班日期"
                        width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-date-picker
                                v-model="scope.row.beforeDate"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                :disabled="readonly"
                                @change="handleDateChange($event, scope.$index, 'beforeShiftList')"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="beforeAdjust"
                        label="调班班次"
                        min-width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.beforeAdjust"
                                :disabled="readonly"
                                multiple
                                filterable
                                placeholder="请选择调班班次"
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
                        prop="party"
                        label="目标人员"
                        width="130"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.party"
                                :disabled="readonly"
                                filterable
                                placeholder="请选择目标人员"
                                @change="handlePartyChange($event, scope.row, scope.$index)"
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
                        <template slot-scope="scope">
                            <el-date-picker
                                v-model="scope.row.afterDate"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                :disabled="readonly"
                                @change="handleDateChange($event, scope.$index, 'afterShiftList')"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="afterAdjust"
                        label="目标班次"
                        min-width="150"
                        header-align="center"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.afterAdjust"
                                :disabled="readonly"
                                multiple
                                filterable
                                placeholder="请选择目标班次"
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
import { getAdjustment, saveAdjustment, queryStaffSchedule, getStaffSchedule } from '@/api/business/schedule'

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
            scheduleOptions: [],
            selectionIndex: [],
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success' },
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
        beforeShiftList () {
            return []
        },
        afterShiftList () {
            return []
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        }
    },
    mounted () {
        this.loadData()
    },
    methods: {
        // 获取数据
        async loadData () {
            const { id, scheduleId } = this.params || {}
            this.formData.scheduleId = scheduleId
            if (this.$utils.isEmpty(scheduleId)) {
                await this.getScheduleList()
            } else {
                await this.getScheduleInfo(scheduleId)
            }
            if (this.$utils.isEmpty(id)) {
                return
            }
            // 初始化表单数据的方法
            const initializeFormData = (data) => {
                const { scheduleId, reason, executor, executeDate, adjustmentDetailPoList } = data || {}
                this.formData = {
                    scheduleId,
                    reason,
                    adjustList: adjustmentDetailPoList.map((i, index) => ({
                        ...i,
                        beforeAdjust: i.beforeAdjust ? i.beforeAdjust.split(',') : [],
                        afterAdjust: i.afterAdjust ? i.afterAdjust.split(',') : [],
                        beforeShiftList: this.handleDateChange(i.beforeDate, index, 'beforeShiftList'),
                        afterShiftList: this.handleDateChange(i.afterDate, index, 'afterShiftList')
                    }))
                }
                console.log(this.formData)
            }
            this.loading = true
            try {
                const res = await getAdjustment({ id: this.params.id })
                console.log(res)
                if (res.data) {
                    initializeFormData(res.data)
                }
            } catch (error) {
                console.error('加载排班配置失败', error)
            } finally {
                this.loading = false
            }
        },
        getScheduleList () {
            const params = {
                parameters: [],
                requestPage: {
                    pageNo: 1,
                    limit: 99999
                },
                sorts: []
            }
            queryStaffSchedule(params).then(res => {
                this.scheduleList = res.data.dataResult
                this.scheduleOptions = this.scheduleList.map(s => ({
                    label: s.title,
                    value: s.id
                }))
            })
        },
        getScheduleInfo (id) {
            getStaffSchedule({ id }).then(res => {
                const { data } = res
                this.scheduleList = [data]
                const config = data.config ? JSON.parse(data.config) : {}
                this.scheduleInfo = {
                    startDate: data.startDate,
                    scheduleShift: config.scheduleShift,
                    scheduleStaff: this.userList.filter(u => config.scheduleStaff.includes(u.userId) && u.userId !== this.userId),
                    shiftList: data.staffScheduleDetailPoList
                }
                this.scheduleOptions = this.scheduleList.map(s => ({
                    label: s.title,
                    value: s.id
                }))
                console.log(this.scheduleInfo)
                this.handleScheduleChange(id)
            })
        },
        handleScheduleChange (val) {
            const schedule = this.scheduleList.find(i => i.id === val)
            if (this.$utils.isEmpty(schedule)) {
                return this.$message.error('数据有误！所选排班不存在！')
            }
            const config = schedule.config ? JSON.parse(schedule.config) : {}
            this.scheduleInfo = {
                startDate: schedule.startDate,
                scheduleShift: config.scheduleShift,
                scheduleStaff: this.userList.filter(u => config.scheduleStaff.includes(u.userId) && u.userId !== this.userId),
                shiftList: schedule.staffScheduleDetailPoList
            }
            this.currentShift = this.scheduleInfo.shiftList.find(s => s.userId === this.userId)
            if (!this.currentShift) {
                return this.$message.warning('所选排班中未含有您的信息，请重新选择！')
            }
            this.$set(this, 'pickerOptions', {
                disableDate: (time) => {
                    const startDate = new Date(schedule.startDate)
                    const endDate = new Date(schedule.endDate)
                    return time < startDate || time > endDate
                }
            })
            this.formData.adjustList = []
            // this.pickerOptions = {
            //     disableDate: (time) => {
            //         const startDate = new Date(schedule.startDate)
            //         const endDate = new Date(schedule.endDate)
            //         console.log('startDate:', startDate, 'endDate:', endDate, 'time:', time);
            //         return time < startDate || time > endDate
            //     }
            // }
        },
        getDays (start, end) {
            if (!start || !end) {
                return 0
            }
            return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
        },
        handleDateChange (val, index, type) {
            console.log(val, index, type)
            const typeMap = {
                beforeShiftList: this.currentShift,
                afterShiftList: this.targetShift
            }
            const shiftMap = {
                beforeShiftList: 'beforeAdjust',
                afterShiftList: 'afterAdjust'
            }
            if (!val) {
                // 清除日期时，同步清除班次及option
                this.formData.adjustList[index][type] = []
                this.formData.adjustList[index][shiftMap[type]] = []
                return
            }
            const { startDate, scheduleShift } = this.scheduleInfo
            // 获取所选日期对应数据
            const dayIndex = this.getDays(startDate, val)
            const shifts = typeMap[type][`d${dayIndex}`] ? typeMap[type][`d${dayIndex}`].split(',') : []
            const temp = scheduleShift.filter(i => shifts.includes(i.alias))
            console.log(this.formData.adjustList)
            this.formData.adjustList[index].recordId = this.currentShift.id
            this.formData.adjustList[index][type] = temp
        },
        handlePartyChange (val, row, index) {
            this.targetShift = this.scheduleInfo.shiftList.find(i => i.userId === val)
            this.handleDateChange(row.startDate, index, 'afterShiftList')
        },
        handleFormAction ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave()
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
        handleSave () {
            const getOverview = (data) => {
                const result = []
                data.forEach(i => {
                    const partyName = this.transformData(this.userList, i.party, 'userId', 'userName')
                    const beforeAdjust = i.beforeAdjust.map(item => `【${item}】`).join('')
                    const afterAdjust = i.afterAdjust.map(item => `【${item}】`).join('')
                    let desc = ''
                    if (i.party) {
                        desc = `${i.beforeDate}班次${beforeAdjust}与${partyName}${i.afterDate}班次${afterAdjust}调换`
                    } else {
                        desc = `${i.beforeDate}班次${beforeAdjust}调换到${i.afterDate}`
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
                // return
                const submitData = {
                    id: this.params.id,
                    pk: this.params.id,
                    scheduleId,
                    reason,
                    diDian: second || first,
                    overview: getOverview(adjustList),
                    status: adjustList.some(i => this.$utils.isNotEmpty(i.party)) ? '待审核' : '待审批',
                    adjustmentDetailPoList: adjustList.map(i => ({
                        recordId: i.recordId,
                        beforeDate: i.beforeDate,
                        beforeAdjust: i.beforeAdjust ? i.beforeAdjust.join(',') : '',
                        party: i.party,
                        status: i.party ? '待审核' : '待审批',
                        afterDate: i.afterDate,
                        afterAdjust: i.afterAdjust ? i.afterAdjust.join(',') : ''
                    }))
                }
                this.submitForm(submitData)
            })
        },
        // 提交数据
        submitForm (data) {
            saveAdjustment(data).then(res => {
                this.$message.success(`${this.params.action === 'edit' ? '保存' : '申请'}成功`)
                this.closeDialog()
                this.$emit('refresh')
            })
        },
        handleAddParam () {
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
        handleSelectionChange (v) {
            console.log(v)
            // this.selectionIndex = v.map(item => this.formData.indexOf(item))
        },
        handleRemove (removeIndex, type) {
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
                indexList.forEach(i => {
                    this.formData.splice(i, 1)
                })
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
