<template>
    <div class="jxjyxmxshdglb20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>继续教育项目/学术活动</span>
        </div>
        <div class="hand-btn" />
        <div class="contentAll">
            <el-table
                ref="reviewTableJXJY"
                :data="nowData.filter((e,m) => Math.floor(m/10)===currentPage-1 )"
                stripe
                height="92%"
                highlight-current-row
                style="width: 99.5%"
                class="review-table blue-header tableCol"
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    min-width="2%"
                />
                <el-table-column
                    type="index"
                    label="序号"
                    min-width="5%"
                />
                <el-table-column
                    label="项目编号"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("xiangMuBianHao") > 0 ? scope.row.xiangMuBianHao:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="会议名称"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("huiYiMingCheng") > 0 ? scope.row.huiYiMingCheng:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="项目级别"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("xueFenJiBie") > 0 ? scope.row.xueFenJiBie:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="学分"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("xueFen") > 0 ? scope.row.xueFen:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="举办日期"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("juBanShiJian") > 0 ? scope.row.juBanShiJian:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="会议通知"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div class="grid-content bg-purple-light">
                            <ibps-attachment
                                v-model="scope.row.huiYiTongZhiS"
                                :download="true"
                                multiple
                                accept="*"
                                :readonly="true"
                                style="width:100%"
                                limlt="5"
                            />
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    class-name="handleSty"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleClick(scope.row)">查阅</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="nowData.length"
                @current-change="handleCurrentChange"
            />
        </div>
        <dialog-deltail :dialog-details="dialogDetails" :dialog-data="dialogData" @changeDetails="changeDetails" />
    </div>
</template>
<script>
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import option from '../constants/option.js'
import dialogDeltail from './dialogDeltail'

export default {
    components: {
        IbpsAttachment,
        dialogDeltail
    },
    props: {
        planeData: {
            type: Array,
            default: function () {
                return []
            }
        },
        buttonType: {
            type: Number,
            default: 0
        },
        btnShow: {
            type: Boolean,
            default: true
        },
        btnType: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            activeName: 'first',
            nowData: [],
            nowDataObj: {},
            multipleSelection: [],
            currentPage: 1,
            dialogDetails: false,
            dialogData: []
        }
    },
    watch: {
        planeData: {
            handler: function (val, oldVal) {
                // eslint-disable-next-line no-undef
                this.nowData = structuredClone(val)
                this.nowDataObj = { nowData: [...this.nowData] }
            },
            deep: true,
            immediate: true
        },
        btnType: {
            handler: function (val, oldVal) {
                if (val === 'exitEdit') {
                    // eslint-disable-next-line no-undef
                    this.nowData = structuredClone(this.planeData)
                    this.nowDataObj = { nowData: [...this.nowData] }
                }
                // else if (val === 'save' || val === 'temporaryStorage' || val === 'submit') {
                // }
            },
            deep: true
        }
    },
    methods: {
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleCurrentChange (val) {
            // console.log(`当前页: ${val}`)
            this.$refs.reviewTableJXJY.$parent.$parent.$parent.$parent.$parent.tabSetData(val)
        },
        handleClick (val) {
            this.dialogDetails = true
            this.dialogData = [
                [{ name: '项目编号', contant: val.xiangMuBianHao, type: 'text' }, { name: '学分', contant: val.xueFen, type: 'text' }],
                [{ name: '项目级别', contant: val.xueFenJiBie, type: 'text' }, { name: '举办日期', contant: val.juBanShiJian, type: 'text' }],
                [{ name: '全部作者', contant: val.quanBuZuoZhe, type: 'text' }, { name: '举办地点', contant: val.juBanDiDian, type: 'text' }],
                [{ name: '会议名称', contant: val.huiYiMingCheng, type: 'text' }, { name: '合作单位', contant: val.heZuoDanWei, type: 'text' }],
                [{ name: '会议通知', contant: val.huiYiTongZhiS, type: 'file' }, { name: '活动现场照片', contant: val.huoDXCZPSC, type: 'file' }],
                [{ name: '备注', contant: val.childBeiZhu, type: 'text' }]
            ]
            // console.log(this.dialogData)
        },
        changeDetails (val) {
            this.dialogDetails = val
        }
    }
}
</script>
<style lang="scss" scoped>
.jxjyxmxshdglb20241107{
    font-size: 12px;
    color: #2f2f36;
    .titleAll{
        ::v-deep .el-divider--vertical{
            width: 4px;
            height: 1.4em;
            background-color: #86c3c7;
            border-radius: 2px;
            margin-left: 0;
            margin-right: 15px;
        }
        span{
            font-size: 15px;
            font-weight: 700;
            vertical-align: text-top;
        }
    }
    .hand-btn{
        width: 99.5%;
        height: 10px;
        text-align: right;
        margin: 0.5% 0;
    }
    .contentAll{
        height: 85%;
        overflow-y: auto;
        ::v-deep .ibps-attachment-selector{
            min-width: 0;
        }
        .tableCol{
            height: 92%;
            overflow-y: auto;
            ::v-deep .el-table__fixed-right{
                .el-table__fixed-body-wrapper{
                    .el-table__body{
                        .el-table__row{
                            .handleSty{
                                text-align: center;
                            }
                        }
                    }
                }
                .el-table__fixed-header-wrapper{
                    .el-table__header{
                        .handleSty{
                            text-align: center;
                        }
                    }
                }
            }
            ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
                display: none; /* for Chrome, Safari, and Opera */
            }

            ::v-deep .el-table__body-wrapper {
                -ms-overflow-style: none;  /* for Internet Explorer, Edge */
                scrollbar-width: none;  /* for Firefox */
            }
            ::v-deep .el-table__fixed-right-patch{
                width: 0 !important;
            }
        }
        .tableCol::-webkit-scrollbar{
            display: none;
        }
        .grid-content {
            ::v-deep .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--date{
                width: 100%;
            }
        }
    }
}

</style>
