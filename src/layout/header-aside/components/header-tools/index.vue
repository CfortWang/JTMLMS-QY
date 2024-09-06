
<template>
    <div v-if="isSuper">
        <el-dropdown trigger="click">
            <el-tooltip effect="dark" content="工具箱" placement="bottom">
                <el-button type="text" class="ibps-mr btn-text can-hover">
                    <i class="ibps-icon-wrench" style="font-size: 18px;" />
                </el-button>
            </el-tooltip>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$nodeEnv === 'development'" @click.native="handleClick">
                    <div v-if="logLength > 0">
                        <el-badge
                            :max="99"
                            size="small"
                            class="custom-badge"
                            :value="logLengthError"
                            :is-dot="logLengthError === 0"
                        >
                            <ibps-icon
                                :name="logLengthError === 0 ? 'dot-circle-o' : 'bug'"
                            /> </el-badge>{{ tooltipContent }}
                    </div>
                    <div v-else>
                        <ibps-icon name="dot-circle-o" />{{ tooltipContent }}
                    </div>
                </el-dropdown-item>
                <el-dropdown-item
                    v-for="(item, index) in tools"
                    :key="index"
                    :icon="item.icon"
                    @click.native="handleShowDialog(item.visible)"
                >{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <convert-aes
            v-if="showConvertAes"
            :visible.sync="showConvertAes"
            @close="() => showConvertAes = false"
        />
        <change-environment
            v-if="showBaseUrl"
            :visible.sync="showBaseUrl"
            @close="() => showBaseUrl = false"
        />
        <el-dialog
            :title="tooltipContent"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            append-to-body
            fullscreen
        >
            <ibps-error-log-list />
            <div slot="footer" class="el-dialog--center el-dialog--bottom">
                <el-button
                    type="primary"
                    size="mini"
                    :loading="uploading"
                    @click="handleUpload"
                >
                    <ibps-icon name="cloud-upload" />
                    {{ $t("layout.header-aside.header-error-log.upload.button") }}
                </el-button>

                <el-button type="danger" size="mini" @click="handleLogClean">
                    <ibps-icon name="trash-o" />
                    {{ $t("common.buttons.clean") }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ChangeEnvironment from '@/views/platform/system/tools/changeEnvironment.vue'
import ConvertAes from '@/views/platform/system/tools/convertByAes.vue'
import IbpsErrorLogList from '../header-error-log/components/list'
import {
    cleanFormCache,
    cleanPlatformCache
} from '@/api/platform/system/cache'
import { mapGetters, mapState, mapMutations } from 'vuex'
export default {
    components: {
        ChangeEnvironment,
        ConvertAes,
        IbpsErrorLogList
    },
    props: {
        isSuper: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('ibps/log', ['log']),
        ...mapGetters('ibps', {
            logLength: 'log/length',
            logLengthError: 'log/lengthError'
        }),
        tooltipContent () {
            return this.logLength === 0
                ? this.$t('layout.header-aside.header-error-log.empty')
                : this.logLengthError > 0
                    ? this.$t('layout.header-aside.header-error-log.logError', {
                        logLength: this.logLength,
                        logLengthError: this.logLengthError
                    })
                    : this.$t('layout.header-aside.header-error-log.logInfo', {
                        logLength: this.logLength
                    })
        }
    },
    data () {
        return {
            uploading: false,
            showConvertAes: false,
            showErrorLog: false,
            showBaseUrl: false,
            dialogVisible: false,
            tools: []
        }
    },
    mounted () {
        if (this.isSuper) {
            this.tools = [
                {
                    name: '清除平台缓存',
                    visible: 'showPlatform',
                    icon: 'ibps-icon-eercast'
                },
                {
                    name: '清除表单缓存',
                    visible: 'showForm',
                    icon: 'ibps-icon-connectdevelop'
                },
                {
                    name: 'AES加解密',
                    visible: 'showConvertAes',
                    icon: 'ibps-icon-unlock-alt'
                }
            ]
        }
        if (this.$nodeEnv === 'development') {
            const nodeEnvArry = [
                {
                    name: '切换环境',
                    visible: 'showBaseUrl',
                    icon: 'ibps-icon-wifi'
                }
            ]
            this.tools = nodeEnvArry.concat(this.tools)
        }
    },
    methods: {
        handleShowDialog (visible) {
            if (visible === 'showPlatform') {
                cleanPlatformCache().then(() => {
                    this.$message.success('清除平台缓存成功！')
                })
            } else if (visible === 'showForm') {
                cleanFormCache().then(() => {
                    this.$message.success('清除表单缓存成功！')
                })
            } else {
                this[visible] = true
            }
        },
        ...mapMutations('ibps/log', ['clean']),
        handleClick () {
            if (this.logLength > 0) {
                this.dialogVisible = true
            }
        },
        handleLogClean () {
            this.dialogVisible = false
            this.clean()
        },
        // Log upload
        handleUpload () {
            this.uploading = true
            this.$notify({
                type: 'info',
                title: this.$t('notify.special.upload.start.title'),
                message: this.$t('notify.special.upload.start.message')
            })
            // TODO:后端接口
            setTimeout(() => {
                this.uploading = false
                this.$notify({
                    type: 'success',
                    title: this.$t('notify.special.upload.success.title'),
                    message: this.$t('notify.special.upload.success.message')
                })
            }, 3000)
        }
    }
}
</script>
