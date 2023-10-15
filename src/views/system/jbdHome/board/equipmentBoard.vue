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
          <dv-border-box-8>
          <span >年度:</span>
          <el-date-picker v-model="month" type="year" value-format="yyyy" format="yyyy" placeholder="日期选择" style="width: 100px;" :readonly="false" :editable="true" :clearable="false" @change="updateAll" />
          </dv-border-box-8>
        </div>
        <div class="back" @click.prevent="goBack()">
          <dv-border-box-8>返回</dv-border-box-8>
        </div>
      </div>
      <dv-border-box-1 style="height:88%;overflow: hidden;">
        <!-- 顶部数据 -->
        <div class="topCard">
          <!-- <top-bar v-if="topBarData.length" :info="topBarData" /> -->
          <div style="width:100%;height: 100%;box-sizing: border-box;overflow: hidden;">
            <div class="middleCardLeft" style="width:20%;height:100%">
              <middleCard v-if="allSheBeiData.data.length" :info="allSheBeiData" />
            </div>
            <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
            <div class="middleCardLeft" style="width:40%;height:100%">
              <moreBar v-if="moreBarData.data.source.length > 0 " :info="moreBarData" />
            </div>
            <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
            <div class="middleCardLeft" style="width:36%;height:100%">
              <zhuzhuangtu v-if="zichangBarData.data.length" :info="zichangBarData" />
            </div>
          </div>
        </div>
        <dv-decoration-10 style="height:2%;display:flex;" />
        <div class="middleCard">
          <div style="width:100%;height: 100%;box-sizing: border-box;overflow: hidden;">
            <div class="middleCardLeft" style="width:20%">
              <middleCard v-if="allWeihuSheBeiData.data.length" :info="allWeihuSheBeiData" />
            </div>
            <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
            <div class="middleCardLeft" style="width:40%">
              <moreBar v-if="weihuBarData.data.source.length > 0 " :info="weihuBarData" />
            </div>
            <dv-decoration-2 :reverse="true" style="width:2%;height: 100%;" />
            <div class="middleCardRight1" style="width:36%">
              <CarouselTabl v-if="BaofeiBarData.data.length" :info="BaofeiBarData" title="检验科设备报废列表" />
            </div>
            <div class="middleCardRight" style="width:35%">
              <CarouselTabl v-if="config.data.length" :info="config" title="设备报废列表" />
            </div>
          </div>
        </div>
        <dv-decoration-10 style="height:2%;display:flex;" />
        <div class="bottomCard">
          <div style="width:33%;display:flex;">
            <div class="bottomCardright">
              <middleCard v-if="enTypeData.data.length" :info="enTypeData" />
            </div>
          </div>
          <dv-decoration-2 :reverse="true" style="width:1%;height:100%;overflow: hidden;box-sizing: border-box;" />
          <div style="width:33%">
            <middleCard v-if="allJiaozhunSheBeiData.data.length" :info="allJiaozhunSheBeiData" />
          </div>
          <dv-decoration-2 :reverse="true" style="width:1%;height:100%;overflow: hidden;box-sizing: border-box;" />
          <div style="width:60%;height: 100%;overflow: hidden;box-sizing: border-box;display:flex;">
            <div class="bottomCardLeft0">
              <moreBar v-if="jiaozhunBarData.data.source.length > 0 " :info="jiaozhunBarData" />
            </div>
          </div>
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>
<script>
import screenfull from "screenfull";
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
import data from '@/components/ibps-icon-select/data';
export default {
  name: "checkBoard",
  components: {
    topBar: () => import("./component/equipmentBoardTopcard"),
    middleCard: () => import("./component/getPieView"),
    zhuzhuangtu: () => import("./component/zhuzhuangtu"),
    CarouselTabl: () => import("./component/CarouselTabl"),
    //最新
    moreBar: () => import("./component/moreBar"),
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
      shiyonglvConfig: {header: ["编号","名称","存放位置","状态","保管人"],data: [],columnWidth: ["110","230","180","110","110"],rowNum: 7,},
      bottomData: {},
      zhuantaiEData: {},
      sheBeiData: { xData: [], data: [], config: { idSelector: "" } },
      sheBeiDataShow:false,
      sheBeiweiHuData: {},
      BaofeiBarData: {
        header: ["部门","设备名称","设备编号","状态"],data:[], 
        columnWidth: ["120","250","180","110"],
        rowNum: 5
      },
      zichan: 0,
      enTypeData: { data: [], config: {},},
      //新
      moreBarData:{ 
        data: {dimensions:[],source:[]}, 
        config: {idSelector:"eqFinish",title:"各部门设备完好情况",colors:['#3870e0','#12bc79','#ff0066']} 
      },
      zichangBarData:{ 
        data: [],
        xData:[], 
        config: {idSelector:"eqZichan",title:"各部门设备资产金额情况(万元)"}
      },
      weihuBarData:{ 
        data: {dimensions:[],source:[]}, 
        config: {idSelector:"eqWeihu",title:"各部门设备维护完成情况",colors:['#3870e0','#12bc79',]}
      },
      jiaozhunBarData:{ 
        data: {dimensions:[],source:[]}, 
        config: {idSelector:"eqJiaozhun",title:"各部门设备检定/校准完成情况",colors:['#3870e0','#12bc79',]} 
      },
      allSheBeiData:{
        data:[{name:'设备总数',value:0},{name:'良好数',value:0},{name:'停用数',value:0}],
        config:{title:'检验科设备完好情况',idSelector:'allShebei'},
        color:["#339933", "#3870e0", "#FF0033"]
      },
      allWeihuSheBeiData:{
        data:[{name:'计划数',value:0},{name:'完成数',value:0}],
        config:{title:'检验科设备维护完成情况',idSelector:'allWeihuShebei'},
        color:["#3870e0", "#FFFF66",]
      },
      allJiaozhunSheBeiData:{
        data:[{name:'计划数',value:0},{name:'完成数',value:0}],
        config:{title:'检验科设备检定/校准完成情况',idSelector:'allJiaozhunShebei'},
        color:["#3870e0", "#FFFF66",]
      }
    };
  },
  created() {
    this.updateAll();
    if (screenfull.isEnabled && !screenfull.isFullscreen) {
      this.allView();
    }
  },
  beforeDestroy() {
    if (screenfull.isFullscreen) {
      screenfull.toggle();
    }
  },
  watch:{
    month(newValue,oldValue){
      this.updateAll();
    }
  },
  methods: {
    allView() {// 默认显示全屏
      screenfull.request();
    },
    goBack() {
      this.$router.back(-1);
    },
    updateAll() {
      // this.getCarouselShiYonglvTable();
      // this.getTopBarData();
      this.getBaofeiBarData();
      //新
      this.getEnTypeData();
      this.getMoreBarData();
      this.getJiaozhunBarData();
      this.getWeihuBarData();
      this.getZichanBarData();
    },
    async getTopBarData() {
      let this_ = this;
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      this.MiddleLeftPieViewList = {data: [],config: { idSelector: "main" },rowNum: 7,color: [],};
      this_.sheBeiDataShow = false;
      this.eBgRateData = { data: [], config: {} };
      this.sheBeiHeChaData = { data: [], config: {} };
      this.jianDingjiaoZhunSheBeiData = { data: [], config: {} };
      this.sheBeiData={ xData: [], data: [], config: { idSelector: "" } };
      this.weiHuSheBeiData = { data: [], config: {} };
      this.bottomData = { xData: [], data: [], config: { idSelector: "" } };
      this.zhuantaiEData = { xData: [], data: [], config: { idSelector: "" } };
      this.sheBeiweiHuData = {xData: [],data: [],config: { idSelector: "" },};
      let sql =
      `select a.Equipments,a1.mony,b.addEquipments,c.testEquipments,c1.testNoEquipments,e.goodEquipments,f.scrapEquipments,g.limitedEquipments,h.weiHuNoEquipments,h1.weiHuEquipments  FROM  
      (select COUNT(*) AS Equipments FROM t_sbdj where di_dian_ = '${didian}') AS a, 
      (select zi_chan_yuan_zhi_ AS mony FROM t_sbdj where  di_dian_ = '${didian}') AS a1, 
      (select COUNT(*) AS addEquipments  FROM t_yqsbysb WHERE bian_zhi_shi_jian LIKE '%${this_.month}%' AND shi_fou_guo_shen_ ='已完成' and  di_dian_ = '${didian}') AS b,
      (select COUNT(*) AS testNoEquipments FROM t_jyxtxzjgyzhqrjlb WHERE bian_zhi_shi_jian LIKE '%${this_.month.slice(0,4)}%' or create_time_ LIKE '%${this_.month.slice(0,4)}%' and  di_dian_ = '${didian}') AS c1,    
      (select COUNT(*) AS testEquipments FROM t_jyxtxzjgyzhqrjlb WHERE bian_zhi_shi_jian LIKE '%${this_.month.slice(0,4)}%' and  shi_fou_guo_shen_ ='已完成' and  di_dian_ = '${didian}') AS c,  
      (select COUNT(*) AS goodEquipments  FROM t_sbdj WHERE she_bei_zhuang_ta ='使用' and  di_dian_ = '${didian}') AS e,    
      (select COUNT(*) AS scrapEquipments  FROM t_sbdj WHERE she_bei_zhuang_ta ='停用' OR she_bei_zhuang_ta ='暂停使用' and  di_dian_ = '${didian}') AS f,      
      (select COUNT(*) AS limitedEquipments  FROM t_sbdj WHERE she_bei_zhuang_ta ='报废' and  di_dian_ = '${didian}') AS g,    
      (select  COUNT(*) AS weiHuNoEquipments FROM t_mjsbwhbyjlby WHERE bian_zhi_shi_jian LIKE '%${this_.month}%' or create_time_ LIKE '%${this_.month}%' and  di_dian_ = '${didian}') AS h,  
      (select COUNT(*) AS weiHuEquipments  FROM t_mjsbwhbyjlby WHERE bian_zhi_shi_jian LIKE '%${this_.month}%' AND shi_fou_guo_shen_ ='已完成' and  di_dian_ = '${didian}') AS h1`
      await curdPost("sql", sql)
        .then((res) => {
          const data = res.variables.data;
          
          let zichan = this_.getAllMonyInt(data);
          zichan = zichan +''
          if(zichan.length > 4){
            zichan =zichan.substring(0,zichan.length-4);
          }
          
          let eIntactnessRate = Number(((data[0].goodEquipments / data[0].Equipments).toFixed(2) * 100 +"").slice(0, 5));
          let eBadRate = Number(((100 - eIntactnessRate).toFixed(4) + "").slice(0, 4));
          let obj = {};
          obj.value = Number(((data[0].goodEquipments / data[0].Equipments).toFixed(4) * 100 +"").slice(0, 5));
          obj.name = "正常设备数";
          this_.MiddleLeftPieViewList.data.push(obj);
          obj = {};
          obj.value = Number(((data[0].scrapEquipments / data[0].Equipments).toFixed(4) * 100 +"").slice(0, 5));
          obj.name = "停用/报废";
          this_.MiddleLeftPieViewList.data.push(obj);
          this_.MiddleLeftPieViewList.color = ["#339933", "#FFFF66", "#FF0033"];
          this_.MiddleLeftPieViewList.config.title = "设备各工作状态数量统计";
          this_.MiddleLeftPieViewList.config.idSelector = "main2";
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
                  label: zichan.length > 4?"总值(万元)": "总值(元)",
                  value: zichan,
                  danwei: "",
                },
              ],
            },
          ];
          //设备数量统计
          // this_.sheBeiData.xData = ["设备总数","新增数","良好数","报废停用数",];
          this_.sheBeiData.xData = ["设备总数","良好数",];
          this_.sheBeiData.data.push(data[0].Equipments);
          // this_.sheBeiData.data.push(data[0].addEquipments);
          this_.sheBeiData.data.push(data[0].goodEquipments);
          // this_.sheBeiData.data.push(data[0].limitedEquipments);
          // this_.sheBeiData.data.push(data[0].scrapEquipments);
          this_.sheBeiData.config.title = "设备完好情况";
          this_.sheBeiData.config.idSelector = "main8";
          this_.sheBeiDataShow = true;
          this_.zhuantaiEData.xData = ["计划检定/校准数","已完成检定/校准数",];
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
          this_.weiHuSheBeiData.config.title = "设备维护完成情况";
          this_.weiHuSheBeiData.config.idSelector = "mainWeiHu";
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
          this_.jianDingjiaoZhunSheBeiData.config.title = "设备检定/校准完成情况";
          this_.jianDingjiaoZhunSheBeiData.config.idSelector = "mainJianDing";
          objRate = {};
          this_.topBarData = result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getCarouselShiYonglvTable() { //设备建档信息
      let this_ = this;
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      const sql = `select a.she_bei_shi_bie_h,a.she_bei_ming_cheng_,a.cun_fang_di_dian_,a.she_bei_zhuang_ta,b.name_ FROM t_sbdj AS a JOIN ibps_party_employee AS b ON a.guan_li_ren_ = b.ID_ where a.di_dian_ = '${didian}'`;
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
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + "-";
      var M =(date.getMonth() + 1 < 10? "0" + (date.getMonth() + 1): date.getMonth() + 1) + "-";
      var D =(date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D;
    },
     async getMoreBarData(){
      const this_ = this;
      this.moreBarData.data.source = [];
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      this.moreBarData.data.dimensions = ['product', '设备总数', '良好数','停用数'];
      let sql1 = `select DISTINCT(a.bian_zhi_bu_men_) ,name_,COUNT(*) AS total FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ where a.di_dian_ = '${didian}' GROUP BY a.bian_zhi_bu_men_`
      let sql2 = `select DISTINCT(a.bian_zhi_bu_men_),name_,COUNT(*) AS total  FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.di_dian_ = '${didian}' and a.she_bei_zhuang_ta ='使用'  GROUP BY a.bian_zhi_bu_men_`
      let sql3 = `select DISTINCT(a.bian_zhi_bu_men_),name_,COUNT(*) AS total  FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.di_dian_ = '${didian}' and a.she_bei_zhuang_ta ='停用'  GROUP BY a.bian_zhi_bu_men_`
      let data1,data2,data3;
      await Promise.all([curdPost('sql', sql1),curdPost('sql', sql2),curdPost('sql', sql3)]).then(([res1, res2,res3]) => {
        if (res1.state == 200) {
           data1 = res1.variables.data
        }
        if(res2.state == 200){
           data2 = res2.variables.data
        }
        if(res3.state == 200){
           data3 = res3.variables.data
        }           
      })
      let source = [];
      data1.forEach((item,index)=>{
        source.push({
          product:item.name_,
          '设备总数':item.total,
          '良好数':0,
          '停用数':0
        })
      })
      data2.forEach(item=>{
        source.forEach((el,index)=>{
          if(item.name_ == el.product){
            source[index]["良好数"] = item.total;
          }
        })
      })
      data3.forEach(item=>{
        source.forEach((el,index)=>{
          if(item.name_ == el.product){
            source[index]["停用数"] = item.total;
          }
        })
      })
      if(source.length == 0){
        this.moreBarData.data.source = [999];
      }else{
        this.moreBarData.data.source = source;
      }
      
      let allTotal = 0,goods = 0 ,deactivates = 0
      source.forEach(item=>{
        allTotal += item["设备总数"];
        goods += item["良好数"];
        deactivates += item["停用数"];
      })
     this.allSheBeiData.data[0].value = allTotal;
     this.allSheBeiData.data[1].value = goods;
     this.allSheBeiData.data[2].value = deactivates;
    },
    async getWeihuBarData(){
      let this_ = this;
      this.weihuBarData.data.source  =[];
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      let sql1 = `select DISTINCT(q.id_) ,q.name_,COUNT(*) AS total  FROM  
      (select DISTINCT(a.she_bei_bian_hao_),b.name_,b.id_ FROM t_mjsbwhjhzb AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.parent_id_ IN 
      (select id_ FROM t_mjsbwhjhb WHERE (bian_zhi_shi_jian LIKE '%${this_.month.slice(0,4)}%' OR create_time_ LIKE '%${this_.month.slice(0,4)}%') AND shi_fou_guo_shen_ = '已完成' AND di_dian_ = '${didian}') GROUP BY a.she_bei_bian_hao_) AS q  GROUP BY q.id_`
      let sql2 = `select DISTINCT(a.bian_zhi_bu_men_) ,name_,COUNT(*) AS total FROM t_mjsbwhbyjlby AS a JOIN ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE (a.bian_zhi_shi_jian LIKE '%${this_.month.slice(0,4)}%' OR a.create_time_ LIKE '%${this_.month.slice(0,4)}%') AND a.shi_fou_guo_shen_ = '已完成' AND a.di_dian_ = '${didian}' GROUP BY a.bian_zhi_bu_men_`
      this.weihuBarData.data.dimensions = ['product', '计划数', '完成数'];
      let data1,data2;
      await Promise.all([curdPost('sql', sql1),curdPost('sql', sql2)]).then(([res1, res2]) => {
        if (res1.state == 200) {
           data1 = res1.variables.data
        }
        if(res2.state == 200){
           data2 = res2.variables.data
        }         
      })
      let source = [];
      data1.forEach((item,index)=>{
        source.push({
          product:item.name_,
          '计划数':item.total,
          '完成数':0
        })
      })
      data2.forEach(item=>{
        let lock = true;
        source.forEach((el,index)=>{
          if(item.name_ == el.product){
            source[index]["完成数"] = item.total;
            lock = false;
          } else if(lock && index == source.length - 1){
            source.push({
              product:item.name_,
              '计划数':0,
              '完成数':item.total
            })
          }
        })
      })
      let allPlan = 0,finishs = 0;
      source.forEach(item=>{
        allPlan += item["计划数"];
        finishs += item["完成数"];
      })
      this.allWeihuSheBeiData.data[0].value = allPlan;
      this.allWeihuSheBeiData.data[1].value = finishs;
      this.moreBarData.data.source.forEach(item=>{
        let lock = true;
        source.forEach((el,index)=>{
          if(item.product == el.product){
            lock = false;
          }
          if(item.product != el.product && index == source.length - 1 && lock){
            source.push({
              product:item.product,
              '计划数':0,
              '完成数':0
            })
          }
        })
      })
      if(source.length == 0){
        this.weihuBarData.data.source =[999]
      }else{
        this.weihuBarData.data.source = source;
      }
    },
    async getZichanBarData(){
      let this_ = this;
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      let sql1 = `select a.bian_zhi_bu_men_,name_,a.zi_chan_yuan_zhi_ FROM t_sbdj AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.di_dian_ = '${didian}' ORDER BY a.bian_zhi_bu_men_ ASC`
      let source = [];
      let data1;
      await Promise.all([curdPost('sql', sql1)]).then(([res1, res2]) => {
        if (res1.state == 200) {
           data1 = res1.variables.data
        }        
      })
      let partyMony = [];
      let i = 0;
        data1.forEach((item,index)=>{
        let zichan;
        zichan  = item.zi_chan_yuan_zhi_;
          if(zichan.includes('.')){
            zichan = zichan.split('.')[0]
          }
          if(zichan =='' || zichan == null || zichan == undefined){
            zichan = "0";
          }
        zichan  = Number(zichan.replace(/\D/g,''));//非数字去掉

        if(partyMony.length == 0){
          partyMony = [{party:item.name_,mony:zichan}];
        }else{
          if(item.name_ == data1[index - 1].name_){
            partyMony[i].mony += zichan;
          }else{
            partyMony.push({party:item.name_,mony:zichan});
            i++;
          }
        }
      })
      let allmony = 0;
      for(let el of partyMony){
        allmony += el.mony;
        el.mony = this.formatNumber(el.mony);
        this.zichangBarData.data.push(el.mony)
        this.zichangBarData.xData.push(el.party)
      }
      this.zichangBarData.data.unshift(this.formatNumber(allmony));
      this.zichangBarData.xData.unshift("检验科");
    },
    formatNumber(num) {
      num = Number(num);
      if (num == 0) {
        return num + "";
      } else {
        if ((num / 10000).toFixed(2) == 0) {
          //小于100的保留2位
          return (num / 100).toFixed(4)
        } else {
          // parseFloat() 去掉后面不用的0，如50.00
          //大于100的保留2位
          return parseFloat((num / 10000).toFixed(2))
        }
      }
    },
    async getJiaozhunBarData(){
      let this_ = this;
      this.jiaozhunBarData.data.source  = [];
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      let sql1 = `select DISTINCT(a.bian_zhi_bu_men_),name_,COUNT(*) AS total FROM t_mjsbjdxzjhzb AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.parent_id_ IN ( SELECT id_ FROM t_mjsbjdxzjh WHERE (bian_zhi_shi_jian LIKE '%${this_.month.slice(0,4)}%' OR create_time_ LIKE '%${this_.month.slice(0,4)}%') AND (shi_fou_guo_shen_ = '已审批' or shi_fou_guo_shen_ = '已完成')) AND a.di_dian_ = '${didian}' GROUP BY a.bian_zhi_bu_men_`
      let sql2 = `select DISTINCT(a.bian_zhi_bu_men_),name_,COUNT(*) AS total FROM t_mjsbjdxzjhzb AS a JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE a.parent_id_ IN ( SELECT id_ FROM t_mjsbjdxzjh WHERE (bian_zhi_shi_jian LIKE '%${this_.month.slice(0,4)}%' OR create_time_ LIKE '%${this_.month.slice(0,4)}%') AND shi_fou_guo_shen_ = '已完成') AND a.di_dian_ = '${didian}' GROUP BY a.bian_zhi_bu_men_`
      this.jiaozhunBarData.data.dimensions = ['product', '计划数', '完成数'];
      let data1,data2;
      await Promise.all([curdPost('sql', sql1),curdPost('sql', sql2)]).then(([res1, res2]) => {
        if (res1.state == 200) {
           data1 = res1.variables.data
        }
        if(res2.state == 200){
           data2 = res2.variables.data
        }         
      })
      let source = [];
      data1.forEach((item,index)=>{
        source.push({
          product:item.name_,
          '计划数':item.total,
          '完成数':0
        })
      })
      data2.forEach(item=>{
        let lock = true;
        source.forEach((el,index)=>{
          if(item.name_ == el.product){
            source[index]["完成数"] = item.total;
            lock = false;
          }
          if(lock && index == source.length - 1){
            source.push({
              product:item.name_,
              '计划数':0,
              '完成数':item.total,
            })
          }
        })
      })
      let allPlan = 0,finishs = 0;
      source.forEach(item=>{
        allPlan += item["计划数"];
        finishs += item["完成数"];
      })
      this.allJiaozhunSheBeiData.data[0].value = allPlan;
      this.allJiaozhunSheBeiData.data[1].value = finishs;
      this.moreBarData.data.source.forEach(item=>{
        let lock = true;
        source.forEach((el,index)=>{
          if(item.product == el.product){
            lock = false;
          }
          if(item.product != el.product && index == source.length - 1 && lock){
            source.push({
              product:item.product,
              '计划数':0,
              '完成数':0
            })
          }
        })
      })
      if(source.length == 0){
        this.jiaozhunBarData.data.source = [999];
        
      }else{
        this.jiaozhunBarData.data.source = source;
      }
      
    },
    async getBaofeiBarData() {
      this.config = {
        header: ["设备名称", "编号", "状态"],
        columnWidth: ["220","110", "70"],
        rowNum: 6,
        data: [],
      };
      let this_ = this;
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      // const sql =`select * from t_sbdj where (she_bei_zhuang_ta ='停用' or she_bei_zhuang_ta ='报废' or she_bei_zhuang_ta ='报废/停用') and  di_dian_ = '${didian}'`;
      let sql = `select a.she_bei_ming_cheng_, a.she_bei_shi_bie_h,a.she_bei_zhuang_ta,b.name_ FROM t_sbdj AS a  JOIN  ibps_party_position AS b ON a.bian_zhi_bu_men_ = b.id_ WHERE she_bei_zhuang_ta ='停用' AND a.di_dian_ = '${didian}' ORDER BY a.bian_zhi_bu_men_ DESC`
      let data1 = [];
      await curdPost("sql", sql)
        .then((res) => {
          const result = res.variables.data;
          if(result.length == 0){
            this_.BaofeiBarData.data = [999]
          }
          result.forEach((item) => {
            data1 = [];
            data1.push(item.name_);
            data1.push(item.she_bei_ming_cheng_);
            data1.push(item.she_bei_shi_bie_h);
            data1.push(item.she_bei_zhuang_ta);
            this_.BaofeiBarData.data.push(data1);
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
        if (item.mony  && item.mony.includes("元")) {
          
          filterMony = item.mony.slice(0, item.mony.length - 1) * 1;
          mony += filterMony;
        }
      });
      
      return mony;
    },
    async getEnTypeData(){
      let this_ = this;
      let didian = "";
      this_.$store.getters.level.second ? didian = this_.$store.getters.level.second:didian = this_.$store.getters.level.first;
      let sql = `select DISTINCT(she_bei_lei_xing_),COUNT(*) AS total  FROM t_sbdj where di_dian_ = '${didian}' GROUP BY she_bei_lei_xing_`;
      let data = await curdPost("sql", sql);
      data  =  data.variables.data;
      
      let dataTypes = [
        {she_bei_lei_xing_:"检验系统",total:"0"},
        {she_bei_lei_xing_:"通用设备",total:"0"},
        {she_bei_lei_xing_:"软件",total:"0"},
        {she_bei_lei_xing_:"信息系统",total:"0"},
      ]
      dataTypes.forEach(item=>{
        data.forEach(el=>{
          if(item.she_bei_lei_xing_ == el.she_bei_lei_xing_){
            item.total = el.total;
          }
        })
      })
      
      let objJianding = {};
      this_.enTypeData.data = [];
      console.log(this_.enTypeData)
      // dataTypes.forEach(item=>{
        for(let item of dataTypes){
        objJianding = {};
        objJianding.name = item.she_bei_lei_xing_;
        objJianding.value = item.total;
        this_.enTypeData.data.push(objJianding);
      }
      this_.enTypeData.color = ["#339933","#3366CC", "#FF9933", "#FFFF00"];
      this_.enTypeData.config.title = "检验科各型设备分布情况";
      console.log(this_.enTypeData,"分布")
      this_.enTypeData.config.idSelector = "enTypeId";
    }
  },
};
</script>
<style lang="scss" scoped>
   ::v-deep.el-input--small .el-input__inner {
        background-color: rgb(7 16 43 / 50%);
        color: white;
        border: none;
      }
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
    .time,.back {
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
      width: 154px;
      right: 75%;

    }
    .back {
      left: 75%;
    }
  }    

  .topCard {
    height: 30%;
    margin-top: 10px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .middleCard {
    height: 31%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .bottomCard {
    height: 31%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .topCard,
  .middleCard,
  .bottomCard {
    width: 96%;
    margin-left: 30px;
    div {
      display: inline-block;
    }
    .middleCardLeft {
      // width: 28%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .middleCardRight {
      // width: 25%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .middleCardRight1 {
      // width: 43%;
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
