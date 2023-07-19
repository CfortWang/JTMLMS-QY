<template>
    <div class="bg">
      <el-dialog
        width="21cm"
        height="12cm"
        :modal-append-to-body="false"
        title="物料标签"
        :visible.sync="scanVisible"
      >
        <!-- 表单是否显示 -->
        <div class="demo">
          <div ref="qrcode" id="box">
            <vue-easy-print
              tableShow
              ref="easyPrint"
              :onePageRow="onePageRow"
              :spaceRow="spaceRow"
            >
              <div
                v-for="(item1, index1) in list"
                :key="index1"
                class="box-content"
              >
                <div
                  v-for="(item2, index2) in parseInt(item1.shu_liang_) || 0"
                  :key="index2"
                  style="display: inline-block"
                >
                  <div class="tagBox">
                    <!-- <div class="logo"> -->
                    <!-- <img
                        style="width: 90px; height: 20px"
                        src="./ming.jpg"
                        alt=""
                      />
                    </div> -->
                    <div class="la">
                      <div
                        style="
                          display: flex;
                          justify-content: flex-start;
                          text-align: left;
                        "
                      >
                        <span> 物料名称：</span>
                        <p style="width: 180px; margin: 0px">
                          {{ item1.fen_zhuang_wu_lia }}
                        </p>
                      </div>
                    </div>
                    <div class="la">
                      <div class="lh">
                        <div style="white-space: nowrap">物料代码：</div>
                        <div>{{ item1.wu_liao_bian_ma_ }}</div>
                      </div>
                    </div>
                    <div class="la">
                      <div class="lh">
                        <div>规格：</div>
                        <div>{{ item1.han_liang_nong_du }}</div>
                      </div>
                    </div>
                    <div class="la">
                      <div style="display: flex">
                        <div class="lh" style="display: flex">
                          <div>货号:</div>
                          <div>{{ item1.huo_hao_ }}</div>
                        </div>
                        <div class="lh" style="display: flex; margin-left: 3px">
                          <div>批号:</div>
                          <div>{{ item1.fen_zhuang_pi_hao }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="la">
                      <div style="display: flex">
                        <div class="lh">
                          <div>配置时间：</div>
                          <div>
                            {{ item1.parent_id_ | timesfiltes(listtimes) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="la">
                      <div style="display: flex">
                        <div class="lh" style="margin-left: 1px">
                          <div>有效期:</div>
                          <div>{{ item1.you_xiao_qi_zhi_ }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="la">
                      <div class="lh">
                        <div>配置人：</div>
                        <div>
                          {{ item1.parent_id_ | peizhifiltes(listtimes) }}
                        </div>
                      </div>
                    </div> -->
                    <div class="la">
                      <div class="lh">
                        <div>状态</div>
                        <!-- <div class="la" style="height: 40px"></div> -->
                      </div>
                    </div>
  
                    <div
                      style="
                        page-break-after: always;
                        display: block !important;
                        height: 40px;
                      "
                    ></div>
                  </div>
                </div>
              </div>
            </vue-easy-print>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="printDemo">打印标签</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import VueBarcode from "vue-barcode";
  import vueEasyPrint from "vue-easy-print";
  import curdPost from "@/business/platform/form/utils/custom/joinCURD.js";
  
  export default {
    components: {
      VueBarcode,
      vueEasyPrint,
    },
    props: {
      obj: {
        default: [],
        type: Array,
      },
      onePageRow: {
        type: Number,
        default: 3,
      },
      blankLines: {
        type: Boolean,
        default: true,
      },
      spaceRow: {
        type: Boolean,
        default: true,
      },
      scanVisible: {
        type: Boolean,
        default: false,
      },
      currentScan: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        onePageRow: 1,
        value: "",
        id: "",
        list: [],
        listtimes: [],
        visible: true,
      };
    },
    filters: {
      timesfiltes: function (value, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id_ == value) {
            return arr[i].bian_zhi_shi_jian;
          }
        }
      },
      peizhifiltes: function (value, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id_ == value) {
            return arr[i].bian_zhi_ren_;
          }
        }
      },
    },
    created() {
      this.getInit();
    },
    watch: {
      obj() {
        this.getInit();
      },
    },
    methods: {
      printDemo() {
        this.$refs.easyPrint.print();
      },
      getInit() {
        var idStr = "";
        this.obj.forEach((item) => {
          idStr += item + ",";
        });
        idStr = idStr.substring(0, idStr.length - 1);
  
        this.getLook(idStr);
      },
      async getLook(id) {
        let this_ = this;
        this.list = [];
        let sql = `select * FROM t_fzwlmx  WHERE FIND_IN_SET(parent_id_,'${id}')`;
        await curdPost("sql", sql).then((res) => {
          this_.list = res.variables.data;
        });
        let sql1 = `select id_,fen_zhuang_ren_,fen_zhuang_ri_qi_ FROM t_fzwlrkd  WHERE FIND_IN_SET(id_,'${id}')`;
        await curdPost("sql", sql1).then((res) => {
          console.log(res.variables.data);
          this_.listtimes = res.variables.data;
        });
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .demo {
    height: 300px;
    width: 100%;
  }
  
  .logo {
    position: absolute;
    top: -32px;
    left: 0;
  }
  
  .content {
    display: flex;
    justify-content: flex-start;
    text-align: left;
  }
  .tagBox {
    width: 240px;
    height: 150px;
    position: relative;
    border: 1px solid #000000;
    padding: 2px;
    display: inline-block;
    margin: 50px 4px 44px 3px;
    background-color: #fff;
  }
  
  .la,
  .logo {
    align-items: center;
    font-size: 8px;
    display: inline-block;
    width: 100%;
  }
  
  .lh {
    font-size: 8px;
    display: flex;
    align-items: center;
  }
  </style>
  