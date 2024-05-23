<template>
    <el-dialog
        v-loading="loading"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        fullscreen
        class="dialog method-config-dialog"
        top="0"
        @open="loadData"
        @close="closeDialog"
    >
        <div slot="title" class="config-dialog-header">
            <div class="title">{{ pageData.target + '配置' }}</div>
            <div class="operate">
                <template v-for="btn in toolbars">
                    <el-button
                        v-if="!btn.hidden"
                        :key="btn.key"
                        :type="btn.type"
                        :icon="btn.icon"
                        :size="btn.size || 'mini'"
                        @click="handleActionEvent(btn.key)"
                    >
                        {{ btn.label }}
                    </el-button>
                </template>
            </div>
        </div>
        <el-form
            v-if="loadCompleted"
            ref="configForm"
            :label-width="formLabelWidth"
            :model.sync="formData"
            :rules="rules"
            class="config-form"
            @submit.native.prevent
        >
            <div class="config-item">
                <div class="title">
                    <i class="ibps-icon-star" />
                    <span>指标配置</span>
                </div>
                <div class="form-container">
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="12">
                            <el-form-item label="指标名称" prop="target" :show-message="false">
                                <el-input
                                    v-model="formData.target"
                                    type="text"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="指标类型" prop="type" :show-message="false">
                                <el-input
                                    v-model="formData.type"
                                    type="text"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="排序" prop="sn" :show-message="false">
                                <el-input
                                    v-model="formData.sn"
                                    type="text"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="图标" prop="icon">
                                <el-input
                                    v-model="formData.icon"
                                    type="text"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="config-item">
                <div class="title">
                    <i class="ibps-icon-star" />
                    <span>方法配置</span>
                </div>
                <el-tabs v-model="activeTab" type="border-card" class="method-tab">
                    <!-- <template slot="tab-bar">
                        <el-button
                            class="add-btn"
                            size="mini"
                            type="primary"
                            icon="el-icon-plus"
                            @click="addMethod"
                        >添加</el-button>
                    </template> -->
                    <el-tab-pane
                        v-for="(method, index) in methodTabs"
                        :key="index"
                        :label="method.name"
                        :name="method.name"
                    >
                        <template #label>
                            <span>{{ method.name }}</span>
                            <el-dropdown @command="handleCommand(method)">
                                <i class="el-icon-setting el-dropdown-link" />
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="copy">复制</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row :gutter="20" class="form-row">
                            <el-col :span="12">
                                <el-form-item label="方法名称" :prop="`methods[${index}].name`" :show-message="false">
                                    <el-input v-model="method.name" @input="handleNameChange" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序" :prop="`methods[${index}].sn`" :show-message="false">
                                    <el-input v-model="method.sn" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="form-row">
                            <el-col :span="12">
                                <el-form-item label="是否禁用" :prop="`methods[${index}].disabled`" :show-message="false">
                                    <el-switch v-model="method.disabled" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否公开" :prop="`methods[${index}].isPrivate`" :show-message="false">
                                    <el-switch v-model="method.isPrivate" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="form-row" :prop="`methods[${index}].step`" :show-message="false">
                            <el-col :span="24">
                                <el-form-item label="实验步骤">
                                    <el-input
                                        v-model="method.step"
                                        type="textarea"
                                        :autosize="{ minRows: 4, maxRows: 6 }"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="参考资料" :prop="`methods[${index}].step`">
                            <ibps-attachment
                                v-model="method.references"
                                allow-download
                                download
                                multiple
                                accept="*"
                                store="id"
                                :readonly="readonly"
                            />
                        </el-form-item>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { performanceList, configFormRules } from './constants/index'
