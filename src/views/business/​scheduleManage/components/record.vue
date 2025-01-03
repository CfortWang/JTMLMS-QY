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
                :timestamp="item.updateTime"
                placement="top"
            >
                <el-card class="card">
                    <div class="applicant">
                        <span class="leftText">申请人:</span>
                        <span class="rightText">{{item.creator }}</span>
                    </div>
                    <div class="reason">
                        <span class="leftText">原因:</span>
                        <span class="rightText">{{item.reason }}</span>
                    </div>
                    <div class="detail">
                        <span class="leftText">详情:</span>
                        <span class="rightText">{{item.overview }}</span>
                    </div>
                    <div class="approve">
                        <span class="leftText">通过时间:</span>
                        <span class="rightText">{{item.updateTime }}</span>
                    </div>
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
            // const sql = `select a.id_ as dataId, a.parent_id_ as parentId, a.record_id_ as recordId, a.before_adjust_ as beforeAdjust, a.before_date_ as beforeDate, a.after_adjust_ as afterAdjust, a.after_date_ as afterDate, a.party_ as party, b.create_by_ as createBy, date_format(b.create_time_,'%Y-%m-%d %H:%i') AS createTime, b.di_dian_ as location, b.reason_ as reason, b.executor_ as executor, b.execute_date_ as executeDate, b.overview_ as overview, b.schedule_id_ as scheduleId from t_adjustment_detail a left join t_adjustment b on a.parent_id_ = b.id_ and b.schedule_id_ = '${this.scheduleId}'`
            const sql = 'select * from t_adjustment where status in ( "已通过") and schedule_id_ = ' + this.scheduleId + ' order by update_time_ DESC'
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
            const groupedData = []
            data.forEach(item => {
                const tempObj = {
                    updateTime: this.formatTime(item.update_time_),
                    createBy: item.create_by_,
                    creator: this.transformData(this.userList, item.create_by_, 'userId', 'userName'),
                    reason: item.reason_,
                    overview: item.overview_,
                    items: []
                }
                groupedData.push(tempObj)
            })
            return groupedData
        },
        handleClose () {
            console.log(123123)
            this.$emit('close', false)
        },
        formatTime (timestamp) {
            const dateObj = new Date(timestamp)
            const year = dateObj.getFullYear()
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
            const day = dateObj.getDate().toString().padStart(2, '0')
            const hours = dateObj.getHours().toString().padStart(2, '0')
            const minutes = dateObj.getMinutes().toString().padStart(2, '0')
            const seconds = dateObj.getSeconds().toString().padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
            .applicant, .reason, .detail{
                line-height: 1.5;
                display: flex;
                flex-direction: row;
                //align-items: flex-start;
                justify-content: flex-start;
                .leftText{
                    text-align: right;
                    flex:0 1 20%
                }
                .rightText{
                    margin-left: 0.5em;
                    flex:0 1 80%;
                    text-align: left;
                }
            }
            .detail {
                white-space: pre-wrap;
            }
            .approve{
                line-height: 1.5;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                .leftText{
                    text-align: right;
                    flex:0 1 20%
                }
                .rightText{
                    margin-left: 0.5em;
                    flex:0 1 80%;
                    text-align: left;
                }
            }
        }
    }
</style>
