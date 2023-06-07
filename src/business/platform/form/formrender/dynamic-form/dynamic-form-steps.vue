<template>
  <ibps-steps
    :space="field.field_options.space"
    :direction="field.field_options.direction"
    :align-center="field.field_options.align_center"
    :simple="field.field_options.simple"
    :process-status="field.field_options.process_status"
    :finish-status="field.field_options.finish_status"
    :active="activeStep"
    class="ibps-mb-10"
    @step-click="clickStep"
  >
    <ibps-step-pane
      v-for="(col, colIndex) in field.field_options.columns"
      :key="colIndex"
      :title="col.label"
      :name="col.name?col.name:'steps_'+colIndex"
      class="ibps-mt-10 ibps-mb-10"
    >
      <template v-for="(item, index) in col.fields">
        <!--嵌套布局-->
        <component
          :is="'ibps-dynamic-form-'+item.field_type"
          v-if="item.field_type === 'grid' || item.field_type === 'tabs' || item.field_type === 'collapse' || item.field_type === 'steps'"
          :ref="'formItem'+item.name"
          :key="index"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :params="params"
          v-on="$listeners"
        />
        <!--其他类型-->
        <ibps-dynamic-form-item
          v-else
          :ref="'formItem'+item.name"
          :key="index"
          :models="models"
          :rights="rights"
          :field="item"
          :row="row"
          :code="code"
          :params="params"
          v-on="$listeners"
        />
      </template>
    </ibps-step-pane>
  </ibps-steps>
</template>
<script>
import NestedMixin from './mixins/nested'

export default {
  mixins: [NestedMixin],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      activeStep: 0
    }
  },
  computed: {
    readonlyRights() {
      return this.params.readonly || false
    }
  },
  watch: {
    curActiveStep: {
      handler(val) {
        this.activeStep = val
      },
      immediate: true
    },
    activeStep(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('update:cur-active-step', val)
      }
    }
  },
  methods: {
    clickStep(stepIndex) {
      if (this.readonlyRights) {
        this.activeStep = stepIndex
      } else {
        if (this.field.field_options.finish_click && stepIndex < this.activeStep) {
          this.activeStep = stepIndex
        }
      }
    }
  }

}
</script>
