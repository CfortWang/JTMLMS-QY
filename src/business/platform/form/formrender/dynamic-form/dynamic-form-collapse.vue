<template>
  <el-collapse v-model="activeNames" :accordion="field.field_options.accordion">
    <el-collapse-item
      v-for="(col, colIndex) in field.field_options.columns"
      :key="colIndex"
      :name="col.name"
      :title="col.label"
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
    </el-collapse-item>
  </el-collapse>
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
  },
  data() {
    const columns = this.field.field_options.columns || []
    const activeNames = []
    columns.forEach(column => {
      if (column.checked) {
        activeNames.push(column.name)
      }
    })
    return {
      activeNames: activeNames
    }
  }
}
</script>
