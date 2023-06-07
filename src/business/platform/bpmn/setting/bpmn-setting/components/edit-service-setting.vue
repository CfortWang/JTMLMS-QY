<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog serv-setting-dialog"
      :width="'70%'"
      :height="'60%'"
      top="2vh"
      append-to-body
      @open="getFormData"
      @close="closeDialog"
    >
      <div v-if="dialogVisible" class="main-container">
        <ibps-container
          v-loading="loading"
          type="full"
          class="page"
          :element-loading-text="$t('common.loading')"
        >
          <el-form
            ref="serviceForm"
            :model="service"
            :rules="rules"
            :label-width="formLabelWidth"
            @submit.native.prevent
          >
            <div>
              <h2 class="ibps-page-header-title">服务调用异常是否忽略（流程是否正常向下流转）</h2>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="是否忽略:" prop="ignoreException">
                    <el-select v-model="ignoreException" placeholder="请选择" style="width:100%;">
                      <el-option
                        v-for="option in defaultOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <h2 class="ibps-page-header-title">基本配置</h2>
            <!-- 服务主体部分 -->
            <el-row>
              <el-col :span="12">
                <el-form-item label="名称:" prop="name">
                  <el-input v-if="!readonly" v-model="serviceData.name" v-pinyin="{vm:service,key:'key'}" />
                  <span v-else>{{ serviceData.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标识:" prop="key">
                  <el-input v-if="!readonly" v-model="serviceData.key" :disabled="$utils.isNotEmpty(formId)" />
                  <span v-else>{{ serviceData.key }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否目录:" prop="isDir">
                  <el-switch v-model="serviceData.isDir" active-value="Y" inactive-value="N" :disabled="readonly" />
                </el-form-item>
              </el-col>
              <el-col v-if="serviceData.isDir ==='N'" :span="12">
                <el-form-item label="接口类型:" prop="serviceType">
                  <el-select
                    v-if="!readonly"
                    v-model="serviceData.serviceType"
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
                  <span v-else>{{ serviceData.serviceType|optionsFilter(serviceTypeOptions,'label') }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <template v-if="serviceData.isDir ==='N'">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="服务地址:" prop="address">
                    <el-input v-if="!readonly" v-model="serviceData.address">
                      <el-select
                        v-if="serviceData.serviceType==='restful'"
                        slot="prepend"
                        v-model="serviceData.method"
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
                    </el-input>
                    <span v-else>
                      <el-tag v-if="serviceData.serviceType==='restful'">{{ serviceData.method }}</el-tag>
                      {{ serviceData.address }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 以下是webservice配置-->
              <!-- webservice配置end-->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="忽略异常:" prop="ignoreException">
                    <el-select v-if="!readonly" v-model="serviceData.ignoreException" placeholder="请选择" style="width:100%;">
                      <el-option
                        v-for="option in defaultOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <span v-else>{{ serviceData.ignoreException|optionsFilter(defaultOptions,'label') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <h2 class="ibps-page-header-title ibps-mt-20">请求参数设置</h2>
              <request-restful
                v-if="serviceData.serviceType==='restful'"
                ref="request"
                v-model="serviceData.requestData"
                :method="serviceData.method"
                :readonly="true"
                :type="type"
              />
              <h2 class="ibps-page-header-title ibps-mt-20 ibps-mb-20">返回数据设置</h2>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="响应解析器:" prop="responseParser">
                    <el-select v-if="!readonly" v-model="serviceData.responseParser" placeholder="请选择" style="width:100%;">
                      <el-option
                        v-for="option in responseParserOptions"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                    <span v-else>{{ serviceData.responseParser|optionsFilter(responseParserOptions,'label') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <h2 class="ibps-page-header-title ibps-mt-20">返回数据设置</h2>
              <response
                ref="response"
                v-model="serviceData.responseData"
                :method="serviceData.method"
                :readonly="true"
                :type="type"
              />
            </template>

            <h2 class="ibps-page-header-title ibps-mt-20">描述</h2>
            <el-row>
              <el-col :span="24">
                <el-input v-if="!readonly" v-model="serviceData.desc" type="textarea" rows="5" />
                <span v-else>{{ serviceData.desc }}</span>
              </el-col>
            </el-row>
          </el-form>
        </ibps-container>
      </div>
      <div slot="footer" class="el-dialog--center">
        <ibps-toolbar
          :actions="toolbars"
          @action-event="handleActionEvent"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>

import RequestRestful from '@/business/platform/serv/request/restful'
import Response from '@/business/platform/serv/response'
import { getByKey, findResponseParsers } from '@/api/platform/serv/service'
import { validateKey, validateURL } from '@/utils/validate'
import ActionUtils from '@/utils/action'
import { defaultOptions, methodOptions, serviceTypeOptions, dataTypeOptions, typeOptions } from '@/views/platform/serv/constants'

export default {
  components: {
    RequestRestful,
    Response
  },
  props: {
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
    type: {
      type: String,
      default: 'default'
    },
    service: Object,
    serviceSetting: Object
  },
  data() {
    return {
      loading: false,
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      responseParserOptions: [],
      serviceTypeOptions,
      defaultOptions,
      methodOptions,
      dataTypeOptions,
      typeOptions,
      webserviceSetting: {},
      ignoreException: 'Y',
      serviceSettingData: this.serviceSetting,
      serviceData: {
        serviceType: 'restful',
        requestData: {
          bodyType: 'form', // body 类型
          bodyData: [], // body 类型数据【包含form，json，file，raw】
          querys: [],
          headers: []
        },
        responseData: []
      },
      toolbars: [
        { key: 'confirm' },
        { key: 'cancel' }
      ],
      formData: null,
      defaultForm: {
        label: '',
        field_options: {}
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, validator: validateKey }],
        address: [{ required: true, validator: validateURL }]
      }
    }
  },
  computed: {
    formId() {
      return this.service.id
    }/* ,
    serviceSettingData() {
      return JSON.parse(JSON.stringify(this.serviceSetting))
    } */
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    },
    service(val) {
      this.serviceData = JSON.parse(JSON.stringify(val))
    },
    serviceSetting(val) {
      this.serviceSettingData = JSON.parse(JSON.stringify(val))
    }
  },
  created() {
    this.constant()
  },
  methods: {
    constant() {
      findResponseParsers().then(response => {
        this.responseParserOptions = response.data
      }).catch(() => {})
    },
    getData() {
      if (this.serviceData.isDir === 'N') {
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

        this.serviceData.requestData = requestData
        this.serviceData.responseData = responseData
      }

      if (this.$utils.isEmpty(this.formId)) {
        this.serviceData.parentId = this.parentId
      }
      const data = this.$utils.newData(this.serviceData)
      data.requestData = JSON.stringify(data.requestData)
      data.responseData = JSON.stringify(data.responseData)
      if (data.serviceType === 'webservice') {
        data.webserviceSetting = JSON.stringify(data.webserviceSetting)
      } else {
        data.webserviceSetting = '{}'
      }
      return data
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'confirm':
          this.saveData({ serviceData: this.getData(), ignoreException: this.ignoreException })
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 提交保存数据
    saveData(data) {
      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    changeRestfulMethod(value) {
      if (value === 'GET') {
        this.serviceData.requestData = {
          bodyType: 'form',
          bodyData: [],
          querys: [], // querys参数是否能与body参数同时出现
          headers: this.serviceData.requestData.headers
        }
      } else {
        this.serviceData.requestData = {
          bodyType: 'json',
          bodyData: [],
          querys: [], // querys参数是否能与body参数同时出现
          headers: this.serviceData.requestData.headers
        }
      }
    },
    changeServiceType(data) {
      if (data === 'restful') {
        this.serviceData.method = 'GET'
        this.serviceData.webserviceSetting = {}
        this.serviceData.requestData = {
          bodyType: 'json',
          bodyData: [],
          querys: [],
          headers: []
        }
      } else {
        this.serviceData.method = ''
        this.serviceData.webserviceSetting = JSON.parse(JSON.stringify(this.webserviceSetting))
        this.serviceData.requestData = []
      }
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
      if (this.$utils.isNotEmpty(this.formId)) {
        // 重置表单
        this.formValidate()
        return
      }
      if (this.$utils.isEmpty(this.serviceSettingData)) {
        // this.saveData()
        this.closeDialog()
        ActionUtils.warning('请选择服务！')
        return
      }
      getByKey({
        serviceKey: this.serviceSettingData.serviceKey
      }).then(response => {
        const data = response.data
        data.requestData = this.$utils.parseJSON(data.requestData, { })
        data.responseData = this.$utils.parseJSON(data.responseData, [])
        data.webserviceSetting = this.$utils.parseJSON(data.webserviceSetting, {})
        this.serviceData = data
        this.executeParams = null
        this.formValidate()
      }).catch((e) => {
        ActionUtils.error(e)
        console.error('服务请求失败', e)
      })
    }
  }
}
</script>

<style lang="scss">
.serv-setting-dialog{
  .el-dialog__body{
    height:  calc(80vh - 140px) !important;
  }
}
</style>
