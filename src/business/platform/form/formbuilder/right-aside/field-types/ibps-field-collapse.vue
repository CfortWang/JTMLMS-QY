<template>
  <div>
    <el-form v-bind="$attrs" v-on="$listeners" @submit.native.prevent>
      <!-- 基本属性 -->
      <editor-field-collapse
        :field-item="fieldItem"
      />
    </el-form>
  </div>
</template>

<script>
import EditorFieldCollapse from '../editors/editor-field-collapse'
import typeMixin from '../mixins/type'

export default {
  name: 'ibps-field-collapse',
  components: {
    EditorFieldCollapse
  },
  mixins: [typeMixin]
}
</script>
