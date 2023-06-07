<template>
  <div>
    <el-tooltip
      :content="tooltipContent"
      effect="dark"
      placement="bottom"
    >
      <el-button
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
        @click="handleClick"
      >
        <el-badge
          v-if="logLength > 0"
          :max="99"
          :value="logLengthError"
          :is-dot="logLengthError === 0"
        >
          <ibps-icon
            :name="logLengthError === 0 ? 'dot-circle-o' : 'bug'"
            style="font-size: 20px"
          />
        </el-badge>
        <ibps-icon
          v-else
          name="dot-circle-o"
          style="font-size: 20px"
        />
      </el-button>
    </el-tooltip>
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
          {{ $t('layout.header-aside.header-error-log.upload.button') }}
        </el-button>

        <el-button type="danger" size="mini" @click="handleLogClean">
          <ibps-icon name="trash-o" />
          {{ $t('common.buttons.clean') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import IbpsErrorLogList from './components/list'
export default {
  components: {
    IbpsErrorLogList
  },
  data() {
    return {
      uploading: false,
      dialogVisible: false
    }
  },
  computed: {
    ...mapState('ibps/log', [
      'log'
    ]),
    ...mapGetters('ibps', {
      logLength: 'log/length',
      logLengthError: 'log/lengthError'
    }),
    tooltipContent() {
      // `${this.logLength} 条日志${this.logLengthError > 0
      //   ? ` | 包含 ${this.logLengthError} 个异常`
      //   : ''}`
      return this.logLength === 0
        ? this.$t('layout.header-aside.header-error-log.empty')
        : (
          this.logLengthError > 0 ? this.$t('layout.header-aside.header-error-log.logError', {
            logLength: this.logLength,
            logLengthError: this.logLengthError
          })
            : this.$t('layout.header-aside.header-error-log.logInfo', { logLength: this.logLength })
        )
    }
  },
  methods: {
    ...mapMutations('ibps/log', [
      'clean'
    ]),
    handleClick() {
      if (this.logLength > 0) {
        this.dialogVisible = true
      }
    },
    handleLogClean() {
      this.dialogVisible = false
      this.clean()
    },
    // Log upload
    handleUpload() {
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
