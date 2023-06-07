<template>
  <div class="sample-content">
    <div @click="clickBtn" style="cursor: pointer">
      <!-- <div>点击视图选择位置</div> -->
      <el-input
        placeholder="请输入内容"
        :value="showValue"
        id="valueDom"
      ></el-input>
    </div>
    <!-- 表格組件 -->
    <div class="selectArea" v-if="ifshow">
      <div @click="close" class="close-content">
        <i class="el-icon-close"></i
        ><el-button class="closeBtn">关闭视图</el-button>
      </div>
      <div class="top-content">
        <div class="top-title">仓库可视化</div>
        <div class="query-content">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="仓库名称：">
              <el-select
                v-model="formInline.cang_ku_ming_chen_value"
                placeholder="请选择样品"
              >
                <el-option
                  v-for="(item, index) in cangkuOption"
                  :key="index"
                  placeholder="区域"
                  :label="item.cang_ku_ming_chen"
                  :value="item.cang_ku_ming_chen"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 50px" label="区域名称：">
              <el-select
                v-model="formInline.qu_yu_value"
                placeholder="请选择区域名称"
              >
                <el-option
                  v-for="(item, index) in quyu_arr"
                  :key="index"
                  placeholder="区域"
                  :label="item.qu_yu_"
                  :value="item.qu_yu_"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <button
                type="button"
                class="el-button el-button--primary el-button--mini"
                @click="onSubmits"
              >
                <i class="ibps-icon-search"></i><span>查询</span>
              </button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="test-quyu">
        <div class="test-list">
          <ul class="list-items">
            <li
              class="list-item quyu-item"
              :style="{
                background: quyuShow == item.qu_yu_ ? '#FF9900' : '#e5baba',
              }"
              @click="qu_yu_Event"
              v-for="item in quyu_arr"
              :key="item.qu_yu_"
            >
              <div v-if="item.qu_yu_.includes('冰箱')">
                {{ item.qu_yu_ | freezerFilters }}({{ item.cun_chu_tiao_jian }})
              </div>

              <div v-if="!item.qu_yu_.includes('冰箱')">
                {{ item.qu_yu_ | freezerFilters }}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="body-content">
        <div class="right-view">
          <div class="goods-items">
            <div
              class="show-demo"
              v-for="(item, index) in listData"
              :key="index"
            >
              <div>
                <div class="goods-level">
                  <div class="level-dsc">
                    第{{ index | indexfilter(listData) }}层
                  </div>
                  <div class="goods-list">
                    <div
                      v-for="(it, index) in listData[index]"
                      :key="index"
                      class="goods-dsc"
                      :style="{
                        background: !it.wu_liao_bian_ma_ ? '#67c23a' : '',
                      }"
                      @click="closeView(it)"
                    >
                      <div class="top-dsc">
                        <div class="position">
                          <p>名称：{{ it.wu_pin_ming_chen }}</p>
                          <p>编码：{{ it.wu_liao_bian_ma_ || "空" }}</p>
                          <p>位置：{{ it.cun_fang_wei_zhi_ || "空" }}</p>
                          <p>货号:{{ it.huo_hao_ || "空" }}</p>
                        </div>
                        <div class="right-content">
                          <p>入库批号:{{ it.ru_ku_pi_hao_ || "空" }}</p>
                          <p>存储条件:{{ it.cun_chu_yao_qiu_ || "空" }}</p>
                          <p>有效期:{{ it.you_xiao_qi_ || "空" }}</p>
                          <p>库存量：{{ it.ku_cun_liang_ || "空" }}</p>
                        </div>
                        <!-- <div class="condition">{{ it.cun_chu_tiao_jian }}</div> -->
                      </div>
                      <div class="bottom-dsc">
                        <!-- {{ it.wu_pin_ming_cheng | specimenFilters }} -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="goodshelf-name" v-if="index == 1">
                {{ desString }}
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
export default {
  data() {
    return {
      ifshow: false,
      showValue: "点击选择位置",
      cangkuOption: [],
      formInline: {
        cang_ku_ming_chen_value: " 次级仓库",
        qu_yu_value: "6号冰箱",
        huo_jia_value: "",
      },
      huojiaInfo: {
        empty: "",
        al: "",
      },
      listData: [],
      desString: "",
      warehouseOptions: [],
      quyu_arr: [],
      huo_jia_arr: [],
      // qu_yu_value: "",
      desShow: true,
      quyuShow: "",
      huojiashow: "",
      firstLoadActive: "false",
      selectActive: "",
      cenghao: [],
      warehouse: [],
      loading: false,
      pagination: {},
      secondshow: false,
    };
  },
  filters: {
    indexfilter: function (value, data) {
      if (data[0]) {
        return value + 1;
      } else {
        return value;
      }
    },
    laySlice: function (value) {
      return value.split("-")[2];
    },
    freezerFilters: function (value) {
      if (value.includes("冷藏柜")) {
        return value.replace("冷藏柜", "冰箱");
      } else if (value.includes("冷冻柜")) {
        return value.replace("冷冻柜", "冰箱");
      } else {
        return value;
      }
    },
    specimenFilters: function (value) {
      if (value == "" || value == undefined) {
        return "未占用";
      } else {
        return value;
      }
    },
    bian_hao_Filters: function (value) {
      if (!value || value == undefined || value == "") {
        return "无";
      } else {
        return value;
      }
    },
  },
  mounted() {

    // let dom = document.getElementsByClassName("el-tooltip__popper");
    // console.log(dom, dom[0].innerHTML, "dom");
    // dom[0].remove();
  },
  methods: {
    close() {
      this.ifshow = !this.ifshow;
    },
    clickBtn() {
      
      this.ifshow = !this.ifshow;
      this.loadQueryData();
      this.firstLoadViewData();
      this.firstLoadQuyu("次级仓库");
      // let dom = document.getElementsByClassName("el-tooltip__popper");
      // if (dom[0]) {
      //   dom[0].innerHTML = "";
      //   dom[0].style.background = "white";
      // }
    },
    closeView(value) {
      const name = "cunFangWeiZhi"; //其他字段属性
      this.$emit("change-data", name, value.cun_fang_wei_zhi_);
      const name2 = "cangKuMingCheng"; //其他字段属性
      const value2 = this.formInline.cang_ku_ming_chen_value; //字段的值
      // this.showValue = value2;
      this.$emit("change-data", name2, value2);
      this.ifshow = !this.ifshow;
    },
    firstLoadQuyu(cang_ku) {
      let sqlString = `select DISTINCT subStr(wei_zhi_,1,4) as wei_zhi_,cun_chu_tiao_jian,qu_yu_ from t_ck where cang_ku_ming_chen = '${cang_ku}' order by wei_zhi_ asc`;

      var this_ = this;

      curdPost("sql", sqlString).then((response) => {
        this_.quyu_arr = response.variables.data;
        this_.quyu_arr.forEach((it) => {
          it.wei_zhi_.includes("-")
            ? ""
            : (it.qu_yu_ = it.qu_yu_ + it.wei_zhi_.slice(3, 4));
        });
        if (!this.firstLoadActive) {
          this_.formInline.qu_yu_value = "";
        }
      });
    },
    firstLoadViewData() {
      //首次加载视图数据 默认中心仓库 耗材区
      this.formInline.cang_ku_ming_chen_value = "次级仓库";
      this.formInline.qu_yu_value = "6号冰箱";
      this.selectActive = 1;
      this.firstLoadActive = true;
      this.quyuShow = "6号冰箱";
      var sqlString =
        "select * from t_mjwlgl where cun_fang_wei_zhi_ like" +
        "'%" +
        "BX6" +
        "%'";
      this.queryLoad(sqlString, "BX6");
    },
    sqlSlice(value, num) {
      if (value.includes("冰箱")) {
        if (
          value.includes("T") ||
          value.includes("B") ||
          value.includes("L") ||
          value.includes("R")
        ) {
          return "BX" + num + value.slice(4, 5);
        } else {
          return "BX" + num;
        }
      } else if (value.includes("货架")) {
        return "HJ" + num;
      } else if (value.includes("试剂柜")) {
        return "SJG" + num;
      }
    },
    loadQueryData() {
      //查询选择仓库数据查询
      var sqlString = "select distinct cang_ku_ming_chen from t_ck ";
      var this_ = this;
      curdPost("sql", sqlString).then((response) => {
        this_.cangkuOption = response.variables.data;
        this_.cangkuOption.forEach((item, index) => {
          if (!item) {
            this_.cangkuOption.splice(index, 1);
          }
        });
      });
    },
    onSubmits() {
      //头部按钮查询事
      this.desShow = false;
      let value = this.formInline.qu_yu_value;
      let num = value.split("号")[0];
      let type = this.sqlSlice(value, num);
      var sqlString =
        `select * from t_mjwlgl where cun_fang_wei_zhi_ like ` +
        "'%" +
        type +
        "%'";
      this.queryLoad(sqlString, type);
      this.formInline.qu_yu_value = value;
      this.quyuShow = value;
    },
    queryLoad(sql, py) {
      console.log(122)
      let this_ =this;
      var datas = [];
      this.cenghao = [];
      const labelsMap = {}; // map存储
      let typeData = [];
      var sqltype =
        `select DISTINCT SUBSTR(wei_zhi_,1,6) as wei_zhi_ from t_ck where wei_zhi_ like ` +
        "'%" +
        py +
        "%'" +
        "ORDER BY wei_zhi_ ASC "; //
      curdPost("sql", sqltype).then((res) => {
        typeData = res.variables.data; //查询该位置具有多少层
        curdPost("sql", sql).then((res) => {
          //sql 查询该位置在物料管理库存信息的物料
          datas = res.variables.data; // 该位置的库存信息
          typeData.forEach((item) => {
            //组件以货架分层的数据: {1:[],2:[],3:[],4:[],5:[],6}
            let num = item.wei_zhi_.split("-")[1];
            labelsMap[num] = [];
          });
          if (datas.length == 0) {
            //没有物料存在该位置
            for (var prop in labelsMap) {
              typeData.forEach((item) => {
                //组件以货架分层的数据: {1:[],2:[],3:[],4:[],5:[],6}
                let num = item.wei_zhi_.split("-")[1];
                if (num == prop) {
                  labelsMap[prop].push({ cun_fang_wei_zhi_: item.wei_zhi_ });
                }
              });
            }
            this_.listData = labelsMap;           
            return;
          }
          datas.forEach((item) => {
            //有物料存在该区域
            let props1 = item.cun_fang_wei_zhi_.split("-")[1];
            for (var prop in labelsMap) {
              if (labelsMap.hasOwnProperty(prop)) {
                if (prop == props1) {
                  labelsMap[prop].push(item);
                }
                if (prop != props1 && labelsMap[prop].length == 0) {
                  typeData.forEach((item) => {
                    //组件以货架分层的数据: {1:[],2:[],3:[],4:[],5:[],6}
                    let num = item.wei_zhi_.split("-")[1];
                    if (num == prop) {
                      labelsMap[prop].push({cun_fang_wei_zhi_: item.wei_zhi_,});
                      labelsMap[prop].push({ zhuangtai: "空" });
                    }
                  });
                }
              }
            }
          });
          let newarr = [];
          for (var prop in labelsMap) {
            if (labelsMap.hasOwnProperty(prop)) {
              if (labelsMap[prop].length > 1) {
                var item =[]
                console.log(labelsMap[prop])
                item.push(labelsMap[prop][0]);
                newarr.push(item);
              } else {
                newarr.push(labelsMap[prop]);
              }
            }
          }
          this_.listData = newarr;
          console.log(this_.listData)
        });
      });
    },
    qu_yu_Event(e) {
      //点击区域事件，加载可视化视图
      let value = e.target.innerText;
      let num = value.split("号")[0];
      let type = this.sqlSlice(value, num);
      var sqlString =
        `select * from t_mjwlgl where cun_fang_wei_zhi_ like ` +
        "'%" +
        type +
        "%'";

      this.queryLoad(sqlString, type);
      this.formInline.qu_yu_value = value;
      this.quyuShow = value;
    },
    blackEvent() {
      this.desShow = true;
      this_.listData =[];
    },
  },
  watch: {
    //监控仓库名称变化 触发第一次加载数据
    "formInline.cang_ku_ming_chen_value": async function (newdata) {
      this.firstLoadQuyu(newdata);
    },
    "formInline.qu_yu_value": function (newdata) {
      this.qu_yu_value = newdata;
      this.quyuShow = newdata;
      this.firstLoadActive = false;
    },
  },
};
</script>
  
  <style lang="scss" scoped>
