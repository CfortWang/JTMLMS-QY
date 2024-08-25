<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog schedule-edit-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <div slot="title" class="edit-dialog-header">
            <div class="title">{{ title }}</div>
            <div class="operate">
                <template v-for="btn in toolbars">
                    <el-button
                        v-if="!btn.hidden"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        @click="handleAction(btn.key)"
                    >
                        {{ btn.label }}
                    </el-button>
                </template>
            </div>
        </div>
        <el-steps :active="activeStep" finish-status="success" simple style="margin: 20px 0;">
            <el-step title="基础信息配置" />
            <el-step title="人员排班" />
            <el-step title="排班总览" />
        </el-steps>
        <el-form
            v-if="activeStep === 1"
            ref="form"
            :label-width="formLabelWidth"
            label-position="left"
            :model="formData"
            :rules="rules"
            class="schedule-form"
            @submit.native.prevent
        >
            <el-form-item label="排班名称" prop="title" required :show-message="false">
                <el-input
                    v-model="formData.title"
                    type="text"
                    clearable
                    show-word-limit
                    :maxlength="64"
                    :disabled="readonly"
                    placeholder="请输入排班名称"
                />
            </el-form-item>
            <el-row :gutter="20" class="form-row">
                <!-- <el-col :span="12">
                    <el-form-item label="排班周期" prop="cycle" required :show-message="false">
                        <el-select
                            v-model="formData.cycle"
                            :disabled="readonly"
                            placeholder="请选择排班周期"
                        >
                            <el-option
                                v-for="item in cycleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item prop="dateRange" required :show-message="false">
                        <template slot="label">
                            排班时间
                            <el-tooltip effect="dark" content="最多可支持45天内的排班" placement="top">
                                <i class="el-icon-question question-icon" />
                            </el-tooltip>
                        </template>
                        <el-date-picker
                            v-model="formData.dateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            unlink-panels
                            :picker-options="pickerOptions"
                            @change="handleDateChange"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排班配置" prop="config" required :show-message="false">
                        <el-select
                            v-model="formData.config"
                            :disabled="readonly"
                            filterable
                            placeholder="请选择排班配置"
                            @change="handleConfigChange"
                        >
                            <el-option-group
                                v-for="group in configOptions"
                                :key="group.label"
                                :label="group.label"
                            >
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.isEffective === 'N'"
                                />
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="排班人员" prop="scheduleStaff" required :show-message="false">
                <el-select
                    v-model="formData.scheduleStaff"
                    :disabled="readonly"
                    multiple
                    filterable
                    placeholder="请选择排班人员"
                >
                    <el-option
                        v-for="item in userList"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                    />
                </el-select>
            </el-form-item>
            <el-row :gutter="20" class="form-row">
                <el-col :span="24">
                    <el-form-item label="调班审批人" prop="approver" :show-message="false">
                        <el-select
                            v-model="formData.approver"
                            :disabled="readonly"
                            multiple
                            filterable
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in userList"
                                :key="item.userId"
                                :label="item.userName"
                                :value="item.userId"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-table
                ref="scheduleTable"
                :data="formData.scheduleShift"
                border
                stripe
                highlight-current-row
                style="width: 100%"
                :max-height="maxHeight"
                class="schedule-table"
            >
                <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                <el-table-column
                    v-for="(item, fIndex) in scheduleColumn"
                    :key="fIndex"
                    :prop="item.key"
                    :label="item.label"
                    :width="item.width"
                    :min-width="item.minWidth"
                    header-align="center"
                    align="center"
                >
                    <template slot-scope="scope">
                        <template v-if="item.key === 'dateRange'">
                            <div v-for="(d, di) in scope.row.dateRange" :key="di">
                                {{ d.type === 'allday' ? '全天' : (`当天 ${d.startTime}` + ' 至 ' + `${d.isSecondDay === 'Y' ? '第二天' : '当天'} ${d.endTime}`) }}
                            </div>
                        </template>
                        <div v-else-if="item.key === 'positions'">
                            <el-tag
                                v-for="(p, pi) in scope.row.positions"
                                :key="pi"
                                type="primary"
                                style="margin-left: 5px;"
                            >{{ p }}</el-tag>
                        </div>
                        <div v-else-if="item.key === 'isEnabled'">{{ scope.row.isEnabled === 'Y' ? '是' : '否' }}</div>
                        <div v-else-if="item.key === 'color'">
                            <div class="color-item" :style="`background-color: ${scope.row.color}; width: 20px; height: 20px; margin: 0 auto; border-radius: 2px;`" />
                        </div>
                        <div v-else>
                            <span>{{ scope.row[item.key] }}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div v-if="activeStep === 2" class="schedule-container">
            <div class="schedule-box">
                <div class="abscissa">
                    <div v-for="(month, mIndex) in Object.keys(dateObj)" :key="mIndex" class="abs-type">
                        <div class="month">{{ month }}</div>
                        <div class="abscissa-item">
                            <div v-for="(date, dIndex) in dateObj[month]" :key="dIndex">{{ date.split('-')[2] }}</div>
                        </div>
                    </div>
                </div>
                <div class="schedule-content">
                    <div class="ordinate">
                        <div v-for="item in ordinateList" :key="item.value" class="ordinate-item">
                            {{ item.label }}
                        </div>
                    </div>
                    <div class="shift-content">
                        <div v-for="(row, rIndex) in ordinateList" :key="row.value" class="shift-row">
                            <!-- <div v-for="(column, cIndex) in dateList" :key="cIndex" class="shift-column"> -->
                            <div
                                v-for="(column, cIndex) in dateList"
                                :key="cIndex"
                                ref="shiftItem"
                                class="shift-item"
                                @mouseenter="hoveredIndex = `${row.value}-${cIndex}`"
                                @mouseleave="hoveredIndex = null"
                                @contextmenu.prevent="handleRightClick($event, {row, rIndex, column, cIndex})"
                            >
                                <div
                                    v-for="(shift, sIndex) in scheduleData[row.value][cIndex]"
                                    :key="sIndex"
                                    class="shift"
                                    :style="{ color: `${shift.color}` }"
                                >
                                    {{ shift.alias }}
                                    <!-- <div :style="{ color: `${shift.color}` }">{{ shift.alias }}</div> -->
                                </div>
                                <div v-if="hoveredIndex === `${row.value}-${cIndex}` && !readonly" class="overlay">
                                    <i class="el-icon-edit" />
                                </div>
                            </div>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <context-menu
            :visible.sync="showContextMenu"
            :params="params"
            :shift-list="shiftList"
            :position="itemPosition"
            :item-data="selectItem"
            :readonly="readonly"
            @select="handleSelect"
            @close="handleClose"
        />
    </el-dialog>
