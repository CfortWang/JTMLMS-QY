<template>
    <div class="panel panel-default">
        <div class="panel-heading">参数设置</div>
        <div class="panel-body">
            <el-form-item v-if="types.includes('selector_type')" label-width="110px">
                <template slot="label">选择器类型<help-tip prop="selectorType" /></template>
                <el-select
                    v-model="fieldOptions.selector_type"
                    style="width:100%;"
                    @change="(val)=>selectorChange(val)"
                >
                    <el-option
                        v-for="option in selectorTypeOptions"
                        :key="option.value"
                        :value="option.value"
                        :label="option.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="types.includes('multiple')">
                <template slot="label">是否多选<help-tip prop="multiple" /></template>
                <el-switch v-model="fieldOptions.multiple" @change="setDefaultValue" />
            </el-form-item>
            <el-form-item v-if="types.includes('filtrate')">
                <template slot="label">是否过滤</template>
                <el-switch v-model="fieldOptions.filtrate" @change="setDefaultValue" />
            </el-form-item>
            <!--TODO:选择器范围-->
            <el-form-item v-if="types.includes('selector_type')" label-width="95px">
                <template slot="label">选择范围<help-tip prop="checkScope" /></template>
                <el-button
                    icon="el-icon-s-tools"
                    :disabled="(fieldOptions.selector_type==='user'&&fieldOptions.filter.length===4)||(fieldOptions.selector_type!=='user'&&fieldOptions.filter.length===1)"
                    type="primary"
                    size="mini"
                    style="font-size:14px;"
                    plain
                    @click="addScope"
                >
                    设置
                </el-button>
            </el-form-item>
            <!--范围  -->
            <el-form-item label-width="95px">
                <div v-for="(filter,i) in fieldOptions.filter" :key="i" class="list-scope-group-item">
                    <el-row>
                        <!-- <el-col :span="filter.type==='role'?6:filter.type==='user'?18:12"> -->
                        <el-col :span="18">
                            <el-tag v-if="$utils.isNotEmpty(filter.userType)" effect="plain">
                                {{ filter.userType|optionsFilter(partyTypeOptions,'label') }}
                            </el-tag>
                            <el-tag v-if="$utils.isNotEmpty(filter.descVal)" effect="plain" style="margin-left:2px;">
                                {{ filter.descVal|optionsFilter(selectorScopeOption,'label') }}
                            </el-tag>

                            <el-button-group class="actions">
                                <el-button size="small" type="text" title="设置" icon="ibps-icon-cog" @click="settingButton(i)" />
                                <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeButton(i)" />
                            </el-button-group>
                            <!-- <el-tag v-if="filter.type!=='role'&&$utils.isNotEmpty(filter.includeSub)" effect="plain" style="margin-left:2px;">
                                {{ filter.includeSub?'含子集':'不含子集' }}
                            </el-tag> -->
                        </el-col>
                        <!-- <el-col :span="4">
                            <el-button-group class="actions">
                                <el-button size="small" type="text" title="设置" icon="ibps-icon-cog" @click="settingButton(i)" />
                                <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeButton(i)" />
                            </el-button-group>
                        </el-col> -->
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item v-if="types.includes('store')">
                <template slot="label">存储格式<help-tip prop="selectorStore" /></template>
                <el-select
                    v-model="fieldOptions.store"
                    style="width:100%;"
                    @change="selectorStoreValue"
                >
                    <el-option
                        v-for="store in selectorStoreOptions"
                        :key="store.value"
                        :value="store.value"
                        :label="store.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="fieldOptions.store==='bind'">
                <template slot="label">绑定值<help-tip :prop="fieldOptions.selector_type==='user'?'bind':'bindOther'" /></template>
                <el-select v-model="fieldOptions.bind" style="width:100%;">
                    <el-option
                        v-for="store in bindValueOptions"
                        :key="store.value"
                        :value="store.value"
                        :label="store.label"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="fieldOptions.store==='bind'">
                <template slot="label">存储字段<help-tip prop="bindFiled" /></template>
                <ibps-bo-select v-model="fieldItem.bindFiled" :data="boFields" placeholder="请绑定属性" empty-text="未设置存储字段" @change="changeBoName" />
                <!-- <ibps-tree-select
                    v-model="fieldOptions.bindFiled"
                    :data="boTreeData"
                    :props="props"
                    :multiple="false"
                    :allow-selection="changeBoName"
                    node-key="key"
                    empty-text="未设置存储字段"
                    clearable
                    filterable
                /> -->
            </el-form-item>
        </div>
        <!-- // 设置 -->
        <setting-optional-scope
            :title="title"
            :visible="settingOptionalScopeVisible"
            :data="editData"
            :bo-data="boData"
            :readonly="readonly"
            :button-key="buttonKey"
            :existing-type-scope="existingTypeScope"
            :selector-type="fieldOptions.selector_type"
            @callback="setDataTemplateScopeAttr"
            @close="visible => settingOptionalScopeVisible = visible"
        />
    </div>
