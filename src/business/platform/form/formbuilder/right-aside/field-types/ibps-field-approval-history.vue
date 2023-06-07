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
      <el-alert
        title="使用该控件，需工作流绑定该表单且流程启动成功后，才有流程审批历史展示！只支持本地数据源的数据，不支持远程的数据！"
        type="warning"
        :closable="false"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-approval-history',
  mixins: [typeMixin]
}
</script>
