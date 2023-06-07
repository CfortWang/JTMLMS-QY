<template>
  <component
    :is="templateType"
    v-if="template"
    ref="dataTemplate"
    :value="value"
    :template-type-name="templateType"
    :template="template"
    :data-template="dataTemplate"
    :dynamic-params="dynamicParams"
    :multiple="multiple"
    :height="height"
    :fields="fields"
    :preview="preview"
    v-on="$listeners"
  />
</template>
<script>
import DataTemplate from './templates'

import Vue from 'vue'
Vue.component('ibps-data-template-formrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
  components: DataTemplate,
  props: {
    value: [String, Number, Array, Object],
    data: {
      type: Object
    },
    dynamicParams: {
      type: Object
    },
    multiple: {
      type: Boolean,
      default: true
    },
    height: {
      type: [String, Number]
    },
    preview: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      selected: false,
      dataTemplate: {}
    }
  },
  computed: {
    templateType() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          if (this.dataTemplate.composeType === 'treeList' || this.dataTemplate.composeType === 'listTree') {
            key = 'treeList'
          } else {
            key = this.dataTemplate.composeType
          }
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) { return }
      return 'ibps-data-template-' + key
    },
    template() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return {}
      }
      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose' && this.dataTemplate.composeType !== 'treeForm') {
        return templates
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    },
    fields() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        return {}
      }
      const fields = {}
      if (this.dataTemplate.datasets && this.dataTemplate.datasets.length > 0) {
        this.dataTemplate.datasets.forEach(dataset => {
          if (dataset.parentId !== '0') {
            fields[dataset.name] = dataset
          }
        })
      }
      return fields
    }

  },
  watch: {
    data: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.dataTemplate = JSON.parse(JSON.stringify(val))
        }
      },
      immediate: true
    }
  },
  methods: {
    // 清空选择
    clearSelection() {
      if (this.$refs['dataTemplate'] && this.$refs['dataTemplate'].clearSelection) {
        this.$refs['dataTemplate'].clearSelection()
      }
    },
    resetSearchForm() {
      if (this.$refs['dataTemplate'] && this.$refs['dataTemplate'].resetSearchForm) {
        this.$refs['dataTemplate'].resetSearchForm()
      }
    },
    setSelectRow() {
      if (this.$refs['dataTemplate'] && this.$refs['dataTemplate'].setSelectRow) {
        this.$refs['dataTemplate'].setSelectRow()
      }
    }
  }
}
</script>
