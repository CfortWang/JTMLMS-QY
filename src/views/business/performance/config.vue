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
                                    clearable
                                    show-word-limit
                                    :maxlength="64"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="指标类型" prop="type" :show-message="false">
                                <el-input
                                    v-model="formData.type"
                                    type="text"
                                    clearable
                                    show-word-limit
                                    :maxlength="32"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="排序" prop="sn" :show-message="false">
                                <el-input-number
                                    v-model="formData.sn"
                                    type="number"
                                    :min="1"
                                    :max="99"
                                    :precision="0"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="图标" prop="icon">
                                <el-input
                                    v-model="formData.icon"
                                    type="text"
                                    clearable
                                    :maxlength="32"
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
                <el-button
                    class="add-btn"
                    size="mini"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addMethod"
                >新增</el-button>
                <el-tabs v-model="activeTab" type="border-card" class="outer-tabs" @tab-click="handleTabClick">
                    <el-tab-pane
                        v-for="(method, index) in formData.methods"
                        :key="index"
                        :label="method.name"
                        :name="method.name"
                    >
                        <template #label>
                            <span>{{ method.name }}</span>
                            <el-dropdown @command="(command) => handleCommand(index, command)">
                                <i class="el-icon-setting el-dropdown-link" />
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="copy">复制</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row :gutter="20" class="form-row">
                            <el-col :span="8">
                                <el-form-item label="方法名称" :prop="`methods[${index}].name`" :show-message="false">
                                    <el-input
                                        v-model="method.name"
                                        type="text"
                                        show-word-limit
                                        :maxlength="32"
                                        :disabled="readonly && method.isBasic"
                                        @input="handleNameChange"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="方法KEY" :prop="`methods[${index}].key`" :show-message="false">
                                    <el-input
                                        v-model="method.key"
                                        type="text"
                                        show-word-limit
                                        :maxlength="32"
                                        :disabled="readonly"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="排序" :prop="`methods[${index}].sn`" :show-message="false">
                                    <el-input-number
                                        v-model="method.sn"
                                        type="number"
                                        :min="1"
                                        :max="99"
                                        :precision="0"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" class="form-row">
                            <el-col v-if="isSuper" :span="8">
                                <el-form-item label="是否基础" :prop="`methods[${index}].isBasic`" :show-message="false">
                                    <el-switch v-model="method.isBasic" />
                                </el-form-item>
                            </el-col>
                            <template v-if="!method.isBasic">
                                <el-col :span="8">
                                    <el-form-item label="是否禁用" :prop="`methods[${index}].disabled`" :show-message="false">
                                        <el-switch v-model="method.disabled" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="是否公开" :prop="`methods[${index}].isPrivate`" :show-message="false">
                                        <el-switch v-model="method.isPrivate" />
                                    </el-form-item>
                                </el-col>
                            </template>
                        </el-row>
                        <el-row :gutter="20" class="form-row" :prop="`methods[${index}].step`" :show-message="false">
                            <el-col :span="24">
                                <el-form-item label="实验步骤">
                                    <el-input
                                        v-model="method.step"
                                        type="textarea"
                                        :maxlength="512"
                                        show-word-limit
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
                        <el-tabs tab-position="left" class="inner-tabs">
                            <el-tab-pane label="实验参数">
                                <div class="operate-btn">
                                    <el-button
                                        v-for="btn in tableToolbars"
                                        :key="btn.key"
                                        :type="btn.type"
                                        :icon="btn.icon"
                                        :size="btn.size || 'mini'"
                                        plain
                                        @click="handleActionEvent(btn.key, 'config', index)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    ref="configTable"
                                    :data="method.config"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    max-height="300px"
                                    class="config-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.config, 'selectedParams')"
                                >
                                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                                    <el-table-column
                                        v-for="(item, pIndex) in paramsList"
                                        :key="pIndex"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.minWidth"
                                        header-align="center"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <el-switch
                                                v-if="item.type === 'switch'"
                                                v-model="scope.row[item.key]"
                                                :disabled="readonly && method.isBasic"
                                            />
                                            <el-input-number
                                                v-else-if="item.type === 'number'"
                                                v-model="scope.row[item.key]"
                                                type="number"
                                                :disabled="readonly && method.isBasic"
                                                :min="item.min"
                                                :max="item.max"
                                                :precision="item.precision"
                                            />
                                            <el-input v-else v-model="scope.row[item.key]" :readonly="readonly" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="!readonly" fixed="right" label="操作" width="50" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'config', index)" /></a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="实验公式">
                                <div class="operate-btn">
                                    <el-button
                                        v-for="btn in tableToolbars"
                                        :key="btn.key"
                                        :type="btn.type"
                                        :icon="btn.icon"
                                        :size="btn.size || 'mini'"
                                        plain
                                        @click="handleActionEvent(btn.key, 'formula', index)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    ref="formulaTable"
                                    :data="method.formula"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    max-height="300px"
                                    class="formula-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.formula, 'selectedFormula')"
                                >
                                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                                    <el-table-column
                                        v-for="(item, pIndex) in formulaList"
                                        :key="pIndex"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.minWidth"
                                        header-align="center"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <el-switch
                                                v-if="item.type === 'switch'"
                                                v-model="scope.row[item.key]"
                                                :disabled="readonly && method.isBasic"
                                            />
                                            <el-input v-else v-model="scope.row[item.key]" :readonly="readonly" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="!readonly" fixed="right" label="操作" width="50" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'formula', index)" /></a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="结论模板">
                                <ibps-ueditor v-model="method.template" class="editor" :config="ueditorConfig" />
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { configFormRules, paramsList, formulaList } from './constants/index'
import { getConfigDetail, saveConfig } from '@/api/business/pv'
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector'),
        IbpsUeditor: () => import('@/components/ibps-ueditor')
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
        const { isSuper } = this.$store.getters || {}
        return {
            isSuper,
            dialogVisible: this.visible,
            formLabelWidth: '90px',
            formData: {},
            rules: configFormRules,
            activeTab: '',
            activeTabIndex: 0,
            methodTabs: [],
            loading: false,
            loadCompleted: false,
            readonly: !isSuper,
            selectedParams: [],
            selectedFormula: [],
            paramsList,
            formulaList,
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success' },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            tableToolbars: [
                { key: 'add', icon: 'ibps-icon-plus', label: '添加', type: 'success' },
                { key: 'remove', icon: 'ibps-icon-trash', label: '删除', type: 'danger' }
            ],
            ueditorConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 300,
                // 初始容器宽度
                initialFrameWidth: '100%'
            },
            initMethod: {
                name: '方法',
                sn: '',
                isBasic: false,
                isPrivide: false,
                disabled: false,
                step: '',
                references: '',
                config: [],
                formula: [],
                template: ''
            }
        }
    },
    watch: {
        visible: {
            handler (val, oldVal) {
                this.dialogVisible = this.visible
            }
        }
    },
    mounted () {
        this.formData = JSON.parse(JSON.stringify(this.pageData))
        this.methodTabs = this.formData.methods
        this.activeTab = this.methodTabs[0].name
        this.loadCompleted = true
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
        handleTabClick (tab) {
            const t = this.methodTabs.findIndex(item => item.name === tab.name)
            // 外层tab切换清除选中数据
            if (t !== this.activeTabIndex) {
                this.activeTabIndex = t
                this.selectedParams = []
                this.$refs.configTable[this.activeTabIndex].clearSelection()
                this.selectedFormula = []
                this.$refs.formulaTable[this.activeTabIndex].clearSelection()
            }
        },
        handleNameChange (v) {
            this.activeTab = v
        },
        handleCommand (index, command) {
            switch (command) {
                case 'copy':
                    this.copyMethod(index)
                    break
                case 'delete':
                    this.deleteMethod(index)
                    break
                default:
                    break
            }
        },
        copyMethod (index) {
            const copyData = JSON.parse(JSON.stringify(this.formData.methods[index]))
            copyData.sn = this.methodTabs.length + 1
            copyData.name += ' (复制)'
            copyData.isBasic = false
            this.formData.methods.push(copyData)
        },
        deleteMethod (index) {
            const { methods = [] } = this.formData || {}
            this.$confirm('确定要删除方法吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                methods.splice(index, 1)
                this.formData.method = methods
                this.activeTab = methods.length ? methods[0].name : ''
            }).catch(() => {})
        },
        addMethod () {
            const data = JSON.parse(JSON.stringify(this.initMethod))
            data.sn = this.methodTabs.length + 1
            data.name += data.sn
            this.formData.methods.push(data)
            this.activeTab = data.name
        },
        handleActionEvent (key, type, index) {
            const indexMap = {
                'config': 'selectedParams',
                'formula': 'selectedFormula'
            }
            switch (key) {
                case 'save':
                    this.handleSave()
                    break
                case 'cancel':
                    this.handleCancel()
                    break
                case 'add':
                    this.handleAddParam(type, index)
                    break
                case 'remove':
                    if (!this[indexMap[type]].length) {
                        return this.$message.warning('请选择要删除的数据')
                    }
                    this.handleRemove(this[indexMap[type]], type, index)
                    break
                default:
                    break
            }
        },
        handleSave () {
            this.$refs.configForm.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项信息！')
                }
                const submitData = JSON.parse(JSON.stringify(this.formData))
                submitData.config = JSON.stringify({ methods: this.formData.methods })
                this.submitForm(submitData)
            })
        },
        handleAddParam (type, index) {
            const obj = type === 'config' ? {
                key: '',
                label: '',
                default: '',
                max: '',
                min: '',
                precision: '',
                isVisible: true
            } : {
                key: '',
                label: '',
                value: ''
            }
            const temp = this.formData.methods[index][type] || []
            temp.push(obj)
            this.formData.methods[index][type] = temp
            this.methodTabs = this.formData.methods
        },
        handleDelParam (type, index, cIndex) {
            this.formData.methods[index][type].splice(cIndex, 1)
        },
        handleSelectionChange (v, data, type) {
            this[type] = v.map(item => data.indexOf(item))
        },
        handleRemove (removeIndex, type, methodIndex) {
            let indexList = []
            if (typeof removeIndex === 'number') {
                indexList = [removeIndex]
            } else {
                indexList = removeIndex
            }
            indexList.sort((a, b) => b - a)
            this.$confirm('确定要删除选中数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                indexList.forEach(i => {
                    this.formData.methods[methodIndex][type].splice(i, 1)
                })
            }).catch(() => {})
        },
        // 提交数据
        submitForm (data) {
            saveConfig(data).then(res => {
                this.$message.success('保存成功')
                this.closeDialog()
                this.$emit('callback')
            })
        },
        handleCancel () {
            this.closeDialog()
        },
        closeDialog () {
            this.$emit('close', false)
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
                position: relative;
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
                .operate-btn {
                    text-align: right;
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
                        }
                    }
                    .el-table th.el-table__cell > .cell, .el-table td.el-table__cell {
                        color: #606266;
                        font-size: 14px;
                    }
                    .el-dropdown-link {
                        margin-left: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        color: #409EFF;
                    }
                    .el-tabs__nav-wrap.is-scrollable {
                        width: calc(100% - 100px);
                    }
                    .outer-tabs {
                        .el-tabs__content {
                            height: calc(100vh - 290px);
                            overflow: auto;
                        }
                        .inner-tabs {
                            .el-tabs__header.is-left {
                                width: 90px;
                            }
                            .el-tabs__item {
                                padding: 0 12px 0 0;
                            }
                            .el-tabs__content {
                                height: auto;
                                // overflow: auto;
                            }
                            .el-input-number--small {
                                width: 100%;
                            }
                            .editor {
                                .edui-editor {
                                    width: auto !important;
                                }
                            }
                        }
                    }
                }
                .add-btn {
                    position: absolute;
                    top: 36px;
                    right: 18px;
                    z-index: 99;
                }
                .outer-tabs {
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
