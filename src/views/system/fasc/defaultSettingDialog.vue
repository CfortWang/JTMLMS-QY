<template>
    <el-dialog
        title="配置默认数据"
        :visible.sync="dialogVisible"
        width="65%"
        style="margin-top:5vh"
        top
        append-to-body
        class="dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
    >
        <div class="contain">
            <div class="form">
                <el-form ref="subformRef" :model="form" label-width="100px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="默认部门：">
                                <ibps-user-selector
                                    v-model="form.bian_zhi_bu_men_"
                                    size="mini"
                                    type="position"
                                    readonly-text="text"
                                    :disabled="false"
                                    :multiple="false"
                                    style="width:100%"
                                    :filter="filter"
                                    filterable
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="默认岗位：">
                                <el-select v-model="form.gang_wei_" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in jianCeGangWeiList"
                                        :key="item.id_"
                                        :label="item.wei_hu_gang_wei_"
                                        :value="item.wei_hu_gang_wei_"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="默认周期：">
                                <el-select v-model="form.zhou_qi_" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in period"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.zhou_qi_!==''" :gutter="20">
                        <el-col :span="12">
                            <el-form-item :label="labelShow">
                                <el-checkbox-group v-if="form.zhou_qi_==='每日'" v-model="dayCheck" style="width:100%">
                                    <el-checkbox v-for="item in weekDays" :key="item.value" :label="item.value" size="mini">{{ item.label }}</el-checkbox>
                                </el-checkbox-group>
                                <template v-if="form.zhou_qi_==='每周'">
                                    <div class="radio" style="width:100%">
                                        <el-radio v-for="item in weekDays" :key="item.value" v-model="weekCheck" :label="item.value" size="mini">{{ item.label }}</el-radio>
                                    </div>
                                </template>
                                <el-select v-if="form.zhou_qi_==='每月'" v-model="monthCheck" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in 28"
                                        :key="item"
                                        :label="`第${item}天`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.zhou_qi_==='每季度'" v-model="quarterCheck" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in 3"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.zhou_qi_==='每半年'" v-model="halfYearCheck" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in 6"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.zhou_qi_==='每年'" v-model="yearCheck" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in 12"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.zhou_qi_==='间隔'" v-model="sepCheck" placeholder="请选择" size="mini" style="width:100%">
                                    <el-option
                                        v-for="item in 30"
                                        :key="item"
                                        :label="`每隔${item}天`"
                                        :value="item"
                                    />
                                </el-select>
                            </el-form-item>

                        </el-col>
                        <el-col v-if="nextDate" :span="12">
                            <el-form-item label="下次监测日期为：" label-width="150">
                                <el-tag>{{ nextDate }}</el-tag>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form.zhou_qi_==='间隔'" :span="12">
                            <el-form-item label="开始监测时间：" prop="">
                                <el-date-picker
                                    v-model="form.kai_shi_shi_jian_"
                                    :clearable="false"
                                    type="date"
                                    placeholder="选择监测开始时间"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd"
                                    size="mini"
                                    style="width:100%"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="默认控制条件：">
                                <el-input v-model="form.tiao_jian_" type="textarea" :rows="2" size="mini" style="width:100%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <FacilityData v-if="form.lie_biao_shu_ju_" :form-data="{lieBiaoShuJu:form.lie_biao_shu_ju_}" :is-cul="false" @change-data="onFacilityData" />
                        </el-col>
                    </el-row>
                </el-form>

            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="info" icon="el-icon-setting" @click="emitParent('settingEmpty')">为空替换</el-button>
            <el-button size="mini" type="info" icon="el-icon-setting" @click="emitParent('settingAll')">全部替换</el-button>
            <el-button size="mini" type="danger" icon="ibps-icon-close" @click="handleClose">取消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import FacilityData from '@/views/component/facility/facilityData.vue'
