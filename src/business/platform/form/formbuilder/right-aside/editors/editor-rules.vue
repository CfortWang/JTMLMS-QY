<template>
    <div class="panel panel-default rules-panel">
        <div class="panel-heading">校验规则</div>
        <div class="panel-body">
            <div class="el-form-item ibps-mb-5">
                <!-- // - 必填 -->
                <div v-if="types.includes('required')" class="el-form-item__content">
                    <el-checkbox v-model="fieldOptions.required">必填</el-checkbox><help-tip prop="required" />
                </div>
                <div v-if="types.includes('uncheck')" class="el-form-item__content">
                    <el-checkbox v-model="fieldOptions.uncheck">是否可取消勾选</el-checkbox><help-tip prop="uncheck" />
                </div>
                <!-- // - 数字类型 -->
                <template v-if="types.includes('number')">
                    <div class="el-form-item__content">
                        <el-checkbox v-model="fieldOptions.integer">只能输入整数</el-checkbox><help-tip prop="integer" />
                    </div>
                    <div class="el-form-item__content">
                        <el-checkbox v-model="fieldOptions.is_decimal" :disabled="fieldOptions.integer">不超过&nbsp;&nbsp;<help-tip prop="decimal" />
                            <el-input-number v-model="fieldOptions.decimal" :disabled="fieldOptions.integer||!fieldOptions.is_decimal" controls-position="right" size="mini" />
                            位</el-checkbox>
                    </div>
                </template>
                <!-- //- 字符串长度 -->
                <div v-if="types.includes('length')" class="el-form-item__content">
                    <div>
                        <el-checkbox v-if="init" v-model="fieldOptions.is_min_length" @change="changeCheckbox('min_length')">最少填</el-checkbox><help-tip prop="minLength" />
                        <el-input-number v-model="fieldOptions.min_length" :disabled="!fieldOptions.is_min_length" controls-position="right" size="mini" />
                        个字符
                    </div>
                    <div>
                        <el-checkbox v-if="init" v-model="fieldOptions.is_max_length" @change="changeCheckbox('max_length')">最多填</el-checkbox><help-tip prop="maxLength" />
                        <el-input-number v-model="fieldOptions.max_length" :disabled="!fieldOptions.is_max_length" controls-position="right" size="mini" />
                        个字符
                    </div>
                </div>
                <!-- //- 最大最小值-->
                <div v-if="types.includes('minMax')" class="el-form-item__content">
                    <div>
                        <el-checkbox v-model="fieldOptions.is_min" @change="changeCheckbox('min')">最小值</el-checkbox><help-tip prop="min" />
                        <el-input-number v-model="fieldOptions.min" :disabled="!fieldOptions.is_min" controls-position="right" size="mini" />
                    </div>
                    <div>
                        <el-checkbox v-model="fieldOptions.is_max" @change="changeCheckbox('max')">最大值</el-checkbox><help-tip prop="max" />
                        <el-input-number v-model="fieldOptions.max" :disabled="!fieldOptions.is_max" controls-position="right" size="mini" />
                    </div>
                </div>
                <!-- //- 最大最小项-->
                <div v-if="types.includes('item')" class="el-form-item__content">
                    <div>
                        <el-checkbox v-model="fieldOptions.is_min_mum" @change="changeCheckbox('min_mum')">最少选择</el-checkbox><help-tip prop="minItem" />
                        <el-input-number v-model="fieldOptions.min_mum" :disabled="!fieldOptions.is_min_mum" controls-position="right" size="mini" />
                        项
                    </div>
                    <div>
                        <el-checkbox v-model="fieldOptions.is_max_mum" @change="changeCheckbox('max_mum')">最多选择</el-checkbox><help-tip prop="maxItem" />
                        <el-input-number v-model="fieldOptions.max_mum" :disabled="!fieldOptions.is_max_mum" controls-position="right" size="mini" />
                        项
                    </div>
                </div>
                <!-- //- 起始日期-->
                <div v-if="types.includes('date')" class="el-form-item__content">
                    <div>
                        <el-checkbox v-model="fieldOptions.is_start_date">起始日期</el-checkbox><help-tip prop="startDate" />
                        <el-select
                            v-model="fieldOptions.start_date_type"
                            :disabled="!fieldOptions.is_start_date"
                            :size="'mini'"
                            style="width:100px;height: 28px;"
                            @change="changeDateType('start_date')"
                        >
                            <el-option
                                v-for="dateType in dateTypes"
                                :key="dateType.value"
                                :value="dateType.value"
                                :label="dateType.label"
                            />
                        </el-select>
                        <template v-if="fieldOptions.start_date_type!=='today'">
                            <el-input
                                v-if="fieldOptions.start_date_type==='specific'"
                                v-model="fieldOptions.start_date"
                                :disabled="!fieldOptions.is_start_date"
                                size="mini"
                                style="width:100px;"
                            />

                            <ibps-tree-select
                                v-else-if="fieldOptions.start_date_type==='form'"
                                v-model="fieldOptions.start_date"
                                :data="formFields"
                                :props="props"
                                node-key="name"
                            />

                            <el-input-number v-else v-model="fieldOptions.start_date" :disabled="!fieldOptions.is_start_date" controls-position="right" size="mini" style="width:100px;" />

                            <el-select
                                v-if="fieldOptions.start_date_type === 'before' || fieldOptions.start_date_type === 'after' "
                                v-model="fieldOptions.start_date_interval"
                                :disabled="!fieldOptions.is_start_date"
                                :size="'mini'"
                                style="width:80px"
                            >
                                <el-option
                                    v-for="intervalType in intervalTypes"
                                    :key="intervalType.value"
                                    :value="intervalType.value"
                                    :label="intervalType.label"
                                />
                            </el-select>
                        </template>
                    </div>
                    <div>
                        <el-checkbox v-model="fieldOptions.is_end_date">结束日期</el-checkbox><help-tip prop="endDate" />
                        <el-select
                            v-model="fieldOptions.end_date_type"
                            :size="'mini'"
                            :disabled="!fieldOptions.is_end_date"
                            style="width:100px;height: 28px;"
                            @change="changeDateType('end_date')"
                        >
                            <el-option
                                v-for="dateType in dateTypes"
                                :key="dateType.value"
                                :value="dateType.value"
                                :label="dateType.label"
                            />
                        </el-select>
                        <template v-if="fieldOptions.end_date_type!=='today'">
                            <el-input
                                v-if="fieldOptions.end_date_type==='specific'"
                                v-model="fieldOptions.end_date"
                                :disabled="!fieldOptions.is_end_date"
                                size="mini"
                                style="width:100px;"
                            />
                            <ibps-tree-select
                                v-else-if="fieldOptions.end_date_type==='form'"
                                v-model="fieldOptions.end_date"
                                :data="formFields"
                                :props="props"
                                node-key="name"
                            />
                            <el-input-number v-else v-model="fieldOptions.end_date" :min="1" :disabled="!fieldOptions.is_end_date" controls-position="right" size="mini" style="width:100px;" />

                            <el-select
                                v-if="fieldOptions.end_date_type === 'before' || fieldOptions.end_date_type === 'after'"
                                v-model="fieldOptions.end_date_interval"
                                :disabled="!fieldOptions.is_end_date"
                                :size="'mini'"
                                style="width:80px"
                            >
                                <el-option
                                    v-for="intervalType in intervalTypes"
                                    :key="intervalType.value"
                                    :value="intervalType.value"
                                    :label="intervalType.label"
                                />
                            </el-select>
                        </template>
                    </div>
                </div>

                <!-- //- 正则表达式 -->
                <div v-if="types.includes('dataFormat')" class="el-form-item__content">
                    数据格式<help-tip prop="dataFormat" />
                    <el-select
                        v-model="fieldOptions.data_format"
                        placeholder="请选择"
                        size="mini"
                        :popper-append-to-body="false"
                        clearable
                        filterable
                        popper-class="custom-select-dropdown"
                    >
                        <el-option
                            v-for="o in dataFormatOptions"
                            :key="o.value"
                            :value="o.value"
                        >
                            <div>
                                <el-tooltip :content="o.label" placement="top" :disabled="!needsTooltip(o.label)">
                                    <div class="label">{{ o.label }}</div>
                                </el-tooltip>
                                <template v-if="hasAttrs(o, 'examples')">
                                    <el-tooltip
                                        :content="`示例：${o.examples.join('，')}`"
                                        placement="top"
                                        :disabled="!needsTooltip(o.examples.join('，'), 40)"
                                    >
                                        <div class="example">
                                            示例：{{ o.examples.join('，') }}
                                        </div>
                                    </el-tooltip>
                                </template>
                                <template v-if="hasAttrs(o, 'counterExamples')">
                                    <el-tooltip
                                        :content="`反面示例：${o.counterExamples.join('，')}`"
                                        placement="top"
                                        :disabled="!needsTooltip(o.counterExamples.join('，'), 40)"
                                    >
                                        <div class="example">
                                            反面示例：{{ o.counterExamples.join('，') }}
                                        </div>
                                    </el-tooltip>
                                </template>
                            </div>
                        </el-option>
                    </el-select>
                    <div v-if="fieldOptions.data_format ==='custom'">
                        <el-input v-model="fieldOptions.data_format_value" placeholder="正则表达式" type="textarea" rows="1" />
                    </div>
                    <el-input v-model="fieldOptions.data_format_msg" placeholder="提示信息" type="textarea" rows="1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dataFormatOptions, dateTypes, intervalTypes } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'
