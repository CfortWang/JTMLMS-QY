<template>
  <flow-diagram
    ref="flowDiagram"
    :def-id="defId"
    :task-id="taskId"
    :inst-id="instId"
    :biz-key="bizKey"
  />
</template>
<script>
import FlowDiagram from '@/business/platform/bpmn/components/flow-diagram/index'

export default {
  components: {
    FlowDiagram
  },
  props: {
    defId: String,
    taskId: String,
    instId: String,
    bizKey: String
  },
  // watch: {
  //   defId: {
  //     handler() {
  //       this.getFormData()
  //     },
  //     immediate: true
  //   },
  //   taskId: {
  //     handler() {
  //       this.getFormData()
  //     },
  //     immediate: true
  //   },
  //   instId: {
  //     handler() {
  //       this.getFormData()
  //     },
  //     immediate: true
  //   },
  //   bizKey: {
  //     handler() {

  //     },
  //     immediate: true
  //   }
  // },
  mounted() {
    this.getFormData()
  },
  methods: {
    getFormData() {
      this.$nextTick(() => {
        this.$refs.flowDiagram.getFormData()
      })
    }
  }
}
</script>
