<template>
  <div class="panel-body service-setting">
    <el-form label-width="120px" :label-position="labelPosition" :model="service" @submit.native.prevent>
      <el-input v-model="serviceName" disabled placeholder="请设置服务" :style="'marginBottom:20px'" />
      <div class="bottom">
        <el-button type="success" @click="dialogSelectorVisible = true">选择</el-button>
        <el-button v-if="settingVisible" type="success" @click="showForm">设置</el-button>
        <el-button type="info" @click="cleanService">清空</el-button>
      </div>
    </el-form>

    <ibps-service-selector-dialog
      :visible="dialogSelectorVisible"
      :value="[]"
      :multiple="false"
      class="position-org-dialog"
      @close="visible => dialogSelectorVisible = false"
      @action-event="setSetting"
    />

    <edit-service-setting
      :title="'服务设置'"
      :visible="dialogFormVisible"
      :service-setting="serviceSettingData"
      :service="serviceData"
      :readonly="true"
      @callback="setServiceSetting"
      @close="visible => dialogFormVisible = false"
    />
  </div>
</template>
<script>

import EditServiceSetting from '../components/edit-service-setting'
import IbpsServiceSelectorDialog from '@/business/platform/serv/service/dialog'

export default {
  components: {
    IbpsServiceSelectorDialog,
    EditServiceSetting
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogSelectorVisible: false,
      settingVisible: false,
      labelPosition: 'left',
      defaultService: {
        ignoreException: 'Y',
        settings: [
          {
            serviceKey: '',
            serviceName: '',
            callbackType: 'default',
            bind: '{}',
            script: ''
          }
        ]
      },
      serviceName: '',
      serviceData: {},
      serviceSettingData: {}
    }
  },
  computed: {
    service() {
      return this.data
    }
  },
  // 监听
  watch: {
    service: {
      handler(val, oldVal) {
        if (this.$utils.isNotEmpty(val.settings)) {
          this.handlerChange(val.settings)
        }
      },
      immediate: true,
      deep: true
    },
    'service.settings': {
      handler(val, oldVal) {
        this.handlerChange(val)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handlerChange(val) {
      if (this.$utils.isNotEmpty(val)) {
        const serviceNames = []
        val.forEach(item2 => {
          if (this.$utils.isNotEmpty(item2.serviceName)) {
            serviceNames.push(item2.serviceName)
          }
        })

        this.serviceSettingData = val[0]
        if (this.$utils.isNotEmpty(this.serviceSettingData.serviceKey)) {
          this.settingVisible = true
        }

        this.serviceName = serviceNames.join(',')
      } else {
        this.serviceName = ''
      }
    },
    setSetting(buttonKey, data) {
      switch (buttonKey) {
        case 'confirm':// 确定
          if (this.$utils.isEmpty(data)) {
            break
          }
          // 服务选择器数据传递到配置页
          this.serviceData = JSON.parse(JSON.stringify(data))
          // requestData 转成对象形式
          this.serviceData.requestData = JSON.parse(this.serviceData.requestData)
          // responseData 转成对象形式
          this.serviceData.responseData = JSON.parse(this.serviceData.responseData)

          this.dialogSelectorVisible = false
          this.dialogFormVisible = true
          break
        default:
          this.dialogSelectorVisible = false
          break
      }
    },
    showForm() {
      if (this.settingVisible) {
        // 有数据直接设置
        this.dialogFormVisible = true
      } else {
        // 无数据，跳转服务选择器选择服务
        this.dialogSelectorVisible = true
      }
    },
    setServiceSetting(val) {
      // 回显
      this.dialogFormVisible = false

      if (this.$utils.isNotEmpty(val)) {
        this.service.ignoreException = val.ignoreException
        this.service.settings[0].serviceKey = val.serviceData.key
        this.service.settings[0].serviceName = val.serviceData.name
        this.service.settings[0].callbackType = 'default'
        this.service.settings[0].bind = '{}'
        this.service.settings[0].script = ''
      }
    },
    cleanService() {
      this.service.ignoreException = 'Y'
      this.service.settings[0].serviceKey = ''
      this.service.settings[0].serviceName = ''
      this.service.settings[0].callbackType = 'default'
      this.service.settings[0].bind = '{}'
      this.service.settings[0].script = ''
      this.serviceData = {}
      this.serviceSettingData = {}
      this.settingVisible = false
    }
  }
}
</script>
<style lang="scss">
.service-setting{
  .bottom{
    display: flex;
    justify-content: space-between;
    .el-button{
      width: 45%;
    }
  }
}
</style>
