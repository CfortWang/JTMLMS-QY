<template>
    <el-dialog
        :title="title+(isEdit===true?'--编辑':'--新增')"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        class="dialog paper-detail-dialog"
        width="65%"
        top
        style="margin-top:5vh"
        :show-close="false"
    >
        <div class="contain">
            <div class="main">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="部门：">
                                <ibps-user-selector
                                    v-model="form.bu_men_"
                                    size="mini"
                                    type="position"
                                    readonly-text="text"
                                    :disabled="false"
                                    :multiple="false"
                                    style="width:80%"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="监测岗位：">
                                <el-select v-model="form.jian_ce_gang_wei_" placeholder="请选择" size="mini" style="width:80%">
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
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="区域：">
                                <el-select v-model="form.qu_yu_" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in quYuList"
                                        :key="item.id_"
                                        :label="item.qu_yu_ming_cheng_"
                                        :value="item.qu_yu_ming_cheng_"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="房间：">
                                <el-select v-model="form.fang_jian_" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in fangJianList"
                                        :key="item.id_"
                                        :label="item.fang_jian_ming_ha"
                                        :value="item.fang_jian_ming_ha"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="监控设备：">
                                <ibps-link-data
                                    v-model="form.deviceno2_"
                                    style="width:80%"
                                    size="mini"
                                    template-key="jksbxz"
                                    :multiple="false"
                                    :temp-search="true"
                                />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row v-if="isShowDevice">
                        <el-col :span="12">
                            <el-form-item label="被控设备编号：">
                                <el-input v-model="form.deviceno1_" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="被控设备名称：">
                                <el-input v-model="form.devicename1_" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item v-if="labelText.label1" :label="labelText.label1+'范围限值：'">
                                <el-input-number v-model="form.temperatureMin" size="mini" controls-position="right" :min="-100" :max="form.temperatureMax" :step="1" />
                                至
                                <el-input-number v-model="form.temperatureMax" size="mini" controls-position="right" :min="form.temperatureMin" :max="100" :step="1" />
                                (℃)
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="labelText.label2" :label="labelText.label2+'范围限值：'">
                                <el-input-number v-model="form.humidityMin" size="mini" controls-position="right" :min="-100" :max="form.humidityMax" :step="1" />
                                至
                                <el-input-number v-model="form.humidityMax" size="mini" controls-position="right" :min="form.humidityMin" :max="100" :step="1" />
                                (%)
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="12">
                            <el-form-item v-if="labelText.label1" :label="labelText.label1+'修正值：'">
                                <el-input v-model="form.xiu_zheng_wen_du_" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="labelText.label2" :label="labelText.label2+'修正值：'">
                                <el-input v-model="form.xiu_zheng_shi_du_" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="监测周期：">
                                <el-select v-model="form.jian_ce_zhou_qi_" placeholder="请选择" size="mini" style="width:60%">
                                    <el-option
                                        v-for="item in period"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否启用：">
                                <el-switch
                                    v-model="form.shi_fou_qi_yong_"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="启用"
                                    inactive-text="停用"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.jian_ce_zhou_qi_!==''">
                        <el-col :span="12">
                            <el-form-item :label="labelShow">
                                <el-checkbox-group v-if="form.jian_ce_zhou_qi_==='每日'" v-model="dayCheck" size="mini">
                                    <el-checkbox :label="1" size="mini">周一</el-checkbox>
                                    <el-checkbox :label="2" size="mini">周二</el-checkbox>
                                    <el-checkbox :label="3" size="mini">周三</el-checkbox>
                                    <el-checkbox :label="4" size="mini">周四</el-checkbox>
                                    <el-checkbox :label="5" size="mini">周五</el-checkbox>
                                    <el-checkbox :label="6" size="mini">周六</el-checkbox>
                                    <el-checkbox :label="7" size="mini">周日</el-checkbox>
                                </el-checkbox-group>
                                <template v-if="form.jian_ce_zhou_qi_==='每周'">
                                    <el-radio v-model="weekCheck" :label="1" size="mini">周一</el-radio>
                                    <el-radio v-model="weekCheck" :label="2" size="mini">周二</el-radio>
                                    <el-radio v-model="weekCheck" :label="3" size="mini">周三</el-radio>
                                    <el-radio v-model="weekCheck" :label="4" size="mini">周四</el-radio>
                                    <el-radio v-model="weekCheck" :label="5" size="mini">周五</el-radio>
                                    <el-radio v-model="weekCheck" :label="6" size="mini">周六</el-radio>
                                    <el-radio v-model="weekCheck" :label="7" size="mini">周日</el-radio>
                                </template>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每月'" v-model="monthCheck" placeholder="请选择" size="mini">
                                    <el-option
                                        v-for="item in 28"
                                        :key="item"
                                        :label="`第${item}天`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每季度'" v-model="quarterCheck" placeholder="请选择" size="mini">
                                    <el-option
                                        v-for="item in 3"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每半年'" v-model="halfYearCheck" placeholder="请选择" size="mini">
                                    <el-option
                                        v-for="item in 6"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每年'" v-model="yearCheck" placeholder="请选择" size="mini">
                                    <el-option
                                        v-for="item in 12"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                            </el-form-item>

                        </el-col>
                        <el-col v-if="nextDate" :span="12">
                            <el-form-item label="下次监测日期为：">
                                <el-tag size="mini">{{ nextDate }}</el-tag>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="控制条件：">
                                <el-input v-model="form.kong_zhi_tiao_jia" type="textarea" :rows="2" size="mini" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">确 定</el-button>
            <el-button @click="close">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'

