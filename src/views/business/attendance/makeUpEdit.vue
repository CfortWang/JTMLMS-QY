<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        class="dialog makeup-dialog"
        top="5vh"
        width="600px"
        :title="title"
        @opened="handleOpened"
        @close="closeDialog"
    >
        <el-form
            ref="makeupForm"
            :model="formData"
            :rules="rules"
            label-width="100px"
            label-position="right"
            class="makeup-form"
            @submit.native.prevent
        >

            <!-- 补卡日期 -->
            <el-form-item label="补卡日期" prop="buKaRiQi" class="form-item-uniform">
                <el-date-picker
                    v-model="formData.buKaRiQi"
                    type="date"
                    :placeholder="readonly? '' : '选择日期'"
                    value-format="yyyy-MM-dd"
                    :picker-options="buKaRiQiPickerOptions"
                    :disabled="readonly"
                    @change="handleBuKaRiQiChange"
                />
            </el-form-item>
            <!-- 补卡班次 -->
            <el-form-item label="补卡班次" prop="buKaBanCi" class="form-item-uniform">
                <el-select
                    v-model="formData.buKaBanCi"
                    :placeholder="readonly? '' : '请选择班次'"
                    :disabled="readonly"
                    @focus="loadBuKaBanCiOptions"
                    @change="handleBanCiChange"
                >
                    <el-option
                        v-for="buKaBanCi in buKaBanCiOptions"
                        :key="buKaBanCi.value"
                        :label="buKaBanCi.label"
                        :value="buKaBanCi.value"
                    />
                </el-select>
            </el-form-item>
            <!-- 补卡时间 -->
            <el-form-item label="补卡时间" prop="buKaShiJian" class="form-item-uniform">
                <el-time-picker
                    v-model="formData.buKaShiJian"
                    value-format="HH:mm:ss"
                    :placeholder="readonly? '' : '请选择时间'"
                    :disabled="readonly"
                />
            </el-form-item>
            <!-- 补卡事由 -->
            <el-form-item label="补卡事由" prop="buKaShiYou">
                <el-input
                    v-model="formData.buKaShiYou"
                    type="textarea"
                    :rows="3"
                    :placeholder="readonly? '' : '请输入补卡原因'"
                    maxlength="200"
                    :disabled="readonly"
                    show-word-limit
                />
            </el-form-item>
            <!-- 说明附件 -->
            <el-form-item label="说明附件">
                <ibps-attachment
                    v-model="formData.fuJian"
                    :download="true"
                    multiple
                    accept="*"
                    :limit="attachmentLimit"
                    :placeholder="readonly? '' : '请上传附件'"
                    :disabled="readonly"
                    style="width:100%"
                />
            </el-form-item>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="toolbars" @action-event="handleFormAction" />
        </div>
    </el-dialog>
