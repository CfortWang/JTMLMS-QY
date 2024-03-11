<template>
    <div>
        <el-dialog
            title="扫码签到"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            class="qrcode-dialog"
            width="50%"
            top="6vh"
            center
        >
            <div class="codePic">
                <div id="qrcode" ref="qrcodes" class="qrCode" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="downloadCode()">下载二维码</el-button>
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import QRCode from 'qrcodejs2' // 引入qrcode
import { BASE_URL } from '@/constant'
export default {
    name: 'qrcode',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        codeId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            qrCode: '',
            dialogVisible: this.visible
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.qrcodeRender()
        })
    },
    methods: {
        downloadCode () {
            const myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas')
            const a = document.createElement('a')
            a.href = myCanvas[0].toDataURL('image/png')
            a.download = name
            a.click()
        },
        qrcodeRender () {
            if (this.qrCode) {
                this.$refs.qrcodes.innerHTML = ''
            }
            this.qrCode = new QRCode('qrcode', {
                width: 200,
                height: 200,
                text: `${BASE_URL}h5/#/pages/login/login?qrcodeId=${this.codeId}`,
                colorDark: '#000000', // 前景色
                colorLight: '#FFFFFF', // 背景色
                correctLevel: QRCode.CorrectLevel.L
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .qrcode-dialog {
        .qrCode {
            display: flex;
            justify-content: center;
            margin: 5% 0;
        }
        .qrCode >img{
            width: 50%;
        }
    }
</style>
