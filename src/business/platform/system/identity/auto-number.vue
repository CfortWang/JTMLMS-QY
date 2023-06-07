<template>
  <div>
    <div
      v-if="readonly && readonlyText "
      v-text="value"
    />
    <el-input
      v-else
      v-model="value"
      :placeholder="defaultPlaceholder"
      :prefix-icon="prefixIcon"
      readonly
      unselectable="on"
    />
  </div>
</template>
<script>

export default {
  props: {
    alias: { // 流水号别名
      type: String
    },
    value: {
      type: String
    },
    placeholder: { // 占位符
      type: String
    },
    prefixIcon: { // 前缀图标
      type: String,
      default: 'ibps-icon-list-ol'
    },
    init: { // 是否初始化
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    readonlyText: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultPlaceholder() {
      // return this.init ? this.placeholder : '自动生成无需填写'
      return this.$utils.isNotEmpty(this.placeholder) ? this.placeholder : '自动生成无需填写'
    }
  }

}
</script>
