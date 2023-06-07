<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="label,desc"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,customClass,mobile"
      />
    </el-form>
    <el-alert
      title="使用该控件，需工作流绑定该表单，才有流程审批流程图展示！"
      type="warning"
      :closable="false"
    />
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-flow-diagram',
  mixins: [typeMixin]
}
</script>
