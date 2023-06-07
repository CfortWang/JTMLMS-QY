<template>
  <data-template-render-preview
    :visible="dialogVisible"
    :data="dataTemplate"
    :dynamic-params="dynamicParams"
    @close="handleClose"
    @action-event="handleActionEvent"
  />
</template>
<script>
import { getByKey } from '@/api/platform/data/dataTemplate'
import DataTemplateRenderPreview from './index'
export default {
  components: {
    DataTemplateRenderPreview
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    templateKey: {
      type: String
    },
    dynamicParams: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataTemplate: {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        if (val) {
          this.loadData()
        } else {
          this.dataTemplate = {}
        }
      },
      immediate: true
    }
  },
  methods: {
    loadData() {
      this.dataTemplate = {}
      getByKey({
        dataTemplateKey: this.templateKey
      }).then(response => {
        // 从后台获取数据
        this.dataTemplate = this.$utils.parseData(response.data)
        this.dialogVisible = true
      }).catch(() => {
      })
    },
    handleClose(visible) {
      this.$emit('close', visible)
    },
    handleActionEvent(key, data) {
      this.$emit('action-event', key, data)
    }
  }
}
</script>
