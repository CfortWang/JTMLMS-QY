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
            <el-table-column label="调查项" prop="xiangMu" />
            <el-table-column prop="" label="用户打分">
                <el-table-column label="护理人员" prop="zhuYuan" />
                <el-table-column label="门诊患者" prop="menZhen" />
                <el-table-column label="医生" prop="yiWu" />
                <el-table-column label="员工" prop="yuanGong" />
            </el-table-column>
            <el-table-column label="小计" prop="xiaoJiAve" />
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
                <div>调查表数量</div>
            </el-table-column>
            <el-table-column>
                <div v-html="timesInfo['护理人员']" />
            </el-table-column>
            <el-table-column>
                <div v-html="timesInfo['门诊患者']" />
            </el-table-column>
            <el-table-column>
                <div v-html="timesInfo['医生']" />
            </el-table-column>
            <el-table-column>
                <div v-html="timesInfo['员工']" />
            </el-table-column>
            <el-table-column>
                <div>N/A</div>
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
            timesInfo: {},
            readonly: true,
            isInitialized: false
        }
    },
    computed: {
        statDataWatcher () {
            return this.formData.mydtjzb
        },
        timesDataWatcher () {
            return this.formData.jiSuanShuJu
        }
    },
    watch: {
        statDataWatcher: {
            handler (val) {
                this.statData = this.$utils.isEmpty(val) ? [] : val
            },
            deep: true,
            immediate: true
        },
        timesDataWatcher: {
            handler (val) {
                this.timesData = this.$utils.isEmpty(val) ? {} : JSON.parse(val)
                // this.updateTimesInfo()
                this.timesInfo = {}
                let countDetail = ''
                Object.keys(this.timesData).forEach(key => {
                    const t = this.timesData[key]
                    this.timesInfo[key] = `共${t['总数']}份，来源分布为：<br/>纸质调查表${t['纸质调查表']}份<br/>电话${t['电话']}份<br/>手机客户端${t['手机客户端']}份`
                    countDetail += `【${key}】类型` + this.timesInfo[key] + '\n'
                })
                this.emitChangeData('shuLiangMingXi', countDetail.replace(/<br\s*\/?>/gi, '，').replace(/：，/gi, '：'))
            },
            deep: true,
            immediate: true
        }
        // formData: {
        //     handler (val) {
        //         this.statData = this.$utils.isEmpty(val.statData) ? [] : val.statData
        //         this.timesData = this.$utils.isEmpty(val.timesData) ? [] : val.timesData
        //         this.timesInfo = {}
        //         let countDetail = ''
        //         Object.keys(this.timesData).forEach(key => {
        //             const t = this.timesData[key]
        //             this.timesInfo[key] = `共${t['总数']}份，其中：<br/>纸质调查表${t['纸质调查表']}份<br/>电话${t['电话']}份<br/>手机客户端${t['手机客户端']}份`
        //             countDetail += this.timesInfo[key].replace(/<br\s*\/?>/gi, '，')
        //         })
        //         console.log(countDetail)
        //         // this.$emit('change-data', 'shuLiangMingXi', countDetail)
        //     },
        //     deep: true
        // }
    },
    mounted () {
    },
    methods: {
        getSummaries (param) {
            const self = this
            if (!this.statData.length || this.$utils.isEmpty(this.timesData)) {
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
                // const values = data.map(item => Number(item[column.property]))
                const values = data.map(item => Number(item[column.property.replace('Ave', '')])) // 取总分 Ave是平均分
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0)
                if (self.timesData && self.timesData[column.label] && self.timesData[column.label]['总记录数']) {
                    sums[index] = (sums[index] / (self.timesData[column.label]['总记录数']) * 10).toFixed(2) + '%'
                }
            })
            const rateDetail = `护理人员满意率：${sums[2]}\n门诊患者满意率：${sums[3]}\n医生满意率：${sums[4]}\n员工满意率：${sums[5]}\n`
            this.emitChangeData('tongJiXiangQing', rateDetail)
            return sums
        },
        emitChangeData (event, data) {
            // 深拷贝 formData
            const formDataCopy = JSON.parse(JSON.stringify(this.formData))
            // 确保 formData 需要更新时才进行
            if (formDataCopy[event] !== data) {
                this.$emit('change-data', event, data)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .stat-table {
        ::v-deep {
            thead.is-group th.el-table__cell {
                background: #84d5cf !important;
                font-size: 14px;
                font-weight: bold;
                color: #000;
            }
            .el-table__row {
                background: #f9ffff;
            }
            .el-table__row--striped {
                background: #e0f0ee;
            }
            .el-table__footer-wrapper {
                .cell {
                    text-align: center;
                }
            }
        }
    }
</style>
