<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    :title="title"
    class="dialog dataTemplate-create-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="dataTemplateForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="dataTemplate"
      :rules="rules"
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-form-item label="模版名称:" prop="name">
        <el-input v-model="dataTemplate.name" v-pinyin="{vm:dataTemplate}" />
      </el-form-item>
      <el-form-item label="模版Key:" prop="key">
        <el-input v-model="dataTemplate.key" />
      </el-form-item>
      <el-form-item label="分类:" prop="typeId">
        <ibps-type-select
          ref="typeSelect"
          v-model="dataTemplate.typeId"
          category-key="BO_TYPE"
          clearable
        />
      </el-form-item>
      <el-form-item label="模版类型:" prop="type">
        <el-select v-model="dataTemplate.type" style="width:100%;">
          <el-option
            v-for="option in templateTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataTemplate.type !== 'valueSource'" label="展示形式:" prop="showType">
        <el-select v-model="dataTemplate.showType" style="width:100%;">
          <el-option
            v-for="option in showTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="dataTemplate.type !== 'valueSource' && dataTemplate.showType === 'compose'" label="组合形式:" prop="composeType">
        <el-select v-model="dataTemplate.composeType" style="width:100%;">
          <el-option
            v-for="option in composeTypeOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataTemplate.showType !== 'compose'||dataTemplate.composeType==='treeForm'" prop="datasetKey">
        <span slot="label">
          <label>数据集</label>
          <el-tooltip
            v-if="!readonly"
            class="item"
            effect="light"
            content="左树右表单需选择有树形结构的表数据"
            placement="bottom"
          >
            <ibps-icon name="help" style="color:#dd5b44;" />
          </el-tooltip>:
        </span>
        <dataset-selector
          v-model="dataTemplate.datasetKey"
          value-key="key"
          @change="changeDataset"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>

    <!--字段设置-->
    <setting-field
      :visible="settingFieldDialogVisible"
      :dataset-key="dataTemplate.datasetKey"
      :dataset-type="dataTemplate.datasetType"
      :width="dataTemplate.datasetType==='thirdparty'?'60%':'60%'"
      :top="dataTemplate.datasetType==='thirdparty'?'0vh':'5vh'"
      type="next"
      @callback="handleSettingField"
      @close="visible => settingFieldDialogVisible = visible"
    />
    <thirdparty-config
      :visible="thirdpartyConfigDialogVisible"
      :datasets="dataTemplate.datasets"
      type="next"
      @callback="handleSettingField"
      @close="visible => settingFieldDialogVisible = visible"
    />

    <!--数据模版设置-->
    <template-builder
      :visible="templatebuilderDialogVisible"
      :data="dataTemplate"
      @callback="$emit('callback')"
      @close="visible => templatebuilderDialogVisible = visible"
    />
  </el-dialog>
</template>

<script>
import { isKeyExists } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import { templateTypeOptions, showTypeOptions, composeTypeOptions } from '@/business/platform/data/constants'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import DatasetSelector from '@/business/platform/data/dataset/selector'

import SettingField from '@/business/platform/data/setting-field'
import ThirdpartyConfig from '@/business/platform/data/setting-field/thirdparty-config'
import TemplateBuilder from '@/business/platform/data/templatebuilder/dialog'
// import Utils from '@/business/platform/data/templatebuilder/utils'

import { testKey } from '@/utils/validate'
import i18n from '@/utils/i18n'

const validateFormKey = (rule, dataTemplateKey, callback) => {
  if (!testKey(dataTemplateKey)) {
    callback(new Error(i18n.t('validate.key')))
  } else {
    isKeyExists({
      dataTemplateKey: dataTemplateKey
    }).then(response => {
      if (response.data === true) {
        callback(new Error(`数据模版key已经存在`))
        return
      }
      callback()
    }).catch((err) => {
      callback(new Error(err))
    })
  }
}

