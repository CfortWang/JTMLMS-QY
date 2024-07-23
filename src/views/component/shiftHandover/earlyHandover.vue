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
            <span>{{ title }}</span>
            <div>
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </div>
        <div class="container">
            <div class="left" :style="{width:initWidth}">
                <el-form ref="form" inline :model="form" label-width="120px" :rules="rules">
                    <el-row>
                        <el-col>
                            <h3 class="title">交班内容</h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="夜班交接人：" prop="ye_ban_jiao_ban_r">
                                <ibps-user-selector
                                    v-model="form.ye_ban_jiao_ban_r"
                                    type="user"
                                    readonly-text="text"
                                    :disabled="readonly"
                                    :multiple="false"
                                    size="mini"
                                    style="width:200px"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="交班时间：" prop="jiao_ban_shi_jian">
                                <el-date-picker
                                    v-model="form.jiao_ban_shi_jian"
                                    type="date"
                                    placeholder="选择日期"
                                    :readonly="isEdit"
                                    value-format="yyyy-MM-dd"
                                    size="mini"
                                    class="item"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <h3 class="title">夜班标本处理情况</h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" style="display:flex;">
                            <el-form-item label="交班标本：" prop="jiao_ban_biao_ben">
                                <el-input
                                    v-model="form.jiao_ban_biao_ben"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                        <el-col :span="8" style="display:flex;">
                            <el-form-item label="未处理标本：" prop="wei_chu_li_biao_b">
                                <el-input
                                    v-model="form.wei_chu_li_biao_b"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                        <el-col :span="8" style="display:flex;">
                            <el-form-item label="未发报告：" prop="wei_fa_bao_gao_">
                                <el-input
                                    v-model="form.wei_fa_bao_gao_"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <h3 class="title">危急值报告</h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" style="display:flex;">
                            <el-form-item label="共：" prop="wei_ji_zhi_bao_ga">
                                <el-input
                                    v-model="form.wei_ji_zhi_bao_ga"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                        <el-col :span="8" style="display:flex;">
                            <el-form-item label="确认：" prop="bao_gao_que_ren_">
                                <el-input
                                    v-model="form.bao_gao_que_ren_"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="未确认科室：" prop="wei_que_ren_ke_sh">
                                <el-input v-model="form.wei_que_ren_ke_sh" size="mini" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" style="display:flex;">
                            <el-form-item label="末梢血采集数量：" prop="mo_shao_xie_cai_j">
                                <el-input
                                    v-model="form.mo_shao_xie_cai_j"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <h3 class="title">标本漏检漏发查询</h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="是否查漏：" prop="biao_ben_cha_lou_">
                                <el-radio v-model="form.biao_ben_cha_lou_" label="是" size="mini" :disabled="readonly">是</el-radio>
                                <el-radio v-model="form.biao_ben_cha_lou_" label="否" size="mini" :disabled="readonly">否</el-radio>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="是否有漏发漏检：">
                                <el-radio v-model="form.lou_fa_lou_jian_" label="无" size="mini">无</el-radio>
                                <el-radio v-model="form.lou_fa_lou_jian_" label="有" size="mini">有</el-radio>
                            </el-form-item>
                        </el-col> -->
                        <el-col v-if="form.biao_ben_cha_lou_==='是'" :span="8" style="display:flex;">
                            <el-form-item label="漏发漏检共：" prop="yi_lou_shu_liang_">
                                <el-input
                                    v-model="form.yi_lou_shu_liang_"
                                    size="mini"
                                    type="number"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    :readonly="readonly"
                                />
                            </el-form-item>
                            <span style="margin-top:8px">例</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <h3 class="title">夜班安全巡查有无特殊情况</h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="有无特殊情况：" prop="xun_cha_qing_kuan">
                                <el-radio v-model="form.xun_cha_qing_kuan" label="无" size="mini" :disabled="readonly">无</el-radio>
                                <el-radio v-model="form.xun_cha_qing_kuan" label="有" size="mini" :disabled="readonly">有</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="form.xun_cha_qing_kuan==='有'" :span="16">
                            <el-form-item label="情况描述：" prop="xun_cha_miao_shu_">
                                <el-input v-model="form.xun_cha_miao_shu_" size="mini" type="textarea" :rows="1" style="width:570px" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <h3 class="title">特殊结果或临床沟通</h3>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="临床科室：" prop="lin_chuang_ke_shi">
                                <el-input v-model="form.lin_chuang_ke_shi" size="mini" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="病例号：" prop="bing_li_hao_">
                                <el-input v-model="form.bing_li_hao_" size="mini" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="检验项目及结果：" prop="jian_ce_jie_guo_">
                                <el-input v-model="form.jian_ce_jie_guo_" size="mini" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="沟通内容及结果：" prop="gou_tong_jie_guo_">
                                <el-input v-model="form.gou_tong_jie_guo_" size="mini" type="textarea" :rows="1" style="width:112%" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="其他异常情况：" prop="qi_ta_qing_kuang_">
                                <el-input v-model="form.qi_ta_qing_kuang_" size="mini" type="textarea" :rows="1" style="width:1000px" placeholder="人员是否按时到岗、有无试剂短缺、LIS系统是否有问题、设备有无故障等" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-alert v-if="!isEdit" type="success" :closable="false" style="margin-top:10px">表单填写完成并保存后会开启早会签到</el-alert>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="早会内容：" prop="zao_hui_nei_rong_">
                                <el-input v-model="form.zao_hui_nei_rong_" size="mini" type="textarea" :rows="1" style="width:1000px" :readonly="readonly" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="isEdit">
                        <el-col :span="24">
                            <el-form-item label="手动签到：" prop="shou_dong_qian_da">
                                <ibps-user-selector
                                    v-model="form.shou_dong_qian_da"
                                    type="user"
                                    readonly-text="text"
                                    :disabled="readonly"
                                    :multiple="true"
                                    size="mini"
                                    style="width:1000px"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="isFinished">
                        <el-col :span="24">
                            <el-form-item label="实际签到人员：" prop="shi_ji_qian_dao_r">
                                <ibps-user-selector
                                    v-model="form.shi_ji_qian_dao_r"
                                    type="user"
                                    readonly-text="text"
                                    :disabled="true"
                                    :multiple="true"
                                    size="mini"
                                    style="width:1000px"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
        </div>
        <QrcodeedDialog v-if="QrcodeedDialogShow" :visible="true" :code-id="codeId" />
        <BarcodeDialog v-if="BarcodeDialogShow" :visible="true" :func="(value) => getBarcodeData(value, form.id_)" />
        <RegisterInfo
            v-if="RegisterInfoShow"
            :params="{addPeople:form.shou_dong_qian_da,tableName:'t_jykzjbdjb',
                      guan_lian_id_:form.id_}"
        />
        <!-- <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
        </div> -->

    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import ibpsUserSelector from '@/business/platform/org/selector'
