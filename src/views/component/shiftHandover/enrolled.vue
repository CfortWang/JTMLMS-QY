<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="60%"
        class="dialog enrolled-dialog"
        top="6vh"
        @close="closeDialog"
        @open="getShiftHandoverData"
    >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm">
            <!-- 主表选择 -->
            <el-row :gutter="30">
                <el-col :span="8"> <el-form-item label="部门" prop="deng_ji_bu_men_">
                    <ibps-user-selector
                        v-model="ruleForm.deng_ji_bu_men_"
                        type="position"
                        readonly-text="text"
                        :disabled="!editPermissions"
                        :multiple="false"
                    />
                </el-form-item></el-col>
                <el-col :span="8">  <el-form-item label="岗位" prop="gang_wei_">
                    <!-- <el-input v-model="ruleForm.gang_wei_" type="text" :disabled="!editPermissions" /> -->
                    <el-select v-model="ruleForm.gang_wei_" placeholder="请选择" size="mini" style="width:100%" :disabled="!editPermissions">
                        <el-option
                            v-for="item in filterData"
                            :key="item.id_"
                            :label="item.wei_hu_gang_wei_"
                            :value="item.wei_hu_gang_wei_"
                        />
                    </el-select>
                </el-form-item>

                    <!-- <ibps-link-data
                        v-model="ruleForm.gang_wei_"
                        style="width:80%"
                        size="mini"
                        template-key="jcgwxz"
                        :multiple="false"
                        :temp-search="true"
                    /> -->
                </el-col>
                <el-col :span="8"> <el-form-item label="日期" prop="deng_ji_shi_jian_">
                    <el-date-picker v-model="ruleForm.deng_ji_shi_jian_" type="date" placeholder="选择日期" style="width: 100%;" :disabled="!editPermissions" />
                </el-form-item></el-col>
            </el-row>
            <el-form-item label=" 班次" prop="ban_ci_">
                <span v-if="editPermissions">早班</span>
                <span v-else>{{ parentData.zhuang_tai_ === '已早交班' ? '午班' : parentData.zhuang_tai_ === '已午交班' ? '晚班' : '' }}</span>
                <!-- <span v-else>{{ ruleForm.ban_ci_ }}</span> -->
            </el-form-item>
            <el-row :gutter="30">
                <el-col :span="8"><div class="grid-content bg-purple-dark">  <el-form-item label="交班标本(例)" prop="jiao_ban_biao_ben">
                    <el-input v-model.number="ruleForm.jiao_ban_biao_ben" style="width:100%" />
                </el-form-item></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-dark">  <el-form-item label="未处理标本(例)" prop="wei_chu_li_biao_b">
                    <el-input v-model.number="ruleForm.wei_chu_li_biao_b" style="width:100%" />
                </el-form-item></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-dark">  <el-form-item label="未发报告(例)" prop="wei_fa_bao_gao_">
                    <el-input v-model.number="ruleForm.wei_fa_bao_gao_" style="width:100%" />
                </el-form-item></div></el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="grid-content bg-purple-dark">
                        <el-form-item label="是否查漏" prop="shi_fou_cha_lou_" required>
                            <el-radio-group v-model="ruleForm.shi_fou_cha_lou_">
                                <el-radio label="是" />
                                <el-radio label="否" />
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col v-show="ruleForm.shi_fou_cha_lou_=='是'" :span="8"><div class="grid-content bg-purple-dark">
                    <el-form-item label="漏发漏检(例)" prop="lou_fa_lou_jian_">
                        <el-input v-model.number="ruleForm.lou_fa_lou_jian_" style="width:100%" />
                    </el-form-item>
                </div></el-col>
            </el-row>
            <el-form-item label="其他异常情况" prop="qi_ta_qing_kuang_">
                <el-input v-model="ruleForm.qi_ta_qing_kuang_" type="textarea" />
            </el-form-item>
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="grid-content bg-purple-dark">
                        <el-form-item label="接班人：" prop="jie_ban_ren_">
                            <ibps-user-selector
                                v-model="ruleForm.jie_ban_ren_"
                                type="user"
                                readonly-text="text"
                                :disabled="false"
                                :multiple="true"
                                :temp-search="true"
                                :filter="filter"
                                filterable
                            />
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-dark">
                        <el-form-item label="交班人：" prop="jiao_ban_ren_">
                            <!-- const roleList = ['xtgljs']
        const { isSuper, role, userId, userList = [] } = this.$store.getters || {}
        this.userId = userId
        this.userList = userList
        this.hasRole = isSuper || role.some(r => roleList.includes(r.alias)) -->

                            <ibps-user-selector
                                v-model="ruleForm.jiao_ban_ren_"
                                type="user"
                                readonly-text="text"
                                :disabled="!hasRole"
                                :multiple="false"
                                :filter="filter"
                                filterable
                            />
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <!-- <el-form-item class="footer-btn">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="dialogVisible=false">取消</el-button>
            </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="dialogVisible=false">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import log from '@/plugins/log'
