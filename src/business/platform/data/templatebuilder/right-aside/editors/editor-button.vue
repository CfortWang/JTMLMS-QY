<template>
  <el-form ref="form"
           :model="formData"
           :rules="rules"
           label-width="120px"
           size="mini"
           @submit.native.prevent>
    <el-form-item label="按钮名称"
                  required
                  prop="label">
      <el-input v-model="formData.label"
                placeholder="按钮名称" />
    </el-form-item>
    <el-form-item v-if="formData && (formData.button_type === 'custom' || formData.button_type === 'sefStartFlow') "
                  label="按钮编码"
                  prop="code"
                  required>
      <el-input v-model="formData.code"
                placeholder="按钮编码" />
    </el-form-item>
    <el-form-item label="权限"
                  prop="rights">
      <rights-selector v-model="formData.rights" />
    </el-form-item>
    <el-form-item v-if="type==='function'"
                  label="按钮位置"
                  prop="position">
      <el-radio-group v-model="formData.position">
        <el-radio-button v-for="t in positionType"
                         :key="t.value"
                         :label="t.value">{{ t.label }}</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="按钮颜色"
                  prop="style">
      <el-select v-model="formData.style"
                 placeholder="按钮颜色">
        <el-option v-for="item in colors"
                   :key="item.type"
                   :label="item.label"
                   :value="item.type">
          <el-link :underline="false"
                   :type="item.type "
                   style="float: left">{{ item.label }}</el-link>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="按钮图标"
                  prop="icon">
      <ibps-icon-select v-model="formData.icon"
                        icon="el-icon-search" />
    </el-form-item>
    <el-form-item v-if="formData && formData.button_type === 'export'"
                  label="导出字段"
                  prop="icon">
      <el-button size="small"
                 type="primary"
                 @click="handleExportFields">设置导出字段</el-button>
    </el-form-item>
    <el-form-item v-if="formData && formData.button_type === 'bianZhi'"
                  label="编制流程设置"
                  prop="icon">
      <el-button size="small"
                 type="primary"
                 @click="handleBianZhi">编制流程设置</el-button>
      <p>流程id：{{formData.defId}}</p>
      <p>流程key：{{formData.defKey}}</p>
      <p>流程名称：{{formData.defName}}</p>
    </el-form-item>
    <el-form-item v-if="formData && (formData.button_type === 'runQianPDF'|| formData.button_type === 'runQianOther')" 
                  label="润乾路径"
                  required
                  prop="label">
      <el-input v-model="formData.runQianPah"
                placeholder="润乾路径" />
    </el-form-item>
    <el-form-item v-if="formData && formData.button_type === 'sefStartFlow'"
                  prop="deflow">
      <label slot="label">
        绑定流程
        <el-tooltip class="item"
                    effect="light"
                    placement="bottom">
          <div slot="content"
               style="line-height:1.5;">
            先在模板属性绑定表单，此流程定义数据才有！
          </div>
          <i class="ibps-icon-help" />：
        </el-tooltip>
      </label>
      <bpm-def-selector v-model="formData.deflow"
                        value-key="defKey"
                        :form-key="formKey"
                        :is-data-template-use="true" />
    </el-form-item>
    <export-column :visible="exportFieldDialogVisible"
                   :data="template"
                   @callback="handleExportColumn"
                   @close="(visible)=>exportFieldDialogVisible=visible" />
    <!-- 流程定义选择器 -->
    <bpm-def-dialog :visible="dialogVisible"
                    :form-key="formKey"
                    :isDataTemplateUse="dialogVisible"
                    @close="(visible) => (dialogVisible = visible)"
                    @action-event="handleDialogActionEvent" />
  </el-form>
</template>
<script>
import { hasPermission } from '@/business/platform/data/constants/buttons'
import BpmDefSelector from '@/business/platform/bpmn/definition/selector'
import RightsSelector from '@/business/platform/rights/config/selector'

import ExportColumn from '../components/export-column'
import BpmDefDialog from '@/business/platform/bpmn/definition/dialog'

export default {
  components: {
    RightsSelector,
    BpmDefSelector,
    ExportColumn,
    BpmDefDialog
  },
  props: {
    data: {
      type: Object
    },
    template: {
      type: Object
    },
    formKey: String,
    type: {
      type: String,
      default: 'function'
    }
  },
  data() {
    return {
      colors: [
        { type: 'default', label: '默认' },
        { type: 'primary', label: '主要' },
        { type: 'success', label: '成功' },
        { type: 'info', label: '信息' },
        { type: 'warning', label: '警告' },
        { type: 'danger', label: '危险' }
      ],
      exportFieldDialogVisible: false,
      dialogVisible: false,
      formName: 'form',
      formData: {
        style: 'primary',
      },
      defId: '',
      defName: '',
      defKey: '',
      rules: {
        label: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  computed: {
    positionType() {
      const positionType = []
      positionType.push({
        value: 'all',
        label: '所有'
      })
      const buttonType = this.formData.button_type || ''
      if (hasPermission(buttonType, 'toolbar') && this.type === 'function') {
        positionType.push({
          value: 'toolbar',
          label: '仅顶部'
        })
      }

      if (hasPermission(buttonType, 'manage') && this.type === 'function') {
        positionType.push({
          value: 'manage',
          label: '仅管理列'
        })
      }
      // if (hasPermission(buttonType, 'search') && this.type === 'function') {
      //   positionType.push({
      //     value: 'search',
      //     label: '仅查询列'
      //   })
      // }

      if (hasPermission(buttonType, 'edit') && this.type === 'edit') {
        positionType.push({
          value: 'edit',
          label: '仅编辑'
        })
      }

      return positionType
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.formData = val
          if (this.formData.button_type === 'custom' || this.formData.button_type === 'sefStartFlow') {
            this.rules['code'] = [{ required: true, message: this.$t('validate.required') }]
          } else {
            this.rules['code'] = null
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取表单数据
    getFormData(callback) {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          callback(this.formData)
        } else {
          callback()
        }
      })
    },
    handleExportFields() {
      this.exportFieldDialogVisible = true
    },
    handleBianZhi() {
      this.dialogVisible = true
    },

    handleExportColumn(data) {
      this.handleData('export_columns', data)
    },
    handleData(key, value) {
      this.$emit('callback', key, value)
    },
    handleDialogActionEvent(key, data) {
      if (key === 'clean') {
        this.dialogValue = {}
      }
      if (key === 'confirm') {
        this.formData.defId = data.defId
        this.formData.defName = data.name
        this.formData.defKey = data.defKey
        this.dialogVisible = false
      }

    },
  }
}
</script>
