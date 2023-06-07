<template>
  <div
    v-if="element && element.id"
    :key="element.id+index"
    :class="{active: selectWidget&&selectWidget.id === element.id}"
    class="widget-table widget-view "
    @click.stop="handleSelectWidget(index)"
  >
    <div class="panel panel-info">
      <div
        class="panel-heading ibps-clearfix"
        style="border-bottom:0;"
      >
        <div class="ibps-fl">{{ element.label }}</div>
        <div class="ibps-fr">
          <el-button-group disabled>
            <el-button
              v-for="(button,i) in element.field_options.buttons"
              :key="i"
              :type="button.style"
              :icon="'ibps-icon-'+button.icon"
              disabled
            >
              {{ button.label }}
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="panel-body ibps-p-0">
        <div class="widget-table-wrapper ">
          <div class="widget-table-content">
            <draggable
              v-model="element.field_options.columns"
              :no-transition-on-drag="true"
              v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
              @end="handleMoveEnd"
              @add="handleWidgetTableAdd($event, element)"
            >
              <template v-if="mode === 'inner'">
                <!---表内--->
                <transition-group
                  name="fade"
                  tag="div"
                  class="widget-table-col"
                  :style="{width: element.field_options.columns.length>0?'calc('+((element.field_options.columns.length+1) *200)+'px)':'200px'}"
                >
                  <div
                    v-for="(el, i) in element.field_options.columns"
                    :key="el.id+i"
                    class="widget-table-view"
                    style="width:200px;"
                    :class="{active: selectWidget &&selectWidget.id == el.id}"
                    @click.stop="handleTableSelectWidget(index,i)"
                  >
                    <ibps-widget-form-table-inner
                      :element="el"
                      :select.sync="selectWidget"
                      :index="i"
                      :data="element"
                      :code="code"
                      :is-sub="isSub"
                      :params="params"
                    />
                  </div>
                </transition-group>
              </template>
              <!---表内end--->
              <template v-else>
                <!---其他模式--->
                <transition-group
                  name="fade"
                  tag="div"
                  class="widget-table-list"
                >
                  <div
                    v-for="(el, i) in element.field_options.columns"
                    :key="el.id+i"
                    @click.stop="handleTableSelectWidget(index,i)"
                  >
                    <template v-if="el&& el.id">
                      <!--嵌套布局-->
                      <component
                        :is="'ibps-widget-form-'+el.field_type"
                        v-if=" el.field_type=== 'grid' || el.field_type === 'tablelayout' || el.field_type === 'tabs'|| el.field_type === 'steps'|| el.field_type === 'collapse' || el.field_type === 'table'"
                        :key="el.id+i"
                        :element="el"
                        :select.sync="selectWidget"
                        :index="i"
                        :data="element"
                        :code="code"
                        :is-sub="isSub"
                        :params="params"
                      />
                      <!--其他类型-->
                      <template v-else>
                        <ibps-widget-form-item
                          :key="el.id+i"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="element"
                          :code="code"
                          :is-sub="isSub"
                          :params="params"
                        />
                      </template>
                    </template>
                  </div>
                </transition-group>

              </template>
            </draggable>
          </div>

        </div>
      </div>
    </div>
    <div
      v-if="selectWidget&&selectWidget.id == element.id"
      class="widget-view-action widget-table-action"
    >
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div
      v-if="selectWidget&&selectWidget.id == element.id"
      class="widget-view-drag widget-table-drag"
    >
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>

