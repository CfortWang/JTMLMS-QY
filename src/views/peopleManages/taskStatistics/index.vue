<template>
  <div class="personView">
    <div class="topView" style="width: 100%;height: 11%;">
      <!-- <div class="jbd-title"> 人员管理看板 </div> -->
      <div class="jbd-title">
        <dv-decoration-8 style="width:20%;height:50px;position: absolute;left: 0px;top: 0px;" />
        <div style="width:100%">
          <div style="height:40%;font-size: 22px;margin-top: 10px;">人员管理看板</div>
          <dv-decoration-5 style="width:30%;height: 50%;margin: 0 auto;" />
        </div>
        <dv-decoration-8 :reverse="true" style="width:20%;height:50px;position:absolute;right: 0px;top: 0px;" />
      </div>
      <!-- <dv-decoration-7 class="jbd-title">人员管理看板</dv-decoration-7> -->

      <div class="contain">
        <!-- <div class="personNum">员工数量:{{ employeeNum }}</div> -->
        <dv-decoration-11  class="personNum" style="margin-left:10%"><i class="el-icon-user" style="color:#4ea5d6;margin-right: 3px;"></i> 员工数量:{{ employeeNum   }}人</dv-decoration-11>
        <dv-border-box-8 class="date" style="margin-right:10%; display: flex; align-items: center;">
          <div style="width:25%;display: inline-block;margin-right: 3px;">统计时间:</div>
          <el-date-picker style="width:75%;" v-model="monthValues" type="monthrange" align="right" unlink-panels range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" :picker-options="pickerOptions" @change="changeDate">
          </el-date-picker>
        </dv-border-box-8>
        <!-- <dv-border-box-9 >员工数量:8</dv-border-box-9> -->
        <!-- <div class="date">
          统计时间:
          <el-date-picker v-model="monthValues" type="monthrange" align="right" unlink-panels range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" :picker-options="pickerOptions" @change="changeDate">
          </el-date-picker>
        </div> -->
      </div>
    </div>
    <dv-border-box-1 style="width:100%;height:89%; box-sizing: border-box; overflow: hidden;">
      <div style="height:3%"></div>
      <!-- <dv-decoration-10 style="height:2%;width:100%;" /> -->
      <div class="middleView">
        <div class="viewLeft">
          <pieView v-if="degreePieData.data[0].value" :info="degreePieData" />
        </div>
        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
        <div class="viewCenter">
          <RingChart v-if="ranksPieData.data[2].value" :info="ranksPieData" />
        </div>
        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
        <div class="viewRight">
          <CarouselTabl v-if="personInfoData.data.length" :info="personInfoData" title="员工基本信息列表" />
        </div>
      </div>
      <dv-decoration-10 style="height:2%;width:96%; margin: 0 auto;" />
      <div class="bottomView">
        <div class="detectionTask">
          <!-- <div id="echart-line" :style="{ width: '100%', height: '100%', paddingRight: '10px' }"></div> -->
          <BarChart v-if="this.option.yAxis.data[0]" :info="option" :config="{title:'检测任务统计',id:'textJob'}" />
        </div>
        <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
        <div class="taskMatters">
          <BarChart v-if="optionPersonShow" :info="optionPerson" :config="{title:'任务事宜统计',id:'taskMatters'}" />
        </div>
        <!-- <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" /> -->
        <!-- <el-dialog :visible.sync="dialogTableVisible">
        <div class="dialogbox">
          <div class="jbd-title-cont"> {{ setParams.seriesName }}-{{ setParams.name }} </div>
          <div class="ibps">
            <ibps-crud key="istree" ref="crud" :data="formDataFiiter" :toolbars="listConfig.toolbars" :search-form="listConfig.searchForm" :pk-key="pkKey" :columns="listConfig.columns" :loading="loading" @action-event="handleAction" :pagination="pagination" @pagination-change="handlePaginationChange">
              <template slot="jianceyuan" slot-scope="scope">
                <ibps-user-selector :value="scope.row.jian_ce_yuan_" type="user" :multiple="true" :disabled="true" readonly-text="text" @callback="data => formId = data.id" />
              </template>
              <template slot="fuheyuan" slot-scope="scope">
                <ibps-user-selector :value="scope.row.fu_he_yuan_" type="user" :multiple="true" :disabled="true" readonly-text="text" @callback="data => formId = data.id" />
              </template>
            </ibps-crud>
          </div>
        </div>
      </el-dialog> -->
      </div>
    </dv-border-box-1>
  </div>
