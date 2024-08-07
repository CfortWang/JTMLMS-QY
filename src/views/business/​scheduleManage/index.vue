<template>
    <div class="schedule">
        <div class="schedule-container">
            <div class="page-header">
                <div class="title">{{ `检验科8月${title}` }}</div>
                <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-set-up"
                    @chick="changeView"
                >切换视图</el-button>
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
                        <div v-for="row in ordinateList" :key="row.id" class="item-row">
                            <div v-for="(date, dIndex) in dateList" :key="dIndex" class="item">
                                <div class="item-content" @contextmenu.prevent="handleRightClick($event, row.id, date)">
                                    <i class="el-icon-sunny" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <context-menu
            :visible.sync="showContextMenu"
            :schedule-data="scheduleData"
            @select="handleSelect"
            @close="handleClose"
        />
    </div>
</template>

<script>
import { position } from '../../constants/schedule'
export default {
    name: 'schedule',
    components: {
        ContextMenu: () => import('./components/context-menu')
    },
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const users = userList.map(item => ({ id: item.userId, name: item.userName }))
        return {
            users,
            deptList,
            position,
            title: '排班',
            toolbars: [
                { key: 'changeView', icon: 'el-icon-set-up', label: '切换视图', type: 'primary', hidden: false },
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success', hidden: false },
                { key: 'submit', icon: 'ibps-icon-send', label: '提交', type: 'primary', hidden: false },
                { key: 'generate', icon: 'ibps-icon-cube', label: '生成报告', type: 'success', hidden: false },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            dateRange: ['2024-07-29', '2024-09-01'],
            viewType: 'users',
            dateObj: {},
            dateList: [],
            showContextMenu: false,
            scheduleData: {}
        }
    },
    computed: {
        ordinateList () {
            return this[this.viewType]
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
        handleRightClick (event, rowId, date) {
            this.showContextMenu = true
            this.scheduleData = {
                top: event.clientY - 50,
                left: event.clientX,
                rowId,
                date
            }
        },
        handleSelect (item) {
            console.log(item)
        },
        handleClose () {
            this.showContextMenu = false
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule {
    width: 100%;
    .schedule-container {
        width: 100%;
        .page-header {
            height: 80px;
            .title {
                padding: 10px;
                font-size: 16px;
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
                margin: 0 20px 0 90px;
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
                height: calc(100vh - 180px);
                margin: 10px 0 20px 10px;
                position: relative;
                display: flex;
                float: left;
                overflow-y: auto;
                white-space: nowrap;
                .ordinate {
                    width: 80px;
                    height: 100%;
                    position: sticky;
                    left: 0;
                    background-color: #f0f0f0;
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
                            width: 59px;
                            height: 29px;
                            line-height: 30px;
                            text-align: center;
                            border: 1px solid #ccc;
                            border-bottom: none;
                            border-right: none;
                            &:last-child {
                                border-right: 1px solid #ccc;
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