import IbpsTreeSelect from '@/components/ibps-tree-select'
/**
 * 校验规则
 */
// TODO: 以后的功能，允许多个
// 1、正则表达式 message编辑，添加正则flag，允许添加多条regexp
export default {
    components: {
        IbpsTreeSelect
    },
    mixins: [EditorMixin],
    props: {
        // 规则类型 可选值[required、length、dataFormat]
        types: {
            type: String,
            default: 'required'
        },
        dateParams: {
            type: Object
        }
    },
    data () {
        return {
            dataFormatOptions: dataFormatOptions,
            dateTypes: dateTypes,
            intervalTypes: intervalTypes,
            props: {
                children: 'children',
                label: 'label'
            },
            init: true
        }
    },
    computed: {
        formFields () {
            if (this.types.includes('date')) {
                return FormFieldUtil.getFormField(this.fields)
            }
            return []
        }
    },
    watch: {
        fieldItem: {
            handler: function (val, oldVal) {
                this.init = false
                this.$nextTick(() => {
                    this.init = true
                })
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        changeCheckbox (key) {
            this.fieldOptions[key] = null
        },
        changeDateType (key) {
            this.fieldOptions[key] = null
        },
        needsTooltip (text, length = 25) {
            return text.length >= length
        },
        hasAttrs (obj, attrs) {
            return obj[attrs] && obj[attrs].length
        }
    }
}
</script>
<style lang="scss" scoped>
    .rules-panel {
        .el-checkbox{
            margin-right: 10px;
        }
        ::v-deep .custom-select-dropdown {
            .el-scrollbar .el-select-dropdown__wrap .el-select-dropdown__list .el-select-dropdown__item {
                height: auto;
                min-height: 24px;
                > div {
                    height: auto;
                    width: 360px;
                    line-height: 1.5;
                    .label {
                        font-weight: 600;
                        color: #606266;
                    }
                    .example {
                        color: #8492a6;
                        font-size: 13px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
</style>