ul {
  margin: 0;
}
p {
  padding: 0;
  margin: 0;
}
.selectArea {
  width: 100%;
  height: 100%;
  overflow: scroll;
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background: white;
  z-index: 2147483647 !important;
}
.close-content {
  position: absolute;
  right: 100px;
  top: 50px;
  //
  background: #f56c6c;
  font-size: 16px;
  padding: 0px 4px;
  border-radius: 5px;
  color: #ffffff;
  .closeBtn {
    background: #f56c6c;
    border: none;
    padding: 2px;
    color: #ffffff;
  }
}
.sample-content {
  width: 100%;
  .top-content {
    width: 100%;
    .top-title {
      text-align: center;
      font-weight: bold;
      width: 100%;
      font-size: 18px;
      line-height: 40px;
    }
    .query-content {
      display: flex;
      margin-left: 25px;
    }
  }
  .test-quyu,
  .huojia {
    width: 100%;
    .list-items {
      display: flex;
      cursor: pointer;
      .wDTianjian::after {
        content: "2-6";
      }
      .quyu-item {
        border: 1px solid #a172ab;
        background: #0099cc;
      }
      .huojia-item {
        background: #99ccff;
      }
      .list-item {
        padding: 4px 14px;
        height: 30px;
        background-color: #cec6a4;
        text-align: center;
        line-height: 30px;
        margin-left: 20px;
        margin-bottom: 6px;
        /* margin-top: 6px; */
        border-radius: 10px;
        position: relative;
        .tiaojian {
          // position: absolute;
          // right: 0px;
          // top: 0px;
          // background-color: #f56c6c;
          // border-radius: 10px;
          // color: #fff;
          // display: inline-block;
          // font-size: 12px;
          // height: 18px;
          // line-height: 18px;
          // padding: 0 6px;
          // text-align: center;
          // white-space: nowrap;
          // border: 1px solid #fff;
          font-size: 12px;
        }
      }
    }
    .cangku-mingchen {
      width: 100%;
      text-align: left;
      margin-left: 50px;
    }
  }
  .body-content {
    margin-bottom: 70px;
    display: flex;
    box-sizing: border-box;
    height:50vh;
    // overflow-x: hidden;
    // overflow-y: scroll;
    .black {
      position: fixed;
      top: 300px;
      right: 100px;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #e6a23c;
      z-index: 99;
    }
    .left-table {
      // width: 40%;
      ::v-deep .el-table {
        width: 40%;
      }
    }
    .right-view {
      z-index: 99;
      width: 100%;
      .goods-items {
        width: 100%;
        overflow-x: hidden;
        border: solid 2px rgb(202, 236, 247);
        display: flex;
        flex-direction: column-reverse;
        .show-demo {
          width: 100%;
          border-bottom: 1px solid bisque;
          margin: 0 auto;
          text-align: center;
          // overflow-y: scroll;
          .goods-level {
            display: flex;
            position: relative;
            margin-bottom: 6px;
          }
          .level-dsc {
            margin-top: 12px;
            position: absolute;
            bottom: 0;
            left: 10px;
          }
          .goods-list {
            display: flex;
            // justify-content: flex-start;
            flex-wrap: wrap-reverse;
            align-content: flex-start;
            margin-left: 50px;
            margin-right: 15px;
            .goods-dsc {
              cursor: pointer;
              // width: 170px;
              // height: 80px;
              padding: 6px 12px;
              border-radius: 5px;
              background: #e6a23c;
              margin-left: 12px;
              margin-top: 6px;
              //   background-color: aliceblue;
              box-sizing: border-box;
              .top-dsc {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                .position > p {
                  text-align: left;
                  // color: #fbe8ff;
                }
                .right-content > p {
                  margin-left: 15px;
                  // color: #fbe8ff;
                  text-align: left;
                }
                // .condition {
                //   // color: #fbe8ff;
                // }
              }
              .bottom-dsc {
                width: 100%;
                font-size: 18px;
                height: 42px;
                line-height: 60px;
                margin-top: 20px;
                // color: #fbe8ff;
              }
              .goods-demo {
                display: block;
                width: 70px;
                height: 90px;
                border: 1px solid rgb(10, 9, 8);
                text-align: center;
                margin: 0;
              }
              .goods-code {
                text-align: center;
                width: 100%;
                height: 20px;
                line-height: 20px;
              }
            }
          }
          .goodshelf-name {
            margin-bottom: 49px;
          }
          .shelf {
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
          }
        }
      }
    }
  }
  .body-content::-webkit-scrollbar {
    display: none; /*隐藏滚动条*/
  }
}

::v-deep .el-tooltip__popper {
  display: none;
}
</style>