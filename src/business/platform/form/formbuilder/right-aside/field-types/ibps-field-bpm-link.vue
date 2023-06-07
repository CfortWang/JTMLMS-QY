<template>
  <div>
    <el-form
      v-bind="$attrs"
      v-on="$listeners"
    >
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="label"
      />
      <!-- 流程关联设置 -->
      <editor-field-bpm-link
        :field-item="fieldItem"
        types="name"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
        types="hide"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,customClass,mobile"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-bpm-link',
  mixins: [typeMixin]
}
</script>
