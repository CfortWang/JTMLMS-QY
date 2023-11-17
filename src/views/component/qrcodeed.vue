<template>
    <div style="height:150px">
        <div id="qrcode" ref="qrcodes" class="qrCode" />
    </div>

</template>

<script>
import QRCode from 'qrcodejs2' // 引入qrcode
import { BASE_URL } from '@/constant'
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
    data () {
        return {
            qrCode: ''
        }
    },
    watch: {
        'formData.changJingId': {
            handler () {
                this.$nextTick(() => {
                    this.qrcode()
                })
            },
            immediate: true

        }
    },
    mounted () {
        // setTimeout(() => {
        //     this.qrcode()
        // }, 500)
    },
    destroyed () {
        if (window.qrTimer) {
            clearInterval(window.qrTimer)
        }
    },

    methods: {
        qrcode () {
            if (this.qrCode) {
                this.$refs.qrcodes.innerHTML = ''
            }
            this.qrCode = new QRCode('qrcode', {
                width: 132,
                height: 132,
                text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf0aecf99696061a3&redirect_uri=${encodeURIComponent(`${BASE_URL}#/ziliao`)}&response_type=code&scope=snsapi_base&state=${this.formData.changJingId}#wechat_redirect`,
                // text: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxea2c214ca5d25739&redirect_uri=${encodeURIComponent(`${BASE_URL}#/ziliao`)}&response_type=code&scope=snsapi_base&state=${this.formData.changJingId}#wechat_redirect`,
                colorDark: '#000000', // 前景色
                colorLight: '#FFFFFF', // 背景色
                correctLevel: QRCode.CorrectLevel.L
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.qrCode {
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
</style>