export default {
    components: {
        FacilityData, ibpsUserSelector
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => ({})
        },
        jianCeGangWeiList: {
            type: Array,
            default: () => []
        },
        day: {
            type: Array,
            default: () => []
        },
        week: {
            type: [String, Number],
            default: ''
        },
        month: {
            type: [String, Number],
            default: ''
        },
        quarter: {
            type: [String, Number],
            default: ''
        },
        halfYear: {
            type: [String, Number],
            default: ''
        },
        year: {
            type: [String, Number],
            default: ''
        },
        sep: {
            type: [String, Number],
            default: ''
        }
    },
    data () {
        return {
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() < (Date.now() - (24 * 60 * 1000 * 60))
                }
            },
            dayCheck: [],
            weekCheck: '',
            monthCheck: '',
            quarterCheck: '',
            halfYearCheck: '',
            yearCheck: '',
            sepCheck: '',
            weekDays: [{ label: '周一', value: 1 }, { label: '周二', value: 2 }, { label: '周三', value: 3 }, { label: '周四', value: 4 }, { label: '周五', value: 5 }, { label: '周六', value: 6 }, { label: '周日', value: 7 }],
            nextDate: '',
            form: {},
            filter: [{
                descVal: '2',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            period: [
                { label: '日监测', value: '每日' },
                { label: '周监测', value: '每周' },
                { label: '月监测', value: '每月' },
                { label: '季度监测', value: '每季度' },
                { label: '半年监测', value: '每半年' },
                { label: '年监测', value: '每年' },
                { label: '按时间间隔监测', value: '间隔' }
            ]
        }
    },
    computed: {
        labelShow () {
            if (this.form.zhou_qi_) {
                if (this.form.zhou_qi_ !== '间隔') {
                    return this.form.zhou_qi_.split('每')[1] + '监测日期：'
                }
                return '间隔时间：'
            }
            return ''
        }
    },
    watch: {
        params: {
            handler (val) {
                this.form = val
            },
            immediate: true
        },
        day: {
            handler (val) {
                this.dayCheck = val
            }
        },
        week: {
            handler (val) {
                this.weekCheck = val
            }
        },
        month: {
            handler (val) {
                this.monthCheck = val
            }
        },
        quarter: {
            handler (val) {
                this.quarterCheck = val
            }
        },
        halfYear: {
            handler (val) {
                this.halfYearCheck = val
            }
        },
        year: {
            handler (val) {
                this.yearCheck = val
            }
        },
        sep: {
            handler (val) {
                this.sepCheck = val
            }
        },
        'form.zhou_qi_' (val, old) {
            if (!old) return
            this.dayCheck = []
            this.weekCheck = ''
            this.monthCheck = ''
            this.quarterCheck = ''
            this.halfYearCheck = ''
            this.yearCheck = ''
            this.sepCheck = ''
            this.form.kai_shi_shi_jian_ = ''
            this.nextDate = ''
        },
        dayCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val.length === 0) {
                    this.nextDate = ''
                    return
                }
                const temp_val = JSON.parse(JSON.stringify(val))
                const today = new Date()
                temp_val.sort(function (a, b) {
                    return a - b
                })
                const num = temp_val.findIndex(e => e > today.getDay())
                if (temp_val.length > 0 && num !== -1) {
                    this.nextDate = this.getDayDate(temp_val[num], 0)
                } else if (temp_val.length > 0 && num === -1) {
                    this.nextDate = this.getDayDate(temp_val[0], 1)
                } else {
                    this.nextDate = ''
                }
            },
            immediate: true
        },
        weekCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const today = new Date()
                const weekNum = []
                weekNum.push(val)
                const num = weekNum.findIndex(e => e > today.getDay())
                if (val !== '' && num !== -1) {
                    this.nextDate = this.getDayDate(weekNum[0], 0)
                } else if (val !== '' && num === -1) {
                    this.nextDate = this.getDayDate(weekNum[0], 1)
                } else {
                    this.nextDate = ''
                }
            },
            immediate: true
        },
        monthCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const today = new Date()
                const day = today.getDate()
                const nextMonth = this.getNextMonthDate(today, val, 1)
                const currentMonth = this.getNextMonthDate(today, val, 0)
                this.nextDate = val > day ? currentMonth : nextMonth
            }
            // immediate: true
        },
        quarterCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const quarterList = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]
                const today = new Date()
                const month = today.getMonth() + 1
                const qu = this.getQuarter(today)
                const nowM = quarterList[qu - 1][val - 1]
                const nextM = quarterList[qu % 4][val - 1]

                const endMonth = month >= nowM ? nextM : nowM
                const yearPJ = today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.nextDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        halfYearCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const midList = [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]]
                const today = new Date()
                const month = today.getMonth() + 1
                const qu = month > 6 ? 2 : 1
                const nowM = midList[qu - 1][val - 1]
                const nextM = midList[qu % 2][val - 1]

                const endMonth = month >= nowM ? nextM : nowM
                const yearPJ = month >= nowM ? today.getFullYear() + 1 : today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.nextDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        yearCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
                if (val === '') {
                    this.nextDate = ''
                    return
                }
                const today = new Date()
                const month = today.getMonth() + 1
                const year = today.getFullYear()
                const qu = month >= val ? year + 1 : year
                const monthPJ = val > 9 ? val : '0' + val

                this.nextDate = qu + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        sepCheck: {
            handler: function (val, oldVal) {
                this.formatRiQi()
            }
        },
        'form.kai_shi_shi_jian_': {
            handler: function (val, oldVal) {
                this.formatRiQi()
            }
        }
    },
    methods: {
        getDayDate (type, dates) {
            const now = new Date()
            const nowTime = now.getTime()
            const day = now.getDay()
            const longTime = 24 * 60 * 60 * 1000
            const n = longTime * 7 * (dates || 0)
            let dd = nowTime - (day - type) * longTime + n
            dd = new Date(dd)
            const y = dd.getFullYear()
            let m = dd.getMonth() + 1
            let d = dd.getDate()
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            const daynow = y + '-' + m + '-' + d
            return daynow
        },
        // 获取往后几个月相应的日期
        // currentDate：当前日期
        // dayOfMonth：获取几号
        // val：往后几个月
        getNextMonthDate (currentDate, dayOfMonth, val) {
            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.getMonth()
            const nextMonth = currentMonth + val

            const nextMonthDate = new Date(currentYear, nextMonth, dayOfMonth)
            const formattedDate = nextMonthDate.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
            return formattedDate
        },
        // 获取当前季度
        getQuarter (date) {
            return Math.floor(date.getMonth() / 3) + 1
        },
        formatRiQi () {
            switch (this.form.zhou_qi_) {
                case '每日':
                    if (!this.dayCheck || this.dayCheck.length === 0) {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    } else if (this.dayCheck.length === 7) {
                        this.form.jian_ce_ri_qi_ = '每天'
                        this.form.ri_qi_lie_biao_ = '1,2,3,4,5,6,7'
                    } else {
                        const temp_dayCheck = JSON.parse(JSON.stringify(this.dayCheck))
                        temp_dayCheck.sort(function (a, b) {
                            return a - b
                        })
                        this.form.ri_qi_lie_biao_ = temp_dayCheck.join(',')
                        this.form.jian_ce_ri_qi_ = '每周' + temp_dayCheck.join(',')
                    }
                    break
                case '每周':
                    if (this.weekCheck) {
                        this.form.jian_ce_ri_qi_ = '每周' + this.weekCheck
                        this.form.ri_qi_lie_biao_ = this.weekCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每月':
                    if (this.monthCheck) {
                        this.form.jian_ce_ri_qi_ = '每个月第' + this.monthCheck + '天'
                        this.form.ri_qi_lie_biao_ = this.monthCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每季度':
                    if (this.quarterCheck) {
                        this.form.jian_ce_ri_qi_ = '每季度第' + this.quarterCheck + '个月'
                        this.form.ri_qi_lie_biao_ = this.quarterCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每半年':
                    if (this.halfYearCheck) {
                        this.form.jian_ce_ri_qi_ = '每半年第' + this.halfYearCheck + '个月'
                        this.form.ri_qi_lie_biao_ = this.halfYearCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }

                    break
                case '每年':
                    if (this.yearCheck) {
                        this.form.jian_ce_ri_qi_ = '每年第' + this.yearCheck + '个月'
                        this.form.ri_qi_lie_biao_ = this.yearCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }
                    break
                case '间隔':
                    if (this.sepCheck && this.form.kai_shi_shi_jian_) {
                        this.form.jian_ce_ri_qi_ = this.form.kai_shi_shi_jian_ + '起每隔' + this.sepCheck + '天'
                        this.form.ri_qi_lie_biao_ = this.sepCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }
                    break
                default:
                    this.form.jian_ce_ri_qi_ = ''
                    this.form.ri_qi_lie_biao_ = ''
                    break
            }
        },
        emitParent (type) {
            let msg = ''
            if (type === 'settingEmpty') msg = '该操作会将未设置过的配置子表数据设置为默认值，是否继续？'
            if (type === 'settingAll') msg = '该操作会将所有配置子表数据替换为默认值，是否继续？'
            this.$confirm(msg, '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('emitParent', type)
            }).catch(() => {
            })
        },
        // 接收自定义组件数据
        onFacilityData (...arg) {
            if (arg.length > 1) {
                this.form.lie_biao_shu_ju_ = arg[1]
            }
        },
        handleClose () {
            this.$emit('update:dialogVisible', false)
        }
    }
}
</script>

<style lang="scss" scoped>
.contain{
    .form{
        padding: 20px;
        height: 60vh;
        .el-row{
            margin: 10px 0;
        }
    }
    .el-row{
            margin: 0 !important;
    }
}
.dialog-footer{
        display: flex;
        justify-content: center;
    }
    ::v-deep {
        .el-form-item__label{
            text-align: left
        }
        .el-form-item__content{
        display: flex;
        }

    }
</style>
