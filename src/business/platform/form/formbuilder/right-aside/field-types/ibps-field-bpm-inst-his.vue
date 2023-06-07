<template>
  <div>
    <el-form
      v-bind="$attrs"
      v-on="$listeners"
      @submit.native.prevent
    >
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,desc,placeholder"
      />
      <!-- 流程实例设置 -->
      <editor-field-inst-his
        :field-item="fieldItem"
        types="name"
      />
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
        types="required"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
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
  name: 'ibps-field-inst-his',
  mixins: [typeMixin]
}
</script>
