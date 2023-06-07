<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-base
        :field-item="fieldItem"
        types="label,desc,contentPosition"
      />
      <!-- 布局设置 -->
      <editor-layout
        :field-item="fieldItem"
        types="customClass,mobile"
      />
    </el-form>
  </div>
</template>

<script>
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-divider',
  mixins: [typeMixin]
}
</script>
