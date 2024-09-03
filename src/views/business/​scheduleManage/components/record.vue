<template>
    <el-drawer
        :title="title"
        :visible.sync="drawerVisible"
        :direction="direction"
        show-close
        size="30%"
        :wrapper-closable="false"
        destroy-on-close
        append-to-body
        custom-class="schedule-record"
        :before-close="handleClose"
        @open="loadData"
    >
        <el-timeline class="history-timeline" :reverse="false">
            <el-timeline-item
                v-for="(item, index) in timelineDate"
                :key="index"
                :timestamp="item.createTime"
                placement="top"
            >
                <el-card class="card">
                    <div class="applicant">申请人：{{ item.creator }}</div>
                    <div class="reason">原因：{{ item.reason }}</div>
                    <div class="detail">详情：{{ item.overview }}</div>
                    <div class="approve">通过时间：{{ item.executeDate }}</div>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </el-drawer>
</template>

<script>
import { getAdjustment } from '@/api/business/schedule'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        scheduleId: {
            type: String,
            default: ''
        }
    },
    data () {
        const { userList } = this.$store.getters || {}
        return {
            userList,
            drawerVisible: this.visible,
            title: '排班修改历史',
            direction: 'rtl',
            timelineDate: []
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.drawerVisible = val
            }
        }
    },
    methods: {
        loadData () {
            if (!this.scheduleId) {
                return
            }
            const sql = `select a.id_ as dataId, a.parent_id_ as parentId, a.record_id_ as recordId, a.before_adjust_ as beforeAdjust, a.before_date_ as beforeDate, a.after_adjust_ as afterAdjust, a.after_date_ as afterDate, a.party_ as party, b.create_by_ as createBy, date_format(b.create_time_,'%Y-%m-%d %H:%i') AS createTime, b.di_dian_ as location, b.reason_ as reason, b.executor_ as executor, b.execute_date_ as executeDate, b.overview_ as overview, b.schedule_id_ as scheduleId from t_adjustment_detail a left join t_adjustment b on a.parent_id_ = b.id_ and b.schedule_id_ = '${this.scheduleId}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    return
                }
                this.timelineDate = this.formatData(data)
                console.log(this.timelineDate)
            })
        },
        formatData (data) {
            const groupedData = {}
            data.forEach(item => {
                const parentId = item.parentId
                if (!groupedData[parentId]) {
                    groupedData[parentId] = {
                        parentId,
                        createTime: item.createTime,
                        createBy: item.createBy,
                        creator: this.transformData(this.userList, item.createBy, 'userId', 'userName'),
                        reason: item.reason,
                        overview: item.overview,
                        executor: item.executor,
                        executeDate: item.executeDate,
                        items: []
                    }
                }
                groupedData[parentId].items.push(item)
            })
            return Object.values(groupedData)
        },
        handleClose () {
            console.log(123123)
            this.$emit('close', false)
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .schedule-record {
        ::v-deep {
            .el-drawer__header {
                margin-bottom: 20px;
            }
            .el-card {
                &__body {
                    padding: 12px;
                }
            }
        }
        .history-timeline {
            padding: 0 20px;
            color: #343434;
            .card {
                > div > div {
                    margin-top: 5px;
                    &:first_child {
                        margin-top: 0;
                    }
                }
            }
            .applicant, .reason, .detail {
                line-height: 1.5;
            }
            .detail {
                white-space: pre-wrap;
            }
        }
    }
</style>
