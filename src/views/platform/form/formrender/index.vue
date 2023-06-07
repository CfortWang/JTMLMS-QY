<template>
  <ibps-form-formrender
    v-if="formDef"
    ref="formrender"
    :form-def="formDef"
    :buttons="buttons"
    :data="formData"
    :params="formParams"
    :readonly="readonly"
    @action-event="(actionKey,args)=>emitEventHandler(actionKey,args)"
    @callback="callback"
    @close="closeDialog"
  />
</template>
<script>
import { getFormData } from '@/api/platform/form/formDef'
export default {
  components: {
    'ibps-form-formrender': () => import('@/business/platform/form/formrender/index.vue')
  },
  props: {
    formKey: String,
    pkValue: String,
    buttons: Array,
    formParams: Object,
    readonly: {
      type: Boolean,
      default: false
    },
    rightsScope: String
  },
  data() {
    return {
      formDef: {},
      formData: {}
    }
  },
  watch: {
    formKey: {
      handler(val) {
        if (this.$utils.isNotEmpty(val)) {
          this.formKey = val
          this.loadFormData()
        }
      },
      immediate: true
    }
  },
  methods: {
    loadFormData() {
      getFormData({
        formKey: this.formKey,
        pk: this.pkValue,
        rightsScope: this.rightsScope
      }).then(response => {
        const result = response.data
        let responses = {}
        if (this.$utils.isNotEmpty(this.defaultData)) {
          responses = this.defaultData
        } else {
          responses = result.boData ? JSON.parse(result.boData) : {}
        }

        this.formData = {
          // 表单数据
          responses: responses,
          // 表单权限
          permissions: this.$utils.parseData(result.permissions) || {}
        }
        // 从后台获取表单定义数据
        this.formDef = this.$utils.parseData(result.form) || {}
      }).catch(() => {
      })
    },
    emitEventHandler(actionKey, args) {
      this.$emit('action-event', actionKey, args)
    },
    callback(data) {
      this.$emit('callback', data)
    },
    closeDialog(data) {
      this.$emit('close', data)
    }
  }
}
</script>
