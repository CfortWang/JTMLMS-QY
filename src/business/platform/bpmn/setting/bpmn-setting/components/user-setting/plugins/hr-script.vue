<template>
  <div class="bpm-user-plugins-hr-script">
    <table class="table table-bordered  table-striped ">
      <tbody>
        <tr>
          <td>表单变量</td>
          <td>
            <el-button size="mini" type="primary" @click="commonScriptVisible=true">常用脚本</el-button>
            <el-button size="mini" type="primary" @click="conditionScriptSelectVisible=true">条件脚本</el-button>
            <bpmn-form-var size="mini" style="display: inline-block;" @input="handleFormVar" />
          </td>
        </tr>
        <tr>
          <td><label class="required">*</label>脚本</td>
          <td>
            <codemirror ref="codemirror" v-model="formData.script" :options="cmOption" />
          </td>
        </tr>
        <tr>
          <td><label class="required">*</label>描述</td>
          <td>
            <el-input v-model="formData.description" />
          </td>
        </tr>
      </tbody>
    </table>
    <common-script
      :multiple="true"
      :visible="commonScriptVisible"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => commonScriptVisible = visible"
    />
    <condition-script-select
      :visible="conditionScriptSelectVisible"
      :style="{width:'100%'}"
      class="form-content"
      @close="visible => conditionScriptSelectVisible = visible"
    />
  </div>
</template>

<script>
import pluginMixin from '../mixins/plugin'
import BpmnFormVar from '@/business/platform/bpmn/setting/bpmn-setting/components/form-var-select'
import commonScript from '@/business/platform/bpmn/setting/bpmn-setting/components/form-script/common-script/dialog'
import conditionScriptSelect from '@/business/platform/bpmn/setting/bpmn-setting/components/form-script/condition-script'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'

export default {
  components: {
    BpmnFormVar,
    codemirror,
    commonScript,
    conditionScriptSelect
  },
  mixins: [pluginMixin],
  data() {
    return {
      commonScriptVisible: false, // 常用脚本
      conditionScriptSelectVisible: false, // 条件脚本
      cmOption: {
        tabSize: 4,
        lineNumbers: true,
        line: true,
        autoCloseTags: true,
        mode: 'text/html',
        theme: 'eclipse'
      }
    }
  },
  methods: {
    getEditor() {
      return this.$refs.codemirror.cminstance
    },
    getData() {
      if (this.$utils.isEmpty(this.formData.script)) {
        return {
          result: false,
          message: '请填写人员脚本！'
        }
      }
      if (this.$utils.isEmpty(this.formData.description)) {
        return {
          result: false,
          message: '请填写描述！'
        }
      }

      return {
        data: this.formData,
        result: true
      }
    },
    handleFormVar(data) {
      this.getEditor().replaceSelection(data.name)
    }
  }
}
</script>
<style lang="scss">
.bpm-user-plugins-hr-script{
  .CodeMirror {
      height: 200px !important;
      .CodeMirror-scroll {
        padding-bottom: 8px !important;
        height: 200px !important;
        border: 1px solid #eee;
      }
  }
}
</style>
