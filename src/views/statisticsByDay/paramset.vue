<template>
   <el-scrollbar ref="scrollDiv" :style="{height:height}">
  <div >
       <!--顶部按钮 请根据实际添加-->
      <div class="dynamic-form" style="padding-left: 3px;">
         <!--表头-->
         <div class="form-header">
            <div class="el-dialog--center" style="height:40px;vertical-align: top;padding-top:10px;font-size: 18px;font-weight: bold;"  >质量监督体系指标配置</div>
      </div>
      <div  style="text-align: right;padding-right: 35px;">

              <div  style="float:right;padding-right: 10px;"><el-button type="primary" size="small" @click="exportExcel">导出上传模板</el-button></div>
              <el-upload style="float:right;padding-right: 10px;"
                class="upload"
                :action="uploadActionUrl"
                ref="upload"
                :on-success="mySuccess">
                <el-button slot="trigger" size="small" type="primary">批量上传</el-button>
                </el-upload>
                 <div  style="float:right;padding-right: 10px;"><el-button type="primary" size="small" @click="remove">删除</el-button></div>
                <div  style="float:right;padding-right: 10px;"><el-button type="primary" size="small" @click="add">新增</el-button></div>

      </div>
  <el-table border="1"
        :data="json_data"
        style="width: 98%">
      <el-table-column
        prop="name0"
        label=""
        width="40">
        <template slot-scope="scope">
         <input type="checkbox" v-model="scope.row.rowChecked" :value="scope.row.id"/>
         </template>
      </el-table-column>
      <el-table-column
        prop="name0"
        label="编号"
        width="70">
        <template slot-scope="scope">
         <input type="text" v-model="scope.row.id" v-show="scope.row.iseditor" />
         <span  v-show="!scope.row.iseditor">{{scope.row.id}}</span>
         </template>
      </el-table-column>
        <el-table-column
          prop="name1"
          label="记录表单名称"
          width="180">
        <template slot-scope="scope">
            <input type="text" v-model="scope.row.formName" v-show="scope.row.iseditor" />
            <span  v-show="!scope.row.iseditor">{{scope.row.formName}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="name0"
          label="程序文件"
          width="180">
          <template slot-scope="scope">
            <input type="text" v-model="scope.row.funcName" v-show="scope.row.iseditor" />
            <span  v-show="!scope.row.iseditor">{{scope.row.funcName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name2"
          label="填写频率/时机"
          width="100">
        <template slot-scope="scope">
            <input type="text" v-model="scope.row.recRate" v-show="scope.row.iseditor" />
            <span  v-show="!scope.row.iseditor">{{scope.row.recRate}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="name3"
          label="填写人"
          width="100">
        <template slot-scope="scope">
            <input type="text" v-model="scope.row.post" v-show="scope.row.iseditor" />
            <span  v-show="!scope.row.iseditor">{{scope.row.post}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="name4"
          label="审核人/审批人"
          width="100">
        <template slot-scope="scope">
            <input type="text" v-model="scope.row.auditor" v-show="scope.row.iseditor" />
            <span  v-show="!scope.row.iseditor">{{scope.row.auditor}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="name5"
          label="预期目标"
          width="180">
        <template slot-scope="scope">
            <input type="text" v-model="scope.row.exp" v-show="scope.row.iseditor" />
            <span  v-show="!scope.row.iseditor">{{scope.row.exp}}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="name5"
          label="计算公式"
          width="180">
        <template slot-scope="scope">
           <input type="text" v-model="scope.row.checkInd" v-show="scope.row.iseditor" />
           <span  v-show="!scope.row.iseditor">{{scope.row.checkInd}}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button type="warning" @click="edit(scope.row, scope)">编辑</el-button>
                  <el-button type="danger" @click="save(scope.row)">保存</el-button>
                </template>
              </el-table-column>
      </el-table>
  </div></div>
    </el-scrollbar>
</template>

<script>
  import { BASE_API, BUSINESS_BASE_URL } from '@/api/baseUrl'
  import {load,paramSetById,deleteMe} from '@/api/report/paramset.js'


  export default {
    components:{

    },
    props:{

    },
    mounted() {

    },
    created(){
      this.loadMe()
    },
    methods: {
      remove(){
        let cList = this.json_data.filter(item => item.rowChecked).map(item => item.id)
        deleteMe({data:cList.join(",")}).then(response => {
           this.loadMe()
         })
      },
        exportExcel() {
          require.ensure([], () => {
            const { export_json_to_excel } = require('../../business/platform/excel/Export2Excel');
            const tHeader = ['编号', '记录表单名称', '程序文件', '填写频率/时机', '填写人', '审核人/审批人', '预期目标', '计算公式'];
            const filterVal = ['id', 'formName', 'funcName', 'recRate', 'post', 'auditor', 'checkInd', 'exp'];
            const list = this.json_data;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '监督体系配置');
          })
        },
        formatJson(filterVal, jsonData) {
             return jsonData.map(v => filterVal.map(j => v[j]))
        },
        add() {
          this.json_data.push({"rowChecked":false,"id":"","funcName":"","formName":"","recRate":"","post":"","auditor":"","checkInd":"","exp":"","iseditor":true})
        },
        loadMe(){
          let that = this
          load().then(response => {
              let dbData = response.data
              that.json_data=[]
              dbData.forEach(function(e){
                e['iseditor']=false
                that.json_data.push(e)
              })
          })
        },
        mySuccess() {
          this.$message({
              type:'success',
              showClose:true,
              duration:1000,
              message:'上传成功'
          });
          this.loadMe()
        },
        edit(row, index) {
          row.iseditor = true;
        },
        save(row, index) {
          if(!row.id||row.id==""){
             this.$message("ID不能为空！")
             return
          }
          row.iseditor = false;
          let that = this
          paramSetById(JSON.stringify(row)).then(response => {
              that.$message("保存成功！")
              this.loadMe()
          })
        }
      },
    data() {
      return {
       height:(window.screen.height-250)+"px",
       uploadActionUrl:BASE_API() + BUSINESS_BASE_URL() + '/report/reportset/importFile',
       json_fields: {
                 "编号": "id",
                 "记录表单名称":"formName",
                 "程序文件":"funcName",
                 "填写频率/时机":"recRate",
                 "填写人":"post",
                 "审核人/审批人":"auditor",
                 "预期目标":"checkInd",
                 "计算公式":"exp",
               },
               json_data:[],
               tableData: [],
               json_meta: [
                 [
                   {
                     " key ": " charset ",
                     " value ": " utf- 8 "
                   }
                 ]
               ],

      }
    },
  }
</script>
<style lang="scss">
  .statistics {
    .editDate{
      overflow: hidden;
      background-color:rgb(249, 255, 255);

    }
    .block{
      float: left;
      font-size: 14px;
     }
  }
</style>
