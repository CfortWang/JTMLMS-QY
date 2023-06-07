<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="switchFieldType,label,key,desc,display"
      />
      <editor-field-component
        :field-item="fieldItem"
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
import EditorFieldComponent from '../editors/editor-field-component'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-component',
  components: {
    EditorFieldComponent
  },
  mixins: [typeMixin]
}
</script>
