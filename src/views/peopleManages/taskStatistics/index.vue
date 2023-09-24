<template>
  <div class="personView">
    <div class="topView"
         style="width: 100%;height: 11%;">
      <!-- <div class="jbd-title"> 人员管理看板 </div> -->
      <div class="jbd-title">
        <dv-decoration-8 style="width:20%;height:50px;position: absolute;left: 0px;top: 0px;" />
        <div style="width:100%">
          <div style="height:40%;font-size: 22px;margin-top: 10px;">人员管理看板</div>
          <dv-decoration-5 style="width:30%;height: 50%;margin: 0 auto;" />
        </div>
        <dv-decoration-8 :reverse="true"
                         style="width:20%;height:50px;position:absolute;right: 0px;top: 0px;" />
      </div>
      <div class="contain">
        <dv-decoration-11 class="personNum"
                          style="margin-left:10%"><i class="el-icon-user"
             style="color:#4ea5d6;margin-right: 3px;"></i> 员工数量：{{ employeeNum   }}人</dv-decoration-11>
        <dv-border-box-8 class="date"
                         style="margin-right:10%; display: flex; align-items: center;">
          <!-- 部门选择 -->
          <SelectPositions @handleFunc="handleFunc" />
          <div style="width:30%;display: inline-block;margin-right: 3px;">统计时间：</div>
          <el-date-picker style="width:75%;"
                          v-model="monthValues"
                          type="monthrange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始月份"
                          end-placeholder="结束月份"
                          :picker-options="pickerOptions"
                          @change="changeDate">
          </el-date-picker>
        </dv-border-box-8>
      </div>
    </div>
    <dv-border-box-1 style="width:100%;height:89%; box-sizing: border-box; overflow: hidden;">
      <div style="height:3%"></div>
      <div class="middleView">
        <div class="viewLeft">
          <pieView v-if="degreePieData.data[0].value"
                   :info="degreePieData" />
        </div>
        <dv-decoration-2 :reverse="true"
                         style="width:2%;height: 100%;" />
        <div class="viewCenter">
          <RingChart v-if="ranksPieData.data[2].value"
                     :info="ranksPieData" />
        </div>
        <dv-decoration-2 :reverse="true"
                         style="width:2%;height: 100%;" />
        <div class="viewRight">
          <CarouselTabl v-if="personInfoData.data.length"
                        :info="personInfoData"
                        title="员工基本信息列表" />
        </div>
      </div>
      <dv-decoration-10 style="height:2%;width:96%; margin: 0 auto;" />
      <div class="bottomView">
        <div class="detectionTask">
          <BarChart :info="PositionsOption"
                    :config="{title:'部门信息统计',id:'positionsId'}" />
        </div>
        <dv-decoration-2 :reverse="true"
                         style="width:2%;height: 100%;" />
        <div class="taskMatters">
          <BarChart v-if="optionPersonShow"
                    :info="optionPerson"
                    :config="{title:'任务事宜统计',id:'taskMatters'}" />
        </div>
      </div>
    </dv-border-box-1>
  </div>
</template>

<script>
import * as echarts from "echarts";
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
import pieView from "@/views/system/jbdHome/board/component/getPieView";
import CarouselTabl from "@/views/system/jbdHome/board/component/CarouselTabl";
// import { pending, handledTask } from '@/api/platform/office/bpmReceived'
// import { queryPageList } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from "@/utils/action";
import { sync } from "@/api/platform/mail/outMail";
import data from "@/components/ibps-icon-select/data";
// import ibpsTreeSelect from '@/components/ibps-tree-select'
import TreeUtils from '@/utils/tree'
import SelectPositions from "@/views/component/selectPositions";


