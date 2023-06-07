<template>
  <div :style="{ width:`${width}px`}">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :style="{ width:`${width}px`}" label="模版配置" class="template-config" name="template-config">
        <component
          :is="templateType"
          v-if="dataTemplate"
          :template="template"
          :data-template="dataTemplate"
          :data="templateChil"
          :data-template-type="dataTemplate.type"
          :cloum-type="cloumType"
          :dataset-type="datasetType"
          :form-key="formKey"
          @update="updateTemplate"
        />
      </el-tab-pane>
      <el-tab-pane v-if="isDialog" :style="{ width:`${width}px`}" label="对话框配置" class="dialog-config" name="dialog-config">
        <template-dialog
          :data="dialogs"
          @update="updateDialogs"
        />
      </el-tab-pane>
      <el-tab-pane :style="{ width:`${width}px`}" label="模版属性" class="template-property" name="template-property">
        <template-property
          ref="templateProperty"
          is-save
          :data="dataTemplate"
          :dataset-type="datasetType"
          @update="updateData"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import TemplateProperty from './propertys'
import TemplateDialog from './dialog'

import TemplateSetting from './settings'

export default {
  components: Object.assign(TemplateSetting, {
    TemplateProperty,
    TemplateDialog
  }),
  props: {
    cloumType: {
      type: String,
      default: 'composeTree'
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      width: 350,
      activeName: 'template-property',
      dataTemplate: {},
      templateChil: {
        template_type: this.cloumType,
        attrs: {
          bind_template: 'Y',
          bind_template_key: '',
          bind_template_name: '',
          ref_field: '',
          ref_field_name: ''
        }
      }
    }
  },
  computed: {
    templateType() {
      if (!this.dataTemplate) {
        return
      }
      let key = ''
      if (this.dataTemplate.type === 'valueSource') {
        key = 'value-source'
      } else {
        if (this.dataTemplate.showType === 'compose') {
          if (this.dataTemplate.composeType === 'treeForm') {
            key = 'tree'
          } else {
            key = 'compose'
          }
        } else {
          key = this.dataTemplate.showType
        }
      }
      if (this.$utils.isEmpty(key)) {
        return
      }
      return 'ibps-template-setting-' + key
    },
    template() {
      const templates = this.dataTemplate.templates || []
      if (this.dataTemplate.showType === 'compose') {
        return this.dataTemplate.composeType !== 'treeForm' ? templates : templates[0]
      } else {
        return templates.length > 0 ? templates[0] : {}
      }
    },
    formKey() {
      return this.dataTemplate.attrs.form_key || ''
    },
    dialogs() {
      return this.dataTemplate.dialogs || {}
    },
    isDialog() {
      return this.dataTemplate.type === 'dialog'
    },
    datasetType() {
      return this.dataTemplate.datasetType || 'table'
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.dataTemplate = val
      },
      deep: true,
      immediate: true
    },
    cloumType: {
      handler: function(val, oldVal) {
        this.filterTemplate(val)
      },
      immediate: true
    }
  },
  methods: {
    filterTemplate(params) {
      if (this.$utils.isNotEmpty(this.template) && Object.prototype.toString.call(this.template) !== '[object Array]') return
      const index = this.template.findIndex(d => d.template_type === params)
      if (index > -1) {
        this.templateChil = this.dataTemplate.templates[index]
      } else {
        this.templateChil = {
          template_type: params,
          attrs: {
            bind_template: 'Y',
            bind_template_key: '',
            bind_template_name: '',
            ref_field: '',
            ref_field_name: ''
          }
        }
      }
    },
    updateData(data) {
      this.$emit('update', data)
    },
    updateTemplate(data) {
      const dataTemplate = JSON.parse(JSON.stringify(this.dataTemplate))
      if (this.dataTemplate.showType === 'compose' && this.dataTemplate.composeType !== 'treeForm') {
        if (this.$utils.isNotEmpty(this.cloumType)) {
          dataTemplate.templates.forEach((t, i) => {
            if (t.template_type === this.cloumType) {
              dataTemplate.templates[i] = data
            } else if (dataTemplate.templates.length < 2) {
              dataTemplate.templates.push(data)
            }
          })
          if (this.$utils.isEmpty(dataTemplate.templates)) {
            dataTemplate.templates.push(data)
          }
        } else {
          dataTemplate.templates = data
        }
      } else {
        // dataTemplate.templates = this.dataTemplate.composeType === 'treeForm' ? data : [data]
        dataTemplate.templates = [data]
      }
      this.$emit('update', dataTemplate)
    },
    updateDialogs(data) {
      const dataTemplate = JSON.parse(JSON.stringify(this.dataTemplate))
      dataTemplate.dialogs = data
      this.$emit('update', dataTemplate)
    },
    validate(callback) {
      this.$refs.templateProperty.validate(callback)
    }
  }
}
</script>
