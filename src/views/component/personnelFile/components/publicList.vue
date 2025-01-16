<template>
    <div class="publicList20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>{{ planeData.title }}</span>
        </div>
        <div class="hand-btn" />
        <div class="contentAll">
            <el-table
                v-if="planeData.hasOwnProperty('config')"
                :ref="'reviewTable'+tabName"
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
                    v-for="(item,i) in planeData.config.config"
                    :key="tabName+i"
                    :label="item.label"
                    :min-width="item.width"
                >
                    <template slot-scope="scope">
                        <el-tooltip v-if="item.type==='text'" class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                            <div slot="content" style="max-width:200px">
                                <div v-html="scope.row.hasOwnProperty(item.field) > 0 ? scope.row[item.field]:'/'" />
                            </div>
                            <p class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty(item.field) > 0 ? scope.row[item.field]:'/' }}</p>
                        </el-tooltip>
                        <div v-else-if="item.type==='user'||item.type==='position'" class="grid-content bg-purple-light">
                            <ibps-user-selector
                                v-model="scope.row[item.field]"
                                :type="item.type"
                                readonly-text="text"
                                :disabled="true"
                                :multiple="false"
                                size="mini"
                                style="width:100%"
                                :filter="filter"
                                filtrate
                            />
                        </div>
                        <div v-else-if="item.type==='file'" class="grid-content bg-purple-light">
                            <ibps-attachment
                                v-model="scope.row[item.field]"
                                :download="true"
                                multiple
                                accept="*"
                                :readonly="true"
                                style="width:100%"
                                limlt="5"
                            />
                        </div>
                        <div v-else-if="item.type==='dialog'" class="grid-content bg-purple-light">
                            <ibps-custom-dialog
                                v-model="scope.row[item.field]"
                                size="mini"
                                :template-key="item.dialogKey"
                                multiple
                                :disabled="true"
                                type="dialog"
                                class="custom-dialog"
                                placeholder="请选择"
                                icon="el-icon-search"
                                style="width:100%"
                            />
                        </div>
                        <el-tooltip v-else-if="item.type==='enumeration'" class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                            <div slot="content" style="max-width:200px">
                                <div v-html="scope.row.hasOwnProperty(item.field) > 0 ? enumeratedArray[item.assemble][scope.row[item.field]]:'/'" />
                            </div>
                            <p class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty(item.field) > 0 ? enumeratedArray[item.assemble][scope.row[item.field]]:'/' }}</p>
                        </el-tooltip>
                        <div v-else>/</div>

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
import ibpsUserSelector from '@/business/platform/org/selector'

export default {
    components: {
        IbpsAttachment,
        dialogDeltail,
        ibpsUserSelector,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')

    },
    props: {
        planeData: {
            type: Object,
            default: function () {
                return {}
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
        },
        tabName: {
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
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            isShowTooltip: true,
            enumeratedArray: {
                numberBoolean: {
                    '0': '否',
                    '1': '是'
                }
            }

        }
    },
    watch: {
        planeData: {
            handler: function (val, oldVal) {
                // eslint-disable-next-line no-undef
                this.nowData = structuredClone(val.data || [])
                this.nowDataObj = { nowData: [...this.nowData] }
            },
            deep: true,
            immediate: true
        },
        btnType: {
            handler: function (val, oldVal) {
                if (val === 'exitEdit') {
                    // eslint-disable-next-line no-undef
                    this.nowData = structuredClone(this.planeData.data || [])
                    this.nowDataObj = { nowData: [...this.nowData] }
                }
                // else if (val === 'save' || val === 'temporaryStorage' || val === 'submit') {
                // }
            },
            deep: true
        }
    },
    created () {
        setTimeout(() => {
            console.log(this.planeData, 'ttttttt')
        }, 2000)
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
            // console.log(`当前页: ${val}`)
            this.$refs.reviewTableZWLW.$parent.$parent.$parent.$parent.$parent.tabSetData(val)
        },
        handleClick (val) {
            this.dialogDetails = true
            this.dialogData = this.planeData.config.dialog
            this.dialogData.forEach((item, i) => {
                if (item.length > 1) {
                    item.forEach(it => {
                        it.contant = val[it.field]
                    })
                } else {
                    item[0].contant = val[item[0].field]
                }
            })
            console.log(this.dialogData)
        },
        changeDetails (val) {
            this.dialogDetails = val
        }
    }
}
</script>
<style lang="scss" scoped>
.publicList20241107{
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
