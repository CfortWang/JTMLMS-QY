<template>
    <el-dialog ref="dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" class="form-renderer-dialog" :width="width" :top="top" :title="this.dynamicParams.editFromType" :custom-class="customClass" append-to-body @close="closeDialog">
        <div class="maintenanceCycle">
            <div class="maintenanceFont">维护周期：</div>
            <el-select v-model="cycleValue" clearable placeholder="请选择">
                <el-option
                    v-for="item in cycleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </div>
        <div v-if="judgeShow>0" class="maintenanceCycle" style="align-items: baseline;">
            <div class="maintenanceFont">{{ cycleOptions[judgeShow].label }}日期：</div>
            <div>
                <div v-if="judgeShow==1" class="maintenanceCycle marginNone">
                    <el-checkbox-group v-for="(item,i) in weekList" :key="i" v-model="dayCheckList" style="margin-right:1%;">
                        <el-checkbox class="rightMargin" :label="item" />
                    </el-checkbox-group>
                </div>
                <el-select v-if="judgeShow==2" v-model="monthDateValue" clearable placeholder="请选择">
                    <el-option
                        v-for="item in monthDateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-radio-group v-if="judgeShow==3" v-model="weekDateValue">
                    <el-radio v-for="(item,i) in weekList" :key="i" :label="item">{{ item }}</el-radio>
                </el-radio-group>
                <el-select v-if="judgeShow==4" v-model="quarterDateValue" clearable placeholder="请选择">
                    <el-option
                        v-for="item in qmonthDateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-select v-if="judgeShow==5" v-model="midyearDateValue" clearable placeholder="请选择">
                    <el-option
                        v-for="item in mymonthDateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-select v-if="judgeShow==6" v-model="yearDateValue" clearable placeholder="请选择">
                    <el-option
                        v-for="item in ymonthDateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <div v-if="periodDayDate!=''&&judgeShow==1" class="describe">下次维护日期为 <span class="fontColor">{{ periodDayDate }}</span></div>
                <div v-if="periodWeekDate!=''&&judgeShow==3" class="describe">下次维护日期为 <span class="fontColor">{{ periodWeekDate }}</span></div>
                <div v-if="periodMonthDate!=''&&judgeShow==2" class="describe">下次维护日期为 <span class="fontColor">{{ periodMonthDate }}</span></div>
                <div v-if="periodQuarterDate!=''&&judgeShow==4" class="describe">下次维护日期为 <span class="fontColor">{{ periodQuarterDate }}</span></div>
                <div v-if="periodMidYearDate!=''&&judgeShow==5" class="describe">下次维护日期为 <span class="fontColor">{{ periodMidYearDate }}</span></div>
                <div v-if="periodYearDate!=''&&judgeShow==6" class="describe">下次维护日期为 <span class="fontColor">{{ periodYearDate }}</span></div>
            </div>
        </div>
        <div class="maintenanceCycle" style="align-items: normal;">
            <div class="maintenanceFont">维护项目：</div>
            <el-input
                v-model="maintenanceTextarea"
                style="width:50%;"
                type="textarea"
                placeholder="请输入内容"
                maxlength="500"
                show-word-limit
            />
        </div>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="editFromType != 'consult' ? toolbars : toolbarsConsult" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>
