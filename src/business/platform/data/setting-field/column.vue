<template>
  <div class="setting-field-fieldset">
    <ibps-layout ref="layout">
      <div slot="west">
        <div :style="{ width:`${width}px`,height:`${height}px`}" class="left-aside">
          <el-header :height="'30px'" class="layout-header">
            <div class="layout-header-title">
              数据集
            </div>
          </el-header>
          <el-scrollbar
            :style="{ height:`${height-35}px`}"
            style="width:100%;"
            wrap-class="sidebar-wrapper ibps-scrollbar-wrapper"
          >
            <ibps-tree
              :data="datesetTreeData"
              :options="treeOptions"
              :width="width"
              :height="height"
              :toolbars="false"
              :contextmenus="treeContextmenus"
              @node-click="handleClick"
            />
          </el-scrollbar>
        </div>
      </div>
      <div>
        <el-header :height="'30px'" class="layout-header">
          <div class="layout-header-title">
            字段设置
          </div>
        </el-header>
        <el-form v-if="$utils.isNotEmpty(formData)" :model="formData" label-width="120px" class="ibps-p-5" @submit.native.prevent>
          <el-form-item label="显示名:" prop="label">
            <el-input v-model="formData.label" />
          </el-form-item>

          <el-form-item v-if="formData.attrType !== 'table'" label="控件类型:" prop="field_type">
            <el-select v-model="formData.field_type" style="width:100%">
              <el-option
                v-for="item in fieldTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <!-- 枚举值格式 -->
          <el-form-item v-if="formData.field_type === 'radio' ||formData.field_type === 'checkbox' ||formData.field_type === 'select'" label-width="0" prop="options">
            <field-options v-model="formData.field_options.options" />
          </el-form-item>
          <!-- 日期格式 -->
          <el-form-item v-if="formData.field_type === 'datePicker'" label="日期格式" prop="datefmt_type">
            <el-select v-model="formData.field_options.datefmt_type" style="width:100%">
              <el-option
                v-for="(item,index) in datefmtTypeOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <el-input
              v-if="formData.field_options.datefmt_type ==='custom'"
              v-model="formData.field_options.datefmt"
            />
          </el-form-item>
          <!-- 数据字典 -->
          <el-form-item v-if="formData.field_type === 'dictionary'" label="数据字典" prop="dictionary">
            <ibps-type-select
              v-model="formData.field_options.dictionary"
              category-key="DIC_TYPE"
              node-key="typeKey"
              clearable
            />
          </el-form-item>
          <!-- 选择器 -->
          <template v-if="formData.field_type === 'selector'" prop="selector_type">
            <el-form-item label="选择器类型">
              <el-select v-model="formData.field_options.selector_type" style="width:100%">
                <el-option
                  v-for="item in selectorTypeOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="存储格式" prop="store">
              <el-select v-model="formData.field_options.store" style="width:100%">
                <el-option
                  v-for="item in selectorStoreOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>

          <!-- 自定义对话框 -->
          <template v-if="formData.field_type === 'customDialog'">
            <el-form-item>
              <template slot="label">自定义对话框</template>
              <ibps-data-template-selector2
                v-model="formData.field_options.dialog"
                type="dialog"
                placeholder="请选择自定义对话框"
              />
            </el-form-item>
            <el-form-item>
              <template slot="label">是否多选</template>
              <el-switch
                v-model="formData.field_options.multiple"
                active-value="Y"
                inactive-value="N"
              />
            </el-form-item>
            <el-form-item>
              <template slot="label">存储格式</template>
              <el-select v-model="formData.field_options.store" style="width:100%;">
                <el-option
                  v-for="item in dialogStoreOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <div v-else>
          <el-alert
            title="没有选择字段,请选择左侧的树的字段"
            type="warning"
          />
        </div>
      </div>
    </ibps-layout>
  </div>
</template>
<script>
import TreeUtils from '@/utils/tree'
import SettingField from '../constants/setting-field'
import { datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions } from '@/business/platform/form/constants/fieldOptions'

import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'

export default {
  components: {
    FieldOptions,
    IbpsTypeSelect,
    IbpsDataTemplateSelector2
  },
  props: {
    datasets: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      width: 220,
      height: 450,
      datasetData: [],
      formData: null,
      treeOptions: {
        showIcon: true,
        props: {
          children: 'children',
          label: 'label'
        }
      },
      treeContextmenus: [
        { icon: 'setting', label: '设置字段控件', value: 'setting'
          // rights: function(menu, data, isRoot) {
          //   return data.parentId === '0'
          // }
        }
      ],
      defaultForm: {
        label: '',
        field_options: {}
      },
      fieldTypeOptions: SettingField.FIELD_TYPE,
      datefmtTypeOptions,
      selectorTypeOptions,
      selectorStoreOptions,
      dialogStoreOptions
    }
  },
  computed: {
    datesetTreeData() {
      const data = JSON.parse(JSON.stringify(this.datasets))
      const treeData = TreeUtils.transformToTreeFormat(data, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
      return treeData
    }
  },
  watch: {
    formData(val, oldVal) {
      if (val !== oldVal && this.$utils.isNotEmpty(val)) {
        const index = this.datasetData.findIndex((data) => {
          return data.name === val.name
        })
        this.datasetData.splice(index, 1, val)
      }
    },
    datasets(val) {
      this.datasetData = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    handleClick(val) {
      const data = JSON.parse(JSON.stringify(val))
      if (data.attrType === 'column' && this.$utils.isEmpty(data.field_type)) {
        data.field_type = 'text'
        data.field_options = {}
      }
      this.formData = data
    },
    getData() {
      // TODO:必填验证
      return this.datasetData
    }
  }
}

</script>
<style lang="scss">
 .setting-field-fieldset{
  .left-aside {
    border-right: 1px solid #E4E7ED;
  }
   .layout-header {
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
      font-weight: bold;
      text-align: center;
      padding: 6px;
      position: relative;
      overflow: hidden;
  }
 }

</style>
