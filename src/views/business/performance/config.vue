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
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
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
                        <el-col :span="6">
                            <el-form-item label="排序" prop="sn" :show-message="false">
                                <el-input-number
                                    v-model="formData.sn"
                                    type="number"
                                    :min="1"
                                    :max="99"
                                    :disabled="readonly"
                                    :precision="0"
                                />
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="4">
                            <el-form-item label="图标" prop="icon">
                                <el-input
                                    v-model="formData.icon"
                                    type="text"
                                    clearable
                                    :maxlength="32"
                                    :disabled="readonly"
                                    placeholder="请输入"
                                />
                            </el-form-item>
                        </el-col> -->
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
                                    <el-dropdown-item :disabled="readonly && method.isBasic === 'Y'" command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <el-row :gutter="20" class="form-row">
                            <el-col :span="8">
                                <el-form-item label="方法名称" :prop="`methods[${mIndex}].methodName`" required :show-message="false">
                                    <el-input
                                        v-model="method.methodName"
                                        type="text"
                                        show-word-limit
                                        :maxlength="64"
                                        :disabled="readonly && method.isBasic === 'Y'"
                                        @input="handleNameChange"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="方法类型" :prop="`methods[${mIndex}].methodType`" required :show-message="false">
                                    <el-select
                                        v-model="method.methodType"
                                        :disabled="readonly && method.isBasic === 'Y'"
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
                                <el-form-item label="方法KEY" :prop="`methods[${mIndex}].methodKey`" required :show-message="false">
                                    <el-select
                                        v-model="method.methodKey"
                                        :disabled="readonly && method.isBasic === 'Y'"
                                        placeholder="请选择"
                                    >
                                        <el-option
                                            v-for="(item, index) in methodKeyOption.filter(i => i.type === formData.targetKey)"
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
                                        :disabled="readonly && method.isBasic === 'Y'"
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
                            <template v-if="method.isBasic === 'N' || isSuper">
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
                        <el-tabs tab-position="left" class="inner-tabs">
                            <el-tab-pane label="实验步骤">
                                <el-input
                                    v-model="method.step"
                                    type="textarea"
                                    :maxlength="2000"
                                    show-word-limit
                                    :rows="16"
                                    :disabled="readonly && method.isBasic === 'Y'"
                                />
                            </el-tab-pane>
                            <el-tab-pane label="判定标准">
                                <el-input
                                    v-model="method.criterion"
                                    type="textarea"
                                    :maxlength="2000"
                                    show-word-limit
                                    :rows="16"
                                    :disabled="readonly && method.isBasic === 'Y'"
                                />
                            </el-tab-pane>
                            <el-tab-pane label="参考资料">
                                <ibps-attachment
                                    v-model="method.references"
                                    allow-download
                                    download
                                    multiple
                                    accept="*"
                                    store="id"
                                    :readonly="readonly && method.isBasic === 'Y'"
                                />
                            </el-tab-pane>
                            <el-tab-pane label="实验参数">
                                <div v-if="!readonly || method.isBasic === 'N'" class="operate-btn">
                                    <el-button
                                        v-for="btn in tableToolbars"
                                        :key="btn.key"
                                        :type="btn.type"
                                        :icon="btn.icon"
                                        :size="btn.size || 'mini'"
                                        plain
                                        @click="handleActionEvent(btn.key, 'params', mIndex)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    ref="configTable"
                                    :data="method.params"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    :max-height="maxHeight"
                                    class="config-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.params, 'params')"
                                >
                                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                                    <el-table-column
                                        v-for="(item, pIndex) in paramColumn"
                                        :key="pIndex"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.minWidth"
                                        header-align="center"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <template v-if="item.key === 'default' && scope.row.key">
                                                <!-- 对 default 列进行特殊处理 -->
                                                <el-input-number
                                                    v-if="paramListMap[scope.row.key].type === 'number'"
                                                    v-model="scope.row[item.key]"
                                                    type="number"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                    :min="paramListMap[scope.row.key].min"
                                                    :max="paramListMap[scope.row.key].max"
                                                    :precision="paramListMap[scope.row.key].precision"
                                                />
                                                <el-select
                                                    v-else-if="paramListMap[scope.row.key].type === 'select'"
                                                    v-model="scope.row[item.key]"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                    placeholder="请选择"
                                                    filterable
                                                >
                                                    <el-option
                                                        v-for="(f, index) in paramListMap[scope.row.key].fieldOption.selectOptions"
                                                        :key="index"
                                                        :label="f.label"
                                                        :value="f.value"
                                                    />
                                                </el-select>
                                                <el-switch
                                                    v-else-if="paramListMap[scope.row.key].type === 'switch'"
                                                    v-model="scope.row[item.key]"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                    :active-text="paramListMap[scope.row.key].fieldOption.activeText"
                                                    :inactive-text="paramListMap[scope.row.key].fieldOption.inactiveText"
                                                    :active-value="paramListMap[scope.row.key].fieldOption.activeValue"
                                                    :inactive-value="paramListMap[scope.row.key].fieldOption.inactiveValue"
                                                />
                                                <el-input
                                                    v-else
                                                    v-model="scope.row[item.key]"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                />
                                            </template>
                                            <template v-else-if="['min', 'max', 'precision'].includes(item.key) && scope.row.key">
                                                <el-input-number
                                                    v-if="paramListMap[scope.row.key].type === 'number'"
                                                    v-model="scope.row[item.key]"
                                                    type="number"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                    :min="paramListMap[scope.row.key].min"
                                                    :max="paramListMap[scope.row.key].max"
                                                    :precision="item.key === 'precision' ? 0 : paramListMap[scope.row.key].precision"
                                                />
                                                <div v-else>/</div>
                                            </template>
                                            <template v-else>
                                                <el-switch
                                                    v-if="item.type === 'switch'"
                                                    v-model="scope.row[item.key]"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                />
                                                <el-input-number
                                                    v-else-if="item.type === 'number'"
                                                    v-model="scope.row[item.key]"
                                                    type="number"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                    :min="item.min"
                                                    :max="item.max"
                                                    :precision="item.precision"
                                                />
                                                <el-select
                                                    v-else-if="item.type === 'select'"
                                                    v-model="scope.row[item.key]"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                    placeholder="请选择"
                                                    filterable
                                                    @change="handleFieldChange(mIndex, scope, item.key, 'params')"
                                                >
                                                    <el-option
                                                        v-for="(f, index) in item.options"
                                                        :key="index"
                                                        :label="f.key"
                                                        :value="f.key"
                                                        :disabled="method.params.map(i => i.key).includes(f.key)"
                                                    />
                                                </el-select>
                                                <el-input
                                                    v-else
                                                    v-model="scope.row[item.key]"
                                                    :disabled="readonly && method.isBasic === 'Y'"
                                                />
                                            </template>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="!readonly" fixed="right" label="操作" width="50" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'params', mIndex)" /></a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="实验公式">
                                <div v-if="!readonly || method.isBasic === 'N'" class="operate-btn">
                                    <el-button
                                        v-for="btn in tableToolbars"
                                        :key="btn.key"
                                        :type="btn.type"
                                        :icon="btn.icon"
                                        :size="btn.size || 'mini'"
                                        plain
                                        @click="handleActionEvent(btn.key, 'formulas', mIndex)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    ref="formulaTable"
                                    :data="method.formulas"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    :max-height="maxHeight"
                                    class="formula-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.formulas, 'formulas')"
                                >
                                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                                    <el-table-column
                                        v-for="(item, fIndex) in formulaColumn"
                                        :key="fIndex"
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
                                                :disabled="readonly && method.isBasic === 'Y'"
                                            />
                                            <el-select
                                                v-if="item.type === 'select'"
                                                v-model="scope.row[item.key]"
                                                :disabled="readonly && method.isBasic === 'Y'"
                                                placeholder="请选择"
                                                allow-create
                                                filterable
                                                @change="handleFieldChange(mIndex, scope, item.key, 'formulas')"
                                            >
                                                <el-option
                                                    v-for="(f, index) in item.options"
                                                    :key="index"
                                                    :label="f.label"
                                                    :value="f.label"
                                                />
                                            </el-select>
                                            <el-input
                                                v-else
                                                v-model="scope.row[item.key]"
                                                :disabled="readonly && method.isBasic === 'Y'"
                                            />
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="!readonly || method.isBasic !== 'Y'" fixed="right" label="操作" width="70" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <div class="inline-operate">
                                                <a><i class="el-icon-view" @click="handlePreview(scope.row)" /></a>
                                                <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'formulas', mIndex)" /></a>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="结论模板">
                                <codemirror v-model="method.template" :options="cmConfg" />
                                <!-- <ibps-ueditor v-model="method.templateDesc" class="editor" :config="ueditorConfig" /> -->
                            </el-tab-pane>
                            <el-tab-pane label="图表配置">
                                <div v-if="!readonly || method.isBasic === 'N'" class="operate-btn">
                                    <el-button
                                        v-for="btn in tableToolbars"
                                        :key="btn.key"
                                        :type="btn.type"
                                        :icon="btn.icon"
                                        :size="btn.size || 'mini'"
                                        plain
                                        @click="handleActionEvent(btn.key, 'chartOption', mIndex)"
                                    >
                                        {{ btn.label }}
                                    </el-button>
                                </div>
                                <el-table
                                    ref="chartTable"
                                    :data="method.chartOption"
                                    border
                                    stripe
                                    highlight-current-row
                                    style="width: 100%"
                                    :max-height="maxHeight"
                                    class="formula-table"
                                    @selection-change="selection => handleSelectionChange(selection, method.chartOption, 'chartOption')"
                                >
                                    <el-table-column type="selection" width="45" header-align="center" align="center" />
                                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                                    <el-table-column
                                        v-for="(item, cIndex) in chartColumn"
                                        :key="cIndex"
                                        :prop="item.key"
                                        :label="item.label"
                                        :width="item.width"
                                        :min-width="item.minWidth"
                                        header-align="center"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <el-input
                                                v-if="item.type === 'textarea'"
                                                v-model="scope.row[item.key]"
                                                type="textarea"
                                                :rows="4"
                                                :disabled="readonly && method.isBasic === 'Y'"
                                            />
                                            <el-input
                                                v-else
                                                v-model="scope.row[item.key]"
                                                :disabled="readonly && method.isBasic === 'Y'"
                                            />
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="!readonly || method.isBasic !== 'Y'" fixed="right" label="操作" width="50" header-align="center" align="center">
                                        <template slot-scope="scope">
                                            <a><i class="el-icon-delete" @click="handleRemove(scope.$index, 'chartOption', mIndex)" /></a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-form>
        <formula-preview
            v-if="showFormula"
            :show.sync="showFormula"
            :formula="formulaInfo"
            @close="() => showFormula = false"
        />
    </el-dialog>
