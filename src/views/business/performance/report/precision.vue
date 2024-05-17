<template>
    <div class="info-container">
        <div class="experimental-report info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验报告</span>
            </div>
            <el-tabs v-model="activeTab" @tab-click="handleClick">
                <el-tab-pane
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :label="tab"
                    :name="tab"
                >
                    <div class="content">
                        <div class="data-table">
                            <div class="table-header">
                                <div v-for="(h, thIndex) in expData.header" :key="thIndex" class="th">{{ h }}</div>
                            </div>
                            <div class="table-content">
                                <div v-for="(row, trIndex) in expData.list" :key="trIndex" class="tr">
                                    <div :key="`${trIndex}-0`" class="td">
                                        X<sub>{{ trIndex + 1 }}</sub>
                                    </div>
                                    <div v-for="(item, tdIndex) in row" :key="`${trIndex}-${tdIndex + 1}`" class="td">{{ item }}</div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="statistical-table">
                            <div class="first-col">
                                <div
                                    v-for="(c, colIndex) in statistics.firstCol"
                                    :key="colIndex"
                                    class="col-cell"
                                >{{ c }}</div>
                            </div>
                            <div class="other-col">
                                <div class="table-header">
                                    <div v-for="(h, thIndex) in statistics.header" :key="thIndex" class="th">{{ h }}</div>
                                </div>
                                <div class="table-content">
                                    <div v-for="(row, trIndex) in statistics.list" :key="trIndex" class="tr">
                                        <!-- <div :key="`${trIndex}-0`" class="td">
                                            X<sub>{{ trIndex + 1 }}</sub>
                                        </div> -->
                                        <div
                                            v-for="(item, tdIndex) in row"
                                            :key="`${trIndex}-${tdIndex + 1}`"
                                            class="td"
                                        >
                                            <template v-if="item.main">
                                                {{ item.main }}<sub>{{ item.sub }}</sub>
                                            </template>
                                            <template v-else>
                                                {{ item }}
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            tabs: [],
            activeTab: '',
            expData: {},
            statistics: {}
        }
    },
    mounted () {
        this.tabs = this.info.config.specimensName || []
        this.activeTab = this.tabs[0] || ''
        this.dealData(this.info)
    },
    created () {
    },
    methods: {
        handleClick (v) {
            this.activeTab = v.name
        },
        dealData (res) {
            const { config, reportData } = res || {}
            const { days } = config || {}
            const { data: rawData, allowableCv1, allowableCvr, allowableS1, allowableSr, cv1, cvr, mean, s1, sr, vb } = reportData[this.activeTab] || {}
            const header = ['次数/日期'].concat(Array.from({ length: days }, (_, index) => `第${index + 1}天`))
            const list = rawData[0].map((_, index) => rawData.map(row => row[index]))
            this.expData = {
                header,
                list
            }

            this.statistics = {
                firstCol: ['', '实验室允许不精密度', '实验不精密度'],
                // firstCol: ['参数/模型', '实验室允许不精密度', '实验不精密度', '不精密度验证'],
                header: ['重复（批内）不精密度', '总（室内）不精密度'],
                list: [
                    [
                        { main: 'σ', sub: 'r' },
                        { main: 'CV', sub: '' },
                        { main: 'σ', sub: '1' },
                        { main: 'CV', sub: '' }
                    ],
                    [allowableSr, allowableCvr, allowableS1, allowableCv1],
                    [
                        { main: 'S', sub: 'r' },
                        { main: 'CV', sub: 'r' },
                        { main: 'S', sub: '1' },
                        { main: 'CV', sub: '1' }
                    ],
                    [sr, cvr, s1, cv1]
                ]
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .experimental-report {
            position: relative;
            .content {
                padding: 10px;
                position: relative;
                .data-table {
                    max-height: 400px;
                    overflow: auto;
                    // padding: 0 5px 5px 0;
                    .table-header {
                        position: sticky;
                        top: 0;
                        background: #fff;
                        display: flex;
                        .th {
                            font-size: 14px;
                            font-weight: bold;
                            text-align: center;
                            height: 28px;
                            line-height: 28px;
                            padding: 2px 6px;
                            border: 1px solid #ddd;
                            border-right: none;
                            flex: 1;
                            flex-basis: 0;
                            &:first-child {
                                flex: 0 0 60px
                            }
                            &:last-child {
                                border-right: 1px solid #ddd;
                            }
                        }
                    }
                    .table-content {
                        .tr {
                            display: flex;
                            font-size: 14px;
                            text-align: center;
                            border: 1px solid #ddd;
                            border-top: none;
                            .td {
                                flex: 1;
                                flex-basis: 0;
                                height: 28px;
                                line-height: 28px;
                                padding: 2px 6px;
                                border-right: 1px solid #ddd;
                                &:first-child {
                                    flex: 0 0 60px
                                }
                                &:last-child {
                                    border-right: none;
                                }
                            }
                        }
                    }
                }
                .statistical-table {
                    display: flex;
                    .first-col {
                        width: 150px;
                        .col-cell {
                            height: 61px;
                            line-height: 60px;
                            border: 1px solid #ddd;
                            border-top: none;
                            border-right: none;
                            text-align: center;
                            padding: 2px 6px;
                            &:first-child {
                                font-weight: bold;
                                height: 28px;
                                line-height: 28px;
                                border-top: 1px solid #ddd;
                            }
                        }
                    }
                    .other-col {
                        flex: 1;
                        flex-basis: 0;
                        .table-header {
                            background: #fff;
                            display: flex;
                            .th {
                                font-size: 14px;
                                font-weight: bold;
                                text-align: center;
                                height: 28px;
                                line-height: 28px;
                                padding: 2px 6px;
                                border: 1px solid #ddd;
                                border-right: none;
                                flex: 1;
                                flex-basis: 0;
                                &:last-child {
                                    border-right: 1px solid #ddd;
                                }
                            }
                        }
                        .table-content {
                            .tr {
                                display: flex;
                                font-size: 14px;
                                text-align: center;
                                border: 1px solid #ddd;
                                border-top: none;
                                .td {
                                    flex: 1;
                                    flex-basis: 0;
                                    height: 28px;
                                    line-height: 28px;
                                    padding: 2px 6px;
                                    border-right: 1px solid #ddd;
                                    &:last-child {
                                        border-right: none;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
