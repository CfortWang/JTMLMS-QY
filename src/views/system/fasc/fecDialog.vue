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
                                <template slot="label">
                                    <span class="required">部门：</span>
                                </template>
                                <ibps-user-selector
                                    v-model="form.bu_men_"
                                    size="mini"
                                    type="position"
                                    readonly-text="text"
                                    :disabled="false"
                                    :multiple="false"
                                    style="width:80%"
                                    :filter="filter"
                                    filtrate
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="监测岗位：">
                                <template slot="label">
                                    <span class="required">监测岗位：</span>
                                </template>
                                <el-select v-model="form.jian_ce_gang_wei_" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in monitoringpPosition"
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
                            <el-form-item v-if="shouldRequired('fang_jian_')" label="房间：">
                                <template slot="label">
                                    <span class="required">房间：</span>
                                </template>
                                <ibps-link-data
                                    v-model="form.fang_jian_"
                                    style="width:80%"
                                    size="mini"
                                    template-key="fjzly"
                                    :multiple="false"
                                    :temp-search="true"
                                    label-key="fang_jian_ming_ha"
                                    value-key="fang_jian_ming_ha"
                                    :allow-create="false"
                                    :filterable="false"
                                    @change-link-data="fangJianChange"
                                />
                            </el-form-item>
                            <el-form-item v-else label="房间：">
                                <ibps-link-data
                                    v-model="form.fang_jian_"
                                    style="width:80%"
                                    size="mini"
                                    template-key="fjzly"
                                    :multiple="false"
                                    :temp-search="true"
                                    label-key="fang_jian_ming_ha"
                                    value-key="fang_jian_ming_ha"
                                    :allow-create="false"
                                    :filterable="false"
                                    @change-link-data="fangJianChange"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col v-show="form.qu_yu_" :span="12">
                            <el-form-item label="区域：">
                                <template slot="label">
                                    <span>区域</span>
                                    <el-tooltip effect="dark" content="区域由房间自动带出" placement="top">
                                        <i class="el-icon-question question-icon">：</i>
                                    </el-tooltip>
                                </template>
                                <span>{{ form.qu_yu_ }}</span>
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
                                    label-key="deviceInfo"
                                    value-key="deviceInfo"
                                    :allow-create="false"
                                    :filterable="false"
                                    @change-link-data="deviceno2Change"
                                />
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row v-if="shouldShowColumn('deviceno1_')">
                        <el-col :span="12">
                            <el-form-item v-if="shouldRequired('deviceno1_')" label="被控设备/设施编号：" label-width="140">
                                <template slot="label">
                                    <span class="required">被控设备/设施编号：</span>
                                </template>
                                <ibps-custom-dialog
                                    v-model="form.deviceno1_"
                                    size="mini"
                                    template-key="sbxzmcgl"
                                    :multiple="false"
                                    :disabled="false"
                                    type="dialog"
                                    class="custom-dialog"
                                    placeholder="请选择设备"
                                    icon="el-icon-search"
                                    style="width:80%"
                                    @change-link-data="deviceno1Change"
                                />
                            </el-form-item>
                            <el-form-item v-else label="被控设备/设施编号：" label-width="140">
                                <ibps-link-data
                                    v-model="form.deviceno1_"
                                    style="width:80%"
                                    size="mini"
                                    template-key="sbxzsshj"
                                    :multiple="false"
                                    :temp-search="true"
                                    label-key="yuan_she_bei_bian"
                                    value-key="yuan_she_bei_bian"
                                    :allow-create="false"
                                    :filterable="false"
                                    @change-link-data="deviceno1Change"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col v-show="form.deviceno1_" :span="12">
                            <el-form-item v-if="shouldRequired('devicename1_')" label="被控设备/设施名称：" label-width="140">
                                <template slot="label">
                                    <span>被控设备/设施名称</span>
                                    <el-tooltip effect="dark" content="选择设备后自动带出名称" placement="top">
                                        <i class="el-icon-question question-icon">：</i>
                                    </el-tooltip>
                                </template>
                                <div>{{ form.devicename1_ }}</div>
                            </el-form-item>
                            <el-form-item v-else label="被控设备/设施名称：" label-width="140">
                                <el-input v-model="form.devicename1_" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="监测周期：">
                                <template slot="label">
                                    <span class="required">监测周期：</span>
                                </template>
                                <el-select v-model="form.jian_ce_zhou_qi_" placeholder="请选择" size="mini" style="width:80%">
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
                                <template slot="label">
                                    <span>是否启用</span>
                                    <el-tooltip effect="dark" content="若该值为停用时，将不会按监测周期产生对应记录。" placement="top">
                                        <i class="el-icon-question question-icon">：</i>
                                    </el-tooltip>
                                </template>
                                <div class="qiyong">
                                    <el-radio v-model="form.shi_fou_qi_yong_" label="1">启用</el-radio>
                                    <el-radio v-model="form.shi_fou_qi_yong_" label="0">停用</el-radio>
                                </div>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.jian_ce_zhou_qi_!==''&&form.jian_ce_zhou_qi_!=='按需'">
                        <el-col :span="12">
                            <el-form-item :label="labelShow">
                                <template slot="label">
                                    <span class="required">{{ labelShow }}</span>
                                </template>
                                <el-checkbox-group v-if="form.jian_ce_zhou_qi_==='每日'" v-model="dayCheck" size="mini">
                                    <el-checkbox v-for="item in weekDays" :key="item.value" :label="item.value" size="mini">{{ item.label }}</el-checkbox>
                                </el-checkbox-group>
                                <template v-if="form.jian_ce_zhou_qi_==='每周'">
                                    <div class="radio" style="width:100%">
                                        <el-radio v-for="item in weekDays" :key="item.value" v-model="weekCheck" :label="item.value" size="mini">{{ item.label }}</el-radio>
                                    </div>
                                </template>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每月'" v-model="monthCheck" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in 28"
                                        :key="item"
                                        :label="`第${item}天`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每季度'" v-model="quarterCheck" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in 3"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每半年'" v-model="halfYearCheck" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in 6"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='每年'" v-model="yearCheck" placeholder="请选择" size="mini" style="width:80%">
                                    <el-option
                                        v-for="item in 12"
                                        :key="item"
                                        :label="`第${item}个月`"
                                        :value="item"
                                    />
                                </el-select>
                                <el-select v-if="form.jian_ce_zhou_qi_==='间隔'" v-model="sepCheck" placeholder="请选择" size="mini" style="width:80%">
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
                            <el-form-item label="下次监测日期为：">
                                <el-tag size="mini" class="eltag">{{ nextDate }}</el-tag>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form.jian_ce_zhou_qi_==='间隔'" :span="12">
                            <el-form-item label="开始监测时间：" prop="">
                                <el-date-picker
                                    v-model="form.kai_shi_shi_jian_"
                                    :clearable="false"
                                    type="date"
                                    placeholder="选择监测开始时间"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd"
                                    size="mini"
                                    style="width:80%"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="控制条件：">
                                <el-input v-model="form.kong_zhi_tiao_jia" type="textarea" :rows="2" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="控制标准：">
                                <el-input v-model="form.kong_zhi_biao_zhu" type="textarea" :rows="2" size="mini" style="width:80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <FacilityData v-if="form.lie_biao_shu_ju_" :is-cul="false" :form-data="{lieBiaoShuJu:form.lie_biao_shu_ju_}" @change-data="onFacilityData" />
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" icon="ibps-icon-save" size="mini" @click="submit">确 定</el-button>
            <el-button icon="ibps-icon-close" type="danger" size="mini" @click="close">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ibpsUserSelector from '@/business/platform/org/selector'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import FacilityData from '@/views/component/facility/facilityData.vue'