<script>
import ActionUtils from '@/utils/action'
import Vue from 'vue'
// Vue.component('ibps-formrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        customClass: {
            type: String
        },
        width: {
            type: String,
            default: '80%'
        },
        top: {
            type: String,
            default: '10%'
        },
        editFromType: {
            type: String,
            default: 'add'
        },
        dynamicParams: {
            type: Object
        },
        templateKey: {
            type: String,
            default: ''
        }
    },
    data () {
        const lunarGeneration = (sum) => {
            const arr = []
            for (let i = 1; i < sum; i++) {
                const mid = { value: '', label: '' }
                mid.value = '第' + i + '日'
                mid.label = '第' + i + '日'
                arr.push(mid)
            }
            return arr
        }
        const monthLunarGeneration = (sum) => {
            const arr = []
            for (let i = 1; i < sum; i++) {
                const mid = { value: '', label: '' }
                mid.value = '第' + i + '个月'
                mid.label = '第' + i + '个月'
                arr.push(mid)
            }
            return arr
        }
        const formatCurrentDate = () => {
            const today = new Date()
            const year = today.getFullYear()
            const month = (today.getMonth() + 1).toString().padStart(2, '0')
            const day = today.getDate().toString().padStart(2, '0')
            return `${year}-${month}-${day}`
        }
        return {
            qrCode: '',
            dialogVisible: this.visible,
            cycleOptions: [{
                value: '按需保养',
                label: '按需保养'
            }, {
                value: '日保养',
                label: '日保养'
            }, {
                value: '月保养',
                label: '月保养'
            }, {
                value: '周保养',
                label: '周保养'
            }, {
                value: '季度保养',
                label: '季度保养'
            }, {
                value: '半年保养',
                label: '半年保养'
            }, {
                value: '年保养',
                label: '年保养'
            }],
            cycleValue: '',
            qmonthDateOptions: monthLunarGeneration(4),
            ymonthDateOptions: monthLunarGeneration(13),
            mymonthDateOptions: monthLunarGeneration(7),
            monthDateOptions: lunarGeneration(29),
            monthDateValue: '',
            weekList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            quarterList: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]],
            midList: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12]],
            dayCheckList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            maintenanceTextarea: '',
            toolbars: [
                { key: 'confirm', label: '确定' },
                { key: 'cancel' }
            ],
            toolbarsConsult: [{ key: 'cancel' }],
            weekDateValue: '',
            quarterDateValue: '',
            midyearDateValue: '',
            yearDateValue: '',
            periodDayDate: '',
            periodWeekDate: '',
            periodMonthDate: '',
            periodQuarterDate: '',
            periodMidYearDate: '',
            periodYearDate: '',
            nowData: formatCurrentDate(),
            judgeShow: 0,
            daysOfWeek: [7, 1, 2, 3, 4, 5, 6]
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        },
        cycleValue: {
            handler: function (val, oldVal) {
                if (val == '日保养') {
                    this.judgeShow = 1
                } else if (val == '月保养') {
                    this.judgeShow = 2
                } else if (val == '周保养') {
                    this.judgeShow = 3
                } else if (val == '季度保养') {
                    this.judgeShow = 4
                } else if (val == '半年保养') {
                    this.judgeShow = 5
                } else if (val == '年保养') {
                    this.judgeShow = 6
                } else {
                    this.judgeShow = 0
                }
            },
            immediate: true
        },
        dayCheckList: {
            handler: function (val, oldVal) {
                const today = new Date()
                const dayOfWeekNumber = this.daysOfWeek[today.getDay()]
                const weekNum = []
                val.forEach((item, i) => {
                    const num = this.weekList.findIndex(e => e == item) + 1
                    weekNum.push(num)
                })
                weekNum.sort(function (a, b) {
                    return a - b
                })
                const num = weekNum.findIndex(e => e > dayOfWeekNumber)
                if (val.length > 0 && num != -1) {
                    this.periodDayDate = this.getDayDate(weekNum[num], 0)
                } else if (val.length > 0 && num == -1) {
                    this.periodDayDate = this.getDayDate(weekNum[0], 1)
                } else {
                    this.periodDayDate = ''
                }
            },
            immediate: true
        },
        weekDateValue: {
            handler: function (val, oldVal) {
                const today = new Date()
                const dayOfWeekNumber = this.daysOfWeek[today.getDay()]
                const weekNum = []
                const num1 = this.weekList.findIndex(e => e == val) + 1
                weekNum.push(num1)
                const num = weekNum.findIndex(e => e > dayOfWeekNumber)
                if (val != '' && num != -1) {
                    this.periodWeekDate = this.getDayDate(weekNum[0], 0)
                } else if (val != '' && num == -1) {
                    this.periodWeekDate = this.getDayDate(weekNum[0], 1)
                } else {
                    this.periodWeekDate = ''
                }
            },
            immediate: true
        },
        monthDateValue: {
            handler: function (val, oldVal) {
                const turnVal = val.replace(/[^0-9]/ig, '')
                const today = new Date()
                const day = today.getDate()
                const nextMonth = this.getNextMonthDate(today, turnVal, 1)
                const currentMonth = this.getNextMonthDate(today, turnVal, 0)
                this.periodMonthDate = turnVal > day ? currentMonth : nextMonth
            }
            // immediate: true
        },
        quarterDateValue: {
            handler: function (val, oldVal) {
                const turnVal = val.replace(/[^0-9]/ig, '')
                const today = new Date()
                const month = today.getMonth() + 1
                const qu = this.getQuarter(today)
                const nowM = this.quarterList[qu - 1][turnVal - 1]
                const nextM = this.quarterList[qu][turnVal - 1]

                const endMonth = month >= nowM ? nextM : nowM
                const yearPJ = today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.periodQuarterDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        midyearDateValue: {
            handler: function (val, oldVal) {
                const turnVal = val.replace(/[^0-9]/ig, '')
                const today = new Date()
                const month = today.getMonth() + 1
                const qu = month > 6 ? 2 : 1
                const nowM = this.midList[qu - 1][turnVal - 1]
                const nextM = this.midList[qu][turnVal - 1]

                const endMonth = month >= nowM ? nextM : nowM
                const yearPJ = today.getFullYear()
                const monthPJ = endMonth > 9 ? endMonth : '0' + endMonth

                this.periodMidYearDate = yearPJ + '-' + monthPJ + '-01'
            }
            // immediate: true
        },
        yearDateValue: {
            handler: function (val, oldVal) {
                const turnVal = val.replace(/[^0-9]/ig, '')
                const today = new Date()
                const month = today.getMonth() + 1
                const year = today.getFullYear()
                const qu = month >= turnVal ? year + 1 : year
                const monthPJ = turnVal > 9 ? turnVal : '0' + turnVal

                this.periodYearDate = qu + '-' + monthPJ + '-01'
            }
            // immediate: true
        }
    },
    created () {
        this.loadFormData()
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'confirm':
                    if (this.dynamicParams.customComponent) {
                        this.handleConfirmV2(key)
                    } else {
                        this.handleConfirm(key)
                    }
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        // 自定义组件中
        handleConfirmV2 (key) {
            const val = this.corresponding(this.cycleValue)
            const valNum = this.correspondingNum(this.cycleValue)
            if (this.cycleValue !== '按需保养' && this.cycleValue !== '' && val !== '' && valNum !== '' && this.maintenanceTextarea !== '') {
                this.$emit('submit', { weiHuLeiXing: this.cycleValue, weiHuRiQi: val, riQiShuZi: valNum, weiHuXiangMuC: this.maintenanceTextarea, index: this.dynamicParams?.index })
                this.closeDialog()
            } else if (this.cycleValue === '按需保养' && this.cycleValue !== '' && this.maintenanceTextarea !== '') {
                this.$emit('submit', { weiHuLeiXing: this.cycleValue, weiHuXiangMuC: this.maintenanceTextarea, index: this.dynamicParams?.index })
                this.closeDialog()
            } else {
                this.$message.warning('请保证所有信息都已填写')
            }
        },
        handleConfirm (key) {
            const a = this.dynamicParams.formObj.getData(this.templateKey)
            const val = this.corresponding(this.cycleValue)
            const valNum = this.correspondingNum(this.cycleValue)
            if (this.cycleValue != '按需保养' && this.cycleValue != '' && val != '' && valNum != '' && this.maintenanceTextarea != '') {
                if (this.dynamicParams.position == 'manage') {
                    this.$set(a, this.dynamicParams.params.index, { ...a[this.dynamicParams.params.index], weiHuLeiXing: this.cycleValue, weiHuRiQi: val, riQiShuZi: valNum, weiHuXiangMuC: this.maintenanceTextarea })
                } else {
                    a.push({ weiHuLeiXing: this.cycleValue, weiHuRiQi: val, riQiShuZi: valNum, weiHuXiangMuC: this.maintenanceTextarea })
                }
                // this.$nextTick(function(){
                this.dynamicParams.formObj.setData(this.templateKey, a)
                // })

                this.closeDialog()
            } else if (this.cycleValue == '按需保养' && this.cycleValue != '' && this.maintenanceTextarea != '') {
                if (this.dynamicParams.position == 'manage') {
                    this.$set(a, this.dynamicParams.params.index, { weiHuLeiXing: this.cycleValue, weiHuXiangMuC: this.maintenanceTextarea })
                } else {
                    a.push({ weiHuLeiXing: this.cycleValue, weiHuXiangMuC: this.maintenanceTextarea })
                }
                // this.$nextTick(function(){
                this.dynamicParams.formObj.setData(this.templateKey, a)
                // })

                this.closeDialog()
            } else {
                this.dynamicParams.formObj.$message.warning('请保证所有信息都已填写')
            }
        },
        corresponding (content) {
            const that = this
            if (content == '日保养') {
                let str = '每周'
                const numArr = []
                that.dayCheckList.forEach((element, i) => {
                    const ind = that.weekList.findIndex(item => item === element) != -1 ? that.weekList.findIndex(item => item === element) + 1 : ''
                    numArr.push(ind)
                })
                numArr.sort(function (a, b) {
                    return a - b
                })
                numArr.forEach((element, i) => {
                    if (i == that.dayCheckList.length - 1) {
                        str = str + element
                    } else {
                        str = str + element + ','
                    }
                })
                return str == '每周1,2,3,4,5,6,7' ? '每天' : str
            } else if (content == '月保养') {
                return '每月' + that.monthDateValue
            } else if (content == '周保养') {
                const ind = that.weekList.findIndex(item => item === that.weekDateValue) != -1 ? that.weekList.findIndex(item => item === that.weekDateValue) + 1 : ''
                return '每周' + ind
            } else if (content == '季度保养') {
                return '每季度' + that.quarterDateValue
            } else if (content == '半年保养') {
                return '每半年' + that.midyearDateValue
            } else if (content == '年保养') {
                return '每年' + that.yearDateValue
            } else {
                return ''
            }
        },
        correspondingNum (content) {
            const that = this
            if (content == '日保养') {
                let str = ''
                const numArr = []
                that.dayCheckList.forEach((element, i) => {
                    const ind = that.weekList.findIndex(item => item === element) + 1
                    numArr.push(ind)
                })
                numArr.sort(function (a, b) {
                    return a - b
                })
                numArr.forEach((element, i) => {
                    if (i == that.dayCheckList.length - 1) {
                        str = str + element
                    } else {
                        str = str + element + ','
                    }
                })
                return str
            } else if (content == '月保养') {
                const turnVal = that.monthDateValue.replace(/[^0-9]/ig, '')
                return turnVal
            } else if (content == '周保养') {
                const ind = that.weekList.findIndex(item => item === that.weekDateValue) != -1 ? that.weekList.findIndex(item => item === that.weekDateValue) + 1 : ''
                return ind
            } else if (content == '季度保养') {
                const turnVal = that.quarterDateValue.replace(/[^0-9]/ig, '')
                return turnVal
            } else if (content == '半年保养') {
                const turnVal = that.midyearDateValue.replace(/[^0-9]/ig, '')
                return turnVal
            } else if (content == '年保养') {
                const turnVal = that.yearDateValue.replace(/[^0-9]/ig, '')
                return turnVal
            } else {
                return ''
            }
        },
        assignment (content) {
            const that = this
            if (content.weiHuLeiXing == '日保养') {
                const strArr = []
                const str = content.weiHuRiQi == '每天' ? '1,2,3,4,5,6,7' : content.weiHuRiQi.slice(2)
                const partArr = str.split(',')
                // console.log(partArr)
                partArr.forEach((e, i) => {
                    const num = e * 1 - 1
                    strArr.push(this.weekList[num])
                })
                this.dayCheckList = strArr
            } else if (content.weiHuLeiXing == '月保养') {
                that.monthDateValue = content.weiHuRiQi.slice(2)
            } else if (content.weiHuLeiXing == '周保养') {
                const str = content.weiHuRiQi.slice(2)
                const partArr = str.split(',')
                // console.log(partArr*1-1)
                that.weekDateValue = this.weekList[partArr * 1 - 1]
            } else if (content.weiHuLeiXing == '季度保养') {
                that.quarterDateValue = content.weiHuRiQi.slice(3)
            } else if (content.weiHuLeiXing == '半年保养') {
                that.midyearDateValue = content.weiHuRiQi.slice(3)
            } else if (content.weiHuLeiXing == '年保养') {
                that.yearDateValue = content.weiHuRiQi.slice(2)
            } else {

            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        loadFormData () {
            if (this.dynamicParams.position == 'manage') {
                const a = this.dynamicParams.formObj.getData(this.templateKey)[this.dynamicParams.params.index]
                this.assignment(a)
                this.cycleValue = a.weiHuLeiXing
                this.maintenanceTextarea = a.weiHuXiangMuC
            }
            if (this.dynamicParams.customComponent && this.dynamicParams.row) {
                const a = this.dynamicParams.row
                this.assignment(a)
                this.cycleValue = a.weiHuLeiXing
                this.maintenanceTextarea = a.weiHuXiangMuC
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
<style lang="scss" >
.form-renderer-dialog {
    .el-dialog__body {
        padding: 10px 0 5px 0;
    }
    .el-dialog__headerbtn {
        z-index: 99999;
    }
    @media print {
        .el-dialog__headerbtn {
            display: none !important;
        }
        .hidden-print {
            padding: 0;
            margin: 0;
        }
    }
}
.maintenanceCycle{
    display: flex;
    align-items: center;
    margin: 2%;
}
.maintenanceFont{
    width: 10%;
}
.marginNone{
    margin: 0;
}
.rightMargin{
    margin-right: 2.5vh !important;
}
.describe{
    margin-top: 2%;
    font-size: 12px;
    color: #808080;
}
.fontColor{
    color: #409EFF;
}
</style>
