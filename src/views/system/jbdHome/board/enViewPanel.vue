<template>
  <div class="test-content">
    <div class="title">
      <div class="title-center" style="font-size: 26px; color: #c12530">
        设施环境控制图
      </div>
      <div class="info-right">
        <span style="color: #c12530; margin-right: 5px">采集时间:</span><span style="color: #276bcc; margin-right: 15px">{{ newTiMe }}</span>
        <button @click="returnBlack" class="black">返回</button>
      </div>
    </div>
    <div class="body-content">
      <div class="marquee-wrap" v-if="false">
        <div>
          <ul class="marquee-list" :class="{ 'animate-up': animateUp }" :style="{ width: btnShow ? '360px' : '0px' }">
            <li v-for="(item, index) in envirListData" :key="index" >
              <span>{{ item.deviceName }}</span> &nbsp;
              <span>{{ item.t1 | numToFixed }}</span>&nbsp; <span>{{ item.h1 | numToFixed }}</span>&nbsp; <span>{{ item.p1 | numToFixed }}</span>&nbsp;
            </li>
          </ul>
          <div class="button">
            <i class="el-icon-caret-right" @click="btnextendRight"></i>
            <i class="el-icon-caret-left" @click="btnextendLeft"></i>
          </div>
        </div>
      </div>
      <div class="mapShow" @click="dropCoordinate">
        <div class="mapurl"></div>
        <div class="img-box" >
          <img src="~@/assets/images/screen/laboratory.jpg" class="img" alt="" ref="wrap" />
          <div ref="shijiku1" v-for="(item, index) in newweizhi" :key="index" :style="{ top: `${item.y}px`, left: `${item.x}px` }" :class="[item.run == '1' ? item.ifshow == 'false' ? 'shiyanshi_false' : 'shiyanshi_success' : 'bggray', ]">
            <div :class="[item.ifshow == 'false' ? 'contentshow' : 'content']" v-show="item.run == 1">
              <div class="envir-conditoin" v-show="item.temp ? true : false">
                温度:{{ item.temp|numToFixed }}
              </div>
              <div class="envir-conditoin" v-show="item.humidness ? true : false">
                湿度:{{ item.humidness|numToFixed }}
              </div>
              <div class="envir-conditoin" v-if="item.airPressure != 66">气压:{{ item.airPressure|numToFixed}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="controlStatus">
        <div class="noControl">
          <span class="gray"></span><span style="margin-left: 30px">未控</span>
        </div>
        <div class="yesControl">
          <span class="green"></span>
          <span style="margin-left: 30px">在控</span>
        </div>
        <div class="runWild">
          <span class="red"></span>
          <span><span style="margin-left: 30px">失控</span> </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
export default {
  name: "DataView",
  data() {
    return {
      btnShow: true,
      animateUp: false,
      envirListData: [],
      fullHeight: "",
      fullWidth: "",
      list: [
        {
          room: "*HAU01",
          time: "2020-07-08 18:27:23",
          temp: "20",
        },
        {
          room: "*HAU01",
          time: "2020-07-08 18:27:23",
          temp: "20",
        },
        {
          room: "*HAU01",
          time: "2020-07-08 18:27:23",
          temp: "20",
        },
        {
          room: "*HAU01",
          time: "2020-07-08 18:27:23",
          temp: "20",
        },
        {
          room: "*HAU01",
          time: "2020-07-08 18:27:23",
          temp: "20",
        },
      ],
      screen: [],
      x: 396,
      y: 453,
      newposition: [],
      newweizhi: [],
      newTiMe: "",
      weizhi: [
        { x: 456, y: 179},
        { x: 826, y: 179},
        { x: 1200, y: 179},
        { x: 1387, y: 179},
        { x: 1675, y: 179},
        { x:349, y:370},
        { x:1462, y:365},
        {x:360, y:570},
        {x:225, y:704},
        {x:398, y:704},
        {x:1475, y:680},
        {x:1475, y:725},
      ],
      domsize: [
        {
          width: 1560,
          height: 857,
        },
      ],
      timelistData: [],
      ifshow: true,
      setIntervalDis: false,
    };
  },
  filters: {
    numToFixed: function (value) {
      let str = value.toString();
      let strIndex = str.indexOf('.');
      str = str.substring(0, strIndex + 3);
      return str;
    },
  },
  methods: {
    dropCoordinate(e){
      console.log(e.offsetX,e.offsetY,"坐标",e.clientX,e.clientY)
    },
    envirData() {
      let sqlString ="select * FROM DATA WHERE deviceName IN ('HAU01','HAU02','HAU03','HAU04','PAU01','PAU02')  ORDER BY saveTime DESC LIMIT 12";
      var this_ = this;
      curdPost("sql", sqlString).then((response) => {
        this_.envirListData = response.variables.data;
      });
    },
    returnBlack() {
      this.$router.back(-1);
    },
    fmtDate(obj) {
      var date = new Date(obj);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      var h = date.getHours();
      var min = date.getMinutes();
      if(h <10){
        h = '0'+h
      }
      if(min <10){
        min = '0' + min
      }
      var s = date.getMinutes();
      if(s<10){
        s = '0' +s;
      }
      return (y +"-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + "  " + h + ":" + min + ":" + s);
    },
    scrollAnimate() {
      let this_ = this;
      let sqlString = "select * FROM DATA WHERE deviceName IN ('HAU01','HAU02','HAU03','HAU04','PAU01','PAU02')  ORDER BY saveTime DESC LIMIT 6";
      let newdata = [];
      curdPost("sql", sqlString).then((response) => {
        newdata = response.variables.data;
        this_.newTiMe = this_.fmtDate(newdata[0].saveTime);
        for (let i = 0; i < newdata.length; i++) {
          setTimeout(() => {
            this_.envirListData.push(newdata[i]);
            this_.envirListData.shift();
            this_.animateUp = true;
          }, 3000 * (i + 1));
        }
      });
    },
    btnextendRight() {
      this.btnShow = !this.btnShow;
      this.screenChange();
      this.mapChange();
    },
    btnextendLeft() {
      this.btnShow = !this.btnShow;
      this.screenChange();
      this.mapChange();
    },
    screenChange() {
      this.fullHeight = `${document.documentElement.clientHeight}`;
      const that = this;
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          that.fullHeight = window.fullHeight;
        })();
      };
    },
    mapChange() {//图片大小加载
      let this_ = this;
      //1908 1000/843 
      // setTimeout(() => { 
        var dom = document.getElementsByClassName("img");
        // alert(this_.domsize[0].width,this_.domsize[0].height)
         console.log(this_.domsize[0])
        this_.screen = [];
        this_.screen.push(dom[0].clientWidth);
        this_.screen.push(dom[0].clientHeight);
        this_.newweizhi = [];
        this_.weizhi.forEach((item, index) => {
          this_.x = parseInt((item.x * window.innerWidth) / this_.domsize[0].width/1.23);
           this_.y = parseInt((item.y * window.innerHeight) / this_.domsize[0].height/1.075);
          //  this_.x = item.x;
          // this_.y = item.y;
          var newobj = {
            x: this_.x,
            y: this_.y,
            temp: "",
            humidness: "",
            airPressure: "",
            ifshow: "",
            run: "1",
          };
          this_.newweizhi.push(newobj);
        });
      // }, 0);
    },
    setIntervalData() { //刷新频率
      let this_ = this;
      var timer = setInterval(() => {
        if (this_.setIntervalDis == true) {
          clearInterval(timer);
          return;
        }
        this_.screenChange();
        this_.mapChange();
        this_.dataLoad();
      }, 300000); 
    },
    returnifShow(t, h, p, qiya, qiyaer) {
      let ifshow = "";
      let temp =  t.toFixed(2); //温度
      let humidness = Number(h.toFixed(2)) ; //湿度
      let airPressure = Number(p.toFixed(2)); //气压
      if (temp > 999 || temp <= 0) { //不给予赋值
      } else if (temp >= 18 && temp <= 26) {
        ifshow = "true";
      } else {
        ifshow = "false";
      }
      if (humidness > 999 || humidness <= 0) {
      } else if (humidness >= 35 && humidness <= 75) {
        ifshow = "true";
      } else {
        ifshow = "false";
      }

      if (airPressure >= 999) { //不给予赋值
      } else if (airPressure >= qiya && airPressure <= qiyaer && airPressure >0) {
        ifshow = "true";
      } else if (airPressure <= qiya && airPressure >= qiyaer && airPressure <= 0) {
          ifshow = "true";
      }
       else {
        ifshow = "false";
      }
      return ifshow;
    },

    async dataLoad() {  // 大屏数据列表赋值
      let this_ = this;
      let zhi_wu_yi_run = "";
      let time = new Date();
      this_.newTiMe = time.toLocaleString().replace(/\//g, "-");
      for(let i in this_.newweizhi){
        this_.newweizhi[i].temp = 25;
        this_.newweizhi[i].humidness = 65;
        this_.newweizhi[i].airPressure = 65;
        this_.newweizhi[i].run = "1";
        this_.newweizhi[0].ifshow = true;
      }
      // let sql =  "select * FROM DATA WHERE deviceName = 'HAU01'  ORDER BY saveTime DESC LIMIT 1"; //细胞的退更缓冲区域
      // await curdPost("sql", sql).then((res) => {
      //   let data = res.variables.data;
      //   this_.newweizhi[0].temp = data[0].t1;
      //   this_.newweizhi[0].humidness = data[0].h1;
      //   this_.newweizhi[0].airPressure = data[0].p6;
      //   this_.newweizhi[0].run = data[0].run;
      //   this_.newTiMe = this_.fmtDate(data[0].saveTime);
      //   this_.newweizhi[0].ifshow = this_.returnifShow(
      //     //细胞1数据范围校准
      //     data[0].t1,
      //     data[0].h1,
      //     data[0].p6,
      //     5,
      //     9999
      //   );

      //   this_.newweizhi[1].temp = data[0].t2;
      //   this_.newweizhi[1].humidness = data[0].h2;
      //   this_.newweizhi[1].airPressure = data[0].p7;
      //   this_.newweizhi[1].run = data[0].run;
      //   this_.newweizhi[1].ifshow = this_.returnifShow(
      //     ////细胞2
      //     data[0].t2,
      //     data[0].h2,
      //     data[0].p7,
      //     5,
      //     9999
      //   );

      //   this_.newweizhi[2].temp = data[0].t3;
      //   this_.newweizhi[2].humidness = data[0].h3;
      //   this_.newweizhi[2].airPressure = data[0].p8;
      //   this_.newweizhi[2].run = data[0].run;
      //   this_.newweizhi[2].ifshow = this_.returnifShow(
      //     //细胞三
      //     data[0].t3,
      //     data[0].h3,
      //     data[0].p8,
      //     5,
      //     9999
      //   );
      //   this_.newweizhi[3].temp = data[0].t4;
      //   this_.newweizhi[3].humidness = data[0].h4;
      //   this_.newweizhi[3].airPressure = data[0].p9;
      //   this_.newweizhi[3].run = data[0].run;
      //   this_.newweizhi[3].ifshow = this_.returnifShow(
      //     //细胞四
      //     data[0].t4,
      //     data[0].h4,
      //     data[0].p9,
      //     5,
      //     9999
      //   );
      //   this_.newweizhi[14].airPressure = data[0].p1; //; 1更
      //   this_.newweizhi[14].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p1,
      //     10,
      //     9999
      //   );
      //   this_.newweizhi[14].run = data[0].run;

      //   this_.newweizhi[15].airPressure = data[0].p3; //2更
      //   this_.newweizhi[15].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p3,
      //     5,
      //     9999
      //   );
      //   this_.newweizhi[15].run = data[0].run;
      //   this_.newweizhi[16].airPressure = data[0].p4; //退更缓冲
      //   this_.newweizhi[16].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p4,
      //     5,
      //     9999
      //   );
      //   this_.newweizhi[16].run = data[0].run;

      //   this_.newweizhi[17].airPressure = data[0].p1; //退更
      //   this_.newweizhi[17].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p1,
      //     10,
      //     9999
      //   );
      //   this_.newweizhi[17].run = data[0].run;
      //   this_.newweizhi[18].airPressure = data[0].p5; //万级洁净走廊
      //   this_.newweizhi[18].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p5,
      //     5,
      //     9999
      //   );
      //   this_.newweizhi[18].run = data[0].run;
      // });
      // let sql1 =
      //   "select * FROM DATA WHERE deviceName ='HAU02'  ORDER BY saveTime DESC LIMIT 1";
      // await curdPost("sql", sql1).then((res) => {
      //   let data = res.variables.data;
      //   this_.newweizhi[4].temp = data[0].t1; //分练区1
      //   this_.newweizhi[4].humidness = data[0].h1;
      //   this_.newweizhi[4].airPressure = data[0].p1;
      //   this_.newweizhi[4].run = data[0].run;
      //   this_.newweizhi[4].ifshow = this_.returnifShow(
      //     data[0].t1,
      //     data[0].h1,
      //     data[0].p1,
      //     -15,
      //     -35
      //   );
      //   this_.newweizhi[5].temp = data[0].t2; //分练区2
      //   this_.newweizhi[5].humidness = data[0].h2;
      //   this_.newweizhi[5].airPressure = data[0].p2;
      //   this_.newweizhi[5].run = data[0].run;

      //   this_.newweizhi[5].ifshow = this_.returnifShow(
      //     data[0].t2,
      //     data[0].h2,
      //     data[0].p2,
      //     -15,
      //     -35
      //   );

      //   this_.newweizhi[19].airPressure = data[0].p3;
      //   this_.newweizhi[19].ifshow = this_.returnifShow(
      //     //1更
      //     999,
      //     999,
      //     data[0].p3,
      //     10,
      //     999
      //   );
      //   this_.newweizhi[19].run = data[0].run;

      //   this_.newweizhi[20].airPressure = data[0].p4;
      //   this_.newweizhi[20].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p4,
      //     10,
      //     999
      //   );
      //   this_.newweizhi[20].run = data[0].run;
      //   this_.newweizhi[21].airPressure = data[0].p5;
      //   this_.newweizhi[21].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p5,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[21].run = data[0].run;
      // });
      // let sql2 ="select * FROM DATA WHERE deviceName ='HAU03' ORDER BY saveTime DESC LIMIT 1"; //支原体室
      // await curdPost("sql", sql2).then((res) => {
      //   let data = res.variables.data;
      //   this_.newweizhi[6].temp = data[0].t1;
      //   this_.newweizhi[6].humidness = data[0].h1;
      //   this_.newweizhi[6].airPressure = data[0].p1;
      //   this_.newweizhi[6].run = data[0].run;
      //   this_.newweizhi[6].ifshow = this_.returnifShow(
      //     data[0].t1,
      //     data[0].h1,
      //     data[0].p1,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[22].airPressure = data[0].p2; //支原体 与无菌共用一更
      //   this_.newweizhi[22].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p2,
      //     10,
      //     999
      //   );
      //   this_.newweizhi[22].run = data[0].run;
      //   zhi_wu_yi_run = data[0].run;
      //   this_.newweizhi[23].airPressure = data[0].p3;
      //   this_.newweizhi[23].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p3,
      //     10,
      //     999
      //   );
      //   this_.newweizhi[23].run = data[0].run; //二更

      //   this_.newweizhi[24].airPressure = data[0].p4;
      //   this_.newweizhi[24].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p4,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[24].run = data[0].run; //缓冲
      // });
      // let sql3 ="select * FROM DATA WHERE deviceName ='HAU04'  ORDER BY saveTime DESC LIMIT 1";
      // await curdPost("sql", sql3).then((res) => {
      //   let data = res.variables.data;
      //   this_.newweizhi[7].temp = data[0].t1; //无菌检测室
      //   this_.newweizhi[7].humidness = data[0].h1;  
      //   this_.newweizhi[7].airPressure = data[0].p1;
      //   this_.newweizhi[7].run = data[0].run;
      //   this_.newweizhi[7].ifshow = this_.returnifShow(
      //     data[0].t1,
      //     data[0].h1,
      //     data[0].p1,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[22].airPressure = data[0].p4; //支原体 与无菌共用一更
      //   this_.newweizhi[22].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p4,
      //     10,
      //     999
      //   );
      //   zhi_wu_yi_run != 1 ? (this_.newweizhi[22].run = data[0].run) : "";

      //   this_.newweizhi[25].airPressure = data[0].p2;
      //   this_.newweizhi[25].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p2,
      //     10,
      //     999
      //   );
      //   this_.newweizhi[25].run = data[0].run; //二更
      //   this_.newweizhi[26].airPressure = data[0].p3;
      //   this_.newweizhi[26].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p3,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[26].run = data[0].run;//缓冲
      // });
      // let sql4 ="select * FROM DATA WHERE deviceName ='PAU01'  ORDER BY saveTime DESC LIMIT 1";
      // await curdPost("sql", sql4).then((res) => {
      //   let data = res.variables.data;
      //   this_.newweizhi[8].temp = data[0].t1;
      //   this_.newweizhi[8].humidness = data[0].h1;
      //   this_.newweizhi[8].airPressure = data[0].p1; //产物
      //   this_.newweizhi[8].run = data[0].run;
      //   this_.newweizhi[8].ifshow = this_.returnifShow(
      //     data[0].t1,
      //     data[0].h1,
      //     data[0].p1,
      //     -15,
      //     -45
      //   );

      //   this_.newweizhi[9].temp = data[0].t2;
      //   this_.newweizhi[9].humidness = data[0].h2;
      //   this_.newweizhi[9].airPressure = data[0].p2; //扩增
      //   this_.newweizhi[9].run = data[0].run;
      //   this_.newweizhi[9].ifshow = this_.returnifShow(
      //     data[0].t2,
      //     data[0].h2,
      //     data[0].p2,
      //     -15,
      //     -35
      //   );

      //   this_.newweizhi[10].temp = data[0].t3;
      //   this_.newweizhi[10].humidness = data[0].h3;
      //   this_.newweizhi[10].airPressure = data[0].p3; //样本制备
      //   this_.newweizhi[10].run = data[0].run;
      //   this_.newweizhi[10].ifshow = this_.returnifShow(
      //     data[0].t3,
      //     data[0].h3,
      //     data[0].p3,
      //     5,
      //     999
      //   );

      //   this_.newweizhi[11].temp = data[0].t4;
      //   this_.newweizhi[11].humidness = data[0].h4;
      //   this_.newweizhi[11].airPressure = data[0].p4 //试剂准备
      //   this_.newweizhi[11].run = data[0].run;
      //   this_.newweizhi[11].ifshow = this_.returnifShow(
      //     data[0].t4,
      //     data[0].h4,
      //     data[0].p4,
      //     15,
      //     999
      //   );

      //   this_.newweizhi[28].airPressure = data[0].p9; //试剂准备缓冲
      //   this_.newweizhi[28].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p9,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[28].run = data[0].run;

      //   this_.newweizhi[29].airPressure = data[0].p6; 
      //   this_.newweizhi[29].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p6,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[29].run = data[0].run;//产物缓冲
      //   this_.newweizhi[30].airPressure = data[0].p7; 
      //   this_.newweizhi[30].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p7,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[30].run = data[0].run; //扩增缓冲

      //   this_.newweizhi[31].airPressure = data[0].p8; 
      //   this_.newweizhi[31].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p8,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[31].run = data[0].run; //样本缓冲三

      //   this_.newweizhi[27].run = data[0].run;
      //   this_.newweizhi[27].airPressure = data[0].p5; //PCR走廊
      //   this_.newweizhi[27].ifshow = this_.returnifShow(
      //     999,
      //     999,
      //     data[0].p5,
      //     5,
      //     999
      //   );
      //   this_.newweizhi[27].run = data[0].run;
      // });
      // let sql5 ="select * FROM DATA WHERE deviceName ='PAU02'  ORDER BY saveTime DESC LIMIT 1";
      // await curdPost("sql", sql5).then((res) => {
      //   let data = res.variables.data;
      //   this_.newweizhi[12].temp = data[0].t1; //无菌阳性制备室
      //   this_.newweizhi[12].humidness = data[0].h1;
      //   this_.newweizhi[12].airPressure = data[0].p2;
      //   this_.newweizhi[12].run = data[0].run;
      //   this_.newweizhi[12].ifshow = this_.returnifShow(
      //     data[0].t1,
      //     data[0].h1,
      //     data[0].p2,
      //     -10,
      //     -30
      //   );
        // this_.newweizhi[13].temp = data[0].t2; //支原体阳性制备室
        // this_.newweizhi[13].humidness = data[0].h2;
        // this_.newweizhi[13].airPressure = data[0].p1;
        // this_.newweizhi[13].run = data[0].run;

        // this_.newweizhi[13].ifshow = this_.returnifShow(
        //   data[0].t2,
        //   data[0].h2,
        //   data[0].p1,
        //   -10,
        //   -35
        // );

        // this_.newweizhi[33].airPressure = data[0].p5;
        // this_.newweizhi[33].ifshow = this_.returnifShow(
        //   999,
        //   999,
        //   data[0].p5,
        //   5,
        //   999
        // );
        // this_.newweizhi[33].run = data[0].run; //无菌阳性二更

        // this_.newweizhi[34].airPressure = data[0].p7; //无菌阳性缓冲
        // this_.newweizhi[34].ifshow = this_.returnifShow(
        //   999,
        //   999,
        //   data[0].p7,
        //   5,
        //   999
        // );
        // this_.newweizhi[34].run = data[0].run;

        // this_.newweizhi[35].airPressure = data[0].p4; //支原体二更
        // this_.newweizhi[35].ifshow = this_.returnifShow(
        //   999,
        //   999,
        //   data[0].p4,
        //   5,
        //   999
        // );
        // this_.newweizhi[35].run = data[0].run;

        // this_.newweizhi[37].airPressure = data[0].p3; //无菌阳性 支原体 一更
        // this_.newweizhi[37].ifshow = this_.returnifShow(
        //   999,
        //   999,
        //   data[0].p3,
        //   10,
        //   999
        // );
        // this_.newweizhi[37].run = data[0].run;

        // this_.newweizhi[36].airPressure = data[0].p6; //支原体性缓冲
        // this_.newweizhi[36].ifshow = this_.returnifShow(
        //   999,
        //   999,
        //   data[0].p6,
        //   5,
        //   999
        // );
        // this_.newweizhi[36].run = data[0].run;
      // });
    },
  },
  mounted() {
    this.envirData();
    this.screenChange();
    this.mapChange();
    this.dataLoad();
    this.setIntervalData();
  },
  destroyed() {
    this.setIntervalDis = true;
  },
  watch: {// 如果 `fullHeight ` 发生改变，这个函数就会运行
    fullHeight: function (val) {
      this.screenChange();
      this.mapChange();
      this.dataLoad();
    },
  },
};
</script>

