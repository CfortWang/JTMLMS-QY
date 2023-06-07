<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="dialog raqsoft-import-dialog"
    @close="closeDialog"
  >
    <el-form
      ref="importForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="importForm"
      :label-width="formLabelWidth"
      class="import-form"
      @submit.native.prevent
    >
      <el-form-item label="选择文件:" required>
        <el-upload
          ref="upload"
          action="https://www.bpmhome.cn/post"
          accept=".rpx"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="importForm.fileList"
          :auto-upload="false"
        >
          <el-button type="primary" icon="el-icon-upload">选择文件</el-button>
          <div slot="tip" class="el-upload__tip">请选择报表文件进行上传</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import ActionUtils from '@/utils/action'
import utils from './utils'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      title: '上传报表',
      formName: 'importForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      importForm: {
        fileList: []
      },
      toolbars: [
        { key: 'import' },
        { key: 'cancel' }
      ]
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        this.importForm.fileList = []
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'import':
          this.handleImport()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 保存数据
    handleImport() {
      if (this.$utils.isEmpty(this.$refs.upload.uploadFiles)) {
        ActionUtils.saveErrorMessage('请选择文件进行导入!!')
        return
      }
      const file = this.$refs.upload.uploadFiles[0].raw
      if (this.$utils.isEmpty(file) || this.$utils.isEmpty(file.name) || !this.$utils.trim(file.name).endsWith('.rpx')) {
        ActionUtils.warning('请选择rpx文件进行导入!')
        return
      }
      this.saveData(file)
    },
    // 提交保存数据
    saveData(file) {
      const data = new FormData() // 创建form对象
      data.append('file', file)
      const url = utils.reportUrl('/upload/report?reportPath=' + this.path)
      axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        if ((response.status === 200 || response.status === '200')) {
          this.$emit('callback', this)
        } else {
          ActionUtils.saveErrorMessage(response.data.cause)
        }
        this.closeDialog()
      }).catch((err) => {
        console.error(err)
      })
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
    }
  }

}
</script>
<style lang="scss">
.raqsoft-import-dialog{
  .el-dialog__body{
    height:  calc(27vh - 130px) !important;
  }
}
</style>
