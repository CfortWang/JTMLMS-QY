<template>
  <div>
    <div class="panel panel-default template-compose-container">
      <div class="panel-heading">{{ cloumType==='composeTree'?'组合-树形':'组合-列表' }}</div>
      <div class="panel-body">
        <el-form :model="data.attrs" label-position="top" @submit.native.prevent>
          <el-form-item :label="cloumType==='composeTree'?'树形数据模板':'列表数据模板'">
            <label slot="label" round>
              {{ cloumType==='composeTree'?'树形数据模板':'列表数据模板' }}
              <el-button type="primary" :disabled="disabled" size="mini" @click="templateSettings">模板设置</el-button>
            </label>
            <selector
              v-model="data.attrs.bind_template_key"
              value-key="key"
              :bo-code="boCode"
              :type="cloumType==='composeTree'?'tree':'list'"
              :toolbar="formToolbar"
              @change="handlerInput"
            />
          </el-form-item>
          <el-form-item label="关联字段：">
            <el-select v-model="data.attrs.ref_field_name" filterable placeholder="请选择" style="width:100%;" @change="handleSelect" @focus="handlerFocus">
              <el-option
                v-for="item in refFieldOptions"
                :key="item.id"
                :label="item.comment"
                :value="item.comment"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template-builder
      :id="templateId"
      :visible="formbuilderDialogVisible"
      compose-confirm
      @close="visible => formbuilderDialogVisible = visible"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { getByKey } from '@/api/platform/data/dataTemplate'
import { findColumnList } from '@/api/platform/data/dataset'
import Selector from '@/business/platform/data/dataTemplate/selector'
Vue.component('template-builder', () => import('@/business/platform/data/templatebuilder/dialog'))
export default {
  components: {
    Selector
  },
  props: {
    cloumType: {
      type: String,
      default: 'composeTree'
    },
    boCode: {
      type: String,
      default: 'bocode'
    },
    dataTemplate: {
      type: [Object, Array],
      default: () => {}
    },
    data: {
      type: Object
    },
    datasetType: {
      type: String,
      default: 'table'
    },
    formKey: String
  },
  data() {
    return {
      refFieldOptions: [],
      formbuilderDialogVisible: false,
      templateId: '',
      disabled: false,
      templateData: {}
    }
  },
  computed: {
    // 工具栏
    formToolbar() {
      const toolbar = [{
        key: 'rechoose',
        type: 'primary',
        label: '重选'
      }, {
        key: 'remove',
        type: 'danger',
        label: '删除'
      }]
      return toolbar
    }
  },
  watch: {
    cloumType: {
      handler: function(val, OldVal) {
        if (this.$utils.isNotEmpty(this.data.attrs.bind_template_key)) {
          this.templateId = ''
          this.getDataInfo(this.data.attrs.bind_template_key)
        }
      },
      immediate: true
    }
  },
  methods: {
    loadAll(templateKey) {
      findColumnList({
        datasetKey: '',
        templateKey: templateKey
      }).then(res => {
        this.refFieldOptions = res.data
      })
    },
    handlerInput(data) {
      this.data.attrs.bind_template_name = data.name
      this.templateId = data.id
      this.$emit('update', this.data)
      this.data.attrs.ref_field_name = ''
      this.data.attrs.ref_field = ''
      if (this.$utils.isNotEmpty(this.data.attrs.bind_template_key)) {
        this.loadAll(this.data.attrs.bind_template_key)
      }
    },
    handlerFocus() {
      if (this.data.attrs.bind_template_key !== '') {
        this.loadAll(this.data.attrs.bind_template_key)
      }
    },
    handleSelect(item) {
      const index = this.refFieldOptions.findIndex(r => r.comment === item)
      this.data.attrs.ref_field = this.refFieldOptions[index].id
      this.$emit('update', this.data)
    },
    templateSettings() {
      if (this.$utils.isEmpty(this.data.attrs.bind_template_key)) {
        this.$message({
          message: '请绑定数据模板后在操作',
          type: 'warning'
        })
        return
      }
      this.formbuilderDialogVisible = true
    },
    getDataInfo(key) {
      this.disabled = true
      getByKey({
        dataTemplateKey: key
      }).then(response => {
        const data = JSON.parse(response.data)
        this.templateId = data.id
        this.disabled = false
      }).catch(() => {
        this.disabled = false
      })
    }
  }
}
</script>
<style lang="scss">
.template-compose-container {
  .el-form-item__label {
    padding-bottom:0;
  }
  .el-autocomplete {
    width:100%;
  }
}
</style>
