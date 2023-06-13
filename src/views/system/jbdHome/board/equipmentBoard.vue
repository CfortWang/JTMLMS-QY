<template>
  <div class="content">
    <dv-full-screen-container>
      <!-- 头部内容 -->
      <div class="header">
        <dv-decoration-8 class="left" />
        <dv-decoration-5 class="center" />
        <dv-decoration-8 class="right" :reverse="true" />
        <div class="title">{{ titleName }}</div>
        <div class="time">
          <span>月份：</span>
          <el-date-picker v-model="month" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="日期选择" style="width: 120px" :readonly="false" :editable="true" :clearable="false" @change="updateAll" />
        </div>
        <div class="back" @click.prevent="goBack()">
          <dv-border-box-8>返回</dv-border-box-8>
        </div>
      </div>
      <dv-border-box-1 style="height:88%;overflow: hidden;">
        <!-- 顶部数据 -->
        <div class="topCard">
          <top-bar v-if="topBarData.length" :info="topBarData" />
        </div>
        <dv-decoration-10 style="height:2%;display:flex;" />
        <div class="middleCard">
          <div style="width:100%;height: 100%;box-sizing: border-box;overflow: hidden;">
            <div class="middleCardLeft">
              <middleCard v-if="MiddleLeftPieViewList.data.length" :info="MiddleLeftPieViewList" ref="middleCardLeft" />
            </div>
            <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
            <div class="middleCardRight1">
              <CarouselTabl v-if="shiyonglvConfig.data.length" :info="shiyonglvConfig" title="仪器设备列表" isup=isup />
            </div>
            <!-- <div class="middleCardCenter">
            <middleCard v-if="eBgRateData.data.length" :info="eBgRateData" ref="middleCardCenter"/>
          </div> -->
            <dv-decoration-2 :reverse="true" style="width:2%;height:100%;" />
            <div class="middleCardRight">
              <CarouselTabl v-if="config.data.length" :info="config" title="设备报废列表" />
            </div>
          </div>
        </div>
        <dv-decoration-10 style="height:2%;display:flex;" />
        <div class="bottomCard">
          <div style="width:24%">
            <zhuzhuangtu v-if="sheBeiData.data.length" :info="sheBeiData" ref="sheBeiDataDataref" />
          </div>
          <dv-decoration-2 :reverse="true" style="width:1%;height:100%;overflow: hidden;box-sizing: border-box;" />
          <div style="width:25%;height: 100%;overflow: hidden;box-sizing: border-box;display:flex;">
            <div class="bottomCardLeft0">
              <middleCard v-if="weiHuSheBeiData.data.length" :info="weiHuSheBeiData" ref="sheBeiWeiHuRef" />
            </div>
            <!-- <dv-decoration-2 :reverse="true" style="width:3%;height:100%;;margin: 0 10px;" /> -->
            <!-- <div style="width:37%">
              <zhuzhuangtu v-if="sheBeiweiHuData.data.length" :info="sheBeiweiHuData"  ref="sheBeiWeiHuDataref"/>
            </div> -->
          </div>
          <dv-decoration-2 :reverse="true" style="width:1%;height:100%;overflow: hidden;box-sizing: border-box;" />
          <div style="width:25%;display:flex;">
            <!-- <div style="width:40%">
              <zhuzhuangtu v-if="zhuantaiEData.data.length" :info="zhuantaiEData" ref="zhuantaiEDataref" />
            </div> -->
            <!-- <dv-decoration-2 :reverse="true" style="width:3%;height:100%;" /> -->
            <div class="bottomCardright">
              <middleCard v-if="jianDingjiaoZhunSheBeiData.data.length" :info="jianDingjiaoZhunSheBeiData" ref="jiandingRef" />
            </div>
          </div>
          <dv-decoration-2 :reverse="true" style="width:1%;height:100%;overflow: hidden;box-sizing: border-box;" />
          <div style="width:24%;overflow: hidden;box-sizing: border-box;display:flex;">
            <div class="bottomCardLeft">
              <middleCard v-if="sheBeiHeChaData.data.length" :info="sheBeiHeChaData" ref="sheBeiHeChaRef"/>
            </div>
            <!-- <dv-decoration-2 :reverse="true" style="width:5px;height:330px;margin: 0 10px;" /> -->
            <!-- <div style="width:100%">
              <zhuzhuangtu v-if="bottomData.data.length" :info="bottomData" ref="bottomCardLeft" />
            </div> -->
          </div>

        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>
