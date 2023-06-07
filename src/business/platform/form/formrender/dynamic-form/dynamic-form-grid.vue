<template>
  <el-row
    :gutter="field.field_options.gutter ? field.field_options.gutter : 0"
    :justify="field.field_options.justify"
    :align="field.field_options.align"
    class="widget-col"
    type="flex"
  >
    <el-col
      v-for="(col, colIndex) in field.field_options.columns"
      :key="colIndex"
      :span="col.span ? col.span : 0"
    >

      <template v-for="(item, index) in col.fields">
        <!--嵌套布局-->
        <component
          :is="'ibps-dynamic-form-'+item.field_type"
          v-if="item.field_type === 'grid' || item.field_type === 'tabs' || item.field_type === 'collapse' || item.field_type === 'steps'"
          :ref="'formItem'+item.name"
          :key="index"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :params="params"
          v-on="$listeners"
        />
        <!--其他类型-->
        <ibps-dynamic-form-item
          v-else
          :ref="'formItem'+item.name"
          :key="index"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :params="params"
          v-on="$listeners"
        />
      </template>


    </el-col>
  </el-row>
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
