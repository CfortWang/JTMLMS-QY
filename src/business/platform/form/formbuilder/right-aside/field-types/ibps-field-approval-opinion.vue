<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="label,key,placeholder,desc"
      />
      <!-- 流程意见 -->
      <editor-field-approval-opinion
        :field-item="fieldItem"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="labelWidth,rows,autosize,customClass,mobile"
      />
      <el-alert
        title="使用该控件，需工作流绑定该表单，才有流程审批审批意见！"
        type="warning"
        :closable="false"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-approval-opinion',
  mixins: [typeMixin]
}
</script>
