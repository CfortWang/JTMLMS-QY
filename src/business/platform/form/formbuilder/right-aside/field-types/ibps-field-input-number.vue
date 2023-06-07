<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性  numberFormat-->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,defaultValue,placeholder,desc,display"
      >
        <template slot="fixedValue">
          <el-input-number
            v-model="defaultValue"
            :max="fieldOptions.max"
            :min="fieldOptions.min"
            :step="fieldOptions.step"
            :controls="fieldOptions.controls"
            :controls-position="fieldOptions.controls_position"
            :placeholder="fieldOptions.placeholder"
            :style="{width:fieldOptions.width||' 100%'}"
          />
        </template>
      </editor-base>

      <editor-field-input-number
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
        types="labelWidth,width,customClass,mobile"
      />
    </el-form>
  </div>

</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-number',
  mixins: [typeMixin],
  computed: {
    defaultValue: {
      get() {
        const value = this.fieldItem.field_options.default_value
        if (!this.$utils.isValidNumber(value)) { return void 0 }
        return Number(value)
      },
      set(value) {
        this.fieldItem.field_options.default_value = value
      }
    }
  }
}
</script>
