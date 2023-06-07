<template>
  <el-tabs
    ref="tabs"
    v-model="tabsActive"
    :type="field.field_options.type == 'border-card' ? 'card' : field.field_options.type"
    :tab-position="field.field_options.position"
    :stretch="field.field_options.stretch"
    class="ibps-mb-10"
  >
    <el-tab-pane
      v-for="(col, colIndex) in field.field_options.columns"
      :key="col.name+colIndex"
      :name="col.name"
      :lazy="field.field_options.lazy?tabsActive !== col.name:false"
    >
      <span slot="label">{{ col.label }}
        <el-tooltip v-if="invalidTabs[colIndex]" content="标签下有不规范的值">
          <i class="el-icon el-icon-warning has-errors" />
        </el-tooltip>
      </span>
	  <span v-if="field.field_options.lazy">
		  <template v-if="tabsActive === col.name">
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
		  </template>
	  </span>
	  <span v-else>
	  		  <template v-show="tabsActive === col.name">
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
	  		  </template>
	  </span>

    </el-tab-pane>
  </el-tabs>
</template>
<script>
import NestedMixin from './mixins/nested'
import emitter from '@/plugins/element-ui/src/mixins/emitter'
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'

export default {
  mixins: [NestedMixin, emitter],
  provide() {
    return {
      form: this
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    const columns = this.field.field_options.columns
    let tabsActive = ''
    const invalidTabs = {}
    columns.forEach((column, i) => {
      invalidTabs[i] = false
      if (column.checked) {
        tabsActive = column.name
      }
    })
    if (this.$utils.isEmpty(tabsActive)) {
      tabsActive = columns[0].name
    }
    return {
      tabsActive: tabsActive,
      invalidTabs: invalidTabs
    }
  },
  computed: {
    columns() {
      return this.field.field_options.columns
    }
  },
  watch: {
    'params.invalidFields': {
      handler() {
        this.handlerInvalidTabs(this.params.invalidFields)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() { 
    this.$nextTick(() => {
      const currentName = this.tabsActive
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i]
        setTimeout(() => {
          this.tabsActive = col.name
        }, 10)
      }
      setTimeout(() => {
        this.tabsActive = currentName
      }, this.columns.length * 10)
    })
  },
  methods: {
    handlerInvalidTabs(invalidFields) {
      this.columns.forEach((column, i) => {
        this.invalidTabs[i] = false
      })

      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i]
        // 当前的字段
        const fields = FormFieldUtil.getColumns(JSON.parse(JSON.stringify(col.fields)))
        for (let j = 0; j < fields.length; j++) {
          const field = fields[j]
          if (invalidFields[field.name ]) {
            this.invalidTabs[i] = true
          }
        }
      }
    }
  }

}
</script>