</template>
<script>
import { queryAttendanceDetail, saveAttendanceReissue } from '@/api/business/attendance'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import ActionUtils from '@/utils/action'
export default {
    // name: 'makeupedit',
    components: {
        IbpsAttachment
    },
    props: {
        visible: Boolean,
        params: {
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            loading: false,
            submitting: false,
            dialogVisible: this.visible,
            title: '补卡申请',
            formData: {
                id: '',
                buKaRiQi: '',
                buKaBanCi: '',
                buKaShiJian: '',
                buKaShiYou: '',
                shenHeRen: '',
                shenHeShiJian: '',
                kaoQinId: '',
                fuJian: '',
                paiBanId: '',
                paiBanJiLuId: ''
            },
            buKaBanCiOptions: [],
            fileList: [],
            yichangdata: [],
            attachmentLimit: 5,
            rules: {
                buKaRiQi: [{ required: true, message: '请选择补卡日期', trigger: 'change' }],
                buKaBanCi: [{ required: true, message: '请选择补卡班次', trigger: 'change' }],
                buKaShiJian: [{ required: true, message: '请选择补卡时间', trigger: 'change' }],
                buKaShiYou: [{ required: true, message: '请输入补卡事由', trigger: 'blur' }]
            },
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '提交', type: 'success', visible: !this.readonly },
                // { key: 'tempSave', icon: 'ibps-icon-save', label: '暂存', type: 'primary', visible: !this.readonly },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            buKaRiQiPickerOptions: {
                disabledDate (time) {
                    // 禁用今天之后的日期
                    return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
                }
            }
        }
    },

    watch: {
        visible (val) {
            this.dialogVisible = val
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            const isEmpty = Object.keys(this.params).length === 0
            // 查阅状态初始化
            if (!isEmpty) {
                this.buKaBanCiOptions = [{ label: this.params.bu_ka_ban_ci_, value: this.params.bu_ka_ban_ci_ }]
                this.formData = {
                    id: this.params.id_ || '',
                    buKaRiQi: this.params.bu_ka_ri_qi_ || '',
                    buKaBanCi: this.params.bu_ka_ban_ci_ || '',
                    buKaShiJian: this.params.bu_ka_shi_jian_ || '',
                    buKaShiYou: this.params.bu_ka_shi_you_ || '',
                    shenHeRen: this.params.shen_he_ren_ || '',
                    shenHeShiJian: this.params.shen_he_shi_jian_ || '',
                    kaoQinId: this.params.kao_qin_id_ || '',
                    fuJian: this.params.fu_jian_ || '',
                    paiBanId: this.params.pai_ban_id_ || '',
                    paiBanJiLuId: this.params.pai_ban_ji_lu_id_ || ''
                }
            }
        },
        handleOpened () {
            this.init()
            if (this.params.bu_ka_ri_qi_) {
                this.handleBuKaRiQiChange(this.params.bu_ka_ri_qi_)
            }
        },
        /**
         * 异常考勤查询参数
         */
        getSearchFormData () {
            const paramjson = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            const { first, second } = this.$store.getters.level || {}
            paramjson['Q^di_dian_^S'] = (second || first)
            paramjson['Q^ri_qi_^S'] = this.formData.buKaRiQi
            paramjson['Q^yong_hu_id_^S'] = this.$store.getters.userId
            return ActionUtils.formatParams(
                paramjson,
                this.pagination,
                this.sorts
            )
        },
        // 查询补卡日期下的异常数据
        handleBuKaRiQiChange (buKaRiQi) {
            const self = this
            queryAttendanceDetail(this.getSearchFormData()).then(async (res) => {
                // ActionUtils.handleListData(this, res.data)
                self.yichangdata = res.data.dataResult.filter(item => item.kaoQinZhuangTa === '异常' || item.kaoQinZhuangTa === '')
                if (self.yichangdata.length === 0) {
                    self.$message.warning('该日期没有异常班次！')
                    return
                }
                let buKaBanCiArr = []
                self.yichangdata.forEach(element => {
                    if (element.zhuangTai1 !== '正常') { // 上班异常
                        buKaBanCiArr.push({ label: element.banCiBieMing + '-' + '上班', value: element.banCiBieMing + '-' + '上班', id: element.id })
                    }
                    if (element.zhuangTai2 !== '正常') {
                        buKaBanCiArr.push({ label: element.banCiBieMing + '-' + '下班', value: element.banCiBieMing + '-' + '下班', id: element.id })
                    }
                })
                const { first, second } = self.$store.getters.level || {}
                const sql = `select * from t_attendance_reissue where bu_ka_ri_qi_ = '${buKaRiQi}' and zhuang_tai_ = '待审核' and bian_zhi_ren_ = '${self.$store.getters.userId}' and di_dian_ = '${(second || first)}'`
                const response = await self.$common.request('sql', sql)
                // 过滤掉正在申请状态的班次
                buKaBanCiArr = buKaBanCiArr.filter(banCi => {
                    return !response.variables.data.some(item => item.bu_ka_ban_ci_ === banCi.value)
                })
                if (buKaBanCiArr.length === 0) {
                    self.$message.warning('该日期异常班次已申请！')
                    return
                }
                self.buKaBanCiOptions = buKaBanCiArr
                if (self.buKaBanCiOptions.length === 1) { // 只有一个异常班次时自动带出
                    self.formData.buKaBanCi = self.buKaBanCiOptions[0].value
                    self.formData.buKaShiJian = self.buKaBanCiOptions[0].value.includes('上班') ? (self.yichangdata[0].banCiKaiShi.split(' ')[1]) + ':00' : (self.yichangdata[0].banCiJieShu.split(' ')[1]) + ':00'
                }
            }).catch(() => {
            })
        },
        async loadBuKaBanCiOptions () {
            if (!this.formData.buKaRiQi) {
                this.$message.warning('请先选择补卡日期')
                return
            }
        },
        handleBanCiChange (banci) {
            const bieming = banci.split('-')[0]
            const type = banci.split('-')[1]
            const obj = this.yichangdata.filter(item => item.banCiBieMing === bieming)[0]
            if (type === '上班') {
                this.formData.buKaShiJian = obj.banCiKaiShi.split(' ')[1] + ':00'
            } else {
                this.formData.buKaShiJian = obj.banCiJieShu.split(' ')[1] + ':00'
            }
        },
        handleFormAction ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave(key)
                    break
                // case 'tempSave':
                    // this.handleSave(key)
                    // break
                case 'cancel':
                    this.handleCancel()
                    break
                default:
                    break
            }
        },
        handleSave (key) {
            const self = this
            this.$refs.makeupForm.validate((valid) => {
                if (!valid) {
                    return self.$message.warning('请完善表单必填项信息！')
                }
                const { first, second } = self.$store.getters.level || {}
                const { id, buKaRiQi, buKaBanCi, buKaShiJian, buKaShiYou, shenHeRen, kaoQinId, fuJian, paiBanId, paiBanJiLuId } = self.formData || {}
                const time = self.$common.getFormatDate()
                if (!id) {
                    // 补卡关联的考勤数据
                    const updateObj = self.buKaBanCiOptions.filter(obj => obj.value === self.formData.buKaBanCi)
                    const updateId = updateObj[0].id
                    const updateData = self.yichangdata.filter(obj => obj.id === updateId)
                    // 获得补卡审批人
                    const sql = `select config_ FROM t_schedule WHERE id_ = '${updateData[0].paiBanId}'`
                    self.$common.request('sql', sql).then((res) => {
                        const str = res.variables.data[0].config_ || ''
                        let shenHeRen = ''
                        if (str) {
                            const obj = JSON.parse(str)
                            const shenHeRenArr = obj.approver
                            shenHeRen = shenHeRenArr.join(',')
                        }
                        const submitData =
                        {
                            banCiZhuangTai: '',
                            bianZhiRen: self.$store.getters.userId,
                            bianZhiShiJian: time,
                            buKaBanCi: buKaBanCi,
                            buKaRiQi: buKaRiQi,
                            buKaShiJian: buKaShiJian,
                            buKaShiYou: buKaShiYou,
                            createBy: '',
                            createTime: '',
                            dataStatus: '',
                            dbType: '',
                            diDian: second || first,
                            dsAlias: '',
                            fuJian: fuJian,
                            id: self.params.id,
                            ip: '',
                            kaoQinId: updateId,
                            kuaiZhao: '',
                            name: '',
                            paiBanId: updateData.paiBanId,
                            paiBanJiLuId: updateData.paiBanJiLuId,
                            pk: self.params.pk,
                            shenHeRen: shenHeRen,
                            shenHeShiJian: '',
                            shenHeYiJian: '',
                            tenantId: '',
                            type: '',
                            updateBy: '',
                            updateTime: '',
                            zhuangTai: '待审核'
                        }
                        // 提交数据
                        saveAttendanceReissue(submitData).then((res) => {
                            self.$message.success(`申请成功`)
                            // 关闭弹窗，更新列表数据
                            this.closeDialog()
                        })
                    })
                } else { // 再次编辑
                    const submitData =
                        {
                            banCiZhuangTai: '',
                            bianZhiRen: self.$store.getters.userId,
                            bianZhiShiJian: time,
                            buKaBanCi: buKaBanCi,
                            buKaRiQi: buKaRiQi,
                            buKaShiJian: buKaShiJian,
                            buKaShiYou: buKaShiYou,
                            createBy: '',
                            createTime: '',
                            dataStatus: '',
                            dbType: '',
                            diDian: second || first,
                            dsAlias: '',
                            fuJian: fuJian,
                            id: id,
                            ip: '',
                            kaoQinId: kaoQinId,
                            kuaiZhao: '',
                            name: '',
                            paiBanId: paiBanId,
                            paiBanJiLuId: paiBanJiLuId,
                            pk: self.params.pk,
                            shenHeRen: shenHeRen,
                            shenHeShiJian: '',
                            shenHeYiJian: '',
                            tenantId: '',
                            type: '',
                            updateBy: '',
                            updateTime: '',
                            zhuangTai: '待审核'
                        }
                        // 提交数据
                    saveAttendanceReissue(submitData).then((res) => {
                        self.$message.success(`申请成功`)
                        // 关闭弹窗，更新列表数据
                        this.closeDialog()
                    })
                }
            })
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('close', false)
            this.$emit('closeBuKaDialog', 'buka')
        }
    }
}
</script>
<style lang="scss" scoped>
  .makeup-dialog {
        ::v-deep {
            .el-dialog {
                min-width: 1024px;
                &__header {
                    padding: 15px 20px 16px;
                }
            }
        }
        .makeup-form {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;
            min-Height: 400px;
            height: 60vh;
            .operate-btn {
                text-align: right;
                margin-bottom: 5px;
            }
        }
    }
    .form-item-uniform .el-date-editor,
    .form-item-uniform .el-select,
    .form-item-uniform .el-time-picker {
        width: 220px; /* 设置统一的宽度 */
    }
</style>