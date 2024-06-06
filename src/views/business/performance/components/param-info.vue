<template>
    <div class="info-container">
        <div class="info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>性能验证实验参数</span>
            </div>
            <div v-if="pageInfo" class="form-container">
                <el-row :gutter="20" class="form-row">
                    <el-col v-if="isShow('specimensNum')" :span="12">
                        <el-form-item :label="getAttrs('specimensNum', 'label', false)" prop="shiYanCanShu.specimensNum" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.specimensNum"
                                type="number"
                                :min="getAttrs('specimensNum', 'min')"
                                :max="getAttrs('specimensNum', 'max')"
                                :step="getAttrs('specimensNum', 'step')"
                                :precision="getAttrs('specimensNum', 'precision')"
                                :disabled="readonly"
                                placeholder="请输入"
                                @change="handleNumChange"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="isShow('repeatNum')" :span="12">
                        <el-form-item :label="getAttrs('repeatNum', 'label', false)" prop="shiYanCanShu.repeatNum" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.repeatNum"
                                type="number"
                                :min="getAttrs('repeatNum', 'min')"
                                :max="getAttrs('repeatNum', 'max')"
                                :step="getAttrs('repeatNum', 'step')"
                                :precision="getAttrs('repeatNum', 'precision')"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col v-if="isShow('days')" :span="12">
                        <el-form-item :label="getAttrs('days', 'label', false)" prop="shiYanCanShu.days" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.days"
                                type="number"
                                :min="getAttrs('days', 'min')"
                                :max="getAttrs('days', 'max')"
                                :step="getAttrs('days', 'step')"
                                :precision="getAttrs('days', 'precision')"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="isShow('isConvert')" :span="12">
                        <el-form-item :label="getAttrs('isConvert', 'label', false)" prop="shiYanCanShu.isConvert" :show-message="false">
                            <el-radio-group v-model="pageInfo.isConvert" :disabled="readonly">
                                <el-radio-button :label="true">转换</el-radio-button>
                                <el-radio-button :label="false">不转换</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="isShow('methodNum')" :span="12">
                        <el-form-item :label="getAttrs('methodNum', 'label', false)" prop="shiYanCanShu.methodNum" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.methodNum"
                                type="number"
                                :min="getAttrs('methodNum', 'min')"
                                :max="getAttrs('methodNum', 'max')"
                                :step="getAttrs('methodNum', 'step')"
                                :precision="getAttrs('methodNum', 'precision')"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('specimensName')" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item prop="shiYanCanShu.specimensName" :show-message="false" class="inline-item">
                            <template slot="label">
                                <span>{{ getAttrs('specimensName', 'label', false) }}</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="与浓度水平数对应"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-input
                                v-for="(item, index) in pageInfo.specimensNum"
                                :key="index"
                                v-model="pageInfo.specimensName[index]"
                                class="inline-input"
                                size="small"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('targetValue')" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item prop="targetValue" :show-message="false" class="inline-item">
                            <template slot="label">
                                <span>{{ getAttrs('targetValue', 'label', false) }}</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="注：若只填写高低浓度靶值，其余靶值则由系统自动计算。若填写全部浓度靶值，则按具体填写数值计算。"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-input-number
                                v-for="(item, index) in pageInfo.specimensNum"
                                :key="index"
                                v-model="pageInfo.targetValue[index]"
                                type="number"
                                class="inline-number"
                                size="small"
                                :min="0"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('claimValue')" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item prop="claimValue" :show-message="false" class="inline-item">
                            <template slot="label">
                                <span>{{ getAttrs('claimValue', 'label', false) }}</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="与浓度水平名一一对应"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-input-number
                                v-for="(item, index) in pageInfo.specimensNum"
                                :key="index"
                                v-model="pageInfo.claimValue[index]"
                                type="number"
                                class="inline-number"
                                size="small"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('model')" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item :label="getAttrs('model', 'label', false)" prop="shiYanCanShu.model" :show-message="false">
                            <el-checkbox-group v-model="pageInfo.model" :disabled="readonly">
                                <el-checkbox label="批内不精密度">批内不精密度</el-checkbox>
                                <el-checkbox label="总不精密度">总不精密度</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col v-if="isShow('rejectionRate')" :span="12">
                        <el-form-item :label="getAttrs('rejectionRate', 'label', false)" prop="rejectionRate" :show-message="false">
                            <el-select
                                v-model="pageInfo.rejectionRate"
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in rateOption"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col v-if="isShow('standard')" :span="12">
                        <el-form-item :label="getAttrs('standard', 'label', false)" prop="shiYanCanShu.standard" :show-message="false">
                            <el-select
                                v-model="pageInfo.standard"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in standardOption"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="pageInfo.standard === '基于允许总误差TEa' && isShow('tea')" :span="12">
                        <el-form-item label="TEa数值" prop="tea" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.tea"
                                type="number"
                                :min="0"
                                :step="getAttrs('standard', 'step')"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                                @change="handleCvsChange"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="['基于允许总误差TEa'].includes(pageInfo.standard)" :gutter="20" class="form-row">
                    <el-col v-if="isShow('batchCVS')" :span="12">
                        <el-form-item :label="getAttrs('batchCVS', 'label', false)" prop="shiYanCanShu.batchCVS" :show-message="false">
                            <el-select
                                v-model="pageInfo.batchCVS"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                                @change="handleCvsChange"
                            >
                                <el-option
                                    v-for="(item, index) in batchOption"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="isShow('dailyCVS')" :span="12">
                        <el-form-item :label="getAttrs('dailyCVS', 'label', false)" prop="shiYanCanShu.dailyCVS" :show-message="false">
                            <el-select
                                v-model="pageInfo.dailyCVS"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                                @change="handleCvsChange"
                            >
                                <el-option
                                    v-for="(item, index) in batchOption"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="pageInfo.standard === '基于厂商声明参数'" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item prop="shiYanCanShu.allowableSDr" :show-message="false" class="inline-item">
                            <template slot="label">
                                <!-- <span>{{ getAttrs('allowableSDr', 'label', false) }}</span> -->
                                <span>重复（批内）</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="与浓度水平名一一对应"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-input-number
                                v-for="(item, index) in pageInfo.specimensNum"
                                :key="index"
                                v-model="pageInfo.allowableSDr[index]"
                                type="number"
                                class="inline-number"
                                size="small"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="pageInfo.standard === '基于厂商声明参数'" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item prop="shiYanCanShu.allowableSDl" :show-message="false" class="inline-item">
                            <template slot="label">
                                <!-- <span>{{ getAttrs('allowableSDl', 'label', false) }}</span> -->
                                <span>期间（批间）</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="与浓度水平名一一对应"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-input-number
                                v-for="(item, index) in pageInfo.specimensNum"
                                :key="index"
                                v-model="pageInfo.allowableSDl[index]"
                                type="number"
                                class="inline-number"
                                size="small"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="0" :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="数值" prop="shiYanCanShu.batchCVSValue" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.batchCVSValue"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数值" prop="shiYanCanShu.dailyCVSValue" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.dailyCVSValue"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col v-if="isShow('allowableR2')" :span="12">
                        <el-form-item :label="getAttrs('allowableR2', 'label', false)" prop="shiYanCanShu.allowableR2" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.allowableR2"
                                type="number"
                                :min="getAttrs('allowableR2', 'min')"
                                :max="getAttrs('allowableR2', 'max')"
                                :step="getAttrs('allowableR2', 'step')"
                                :precision="getAttrs('allowableR2', 'precision')"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col v-if="isShow('rangeValue')" :span="12">
                        <el-form-item prop="shiYanCanShu.rangeValue" :show-message="false">
                            <template slot="label">
                                <span>{{ getAttrs('rangeValue', 'label', false) }}</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="注：填写范围为0.00~1.00，若值为0.10，则可接受范围为：90%~110%"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-input-number
                                v-model="pageInfo.rangeValue"
                                type="number"
                                :min="getAttrs('rangeValue', 'min')"
                                :max="getAttrs('rangeValue', 'max')"
                                :step="getAttrs('rangeValue', 'step')"
                                :precision="getAttrs('rangeValue', 'precision')"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import { standardOption, batchOption, rangeOption, rateOption } from '../constants/index'