<script>
import screenfull from "screenfull";
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
import { color } from "echarts/lib/export";
// import { config } from 'public/lib/UEditor/third-party/zeroclipboard/ZeroClipboard';
// import { acceptList } from "./data.js";
// import { number } from 'echarts/lib/export';
export default {
  name: "checkBoard",
  components: {
    topBar: () => import("./component/equipmentBoardTopcard"),
    middleCard: () => import("./component/getPieView"),
    zhuzhuangtu: () => import("./component/zhuzhuangtu"),
    CarouselTabl: () => import("./component/CarouselTabl"),
  },
  data() {
    const d = new Date();
    return {
      titleName: "设备管理看板",
      year: d.toJSON().slice(0, 4),
      month: d.toJSON().slice(0, 7),
      today: d.toJSON().slice(0, 10),
      topBarData: [],
      timer: null,
      MiddleLeftPieViewList: {},
      eBgRateData: {},
      sheBeiHeChaData: {},
      jianDingjiaoZhunSheBeiData: {},
      weiHuSheBeiData: {},
      shiyonglvConfig: {
        header: ["编号","名称","存放位置","状态","保管人",],//仪器设备
        // header: ["名称","编号","使用时间","存放位置", "状态", "频率"], //设备使用列表
        data: [],
        // columnWidth: ["180","130","120","150","110","120"],//设备使用列表
        columnWidth: ["180","180","150","110","110"],
        rowNum: 7,
      },
      bottomData: {},
      zhuantaiEData: {},
      sheBeiData: { xData: [], data: [], config: { idSelector: "" } },
      sheBeiDataShow:false,
      sheBeiweiHuData: {},
      config: {},
      zichan: 0,
    };
  },
  created() {
    if (screenfull.isEnabled && !screenfull.isFullscreen) {
      this.allView();
    }
    this.updateAll();
  },
  beforeDestroy() {
    if (screenfull.isFullscreen) {
      screenfull.toggle();
    }
  },
  methods: {
    allView() {
      // 默认显示全屏
      screenfull.request();
    },
    goBack() {
      this.$router.back(-1);
    },
    updateAll(e) {
      // this.getSheBeiMony();
      this.getCarouselShiYonglvTable();
      this.getTopBarData();
      this.getMiddleLeftPieView();
      this.getCarouselTable();
      // this.getbottomData();
    },
    async getTopBarData() {
      let this_ = this;

      this.MiddleLeftPieViewList = {
        data: [],
        config: { idSelector: "main" },
        rowNum: 7,
        color: [],
      };
      this_.sheBeiDataShow = false;
      this.eBgRateData = { data: [], config: {} };
      this.sheBeiHeChaData = { data: [], config: {} };
      this.jianDingjiaoZhunSheBeiData = { data: [], config: {} };
      this.sheBeiData={ xData: [], data: [], config: { idSelector: "" } };
      this.weiHuSheBeiData = { data: [], config: {} };
      this.bottomData = { xData: [], data: [], config: { idSelector: "" } };
      this.zhuantaiEData = { xData: [], data: [], config: { idSelector: "" } };
      this.sheBeiweiHuData = {
        xData: [],
        data: [],
        config: { idSelector: "" },
      };
      let sql = `select a.Equipments,a1.mony,b.addEquipments,c.testEquipments,c1.testNoEquipments,d.checkEquipments,
      d1.checkNoEquipments,e.goodEquipments,f.scrapEquipments,g.limitedEquipments,h.weiHuNoEquipments,h1.weiHuEquipments
      from
      (select count(*) as Equipments from t_sbdj) as a,
      (select zi_chan_yuan_zhi_ as mony FROM t_sbdj) as a1,
      (select count(*) as addEquipments  from t_sbdj where gou_jin_ri_qi_ LIKE '${this_.month}') as b,
      (select count(*) as testEquipments from t_sbjdxzqr where shi_fou_guo_shen_ ='1') as c,
      (select count(*) as testNoEquipments from t_sbjdxzqr) as c1,
      (select count(*) as checkEquipments from t_sbhcjlb where create_time_ LIKE '${this_.month}' and shi_fou_guo_shen_ ='1') as d,
      (select count(*) as checkNoEquipments from t_sbhcjlb where create_time_ LIKE '${this_.month}') as d1,
      (select count(*) as goodEquipments  from t_sbdj where she_bei_zhuang_ta ='正常') as e,
      (select count(*) as scrapEquipments  from t_sbdj where she_bei_zhuang_ta ='停用' or she_bei_zhuang_ta ='报废' or she_bei_zhuang_ta ='报废/停用') as f,
      (select count(*) as limitedEquipments  from t_sbdj where she_bei_zhuang_ta ='限制使用' or she_bei_zhuang_ta ='备用') as g,
      (select count(*) as weiHuNoEquipments  from t_mjsbwhjhzb where create_time_ LIKE '${this_.month}') as h,
      (select count(*) as weiHuEquipments  from t_mjsbwhbyjlby where create_time_ LIKE '${this_.month}' and shi_fou_guo_shen_ ='1') as h1`;
      await curdPost("sql", sql)
        .then((res) => {
          const data = res.variables.data;
          let zichan = this_.getAllMonyInt(data);
          zichan = zichan +''
          zichan =zichan.substring(0,zichan.length-4)
          let eIntactnessRate = Number(
            (
              (data[0].goodEquipments / data[0].Equipments).toFixed(2) * 100 +
              ""
            ).slice(0, 5)
          );
          let eBadRate = Number(
            ((100 - eIntactnessRate).toFixed(4) + "").slice(0, 4)
          );
          let obj = {};
          obj.value = Number(
            (
              (data[0].goodEquipments / data[0].Equipments).toFixed(4) * 100 +
              ""
            ).slice(0, 5)
          );
          obj.name = "正常设备数";
          this_.MiddleLeftPieViewList.data.push(obj);
          obj = {};
          obj.value = Number(
            (
              (data[0].limitedEquipments / data[0].Equipments).toFixed(4) *
                100 +
              ""
            ).slice(0, 5)
          );
          obj.name = "受限设备数";
          this_.MiddleLeftPieViewList.data.push(obj);
          obj = {};
          obj.value = Number(
            (
              (data[0].scrapEquipments / data[0].Equipments).toFixed(4) * 100 +
              ""
            ).slice(0, 5)
          );
          obj.name = "停用/报废";
          this_.MiddleLeftPieViewList.data.push(obj);
          this_.MiddleLeftPieViewList.color = ["#339933", "#FFFF66", "#FF0033"];
          this_.MiddleLeftPieViewList.config.title = "设备工作状态情况";
          this_.MiddleLeftPieViewList.config.idSelector = "main2";
          this_.$nextTick(() => {
            // setTimeout(() => {
            // this_.$refs.middleCardLeft.getMiddleLeft(); // hhhh xxxx
            // }, 1000)
          });
          obj = {};
          let result = [
            {
              title: "",
              children: [
                {
                  label: "设备总数",
                  value: data[0].Equipments,
                  danwei: "",
                },
                {
                  label: "新增数",
                  value: data[0].addEquipments,
                  danwei: "",
                },
                {
                  label: "正常数",
                  value: data[0].goodEquipments,
                  danwei: "",
                },

                {
                  label: "受限数",
                  value: data[0].limitedEquipments,
                  danwei: "",
                },
                {
                  label: "报废/停用数",
                  value: data[0].scrapEquipments,
                  danwei: "",
                },
              ],
            },
            {
              title: "",
              children: [
                {
                  label: "计划维护数",
                  value: data[0].weiHuNoEquipments,
                  danwei: "",
                },
                {
                  label: "已维护数",
                  value: data[0].weiHuEquipments,
                  danwei: "",
                },
              ],
            },
            {
              title: "",
              children: [
                {
                  label: "计划检定/校准数",
                  value: data[0].testNoEquipments,
                  danwei: "",
                },
                {
                  label: "已检定/校准数",
                  value: data[0].testEquipments,
                  danwei: "",
                },
              ],
            },
            {
              title: "",
              children: [
                {
                  label: "本月计划核查数",
                  value: data[0].checkNoEquipments,
                  danwei: "",
                },
                {
                  label: "本月已核查数",
                  value: data[0].checkEquipments,
                  danwei: "",
                },
              ],
            },
            {
              title: "",
              children: [
                {
                  label: "完好率",
                  value: eIntactnessRate,
                  danwei: "%",
                },
                {
                  label: "故障率",
                  value: eBadRate,
                  danwei: "%",
                },
                {
                  label: "总值(万元)",
                  value: zichan,
                  danwei: "",
                },
              ],
            },
          ];
          //设备数量统计
          this_.sheBeiData.xData = [
            "设备总数",
            "新增数",
            "良好数",
            "受限数",
            "报废停用数",
          ];

          this_.sheBeiData.data.push(data[0].Equipments);
          this_.sheBeiData.data.push(data[0].addEquipments);
          this_.sheBeiData.data.push(data[0].goodEquipments);
          this_.sheBeiData.data.push(data[0].limitedEquipments);
          this_.sheBeiData.data.push(data[0].scrapEquipments);
          this_.sheBeiData.config.title = "设备数量情况一览";
          this_.sheBeiData.config.idSelector = "main8";
          this_.sheBeiDataShow = true;
          //
          this_.bottomData.xData = ["本月计划核查数", "本月已核查数"];
          this_.bottomData.data.push(data[0].checkNoEquipments);
          this_.bottomData.data.push(data[0].checkEquipments);
          this_.bottomData.config.title = "核查设备完成图";
          this_.bottomData.config.idSelector = "main4";
          // this_.$nextTick(()=>{
          //   setTimeout(() => {

          // 	}, 1000)
          // })
          this_.zhuantaiEData.xData = [
            "计划检定/校准数",
            "已完成检定/校准数",
          ];
          this_.zhuantaiEData.data.push(data[0].testNoEquipments);
          this_.zhuantaiEData.data.push(data[0].testEquipments);
          this_.zhuantaiEData.config.title = "检定/校准设备完成图";
          this_.zhuantaiEData.config.idSelector = "main3";
          //维护设备数柱状图
          this_.sheBeiweiHuData.xData = ["计划维护数", "已完成数"];
          this_.sheBeiweiHuData.data.push(data[0].weiHuNoEquipments);
          this_.sheBeiweiHuData.data.push(data[0].weiHuEquipments);
          this_.sheBeiweiHuData.config.title = "设备维护柱状图";
          this_.sheBeiweiHuData.config.idSelector = "mainWeiHuZ";
          this_.$nextTick(() => {
            // setTimeout(() => {
            // this_.$refs.zhuantaiEDataref.getMiddleLeft(); // hhhh xxxx
            // this_.$refs.bottomCardLeft.getMiddleLeft(); // hhhh xxxx
            // this_.$refs.sheBeiWeiHuDataref.getMiddleLeft();
            // }, 1000)
          });

          let objRate = {};
          objRate.name = "完好率";
          objRate.value =eIntactnessRate;
          this_.eBgRateData.data.push(objRate);
          objRate = {};
          objRate.value =eBadRate;
          objRate.name = "故障率";
          this_.eBgRateData.data.push(objRate);
          this_.eBgRateData.color = ["#339933", "#FF0033"];
          this_.eBgRateData.config.title = "设备工作状态完成率";
          this_.eBgRateData.config.idSelector = "main1";
          //设备数维护
          let objweihu = {};
          objweihu.name = "计划维护数";
          objweihu.value = data[0].weiHuNoEquipments;
          this_.weiHuSheBeiData.data.push(objweihu);
          objweihu = {};
          objweihu.value = data[0].weiHuEquipments;
          objweihu.name = "已维护数";
          this_.weiHuSheBeiData.data.push(objweihu);
          this_.weiHuSheBeiData.color = ["#5470c6", "#38a838"];
          this_.weiHuSheBeiData.config.title = "设备维护完成率";
          this_.weiHuSheBeiData.config.idSelector = "mainWeiHu";
          //设备数核查
          let objHeCha = {};
          objHeCha.name = "本月计划核查数";
          objHeCha.value = data[0].checkNoEquipments;
          this_.sheBeiHeChaData.data.push(objHeCha);
          objHeCha = {};
          objHeCha.value = data[0].checkEquipments;
          objHeCha.name = "本月已核查数";
          this_.sheBeiHeChaData.data.push(objHeCha);
          this_.sheBeiHeChaData.color = ["#5470c6", "#38a838"];
          this_.sheBeiHeChaData.config.title = "设备核查完成率";
          this_.sheBeiHeChaData.config.idSelector = "mainHeCha";
          //设备数检定校准
          let objJianding = {};
          objJianding.name = "计划检定/校准数";
          objJianding.value = data[0].testNoEquipments;
          this_.jianDingjiaoZhunSheBeiData.data.push(objJianding);
          objJianding = {};
          objJianding.value = data[0].testEquipments;
          objJianding.name = "已完成数";
          this_.jianDingjiaoZhunSheBeiData.data.push(objJianding);
          this_.jianDingjiaoZhunSheBeiData.color = ["#5470c6", "#38a838"];
          this_.jianDingjiaoZhunSheBeiData.config.title = "设备检定/校准完成率";
          this_.jianDingjiaoZhunSheBeiData.config.idSelector = "mainJianDing";
          this_.$nextTick(() => {
            // setTimeout(() => {
            // this_.$refs.middleCardCenter.getMiddleLeft();// hhhh xxxx
            // this_.$refs.sheBeiHeChaRef.getMiddleLeft();//
            // this_.$refs.jiandingRef.getMiddleLeft();
            // }, 1000)
          });
          objRate = {};
          this_.topBarData = result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMiddleLeftPieView() {
      // [ { value: 1048, name: 'Search Engine' },]
      console.log();
    },
    async getCarouselShiYonglvTable() { //设备建档信息
      let this_ = this;
      const sql = `select a.she_bei_shi_bie_h,a.she_bei_ming_cheng_,a.cun_fang_di_dian_,a.she_bei_zhuang_ta,b.name_ FROM t_sbdj AS a JOIN ibps_party_employee AS b ON a.guan_li_ren_ = b.ID_`;
      let data1 = [];
      let res1 = [];
      this_.shiyonglvConfig.data = [];
      await curdPost("sql", sql)
        .then((res) => {
          const result = res.variables.data;
          result.forEach((item) => {
            data1 = [];
            data1.push(item.she_bei_shi_bie_h);
            data1.push(item.she_bei_ming_cheng_);
            data1.push(item.cun_fang_di_dian_);
            data1.push(item.she_bei_zhuang_ta);
            data1.push(item.name_);
            this_.shiyonglvConfig.data.push(data1);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      this.isup = true;
    },
    // async getCarouselShiYonglvTable() {设备使用列表
    //   let this_ = this;
    //   const sql = `select a.she_bei_ming_chen ,a.create_time_,a.shi_yong_qian_qin,b.name_,c.cun_fang_di_dian_,c.she_bei_shi_bie_h,d.name_ as bumen,COUNT(*) AS pinlv FROM  t_yqsbsydjb as a join ibps_party_employee as b on a.shi_yong_ren_ = b.ID_ join t_sbdj as c on a.yi_qi_bian_hao_ = c.she_bei_shi_bie_h join ibps_party_org as d on d.id_ = a.bian_zhi_bu_men_ GROUP BY create_time_  HAVING create_time_ LIKE '${this.month}%' ORDER BY pinlv DESC`;
    //   let data1 = [];
    //   let res1 = [];
    //   this_.shiyonglvConfig.data = [];
    //   await curdPost("sql", sql)
    //     .then((res) => {
    //       const result = res.variables.data;
    //       result.forEach((item) => {
    //         data1 = [];
    //         data1.push(item.she_bei_ming_chen);
    //         data1.push(item.she_bei_shi_bie_h);
    //         // data1.push(item.bumen);
    //         // data1.push(item.name_);
    //         data1.push(this_.timestampToTime(item.create_time_ / 1000));
    //         data1.push(item.cun_fang_di_dian_);
    //         // data1.push(item.create_time_);
    //         data1.push(item.shi_yong_qian_qin);
    //         data1.push(item.pinlv);
    //         this_.shiyonglvConfig.data.push(data1);
    //         // this_.$forceUpdate()
    //       });

    //       // console.log(this_.shiyonglvConfig.data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   this.isup = true;
    // },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D;
    },
    async getCarouselTable() {
      this.config = {
        header: ["设备名称", "编号", "状态"],
        columnWidth: ["180","150", "70"],
        rowNum: 6,
        data: [],
      };
      let this_ = this;
      const sql =
        "select * from t_sbdj where she_bei_zhuang_ta ='停用' or she_bei_zhuang_ta ='报废' or she_bei_zhuang_ta ='报废/停用'";
      let data1 = [];
      await curdPost("sql", sql)
        .then((res) => {
          const result = res.variables.data;
          result.forEach((item) => {
            data1 = [];
            data1.push(item.she_bei_ming_cheng_);
            data1.push(item.she_bei_shi_bie_h);
            // data1.push(item.gui_ge_xing_hao_);
            data1.push(item.she_bei_zhuang_ta);
            this_.config.data.push(data1);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllMonyInt(monyArr) {
      let mony = 0;
      let filterMony;
      monyArr.forEach((item) => {
        if (item.mony.includes("元")) {
          filterMony = item.mony.slice(0, item.mony.length - 1) * 1;
          mony += filterMony;
        }
      });
      // console.log(mony.toFixed(2))
      // return mony.toFixed(2);
      return mony;
    },
    // async getSheBeiMony (){
    //   let this_=  this;
    //   const sql = "select zi_chan_yuan_zhi_ as mony FROM t_sbdj";
    //   await curdPost("sql",sql).then(res=>{
    //     let data = res.variables.data;
    //     this_.zichan=  this_.getAllMonyInt(data);
    //     console.log(this_.zichan);
    //   }).catch(err=>{
    //     console.error(err)
    //   })
    // }
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: #030409;
  position: absolute;
  color: #fff;
  z-index: 999;
  #dv-full-screen-container {
    background-image: url("~@/assets/images/screen/bg.png");
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .block-left-right-content {
    flex: 1;
    display: flex;
    margin-top: 0.8%;
  }
  .block-top-bottom-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 0.8%;
  }
  .block-top-content {
    height: 55%;
    display: flex;
    flex-grow: 0;
    box-sizing: border-box;
    padding-bottom: 0.8%;
  }

  .header {
    position: relative;
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    box-sizing: border-box;
    overflow: hidden;
    .left,
    .right {
      width: 25%;
      height: 60px;
    }
    .center {
      width: 40%;
      height: 60px;
      margin-top: 30px;
    }
    .title {
      position: absolute;
      font-size: 30px;
      font-weight: bold;
      left: 50%;
      top: 15px;
      transform: translateX(-50%);
    }
    .time,
    .back {
      width: 8%;
      cursor: pointer;
      height: 2.825rem;
      line-height: 2.825rem;
      text-align: center;
      margin-top: 2.5%;
      flex: 1;
      position: absolute;
      color: #ffffff;
    }
    .time {
      display: flex;
      justify-content: flex-end;
      width: 20%;
      right: 75%;
    }
    .back {
      left: 75%;
    }
  }
  .topCard {
    width: 100%;
    height: 18%;
    box-sizing: border-box;
    overflow: hidden;
  }
  .bottomCard {
    height: 36%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .middleCard {
    height: 38%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .middleCard,
  .bottomCard {
    width: 96%;
    margin-left: 30px;
    // margin-top: 30px;
    div {
      display: inline-block;
    }
    .middleCardLeft {
      width: 28%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    // .middleCardCenter{
    //   width: 25%;
    //   height: 100%;
    //   box-sizing: border-box;
    //   overflow: hidden;
    // }
    .middleCardRight {
      width: 25%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .middleCardRight1 {
      width: 43%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    padding: 2px;
  }
  .bottomCard {
    display: flex;
    div {
      display: inline-block;
    }
    .bottomCardLeft0,
    .bottomCardLeft {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
    .bottomCardLeft {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
    .bottomCardright {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
  }
}
.dv-decoration-10 {
  width: 95%;
  margin: 7px 2% 0;
  height: 5px;
}
</style>
