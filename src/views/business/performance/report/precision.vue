<template>
    <div class="info-container">
        <div class="experimental-result info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>计算结果</span>
                <!-- <el-button
                    key="recalculate"
                    type="primary"
                    icon="refresh"
                    size="mini"
                    plain
                    class="right-btn"
                    @click="handleRecalculate"
                >重新计算</el-button> -->
            </div>
            <el-tabs v-model="activeTab" @tab-click="handleClick">
                <el-tab-pane
                    v-for="(tab, tabIndex) in tabs"
                    :key="tabIndex"
                    :label="tab"
                    :name="tab"
                >
                    <div class="content">
                        <div v-for="(table, tableIndex) in reportData" :key="tableIndex" class="table-item">
                            <div class="table-title">
                                <span>{{ table.title }}</span>
                            </div>
                            <el-table
                                :data="table.list"
                                border
                                stripe
                                highlight-current-row
                                style="width: 100%"
                                max-height="250px"
                                :show-header="!table.hideHeader"
                                :span-method="getSpanMethod(table)"
                            >
                                <el-table-column
                                    v-for="h in table.header"
                                    :key="h.prop"
                                    :prop="h.children && h.children.length ? '' : h.prop"
                                    :label="h.label"
                                    header-align="center"
                                    align="center"
                                >
                                    <template slot="header" slot-scope="scope">
                                        <span v-html="scope.column.label" />
                                    </template>
                                    <template slot-scope="scope">
                                        <span v-if="h.slot" v-html="scope.row[h.prop]" />
                                        <span v-else>{{ scope.row[h.prop] }}</span>
                                    </template>
                                    <el-table-column
                                        v-for="c in h.children"
                                        :key="c.prop"
                                        :prop="c.prop"
                                        :label="c.label"
                                        header-align="center"
                                        align="center"
                                    >
                                        <template slot="header" slot-scope="scope">
                                            <span v-html="scope.column.label" />
                                        </template>
                                        <template slot-scope="scope">
                                            <span v-if="c.slot" v-html="scope.row[c.prop]" />
                                            <span v-else>{{ scope.row[c.prop] }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <chart
            v-if="chartData.length"
            :chart-data="chartData"
            :readonly="readonly"
        />
    </div>
</template>
<script>
export default {
    components: {
        chart: () => import('../components/chart.vue')
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        formula: {
            type: Array,
            default: () => []
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tabs: [],
            activeTab: '',
            activeTabIndex: 0,
            reportData: [],
            chartData: []
        }
    },
    watch: {
        info: {
            handler (v) {
                if (v.sheetDTO && v.sheetDTO.length) {
                    this.tabs = v.sheetDTO.map(item => item.title)
                    this.activeTab = this.tabs[this.activeTabIndex] || ''
                    this.initData(this.activeTabIndex)
                }
            },
            immediate: true,
            deep: true
        },
        activeTabIndex (v) {
            this.initData(v)
        }
    },
    mounted () {
        // this.tabs = this.info.sheetDTO && this.info.sheetDTO.length ? this.info.sheetDTO.map(item => item.title) : []
        // this.activeTab = this.tabs[this.activeTabIndex] || ''
        // this.initData(this.activeTabIndex)
    },
    methods: {
        handleClick (v) {
            this.activeTab = v.name
            this.activeTabIndex = this.tabs.findIndex(item => item === v.name) || 0
        },
        initData (index) {
            const { sheetDTO } = this.info || {}
            const { reportDataDTO, chartDataDTO } = sheetDTO[index] || {}
            const reportData = Object.keys(reportDataDTO).map(k => ({
                title: k,
                header: reportDataDTO[k].header || this.getTableHeader(reportDataDTO[k].list),
                hideHeader: this.$utils.isEmpty(reportDataDTO[k].header),
                list: reportDataDTO[k].list
            })).sort((a, b) => a.title.localeCompare(b.title))
            const chartData = chartDataDTO ? Object.keys(chartDataDTO).map(k => ({
                title: k,
                id: chartDataDTO[k].name,
                data: chartDataDTO[k].data,
                option: chartDataDTO[k].option
            })).sort((a, b) => a.title.localeCompare(b.title)) : []
            this.chartData = chartData
            this.reportData = reportData
        },
        getTableHeader (data) {
            return data.length ? Object.keys(data[0]).map(key => ({ label: key, prop: key, slot: true })) : []
        },
        getSpanMethod (table) {
            return (params) => {
                return this.objectSpanMethod(params, table)
            }
        },
        objectSpanMethod ({ row, column, rowIndex, columnIndex }, { list, header }) {
            // 判断当前列是否需要进行同值合并
            if (header[columnIndex].merge) {
                const firstSameRowIndex = this.getFirstSameRowIndex(list, rowIndex, column.property)
                const firstSameColIndex = this.getFirstSameColIndex(list, columnIndex, rowIndex)
                return {
                    rowspan: rowIndex === firstSameRowIndex ? this.getRowSpanCount(list, rowIndex, column.property) : 0,
                    colspan: 1
                    // colspan: firstSameColIndex === -1 ? 1 : columnIndex - firstSameColIndex + 1
                }
            }
            return {
                rowspan: 1,
                colspan: 1
            }
        },
        // 获取行同值合并的起始下标
        getFirstSameRowIndex (data, rowIndex, prop) {
            for (let i = rowIndex; i >= 0; i--) {
                if (data[i][prop] !== data[rowIndex][prop]) {
                    return i + 1
                }
            }
            return 0
        },
        // 获取列同值合并的起始下标
        getFirstSameColIndex (data, colIndex, rowIndex) {
            for (let i = colIndex; i >= 0; i--) {
                if (data[rowIndex][i] !== data[rowIndex][colIndex]) {
                    return i
                }
            }
            return 0
        },
        getRowSpanCount (data, rowIndex, prop) {
            let count = 1
            for (let i = rowIndex + 1; i < data.length; i++) {
                if (data[i][prop] === data[rowIndex][prop]) {
                    count++
                } else {
                    break
                }
            }
            return count
        },
        handleRecalculate () {
            this.$emit('recalculate')
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .experimental-result {
            position: relative;
            .title {
                position: relative;
                .right-btn {
                    position: absolute;
                    top: -2px;
                    right: 0;
                }
            }
            .content {
                padding: 10px;
                position: relative;
                .table-item {
                    .table-title {
                        margin: 15px 0 10px 0;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    &:first-child {
                        .table-title {
                            margin-top: 0;
                        }
                    }
                }
            }
        }
    }
</style>
