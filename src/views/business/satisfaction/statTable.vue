<template>
    <div>
        <el-table
            ref="statTable"
            :data="statData"
            border
            stripe
            highlight-current-row
            style="width: 100%"
            class="stat-table"
            :max-height="maxHeight"
            show-summary
            :summary-method="getSummaries"
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
        >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column label="调查项" prop="surveyItem" />
            <el-table-column prop="" label="用户打分">
                <el-table-column label="住院患者" prop="inpatient" />
                <el-table-column label="门诊患者" prop="outpatient" />
                <el-table-column label="医务人员" prop="medical" />
                <el-table-column label="员工" prop="employee" />
            </el-table-column>
            <el-table-column label="小计" prop="count" />
        </el-table>
        <el-table
            v-if="statData.length"
            :data="[{}]"
            border
            class="times-table"
            :show-header="false"
            :cell-style="{ textAlign: 'center', 'background-color': '#F5F7FA', color: '#606266' }"
        >
            <el-table-column width="50" />
            <el-table-column>
                <template slot-scope="scope">
                    <div v-if="scope.$index === 0">
                        调查表数量
                    </div>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div v-html="timesInfo['住院患者']" />
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div v-html="timesInfo['门诊患者']" />
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div v-html="timesInfo['医务人员']" />
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div v-html="timesInfo['员工']" />
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div>N/A</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            maxHeight: '600px',
            statData: [],
            timesData: {},
            readonly: true,
            isInitialized: false
        }
    },
    watch: {
        formData: {
            handler (val) {
                this.statData = this.$utils.isEmpty(val.statData) ? [] : val.statData
                this.timesData = this.$utils.isEmpty(val.timesData) ? [] : val.timesData
                this.timesInfo = {}
                Object.keys(this.timesData).forEach(key => {
                    const t = this.timesData[key]
                    this.timesInfo[key] = `共：${t['总数']}份，其中：<br/>纸质调查表：${t['纸质调查表']}份<br/>电话：${t['电话']}份<br/>手机客户端：${t['手机客户端']}份`
                })
            },
            deep: true
        }
    },
    mounted () {

    },
    methods: {
        getSummaries (param) {
            if (!this.statData.length) {
                return []
            }
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = ''
                    return
                }
                if (index === 1) {
                    sums[index] = '满意率'
                    return
                }
                if (index === 6) {
                    sums[index] = 'N/A'
                    return
                }
                const values = data.map(item => Number(item[column.property]))
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0)
                sums[index] = (sums[index] / (this.timesData[column.label]['总记录数']) * 10).toFixed(2) + '%'
            })
            return sums
        }
    }
}
</script>
<style lang="scss" scoped>
    .stat-table {
        ::v-deep {
            .el-table__footer-wrapper {
                .cell {
                    text-align: center;
                }
            }
        }
    }
</style>
