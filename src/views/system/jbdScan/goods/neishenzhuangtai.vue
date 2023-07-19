<template>
  <div class="bg">
    <el-dialog
      width="70vw"
      height="50vh"
      :modal-append-to-body="false"
      title="内审进度查询"
      :visible.sync="scanVisible"
    >
      <!-- 表单是否显示 -->
      <div style="height: 75vh; width: 98%">
        <div id="box">
          <div class="overall">
            <!-- 步骤条盒子 -->
            <div class="steps-box">
              <!-- 步骤条 -->
              <div class="Article-steps">
                <!-- 步骤条背景进度条 -->
                <div class="line">
                  <span
                    class="plan"
                    :style="`width:${activeIndex * (100 / (stepList.length - 1)) -100 / (stepList.length - 1) / 2}%`"
                  ></span>
                </div>
                <!-- 每步部分底部文字描述 -->
                <span
                  class="step"
                  v-for="(i, index) in stepList"
                  :key="index"
                  :class="(i.stepIndex < activeIndex || activeIndex == 100? 'step-active': (i.stepIndex == activeIndex ? 'current-active':''))"
                >
                  <span class="step-num">
                    <i class="el-icon-caret-right icon" v-if="index != 0"></i>
                    <p cla>{{ i.title }}</p>
                  </span>
                  <p class="post">{{i.post}}</p>
                </span>
                <!-- <span></span> -->
              </div>
              <!-- 步骤条对应内容 -->
              <div class="Article-content"></div>
            </div>
          </div>
          <div style="width: 90%; margin: 50px auto 0px">
            <div class="main">
              <div class="wheel-title">内审核查完成率</div>
              <div id="main"></div>
            </div>
          </div>

          <div v-if="CNASTableData.length > 0">
            <div class="cnas">
              <div style="width: 90%; margin: 0 auto; line-height: 35px">
                内审不符合项汇总表(CNAS)
              </div>
              <el-table :data="CNASTableData" border style="width: 90%; margin: 0 auto">
                <el-table-column
                  prop="bu_fu_he_xiang_mi"
                  label="不符合项描述"
                  width="300"
                >
                </el-table-column>
                <el-table-column
                  prop="ping_shen_yi_ju_"
                  label="评审依据"
                  width="200"
                >
                </el-table-column>
                <el-table-column
                  prop="tiao_kuan_bian_ha"
                  label="条款编号"
                  width="70"
                >
                </el-table-column>
                <el-table-column
                  prop="nei_shen_yuan_"
                  label="内审员"
                  width="60"
                >
                  <template slot-scope="scope">
                    {{ scope.row.nei_shen_yuan_ | emfiltes(employeeList) }}
                  </template>
                </el-table-column>
                <el-table-column prop="ze_ren_shi_" label="责任室" width="100">
                  <template slot-scope="scope">
                    {{ scope.row.ze_ren_shi_ | partFilter(partList) }}
                  </template>
                </el-table-column>
                <el-table-column prop="fu_ze_ren_" label="负责人" width="60">
                  <template slot-scope="scope">
                    {{ scope.row.fu_ze_ren_ | emfiltes(employeeList) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="bu_fu_he_cheng_du"
                  label="不符合程度"
                  width="80"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="table-echarts">
              <div class="in-echarts">
                <div>不符合项条款统计</div>
                <div id="in-echarts"></div>
              </div>
              <div class="department">
                <div>不符合项部门统计</div>
                <div id="department"></div>
              </div>
            </div>
          </div>
          <div v-if="CMAtable.length > 0">
            <div class="cma">
              <div style="width: 90%; margin: 0 auto; line-height: 35px">
                内审不符合项汇总表(CMA)
              </div>
              <el-table
                :data="CMAtable"
                border
                style="width: 90%; margin: 0 auto"
              >
                <el-table-column
                  prop="bu_fu_he_xiang_mi"
                  label="不符合项描述"
                  width="300"
                >
                </el-table-column>
                <el-table-column
                  prop="ping_shen_yi_ju_"
                  label="评审依据"
                  width="200"
                >
                </el-table-column>
                <el-table-column
                  prop="tiao_kuan_bian_ha"
                  label="条款编号"
                  width="70"
                >
                </el-table-column>
                <el-table-column
                  prop="nei_shen_yuan_"
                  label="内审员"
                  width="60"
                >
                  <template slot-scope="scope"
                    >{{ scope.row.nei_shen_yuan_ | emfiltes(employeeList) }}
                  </template>
                </el-table-column>
                <el-table-column prop="ze_ren_shi_" label="责任室" width="100">
                  <template slot-scope="scope">
                    {{ scope.row.ze_ren_shi_ | partFilter(partList) }}
                  </template>
                </el-table-column>
                <el-table-column prop="fu_ze_ren_" label="负责人" width="60">
                  <template slot-scope="scope"
                    >{{ scope.row.fu_ze_ren_ | emfiltes(employeeList) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="bu_fu_he_cheng_du"
                  label="不符合程度"
                  width="80"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="table-echarts">
              <div class="in-echarts">
                <div>CMA不符合项条款统计</div>
                <div id="in-CMAecharts"></div>
              </div>
              <div class="department">
                <div>CMA不符合项部门统计</div>
                <div id="cma-department"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="CNASTableData.length == 0 && CMAtable.length == 0"
          class="nodata"
        >
          暂无不符合项统计，请等待本次内审结束后统计
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
export default {
  components: {},
  props: {
    obj: {
      default: [],
      type: Array,
    },
    scanVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: "",
      id: "",
      visible: true,
      jieduanValue: 0,
      //当前位置
      activeIndex: 1,
      //步骤条步数
      stepList: [
        {
          stepIndex: 11,
          title: "内审计划编制",
          post:'质量负责人'
        },
        {
          stepIndex: 22,
          title: "实施计划编制",
          post:'内审组长'
        },
        {
          stepIndex: 33,
          title: "检查表编制",
          post:'内审员'
        },
        {
          stepIndex: 44,
          title: "首次会议",
          post:'内审组长'
        },
        {
          stepIndex: 55,
          title: "内部审核",
          post:'内审员'
        },
        {
          stepIndex: 66,
          title: "末次会议",
          post:'内审组长'
        },
        {
          stepIndex: 78,
          title: "不符合项整改",
          post:'内审员/部门负责人'
        },
        {
          stepIndex: 90,
          title: "内审报告",
          post:'内审组长'
        },
        {
          stepIndex: 100,
          title: "内审结束",
          post:''
        },
      ],
      CNASTableData: [], //cnas
      CMAtable: [], //CMA
      source: [], //CNAS
      cmaSuorce: [],
      cnasPieData: [], //cnas饼图
      cmaPieData: [], //cma饼图
      employeeList: [],
      partList: [],
      loading: true,
      // scanVisible:false,
    };
  },
  filters: {
    emfiltes: function (value, arr) {
      for (let i = 0; i < arr.length; i++) {
      if(value.includes(",")){
        let part = "";
        let parts = []
        parts = value.split(',');
        for(let item of arr){
          for(let j = 0; j < parts.length; j++) {
            if(item.ID_ == parts[j]){
              part = part +","+ item.NAME_;
            }
          }
        }
        return part.slice(1,part.length);
      }else if (arr[i].ID_ == value) {
          return arr[i].NAME_;
        }
      }
    },
    partFilter: function (value, arr) {
      return value
      // if(value.includes(",")){
      //   let part = "";
      //   let parts = []
      //   parts = value.split(',');
      //   for(let item of arr){
      //     for(let j = 0; j < parts.length; j++) {
      //       if(item.ID_ == parts[j]){
      //         part = part +","+ item.NAME_;
      //       }
      //     }
      //   }
      //   return part.slice(1,part.length)
      // }else{  
      // for (let i = 0; i < arr.length; i++) {
      //   console.log(arr[i])
      //   if (arr[i].ID_ == value) {
      //     return arr[i].NAME_;
      //   }else{
      //     return value
      //   }
      // }
      // }
    },
  },
  watch: {
    obj() {
      this.getInit();
      this.getLoadEcharts();
    },
  },
  created() {
    this.getInit();
    this.getEmployee();
    this.getPart();
  },
  mounted() {
    let this_ = this;
    this.$nextTick(() => {
      this_.getLoadEcharts();
    });
  },
  methods: {
    //仪表盘
    getLoadEcharts() {
      var chartDom = document.getElementById("main");
      const setEchartWH = {
        //设置控制图表大小变量
        width: 400,
        height: 300,
      };

      var myChart = echarts.init(chartDom, null, setEchartWH);
      var option;
      let this_ = this;
      option = {
        series: [
          {
            type: "gauge",
            min: 0,
            max: 80,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, "#fd666d"],
                  [0.7, "#37a2da"],
                  [1, "#67e0e3"],
                ],
              },
            },
            pointer: {
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: "#fff",
                width: 2,
              },
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: "#fff",
                width: 4,
              },
            },
            axisLabel: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              formatter: "{value} %",
              color: "auto",
              top: "100%",
            },
            data: [{ value: 100, top: "100%" }],
          },
        ],
      };
      setInterval(function () {
        myChart.setOption({
          series: [
            {
              data: [
                {
                  value: this_.jieduanValue,
                },
              ],
            },
          ],
        });
      }, 2000);

      option && myChart.setOption(option);
    },

    //cnas指定数据到坐标轴的映射
    getLoadEchartsTwo() {
      var chartDom = document.getElementById("in-echarts");
      const setEchartWH = {
        //设置控制图表大小变量
        width: 400,
        height: 300,
      };

      var myChart = echarts.init(chartDom, null, setEchartWH);
      var option;

      option = {
        dataset: {
          source: this.source,
        },
        grid: { containLabel: true },
        xAxis: {
          name: "不符合项",
          interval: 1,
          nameGap: 0,
          nameRotate: 0,
          nameTextStyle: {
            fontSize: 10,
          },
        },
        yAxis: { name: "条款编号",type: "category" },
        visualMap: {
          orient: "horizontal",
          left: "center",
          show: false,
          min: 10,
          max: 100,
          // text: ["High Score", "Low Score"],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ["#65B581", "#FFCE34", "#FD665F"],
          },
        },

        series: [
          {
            type: "bar",
            encode: {
              // Map the "amount" column to X axis.
              x: "amount",
              // Map the "product" column to Y axis
              y: "product",
            },
            barWidth: 30,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //cma指定数据到坐标轴的映射
    getLoadCmaEchartsX() {
      var chartDom = document.getElementById("in-CMAecharts");
      const setEchartWH = {
        //设置控制图表大小变量
        width: 400,
        height: 300,
      };

      var myChart = echarts.init(chartDom, null, setEchartWH);
      var option;

      option = {
        dataset: {
          source: this.cmaSuorce,
        },
        grid: { containLabel: true },
        xAxis: {
          name: "不符合项",
          interval: 1,
          nameGap: 0,
          nameRotate: 0,
          nameTextStyle: {
            fontSize: 10,
          },
        },
        yAxis: { type: "category" },
        visualMap: {
          orient: "horizontal",
          left: "center",
          show: false,
          min: 10,
          max: 100,
          // text: ["High Score", "Low Score"],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ["#65B581", "#FFCE34", "#FD665F"],
          },
        },
        series: [
          {
            type: "bar",
            encode: {
              // Map the "amount" column to X axis.
              x: "amount",
              // Map the "product" column to Y axis
              y: "product",
            },
            barWidth: 30,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //cnas部门饼图
    getLoadEchartsthree() {
      var chartDom = document.getElementById("department");
      const setEchartWH = {
        //设置控制图表大小变量
        width: 400,
        height: 300,
      };
      var myChart = echarts.init(chartDom, null, setEchartWH);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: this.cnasPieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //cma部门饼图
    getLoadCmaEcharts() {
      var chartDom = document.getElementById("cma-department");
      const setEchartWH = {
        //设置控制图表大小变量
        width: 400,
        height: 300,
      };

      var myChart = echarts.init(chartDom, null, setEchartWH);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: this.cmaPieData, //[{1:2,3:4}]
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //人员
    async getEmployee() {
      let this_ = this;
      let sql = "select ID_,NAME_,CREATE_TIME_ FROM ibps_party_employee ";
      await curdPost("sql", sql).then((res) => {
        this_.employeeList = res.variables.data;
      });
    },
    async getPart() {
      let this_ = this;
      let sql = "select ID_,NAME_,CREATE_TIME_ FROM ibps_party_org";
      await curdPost("sql", sql).then((res) => {
        this_.partList = res.variables.data;
      });
    },
    jieduan(value) {
      if (value.includes("1")) {
        return 11;
      } else if (value.includes("2")) {
        return 22;
      } else if (value.includes("3")) {
        return 33;
      } else if (value.includes("4")) {
        return 44;
      } else if (value.includes("5")) {
        return 55;
      } else if (value.includes("6")) {
        return 66;
      } else if (value.includes("7")) {
        return 78;
      } else if (value.includes("8")) {
        return 90;
      }else if (value.includes("9")) {
        return 100;
      }
    },
    //不符合项条款统计数据
    getNoData(arr, type, callBlack) {
      let firstArr = [];
      let secondArr = [];
      arr.forEach((it) => {
        if (firstArr.length == 0) {
          secondArr.push("score");
          secondArr.push("不符合项");
          secondArr.push("product");
          firstArr.push(secondArr);
          secondArr = [];
          secondArr.push(1);
          secondArr.push(1);
          secondArr.push(it.tiao_kuan_bian_ha);
          firstArr.push(secondArr);
          secondArr = [];
        } else {
          for (var i in firstArr) {
            let a = firstArr[i][2];
            let b = it.tiao_kuan_bian_ha;
            if (firstArr[i][2] == it.tiao_kuan_bian_ha) {
              firstArr[i][0] = firstArr[i][0] + 1;
              firstArr[i][1] = firstArr[i][1] + 1;
              break;
            } else if (i == firstArr.length - 1) {
              secondArr.push(1);
              secondArr.push(1);
              secondArr.push(it.tiao_kuan_bian_ha);
              firstArr.push(secondArr);
              secondArr = [];
              break;
            }
          }
        }
      });

      type == "CMA" ? (this.cmaSuorce = firstArr) : (this.source = firstArr);
      callBlack();
    },
    //饼图数据
    async getPieData(arr, type, callBlack) {
      let arrr = arr;
      let newarr = [];
      let obj = {};
      let str =""
      let sql = "select ID_,NAME_ FROM  ibps_party_org";
      await curdPost("sql", sql).then((res) => {
        let arr1 = res.variables.data;
        arr.forEach((item, index) => {
          str =""
          arr1.forEach((it) => {
            if (item.ze_ren_shi_ == it.ID_ && !item.ze_ren_shi_.includes(",")) {
              arr[index].ze_ren_shi_ = it.NAME_;
            }
            if(item.ze_ren_shi_.includes(",")&& item.ze_ren_shi_.includes(it.ID_)){
              str += "," + it.NAME_
            }
          });
          if(str){
            arr[index].ze_ren_shi_ = str.slice(1,str.length);
          }
        });
      });
      let map = new Map();
      for (let item of arr) {
        if (!map.has(item.ze_ren_shi_)) {
          map.set(item.ze_ren_shi_, item);
        }
      }
      arr = [...map.values()];
      arr.forEach((item, index) => {
        let add = 0;
        for (var i = 0; i < arrr.length; i++) {
          if (item.ze_ren_shi_ == arrr[i].ze_ren_shi_) {
            add++;
          }
        }
        obj.value = add;
        obj.name = item.ze_ren_shi_;
        newarr.push(obj);
        obj = {};
        this.loading = false;
      });
      type == "CMA" ? (this.cmaPieData = newarr) : (this.cnasPieData = newarr);
      callBlack();
    },
    getInit() {
      let data = this.obj[0];
      console.log(data)
      let jieduanvalue;
      if (data.shi_fou_guo_shen_ == "已编制" && data.jie_dian_ren_wu_ == "") {
        jieduanvalue = "2";
      } else if (data.shi_fou_guo_shen_ == "1" && data.jie_dian_ren_wu_ == "") {
        jieduanvalue = "3";
      }else if(!data.shi_fou_guo_shen_){
        jieduanvalue = "2";
      }
       else {
        jieduanvalue = data.jie_dian_ren_wu_;
      }
      this.activeIndex = this.jieduan(jieduanvalue);
      this.jieduanValue = this.activeIndex;
      this.gettable(data.ji_hua_zong_wai_j);
    },
    async gettable(id) {
      let this_ = this;
      this_.CNASTableData = [];
      this_.CMAtable = [];
      let sql ="select * FROM t_nsbfhxjlhzb WHERE wai_jian_ =(SELECT id_  FROM t_nshyjyb WHERE ji_hua_zong_wai_j ='" +id +"' ORDER BY create_time_ DESC LIMIT 1)";
      await curdPost("sql", sql).then((res) => {
        let data = res.variables.data;
        data.forEach((item) => {
          if (item.shen_he_lei_xing_.includes("CMA")) {
            this_.CMAtable.push(item);
          } else {
            this_.CNASTableData.push(item);
          }
        });
        this_.$nextTick(() => {
          if (this_.CNASTableData.length > 0) {
            this_.getNoData(this_.CNASTableData,"CNAS",this_.getLoadEchartsTwo);
            this_.getPieData(this_.CNASTableData,"CNAS",this_.getLoadEchartsthree);
          }
          if (this_.CMAtable.length > 0) {
            this_.getNoData(this_.CMAtable, "CMA", this_.getLoadCmaEchartsX);
            this_.getPieData(this_.CMAtable, "CMA", this_.getLoadCmaEcharts);
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.bg {
  .main {
    width: 400px;
    height: 300px;
    position: relative;
    top: 16px;
    margin: 0 auto;
    .wheel-title {
      position: absolute;
      top: 60px;
      left: -8px;
      top: 86%;
      left: calc(90% - 205px);
      // color: #000;
      // font-weight: bold;
    }
  }
  .nodata {
    width: 90%;
    margin: 20px auto;
    font-size: 16px;
    text-align: center;
  }
  #main {
    width: 100%;
    height: 100%;
  }
  .steps-box {
    user-select: none;
    width: 90%;
    height: 2px;
    position: relative;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    // <!-- 步骤条背景进度条 -->
    .line {
      display: block;
      margin: 0 auto;
      position: absolute;
      top: 27px;
      left: 5%;
      background: #67c23a;
      width: 95%;
      height: 2px;
      overflow: hidden;
      .plan {
        position: absolute;
        top: 0;
        left: 0;
        height: 2px;
        transition: 0.5s;
        background: #37a2da;
      }
    }
    .Article-steps {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .step {
        .title {
          font-size: 17px;
          font-weight: bold;
          color: #808080;
        }
        .step-num {
          position: absolute;
          width: 58px;
          height: 58px;
          display: inline-block;
          line-height: 50px;
          background: #808080;
          // clip-path: polygon(50% 0, 100% 85%, 0 85%);
          color: white;
          font-weight: bold;
          z-index: 999;
          border-radius: 50%;
          text-align: center;
          // transition: 0.5s;
          font-size: 10px;
          display: flex;
          align-items: center;
          .icon {
            position: absolute;
            left: -12px;
            color: #8ab;
            font-size: 16px;
            font-weight: bold;
            top: 35%;
          }
          p {
            line-height: 20px;
            width: 40px;
            overflow: hidden;
            line-height: 18px;
            white-space: normal;
            margin: 0 auto;
            text-align: center;
          }
          .num {
            transition: 0.5s;
            display: inline-block;
          }
        }
        .post{
          text-align: center;
          font-size: 12px;
          margin-top: 5px;
          position: absolute;
          top: 60px;
          color: #2d7df5;
          width: 60px;
          overflow: hidden;
        }
      }
    }

    // //当前所在位置样式
    .current-active 
    {
      .step-num {
        background: #2d7df5 !important;
      }
      .title {
        color: #2d7df5 !important;
      }
    }
    .step-active 
    {
      .step-num {
        background: #00CC00 !important;
      }
      .title {
        color: #2d7df5 !important;
      }
    }
    .Article-content {
      padding: 20px;
      .btn {
        width: 150px;
        display: block;
        margin: 0 auto;
        margin-bottom: 10px;
        background: #2d7df5;
        color: white;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
      }
      .content {
        padding: 20px;
      }
    }
  }
  .cnas {
    margin: 0 auto;
  }
  .cma {
    margin: 10px auto;
  }
  .table-echarts {
    width: 90%;
    margin: 10px auto 0px;
  }
  .table-echarts {
    width: 90%;
    display: flex;
    justify-content: space-between;
    .in-echarts {
      width: 400px;
      height: 300px;
    }
    #in-echarts {
      width: 100%;
      height: 100%;
    }
    .department {
      width: 400px;
      height: 300px;
    }
    #department {
      width: 400px;
      height: 300px;
    }
  }
}
</style>
