<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="设置字段控件"
    :width="width"
    :top="top"
    append-to-body
    class="setting-field-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div v-if="datasetType==='table'|| datasetType==='view'">
      <column
        v-if="dialogVisible"
        ref="dataset"
        :datasets="datasetData"
      />
    </div>
    <div v-else-if="datasetType==='thirdparty'">
      <thirdparty
        ref="dataset"
        :datasets="datasetData"
      />
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>
<script>
import { buildTree } from '@/api/platform/data/dataset'
import ActionUtils from '@/utils/action'
import Column from './column'
import Thirdparty from './thirdparty'

export default {
  components: {
    Column,
    Thirdparty
  },
  props: {
    visible: Boolean,
    type: {
      type: String,
      default: 'default'
    },
    datasetKey: String,
    datasetType: {
      type: String,
      default: 'table'
    },
    width: {
      type: String,
      default: '60%'
    },
    top: {
      type: String,
      default: '5vh'
    },
    datasets: [Array, Object]
  },
  data() {
    return {
      dialogVisible: false,
      datasetData: this.datasetType === 'table' ? [] : {}
    }
  },
  computed: {
    toolbars() {
      if (this.type === 'default') {
        return [
          { key: 'confirm' },
          { key: 'reset', type: 'info', icon: 'el-icon-refresh-left', label: '重置' },
          { key: 'cancel' }
        ]
      } else {
        return [
          { key: 'next', icon: 'ibps-icon-arrow-circle-right', label: '下一步' },
          // { key: 'reset', type: 'info', icon: 'el-icon-refresh-left', label: '重置' },
          { key: 'cancel' }
        ]
      }
    }
  },
  watch: {
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
        case 'prev':
          this.prev()
          break
        case 'next':
        case 'confirm':
          this.saveData()
          break
        case 'reset':
          this.resetData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    prev() {

    },
    saveData() {
      const data = this.$refs.dataset.getData()
      if (this.$utils.isEmpty(data)) {
        return
      }
      this.$emit('callback', data)
      this.closeDialog()
    },
    resetData() {
      this.$confirm('确认重置吗？重置后设置的字段会还原默认', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        buildTree({
          datasetKey: this.datasetKey
        }).then(response => {
          ActionUtils.success('重置成功！')
          const datasets = response.data
          this.$emit('callback', datasets)
          this.closeDialog()
        }).catch((e) => {
        })
      }).catch(() => {})
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      if (this.$utils.isNotEmpty(this.datasetKey)) {
        buildTree({
          datasetKey: this.datasetKey
        }).then(response => {
          let data = {}
          if (this.datasetType === 'thirdparty') {
            const service = response.variables.service
            service.requestData = this.$utils.parseJSON(service.requestData, {})
            service.responseData = this.$utils.parseJSON(service.responseData, [])
            service.webserviceSetting = this.$utils.parseJSON(service.webserviceSetting, {})
            data = service
          } else {
            data = response.data
          }
          if (this.$utils.isNotEmpty(this.datasets)) { // TODO:可能合并了
            this.datasetData = JSON.parse(JSON.stringify(this.datasets))
          } else {
            this.datasetData = JSON.parse(JSON.stringify(data))
          }
        }).catch((e) => {
        })
      } else {
        this.datasetData = JSON.parse(JSON.stringify(this.datasets))
      }
    }
  }
}
</script>
<style lang="scss">
.setting-field-dialog{
  .el-dialog__body{
  // height: calc(80vh-140px) !important
  }
}
</style>
