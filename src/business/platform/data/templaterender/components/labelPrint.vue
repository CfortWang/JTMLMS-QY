<template>
  <el-dialog :visible.sync="show"
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
          <p class="title">
            <img src="../../../../../assets/images/login/logo.jpg"
                 class="logoImg" />
            深圳市罗湖医院集团
          </p>
          <template v-for="(o, i) in modelList">
            <div v-if="item[o.value]"

                 class="item"
                 :style="`width: ${o.width};`">
              <span class="name">{{ o.label }}：</span>
              <span class="value">{{ item[o.value] }}</span>
            </div>
          </template>
          <!-- <vue-barcode :value="item.bianHao"
                       :width="3"
                       :height="40"
                       :fontSize="0"
                       :margin="0"
                       class="barcode"></vue-barcode> -->
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
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500px'
    },
    title: {
      type: String,
      default: '入库标签打印'
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: '物料'
    }
  },
  components: {
    vueEasyPrint: () => import('vue-easy-print'),
    VueBarcode: () => import('vue-barcode')
  },
  data() {
    return {
      modelList: [
         {
          label: `仓库类型`,
          value: 'cangKuLeiXing',
        },
        {
          label: `物料类型`,
          value: 'wuLiaoLeiXing',
        },
        {
          label: `物料名称`,
          value: 'mingCheng',
          width: '100%'
        },
        {
          label: `物料编码`,
          value: 'bianHao'
        },
        {
          label: '货 号',
          value: 'huoHao'
        },
        {
          label: '批 号',
          value: 'piHao'
        },
        {
          label: '有效期',
          value: 'youXiaoQi'
        },
        {
          label: '存放位置',
          value: 'cunFangWeiZhi',
          width: '100%'
        },
        {
          label: '储存条件',
          value: 'cunChuYaoQiu',
          width: '100%'
        },
{
          label: '备注',
          value: 'beiZhu',
          width: '100%'
        },
      ]
    }
  },
  methods: {
    goPrint() {
      this.$refs.easyPrint.print()
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
.title {
  font-size: 16px;
  color: #01a39e;
  margin: 0;
  margin-bottom: 10px;
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
    height: 240px;
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