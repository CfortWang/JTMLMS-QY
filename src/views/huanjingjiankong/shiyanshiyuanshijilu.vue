<template>
  <div>
    <div class="heads">实验室温湿度压差记录</div>
    <div class="top-box">
      <span class="t-span">区域名称：</span
      ><el-input class="inp" placeholder="请输入内容" clearable> </el-input>
      <span class="t-span">日期</span
      ><el-input class="inp" placeholder="请输入内容" clearable></el-input>
      <span class="t-span">时间</span
      ><el-input class="inp" placeholder="请输入内容" clearable> </el-input>
      <el-button class="btn" type="primary">
        <i class="ibps-icon-search"></i>查询
      </el-button>
    </div>
    <el-table
      :data="tableData"
      :stripe="true"
      style="width: 100%"
      height="75vh"
      :header-cell-style="{
        color: '#000',
        'font-size': '14px',
        padding: '6px 6px',
        background: '#a7d6f8 !important',
      }"
    >
      <el-table-column prop="deviceName"  label="区域"  width="80"></el-table-column>
      <el-table-column prop="saveTime" label="日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.saveTime |fmtDate}}
        </template>
      </el-table-column>
      <el-table-column prop="t1" label="t1" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.t1 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="t2" label="t2" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.t2 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="t3" label="t3" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.t3 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="t4" label="t4" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.t4 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="t5" label="t5" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.t5 |numToFixed}}
        </template>
      </el-table-column>
        <el-table-column prop="h1" label="h1" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.h1 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="h2" label="h2" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.h2 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="h3" label="h3" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.h3 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="h4" label="h4" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.h4 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="h5" label="h5" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.h5 |numToFixed}}
        </template>
      </el-table-column>
      <el-table-column prop="p1" label="p1" width="65">
        <template slot-scope="scope">
          {{ scope.row.p1 |numToFixedP}}
        </template> </el-table-column>
      <el-table-column prop="p2" label="p2" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.p2 |numToFixedP}}
        </template>
      </el-table-column>
      <el-table-column prop="p3" label="p3" width="65">
        <template slot-scope="scope">
          {{ scope.row.p3 |numToFixedP}}
        </template>
      </el-table-column>
      <el-table-column prop="p4" label="p4" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.p4 |numToFixedP}}
        </template>
      </el-table-column>
      <el-table-column prop="p5" label="p5" width="65">
        <template slot-scope="scope">
          {{ scope.row.p5 |numToFixedP}}
        </template> </el-table-column>
      <el-table-column prop="p6" label="p6" width="65">
        <template slot-scope="scope">
          {{ scope.row.p6 |numToFixedP}}
        </template> </el-table-column>
      <el-table-column prop="p7" label="p7" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.p7 |numToFixedP}}
        </template>
      </el-table-column>
      <el-table-column prop="p8" label="p8" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.p8 |numToFixedP}}
        </template>
      </el-table-column>
      <el-table-column prop="p9" label="p9" width="65"> 
        <template slot-scope="scope">
          {{ scope.row.p9 |numToFixedP}}
        </template>
      </el-table-column>
    </el-table>
    <div>
        注： 一、各点压差、温湿度合格标准及对应房间序号名称见监控面板；  二、温湿度：AHU01的1、2、3、4对应细胞培养室1、2、3、4； AHU02的1、2对应分拣室1、2； AHU03、04的1分别对应支原体、无菌检查室；PAU02的1、2对应无菌阳性、支原体阳性室 异常情况登记及处理：

    </div>
  </div>
</template>


<script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    let sql =
      "select * FROM DATA WHERE deviceName IN ('HAU01','HAU02','HAU03','HAU04','PAU01','PAU02')  ORDER BY saveTime DESC LIMIT 20";
    this.loadData(sql);
  },
    filters: {
    numToFixed: function (value) {
      if(value>9999){
          return "??"
      }
      return value.toFixed(1);
    },    
    numToFixedP: function (value) {
     if(value>9999){
          return "??"
      }
      return value.toFixed(2);
    },
    fmtDate:function (obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      var h = date.getHours();
      var min = date.getMinutes();
      var s = date.getMinutes();
      return ( y +"-" +m.substring(m.length - 2, m.length) +"-" + d.substring(d.length - 2, d.length) +"  "+h +":" + min +":" + s);
    },
  },
  methods: {
    // 请求表格数据函数
    loadData(sql) {
      let this_ = this;
      this.listData = [];
      curdPost("sql", sql).then((res) => {
        this_.tableData = res.variables.data;
      });
    },
    // handleSizeChange() {},
    // handleCurrentChange() {},
  },
};
</script>
<style lang="scss">
.tableRowClassName {
  backface-visibility: #d9eefd;
}
.heads {
  margin-top: 5px;
  width: 100%;
  text-align: center;
  font-weight: 700;
  background-color: #f9ffff;
  width: 100%;
  font-size: 18px;
}
.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #d9eefd;
}
.more,
.item {
  cursor: pointer;
}
.more {
  color: #409eff;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
