<template>
    <!-- 点击添加 -->
    <el-dialog
        title="添加"
        :visible.sync="dialogFormVisibles"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="dialog paper-detail-dialog"
        append-to-body
        @close="dialogFormVisibles=false"
    >
        <el-form ref="ruleForm" :model="ruleForm" label-width="120px" :rules="rules" class="review-form">
            <el-form-item label="检验方法" prop="jianYanFangFa">
                <ibps-custom-dialog
                    v-model="ruleForm.jianYanFangFa"
                    size="small"
                    template-key="ffglxz"
                    :multiple="false"
                    :disabled="!selectEditchanges"
                    type="dialog"
                    icon="el-icon-zoom-in"
                    class="custom-dialog"
                    placeholder="请选择检验方法"
                />
            </el-form-item>
            <el-form-item label="项目与方法" prop="xiangMuFangFa">
                <ibps-custom-dialog
                    v-model="ruleForm.xiangMuFangFa"
                    size="small"
                    template-key="nlfwxz"
                    :multiple="false"
                    :disabled="!selectEditchanges"
                    type="dialog"
                    class="custom-dialog"
                    icon="el-icon-zoom-in"
                    placeholder="请选择检验方法"
                />
                <!-- :dynamic-params="dynamicParams" -->
                <!--  :dynamic-params="field.dynamicParams"接收的参数，相当于过滤 -->
                <!-- <el-input v-model="ruleForm.xiangMuFangFa" placeholder="请输入项目名称" />
                     -->
            </el-form-item>
            <el-form-item label="项目名称" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.xiangMuMingCheng" :disabled="!selectEditchanges" placeholder="请输入项目名称" />
            </el-form-item>
            <!-- <el-form-item label="设备名称" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.sheBeiMingCheng" :disabled="!selectEditchanges" placeholder="请输入设备名称" /></el-form-item>
            <el-form-item label="设备编号" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.sheBeiBianHao" :disabled="!selectEditchanges" placeholder="请输入设备编号" /></el-form-item>
            <el-form-item label="试剂及批号" prop="deng_ji_bu_men_">
                <div class="setBorder" :disabled="!selectEditchanges">{{ ruleForm.shiJi?ruleForm.shiJi:'/' }}</div>
            </el-form-item>
            <el-form-item label="校准品及批号" prop="deng_ji_bu_men_">
                <div class="setBorder" :disabled="!selectEditchanges">{{ ruleForm.jiaozhuiPin?ruleForm.jiaozhuiPin:'/' }}</div>
            </el-form-item> -->
            <!-- <el-form-item label="上次性能验证" prop="deng_ji_bu_men_">
                <div class="setMargin" :inert="isInert">
                    <div style="height: 32px" />
                    <el-checkbox-group v-model="ruleForm.xing_neng_yan_zheng">
                        <el-row :gutter="20">
                            <el-col v-for="(item, index) in yangzheng" :key="index" :span="8">
                                <el-checkbox :label="item" :disabled="!selectEditchanges">{{ item }}</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </div>
            </el-form-item> -->
            <el-form-item label="评审内容" prop="deng_ji_bu_men_">
                <div>
                    <el-table
                        :data="pinShen1"
                        style="width: 100%"
                        border
                        stripe
                        max-height="300px"
                    >
                        <el-table-column
                            prop="name"
                            label="描述"
                        />
                        <el-table-column
                            prop="shi_fou"
                            label="判断"
                            width="150px"
                        >
                            <template v-slot="{ row }">
                                <el-radio-group v-model="row.shi_fou">
                                    <el-radio label="是" :disabled="!selectEditchanges" />
                                    <el-radio label="否" :disabled="!selectEditchanges" />
                                </el-radio-group>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="bei_zhu"
                            label="备注"
                        >
                            <template v-slot="{ row }">
                                <el-input
                                    v-model="row.bei_zhu"
                                    :disabled="!selectEditchanges"
                                    placeholder="请输入备注"
                                />
                            </template>
                        </el-table-column>
                        <!-- 添加两个字段 -->
                        <el-table-column
                            width="150px"
                            prop="shi_fou_shi_yong"
                            label="该次评审是否适用"
                        >
                            <template v-slot="{ row }">
                                <el-radio-group v-model="row.shi_fou_shi_yong">
                                    <el-radio label="是" :disabled="!selectEditchanges" />
                                    <el-radio label="否" :disabled="!selectEditchanges" />
                                </el-radio-group>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="cuo_shi_"
                            label="预防或纠正措施"
                        >
                            <template v-slot="{ row }">
                                <el-input
                                    v-model="row.cuo_shi_"
                                    :disabled="!selectEditchanges"
                                    placeholder="请输入备注"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form-item>
            <!-- <el-form-item label="评审结论" prop="deng_ji_bu_men_">
                <div :inert="isInert" class="setMargin">
                    <div style="height: 32px" />
                    <el-checkbox-group v-model="ruleForm.ping_shen_jie_lun">
                        <el-row :gutter="20">
                            <el-col v-for="(item, index) in jieLun" :key="index" :span="8">
                                <el-checkbox :label="item" :disabled="!selectEditchanges">{{ item }}</el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                </div>
            </el-form-item> -->
            <!-- <el-form-item label="发现的问题" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.faXianWenTi" class="custom-input" type="textarea" :disabled="!selectEditchanges" />
            </el-form-item> -->
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
export default {
    components: {
        IbpsCustomDialog: () => import('@/business/platform/data/templaterender/custom-dialog')
    },
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        params: {
            type: Object,
            default: () => {}
        },
        visidial: {
            type: Boolean,
            default: false
        },
        selectEditData: {
            type: [Object, String],
            default: () => {}
        },
        selectEditchange: {
            type: Boolean,
            default: false
        },
        configList: {
            type: Array,
            default: () => {
            }
        }
    },
    data () {
        return {
            dialogFormVisibles: this.visidial,
            selectEditchanges: this.selectEditchange,
            selectEditDatas: this.selectEditData,
            pinShen1: this.configList,
            isInert: false,
            dynamicParams: {},
            id: '',
            toolbars: [
                {
                    key: 'confirm'
                },
                {
                    key: 'cancel'
                }
            ],
            ruleForm: {
                jianYanFangFa: '',
                xiangMuFangFa: '',
                xiangMuMingCheng: '',
                sheBeiMingCheng: '',
                sheBeiBianHao: '',
                shiJi: '',
                jiaozhuiPin: '',
                xing_neng_yan_zheng: [],
                ping_shen_jie_lun: [],
                faXianWenTi: '',
                jianYanXiangMu: ''
            },
            rules: {
                jianYanFangFa: [{ required: true, message: '请填写数据' }],
                xiangMuFangFa: [{ required: true, message: '请填写数据' }]
            },
            maxHeight: '600px',
            yangzheng: ['(1)正确性', '(2)精密度', '(3)检出限', '(4)可报告范围', '(5)线性', '(6)符合率', '(7)抗干扰能力', '(8)特异性', '(9)携带污染率'],
            jieLun: ['(1)适用于检验申请', '(2)需方法验证', '(3)需方法确认', '(4)需室间比对', '(5)需设备间对比', '(6)需留样再测', '(7)需项目校准', '(8)复测室间质评物', '(9)其他']
        }
    },
    watch: {
        'ruleForm.jianYanFangFa' (val) {
            this.dynamicParams.jian_yan_fang_fa_ = val
        },
        'ruleForm.xiangMuFangFa': function (newValeu) {
            this.breakData(newValeu)
            this.id = newValeu
        }
    },
    created () {
        if (this.selectEditDatas) {
            this.slectUpdate(this.selectEditDatas)
        }
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'confirm':
                    if (this.selectEditchanges) this.submitForm('ruleForm')
                    else this.closeDialog()
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
        submitForm (formName) {
              this.$refs[formName]?.validate((valid) => {
                  if (valid) {
                      const obj = {
                          jianYanFangFa: this.ruleForm.jianYanFangFa,
                          xiangMuFangFa: this.ruleForm.xiangMuFangFa,
                          xiangMuMingCheng: this.ruleForm.xiangMuMingCheng,
                          sheBeiMingCheng: this.ruleForm.sheBeiMingCheng,
                          sheBeiBianHao: this.ruleForm.sheBeiBianHao,
                          shiJi: this.ruleForm.shiJi,
                          jiaozhuiPin: this.ruleForm.jiaozhuiPin,
                          //   yangzheng: JSON.stringify(this.yangzheng),
                          yangzheng: this.ruleForm.xing_neng_yan_zheng,
                          //   jieLun: JSON.stringify(this.jieLun),
                          jieLun: this.ruleForm.ping_shen_jie_lun,
                          pinShen1: JSON.stringify(this.pinShen1),
                          faXianWenTi: this.ruleForm.faXianWenTi,
                          jianYanXiangMu: this.ruleForm.jianYanXiangMu
                      }
                      this.$emit('getData', obj, this.selectEditData.rowIndex)
                      this.$emit('getcolse')
                  } else {
                      return false
                  }
              })
        },
        // 选择检验与方法带出数据
        breakData (newValeu) {
            const sql = `select * from neng_li_fan_wei_ where id_='${newValeu}'`
            this.$common.request('sql', sql).then(res => {
                console.log('res', res)
                this.ruleForm.xiangMuMingCheng = res.variables.data[0].jian_yan_xiang_mu
                this.ruleForm.sheBeiMingCheng = res.variables.data[0].she_bei_
                this.ruleForm.sheBeiBianHao = res.variables.data[0].she_bei_bian_hao_
                this.ruleForm.shiJi = res.variables.data[0].shi_ji_
                this.ruleForm.jiaozhuiPin = res.variables.data[0].yang_pin_lei_xing
                this.ruleForm.xiaoZhunPinJiPiHa = res.variables.data[0].xiao_zhun_wu_
                this.ruleForm.jianYanXiangMu = res.variables.data[0].parent_id_
            })
        },

        // 查阅，修改带出数据
        slectUpdate (selectEditDatas) {
            this.ruleForm.xing_neng_yan_zheng = selectEditDatas.yangzheng
            this.ruleForm.jianYanFangFa = selectEditDatas.jianYanFangFa
            this.ruleForm.xiangMuFangFa = selectEditDatas.xiangMuFangFa
            this.ruleForm.xiangMuMingCheng = selectEditDatas.xiangMuMingCheng
            this.ruleForm.sheBeiBianHao = selectEditDatas.sheBeiBianHao
            this.ruleForm.sheBeiMingCheng = selectEditDatas.sheBeiMingCheng
            this.ruleForm.shiJi = selectEditDatas.shiJi
            this.ruleForm.jiaozhuiPin = selectEditDatas.jiaozhuiPin
            this.ruleForm.faXianWenTi = selectEditDatas.faXianWenTi
            // this.yangzheng = JSON.parse(selectEditDatas.yangzheng)
            this.pinShen1 = JSON.parse(selectEditDatas.pinShen1)
            // this.jieLun = JSON.parse(selectEditDatas.jieLun)
            this.ruleForm.ping_shen_jie_lun = selectEditDatas.jieLun
            this.ruleForm.jianYanXiangMu = selectEditDatas.jianYanXiangMu
        }
    }
}
</script>
<style scoped lang="scss">
.paper-detail-dialog{
.dialog-footer{
    text-align: center;
}
.setBorder{
    border: 1px solid #dcdfe6;
    padding:10px;
    border-radius: 4px;
}
// .setMargin{
//     margin:0 0 15px 0;
// }
.review-form{
 padding: 10px;
}
::v-deep{
    .el-dialog{
        width: 80% !important;
        margin-top: 2vh !important;
        height: 90% !important;
    }
}
}

</style>

