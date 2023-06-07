/* eslint-disable no-new-func */
<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span>链接设置</span>
    </div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">文本<help-tip prop="hyperlinkText" /></template>
        <el-select
          v-model="fieldOptions.textType"
          style="width:100%;"
          @change="changeTextValueType"
        >
          <el-option
            v-for="item in textValueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div v-if="fieldOptions.textType === 'fixed'" style="padding-top: 5px;">
          <el-input v-model="fieldOptions.text" clearable />
        </div>
        <div v-else style="padding-top: 5px;">
          <el-button type="primary" plain style="width:100%;" @click="handleTextValue">{{ fieldOptions.textType | optionsFilter(textValueOptions) }}</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">显示类型</template>
        <el-select v-model="fieldOptions.showType" style="width:100%;">
          <el-option v-for="item in showTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">显示样式</template>
        <el-select v-model="fieldOptions.type" style="width:100%;">
          <el-option value="default" label="默认" />
          <el-option value="primary" label="主要" />
          <el-option value="success" label="成功" />
          <el-option value="info" label="信息" />
          <el-option value="warning" label="警告" />
          <el-option value="danger" label="危险" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">图标</template>
        <ibps-icon-select v-model="fieldOptions.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item>
        <template slot="label">事件脚本类型<help-tip prop="hyperlinkScriptType" /></template>
        <el-select v-model="fieldOptions.linkType" style="width:100%;" @change="changeLinkValueType">
          <el-option v-for="item in defauleValueOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-if="fieldOptions.linkType === 'fixed'" style="padding-top: 5px;">
          <el-input v-model="fieldOptions.link" type="textarea" autosize clearable />
        </div>
        <div v-else style="padding-top: 5px;">
          <el-button type="primary" plain style="width:100%;" @click="handleDefaultValue">{{ fieldOptions.linkType | optionsFilter(defauleValueTypeOptions) }}</el-button>
        </div>
      </el-form-item>

    </div>
    <!-- 事件脚本类型-动态脚本 -->
    <dynamic-script
      :visible="dynamicScriptVisible"
      :label="fieldItem.label"
      :bo-data="boData"
      :data="evenDialogData"
      type="hyperlink"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptVisible = visible"
    />
    <!-- 事件脚本类型-JS脚本 -->
    <javascript-script
      :visible="javascriptScriptVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="evenDialogData"
      :show-type="fieldOptions.showType"
      @callback="setDefaultValue"
      @close="visible => javascriptScriptVisible = visible"
    />
    <!-- 文本展示-动态脚本 -->
    <dynamic-script
      :visible="dynamicScriptTextVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="textDialogData"
      type="hyperlink"
      @callback="setDefaultValue"
      @close="visible => dynamicScriptTextVisible = visible"
    />
    <!-- 文本展示-JS脚本 -->
    <javascript-script
      :visible="javascriptScriptTextVisible"
      :name="fieldItem.label"
      :bo-data="boData"
      :data="textDialogData"
      @callback="setDefaultTextValue"
      @close="visible => javascriptScriptTextVisible = visible"
    />
  </div>
</template>
<script>
import { defauleValueTypeOptions } from '@/business/platform/form/constants/fieldOptions'
import DynamicScript from '../components/dynamic-script'
import JavascriptScript from '../components/javascript-script'
import EditorMixin from '../mixins/editor'

export default {
  components: {
    DynamicScript,
    JavascriptScript
  },
  mixins: [EditorMixin],
  props: {
    boData: {
      type: Array
    },
    defaultValueTypes: { // 默认值类型
      type: String,
      default: 'dynamic,javascript'
    },
    linkValueTypes: { //  showType
      type: String,
      default: 'fixed,javascript,dynamic'
    }
  },
  data() {
    return {
      defauleValueTypeOptions: defauleValueTypeOptions,
      showTypeOptions: [{
        value: 'link',
        label: '嵌入'
      }, {
        value: 'button',
        label: '按钮'
      }],
      dynamicScriptVisible: false,
      dynamicScriptTextVisible: false,
      isLinkButtonClick: false,
      javascriptScriptVisible: false,
      javascriptScriptTextVisible: false,
      tDialogData: this.fieldItem.field_options.text_javascript,
      eDialogData: this.fieldItem.field_options.link
    }
  },
  computed: {
    defauleValueOptions() {
      const options = []
      defauleValueTypeOptions.forEach((type) => {
        if (this.defaultValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    textValueOptions() {
      const options = []
      defauleValueTypeOptions.forEach((type) => {
        if (this.linkValueTypes.includes(type.value)) {
          options.push(type)
        }
      })
      return options
    },
    textDialogData: {
      get() {
        return this.tDialogData
      },
      set(value) {
        this.tDialogData = value
      }
    },
    evenDialogData: {
      get() {
        return this.eDialogData
      },
      set(value) {
        this.eDialogData = value
      }
    }
  },
  methods: {
    /**
     * 设置默认值
     */
    setDefaultValue(data) {
      const key = this.isLinkButtonClick ? 'link' : 'text_javascript'
      this.fieldItem.field_options[key] = data
      // this.fieldItem.field_options.link = data
    },
    setDefaultTextValue(data) {
      let value = ''
      try {
        value = new Function(data + ';')()
      } catch (e) {
        value = ''
      }
      this.fieldItem.field_options.text = value
      this.fieldItem.field_options.text_javascript = data
    },
    /**
     * 改变默认值
     */
    changeLinkValueType(type) {
      this.fieldOptions.linkType = type
      this.evenDialogData = ''
      // if (this.fieldOptions.link) { this.fieldOptions.link = null }
    },
    changeTextValueType(type) {
      this.fieldOptions.textType = type
      this.textDialogData = ''
      // if (this.fieldOptions.text) { this.fieldOptions.text = null }
    },
    // 事件脚本类型
    handleDefaultValue() {
      this.isLinkButtonClick = true
      switch (this.fieldOptions.linkType) {
        // case 'fixed':// 固定值
        //   this.fixedVisible = true
        //   break
        case 'dynamic': // Groovy脚本
          this.dynamicScriptVisible = true
          break
        case 'javascript': // javascript脚本
          this.javascriptScriptVisible = true
          break
        default:
          break
      }
    },
    // 文本展示类型
    handleTextValue() {
      this.isLinkButtonClick = false
      switch (this.fieldOptions.textType) {
        case 'fixed':// 固定值
          this.fixedVisible = true
          break
        case 'dynamic': // Groovy脚本
          this.dynamicScriptTextVisible = true
          break
        case 'javascript': // javascript脚本
          this.javascriptScriptTextVisible = true
          break
        default:
          break
      }
    }
  }
}
</script>
