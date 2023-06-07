<template>
  <div class="widget-form-container">
    <div v-if="data.fields.length === 0" class="form-empty">从左侧拖拽来添加字段</div>
    <div
      v-if="hasHeader"
      class="form-header"
      @click="$emit('select-field')"
    >
      <div class="title" :class="titlePosition">{{ data.name||'未设置表单标题' }}</div>
      <div v-if="hasDesc" class="desc" v-html="$utils.formatText( data.desc )" />
    </div>
    <el-form
      :size="data.attrs.size"
      :label-suffix="labelSuffix"
      :label-position="data.attrs.labelPosition"
      :label-width="data.attrs.labelWidth +( data.attrs.labelWidthUnit?data.attrs.labelWidthUnit:'px')"
      :status-icon="data.attrs.statusIcon"
      :hide-required-asterisk="hideRequiredAsterisk"
      @submit.native.prevent
    >
      <draggable
        :list="data.fields"
        v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >
        <transition-group
          name="fade"
          tag="div"
          class="widget-form-list"
          :style="{
            minHeight:minHeight
          }"
        >
          <template v-for="(el, i) in data.fields">
            <template v-if="el&& el.id">
              <!--嵌套布局-->
              <component
                :is="'ibps-widget-form-'+el.field_type"
                v-if="isNestedField(el.field_type)"
                :key="el.id+i"
                :element="el"
                :select.sync="selectWidget"
                :index="i"
                :data="data"
                :code="code"
                :params="formParams"
              />
              <!--其他字段-->
              <ibps-widget-form-item
                v-else
                :key="el.id+i"
                :element="el"
                :select.sync="selectWidget"
                :index="i"
                :data="data"
                :code="code"
                :params="formParams"
              />
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import Ids from 'ids'
import { addResizeListener, removeResizeListener } from '@/plugins/element-ui/src/utils/resize-event'
import FormOptions from '@/business/platform/form/constants/formOptions'
import { nestedFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import Draggable from 'vuedraggable'

import WidgetFormItem from './widget-form-item'
import WidgetFormGrid from './widget-form-grid'
import WidgetFormTabs from './widget-form-tabs'
import WidgetFormSteps from './widget-form-steps'
import WidgetFormCollapse from './widget-form-collapse'

import WidgetFormTable from './widget-form-table'
import WidgetFormTablelayout from './widget-form-tablelayout'

Vue.component('ibps-widget-form-item', WidgetFormItem)
Vue.component('ibps-widget-form-grid', WidgetFormGrid)
Vue.component('ibps-widget-form-tabs', WidgetFormTabs)
Vue.component('ibps-widget-form-steps', WidgetFormSteps)
Vue.component('ibps-widget-form-collapse', WidgetFormCollapse)
Vue.component('ibps-widget-form-table', WidgetFormTable)
Vue.component('ibps-widget-form-tablelayout', WidgetFormTablelayout)

export default {
  components: {
    Draggable
  },
  props: {
    data: Object,
    select: Object,
    loading: Boolean
  },
  data() {
    return {
      selectWidget: this.select,
      minHeight: '500px'
    }
  },
  computed: {
    code() {
      return this.data.code
    },
    formAttrs() {
      return this.data ? this.data.attrs || {} : {}
    },
    hasHeader() {
      return this.formAttrs && !this.formAttrs.hide_name
    },
    hasDesc() {
      return this.formAttrs && !this.formAttrs.hide_desc && this.data.desc
    },
    titlePosition() {
      const titlePosition = this.formAttrs.title_position
      if (titlePosition === 'center') {
        return 'ibps-tc'
      } else if (titlePosition === 'right') {
        return 'ibps-tr'
      } else {
        return ''
      }
    },
    labelSuffix() {
      return this.formAttrs ? (this.formAttrs.colon ? this.formAttrs.labelSuffix || ':' : '') : ''
    },
    hideRequiredAsterisk() {
      return this.$utils.toBoolean(this.formAttrs.hideRequiredAsterisk, false)
    },
    descPosition() {
      return this.$utils.isNotEmpty(this.formAttrs.descPosition) ? this.formAttrs.descPosition || 'inline' : 'inline'
    },
    formParams() {
      const params = {
        readonlyStyle: this.readonlyStyle,
        labelWidth: this.labelWidth,
        labelSuffix: this.labelSuffix,
        descPosition: this.descPosition,
        formAttrs: this.formAttrs
      }
      return Object.assign(params, this.params)
    }
  },
  watch: {
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
  mounted() {
    document.body.ondrop = (event) => {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    this.minHeight = this.fixHeight()
    addResizeListener(this.$el, this.handleHeightResize)
  },
  beforeDestroy() {
    removeResizeListener(this.$el, this.handleHeightResize)
  },
  methods: {
    handleHeightResize() {
      this.minHeight = this.fixHeight()
    },
    fixHeight() {
      return (document.documentElement.clientHeight || document.body.clientHeight) - 100 + 'px'
    },
    isNestedField(fieldType) {
      return nestedFieldTypes.includes(fieldType) || fieldType === 'table'
    },
    handleMoveEnd({ newIndex, oldIndex }) {
      // console.log('index', newIndex, oldIndex)
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex
      const fieldType = this.data.fields[newIndex].field_type
      // 为拖拽到容器的元素添加唯一 id
      const id = new Ids([32, 36, 1]).next()
      const code = this.code
      const isSub = false

      this.$set(this.data.fields, newIndex, {
        ...this.data.fields[newIndex],
        field_options: {
          ...this.data.fields[newIndex].field_options
        },
        id,
        code,
        isSub
      })

      // 单选、多选、下拉
      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          field_options: {
            ...this.data.fields[newIndex].field_options,
            options: this.data.fields[newIndex].field_options.options.map(item => ({
              ...item
            }))
          }
        })
        // 嵌套布局
      } else if (nestedFieldTypes.includes(fieldType)) {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next(),
          active: this.getDefaultActive(fieldType),
          field_options: {
            ...this.data.fields[newIndex].field_options,
            columns: this.data.fields[newIndex].field_options.columns.map(item => ({
              ...item
            }))
          }
        })

        // 子表单
      } else if (fieldType === 'table') {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          field_options: {
            ...this.data.fields[newIndex].field_options,
            buttons: this.data.fields[newIndex].field_options.buttons.map(item => ({
              ...item
            })),
            columns: this.data.fields[newIndex].field_options.columns.map(item => ({
              ...item
            }))
          }

        })
        // 审批意见
      } else if (fieldType === 'approval_opinion') {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next(),
          field_options: {
            ...this.data.fields[newIndex].field_options,
            options: this.data.fields[newIndex].field_options.options.map(item => ({
              ...item
            }))
          }
        })
        // 需要处理name的字段
      } else if (FormOptions.t.NEED_MODEL_FIELD_TYPES.includes(fieldType)) {
        this.$set(this.data.fields, newIndex, {
          ...this.data.fields[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next()
        })
      }
      this.selectWidget = this.data.fields[newIndex]
    },
    handleWidgetDelete(index) {
      if (this.data.fields.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.fields[index - 1]
        }
      } else {
        this.selectWidget = this.data.fields[index + 1]
      }

      this.$nextTick(() => {
        this.data.fields.splice(index, 1)
      })
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
</script>
