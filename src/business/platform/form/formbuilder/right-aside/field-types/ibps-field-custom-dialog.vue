<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
      >
        <ibps-custom-dialog
          slot="fixedValue"
          v-model="fieldOptions.default_value"
          :template-key="fieldOptions.dialog"
          :dynamic-params="dynamicParams"
          :multiple="fieldOptions.multiple === 'Y'"
          :placeholder="fieldOptions.placeholder"
          :store="fieldOptions.store"
          :icon="fieldOptions.icon?'ibps-icon-'+fieldOptions.icon:''"
          :type="fieldOptions.dialog_type"
        />

      </editor-base>
      <!-- 参数设置 -->
      <editor-field-custom-dialog
        :field-item="fieldItem"
        :fields="fields"
      />
      <!-- 校验规则 -->
      <editor-rules
        :field-item="fieldItem"
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
import FormUtils from '@/business/platform/form/utils/formUtil'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'

export default {
  name: 'ibps-field-custom-dialog',
  components: {
    IbpsCustomDialog
  },
  mixins: [typeMixin],
  computed: {
    dynamicParams() {
      return FormUtils.getLinkDynamicParams(this.fieldOptions)
    }
  }
}
</script>
