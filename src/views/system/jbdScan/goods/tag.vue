<template>
  <div class="bg">
    <el-dialog 
      width="21cm"
      height="10cm" 
       :modal-append-to-body='false' title="样品标签" :visible.sync="scanVisible">
      <!-- 表单是否显示 -->
      <div style="height:500px">
          <div ref="qrcode" id="box">
          <vue-easy-print tableShow ref="easyPrint"
            :onePageRow="onePageRow"
          >
            <div v-for="(item1, index1) in list" :key="index1"  >
              <div v-for="(item2, index2) in parseInt(item1.num)" :key="index2" 
              
              >
              <!-- style="display: inline-block" 13行15行：取消后页面居中 -->
              <!-- style="page-break-after:always" -->
               <div class="All" style="font-family:sans-serif">
                <div class="tagBox">
                  <div class="lh">
                    <div>样品名称：</div>
                    <div>{{ item1.name }}</div>
                  </div>
                  <div class="la">
                    <div class="lh">
                      <div>样品编号：</div>
                      <div >{{ item1.serial }}</div>
                    </div>
                  </div>
                  <div class="lh">
                    <div>样品类型：</div>
                    <div>{{ item1.type }}</div>
                  </div>
                  <div class="la">
                    <div class="lh">
                      <div>存储条件：</div>
                      <div>{{ item1.condition }}</div>
                    </div>
                    <!-- <div class="lh" style="margin-left: 5px">
                      <div>样品数量：</div>
                      <div>{{ index2 + 1 }}/{{ item1.num }}支</div>
                    </div> -->
                  </div>
                  <div class="lh">
                      <div>样品数量：</div>
                      <div>{{ index2 + 1 }}/{{ item1.num }}支</div>
                    </div>
                  <div class="lh" >
                      <div>收样时间：</div>
                      <div>{{ item1.time }}</div>
                    </div>
                  <div class="lh">
                    <div>流转状态：</div>
                    <div>▢待检，▢已检，▢留样</div>
                  </div>
                 
                  <div class="ewm">
                    <vue-barcode :value="item1.serial" :width="1.5" :height="15" :margin="0" :displayValue="false" ></vue-barcode>
                  </div>

                  <!-- <div
                    style="page-break-after: always; display: block !important;height: 40px"
                  ></div> -->


                </div>
               </div>
              </div>
            </div>
          </vue-easy-print>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="printDemo">打印标签</el-button>
      </span>
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
    onePageRow:{
      type:Number,
      default:3
    },
    blankLines:{
      type:Boolean,
      default:true
    },
    scanVisible:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      id: '',
      list: [{
        name: '测试名称',
        serial: '测试编号',
        type: '测试类型',
        num: 1,
        condition: '测试条件',
        time:''
      }],
      visible: true
    }
  },
  watch: {
    obj() {
      this.getInit()
      // console.log(this.obj)
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    printDemo() {
      this.$refs.easyPrint.print()
    },
    getInit() {
      var idStr = '';
      this.obj.forEach(item=>{
        idStr += item + ','
      })
      idStr = idStr.substring(0,idStr.length-1);
      // console.log(idStr)
      this.getLook(idStr)
    },
    getLook(id) {
      // let sql = `select * from t_lhypb where find_in_set(id_,'${id}')`
      let sql = `select ypb.*,	djb.shou_yang_ri_qi_ FROM	t_lhypb ypb left outer JOIN t_lhypdjb djb ON djb.yang_ben_bian_hao = ypb.yang_pin_bian_hao 	where find_in_set( ypb.id_, '${id}' )`
      // let sql = `select * from t_lhypdjb where find_in_set(id_,'${id}')`
      // console.log(sql)
      repostCurd("sql", sql).then(res => {
        if (res.state === 200) {
          const data = res.variables.data
          // console.log(data)
          let list = []
          data.forEach(item => {
          //   if (item.yang_ben_lei_xing != '' && parseInt(item.yang_pin_shu_lian) > 0) {
          //     let o = {
          //       name: item.yang_ben_ming_che,
          //       serial: item.yang_ben_bian_hao,
          //       type: item.yang_ben_lei_xing,
          //       num: item.yang_pin_shu_lian,
          //       condition: item.yun_shu_tiao_jian
          //     }
          //     list.push(o)
          //   }
          let shijian = item.shou_yang_ri_qi_ == null ? this.dateFormat():item.shou_yang_ri_qi_
            if (item.yang_pin_lei_xing != '' && parseInt(item.shu_liang_) > 0) {
              let o = {
                name: item.yang_pin_ming_che,
                serial: item.yang_pin_bian_hao,
                type: item.yang_pin_lei_xing,
                num: item.shu_liang_,
                condition: item.yang_ben_yun_shu_,
                time : shijian
              }
              list.push(o)
            }
            if (item.yang_pin_lei_er_ != '' && parseInt(item.shu_liang_er_) > 0) {
              let o = {
                name: item.yang_pin_ming_che,
                serial: item.yang_pin_bian_hao,
                type: item.yang_pin_lei_er_,
                num: item.shu_liang_er_,
                condition: item.yang_pin_yun_shu_,
                time : shijian
              }
              list.push(o)
            }
            if (item.yang_pin_lei_san_ != '' && parseInt(item.shu_liang_san_) > 0) {
              let o = {
                name: item.yang_pin_ming_che,
                serial: item.yang_pin_bian_hao,
                type: item.yang_pin_lei_san_,
                num: item.shu_liang_san_,
                condition: item.yang_pin_yun_san,
                time : shijian
              }
              list.push(o)
            }
            if (item.yang_pin_lei_si_ != '' && parseInt(item.shu_liang_si_) > 0) {
              let o = {
                name: item.yang_pin_ming_che,
                serial: item.yang_pin_bian_hao,
                type: item.yang_pin_lei_si_,
                num: item.shu_liang_si_,
                condition: item.yang_pin_yun_si_,
                time : shijian
              }
              list.push(o)
            }
          
          })
          if(list.length == 0){
              this.$message({
                message: '该样品信息有误，请联系开发人员！',
                type: 'error'
              })
              this.remRedar();
            }
          this.list = list
          // console.log(this.list)
        }
      })
    },
    
    /* 关闭*/
    remRedar() {
      this.visible = false // 列表隐藏
      this.listData = [] // 清空列表数据
      this.redar = false // 扫码图标隐藏
      this.$emit('scanOff', false)
    },
    dateFormat() { // 获取当前时间
        var date=new Date();
        var year=date.getFullYear();
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        return year+"-"+month+"-"+day;
    }
  }
}
</script>

<style lang="scss" scoped>
.bg {
  // height: auto;
}

.tagBox {
  width: 231px;   // 300  240
  // height: 140px;  // 180  150 140
  position: relative;
  border: 1px solid #000000;
  padding: 2px;
  display: inline-block;
  // justify-content: space-around;
  // flex-direction: column;
  // margin: 10px 5px;
  margin: 10px 10px;
  border-radius: 4px;
  background-color: #fff;
  // font-weight: bold;
}
.ewm{
  margin-left: 30px;
}
/*
.tagBox {
  width: 177.5px;   // 300  240
  height: 106.5px;  // 180  150
  position: relative;
  border: 1px solid #000000;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  margin: 20px auto;
  border-radius: 15px;
  background-color: #fff;
}
*/

.la {
  display: flex;
  align-items: center;
}

.lh {
  // line-height: auto;
  font-size: 14px;  //16
  display: flex;
  align-items: center;

}
</style>
