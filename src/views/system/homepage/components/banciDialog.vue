<template>
    <div>
        <el-dialog
            title="班次详情"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="true"
            @close="closeDialog"
        >
            <div class="containerDiv">
                <div>
                    <strong class="label">所属排班：</strong>{{ banci.scheduleName }}
                </div>
                <div>
                    <strong class="label">排班类型：</strong>{{ banci.scheduleTypeLabel }}
                </div>
                <div>
                    <strong class="label">排班创建人：</strong>{{ banci.scheduleCreateBy }}
                </div>
                <div>
                    <strong class="label">班次名称：</strong>{{ banci.name }}
                </div>
                <div>
                    <strong class="label">班次别名：</strong>{{ banci.alias }}
                </div>
                <div>
                    <strong class="label">是否可用：</strong>{{ banci.isEnabled === 'Y'? '是' : '否' }}
                </div>
                <div>
                    <strong class="label">对应颜色：</strong>
                    <div :style="{ background: banci.bcolor, height: '20px', width: '50px', display: 'inline-block' }" />
                </div>
                <div>
                    <strong class="label">时间段：</strong>
                    {{ (banci.dateRange && banci.dateRange.length > 0)?
                        ('当天'+ banci.dateRange[0].startTime+ '至' + (banci.dateRange[0].isSecondDay === 'Y'? '第二天' : '当天') + banci.dateRange[0].endTime )
                        : ''
                    }}
                </div>
                <div class="position-row">
                    <strong class="label">岗位：</strong>
                    <ul class="position-list">
                        <li v-for="(position, index) in banci.positions" :key="index" class="el-tag el-tag--primary el-tag--small el-tag--light positionItem">{{ position }}</li>
                    </ul>
                </div>
                <div>
                    <strong class="label">说明：</strong>{{ banci.desc }}
                </div>
                <div>
                    <strong class="label">出勤情况：</strong>
                    <div class="dakaBox">
                        <div>
                            <span>上班:</span> <span v-html="getAttendanceInfo(banci.attendance, 1)" />
                            <button v-if="banci && banci.attendance && banci.attendance.zhuang_tai_1_!= '正常' && compareTime() && validExist(banci.attendance,'in') " class="clock-btn" @click="bukaFun('in')"> 补卡 </button>
                        </div>
                        <div><span>下班:</span> <span v-html="getAttendanceInfo(banci.attendance, 2)" />
                            <button v-if="banci && banci.attendance && banci.attendance.zhuang_tai_2_!= '正常' && compareTime() && validExist(banci.attendance,'out') " class="clock-btn" @click="bukaFun('out')"> 补卡 </button>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        // 接收外部传入的班次对象，方便复用组件展示不同班次对象
        banciInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            dialogVisible: this.visible,
            banci: this.banciInfo
        }
    },
    watch: {
        banciInfo (newVal) {
            // 当外部传入的班次对象变化时，更新内部展示的数据
            this.banci = newVal
        },
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = val
            },
            immediate: true
        }
    },
    methods: {
        openDialog () {
            this.dialogVisible = true
        },
        getAttendanceInfo (data = {}, type = 1) {
            const time = ['', 'da_ka_shi_jian_1_', 'da_ka_shi_jian_2_']
            const status = ['', 'zhuang_tai_1_', 'zhuang_tai_2_']
            const duration = ['', 'chi_dao_shi_chang', 0]

            if (!data?.[time[type]]) {
                return '未打卡'
            }

            return data[status[type]] === '正常' ? `${data[time[type]]} 正常` : `${data[time[type]]} <span style="color: red;">${data[status[type]] === '异常' ? '迟到' : data[status[type]]}${data[duration[type]]}分钟</span>`
        },
        compareTime () { // 比较班次时间和当前时间，过去日期的才显示，返回true。
            const today = this.$common.getDateNow()
            if (this.banciInfo.jieShuShiJian < today) {
                return true
            } else {
                return false
            }
        },
        validExist (attendance, type) { // 判断该班次是否已申请，已申请则不展示，返回false
            const str = (type === 'in' ? '上班' : '下班')
            const banci = attendance.ban_ci_bie_ming_ + '-' + str
            const riqi = attendance.ri_qi_
            const userId = this.$store.getters.userId
            const { first, second } = this.$store.getters.level || {}
            const sql = `select id_ from t_attendance_reissue where bu_ka_ban_ci_ = '${banci}' and bu_ka_ri_qi_ = '${riqi}' and bian_zhi_ren_ = '${userId}' and di_dian_ = '${second || first}'`
            this.$common.request('sql', sql).then((res) => {
                if (res.variables.data.length === 0) {
                    return true
                } else {
                    return false
                }
            })
        },
        closeDialog () {
            this.$emit('closeBanciDialog', 'banci')
        },
        bukaFun (type) {
            const attendanceInfo = this.banciInfo?.attendance || {}
            let params = {}
            if (attendanceInfo) {
                const str = type === 'in' ? '上班' : '下班'
                const buKaShiJian = type === 'in' ? attendanceInfo.ban_ci_kai_shi_.split(' ')[1] + ':00' : attendanceInfo.ban_ci_jie_shu_.split(' ')[1] + ':00'
                params = {
                    'bu_ka_ri_qi_': attendanceInfo.ri_qi_,
                    'bu_ka_ban_ci_': attendanceInfo.ban_ci_bie_ming_ + '-' + str,
                    'bu_ka_shi_jian_': buKaShiJian,
                    'pai_ban_id_': attendanceInfo.pai_ban_id_,
                    'pai_ban_ji_lu_id_': attendanceInfo.pai_ban_ji_lu_id_
                }
            }
            this.$emit('open', 'buka', params)
        }
    }
}
</script>
<style lang="scss" scoped>
.containerDiv {
    padding: 20px;
    div {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        min-height: 30px;
    }
    .dakaBox{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        .clock-btn {
            border: none;
            color: white;
            background-color: #409EFF;
            border-radius: 4px;
            padding: 2px 8px;
            cursor: pointer;
            transition: opacity 0.3s;
            margin-left: 10px;
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .label {
        min-width: 80px;
        margin-right: 10px;
    }
    .position-row {
        display: flex;
        align-items: center;
        .position-list {
            display: flex;
            flex-wrap: wrap;
            list-style: none;
            padding-left: 0;
            li {
                margin-right: 10px;
                margin-top: 10px;
            }
        }
    }
}

</style>
