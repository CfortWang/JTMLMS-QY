<template>
  <div class="setting-export-container">
    <!-- 扩展属性 -->
    <div class="panel-footer">扩展属性</div>
    <el-form label-position="top" @submit.native.prevent>
      <el-form-item>
        <label slot="label">
          数据标题
          <el-tooltip class="item" effect="light" placement="bottom">
            <div slot="content" style="line-height:1.5;">
              本设置用于自定义对话框顶部数据标题，<br>
              数据标题用于快速辨识一条数据，<br>
              适用于自定义对话框顶部数据标题等功能场景中。
            </div>
            <i class="ibps-icon-help" />：
          </el-tooltip>
        </label>
        <el-button type="primary" @click="settingDataTitle()">设置数据标题</el-button>
      </el-form-item>
      <!-- <el-form-item label="导出字段：">
        <el-button type="primary" @click="setExportField">设置导出字段</el-button>
      </el-form-item> -->
    </el-form>
    <data-title
      :visible="dataTitleDialogVisible"
      :data="attrs.data_title"
      :fields="fields"
      @callback="handleDataTitle"
      @close="(visible)=>dataTitleDialogVisible=visible"
    />
    <export-column
      :visible="exportFieldDialogVisible"
      :data="data"
      @callback="handleExportColumn"
      @close="(visible)=>exportFieldDialogVisible=visible"
    />
  </div>
</template>

<script>
import DataTitle from './data-title'
import ExportColumn from './export-column'

export default {
  components: {
    DataTitle,
    ExportColumn
  },
  props: {
    data: {
      type: Object
    },
    fields: { // 字段
      type: [Array, Object],
      default: () => []
    }
  },
  data() {
    return {
      dataTitleDialogVisible: false,
      exportFieldDialogVisible: false,
      attrs: {}
    }
  },
  watch: {
    'data.attrs': {
      handler: function(val, oldVal) {
        this.attrs = val || {}
      },
      immediate: true
    }
  },
  methods: {
    // 设置数据标题
    settingDataTitle() {
      this.dataTitleDialogVisible = true
    },
    handleDataTitle(data) {
      this.handleData('data_title', data)
    },
    handleExportColumn(data) {
      this.handleData('export_columns', data)
    },
    handleData(key, value) {
      this.$emit('input', key, value)
    },
    setExportField() {
      this.exportFieldDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
.setting-export-container {
  .el-form {
    margin: 10px 0 0 20px;
  }
  .el-form-item__label {
    line-height: 14px;
  }
  .el-button {
    width: 100%;
  }
}
</style>
