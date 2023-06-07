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
      field: this.element
    }
  },
  computed: {
    fields() {
      if (this.data.fields) { // 第一层
        return this.data.fields
      } else {
        return this.data.field_options.columns
      }
    },
    isTable() {
      return this.data.field_type === 'table'
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
    handleMoveEnd({ newIndex, oldIndex }) {
      // console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget(index) {
      let code = this.code
      let isSub = this.isSub
      if (this.isTable) {
        code = this.data.name
        isSub = true
      }
      this.field.code = code
      this.field.isSub = isSub
      this.selectWidget = this.field
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
    },

    /**
     * 嵌套布局
     */
    handleWidgetNestedAdd($event, row, colIndex) {
      const newIndex = $event.newIndex
      // const oldIndex = $event.oldIndex
      // const item = $event.item
      // 防止布局元素的嵌套拖拽
      // if (item.className.indexOf('data-grid') >= 0) {
      //   // 如果是列表中拖拽的元素需要还原到原来位置
      //   item.tagName === 'DIV' && this.data.fields.splice(oldIndex, 0, row.field_options.columns[colIndex].fields[newIndex])

      //   row.field_options.columns[colIndex].fields.splice(newIndex, 1)
      //   return false
      // }
      const id = new Ids([32, 36, 1]).next()
      const code = this.code
      const isSub = this.isSub

      this.$set(row.field_options.columns[colIndex].fields, newIndex, {
        ...row.field_options.columns[colIndex].fields[newIndex],
        field_options: {
          ...row.field_options.columns[colIndex].fields[newIndex].field_options
        },
        id,
        code,
        isSub
      })
      const fieldType = row.field_options.columns[colIndex].fields[newIndex].field_type

      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        this.$set(row.field_options.columns[colIndex].fields, newIndex, {
          ...row.field_options.columns[colIndex].fields[newIndex],
          field_options: {
            ...row.field_options.columns[colIndex].fields[newIndex].field_options,
            options: row.field_options.columns[colIndex].fields[newIndex].field_options.options.map(item => ({
              ...item
            }))
          }
        })
        //  嵌套布局
      } else if (nestedFieldTypes.includes(fieldType)) {
        this.$set(row.field_options.columns[colIndex].fields, newIndex, {
          ...row.field_options.columns[colIndex].fields[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next(),
          active: this.getDefaultActive(fieldType),
          field_options: {
            ...row.field_options.columns[colIndex].fields[newIndex].field_options,
            columns: row.field_options.columns[colIndex].fields[newIndex].field_options.columns.map(item => ({
              ...item
            }))
          }
        })
        // 子表单
      } else if (fieldType === 'table') {
        this.$set(row.field_options.columns[colIndex].fields, newIndex, {
          ...row.field_options.columns[colIndex].fields[newIndex],
          field_options: {
            ...row.field_options.columns[colIndex].fields[newIndex].field_options,
            buttons: row.field_options.columns[colIndex].fields[newIndex].field_options.buttons.map(item => ({
              ...item
            })),
            columns: row.field_options.columns[colIndex].fields[newIndex].field_options.columns.map(item => ({
              ...item
            }))
          }

        })
        // 审批意见
      } else if (fieldType === 'approval_opinion') {
        this.$set(row.field_options.columns[colIndex].fields, newIndex, {
          ...row.field_options.columns[colIndex].fields[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next(),
          field_options: {
            ...row.field_options.columns[colIndex].fields[newIndex].field_options,
            options: row.field_options.columns[colIndex].fields[newIndex].field_options.options.map(item => ({
              ...item
            }))
          }
        })
        // 需要处理name的字段 审批历史、流程图、文本
      } else if (FormOptions.t.NEED_MODEL_FIELD_TYPES.includes(fieldType)) {
        this.$set(row.field_options.columns[colIndex].fields, newIndex, {
          ...row.field_options.columns[colIndex].fields[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next()
        })
      }
      this.selectWidget = row.field_options.columns[colIndex].fields[newIndex]
    },
    getDefaultActive(fieldType) {
      if (fieldType === 'tabs') {
        return 'tabs_0'
      } else if (fieldType === 'steps') {
        return 0
      } else {
        return ''
      }
    }
  }

}
