<template>
  <div class="panel" 	@keyup.enter.native="selectYear(year)">
    <el-row :gutter="10">
      <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <el-card class="box-card">

          <div slot="header" class="clearfix">
            <el-row>
               <el-col :span="12" >  <el-input size="mini" 	@keyup.enter.native="selectYear(year)" v-model="year" placeholder="请输年份"></el-input> </el-col>
               <el-col :span="6">  <el-button  size="mini"  @click="selectYear(year)" icon="el-icon-search"/> </el-col>
               <el-col :span="6">  <el-button  size="mini"  @click="addYear()" type="primary" icon="el-icon-plus">计划</el-button> </el-col>
            </el-row>
          </div>

          <el-table border  :header-row-style="{'color':'#000000',}"
            :data="yearsData" style="width: 100%;" @row-click="clickRow" >

            <el-table-column show-overflow-tooltip header-align="center" align="center" label="计划年度" prop="create_time_">
              <template slot-scope="scope">
                  {{ scope.row.create_time_.slice(0,4)}}
              </template>
            </el-table-column>


            <el-table-column show-overflow-tooltip header-align="center" align="center" label="月份日期" prop="id_">
            <template slot-scope="scope">
                  {{ scope.row.create_time_.slice(5,10)}}
              </template>
            </el-table-column>
          </el-table>


        </el-card>
      </el-col>
      <el-col :xs="19" :sm="19" :md="19" :lg="19" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">

             <el-button  type="primary" plain @click="addPlan(openCont.id,openCont.name)" size="mini" >新增计划内容</el-button>
            </div>

          <el-table border  :header-row-style="{'color':'#000000',}"
            :data="planData" style="width: 100%;" v-loading="loading" element-loading-text="数据正在加载中,请稍后..."
            element-loading-spinner="el-icon-loading" >

            <el-table-column label="培训内容" show-overflow-tooltip prop="pei_xun_nei_rong_" header-align="center"
              align="center"></el-table-column>
             <el-table-column show-overflow-tooltip header-align="center" align="center" label="培训目标" prop="pei_xun_mu_biao_"/>
             <el-table-column show-overflow-tooltip header-align="center" align="center" label="培训方式" prop="fang_shi_"/>
             <el-table-column show-overflow-tooltip header-align="center" align="center" label="考核方式" prop="kao_he_fang_shi_"/>
            <el-table-column show-overflow-tooltip header-align="center" align="center" label="培训时间" prop="ji_hua_shi_jian_">
              <template slot-scope="scope">
                    {{ scope.row.ji_hua_shi_jian_.slice(5,10)}}
                </template>
              </el-table-column>


            <el-table-column header-align="center" align="center" label="操作">

              <template slot-scope="scope">

                <el-button title="编辑" size="mini" type="primary" circle icon="el-icon-edit" @click="editData(scope.row.id_)"></el-button>
                <el-button title="删除" size="mini" type="danger" icon="el-icon-delete" circle></el-button>

              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount" layout="total, sizes, prev, pager, next, jumper"
            style="position: absolute;top: 82%;"></el-pagination>
        </el-card>

        <el-row :gutter="20" style="top: 10px;">
          <el-col :span="18">
            <el-button size="mini">下载模板</el-button>
            <el-button size="mini">上传模板</el-button>
            <el-button type="danger" size="mini">批量删除</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="top: 20px;">
          <el-col :span="20">
              <el-col :span="12">
                  <el-input size="mini" v-model="userName" placeholder="输入名称标识">
                  <template slot="prepend">编制/审核人员签字标识</template>
                  </el-input>
               </el-col>
                <el-col :span="6">
                    <el-date-picker
                          v-model="userData"
                          type="date"
                          size="mini"
                          placeholder="选择日期">
                    </el-date-picker>
                  </el-input>
               </el-col>
            </el-col>
          <el-col :span="4">
          <el-button size="mini" type="primary">提交计划</el-button>
          </el-col>
        </el-row>


      </el-col>
    </el-row>

  </div>
</template>
<script>
 import request from './trainRequest.js'

  export default {

    mixins:[request],

    data() {
      return {
        year:'',
        yearsData:[],
        userName:"",
        userData:new Date,
        selectForm:{tableName: "fzr",paramWhere:{}},
        planData:[],
        pagination: {},
        sorts: {},
        openCont: {},
        loading: false,
        processList: [],
        isFin: false,
        Desc: true,
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        imgInsVisible: false,
      }
    },
    /*  activated() {
        this.getProcessList()
      }, */
  }
</script>
<style>
 .panel .box-card {
  overflow: auto;
  min-height: 75vh;
}
</style>
