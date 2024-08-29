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
                    placeholder="请选择检验方法"
                    :dynamic-params="dynamicParams"
                />
                <!--  :dynamic-params="field.dynamicParams"接收的参数，相当于过滤 -->
                <!-- <el-input v-model="ruleForm.xiangMuFangFa" placeholder="请输入项目名称" />
                     -->
            </el-form-item>
            <el-form-item label="项目名称" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.xiangMuMingCheng" :disabled="!selectEditchanges" placeholder="请输入项目名称" />
            </el-form-item>
            <el-form-item label="设备名称" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.sheBeiMingCheng" :disabled="!selectEditchanges" placeholder="请输入设备名称" /></el-form-item>
            <el-form-item label="设备编号" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.sheBeiBianHao" :disabled="!selectEditchanges" placeholder="请输入设备编号" /></el-form-item>
            <el-form-item label="试剂及批号" prop="deng_ji_bu_men_">
                <div class="setBorder" :disabled="!selectEditchanges">{{ ruleForm.shiJi?ruleForm.shiJi:'/' }}</div>
            </el-form-item>
            <el-form-item label="校准品及批号" prop="deng_ji_bu_men_">
                <div class="setBorder" :disabled="!selectEditchanges">{{ ruleForm.jiaozhuiPin?ruleForm.jiaozhuiPin:'/' }}</div>
            </el-form-item>
            <el-form-item label="上次性能验证" prop="deng_ji_bu_men_">
                <div class="setMargin" :inert="isInert">
                    <div>{{ firstItemText }}</div>
                    <el-radio-group v-model="ruleForm.xing_neng_yan_zheng">
                        <el-row :gutter="20">
                            <el-col v-for="(item, index) in yangzheng.slice(1)" :key="index" :span="8">
                                <el-radio :label="item" :disabled="!selectEditchanges">{{ item }}</el-radio>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                </div>
            </el-form-item>
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
                    </el-table>
                </div>
            </el-form-item>
            <el-form-item label="评审结论" prop="deng_ji_bu_men_">
                <div :inert="isInert" class="setMargin">
                    <div>{{ pinNeirong }}</div>
                    <el-radio-group v-model="ruleForm.ping_shen_jie_lun">
                        <el-row :gutter="20">
                            <el-col v-for="(item, index) in jieLun.slice(1)" :key="index" :span="8">
                                <el-radio :label="item" :disabled="!selectEditchanges">{{ item }}</el-radio>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="发现的问题" prop="deng_ji_bu_men_">
                <el-input v-model="ruleForm.faXianWenTi" class="custom-input" type="textarea" :disabled="!selectEditchanges" />
            </el-form-item>
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
        }
    },
    data () {
        return {
            dialogFormVisibles: this.visidial,
            selectEditchanges: this.selectEditchange,
            selectEditDatas: this.selectEditData,
            isInert: false,
            dynamicParams: {},
            // pinShenTitle: '上次验证性能，请选择以下内容中的一个选项:',
            // jieLunTitle: '评审结论，请选择以下内容中的一项:',
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
                xing_neng_yan_zheng: '',
                ping_shen_jie_lun: '',
                faXianWenTi: ''
            },
            //   jianYanXiangMu: '',
            //   xiaoZhunPinJiPiHa: '',
            //   a: ''
            rules: {
                jianYanFangFa: [{ required: true, message: '请填写数据' }],
                xiangMuFangFa: [{ required: true, message: '请填写数据' }]
            },
            maxHeight: '600px',
            yangzheng: [`上次验证性能，请选择以下内容中的一个选项:`, '(1)正确性', '(2)精密度', '(3)检出限', '(4)可报告范围', '(5)线性', '(6)符合率', '(7)抗干扰能力', '(8)特异性', '(9)携带污染率'],
            jieLun: ['评审结论，请选择以下内容中的一项:', '(1)适用于检验申请', '(2)需方法验证', '(3)需方法确认', '(4)需室间比对', '(5)需设备间对比', '(6)需留样再测', '(7)需项目校准', '(8)复测室间质评物', '(9)其他'],
            // pinShen: ['a 上次检验方法评审的执行情况;', 'b 病人和临床医护部门对某检测项目的意见或建议;', 'c 与检测项目有关的学术进展，是否有更好的替代实验;', 'd 检测项目的应用范围是否合适;', 'e 检测项目是否出现新的局限性;', 'f 检验申请（包括条码内容）是否需要变动;', 'g 检测项目所需标本的采集方式（标本类型、采集容器、保存剂）及量是否合适;', 'h 标本运送中是否存在的问题（包括安全、运送条件、运送时限）;', 'i 标本保存中是否存在的问题;', 'j 标本处理（接收、拒收）中是否存在的问题;', 'k 检测项目所需设备和试剂是否合适，是否需要变更；仪器或试剂供应商提供的意见和建议;', 'l 设备与试剂的校准情况，检测结果的溯源情况;', 'm 检测项目的室间质量评价;', 'n 检测项目的室内质量控制情况;', 'o 检测结果的报告方式是否合适，计算方法是否正确;', 'p  检测项目执行过程中是否出现不符合项;', 'q 检测结果的生物参考区间是否合适;', 'r 测定方法的性能参数（包括线性、敏感性、特异性、精密度、准确度、检出限等）是否满足要求;', 's 检测方法的干扰因素影响;', 't 执行检测项目的安全性;', 'u 检验周期是否合适;', 'v 检验报告格式是否需要变更；检验报告的审核是否全面、规范，检验报告的更改;', 'w 检验报告发布方式是否合适；有无延迟或口头报告发送 ，检验后样品的处置; ', 'x 检测结果危急值的设定;'],
            pinShen1: [
                {
                    name: 'a 上次检验方法评审的执行情况;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'b 病人和临床医护部门对某检测项目的意见或建议;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'c 与检测项目有关的学术进展，是否有更好的替代实验;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'd 检测项目的应用范围是否合适;',
                    shi_fou: '是',
                    bei_zhu: ''
                }, {
                    name: 'e 检测项目是否出现新的局限性;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'f 检验申请（包括条码内容）是否需要变动;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'g 检测项目所需标本的采集方式（标本类型、采集容器、保存剂）及量是否合适;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'h 标本运送中是否存在的问题（包括安全、运送条件、运送时限）;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'i 标本保存中是否存在的问题;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'j 标本处理（接收、拒收）中是否存在的问题;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'k 检测项目所需设备和试剂是否合适，是否需要变更；仪器或试剂供应商提供的意见和建议;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'l 设备与试剂的校准情况，检测结果的溯源情况;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'm 检测项目的室间质量评价;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'n 检测项目的室内质量控制情况;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'o 检测结果的报告方式是否合适，计算方法是否正确;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'p  检测项目执行过程中是否出现不符合项;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'q 检测结果的生物参考区间是否合适;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'r 测定方法的性能参数（包括线性、敏感性、特异性、精密度、准确度、检出限等）是否满足要求;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 's 检测方法的干扰因素影响;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 't 执行检测项目的安全性;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'u 检验周期是否合适;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'v 检验报告格式是否需要变更；检验报告的审核是否全面、规范，检验报告的更改;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'w 检验报告发布方式是否合适；有无延迟或口头报告发送 ，检验后样品的处置;',
                    shi_fou: '是',
                    bei_zhu: ''
                },
                {
                    name: 'x 检测结果危急值的设定;',
                    shi_fou: '是',
                    bei_zhu: ''
                }

            ]
        }
    },
    computed: {
        firstItemText () {
            return `上次验证性能，请选择以下内容中的一个选项:${this.ruleForm.xing_neng_yan_zheng}`
        },
        pinNeirong () {
            return `评审结论，请选择以下内容中的一项:${this.ruleForm.ping_shen_jie_lun}`
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
            // if (!this.selectEditchange) {
            //     this.selectEditchanges = false
            // } else {
            //     this.selectEditchanges = true
            // }
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
                      if (!this.selectEditData) {
                          const a = this.yangzheng[0] + this.ruleForm.xing_neng_yan_zheng
                          const b = this.jieLun[0] + this.ruleForm.ping_shen_jie_lun
                          this.yangzheng[0] = a
                          this.jieLun[0] = b
                      } else {
                          const a = this.yangzheng[0].split(':')
                          const b = this.jieLun[0].split(':')
                          if (a[1] !== this.ruleForm.xing_neng_yan_zheng) {
                              this.yangzheng[0] = a[0] + ':' + this.ruleForm.xing_neng_yan_zheng
                          }
                          if (b[1] !== this.ruleForm.ping_shen_jie_lun) {
                              this.jieLun[0] = b[0] + ':' + this.ruleForm.ping_shen_jie_lun
                          }
                      }
                      const obj = {
                          jianYanFangFa: this.ruleForm.jianYanFangFa,
                          xiangMuFangFa: this.ruleForm.xiangMuFangFa,
                          xiangMuMingCheng: this.ruleForm.xiangMuMingCheng,
                          sheBeiMingCheng: this.ruleForm.sheBeiMingCheng,
                          sheBeiBianHao: this.ruleForm.sheBeiBianHao,
                          shiJi: this.ruleForm.shiJi,
                          jiaozhuiPin: this.ruleForm.jiaozhuiPin,
                          yangzheng: JSON.stringify(this.yangzheng),
                          jieLun: JSON.stringify(this.jieLun),
                          pinShen1: JSON.stringify(this.pinShen1),
                          faXianWenTi: this.ruleForm.faXianWenTi
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
                this.ruleForm.xiangMuMingCheng = res.variables.data[0].jian_yan_xiang_mu
                this.ruleForm.sheBeiMingCheng = res.variables.data[0].she_bei_
                this.ruleForm.sheBeiBianHao = res.variables.data[0].she_bei_bian_hao_
                this.ruleForm.shiJi = res.variables.data[0].shi_ji_
                this.ruleForm.jiaozhuiPin = res.variables.data[0].yang_pin_lei_xing
                this.ruleForm.jianYanXiangMu = res.variables.data[0].parent_id_
                this.ruleForm.xiaoZhunPinJiPiHa = res.variables.data[0].xiao_zhun_wu_
            })
        },

        // 查阅，修改带出数据
        slectUpdate (selectEditDatas) {
            const a = JSON.parse(selectEditDatas.yangzheng)[0].split(':')
            const b = JSON.parse(selectEditDatas.jieLun)[0].split(':')
            this.ruleForm.xing_neng_yan_zheng = a[1]
            this.ruleForm.ping_shen_jie_lun = b[1]
            this.ruleForm.jianYanFangFa = selectEditDatas.jianYanFangFa
            this.ruleForm.xiangMuFangFa = selectEditDatas.xiangMuFangFa
            this.ruleForm.xiangMuMingCheng = selectEditDatas.xiangMuMingCheng
            this.ruleForm.sheBeiBianHao = selectEditDatas.sheBeiBianHao
            this.ruleForm.sheBeiMingCheng = selectEditDatas.sheBeiMingCheng
            this.ruleForm.shiJi = selectEditDatas.shiJi
            this.ruleForm.jiaozhuiPin = selectEditDatas.jiaozhuiPin
            this.ruleForm.faXianWenTi = selectEditDatas.faXianWenTi
            this.yangzheng = JSON.parse(selectEditDatas.yangzheng)
            this.pinShen1 = JSON.parse(selectEditDatas.pinShen1)
            this.jieLun = JSON.parse(selectEditDatas.jieLun)
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
.setMargin{
    margin:0 0 15px 0;
}
.review-form{
 padding: 10px;
}
::v-deep{
    .el-dialog{
        width: 60% !important;
        margin-top: 2vh !important;
        height: 90% !important;
    }
}
}

</style>

