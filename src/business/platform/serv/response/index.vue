<template>
  <json :data.sync="formData" :readonly="readonly" :type="type" request-type="response" />
</template>
<script>
import Json from '@/business/platform/serv/components/json'
export default {
  components: {
    Json
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
    value(val) {
      this.formData = val
    }
  },
  mounted() {
    this.formData = this.value
  },
  methods: {
    getData() {
      return this.formData
    }
  }
}
</script>
