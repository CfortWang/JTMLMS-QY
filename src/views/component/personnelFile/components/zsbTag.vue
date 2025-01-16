<template>
    <div class="zsb20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>资格职称证书</span>
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
                    label="证书名称"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.zhengShuMingC" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("zhengShuMingC") > 0 ? scope.row.zhengShuMingC:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("zhengShuMingC") > 0 ? scope.row.zhengShuMingC:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.zhengShuMingC'" :rules="rules.school">
                                <el-input
                                    v-model="scope.row.zhengShuMingC"
                                    type="text"
                                    placeholder="请输入"
                                    show-word-limit
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="证件号"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.zhengJianHao" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("zhengJianHao") > 0 ? scope.row.zhengJianHao:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("zhengJianHao") > 0 ? scope.row.zhengJianHao:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.zhengJianHao'" :rules="rules.school">
                                <el-input
                                    v-model="scope.row.zhengJianHao"
                                    type="text"
                                    placeholder="请输入"
                                    show-word-limit
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="发证单位"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.faZhengDanWei" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("faZhengDanWei") > 0 ? scope.row.faZhengDanWei:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("faZhengDanWei") > 0 ? scope.row.faZhengDanWei:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.faZhengDanWei'" :rules="rules.optional">
                                <el-input
                                    v-model="scope.row.faZhengDanWei"
                                    type="text"
                                    placeholder="请输入"
                                    show-word-limit
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="发证日期"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.faZhengShiJian" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("faZhengShiJian") > 0 ? scope.row.faZhengShiJian:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("faZhengShiJian") > 0 ? scope.row.faZhengShiJian:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.faZhengShiJian'" :rules="rules.bianzhiriqi">
                                <el-date-picker
                                    v-model="scope.row.faZhengShiJian"
                                    type="date"
                                    size="mini"
                                    class=""
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择发证日期"
                                />
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="档案保存"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div v-if="judgeTag()">
                            <el-tooltip class="item" effect="dark" placement="top" :disabled="!isShowTooltip">
                                <div slot="content" style="max-width:200px">
                                    <div v-html="scope.row.dangAnBaoCun" />
                                </div>
                                <div class="ellipsis" @mouseover="inputOnMouseOver($event)">{{ scope.row.hasOwnProperty("dangAnBaoCun") > 0 ? scope.row.dangAnBaoCun:'/' }}</div>
                            </el-tooltip>
                            <!-- <div>{{ scope.row.hasOwnProperty("dangAnBaoCun") > 0 ? scope.row.dangAnBaoCun:'/' }}</div> -->
                        </div>
                        <div v-else class="grid-content">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.dangAnBaoCun'" :rules="rules.school">
                                <el-radio-group v-model="scope.row.dangAnBaoCun">
                                    <el-radio label="复印件">复印件</el-radio>
                                    <el-radio label="原件">原件</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                    label="获奖证书"
                    min-width="15%"
                >
                    <template slot-scope="scope">
                        <div class="grid-content bg-purple-light">
                            <el-form-item :prop="'nowData.'+ (10*(currentPage-1) +scope.$index)+'.huoJiangZhengS'" :rules="rules.attachmentsNum">
                                <ibps-attachment
                                    v-model="scope.row.huoJiangZhengS"
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
            console.log(value)

            if (!value) {
                return callback(new Error('请选择日期'))
            }
            setTimeout(() => {
                const now = this.$common.getDateNow()
                const nowTime = new Date(now).getTime()
                const valueTime = new Date(value).getTime()
                const obj = this.nowData.find(t => t.jieshuriqi === value)
                const ksTime = obj && obj.bianzhiriqi !== null ? new Date(obj.bianzhiriqi).getTime() : ''

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
            rules: {
                bianzhiriqi: [
                    { validator: option.checkTime, trigger: 'change' }
                ],
                jieshuriqi: [
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
                    this.$emit('changeBaseData', val, 'zsb')
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
.zsb20241107{
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
