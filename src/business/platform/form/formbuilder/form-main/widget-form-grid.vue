<template>
  <el-row
    v-if="element && element.id"
    :id="element.id"
    :key="element.id+index"
    :class="{active: selectWidget&&selectWidget.id == element.id}"
    :gutter="element.field_options.gutter ? element.field_options.gutter : 0"
    :justify="element.field_options.justify"
    :align="element.field_options.align"
    class="widget-col widget-view"
    type="flex"
    @click.native.stop="handleSelectWidget(index)"
  >
    <el-col
      v-for="(col, colIndex) in element.field_options.columns"
      :key="colIndex"
      :span="col.span ? col.span : 0"
    >
      <draggable
        v-model="col.fields"
        :no-transition-on-drag="true"
        v-bind="{group:'field', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetNestedAdd($event, element, colIndex)"
      >
        <transition-group name="fade" tag="div" class="widget-col-list">
          <template v-for="(el, i) in col.fields">
            <template v-if="el&& el.id">
              <!--嵌套布局-->
              <component
                :is="'ibps-widget-form-'+el.field_type"
                v-if="isNestedField(el.field_type)"
                :key="el.id+i"
                :element="el"
                :select.sync="selectWidget"
                :index="i"
                :data="col"
                :code="code"
                :is-sub="isSub"
                :params="params"
              />
              <!--其他字段-->
              <ibps-widget-form-item
                v-else
                :key="el.id+i"
                :element="el"
                :select.sync="selectWidget"
                :index="i"
                :data="col"
                :code="code"
                :is-sub="isSub"
                :params="params"
              />
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-col>
    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-action widget-col-action">
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget&&selectWidget.id === element.id" class="widget-view-drag widget-col-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </el-row>
</template>

<script>
import NestedMixin from './mixins/nested'
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  mixins: [NestedMixin]
}
</script>
