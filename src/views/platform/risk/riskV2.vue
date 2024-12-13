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
                <el-descriptions title="" direction="vertical" :column="5" border size="mini">
                    <el-descriptions-item label="年度" class="aaaa">
                        <span class="required-star">*</span>
                        <el-date-picker
                            v-model="infoFxssbData.nian_du_"
                            type="year"
                            placeholder="选择年"
                            :disabled="readonly"
                            value-format="yyyy"
                            size="mini"
                        />
                    </el-descriptions-item>

                    <el-descriptions-item label="编制部门">
                        <div style="display:flex">
                            <span class="required-star">*</span>
                            <ibps-user-selector
                                type="position"
                                :value="infoFxssbData.bian_zhi_bu_men_"
                                readonly-text="text"
                                :disabled="readonly"
                                :multiple="false"
                                size="mini"
                                style="width:100%"
                                :filter="filter"
                                filtrate
                            />
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="编制人">
                        <ibps-user-selector
                            type="user"
                            :value="infoFxssbData.bian_zhi_ren_"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="true"
                            size="mini"
                        />
                    </el-descriptions-item>
                    <el-descriptions-item label="编制时间">
                        <span class="required-star">*</span>
                        <el-date-picker
                            v-model="infoFxssbData.bian_zhi_shi_jian"
                            type="datetime"
                            placeholder="选择日期时间"
                            :disabled="readonly"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"
                        />
                    </el-descriptions-item>
                    <el-descriptions-item label="评估编号">
                        {{ infoFxssbData.ji_hua_bian_hao_ }}
                    </el-descriptions-item>
                    <el-descriptions-item label="组长">
                        <ibps-user-selector
                            type="user"
                            :value="infoFxssbData.zu_chang_id_"
                            readonly-text="text"
                            :disabled="true"
                            :multiple="true"
                            size="mini"
                            :filter="filter"
                            filtrate
                        />
                    </el-descriptions-item>
                    <el-descriptions-item label="评估开始时间">
                        <span class="required-star">*</span>
                        <el-date-picker
                            v-model="infoFxssbData.kai_shi_ri_qi_"
                            type="date"
                            placeholder="选择日期"
                            :disabled="readonly"
                            value-format="yyyy-MM-dd"
                            size="mini"
                        />
                    </el-descriptions-item>
                    <el-descriptions-item label="评估结束时间">
                        <span class="required-star">*</span>
                        <el-date-picker
                            v-model="infoFxssbData.jie_shu_ri_qi_"
                            type="date"
                            placeholder="选择日期"
                            :disabled="readonly"
                            value-format="yyyy-MM-dd"
                            size="mini"
                        />
                    </el-descriptions-item>

                    <el-descriptions-item label="报告完成时间">
                        <span class="required-star">*</span>
                        <el-date-picker
                            v-model="infoFxssbData.bao_gao_shi_jian_"
                            type="date"
                            placeholder="选择日期"
                            :disabled="readonly"
                            value-format="yyyy-MM-dd"
                            size="mini"
                        />
                    </el-descriptions-item>
                    <el-descriptions-item label="风险类型">
                        <div>
                            <el-radio v-model="infoFxssbData.feng_xian_lei_xin" label="质量" size="mini" :disabled="readonly">质量</el-radio>
                            <el-radio v-model="infoFxssbData.feng_xian_lei_xin" label="安全" size="mini" :disabled="readonly">安全</el-radio>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="时机" :span="1">
                        <el-select v-model="infoFxssbData.shi_ji_" :disabled="readonly" placeholder="请选择" size="mini">
                            <el-option
                                v-for="item in ['定期评估','新增活动','不良事件','程序变化','业务变化']"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>

                    </el-descriptions-item>

                    <el-descriptions-item label="范围" :span="1">
                        <el-input v-model="infoFxssbData.fan_wei_" :disabled="readonly" size="mini" />
                    </el-descriptions-item>
                    <el-descriptions-item label="方法" :span="1">
                        <el-input v-model="infoFxssbData.fang_fa_" :disabled="readonly" size="mini" />
                    </el-descriptions-item>
                    <el-descriptions-item label="风险系数计算方式" :span="2">
                        <span class="required-star">*</span>
                        <el-radio v-model="infoFxssbData.ji_suan_fang_shi_" label="1" size="mini" :disabled="isEdit">S * O（严重度*发生率）</el-radio>
                        <el-radio v-model="infoFxssbData.ji_suan_fang_shi_" label="2" size="mini" :disabled="isEdit">S * O * D（严重度*发生率*可检测度）</el-radio>
                    </el-descriptions-item>

                    <el-descriptions-item label="目的" :span="5">
                        <el-input v-model="infoFxssbData.mu_di_" :disabled="readonly" size="mini" />
                    </el-descriptions-item>
                    <el-descriptions-item label="依据文件" :span="5">
                        <!-- 模版弹窗 -->
                        <ibps-custom-dialog
                            v-if="!readonly"
                            v-model="infoFxssbData.yi_ju_wen_jian_id"
                            template-key="nsyjwjxz"
                            multiple
                            type="dialog"
                            class="custom-dialog"
                            placeholder="请选择依据文件"
                            size="mini"
                            icon="el-icon-search"
                        />
                        <pre style="margin:0">{{ infoFxssbData.yi_ju_wen_jian_ }}</pre>
                    </el-descriptions-item>

                    <el-descriptions-item label="首次会议时间" :span="1">
                        <el-date-picker
                            v-model="infoFxssbData.hui_yi_shi_jian_"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00"
                            :disabled="readonly"
                            value-format="yyyy-MM-dd HH:mm"
                            size="mini"
                        />

                    </el-descriptions-item>
                    <el-descriptions-item label="参会人员" :span="4">
                        <div style="display:flex">
                            <ibps-user-selector
                                v-model="infoFxssbData.can_hui_ren_yuan_"
                                style="width:100%"
                                type="user"
                                readonly-text="text"
                                :disabled="readonly"
                                :multiple="true"
                                size="mini"
                                :filter="filter"
                                filtrate
                            />
                        </div>

                    </el-descriptions-item>
                    <el-descriptions-item label="会议附件" :span="5">
                        <ibps-attachment
                            v-model="infoFxssbData.hui_yi_fu_jian_"
                            :download="true"
                            multiple
                            accept="*"
                            :readonly="readonly"
                            size="mini"
                        />
                    </el-descriptions-item>

                    <el-descriptions-item label="事务说明 " :span="5">
                        <el-input v-model="infoFxssbData.shi_wu_shuo_ming_" :disabled="readonly" size="mini" /></el-descriptions-item>
                    <el-descriptions-item label="评估人员 " :span="5">
                        <div style="display:flex">
                            <span class="required-star">*</span>
                            <ibps-user-selector
                                v-model="infoFxssbData.ping_gu_ren_yuan_"
                                type="user"
                                style="width:100%"
                                readonly-text="text"
                                :disabled="readonly"
                                :multiple="true"
                                size="mini"
                                :filter="filter"
                                filtrate
                            />
                        </div>

                    </el-descriptions-item>
                </el-descriptions>

                <div v-if="isEdit" style="margin-top:20px">
                    <el-alert
                        title="根据评估人员选定的风险识别项给每个措施制定人推送风险改进流程"
                        type="success"
                        :closable="false"
                    />
                    <RiskPeopleTable ref="RiskPeopleTableRef" :params="params" :people-ids="infoFxssbData.ping_gu_ren_yuan_" @goBack="goRefresh" />
                </div>

            </div>
        </div>

        <!-- <data-template-formrender-dialog
            :visible="DialogVisible"
            form-key="fxbg"
            :pk-value="pkValue"
            :readonly="readonly"
            @close="visible => DialogVisible = visible"
        /> -->
        <RiskDetail ref="RiskDetailRef" @close="goRefresh" />
        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[FlowPic]" />

    </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import RiskPeopleTable from './riskPeopleTable.vue'
