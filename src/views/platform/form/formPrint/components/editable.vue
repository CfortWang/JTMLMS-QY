<template>
  <div

    @dblclick="onDblclick"
  >
    <div v-if="!showEditor" class="data">{{ getCellText() }}</div>
    <input
      v-else
      v-model="editor"
      v-clickoutside="handleClickoutside"
      class="editor"
    >
  </div>
</template>
<script>
import Clickoutside from '@/plugins/element-ui/src/utils/clickoutside'
export default {
  directives: { Clickoutside },
  props: {
    value: Array
  },
  data() {
    return {
      showEditor: false,
      editor: ''
    }
  },
  methods: {
    getCellText() {
      var cellValue = []
      var content = ''
      if (this.$utils.isNotEmpty(this.value)) {
        content = this.value.join('')
      }

      var contents = content.split(/(\${page_number})/)
      contents.forEach((val) => {
        cellValue.push(/\${page_number}/.test(val) ? '{页码}' : val)
      })

      return cellValue.join('')
    },
    getCellValue(value) {
      var cellValue = []
      var values = value.split(/({页码})/)

      values.forEach((val) => {
        if (this.$utils.isNotEmpty(val)) {
          if (/{页码}/.test(val)) {
            cellValue.push('${page_number}')
          } else {
            cellValue.push(val)
          }
        }
      })
      return [cellValue.join('')]
    },
    onDblclick() {
      this.editor = this.getCellText()
      this.showEditor = true
    },
    handleClickoutside() {
      this.$emit('input', this.getCellValue(this.editor))
      this.showEditor = false
    }
  }
}
</script>
