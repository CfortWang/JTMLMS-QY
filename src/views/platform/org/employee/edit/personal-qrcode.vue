<template>
    <div>
        <el-dialog
            title="个人二维码"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            class="personal-qrcode"
            width="50%"
            center
        >
            <div id="my-QRCode" ref="myQRCode" class="qrCode" />
            <div slot="footer" class="el-dialog--center">
                <ibps-toolbar
                    :actions="toolbars"
                    @action-event="handleActionEvent"
                />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2' // 引入qrcode
export default {
    name: 'qrcode',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            code: '',
            dialogVisible: this.visible,
            toolbars: [
                {
                    key: 'download',
                    icon: 'ibps-icon-downlaod',
                    label: '下载',
                    type: 'primary'
                },
                {
                    key: 'cancel',
                    icon: 'ibps-icon-close',
                    label: '关闭',
                    type: 'drange'
                }
            ]
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
                if (val) {
                    this.$nextTick(() => {
                        this.qrcodeRender()
                    })
                }
            },
            immediate: true
        }
    },
    methods: {
        qrcodeRender () {
            console.log('qrcodeRender')
            if (this.code) {
                this.$refs.myQRCode.innerHTML = ''
            }
            this.code = new QRCode('my-QRCode', {
                width: 250,
                height: 250,
                text: this.content,
                colorDark: '#000000', // 前景色
                colorLight: '#FFFFFF', // 背景色
                correctLevel: QRCode.CorrectLevel.L
            })
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'download':
                    this.handleDownload()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleDownload () {
            const myCanvas = document.getElementById('my-QRCode').getElementsByTagName('canvas')
            const a = document.createElement('a')
            a.href = myCanvas[0].toDataURL('image/png')
            a.download = '个人二维码'
            a.click()
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>

<style lang="scss" scoped>
    .personal-qrcode {
        ::v-deep {
            .el-dialog {
                margin-top: calc((100vh - 450px) / 2) !important;
                .el-dialog__body {
                    #my-QRCode {
                        img{
                            margin: 40px auto;
                        }
                    }
                }
            }
        }
    }
</style>
