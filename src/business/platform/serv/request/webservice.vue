<template>
  <div class="service-request-webservice">
    <parameter :data.sync="formData" :readonly="readonly" :type="type" />
  </div>
</template>
<script>
import Parameter from '@/business/platform/serv/components/parameter'

export default {
  components: {
    Parameter
  },
  props: {
    value: Array,
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      formData: []
    }
  },
  watch: {
    value(val, oldVal) {
      this.formData = val
    }
  },
  methods: {
    getData() {
      return this.formData
    }
  }
}
</script>
