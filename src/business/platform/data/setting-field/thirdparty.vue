<template>
  <div>
    <h2 class="ibps-page-header-title ibps-mt-20">请求参数设置</h2>
    <request-restful
      v-if="datasetData.serviceType==='restful'"
      ref="request"
      v-model="datasetData.requestData"
      :method="datasetData.method"
      :readonly="true"
      type="bind"
    />
    <request-webservice
      v-else-if="datasetData.serviceType==='webservice'"
      ref="request"
      v-model="datasetData.requestData"
      type="bind"
      :readonly="true"
    />
    <h2 class="ibps-page-header-title ibps-mt-20">返回数据设置</h2>
    <response
      ref="response"
      v-model="datasetData.responseData"
      :method="datasetData.method"
      :readonly="true"
      type="bind"
    />
  </div>
</template>
<script>
import RequestRestful from '@/business/platform/serv/request/restful'
import RequestWebservice from '@/business/platform/serv/request/webservice'
import Response from '@/business/platform/serv/response'

export default {
  components: {
    RequestRestful,
    RequestWebservice,
    Response
  },
  props: {
    datasets: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      height: 450,
      datasetData: {
        serviceType: 'restful',
        requestData: {
          bodyType: 'form', // body 类型
          bodyData: [], // body 类型数据【包含form，json，file，raw】
          querys: [],
          headers: []
        },
        responseData: []
      },
      formData: null,
      defaultForm: {
        label: '',
        field_options: {}
      }
    }
  },
  watch: {
    datasets(val) {
      this.datasetData = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    getData() {
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

      return {
        requestData,
        responseData
      }
    }
  }
}
</script>
