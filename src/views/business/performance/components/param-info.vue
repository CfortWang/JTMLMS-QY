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
                </el-row>
                <el-row v-if="isShow('specimensName')" :gutter="20" class="form-row tag-row">
                    <el-col :span="24">
                        <el-form-item prop="specimensName" :show-message="false">
                            <template slot="label">
                                <span>浓度水平名</span>
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="请填写与浓度水平数相同数量的浓度水平名"
                                    placement="top"
                                >
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </template>
                            <el-tag
                                v-for="tag in pageInfo.specimensName"
                                :key="tag"
                                closable
                                size="medium"
                                class="params-tag"
                                :disable-transitions="false"
                                :disabled="readonly"
                                @close="handleTagDelete(tag, 'specimensName')"
                            >
                                {{ tag }}
                            </el-tag>
                            <el-input
                                v-if="nameTagVisible"
                                ref="specimensName"
                                v-model="nameTagValue"
                                class="input-new-tag"
                                size="small"
                                :disabled="readonly"
                                @keyup.enter.native="handleTagConfirm('specimensName')"
                                @blur="handleTagConfirm('specimensName')"
                            />
                            <el-button
                                v-show="pageInfo.specimensName && pageInfo.specimensName.length < pageInfo.specimensNum || !pageInfo.specimensNum"
                                class="button-new-tag"
                                size="mini"
                                @click="showTagEdit('specimensName')"
                            >+ 添 加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('targetValue')" :gutter="20" class="form-row tag-row">
                    <el-col :span="24">
                        <el-form-item prop="targetValue" :show-message="false">
                            <template slot="label">
                                <span>靶值</span>
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
                                v-for="tag in pageInfo.targetValue"
                                :key="tag"
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
                <el-row v-if="isShow('model')" :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="精密度模型" prop="shiYanCanShu.model" :show-message="false">
                            <el-checkbox-group v-model="pageInfo.model" :disabled="readonly">
                                <el-checkbox label="批内不精密度">批内不精密度</el-checkbox>
                                <el-checkbox label="总不精密度">总不精密度</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col v-if="isShow('range')" :span="12">
                        <el-form-item label="频数目标范围" prop="shiYanCanShu.range" :show-message="false">
                            <el-select
                                v-model="pageInfo.range"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                            >
                                <el-option
                                    :key="1"
                                    label="无"
                                    :value="1"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="isShow('claimValue')" :span="12">
                        <el-form-item label="厂商声明差值" prop="claimValue" :show-message="false">
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
                <el-row v-if="isShow('standard') || isShow('tea')" :gutter="20" class="form-row">
                    <el-col v-if="isShow('standard')" :span="12">
                        <el-form-item label="性能标准" prop="shiYanCanShu.standard" :show-message="false">
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
                    <el-col v-if="isShow('tea')" :span="12">
                        <el-form-item label="TEa数值" prop="tea" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.tea"
                                type="number"
                                :min="0"
                                :precision="2"
                                :disabled="readonly"
                                placeholder="请输入"
                                @change="changeCVS"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="isShow('batchCVS') || isShow('dailyCVS')" :gutter="20" class="form-row">
                    <el-col v-if="isShow('batchCVS')" :span="12">
                        <el-form-item label="批内CVs" prop="batchCVS" :show-message="false">
                            <el-select
                                v-model="pageInfo.batchCVS"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                                @change="changeCVS"
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
                        <el-form-item label="日间CVs" prop="dailyCVS" :show-message="false">
                            <el-select
                                v-model="pageInfo.dailyCVS"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
                                @change="changeCVS"
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
                <el-row v-show="0" :gutter="20" class="form-row">
                    <el-col v-if="isShow('batchCVSValue')" :span="12">
                        <el-form-item label="数值" prop="batchCVSValue" :show-message="false">
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
                    <el-col v-if="isShow('dailyCVSValue')" :span="12">
                        <el-form-item label="数值" prop="dailyCVSValue" :show-message="false">
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
import { standardOption, batchOption } from '../constants'
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
        },
        params: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            standardOption,
            batchOption,
            pageInfo: null,
            nameTagValue: '',
            targetTagValue: '',
            nameTagVisible: false,
            targetTagVisible: false
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
        this.pageInfo = temp || { model: [], targetValue: [], specimensName: [] }
        console.log(this.pageInfo)
    },
    methods: {
        isShow (props) {
            return this.params.includes(props)
        },
        getAttrs (props, attr, isNumber = true) {
            const t = this.configData.find(i => i.key === props)
            const res = t ? t[attr] : ''
            return isNumber ? Number(res) : res
        },
        changeCVS () {
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
