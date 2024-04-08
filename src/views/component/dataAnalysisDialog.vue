<template>
    <el-dialog ref="dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" class="form-renderer-dialog" :width="width" :top="top" :title="this.dynamicParams.editFromType" :custom-class="customClass"  append-to-body @close="closeDialog">
        <div class="maintenanceCycle">
            <div class="maintenanceFont">指标名称：</div>
                <div style="width:50%;">
                    <el-select v-model="cycleValue" clearable placeholder="请选择">
                        
                        <el-option
                            v-for="item in cycleOptions"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.leixing }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="maintenanceCycle" style="align-items: normal;">
                <div class="maintenanceFont">类型：</div>
                <el-radio-group v-model="tyepRadio">
                    <el-radio v-for="(item,i) in tyepRadioOptions" :key="i" :label="item.val">{{item.label}}</el-radio>
                </el-radio-group>
                
            </div>
            <div class="maintenanceCycle" style="align-items: normal;">
                <div class="maintenanceFont">验证方法：</div>
                <el-input
                    style="width:50%;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="verificationMethodTextarea"
                    maxlength="500"
                    show-word-limit
                >
                </el-input>
                
            </div>
            <div class="maintenanceCycle" style="align-items: normal;">
                <div class="maintenanceFont">判断标准：</div>
                <el-input
                    style="width:50%;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="criteriaTextarea"
                    maxlength="500"
                    show-word-limit
                >
                </el-input>
                
            </div>
            <div class="maintenanceCycle" style="align-items: normal;">
                <div class="maintenanceFont">评价结果：</div>
                <el-input
                    style="width:50%;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="maintenanceTextarea"
                    maxlength="500"
                    show-word-limit
                >
                </el-input>
            </div>
            <div class="maintenanceCycle" style="align-items: normal;">
                <div class="maintenanceFont">数据存储：</div>
                <el-input
                    style="width:50%;"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="dataStoreTextarea"
                    maxlength="500"
                    show-word-limit
                >
                </el-input>
            </div>
            <div slot="footer" class="el-dialog--center">
                <ibps-toolbar :actions="editFromType != 'consult' ? toolbars : toolbarsConsult" @action-event="handleActionEvent" />
            </div>
    </el-dialog>
