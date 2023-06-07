<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-field-steps
        :field-item="fieldItem"
      />
    </el-form>
  </div>
</template>

<script>
import EditorFieldSteps from '../editors/editor-field-steps'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-steps',
  components: {
    EditorFieldSteps
  },
  mixins: [typeMixin]
}
</script>
