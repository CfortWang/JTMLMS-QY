<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="设置字段控件"
    width="60%"
    top="2vh"
    append-to-body
    class="setting-field-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div>
      <el-form label-width="200px" @submit.native.prevent>
        <h2 class="ibps-page-header-title ibps-mt-20">输入参数</h2>
        <el-form-item label="输入参数处理方式：">
          <el-select v-model="formData.requestMode" placeholder="">
            <el-option
              v-for="item in requestModeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <template slot="label">输入参数数据处理：
            <ibps-help :content="`queryParams:查询参数,pageParams:分页参数，sortParams:排序参数` " />
          </template>
          <el-input
            v-model="formData.requestValue"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10}"
          />
        </el-form-item> -->
        <!--输出参数-->
        <h2 class="ibps-page-header-title ibps-mt-20">输出参数</h2>
        <el-form-item label="输出参数处理方式：">
          <el-select v-model="formData.responseMode" placeholder="">
            <el-option
              v-for="item in responseModeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="输出参数数据处理：">
          <el-input
            v-model="formData.responseValue"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10}"
          />
        </el-form-item>
      </el-form>
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
// import IbpsTreeSelect from '@/components/ibps-tree-select'
export default {
  // components: {
  //   IbpsTreeSelect
  // },
  props: {
    visible: Boolean,
    type: {
      type: String,
      default: 'default'
    },
    datasets: [Array, Object, String]
  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        requestMode: 'default',
        responseMode: 'default'
      },
      requestModeOptions: [{
        value: 'default',
        label: '默认方式'
      }, {
        value: 'script',
        label: 'js脚本'
      }],
      responseModeOptions: [{
        value: 'default',
        label: '默认方式'
      }, {
        value: 'script',
        label: 'Groovy脚本'
      }]
    }
  },
  computed: {
    toolbars() {
      if (this.type === 'default') {
        return [
          { key: 'confirm' },
          { key: 'cancel' }
        ]
      } else {
        return [
          { key: 'next', icon: 'ibps-icon-arrow-circle-right', label: '下一步' },
          { key: 'cancel' }
        ]
      }
    },
    datasetData() {
      return []
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
        case 'next':
        case 'confirm':
          this.saveData()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    saveData() {
      const data = this.$refs.dataset.getData()
      if (this.$utils.isEmpty(data)) {
        return
      }
      this.$emit('callback', data)
      this.closeDialog()
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    // 获取数据
    getFormData() {

    }
  }
}
</script>