<style lang="less" scoped>
ul,li {
  margin: 0;
  padding: 0;
}

.test-content {
  width: 100%;
  height: 100%;
  color: #fff;
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: hidden;
  -webkit-transform-origin: left top;
  transform-origin: left top;
  z-index: 999;
  background: #f5f5f5;
  .title {
    text-align: center;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    .title-center {
      color: #1d1f22;
      display: inline-block;
    }
    .info-right {
      position: absolute;
      top: 0px;
      right: 0px;
    }
    .black {
      opacity: 0;
    }
    .black:hover {
      opacity: 1;
      color: black;
    }
  }
  .body-content {
    display: flex;
    border: 1px solid bisque;
    .marquee-wrap {
      position: relative;
      flex-grow: 0;
      background-color: #f5f5f5;
      overflow: hidden;
      .button {
        position: absolute;
        top: 50%;
        right: -8px;
        color: black;
        opacity: 0;
        i {
          font-size: 30px;
          width: 30px;
          height: 30px;
        }
        .button:hover {
          opacity: 1;
        }
      }
    }
    .marquee-list li {
      text-overflow: ellipsis;
      width: 100%;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
      list-style: none;
      line-height: 40px;
      text-align: center;
      color: #1d1f22;
      font-size: 18px;
      font-weight: 400;
      text-align: left;
      padding-left: 10px;
    }
    .animate-up {
      transition: all 0.5s ease-in-out;
      transform: translateY(-40px);
    }

    .infoShow {
      flex-grow: 0;
      width: 360px;
      padding-left: 20px;
      background-color: #ffffff;
      .title {
        text-align: left;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        margin-left: 10px;
        color: #666666;
      }
      .control-data {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .active {
          background: #f56c6c;
        }
        .dmo {
          margin-top: 10px;
          margin-left: 10px;
          display: flex;
          border: 2px solid #67a8ec;
          padding: 5px;
          border-radius: 5px;
          .left-icon {
            text-align: center;
            .room-name {
              color: #333333;
            }
          }
          .right-target {
            margin-left: 5px;
            color: #666;
            font-size: 12px;

            .item {
              height: 20px;
              line-height: 20px;
            }
            .item_active {
              color: rgb(171, 252, 10);
            }
          }
          .right-target > div > span {
            color: #338de6;
          }
        }
      }
    }
    .mapShow {
      margin-right: 10px;
      flex-grow: 1;
      .mapurl {
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center 0;
      }
    }
    .img-box {
      width: 100%;
      padding-right: 100px;
      position: relative;
      .img {
        background-size: contain;
        width: 100%;
        height: calc(100vh - 80px);
      }
      .shiyanshi_success {
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 50%;
        z-index: 99;
        animation: traffic-light 2s linear 4s infinite;
        text-align: center;
        background: green;
        // @keyframes traffic-light {
        //   from {
        //     background: transparent; /* 黄灯 */

        //     box-shadow: 0px 0 15px 0 transparent; /* 黄灯光影 */
        //   }
        //   50% {
        //     background: #a7f09e; /* 黄灯 */

        //     box-shadow: 0px 0 15px 0 #82d277; /* 黄灯光影 */
        //   }
        //   to {
        //     background: transparent; /* 黄灯 */

        //     box-shadow: 0px 0 15px 0 transparent; /* 黄灯光影 */
        //   }
        // }
      }
      .shiyanshi_false {
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 50%;
        z-index: 99;
        animation: waring-false 1s linear 0s infinite;
        text-align: center;
        background: #fa0404;
        @keyframes waring-false {
          from {
            background: transparent; /* 黄灯 */

            box-shadow: 0px 0 15px 0 transparent; /* 黄灯光影 */
          }
          50% {
            background: #fa0404; /* 黄灯 */

            box-shadow: 0px 0 15px 0 #fa0404; /* 黄灯光影 */
          }

          to {
            background: transparent; /* 黄灯 */

            box-shadow: 0px 0 15px 0 transparent; /* 黄灯光影 */
          }
        }
      }
      .bggray {
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 50%;
        animation: traffic-light 2s linear 4s infinite;
        text-align: center;
        background: #828282 !important;
      }
      .contentshow {
        position: absolute;
        z-index: 99;
        width: 90px;
        left: 25px;
        top: 5px;
        color: black;
        z-index: 99;
      }
      /deep/ .envir-conditoin {
        text-align: left;
        width: 80px;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        z-index: 999;
      }
      .content {
        position: absolute;
        z-index: 99;
        width: 90px;
        left: 0px;
        top: 0px;
        padding-top: 15px;
        height: 64px;
        color: black;
        opacity: 0;
        padding-left: 20px;
      }
      .content:hover {
        opacity: 1;
      }
    }
  }
  .controlStatus {
    position: fixed;
    right: 5px;
    bottom: 10px;
    z-index: 99;
    color: black;
    font-size: 18px;
    div {
      display: inline-block;
      margin-right: 30px;
    }
    .gray,
    .green,
    .red {
      width: 20px;
      height: 20px;
      position: absolute;
      border-radius: 50%;
      text-align: center;
      padding-right: 5px;
    }
    .noControl {
      .gray {
        background: #828282;
      }
    }
    .yesControl {
      .green {
        background: green;
      }
    }
    .runWild {
      .red {
        background: red;
      }
    }
  }
}
</style>