<template>
  <div
    class="widget-view"
    :class="{
      [`ibps-${element.field_type}`]: true,
      active: selectWidget&&selectWidget.id == element.id}"
    @click.stop="handleSelectWidget(index)"
  >
    <!--描述-->
    <template v-if="element.field_type==='desc'">
      <div class="title">{{ element.label }}</div>
      <div
        v-if="element&&element.field_options&&element.field_options.split_line"
        class="divider"
        :class="'ibps-'+element.field_options.line_style||'dashed'"
      />
      <div v-if="element&&element.desc" class="desc" v-html="$utils.formatText(element.desc )" />
    </template>
    <!--分割线-->
    <template v-else-if="element.field_type==='divider'">
      <el-divider
        :content-position="element.field_options.content_position"
      >{{ element.label }}</el-divider>
      <div v-if="element && element.desc" class="ibps-help-block">
        {{ element.desc }}
      </div>
    </template>
    <!--警告-->
    <template v-else-if="element.field_type==='alert'">
      <el-alert
        :title="element.label"
        :description="element.desc"
        :type="element.field_options.type"
        :closable="element.field_options.closable"
        :close-text="element.field_options.close_text"
        :center="element.field_options.center"
        :show-icon="element.field_options.show_icon"
        :effect="element.field_options.effect"
      />
    </template>

    <template v-else>
      <el-form-item
        :label="element.label"
        :label-width="element.field_options.is_label_width?element.field_options.label_width+(element.field_options.label_width_unit||'px'):null"
      >
        <!-- 流程图-->
        <img
          v-if="element.field_type==='flow_diagram'"
          :src="flowDiagramImage"
        >
        <!-- 审批历史-->
        <img
          v-else-if="element.field_type==='approval_history'"
          :src="approvalHistoryImage"
          style="width: 100%;"
        >
        <!-- 流程关联 -->
        <div v-else-if="element.field_type==='bpmLink'">
          <el-table
            border
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column
              prop="subject"
              label="实例标题"
            />
            <el-table-column
              prop="procDefName"
              label="流程名称"
              width="150"
            />
            <el-table-column
              prop="procDefKey"
              label="流程Key"
              width="120"
            />
            <el-table-column
              prop="status"
              label="流程状态"
              width="120"
            />
            <el-table-column
              prop="creator"
              label="发起人"
              width="120"
            />
            <el-table-column
              prop="createTime"
              label="发起时间"
              width="150"
            />
            <el-table-column
              prop="endTime"
              label="结束时间"
              width="150"
            />
            <el-table-column
              width="50"
              label="操作"
            />
          </el-table>
        </div>
      </el-form-item>
    </template>

    <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>

<script>
import FormOptions from '@/business/platform/form/constants/formOptions'
import Ids from 'ids'

import FlowDiagramImage from '@/assets/images/form/flow_diagram.png'
import ApprovalHistoryImage from '@/assets/images/form/approval_history.png'

export default {
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object
  },
  data() {
    return {
      selectWidget: this.select,
      flowDiagramImage: FlowDiagramImage,
      approvalHistoryImage: ApprovalHistoryImage
    }
  },
  computed: {
    fields() {
      if (this.isTable) {
        return this.data.field_options.columns
      } else {
        return this.data.fields
      }
    },
    isTable() {
      return this.data.field_type === 'table'
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
  methods: {
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
      const id = new Ids([32, 36, 1]).next()
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: id
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
