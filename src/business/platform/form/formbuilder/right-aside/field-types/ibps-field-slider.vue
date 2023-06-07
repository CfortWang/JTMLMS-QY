<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
      >
        <template slot="fixedValue">
          <el-slider
            v-model="fieldOptions.default_value"
            :max="fieldOptions.max"
            :min="fieldOptions.min"
            :step="fieldOptions.step"
          />
        </template>

      </editor-base>
      <!-- 滑块设置 -->
      <editor-field-slider
        :field-item="fieldItem"
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
import EditorFieldSlider from '../editors/editor-field-slider'

export default {
  name: 'ibps-field-slider',
  components: {
    EditorFieldSlider
  },
  mixins: [typeMixin]
}
</script>
