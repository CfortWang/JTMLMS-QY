<template>
  <ibps-tree
    ref="tree"
    :width="width"
    :height="height"
    :data="data"
    :options="options"
    :toolbars="toolbars"
    :contextmenus="contextmenus"
  />
</template>
<script>
import { isIE } from '@/plugins/element-ui/src/utils/util'
export default {
  props: {
    template: Object
  },
  data() {
    const flexWidth = isIE() ? 20 : 0
    return {
      width: document.body.clientWidth - 570 - flexWidth,
      height: 400,
      data: [],
      toolbars: [],
      contextmenus: [],
      options: {
        emptyText: '未设置显示字段'
      }
    }
  },
  watch: {
    template: {
      handler(val, oldVal) {
        if (!this.template) { return }
        const toolbarButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
        // 工具栏
        const toolbars = []
        toolbarButtons.forEach(button => {
          toolbars.push({
            key: button.button_type,
            label: button.label
          })
        })
        this.toolbars = toolbars
        if (this.$utils.isNotEmpty(this.template.display_columns.name_key)) {
          this.options.emptyText = '已设置显示字段'
        } else {
          this.options.emptyText = '未设置显示字段'
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
