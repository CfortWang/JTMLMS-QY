<template>
    <div class="jyjl20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>教育经历</span>
        </div>
        <div class="hand-btn" :style="judgeTag()?'height:10px;':'height:5.5%;'">
            <el-button v-if="!judgeTag()" type="primary" size="mini" icon="el-icon-plus" @click="addData">添加</el-button>
            <el-button v-if="!judgeTag()" type="danger" size="mini" icon="el-icon-close" @click="goRemove">删除</el-button>
        </div>
        <!-- <div class="contentAll"> -->
        <el-form ref="nowData" :model="nowDataObj" :rules="rules" label-width="0px" class="contentAll">
            <el-table
                ref="reviewTable"
                :data="nowData.filter((e,m) => Math.floor(m/10)===currentPage-1 )"
                stripe
                height="92%"
                highlight-current-row
                style="width: 99.5%"
                class="review-table blue-header tableCol"
                :row-key="getRowKey"
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
                    label="开始时间"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.kaiShiShiJian" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("kaiShiShiJian") > 0 ? scope.row.kaiShiShiJian:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("kaiShiShiJian") > 0 ? scope.row.kaiShiShiJian:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.kaiShiShiJian'" :rules="rules.kaiShiShiJian">
                                <el-date-picker
                                    v-model="scope.row.kaiShiShiJian"
                                    type="date"
                                    size="mini"
                                    class=""
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择开始时间"
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="结束时间"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.jieShuShiJian" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("jieShuShiJian") > 0 ? scope.row.jieShuShiJian:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("jieShuShiJian") > 0 ? scope.row.jieShuShiJian:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.jieShuShiJian'" :rules="rules.jieShuShiJian">
                                <el-date-picker
                                    v-model="scope.row.jieShuShiJian"
                                    type="date"
                                    size="mini"
                                    class=""
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束时间"
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="学校"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.xueXiao" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("xueXiao") > 0 ? scope.row.xueXiao:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("xueXiao") > 0 ? scope.row.xueXiao:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.xueXiao'" :rules="rules.school">
                                <el-input
                                    v-model="scope.row.xueXiao"
                                    type="text"
                                    placeholder="请输入"
                                    show-word-limit
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="专业"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.zhuanYe" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("zhuanYe") > 0 ? scope.row.zhuanYe:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("zhuanYe") > 0 ? scope.row.zhuanYe:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.zhuanYe'" :rules="rules.optional">
                                <el-input
                                    v-model="scope.row.zhuanYe"
                                    type="text"
                                    placeholder="请输入"
                                    show-word-limit
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="学历学位"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.xueLiXueWei" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("xueLiXueWei") > 0 ? scope.row.xueLiXueWei:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("xueLiXueWei") > 0 ? scope.row.xueLiXueWei:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.xueLiXueWei'" :rules="rules.optional">
                                <el-input
                                    v-model="scope.row.xueLiXueWei"
                                    type="text"
                                    placeholder="请输入"
                                    show-word-limit
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="附件"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div class="grid-content bg-purple-light">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.fuJian'" :rules="rules.attachmentsNum">
                                <ibps-attachment
                                    v-model="scope.row.fuJian"
                                    :download="true"
                                    multiple
                                    accept="*"
                                    :readonly="judgeTag()"
                                    style="width:100%"
                                    limlt="5"
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    v-if="!judgeTag()"
                    fixed="right"
                    label="操作"
                    class-name="handleSty"
                    width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查阅</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <el-pagination
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="nowData.length"
                @current-change="handleCurrentChange"
            />
        </el-form>
    </div>
</template>
<script>
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import option from '../constants/option.js'
export default {
    components: {
        IbpsAttachment
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
            if (!value) {
                return callback(new Error('请选择日期'))
            }
            setTimeout(() => {
                const now = this.$common.getDateNow()
                const nowTime = new Date(now).getTime()
                const valueTime = new Date(value).getTime()
                const obj = this.nowData.find(t => t.jieShuShiJian === value)
                const ksTime = obj && obj.kaiShiShiJian !== null ? new Date(obj.kaiShiShiJian).getTime() : ''

                if (ksTime === '') {
                    callback(new Error('请先选择开始时间'))
                } else if (nowTime < valueTime) {
                    callback(new Error('请选择小于当前日期的时间'))
                } else if (ksTime >= valueTime) {
                    callback(new Error('请选择大于开始日期的时间'))
                } else {
                    callback()
                }
            }, 100)
        }
        return {
            activeName: 'first',
            nowData: [],
            nowDataObj: {},
            rules: {
                kaiShiShiJian: [
                    { validator: option.checkTime, trigger: 'change' }
                ],
                jieShuShiJian: [
                    { validator: checkTimeJS, trigger: 'change' }
                ],
                school: [
                    { validator: option.checkLength, trigger: 'blur' }
                ],
                optional: [
                    { validator: option.optional, trigger: 'blur' }
                ],
                attachmentsNum: [
                    { validator: option.attachmentsNum, trigger: 'change' }
                ]
            },
            multipleSelection: [],
            currentPage: 1,
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
                } else if (val === 'save' || val === 'temporaryStorage' || val === 'submit' || val === 'sendBack' || val === 'agree') {
                    this.submitForm('nowData', this.nowData)
                }
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
        judgeTag () {
            // return this.planeData.length>0&& this.btnShow === true && this.buttonType!==1 ? true : false
            return !!(this.btnShow === true && this.buttonType !== 1 && this.buttonType !== 4)
        },
        submitForm (formName, val) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('changeBaseData', val, 'jyjl')
                    // alert('submit!')
                    this.$emit('changeButtonShow', this.$parent.$parent.$parent.btnShow)
                } else {
                    console.log('error submit!!')
                    this.$emit('tipsShowTab', true)
                    return false
                }
            })
        },
        addData () {
            console.log(this.nowData.length % 10, '1111111111')
            if (this.nowData.length % 10 === 0) {
                this.currentPage = (this.nowData.length / 10) + 1
            }
            const mid = { uuid: this.$common.generateUUID() }
            this.nowData.push(mid)
            this.nowDataObj = { nowData: [...this.nowData] }
        },
        goRemove () {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                })
                return
            }
            this.nowData = this.nowData.filter(item => !this.multipleSelection.includes(item))
            this.nowDataObj = { nowData: [...this.nowData] }
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
        },
        getRowKey (row) {
            if (row.id) {
                return row.id
            } else {
                return row.uuid
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.jyjl20241107{
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
        height: 5.5%;
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
