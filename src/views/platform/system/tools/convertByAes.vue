<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="true"
        append-to-body
        fullscreen
        class="dialog tools-dialog"
        top="5vh"
        @close="closeDialog"
    >
        <div class="tools-container">
            <div class="title">AES加解密</div>
            <div class="card">
                <div class="item">
                    <div class="label">明文</div>
                    <div class="value">
                        <el-input
                            v-model="plaintext"
                            type="textarea"
                            :rows="10"
                            placeholder="请输入明文"
                        />
                    </div>
                </div>
                <div class="operate-btn">
                    <el-button
                        type="primary"
                        size="small"
                        icon="ibps-icon-level-down"
                        @click="handleEncrypt"
                    >加密</el-button>
                    <el-button
                        type="warning"
                        size="small"
                        icon="ibps-icon-level-up"
                        @click="handleDecrypt"
                    >解密</el-button>
                    <el-button
                        type="info"
                        size="small"
                        icon="ibps-icon-copy"
                        @click="handleCopy"
                    >复制明文</el-button>
                </div>
                <div class="item">
                    <div class="label">密文</div>
                    <div class="value">
                        <el-input
                            v-model="ciphertext"
                            type="textarea"
                            :rows="10"
                            placeholder="请输入密文"
                        />
                    </div>
                </div>
                <!-- <div class="item">
                    <div class="label">ivBase64</div>
                    <div class="value">
                        <el-input
                            v-model="ivBase64"
                            type="textarea"
                            :rows="1"
                            placeholder="请输入ivBase64"
                        />
                    </div>
                </div> -->
            </div>
        </div>
    </el-dialog>
</template>
<script>

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dialogVisible: this.visible,
            plaintext: '',
            ivBase64: '',
            ciphertext: ''
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        }
    },
    methods: {
        handleActionEvent (key, type, index) {
            switch (key) {
                case 'cancel':
                    this.handleCancel()
                    break
                default:
                    break
            }
        },
        handleEncrypt () {
            if (!this.plaintext) {
                return this.$message.warning('明文为空！')
            }
            this.ciphertext = this.$common.encryptByAes(this.plaintext)
        },
        handleDecrypt () {
            if (!this.ciphertext || typeof this.ciphertext !== 'string') {
                return this.$message.warning('无效的密文输入！')
            }
            // if (!this.ivBase64) {
            //     return this.$message.warning('请输入ivBase64！')
            // }
            const temp = this.$common.decryptByAes(this.ciphertext)
            if (this.$utils.isEmpty(temp)) {
                return this.$message.error('密文无效，无法解密！')
            }
            this.plaintext = temp
        },
        handleCopy () {
            const text = this.plaintext
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.$message.success('明文已复制到剪贴板！')
                }).catch(() => this.fallbackCopy(text))
            } else {
                this.fallbackCopy(text)
            }
        },
        fallbackCopy (text) {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            document.body.appendChild(textarea)
            textarea.select()
            try {
                document.execCommand('copy')
                this.$message.success('明文已复制到剪贴板！')
            } catch (err) {
                this.$message.warning('复制失败，请手动选择内容复制！')
            } finally {
                document.body.removeChild(textarea)
            }
        },
        closeDialog () {
            this.$emit('close', false)
        }
    }
}
</script>
<style lang="scss" scoped>
.tools-container {
    width: 1080px;
    margin: 20px auto;
    height: calc(100% - 100px);
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
    .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
    }
    .card {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
            width: 100%;
            margin-bottom: 20px;
            padding: 15px;
            // border: 1px solid #ccc;
            // border-radius: 5px;
            // background-color: #fff;
            // transition: transform 0.2s;
            // &:hover {
            //     transform: scale(1.01);
            // }
            .label {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .value {
                font-size: 16px;
                color: #666;
            }
        }
        .operate-btn {
            margin: 0 auto;
        }
    }
}
</style>