</template>
<script>
import { partyTypeOptions } from '@/business/platform/org/employee/constants'
import settingOptionalScope from '../components/setting-optional-scope'
import { selectorTypeOptions, selectorStoreOptions, bindValueEmployeeOptions, bindValueOtherOptions, selectorScopeOption } from '@/business/platform/form/constants/fieldOptions'
import IbpsBoSelect from '@/business/platform/bo/def/select'
// import IbpsTreeSelect from '@/components/ibps-tree-select'
// import TreeUtils from '@/utils/tree'
import EditorMixin from '../mixins/editor'

export default {
    components: {
        settingOptionalScope,
        // IbpsTreeSelect
        IbpsBoSelect
    },
    mixins: [EditorMixin],
    props: {
        types: {
            type: String,
            default: 'selector_type,multiple,store'
        }
    },
    data () {
        return {
            settingOptionalScopeVisible: false,
            partyTypeOptions: partyTypeOptions,
            selectorScopeOption: selectorScopeOption,
            selectorTypeOptions: selectorTypeOptions,
            selectorStoreOptions: selectorStoreOptions,
            bindValueOptions: bindValueEmployeeOptions,
            editData: {},
            props: {
                children: 'children',
                label: 'name'
            },
            editIndex: 0,
            buttonKey: 'add',
            readonly: true,
            title: '添加范围',
            existingTypeScope: []
        }
    },
    // computed: {
    //     boTreeData () {
    //         return TreeUtils.transformToTreeFormat(this.boData, {
    //             idKey: 'id',
    //             pIdKey: 'parentId'
    //         })
    //     }
    // },
    methods: {
        changeBoName (value, data) {
            if (data.data.key === 'id' || data.data.key === 'parentId') {
                this.$message({
                    title: '提示',
                    message: '此字段不能用作存储！',
                    type: 'warning'
                })
                return false
            }
            this.fieldOptions.bindFiled = data.data.key
            // this.fieldOptions.attrType = data.attrType
            // this.fieldOptions.isSub = data.attrType === 'subField'
            // this.fieldOptions.code = data.tableName
            // this.fieldOptions.tableName = data.tableName
            // console.info(data, this.fieldOptions, '=>>选择器关联表单字段详细信息')
            return true
        },
        selectorStoreValue (val) {
            // if (val !== 'bind') {
            //     this.fieldOptions.bind = ''
            //     this.fieldOptions.bindFiled = ''
            // }
            // this.fieldOptions.attrType = ''
            // this.fieldOptions.tableName = ''
            // this.fieldOptions.isSub = false
        },
        selectorChange (val) {
            this.setDefaultValue()
            this.bindValueOptions = val === 'user' ? bindValueEmployeeOptions : bindValueOtherOptions
            this.fieldOptions.bind = 'id'
            // this.fieldOptions.bindFiled = ''
            this.fieldItem.bindFiled = ''
            this.fieldOptions.filter = []
            this.fieldOptions.store = 'id'
        },
        setDataTemplateScopeAttr (data) {
            this.buttonKey === 'add' ? this.fieldOptions.filter = [...this.fieldOptions.filter, ...data] : this.fieldOptions.filter[this.editIndex] = data[0]
        },
        settlingDefaultValue () {
            if (this.fieldOptions.default_value_type === 'fixed') {
                this.fieldOptions.default_value = ''
            }
            this.fieldOptions.filter = []
        },
        addScope () {
            this.readonly = false
            this.editData = {}
            this.buttonKey = 'add'
            this.title = '添加范围'
            this.setTypeOptions()
            this.settingOptionalScopeVisible = true
        },
        // 设置按钮
        settingButton (i) {
            this.readonly = false
            this.buttonKey = 'setting'
            this.title = '编辑范围'
            this.setTypeOptions()
            this.editData = this.fieldOptions.filter[i]
            this.editIndex = i
            this.settingOptionalScopeVisible = true
        },
        // 设置类型切换值
        setTypeOptions () {
            const existingTypeScope = []
            const typeScope = []
            this.fieldOptions.filter.forEach(f => {
                existingTypeScope.push(f.userType)
            })
            // 根据已选范围动态调整范围下拉数据
            const partyTypeOptions = JSON.parse(JSON.stringify(this.partyTypeOptions))
            partyTypeOptions.forEach((f, i) => {
                if (!existingTypeScope.includes(f.value)) {
                    typeScope.push(f)
                }
            })
            this.existingTypeScope = typeScope
        },
        // 删除按钮
        removeButton (i) {
            this.fieldOptions.filter.splice(i, 1)
        }
    }

}
</script>