export default {
    components: {
        ibpsUserSelector,
        IbpsLinkData
    },
    data () {
        return {
            dialogVisible: false,
            title: '配置详情',
            jianCeGangWeiList: [],
            lei_xing_: '',
            form: {
                temperatureMin: 0,
                temperatureMax: 0,
                humidityMin: 0,
                humidityMax: 0,

                qu_yu_: '',
                fang_jian_: '',
                bu_men_: '',
                deviceno1_: '',
                devicename1_: '',
                deviceno2_: '', // 监控设备
                jian_ce_zhou_qi_: '',
                jian_ce_gang_wei_: '',
                shi_fou_qi_yong_: true,
                kong_zhi_tiao_jia: '',
                environment_range: '',
                xiu_zheng_shi_du_: '',
                xiu_zheng_wen_du_: '',
                jian_ce_ri_qi_: '',
                ri_qi_lie_biao_: '',
                zi_wai_deng_wai_j: '' // 紫外灯外键
            },
            isEdit: false,
            quYuList: [],
            fangJianList: [],
            nextDate: '',
            dayCheck: [],
            weekCheck: '',
            monthCheck: '',
            quarterCheck: '',
            halfYearCheck: '',
            yearCheck: '',
            period: [
                { label: '日监测', value: '每日' },
                { label: '周监测', value: '每周' },
                { label: '月监测', value: '每月' },
                { label: '季度监测', value: '每季度' },
                { label: '半年监测', value: '每半年' },
                { label: '年监测', value: '每年' }
            ],
            row: {}

        }
    },
    computed: {
        // isEdit () {
        //     return this.parentData instanceof Object && this.parentData.mainId
        // },
        isShowDevice () {
            return this.lei_xing_ !== '01-室内温湿度监控' && this.lei_xing_ !== '06-每日安全检查' && this.lei_xing_ !== '08-含氯有效性监测'
        },
        labelShow () {
            if (this.form.jian_ce_zhou_qi_) {
                return this.form.jian_ce_zhou_qi_.split('每')[1] + '监测日期：'
            }
            return ''
        },
        labelText () {
            switch (this.lei_xing_) {
                case '02-冰箱温度监控':
                    return { label1: '冷藏温度', label2: '冷冻温度' }
                case '03-温浴箱温度监控':
                case '04-阴凉柜温度监控':
                    return { label1: '温度', label2: '' }
                case '05-纯水机水质监测':
                case '06-每日安全检查':
                case '08-含氯有效性监测':
                case '10-洗眼器检查':
                case '11-紧急淋浴器检查':
                case '13-高压灭菌':
                case '14-空气消毒机':
                case '12-紫外灯消毒':
                    return { label1: '', label2: '' }
                default:
                    return { label1: '温度', label2: '湿度' }
            }
        }

    },
    watch: {
        // 'form.lei_xing_' (val) {
        //     this.mo_kuai_lu_jing_ = this.config[val].path
        // },
        'form.jian_ce_zhou_qi_' (val) {
            this.dayCheck = []
            this.weekCheck = ''
            this.monthCheck = ''
            this.quarterCheck = ''
            this.halfYearCheck = ''
            this.yearCheck = ''
            this.nextDate = ''
        },
        dayCheck: {
            handler: function (val, oldVal) {
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
                const yearPJ = today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.nextDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        yearCheck: {
            handler: function (val, oldVal) {
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
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const pos = this.$store.getters.level.second ? this.$store.getters.level.second : this.$store.getters.level.first
            const sql1 = `select * from t_qypzb where di_dian_='${pos}'`
            this.$common.request('sql', sql1).then(res => {
                const { data = [] } = res.variables || {}
                this.quYuList = data
            })
            const sql2 = `select * from t_jjqfjb where di_dian_='${pos}'`
            this.$common.request('sql', sql2).then(res => {
                const { data = [] } = res.variables || {}
                this.fangJianList = data
            })
        },
        submit () {
            this.$emit('onSubmit', { dayCheck: this.dayCheck, weekCheck: this.weekCheck, monthCheck: this.monthCheck, quarterCheck: this.quarterCheck, halfYearCheck: this.halfYearCheck, yearCheck: this.yearCheck, form: this.form, isEdit: this.isEdit, row: this.row })
        },
        close () {
            this.dialogVisible = false
            // 初始化操作
            this.form.bu_men_ = ''
            this.form.shi_fou_qi_yong_ = true
            this.form.xiu_zheng_shi_du_ = ''
            this.form.xiu_zheng_wen_du_ = ''
            this.form.kong_zhi_tiao_jia = ''
            this.form.fang_jian_ = ''
            this.form.qu_yu_ = ''
            this.form.deviceno2_ = ''
            this.form.temperatureMin = 0
            this.form.temperatureMax = 0
            this.form.humidityMin = 0
            this.form.humidityMax = 0
            this.form.deviceno1_ = ''
            this.form.devicename1_ = ''
            this.form.jian_ce_zhou_qi_ = ''
            this.form.jian_ce_gang_wei_ = ''
            this.form.environment_range = ''
            this.form.jian_ce_ri_qi_ = ''
            this.form.ri_qi_lie_biao_ = ''
            this.form.zi_wai_deng_wai_j = ''

            this.dayCheck = []
            this.weekCheck = ''
            this.monthCheck = ''
            this.quarterCheck = ''
            this.halfYearCheck = ''
            this.yearCheck = ''
        },
        open (row, jianCeGangWeiList, parentForm, dateCheck) {
            this.dialogVisible = true
            this.jianCeGangWeiList = jianCeGangWeiList
            this.lei_xing_ = parentForm.lei_xing_
            this.row = row
            // 编辑
            if (row instanceof PointerEvent === false) {
                this.isEdit = true
                this.form = JSON.parse(JSON.stringify(row))
                if (row.shi_fou_qi_yong_ === '1') {
                    this.form.shi_fou_qi_yong_ = true
                }
                if (row.shi_fou_qi_yong_ === '0') {
                    this.form.shi_fou_qi_yong_ = false
                }

                if (this.form.jian_ce_ri_qi_) {
                    this.$nextTick(() => {
                        switch (this.form.jian_ce_zhou_qi_) {
                            case '每日':
                                if (this.form.jian_ce_ri_qi_ === '每天') {
                                    this.dayCheck = [1, 2, 3, 4, 5, 6, 7]
                                } else {
                                    this.dayCheck = this.form.jian_ce_ri_qi_.split('每周')[1].split(',').map(item => +item)
                                }
                                break
                            case '每周':
                                this.weekCheck = +this.form.jian_ce_ri_qi_.split('每周')[1]
                                break
                            case '每月':
                                this.monthCheck = +this.form.jian_ce_ri_qi_.split('每个月第')[1].split('天')[0]
                                break
                            case '每季度':
                                this.quarterCheck = +this.form.jian_ce_ri_qi_.split('每季度第')[1].split('个月')[0]
                                break
                            case '每半年':
                                this.halfYearCheck = +this.form.jian_ce_ri_qi_.split('每半年第')[1].split('个月')[0]
                                break
                            case '每年':
                                this.yearCheck = +this.form.jian_ce_ri_qi_.split('每年第')[1].split('个月')[0]
                                break
                            default:
                                break
                        }
                    })
                }

                if (this.form.environment_range) {
                    const { humidity, temperature } = JSON.parse(this.form.environment_range)
                    this.$set(this.form, 'temperatureMin', +temperature.min)
                    this.$set(this.form, 'temperatureMax', +temperature.max)
                    this.$set(this.form, 'humidityMin', +humidity.min)
                    this.$set(this.form, 'humidityMax', +humidity.max)
                }
            } else {
                this.isEdit = false
                this.form.zi_wai_deng_wai_j = this.$utils.guid()
            }
        },
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
        }
    }
}
</script>

<style lang="scss">
.contain{
    .main{
        padding: 20px;
        height: 60vh;
        .el-row{
            margin: 10px 0;
        }
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
    }
</style>
