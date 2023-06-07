<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    class="ibps-dialog-80"
    top="5vh"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-form-item label="父级应用:" prop="appKey">
        <app-key-selector
          v-if="!readonly"
          :value="formsId"
          @input="handleInput"
          @callback="data => formId= data.id"
        />
        <span v-else>{{ form.appKey }}</span>
      </el-form-item>
      <el-form-item label="接口名称:" prop="apiName">
        <el-input v-if="!readonly" v-model="form.apiName" v-pinyin="{vm:form,name:'apiName',key:'apiKey'}" />
        <span v-else>{{ form.apiName }}</span>
      </el-form-item>
      <el-form-item label="接口标识:" prop="apiKey">
        <el-input v-if="!readonly" v-model="form.apiKey" :disabled="formId!==''" />
        <span v-else>{{ form.apiKey }}</span>
      </el-form-item>

      <el-form-item label="接口地址" prop="apiUri">
        <el-input v-if="!readonly" v-model="form.apiUri" />
        <span v-else>{{ form.apiUri }}</span>
      </el-form-item>
      <el-form-item label="作用域:" prop="scope">
        <el-radio-group v-if="!readonly" v-model="form.scope">
          <el-radio v-for="(item, i) in constant[0]" :key="i" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
        <el-tag
          v-else
        >
          {{ form.scope|optionsFilter(typeOptions,'label') }}
        </el-tag>
      </el-form-item>
      <el-form-item label="频次:" prop="limit">
        <el-input v-if="!readonly" v-model="form.limit" />
        <span v-else>{{ form.limit }}</span>
      </el-form-item>
      <el-form-item label="测试频次:" prop="testLimit">
        <el-input v-if="!readonly" v-model="form.testLimit" />
        <span v-else>{{ form.testLimit }}</span>
      </el-form-item>
      <el-form-item label="接口描述:" prop="apiDesc">
        <el-input v-if="!readonly" v-model="form.apiDesc" type="textarea" />
        <span v-else>{{ form.apiDesc }}</span>
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
import { save, get } from '@/api/platform/auth/api'
import { typeOptions } from './constants'
import { validateInteger, validateKey } from '@/utils/validate'
import ActionUtils from '@/utils/action'

import AppKeySelector from '@/business/platform/auth/app/selector'
export default {
  components: {
    AppKeySelector
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
    constant: Object
  },
  data() {
    return {
      formName: 'form',
      prefixIcon: '',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      typeOptions: typeOptions,
      defaultForm: {},
      defaulRules: {},
      formsId: this.id,
      form: {
        appKey: '',
        apiKey: '',
        apiName: '',
        apiUri: '',
        scope: 'auth',
        limit: '',
        testLimit: '',
        apiDesc: '',
        createBy: this.$store.getters.userId,
        createTime: '',
        id: '',
        updateBy: '',
        updateTime: ''
      },
      rules: {
        appKey: [{ required: true, message: this.$t('validate.required') }],
        apiKey: [{ required: true, validator: validateKey, message: this.$t('validate.required') }],
        apiName: [{ required: true, message: this.$t('validate.required') }],
        apiUri: [{ required: true, message: this.$t('validate.required') }],
        scope: [{ required: true, message: this.$t('validate.required') }],
        limit: [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }],
        testLimit: [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }]
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
    form: {
      handler: function(val, oldVal) {
        if (val.appKey !== '') {
          this.clearValidate(this.formName, 'appKey')
        } else {
          this.formValidate()
        }
      },
      deep: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
    this.defaulRules = JSON.parse(JSON.stringify(this.rules))
  },
  methods: {
    clearValidate(formName, prop) {
      this.$refs[formName].clearValidate(prop)
    },
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
    digitalCheck(value) {
      value = value.replace(/[^\d]/g, '')
    },
    handleInput(getValue) {
      this.form.appKey = getValue
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
      const data = JSON.parse(JSON.stringify(this.form))
      if (this.$utils.isEmpty(data.apiKey)) {
        ActionUtils.warning('请选择作用域！')
        return
      }
      // data.scope = this.form.scope.join(',')
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
            this.formsId = []
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
      this.formsId = []
      this.$refs[this.formName].resetFields()
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
      if (this.readonly) {
        this.$nextTick(() => {
          this.$refs[this.formName].resetFields()
        })
      } else {
        this.defaulRules['limit'] = [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }]
        this.defaulRules['testLimit'] = [{ required: true, message: this.$t('validate.required') }, { validator: validateInteger, trigger: 'blur' }]
        this.rules = this.defaulRules
      }
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.prefixIcon = 'ibps-icon-add'
        this.formValidate()
        return
      }
      this.dialogLoading = true
      this.formsId = this.formId
      get({
        authAppApiId: this.formId
      }).then(response => {
        const data = response.data
        // data.scope = data.scope.split(',')
        this.form = data
        this.prefixIcon = ''
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
