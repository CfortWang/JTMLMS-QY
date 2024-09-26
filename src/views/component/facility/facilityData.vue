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
                    <el-table-column label="参数单位" prop="unit" width="120">
                        <template slot-scope="{row}">
                            <el-autocomplete
                                v-if="!readonly && !isCul"
                                v-model="row.unit"
                                class="inline-input"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入"
                                size="mini"
                            />
                            <span v-else>{{ row.unit || '/' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="参数范围限值" prop="range" width="300">
                        <template slot-scope="{row}">
                            <NumberRange v-model="row.range" :precision="2" :disabled="readonly || isCul" /></template>
                    </el-table-column>

                    <el-table-column label="参数修正值" prop="fixValue" width="120">
                        <template slot-scope="{row}">
                            <el-input v-if="!readonly && !isCul" v-model="row.fixValue" size="mini" placeholder="请输入" type="number" />
                            <span v-else>{{ row.fixValue|| '/' }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="填写频率" prop="rate">
                        <template slot="header" slot-scope="">
                            <el-tooltip class="item" effect="dark" content="配置参数填写周期，适用于参数填写频率与监测周期不一致的情况。若为空则表示该参数每次推送都需填写。" placement="top-start">
                                <span>
                                    填写频率
                                    <i class="el-icon-question" />
                                </span>
                            </el-tooltip>
                        </template>
                        <template slot-scope="{row,$index}">
                            <span>{{ row.rate || '/' }}</span>
                            <el-button v-if="!readonly && !isCul" size="mini" icon="ibps-icon-edit" type="text" style="margin-left:10px" @click="openDialog(row,$index)">编辑</el-button>
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
        <FacilityDataDialog v-if="dialogShow" :dialog-visible.sync="dialogShow" :params="dialogParams" @submit="dialogSubmit" />
    </div>
</template>
<script>
import NumberRange from '@/views/component/xcomponent/numberRange.vue'
import FacilityDataDialog from './facilityDataDialog.vue'
export default {
    components: {
        NumberRange, FacilityDataDialog
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
            dialogParams: {},
            dialogShow: false,
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
                        this.forms = this.initData(val.lieBiaoShuJu)
                    } else {
                        if (this.isFirst) {
                            this.forms = this.initData(val.lieBiaoShuJu)
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
        // 弹窗的提交事件
        dialogSubmit (data, index) {
            this.$set(this.forms, index, data)
            // console.log('form', this.forms)
        },
        openDialog (row, $index) {
            this.dialogParams = {
                ...row,
                $index
            }
            this.dialogShow = true
        },
        // 计算时间差
        getDayDifference (date1, date2) {
            // 将两个日期转换为Date对象
            const d1 = new Date(date1)
            const d2 = new Date(date2)
            // 计算两个日期之间的毫秒差
            const timeDiff = d2.getTime() - d1.getTime()
            // 将毫秒差转换为天数并返回
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            // console.log(dayDiff)
            return dayDiff
        },
        // 初始化数据
        initData (data) {
            const ans = JSON.parse(data)
            const result = []
            if (this.isFirst) {
                console.log(ans)
            }
            ans.forEach(item => {
                if (!Object.hasOwn(item, 'label')) {
                    item.label = ''
                }
                if (!Object.hasOwn(item, 'unit')) {
                    item.unit = '℃'
                }
                if (!Object.hasOwn(item, 'range')) {
                    item.range = [null, null]
                }
                if (!Object.hasOwn(item, 'fixValue')) {
                    item.fixValue = ''
                }
                if (!Object.hasOwn(item, 'value')) {
                    item.value = ''
                }
                if (!Object.hasOwn(item, 'result')) {
                    item.result = ''
                }
                if (!Object.hasOwn(item, 'rate')) {
                    item.rate = ''
                }
                if (!Object.hasOwn(item, 'status')) {
                    item.status = ''
                }
                if (!Object.hasOwn(item, 'period')) {
                    item.period = ''
                }
                if (!Object.hasOwn(item, 'date')) {
                    item.date = ''
                }
                if (!Object.hasOwn(item, 'startTime')) {
                    item.startTime = ''
                }

                // this.formData.jianCeShiJian = '2024-09-05'
                if (item.rate && this.formData.jianCeShiJian) {
                    const jianCeShiJian = this.formData.jianCeShiJian.slice(0, 10)
                    const thatDate = new Date(jianCeShiJian)
                    const day = thatDate.getDay() // 周几
                    const dayofMonth = thatDate.getDate() // 多少号
                    let dayDiff = ''
                    console.log(`监测时间：${jianCeShiJian},周${day}`)
                    switch (item.period) {
                        case 'day':
                            if (item.date.indexOf(day) > -1) {
                                result.push(item)
                            }
                            break
                        case 'week':
                            if (item.date === day) {
                                result.push(item)
                            }
                            break
                        case 'month':
                            if (item.date === dayofMonth) {
                                result.push(item)
                            }
                            break
                        case 'repeat':
                            dayDiff = this.getDayDifference(item.startTime, jianCeShiJian)
                            if (dayDiff >= 0 && dayDiff % (item.date + 1) === 0) {
                                result.push(item)
                            }
                            break
                        default:
                            break
                    }
                } else {
                    result.push(item)
                }
            })
            return result
        },
        // 默认单位
        querySearch (queryString, cb) {
            const units = [{ value: '℃' }, { value: '%' }, { value: 'Pa' }, { value: 'MΩ·CM' }, { value: 'uS/cm' }, { value: 'cfu/ml' }]
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
                unit: '',
                period: '',
                date: ''
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
