<!-- 添加记忆数据库的弹窗 -->
<template>
  <el-dialog  width="55%" class="dictionaryitem" :close-on-click-modal="false" :append-to-body="true"
    :visible.sync="visible">
    <el-tag type="success">添加 [ {{name}} ] 记录字典内容</el-tag>
   <hr>
    <el-form :model="dataForm" style="margin-top: 30px;" :rules="dataRule" ref="dataForm"
      label-width="82px">
      <el-form-item label="记录内容:" prop="text">
        <el-input  type="textarea" :rows="12" v-model="dataForm.text"></el-input>
      </el-form-item>
    </el-form>
  <span  style="text-align:right;width: 100%;display: block; margin-top:3%;">
      <hr>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { BPMN_URL } from'@/api/baseUrl'
  import request from '@/utils/request'
  export default {
    data () {
      return {
        isDisabled: false,
        name: '',
        visible: false,
        dataForm: {
        },
        dataRule: {
          text: [{
            required: true,
            message: '字典内容不能为空',
            trigger: 'blur'
          },{
             max:2000,
             message: '长度最大 2000 个字符',
             trigger: 'blur'
           }
          ]
        }
      }
    },
    methods: {
      init (orderId,inputKey,name) {
          this.visible = true
          this.dataForm={} //清空表单，每进入一次都是新的表单
          this.orderId = orderId
          this.inputKey = inputKey
          this.name = name
      },
      // 表单提交
      dataFormSubmit () {
        // 防止重复提交，1秒后重用
        this.isDisabled = true
        setTimeout(() => {
          this.isDisabled = false
        }, 2000)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
                 request({
                     url:BPMN_URL()+'/sys/SysDataContext/saveDataContext',
                     method: 'post',
                     data:  JSON.stringify({
                    "contextName":this.dataForm.text,
                    "orderId" :this.orderId,
                    'attrName':this.inputKey,
                      })
                   }).then(response => {
                     if(response.state===200){
                       this.$message({
                         message: '添加成功',
                         type: 'success',
                         duration: 800,
                         onClose: () => {
                           this.visible = false
                            this.$emit("proceedCont")
                         }
                       })


                     }
                     }).catch(error => {
                         this.$message.error('系统忙、或数据错误,请稍后再试')
                     })
          }
        })
      },
    }
  }
</script>
<style>
      .dictionaryitem .upload-demo {
         margin-left: 80px;
       }
    .dictionaryitem    .el-dialog__header {
         padding: 0px;
       }
     .dictionaryitem .el-dialog__body{
       padding: 20px !important;
       padding-top: 10px;
       padding-bottom: 10px;
     }
      .dictionaryitem  .el-dialog {
         border-radius: 10px;
       }
     .dictionaryitem  .dialog-footer{
        margin: 10px;
        margin-top: -30px;
       }
    .dictionaryitem .el-dialog__close el-icon el-icon-close{
         margin-top: 5px;
       }

</style>
