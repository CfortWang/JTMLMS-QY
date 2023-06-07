<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    custom-class="column-eidt-dialog is-fullscreen"
    top="0"
    width="65%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      v-if="dialogVisible"
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
      class="template-dialog-form"
      @submit.native.prevent
    >
      <el-form-item label="名称:" prop="name">
        <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form,key:'key'}" @blur="validateFormField" />
        <span v-else>{{ form.name }}</span>
      </el-form-item>
      <el-form-item label="业务主键:" prop="key">
        <el-input v-if="!readonly" v-model="form.key" :disabled="!$utils.isEmpty(formId)" />
        <span v-else>{{ form.key }}</span>
      </el-form-item>
      <el-form-item label="模板分类:" prop="typeKey">
        <ibps-type-select
          v-if="!readonly"
          v-model="form.typeKey"
          :readonly="readonly"
          node-key="typeKey"
          category-key="MSG_TEL_TYPE"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否默认:" prop="isDefault">
        <el-switch
          v-if="!readonly"
          v-model="form.isDefault"
          active-value="Y"
          inactive-value="N"
        />
        <!-- <span v-else>{{ form.isDefault }}</span> -->
        <el-tag v-else :type="form.isDefault|optionsFilter(defaultOptions,'type')">{{ form.isDefault|optionsFilter(defaultOptions,'label') }}</el-tag>
      </el-form-item>
      <el-form-item label="标题:" prop="subject">
        <el-input v-if="!readonly" v-model="form.subject" />
        <span v-else>{{ form.subject }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="创建人:">
        <ibps-employee-selector
          v-model="form.createBy"
          readonly-text="text"
          disabled
        />
      </el-form-item>
      <el-form-item v-if="readonly" label="创建时间:">
        <span>{{ form.createTime | dateFormat }}</span>
      </el-form-item>
      <el-form-item v-if="readonly" label="更新人:">
        <ibps-employee-selector
          v-model="form.updateBy"
          readonly-text="text"
          disabled
        />
      </el-form-item>
      <el-form-item v-if="readonly" label="更新时间:">
        <span>{{ form.updateTime | dateFormat }}</span>
      </el-form-item>
      <!-- <el-form-item v-if="readonly" label="模板二级分类:">
        <span>{{ form.subTypeKey }}</span>
      </el-form-item> -->
      <el-form-item label="纯文本内容:" prop="plain">
        <codemirror v-model="form.plain" :options="cmOption" />
      </el-form-item>
      <el-form-item label="微信文本内容:" prop="wechat">
        <codemirror v-model="form.wechat" :options="cmOption" />
      </el-form-item>
      <el-form-item label="HTML模板内容:" prop="html">
        <ibps-ueditor v-model="form.html" :readonly="readonly" destroy />
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
import { save, get, isKeyExists } from '@/api/platform/message/messageTemplate'
import { defaultOptions } from './constants'
import ActionUtils from '@/utils/action'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'

export default {
  components: {
    IbpsEmployeeSelector,
    IbpsTypeSelect,
    IbpsUeditor,
    codemirror
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
    editData: [Object, String]
  },
  data() {
    const validateKey = (rule, value, callback) => {
      const res = /^[A-Za-z]{1}([a-zA-Z0-9_-]{1,191})$/
      if (!res.test(value)) {
        callback(new Error('首字符为字母，其它只允许为字母、数字或下划线，并且长度不超过192字符'))
      } else {
        callback()
      }
    }
    return {
      cmOption: {
        lineNumbers: true,
        autoCloseTags: true,
        line: true,
        mode: 'text/html',
        theme: 'eclipse'
      },
      formName: 'form',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      isExistsKey: false,
      defaultOptions: defaultOptions,
      defaultForm: {},
      form: {
        name: '',
        key: '',
        typeKey: 'taskCreate',
        isDefault: 'true',
        subject: '',
        plain: '',
        wechat: '',
        html: '',
        id: '',
        createTime: '',
        htmlEditor: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [
          { required: true, message: this.$t('validate.required') },
          { validator: validateKey, trigger: 'blur' }
        ],
        typeKey: [{ required: true, message: this.$t('validate.required') }],
        isDefault: [{ required: true, message: this.$t('validate.required') }]
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
    'form.key': {
      handler: function(val) {
        this.isKeyExistsKey(val)
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    isKeyExistsKey(val) {
      if (this.$utils.isEmpty(val)) return
      isKeyExists({
        key: val,
        typeKey: this.form.typeKey,
        id: this.form.id || this.id
      }).then(res => {
        if (res.data) {
          this.$message({
            message: '业务主键已存在，请重新填写！',
            type: 'warning'
          })
        }
        this.isExistsKey = res.data
      }).catch(err => {
        console.err(err)
      })
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
      if (this.isExistsKey) {
        this.$message({
          message: '业务主键已存在，请重新填写！',
          type: 'warning'
        })
        return
      }
      const data = this.form
      if (Object.prototype.toString.call(this.form.createTime) !== '[object Number]') {
        data.createTime = Date.parse(this.form.createTime)
      }
      if (Object.prototype.toString.call(this.form.updateTime) !== '[object Number]') {
        data.updateTime = Date.parse(this.form.updateTime)
      }
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            if (this.$refs[this.formName]) {
              this.$refs[this.formName].resetFields()
            }
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
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].resetFields()
      }
      this.$emit('close', false)
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].validate(() => {})
        }
      })
    },
    validateFormField() {
      setTimeout(() => {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].validateField('key')
        }
      }, 50)
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        messageTemplateId: this.formId
      }).then(response => {
        this.form = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
  .template-dialog{
    .el-dialog__body{
      height:  calc(100vh) !important;
    }
  }

.template-dialog-form{
  .CodeMirror{
    height: 150px!important;
    .CodeMirror-scroll{
      padding-bottom: 8px !important;
      height: 150px!important;
      border: 1px solid #eee{
        left:none;
        bottom:1px;
      }
    }
  }
}
</style>