</template>

<script>
import * as echarts from "echarts";
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
import IbpsUserSelector from "@/business/platform/org/selector";
import pieView from "@/views/system/jbdHome/board/component/getPieView";
import CarouselTabl from "@/views/system/jbdHome/board/component/CarouselTabl";
// import { pending, handledTask } from '@/api/platform/office/bpmReceived'
// import { queryPageList } from '@/api/platform/bpmn/bpmTask'
import ActionUtils from "@/utils/action";
import { sync } from "@/api/platform/mail/outMail";
import data from "@/components/ibps-icon-select/data";
export default {
  name: "checkBoard1",
  components: {
    "ibps-user-selector": IbpsUserSelector,
    pieView,
    CarouselTabl,
    RingChart: () => import("../personComcont/RingChart"),
    BarChart: () => import("../personComcont/BarChart"),
  },
  props: {},
  data() {
    return {
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
      option: {
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
          name: "检测人员",
          data: [],
          color: "#ffffff",
          axisLabel: {
            color: "#fff",
          },
          nameTextStyle: {
            color: "#fff",
          },
        },
        series: [
          {
            name: "检测未完成数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
              color: "#ffff00",
            },
            itemStyle: {
              normal: {
                color: ["#CC0000"],
              },
            },
          },
          {
            name: "检测已完成数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
            itemStyle: {
              normal: {
                color: ["#99cc00"],
              },
            },
          },
          {
            name: "复核未完成数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
            itemStyle: {
              normal: {
                color: ["#FFFF00"],
              },
            },
          },
          {
            name: "复核已完成数",
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
      optionPersonShow: false,
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
          },
          {
            name: "逾期未完成数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
            itemStyle: {
              normal: {
                color: ["#faff72"],
              },
            },
          },
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
      listConfig: {
        // 工具栏
        toolbars: [{ key: "search" }],
        // 查询条件
        searchForm: {
          forms: [
            { prop: "yang_pin_bian_hao", label: "样品编号" },
            { prop: "yang_pin_ming_che", label: "样品名称" },
            { prop: "yang_pin_lei_xing", label: "样品类型" },
            { prop: "shi_fou_he_ge_", label: "是否合格" },
          ],
        },
        // 表格字段配置
        columns: [
          { prop: "wei_tuo_lei_xing_", label: "委托类型" },
          { prop: "jian_ce_zhuang_ta", label: "检测状态" },
          { prop: "yang_pin_lei_xing", label: "样品类型" },
          { prop: "yang_pin_bian_hao", label: "样品编号" },
          { prop: "yang_pin_ming_che", label: "样品名称" },
          { prop: "ji_lu_bian_hao_", label: "记录编号" },
          { prop: "shi_fou_he_ge_", label: "是否合格" },
          { prop: "jian_ce_yuan_", label: "检测员", slotName: "jianceyuan" },
          { prop: "fu_he_yuan_", label: "复核员", slotName: "fuheyuan" },
        ],
      },
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
      personInfoData: {
        //员工基本信息轮播表
        header: ["姓名", "学历学位", "职称", "员工编号", "入职时间"],
        data: [],
        columnWidth: ["90", "90","80", "120","120"],
        rowNum: 7,
        align: "center",
        hoverPause: true,
      },
      employeeNum: 0,
      employeeInfo: [],
    };
  },
  computed: {},
  methods: {
    async getTtaskMattersData() {
      let this_ = this;
      this.optionPersonShow = false;
      this_.optionPerson.yAxis.data = [];
      this_.optionPerson.series[0].data = [];
      this_.optionPerson.series[1].data = [];
      let create_by_ = "";
      let data = [];
      let csData = [];
      let yibanData1 = [];
      let yibanData2 = [];
      let personIds = "";
      for (let item of this.employeeInfo) {
        create_by_ += create_by_ + "," + item.id_;
      }
      create_by_ = create_by_.slice(0, create_by_.length - 1);
      let sql = `select  executor_,count(executor_) as num ,c.name_ FROM  IBPS_BPM_TASKS as a join IBPS_BPM_TASK_ASSIGN as b  on a.task_id_ = b.task_id_ join ibps_party_employee as c on b.executor_ = c.id_ and  c.STATUS_= 'actived' and c.ID_ != '1' and c.ID_ != '-1' and c.ID_ != '702117247933480960' and c.GROUP_ID_ not like '%1041786072788369408%'   GROUP BY  executor_ order by c.CREATE_TIME_ asc `;
      await curdPost("sql", sql).then((res) => {
        data = res.variables.data;
      });
      for (let item of data) {
        this_.optionPerson.yAxis.data.push(item.name_);
        this_.optionPerson.series[0].data.push(item.num);
      }
      //超时
      let cssql = `select  executor_ ,count(executor_) as num ,c.name_,a.create_time_ FROM  IBPS_BPM_TASKS as a join IBPS_BPM_TASK_ASSIGN as b  on a.task_id_ = b.task_id_ join ibps_party_employee as c on b.executor_ = c.id_
                  where now()> SUBDATE(a.create_time_,interval - 3 day) and  c.STATUS_= 'actived' and c.ID_ != '1' and c.ID_ != '-1' and c.ID_ != '702117247933480960' and c.GROUP_ID_ not like '%1041786072788369408%'  GROUP BY  executor_  order by  c.CREATE_TIME_ asc `;
      await curdPost("sql", cssql).then((res) => {
        csData = res.variables.data;
      });
      for (let it of csData) {
        this_.optionPerson.series[2].data.push(it.num);
        personIds += "'" + it.executor_ + "',";
      }
      personIds = personIds.slice(0, personIds.length - 1);
      let yibansql1 = `select count(AUDITOR_) as num,AUDITOR_,name_,STATUS_,CREATE_TIME_ from (select a.AUDITOR_,b.name_,a.STATUS_,b.CREATE_TIME_ from IBPS_BPM_APPROVAL as a join ibps_party_employee as b on a.AUDITOR_ = b.id_
                      where  a.CREATE_TIME_ > '${this.startDate}' and a.CREATE_TIME_ < '${this.endDate}' and b.id_ in(${personIds})   group by a.PROC_inst_ID_) as zz  group by AUDITOR_  order by  CREATE_TIME_ asc `;
      await curdPost("sql", yibansql1).then((res) => {
        yibanData1 = res.variables.data;
      });
      let yibansql2 = `select count(AUDITOR_) as num,AUDITOR_,name_,STATUS_,CREATE_TIME_ from (select a.PROC_inst_ID_,b.name_,a.AUDITOR_,a.STATUS_,b.CREATE_TIME_ from IBPS_BPM_APPROVAL_HIS as a join ibps_party_employee as b on a.AUDITOR_ = b.id_
                        where  a.CREATE_TIME_ > '${this.startDate}' and  a.CREATE_TIME_ < '${this.endDate}' and b.id_ in(${personIds})  group by a.PROC_inst_ID_) as bb  group by AUDITOR_ order by  CREATE_TIME_ asc `;
      await curdPost("sql", yibansql2).then((res) => {
        yibanData2 = res.variables.data;
      });

      for (let items of yibanData1) {
        for (let el of yibanData2) {
          if (items.AUDITOR_ == el.AUDITOR_) {
            this_.optionPerson.series[1].data.push(
              Number(items.num) + Number(el.num)
            );
          }
        }
      }
      this.optionPersonShow = true;
    },
    // initChart() {
    //   this.getchart = echarts.init(document.getElementById("echart-line"));
    //   // document.getElementById("echart-line").setAttribute("_echarts_instance_", "");
    //   this.getchart.setOption(this.option);
    //   // //随着屏幕大小调节图表
    //   // window.addEventListener("resize", () => {
    //   //   this.getchart.resize();
    //   // });
    //   // this.getchart.on("click", (params) => {
    //   //   this.pagination = { limit: 20, page: 1 };
    //   //   this.dialogTableVisible = true;
    //   //   this.setParams["dataIndex"] = params.dataIndex;
    //   //   this.setParams["name"] = params.name;
    //   //   switch (params.seriesName) {
    //   //     case "检测未完成数":
    //   //       this.setParams["seriesName"] = "未完成检测项目情况";
    //   //       break;
    //   //     case "检测已完成数":
    //   //       this.setParams["seriesName"] = "已完成检测项目情况";
    //   //       break;
    //   //     case "复核未完成数":
    //   //       this.setParams["seriesName"] = "未完成复核项目情况";
    //   //       break;
    //   //     case "复核已完成数":
    //   //       this.setParams["seriesName"] = "已完成复核项目情况";
    //   //       break;
    //   //     default:
    //   //       break;
    //   //   }
    //   //   this.formLoading();
    //   // });
    // },
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
    // 图表数据加载
    async chartLoading() {
      // 获取所有检测人员任务统计
      let this_ = this;
      const sql = `select  *FROM (SELECT ie.ID_ AS jcId,ie.NAME_ AS jcName,COUNT(tj.zhuang_tai_ = '待数据输入' OR NULL) AS jianCeWeiWanCheng,COUNT(tj.zhuang_tai_ = '待数据校验' OR tj.zhuang_tai_ = '已完成' OR NULL) AS jianCeYiWanCheng FROM
                          t_lhjczb tj,ibps_party_employee ie
                          WHERE ie.positions_ like '%1040709034740547584%' and tj.jian_ce_yuan_ = ie.ID_ AND tj.update_time_ BETWEEN '${this.startDate}' AND '${this.endDate}' GROUP BY jian_ce_yuan_
                          ) jc  LEFT JOIN
                          (
                          SELECT ie.ID_ AS fhId,ie.NAME_ AS fhName,COUNT(tj.zhuang_tai_ = '待数据校验' OR NULL) AS fuHeWeiWanCheng,COUNT(tj.zhuang_tai_ = '已完成' OR NULL) AS fuHeYiWanCheng FROM
                          t_lhjczb tj,ibps_party_employee ie
                          WHERE ie.positions_ like '%1040709034740547584%' and tj.fu_he_yuan_ = ie.ID_ AND tj.update_time_ BETWEEN  '${this.startDate}' AND '${this.endDate}' GROUP BY fu_he_yuan_
                          ) fh ON jc.jcName = fh.fhName
                          UNION (
                          SELECT  *FROM (SELECT ie.ID_ AS jcId, ie.NAME_ AS jcName,COUNT(tj.zhuang_tai_ = '待数据输入' OR NULL) AS jianCeWeiWanCheng,COUNT(tj.zhuang_tai_ = '待数据校验' OR tj.zhuang_tai_ = '已完成' OR NULL) AS jianCeYiWanCheng FROM
                          t_lhjczb tj,ibps_party_employee ie
                          WHERE tj.jian_ce_yuan_ = ie.ID_ AND tj.update_time_ BETWEEN  '${this.startDate}' AND '${this.endDate}' GROUP BY jian_ce_yuan_
                          ) jc  RIGHT JOIN
                          (
                          SELECT ie.ID_ AS fhId,ie.NAME_ AS fhName,COUNT(tj.zhuang_tai_ = '待数据校验' OR NULL) AS fuHeWeiWanCheng,COUNT(tj.zhuang_tai_ = '已完成' OR NULL) AS fuHeYiWanCheng FROM
                          t_lhjczb tj,ibps_party_employee ie
                          WHERE ie.positions_ like '%1040709034740547584%' and tj.fu_he_yuan_ = ie.ID_ AND tj.update_time_ BETWEEN  '${this.startDate}' AND '${this.endDate}' GROUP BY fu_he_yuan_
                          ) fh ON jc.jcName = fh.fhName
                          )`;
      // console.log(sql,"sql")
      this.option.yAxis.data = [];
      this.option.series[0].data = [];
      this.option.series[1].data = [];
      this.option.series[2].data = [];
      this.option.series[3].data = [];
      this.chartData = [];
      await curdPost("sql", sql)
        .then((res) => {
          const data = res.variables.data;
          for (let i of data) {
            this_.option.yAxis.data.push(i.jcName ? i.jcName : i.fhName);
            // 检测未完成数
            this_.option.series[0].data.push(
              i.jianCeWeiWanCheng ? i.jianCeWeiWanCheng : 0
            );
            // 检测已完成数
            this_.option.series[1].data.push(
              i.jianCeYiWanCheng ? i.jianCeYiWanCheng : 0
            );
            // 复核未完成数
            this_.option.series[2].data.push(
              i.fuHeWeiWanCheng ? i.fuHeWeiWanCheng : 0
            );
            // 复核已完成数
            this_.option.series[3].data.push(
              i.fuHeYiWanCheng ? i.fuHeYiWanCheng : 0
            );
            this_.chartData.push(i);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formLoading() {
      this.loading = true;
      let formsql = `select zhuang_tai_,fu_jian_,yang_pin_bian_hao,yang_pin_ming_che,shi_fou_he_ge_,
                     ji_lu_bian_hao_,wei_tuo_lei_xing_,jian_ce_yuan_,fu_he_yuan_,yang_pin_lei_xing FROM t_lhjczb
                     where update_time_ BETWEEN '${this.startDate}' AND '${this.endDate}' and `;
      let sql = "";

      const params = this.$refs["crud"]
        ? this.$refs["crud"].getSearcFormData()
        : {};
      // console.log("params:", params)

      switch (this.setParams.seriesName) {
        case "未完成检测项目情况":
          sql =
            formsql +
            `zhuang_tai_ = '待数据输入' and jian_ce_yuan_='${
              this.chartData[this.setParams.dataIndex].jcId
            }'`;
          break;
        case "已完成检测项目情况":
          sql =
            formsql +
            `(zhuang_tai_ = '待数据校验' or zhuang_tai_ = '已完成') and jian_ce_yuan_='${
              this.chartData[this.setParams.dataIndex].jcId
            }'`;
          break;
        case "未完成复核项目情况":
          sql =
            formsql +
            `zhuang_tai_ = '待数据校验' and fu_he_yuan_='${
              this.chartData[this.setParams.dataIndex].fhId
            }'`;
          break;
        case "已完成复核项目情况":
          sql =
            formsql +
            `zhuang_tai_ = '已完成' and fu_he_yuan_='${
              this.chartData[this.setParams.dataIndex].fhId
            }'`;
          break;
        default:
          break;
      }
      sql =
        sql +
        `${
          params.yang_pin_lei_xing
            ? ` and yang_pin_lei_xing like '%${params.yang_pin_lei_xing}%'`
            : ``
        }`;
      sql =
        sql +
        `${
          params.shi_fou_he_ge_
            ? ` and shi_fou_he_ge_ like '%${params.shi_fou_he_ge_}%'`
            : ``
        }`;
      sql =
        sql +
        `${
          params.yang_pin_bian_hao
            ? ` and yang_pin_bian_hao like '%${params.yang_pin_bian_hao}%'`
            : ``
        }`;
      sql =
        sql +
        `${
          params.yang_pin_ming_che
            ? ` and yang_pin_ming_che like '%${params.yang_pin_ming_che}%'`
            : ``
        }`;

      curdPost("sql", sql)
        .then((res) => {
          this.loading = false;
          const data = res.variables.data;
          this.formData = res.variables.data;
          document.getElementsByClassName(
            "el-pagination__rightwrapper"
          )[0].style.display = "none";
          this.paginationFunc(res.variables.data);
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
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
      this.chartLoading();
      this.getTtaskMattersData();
    },
    //员工基本信息 轮播表数据
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
        personInfo.push(item.zhi_cheng_deng_ji ||  `   `);
        personInfo.push(item.jian_ding_zi_ge_z ||  `   `);
        personInfo.push(item.ru_zhi_shi_jian_ ||  `   `);
        this.personInfoData.data.push(personInfo ||  `   `);
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
    this.chartLoading();
    this.employeeInfoData();
    this.degreeGradeInfoData();
    this.getTtaskMattersData();
  },
  mounted() {
    // this.initChart();
  },
};
</script>
  <style lang="less" scoped>
.personView {
  width: 100%;
  height: calc(100vh - 100px);
  background-image: url("~@/assets/images/screen/bg.png");
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
      width: 300px;
      height: 80%;
    }
    /deep/.dv-border-box-8 .border-box-content{
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
