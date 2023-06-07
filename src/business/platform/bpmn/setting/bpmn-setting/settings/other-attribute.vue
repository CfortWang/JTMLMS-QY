<template>
  <div class="bpmn-other-attribute panel-body">
    <el-form :model="attribute" label-width="120px" label-position="left" @submit.native.prevent>
      <el-form-item :style="{'marginBottom':'10px'}">
        <span slot="label">
          <label style="font-size:14px;">标题规则:</label>
          <el-tooltip
            class="item"
            effect="light"
            content="此处表单变量为文本替换，不能用于脚本计算！"
            placement="bottom"
          >
            <ibps-icon name="help" style="color:#dd5b44;" />
          </el-tooltip>
        </span>
        <bpmn-form-var :data="formVars" :props="{label: 'name'}" @callback="handleFormVar" />
      </el-form-item>
      <div class="ibps-pb-5">
        <codemirror ref="subjectRule" v-model="attribute.subjectRule" :options="cmOption" />
      </div>
      <!-- <el-form-item label="流程描述:">
        <el-input v-model="attribute.description" type="textarea" />
      </el-form-item> -->

      <el-form-item v-if="!attribute.hideSkipFirstNode" label="跳过第一个节点:">
        <el-radio-group v-model="attribute.skipFirstNode">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="第一个节点可以选择执行人:">
        <el-radio-group v-model="attribute.firstNodeUserAssign" class="ibps-mt-20">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <template slot="label">相邻节点相同<br>执行人直接跳过:</template>
        <el-radio-group v-model="attribute.skipSameUser" class="ibps-mt-20">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务允许转办:">
        <el-radio-group v-model="attribute.allowTransTo">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="允许执行人为空:">
        <el-radio-group v-model="attribute.allowExecutorEmpty">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <template slot="label">执行人为空时<br>跳过任务:</template>
        <el-radio-group v-model="attribute.skipExecutorEmpty" class="ibps-mt-20">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="通知类型:">
        <ibps-checkbox
          v-model="attribute.notifyType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item>
      <!-- <el-form-item label="测试通知类型:">
        <ibps-checkbox
          v-model="attribute.testNotifyType"
          :options="messageTypes"
          value-key="type"
          label-key="title"
        />
      </el-form-item> -->
      <el-form-item label="是否正式:">
        <el-radio-group v-model="attribute.testStatus">
          <el-radio label="run">正式</el-radio>
          <el-radio label="test">测试</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态:">
        <el-radio-group v-model="attribute.status">
          <el-radio label="deploy">已发布</el-radio>
          <!-- <el-radio label="forbidden">禁止</el-radio>
          <el-radio label="forbidden_instance">禁止实例</el-radio> -->
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getSubjectRuleVars } from '../utils'
import BpmnFormVar from '../components/form-var'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'

export default {
  components: {
    BpmnFormVar,
    codemirror
  },
  props: {
    data: Object,
    hideSkipFirstNode: Boolean // 是否隐藏跳过第一节点
  },
  data() {
    return {
      cmOption: {
        lineWrapping: true,
        lineNumbers: false,
        line: true,
        autoCloseTags: true,
        mode: 'text/html',
        theme: 'eclipse'
      }
    }
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes,
      boDefData: state => state.ibps.bpmn.boDefData,
      variables: state => state.ibps.bpmn.variables
    }),
    attribute() {
      return this.data
    },
    formVars() {
      return getSubjectRuleVars(this.boDefData, this.variables)
    }
  },

  methods: {
    getEditor() {
      return this.$refs.subjectRule.cminstance
    },
    handleFormVar(node) {
      let data = ''
      if (node.attrType === 'field') {
        data = '{' + node.tableName + '.' + node.key + '}'
      } else if (node.attrType === 'bpmConstants') {
        data = '{' + node.name + ':' + node.key + '}'
      } else if (node.attrType === 'var') {
        data = '{' + node.key + '}'
      } else {
        return
      }

      this.getEditor().replaceSelection(data)
      this.getEditor().focus()
    }
  }
}
</script>
<style lang="scss">
.bpmn-other-attribute{
 .CodeMirror {
    height: 80px !important;
    border: 1px solid #eee;
    .CodeMirror-scroll {
      height: 80px !important;
    }
  }
}
</style>
