<template>
    <div class="jbqk20241107">
        <div class="titleAll">
            <el-divider direction="vertical" />
            <span>基本情况</span>
        </div>
        <el-form ref="nowData" :model="nowData" :rules="rules" label-width="0" class="contentAll">
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">建档日期</div></div>
                <div class="colSty" :span="6">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("jianDangRiQi") > 0 ? nowData.jianDangRiQi:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="jianDangRiQi">
                            <el-date-picker
                                v-model="nowData.jianDangRiQi"
                                type="date"
                                size="mini"
                                class=""
                                value-format="yyyy-MM-dd"
                                placeholder="请选择日期"
                            />
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">出生日期</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("chuShengRiQi") > 0 ? nowData.chuShengRiQi:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="chuShengRiQi">
                            <el-date-picker
                                v-model="nowData.chuShengRiQi"
                                type="date"
                                placeholder="请选择日期"
                                value-format="yyyy-MM-dd"
                            />
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">年龄</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("nianLing") > 0 ? nowData.nianLing:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="nianLing">
                            <el-input-number v-model.number="nowData.nianLing" controls-position="right" :min="0" :max="150" size="mini" />
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">最高学历学位</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("zuiGaoXueLiX") > 0 ? nowData.zuiGaoXueLiX:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="zuiGaoXueLiX">
                            <el-select v-model="nowData.zuiGaoXueLiX" placeholder="请选择">
                                <el-option label="博士" value="博士" />
                                <el-option label="硕士" value="硕士" />
                                <el-option label="本科" value="本科" />
                                <el-option label="大专" value="大专" />
                                <el-option label="高中" value="高中" />
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">毕业院校</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("yuanBiYeYuanXi") ? nowData.yuanBiYeYuanXi:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="yuanBiYeYuanXi">
                            <el-input
                                v-model="nowData.yuanBiYeYuanXi"
                                type="text"
                                placeholder="请输入"
                            />
                            <!-- maxlength="200" -->
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">入职日期</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("ruZhiShiJian") > 0 ? nowData.ruZhiShiJian:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="ruZhiShiJian">
                            <el-date-picker
                                v-model="nowData.ruZhiShiJian"
                                type="date"
                                placeholder="入职日期"
                                value-format="yyyy-MM-dd"
                            />
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">职称等级</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("zhiChengDengJi") > 0 ? nowData.zhiChengDengJi:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="zhiChengDengJi">
                            <el-select v-model="nowData.zhiChengDengJi" placeholder="请选择">
                                <el-option label="初级" value="初级" />
                                <el-option label="中级" value="中级" />
                                <el-option label="副高" value="副高" />
                                <el-option label="高级" value="高级" />
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">职称</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("zhiCheng") > 0 ? nowData.zhiCheng:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="zhiCheng">
                            <el-input
                                v-model="nowData.zhiCheng"
                                type="text"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">身份证号码</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("shenFenZhengHao") > 0 ? nowData.shenFenZhengHao:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="shenFenZhengHao">
                            <el-input
                                v-model="nowData.shenFenZhengHao"
                                type="text"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">人员类型</div></div>
                <div class="colSty">
                    <div v-if="judgeTag()" class="grid-content bg-purple-light">
                        <div>{{ nowData.hasOwnProperty("renYuanLeiXing") > 0 ? nowData.renYuanLeiXing:'/' }}</div>
                    </div>
                    <div v-else class="grid-content bg-purple-light">
                        <el-form-item prop="renYuanLeiXing">
                            <el-select v-model="nowData.renYuanLeiXing" placeholder="请选择">
                                <el-option label="合同人员" value="合同人员" />
                                <el-option label="派遣人员" value="派遣人员" />
                                <el-option label="规培人员" value="规培人员" />
                                <el-option label="实习人员" value="实习人员" />
                                <el-option label="进修人员" value="进修人员" />
                                <el-option label="临时人员" value="临时人员" />
                                <el-option label="提供支持性服务的外部人员" value="提供支持性服务的外部人员" />
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">保密协议</div></div>
                <div class="colSty">
                    <div class="grid-content bg-purple-light">
                        <el-form-item prop="baoMiXieYi">
                            <ibps-attachment
                                v-model="nowData.baoMiXieYi"
                                :download="true"
                                multiple
                                accept="*"
                                :readonly="judgeTag()"
                                style="width:100%"
                            />
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">签字图文</div></div>
                <div class="colSty">
                    <div class="grid-content bg-purple-light">
                        <el-form-item prop="qianZiTuWen">
                            <ibps-attachment
                                v-model="nowData.qianZiTuWen"
                                :download="true"
                                accept="*"
                                :readonly="judgeTag()"
                                style="width:100%"
                            />
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">劳动合同或社保证明</div></div>
                <div class="colSty">
                    <div class="grid-content bg-purple-light">
                        <el-form-item prop="sheBao">
                            <ibps-attachment
                                v-model="nowData.sheBao"
                                :download="true"
                                multiple
                                accept="*"
                                :readonly="judgeTag()"
                                style="width:100%"
                            />
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple">承诺函</div></div>
                <div class="colSty">
                    <div class="grid-content bg-purple-light">
                        <el-form-item prop="chengNuoHan">
                            <ibps-attachment
                                v-model="nowData.chengNuoHan"
                                :download="true"
                                multiple
                                accept="*"
                                :readonly="judgeTag()"
                                style="width:100%"
                            />
                        </el-form-item>
                    </div>
                </div>
            </div>
            <div class="rowSty">
                <div class="colSty"><div class="grid-content bg-purple">附件</div></div>
                <div class="colSty">
                    <div class="grid-content bg-purple-light">
                        <el-form-item prop="sheBao">
                            <ibps-attachment
                                v-model="nowData.fujIan"
                                :download="true"
                                multiple
                                accept="*"
                                :readonly="judgeTag()"
                                style="width:100%"
                            />
                        </el-form-item>
                    </div>
                </div>
                <div class="colSty"><div class="grid-content bg-purple" /></div>
                <div class="colSty">
                    <div class="grid-content bg-purple-light" />
                </div>
            </div>
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
        }
    },
    data () {
        return {
            activeName: 'first',
            nowData: {},
            rules: {
                jianDangRiQi: [{ validator: option.checkTime, trigger: 'blur' }],
                chuShengRiQi: [{ validator: option.checkTime, trigger: 'blur' }],
                nianLing: [{ validator: option.checkNianLing, trigger: 'change' }],
                yuanBiYeYuanXi: [{ validator: option.checkLength, trigger: 'blur' }],
                ruZhiShiJian: [{ validator: option.checkTime, trigger: 'blur' }],
                zhiCheng: [{ validator: option.checkLength, trigger: 'blur' }],
                qianZiTuWen: [{ validator: option.attachmentsNumOne, trigger: 'change' }],
                shenFenZhengHao: [{ validator: option.checkLength, trigger: 'blur' }],
                baoMiXieYi: [{ validator: option.attachmentsNum, trigger: 'change' }],
                chengNuoHan: [{ validator: option.attachmentsNum, trigger: 'change' }],
                sheBao: [{ validator: option.attachmentsNum, trigger: 'change' }]
            }
        }
    },
    watch: {
        planeData: {
            handler: function (val, oldVal) {
                console.log(val, 'vvvvvvvvvvvvvvvvvvvvvvvvv')
                // eslint-disable-next-line no-undef
                this.nowData = structuredClone(val)
            },
            deep: true,
            immediate: true
        },
        btnType: {
            handler: function (val, oldVal) {
                // console.log(val, 'vvvvvvvvvvvvvvvvvvvvvvvvv')
                if (val === 'exitEdit') {
                    // eslint-disable-next-line no-undef
                    this.nowData = structuredClone(this.planeData)
                } else if (val === 'save' || val === 'temporaryStorage' || val === 'submit' || val === 'sendBack' || val === 'agree') {
                    this.submitForm('nowData', this.nowData)
                }
            },
            deep: true
        }
    },
    methods: {
        judgeTag () {
            // return this.planeData.length>0&& this.btnShow === true && this.buttonType!==1 ? true : false
            return !!(this.btnShow === true && this.buttonType !== 1 && this.buttonType !== 4)
        },
        submitForm (formName, val) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit('changeBaseData', val, 'ryjbqk')
                    this.$emit('changeButtonShow', this.$parent.$parent.$parent.btnShow)
                } else {
                    this.$emit('tipsShowTab', true)
                    return false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.jbqk20241107{
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

    .contentAll{
        height: 100%;
        overflow-y: auto;
        ::v-deep .ibps-attachment-selector{
            min-width: 0;
        }
        .bg-purple {
            background: #f8f8f8;
        }
        .bg-purple-light {
            border-left: 1px solid #f2f2f2;
            border-right: 1px solid #f2f2f2;
            div{
                width: 100%;
            }
            ::v-deep .el-form-item{
                margin-bottom: 0 !important;
            }
        }
        .bg-purple-last{
            border-left: 1px solid #f2f2f2;
            border-right: none;
        }
        .grid-content {
            min-height: 36px;
            height: 100%;
            padding: 0 5%;
            display: flex;
            align-items: center;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .rowSty{
            display: flex;
            border: 1px solid #f2f2f2;
            border-top: none;
            &:first-child {
                margin-top: 10px;
                border-top: 1px solid #f2f2f2;
            }
            &:last-child {
                margin-bottom: 0;
            }
            .colSty{
                width: 25%;
            }
        }
    }

}
</style>
