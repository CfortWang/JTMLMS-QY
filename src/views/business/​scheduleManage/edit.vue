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
        @scroll="handleScroll"
        @open="loadData"
        @close="closeDialog"
    >
        <div slot="title" class="edit-dialog-header">
            <div class="title">{{ title }}</div>
            <div class="operate">
                <template v-for="btn in toolbars">
                    <el-button
                        v-if="btn.show && (!btn.steps || btn.steps.includes(activeStep)) "
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
                            :disabled="readonly"
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
        <div v-if="activeStep === 2" ref="scheduleContainer" class="schedule-container">
            <div ref="schedule" class="schedule-box">
                <div ref="scrollTarget" class="abscissa" :style="{ left: leftOffset + 'px' }">
                    <div v-for="(month, mIndex) in Object.keys(dateObj)" :key="mIndex" class="abs-type">
                        <div class="month">{{ month }}</div>
                        <div class="abscissa-item">
                            <div
                                v-for="(date, dIndex) in dateObj[month]"
                                :ref="`day${dIndex}`"
                                :key="dIndex"
                                class="date"
                                @click="!readonly && showShiftSetting($event, date)"
                            >{{ date.split('-')[2] }}</div>
                        </div>
                    </div>
                </div>
                <el-popover
                    ref="popover"
                    trigger="manual"
                    placement="bottom"
                    width="255"
                    title=""
                    :reference="popoverReference"
                >
                    <el-form
                        ref="popover-form"
                        label-width="80px"
                        label-position="right"
                        :model="shiftForm"
                        size="mini"
                        class="popover-form"
                        @submit.native.prevent
                    >
                        <el-form-item label="选择操作">
                            <el-radio-group v-model="shiftForm.operateType">
                                <el-tooltip effect="dark" content="将该列排班数据复制到指定的一个或多个日期" placement="left">
                                    <el-radio-button label="copy">复制</el-radio-button>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="将该列排班数据按指定间隔向后覆盖" placement="right">
                                    <el-radio-button label="cycle">循环</el-radio-button>
                                </el-tooltip>
                            </el-radio-group>
                        </el-form-item>
                        <!-- <el-form-item label="覆盖方式">
                            <el-radio-group v-model="shiftForm.pasteType">
                                <el-tooltip effect="dark" content="无视已有数据，完全覆盖" placement="top">
                                    <el-radio-button label="all">全覆盖</el-radio-button>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="仅覆盖目标列的空值" placement="top">
                                    <el-radio-button label="empty">空值覆盖</el-radio-button>
                                </el-tooltip>
                            </el-radio-group>
                        </el-form-item> -->
                        <el-form-item v-if="shiftForm.operateType === 'copy'" label="覆盖日期">
                            <el-select
                                v-model="shiftForm.dates"
                                filterable
                                width="100%"
                                clearable
                                multiple
                                collapse-tags
                                :multiple-limit="10"
                                placeholder="请选择需覆盖的日期"
                            >
                                <el-option
                                    v-for="(item, index) in dateList"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-else label="覆盖间隔">
                            <el-input-number
                                v-model="shiftForm.cycle"
                                type="number"
                                :min="0"
                                :max="10"
                            />
                        </el-form-item>
                        <div style="text-align: right; margin: 0">
                            <el-tooltip effect="dark" content="仅覆盖目标列的空值" placement="bottom">
                                <el-button type="primary" size="mini" plain @click="handleShiftSetting('empty')">覆盖空值</el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="无视目标列已有数据，完全覆盖" placement="bottom">
                                <el-button type="warning" size="mini" plain @click="handleShiftSetting('all')">覆盖全部</el-button>
                            </el-tooltip>
                            <el-button size="mini" plain @click="resetShiftSetting">取消</el-button>
                        </div>
                    </el-form>
                </el-popover>
                <div ref="scheduleContent" class="schedule-content">
                    <div ref="sidebar" class="ordinate" :style="{ top: topOffset + 'px' }">
                        <div
                            v-for="item in ordinateList"
                            :key="item.value"
                            class="ordinate-item"
                            :style="{ color: viewType === 'users' ? '#606266' : `${item.color}`}"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                    <div class="shift-content">
                        <div v-for="(row, rIndex) in ordinateList" :key="row.value" class="shift-row">
                            <!-- <div v-for="(column, cIndex) in dateList" :key="cIndex" class="shift-column"> -->
                            <!-- @contextmenu.prevent="handleRightClick($event, {row, rIndex, column, cIndex})" -->
                            <div
                                v-for="(column, cIndex) in dateList"
                                :key="cIndex"
                                ref="shiftItem"
                                class="shift-item"
                                :style="{ display: viewType === 'users' ? 'grid' : 'flex'}"
                                @mouseenter=" hoveredIndex = !readonly && `${row.value}-${cIndex}`"
                                @mouseleave=" hoveredIndex = !readonly && null"
                                @click.prevent="!readonly && handleShiftClick($event, {row, rIndex, column, cIndex})"
                            >
                                <div
                                    v-for="(shift, sIndex) in scheduleData[row.value][cIndex]"
                                    :key="sIndex"
                                    class="shift"
                                    :style="{ color: viewType === 'users' ? `${shift.color}` : `${ordinateList[rIndex].color}`}"
                                >
                                    {{ viewType === 'users'? shift.alias : shift.userName }}
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
        <div v-if="activeStep === 3" class="stat">
            <statistic
                :schedule-data="scheduleData"
                :date-list="dateList"
                :user-list="ordinateList"
                @close="handleClose"
            />
        </div>
        <context-menu
            :viewType="viewType"
            :visible.sync="contextMenuVisible"
            :params="shiftParams"
            :shift-list="viewType === 'users' ? shiftList : userNameList"
            :position="itemPosition"
            :item-data="selectItem"
            :readonly="readonly"
            @select="handleSelect"
            @close="handleClose"
        />
        <history
            :visible.sync="historyVisible"
            @close="v => historyVisible = v"
        />
        <record
            :visible.sync="recordVisible"
            :schedule-id="pageParams.id"
            @close="v => recordVisible = v"
        />
    </el-dialog>
