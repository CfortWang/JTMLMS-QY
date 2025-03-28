<template>
    <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-width="120px"
        size="mini"
        @submit.native.prevent
    >
        <el-form-item label="按钮名称" required prop="label">
            <el-input v-model="formData.label" placeholder="按钮名称" />
        </el-form-item>
        <el-form-item
            v-if="formData && (formData.button_type === 'custom' || formData.button_type === 'sefStartFlow')"
            label="按钮编码"
            prop="code"
            required
        >
            <el-input v-model="formData.code" placeholder="按钮编码" />
        </el-form-item>
        <el-form-item label="权限" prop="rights">
            <rights-selector v-model="formData.rights" />
        </el-form-item>
        <el-form-item
            v-if="type === 'function'"
            label="按钮位置"
            prop="position"
        >
            <el-radio-group v-model="formData.position">
                <el-radio-button
                    v-for="t in positionType"
                    :key="t.value"
                    :label="t.value"
                >{{ t.label }}</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="按钮颜色" prop="style">
            <el-select v-model="formData.style" placeholder="按钮颜色">
                <el-option
                    v-for="item in colors"
                    :key="item.type"
                    :label="item.label"
                    :value="item.type"
                >
                    <el-link
                        :underline="false"
                        :type="item.type"
                        style="float: left;"
                    >{{ item.label }}</el-link>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="按钮图标" prop="icon">
            <ibps-icon-select v-model="formData.icon" icon="el-icon-search" />
        </el-form-item>
        <el-form-item v-if="formData.button_type=='custom'" label="模板归档显示">
            <el-switch v-model="formData.show_on_record" active-value="Y" inactive-value="N" />
        </el-form-item>
        <el-form-item
            v-if="formData && formData.button_type === 'export'"
            label="导出字段"
            prop="icon"
        >
            <el-button size="small" type="primary" @click="handleExportFields">设置导出字段</el-button>
            <el-button size="small" type="primary" @click="resetExportFields">重置导出字段</el-button>
        </el-form-item>
        <el-form-item
            v-if="formData && ['consult', 'download'].includes(formData.button_type)"
            label="报表路径"
            required
            prop="label"
        >   <template slot="label">
                报表路径
                <el-tooltip effect="dark" content="在原报表路径后用&分割，添加自定义参数。目前只加主键的，如“&id_=zhu_id_”，id_是报表里接收参数的变量名，zhu_id_是列表上返回的字段" placement="top">
                    <i class="el-icon-question question-icon" />
                </el-tooltip>
            </template>
            <el-input v-model="formData.reportPath" placeholder="请填写润乾报表完整路径" />
        </el-form-item>
        <el-form-item
            v-if="formData && ['sefStartFlow', 'openTask'].includes(formData.button_type)"
            prop="deflow"
        >
            <label slot="label">
                绑定流程
                <el-tooltip v-if="formData.button_type === 'sefStartFlow'" class="item" effect="light" placement="bottom">
                    <div slot="content" style="line-height: 1.5;">
                        先在模板属性绑定表单，此流程定义数据才有！
                    </div>
                    <i class="ibps-icon-help" />：
                </el-tooltip>
            </label>
            <bpm-def-selector
                v-model="formData.deflow"
                :value-key="formData.button_type === 'sefStartFlow' ? 'defKey' : 'defId'"
                :form-key="formKey"
                :is-data-template-use="formData.button_type === 'sefStartFlow'"
            />
        </el-form-item>
        <el-form-item
            v-if="formData && ['sefStartFlow', 'openTask', 'add'].includes(formData.button_type)"
            label="编制参数"
            prop="initAddDataCont"
        >
            <el-input v-model="formData.initAddDataCont" placeholder="a:1&b:2（原template.addDataCont.a = '1'）" />
        </el-form-item>
        <el-form-item
            v-if="formData && ['consult', 'detail','custom'].includes(formData.button_type)"
            label="点击同步"
            prop="clickToSync"
        >
            <el-radio-group v-model="formData.clickToSync">
                <el-radio-button label="无" />
                <el-radio-button label="单击" />
                <el-radio-button label="双击" />
            </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData && ['openTask'].includes(formData.button_type)" prop="isEditOnHis">
            <template slot="label">
                编制暂存
                <el-tooltip effect="dark" content="如开启，在点击编制按钮时将带出当前用户最新已暂存的数据" placement="top">
                    <i class="el-icon-question question-icon" />
                </el-tooltip>
            </template>
            <el-switch
                v-model="formData.isEditOnHis"
                active-value="Y"
                inactive-value="N"
            />
        </el-form-item>
        <export-column
            :visible="exportFieldDialogVisible"
            :data="template"
            @callback="handleExportColumn"
            @close="visible => exportFieldDialogVisible = visible"
        />
    </el-form>
</template>
<script>
import { hasPermission } from '@/business/platform/data/constants/buttons'
import BpmDefSelector from '@/business/platform/bpmn/definition/selector'
import RightsSelector from '@/business/platform/rights/config/selector'
import ExportColumn from '../components/export-column'

export default {
    components: {
        RightsSelector,
        BpmDefSelector,
        ExportColumn
    },
    props: {
        data: {
            type: Object
        },
        template: {
            type: Object
        },
        formKey: String,
        type: {
            type: String,
            default: 'function'
        }
    },
    data () {
        return {
            colors: [
                { type: 'default', label: '默认' },
                { type: 'primary', label: '主要' },
                { type: 'success', label: '成功' },
                { type: 'info', label: '信息' },
                { type: 'warning', label: '警告' },
                { type: 'danger', label: '危险' }
            ],
            exportFieldDialogVisible: false,
            formName: 'form',
            formData: {
                style: 'primary'
            },
            rules: {
                label: [
                    {
                        required: true,
                        message: this.$t('validate.required')
                    }
                ]
            }
        }
    },
    computed: {
        positionType () {
            const positionType = []
            positionType.push({
                value: 'all',
                label: '所有'
            })
            const buttonType = this.formData.button_type || ''
            if (hasPermission(buttonType, 'toolbar') && this.type === 'function') {
                positionType.push({
                    value: 'toolbar',
                    label: '仅顶部'
                })
            }
            if (hasPermission(buttonType, 'manage') && this.type === 'function') {
                positionType.push({
                    value: 'manage',
                    label: '仅管理列'
                })
            }
            // if (hasPermission(buttonType, 'search') && this.type === 'function') {
            //   positionType.push({
            //     value: 'search',
            //     label: '仅查询列'
            //   })
            // }
            if (hasPermission(buttonType, 'edit') && this.type === 'edit') {
                positionType.push({
                    value: 'edit',
                    label: '仅编辑'
                })
            }
            return positionType
        }
    },
    watch: {
        data: {
            handler (val) {
                if (val) {
                    this.formData = val
                    const spicialType = ['custom', 'sefStartFlow', 'openTask']
                    if (spicialType.includes(this.formData.button_type)) {
                        this.rules['code'] = [
                            {
                                required: true,
                                message: this.$t('validate.required')
                            }
                        ]
                    } else {
                        this.rules['code'] = null
                    }
                }
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
        },
        handleExportFields () {
            this.exportFieldDialogVisible = true
        },
        resetExportFields () {
            this.$confirm('确定要重置导出字段吗？该操作将在模板信息保存后生效', '提示', {
                type: 'info',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                this.handleData('export_columns', '')
            })
        },
        handleExportColumn (data) {
            this.handleData('export_columns', data)
        },
        handleData (key, value) {
            this.$emit('callback', key, value)
        }
    }
}
</script>
