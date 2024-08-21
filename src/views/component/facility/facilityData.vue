<!--
    author:luoaoxuan
    subject:设施环境通用组件
-->
<template>
    <div class="ficily-data">
        <el-row type="flex">
            <el-col style="margin:0 0 5px 0">
                <div class="button">
                    <el-button v-if="!isCul" type="danger" size="mini" icon="ibps-icon-close" @click="goRemove">删除</el-button>
                    <el-button v-if="!isCul" type="success" size="mini" icon="ibps-icon-plus" @click="goAdd">添加</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col>
                <el-table :data="forms" border @selection-change="handleSelectionChange">
                    <el-table-column
                        width="50"
                        type="selection"
                    />
                    <el-table-column label="参数名称" prop="label">
                        <template slot-scope="{row}">
                            <el-input v-if="!readonly && !isCul" v-model="row.label" size="mini" placeholder="请输入" />
                            <span v-else>{{ row.label|| '/' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数单位" prop="unit">
                        <template slot-scope="{row}">
                            <el-autocomplete
                                v-if="!readonly && !isCul"
                                v-model="row.unit"
                                class="inline-input"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                size="mini"
                            />
                            <span v-else>{{ row.unit || '/' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="参数范围限值" prop="range">
                        <template slot-scope="{row}">
                            <NumberRange v-model="row.range" :precision="2" :disabled="readonly || isCul" /></template>
                    </el-table-column>

                    <el-table-column label="参数修正值" prop="fixValue">
                        <template slot-scope="{row}">
                            <el-input v-if="!readonly && !isCul" v-model="row.fixValue" size="mini" placeholder="请输入" type="number" />
                            <span v-else>{{ row.fixValue|| '/' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="isCul" label="参数值" prop="value">
                        <template slot-scope="{row}">
                            <el-input v-if="!readonly" v-model="row.value" size="mini" placeholder="请输入" type="number" :readonly="readonly" />
                            <span v-else>{{ row.value || '/' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="isCul" label="最终值" prop="result">
                        <template slot-scope="{row}">
                            <span>{{ row.result || '/' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="isCul" label="状态" prop="status">
                        <template slot-scope="{row}">
                            <span>{{ row.status || '/' }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import NumberRange from '@/views/component/xcomponent/numberRange.vue'
export default {
    components: {
        NumberRange
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        },
        isCul: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            isFirst: true,
            forms: [],
            multipleSelection: []
        }
    },
    computed: {
    },
    watch: {
        formData: {
            handler (val) {
                // console.log('formData', val)
                if (val.lieBiaoShuJu) {
                    if (!this.isCul) {
                        this.forms = JSON.parse(val.lieBiaoShuJu)
                    } else {
                        if (this.isFirst) {
                            this.forms = JSON.parse(val.lieBiaoShuJu)
                            this.isFirst = false
                        }
                    }
                }
                this.culXiuZheng()
            },
            deep: true,
            immediate: true
        },
        forms: {
            handler (val) {
                // console.log('forms', val)
                this.culXiuZheng()
                this.$emit('change-data', 'lieBiaoShuJu', JSON.stringify(val))
            },
            deep: true
        }
    },
    mounted () {
        // console.log('mounted', this.formData)
    },
    methods: {
        // 默认单位
        querySearch (queryString, cb) {
            const units = [{ value: '℃' }, { value: '%' }, { value: 'Pa' }]
            // 调用 callback 返回建议列表的数据
            cb(units)
        },
        // 计算状态
        getStatus (range, result) {
            let [min, max] = range
            if (min === null || min === '' || typeof min === 'undefined') min = Number.MIN_VALUE
            if (max === null || max === '' || typeof max === 'undefined') max = Number.MAX_VALUE
            // console.log(min, max, result)
            if (+min === 0 && +max === 0) {
                return '正常'
            }
            if (+result <= +max && +result >= +min) {
                return '正常'
            }
            return '失控'
        },
        // 计算修正值
        culXiuZheng () {
            if (!this.isCul) return
            if (this.readonly) return
            this.forms.forEach(item => {
                if (item.value) {
                    if (item.fixValue) {
                        item.result = (+item.fixValue + +item.value).toFixed(2)
                    } else {
                        item.result = (+item.value).toFixed(2)
                    }
                    item.status = this.getStatus(item.range, item.result)
                } else {
                    item.result = ''
                    item.status = ''
                }
            })
        },
        formatData (val) {
            return JSON.stringify(val)
        },
        goAdd () {
            if (this.forms.length >= 10) {
                return this.$message({
                    message: '超过最大限制！',
                    type: 'warning'
                })
            }
            this.forms.push({
                label: '',
                range: [],
                fixValue: '',
                value: '',
                result: '',
                status: '',
                unit: ''
            })
        },
        goRemove () {
            this.forms = this.forms.filter(item => !this.multipleSelection.includes(item))
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        }
    }
}
</script>
<style lang="scss" scoped>
.ficily-data{
    margin-bottom: 20px;
    .button{
        display: flex;
        flex-direction: row-reverse;
        .el-button{
            margin-left: 5px;
        }
    }

}
</style>
