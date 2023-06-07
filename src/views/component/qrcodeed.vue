<template>
<div style="height:50vh;">
   <div id="qrcode" ref="qrcode" style="margin-top:25vh;"></div>
</div>
 
</template>

<script>
import QRCode from 'qrcodejs2' // 引入qrcode
export default {
  name: "qrcode",
  props: {
    field: Object,
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    qrcode() {
      console.log(this.formData.id)
      let qrcode = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxea2c214ca5d25739&redirect_uri=https%3A%2F%2Fwww.mingjianlims.com%2F%23%2Fziliao&response_type=code&scope=snsapi_base&state=${this.formData.id}#wechat_redirect`,
        colorDark: "#000000", //前景色
        colorLight: "#FFFFFF", //背景色

        correctLevel: QRCode.CorrectLevel.L,


      })
    },
  },
  mounted() {
    let this_ = this;
    console.log(QRCode)
    this.$nextTick(() => {
      setTimeout(() => {
        this_.qrcode();
      }, 0)
    })
  },
}
</script>

<style scoped>
#qrcode {
  width: 100px;
  height: 100px;
}
</style>
