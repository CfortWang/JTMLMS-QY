<template>
    <div class="info-container">
        <div class="info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>性能验证实验参数</span>
            </div>
            <div class="form-container">
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="浓度水平数" prop="shiYanCanShu.sampleCount" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.sampleCount"
                                type="number"
                                :min="1"
                                :max="10"
                                :precision="0"
                                :disabled="readonly"
                                placeholder="请输入浓度水平数"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测定结果数" prop="shiYanCanShu.resultCount" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.resultCount"
                                type="number"
                                :min="1"
                                :max="50"
                                :precision="0"
                                :disabled="readonly"
                                placeholder="请输入测定结果数"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="精密度模型" prop="shiYanCanShu.model" :show-message="false">
                            <el-checkbox-group v-model="pageInfo.model">
                                <el-checkbox label="批内不精密度">批内不精密度</el-checkbox>
                                <el-checkbox label="总不精密度">总不精密度</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
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
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
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
                    <el-col :span="12">
                        <el-form-item label="TEa数值" prop="tea" :show-message="false">
                            <el-input-number
                                v-model="pageInfo.tea"
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
                    <el-col :span="12">
                        <el-form-item label="批内CVs" prop="batchCVS" :show-message="false">
                            <el-select
                                v-model="pageInfo.batchCVS"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
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
                    <el-col :span="12">
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
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="日间CVs" prop="dailyCVS" :show-message="false">
                            <el-select
                                v-model="pageInfo.dailyCVS"
                                filterable
                                clearable
                                :disabled="readonly"
                                placeholder="请选择"
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
                    <el-col :span="12">
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
        }
    },
    data () {
        return {
            standardOption,
            batchOption,
            pageInfo: {}
        }
    },
    watch: {
        info: {
            handler (val) {
                this.pageInfo = val || { model: [] }
            },
            immediate: true,
            deep: true
        },
        pageInfo: {
            handler (val, oldVal) {
                this.$emit('updateParams', val)
            },
            deep: true
        }
    },
    methods: {

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
                    // ::v-deep {
                    //     .el-form-item {
                    //         margin-bottom: 0 !important;
                    //         .el-form-item__label {
                    //             font-size: 14px !important;
                    //             color: #606266;
                    //         }
                    //         .el-form-item__content {
                    //             .el-input, .el-select, .el-input-number {
                    //                 width: 100%;
                    //             }
                    //             .el-textarea .el-input__count {
                    //                 padding: 0 5px;
                    //                 line-height: initial;
                    //             }
                    //             .el-radio, .el-checkbox {
                    //                 margin-right: 10px;
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        }
    }
</style>
