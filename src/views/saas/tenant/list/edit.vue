<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="dialog"
    :class="readonly?'leave-dialog-readonly':'leave-dialog-disReadonly'"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="tenantForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="tenant"
      :rules="rules"
      :label-width="formLabelWidth"
      label-suffix=":"
      @submit.native.prevent
    >
      <el-form-item v-if="parentName" :label="$t('platform.saas.tenant.prop.parentName')" prop="parentName">
        <span>{{ parentName }}</span>
      </el-form-item>
      <el-form-item :label="$t('platform.saas.tenant.prop.name')" prop="name">
        <el-input v-if="!readonly" v-model="tenant.name" v-pinyin="{vm:tenant,key:'code'}" :maxlength="64" />
        <span v-else>{{ tenant.name }}</span>
      </el-form-item>
      <el-form-item :label="$t('platform.saas.tenant.prop.code')" prop="code">
        <el-input v-if="!readonly" v-model="tenant.code" :disabled="formId!==''" />
        <span v-else>{{ tenant.code }}</span>
      </el-form-item>
      <el-form-item :label="$t('platform.saas.tenant.prop.scale')" prop="scale">
        <el-select v-if="!readonly" v-model="tenant.scale" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in scaleOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <span v-else>{{ tenant.scale }}</span>
      </el-form-item>
      <el-form-item :label="this.$t('platform.saas.tenant.prop.status')" prop="status">
        <el-select v-if="!readonly" v-model="tenant.status" :disabled="formId===''" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-tag v-else :type="tenant.status|optionsFilter(statusOptions,'type')">{{ tenant.status|optionsFilter(statusOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item v-if="readonly" :label="$t('common.field.createTime')">
        <span>{{ tenant.createTime }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" :label="$t('common.field.updateTime')">
        <span>{{ tenant.updateTime }}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { save, get } from '@/api/saas/tenant/tenant'
import ActionUtils from '@/utils/action'
import { validateKey } from '@/utils/validate'
import { statusOptions, scaleOptions } from './constants'

export default {
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
    tenantId: String,
    title: String
  },
  data() {
    const validateName = (rule, value, callback) => {
      const re = /[^a-zA-Z0-9\u4E00-\u9FA5]{1,255}$/g
      if (re.test(value)) {
        callback(new Error('字符请勿携带特殊字符或者空格'))
      } else {
        callback()
      }
    }
    const convertOptions = (options, translationKey, valueKey = 'value', labelKey = 'label') => {
      return options.map((option) => {
        option[labelKey] = this.$t(translationKey + option[valueKey])
        return option
      })
    }

    return {
      formName: 'tenantForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      statusOptions: convertOptions(statusOptions, 'platform.saas.tenant.constants.status.'),
      scaleOptions: scaleOptions,
      defaultForm: {},
      parentName: '',
      tenant: {
        name: '',
        scale: '1~50人',
        status: 'ENABLED',
        code: '',
        schemaStatus: 'WAIT',
        approveStatus: 'PASSED'
      },
      rules: {
        name: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateName, trigger: 'blur' }
        ],
        scale: [{ required: true, message: this.$t('validate.required') }],
        status: [
          { required: true, message: this.$t('validate.required') }
        ],
        code: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateKey, trigger: 'blur' }
        ]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
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
    tenant: {
      handler: function(val, oldVal) {
        var pattern = /\s/
        if (pattern.test(val.name)) {
          if (pattern.test(val.code)) {
            val.code = ''
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.tenant))
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      save(this.tenant).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.$refs[this.formName].resetFields()
      this.parentName = ''
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
      if (this.$utils.isNotEmpty(this.tenantId)) {
        // 新增页面添加主租户id
        this.dialogLoading = true
        get({
          id: this.tenantId
        }).then(response => {
          this.parentName = response.data.name
          this.$set(this.tenant, 'parentId', this.tenantId)
          this.dialogLoading = false
        }).catch(() => {
          this.dialogLoading = false
        })
      }
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.tenant = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        this.tenant = response.data
        this.formValidate()
        this.dialogLoading = false
        if (response.data.parentId !== null) {
          get({
            id: this.tenant.parentId
          }).then(response => {
            this.parentName = response.data.name
            this.dialogLoading = false
          }).catch(() => {
            this.dialogLoading = false
          })
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
// .leave-dialog-readonly{
//   .el-dialog__body{
//     height:  calc(42vh - 140px) !important;
//   }
// }
// .leave-dialog-disReadonly{
//   .el-dialog__body{
//     height: calc(32vh - 140px) !important;
//   }
// }
</style>
