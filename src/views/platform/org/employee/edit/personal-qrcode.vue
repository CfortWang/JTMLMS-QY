<template>
    <div>
        <el-dialog
            :title="`${formatContent.name} 的${formatName}`"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            class="personal-qrcode"
            width="50%"
            center
            @close="closeDialog"
        >
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="二维码" name="erweima">
                    <div id="my-QRCode" ref="myQRCode" class="qrCode" />
                </el-tab-pane>
                <el-tab-pane label="条形码" name="tiaoxingma">
                    <div class="oneQr">
                        <vue-barcode
                            :value="formatTcodeValue"
                            :display-value="false"
                            :width="1"
                        >生成条形码失败</vue-barcode>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="el-dialog--center">
                <ibps-toolbar :actions="toolbars" @action-event="handleActionEvent" />
            </div>
        </el-dialog>
        <vue-easy-print ref="easyPrintRef">
            <vue-barcode
                style="text-align: center; margin-top: 30px"
                :value="formatContent.id"
                :display-value="false"
            >生成条形码失败</vue-barcode>
        </vue-easy-print>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2' // 引入qrcode
import VueBarcode from 'vue-barcode'
import vueEasyPrint from 'vue-easy-print'

import { getFile } from '@/utils/avatar'
export default {
    name: 'qrcode',
    components: {
        VueBarcode,
        vueEasyPrint
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        photo: {
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
            ],
            activeName: 'erweima' // 二维码条形码切换
        }
    },
    computed: {
        formatContent () {
            return JSON.parse(this.content)
        },
        formatName () {
            return this.activeName === 'erweima' ? '二维码' : '条形码'
        },
        formatTcodeValue () {
            return JSON.stringify({ id: JSON.parse(this.content).id })
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
                correctLevel: QRCode.CorrectLevel.Q // 纠错能力拉满
            })
            this.logoRender()
        },
        // 中心logo
        logoRender () {
            const logo = new Image()
            logo.setAttribute('crossOrigin', 'Anonymous') // 解决CORS 策略报错
            logo.src = getFile(this.photo)
            logo.onload = () => {
                const qrImg = document.getElementById('my-QRCode').getElementsByTagName('img')[0]
                const canvas = document.getElementById('my-QRCode').getElementsByTagName('canvas')[0]
                const ctx = canvas.getContext('2d')
                ctx.drawImage(
                    logo,
                    (250 - 250 / 3.7) / 2,
                    (250 - 250 / 3.7) / 2,
                    250 / 3.7,
                    250 / 3.7
                )
                qrImg.src = canvas.toDataURL()
            }
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
            if (this.activeName === 'erweima') {
                const myCanvas = document.getElementById('my-QRCode').getElementsByTagName('canvas')
                const a = document.createElement('a')
                a.href = myCanvas[0].toDataURL('image/png')
                a.download = this.formatContent.name + '的二维码'
                a.click()
            } else if (this.activeName === 'tiaoxingma') {
                const svgElement = document.querySelector('.oneQr').getElementsByTagName('svg')[0]
                const svgContent = svgElement.outerHTML
                const svgDataURL = 'data:image/svg+xml;base64,' + btoa(svgContent)
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                canvas.width = svgElement.width.baseVal.value
                canvas.height = svgElement.height.baseVal.value
                const img = new Image()
                img.onload = () => {
                    context.drawImage(img, 0, 0)
                    const imageDataURL = canvas.toDataURL('image/png')
                    const a = document.createElement('a')
                    a.href = imageDataURL
                    a.download = this.formatContent.name + '的条形码'
                    a.click()
                }
                img.src = svgDataURL
            }
        },
        closeDialog () {
            this.$emit('close', false)
        },
        handleClick () {}
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
          img {
            margin: 40px auto;
          }
        }
      }
    }
    .el-tabs__nav-wrap {
      padding-left: 20px;
    }
  }
}
.oneQr {
  text-align: center;
}
</style>
