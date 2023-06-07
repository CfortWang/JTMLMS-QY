<template>
  <div v-if="field && field.id">
    <el-table
      :data="tableData"
    >
      <el-table-column width="200px">
        <template v-slot:header>
          <span :class="{ 'is_req': required}">
            {{ field.label }}
            <ibps-help v-if="element && element.desc && descPosition==='lableIcon'" :content="$utils.formatText(element.desc)" /></span>
        </template>
        <widget-form-field
          :element="field"
        />
      </el-table-column>
    </el-table>
    <div v-if="selectWidget && selectWidget.id === field.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget && selectWidget.id == field.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>

<script>
import WidgetFormField from './widget-form-field'
import FormOptions from '@/business/platform/form/constants/formOptions'
import Ids from 'ids'

export default {
  components: {
    WidgetFormField
  },
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    code: String,
    isSub: {
      type: Boolean,
      default: true
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
    },
    required() {
      return this.field && this.field.field_options ? this.field.field_options.required : false
    },
    descPosition() {
      return this.params.descPosition || 'inline'
    }
  },
  watch: {
    element: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.field = val
        }
      },
      deep: true,
      immediate: true
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
    handleSelectWidget(index) {
      this.fields[index].code = this.code
      this.fields[index].isSub = this.isSub
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