</template>

<script>
import { configFormRules, paramColumn, formulaColumn, chartColumn, paramList, formulaList, chartList, methodTypeOption, methodKeyOption, cmConfg } from './constants/index'
import { getConfigDetail, saveConfig } from '@/api/business/pv'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/addon/selection/active-line.js'
export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector'),
        IbpsUeditor: () => import('@/components/ibps-ueditor'),
        FormulaPreview: () => import('./components/formula-preview'),
        codemirror
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
            paramColumn,
            paramList,
            formulaColumn,
            formulaList,
            chartColumn,
            chartList,
            methodTypeOption,
            methodKeyOption,
            cmConfg,
            maxHeight: document.body.clientHeight - 438 + 'px',
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
            selectionIndex: {
                params: [],
                formulas: [],
                chartOption: []
            },
            showFormula: false,
            formulaInfo: {},
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
                initialFrameWidth: '100%',
                initialStyle: 'body { font-size: 14px; }'
            },
            initMethod: {
                methodName: '方法',
                methodType: '',
                methodKey: '',
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
                chartOption: []
            }
        }
    },
    computed: {
        paramListMap () {
            return this.paramList.reduce((acc, cur) => {
                acc[cur.key] = cur
                return acc
            }, {})
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
                    item.chartOption = this.$utils.isNotEmpty(item.chartOption) ? JSON.parse(item.chartOption) : []
                })
                this.formData = { icon, sn, target, targetKey, id: this.targetId, methods }
                this.methodTabs = methods.sort((a, b) => a.sn - b.sn)
                this.activeTab = this.methodTabs[0].methodName
                this.loadCompleted = true
            }).catch(() => {
                this.loading = false
            })
        },
        handleTabClick (tab) {
            const t = this.methodTabs.findIndex(item => item.methodName === tab.name)
            // 外层tab切换清除选中数据
            if (t !== this.activeTabIndex) {
                this.$nextTick(() => {
                    this.selectionIndex = {
                        params: [],
                        formulas: [],
                        chartOption: []
                    }
                    this.$refs.configTable[this.activeTabIndex].clearSelection()
                    this.$refs.formulaTable[this.activeTabIndex].clearSelection()
                    this.$refs.chartTable[this.activeTabIndex].clearSelection()
                    this.activeTabIndex = t
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
            copyData.id = this.$utils.guid()
            copyData.methodName += ' (复制)'
            copyData.isBasic = 'N'
            copyData.isDisabled = 'N'
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
                this.activeTab = methods.length ? methods[0].methodName : ''
            }).catch(() => {})
        },
        addMethod () {
            const data = JSON.parse(JSON.stringify(this.initMethod))
            data.sn = this.methodTabs.length + 1
            data.methodName += data.sn
            data.id = this.$utils.guid()
            data.isBasic = 'N'
            data.isDisabled = 'N'
            data.params = []
            data.formulas = []
            data.chartOption = []
            this.formData.methods.push(data)
            this.activeTab = data.methodName
        },
        handleActionEvent (key, type, index) {
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
                    if (!this.selectionIndex[type].length) {
                        return this.$message.warning('请选择要删除的数据')
                    }
                    this.handleRemove(this.selectionIndex[type], type, index)
                    break
                default:
                    break
            }
        },
        validate (data) {
            const { methods = [] } = data
            var msg = ''
            for (const item of methods) {
                const { methodName, step, criterion, params = [], formulas = [], template, chartOption = [], isDisabled } = item
                if (!step || !criterion || !template) {
                    msg = `【${methodName}】实验步骤、判定标准、结论模板、实验参数为必填信息，请补充完整`
                    break
                }
                const pE1 = !(params && params.length) && isDisabled === 'N'
                const pE2 = params.some(i => !i.key || !i.label)
                const fE = formulas && formulas.length && formulas.some(i => !i.key || !i.label || !i.value)
                const cE = chartOption && chartOption.length && chartOption.some(i => !i.key || !i.label || !i.value)
                if (pE1) {
                    msg = `【${methodName}】未配置实验参数，请配置实验参数或将方法禁用！`
                    break
                }
                if (pE2) {
                    msg = `【${methodName}】实验参数中的参数、名称为必填信息，请补充完整`
                    break
                }
                if (fE) {
                    msg = `【${methodName}】实验公式中的名称、编码及表达式为必填信息，请补充完整或删除空数据`
                    break
                }
                if (cE) {
                    msg = `【${methodName}】图表配置中的名称、编码及配置项为必填信息，请补充完整或删除空数据`
                    break
                }
            }
            if (msg) {
                this.$message.warning(msg)
                return false
            }
            return true
        },
        handleSave () {
            this.$refs.configForm.validate((valid) => {
                if (!valid) {
                    return this.$message.warning('请完善表单必填项信息！')
                }
                const isValidate = this.validate(this.formData)
                if (!isValidate) {
                    return
                }
                const submitData = JSON.parse(JSON.stringify(this.formData))
                submitData.methods.forEach(item => {
                    const temp = this.getNumberStep(item.params)
                    item.params = JSON.stringify(temp)
                    item.formulas = JSON.stringify(item.formulas)
                    item.chartOption = JSON.stringify(item.chartOption)
                })
                submitData.experimentalConfigDetailPoList = submitData.methods
                // 方法数据同时存储于主子表，便于列表获取
                submitData.config = JSON.stringify(submitData.methods)
                delete submitData.methods
                console.log(submitData)
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
            this.selectionIndex[type] = v.map(item => data.indexOf(item))
        },
        handleFieldChange (methodIndex, { $index, row }, key, type) {
            const args = {
                params: ['label', 'default', 'max', 'min', 'precision', 'isVisible', 'isReadonly'],
                formulas: ['key', 'value'],
                chartOption: []
            }
            const dataset = {
                params: this.paramList,
                formulas: this.formulaList,
                chartOption: this.chartList
            }
            const t = dataset[type].find(i => i[key] === row[key])
            args[type].forEach(i => {
                this.methodTabs[methodIndex][type][$index][i] = t ? t[i] : ''
            })
        },
        handlePreview (row) {
            this.formulaInfo = row
            this.showFormula = true
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
        // 获取数值类型参数步长
        getNumberStep (data) {
            if (!data || !data.length) {
                return []
            }
            return data.map(item => {
                if (this.$utils.isNotEmpty(item.precision)) {
                    return { ...item, step: 10 ** -item.precision }
                } else {
                    return item
                }
            })
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
                .inline-operate {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    a:hover {
                        color: #409eff;
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
                                height: calc(100vh - 410px);
                                overflow: auto;
                            }
                            .el-input-number--small {
                                width: 100%;
                            }
                            .editor {
                                .edui-editor {
                                    width: auto !important;
                                }
                            }
                            .hidden-column {
                                display: none;
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
            }
        }
    }
</style>