export default {
  components: {
    IbpsTypeSelect,
    DatasetSelector,
    SettingField,
    ThirdpartyConfig,
    TemplateBuilder
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: String,
    typeId: String
  },
  data() {
    return {
      formName: 'dataTemplateForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      templatebuilderDialogVisible: false,
      templateTypeOptions,
      showTypeOptions,
      composeTypeOptions,

      settingFieldDialogVisible: false,
      thirdpartyConfigDialogVisible: false,

      defaultForm: {},
      dataTemplate: {
        name: '',
        key: '',
        typeId: '',
        type: 'default',
        showType: 'list',
        composeType: 'treeList',
        datasetKey: '',
        datasetType: 'table',
        unique: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') },
          { validator: validateFormKey, trigger: 'change' }],
        type: [{ required: true, message: this.$t('validate.required') }],
        composeType: [{ required: false, message: this.$t('validate.required') }],
        showType: [{ required: true, message: this.$t('validate.required') }],
        datasetKey: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'next', icon: 'ibps-icon-arrow-circle-right', label: '下一步' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    'dataTemplate.showType': {
      handler: function(val, oldVal) {
        if (val === 'compose') {
          this.formValidate()
        }
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.dataTemplate))
  },
  methods: {
    changeDataset(data) {
      this.dataTemplate.datasetType = data.type
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'next':
          this.handleNext()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 设置字段
    handleNext() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          // if (this.dataTemplate.datasetType === 'thirdparty') {
          //   if (!(this.dataTemplate.type === 'dialog' || this.dataTemplate.type === 'valueSource')) {
          //     ActionUtils.warning('第三方服务数据集只支持"对话框、值来源"模版类型！')
          //     return
          //   }
          // }
          if (this.dataTemplate.showType !== 'compose') {
            this.settingFieldDialogVisible = true
            this.closeDialog()
          } else {
            this.templatebuilderDialogVisible = true
            this.closeDialog()
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    handleSettingField(data) {
      //  如果是第三方服务，需要解析数据字段columns
      if (this.dataTemplate.datasetType === 'thirdparty') {
        this.dataTemplate.thirdparty = data

        // const queryColumnsAll = Utils.getFieldsByType('query')
        // console.log('queryColumnsAll', queryColumnsAll)

        // 1.1解析第三方服务字段-接口参数
        // const queryColumns = []
        // const requestData = data.requestData// array
        // if (this.$utils.isNotEmpty(requestData.bodyData)) {
        //   requestData.bodyData.forEach(item => {
        //     // 找到参数配置
        //     this.forEachColumnArray('queryRootColumn', item, queryColumns)
        //   })
        //   console.log('queryColumns', queryColumns)
        //   this.dataTemplate.queryColumns = queryColumns
        // }

        // TODO 1.2解析第三方服务字段-接口参数-分页

        // 2.1解析第三方服务字段-接口返回
        const dataColumns = []
        // const responseData = data.responseData// array
        // responseData.forEach(item => {
        //   // 找到数据配置
        //   this.forEachColumnArray('dataRootClumn', item, dataColumns)
        // })
        // console.log('dataColumns', dataColumns)
        this.dataTemplate.datasets = dataColumns

        // TODO 2.2解析第三方服务字段-接口返回-分页
      } else {
        this.dataTemplate.datasets = data
      }
      this.templatebuilderDialogVisible = true
      this.settingFieldDialogVisible = false
    },
    forEachColumnArray(bind, item, columns) {
      if (item.bindType.includes(bind)) {
        if (item.dataType === 'array') {
          const primaryItem = item.children[0]
          if (primaryItem.dataType === 'object') {
            const primaryObject = primaryItem.children
            const rootId = this.$utils.guid()
            const rootColumn = {
              'id': rootId,
              'label': primaryItem.desc,
              'name': primaryItem.name,
              'parentId': '0',
              'type': 'table',
              'attrType': 'table',
              'objName': primaryItem.name,
              'isPk': 'N',
              'icon': 'table'
            }
            columns.push(rootColumn)
            primaryObject.forEach(item2 => {
              if (item2.dataType === 'array' || item2.dataType === 'object') {
                console.log('暂不支持子表字段解析')
              } else {
                // ibps-icon-table ibps-icon-varchar ibps-icon-number ibps-icon-date
                // id bindType name dataType children desc
                const type_ = (item2.dataType === 'string' ? 'varchar' : item2.dataType)
                const column = {
                  'id': item2.id,
                  'label': item2.desc,
                  'name': item2.name,
                  'parentId': rootId,
                  'type': type_,
                  'attrType': 'column',
                  'objName': item2.name,
                  'isPk': 'N',
                  'icon': type_
                }
                columns.push(column)
              }
            })
          } else {
            // 暂不支持
            ActionUtils.warning('返回数据体类型不支持非对象类型！')
            return
          }
        } else {
          // 暂不支持
          ActionUtils.warning('返回数据根类型不支持非数组数据！')
          return
        }
      }

      if (item.dataType === 'object' || item.dataType === 'array') {
        item.children.forEach(item2 => {
          this.forEachColumnArray(bind, item2, columns)
        })
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      // 重置表单
      this.dataTemplate = JSON.parse(JSON.stringify(this.defaultForm))
      this.dataTemplate.typeId = this.typeId
      this.formValidate()
      this.$nextTick(() => {
        this.$refs['typeSelect'].loadTreeData()
      })
    }
  }

}
</script>
<style lang="scss">
.dataTemplate-create-dialog{
  .el-dialog__body{
    height:  calc(70vh - 120px) !important;
  }
}

</style>
