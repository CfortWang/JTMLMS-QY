<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners">
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,desc,display"
      />
      <!-- 参数设置 -->
      <editor-field-selector
        :field-item="fieldItem"
        types="store"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
        types="hide"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,width,customClass,mobile"
      />
    </el-form>
  </div>

</template>
<script>
import typeMixin from '../mixins/type'
import { selectorTypeOptions } from '@/business/platform/form/constants/fieldOptions'

export default {
  name: 'ibps-field-current-org',
  mixins: [typeMixin],
  data() {
    return {
      selectorTypeOptions: selectorTypeOptions
    }
  }
}
</script>
