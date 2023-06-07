<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title"
    class="form-button-dialog"
    top="5vh"
    width="60%"
    append-to-body
    @close="closeDialog"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="150px" size="mini" @submit.native.prevent>
      <el-form-item label="按钮名称" prop="name">
        <el-input v-model="formData.label" placeholder="按钮名称" />
      </el-form-item>
      <el-form-item v-if="formData.type === 'custom'" required label="按钮编码" prop="code">
        <el-input v-model="formData.code" placeholder="按钮编码" />
      </el-form-item>
      <el-form-item v-if="type==='function'" label="按钮位置">
        <el-radio-group v-model="formData.position">
          <el-radio-button
            v-for="item in positionType"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="按钮颜色">
        <el-select v-model="formData.style" placeholder="按钮颜色">
          <el-option value="default" label="默认" />
          <el-option value="primary" label="主要" />
          <el-option value="success" label="成功" />
          <el-option value="info" label="信息" />
          <el-option value="warning" label="警告" />
          <el-option value="danger" label="危险" />
        </el-select>
      </el-form-item>
      <el-form-item label="按钮图标">
        <ibps-icon-select v-model="formData.icon" icon="el-icon-search" />
      </el-form-item>

      <el-form-item label="明细隐藏">
        <el-switch
          v-model="formData.enabledDetail"
          :active-value="'Y'"
          :inactive-value="'N'"
          active-text="显示"
          inactive-text="隐藏"
        />
      </el-form-item>
      <el-form-item v-if="formData.type === 'add' || formData.type === 'custom'" label="启用自定义对话框">
        <el-switch
          v-model="formData.enabledCustom"
          :active-value="'Y'"
          :inactive-value="'N'"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
      <template v-if="formData.enabledCustom==='Y'">
        <el-form-item label="自定义对话框配置">
          <ibps-data-template-selector2
            v-model="formData.dialog"
            type="dialog"
            placeholder="请选择自定义对话框"
            @change="changeDataTemplateSelector"
          />
        </el-form-item>
        <el-form-item label="设置动态参数">
          <el-button style="width:100%;" type="primary" :disabled="disabledDynamicConditions" size="mini" @click="settingCondition()">设置动态参数</el-button>
        </el-form-item>
        <el-form-item label="设置联动数据">
          <el-button style="width:100%;" type="primary" size="mini" :disabled="disabledResultColumns" @click="settingLinkData()">设置联动数据</el-button>
        </el-form-item>
      </template>
    </el-form>
    <!--数据模版-动态参数配置-->
    <data-template-condition
      :visible="dataTemplateConditionVisible"
      :conditions="dynamicConditions"
      :data="custom.link_condition"
      :fields="formFields"
      @callback="setCondition"
      @close="visible => dataTemplateConditionVisible = visible"
    />
    <!--数据模版-联动数据配置-->
    <data-template-linkdata
      :visible="dataTemplateLinkDataVisible"
      :columns="resultColumns"
      :data="custom.link_linkage"
      :fields="formFields"
      @callback="setLinkData"
      @close="visible => dataTemplateLinkDataVisible = visible"
    />

    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { hasPermission } from '@/business/platform/form/constants/tableButtonTypes'
import ActionUtils from '@/utils/action'
import { validateRequired, validateKey } from '@/utils/validate'
import DataTemplateMixin from '../mixins/data-template'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import DataTemplateCondition from '../components/data-template-condition'
import DataTemplateLinkdata from '../components/data-template-linkdata'
import FormFieldUtil from '@/business/platform/form/utils/formFieldUtil'

export default {
  components: {
    IbpsDataTemplateSelector2,
    DataTemplateCondition,
    DataTemplateLinkdata
  },
  mixins: [DataTemplateMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '设置按钮'
    },
    data: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'function'
    },
    fields: {
      type: Array
    },
    columns: {
      type: Array
    },
    fieldItem: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      formName: 'form',
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: {},
      rules: {}
    }
  },
  computed: {
    positionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })
      const type = this.formData.type || ''
      if (hasPermission(type, 'toolbar')) {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (hasPermission(type, 'manage')) {
        positionType.push({
          value: 'manage',
          label: '仅管理'
        })
      }
      return positionType
    },
    custom() {
      return this.formData.custom || {}
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    data: {
      handler(val) {
        this.formData = val
        if (this.formData.type === 'custom') {
          this.rules['code'] = [
            { required: true, message: this.$t('validate.required') },
            { validator: validateRequired, message: this.$t('validate.required') },
            { validator: validateKey }
          ]
          this.formValidate()
        } else {
          this.rules['code'] = null
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.handleConfirm()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    handleConfirm() {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.formData))
          this.$emit('close', false)
          this.$emit('callback', data)
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    settingCondition() {
      if (this.$utils.isEmpty(this.formData.dialog)) {
        ActionUtils.warning('请先设置自定义对话框')
        return
      }
      if (this.$utils.isEmpty(this.dynamicConditions)) {
        ActionUtils.warning('未设置过滤条件')
        return
      }

      // 构建表单字段
      this.setFormFields(true)
      this.dataTemplateConditionVisible = true
    },
    settingLinkData() {
      if (this.$utils.isEmpty(this.formData.dialog)) {
        ActionUtils.warning('请先设置自定义对话框')
        return
      }
      if (this.$utils.isEmpty(this.resultColumns)) {
        ActionUtils.warning('请设置返回字段')
        return
      }
      if (this.$utils.isEmpty(this.columns)) {
        ActionUtils.warning('请设置子表字段')
        return
      }
      // 构建子表单字段
      this.formFields = []
      this.buildFormFields(this.columns)
      this.dataTemplateLinkDataVisible = true
    },
    setCondition(data) {
      this.formData.custom.link_condition = data
    },
    setLinkData(data) {
      this.formData.custom.link_linkage = data
    },
    changeDataTemplateSelector(data, val, oldVal) {
      this.changeDataSource(val, 'customDialog')
    },
    buildFormFields() {
      this.formFields = FormFieldUtil.getFormField(this.columns, true, this.code, this.fieldItem ? this.fieldItem.id : '')
    }
  }

}
</script>