export default {
    components: {
        FacilityData,
        ibpsUserSelector,
        IbpsLinkData,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')

    },
    data () {
        return {
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() < (Date.now() - (24 * 60 * 1000 * 60))
                }
            },
            weekDays: [{ label: '周一', value: 1 }, { label: '周二', value: 2 }, { label: '周三', value: 3 }, { label: '周四', value: 4 }, { label: '周五', value: 5 }, { label: '周六', value: 6 }, { label: '周日', value: 7 }],
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            dialogVisible: true,
            title: '配置详情',
            jianCeGangWeiList: [],
            lei_xing_: '',
            form: {
                qu_yu_: '',
                fang_jian_: '',
                fang_jian_id_: '',
                bu_men_: '',
                deviceno1_: '',
                deviceid1_: '', // 设备id
                devicename1_: '',
                deviceno2_: '', // 监控设备
                deviceid2_: '', // 监控设备id
                jian_ce_zhou_qi_: '',
                jian_ce_gang_wei_: '',
                shi_fou_qi_yong_: '1',
                kong_zhi_tiao_jia: '',
                kong_zhi_biao_zhu: '',
                jian_ce_ri_qi_: '',
                ri_qi_lie_biao_: '',
                zi_wai_deng_wai_j: '', // 紫外灯外键
                lie_biao_shu_ju_: '',
                kai_shi_shi_jian_: ''
            },
            isEdit: false,
            nextDate: '',
            dayCheck: [],
            weekCheck: '',
            monthCheck: '',
            quarterCheck: '',
            halfYearCheck: '',
            yearCheck: '',
            sepCheck: '',
            period: [
                { label: '日监测', value: '每日' },
                { label: '周监测', value: '每周' },
                { label: '月监测', value: '每月' },
                { label: '季度监测', value: '每季度' },
                { label: '半年监测', value: '每半年' },
                { label: '年监测', value: '每年' },
                { label: '按时间间隔监测', value: '间隔' },
                { label: '按需监测', value: '按需' }
            ],
            config: {}
        }
    },
    computed: {
        monitoringpPosition () {
            return this.jianCeGangWeiList.filter(i => i.suo_shu_bu_men_ === this.form.bu_men_)
        },
        shouldShowColumn () {
            return (columnName) => {
                return this.config[this.lei_xing_]?.displayField?.includes(columnName)
            }
        },
        shouldRequired () {
            return (columnName) => {
                return this.config[this.lei_xing_]?.requireField?.includes(columnName)
            }
        },
        labelShow () {
            if (this.form.jian_ce_zhou_qi_) {
                if (this.form.jian_ce_zhou_qi_ !== '间隔') {
                    return this.form.jian_ce_zhou_qi_.split('每')[1] + '监测日期：'
                }
                return '间隔时间：'
            }
            return ''
        }
    },
    watch: {
        'form.jian_ce_zhou_qi_' (val, old) {
            if (!old) return
            this.dayCheck = []
            this.weekCheck = ''
            this.monthCheck = ''
            this.quarterCheck = ''
            this.halfYearCheck = ''
            this.yearCheck = ''
            this.sepCheck = ''
            this.nextDate = ''
            this.form.kai_shi_shi_jian_ = ''
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
                const yearPJ = month >= nowM ? today.getFullYear() + 1 : today.getFullYear()
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
    methods: {
        deviceno1Change (key, data) {
            this.form.deviceid1_ = data.id_ || ''
            this.form.devicename1_ = data.she_bei_ming_cheng_ || ''
        },
        deviceno2Change (key, data) {
            this.form.deviceid2_ = data.deviceId || ''
        },
        fangJianChange (key, data) {
            this.form.fang_jian_id_ = data.id_ || ''
            this.form.qu_yu_ = data.qu_yu_ || ''
            this.form.kong_zhi_biao_zhu = data.kong_zhi_biao_zhu || ''
        },
        // 接收自定义组件数据
        onFacilityData (...arg) {
            if (arg.length > 1) {
                this.form.lie_biao_shu_ju_ = arg[1]
            }
        },
        // 格式化数据
        formatForm () {
            // 监测日期格式化
            switch (this.form.jian_ce_zhou_qi_) {
                case '每日':
                    if (!this.dayCheck || this.dayCheck.length === 0) {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    } else if (this.dayCheck.length === 7) {
                        this.form.jian_ce_ri_qi_ = '每天'
                        this.form.ri_qi_lie_biao_ = '1,2,3,4,5,6,7'
                    } else {
                        this.dayCheck.sort(function (a, b) {
                            return a - b
                        })
                        this.form.jian_ce_ri_qi_ = '每周' + this.dayCheck.join(',')
                        this.form.ri_qi_lie_biao_ = this.dayCheck.join(',')
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
                        this.form.jian_ce_ri_qi_ = '每季度第' + [this.quarterCheck] + '个月'
                        this.form.ri_qi_lie_biao_ = this.quarterCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }
                    break
                case '每半年':
                    if (this.halfYearCheck) {
                        this.form.jian_ce_ri_qi_ = '每半年第' + [this.halfYearCheck] + '个月'
                        this.form.ri_qi_lie_biao_ = this.halfYearCheck + ''
                    } else {
                        this.form.jian_ce_ri_qi_ = ''
                        this.form.ri_qi_lie_biao_ = ''
                    }
                    break
                case '每年':
                    if (this.yearCheck) {
                        this.form.jian_ce_ri_qi_ = '每年第' + [this.yearCheck] + '个月'
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
                case '按需':

                    this.form.jian_ce_ri_qi_ = '按需'

                    break
                default:
                    break
            }
        },
        checkForm () {
            if (this.form.bu_men_ === '') {
                throw new Error('部门信息缺失！')
            }
            if (this.form.jian_ce_ri_qi_ === '' && this.form.jian_ce_zhou_qi_ !== '按需') {
                throw new Error('监测日期信息缺失！')
            }
            if (this.form.jian_ce_gang_wei_ === '') {
                throw new Error('监测岗位信息缺失！')
            }
            if (this.shouldRequired('deviceno1_') && this.form.deviceno1_ === '') {
                throw new Error('请先选择设备！')
            }
            if (this.shouldRequired('fang_jian_') && this.form.fang_jian_ === '') {
                throw new Error('请先选择房间！')
            }
            if (this.form.lie_biao_shu_ju_) {
                const lie_biao_shu_ju_ = JSON.parse(this.form.lie_biao_shu_ju_)
                for (let i = 0; i < lie_biao_shu_ju_.length; i++) {
                    const item = lie_biao_shu_ju_[i]
                    if (!item.label && (item.range.length !== 2 || item.range[0] === null || item.range[1] === null) && (!item.fixValue) && (!item.unit)) {
                        throw new Error(`第${i + 1}行数据非法！`)
                    }
                }
            }
        },
        submit () {
            try {
                this.formatForm()
                this.checkForm()
                this.$emit('onSubmit', { form: this.form, isEdit: this.isEdit })
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        close () {
            this.$emit('onClose')
        },
        // 格式化监测日期
        formatData () {
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
                        case '间隔':
                            this.sepCheck = +this.form.ri_qi_lie_biao_
                            break
                        default:
                            break
                    }
                })
            }
        },
        open (row, jianCeGangWeiList, parentForm, config) {
            this.dialogVisible = true
            this.jianCeGangWeiList = jianCeGangWeiList
            this.lei_xing_ = parentForm.lei_xing_
            this.config = config
            this.isEdit = !!(row && row.zi_wai_deng_wai_j)
            // 编辑
            if (this.isEdit) {
                // this.form = JSON.parse(JSON.stringify(row))
                const temp = JSON.parse(JSON.stringify(row))
                Object.assign(this.form, temp)
            } else {
                this.form.zi_wai_deng_wai_j = this.$utils.guid()
                this.form.bu_men_ = parentForm.bian_zhi_bu_men_
                this.form.jian_ce_gang_wei_ = parentForm.gang_wei_
                this.form.jian_ce_ri_qi_ = parentForm.jian_ce_ri_qi_
                this.form.kong_zhi_tiao_jia = parentForm.tiao_jian_
                this.form.kong_zhi_biao_zhu = parentForm.kong_zhi_biao_zhu
                this.form.jian_ce_zhou_qi_ = parentForm.zhou_qi_
                this.form.ri_qi_lie_biao_ = parentForm.ri_qi_lie_biao_
                this.form.lie_biao_shu_ju_ = parentForm.lie_biao_shu_ju_
                this.form.kai_shi_shi_jian_ = parentForm.kai_shi_shi_jian_
            }
            this.formatData()
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
        .qiyong{
            margin-top: 0px;
        }
        .el-row{
            margin: 10px 0;
        }
        .required{
            color: #606266 !important;
            &::before{
                content: '*';
                margin: 0 4px 0 -7.5px;
                color: #F56C6C;
            }
        }
        .eltag{
            margin-top: 6px;
        }
    }
    .el-row{
            margin: 0 !important;
    }
    .question-icon{
            margin-left: 2px;
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
