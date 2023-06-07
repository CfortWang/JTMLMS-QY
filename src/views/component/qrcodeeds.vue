<template>
  <div id="qrcode" ref="qrcode"></div>
</template>

<script>
  import QRCode from 'qrcodejs2' // 引入qrcode
  export default {
    name: "qrcode",
    props: {
      field: Object,
      formData: {
        type: Object,
        default () {
          return {}
        }

      },
      readonly: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        flag: false, //标记二维码是否已经生成
      }
    },
    watch: {
      formData(val) {
        if (val.zongWaiJian != '') {
          if (!this.flag) {
            this.qrcode(val.zongWaiJian)
            this.flag = true;
          }
        }
      }
    },

    methods: {

      qrcode(zongWaiJian) {
        console.log('执行生成二维码');
        let qrcode = new QRCode('qrcode', {
          width: 132,
          height: 132,

          // text: `http://localhost:1111/#/ziliao?id=${this.formData.zongWaiJian}`, // 这2
          // text: `http://192.168.2.99:1111/#/ziliao?id=${zongWaiJian}`, // 2
          // text:`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0aecf99696061a3&redirect_uri=http%3A%2F%2F192.168.2.99%3A1111%2F%23%2Fziliao&response_type=code&scope=snsapi_base&state=67e9c2b4e83a4091be478807565fb623#wechat_redirect`,
           //text:`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0aecf99696061a3&redirect_uri=https%3A%2F%2Fwww.szjyxt.com%2F%23%2Fziliao&response_type=code&scope=snsapi_base&state=${zongWaiJian}#wechat_redirect`,


          colorDark: "#000000", //前景色
          colorLight: "#FFFFFF", //背景色
          correctLevel: QRCode.CorrectLevel.L,


        })
      },
    },

  }
</script>

<style scoped>
  #qrcode {
    width: 100px;
    height: 100px;
  }
</style>
