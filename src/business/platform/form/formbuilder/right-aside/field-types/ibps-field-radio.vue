<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,defaultValue,desc,display"
      />
      <!-- 表单选项 -->
      <editor-options
        :field-item="fieldItem"
        :fields="fields"
      />
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
        types="uncheck,required"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,arrangement,customClass,mobile"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-radio',
  mixins: [typeMixin]
}
</script>
