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
            <div class="title">{{ formData.target + '配置' }}</div>
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
                            <el-form-item label="指标类型" prop="targetKey" :show-message="false">
                                <el-input
                                    v-model="formData.targetKey"
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
                        v-for="(method, mIndex) in formData.methods"
                        :key="mIndex"
                        :label="method.methodName"
                        :name="method.methodName"
                    >
                        <template #label>
                            <span>{{ method.methodName }}</span>
                            <el-dropdown @command="(command) => handleCommand(mIndex, command)">
                                <i class="el-icon-setting el-dropdown-link" />
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="copy">复制</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row :gutter="20" class="form-row">
                            <el-col :span="8">
                                <el-form-item label="方法名称" :prop="`methods[${mIndex}].methodName`" :show-message="false">
                                    <el-input
                                        v-model="method.methodName"
                                        type="text"
                                        show-word-limit
                                        :maxlength="64"
                                        :disabled="readonly && method.isBasic"
                                        @input="handleNameChange"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="方法类型" :prop="`methods[${mIndex}].methodType`" :show-message="false">
                                    <el-select
                                        v-model="method.methodType"
                                        :disabled="readonly"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="(item, index) in methodTypeOption"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="排序" :prop="`methods[${mIndex}].sn`" :show-message="false">
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
                                <el-form-item label="是否基础" :prop="`methods[${mIndex}].isBasic`" :show-message="false">
                                    <el-switch v-model="method.isBasic" active-value="Y" inactive-value="N" />
                                </el-form-item>
                            </el-col>
                            <template v-if="!method.isBasic || isSuper">
                                <el-col :span="8">
                                    <el-form-item label="是否禁用" :prop="`methods[${mIndex}].isDisabled`" :show-message="false">
                                        <el-switch v-model="method.isDisabled" active-value="Y" inactive-value="N" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="是否公开" :prop="`methods[${mIndex}].isPublic`" :show-message="false">
                                        <el-switch v-model="method.isPublic" active-value="Y" inactive-value="N" />
                                    </el-form-item>
                                </el-col>
                            </template>
                        </el-row>
                        <el-form-item label="实验步骤" :prop="`methods[${mIndex}].step`" :show-message="false">
                            <el-input
                                v-model="method.step"
                                type="textarea"
                                :maxlength="2000"
                                show-word-limit
                                :autosize="{ minRows: 4, maxRows: 6 }"
                            />
                        </el-form-item>
                        <el-form-item label="判定标准" :prop="`methods[${mIndex}].criterion`" :show-message="false">
                            <el-input
                                v-model="method.criterion"
                                type="textarea"
                                :maxlength="2000"
                                show-word-limit
                                :autosize="{ minRows: 4, maxRows: 6 }"
                            />
                        </el-form-item>
                        <el-form-item label="参考资料" :prop="`methods[${mIndex}].references`">
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
                                        @click="handleActionEvent(btn.key, 'config', mIndex)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    :ref="`configTable${mIndex}`"
                                    :data="method.params"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    max-height="300px"
                                    class="config-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.params, 'selectedParams')"
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
                                            <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'config', mIndex)" /></a>
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
                                        @click="handleActionEvent(btn.key, 'formula', mIndex)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    :ref="`formulaTable${mIndex}`"
                                    :data="method.formulas"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    max-height="300px"
                                    class="formula-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.formulas, 'selectedFormula')"
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
                                            <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'formula', mIndex)" /></a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="结论模板">
                                <ibps-ueditor v-model="method.template" class="editor" :config="ueditorConfig" />
                            </el-tab-pane>
                            <el-tab-pane label="模板说明">
                                <ibps-ueditor v-model="method.templateDesc" class="editor" :config="ueditorConfig" />
                            </el-tab-pane>
                            <el-tab-pane label="图表配置">
                                <el-input
                                    v-model="method.chartOption"
                                    type="textarea"
                                    :maxlength="2000"
                                    show-word-limit
                                    :autosize="{ minRows: 12, maxRows: 16 }"
                                />
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import { configFormRules, paramsList, formulaList, methodTypeOption } from './constants/index'
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
        targetId: {
            type: String,
            default: ''
        }
    },
    data () {
        const { isSuper } = this.$store.getters || {}
        return {
            isSuper,
            paramsList,
            formulaList,
            methodTypeOption,
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
            selectionIndex: {},
            selectedParams: [],
            selectedFormula: [],
            toolbars: [
                { key: 'save', icon: 'ibps-icon-save', label: '保存', type: 'success' },
                { key: 'cancel', icon: 'el-icon-close', label: '关闭', type: 'danger' }
            ],
            tableToolbars: [
                { key: 'add', icon: 'ibps-icon-plus', label: '添加', type: 'success' },
                { key: 'remove', icon: 'ibps-icon-trash', label: '删除', type: 'danger' }
            ],
            ueditorConfig: {
                autoHeightEnabled: false,
                initialFrameHeight: 300,
                initialFrameWidth: '100%'
            },
            initMethod: {
                methodName: '方法',
                methodType: '',
                sn: '',
                isBasic: 'N',
                isDisabled: 'N',
                isPublic: 'N',
                step: '',
                criterion: '',
                references: '',
                params: [],
                formulas: [],
                template: '',
                templateDesc: '',
                chartOption: ''
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
        this.loadData()
    },
    methods: {
        // 获取数据
        async loadData () {
            this.loading = true
            getConfigDetail({ id: this.targetId }).then(res => {
                this.loading = false
                const { config, experimentalConfigDetailPoList: methods, icon, sn, target, targetKey } = res.data
                methods.forEach(item => {
                    item.params = this.$utils.isNotEmpty(item.params) ? JSON.parse(item.params) : []
                    item.formulas = this.$utils.isNotEmpty(item.formulas) ? JSON.parse(item.formulas) : []
                })
                this.formData = { icon, sn, target, targetKey, id: this.targetId, methods }
                this.methodTabs = methods
                this.activeTab = this.methodTabs[0].methodName
                this.loadCompleted = true
            }).catch(() => {
                this.loading = false
            })
        },
        handleTabClick (tab) {
            const t = this.methodTabs.findIndex(item => item.name === tab.name)
            // 外层tab切换清除选中数据
            if (t !== this.activeTabIndex) {
                this.$nextTick(() => {
                    this.activeTabIndex = t
                    this.selectedParams = []
                    this.$refs[`configTable${this.activeTabIndex}`].clearSelection()
                    this.selectedFormula = []
                    this.$refs[`formulaTable${this.activeTabIndex}`].clearSelection()
                })
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
                submitData.methods.forEach(item => {
                    item.params = JSON.stringify(item.params)
                    item.formulas = JSON.stringify(item.formulas)
                })
                submitData.experimentalConfigDetailPoList = submitData.methods
                // 方法数据同时存储于主子表，便于列表获取
                submitData.config = JSON.stringify(submitData.methods)
                delete submitData.methods
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
                    text-align: left;
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