</template>

<script>
import { cycleOptions, scheduleType, scheduleColumn } from '../../constants/schedule'
import { queryScheduleConfig } from '@/api/business/schedule'
import { mapValues, keyBy } from 'lodash'
import ActionUtils from '@/utils/action'

export default {
    name: 'schedule',
    components: {
        ContextMenu: () => import('./components/context-menu')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pageData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const readonly = false
        return {
            userList,
            deptList,
            cycleOptions,
            scheduleType,
            dialogVisible: this.visible,
            formLabelWidth: '120px',
            loading: false,
            activeStep: 1,
            formData: {
                title: '',
                dateRange: [],
                config: '',
                scheduleStaff: [],
                isApproval: 'Y',
                approver: [],
                scheduleShift: [],
                scheduleRule: []
            },
            rules: {},
            scheduleColumn,
            title: readonly ? '创建排班' : '编辑排班',
            configList: [],
            configOptions: [],
            maxHeight: '250px',
            toolbars: [
                { key: 'prev', icon: 'el-icon-d-arrow-left', label: '上一步', type: 'primary' },
                { key: 'next', icon: 'el-icon-d-arrow-right', label: '下一步', type: 'primary' },
                { key: 'changeView', icon: 'el-icon-set-up', label: '切换视图', type: 'primary' },
                { key: 'history', icon: 'el-icon-time', label: '排班历史', type: 'info' },
                { key: 'record', icon: 'el-icon-tickets', label: '修改记录', type: 'warning' },
                { key: 'export', icon: 'el-icon-download', label: '导出', type: 'primary', hidden: readonly },
                { key: 'reset', icon: 'el-icon-refresh', label: '重置', type: 'warning', hidden: readonly },
                { key: 'edit', icon: 'el-icon-edit', label: '编辑', type: 'primary', hidden: readonly },
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', hidden: readonly },
                { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'success', hidden: readonly },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            viewType: 'users',
            dateObj: {},
            dateList: [],
            showContextMenu: false,
            hoveredIndex: null,
            params: {},
            shiftList: [],
            selectItem: [],
            itemPosition: {},
            pickerOptions: {
                disabledDate: (time) => {
                    const { dateRange } = this.formData
                    if (!dateRange.length) {
                        return false
                    }
                    const startDate = dateRange[0]
                    const endDate = dateRange[1] || time
                    // 日期差超过45天则禁用
                    const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24)
                    return diffDays > 45 || diffDays < -45
                },
                onPick: ({ minDate, maxDate }) => {
                    if (minDate && !maxDate) {
                        this.pickerOptions.disabledDate = (time) => {
                            const dayDifference = (time - minDate) / (1000 * 60 * 60 * 24)
                            return dayDifference > 45 || dayDifference < -45
                        }
                    }
                }
            }
        }
    },
    computed: {
        ordinateList () {
            const { scheduleStaff } = this.formData
            return this.userList.filter(u => scheduleStaff.includes(u.userId)).map(u => ({
                label: u.userName,
                value: u.userId
            }))
        },
        scheduleData () {
            return mapValues(keyBy(this.ordinateList, 'value'), () => [])
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        loadData () {
            this.loading = true
            queryScheduleConfig({
                parameters: [],
                requestPage: {
                    pageNo: 1,
                    limit: 1000
                },
                sorts: []
            }).then(res => {
                const { dataResult } = res.data || {}
                this.configList = dataResult
                this.configOptions = this.transformData(dataResult)
                console.log(this.configOptions)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        transformData (data) {
            return data.reduce((acc, item) => {
                const { scheduleType } = item
                // 查找是否已存在对应的 scheduleType
                const scheduleInfo = this.scheduleType.find(i => i.value === scheduleType)
                const existingGroup = acc.find(group => group.labelKey === scheduleType)
                if (existingGroup) {
                    // 如果存在，添加当前项到 options
                    existingGroup.options.push({
                        ...item,
                        value: item.id,
                        label: item.name || `占位信息${item.isEffective === 'N' ? '（未启用）' : ''}`
                    })
                } else {
                    // 如果不存在，创建新的分组
                    acc.push({
                        labelKey: scheduleType,
                        label: scheduleInfo.label,
                        options: [{
                            ...item,
                            value: item.id,
                            label: item.name || `占位信息${item.isEffective === 'N' ? '（未启用）' : ''}`
                        }]
                    })
                }
                return acc
            }, [])
        },
        handleConfigChange (val) {
            const temp = this.configList.find(i => i.id === val)
            // console.log(temp)
            this.formData = {
                ...this.formData,
                approver: temp.approver ? temp.approver.split(',') : [],
                scheduleType,
                isApproval: temp.isApproval,
                scheduleRule: temp.scheduleRule ? JSON.parse(temp.scheduleRule) : [],
                scheduleShift: temp.scheduleShift ? JSON.parse(temp.scheduleShift) : [],
                scheduleStaff: temp.scheduleStaff ? JSON.parse(temp.scheduleStaff) : []
            }
            this.shiftList = this.formData.scheduleShift.filter(s => s.isEnabled === 'Y').map(s => ({
                ...s,
                positions: s.positions.join('，'),
                dateRange: s.dateRange.map(d => {
                    return d.type === 'allday' ? '全天' : (`当天 ${d.startTime}` + ' 至 ' + `${d.isSecondDay === 'Y' ? '第二天' : '当天'} ${d.endTime}`)
                })
            }))
        },
        handleDateChange (dates) {
            if (this.$utils.isEmpty(dates)) {
                this.pickerOptions.disabledDate = (time) => {
                    return false
                }
            }
        },
        getDateList (dateRange) {
            const [startDate, endDate] = dateRange.map(date => new Date(date))
            const dates = {}
            const currentDate = startDate
            // eslint-disable-next-line no-unmodified-loop-condition
            while (currentDate <= endDate) {
                const yearMonth = currentDate.toISOString().slice(0, 7) // 获取 'YYYY-MM' 格式
                const date = currentDate.toISOString().split('T')[0] // 获取 'YYYY-MM-DD' 格式
                if (!dates[yearMonth]) {
                    dates[yearMonth] = []
                }
                dates[yearMonth].push(date)
                currentDate.setDate(currentDate.getDate() + 1)
            }
            return dates
        },
        changeView () {
            console.log('changeView')
        },
        handleRightClick (event, { row, colunm, rIndex, cIndex }) {
            this.selectItem = []
            this.showContextMenu = true
            const item = this.$refs.shiftItem[rIndex * this.dateList.length + cIndex + 1]
            const rect = item.getBoundingClientRect()
            console.log(rect.top + window.scrollY, rect.left + window.scrollX)
            this.itemPosition = {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX
            }
            this.params = {
                row,
                rIndex,
                colunm,
                cIndex
            }
            console.log(this.itemPosition)
            this.selectItem = this.scheduleData[row.value][cIndex]
            console.log(this.selectItem)
        },
        handleSelect ({ selected, params }) {
            this.scheduleData[params.row.value][params.cIndex] = selected
        },
        handleClose () {
            this.showContextMenu = false
        },
        handleAction (action) {
            switch (action) {
                case 'prev':
                    this.handleStepChange(-1)
                    break
                case 'next':
                    this.handleStepChange(1)
                    break
                case 'save':
                    this.$emit('save')
                    break
                case 'submit':
                    this.$emit('submit')
                    break
                case 'changeView':
                    this.changeView()
                    break
                case 'history':
                    this.$emit('history')
                    break
                case 'record':
                    this.$emit('record')
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleStepChange (val) {
            if (this.activeStep === 1 && val) {
                const valid = this.validateForm()
                if (!valid) {
                    this.$message.warning('请完善必填信息后再操作！')
                    return
                }
                this.dateObj = this.getDateList(this.formData.dateRange)
                this.dateList = Object.values(this.dateObj).flat()
            }
            this.activeStep += val
        },
        validateForm () {
            const { scheduleRule, approver, ...rest } = this.formData
            const result = Object.keys(rest).some(k => this.$utils.isEmpty(rest[k]))
            return !result
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule-edit-dialog {
    width: 100%;
    ::v-deep {
        .el-dialog__header {
            padding: 15px 20px 16px;
        }
        .el-dialog__footer {
            display: none;
        }
    }
    .edit-dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
            line-height: 24px;
            font-size: 18px;
            color: #303133;
        }
    }
    .schedule-form {
        width: 1080px;
        height: 600px;
        margin: 20px auto;
        ::v-deep {
            .el-form-item {
                margin-bottom: 16px !important;
            }
            .el-input, .el-select, .el-input-number, .el-range-editor {
                width: 100%;
            }
        }
    }
    .schedule-container {
        width: 100%;
        ::v-deep {
            .el-button > span {
                margin-left: 5px;
            }
        }
        .page-header {
            padding: 20px;
            height: 80px;
            .toolbar {
                text-align: right;
            }
            .page-title {
                margin-top: 20px;
                font-size: 24px;
                font-weight: 600;
                text-align: center;
            }
        }
        .schedule-box {
            width: auto;
            overflow-x: auto;
            font-size: 14px;
            position: relative;
            .abscissa {
                // width: 100%;
                margin: 0 20px 0 110px;
                display: flex;
                .abs-type {
                    .month {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        height: 29px;
                        border: 1px solid #ccc;
                        border-bottom: none;
                        border-right: none;
                    }
                    .abscissa-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        > div {
                            width: 59px;
                            height: 28px;
                            line-height: 30px;
                            text-align: center;
                            border: 1px solid #ccc;
                            border-right: none;
                        }
                    }
                    &:last-child {
                        .month {
                            border-right: 1px solid #ccc;
                        }
                        .abscissa-item > div {
                            &:last-child {
                                border-right: 1px solid #ccc;
                            }
                        }
                    }
                }
            }
            .schedule-content {
                height: calc(100vh - 245px);
                margin: 10px 0 20px 10px;
                position: relative;
                display: flex;
                float: left;
                overflow-y: auto;
                white-space: nowrap;
                .ordinate {
                    width: 80px;
                    padding: 0 10px;
                    height: 100%;
                    position: sticky;
                    left: 0;
                    // background-color: #f0f0f0;
                    display: flex;
                    flex-shrink: 0;
                    flex-direction: column;
                    .ordinate-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        height: 60px;
                        flex-shrink: 0;
                    }
                }
                .shift-content {
                    flex: 1;
                    margin-right: 20px;
                    .shift-row {
                        display: flex;
                        .shift-item {
                            position: relative;
                            width: 59px;
                            height: 59px;
                            font-size: 14px;
                            border: 1px solid #ccc;
                            border-bottom: none;
                            border-right: none;
                            cursor: context-menu;

                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            .shift {
                                text-align: center;
                            }

                            &:has(.shift:nth-child(2)) {
                                flex-direction: column;
                            }

                            // 当有三个或四个子元素时使用网格布局
                            &:has(.shift:nth-child(3)) {
                                flex-direction: column;
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 1px;
                            }
                            &:has(.shift:nth-child(odd)) {
                                .shift:last-of-type {
                                    grid-column: span 2;
                                    justify-self: center;
                                }
                            }
                            .shift:only-child {
                                margin-left: 0;
                            }
                            &:last-child {
                                border-right: 1px solid #ccc;
                            }
                            .overlay {
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: rgba(0, 0, 0, 0.3); /* 半透明遮罩 */
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                color: white;
                            }
                            // .shift-item {
                            //     width: 100%;
                            //     height: 100%;
                            //     font-size: 14px;
                            //     .shift:last-child {
                            //         margin-left: 5px;
                            //     }
                            //     .shift:only-child {
                            //         margin-left: 0;
                            //     }
                            // }
                        }
                        &:last-of-type {
                            .shift-item {
                                border-bottom: 1px solid #ccc;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
