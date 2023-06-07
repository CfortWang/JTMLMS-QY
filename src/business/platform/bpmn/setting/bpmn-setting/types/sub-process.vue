<template>
  <div>
    <div v-sticky class="setting-title">
      内嵌子流程设置<template v-if="$utils.isNotEmpty(data.node_name )">--【{{ data.node_name }}】</template>
    </div>
  </div>
</template>
<script>
import mixins from '../mixins/type'
export default {
  mixins: [mixins],
  props: {
    data: Object
  },
  data() {
    return {
      activeNames: ['subProcess']
    }
  },
  computed: {
    subProcess() {
      return this.data
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
