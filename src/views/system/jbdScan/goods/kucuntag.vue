<template>
  <el-dialog :visible.sync="scanVisible"
             :width="width"
             custom-class="print-dialog"
             append-to-body
             :close-on-click-modal="false"
             :title="title"
             top="5vh"
             @close="$emit('update:show', false)">
    <vue-easy-print tableShow
                    ref="easyPrint"
                    :onePageRow="1">
      <div class="content">
        <div v-for="(item, index) in list"
             :key="index"
             class="box">
          <!-- <div class="divLog">
            <img src="../../../../assets/images/login/logo.jpg"
                 style="width:30px;height:30px" />
            <p class="title">
              深圳市罗湖医院集团
            </p>
          </div> -->
          <template v-for="(o, i) in modelList">
            <div v-if="item[o.value]"
                 class="item"
                 :style="`width: ${o.width};`">
              <span class="name">{{ o.label }}：</span>
              <span class="value">{{ item[o.value] }}</span>
            </div>
          </template>
          <vue-barcode :value='item.wu_liao_bian_ma_'
                       :width="1"
                       :height="15"></vue-barcode>
        </div>
      </div>
    </vue-easy-print>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="goPrint">打印</el-button>
    </span>
  </el-dialog>
</template>
<script>
import VueBarcode from 'vue-barcode';
import vueEasyPrint from "vue-easy-print";
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js';
export default {
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
    },
    width: {
      type: String,
      default: '500px'
    },
  },
  components: {
    vueEasyPrint: () => import('vue-easy-print'),
    VueBarcode: () => import('vue-barcode')
  },
  data() {
    return {
      modelList: [
        {
          label: `物料名称`,
          value: 'wu_liao_ming_chen',
          width: '100%'
        },
        {
          label: `物料编码`,
          value: 'wu_liao_bian_ma_',
          width: '100%'

        },
        {
          label: `货号`,
          value: 'huo_hao_'
        },
        {
          label: '批号',
          value: 'pi_hao_'
        },
        {
          label: '到库日期',
          value: 'create_time_'
        },
        {
          label: '有效期',
          value: 'you_xiao_qi_'
        },
        {
          label: '生厂商',
          value: 'sheng_chan_chang_',
          width: '100%'
        },
        {
          label: '储存条件',
          value: 'cun_chu_yao_qiu_',
          width: '100%'
        }
      ],
      list: [],
      title: "物料标签",
      value: '',
      id: '',
      visible: true
    }
  },
  watch: {
    obj() {
      this.getInit()
    },
    scanVisible(i) {
      if (i == false) {
        this.list = JSON.parse(JSON.stringify([]))
      }
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    goPrint() {
      this.$refs.easyPrint.print()
    },
    getInit() {
      var idStr = '';
      this.obj.forEach(item => {
        idStr += item + ','
      })
      idStr = idStr.substring(0, idStr.length - 1);
      this.getLook(idStr)
    },
    getLook(id) {
      let sql = `select * from t_cgysjlb where wai_jian_ in (${id}) UNION ALL SELECT * FROM t_wlzpysjlb WHERE wai_jian_ IN (${id})`
      curdPost("sql", sql).then(res => {
        if (res.state === 200) {
          for (var i of res.variables.data) {
            let listData = {
              wu_liao_ming_chen: i.wu_liao_ming_chen ? i.wu_liao_ming_chen : '-',
              wu_liao_bian_ma_: i.wu_liao_bian_ma_ ? i.wu_liao_bian_ma_ : '-',
              huo_hao_: i.huo_hao_ ? i.huo_hao_ : '-',
              pi_hao_: i.pi_hao_ ? i.pi_hao_ : '-',
              create_time_: i.create_time_ ? this.getData(i.create_time_) : '-',
              you_xiao_qi_: i.you_xiao_qi_ ? i.you_xiao_qi_ : '-',
              sheng_chan_chang_: i.sheng_chan_chang_ ? i.sheng_chan_chang_ : '-',
              cun_chu_yao_qiu_: i.cun_chu_yao_qiu_ ? i.cun_chu_yao_qiu_ : '-',
            }
            this.list.push(listData)
          }
        }
      })
    },
    getData(n) {
      let now = new Date(n),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
    }
  }
}
</script>
<style lang="scss">
.print-dialog {
  width: 500px;
  min-width: 500px;
  height: 680px;
}
.logoImg {
  width: 30px;
  height: 30px;
}
.content {
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: center;
  padding: 10px;
  //   min-height: 380px;
  overflow: auto;
  .box {
    position: relative;
    width: 300px;
    height: auto;
    font-size: 14px;
    padding: 10px;
    margin: 0 auto 20px;
    border: 1px solid #000;
    border-radius: 4px;
    .item {
      margin-bottom: 6px;
      display: inline-block;
      min-width: 50%;
      .name {
        white-space: nowrap;
      }
    }
    .barcode {
      position: absolute;
      text-align: center;
      bottom: 10px;
      left: 0;
      right: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .next-page {
    page-break-after: always;
  }
 
}
</style>