</template>
<script>
import ActionUtils from '@/utils/action'
import { queryDataTable } from '@/api/platform/data/dataTemplate'
import { getBuildDataById } from '@/api/platform/data/dataTemplate'
import { defaultsDeep } from 'lodash'
import Vue from 'vue'
// Vue.component('ibps-formrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        customClass: {
            type: String
        },
        width: {
            type: String,
            default: '80%'
        },
        top: {
            type: String,
            default: '0%'
        },
        editFromType: {
            type: String,
            default: 'add'
        },
        dynamicParams:{
            type: Object
        },
        templateKey:{
            type: String,
            default: ''
        }
    },
    data() {
        
        const subtableConfiguration = ()=> {
            let zbTable = this.dynamicParams.formObj.formDefData.fields.find(i => i.field_name == "t_sjfxzb").field_options.columns
            let zblbTable = zbTable.find(i => i.name == "zhiBiaoId").field_options.options
            
            return zblbTable;
        }
        const subtableTypeConfiguration = ()=> {
            let zbTable = this.dynamicParams.formObj.formDefData.fields.find(i => i.field_name == "t_sjfxzb").field_options.columns
            let zblbTable = zbTable.find(i => i.name == "leiXing").field_options.options
            // console.log(zblbTable)
            return zblbTable;
        }
        return {
            qrCode: '',
            dialogVisible: this.visible,
            cycleOptions: [],
            // cycleOptions: subtableConfiguration(),
            cycleValue: '',
            tyepRadio: '',
            tyepRadioOptions: subtableTypeConfiguration(),
            maintenanceTextarea:'',
            verificationMethodTextarea:'',
            criteriaTextarea:'',
            dataStoreTextarea:'',
            toolbars: [
                { key: 'confirm', label: '确定'},
                { key: 'cancel'}
            ],
            bringOut:[],
            toolbarsConsult: [{ key: 'cancel' }],
            dataTemplate:[],
            nameCycle:''
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        },
        cycleValue: {
            handler: function (val, oldVal) {
                // console.log(val)
                //sql版
                // let text = this.bringOut.find(i=>i.id_ == val)
                // if (typeof text != 'undefined') {
                //     this.verificationMethodTextarea = text.yan_zheng_fang_fa
                //     this.criteriaTextarea = text.pan_duan_biao_zhu
                // }

                //值来源
                let text = this.bringOut.find(i=>i.id_ == val)
                if (typeof text != 'undefined') {
                    this.tyepRadio = text.lei_xing_
                    this.nameCycle = text.zhi_biao_ming_che
                    this.verificationMethodTextarea = text.yan_zheng_fang_fa
                    this.criteriaTextarea = text.pan_duan_biao_zhu
                    this.maintenanceTextarea = text.jie_guo_ping_jia_
                }
                
            },
            // immediate: true
        }
    },
    created(){
        this.loadFormData()
        this.bringOutData()
    },
    methods: {
        bringOutData(){
            //sql版
            // let bm = this.dynamicParams.formObj.getData("bianZhiBuMen")
            // let sql = "select * from t_zbmbpzzb where parent_id_ = (select id_ from t_zbmbpz where bian_zhi_bu_men_ = '"+bm+"' ORDER BY create_time_ DESC limit 1)"
            // this.$common.request('sql', sql).then(res => {
            //     this.bringOut = res.variables.data.length>0?res.variables.data:[]
            // })

            //值来源
            getBuildDataById({
                dataTemplateId: "1214166960749674496"
            }).then(response => {
                
                const data = response.data
                // 从后台获取数据
                this.dataTemplate = JSON.parse(data).templates
                queryDataTable(this.getFormatParams()).then(response => {
                    const data = response.data
                    // this.dataResult = data.dataResult || []
                    // console.log(data.dataResult,'111111111111')
                    this.bringOut = data.dataResult
                    data.dataResult.forEach(element => {
                        let newVal = {val:element.id_ || '',label:element.zhi_biao_ming_che || '',yanzheng:element.yan_zheng_fang_fa || '',panduan:element.pan_duan_biao_zhu || '',leixing:element.lei_xing_ || ''}
                        this.cycleOptions.push(newVal)
                    });
                }).catch(() => {
                })
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        handleActionEvent({ key }) {
            switch (key) {
                case 'confirm':
                    this.handleConfirm(key)
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleConfirm(key) {
            let a=this.dynamicParams.formObj.getData(this.templateKey)
            this.afterSubButton(this.verificationMethodTextarea,this.criteriaTextarea)
            if(this.cycleValue!=''&&this.verificationMethodTextarea!=''&&this.criteriaTextarea!=''&&this.maintenanceTextarea!=''&&this.dataStoreTextarea!=''){
                
                if(this.dynamicParams.position == 'manage'){
                    this.$set(a,this.dynamicParams.params.index,{zhiBiaoMingCheng:this.nameCycle,zhiBiaoId:this.cycleValue,leiXing:this.tyepRadio,yanZhengFangFa:this.verificationMethodTextarea,panDuanBiaoZhun:this.criteriaTextarea,pingJiaJieGuo:this.maintenanceTextarea,shuJuCunChu:this.dataStoreTextarea})
                }else{
                    a.push({zhiBiaoMingCheng:this.nameCycle,zhiBiaoId:this.cycleValue,leiXing:this.tyepRadio,yanZhengFangFa:this.verificationMethodTextarea,panDuanBiaoZhun:this.criteriaTextarea,pingJiaJieGuo:this.maintenanceTextarea,shuJuCunChu:this.dataStoreTextarea})
                }
                // this.$nextTick(function(){
                this.dynamicParams.formObj.setData(this.templateKey,a)
                // })
                
                // this.closeDialog()
            }else if(this.cycleValue!=''&&this.verificationMethodTextarea!=''&&this.criteriaTextarea!=''&&this.maintenanceTextarea!=''){

            }else{
                this.dynamicParams.formObj.$message.warning("请保证所有信息都已填写") 
            }
            
        },
        // 关闭当前窗口
        closeDialog() {
            this.$emit('close', false)
        },
        loadFormData() {
           if(this.dynamicParams.position == 'manage'){
                let a=this.dynamicParams.formObj.getData(this.templateKey)[this.dynamicParams.params.index]
                this.cycleValue = a.zhiBiaoId
                this.nameCycle = a.zhiBiaoMingCheng
                this.tyepRadio = a.leiXing
                this.verificationMethodTextarea = a.yanZhengFangFa
                this.criteriaTextarea = a.panDuanBiaoZhun
                this.maintenanceTextarea = a.pingJiaJieGuo
                this.dataStoreTextarea = a.shuJuCunChu
           }
        },
        afterSubButton (val1,val2) {
            let arr =  val1
            let arrr =  val2
            if(arr.length>0||arrr.length>0){
                const regex = /{[^}]*}/g
                const result = arr.match(regex)      // 验证方法 数组结构的字段对象
                const resultt = arrr.match(regex)    // 判断标准 数组结构的字段对象
                if(!result || !resultt){
                    this.dynamicParams.formObj.$message.error('数据中的验证方法或判断标准没有填写正确的格式，请确认后在重试') 
                    return
                }
                let resuArr = result.concat(resultt) //合并数组
                //判断json格式数据是否正确
                const ypName = resuArr.some(item => item.includes('样品名称'))
                const numrep = resuArr.some(item => item.includes('重复次数'))
                const exday = resuArr.some(item => item.includes('实验天数'))
                const parameter = resuArr.some(item => item.includes('判断参数'))
                const juvalue = resuArr.some(item => item.includes('判断值'))
                if(!ypName){
                    this.dynamicParams.formObj.$message.error('验证方法的{样品名称}未填写')  
                    return
                }
                if(!numrep){
                    this.dynamicParams.formObj.$message.error('验证方法的{重复次数}未填写')  
                    return
                }
                // if(!exday){
                //     this.dynamicParams.formObj.$message.error('验证方法的{实验天数}未填写')  
                //     return
                // }
                if(!exday){
                    resuArr.push('{实验天数:1}')
                }
                if(!parameter){
                    this.dynamicParams.formObj.$message.error('判断标准的{判断参数}未填写')  
                    return
                }
                if(!juvalue){
                    this.dynamicParams.formObj.$message.error('判断标准的{判断值}未填写')  
                    return
                }
                let ojb = this.getJson(resuArr)
                this.dataStoreTextarea = JSON.stringify(ojb)
                this.closeDialog()
            }
        },
        //自定义方法处理数据转为json格式
        getJson(arr){
            let jsonObj = {}
            arr.forEach(item => {
            let parts = item.replace(/[{}]/g, '').split(':');
            if (parts.length === 2) {
                let key = parts[0].trim(); // 去除空格
                let value = parts[1].trim(); // 去除空格
                // 将属性名和属性值添加到 JSON 对象中
                jsonObj[key] = value;
            } else {
                // console.log("格式错误：" + item);
            }
            })
            return jsonObj
        },
        /**
         * 获取格式化参数
         */
        getFormatParams() {
            let formParams = {}
            if (this.$refs['searchForm']) {
                formParams = this.$refs['searchForm'].getSearcFormData() || {}
            }
            const responseData = this.dataTemplate[0]
            responseData.datasetKey = 'dlzbpzb'
            responseData.unique = 'id_'
            responseData['dynamic_params'] = ''
            formParams['response_data'] = JSON.stringify(responseData)
            formParams['filter_condition_key'] = ''
            return ActionUtils.formatParams(formParams, {limit: 200,page: 1,totalCount: 0})
        }
    }
}
</script>
<style lang="scss" >
.form-renderer-dialog {
    .el-dialog__body {
        margin: 0 10px 10px 10px;
        padding: 10px 0 5px 0;
    }
    .el-dialog__headerbtn {
        z-index: 99999;
    }
    @media print {
        .el-dialog__headerbtn {
            display: none !important;
        }
        .hidden-print {
            padding: 0;
            margin: 0;
        }
    }
}
.maintenanceCycle{
    display: flex;
    align-items: center;
    // margin: 2%;
    margin-bottom: 6px !important;
}
.maintenanceFont{
    width: 8%;
}
.marginNone{
    margin: 0;
}
.rightMargin{
    margin-right: 2.5vh !important;
}
.describe{
    margin-top: 2%;
    font-size: 12px;
    color: #808080;
}
.fontColor{
    color: #409EFF;
}
</style>
