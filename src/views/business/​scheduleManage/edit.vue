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
        <el-steps :active="activeStep" finish-status="success" simple style="margin-top: 20px">
            <el-step title="基础信息配置" />
            <el-step title="人员排班" />
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
                    v-model="formData.name"
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
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排班时间" prop="time" required :show-message="false">
                        <el-date-picker
                            v-if="formData.cycle === 'day'"
                            v-model="formData.time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="form-row">
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
            <el-form-item label="排班人员" prop="scheduleStaff" required>
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
                <el-col :span="12">
                    <el-form-item label="是否审批" prop="isApproval" required>
                        <el-switch
                            v-model="formData.isApproval"
                            active-value="Y"
                            inactive-value="N"
                            :disabled="readonly"
                        />
                    </el-form-item>
                </el-col>
                <el-col v-if="formData.isApproval === 'Y'" :span="12">
                    <el-form-item label="调班审批人" prop="approver" required :show-message="false">
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
                        <div v-for="item in ordinateList" :key="item.id" class="ordinate-item">
                            {{ item.name }}
                        </div>
                    </div>
                    <div class="item-list">
                        <div v-for="(row, rIndex) in ordinateList" :key="row.id" class="item-row">
                            <div v-for="(column, cIndex) in dateList" :key="cIndex" class="item">
                                <div
                                    ref="scheduleItem"
                                    class="item-content"
                                    @mouseenter="hoveredIndex = `${row.id}-${cIndex}`"
                                    @mouseleave="hoveredIndex = null"
                                    @contextmenu.prevent="handleRightClick($event, {row, rIndex, column, cIndex})"
                                >
                                    <span
                                        v-for="(icon, iconIndex) in scheduleData[row.id][cIndex]"
                                        :key="iconIndex"
                                        class="icon-box"
                                    >
                                        <i :class="icon.icon" :style="{ color: `${icon.color}` }" />
                                    </span>
                                    <div v-if="hoveredIndex === `${row.id}-${cIndex}` && !readonly" class="overlay">
                                        <i class="el-icon-edit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <context-menu
            :visible.sync="showContextMenu"
            :params="params"
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
        const users = userList.map(item => ({ id: item.userId, name: item.userName }))
        const readonly = false
        return {
            users,
            userList,
            deptList,
            cycleOptions,
            scheduleType,
            dialogVisible: this.visible,
            formLabelWidth: '120px',
            loading: false,
            activeStep: 1,
            formData: {
                scheduleShift: [],
                scheduleRule: [],
                isEffective: 'Y',
                isApproval: 'Y'
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
            dateRange: ['2024-07-29', '2024-09-01'],
            viewType: 'users',
            dateObj: {},
            dateList: [],
            showContextMenu: false,
            hoveredIndex: null,
            params: {},
            selectItem: [],
            itemPosition: {}
        }
    },
    computed: {
        ordinateList () {
            return this[this.viewType]
        },
        scheduleData () {
            return mapValues(keyBy(this.ordinateList, 'id'), () => [])
        }
    },
    created () {
        this.loadData()
        this.dateObj = this.getDateList(this.dateRange)
        this.dateList = Object.values(this.dateObj).flat()
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
            console.log(temp)
            this.formData = {
                ...this.formData,
                approver: temp.approver ? temp.approver.split(',') : [],
                scheduleType,
                isApproval: temp.isApproval,
                scheduleRule: temp.scheduleRule ? JSON.parse(temp.scheduleRule) : [],
                scheduleShift: temp.scheduleShift ? JSON.parse(temp.scheduleShift) : [],
                scheduleStaff: temp.scheduleStaff ? JSON.parse(temp.scheduleStaff) : []
            }
        },
        getDateList (dateRange) {
            const [startDate, endDate] = dateRange.map(date => new Date(date))
            const dates = {}
            const currentDate = startDate
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
            this.viewType = this.viewType === 'users' ? 'position' : 'users'
        },
        handleRightClick (event, { row, colunm, rIndex, cIndex }) {
            this.selectItem = []
            this.showContextMenu = true
            const item = this.$refs.scheduleItem[rIndex * this.dateList.length + cIndex + 1]
            const rect = item.getBoundingClientRect()
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
            this.selectItem = this.scheduleData[row.id][cIndex]
            console.log(this.selectItem)
        },
        handleSelect ({ selected, params }) {
            this.scheduleData[params.row.id][params.cIndex] = selected
        },
        handleClose () {
            this.showContextMenu = false
        },
        handleAction (action) {
            switch (action) {
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
            .el-input, .el-select, .el-input-number {
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
                height: calc(100vh - 220px);
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
                        height: 30px;
                        flex-shrink: 0;
                    }
                }
                .item-list {
                    flex: 1;
                    margin-right: 20px;
                    .item-row {
                        display: flex;
                        .item {
                            position: relative;
                            width: 59px;
                            height: 29px;
                            line-height: 30px;
                            text-align: center;
                            border: 1px solid #ccc;
                            border-bottom: none;
                            border-right: none;
                            cursor: context-menu;
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
                            .item-content {
                                width: 100%;
                                height: 100%;
                                font-size: 16px;
                                .icon-box:last-child {
                                    margin-left: 5px;
                                }
                                .icon-box:only-child {
                                    margin-left: 0;
                                }
                            }
                        }
                        &:last-of-type {
                            .item {
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
