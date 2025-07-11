<template>
    <el-dialog
        v-loading="loading"
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog paper-detail-dialog"
        top="0"
    >
        <div slot="title" class="dialog-title">
            <span class="dialogtitle">{{ title }}</span>
            <div>
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </div>
        <div class="container">
            <div class="left" :style="{width:initWidth}">
                <div class="search">
                    <div class="item">
                        <div class="label">维护月份：</div>
                        <div class="content">
                            <el-date-picker
                                v-model="month"
                                :clearable="false"
                                type="month"
                                placeholder="选择查询的月份"
                                value-format="yyyy-MM"
                                :picker-options="pickerOptions"
                                size="mini"
                                @change="handleMonthChange"
                            />
                        </div>
                    </div>
                </div>
                <div class="agend">
                    <div class="descript">
                        <div class="item">
                            <div class="green-circle" />
                            <span>全部完成</span>
                        </div>
                        <div class="item">
                            <div class="orange-circle" />
                            <span>部分完成</span>
                        </div>
                        <div class="item">
                            <div class="red-circle" />
                            <span>全部未完成</span>
                        </div>
                        <div class="item">
                            <div class="grey-bg" />
                            <span>设备未使用</span>
                        </div>
                        <div class="item">
                            <div class="red-bg" />
                            <span>设备异常</span>
                        </div>
                        <div class="item" style="margin-left:60px">
                            <span>设备异常次数：{{ formatData.repairCount }}</span>
                        </div>
                        <div class="item">
                            <span>设备总维护次数：{{ formatData.maintenanceCount }}</span>
                        </div>
                        <div class="item">
                            <span>设备故障率：{{ formatData.faultRate }} %</span>
                            <el-tooltip
                                effect="dark"
                                content="设备故障率计算公式：异常次数/总维护次数*100%，待处理与未使用不计入总维护次数中。"
                                placement="top"
                            >
                                <i class="el-icon-question question-icon" />
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item-time">
                        <span>统计时间：{{ curTime }}</span>
                    </div>
                </div>
                <div class="table">
                    <div class="column">
                        <div class="item">保养类型/日期</div>
                        <div v-for="item in type" :key="item" class="item">{{ item }}</div>
                    </div>
                    <div class="column">
                        <div v-for="(item,index) in formatData.list" :key="index" class="content-item">
                            <div class="item">{{ index+1 }}</div>
                            <div
                                v-for="(i,ind) in item"
                                :key="ind"
                                class="item"
                                :class="{
                                    unusual: i.status === false, // 异常
                                    unused: i.isUsed === false // 未使用
                                }"
                            >
                                <el-tooltip v-show="i.count>0" class="item" effect="light" placement="top-start">
                                    <template slot="content">
                                        <div>
                                            <span v-if="i.todo">待处理：{{ i.todo }}；</span>
                                            <span v-if="i.done">已完成：{{ i.done }}；</span>
                                            <div v-for="(ii,indd) in i.data" :key="indd" class="detail">
                                                <el-divider />
                                                <div class="detail-item">
                                                    <div class="item" style="margin:2px 0">处理人：{{ switchIdToUserName(ii.bian_zhi_ren_)|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">设备状态：{{ ii.wei_hu_zhuang_tai|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">维护项目：{{ ii.wei_hu_xiang_mu_c|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">备注：{{ ii.bei_zhu_|| '/' }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <div v-if="i.todo === 0 && i.isUsed" class="green-circle" />
                                    <div v-if="i.done === 0 && i.todo !== 0" class="red-circle" />
                                    <div v-if="i.todo !== 0 && i.done !== 0" class="orange-circle" />
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import xlsx from 'xlsx'
import fs from 'file-saver'
import dayjs from 'dayjs'
import ibpsUserSelector from '@/business/platform/org/selector'
export default {
    components: {
        ibpsUserSelector
    },
    props: {
        params: {
            type: Object,
            default: function () {
                return {}
            }
        },
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        const monthList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        const monthValue = dayjs().format('YYYY-MM')
        const year = +monthValue.split('-')[0]
        const month = +monthValue.split('-')[1]
        const monthDays = monthList[month - 1]
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            monthList[1] = 29
        }
        const { userId, position, level } = this.$store.getters
        return {
            curTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now()
                }
            },
            monthList: monthList,
            month: monthValue,
            monthDays: monthDays,
            userId: userId,
            position: position,
            level: level.second || level.first,
            loading: false,
            title: '设备维护统计',
            toolbars: [
                { key: 'export', label: '导出', type: 'primary', hidden: true },
                { key: 'cancel', label: '返回', type: 'danger' }
            ],
            initWidth: '1800px',
            isEdit: false,
            isFinished: false,
            readonly: false,
            preParams: {},
            Ids: [],
            form: {
            },
            rules: {

            },
            dataList: [],
            type: ['日保养', '周保养', '月保养', '季度保养', '半年保养', '年保养', '按需保养', '间隔保养']
        }
    },
    computed: {
        deviceColumns () {
            return {
                'leiXing': '保养类型',
                'One': this.month + '-01',
                'Two': this.month + '-02',
                'Three': this.month + '-03',
                'Four': this.month + '-04',
                'Five': this.month + '-05',
                'Six': this.month + '-06',
                'Seven': this.month + '-07',
                'Eight': this.month + '-08',
                'Nine': this.month + '-09',
                'Ten': this.month + '-10',
                'Eleven': this.month + '-11',
                'Twelve': this.month + '-12',
                'Thirteen': this.month + '-13',
                'Fourteen': this.month + '-14',
                'Fifteen': this.month + '-15',
                'Sixteen': this.month + '-16',
                'Seventeen': this.month + '-17',
                'Eighteen': this.month + '-18',
                'Nineteen': this.month + '-19',
                'Twenty': this.month + '-20',
                'Twenty-One': this.month + '-21',
                'Twenty-Two': this.month + '-22',
                'Twenty-Three': this.month + '-23',
                'Twenty-Four': this.month + '-24',
                'Twenty-Five': this.month + '-25',
                'Twenty-Six': this.month + '-26',
                'Twenty-Seven': this.month + '-27',
                'Twenty-Eight': this.month + '-28',
                'Twenty-Nine': this.month + '-29',
                'Thirty': this.month + '-30',
                'Thirty-One': this.month + '-31'
            }
        },
        formatData () {
            let repairCount = 0 // 异常
            let maintenanceCount = 0 // 维护
            const fliterData = this.dataList
            const result = []
            fliterData.forEach(item => {
                const { wei_hu_lei_xing_ } = item
                const t = result.find(i => i.wei_hu_lei_xing_ === wei_hu_lei_xing_)
                if (t) {
                    t.children.push(item)
                } else {
                    result.push({
                        wei_hu_lei_xing_: wei_hu_lei_xing_,
                        children: [item]
                    })
                }
            })
            // console.log('fliterData', result)
            const answer = new Array(this.monthDays)
            for (let i = 0; i < this.monthDays; i++) {
                const arr = []
                const day = ('0' + (i + 1)).slice(-2)
                const fullDay = this.month + '-' + day
                // console.log(fullDay)
                this.type.forEach(item => {
                    const obj = {
                        data: [],
                        count: 0,
                        todo: 0,
                        done: 0,
                        status: true,
                        isUsed: true
                    }
                    const t = result.find(j => j.wei_hu_lei_xing_ === item)
                    if (t) {
                        const tempList = t.children.filter(k => k.ji_hua_shi_jian_ === fullDay)
                        obj.count = tempList.length
                        obj.todo = tempList.filter(k => k.shi_fou_guo_shen_ === '待处理').length
                        const yiwancheng = tempList.filter(k => k.shi_fou_guo_shen_ === '已完成')
                        obj.done = yiwancheng.length
                        obj.data = yiwancheng
                        const weixiu = tempList.filter(item => item.wei_hu_zhuang_tai === '异常')
                        obj.isUsed = !tempList.some(item => item.wei_hu_zhuang_tai === '未使用')
                        obj.status = weixiu.length === 0
                        repairCount += weixiu.length
                        maintenanceCount += yiwancheng.filter(item => item.wei_hu_zhuang_tai !== '未使用').length
                    }
                    arr.push(obj)
                })
                answer[i] = arr
            }
            // 故障率
            const faultRate = maintenanceCount === 0 ? '0.00' : ((repairCount / maintenanceCount) * 100).toFixed(2)
            // console.log('data', answer)
            return { list: answer, repairCount, maintenanceCount, faultRate }
        }
    },
    mounted () {
        if (this.params.searchMonth) {
            this.month = this.params.searchMonth
            this.handleMonthChange(this.month)
        } else {
            this.init()
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog()
                    break
                case 'export':
                    this.handleExport()
                    break
                default:
                    break
            }
        },
        // 人员id 转人员名称
        switchIdToUserName (id) {
            const { userList } = this.$store.getters
            const temp = userList.find(item => item.userId === id)
            return temp ? temp.userName : ''
        },
        xlsx (json, fields, filename = '.xlsx') { // 导出xlsx
            json.forEach(item => {
                for (const i in item) {
                    if (fields.hasOwnProperty(i)) {
                        item[fields[i]] = item[i]
                    }
                    delete item[i] // 删除原先的对象属性
                }
            })
            const sheetName = filename // excel的文件名称
            const wb = xlsx.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
            const ws = xlsx.utils.json_to_sheet(json, { header: Object.values(fields) }) // 将JS对象数组转换为工作表。
            wb.SheetNames.push(sheetName)
            wb.Sheets[sheetName] = ws
            // console.log('json', ws)
            const defaultCellStyle = { font: { name: 'Verdana', sz: 13, color: 'FF00FF88' }, fill: { fgColor: { rgb: 'FFFFAA00' }}}// 设置表格的样式
            const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } // 写入的样式
            const wbout = xlsx.write(wb, wopts)
            const blob = new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' })
            fs.saveAs(blob, filename + '.xlsx')
        },
        s2ab (s) {
            let buf
            if (typeof ArrayBuffer !== 'undefined') {
                buf = new ArrayBuffer(s.length)
                const view = new Uint8Array(buf)
                for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
                return buf
            } else {
                buf = new Array(s.length)
                for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
                return buf
            }
        },
        getTimeStamp () {
            return dayjs().format('YYYYMMDDHHmmss')
        },
        handleExport () {
            const exportData = this.type.map((item, index) => {
                const obj = { 'leiXing': item }
                for (let i = 1; i < this.monthDays + 1; i++) {
                    const t = this.formatData.list[i - 1][index]
                    const text = `已完成：${t.done};待处理：${t.todo}`
                    obj[Object.keys(this.deviceColumns)[i]] = text
                }
                return obj
            })

            // const copyData = JSON.parse(JSON.stringify(exportData))
            // console.log('导出数据', copyData)
            this.xlsx(exportData, this.deviceColumns, '设备维护统计' + this.getTimeStamp())
            this.$message.success('导出设备成功！')
        },
        async handleMonthChange (val) {
            const year = +val.split('-')[0]
            const month = +val.split('-')[1]
            this.monthDays = this.monthList[month - 1]
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                this.monthList[1] = 29
            } else {
                this.monthList[1] = 28
            }
            await this.init()
        },
        // 获取人员部门
        getPersonPosition (id) {
            const userList = this.$store.getters.userList
            const bianzhiUserid = userList.find(i => i.userId === id)
            if (bianzhiUserid) {
                return bianzhiUserid.positionId
            }
        },
        checkRequired (flag) {
        },
        // 刷新
        async goRefresh () {
        },
        // 关闭当前窗口
        closeDialog (needRefresh) {
            this.$emit('update:dialogVisible', false, needRefresh)
        },
        async init () {
            this.loading = true
            this.title = `[${this.params.original_device_n}/${this.params.she_bei_ming_chen}]月度设备维护统计`
            const y = +this.month.split('-')[0]
            const m = +this.month.split('-')[1]
            // const sql = `select a.id_ AS mainId, a.shi_fou_guo_shen_, a.bian_zhi_bu_men_, c.wei_hu_xiang_mu_c, a.bian_zhi_ren_, a.she_bei_ming_chen, a.she_bei_bian_hao_, a.ri_qi_, a.original_device_n, a.zhu_zhou_qi_, a.nei_rong_qing_kua, a.ji_hua_shi_jian_, c.she_bei_lei_xing_, c.wei_hu_ri_qi_, c.wei_hu_lei_xing_, c.ri_qi_shu_zi_, d.bei_zhu_, d.wei_hu_zhuang_tai from t_mjsbwhbyjlby a left join t_mjsbwhjhzb b on a.ji_hua_wai_jian_ = b.id_ left join v_device_devicemaintenance c on b.she_bei_bian_hao_ = c.id_ left join t_mjsbwhbyjlzby d on a.id_ = d.parent_id_ where a.ri_qi_ = '${this.params.ri_qi_}' and a.shi_fou_guo_shen_!='已删除' and YEAR(a.ji_hua_shi_jian_) = ${y} and MONTH(a.ji_hua_shi_jian_) = ${m}`
            const { variables: { data }} = await this.$common.request('query', {
                key: 'getOneDeviceMaintenance',
                params: [this.params.ri_qi_, y, m]
            })
            this.dataList = data
            this.dataList.forEach(item => {
                if (!Object.hasOwn(item, 'wei_hu_lei_xing_') || !item.wei_hu_lei_xing_) {
                    item.wei_hu_lei_xing_ = '按需保养'
                }
            })
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.paper-detail-dialog {
    ::v-deep {
        .el-dialog__header {
            text-align: center;
        }
    }
.dialog-title{
    display: flex;
    align-items: center;
    justify-content: center;
    div{
        z-index: 99999999;
        position: absolute;
        right:8vw;
    }
    .dialogtitle{
        font-size: 22px;
        font-family: SimHei;
        font-weight: bold;
        color: #222;
    }
}
.container {
        display: flex;
        width: 100%;
        justify-content: center;
        .el-row{
            margin: 0 !important;
        }
        .required{
            color: #606266 !important;
            &::before{
                content: '*';
                margin: 0 4px 0 -7.5px;
                color: #F56C6C;
            }
        }
        .left{
            height: calc(100vh - 100px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px;
            overflow-y: auto;
            .agend{
                margin: 20px 0 10px 0;
                display: flex;
                justify-content: space-between;
                .descript{
                    display: flex;
                    gap: 18px;
                    .item{
                        width: auto;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        .green-circle {
                            width: 12px;
                            height: 12px;
                            background-color: #67C23A;
                            border-radius: 50%;
                        }
                        .red-circle {
                            width: 12px;
                            height: 12px;
                            background-color: #F56C6C;
                            border-radius: 50%;
                        }
                        .orange-circle {
                            width: 12px;
                            height: 12px;
                            background-color: #E6A23C;
                            border-radius: 50%;
                        }
                        .red-bg {
                            width: 12px;
                            height: 12px;
                            background-color: #F56C6C;
                            opacity: .7;
                        }
                        .grey-bg{
                            width: 12px;
                            height: 12px;
                            background-color: #a6b1bd;
                            opacity: .7;
                        }
                    }
                }

            }
            .search{
                .label{
                    font-size: 12px;
                }
                .item{
                    display: flex;
                    align-items: center;
                }
            }
            .item{
                width: 100%;
            }
            .title{
                margin: 16px 0 6px -16px;
            }
            .table{
                display: flex;
                .column{
                    flex: 1;
                    &:nth-child(2){
                        display: flex;
                    }
                    >.item{
                        height: 50px;
                        text-align: center;
                        line-height: 50px;
                        border-bottom: 1px solid #333;
                        border-right: 1px solid #333;
                        border-left: 1px solid #333;
                        min-width: 100px;
                    }
                    @media screen and (max-width: 1800px) {
                         >.item{
                            height: 44px;
                            line-height: 44px;
                        }
                    }
                    @media screen and (max-width: 1550px) {
                         >.item{
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                    >.item:nth-child(1){
                        font-weight: 600;
                        border-top: 1px solid #333;
                        height: 30px;
                        line-height: 30px;
                    }
                    .content-item{
                        .unusual{
                            background-color: #F56C6C !important;
                            opacity: .7 !important;
                        }
                        .unused{
                             background-color: #a6b1bd;
                             opacity: .7;
                        }
                        >.item{
                            position: relative;
                            height: 50px;
                            width: 50px;
                            text-align: center;
                            line-height: 50px;
                            border-bottom: 1px solid #333;
                            border-right: 1px solid #333;
                        }
                        @media screen and (max-width: 1800px) {
                            >.item{
                                height: 44px;
                                width: 44px;
                                line-height: 44px;

                            }
                        }
                        @media screen and (max-width: 1550px) {
                            >.item{
                                height: 40px;
                                width: 40px;
                                line-height: 40px;

                            }
                        }
                        >.item:nth-child(1){
                            font-weight: 600;
                            border-top: 1px solid #333;
                            height: 30px;
                            line-height: 30px;
                        }
                        .green-circle {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 10px;
                            height: 10px;
                            background-color: #67C23A;
                            border-radius: 50%;
                        }
                        .red-circle {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 10px;
                            height: 10px;
                            background-color: #F56C6C;
                            border-radius: 50%;
                        }
                        .orange-circle {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 10px;
                            height: 10px;
                            background-color: #E6A23C;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
}
    ::v-deep {
        .el-form-item__label{
            text-align: left;
            font-size: 12px !important;
        }
        .el-form-item__content{
            font-size: 12px !important;
        }
        .el-divider--horizontal{
            margin: 10px 0;
        }
    }
</style>