import ibpsUserSelector from '@/business/platform/org/selector'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import getDate from '@/utils/common'
export default {
    components: {
        ibpsUserSelector,
        IbpsLinkData,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        parentData: {
            type: [Object, Array],
            default: () => {}
        }
    },
    data () {
        const { userId } = this.$store.getters
        return {
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
            userId: userId,
            editPermissions: false,
            isDisabled: false,
            title: '交接班',
            dialogVisible: this.visible,
            ruleForm: {
                deng_ji_bu_men_: '',
                gang_wei_: '',
                deng_ji_shi_jian_: this.dataShow(new Date()),
                shi_jian_: '',
                ban_ci_: '',
                jiao_ban_biao_ben: 0,
                wei_chu_li_biao_b: 0,
                wei_fa_bao_gao_: 0,
                shi_fou_cha_lou_: '是',
                lou_fa_lou_jian_: 0,
                qi_ta_qing_kuang_: '',
                jie_ban_ren_: '',
                jiao_ban_ren_: ''
            },
            rules: {
                ban_ci_: [{ required: false, message: this.$t('validate.required') }],
                deng_ji_bu_men_: [{ required: true, message: this.$t('validate.required') }],
                gang_wei_: [{ required: true, message: this.$t('validate.required') }],
                deng_ji_shi_jian_: [{ required: true, message: this.$t('validate.required') }],
                jiao_ban_biao_ben: [
                    { required: true, message: this.$t('validate.required') },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback()
                            } else if (Number.isInteger(value) && value >= 0) { callback() } else { callback(new Error(this.$t('请输入数字'))) }
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                wei_chu_li_biao_b: [
                    { required: true, message: this.$t('validate.required') },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback()
                            } else if (Number.isInteger(value) && value >= 0) { callback() } else { callback(new Error(this.$t('请输入数字'))) }
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                wei_fa_bao_gao_: [
                    { required: true, message: this.$t('validate.required') },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback()
                            } else if (Number.isInteger(value) && value >= 0) { callback() } else { callback(new Error(this.$t('请输入数字'))) }
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                shi_fou_cha_lou_: [
                    { required: true, message: this.$t('validate.required') }
                ],
                lou_fa_lou_jian_: [
                    { required: true, message: this.$t('validate.required') },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback()
                            } else if (Number.isInteger(value) && value >= 0) { callback() } else { callback(new Error(this.$t('请输入数字'))) }
                        },
                        trigger: ['change', 'blur']
                    }
                ],
                jie_ban_ren_: [
                    { required: true, message: this.$t('validate.required') }
                ],
                jiao_ban_ren_: [
                    { required: true, message: this.$t('validate.required') }
                ]
            },
            jianCeGangWeiList: [],
            filterData: [],
            masterReport: ['已早交班', '已午交班', '已晚交班', '已完成'],
            subReport: ['早班', '午班', '晚班']
        }
    },
    computed: {
        hasRole () {
            const roleList = ['xtgljs']
            const { isSuper, role } = this.$store.getters || {}
            return isSuper || role.some(r => roleList.includes(r.alias))
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            }
            // immediate: true
        },
        'ruleForm.deng_ji_bu_men_': {
            handler (val) {
                console.log(val)
                this.filterData = this.jianCeGangWeiList.filter(i => i.suo_shu_bu_men_ === val)
            },
            deep: true
        }
    },

    mounted () {
        this.loadSelectorData()
    },
    created () {
        if (this.parentData) {
            if (this.parentData.id_) {
                this.ruleForm.deng_ji_bu_men_ = this.parentData.deng_ji_bu_men_
                this.ruleForm.deng_ji_shi_jian_ = this.parentData.deng_ji_shi_jian_
                this.ruleForm.gang_wei_ = this.parentData.gang_wei_
                this.ruleForm.jiao_ban_ren_ = this.userId
                this.editPermissions = false
                // this.ruleForm.ban_ci_ = this.parentData.zhuang_tai_ === '已早交班' ? '早班' : this.parentData.zhuang_tai_ === '已午交班' ? '午班' : '晚班'
            } else {
                this.ruleForm.jiao_ban_ren_ = this.userId
                this.editPermissions = true
            }
        } else {
            this.ruleForm.jiao_ban_ren_ = this.userId
            this.editPermissions = true
        }
    },
    methods: {
        // 修改
        loadSelectorData () {
            console.log('部门', this.ruleForm.deng_ji_bu_men_)
            const pos = this.$store.getters.level.second ? this.$store.getters.level.second : this.$store.getters.level.first
            const sql = `select * from t_sbwhgwpzb where di_dian_='${pos}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                this.jianCeGangWeiList = data
            })
        },
        closeDialog () {
            this.$emit('close', false)
        },
        getShiftHandoverData () {
            this.submitForm()
        },
        dataShow (times) {
            const timeDate = new Date(times)
            const year = timeDate.getFullYear()
            const month = ('0' + (timeDate.getMonth() + 1)).slice(-2) // 月份从0开始，所以加1
            const day = ('0' + timeDate.getDate()).slice(-2)
            return `${year}-${month}-${day}`
        },
        addDatebase (dataBaseName, data) {
            const params = {
                tableName: dataBaseName,
                paramWhere: [data]
            }
            return this.$common.request('add', params).then(res => {
                return res
            }).catch(err => {
                console.log(err)
                throw err
            })
        },
        submitForm (formName) {
            const masterTableData = {
                deng_ji_bu_men_: this.ruleForm.deng_ji_bu_men_,
                gang_wei_: this.ruleForm.gang_wei_,
                deng_ji_shi_jian_: this.dataShow(this.ruleForm.deng_ji_shi_jian_),
                zhuang_tai_: this.masterReport[0],
                jie_ban_ren_: this.ruleForm.jie_ban_ren_
            }
            const subtablesData = {
                parent_id_: '',
                ban_ci_: this.ruleForm.ban_ci_,
                jiao_ban_biao_ben: this.ruleForm.jiao_ban_biao_ben,
                jie_ban_ren_: this.ruleForm.jie_ban_ren_,
                jiao_ban_ren_: this.ruleForm.jiao_ban_ren_,
                wei_chu_li_biao_b: this.ruleForm.wei_chu_li_biao_b,
                wei_fa_bao_gao_: this.ruleForm.wei_fa_bao_gao_,
                shi_fou_cha_lou_: this.ruleForm.shi_fou_cha_lou_,
                lou_fa_lou_jian_: this.ruleForm.lou_fa_lou_jian_,
                qi_ta_qing_kuang_: this.ruleForm.qi_ta_qing_kuang_
            }
            this.$refs[formName]?.validate((valid) => {
                if (valid) {
                    if (this.editPermissions) {
                        // 主表和子表一起添加一条数据
                        this.addDatebase('t_jjbdjb', masterTableData).then(() => {
                            const sql = 'select * from t_jjbdjb order by create_time_ desc limit 1'
                            subtablesData.parent_id_ = ''
                            this.$common.request('sql', sql).then(res => {
                                subtablesData.parent_id_ = res.variables.data[0].id_
                                subtablesData.ban_ci_ = this.subReport[0]
                                if (subtablesData.parent_id_) {
                                    this.addDatebase('t_jjbjlb', subtablesData).then(() => {
                                        this.dialogVisible = false
                                        this.remind(subtablesData.jie_ban_ren_.split(','))
                                    })
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        })
                    } else {
                        // 子表添加一条数据
                        const sql = 'select* from t_jjbjlb WHERE parent_id_=' + this.parentData.id_
                        this.$common.request('sql', sql).then(res => {
                            const count = res.variables.data.length
                            subtablesData.parent_id_ = this.parentData.id_
                            switch (count) {
                                case 1:
                                    subtablesData.ban_ci_ = this.subReport[count]
                                    console.log(this.subReport[count])
                                    this.addDatebase('t_jjbjlb', subtablesData).then(() => {
                                        const params = { zhuang_tai_: this.masterReport[count], jie_ban_ren_: subtablesData.jie_ban_ren_ }
                                        this.updataMaster('t_jjbdjb', this.parentData.id_, params)
                                        this.dialogVisible = false
                                        this.remind(subtablesData.jie_ban_ren_.split(','))
                                    }); break
                                case 2:
                                    subtablesData.ban_ci_ = this.subReport[count]
                                    this.addDatebase('t_jjbjlb', subtablesData).then(() => {
                                        this.createSnapshoot(this.parentData.id_).then(res => {
                                            const params = { zhuang_tai_: this.masterReport[count + 1], jie_ban_ren_: subtablesData.jie_ban_ren_, kuai_zhao_: res }
                                            this.updataMaster('t_jjbdjb', this.parentData.id_, params)
                                            this.dialogVisible = false
                                        })
                                    }); break
                                default:
                            }
                        })
                    }
                } else {
                    return false
                }
            })
        },
        updataMaster (masterName, id_, params) {
            return new Promise((resolve, reject) => {
                const updateParamsRecord = {
                    tableName: masterName,
                    updList: [{
                        where: {
                            id_: id_
                        },
                        param: params
                    }]
                }
                this.$common.request('update', updateParamsRecord).then((res) => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    resolve()
                }).catch(err => {
                    console.log(err)
                })
            })
        },
        createSnapshoot (id) {
            const { first = '' } = this.$store.getters.level
            const url = this.$getReportFile('/人员/检验科交接班登记表.rpx', `id_=${id}&org_=${first}`)
            return new Promise((resolve, reject) => {
                this.$common.snapshoot({
                    'url': url,
                    'name': '交接班登记表' + this.dataShow(new Date()),
                    'type': 'pdf'
                }).then(res => {
                    resolve(res.data.id)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        remind (list) {
            list.forEach(item => {
                console.log(item)
                const msg = {
                    subject: '事务催办提醒',
                    content: `您的交接班还未完成，请尽快处理！`,
                    receiverId: item,
                    canreplay: '0'
                }
                this.$common.sendMsg(msg)
            })
            this.$message.success('催办成功！')
        }
    }
}
</script>
<style scoped lang="less">
.demo-ruleForm{
   padding: 1% 5% 1% 5%;
   .el-form-item {
    padding: 1% 0;
   }
   .footer-btn{
    text-align: center;
   }
}
/* 使标签文本左对齐 */
/deep/ .el-form-item__label {
  text-align: left;
  position: relative; /* 使星号能够相对于标签定位 */
  padding-left: 1em; /* 为星号预留一些空间 */
}

/* 使用绝对定位让星号不占据空间，并且显示在标签的右侧 */
/deep/ .el-form-item__label::before {
  content: '*';
  color: #f56c6c; /* 星号颜色 */
  position: absolute;
  left: 0; /* 星号靠右 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中修正 */
  margin: 0;
}

/* 只有当标签是必填项时才显示星号 */
/deep/ .el-form-item__label:not(.is-required)::before {
  content: '';
}
/deep/ .el-form-item__content{
    margin: 0;
}
/deep/ .el-dialog__footer{
 display: flex;
    justify-content: center;
}

</style>