import { getConfigDetail, saveConfig } from '@/api/business/pv'
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector')
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pageData: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            dialogVisible: this.visible,
            formLabelWidth: '90px',
            formData: {},
            rules: configFormRules,
            activeTab: '',
            methodTabs: [],
            targetId: '',
            loading: false,
            loadCompleted: false,
            readonly: false,
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success' },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            paramsTitle: ['名称', '编码', '默认值', '最大值', '最小值', '精度'],
            formulaTitle: ['名称', '编码', '表达式']
        }
    },
    computed: {

    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        }
    },
    created () {
        // this.getConfigData()
    },
    mounted () {
        const temp = performanceList.find(i => i.type === 'precision') || {}
        this.formData = JSON.parse(JSON.stringify(temp))
        this.formData.target = this.formData.title
        console.log(this.formData)
        this.methodTabs = this.formData.methods
        this.activeTab = this.methodTabs[0].name
        this.loadCompleted = true
        // this.loadData()
    },
    methods: {
        // 获取数据
        async loadData () {
            this.loading = true
            getConfigDetail({ id: this.pageData.id }).then(res => {
                this.loading = false
                const { data } = res || {}
                if (data) {
                    data.shiYanCanShu = data.shiYanCanShu ? JSON.parse(data.shiYanCanShu) : {}
                    data.shiYanShuJu = data.shiYanShuJu ? JSON.parse(data.shiYanShuJu) : {}
                    this.form = Object.assign(this.form, data)
                    this.loadCompleted = true
                }
            }).catch(() => {
                this.loading = false
            })
        },
        handleClick (v) {
            this.activeTab = v.name
        },
        handleNameChange (v) {
            this.activeTab = v
        },
        handleCommand (method) {
            return (command) => {
                if (command === 'copy') {
                    this.copyMethod(method)
                } else if (command === 'delete') {
                    this.deleteMethod(method)
                }
            }
        },
        copyMethod (method) {
            const newMethod = JSON.parse(JSON.stringify(method))
            newMethod.sn = `02-${this.form.methods.length + 1}`
            newMethod.name += ' (复制)'
            this.form.methods.push(newMethod)
        },
        deleteMethod (method) {
            this.form.methods = this.form.methods.filter((m) => m.sn !== method.sn)
            this.activeTab = this.form.methods.length ? this.form.methods[0].sn : ''
        },
        addMethod () {
            console.log(123)
        },
        getConfigData () {
            const { target, method } = this.pageData || {}
            const t = performanceList.find(i => i.title === target)
            const m = t.methods.find(i => i.name === method)
            this.targetId = t.id
        },
        handleActionEvent (key) {
            switch (key) {
                case 'save':
                    this.handleSave(key)
                    break
                case 'cancel':
                    this.handleCancel()
                    break
                default:
                    break
            }
        },
        handleSave (key) {
            console.log(this.formData)
            this.$refs.configForm.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项信息！')
                }
                this.submitForm()
            })
        },
        handleAddParam (type, index) {
            const obj = type === 'config' ? {
                key: '',
                label: '',
                default: '',
                max: '',
                min: '',
                precision: ''
            } : {
                key: '',
                label: '',
                value: ''
            }
            const temp = this.formData.methods[index][type] || []
            temp.push(obj)
            this.formData.methods[index][type] = temp
        },
        handleDelParam (type, index, cIndex) {
            this.formData.methods[index][type].splice(cIndex, 1)
        },
        submitForm (key) {
            const submitData = {}
            // 提交数据
            saveConfig(submitData).then(res => {
                console.log(res)
                this.$message.success('保存成功')
                this.closeDialog()
            })
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('update:visible', false)
        }
    }
}
</script>
<style lang="scss" scoped>
    .method-config-dialog {
        ::v-deep {
            .el-dialog__header {
                padding: 15px 20px 16px;
            }
        }
        .config-dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
                line-height: 24px;
                font-size: 18px;
                color: #303133;
            }
        }
        .config-form {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 4px;
            overflow: hidden;
            height: calc(100vh - 100px);
            .config-item {
                margin-bottom: 20px;
                .title {
                    height: 20px;
                    line-height: 20px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    .ibps-icon-star {
                        color: #FB9600;
                        margin-right: 5px;
                    }
                }
                ::v-deep {
                    .el-form-item {
                        margin-bottom: 10 !important;
                        &__label {
                            font-size: 14px !important;
                            color: #606266;
                        }
                        &__content {
                            .el-input, .el-select, .el-input-number {
                                width: 100%;
                            }
                            .el-textarea .el-input__count {
                                padding: 0 5px;
                                line-height: initial;
                            }
                            .el-radio, .el-checkbox {
                                margin-right: 10px;
                            }
                        }
                    }
                    .el-table th.el-table__cell > .cell, .el-table td.el-table__cell {
                        color: #606266;
                        font-size: 14px;
                    }
                    .el-button--mini {
                        padding: 5px 12px;
                    }
                    .el-dropdown-link {
                        margin-left: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        color: #409EFF;
                    }
                    .el-tabs__nav-wrap.is-scrollable {
                        width: calc(100% - 120px);
                    }
                    .el-tabs__content {
                        height: calc(100vh - 290px);
                        overflow: auto;
                    }
                }
                .method-tab {
                    .add-btn {
                        position: absolute;
                        top: 0;
                        right: 0;
                    }
                    .params {
                        display: flex;
                        .params-label {
                            width: 78px;
                            padding-right: 12px;
                            padding-top: 10px;
                            text-align: right;
                        }
                        .params-content {
                            flex: 1;
                            .params-row, .params-title {
                                display: flex;
                                margin-bottom: 10px;
                                .left {
                                    display: flex;
                                    flex: 1;
                                    justify-content: space-around;
                                    align-items: center;
                                }
                                .operate-btn {
                                    width: 40px;
                                    height: 40px;
                                    margin-left: 20px;
                                }
                            }
                            .params-title > div {
                                // flex: 1;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
