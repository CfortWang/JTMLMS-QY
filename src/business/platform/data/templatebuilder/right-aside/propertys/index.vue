<template>
    <div class="template-property">
        <el-form
            ref="dataTemplate"
            :model="dataTemplate"
            :rules="rules"
            size="mini"
            label-width="80px"
            @submit.native.prevent
        >
            <div class="panel panel-default">
                <div class="panel-heading">模版属性</div>
                <div class="panel-body">
                    <el-form-item label="模版标题" prop="name">
                        <el-input
                            v-model="dataTemplate.name"
                            v-pinyin="{vm:dataTemplate}"
                            placeholder="模版标题"
                            :maxlength="64"
                            @input="(val)=>handleInput('name',val)"
                        />
                    </el-form-item>
                    <el-form-item label="模版key" prop="key">
                        <el-input
                            v-model="dataTemplate.key"
                            placeholder="模版key"
                            :maxlength="64"
                            @input="(val)=>handleInput('key',val)"
                        />
                    </el-form-item>
                    <el-form-item label="模版分类" prop="typeId">
                        <ibps-type-select
                            v-model="dataTemplate.typeId"
                            category-key="BO_TYPE"
                            clearable
                            filterable
                            filter-label="name"
                            @input="(val)=>handleInput('typeId',val)"
                        />
                    </el-form-item>
                    <el-form-item label="模版类型" prop="type">
                        <el-select
                            v-if="dataTemplate.composeType!=='treeForm'"
                            v-model="dataTemplate.type"
                            style="width:100%;"
                            @change="(val)=>handleInput('type',val)"
                        >
                            <el-option
                                v-for="option in templateTypeOptions"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                            />
                        </el-select>
                        <el-select
                            v-else
                            v-model="dataTemplate.type"
                            style="width:100%;"
                            @change="(val)=>handleInput('type',val)"
                        >
                            <el-option
                                v-for="option in options"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="dataTemplate.type !== 'valueSource'" label="展示形式" prop="showType">
                        <el-select
                            v-model="dataTemplate.showType"
                            style="width:100%;"
                            @change="(val)=>handleInput('showType',val)"
                        >
                            <el-option
                                v-for="option in showTypeOptions"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="dataTemplate.type !== 'valueSource' && dataTemplate.showType === 'compose'" label="组合形式:" prop="composeType">
                        <el-select
                            v-model="dataTemplate.composeType"
                            style="width:100%;"
                            @change="(val)=>handleInput('composeType',val)"
                        >
                            <el-option
                                v-for="option in composeTypeOptions"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="(dataTemplate.showType === 'compose'&&dataTemplate.composeType === 'treeForm')||dataTemplate.showType!== 'compose'" label="数据集" prop="datasetKey">
                        <dataset-selector
                            v-model="dataTemplate.datasetKey"
                            value-key="key"
                            @change="changeDataset"
                        />
                    </el-form-item>
                    <el-form-item v-if="(dataTemplate.showType === 'compose'&&dataTemplate.composeType === 'treeForm')||dataTemplate.showType!== 'compose'" label="唯一字段" prop="unique">
                        <el-select
                            v-if="datasetType!=='thirdparty'"
                            v-model="dataTemplate.unique"
                            style="width:100%;"
                            @change="(val)=>handleInput('unique',val)"
                        >
                            <el-option
                                v-for="field in fields"
                                :key="field.name"
                                :value="field.name"
                                :label="field.label"
                            />
                        </el-select>
                        <el-input v-else v-model="dataTemplate.unique" @input="(val)=>handleInput('typeId',val)" />
                    </el-form-item>
                </div>
            </div>
            <!--接口配置 -->
            <div v-if="datasetType=='thirdparty'" class="panel panel-default">
                <div class="panel-heading">第三方接口数据配置</div>
                <div class="panel-body">
                    <el-button
                        style="width:100%;"
                        type="primary"
                        icon="ibps-icon-file-code-o"
                        @click="thirdpartyConfigDialogVisible=true"
                    >第三方接口数据配置</el-button>
                </div>
            </div>
            <!-- 扩展属性-->
            <div v-if="(dataTemplate.showType === 'compose'&&dataTemplate.composeType === 'treeForm')||dataTemplate.showType!== 'compose'" class="panel panel-default">
                <div class="panel-heading">扩展属性</div>
                <div class="panel-body">
                    <el-form-item v-if="(dataTemplate.showType === 'compose'&&dataTemplate.composeType === 'treeForm')||dataTemplate.showType!== 'compose'" label="绑定表单" prop="form">
                        <form-def-selector
                            v-model="formKey"
                            :data-template-key="dataTemplate.key"
                            :rights-type="rightsType"
                            type="dataTemplate"
                            :is-save="isSave"
                            :value-key="'key'"
                            :toolbar="formToolbar"
                        />
                    </el-form-item>
                    <el-form-item label="打印模版" prop="formPrint">
                        <form-print-selector
                            v-model="dataTemplate.attrs.print_id"
                            :form-key="formKey"
                            @input="(val)=>handleAttrs('print_id',val)"
                        />
                    </el-form-item>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">模版脚本</div>
                <div class="panel-body">
                    <el-button style="width:100%;" type="primary" icon="ibps-icon-file-code-o" @click="editTemplateScript('pc')">模版脚本</el-button>
                    <!-- <el-button style="width:100%;margin:16px 0 0 0;" type="primary" icon="ibps-icon-file-code-o" @click="editTemplateScript('mobile')">移动端模版脚本</el-button> -->
                    <template-script
                        :visible="dialogScriptVisible"
                        :title="scriptTitle"
                        :data="script"
                        :show-type="dataTemplate.showType"
                        @callback="handleDialogScript"
                        @close="visible => dialogScriptVisible = visible"
                    />
                </div>
            </div>
        </el-form>
        <thirdparty-config
            :visible="thirdpartyConfigDialogVisible"
            :datasets="data.datasets"
            :data="dataTemplate.attrs.config"
            @callback="handleThirdpartyConfigSettingField"
            @close="visible => settingFieldDialogVisible = visible"
        />
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { templateTypeOptions, showTypeOptions, composeTypeOptions } from '@/business/platform/data/constants'
import { buildTree } from '@/api/platform/data/dataset'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import DatasetSelector from '@/business/platform/data/dataset/selector'
import FormDefSelector from '@/business/platform/form/form-def/selector'
import FormPrintSelector from '@/business/platform/form/form-print/selector'
import TemplateScript from '../editors/template-script'
import ThirdpartyConfig from '@/business/platform/data/setting-field/thirdparty-config'
import Utils from '../../utils'
import { mapActions } from 'vuex'
/**
 * 表单属性
 */
