<template>
    <el-dialog
        :visible.sync="visivle"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="true"
        class="dialog paper-detail-dialog"
        append-to-body
        @close="closeDialog"
    >
        <template slot="title">
            <div class="dialog-title" style="">更新文件信息</div>
        </template>
        <el-form ref="dialogForm" :model="dialogForm" label-width="120px" :rules="rules">
            <el-row :gutter="80" style="margin:2% 0">
                <el-col :span="12"> <el-form-item label="文件类型：">
                    <div>{{ dialogForm.wen_jian_lei_xing?dialogForm.wen_jian_lei_xing:'/' }}</div>
                </el-form-item></el-col>
                <el-col :span="12"> <el-form-item label="文件编号：">
                    <div>{{ dialogForm.wen_jian_bian_hao?dialogForm.wen_jian_bian_hao:'/' }}</div>
                </el-form-item></el-col>
            </el-row>
            <el-row :gutter="80" style="margin:2% 0">
                <el-col :span="12"> <el-form-item label="原文件名称：">
                    <div>{{ dialogForm.yuan_wen_jian_min?dialogForm.yuan_wen_jian_min:'/' }}</div>
                </el-form-item></el-col>
                <el-col :span="12"> <el-form-item label="新文件名称：">
                    <el-input v-model="dialogForm.xin_wen_jian_ming" placeholder="请输入内容" />
                </el-form-item></el-col>
            </el-row>
            <el-row :gutter="80" style="margin:2% 0">
                <el-col :span="12"> <el-form-item label="发布时间：" prop="fa_bu_shi_jian_">
                    <el-date-picker
                        v-model="dialogForm.fa_bu_shi_jian_"
                        :picker-options="{ disabledDate(time) { return time.getTime() > Date.now(); } }"
                        type="datetime"
                        placeholder="选择日期时间"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        style="width:100%"
                    />
                </el-form-item></el-col>
                <el-col :span="12"> <el-form-item label="生效时间：" prop="sheng_xiao_shi_">
                    <el-date-picker v-model="dialogForm.sheng_xiao_shi_" :picker-options="{ disabledDate(time) { return time.getTime() <= Date.now(); } }" type="date" placeholder="选择日期" style="width:100%" />
                </el-form-item></el-col>
            </el-row>
            <el-row :gutter="80" style="margin:2% 0">
                <el-col :span="12"> <el-form-item label="上传文件：" prop="wen_jian_fu_jian_">
                    <ibps-attachment
                        v-model="dialogForm.wen_jian_fu_jian_"
                        allow-download
                        download
                        multiple
                        accept="*"
                        store="id"
                        :readonly="false"
                    />
                </el-form-item></el-col>

            </el-row>
            <el-row :gutter="80" style="margin:2% 0">
                <el-col :span="12"> <el-form-item label="更新内容：">
                    <el-input v-model="dialogForm.geng_xin_nei_rong" placeholder="请输入内容" />
                </el-form-item></el-col>

            </el-row>
            <el-row :gutter="80" style="margin:2% 0">
                <el-col :span="12"> <el-form-item label="更新原因：">
                    <el-input v-model="dialogForm.geng_xin_yuan_yin" placeholder="请输入内容" />
                </el-form-item></el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>
<script>
import IbpsAttachment from '@/business/platform/file/attachment/selector'
export default {
    components: {
        'ibps-attachment': IbpsAttachment
    },
    props: {
        visidial: {
            type: Boolean,
            default: false
        },
        sonData: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            visivle: this.visidial,
            toolbars: [
                {
                    key: 'confirm'
                },
                {
                    key: 'cancel'
                }
            ],
            rules: {
                fa_bu_shi_jian_: [{ required: true, message: this.$t('validate.required') }],
                sheng_xiao_shi_: [{ required: true, message: this.$t('validate.required') }],
                wen_jian_fu_jian_: [{ required: true, message: this.$t('validate.required') }]
            },
            dialogForm: {
                yuan_wen_jian_id_: this.sonData.row.id,
                wen_jian_lei_xing: this.sonData.row.wen_jian_xi_lei_,
                wen_jian_bian_hao: this.sonData.row.wen_jian_bian_hao,
                yuan_wen_jian_min: this.sonData.row.wen_jian_ming_che,
                ji_lu_id_: this.sonData.row.id,
                xin_wen_jian_ming: '',
                fa_bu_shi_jian_: '',
                sheng_xiao_shi_: '',
                wen_jian_fu_jian_: '',
                geng_xin_nei_rong: '',
                geng_xin_yuan_yin: ''
            }
        }
    },
    watch: {
        visidial (val) {
            this.visivle = val
        },
        sonData (val) {
            this.dialogForm.wen_jian_lei_xing = val.row.wen_jian_xi_lei_
            this.dialogForm.wen_jian_bian_hao = val.row.wen_jian_bian_hao
            this.dialogForm.yuan_wen_jian_min = val.row.wen_jian_ming_che
            this.dialogForm.yuan_wen_jian_id_ = val.row.id
            this.dialogForm.ji_lu_id_ = val.row.id
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'confirm':
                    this.dialogVisibleClick('dialogForm')
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        closeDialog () {
            this.$emit('getcolse')
        },
        dialogVisibleClick (dialogForm) {
            this.$refs[dialogForm]?.validate((valid) => {
                if (valid) {
                    const params = {
                        tableName: 't_wjxxgxb',
                        paramWhere: [this.dialogForm]
                    }
                    this.$common.request('add', params).then(res => {
                        this.$message.success('添加成功！')
                        this.closeDialog()
                    }).catch(err => {
                        console.log(err)
                        this.$message.error('添加失败')
                    })
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
.el-dialog{
    .dialog-title{
       width:100%;
       color:#555;
       text-align:center;
       font-size:20px;
       font-weight:600;
    }
}

</style>
