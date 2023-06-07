<template>
  <div v-if="dialogVisible" class="main-container">
    <ibps-container
      v-loading="loading"
      type="full"
      class="page"
      :element-loading-text="$t('common.loading')"
    >
      <template slot="header">
        <el-button v-if="buttonVisible && !testvisible" type="primary" :disabled="readonly" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
        <el-button v-if="testvisible" type="primary" :disabled="!testvisible" icon="ibps-icon-bug" @click="handleDebug()">执行</el-button>
      </template>
      <el-form
        ref="serviceForm"
        :model="service"
        :rules="rules"
        :label-width="formLabelWidth"
        @submit.native.prevent
      >
        <div v-if="testvisible">
          <h2 class="ibps-page-header-title">输入参数</h2>
          <el-row class="ibps-mb-20">
            <el-col :span="24">
              <el-input v-model="executeParams" type="textarea" rows="10" />
              <el-alert
                :closable="false"
                title="格式：{&quot;bodyType&quot;:&quot;json&quot;,&quot;bodyData&quot;:{&quot;username&quot;:&quot;admin&quot;,&quot;password&quot;:&quot;1&quot;},&quot;headers&quot;:[{&quot;name&quot;:&quot;header1&quot;,&quot;testValue&quot;:&quot;2552523523423423423423423&quot;}],&quot;querys&quot;:[{&quot;name&quot;:&quot;employeeId&quot;,&quot;testValue&quot;:&quot;34234234234234234&quot;}],&quot;params&quot;:{&quot;name&quot;:&quot;admin&quot;}}"
                type="warning"
                show-icon
              />
            </el-col>
          </el-row>
        </div>

        <h2 class="ibps-page-header-title">基本配置</h2>
        <!-- 服务主体部分 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称:" prop="name">
              <el-input v-if="!readonly" v-model="service.name" v-pinyin="{vm:service,key:'key'}" />
              <span v-else>{{ service.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标识:" prop="key">
              <el-input v-if="!readonly" v-model="service.key" :disabled="$utils.isNotEmpty(formId)" />
              <span v-else>{{ service.key }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否目录:" prop="isDir">
              <el-switch v-model="service.isDir" active-value="Y" inactive-value="N" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col v-if="service.isDir ==='N'" :span="12">
            <el-form-item label="接口类型:" prop="serviceType">
              <el-select
                v-if="!readonly"
                v-model="service.serviceType"
                placeholder="请选择"
                style="width:100%;"
                @change="changeServiceType"
              >
                <el-option
                  v-for="option in serviceTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <span v-else>{{ service.serviceType|optionsFilter(serviceTypeOptions,'label') }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="service.isDir ==='N'">
          <el-row>
            <el-col :span="24">
              <el-form-item label="服务地址:" prop="address">
                <el-input v-if="!readonly" v-model="service.address">
                  <el-select
                    v-if="service.serviceType==='restful'"
                    slot="prepend"
                    v-model="service.method"
                    placeholder="请选择"
                    style="width:100px;"
                    @change="changeRestfulMethod"
                  >
                    <el-option
                      v-for="option in methodOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                  <template slot="append">
                    <!-- <template v-if="service.serviceType==='webservice'">
                      <el-button icon="ibps-icon-search" @click="handleParse()">解析</el-button>
                      <el-divider direction="vertical" />
                    </template> -->
                    <el-button icon="ibps-icon-bug" @click="handleTest()">测试</el-button>
                  </template>
                </el-input>
                <span v-else>
                  <el-tag v-if="service.serviceType==='restful'">{{ service.method }}</el-tag>
                  {{ service.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 以下是webservice配置-->
          <!-- <template v-if=" service.serviceType==='webservice'">
            <el-row>
              <el-col :span="24">
                <el-form-item label="命名空间:" prop="namespace">
                  <el-input v-if="!readonly" v-model="service.webserviceSetting.namespace" />
                  <span v-else>{{ service.webserviceSetting.namespace }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否设置消息头:" prop="soapAction">
                  <el-select v-if="!readonly" v-model="service.webserviceSetting.soapAction" placeholder="请选择" style="width:100%;">
                    <el-option
                      v-for="option in defaultOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                  <span v-else>{{ service.webserviceSetting.soapAction|optionsFilter(defaultOptions,'label') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作方法:" prop="operation">
                  <el-input v-if="!readonly" v-model="service.operation" />
                  <span v-else>{{ service.webserviceSetting.operation }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="service.isDir!=='Y' && (service.serviceType==='webservice')">
              <el-col :span="12">
                <el-form-item label="用户名:" prop="username">
                  <el-input v-if="!readonly" v-model="service.username" />
                  <span v-else>{{ service.webserviceSetting.username }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码:" prop="password">
                  <el-input v-if="!readonly" v-model="service.password" />
                  <span v-else>{{ service.webserviceSetting.password }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template> -->
          <!-- webservice配置end-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="忽略异常:" prop="ignoreException">
                <el-select v-if="!readonly" v-model="service.ignoreException" placeholder="请选择" style="width:100%;">
                  <el-option
                    v-for="option in defaultOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <span v-else>{{ service.ignoreException|optionsFilter(defaultOptions,'label') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <h2 class="ibps-page-header-title ibps-mt-20">请求参数设置</h2>
          <el-row>
            <el-col :span="24">
              <el-form-item label="请求处理器:" prop="requestHandler">
                <el-select v-if="!readonly" v-model="service.requestHandler" placeholder="请选择" style="width:100%;">
                  <el-option
                    v-for="option in requestHandlerOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <span v-else>{{ service.requestHandler|optionsFilter(requestHandlerOptions,'label') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <request-restful
            v-if="service.serviceType==='restful'"
            ref="request"
            :value.sync="service.requestData"
            :method="service.method"
            :readonly="readonly"
          />
          <!-- <request-webservice
            v-else-if="service.serviceType==='webservice'"
            ref="request"
            v-model="service.requestData"
            :readonly="readonly"
          /> -->
          <h2 class="ibps-page-header-title ibps-mt-20 ibps-mb-20">返回数据设置</h2>
          <el-row>
            <el-col :span="24">
              <el-form-item label="响应解析器:" prop="responseParser">
                <el-select v-if="!readonly" v-model="service.responseParser" placeholder="请选择" style="width:100%;">
                  <el-option
                    v-for="option in responseParserOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />-
                </el-select>
                <span v-else>{{ service.responseParser|optionsFilter(responseParserOptions,'label') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <response
            ref="response"
            v-model="service.responseData"
            :value="service.responseData"
            :method="service.method"
            :readonly="readonly"
          />
        </template>

        <h2 class="ibps-page-header-title ibps-mt-20">描述</h2>
        <el-row>
          <el-col :span="24">
            <el-input v-if="!readonly" v-model="service.desc" type="textarea" rows="5" />
            <span v-else>{{ service.desc }}</span>
          </el-col>
        </el-row>
      </el-form>
    </ibps-container>
  </div>
</template>
<script>
import { save, get, parseService, findResponseParsers, findRequestHandlers } from '@/api/platform/serv/service'
import ActionUtils from '@/utils/action'
import { handleService, handleServiceTest } from './utils'
import { defaultOptions, methodOptions, serviceTypeOptions, dataTypeOptions, typeOptions } from './constants'
import { validateKey, validateURL } from '@/utils/validate'
import RequestRestful from '@/business/platform/serv/request/restful'
// import RequestWebservice from '@/business/platform/serv/request/webservice'
import Response from '@/business/platform/serv/response'
export default {
  components: {
    RequestRestful,
    // RequestWebservice,
    Response
  },
  props: {
    id: {
      type: String
    },
    parentId: String, // 父类数据
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    testvisible: {
      type: Boolean,
      default: false
    },
    buttonVisible: {
      type: Boolean,
      default: true
    },
    randomNum: String // 时间戳，用于保证点击请求数据
  },
  data() {
    return {
      loading: false,
      formName: 'serviceForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,

      // 常量
      responseParserOptions: [],
      requestHandlerOptions: [],
      serviceTypeOptions,
      defaultOptions,
      methodOptions,
      dataTypeOptions,
      typeOptions,
      webserviceSetting: {
        namespace: '',
        operation: '',
        soapAction: 'Y',
        username: '',
        password: ''
      },

      defaultForm: {
        name: '',
        key: '',
        isDir: 'N',
        serviceType: 'restful',
        method: 'GET',
        address: '',
        webserviceSetting: {},
        requestHandler: '',
        requestData: {
          bodyType: 'json',
          bodyData: [],
          querys: [],
          headers: []
        },
        responseParser: '',
        responseData: [],
        ignoreException: 'N',
        type: 'remote',
        desc: ''
      },
      service: {
        name: '',
        key: '',
        isDir: 'N',
        serviceType: 'restful',
        method: 'GET',
        address: '',
        webserviceSetting: {},
        requestHandler: '',
        requestData: {
          bodyType: 'json',
          bodyData: [],
          querys: [],
          headers: []
        },
        responseParser: '',
        responseData: [],
        ignoreException: 'N',
        type: 'remote',
        desc: ''
      },
      executeParams: null,
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }],
        address: [{ required: true, validator: validateURL }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'debug', hidden: () => { return !this.testvisible } },
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
    randomNum: {
      handler: function(val, oldVal) {
        this.constant()
      },
      immediate: true
    },
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'debug':
          this.handleDebug()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    constant() {
      findResponseParsers().then(response => {
        this.responseParserOptions = response.data
      }).catch(() => {})
      findRequestHandlers().then(response => {
        this.requestHandlerOptions = response.data
      }).catch(() => {})
      if (this.$utils.isEmpty(this.responseParserOptions) && this.$utils.isEmpty(this.requestHandlerOptions)) return
      this.getFormData()
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
    // 保存数据
    handleDebug() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.execute()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    getData() {
      if (this.service.isDir === 'N') {
        // 请求参数设置
        const requestData = this.$refs['request'].getData()
        if (!requestData) {
          return
        }
        // 返回数据
        const responseData = this.$refs['response'].getData()
        if (!responseData) {
          return
        }

        this.service.requestData = requestData
        this.service.responseData = responseData
      }

      if (this.$utils.isEmpty(this.formId)) {
        this.service.parentId = this.parentId
      }
      const data = this.$utils.newData(this.service)
      data.requestData = JSON.stringify(data.requestData)
      data.responseData = JSON.stringify(data.responseData)
      if (data.serviceType === 'webservice') {
        data.webserviceSetting = JSON.stringify(data.webserviceSetting)
      } else {
        data.webserviceSetting = '{}'
      }

      return data
    },
    // 提交保存数据
    saveData() {
      const data = this.getData()
      if (!data) {
        return
      }

      save(JSON.stringify(data)).then(response => {
        ActionUtils.removeSuccessMessage('保存成功')
        this.$emit('callback', true)
      }).catch((err) => {
        console.error(err)
      })
    },
    /**
     * 测试服务
     */
    execute() {
      const data = this.getData()
      this.loading = true
      let execParams = this.executeParams
      if (this.$utils.isEmpty(this.executeParams)) {
        execParams = '{}'
      }
      handleService(data.key, JSON.parse(execParams))
      this.loading = false
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly || !this.visible) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.loading = true
      if (this.$utils.isEmpty(this.formId)) {
        this.service = JSON.parse(JSON.stringify(this.defaultForm))
        this.service.responseParser = this.responseParserOptions[0].value
        this.service.requestHandler = this.requestHandlerOptions[0].value
        this.executeParams = null
        this.loading = false
        // 重置表单
        this.formValidate()
        return
      }
      get({
        serviceId: this.formId
      }).then(response => {
        this.$refs[this.formName].clearValidate()
        this.service = JSON.parse(JSON.stringify(response.data))
        this.service.requestData = this.$utils.parseJSON(response.data.requestData)
        this.service.responseData = this.$utils.parseJSON(response.data.responseData)
        this.service.webserviceSetting = this.$utils.parseJSON(response.data.webserviceSetting)
        this.executeParams = null
        this.formValidate()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    changeRestfulMethod(value) {
      if (value === 'GET') {
        this.service.requestData = {
          bodyType: 'form',
          bodyData: [],
          querys: [], // querys参数是否能与body参数同时出现
          headers: this.service.requestData.headers
        }
      } else {
        this.service.requestData = {
          bodyType: 'json',
          bodyData: [],
          querys: [], // querys参数是否能与body参数同时出现
          headers: this.service.requestData.headers
        }
      }
    },
    changeServiceType(data) {
      if (data === 'restful') {
        this.service.method = 'GET'
        this.service.webserviceSetting = {}
        this.service.requestData = {
          bodyType: 'json',
          bodyData: [],
          querys: [],
          headers: []
        }
      } else {
        this.service.method = ''
        this.service.webserviceSetting = JSON.parse(JSON.stringify(this.webserviceSetting))
        this.service.requestData = []
      }
    },
    /**
     * 解析服务
     */
    handleParse() {
      const params = {
        url: this.service.address,
        method: this.service.method,
        type: this.service.type || 'remote',
        parentId: this.parentId
      }
      parseService(params).then(response => {
        ActionUtils.success(response.message)
      }).catch(err => {
        console.error(err)
      })
    },
    /**
     * 测试服务
     */
    handleTest() {
      const data = this.getData()
      this.loading = true
      handleServiceTest(data)
      this.loading = false
    },
    handleSelectScript(data, index) {
      this.commonScriptVisible = true
    },
    handleCommonSelectorActionEvent(data) {
      console.log('handleCommonSelectorActionEvent--->', data)
    }
  }
}
</script>

