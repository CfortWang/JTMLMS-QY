<template>
  <div class="form-property">
    <el-form
      ref="formDef"
      :model="formDef"
      :rules="rules"
      size="mini"
      label-width="80px"
      @submit.native.prevent
    >
      <div class="panel panel-default">
        <div class="panel-heading">表单属性</div>
        <div class="panel-body">
          <el-form-item label="表单标题" prop="name">
            <el-input
              v-model="formDef.name"
              v-pinyin="{vm:formDef}"
              placeholder="请输入表单标题"
              :maxlength="64"
            />
          </el-form-item>
          <el-form-item label="表单key" prop="key">
            <el-input v-model="formDef.key" placeholder="请输入表单key" :disabled="$utils.isNotEmpty(id)" :maxlength="64" />
          </el-form-item>
          <el-form-item label="表单分类">
            <ibps-type-select
              v-model="formDef.typeId"
              category-key="FORM_TYPE"
              placeholder="请选择表单分类"
              clearable
            />
          </el-form-item>
          <el-form-item label="表单描述">
            <el-input
              v-model="formDef.desc"
              type="textarea"
              placeholder="请输入表单描述"
              :maxlength="512"
            />
          </el-form-item>
        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">表单提交校验<help-tip prop="formVerify" /></div>
        <div class="panel-body">
          <el-table
            v-if="formVerifyList && formVerifyList.length >0"
            :data="formVerifyList"
            :show-header="false"
            size="small"
            style=" border: 1px solid #ebeef5;"
          >
            <el-table-column prop="show" />
            <el-table-column
              width="80"
            >
              <template slot-scope="{ $index}">
                <el-button type="text" icon="ibps-icon-remove" size="small" @click="removeFormVerify($index)" />
                <el-button type="text" icon="ibps-icon-edit" size="small" @click="editFormVerify($index)" />
              </template>
            </el-table-column>
          </el-table>
          <div style="padding-top: 5px;">
            <el-button style="width:100%;" type="primary" icon="ibps-icon-plus-square" @click="editFormVerify()">添加校验条件</el-button>
          </div>
        </div>
      </div>
      <!-- <div class="panel panel-default">
        <div class="panel-heading">表单规则<help-tip prop="formRule" /></div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" @click="editFormRule()">设置表单规则</el-button>
        </div>
      </div> -->
      <div class="panel panel-default">
        <div class="panel-heading">表单脚本<help-tip prop="formScript" /></div>
        <div class="panel-body">
          <el-button style="width:100%;" type="primary" icon="ibps-icon-file-code-o" @click="editFormScript()">表单脚本</el-button>
          <p>&nbsp;</p>
          <el-button style="width:100%;" icon="ibps-icon-file-code-o" @click="editFormScript('mobile')">移动端表单脚本</el-button>

        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">表单配置</div>
        <div class="panel-body">
          <el-form-item label="标签宽度">
            <el-row>
              <el-col :span="12">
                <el-input-number
                  v-model="formDef.attrs.labelWidth"
                  :min="formDef.attrs.labelWidthUnit==='px'?50:10"
                  :max="formDef.attrs.labelWidthUnit==='px'?500:100"
                  :step="1"
                  style="width: 100%;"
                />
              </el-col>
              <el-col :span="11">
                <el-select v-model="formDef.attrs.labelWidthUnit" style="width: 100%;" @change="changeLabelWidthUnit">
                  <el-option label="像素(px)" value="px" />
                  <el-option label="百分比(%)" value="%" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formDef.attrs.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="尺寸">
            <el-select v-model="formDef.attrs.size" style="width:100%;">
              <el-option label="默认" value="" />
              <el-option label="中" value="medium" />
              <el-option label="小" value="small" />
              <el-option label="迷你" value="mini" />
            </el-select>
          </el-form-item>
          <el-form-item label="验证图标">
            <el-switch v-model="formDef.attrs.statusIcon" />
          </el-form-item>
          <el-form-item label="自定义Class" label-width="110px">
            <el-input v-model="formDef.attrs.customClass" />
          </el-form-item>
          <el-form-item label-width="145px">
            <template slot="label">标签的后缀<help-tip prop="formSuffix" /></template>
            <el-switch v-model="formDef.attrs.colon" @change="changeColon" />
            <el-input
              v-if="formDef.attrs.colon"
              v-model="labelSuf"
              placeholder="标签文本的后缀"
            />
          </el-form-item>
          <el-form-item label-width="145px">
            <template slot="label">隐藏必填的星号<help-tip prop="formAsterisk" /></template>
            <el-switch v-model="formDef.attrs.hideRequiredAsterisk" />
          </el-form-item>
          <el-form-item label-width="145px" label="">
            <template slot="label">标签描述位置<help-tip prop="descPosition" /></template>
            <el-radio-group v-model="formDef.attrs.descPosition">
              <el-radio-button label="lableIcon">标签图标</el-radio-button>
              <el-radio-button label="inline">底部一行</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文本只读显示样式" label-width="125px">
            <el-select v-model="formDef.attrs.read_style" style="width:100%;">
              <el-option label="文本展示" value="text" />
              <el-option label="原样展示" value="original" />
            </el-select>
          </el-form-item>

          <el-form-item label="水印设置" label-width="125px">
            <el-switch v-model="formDef.attrs.watermark" />
            <el-input
              v-if="formDef.attrs.watermark"
              v-model="formDef.attrs.watermarkText"
              placeholder="水印文本"
            />
          </el-form-item>

        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">移动端表单配置
          &nbsp;<el-tooltip content="跟PC端一致" placement="bottom">
            <el-switch v-model="isSame" @change="changeSame" />
          </el-tooltip>
        </div>
        <div v-if="!isSame" class="panel-body">
          <el-form-item label="标签宽度">
            <el-row>
              <el-col :span="12">
                <el-input-number
                  v-model="formDef.attrs.mobileLabelWidth"
                  :min="formDef.attrs.mobileLabelWidthUnit==='px'?50:10"
                  :max="formDef.attrs.mobileLabelWidthUnit==='px'?500:100"
                  :step="1"
                  style="width: 100%;"
                />
              </el-col>
              <el-col :span="11">
                <el-select v-model="formDef.attrs.mobileLabelWidthUnit" style="width: 100%;" @change="changeMobileLabelWidthUnit">
                  <el-option label="像素(px)" value="px" />
                  <el-option label="百分比(%)" value="%" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="标签对齐">
            <el-radio-group v-model="formDef.attrs.mobileLabelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="top">顶部对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="输入框对齐方式">
            <el-radio-group v-model="formDef.attrs.mobileInputAlign">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="center">居中对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>

        </div>
      </div>

      <!-- <div class="panel panel-default">
        <div class="panel-heading">提交设置<help-tip prop="formSubmit" /></div>
        <div class="panel-body">
          <el-form-item label="开启后端验证" label-width="125px">
            <el-switch v-model="formDef.attrs.validated" />
          </el-form-item>
          <el-form-item label="开启提交冲突提示" label-width="125px">
            <el-switch v-model="formDef.attrs.conflict" />
          </el-form-item>
        </div>
      </div> -->

      <div class="panel panel-default">
        <div class="panel-heading">其他设置</div>
        <div class="panel-body">
          <el-form-item label="隐藏表单标题" label-width="125px">
            <el-switch v-model="formDef.attrs.hide_name" />
          </el-form-item>
          <el-form-item v-if="!formDef.attrs.hide_name" label="表单标题对齐" label-width="125px">
            <el-radio-group v-model="formDef.attrs.title_position">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="!formDef.attrs.hide_name" label="隐藏表单描述" label-width="125px">
            <el-switch v-model="formDef.attrs.hide_desc" />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <formula-edit
      :visible="formulaEditVisible"
      :title="'表单校验'"
      :bo-data="boData"
      :data="formVerify"
      verify
      @callback="handlerFormVerify"
      @close="visible => formulaEditVisible = visible"
    />

    <form-script
      :visible="formScriptVisible"
      :title="formScriptTitle"
      :bo-data="boData"
      :data="formScript"
      @callback="handlerFormScript"
      @close="visible => formScriptVisible = visible"
    />
  </div>
