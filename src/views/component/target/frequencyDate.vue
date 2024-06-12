<template>
    <div class="frequency">
        <el-row :gutter="20">
            <el-col :span="12" class="inline-item">
                <div class="label">月度指标统计时间</div>
                <el-select
                    v-model="pageData.month"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in monthOption"
                        :key="item"
                        :label="`每月${item}日`"
                        :value="item"
                    />
                </el-select>
            </el-col>
            <el-col :span="12" class="inline-item">
                <div class="label">季度指标统计时间</div>
                <el-select
                    v-model="pageData.quarter[0]"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in quarterOption"
                        :key="item"
                        :label="`第${item}月`"
                        :value="item"
                    />
                </el-select>
                <el-select
                    v-model="pageData.quarter[1]"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in monthOption"
                        :key="item"
                        :label="`第${item}天`"
                        :value="item"
                    />
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="form-row">
            <el-col :span="12" class="inline-item">
                <div class="label">半年指标统计时间</div>
                <el-select
                    v-model="pageData.halfYear[0]"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in halfYearOption"
                        :key="item"
                        :label="`第${item}月`"
                        :value="item"
                    />
                </el-select>
                <el-select
                    v-model="pageData.halfYear[1]"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in monthOption"
                        :key="item"
                        :label="`第${item}天`"
                        :value="item"
                    />
                </el-select>
            </el-col>
            <el-col :span="12" class="inline-item">
                <div class="label">年度指标统计时间</div>
                <el-select
                    v-model="pageData.year[0]"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in yearOption"
                        :key="item"
                        :label="`第${item}月`"
                        :value="item"
                    />
                </el-select>
                <el-select
                    v-model="pageData.year[1]"
                    clearable
                    :disabled="readonly"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in monthOption"
                        :key="item"
                        :label="`第${item}天`"
                        :value="item"
                    />
                </el-select>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: {
        formData: {
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
            pageData: {
                month: '',
                quarter: [],
                halfYear: [],
                year: []
            },
            isInitialized: false,
            monthOption: Array.from({ length: 28 }, (_, index) => index + 1),
            quarterOption: Array.from({ length: 3 }, (_, index) => index + 1),
            halfYearOption: Array.from({ length: 6 }, (_, index) => index + 1),
            yearOption: Array.from({ length: 12 }, (_, index) => index + 1)
        }
    },
    watch: {
        formData: {
            handler (val) {
                if (!this.isInitialized && val.chaXunYuJu) {
                    this.pageData = JSON.parse(val.chaXunYuJu)
                    this.isInitialized = true
                }
            },
            deep: true
        },
        pageData: {
            handler (val) {
                this.$emit('change-data', 'chaXunYuJu', JSON.stringify(val))
            },
            deep: true
        }
    },
    mounted () {
        if (this.formData.chaXunYuJu) {
            this.pageData = JSON.parse(this.formData.chaXunYuJu)
            this.isInitialized = true
        }
    }
}
</script>
<style lang="scss" scoped>
    .frequency {
        margin-top: 20px;
        .inline-item {
            display: flex;
            margin-bottom: 16px;
            > div {
                flex-grow: 1;
                flex-shrink: 1;
                margin-left: 10px;
            }
            .label {
                width: 130px;
                flex-grow: 0;
                flex-shrink: 0;
            }
        }
    }
</style>
