<template>
    <div class="schedule">
        <div class="schedule-container">
            <div class="page-header">
                <div class="toolbar">
                    <el-button
                        v-if="btn.show && (!btn.steps || btn.steps.includes(activeStep)) "
                        :key="btn.key"
                        :type="btn.type"
                        size="mini"
                        :icon="btn.icon"
                        @click="handleAction(btn.key)"
                    >{{ btn.label }}</el-button>
                </div>
                <div class="page-title">{{ `检验科8月${title}` }}</div>
            </div>
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
    </div>
</template>

<script>
import { position } from '../../constants/schedule'
import { mapValues, keyBy } from 'lodash'
export default {
    name: 'schedule',
    components: {
        ContextMenu: () => import('./components/context-menu')
    },
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const users = userList.map(item => ({ id: item.userId, name: item.userName }))
        const readonly = false
        return {
            users,
            deptList,
            position,
            readonly,
            title: '排班',
            toolbars: [
                { key: 'prev', icon: 'el-icon-d-arrow-left', label: '上一步', type: 'primary', steps: '2,3', show: true },
                { key: 'next', icon: 'el-icon-d-arrow-right', label: '下一步', type: 'primary', steps: '1,2', show: true },
                { key: 'changeView', icon: 'el-icon-set-up', label: '切换视图', type: 'primary', steps: '2', show: true },
                // { key: 'history', icon: 'el-icon-time', label: '排班历史', type: 'info', steps: '2,3' },
                { key: 'record', icon: 'el-icon-tickets', label: '修改记录', type: 'warning', steps: '2,3', show: !readonly },
                { key: 'export', icon: 'el-icon-download', label: '导出', type: 'primary', steps: '2,3', show: true },
                { key: 'reset', icon: 'el-icon-refresh', label: '重置', type: 'warning', steps: '2', show: !readonly },
                // { key: 'edit', icon: 'el-icon-edit', label: '编辑', type: 'primary', steps: '2,3' },
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'primary', show: !readonly },
                { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'success', steps: '3', show: !readonly },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger', show: true }
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
        this.dateObj = this.getDateList(this.dateRange)
        this.dateList = Object.values(this.dateObj).flat()
    },
    methods: {
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
                    this.$router.go(-1)
                    break
                default:
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule {
    width: 100%;
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