</template>
<script>
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import FormulaEdit from '../components/formula-edit'
import FormScript from '../components/form-script'

/**
 * 表单属性
 */
export default {
  name: 'form-property',
  components: {
    IbpsTypeSelect,
    FormulaEdit,
    FormScript
  },
  props: {
    data: {
      type: Object
    },
    id: String,
    boData: {
      type: Array
    }
  },
  data() {
    return {
      formulaEditVisible: false,
      index: -1,
      formVerify: '',
      formScriptVisible: false,
      formType: 'pc',
      formScriptTitle: '表单脚本',
      formDef: {
        name: '',
        key: '',
        typeId: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        key: [{ required: true, message: this.$t('validate.required') }]
      },
      same: this.formDef && this.formDef.attrs ? this.$utils.toBoolean(this.formDef.attrs.same, true) : true,
      labelSuf: this.formDef && this.formDef.attrs ? this.formDef.attrs.labelSuffix || '' : ':'
    }
  },
  computed: {
    formVerifyList() {
      return this.formDef.attrs.verifys || []
    },
    formScript() {
      return this.formType === 'mobile' ? this.formDef.attrs.mobile_script || '' : this.formDef.attrs.script || ''
    },
    isSame: {
      get() {
        return this.$utils.toBoolean(this.same, true)
      },
      set(val) {
        this.same = val
        this.$set(this.formDef.attrs, 'same', this.isSame)
      }
    },
    labelSuffix: {
      get() {
        return this.labelSuf
      },
      set(val) {
        this.labelSuf = val
        this.$set(this.formDef.attrs, 'labelSuffix', val)
      }
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.formDef = this.data
      },
      immediate: true,
      deep: true
    },
    formDef: {
      handler: function(val, oldVal) {
        this.$emit('update', val)
      },
      deep: true
    },
    same: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.formDef.attrs.same)) {
          this.isSame = true
          this.$set(this.formDef.attrs, 'same', this.isSame)
        } else {
          if (val !== oldVal) {
            this.isSame = val
            this.$set(this.formDef.attrs, 'same', this.isSame)
          }
        }
      },
      immediate: true
    },
    labelSuf: {
      handler(val, oldVal) {
        if (this.$utils.isEmpty(this.formDef.attrs.labelSuffix)) {
          this.labelSuf = val
          this.$set(this.formDef.attrs, 'labelSuffix', this.labelSuf)
        } else {
          if (val !== oldVal) {
            this.labelSuf = val
            this.$set(this.formDef.attrs, 'labelSuffix', this.labelSuf)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    changeLabelWidthUnit(value) {
      this.formDef.attrs.labelWidth = value === 'px' ? 100 : 20
    },
    changeColon(value) {
      this.formDef.attrs.labelSuffix = value ? ':' : ''
      this.labelSuf = this.formDef.attrs.labelSuffix
    },
    changeSame(value) {
      if (!value) {
        this.formDef.attrs = Object.assign({}, this.formDef.attrs, {
          mobileLabelWidth: 100,
          mobileLabelWidthUnit: 'px',
          mobileLabelPosition: 'left',
          mobileInputAlign: 'right'
        })
      }
    },
    changeMobileLabelWidthUnit(value) {
      this.formDef.attrs.mobileLabelWidth = value === 'px' ? 100 : 20
    },

    // 添加、编辑
    editFormVerify(index = -1) {
      this.index = index
      this.formulaEditVisible = true
      this.formVerify = this.formVerifyList[index]
    },
    // 删除表单校验条件
    removeFormVerify(index) {
      this.formDef.attrs.verifys.splice(index, 1)
    },
    handlerFormVerify(data) {
      if (this.index > -1) {
        this.formDef.attrs.verifys.splice(this.index, 1, data)
      } else {
        this.formDef.attrs.verifys.push(data)
      }
    },
    /**
     * 表单规则
     */
    editFormRule() {

    },
    /**
     * 表单脚本
     */
    editFormScript(formType = 'pc') {
      this.formType = formType
      this.formScriptTitle = formType === 'mobile' ? '移动端表单脚本' : '表单脚本'
      this.formScriptVisible = true
    },
    handlerFormScript(value) {
      if (this.formType === 'mobile') {
        this.$set(this.formDef.attrs, 'mobile_script', value)
      } else {
        this.$set(this.formDef.attrs, 'script', value)
      }
    },

    handleInput(key, val) {
      this.$set(this.formDef, key, val)
      this.$emit('update', JSON.parse(JSON.stringify(this.formDef)))
    },
    editWatermark() {

    }
  }
}
</script>