</template>

<script>
import { cycleOptions, scheduleType, scheduleColumn } from '../../constants/schedule'
import { queryScheduleConfig, getStaffSchedule, saveStaffSchedule, saveAdjustment } from '@/api/business/schedule'
import request from '@/utils/request'
import { SYSTEM_URL } from '@/api/baseUrl'
import { previewFile } from '@/api/platform/file/attachment'
import { mapValues, keyBy } from 'lodash'
import html2canvas from 'html2canvas'
import ActionUtils from '@/utils/action'
import Json from '@/business/platform/serv/components/json.vue'
import color from '@/store/modules/ibps/modules/color'
import height from '@/mixins/height'
import { reset } from '@/api/platform/auth/client'

export default {
    name: 'schedule',
    components: {
        ContextMenu: () => import('./components/context-menu'),
        Statistic: () => import('./components/statistic'),
        History: () => import('./components/history'),
        Record: () => import('./components/record')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pageParams: {
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
            title: this.readonly ? '创建排班' : '编辑排班',
            configList: [],
            configOptions: [],
            maxHeight: '250px',
            toolbars: [
                { key: 'prev', icon: 'el-icon-d-arrow-left', label: '上一步', type: 'primary', steps: '2,3', show: true },
                { key: 'next', icon: 'el-icon-d-arrow-right', label: '下一步', type: 'primary', steps: '1,2', show: true },
                { key: 'changeView', icon: 'el-icon-set-up', label: '切换视图', type: 'primary', steps: '2', show: true },
                // { key: 'history', icon: 'el-icon-time', label: '排班历史', type: 'info', steps: '2,3' },
                { key: 'record', icon: 'el-icon-tickets', label: '修改记录', type: 'warning', steps: '2,3', show: true },
                { key: 'export', icon: 'el-icon-download', label: '导出', type: 'primary', steps: '2,3', show: true },
                { key: 'reset', icon: 'el-icon-refresh', label: '重置', type: 'warning', steps: '2', show: (!this.readonly) },
                // { key: 'edit', icon: 'el-icon-edit', label: '编辑', type: 'primary', steps: '2,3' },
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', show: (!this.readonly) },
                { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'success', steps: '3', show: (!this.readonly) },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger', show: true }
            ],
            viewType: 'users',
            scheduleData: {},
            responseData: {},
            userNameList: [],
            scheduleRecord: [],
            leftOffset: '',
            topOffset: '',
            topFixed: false,
            leftFixed: false,
            dateObj: {},
            dateList: [],
            contextMenuVisible: false,
            historyVisible: false,
            recordVisible: false,
            popoverReference: null,
            hoveredIndex: null,
            shiftParams: {},
            shiftList: [],
            selectItem: [],
            itemPosition: {},
            shiftForm: {
                operateType: 'copy',
                pasteType: 'all'
            },
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
            if (this.viewType === 'users') {
                const { scheduleStaff } = this.formData
                return this.userList.filter(u => scheduleStaff.includes(u.userId)).map(u => ({
                    label: u.userName,
                    value: u.userId
                }))
            } else {
                return this.formData.scheduleShift.map(s => ({
                    label: s.name,
                    value: s.alias,
                    color: s.color
                }))
            }
        }
        // scheduleData () {
        //     return mapValues(keyBy(this.ordinateList, 'value'), () => Array.from({ length: this.dateList.length }, () => []))
        // }
    },
    created () {
        this.loadData()
    },
    mounted () {
        this.handleListener('addEventListener')
    },
    beforeDestroy () {
        this.handleListener('removeEventListener')
    },
    methods: {
        handleListener (event) {
            setTimeout(() => {
                const scrollContainer = this.$refs.scheduleContainer
                if (scrollContainer) {
                    scrollContainer[event]('scroll', this.handleScroll)
                    console.log(scrollContainer)
                }
            }, 10)
        },
        handleScroll () {
            const scrollTarget = this.$refs.scrollTarget
            const sidebar = this.$refs.sidebar
            const scrollContainer = this.$refs.scheduleContainer
            const scheduleContent = this.$refs.scheduleContent
            let defaultTopOffset = 0

            if (scrollContainer.scrollTop > 80) {
                this.topFixed = true
                scrollTarget.classList.add('stickyTop')
                scheduleContent.style.paddingTop = '100px'
                defaultTopOffset = 130
                this.leftOffset = -scrollContainer.scrollLeft
                // this.leftOffset = -scrollContainer.scrollLeft + (this.leftFixed ? 100 : 0)
            } else {
                this.topFixed = false
                scrollTarget.classList.remove('stickyTop')
                this.leftOffset = 0
                defaultTopOffset = 206
                scheduleContent.style.paddingTop = '0px'
            }
            // // 处理左侧元素的固定
            // if (scrollContainer.scrollLeft > 40) {
            //     this.leftFixed = true
            //     sidebar.classList.add('stickyLeft')
            //     this.topOffset = defaultTopOffset - scrollContainer.scrollTop
            //     scheduleContent.style.paddingLeft = '100px'
            // } else {
            //     this.leftFixed = false
            //     sidebar.classList.remove('stickyLeft')
            //     scheduleContent.style.paddingLeft = '0px'
            // }
        },
        loadData () {
            this.loading = true
            // 获取配置数据
            queryScheduleConfig({
                parameters: [],
                requestPage: {
                    pageNo: 1,
                    limit: 1000
                },
                sorts: []
            }).then(async res => {
                const { dataResult } = res.data || {}
                this.configList = dataResult
                this.configOptions = this.transformConfigData(dataResult)
                // console.log(this.configOptions)
                if (this.$utils.isEmpty(this.pageParams.id)) {
                    this.loading = false
                    return
                }
                const response = await getStaffSchedule({ id: this.pageParams.id })
                const { staffScheduleDetailPoList: records, title, endDate, startDate, type, overview, config, status } = response.data
                const temp = config ? JSON.parse(config) : {}
                this.responseData = response.data
                console.log('responseData:', response.data)
                console.log('configData:', temp)
                this.formData = {
                    title,
                    status,
                    config: temp.id,
                    dateRange: [startDate, endDate],
                    approver: temp.approver || [],
                    overview: overview,
                    scheduleType: type,
                    scheduleRule: temp.scheduleRule || [],
                    scheduleShift: temp.scheduleShift || [],
                    scheduleStaff: temp.scheduleStaff || []
                }
                this.shiftList = this.formData.scheduleShift.filter(s => s.isEnabled === 'Y').map(s => ({
                    ...s,
                    positions: s.positions.join('，'),
                    dateRange: s.dateRange.map(d => {
                        return d.type === 'allday' ? '全天' : (`当天 ${d.startTime}` + ' 至 ' + `${d.isSecondDay === 'Y' ? '第二天' : '当天'} ${d.endTime}`)
                    })
                }))
                console.log('formData', this.formData)
                this.scheduleData = this.transformScheduleData(records, overview, temp)
                this.responseData = { ...this.responseData, records, overview, temp }
                console.log('scheduleData', this.scheduleData)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        transformConfigData (data) {
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
                        label: `${item.name}${item.isEffective === 'N' ? '（未启用）' : ''}`
                    })
                } else {
                    // 如果不存在，创建新的分组
                    acc.push({
                        labelKey: scheduleType,
                        label: scheduleInfo.label,
                        options: [{
                            ...item,
                            value: item.id,
                            label: `${item.name}${item.isEffective === 'N' ? '（未启用）' : ''}`
                        }]
                    })
                }
                return acc
            }, [])
        },
        transformScheduleData (records, overview, { scheduleShift }) {
            const result = {}
            const temp = overview ? JSON.parse(overview) : {}
            records.forEach(({ id, userId, ...days }) => {
                result[userId] = []
                for (let day = 1; day <= temp.dateCount; day++) {
                    const shifts = days[`d${day}`] ? days[`d${day}`].split(',') : []
                    const formattedShifts = shifts.map(shift => {
                        const temp = scheduleShift.find(s => s.alias === shift)
                        return temp || {}
                    })
                    result[userId].push(formattedShifts)
                }
                this.scheduleRecord.push({ userId, id })
            })
            return result
        },
        /* 切换ScheduleData为人员排班数据格式(人员排班->班次排班)
         */
        transformScheduleDataForShiftsView (data, userList, scheduleShift, overview) {
            const result = []
            const temp = overview ? JSON.parse(overview) : {}
            // 先创建以排班班次为键的空二维数组
            scheduleShift.forEach(shift => {
                result[shift.alias] = Array.from({ length: temp.dateCount || this.dateList.length }, () => [])
            })
            // 再次遍历用户列表，填充每个排班班次对应的用户信息
            userList.forEach(({ userId, userName }) => {
                data[userId].forEach((day, dayIndex) => {
                    day.forEach(({ alias }) => {
                        if (!result[alias][dayIndex]) {
                            result[alias][dayIndex] = []
                        }
                        result[alias][dayIndex].push({
                            userId,
                            userName
                        })
                    })
                })
            })
            return result
        },
        /* 复原ScheduleData为人员排班数据格式(班次排班->人员排班)
        */
        reverseForScheduleData (data, userList, scheduleShift, overview) {
            const result = {}
            // 先创建以userId为键的空二维数组
            const temp = overview ? JSON.parse(overview) : {}
            userList.forEach(({ userId }) => {
                result[userId] = Array.from({ length: temp.dateCount || this.dateList.length }, () => [])
            })
            const scheduleShiftMap = scheduleShift.reduce((acc, item) => {
                acc[item.alias] = item
                return acc
            }, {})

            // 遍历转换后的数据格式中的每个排班班次
            Object.keys(data).forEach(alias => {
                const days = data[alias]
                const aliasData = scheduleShiftMap[alias]
                // 遍历每一天的数据
                days.forEach((users, dayIndex) => {
                    // 遍历当天该班次上的每个用户
                    users.forEach(({ userId }) => {
                        // 将当天该用户在该班次的信息添加到对应的用户数据中
                        if (!result[userId][dayIndex]) {
                            result[userId][dayIndex] = []
                        }
                        result[userId][dayIndex].push(aliasData)
                    })
                })
            })

            return result
        },
        handleConfigChange (val) {
            const temp = this.configList.find(i => i.id === val)
            this.formData = {
                ...this.formData,
                approver: temp.approver ? temp.approver.split(',') : [],
                scheduleType: temp.scheduleType,
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
            if (this.userNameList.length < 1) {
                this.userNameList = this.ordinateList.map(item => ({ // 存起user对应id和name
                    userName: item.label,
                    userId: item.value
                }))
            }
            // 关闭可能存在的弹出框（如果有的话），确保视图切换时界面整洁
            this.$refs.popover.showPopper = false
            this.handleClose()
            // 判断当前视图类型，如果是'users'则切换为'shifts'，如果是'shifts'则切换为'users'
            this.viewType = this.viewType === 'users' ? 'shifts' : 'users'
            // 重新计算scheduleData的结构以适应新视图
            if (this.viewType === 'users') {
                this.scheduleData = this.reverseForScheduleData(this.scheduleData, this.userNameList, this.formData.scheduleShift, this.formData.overview)
            } else {
                this.scheduleData = this.transformScheduleDataForShiftsView(this.scheduleData, this.userNameList, this.formData.scheduleShift, this.formData.overview)
            }
            console.log('changeView', this.scheduleData)
        },
        handleShiftClick (event, { row, rIndex, column, cIndex }) {
            this.selectItem = []
            const item = this.$refs.shiftItem[rIndex * this.dateList.length + cIndex]
            const rect = item.getBoundingClientRect()
            // 计算弹出菜单的位置
            let top = rect.top + window.scrollY
            let left = rect.left + window.scrollX + rect.width

            // 获取窗口的宽度和高度
            const windowWidth = window.innerWidth
            const windowHeight = window.innerHeight
            const menuWidth = 126
            const menuHeight = 240

            // 检查右侧边界，如果超出右边界，调整到左侧
            if (left + menuWidth > windowWidth) {
                left = rect.left + window.scrollX - menuWidth
            }

            // 检查底部边界，如果超出底部边界，调整到顶部
            if (top + menuHeight > windowHeight) {
                top = rect.top + window.scrollY - menuHeight
            }
            this.itemPosition = { top, left }
            this.shiftParams = {
                row,
                rIndex,
                column,
                cIndex
            }
            this.selectItem = this.scheduleData[row.value][cIndex]
            this.contextMenuVisible = true
        },
        handleSelect ({ selected, params }) {
            this.scheduleData[params.row.value][params.cIndex] = selected
        },
        handleClose () {
            this.contextMenuVisible = false
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
                    this.handleSave()
                    break
                case 'submit':
                    this.handleSave('submit')
                    break
                case 'changeView':
                    this.changeView()
                    break
                case 'history':
                    this.historyVisible = true
                    break
                case 'export':
                    this.handleExport()
                    break
                case 'record':
                    this.recordVisible = true
                    break
                case 'reset':
                    this.handleReset()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleStepChange (val) {
            this.handleClose()
            if (this.activeStep === 1 && val) {
                const valid = this.validateForm()
                if (!valid) {
                    this.$message.warning('请完善必填信息后再操作！')
                    return
                }
                this.dateObj = this.getDateList(this.formData.dateRange)
                this.dateList = Object.values(this.dateObj).flat()
                if (!this.pageParams.id) {
                    this.scheduleData = mapValues(keyBy(this.ordinateList, 'value'), () => Array.from({ length: this.dateList.length }, () => []))
                } else {
                    this.updateScheduleData()
                }
            }
            if (this.activeStep === 2 && this.viewType === 'shifts') { // 班次排班需还原数据
                if (val > 0) {
                    this.changeView() // 切换为人员排班
                }
            }
            this.handleListener('addEventListener')
            this.activeStep += val
        },
        /**
         * 更新排班数据
         * 1. 获取当前的 ordinateList 的 value 列表
         * 2. 删除 this.scheduleData 中不在 newOrdinateValues 里的项
         * 3. 确保 this.scheduleData 包含所有 newOrdinateValues 的项
         * 4. 更新数组长度
         */
        updateScheduleData () {
            const newOrdinateValues = this.ordinateList.map(ordinate => ordinate.value)

            Object.keys(this.scheduleData).forEach(key => {
                if (!newOrdinateValues.includes(key)) {
                    delete this.scheduleData[key]
                }
            })

            newOrdinateValues.forEach(key => {
                if (!this.scheduleData[key]) {
                    this.scheduleData[key] = Array.from({ length: this.dateList.length }, () => [])
                }
            })

            Object.keys(this.scheduleData).forEach(key => {
                const scheduleArray = this.scheduleData[key]
                const newLength = this.dateList.length
                if (scheduleArray.length < newLength) {
                    // 如果当前长度小于新的长度，添加新的空数组
                    for (let i = scheduleArray.length; i < newLength; i++) {
                        scheduleArray.push([])
                    }
                } else if (scheduleArray.length > newLength) {
                    // 如果当前长度大于新的长度，裁剪数组
                    scheduleArray.length = newLength
                }
            })
        },
        validateForm () {
            const { scheduleRule, approver, status, ...rest } = this.formData
            const result = Object.keys(rest).some(k => this.$utils.isEmpty(rest[k]))
            return !result
        },
        // dealData (data) {
        //     const result = Object.entries(data).map(([userId, days]) => {
        //         const userObj = { userId }
        //         days.forEach((day, index) => {
        //             // userObj[`d${index + 1}`] = day.map(({ dateRange, name, alias }) => ({ dateRange, name, alias })) || []
        //             userObj[`d${index + 1}`] = day.map(({ alias }) => alias).join(',') || ''
        //         })
        //         return userObj
        //     })
        //     return result
        // },
        dealData (data) {
            if (this.viewType === 'shifts') { // 班次排班需还原数据
                data = this.reverseForScheduleData(this.scheduleData, this.userNameList, this.formData.scheduleShift, this.formData.overview)
            }
            var dateCount = 0
            const result = Object.entries(data).map(([userId, days]) => {
                const userObj = { userId, statistics: {}}
                const temp = this.scheduleRecord.find(i => i.userId === userId)
                const recordId = temp ? temp.id : ''
                dateCount = days.length
                days.forEach((day, index) => {
                    const shifts = day.map(({ alias }) => alias).join(',') || ''
                    userObj[`d${index + 1}`] = shifts

                    // 统计每个alias出现的次数
                    day.forEach(({ alias }) => {
                        if (userObj.statistics[alias]) {
                            userObj.statistics[alias]++
                        } else {
                            userObj.statistics[alias] = 1
                        }
                    })
                })

                return {
                    ...userObj,
                    id: recordId,
                    pk: recordId,
                    statistics: JSON.stringify(userObj.statistics)
                }
            })

            console.log(result)

            // 统计所有userId中各个alias的平均出现次数
            const total = {}
            const userCount = result.length

            result.forEach(user => {
                Object.entries(JSON.parse(user.statistics)).forEach(([alias, count]) => {
                    if (total[alias]) {
                        total[alias] += count
                    } else {
                        total[alias] = count
                    }
                })
            })
            const avg = {}
            Object.entries(total).forEach(([alias, totalCount]) => {
                avg[alias] = totalCount / userCount
            })
            const overview = {
                avg,
                total,
                userCount,
                dateCount
            }
            return { staffScheduleDetailPoList: result, overview }
        },
        handleSave (type) {
            const { staffScheduleDetailPoList, overview } = this.dealData(this.scheduleData) || {}
            const { dateRange, title, config, approver, scheduleType, status, scheduleShift, scheduleStaff, scheduleRule } = this.formData
            const configData = {
                id: config,
                approver,
                scheduleShift,
                scheduleStaff,
                scheduleRule
            }
            const submitData = {
                id: this.pageParams.id,
                pk: this.pageParams.id,
                title,
                status: type ? '已发布' : (status || '未发布'),
                startDate: dateRange[0],
                endDate: dateRange[1],
                type: scheduleType,
                config: JSON.stringify(configData),
                overview: JSON.stringify(overview),
                staffScheduleDetailPoList
            }
            console.log(submitData)
            this.loading = true
            saveStaffSchedule(submitData).then(() => {
                this.$message.success('保存成功')
                if (type) {
                    this.handleSaveNews()
                } else {
                    this.loading = false
                    this.closeDialog()
                    this.$emit('callback')
                }
                // 增加一条调班申请记录，用于查看排班管理员修改历史。
                this.submitAdjust(submitData)
            }).catch(() => {
                this.loading = false
            })
        },
        handleSaveNews () {
            this.activeStep = 2
            this.$nextTick(async () => {
                const element = this.$refs.schedule
                console.log(element)
                const fileId = await this.captureAndUpload(element)
                const fileUrl = await previewFile(fileId)
                const { userId, name } = this.$store.getters
                const { first, second } = this.$store.getters.level
                const { title, dateRange } = this.formData
                const news = {
                    author: name,
                    content: `<img src="${fileUrl}" title="${title}.png" alt="image.png"/>`,
                    depId: '',
                    depName: '',
                    fileAttach: '',
                    includeChild: 'N',
                    // 发布时间
                    publicDate: this.$common.getDateNow(19),
                    // 失效时间
                    loseDate: dateRange[1] + ' 23:59:59',
                    public0: 'Y',
                    publicItem: 'notices',
                    status: 'publish',
                    title: title,
                    type: second || first,
                    userId: userId,
                    userName: name
                }
                this.$common.saveNews(news).then(() => {
                    this.loading = false
                    this.closeDialog()
                    this.$emit('callback')
                })
            })
        },
        captureAndUpload (element) {
            const uploadImage = (blob) => {
                return new Promise((resolve, reject) => {
                    const data = new FormData() // 创建form对象
                    data.append('file', blob, `${this.formData.title}.png`)
                    request({
                        url: SYSTEM_URL() + '/file/upload',
                        method: 'post',
                        isLoading: true,
                        gateway: true,
                        data
                    }).then(res => {
                        resolve(res.data.id || '')
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
            const canvasToBlob = (canvas) => {
                return new Promise(resolve => {
                    canvas.toBlob(blob => {
                        resolve(blob)
                    }, 'image/png', 1.0)
                })
            }
            return new Promise((resolve, reject) => {
                html2canvas(element).then(canvas => {
                    canvasToBlob(canvas).then(blob => {
                        uploadImage(blob).then(fileId => {
                            resolve(fileId)
                        })
                    })
                })
            })
        },
        async handleExport () {
            const element = this.$refs.schedule
            // 使用 html2canvas 渲染 DOM 元素
            html2canvas(element, {
                scrollX: 0,
                scrollY: -10,
                width: element.scrollWidth,
                height: element.scrollHeight
            }).then(canvas => {
                const link = document.createElement('a')
                link.href = canvas.toDataURL('image/png')
                link.download = `${this.formData.title || '排班'}.png`
                link.click()
            }).catch(err => {
                console.error('导出失败', err)
            })
        },
        handleReset () {
            this.$confirm('<p style="font-size: 18px;">重置后当前排班的信息将会清空，您确定要执行该操作吗？</p>', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                dangerouslyUseHTMLString: true
            }).then(() => {
                this.scheduleData = mapValues(keyBy(this.ordinateList, 'value'), () => Array.from({ length: this.dateList.length }, () => []))
            }).catch(() => {
                // nothing
            })
        },
        showShiftSetting (e, date) {
            this.resetShiftSetting()
            this.shiftForm.current = date
            this.popoverReference = e.target
            this.$refs.popover.showPopper = true
            // 先把编辑菜单关闭
            this.handleClose()

            // 手动更改弹窗位置
            setTimeout(() => {
                const popoverElement = document.querySelector('.el-popover')
                if (popoverElement) {
                    const rect = popoverElement.getBoundingClientRect()
                    const targetRect = e.target.getBoundingClientRect()

                    // 计算新的位置
                    let left = targetRect.left + (targetRect.width / 2) - (rect.width / 2)
                    // 使用目标元素的底部作为弹窗顶部
                    const top = targetRect.bottom
                    const windowWidth = window.innerWidth

                    // 左右边界检查
                    if (left < 0) {
                        left = 0
                    } else if (left + rect.width > windowWidth) {
                        left = windowWidth - rect.width
                    }
                    // 设置弹窗位置
                    popoverElement.style.left = `${left}px`
                    popoverElement.style.top = `${top}px`
                    const triangle = popoverElement.querySelector('.popper__arrow')
                    // 设置小三角位置
                    if (triangle) {
                        triangle.style.left = `${(targetRect.left + (targetRect.width / 2)) - left}px`
                    }
                }
            }, 10)
        },
        resetShiftSetting () {
            this.popoverReference = null
            this.shiftForm = {
                operateType: 'copy',
                pasteType: 'all'
            }
            this.$refs.popover.showPopper = false
        },
        getDays (start, end) {
            if (!start || !end) {
                return 0
            }
            return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24))
        },
        handleShiftSetting (type) {
            const { cycle, dates, operateType, current } = this.shiftForm || {}
            if ((operateType === 'copy' && this.$utils.isEmpty(dates)) || (operateType === 'cycle' && this.$utils.isEmpty(cycle))) {
                return this.$message.warning('请补充必填信息！')
            }
            const target = this.getDays(this.formData.dateRange[0], current)
            const total = this.getDays(this.formData.dateRange[0], this.formData.dateRange[1])
            if (operateType === 'copy') {
                dates.forEach(d => {
                    const index = this.getDays(this.formData.dateRange[0], d)
                    Object.keys(this.scheduleData).forEach(key => {
                        if (type === 'all' || this.$utils.isEmpty(this.scheduleData[key][index])) {
                            this.scheduleData[key][index] = [...this.scheduleData[key][target]]
                        }
                    })
                })
            } else {
                // 获取需覆盖的下标数组
                const getIndexList = (start, end, step) => {
                    const result = []
                    let cur = start + step + 1
                    while (cur <= end) {
                        result.push(cur)
                        cur += step + 1
                    }
                    return result
                }
                const indexList = getIndexList(target, total, cycle)
                indexList.forEach(i => {
                    Object.keys(this.scheduleData).forEach(key => {
                        if (type === 'all' || this.$utils.isEmpty(this.scheduleData[key][i])) {
                            this.scheduleData[key][i] = [...this.scheduleData[key][target]]
                        }
                    })
                })
            }
            this.resetShiftSetting()
        },
        /** 获取排班变化描述 */
        getOverViews (responseData, newData) {
            const oldData = responseData.staffScheduleDetailPoList
            const result = []
            // 遍历newData
            newData.forEach((newItem, i) => {
                // 比较每个人班次的数量变化
                if (newItem.statistics !== oldData[i].statistics) {
                    const newStatistics = JSON.parse(newItem.statistics) || []
                    const oldStatistics = JSON.parse(oldData[i].statistics) || []
                    const changes = []
                    // 比较每个人班次的数量变化
                    for (const shift in newStatistics) {
                        const newCount = newStatistics[shift] || 0
                        const oldCount = oldStatistics[shift] || 0
                        const shiftName = this.formData.scheduleShift.find(item => item.alias === shift)?.name
                        if (newCount > oldCount) {
                            changes.push(`${shiftName}增加了` + (newCount - oldCount) + '班次')
                        } else if (newCount < oldCount) {
                            changes.push(`${shiftName}减少了` + (oldCount - newCount) + '班次')
                        }
                    }
                    // oldStatistics中有的项而newStatistics中没有的项
                    for (const oldShift in oldStatistics) {
                        if (!newStatistics.hasOwnProperty(oldShift)) {
                            const shiftName = this.formData.scheduleShift.find(item => item.alias === oldShift)?.name
                            const oldCount = oldStatistics[oldShift] || 0
                            changes.push(`${shiftName}减少了` + oldCount + '班次')
                        }
                    }
                    // 如果有班次变化，将其与userId记录到结果中
                    if (changes.length > 0) {
                        const userNameObj = this.userList.filter(item => item.userId === newItem.userId)
                        const perOverView = userNameObj[0]?.userName + changes.join(',')
                        result.push(perOverView)
                    }
                }
            })
            return result.join('。')
        },
        // 提交调班申请数据
        submitAdjust (submitData) {
            let overView = ''
            if (submitData.id) {
                overView = this.getOverViews(this.responseData || null, submitData.staffScheduleDetailPoList)
            }
            if (overView === '') {
                return
            }
            const { first, second } = this.$store.getters.level || {}
            const adjustData = {
                scheduleId: submitData.id,
                reason: '排班管理员调整排班',
                diDian: second || first,
                overview: '排班管理员调整：' + overView,
                status: '已通过',
                updateTime: Date.now(),
                adjustmentDetailPoList: []
            }
            saveAdjustment(adjustData)
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
        max-height: calc(100vh - 146px);
        overflow: auto;
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
            width: fit-content;
            overflow-x: auto;
            font-size: 14px;
            position: relative;
            .abscissa {
                // width: 100%;
                margin: 0 20px 0 110px;
                display: flex;
                width: fit-content;
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
                        .date {
                            width: 59px;
                            height: 28px;
                            line-height: 30px;
                            text-align: center;
                            border: 1px solid #ccc;
                            border-right: none;
                            cursor: pointer;
                            color: #409eff;
                            &:hover {
                                background: #ecf5ff;
                            }
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
                // max-height: calc(100vh - 245px);
                height: fit-content;
                margin: 10px 0 20px 10px;
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: stretch;
                float: left;
                overflow-y: auto;
                white-space: nowrap;
                .ordinate {
                    width: 80px;
                    padding: 0 10px;
                    // height: 100%;
                    // background-color: #f0f0f0;
                    display: flex;
                    flex-shrink: 0;
                    flex-direction: column;
                    .ordinate-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        min-height: 60px;
                        flex-shrink: 0;
                        flex-grow: 1;
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
                            min-height: 59px;
                            font-size: 14px;
                            border: 1px solid #ccc;
                            border-bottom: none;
                            border-right: none;
                            cursor: context-menu;
                            /*filter: saturate(0.8);*/
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center ;
                            .shift {
                                text-align: center;
                            }

                            &:has(.shift:nth-child(2)) {
                                flex-direction: column;
                            }

                            &:has(.shift:nth-child(3)) {
                                flex-direction: column;
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 1px;
                            }
                            &:has(.shift:nth-of-type(odd):nth-last-of-type(odd)):not(:has(.overlay)) {
                                // background: #303133;
                                .shift:last-of-type {
                                    grid-column: span 2;
                                    justify-self: center;
                                }
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
            .stickyTop {
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                z-index: 1001;
                background: #fff;
            }
            .stickyLeft {
                position: fixed;
                top: 206px;
                left: 0;
                right: 0;
                z-index: 1000;
                background: #fff;
                box-shadow: 0 2px 20px rgba(228, 231, 237, 1);
            }
        }
    }
}
</style>