export default {
  name: "checkBoard1",
  components: {
    pieView,
    CarouselTabl,
    SelectPositions,
    RingChart: () => import("../personComcont/RingChart"),
    BarChart: () => import("../personComcont/BarChart"),
  },
  data() {
    const { level, userId, userInfo } = this.$store.getters
    return {
      level, userId, userInfo,
      pkKey: "id", // 主键  如果主键不是pk需要传主键
      pickerOptions: {
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              const start = new Date();
              start.setDate(1);
              picker.$emit("pick", [start, new Date()]);
            },
          },
          {
            text: "今年至今",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近六个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              start.setDate(1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      monthValues: [],
      dialogTableVisible: false,
      getchart: null,
      optionPersonShow: false,
      // 任务事宜统计图配置
      optionPerson: {
        title: {
          text: "",
        },
        textAlign: "left",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          // show: true,
          right: "0%",
          itemGap: 2,
          itemWidth: 16,
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "2%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: "任务数量",
          nameTextStyle: {
            color: "#fff",
          },
          axisLabel: {
            formatter: function (v) {
              return parseInt(v); //表示整数。其他数值类型以此类推
            },
            color: "#fff",
          },
        },
        yAxis: {
          type: "category",
          name: "人员",
          data: [],
          axisLabel: {
            color: "#fff",
          },
          nameTextStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            name: "待办事宜数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
            itemStyle: {
              normal: {
                color: ["#7070ff"],
              },
            },
          },
          {
            name: "已办事宜数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
            itemStyle: {
              normal: {
                color: ["#00CC33"],
              },
            },
          }
        ],
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "filter",
          },
          {
            type: "inside",
            left: "left",
            yAxisIndex: 0,
            filterMode: "none",
          },
        ],
      },
      setParams: {},
      formData: [],
      formDataFiiter: [],
      startDate: "2023-03-01",
      endDate: "",
      chartData: [],
      pagination: { limit: 20, page: 1 },
      loading: false,
      degreePieData: {
        //学位学历
        data: [
          {
            name: "博士",
            value: 0,
          },
          {
            name: "硕士",
            value: 0,
          },
          {
            name: "本科",
            value: 0,
          },
        ],
        color: ["#FFFF00", "#99CC00", "#6666FF"],
        config: { title: "学历学位统计", idSelector: "degreeId" },
      },
      ranksPieData: {
        //职称
        data: [
          {
            name: "高级",
            value: 0,
          },
          {
            name: "中级",
            value: 0,
          },
          {
            name: "初级",
            value: 0,
          },
          {
            name: "其他",
            value: 0,
          }
        ],
        color: ["#FFFF00", "#99CC00", "#6666FF", "#FF6666"],
        config: { title: "职称统计", idSelector: "ranksid" },
      },
      // 员工基本信息图配置表
      personInfoData: {
        //员工基本信息轮播表
        // header: ["部门", "高中", "本科", "硕士", "博士", "初级职称", "中级职称", "高级职称"],
        // data: [],
        // columnWidth: ["140", "80", "80", "80", "80", "80", "80", "80"],
        header: ["姓名", "学历学位", "职称", "员工编号", "入职时间"],
        data: [],
        columnWidth: ["90", "90", "80", "120", "120"],
        rowNum: 7,
        align: "center",
        hoverPause: true,
      },
      // 部门信息统计配置表
      PositionsOption: {
        animation: true,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },

        legend: {
          textStyle: {
            color: "rgba(251, 251, 251, 1)"
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            nameTextStyle: {
              color: "rgba(251, 251, 251, 1)",

            },
            axisLabel: {
              textStyle: {
                color: "rgba(251, 251, 251, 1)"

              }
            }
          }
        ],
        yAxis: [
          {
            name: '个数（人）',
            type: 'value',
            nameTextStyle: {
              color: "rgba(251, 251, 251, 1)"
            },
            axisLabel: {
              textStyle: {
                color: "rgba(251, 251, 251, 1)"

              }
            }
          }
        ],
        // "高中", "本科", "硕士", "博士", "初级职称", "中级职称", "高级职称"
        series: [
          {
            name: '高中',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '本科',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '硕士',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '博士',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '初级职称',
            type: 'bar',
            data: [],
            emphasis: {
              focus: 'series'
            },
            markLine: {
              lineStyle: {
                type: 'dashed'
              },
              data: [[{ type: 'min' }, { type: 'max' }]]
            }
          },
          {
            name: '中级职称',
            type: 'bar',
            barWidth: 5,
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: []
          },
          {
            name: '高级职称',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      },
      employeeNum: 0,
      employeeInfo: [],
      selectData: '',
      props: {
        children: 'children',
        label: 'NAME_',
        value: 'ID_',
        multiple: true,
        expandTrigger: 'hover',
      },
      selectPositionsDatas: [],
      nodeKey: 'ID_',
      clearable: true,
      value: [],
      options: [],
      positions: [], // 用于sql条件查询
      pisitionsValue: [] // 回填给子组件的部门全值
    };
  },
  computed: {},
  methods: {
    async getTtaskMattersData() {

    },
    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
      switch (command) {
        case "search": // 查询
          const params = this.$refs["crud"]
            ? this.$refs["crud"].getSearcFormData()
            : {};
          this.formLoading();
          break;
        default:
          break;
      }
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.pagination = page;
      this.paginationFunc(this.formData);
    },
    /**
     * 数据分页
     * par:[]
     * pagination: { limit: 20, page: 1 },
     */
    paginationFunc(par) {
      this.formDataFiiter = [];
      for (
        var i =
          this.pagination.limit * this.pagination.page - this.pagination.limit;
        i < this.pagination.limit * this.pagination.page;
        i++
      ) {
        if (i < this.formData.length) {
          this.formDataFiiter.push(this.formData[i]);
        }
      }
    },
    changeDate(value) {
      let year = value[1].getFullYear();
      let month = value[1].getMonth() + 1;
      // 这里传入的是整数时间，返回的是下个月的第一天，因为月份是0-11
      let nextMonthFirthDay = new Date(year, month, 1); // 下个月的第一天
      let oneDay = 1000 * 60 * 60 * 24; // 一天的时间毫秒数
      let endDay = new Date(nextMonthFirthDay - oneDay);
      let day = endDay.getDate(); // 本月最后一天
      this.endDate =
        value[1].getFullYear() +
        "-" +
        (value[1].getMonth() + 1 > 9
          ? value[1].getMonth() + 1
          : "0" + (value[1].getMonth() + 1)) +
        "-" +
        (day > 9 ? day : "0" + day);
      this.startDate =
        value[0].getFullYear() +
        "-" +
        (value[0].getMonth() + 1 > 9
          ? value[0].getMonth() + 1
          : "0" + (value[0].getMonth() + 1)) +
        "-" +
        (value[0].getDate() > 9
          ? value[0].getDate()
          : "0" + value[0].getDate());
      this.getTtaskMattersData();
    },
    //部门基本信息 轮播表数据
    async employeeInfoData() {
      let this_ = this;
      this.personInfoData.data = [];
      let data = [];
      let personInfo = [];
      // let ranksObj = {};
      let sql = `select a.id_,a.parent_id_,b.name_,a.zui_gao_xue_li_x_,a.zhi_cheng_deng_ji,b.jian_ding_zi_ge_z,a.ru_zhi_shi_jian_ from  t_ryjbqk as a join  ibps_party_employee as b on a.parent_id_= b.id_ where a.id_ !='861622496187645952'`;
      await curdPost("sql", sql).then((res) => {
        data = res.variables.data;
      });
      this.employeeInfo = data;
      this.employeeNum = data.length;
      for (let item of data) {
        personInfo = [];
        personInfo.push(item.name_);
        personInfo.push(item.zui_gao_xue_li_x_ || `   `);
        personInfo.push(item.zhi_cheng_deng_ji || `   `);
        personInfo.push(item.jian_ding_zi_ge_z || `   `);
        personInfo.push(item.ru_zhi_shi_jian_ || `   `);
        this.personInfoData.data.push(personInfo || `   `);
      }
    },
    //饼图 环形图数据
    async degreeGradeInfoData() {
      let data = [];
      let sql = `select
                sum(a.zui_gao_xue_li_x_ = '博士') as doctor,
                sum(a.zui_gao_xue_li_x_ = '硕士') as Master,
                sum(a.zui_gao_xue_li_x_ = '本科') as undergraduate,
                sum(a.zhi_cheng_deng_ji = '初级') as elementary,
                sum(a.zhi_cheng_deng_ji = '中级') as middleRank,
                sum(a.zhi_cheng_deng_ji = '高级') as senior,
                sum(a.zhi_cheng_deng_ji = ''||a.zhi_cheng_deng_ji is null) as other
                from t_ryjbqk as a join  ibps_party_employee as b on a.parent_id_= b.id_ where b.id_ != '702117247933480960'`;
      await curdPost("sql", sql).then((res) => {
        data = res.variables.data;
      });
      this.degreePieData.data[0].value = data[0].doctor;
      this.degreePieData.data[1].value = data[0].Master;
      this.degreePieData.data[2].value = data[0].undergraduate;
      this.ranksPieData.data[0].value = data[0].senior;
      this.ranksPieData.data[1].value = data[0].middleRank;
      this.ranksPieData.data[2].value = data[0].elementary;
      this.ranksPieData.data[3].value = data[0].other;
    },
    // 部门信息统计
    positionsInfoData() {
      let sql = `select jh.*from (select  en.id_ ,en.name_ AS enName,  
            sum(gy.zui_gao_xue_li_x_ = '博士') AS doctor_,
            sum(gy.zui_gao_xue_li_x_ = '硕士') AS Master_,
            sum(gy.zui_gao_xue_li_x_ = '本科') AS undergraduate_,
            sum(gy.zui_gao_xue_li_x_ = '高中') AS senior_,
            sum(gy.zhi_cheng_deng_ji = '初级') AS elementary_,
            sum(gy.zhi_cheng_deng_ji = '中级') AS middleRank_,
            sum(gy.zhi_cheng_deng_ji = '高级') AS seniorZ_ FROM (SELECT
            ee.id_ AS eeID,ee.name_ AS eeName,ee.positions_,ry.zui_gao_xue_li_x_,ry.zhi_cheng_deng_ji
            FROM t_ryjbqk AS ry JOIN  ibps_party_employee AS ee ON ry.parent_id_= ee.id_ WHERE ee.id_ != '702117247933480960'
            )gy LEFT JOIN   ibps_party_entity en ON FIND_IN_SET(en.id_,gy.positions_)  where (${this.positions.join(' or ')}) GROUP BY enName) jh`;
      //   console.log('sql', sql)
      //   let sql = `select *from ibps_party_entity`
      curdPost("sql", sql).then((res) => {
        const data = res.variables.data;
        // 组装数据集，以学历职称为列，以部门为行:{"高中":['1','2','3']}
        let xAxisDatas = this.PositionsOption.xAxis[0].data
        let seriesDatas = this.PositionsOption.series

        if (data.length !== 0) {
          console.log('data', data)
          // 跟《部门信息统计配置表》排列顺序一致
          let shuZuList = ["senior_", "undergraduate_", "Master_", "doctor_", "elementary_", "middleRank_", "seniorZ_"]
          for (let t = 0; t < data.length; t++) {
            xAxisDatas.push(data[t].enName)
            for (let i = 0; i < seriesDatas.length; i++) {
              seriesDatas[i].data[t] = data[t][shuZuList[i]]
            }
          }
          this.PositionsOption.xAxis[0].data = xAxisDatas
          this.PositionsOption.series = seriesDatas
          console.log('this.PositionsOption.series',this.PositionsOption.series)
        }


      });

    },
    preDate(dateParameter, num) {
      //往前推算日期
      var translateDate = "",
        dateString = "",
        monthString = "",
        dayString = "";
      translateDate = dateParameter.replace("-", "/").replace("-", "/");
      var newDate = new Date(translateDate);
      newDate = newDate.valueOf();
      newDate = newDate - num * 24 * 60 * 60 * 1000; //备注 如果是往前计算日期则为减号 否则为加号
      newDate = new Date(newDate); //如果月份长度少于2，则前加 0 补位
      if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
      } else {
        monthString = (newDate.getMonth() + 1).toString();
      }
      if (newDate.getDate().toString().length == 1) {
        //如果天数长度少于2，则前加 0 补位
        dayString = 0 + "" + newDate.getDate().toString();
        0;
      } else {
        dayString = newDate.getDate().toString();
      }
      dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
      return dateString;
    },
    // 简化部门信息
    simplifyPosition(v) {
      this.positions = [] // 用于sql条件查询
      for (let i = 0; i < v.length; i++) {
        this.positions.push(`en.path_ like '%${v[i][v[i].length - 1]}%'`)
      }
    },
    transfer(oldArr) {
      const newArr = oldArr[0].map((col, i) => oldArr.map(row => row[i]));
      return newArr;
    },
    handleFunc(e) {
      this.simplifyPosition(e)
      this.positionsInfoData()
    },
    /**
        * 使用match方法实现模糊查询
        * @param  {Array}  list     进行查询的数组
        * @param  {String} keyWord  查询的关键词
        * @return {Array}           查询的结果
        */
    fuzzyQuery(list, keyWord) {
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].match(keyWord) != null) {
          arr.push(list[i]);
        }
      }
      return arr.length == o ? false : true;
    }

  },
  created() {
    const initendDate = new Date();
    this.endDate =
      initendDate.getFullYear() +
      "-" +
      (initendDate.getMonth() + 1 > 9
        ? initendDate.getMonth() + 1
        : "0" + (initendDate.getMonth() + 1)) +
      "-" +
      (initendDate.getDate() > 9
        ? initendDate.getDate()
        : "0" + initendDate.getDate());
    this.startDate = this.preDate(this.endDate, 60);
    this.monthValues = [
      new Date(this.startDate),
      new Date(
        initendDate.getFullYear() +
        "-" +
        (initendDate.getMonth() + 1) +
        "-" +
        initendDate.getDate()
      ),
    ];

    this.employeeInfoData();
    this.degreeGradeInfoData();
    this.getTtaskMattersData();

  },
  mounted() {
    // this.initData()
    // this.positionsInfoData()

    // this.initChart();
  },
};
</script>
  <style lang="less" scoped>
