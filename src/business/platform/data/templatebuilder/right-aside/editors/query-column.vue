<template>
    <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="120px"
        size="mini"
        class="template-query-column"
        @submit.native.prevent
    >

        <el-form-item label="显示名称" prop="label">
            <el-input v-model="formData.label" placeholder="显示名称" />
        </el-form-item>

        <template v-if="datasetType === 'thirdparty'">
            <!-- <el-form-item label="参数类型">
        <el-select v-model="formData.paramType" placeholder="">
          <el-option
            v-for="item in paramTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <template v-if="formData.paramType ==='arrayObject'">
        <el-form-item label="绑定参数根">
          <ibps-tree-select
            v-model="formData.paramRoot"
            :data="datasetData"
            :props="{
              children: 'children',
              label: 'name'
            }"
            display-mode="path"
            node-key="name"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="绑定参数key">
          <el-input v-model="formData.paramKey" placeholder="绑定参数key" />
        </el-form-item>
        <el-form-item label="绑定参数key值">
          <el-input v-model="formData.paramValue" placeholder="绑定参数key值" />
        </el-form-item>
      </template> -->
            <el-form-item label="标识（name）" prop="name">
                <el-input v-model="formData.name" placeholder="标识（name）" />
            </el-form-item>
        </template>

        <el-form-item label="权限">
            <rights-selector v-model="formData.rights" />
        </el-form-item>
        <el-form-item label="是否常用条件">
            <el-switch v-model="formData.common" active-value="Y" inactive-value="N" />
        </el-form-item>
        <el-form-item label="跟字段控件一致">
            <el-switch v-model="formData.same" active-value="Y" inactive-value="N" />
        </el-form-item>
        <el-form-item label="默认值">
            <el-input v-model="formData.default_value" placeholder="默认值" />
        </el-form-item>
        <!--控件类型-->
        <template v-if="formData.same === 'N'">
            <el-form-item label="控件类型">
                <el-select v-model="formData.field_type" @change="changeFieldType">
                    <el-option
                        v-for="item in queryFieldTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <!-- 枚举值格式 -->
            <el-form-item v-if="formData.field_type === 'radio' ||formData.field_type === 'checkbox' ||formData.field_type === 'select'" label-width="0" prop="options">
                <field-options v-model="formData.field_options.options" />
            </el-form-item>
            <!-- 日期格式 -->
            <el-form-item v-if="formData.field_type === 'datePicker' || formData.field_type === 'dateRange'" label="日期格式" prop="datefmt_type">
                <el-select v-model="formData.field_options.datefmt_type">
                    <el-option
                        v-for="(item,index) in datefmtTypeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
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
                    <el-select v-model="formData.field_options.selector_type">
                        <el-option
                            v-for="item in selectorTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="存储格式" prop="store">
                    <el-select v-model="formData.field_options.store">
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
            <!-- end -->
            <template v-if="formData.field_type === 'linkdata'">
                <el-form-item>
                    <template slot="label">关联数据</template>
                    <ibps-data-template-selector2
                        v-model="formData.field_options.linkdata"
                        placeholder="请选择关联数据"
                        type="valueSource"
                    />
                </el-form-item>

                <el-form-item>
                    <div slot="label">关联配置</div>
                    <div class="el-form-item__content">
                        <el-button
                            :disabled="disabledResultColumns"
                            style="width:100%;"
                            type="primary"
                            size="mini"
                            plain
                            @click="settingDataTemplateConfig('linkdata')"
                        >设置关联配置</el-button>
                    </div>
                </el-form-item>
            </template>

        </template>
    </el-form>
</template>
<script>
import RightsSelector from '@/business/platform/rights/config/selector'
import { queryFieldTypeOptions } from '../constants/editor-column'
import { datefmtTypeOptions, selectorTypeOptions, selectorStoreOptions, dialogStoreOptions } from '@/business/platform/form/constants/fieldOptions'
import FieldTypeMixin from '../mixins/field-type'
// import IbpsTreeSelect from '@/components/ibps-tree-select'
import FieldOptions from '@/business/platform/data/components/field/options'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsDataTemplateSelector2 from '@/business/platform/data/dataTemplate/selector2'
import Utils from '../../utils'

export default {
    components: {
        RightsSelector,
        FieldOptions,
        IbpsTypeSelect,
        IbpsDataTemplateSelector2
    // IbpsTreeSelect
    },
    mixins: [FieldTypeMixin],
    props: {
        data: {
            type: Object
        },
        datasetType: {
            type: String,
            default: 'table'
        },
        fields: {
            type: [Object, Array]
        }
    },
    data () {
        return {
            queryFieldTypeOptions,
            datefmtTypeOptions,
            selectorTypeOptions,
            selectorStoreOptions,
            dialogStoreOptions,

            paramTypeOptions: [{
                value: 'base',
                label: '基本参数'
            }, {
                value: 'object',
                label: '对象参数'
            }, {
                value: 'arrayObject',
                label: '数组对象'
            }],
            formName: 'form',
            formData: {
                name: '',
                label: '',
                rights: [{ type: 'all' }],
                common: 'Y',
                same: 'Y',
                field_type: 'text',
                default_value: ''
            },
            rules: {
                name: [{ required: true, message: this.$t('validate.required') }],
                label: [{ required: true, message: this.$t('validate.required') }]
            }
        }
    },
    computed: {
        datasetData () {
            return Utils.getFieldsByType(this.fields, 'query')
        }
    },
    watch: {
        data: {
            handler (val) {
                this.formData = val
            },
            immediate: true
        }
    },
    methods: {
        // 获取表单数据
        getFormData (callback) {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    callback(this.formData)
                } else {
                    callback()
                }
            })
        }
    }
}
</script>

<style lang="scss">
.template-query-column {
  .el-select {
    width: 100%;
  }
}
</style>
