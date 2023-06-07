<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="ibps-code-dialog"
    width="50%"
    append-to-body
    @close="closeDialog"
    @open="getFormData"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="Vue Component">
        <codemirror ref="templateScript" v-model="templateScript" :options="cmOption" />
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="el-dialog--center cobyOrderSn">
      <el-button class="copyBtn" type="primary" data-clipboard-action="copy" :data-clipboard-text="templateScript" @click="copy">复制数据</el-button>
      <el-button class="" type="primary" @click="exportCode">导出代码</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/javascript/javascript.js'
import ActionUtils from '@/utils/action'
import Clipboard from 'clipboard'

export default {
  components: {
    codemirror
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '生成代码'
    },
    data: {
      type: String
    },
    fileKey: String
  },
  data() {
    const _this = this
    return {
      dialogVisible: false,
      templateScript: '',
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/javascript',
        theme: 'eclipse',
        extraKeys: {
          'Ctrl-S': function(e) {
            _this.handleConfirm(false)
          }
        }
      }
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    exportCode() {
      ActionUtils.exportFile(this.templateScript, this.fileKey + '.vue')
    },
    copy() {
      const _this = this
      const clipboard = new Clipboard('.copyBtn')
      clipboard.on('success', function() {
        _this.$message({
          message: '复制成功',
          type: 'success'
        })
        clipboard.destroy()
      })
      clipboard.on('error', function() {
        _this.$message({
          message: '复制失败',
          type: 'error'
        })
        clipboard.destroy()
      })
    },
    getFormData() {
      this.$nextTick(() => {
        this.templateScript = this.data || ''
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="scss" >

.ibps-code-dialog{
  .el-dialog__footer{
    border-top: 0;
  }
  .el-dialog__body{
    padding-top:10px ;
  }
  .CodeMirror{
    height: 400px ;
  }

  .form-script-head-title{
    border: 1px solid #e0e0e0;
    .el-form-item__label{
      background: #f3f8fb;
      padding: 0 10px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-size: 14px;
      width: 100%;
    }
  }

  .form-script-info-name {
    font-size: 12px;
    color: #91A1B7;
    line-height: 18px;
    margin-bottom: 5px;
  }
  .form-script-info-main{
    height: 300px;
    border: 1px solid #e0e0e0;
    padding: 0 5px;
  }

  .function-tree-node{
    width: 100%;
  }

  .form-script-intro{
    .form-script-title {
      height: 38px;
      line-height: 38px;
      border-bottom: solid 1px #e0e0e0;
      padding-left: 10px;
    }
    .form-script-name {
      color: #761086;
    }
  }

  ul {
    font-size: 10px;
    padding: 5px 0 5px 15px;
    margin: 0 10px;
  }
  ul li {
      line-height: 20px;
      list-style-type: disc;
  }
  ul span.form-script-key {
      margin: 0 3px;
      color: #708
  }

  ul span.form-script-field {
      padding: 0 5px;
      margin: 0 3px;
      display: inline-block;
      -webkit-border-radius: 2px;
      -moz-border-radius: 2px;
      border-radius: 2px;
      color: #fff;
      background-color: #178cdf
  }
}
</style>
