<template>
    <div class="kjhjcgglb20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>获奖成果</span>
        </div>
        <div class="hand-btn" />
        <div class="contentAll">
            <el-table
                ref="reviewTableHJCG"
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
                    label="奖励项目名称"
                    min-width="25%"
                >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                            <div slot="content" style="max-width:200px">
                                <div v-html="scope.row.jiangLiXiangMu" />
                            </div>
                            <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("jiangLiXiangMu") > 0 ? scope.row.jiangLiXiangMu:'/' }}</div>
                        </el-tooltip>
                        <!-- {{ scope.row.hasOwnProperty("jiangLiXiangMu") > 0 ? scope.row.jiangLiXiangMu:'/' }} -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="奖励类型"
                    min-width="20%"
                >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                            <div slot="content" style="max-width:200px">
                                <div v-html="scope.row.jiangLiLeiXing" />
                            </div>
                            <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("jiangLiLeiXing") > 0 ? scope.row.jiangLiLeiXing:'/' }}</div>
                        </el-tooltip>
                        <!-- {{ scope.row.hasOwnProperty("jiangLiLeiXing") > 0 ? scope.row.jiangLiLeiXing:'/' }} -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="获奖日期"
                    min-width="20%"
                >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                            <div slot="content" style="max-width:200px">
                                <div v-html="scope.row.huoJiangShiJia" />
                            </div>
                            <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("huoJiangShiJia") > 0 ? scope.row.huoJiangShiJia:'/' }}</div>
                        </el-tooltip>
                        <!-- {{ scope.row.hasOwnProperty("huoJiangShiJia") > 0 ? scope.row.huoJiangShiJia:'/' }} -->
                    </template>
                </el-table-column>
                <el-table-column
                    label="获奖证书"
                    min-width="25%"
                >
                    <template slot-scope="scope">
                        <div class="grid-content bg-purple-light">
                            <ibps-attachment
                                v-model="scope.row.shangCHJZS"
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
            dialogData: [],
            isShowTooltip: true
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
        inputOnMouseOver (e) {
            const { offsetWidth, scrollWidth } = e.target || {}
            this.isShowTooltip = offsetWidth < scrollWidth
            console.log(this.isShowTooltip)
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
            this.$refs.reviewTableHJCG.$parent.$parent.$parent.$parent.$parent.tabSetData(val)
        },
        handleClick (val) {
            this.dialogDetails = true
            this.dialogData = [
                [{ name: '奖励项目名称', contant: val.jiangLiXiangMu, type: 'text' }, { name: '奖励类型', contant: val.jiangLiLeiXing, type: 'text' }],
                [{ name: '获奖编号', contant: val.huoJiangBianHao, type: 'text' }, { name: '获奖日期', contant: val.huoJiangShiJia, type: 'text' }],
                [{ name: '全部获奖者', contant: val.quanBuHuoJiang, type: 'text' }, { name: '个人排名', contant: val.childGeRenPaiMing, type: 'text' }],
                [{ name: '单位', contant: val.danWei, type: 'text' }, { name: '单位排名', contant: val.danWeiPaiMing, type: 'text' }],
                [{ name: '获奖证书', contant: val.shangCHJZS, type: 'file' }, { name: '备注', contant: val.childBeiZhu, type: 'text' }]
            ]
            console.log(this.dialogData)
        },
        changeDetails (val) {
            this.dialogDetails = val
        }
    }
}
</script>
<style lang="scss" scoped>
.kjhjcgglb20241107{
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
        .ellipsis {
            white-space: nowrap; /* 确保文本不换行 */
            overflow: hidden; /* 隐藏超出容器的文本 */
            text-overflow: ellipsis; /* 显示省略号 */
        }
    }
}

</style>