export default {
    props: {
        formId: {
            type: String,
            default: ''
        },
        info: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        },
        configData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            standardOption,
            batchOption,
            rangeOption,
            rateOption,
            pageInfo: null,
            nameTagValue: '',
            targetTagValue: '',
            nameTagVisible: false,
            targetTagVisible: false,
            paramsList: this.configData.map(i => ({ key: i.key, visible: i.isVisible }))
        }
    },
    watch: {
        pageInfo: {
            handler (val, oldVal) {
                this.$emit('updateParams', val)
            },
            deep: true
        }
    },
    mounted () {
        const temp = JSON.parse(JSON.stringify(this.info))
        // 填充默认值
        this.configData.forEach(item => {
            if (this.$utils.isNotEmpty(item.default) && this.$utils.isEmpty(temp[item.key])) {
                temp[item.key] = item.default
            }
        })
        if (!this.formId) {
            temp.specimensName = temp.specimensNum ? Array.from({ length: temp.specimensNum }, (_, index) => `水平${index + 1}`) : []
            temp.allowableSDr = []
            temp.allowableSDl = []
            temp.targetValue = []
            temp.claimValue = []
            temp.range = temp.rangeValue ? [100 - parseFloat(temp.rangeValue) * 100, 100 + parseFloat(temp.rangeValue) * 100] : []
        }
        this.pageInfo = temp || { model: [], targetValue: [], specimensName: [] }
    },
    methods: {
        isShow (props) {
            const t = this.paramsList.find(i => i.key === props)
            return t && t.visible
        },
        getAttrs (props, attr, isNumber = true) {
            const t = this.configData.find(i => i.key === props)
            const res = t ? t[attr] : ''
            return isNumber ? Number(res) : res
        },
        handleNumChange (v) {
            const { specimensName: s = [] } = this.pageInfo || {}
            if (v > s.length) {
                this.pageInfo.specimensName = s.concat(Array.from({ length: v - s.length }, (_, index) => `水平${index + s.length + 1}`))
            } else {
                this.pageInfo.specimensName.splice(v)
                this.pageInfo.allowableSDr.splice(v)
                this.pageInfo.allowableSDl.splice(v)
                this.pageInfo.targetValue.splice(v)
                this.pageInfo.claimValue.splice(v)
            }
        },
        handleCvsChange () {
            const { batchCVS, dailyCVS, tea } = this.pageInfo
            this.pageInfo.batchCVSValue = parseFloat(tea * batchCVS)
            this.pageInfo.dailyCVSValue = parseFloat(tea * dailyCVS)
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .info-item {
            .form-container {
                padding: 10px;
                background: #f5f5f5;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                overflow: hidden;
                .form-row {
                    padding: 5px 0;
                    border-top: 1px solid #e6e6e6;
                    &:first-child {
                        border-top: none;
                        padding-top: 0;
                    }
                    &:last-child {
                        padding-bottom: 0;
                    }
                    &:empty {
                        display: none;
                    }
                    .inline-item {
                        ::v-deep {
                            .el-form-item__content {
                                display: flex;
                                justify-content: flex-start;
                                flex-wrap: wrap;
                                > .el-input {
                                    max-width: 120px;
                                    margin-right: 10px;
                                    &:last-of-type {
                                        margin-right: 0;
                                    }
                                }
                            }
                        }
                        .inline-input {
                            width: 120px;
                            vertical-align: bottom;
                        }
                        .inline-number {
                            width: 120px;
                            margin-right: 10px;
                            &:last-of-type {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