<script>
import FormOptions from '@/business/platform/form/constants/formOptions'
import { nestedFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import Ids from 'ids'
import Draggable from 'vuedraggable'

import IbpsWidgetFormTableInner from './widget-form-table-inner'
// import IbpsWidgetFormTableOther from './widget-form-table-other'

export default {
  components: {
    Draggable,
    IbpsWidgetFormTableInner
  },
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object,
    params: Object
  },
  data() {
    return {
      selectWidget: this.select,
      field: this.element,
      tableData: [{ name: '' }],
      isSub: true
    }
  },
  computed: {
    code() {
      return this.element.name
    },
    fields() {
      if (this.data.fields) { // 第一层
        return this.data.fields
      } else {
        return this.data.field_options.columns
      }
    },
    mode() {
      return this.element.field_options.mode || 'inner'
    },
    descPosition() {
      return this.params.descPosition || 'inline'
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
    // 处理子表
    handleTableSelectWidget(index, colIndex) {
      this.data.fields[index].field_options.columns[colIndex].code = this.data.fields[index].name
      this.data.fields[index].field_options.columns[colIndex].isSub = true
      this.selectWidget = this.data.fields[index].field_options.columns[colIndex]
    },
    /**
     * 处理子表单
     */
    handleWidgetTableAdd($event, row) {
      // console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item
      const index = this.index
      if (this.mode === 'inner') { // 内嵌
        // 防止布局元素的嵌套拖拽
        if (item.className.indexOf('data-table') >= 0 ||
           item.className.indexOf('data-grid') >= 0 ||
           item.className.indexOf('data-tabs') >= 0 ||
           item.className.indexOf('data-steps') >= 0 ||
           item.className.indexOf('data-collapse') >= 0) {
          // 如果是列表中拖拽的元素需要还原到原来位置
          item.tagName === 'DIV' && this.data.fields.splice(oldIndex, 0, row.field_options.columns[index])

          row.field_options.columns.splice(newIndex, 1)
          this.$message.warning('表内编辑模式不能嵌套' + item.innerText)
          return false
        }
      }

      // console.log('from', item)

      const id = new Ids([32, 36, 1]).next()
      const code = row.name
      const isSub = this.isSub

      this.$set(row.field_options.columns, newIndex, {
        ...row.field_options.columns[newIndex],
        field_options: {
          ...row.field_options.columns[newIndex].field_options
        },
        id,
        code,
        isSub
      })

      const fieldType = row.field_options.columns[newIndex].field_type
      if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
        this.$set(row.field_options.columns, newIndex, {
          ...row.field_options.columns[newIndex],
          field_options: {
            ...row.field_options.columns[newIndex].field_options,
            options: row.field_options.columns[newIndex].field_options.options.map(item => ({
              ...item
            }))
          }
        })
        // 嵌套布局
      } else if (nestedFieldTypes.includes(fieldType)) {
        this.$set(row.field_options.columns, newIndex, {
          ...row.field_options.columns[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next(),
          field_options: {
            ...row.field_options.columns[newIndex].field_options,
            columns: row.field_options.columns[newIndex].field_options.columns.map(item => ({
              ...item
            }))
          }
        })
        // 子表单
      } else if (fieldType === 'table') {
        this.$set(row.field_options.columns, newIndex, {
          ...row.field_options.columns[newIndex],
          field_options: {
            ...row.field_options.columns[newIndex].field_options,
            buttons: row.field_options.columns[newIndex].field_options.buttons.map(item => ({
              ...item
            })),
            columns: row.field_options.columns[newIndex].field_options.columns.map(item => ({
              ...item
            }))
          }

        })
        // 审批意见
      } else if (fieldType === 'approval_opinion') {
        this.$set(row.field_options.columns, newIndex, {
          ...row.field_options.columns[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next(),
          field_options: {
            ...row.field_options.columns[newIndex].field_options,
            options: row.field_options.columns[newIndex].field_options.options.map(item => ({
              ...item
            }))
          }
        })
        // 需要处理name的字段 审批历史、流程图、文本
      } else if (FormOptions.t.NEED_MODEL_FIELD_TYPES.includes(fieldType)) {
        this.$set(row.field_options.columns, newIndex, {
          ...row.field_options.columns[newIndex],
          name: fieldType + '_' + new Ids([32, 36, 1]).next()
        })
      }

      this.selectWidget = row.field_options.columns[newIndex]
    }
  }
}
</script>