import QrcodeedDialog from '@/views/component/qrcodeedDialog.vue' // 扫码
import BarcodeDialog from '@/views/component/trainingManage/barcodeDialog.vue' // 扫码枪签到组件
import RegisterInfo from '@/views/component/trainingManage/registerInfoDialog.vue' // 新版签到信息
export default {
    components: {
        ibpsUserSelector,
        QrcodeedDialog,
        BarcodeDialog,
        RegisterInfo
    },
    props: {
        params: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data () {
        const { userId, position, level } = this.$store.getters
        return {
            codeId: '', // 扫码签到
            RegisterInfoShow: false,
            QrcodeedDialogShow: false,
            BarcodeDialogShow: false,
            rules: {
                ye_ban_jiao_ban_r: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                jiao_ban_shi_jian: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                jiao_ban_biao_ben: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                wei_chu_li_biao_b: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                wei_fa_bao_gao_: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                wei_ji_zhi_bao_ga: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                bao_gao_que_ren_: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                wei_que_ren_ke_sh: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                mo_shao_xie_cai_j: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                biao_ben_cha_lou_: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ],
                xun_cha_qing_kuan: [
                    { required: true, trigger: 'blur', message: '请填写必填项' }
                ]
            },
            dialogVisible: true,
            isFirst: true,
            userId: userId,
            position: position,
            level: level.second || level.first,
            loading: false,
            title: '检验科早交班登记表',
            toolbars: [
                { key: 'save', label: '保存', hidden: () => { return this.isFinished } },
                { key: 'scanRegister', label: '二维码签到', hidden: () => { return !this.isEdit || this.isFinished } },
                { key: 'gunRegister', label: '扫码枪签到', hidden: () => { return !this.isEdit || this.isFinished } },
                { key: 'registerInfo', label: '签到信息', hidden: () => { return !this.isEdit } },
                { key: 'submit', label: '提交', icon: 'el-icon-finished', type: 'success', hidden: () => { return !this.isEdit || this.isFinished } },
                { key: 'cancel', label: '退出' }
            ],
            initWidth: '1280px',
            isEdit: false,
            isFinished: false,
            readonly: false,
            preParams: {},
            Ids: [],
            form: {
                ye_ban_jiao_ban_r: '',
                jiao_ban_shi_jian: '',
                jiao_ban_biao_ben: '',
                wei_chu_li_biao_b: '',
                wei_fa_bao_gao_: '',
                wei_ji_zhi_bao_ga: '',
                bao_gao_que_ren_: '',
                wei_que_ren_ke_sh: '',
                mo_shao_xie_cai_j: '',
                biao_ben_cha_lou_: '',
                // lou_fa_lou_jian_: '',
                yi_lou_shu_liang_: '',
                xun_cha_qing_kuan: '',
                xun_cha_miao_shu_: '',
                lin_chuang_ke_shi: '',
                bing_li_hao_: '',
                jian_ce_jie_guo_: '',
                gou_tong_jie_guo_: '',
                qi_ta_qing_kuang_: '',
                zao_hui_nei_rong_: '',
                shou_dong_qian_da: ''
            }
        }
    },
    watch: {
        'form.biao_ben_cha_lou_': {
            handler (val) {
                if (val === '否') {
                    this.form.yi_lou_shu_liang_ = ''
                }
            }
        },
        'form.xun_cha_qing_kuan': {
            handler (val) {
                if (val === '无') {
                    this.form.xun_cha_miao_shu_ = ''
                }
            }
        }

    },

    mounted () {
        this.init()
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog(true)
                    break
                case 'save':
                    this.goSave('close')
                    break
                case 'registerInfo':
                    this.goRegisterInfo()
                    break
                case 'gunRegister':
                    this.goGunRegister()
                    break
                case 'scanRegister':
                    this.goScanRegister()
                    break
                case 'submit':
                    this.goSubmit()
                    break
                default:
                    break
            }
        },
        goRegisterInfo () {
            if (this.RegisterInfoShow) {
                this.RegisterInfoShow = false
            }
            this.$nextTick(() => {
                this.RegisterInfoShow = true
            })
        },
        async goGunRegister () {
            try {
                await this.getIsFinish()
                if (this.BarcodeDialogShow) {
                    this.BarcodeDialogShow = false
                } else {
                    this.BarcodeDialogShow = true
                }
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        async goScanRegister () {
            try {
                await this.getIsFinish()
                if (this.QrcodeedDialogShow) {
                    this.QrcodeedDialogShow = false
                }
                const sql = "select * FROM t_qrcodeb WHERE guan_lian_id_ = '" + this.params.id_ + "'"
                this.$common.request('sql', sql).then(res => {
                    const cont = res.variables.data
                    if (cont.length === 0) {
                        const arr = []
                        arr.push({ 'label': '早会内容', 'value': this.form.zao_hui_nei_rong_, 'key': 'zaoHuiNeiRong' })
                        // 字段需要继续添加
                        const addParams = {
                            tableName: 't_qrcodeb',
                            paramWhere: [{
                                guan_lian_id_: this.params.id_,
                                biao_ming_: 't_jykzjbdjb',
                                zhuang_tai_: '生效',
                                xiang_xi_xin_xi_: JSON.stringify(arr)
                            }]
                        }
                        this.$common.request('add', addParams).then(res => {
                            const conts = res.variables.cont
                            this.codeId = conts[0].id_
                            this.QrcodeedDialogShow = true
                        })
                    } else {
                        this.codeId = cont[0].id_
                        this.QrcodeedDialogShow = true
                    }
                })
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        // 扫码枪签到返回的数据
        async getBarcodeData (value, variable) {
            if (!variable) {
                variable = this.form.id_
            }
            var jsonString = value
            var jsonObject = JSON.parse(jsonString)
            var idValue = jsonObject.id
            // 根据工号查人员姓名，查得到
            // 插入数据，签到成功   第一次插入，插入重复
            // 查不到，请扫描正确的二维码
            const sql = `select ID_ as ryid,NAME_ as name FROM ibps_party_employee WHERE ID_ = '${idValue}'`
            this.$common.request('sql', sql).then((response) => {
                const cont = response.variables.data
                console.log('cont.length', cont.length)
                if (!cont.length) {
                    this.$message.warning('当前二维码无效，请使用正确的二维码进行扫描!')
                } else {
                    const sql = `select  * FROM t_qdxxb WHERE  guan_lian_id_='${variable}' and ren_yuan_id_='${idValue}'`
                    this.$common.request('sql', sql).then(response => {
                        const { data = [] } = response.variables || {}
                        console.log('data', data.length)
                        if (data.length > 0) {
                            this.$message.warning('该人员已签到，请勿重复扫码!')
                        } else {
                            const names = cont[0].name
                            // 数据存在
                            // 插入数据，签到成功   第一次插入，插入重复
                            const addParams = {
                                tableName: 't_qdxxb',
                                paramWhere: [{
                                    guan_lian_id_: variable,
                                    ren_yuan_id_: cont[0].ryid,
                                    qian_dao_shi_jian: this.$common.getDateNow(19)
                                }]
                            }
                            this.$common.request('add', addParams).then(res => {
                                console.log('添加签到数据成功')
                                this.$message.success('亲爱的 [' + names + ']，签到成功！感谢您的参与，希望您今天充满活力，工作顺利，心情愉快！')
                            })
                        }
                    })
                }
            })
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
            // 新增的时候需要验证交班时间不早于当前
            if (flag) {
                // 获取今天零点的时间戳
                const today = new Date().setHours(0, 0, 0, 0)
                const selectedTime = new Date(this.form.jiao_ban_shi_jian).getTime()
                if (selectedTime < today) {
                    this.$message.warning('交班时间不能早于当前时间！')
                    return false
                }
            }
            if (this.form.biao_ben_cha_lou_ === '是' && !this.form.yi_lou_shu_liang_) {
                this.$message.warning('请填写漏发漏检数量！')
                return false
            }
            if (this.form.xun_cha_qing_kuan === '有' && !this.form.xun_cha_miao_shu_) {
                this.$message.warning('请填写情况描述！')
                return false
            }
            if (+this.form.bao_gao_que_ren_ > +this.form.wei_ji_zhi_bao_ga) {
                this.$message.warning('危急值报告确认数不能大于总数！')
                return false
            }
            return true
        },
        // 快照URL
        getReportParams (path, selection, data) {
            const { level } = this.$store.getters
            const str = `org_=${level.first}&second_=${level.second}&id_=`
            const arr = path.split('&')
            if (arr.length === 2) {
                const fieldArr = arr[1].split('=')
                return str + `${data[fieldArr[1]]}`
            } else {
            // 如果是没有传参，还是原报表路径
                return str + `${selection}`
            }
        },
        // 判断状态是否已结束
        async getIsFinish () {
            const sql = `select * from t_jykzjbdjb where id_='${this.form.id_}'`
            const { variables: { data }} = await this.$common.request('sql', sql)
            if (data[0].shi_fou_guo_shen_ === '已完成') {
                throw new Error('已完成，无法操作！')
            }
        },
        async goSubmit () {
            try {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.checkRequired()) return
                        this.$confirm('提交后数据不可更改，是否确认保存并提交?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                            // 提交自动保存
                            await this.goEdit()
                            // 1.确定最终签到人员
                            const sql3 = `select * from t_qdxxb where guan_lian_id_='${this.params.id_}'`
                            const { variables: { data: data3 }} = await this.$common.request('sql', sql3)
                            const peopleList = [...new Set(data3.map(item => item.ren_yuan_id_))]
                            let shi_ji_qian_dao_r = ''
                            if (peopleList.length > 0) shi_ji_qian_dao_r = peopleList.join(',')
                            // 2.生成快照
                            const formName = '人员/检验科早交班登记表.rpx'
                            const res = await this.$common.snapshoot({
                                url: this.$getReportFile(formName, this.getReportParams(formName, this.params.id_, {
                                    ...this.preParams,
                                    shi_ji_qian_dao_r,
                                    shi_fou_guo_shen_: '已完成'
                                })),
                                name: this.params.id_,
                                type: 'pdf'
                            })
                            console.log(res)
                            if (!res.data || !res.data.id) {
                                console.log('快照生成失败')
                            } else {
                                console.log('快照生成成功')
                            }
                            // 3.更新
                            const updateParamsRecord = {
                                tableName: 't_jykzjbdjb',
                                updList: [{
                                    where: {
                                        id_: this.form.id_
                                    },
                                    param: {
                                        shi_fou_guo_shen_: '已完成',
                                        shi_ji_qian_dao_r,
                                        kuai_zhao_: res.data.id
                                    }
                                }]
                            }
                            console.log(updateParamsRecord)
                            await this.$common.request('update', updateParamsRecord)
                            this.closeDialog(true)
                            this.$message.success('提交成功')
                        }).catch(() => {
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        async goAdd () {
            try {
                const addParamsRecord = {
                    tableName: 't_jykzjbdjb',
                    paramWhere: [{
                        ...this.form,
                        shi_fou_guo_shen_: '签到中'
                    }]
                }
                const { variables: { cont }} = await this.$common.request('add', addParamsRecord)
                if (cont.length) {
                    this.$message.success('添加成功')
                    this.closeDialog(true)
                }
            } catch (error) {
                console.log(error)
                this.$message.warning('添加失败')
            }
        },
        async goEdit (flag) {
            try {
                // 首先判断状态是否结束
                await this.getIsFinish()

                // 1.确定最终签到人员
                const sql3 = `select * from t_qdxxb where guan_lian_id_='${this.params.id_}'`
                const { variables: { data: data3 }} = await this.$common.request('sql', sql3)
                let tempPeople = []
                if (this.form.shou_dong_qian_da) {
                    tempPeople = this.form.shou_dong_qian_da.split(',')
                }
                if (data3.length > 0) {
                    for (let index = 0; index < data3.length; index++) {
                        const item = data3[index]
                        if (item.qian_dao_lei_xing === '手动') continue
                        tempPeople.push(item.ren_yuan_id_)
                    }
                }
                const peopleList = [...new Set(tempPeople)]
                let shi_ji_qian_dao_r = ''
                if (peopleList.length > 0) shi_ji_qian_dao_r = peopleList.join(',')
                console.log(shi_ji_qian_dao_r)
                // 2.更新主表展示内容
                const updateParamsRecord = {
                    tableName: 't_jykzjbdjb',
                    updList: [{
                        where: {
                            id_: this.form.id_
                        },
                        param: {
                            ...this.form,
                            shi_ji_qian_dao_r
                        }
                    }]
                }
                console.log(updateParamsRecord)
                await this.$common.request('update', updateParamsRecord)

                // 3.更新签到人员
                let curIds = []
                if (this.form.shou_dong_qian_da) {
                    curIds = this.form.shou_dong_qian_da.split(',')
                }
                console.log(this.Ids, curIds)
                // 计算需要增加的id
                const addedIds = curIds.filter(id => !this.Ids.includes(id))
                // 计算需要更新的id
                const updatedIds = curIds.filter(id => this.Ids.includes(id))
                // 计算需要删除的id
                const deletedIds = this.Ids.filter(id => !updatedIds.includes(id))
                console.log(addedIds, updatedIds, deletedIds)
                if (addedIds.length > 0) {
                    const params = {
                        tableName: 't_qdxxb',
                        paramWhere: addedIds.map(id => ({
                            guan_lian_id_: this.params.id_,
                            ren_yuan_id_: id,
                            qian_dao_shi_jian: this.$common.getDateNow(19),
                            qian_dao_lei_xing: '手动'
                        }))
                    }
                    await this.$common.request('add', params).then(res => {
                        console.log('签到数据增加成功')
                    })
                }
                if (deletedIds.length > 0) {
                    const sql = `select * from t_qdxxb where guan_lian_id_='${this.params.id_}' and qian_dao_lei_xing='手动' and ren_yuan_id_ in (${deletedIds.map(id => `'${id}'`).join(', ')})`
                    await this.$common.request('sql', sql).then(async res => {
                        const { data } = res.variables || []
                        if (data.length > 0) {
                            const params = {
                                tableName: 't_qdxxb',
                                paramWhere: {
                                    id_: data.map(item => item.id_).join(',')
                                }
                            }
                            await this.$common.request('delete', params).then(res => {
                                console.log('签到数据删除成功')
                            })
                        }
                    })
                }
                if (flag === 'close') {
                    this.closeDialog(true)
                    this.$message.success('修改成功')
                } else {
                    this.init()
                }
            } catch (error) {
                this.$message.warning(error.message)
                throw new Error(error.message)
            }
        },
        goSave (flag) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (!this.checkRequired(this.isEdit ? null : true)) return
                    if (this.isEdit) {
                        this.goEdit(flag)
                    } else {
                        this.goAdd()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 刷新
        async goRefresh () {
        },
        // 关闭当前窗口
        closeDialog (needRefresh) {
            this.dialogVisible = false
            if (needRefresh) {
                this.$emit('close')
            }
        },
        async init () {
            this.isEdit = !!(this.params && this.params.id_)
            if (this.isEdit) {
                if (this.params.shou_dong_qian_da) {
                    this.Ids = this.params.shou_dong_qian_da.split(',')
                } else {
                    this.Ids = []
                }
                this.preParams = JSON.parse(JSON.stringify(this.params))
                this.form = this.params
                this.isFinished = this.params && this.params.shi_fou_guo_shen_ === '已完成'
                this.readonly = this.isFinished
            } else {
                this.form.ye_ban_jiao_ban_r = this.userId
                this.form.jiao_ban_shi_jian = dayjs().format('YYYY-MM-DD')
                this.form.di_dian_ = this.level
                this.form.bian_zhi_bu_men_ = this.position
                this.form.bian_zhi_ren_ = this.userId
                this.form.bian_zhi_shi_jian = dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
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
        right:20px;
    }
}
.container {
        display: flex;
        width: 100%;
        justify-content: center;

        .left{
            height: calc(100vh - 70px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:20px 10px 0 10px;
            overflow-y: auto;
            .item{
                width: 100%;
            }
            .title{
                font-size: 16px;
                font-weight: bold;
                margin: 16px 0 6px 10px;
            }
        }
        .right{
            height: calc(100vh - 70px);
            flex: 1;
            padding:20px 10px 0 10px;
            .text{
                line-height: 1.5;
            }
            overflow-y: auto;
        }
    }
}
</style>