export default {
    components: {
        IbpsTypeSelect,
        DatasetSelector,
        FormDefSelector,
        FormPrintSelector,
        TemplateScript,
        ThirdpartyConfig
    },
    props: {
        data: {
            type: Object,
            required: true
        },
        datasetType: {
            type: String,
            default: 'table'
        },
        isSave: {
            type: Boolean,
            default: false
        },
        rightsType: {
            type: String,
            default: 'data'
        }
    },
    data () {
        return {
            dialogScriptVisible: false,
            thirdpartyConfigDialogVisible: false,
            options: [{
                value: 'default',
                label: '默认'
            }],
            templateTypeOptions: templateTypeOptions,
            showTypeOptions: showTypeOptions,
            composeTypeOptions: composeTypeOptions,
            formToolbar: [{
                key: 'rechoose',
                type: 'primary',
                label: '重选'
            }, {
                key: 'remove',
                type: 'danger',
                label: '删除'
            }, {
                key: 'rights',
                type: 'success',
                label: '权限'
            }],
            rules: {
                name: [{ required: true, message: this.$t('validate.required') }],
                key: [{ required: true, message: this.$t('validate.required') }]
            },
            script: '',
            scriptTitle: '模板脚本设置',
            scriptType: 'pc',
            fields: [],
            formKey: ''
        }
    },
    computed: {
        ...mapState({
            datasets: state => state.ibps.dataTemplate.datasets
        }),
        // fields() {
        //   return Utils.getFields(this.datasets, 'unique')
        // },
        dataTemplate: {
            get () {
                return this.data || {}
            },
            set (val) {
                this.$emit('update', val)
            }
        }
    },
    watch: {
        datasets: {
            handler: function (val, oldVal) {
                this.$utils.isNotEmpty(val) ? this.fields = Utils.getFields(val, 'unique') : null
            },
            deep: true,
            immediate: true
        },
        dataTemplate: {
            handler (val, oldVal) {
                if (val !== oldVal) {
                    const attrs = val.attrs
                    if (this.$utils.isNotEmpty(attrs) && this.$utils.isNotEmpty(attrs.form_key)) {
                        this.$nextTick(() => {
                            const curFormKey = attrs.form_key || ''
                            if (this.formKey !== curFormKey) {
                                this.formKey = curFormKey
                            }
                        })
                    }
                }
            },
            deep: true,
            immediate: true
        },
        formKey: {
            handler (val, oldVal) {
                if (val !== oldVal) {
                    this.handleAttrs('form_key', val)
                }
            }
        }
    },
    methods: {
        ...mapActions({
            setDatasets: 'ibps/dataTemplate/setDatasets'
        }),
        changeDataset (data) {
            this.dataTemplate.datasetType = data.type
            this.setDatasets([])
            if (this.$utils.isEmpty(this.datasets) && this.$utils.isNotEmpty(data)) {
                this.getUniqueOption(data.key)
            }
            if (this.$utils.isEmpty(data)) {
                this.fields = []
                this.dataTemplate.unique = ''
            }
        },
        getUniqueOption (key) {
            buildTree({
                datasetKey: key
            }).then(res => {
                this.setDatasets(res.data)
                const data = res.data
                this.fields = data
            }).catch(err => {
                console.error(err)
            })
        },
        handleInput (key, val) {
            this.dataTemplate[key] = val
            this.$emit('update', JSON.parse(JSON.stringify(this.dataTemplate)))
        },
        handleAttrs (key, val) {
            if (this.$utils.isEmpty(this.dataTemplate.attrs)) {
                this.dataTemplate.attrs = {}
            }
            this.dataTemplate.attrs[key] = val
            this.$emit('update', JSON.parse(JSON.stringify(this.dataTemplate)))
        },
        editTemplateScript (type) {
            this.scriptType = type
            if (type === 'pc') {
                this.scriptTitle = '模板脚本设置'
                this.script = this.dataTemplate.attrs.script
            } else if (type === 'mobile') {
                this.scriptTitle = '移动端模板脚本设置'
                this.script = this.dataTemplate.attrs.script
            }

            this.dialogScriptVisible = true
        },
        handleDialogScript (script) {
            // script 为codemirror中填入的脚本值
            if (this.scriptType === 'pc') {
                this.handleAttrs('script', script)
            } else {
                this.handleAttrs('mobile_script', script)
            }
        },
        validate (callback) {
            this.$nextTick(() => {
                this.$refs.dataTemplate.validate(callback)
            })
        },
        handleThirdpartyConfigSettingField (data) {

        }
    }
}
</script>
