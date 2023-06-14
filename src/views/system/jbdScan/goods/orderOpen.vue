<template>
  <div class="bg">
    <el-dialog width="1000" height="500" :modal-append-to-body='false' title="订单开立流程" :visible.sync="scanVisible" >
      <!-- 表单是否显示 -->
      <div style="width: 100%;height: 100%;">
        <div ref="qrcode" id="box">
          <vue-easy-print tableShow ref="easyPrint" :onePageRow="onePageRow">

                <div class="tagBox">
                 <!-- <p class="title"> -->
                    <img src="@/assets/images/login/bgImg.jpg" class="logoImg" />

               <!--   </p> -->
                </div>


          </vue-easy-print>
        </div>
      </div>

    </el-dialog>


  </div>
</template>

<script>
import VueBarcode from 'vue-barcode';
import vueEasyPrint from "vue-easy-print";
import repostCurd from '@/business/platform/form/utils/custom/joinCURD.js';

export default {
  components: {
    VueBarcode,
    vueEasyPrint,
  },
  props: {
    obj: {
      default: [],
      type: Array
    },
    onePageRow: {
      type: Number,
      default: 3
    },
    blankLines: {
      type: Boolean,
      default: true
    },
    scanVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: true
    }
  },
  // watch: {
  //   obj() {
  //     this.getInit()
  //   }
  // },
  created() {
    this.getInit()
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.bg {
  // height: auto;
}

// .title {
//   font-size: 16px;
//   color: #01a39e;
//   margin: 0;
//   margin-bottom: 10px;
// }

/deep/ .logoImg {
  width: 100%;
  height: 100%;
  position: relative;
  // top: 6px;
      border: 1px solid #000000;
      border-radius: 5px;
}

.tagBox {
  width: 90%; // 300  240
  height:90%; // 180  150
  position: relative;
  // border: 1px solid #000000;
  padding: 2px;
  display: inline-block;
  margin: 0px 37px 30px 37px;
  border-radius: 4px;
  background-color: #fff;
}

.ewm {
  display: flex;
  justify-content: center;
}

.la {
  display: flex;
  align-items: center;
}

.lh {
  font-size: 4px; //16
  display: flex;
  align-items: center;
}

/deep/ .tagBox {
  width: 90%; // 300  240
  height:90%; // 180  150
  padding: 0px 10px 1px 10px;
}
/deep/ .el-dialog__header {
    padding: 20px 20px 10px !important;

}

</style>
