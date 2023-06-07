<template>
  <ibps-help
    :title="showTitle"
    :content="showContent"
    :width="width"
  />
</template>
<script>
import HelpTip from '../../constants/helpTip'

export default {
  props: {
    prop: {
      type: String
    },
    title: String,
    content: String,
    width: {
      type: [Number, String],
      default: 250
    }
  },
  computed: {
    showTitle() {
      if (this.title) return this.title
      return this.tip ? this.tip.title || '' : ''
    },
    showContent() {
      if (this.content) return this.content
      return this.tip ? this.tip.content || '' : ''
    },
    tip() {
      return HelpTip[this.prop]
    }
  }
}
</script>
