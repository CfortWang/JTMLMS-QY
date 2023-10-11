<template>
  <div class="personView">
    <dv-full-screen-container>
      <div class="topView"
           style="width: 100%; height: 11%">
        <!-- <div class="jbd-title"> 人员管理看板 </div> -->
        <div class="jbd-title">
          <dv-decoration-8 style="
            width: 20%;
            height: 50px;
            position: absolute;
            left: 0px;
            top: 0px;
          " />
          <div style="width: 100%">
            <div style="height: 40%; font-size: 22px; margin-top: 10px">
              人员管理看板
            </div>
            <dv-decoration-5 style="width: 30%; height: 50%; margin: 0 auto" />
          </div>
          <dv-decoration-8 :reverse="true"
                           style="
            width: 20%;
            height: 50px;
            position: absolute;
            right: 0px;
            top: 0px;
          " />
        </div>
        <div class="contain">
          <dv-decoration-11 class="personNum"
                            style="margin-left: 10%"><i class="el-icon-user"
               style="color: #4ea5d6; margin-right: 3px"></i>
            员工数量：{{ employeeNum }}人</dv-decoration-11>
          <dv-border-box-8 class="date"
                           style="margin-right: 5%; display: flex; align-items: center">
            <!-- 部门选择 -->
            <SelectPositions @handleFunc="handleFunc" />
            <div style="width: 30%; display: inline-block; margin-right: 3px">
              统计时间：
            </div>
            <el-date-picker style="width: 75%"
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

            <div class="back"
                 @click.prevent="goBack()">
              返回
            </div>
          </dv-border-box-8>
        </div>
      </div>
      <dv-border-box-1 style="width: 100%; height: 89%; box-sizing: border-box; overflow: hidden">
        <div style="height: 3%"></div>
        <div class="middleView">
          <div class="viewLeft">
            <pieView :info="degreePieData" />
          </div>
          <dv-decoration-2 :reverse="true"
                           style="width: 2%; height: 100%" />
          <div class="viewCenter">
            <RingChart :info="ranksPieData" />
          </div>
          <dv-decoration-2 :reverse="true"
                           style="width: 2%; height: 100%" />
          <div class="viewRight">
            <CarouselTabl :info="personInfoData"
                          title="员工基本信息列表" />
          </div>
        </div>
        <dv-decoration-10 style="height: 2%; width: 96%; margin: 0 auto" />
        <div class="bottomView">
          <div class="detectionTask">
            <BarChart :info="PositionsOption"
                      :config="{ title: '部门信息统计', id: 'positionsId' }" />
          </div>
          <dv-decoration-2 :reverse="true"
                           style="width: 2%; height: 100%" />
          <div class="taskMatters">
            <BarChart :info="optionPerson"
                      :config="{ title: '任务事宜统计', id: 'taskMatters' }" />
          </div>
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
import pieView from "@/views/system/jbdHome/board/component/getPieView";
import CarouselTabl from "@/views/system/jbdHome/board/component/CarouselTabl";
import SelectPositions from "@/views/component/selectPositions";
import screenfull from 'screenfull'

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
    return {
      monthValues: [],
      startDate: "2023-03-01",
      endDate: "",
      employeeNum: 0,
      employeeInfo: [],
      options: [],
      otherPositions: [], // 用于其他图sql条件查询
      positions: [], // 用于部门统计信息sql条件查询
      pisitionsValue: [], // 回填给子组件的部门全值
      // 日期选择配置
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
      // 学位统计图配置
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
          {
            name: "高中",
            value: 0,
          },
        ],
        color: ["#FFFF00", "#99CC00", "#6666FF", "#c91f37"],
        config: { title: "学历学位统计", idSelector: "degreeId" },
      },
      // 职称统计图配置
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
        ],
        color: ["#eacd76", "#896c39", "#9b4400"],
        config: { title: "职称统计", idSelector: "ranksid" },
      },
      // 员工基本信息图配置表
      personInfoData: {
        header: ["姓名", "学历学位", "职称", "员工编号", "入职时间"],
        data: [],
        columnWidth: ["120", "90", "80", "120", "120"],
        rowNum: 7,
        align: "center",
        hoverPause: true,
      },
      // 部门信息统计配置表
      PositionsOption: {
        animation: true,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        legend: {
          textStyle: {
            color: "rgba(251, 251, 251, 1)",
          }
        },
        color: ['#c91f37', '#6666FF', "#99CC00", "#FFFF00", "#9b4400", "#896c39", "#eacd76"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            nameTextStyle: {
              color: "rgba(251, 251, 251, 1)",
            },
            axisLabel: {
              textStyle: {
                color: "rgba(251, 251, 251, 1)",
              },
              interval: 0,
              rotate: 70
            },
          },
        ],
        yAxis: [
          {
            name: "个数（人）",
            type: "value",
            nameTextStyle: {
              color: "rgba(251, 251, 251, 1)",
            },
            axisLabel: {
              textStyle: {
                color: "rgba(251, 251, 251, 1)",
              },
            },
          },
        ],
        // "高中", "本科", "硕士", "博士", "初级职称", "中级职称", "高级职称"
        series: [
          {
            name: "高中",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "本科",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "硕士",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "博士",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "初级职称",
            type: "bar",
            data: [],
            emphasis: {
              focus: "series",
            }
          },
          {
            name: "中级职称",
            type: "bar",
            barWidth: 5,
            stack: "Search Engine",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "高级职称",
            type: "bar",
            stack: "Search Engine",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],

      },
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
            }
          },
          {
            name: "已办事宜数",
            type: "bar",
            data: [],
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            }
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
        color: ['#6666FF', '#9b4400'],
      },
    };
  },
  methods: {
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
    // 人员基本信息 轮播表数据
    async employeeInfoData() {
      let this_ = this;
      this.personInfoData.data = [];
      let data = [];
      let personInfo = [];
      // let ranksObj = {};
      let sql = `select a.id_,a.parent_id_,ee.name_,a.zui_gao_xue_li_x_,a.zhi_cheng_deng_ji,ee.jian_ding_zi_ge_z,a.ren_zhi_shi_jian_,
      a.ru_zhi_shi_jian_ from  t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ where a.id_ !='861622496187645952' and (${this.otherPositions.join(
        " or "
      )})`;
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
      this.degreePieData.data[0].value = 0;
      this.degreePieData.data[1].value = 0;
      this.degreePieData.data[2].value = 0;
      this.degreePieData.data[3].value = 0;
      this.ranksPieData.data[0].value = 0;
      this.ranksPieData.data[1].value = 0;
      this.ranksPieData.data[2].value = 0;
      let data = [];
      let sql = `select
                sum(a.zui_gao_xue_li_x_ = '博士') as doctor,
                sum(a.zui_gao_xue_li_x_ = '硕士') as Master,
                sum(a.zui_gao_xue_li_x_ = '本科') as undergraduate,
                sum(a.zui_gao_xue_li_x_ = '高中') as gaoZhong,
                sum(a.zhi_cheng_deng_ji = '初级') as elementary,
                sum(a.zhi_cheng_deng_ji = '中级') as middleRank,
                sum(a.zhi_cheng_deng_ji = '高级') as senior,
                sum(a.zhi_cheng_deng_ji = '' || a.zhi_cheng_deng_ji is null) as other
                from t_ryjbqk as a join  ibps_party_employee as ee on a.parent_id_= ee.id_ where ee.id_ != '702117247933480960' and (${this.otherPositions.join(
        " or "
      )} )`;
      await curdPost("sql", sql).then((res) => {
        data = res.variables.data;
      });
      this.degreePieData.data[0].value = data[0].doctor ? data[0].doctor : 0;
      this.degreePieData.data[1].value = data[0].Master ? data[0].Master : 0;
      this.degreePieData.data[2].value = data[0].undergraduate
        ? data[0].undergraduate
        : 0;
      this.degreePieData.data[3].value = data[0].gaoZhong
        ? data[0].gaoZhong
        : 0;
      this.ranksPieData.data[0].value = data[0].senior ? data[0].senior : 0;
      this.ranksPieData.data[1].value = data[0].middleRank
        ? data[0].middleRank
        : 0;
      this.ranksPieData.data[2].value = data[0].elementary
        ? data[0].elementary
        : 0;
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
            )gy LEFT JOIN   ibps_party_entity en ON FIND_IN_SET(en.id_,gy.positions_)  where (${this.positions.join(
        " or "
      )}) GROUP BY enName) jh`;
      curdPost("sql", sql).then((res) => {
        const data = res.variables.data;
        // 组装数据集，以学历职称为列，以部门为行:{"高中":['1','2','3']}
        // let xAxisDatas = this.PositionsOption.xAxis[0].data;
        let seriesDatas = this.PositionsOption.series;
        this.PositionsOption.xAxis[0].data = [];
        this.PositionsOption.series[0].data = [];
        this.PositionsOption.series[1].data = [];
        this.PositionsOption.series[2].data = [];
        this.PositionsOption.series[3].data = [];
        this.PositionsOption.series[4].data = [];
        this.PositionsOption.series[5].data = [];
        this.PositionsOption.series[6].data = [];

        if (data.length !== 0) {
          // 跟《部门信息统计配置表》排列顺序一致
          let shuZuList = [
            "senior_",
            "undergraduate_",
            "Master_",
            "doctor_",
            "elementary_",
            "middleRank_",
            "seniorZ_",
          ];
          for (let t = 0; t < data.length; t++) {
            this.PositionsOption.xAxis[0].data.push(data[t].enName);
            for (let i = 0; i < seriesDatas.length; i++) {
              seriesDatas[i].data[t] = data[t][shuZuList[i]];
            }
          }
          //   this.PositionsOption.xAxis[0].data = xAxisDatas;
          this.PositionsOption.series = seriesDatas;
        }
      });
    },
    // 个人任务统计
    async getTtaskMattersData() {
      let this_ = this;
      this_.optionPerson.yAxis.data = [];
      this_.optionPerson.series[0].data = [];
      this_.optionPerson.series[1].data = [];
      let create_by_ = "";
      let data = [];
      let csData = [];
      let yibanData1 = [];
      let yibanData2 = [];
      let personIds = "";
      // for (let item of this.employeeInfo) {
      //   create_by_ += create_by_ + "," + item.id_;
      // }
      // create_by_ = create_by_.slice(0, create_by_.length - 1);
      let sql = `select  executor_,count(executor_) as num ,ee.name_ FROM  IBPS_BPM_TASKS as a join IBPS_BPM_TASK_ASSIGN as b  
                on a.task_id_ = b.task_id_ join ibps_party_employee as ee on b.executor_ = ee.id_ and
                ee.STATUS_= 'actived' and ee.ID_ != '1' and ee.ID_ != '-1' and ee.ID_ != '702117247933480960' and (${this.otherPositions.join(
        " or "
      )} ) and  a.CREATE_TIME_  between '${this.startDate}' and '${this.endDate
        }'
                and ee.GROUP_ID_ not like '%1041786072788369408%'   GROUP BY  executor_ order by ee.CREATE_TIME_ asc `;
      await curdPost("sql", sql).then((res) => {
        data = res.variables.data;
      });
      for (let item of data) {
        this_.optionPerson.yAxis.data.push(item.name_);
        this_.optionPerson.series[0].data.push(item.num);
      }
      //超时
      let cssql = `select  executor_ ,count(executor_) as num ,ee.name_,a.create_time_ FROM  IBPS_BPM_TASKS as a join IBPS_BPM_TASK_ASSIGN as b
                  on a.task_id_ = b.task_id_ join ibps_party_employee as ee on b.executor_ = ee.id_
                  where now()> SUBDATE(a.create_time_,interval - 3 day) and  ee.STATUS_= 'actived' and (${this.otherPositions.join(
        " or "
      )} )
                  and ee.ID_ != '1' and ee.ID_ != '-1' and ee.ID_ != '702117247933480960' and ee.GROUP_ID_ not like '%1041786072788369408%'
                  GROUP BY  executor_  order by  ee.CREATE_TIME_ asc `;
      await curdPost("sql", cssql).then((res) => {
        csData = res.variables.data;
      });
      for (let it of csData) {
        personIds += "'" + it.executor_ + "',";
      }
      personIds = personIds.slice(0, personIds.length - 1);
      let yibansql1 = `select count(AUDITOR_) as num,AUDITOR_,name_,STATUS_,CREATE_TIME_ from (select a.AUDITOR_,ee.name_,
                      a.STATUS_,ee.CREATE_TIME_ from IBPS_BPM_APPROVAL as a join ibps_party_employee as ee on a.AUDITOR_ = ee.id_
                      where  a.CREATE_TIME_  between '${this.startDate}' and '${this.endDate
        }' and (${this.otherPositions.join(" or ")} ) and
                                    ee.id_ in(${personIds})   group by a.PROC_inst_ID_) as zz  group by AUDITOR_  order by  CREATE_TIME_ asc `;
      await curdPost("sql", yibansql1).then((res) => {
        yibanData1 = res.variables.data;
      });
      let yibansql2 = `select count(AUDITOR_) as num,AUDITOR_,name_,STATUS_,CREATE_TIME_ from (select a.PROC_inst_ID_,
                        ee.name_,a.AUDITOR_,a.STATUS_,ee.CREATE_TIME_ from IBPS_BPM_APPROVAL_HIS as a join ibps_party_employee as ee on a.AUDITOR_ = ee.id_
                        where  a.CREATE_TIME_  between '${this.startDate
        }' and '${this.endDate
        }' and ee.id_ in(${personIds}) and (${this.otherPositions.join(" or ")} )   group by a.PROC_inst_ID_) as bb  group by AUDITOR_ order by  CREATE_TIME_ asc `;
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
      this.positions = []; // 用于sql条件查询
      this.otherPositions = [];
      for (let i = 0; i < v.length; i++) {
        this.positions.push(`en.path_ like '%${v[i][v[i].length - 1]}%'`);
        this.otherPositions.push(
          `ee.positions_ like '%${v[i][v[i].length - 1]}%'`
        );
      }
    },
    handleAllGetFunc() {
      this.positionsInfoData();
      this.employeeInfoData();
      this.degreeGradeInfoData();
      this.getTtaskMattersData();
    },
    handleFunc(e) {
      this.simplifyPosition(e);
      this.handleAllGetFunc();
    },
    // 定时任务调用接口，一分钟一次
    intervalHandle() {
      this.interval = setInterval(() => {
        this.handleAllGetFunc();
      }, 180000);
    },
    allView() {
      // 默认显示全屏
      screenfull.request()
    },
    // 返回
    goBack() {
      this.$router.back(-1)
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
    if (screenfull.isEnabled && !screenfull.isFullscreen) {
      this.allView()
    }
  },
  mounted() {
    this.intervalHandle();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (screenfull.isFullscreen) {
      screenfull.toggle()
    }
  },

};
</script>
  <style lang="less" scoped>
.personView {
  width: 100%;
  height: calc(100vh - 100px);
//   background-image: url("~@/assets/images/screen/bg.png");
  z-index: -1;
  #dv-full-screen-container {
    background-image: url("~@/assets/images/screen/bg.png");
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }
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
      width: 750px;
      height: 80%;
      .dv-border-svg-container {
        width: 750px;
      }
    }
    .back {
      width: 15%;
      margin-right: 10px;
    }

    /deep/.dv-border-box-8 .border-box-content {
      display: flex;
      align-items: center;
      padding: 0px 2px;
    }
    /deep/ .el-range-input {
      color: #fcfcfc;
      background-color: #00083e;
    }
    /deep/ .el-range-separator {
      color: #fcfcfc;
    }
    /deep/.el-input__inner {
      background-color: #00083e;
      border: 1px solid #4ea5d6;
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
}
</style>
