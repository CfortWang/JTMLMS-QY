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
                    <div class="item">
                        <div class="label">部门：</div>
                        <ibps-user-selector
                            v-model="position"
                            type="position"
                            readonly-text="text"
                            :disabled="false"
                            :multiple="false"
                            :filter="filter"
                            filtrate
                        />
                    </div>
                    <div class="item">
                        <div class="label">灯管号：</div>
                        <div class="content">
                            <el-input v-model="deviceNo" size="mini" />
                        </div>
                    </div>
                    <div class="item">
                        <div class="label">紫外灯名：</div>
                        <div class="content">
                            <el-input v-model="deviceName" size="mini" />
                        </div>
                    </div>
                    <div class="item">
                        <div class="label">岗位：</div>
                        <div class="content">
                            <el-input v-model="gangWei" size="mini" />
                        </div>
                    </div>
                </div>
                <div class="hearder">
                    <div class="agend">
                        <div class="item">
                            <div class="green-circle" />
                            <span>已完成</span>
                        </div>
                        <!-- <div class="item">
                            <div class="orange-circle" />
                            <span>部分完成</span>
                        </div> -->
                        <div class="item">
                            <div class="red-circle" />
                            <span>待处理</span>
                        </div>
                        <!-- <div class="item">
                            <div class="red-bg" />
                            <span>设备状况异常</span>
                        </div> -->
                        <div class="item-time">
                            <span>统计时间：{{ curTime }}</span>
                        </div>
                    </div>
                </div>

                <div v-if="fliterData.length>0" class="table">
                    <div class="column">
                        <div class="item">紫外灯/日期</div>
                        <div v-for="(item,index) in fliterData" :key="index" class="item" style="cursor:pointer" @click="goLookStatic(item)">
                            <span style="padding:0 6px">{{ item.deng_guan_hao_ }}/{{ item.zi_wai_deng_ming_ }}</span>
                        </div>
                    </div>
                    <div class="column">
                        <div v-for="(item,index) in formatData" :key="index" class="content-item">
                            <div class="item">{{ index+1 }}</div>
                            <div v-for="(i,ind) in item" :key="ind" class="item">
                                <el-tooltip v-show="i.count>0" class="item" effect="light" placement="top-start">
                                    <template slot="content">
                                        <div>
                                            <div v-for="(ii,indd) in i.data" :key="indd" class="detail">
                                                <el-divider />
                                                <div class="detail-item">
                                                    <div class="item" style="margin:2px 0">处理人：{{ switchIdToUserName(ii.qian_ming_)|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">岗位：{{ ii.gang_wei_|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">额定时长：{{ ii.e_ding_shi_chang_|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">已使用总时长：{{ ii.zsc2|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">当次使用时长：{{ ii.shi_yong_shi_chan|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">使用时间：{{ ii.sysj1|| '/' }}</div>
                                                    <div class="item" style="margin:2px 0">擦拭情况：{{ ii.wan_cheng_qing_ku|| '/' }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="green-circle" />
                                    <!-- <div v-else class="orange-circle" /> -->
                                </el-tooltip>
                                <div v-if=" i.count===0 && i.show" class="red-circle" />
                            </div>
                        </div>
                    </div>
                </div>
                <el-empty v-else description="暂无数据" />
            </div>
        </div>
    </el-dialog>
</template>

<script>
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
        const { userId, position, level, mainPosition } = this.$store.getters
        return {
            dialogParams: {},
            MaintenanceStaticVisible: false,
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now()
                }
            },
            curTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            deviceNo: '',
            deviceName: '',
            gangWei: '',
            monthList: monthList,
            month: monthValue,
            monthDays: monthDays,
            userId: userId,
            position: (mainPosition && mainPosition.id) || position,
            level: level.second || level.first,
            loading: false,
            title: '设备维护统计',
            toolbars: [
                { key: 'export', label: '导出', type: 'primary', hidden: true },
                { key: 'cancel', label: '退出', type: 'danger' }
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
            type: [],
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
            totalList: []
        }
    },
    computed: {
        fliterData () {
            const fliterData = this.dataList
            let result = []
            fliterData.forEach(item => {
                const { she_shi_id_, zi_wai_deng_ming_, deng_guan_hao_, bu_men_, gang_wei_ } = item
                const t = result.find(i => i.she_shi_id_ === she_shi_id_)
                if (t) {
                    t.children.push(item)
                } else {
                    result.push({
                        she_shi_id_: she_shi_id_ || '',
                        zi_wai_deng_ming_: zi_wai_deng_ming_ || '',
                        deng_guan_hao_: deng_guan_hao_ || '',
                        bu_men_: bu_men_ || '',
                        gang_wei_: gang_wei_ || '',
                        children: [item]
                    })
                }
            })
            // console.log('fliterData', result)
            this.totalList.forEach(item => {
                const { she_shi_id_, zi_wai_deng_ming_, deng_guan_hao_, bian_zhi_bu_men_, gang_wei_ } = item
                const t = result.find(i => i.she_shi_id_ === item.she_shi_id_)
                if (!t) {
                    result.push({
                        she_shi_id_: she_shi_id_ || '',
                        zi_wai_deng_ming_: zi_wai_deng_ming_ || '',
                        deng_guan_hao_: deng_guan_hao_ || '',
                        bu_men_: bian_zhi_bu_men_ || '',
                        gang_wei_: gang_wei_ || '',
                        children: []
                    })
                }
            })
            if (this.position) {
                result = result.filter(item => item.bu_men_ === this.position)
            }
            if (this.deviceNo) {
                result = result.filter(item => item.deng_guan_hao_.indexOf(this.deviceNo) > -1)
            }
            if (this.deviceName) {
                result = result.filter(item => item.zi_wai_deng_ming_.indexOf(this.deviceName) > -1)
            }
            if (this.gangWei) {
                result = result.filter(item => item.gang_wei_.indexOf(this.gangWei) > -1)
            }
            return result
        },
        formatData () {
            const answer = new Array(this.monthDays)
            for (let i = 0; i < this.monthDays; i++) {
                const arr = []
                const day = ('0' + (i + 1)).slice(-2)
                const fullDay = this.month + '-' + day
                // console.log(fullDay)
                this.fliterData.forEach(item => {
                    const obj = {
                        data: [],
                        count: 0,
                        show: true,
                        fullDay
                    }
                    const tempList = item.children.filter(k => k.ri_qi_.slice(0, 10) === fullDay)
                    obj.count = tempList.length
                    obj.data = tempList
                    if (new Date(fullDay).getTime() > new Date(this.curTime).getTime()) {
                        obj.show = false
                    }
                    arr.push(obj)
                })
                answer[i] = arr
            }
            // console.log('answer', answer)
            return answer
        }
    },
    async mounted () {
        this.init()
        // const sql = `select she_shi_id_, zi_wai_deng_ming_, deng_guan_hao_, bian_zhi_bu_men_, gang_wei_ from t_jykzwdxdjlbsc where di_dian_='${this.level}' and shi_fou_ting_yong='1'`
        const { variables: { data }} = await this.$common.request('query', {
            key: 'getZwdConfig',
            params: [this.level]
        })
        this.totalList = data
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
        // 查看设备统计
        goLookStatic (row) {
            // this.dialogParams = row
            // this.dialogParams.searchMonth = this.month
            // this.MaintenanceStaticVisible = true
        },
        // 人员id 转人员名称
        switchIdToUserName (id) {
            const { userList } = this.$store.getters
            const temp = userList.find(item => item.userId === id)
            return temp ? temp.userName : ''
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
            this.title = `紫外灯消毒月度统计`
            const y = +this.month.split('-')[0]
            const m = +this.month.split('-')[1]
            // const sql = `select a.id_, a.parent_id_, a.she_bei_hao_, a.ri_qi_, a.bu_men_, a.wan_cheng_qing_ku, a.pi_ci_, a.shi_yong_shi_chan, a.zong_shi_chang_ as zsc1, a.qian_ming_, a.fang_jian_di_zhi_, a.e_ding_shi_chang_, a.zi_wai_deng_id_, a.gang_wei_, a.pan_ding_ri_qi_ as pdrq1, b.zi_wai_deng_ming_, b.zong_shi_chang_ as zsc2, b.deng_guan_hao_, b.ri_chang_zhao_she, b.shang_ci_xiao_du_, b.she_shi_id_, b.fang_jian_, b.shi_fou_gen_huan_, b.shi_fou_ting_yong, b.pan_ding_ri_qi_ as pdrq2 FROM t_jykzwdxdjlbzb a LEFT JOIN t_jykzwdxdjlbsc b ON a.zi_wai_deng_id_ = b.id_ where b.di_dian_ = '${this.level}' and b.shi_fou_ting_yong = '1' and YEAR(a.ri_qi_) = ${y} and MONTH(a.ri_qi_) = ${m}`
            const { variables: { data }} = await this.$common.request('query', {
                key: 'getZwdDisinfectionRecord',
                params: [this.level, y, m]
            })
            // console.log('data', data)
            this.dataList = data
            // this.dataList.forEach(item => {
            //     if (!Object.hasOwn(item, 'wei_hu_lei_xing_') || !item.wei_hu_lei_xing_) {
            //         item.wei_hu_lei_xing_ = '按需保养'
            //     }
            // })
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
                color: red;
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
                .item-time{
                    margin-left: 40px;
                    width: 200px;
                }
                .item{
                    width: 100px;
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
                }
            }
            .search{
                display: flex;
                .item{
                    width: 300px;
                    display: flex;
                    align-items: center;
                    .label{
                        font-size: 12px;
                        width: 60px;
                    }
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
                        height: 46px;
                        line-height: 46px;
                        min-width: 100px;
                        border-bottom: 1px solid #333;
                        border-right: 1px solid #333;
                        border-left: 1px solid #333;
                        white-space: nowrap;
                    }
                    @media screen and (max-width: 1800px) {
                         >.item{
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                    @media screen and (max-width: 1550px) {
                         >.item{
                            height: 34px;
                            line-height: 34px;
                        }
                    }
                    >.item:nth-child(1){
                        font-weight: 600;
                        border-top: 1px solid #333;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                    }
                    >.item:not(:first-child) {
                        :hover{
                            color: #409EFF;
                        }
                    }
                    .content-item{
                        .unusual{
                            background-color: #F56C6C;
                            opacity: .7;
                        }
                        >.item{
                            position: relative;
                            height: 46px;
                            width: 46px;
                            text-align: center;
                            line-height: 46px;
                            border-bottom: 1px solid #333;
                            border-right: 1px solid #333;
                        }
                        @media screen and (max-width: 1800px) {
                            >.item{
                                height: 40px;
                                width: 40px;
                                line-height: 40px;

                            }
                        }
                        @media screen and (max-width: 1550px) {
                            >.item{
                                height: 34px;
                                width: 34px;
                                line-height: 34px;

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
