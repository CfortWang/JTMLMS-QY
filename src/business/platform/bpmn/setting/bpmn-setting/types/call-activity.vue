<template>
  <div>
    <div v-sticky class="setting-title">
      外部子流程设置<template v-if="$utils.isNotEmpty(data.node_name )">--【{{ data.node_name }}】</template>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="外部子流程设置" name="callActivity">
        <call-activity
          :data="callActivity"
          :def-key="defKey"
          :global-data="globalData"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  props: {
    data: Object,
    defKey: String,
    globalData: Object
  },
  data() {
    return {
      activeNames: ['callActivity']
    }
  },
  computed: {
    callActivity() {
      return this.data
    }
  }
}
</script>
