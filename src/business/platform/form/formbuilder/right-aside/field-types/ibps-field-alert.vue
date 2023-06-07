<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="label,desc"
      />
      <editor-field-alert
        :field-item="fieldItem"
      />
      <editor-attribute
        :field-item="fieldItem"
        types="center,showIcon,closable"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="customClass,mobile"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-alert',
  mixins: [typeMixin]
}
</script>