.personView {
  width: 100%;
  height: calc(100vh - 100px);
  background-image: url("~@/assets/images/screen/bg.png");
  z-index: -1;
}
.topView {
  overflow: hidden;
  box-sizing: border-box;
  .jbd-title {
    text-align: center;
    font-weight: bold;
    // background-color: rgb(249, 255, 255);
    width: 100%;
    color: white;
    font-size: 18px;
    height: 50%;
  }
  .contain {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-between;
    border-left: 1px solid #dfdcdc;
    color: white;
    .personNum {
      margin-left: 20px;
      width: 250px;
    }
    .date {
      text-align: right;
      // padding-right: 20px;
      display: flex;
      width: 700px;
      height: 80%;
    }
    /deep/.dv-border-box-8 .border-box-content {
      display: flex;
      align-items: center;
      padding: 0px 2px;
    }
  }
}

.middleView {
  height: 36%;
  width: 96%;
  margin: 0 auto;
  display: flex;
  justify-content: left;
  overflow: hidden;
  box-sizing: border-box;
  .viewLeft {
    width: 28%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .viewCenter {
    width: 28%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .viewRight {
    width: 40%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
}
.bottomView {
  width: 96%;
  margin: 0 auto;
  height: 56%;

  //   background: red;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  .dialogbox {
    display: flex;
    flex-direction: column;
  }
  .detectionTask {
    width: 49%;
    height: 100%;
  }
  .taskMatters {
    width: 49%;
    height: 100%;
  }
  .ibps {
    top: 55px;
    border: 1px solid rgb(241, 238, 238);
  }
  // /deep/ .el-dialog {
  //   height: 80%;
  //   width: 80%;
  // }

  // /deep/ .el-dialog__header {
  //   border: 0;
  // }

  // /deep/ .el-pagination__rightwrapper1 {
  //   display: none;
  // }

  // /deep/ .ibps-container-crud__header {
  //   margin-top: 55px;
  // }

  // /deep/ .el-dialog__headerbtn {
  //   z-index: 9999;
  // }
}
</style>
