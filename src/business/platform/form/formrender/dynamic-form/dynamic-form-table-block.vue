<template>
  <div>
    <!--嵌套布局-->
    <component
      :is="'ibps-dynamic-form-'+field.field_type"
      v-if="field.field_type === 'grid' || field.field_type === 'tabs' || field.field_type === 'collapse' || field.field_type === 'steps'"
      :ref="'formItem'+field.name"
      :models="models"
      :rights="rights"
      :field="field"
      :row="row"
      :code="code"
      :main-code="mainCode"
      :form-data="formData"
      :params="params"
      v-on="$listeners"
    />
    <!--其他类型-->
    <ibps-dynamic-form-item
      v-else
      :ref="'formItem'+field.name"
      :models="models"
      :rights="rights"
      :field="field"
      :row="row"
      :code="code"
      :main-code="mainCode"
      :form-data="formData"
      :params="params"
      v-on="$listeners"
    />
  </div>
</template>
<script>
import NestedMixin from './mixins/nested'

export default {
  mixins: [NestedMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  }
}
</script>