import ibpsUserSelector from '@/business/platform/org/selector'
import RiskDetail from './riskDetail.vue'

import IbpsAttachment from '@/business/platform/file/attachment/selector'
import DataFormrender from '@/business/platform/data/templaterender/form'
import DataTemplateFormrenderDialog from '@/business/platform/data/templaterender/form/dialog.vue'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import FlowPic from '@/assets/images/risk/file-read-18951.png'

export default {
    components: {
        ElImageViewer,
        RiskDetail,
        RiskPeopleTable,
        ibpsUserSelector,
        IbpsAttachment,
        DataFormrender,
        DataTemplateFormrenderDialog,
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
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
            FlowPic: FlowPic,
            showViewer: false,
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
            isFirst: true,
            userId: userId,
            position: position,
            level: level.second || level.first,
            pkValue: '',
            readonly: true,
            DialogVisible: false,
            loading: false,
            dialogVisible: true,
            title: '风险评估与措施',
            toolbars: [
                { key: 'openFlowPic', label: '流程图', icon: 'ibps-icon-image' },
                { key: 'refresh', label: '刷新', hidden: () => { return !this.isZuZhang || !this.isEdit || this.isFinished } },
                { key: 'save', label: '保存', hidden: () => { return !this.isZuZhang || this.isFinished } },
                // { key: 'sendMsg', label: '提醒评估人', icon: 'el-icon-bell', hidden: () => { return !this.isZuZhang || !this.isEdit || this.isFinished } },
                // { key: 'peizhifengxian', label: '更新风险库', type: 'info', icon: 'el-icon-setting', hidden: () => { return !this.isZuZhang || !this.isEdit } },
                { key: 'submit', label: '提交', icon: 'el-icon-finished', hidden: () => { return !this.isZuZhang || !this.isEdit || this.isFinished } },
                { key: 'cancel', label: '退出', type: 'danger', icon: 'ibps-icon-close' }
            ],
            infoFxssbData: {
                nian_du_: '',
                bian_zhi_bu_men_: '',
                bian_zhi_ren_: '',
                bian_zhi_shi_jian: '',
                zu_chang_: '',
                zu_chang_id_: '',
                kai_shi_ri_qi_: '',
                jie_shu_ri_qi_: '',
                bao_gao_shi_jian_: '',
                feng_xian_lei_xin: '',
                shi_ji_: '',
                fan_wei_: '',
                fang_fa_: '',
                mu_di_: '',
                yi_ju_wen_jian_id: '',
                yi_ju_wen_jian_: '',
                hui_yi_shi_jian_: '',
                can_hui_ren_yuan_: '',
                hui_yi_fu_jian_: '',
                shi_wu_shuo_ming_: '',
                ping_gu_ren_yuan_: '',
                ji_hua_bian_hao_: '',
                ji_suan_fang_shi_: ''
            },
            initWidth: '1280px',
            isEdit: false,
            isPingGuRen: false,
            isZuZhang: true,
            isFinished: false,
            preParams: {},
            Ids: []
        }
    },
    watch: {
        'infoFxssbData.yi_ju_wen_jian_id': {
            handler (val) {
                const sql = `select * from yijuwenjianxuanze where id_ in ('${val.replace(/,/g, "','")}') order by id_`
                this.$common.request('sql', sql).then(response => {
                    const conts = response.variables.data
                    let fileName = ''
                    let num = 1
                    conts.forEach((item, index) => {
                        fileName += `${num}、${item.name_}\n`
                        num = num + 1
                    })
                    this.infoFxssbData.yi_ju_wen_jian_ = fileName
                })
            },
            immediate: true

        },
        'infoFxssbData.zu_chang_id_': {
            handler (val) {
                if (val) {
                    const userList = this.$store.getters.userList
                    const bianzhiUserid = userList.find(i => i.userId === val)
                    if (bianzhiUserid) {
                        this.infoFxssbData.zu_chang_ = bianzhiUserid.userName
                    }
                }
            }
        },
        'infoFxssbData.feng_xian_lei_xin': {
            handler (val) {
                if (val) {
                    if (this.isFirst) {
                        this.isFirst = false
                    } else {
                        this.infoFxssbData.fan_wei_ = `本实验室与${val}相关所有活动`
                        this.infoFxssbData.mu_di_ = `通过对实验室（${val}活动）进行风险评估，识别实验室在（${val}活动）方面存在的潜在风险，评估风险影响程度，制定风险管理策略，减少不利后果发生的概率和影响程度。`
                        this.infoFxssbData.shi_wu_shuo_ming_ = `年度：${this.infoFxssbData.nian_du_}；组长：${this.infoFxssbData.zu_chang_}；评估开始日期：${this.infoFxssbData.kai_shi_ri_qi_}；风险类型：${val}`
                    }
                }
            }
        }
    },

    mounted () {
        this.init()
    },
    beforeDestroy () {
        if (this.msg) {
            this.msg.close()
        }
    },
    methods: {
        // 获取最新数据
        async getNewData () {
            const sql = `select * from t_fxpgjlb2 where id_='${this.params.id_}'`
            const { variables: { data }} = await this.$common.request('sql', sql)
            return data
        },
        // 判断是否已完成
        async getIsFinish () {
            const data = await this.getNewData()
            if (data.length > 0 && data[0].shi_fou_guo_shen_ === '已完成') {
                throw new Error('已结束，不可操作！')
            }
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
        // 提交
        async goSubmit () {
            try {
                this.$confirm('提交后不可修改，是否确认保存并提交?', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // 提交前自动保存
                    await this.goSave()
                    // 判断每个评估人是否已完成识别项
                    const pinGuRenNum = this.Ids.length
                    const sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}'`
                    const { variables: { data }} = await this.$common.request('sql', sql)
                    const submitNum = new Set(data.map(item => item.bian_zhi_ren_)).size
                    if (submitNum === pinGuRenNum && data.every(item => item.shi_fou_guo_shen_ === '已完成')) {
                        // 0.生成快照
                        const formName = '风险管理/风险识别评估表V2.rpx'
                        const res = await this.$common.snapshoot({
                            url: this.$getReportFile(formName, this.getReportParams(formName, this.params.id_, {
                                ...this.preParams,
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
                        // 1.修改状态为已完成 并保存快照
                        const updateParamsRecord = {
                            tableName: 't_fxpgjlb2',
                            updList: [{
                                where: {
                                    id_: this.params.id_
                                },
                                param: {
                                    shi_fou_guo_shen_: '已完成',
                                    kuai_zhao_: res.data.id
                                }
                            }]
                        }
                        await this.$common.request('update', updateParamsRecord)
                        // console.log(data)
                        // 2.推送给措施制定人下一个流程
                        const addParams = {
                            tableName: 't_fxkzcsb2',
                            paramWhere: data.map(item => {
                                if (item.feng_xian_ying_du !== '风险接受' && item.zhi_ding_ren_) {
                                    return {
                                        di_dian_: this.level,
                                        shi_fou_guo_shen_: '已编制',
                                        bian_zhi_ren_: item.zhi_ding_ren_,
                                        bian_zhi_bu_men_: this.getPersonPosition(item.zhi_ding_ren_.split(',')[0]),
                                        bian_zhi_shi_jian: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                        gai_jin_bian_hao_: '',
                                        yao_su_tiao_kuan_: item.yao_su_tiao_kuan_,
                                        gong_zuo_huan_jie: item.gong_zuo_huan_jie,
                                        // gong_zuo_miao_shu: item.gong_zuo_miao_shu,
                                        feng_xian_miao_sh: item.feng_xian_miao_sh,
                                        zu_chang_: this.infoFxssbData.zu_chang_,
                                        zu_chang_id_: this.infoFxssbData.zu_chang_id_,
                                        shi_wu_shuo_ming_: this.infoFxssbData.shi_wu_shuo_ming_,
                                        yuan_zhi_shu_: item.feng_xian_zhi_shu,
                                        kong_zhi_fang_fa_: item.xian_xing_kong_zh,
                                        feng_xian_lei_xin: this.infoFxssbData.feng_xian_lei_xin,
                                        qian_fu_jian_: this.infoFxssbData.yi_ju_wen_jian_id,
                                        ji_hua_bian_hao_: this.infoFxssbData.ji_hua_bian_hao_,
                                        ni_cai_qu_kong_zh: item.ni_cai_qu_cuo_shi,
                                        qian_zai_yuan_yin: item.qian_zai_yuan_yin,
                                        ji_suan_fang_shi_: this.infoFxssbData.ji_suan_fang_shi_
                                    }
                                }
                            }).filter(i => i !== undefined),
                            formKey: 'fxcscsbV2',
                            defKey: 'Process_1li9h0n'
                        }
                        for (let i = 0; i < addParams.paramWhere.length; i++) {
                            const item = addParams.paramWhere[i]
                            item.gai_jin_bian_hao_ = await this.getNextAlias('gjjllsh')
                        }
                        console.log(addParams)
                        if (addParams.paramWhere.length) {
                            await this.$common.request('add', addParams)
                            // 3.推送给组长 评估报告流程
                            const addParams2 = {
                                tableName: 't_fxkzbg',
                                paramWhere: [{
                                    di_dian_: this.level,
                                    shi_fou_guo_shen_: '已编制',
                                    bian_zhi_ren_: this.infoFxssbData.zu_chang_id_,
                                    bian_zhi_bu_men_: this.getPersonPosition(this.infoFxssbData.zu_chang_id_),
                                    bian_zhi_shi_jian: dayjs().format('YYYY-MM-DD HH:mm'),
                                    zu_chang_: this.infoFxssbData.zu_chang_,
                                    zu_chang_id_: this.infoFxssbData.zu_chang_id_,
                                    feng_xian_lei_xin: this.infoFxssbData.feng_xian_lei_xin,
                                    kai_shi_ri_qi_: this.infoFxssbData.kai_shi_ri_qi_,
                                    jie_shu_ri_qi_: this.infoFxssbData.jie_shu_ri_qi_,
                                    wan_cheng_ri_qi_: this.infoFxssbData.bao_gao_shi_jian_,
                                    shi_wu_shuo_ming_: this.infoFxssbData.shi_wu_shuo_ming_,
                                    ji_hua_bian_hao_: this.infoFxssbData.ji_hua_bian_hao_,
                                    hui_yi_wen_jian_: this.infoFxssbData.hui_yi_fu_jian_
                                }],
                                formKey: 'fxbg',
                                defKey: 'Process_0mrlsj7'
                            }
                            console.log(addParams2)
                            await this.$common.request('add', addParams2)
                            console.log('流程推送成功')
                        } else {
                            console.log('无需推送')
                        }

                        this.$message.success('提交成功')
                        // 提醒用户推送信息
                        if (addParams.paramWhere.length) {
                            this.$alert(`需要改进项${addParams.paramWhere.length}条，已向其中的每位措施制定人推送风险改进流程，同时向组长 ${this.infoFxssbData.zu_chang_} 推送风险报告流程！`, '提交成功', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.closeDialog(true)
                                }
                            })
                        } else {
                            this.closeDialog(true)
                        }
                    } else {
                        this.$message.warning('存在未完成风险识别项的评估人员，无法提交！')
                        return
                    }
                })
                    .catch(() => {

                    })
            } catch (error) {
                this.$message.warning(error.message)
            }
        },
        // id 转 姓名
        switchIdtoUserName (id) {
            const { userList } = this.$store.getters
            const user = userList.find(item => item.userId === id)
            return user ? user.userName : ''
        },
        goPeizhifengxian () {
            const buttons = document.querySelector('button[name="peizhifengxian"]')
            if (buttons) {
                buttons.click()
            }
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'cancel':
                    this.closeDialog(true)
                    break
                case 'record':
                    this.goRecord()
                    break
                case 'save':
                    this.goSave('close')
                    break
                case 'submit':
                    this.goSubmit()
                    break
                case 'refresh':
                    this.goRefresh()
                    break
                case 'sendMsg':
                    this.goSendMsg()
                    break
                case 'peizhifengxian':
                    this.goPeizhifengxian()
                    break
                case 'openFlowPic':
                    this.showViewer = true
                    break
                default:
                    break
            }
        },
        // 关闭大图预览
        closeViewer () {
            this.showViewer = false
        },
        // 推送消息给评估人
        async goSendMsg () {
            const sql2 = `select * from t_fxpgjlb2 where id_='${this.params.id_}'`
            const { variables: { data: data2 }} = await this.$common.request('sql', sql2)
            if (data2.length > 0 && data2[0].shi_fou_guo_shen_ === '已完成') {
                return this.$message('已结束，不可推送消息！')
            }
            if (!data2[0].ping_gu_ren_yuan_) {
                return this.$message.warning('请先指定评估人！')
            }
            this.$confirm('此操作将通知所有评估人，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // console.log(this.Ids)
                const allRequests = []
                this.Ids.forEach(item => {
                    allRequests.push(this.$common.sendMsg({
                        subject: '风险识别项待填写提醒',
                        content: `您有一份风险识别项待填写，请前往-风险控制-风险评估与措施页面填写，计划编号：${this.infoFxssbData.ji_hua_bian_hao_}，组长：${this.infoFxssbData.zu_chang_}。如已提交请忽略。`,
                        receiverId: item,
                        canreplay: '0',
                        skipTypeMsg: JSON.stringify({
                            skipType: 3,
                            pathInfo: '/tygl/fxkzV2/fxpgycslb' // 路由
                        })
                    }))
                })
                Promise.all(allRequests).then(() => {
                    this.$message({
                        type: 'success',
                        message: '推送成功!'
                    })
                })
                    .catch(() => {
                        this.$message({
                            type: 'warning',
                            message: '推送失败!'
                        })
                    })
            }).catch(() => {

            })
        },
        // 获取人员部门
        getPersonPosition (id) {
            const userList = this.$store.getters.userList
            const bianzhiUserid = userList.find(i => i.userId === id)
            if (bianzhiUserid) {
                return bianzhiUserid.positionId.split(',')[0]
            }
        },
        checkRequired () {
            if (!this.infoFxssbData.nian_du_) {
                throw new Error('请填写年度！')
            }
            if (!this.infoFxssbData.kai_shi_ri_qi_) {
                throw new Error('请填写评估开始日期！')
            }
            if (!this.infoFxssbData.jie_shu_ri_qi_) {
                throw new Error('请填写评估结束日期！')
            }
            if (!this.infoFxssbData.bao_gao_shi_jian_) {
                throw new Error('请填写报告完成时间！')
            }
            // if (!this.infoFxssbData.hui_yi_shi_jian_) {
            //     throw new Error('请填写首次会议时间！')
            // }
            // if (!this.infoFxssbData.can_hui_ren_yuan_) {
            //     throw new Error('请填写参会人员！')
            // }
            if (!this.infoFxssbData.ping_gu_ren_yuan_) {
                throw new Error('请填写评估人员！')
            }
            if (!this.infoFxssbData.bian_zhi_shi_jian) {
                throw new Error('请选择编制时间！')
            }
            if (!this.infoFxssbData.bian_zhi_bu_men_) {
                throw new Error('请选择编制部门！')
            }
            if (!this.infoFxssbData.ji_suan_fang_shi_) {
                throw new Error('请选择风险系数计算方式！')
            }
        },
        async goAdd () {
            try {
                const addParamsRecord = {
                    tableName: 't_fxpgjlb2',
                    paramWhere: [this.infoFxssbData]
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
                // 先检查状态
                await this.getIsFinish()
                // 更新主表
                const updateParamsRecord = {
                    tableName: 't_fxpgjlb2',
                    updList: [{
                        where: {
                            id_: this.params.id_
                        },
                        param: this.infoFxssbData
                    }]
                }
                await this.$common.request('update', updateParamsRecord)

                // 当前人员数组
                const curIds = this.infoFxssbData.ping_gu_ren_yuan_.split(',')

                // 计算需要增加项
                const addedIds = curIds.filter(item => !this.Ids.includes(item))
                // 计算需要更新项
                const updatedIds = curIds.filter(item => this.Ids.includes(item))
                // 计算需要删除项
                const deletedIds = this.Ids.filter(id => !curIds.includes(id))
                console.log(addedIds, updatedIds, deletedIds)
                // 删除
                if (deletedIds.length > 0) {
                    const sql3 = `select *from t_fxsbpgb2 where parent_id_='${this.params.id_}' and bian_zhi_ren_ in (${deletedIds.map(id => `'${id}'`).join(', ')})`
                    const { variables: { data: data3 }} = await this.$common.request('sql', sql3)
                    // console.log(data3)
                    if (data3.length > 0) {
                        const params = {
                            tableName: 't_fxsbpgb2',
                            paramWhere: {
                                id_: data3.map(item => item.id_).join(',')
                            }
                        }
                        console.log(params)
                        await this.$common.request('delete', params)
                        console.log('删除成功')
                    }
                }
                if (flag === 'close') {
                    this.closeDialog(true)
                    this.$message.success('修改成功')
                } else {
                    await this.goRefresh() // 修改之后刷新
                }
            } catch (error) {
                this.$message.warning(error.message)
                throw new Error(error.message)
            }
        },
        async goSave (flag) {
            try {
                this.checkRequired()
                if (this.isEdit) {
                    await this.goEdit(flag)
                } else {
                    this.$confirm('风险系数计算公式保存后不可再修改，是否继续?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await this.goAdd()
                    }).catch(() => {
                    })
                }
            } catch (error) {
                this.$message.warning(error.message)
                throw new Error(error.message)
            }
        },
        // 刷新
        async goRefresh () {
            this.loading = true
            if (this.msg) {
                this.msg.close()
            }
            await this.init()
            if (this.$refs.RiskPeopleTableRef) {
                await this.$refs.RiskPeopleTableRef.getPeopleList()
            }
            this.loading = false
        },
        // 关闭当前窗口
        closeDialog (needRefresh) {
            this.dialogVisible = false
            if (needRefresh) {
                this.$emit('close')
            }
            if (this.msg) {
                this.msg.close()
            }
        },
        // 弹出提醒
        async showAlert () {
            if (!this.isPingGuRen || this.isFinished) return
            // 判断是否已经填写风险识别项
            const sql = `select * from t_fxsbpgb2 where parent_id_='${this.params.id_}' and bian_zhi_ren_='${this.userId}'`
            const { variables: { data }} = await this.$common.request('sql', sql)
            let status = '填写'
            let type = 'warning'
            if (data.length > 0) {
                if (data.every(item => item.shi_fou_guo_shen_ === '已完成')) {
                    return
                } else {
                    status = '提交'
                    type = 'success'
                }
            }
            this.msg = this.$notify({
                offset: 50,
                type: type,
                title: `您有一份风险识别评估表待${status}！`,
                message: `点击前去${status}`,
                showClose: false,
                duration: 0,
                onClick: () => {
                    this.$refs.RiskDetailRef.open(this.params)
                }
            })
        },
        getNextAlias (alias) {
            return new Promise((resolve, reject) => {
                this.$common.getNextIdByAlias({
                    alias
                }).then(response => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        async init () {
            this.isEdit = !!(this.params && this.params.id_)
            if (this.isEdit) {
                this.infoFxssbData = this.params
                this.preParams = JSON.parse(JSON.stringify(this.params))
                this.isPingGuRen = this.params.ping_gu_ren_yuan_.indexOf(this.userId) >= 0
                this.isZuZhang = this.userId === this.infoFxssbData.zu_chang_id_
                this.isFinished = this.params && this.params.shi_fou_guo_shen_ === '已完成'
                this.readonly = !!((!this.isZuZhang || this.isFinished))
                if (this.params.ping_gu_ren_yuan_) {
                    this.Ids = this.params.ping_gu_ren_yuan_.split(',')
                } else {
                    this.Ids = []
                }
                await this.showAlert()
            } else {
                this.readonly = false
                this.infoFxssbData.di_dian_ = this.level
                this.infoFxssbData.ji_hua_bian_hao_ = await this.getNextAlias('fxjhlsh')
                this.infoFxssbData.nian_du_ = dayjs().format('YYYY')
                this.infoFxssbData.bian_zhi_bu_men_ = this.position
                this.infoFxssbData.bian_zhi_ren_ = this.userId
                this.infoFxssbData.bian_zhi_shi_jian = dayjs().format('YYYY-MM-DD HH:mm:ss')
                this.infoFxssbData.zu_chang_id_ = this.userId
                this.infoFxssbData.kai_shi_ri_qi_ = dayjs().format('YYYY-MM-DD')
                this.infoFxssbData.jie_shu_ri_qi_ = dayjs().format('YYYY-MM-DD')
                this.infoFxssbData.feng_xian_lei_xin = '质量'
                this.infoFxssbData.shi_ji_ = '定期评估'
                this.infoFxssbData.fan_wei_ = '本实验室与质量相关所有活动'
                this.infoFxssbData.fang_fa_ = '定量风险评估法'
                this.infoFxssbData.mu_di_ = '通过对实验室（质量活动）进行风险评估，识别实验室在（质量活动）方面存在的潜在风险，评估风险影响程度，制定风险管理策略，减少不利后果发生的概率和影响程度。'
                this.infoFxssbData.hui_yi_shi_jian_ = dayjs().format('YYYY-MM-DD HH:mm')
                this.$nextTick(() => {
                    this.infoFxssbData.shi_wu_shuo_ming_ = `年度：${this.infoFxssbData.nian_du_}；组长：${this.infoFxssbData.zu_chang_}；评估开始日期：${this.infoFxssbData.kai_shi_ri_qi_}；风险类型：${this.infoFxssbData.feng_xian_lei_xin}`
                })
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
.container {
        display: flex;
        width: 100%;
        justify-content: center;

        .left{
            height: calc(100vh - 100px);
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding:10px;
            overflow-y: auto;
        }
        .right{
            height: calc(100vh - 100px);
            flex: 1;
            padding:10px;
            .text{
                line-height: 1.5;
            }
            overflow-y: auto;
        }
    }
}
.required-star {
  color: red;
  margin-right: 4px;
}
.dialog-title{
    display: flex;
    align-items: center;
    justify-content: center;
    div{
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
.el-image-viewer__wrapper{
    z-index: 9999 !important;
}
</style>
