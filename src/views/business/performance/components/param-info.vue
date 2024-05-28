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
                                class="input-new-tag"
                                size="small"
                                :disabled="readonly"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('targetValue')" :gutter="20" class="form-row tag-row">
                    <el-col :span="24">
                        <el-form-item prop="targetValue" :show-message="false">
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
                            <el-tag
                                v-for="(tag, index) in pageInfo.targetValue"
                                :key="index"
                                closable
                                size="medium"
                                class="params-tag"
                                :disable-transitions="false"
                                :disabled="readonly"
                                @close="handleTagDelete(tag, 'targetValue')"
                            >
                                {{ tag }}
                            </el-tag>
                            <el-input
                                v-if="targetTagVisible"
                                ref="targetValue"
                                v-model="targetTagValue"
                                class="input-new-tag"
                                size="small"
                                :disabled="readonly"
                                @keyup.enter.native="handleTagConfirm('targetValue')"
                                @blur="handleTagConfirm('targetValue')"
                            />
                            <el-button
                                v-show="pageInfo.targetValue && pageInfo.targetValue.length < pageInfo.specimensNum || !pageInfo.specimensNum"
                                class="button-new-tag"
                                size="mini"
                                @click="showTagEdit('targetValue')"
                            >+ 添 加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('claimValue')" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item :label="getAttrs('claimValue', 'label', false)" prop="claimValue" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.claimValue"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
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
                    <el-col v-if="isShow('range')" :span="12">
                        <el-form-item :label="getAttrs('range', 'label', false)" prop="shiYanCanShu.range" :show-message="false">
                            <el-select
                                v-model="pageInfo.range"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(item, index) in rangeOption"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col v-if="isShow('claimValue')" :span="12">
                        <el-form-item :label="getAttrs('claimValue', 'label', false)" prop="claimValue" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.claimValue"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col> -->
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
                    <el-col v-if="pageInfo.standard === '允许总误差Tea' && isShow('tea')" :span="12">
                        <el-form-item label="TEa数值" prop="tea" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.tea"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                                @change="handleCvsChange"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="pageInfo.standard === '允许总误差Tea'" :gutter="20" class="form-row">
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
                        <el-form-item label="日间CVs" prop="shiYanCanShu.dailyCVS" :show-message="false">
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
                <el-row v-if="pageInfo.standard === '厂商参数'" :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="重复（批内）标准差" prop="shiYanCanShu.allowableSDr" label-width="140px" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.allowableSDr"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="期间（实验室）标准差" prop="shiYanCanShu.allowableSDl" label-width="155px" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.allowableSDl"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
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
            </div>
        </div>
    </div>
</template>
<script>
import { standardOption, batchOption, rangeOption } from '../constants/index'
export default {
    props: {
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
        temp.specimensName = temp.specimensNum ? Array.from({ length: temp.specimensNum }, (_, index) => `水平${index + 1}`) : []
        this.pageInfo = temp || { model: [], targetValue: [], specimensName: [], claimValue: [] }
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
            }
        },
        handleCvsChange () {
            const { batchCVS, dailyCVS, tea } = this.pageInfo
            this.pageInfo.batchCVSValue = parseFloat(tea * batchCVS)
            this.pageInfo.dailyCVSValue = parseFloat(tea * dailyCVS)
        },
        handleTagDelete (tag, type) {
            this.pageInfo[type].splice(this.pageInfo[type].indexOf(tag), 1)
        },
        handleTagConfirm (type) {
            const typeMap = {
                specimensName: 'nameTagValue',
                targetValue: 'targetTagValue'
            }
            const visibleMap = {
                specimensName: 'nameTagVisible',
                targetValue: 'targetTagVisible'
            }
            if (this[typeMap[type]]) {
                this.pageInfo[type].push(this[typeMap[type]])
            }
            this[visibleMap[type]] = false
            this[typeMap[type]] = ''
        },
        showTagEdit (type) {
            if (!this.pageInfo.specimensNum) {
                return this.$message.warning('请先填写浓度水平数！')
            }
            const typeMap = {
                specimensName: 'nameTagVisible',
                targetValue: 'targetTagVisible'
            }
            if (this.pageInfo.specimensNum <= this.pageInfo[type].length) {
                return this.$message.warning('已达最大浓度水平数')
            }
            this[typeMap[type]] = true
            this.$nextTick(_ => {
                this.$refs[type].$refs.input.focus()
            })
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
                                .el-input {
                                    max-width: 120px;
                                    margin-right: 10px;
                                    &:last-of-type {
                                        margin-right: 0;
                                    }
                                }
                            }
                        }
                    }
                }
                .tag-row {
                    ::v-deep {
                        .el-form-item {
                            .el-form-item__content {
                                .el-input {
                                    width: 100px;
                                }
                            }
                        }
                    }
                    .params-tag{
                        height: 32px;
                        line-height: 30px;
                        margin-right: 10px;
                        &:last-of-type{
                            margin-right: 0;
                        }
                        ::v-deep {
                            .el-icon-close {
                                top: 0px;
                            }
                        }
                    }
                    .button-new-tag {
                        height: 32px;
                        line-height: 30px;
                        padding-top: 0;
                        padding-bottom: 0;
                        margin-left: 10px;
                    }
                    .input-new-tag {
                        width: 100px;
                        vertical-align: bottom;
                    }
                }
            }
        }
    }
</style>
