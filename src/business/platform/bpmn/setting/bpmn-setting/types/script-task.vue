<template>
  <div>
    <div v-sticky class="setting-title">
      脚本任务设置<template v-if="$utils.isNotEmpty(data.node_name )">--【{{ data.node_name }}】</template>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="事件设置" name="eventScript">
        <event-script :data="scripts" :node-type="data.node_type" :node-id="data.id" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  data() {
    return {
      activeNames: ['eventScript']
    }
  },
  computed: {
    scripts() {
      return this.data ? this.data.scripts || {
        node: ''
      } : {
        node: ''
      }
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        if (!this.data.scripts) {
          this.data.scripts = {
            node: ''
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
