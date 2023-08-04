<template>
    <div style="height:50vh;">
        <div id="qrcode" ref="qrcode" style="margin-top:25vh;" />
    </div>

</template>

<script>
import QRCode from 'qrcodejs2' // 引入qrcode
export default {
    name: 'qrcode',
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
            default: false
        }
    },
    mounted () {
        this.qrcode()
    },

    methods: {
        qrcode () {
            console.log(this)
            const qrcode = new QRCode('qrcode', {
                width: 132,
                height: 132,
                text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0aecf99696061a3&redirect_uri=https%3A%2F%2Fwww.szjyxt.com%2F%23%2Fziliao&response_type=code&scope=snsapi_base&state=${this.formData.changJingId}#wechat_redirect`,
                // text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxea2c214ca5d25739&redirect_uri=https%3A%2F%2Fwww.szjyxt.com%2F%23%2Fziliao&response_type=code&scope=snsapi_base&state=${this.formData.changJingId}#wechat_redirect`,
                colorDark: '#000000', // 前景色
                colorLight: '#FFFFFF', // 背景色
                correctLevel: QRCode.CorrectLevel.L
            })
        }
    }
}
</script>

<style scoped>
#qrcode {
  width: 100px;
  height: 100px;
}
</style>
