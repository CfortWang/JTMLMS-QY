<template>
  <div>
    <div v-sticky class="setting-title">
      服务任务设置<template v-if="$utils.isNotEmpty(data.node_name )">--【{{ data.node_name }}】</template>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="服务任务设置" name="serviceSetting">
        <service-setting :data="service" />
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
      activeNames: ['serviceSetting']
    }
  },
  computed: {
    service() {
      return this.data ? this.data.service || {} : {}
    }
  },
  watch: {
    data: {
      handler(val, oldVal) {
        if (!this.data.service) {
          this.data.service = {
            ignoreException: 'Y',
            settings: [
              {
                serviceKey: '',
                serviceName: '',
                callbackType: 'default',
                bind: '{}',
                script: ''
              }
            ]
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
