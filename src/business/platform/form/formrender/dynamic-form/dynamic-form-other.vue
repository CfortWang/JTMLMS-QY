<template>
  <!--描述-->
  <ibps-desc
    v-if="field.field_type==='desc'"
    :item="field"
  />
  <!--分隔线-->
  <div v-else-if="field.field_type==='divider'">
    <el-divider
      :content-position="field.field_options.content_position"
    >{{ field.label }}
    </el-divider>
    <div v-if="field && field.desc" class="ibps-help-block">
      {{ field.desc }}
    </div>
  </div>
  <!--警告-->
  <div v-else-if="field.field_type==='alert'" class="ibps-pb-10">
    <el-alert
      :title="field.label"
      :description="field.desc"
      :type="field.field_options.type"
      :closable="field.field_options.closable"
      :close-text="field.field_options.close_text"
      :center="field.field_options.center"
      :show-icon="field.field_options.show_icon"
      :effect="field.field_options.effect"
    />
  </div>
  <!--流程图-->
  <div v-else-if="field.field_type==='flow_diagram' && showFlowDiagram">
    <div class="ibps-page-header-title">
      流程图
    </div>
    <flow-diagram
      ref="flowDiagram"
      :biz-key="bizKey"
      :def-id="defId"
      :task-id="taskId"
      :inst-id="instanceId"
      @error="()=>showFlowDiagram=false"
    />
  </div>
  <!--审批历史-->
  <div v-else-if="field.field_type==='approval_history' && showApprovalHistory">
    <div class="ibps-page-header-title">
      审批历史
    </div>
    <approval-history
      ref="approvalHistory"
      :biz-key="bizKey"
      :task-id="taskId"
      :inst-id="instanceId"
      @error="()=>showApprovalHistory=false"
    />
  </div>
  <!--流程关联-->
  <div v-else-if="field.field_type==='bpmLink'">
    <el-form-item
      :label="label"
      :label-width="labelWidth"
      :class="field.field_options.custom_class"
    >
      <template slot="label">{{ label+labelSuffix }}
        <ibps-help v-if="field && field.desc && descPosition==='lableIcon'" type="tooltip" :content="$utils.formatText(field.desc)" />
      </template>
      <bpm-link :data="bpmLinkData" :bpm-link-type="bpmLinkType" />
    </el-form-item>
  </div>
</template>
<script>
import IbpsDesc from './components/desc'
import FlowDiagram from '@/business/platform/bpmn/components/flow-diagram'
import ApprovalHistory from '@/business/platform/bpmn/components/approval-history'
import BpmLink from '@/business/platform/bpmn/components/bpm-link'

export default {
  components: {
    BpmLink,
    IbpsDesc,
    FlowDiagram,
    ApprovalHistory
  },
  props: {
    models: Object, // 所有对象数据
    field: Object, // 字段
    params: Object
  },
  data() {
    return {
      showApprovalHistory: false,
      showFlowDiagram: false
    }
  },
  computed: {
    defId() {
      return this.params ? this.params.defId : null
    },
    taskId() {
      return this.params ? this.params.taskId : null
    },
    instanceId() {
      return this.params ? this.params.instanceId : null
    },
    bizKey() {
      return this.params ? this.params.bizKey : null
    },
    bpmLinkData() {
      return this.params ? this.params.bpmLinkData : null
    },
    bpmLinkType() {
      return this.field.field_options ? this.field.field_options.bpmLinkType : null
    },
    label() { // 显示的文本
      if (this.field.field_options.hide_label) return null
      return this.$utils.isNotEmpty(this.field.field_options.units) ? this.field.label + '(' + this.field.field_options.units + ')' : this.field.label
    },
    labelSuffix() {
      return this.params.labelSuffix
    },
    labelWidth() { // 字段宽度
      if (this.field.field_options.hide_label) { return '0' }
      return this.field.field_options.is_label_width ? this.field.field_options.label_width + (this.field.field_options.label_width_unit || 'px') : this.defaultLabelWidth
    }
  },
  watch: {
    params: {
      handler(val) {
        // 是否显示审批历史
        this.showApprovalHistory = !!(this.taskId || this.instanceId || this.bizKey)
        // 是否显示流程图
        this.showFlowDiagram = !!(this.defId || this.taskId || this.instanceId || this.bizKey)

        if (this.field.field_type === 'flow_diagram' && this.showFlowDiagram) {
          this.$nextTick(() => {
            this.$refs.flowDiagram.getFormData()
          })
        }
        if (this.field.field_type === 'approval_history' && this.showApprovalHistory) {
          this.$nextTick(() => {
            this.$refs.approvalHistory.getFormData()
          })
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
