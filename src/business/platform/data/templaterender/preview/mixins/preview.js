
import { getDynamicParamsConditions, buildLabelTitle } from '@/business/platform/data/templaterender/utils'
import { getByKey } from '@/api/platform/data/dataTemplate'

export default {
  data() {
    return {
      templateRendererDialogVisible: false,
      dynamicParamsDialogVisible: false,
      previewDialogVisible: false,

      selectedValue: this.multiple ? [] : {},
      multiple: true,
      labelKey: '',
      previewFormData: {},
      conditions: {}, // 动态条件
      dynamicParams: {},
      dataByKeyData: ''
    }
  },
  methods: {
    getDataByKey(params) {
      getByKey({
        dataTemplateKey: params
      }).then(response => {
        this.dataByKeyData = this.$utils.parseJSON(response.data)
      }).catch(() => {})
      return this.dataByKeyData
    },
    previewTemplate() {
      if (this.$utils.isEmpty(this.dataTemplate)) {
        this.$message({
          showClose: true,
          message: '数据模版为空！',
          type: 'warning'
        })
        return
      }
      let hasBindTempate = true
      if (this.dataTemplate.showType === 'compose' && this.dataTemplate.composeType !== 'treeForm') {
        if (this.$utils.isEmpty(this.dataTemplate.templates)) {
          hasBindTempate = false
        } else {
          this.dataTemplate.templates.forEach(d => {
            if (this.$utils.isEmpty(d.attrs) || this.$utils.isEmpty(d.attrs.bind_template_key)) {
              hasBindTempate = false
            }
          })
        }
      }
      if (!hasBindTempate) {
        this.$message({
          showClose: true,
          message: '请检查数据模板是否绑定！',
          type: 'warning'
        })
        return
      }
      // 判断是否有 动态参数
      const conditions = getDynamicParamsConditions(this.dataTemplate, this.getDataByKey)
      if (this.dataTemplate.type === 'dialog') {
        const dialogs = this.dataTemplate.dialogs
        this.multiple = dialogs && dialogs.attrs ? dialogs.attrs.multi !== 'N' : true
        this.labelKey = buildLabelTitle(this.dataTemplate)
        this.previewSelectedValue = this.multiple ? [] : {}
      } else {
        this.multiple = true
      }
      if (this.$utils.isEmpty(conditions)) {
        this.templateRendererDialogVisible = true
      } else {
        this.conditions = conditions
        this.dynamicParamsDialogVisible = true
      }
    },


    handleDynamicParams(data) {
      this.dynamicParams = data
      this.templateRendererDialogVisible = true
    },
    handleTemplaterenderActionEvent(key, data) {
      switch (key) {
        case 'cancel':
          this.templateRendererDialogVisible = false
          this.selectedValue = this.multiple ? [] : {}
          break
        case 'clean':
          break
        case 'cleanClose':
          this.previewFormData = data
          this.previewSelectedValue = data
          this.templateRendererDialogVisible = false
          this.previewDialogVisible = true
          break
        default:
          this.previewFormData = data
          this.previewSelectedValue = data
          this.previewDialogVisible = true
          break
      }
    }
  }
}
