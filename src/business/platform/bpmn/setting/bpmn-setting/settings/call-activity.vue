<template>
  <div class="panel-body">
    <el-form label-width="120px" :label-position="labelPosition" :model="callActivity" @submit.native.prevent>
      <el-form-item label="子流程流程定义:">
        <el-input
          v-model="callActivity.flowName"
          placeholder="无定义"
          autocomplete="off"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="是否多实例:">
        <span v-if="callActivity.supportMuliInstance">是（{{ callActivity.isParallel?'并行':'串行' }}）</span>
        <span v-else>否</span>
      </el-form-item>
      <el-form-item label="子流程设置:">
        <el-button type="primary" :style="{'width':'100%'}" icon="ibps-icon-cogs" plain @click="setDefinition">外部子流程设置</el-button>
      </el-form-item>
    </el-form>
    <!-- 流程设置-->
    <ibps-bpmn-def-setting
      :visible="settingFormVisible"
      :def-id="flowId"
      :def-key="flowKey"
      :parent-def-key="defKey"
      :data="settingData"
      :message-types="messageTypes"
      title="设置"
      @close="visible => settingFormVisible = visible"
      @callback="handleCallback"
    />
  </div>
</template>
<script>
import { getByDefKey } from '@/api/platform/bpmn/bpmDefinition'
import { mapState } from 'vuex'
import ActionUtils from '@/utils/action'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: Object,
    defKey: String,
    globalData: Object
  },
  data() {
    return {
      labelPosition: 'right',
      settingFormVisible: false,
      flowKey: '',
      flowId: '',
      settingData: {}
    }
  },
  computed: {
    ...mapState({
      messageTypes: state => state.ibps.bpmn.messageTypes
    }),
    callActivity() {
      return this.data.callActivity
    }
  },
  methods: {
    setDefinition() {
      if (this.$utils.isEmpty(this.globalData.bo.code)) {
        ActionUtils.warning('请绑定业务对象')
        return
      }
      this.flowKey = this.callActivity.flowKey
      this.settingData = this.handleSettingData(this.callActivity.setting || {})
      this.settingData.global.attributes.hideSkipFirstNode = true
      this.settingData.global.attributes.skipFirstNode = false
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.loading')
      })
      getByDefKey({
        defKey: this.flowKey
      }).then(response => {
        const data = response.data
        this.flowId = data.defId

        setTimeout(() => {
          loading.close()
          this.settingFormVisible = true
        }, 0)
      }).catch(() => {
        loading.close()
      })
    },
    handleSettingData(data) {
      // 处理bo
      data.global.bo = this.globalData.bo
      // 处理表单
      return data
    },
    handleCallback(data) {
      this.callActivity.setting = this.$utils.parseJSON(data)
      this.settingFormVisible = false
      ActionUtils.success('外部子流程配置已缓存！')
    }

  }
}
</script>
