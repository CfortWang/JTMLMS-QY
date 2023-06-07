<template>
  <div v-if="element&& element.id">
    <!--嵌套布局-->
    <component
      :is="'ibps-widget-form-'+element.field_type"
      v-if="isNestedField(el.field_type)"
      :key="element.id+i"
      :element="element"
      :select.sync="selectWidget"
      :index="index"
      :data="data"
      :code="code"
      :params="params"
      is-sub
    />
    <!--其他字段-->
    <ibps-widget-form-item
      v-else
      :key="element.id+index"
      :element="element"
      :select.sync="selectWidget"
      :index="index"
      :data="data"
      :code="code"
      :params="params"
      is-sub
    />
    <div v-if="selectWidget && selectWidget.id === element.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget && selectWidget.id == element.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>

<script>
import FormOptions from '@/business/platform/form/constants/formOptions'
import { nestedFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import Ids from 'ids'

export default {
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    code: String,
    isSub: {
      type: Boolean,
      default: false
    },
    params: Object
  },
  data() {
    return {
      selectWidget: this.select,
      field: this.element,
      tableData: [{ name: '' }]
    }
  },
  computed: {
    fields() {
      return this.data.field_options.columns
    }
  },
  watch: {
    element: {
      handler(val) {
        this.field = val
      },
      deep: true
    },
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  methods: {
    isNestedField(fieldType) {
      return nestedFieldTypes.includes(fieldType) || fieldType === 'table'
    },
    handleSelectWidget(index) {
      let code = this.code
      let isSub = this.isSub
      if (this.isTable) {
        code = this.data.name
        isSub = true
      }
      this.fields[index].code = code
      this.fields[index].isSub = isSub
      this.selectWidget = this.fields[index]
    },
    handleWidgetDelete(index) {
      if (this.fields.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.fields[index - 1]
        }
      } else {
        this.selectWidget = this.fields[index + 1]
      }

      this.$nextTick(() => {
        this.fields.splice(index, 1)
      })
    },
    handleWidgetClone(index) {
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: this.$utils.guid()
      }
      const fieldType = cloneData.field_type
      if (FormOptions.t.NEED_MODEL_FIELD_TYPES.includes(fieldType)) {
        cloneData.name = fieldType + '_' + new Ids([32, 36, 1]).next()
      }

      this.fields.splice(index, 0, JSON.parse(JSON.stringify(cloneData)))

      this.$nextTick(() => {
        this.selectWidget = this.fields[index + 1]
      })
    }
  }
}
</script>
