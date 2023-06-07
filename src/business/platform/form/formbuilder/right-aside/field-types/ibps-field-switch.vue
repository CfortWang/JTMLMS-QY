<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        :bo-data="boData"
        :fields="fields"
        types="switchFieldType,label,name,defaultValue,desc,display"
      >
        <template slot="fixedValue">
          <el-switch
            v-model="fieldOptions.default_value"
            :width="fieldOptions.width"
            :active-value="fieldOptions.active_value"
            :inactive-value="fieldOptions.inactive_value"
            :active-text="fieldOptions.active_text"
            :inactive-text="fieldOptions.inactive_text"
            :active-color="fieldOptions.active_color"
            :inactive-color="fieldOptions.inactive_color"
          />
        </template>
      </editor-base>

      <!-- 开关设置 -->
      <editor-field-switch
        :field-item="fieldItem"
      />
      <!-- 字段权限 -->
      <editor-rights
        :field-item="fieldItem"
      />
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,width,customClass,mobile"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'
import EditorFieldSwitch from '../editors/editor-field-switch'

export default {
  name: 'ibps-field-switch',
  components: {
    EditorFieldSwitch
  },
  mixins: [typeMixin]
}
</script>
