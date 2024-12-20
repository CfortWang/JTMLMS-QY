<template>
    <div class="kphdglb20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>科研项目</span>
        </div>
        <div class="hand-btn" />
        <div class="contentAll">
            <el-table
                ref="reviewTableKPHD"
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
                    label="科普编号"
                    min-width="16%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("kePuBianHao") > 0 ? scope.row.kePuBianHao:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动时间"
                    min-width="16%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("huoDongShiJian") > 0 ? scope.row.huoDongShiJian:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="科普形式"
                    min-width="16%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("kePuXingShi") > 0 ? scope.row.kePuXingShi:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="备注"
                    min-width="21%"
                >
                    <template slot-scope="scope">
                        {{ scope.row.hasOwnProperty("beiZhu") > 0 ? scope.row.beiZhu:'/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="附件"
                    min-width="21%"
                >
                    <template slot-scope="scope">
                        <div class="grid-content bg-purple-light">
                            <ibps-attachment
                                v-model="scope.row.fuJian"
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
        const checkTimeJS = (rule, value, callback) => {
            console.log(value)

            if (!value) {
                return callback(new Error('请选择日期'))
            }
            setTimeout(() => {
                const now = this.$common.getDateNow()
                const nowTime = new Date(now).getTime()
                const valueTime = new Date(value).getTime()
                const obj = this.nowData.find(t => t.jieshuriqi === value)
                const ksTime = obj.bianzhiriqi !== null ? new Date(obj.bianzhiriqi).getTime() : ''

                if (ksTime === '') {
                    callback(new Error('请先选择开始时间'))
                } else if (nowTime < valueTime) {
                    callback(new Error('请选择小于当前日期的时间'))
                } else if (ksTime >= valueTime) {
                    callback(new Error('请选择大于开始日期的时间'))
                }
            }, 100)
        }
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
            console.log(this.$refs, `当前页: ${val}`)
            this.$refs.reviewTableKPHD.$parent.$parent.$parent.$parent.$parent.tabSetData(val)
        },
        handleClick (val) {
            this.dialogDetails = true
            this.dialogData = [
                [{ name: '科普编号', contant: val.kePuBianHao, type: 'text' }, { name: '开始日期', contant: val.qiZhiShiJian, type: 'text' }],
                [{ name: '科普形式', contant: val.kePuXingShi, type: 'text' }],
                [{ name: '备注', contant: val.beiZhu, type: 'text' }, { name: '附件', contant: val.fuJian, type: 'file' }]
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
.kphdglb20241107{
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
