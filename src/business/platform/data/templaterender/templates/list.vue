<template>
    <div>
        <ibps-crud
            v-if="$utils.isNotEmpty(listConfig)"
            ref="crud"
            :data="listData"
            :pk-key="pkKey"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :show-pagination="showPagination"
            :height="tableHeight"
            :index-row="indexRow"
            :loading="loading"
            :selection-type="selectionType"
            :display-field="displayField"
            :display-field-data="displayFieldData"
            class="hidden-print"
            :dynamic-params="dynamicParams"
            :form-name="template ? template.attrs.form_name : ''"
            :class="{ 'ibps-data-template-list__preview': preview }"
            :selection-all="selectionAll"
            @display-field-change="handleDisplayField"
            @header-dragend="handleHeaderDragend"
            @selection-change="handleSelectionChange"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <!--自定义查询条件-->
            <template v-slot:searchForm>
                <search-form
                    v-if="listConfig.searchForm"
                    ref="searchForm"
                    :forms="listConfig.searchForm.forms || []"
                    :size="listConfig.searchForm.size"
                    :fuzzy="listConfig.searchForm.fuzzy"
                    :inline="listConfig.searchForm.inline"
                    :label-width="listConfig.searchForm.labelWidth"
                    :item-width="listConfig.searchForm.itemWidth"
                    :previous-data-template="dataTemplate"
                    @search="search"
                    @close="handleRenderDialogClose"
                />
            </template>
            <!--数字-->
            <template v-slot:number="scope">
                {{ scope.value | filterNumber(scope.column.field_options) }}
            </template>
            <!--多行-->
            <template v-slot:textarea="scope">
                <div class="ibps-field-text">{{ scope.value }}</div>
            </template>
            <!--富文本框-->
            <template v-slot:editor="scope">
                <span v-html="$utils.formatText(scope.value)" />
            </template>
            <!--数据字典-->
            <template v-slot:dictionary="scope">
                <dictionary-format
                    :value="scope.value"
                    :multiple="$utils.toBoolean(scope.column.field_options.multiple, true)"
                    :dict="{
                        typeKey: scope.column.field_options.dictionary,
                        displayMode: scope.column.field_options.display_mode
                    }"
                />
            </template>
            <!--附件-->
            <template v-slot:attachment="scope">
                <ibps-attachment
                    v-if="$utils.isNotEmpty(scope.column) && scope.value"
                    v-model="scope.value"
                    :multiple="$utils.toBoolean(scope.column.field_options.multiple, true)"
                    :download="false"
                    :store="scope.column.field_options.store"
                    :readonly="true"
                />
            </template>
            <!--选择器-->
            <template v-slot:selector="scope">
                <ibps-user-selector
                    v-if="$utils.isNotEmpty(scope.column)"
                    v-model="scope.value"
                    :type="scope.column.field_options.selector_type || 'user'"
                    :multiple="$utils.toBoolean(scope.column.field_options.multiple, true)"
                    :store="scope.column.field_options.store || 'id'"
                    disabled
                    readonly-text="text"
                />
            </template>
            <!--自定义对话框-->
            <template v-slot:customDialog="scope">
                <ibps-custom-dialog
                    v-if="$utils.isNotEmpty(scope.column)"
                    v-model="scope.value"
                    :template-key="scope.column.field_options.dialog"
                    :multiple="$utils.toBoolean(scope.column.field_options.multiple, true)"
                    :store="scope.column.field_options.store"
                    :store-separator="scope.column.field_options.storeSeparator"
                    :dynamic-params="getLinkDynamicParams(scope.column.field_options, scope.row)"
                    :icon="scope.column.field_options.icon ? 'ibps-icon-' + scope.column.field_options.icon : ''"
                    :type="scope.column.field_options.dialog_type"
                    readonly-text="text"
                    disabled
                />
            </template>
            <!--关联数据-->
            <template v-slot:linkdata="scope">
                <!-- <data-template-format
                    :value="scope.value"
                    :template-key="scope.column.field_options.linkdata"
                    :multiple="$utils.toBoolean( scope.column.field_options.multiple,true)"
                    :dynamic-params="getLinkDynamicParams(scope.column.field_options,scope.row)"
                    :value-key="getLinkValueKey(scope.column.field_options)"
                    :label-type="getLinkLabelType(scope.column.field_options)"
                    :label-key="getLinkLabelKey(scope.column.field_options)"
                > -->
                <ibps-link-data
                    v-if="$utils.isNotEmpty(scope.column)"
                    v-model="scope.value"
                    :template-key="scope.column.field_options.linkdata"
                    :multiple="$utils.toBoolean(scope.column.field_options.multiple, true)"
                    :dynamic-params="getLinkDynamicParams(scope.column.field_options, scope.row)"
                    :has-dynamic-params="hasDynamicParams(scope.column.field_options)"
                    :value-key="getLinkValueKey(scope.column.field_options)"
                    :label-type="getLinkLabelType(scope.column.field_options)"
                    :label-key="getLinkLabelKey(scope.column.field_options)"
                    :structure="getLinkStructure(scope.column.field_options)"
                    :config="getLinkConfig(scope.column.field_options)"
                    :temp-search="true"
                    readonly
                    readonly-text="text"
                    allow-empty-dynamic-params
                />
            </template>
            <!--地址-->
            <template v-slot:address="scope">
                <template v-if="$utils.isNotEmpty(scope.column)">
                    <ibps-address
                        :value="getAddressValue(scope.value, scope.column.field_options)"
                        :size="scope.column.field_options.size"
                        :top="scope.column.field_options.top || 'country'"
                        :top-val="getAddressTopVal(scope.column.field_options)"
                        :level="scope.column.field_options.level || 'district'"
                        data-type="code"
                        :disabled="true"
                        readonly-text="text"
                    />
                    <span v-if="scope.column.field_options.is_street">{{ getStreet(scope.value) }}</span>
                </template>
            </template>
            <!--图片-->
            <template v-slot:image="scope">
                <ibps-image
                    v-if="$utils.isNotEmpty(scope.column)"
                    v-model="scope.value"
                    height="45"
                    width="45"
                    :multiple="$utils.toBoolean(scope.column.field_options.multiple, true)"
                    :download="scope.column.field_options.download"
                    :store="scope.column.field_options.store"
                    :disabled="true"
                />
            </template>

            <template v-slot:customFormatter="scope">
                <div v-html="customFormatter(scope.column.prop, scope.value, scope.row, scope.column)" />
            </template>
        </ibps-crud>

        <data-template-formrender-dialog
            ref="formrender"
            :visible="dialogFormVisible"
            :form-key="formKey"
            :print-template-id="printTemplateId"
            :default-data="defaultFormData"
            :dynamic-params="dynamicParams"
            :pk-value="pkValue"
            :toolbars="editToolbars"
            :readonly="readonly"
            :template-key="dataTemplate.key"
            :add-data-cont="addDataCont"
            @callback="search"
            @close="(visible) => (dialogFormVisible = visible)"
        />
        <!-- 流程定义选择器 -->
        <bpm-def-dialog
            v-model="dialogValue"
            :visible="dialogVisible"
            :form-key="formKey"
            :multiple="false"
            :is-data-template-use="true"
            @close="(visible) => (dialogVisible = visible)"
            @action-event="handleDialogActionEvent"
        />
        <!-- 字段导出  -->
        <ibps-export-columns-dialog
            :visible="exportColumnsVisible"
            :data="template"
            :action="action"
            :pagination="pagination"
            @callback="callbackExtFields"
            @close="(visible) => (exportColumnsVisible = visible)"
        />
        <!-- 字段导入  -->
        <ibps-import-columns-dialog
            :visible="importColumnsVisible"
            :data="template"
            :fields="fields"
            :data-template="dataTemplate"
            @saveUpload="initData"
            @close="(visible) => (importColumnsVisible = visible)"
        />
        <!-- ______________-->
        <ibps-data-template-render-dialog
            :visible="templateDialogVisible"
            :template-key="templateDialogKey"
            :dynamic-params="templateDialogDynamicParams"
            :previous-data-template="dataTemplate"
            @close="handleRenderDialogClose"
            @action-event="handleTemplateDialogActionEvent"
        />
        <!-- 表单打印-->
        <form-print-template
            :id="printTemplateId"
            :pk="pkValue"
            :visible="formPrintTemplateDialogVisible"
            @close="(visible) => (formPrintTemplateDialogVisible = visible)"
        />
        <component
            :is="dialogTemplate"
            v-if="dialogTemplate"
            ref="dialogTemplate"
            v-bind="dialogTemplateAtts"
        />
        <bpmn-formrender
            :visible="npmDialogFormVisible"
            :def-id="defId"
            :instance-id="instanceId"
            :task-id="taskId"
            :add-data-cont="addDataCont"
            @callback="search"
            @close="loadFlowFData"
        />
        <Scan
            v-if="scanVisible"
            :current-scan="scanName"
            :scan-visible="scanVisible"
            :obj="obj"
            @scanOff="scanOff"
        />
        <generalModules v-if="generalShow" :general-show="generalShow" :current-type="currentType" :general-list="generalList" @generalClose="generalClose" />
        <print :show="showPrint" :list="printList" :type="printType" />
        <labelPrint :show="showPrintYi" :list="printList" :type="printType" />

        <import-table
            :visible="importTableDialogVisible"
            title="导入"
            @close="(visible) => (importTableDialogVisible = visible)"
            @action-event="handleImportTableActionEvent"
        />

        <xlsxFile
            v-if="xlsxFileVisible"
            :visible="xlsxFileVisible"
            @xlsxFileClose="xlsxFileClose"
        />

        <ibps-attachment
            ref="snapshot"
            v-model="snapshotFile"
            style="display: none;"
            :download="false"
            :readonly="true"
        />
        <on-line-index :groove-data="grooveData" :groove-list="grooveList" :dialog-visible.sync="grooveDialogVisible" style="z-index: 9999;" />

    </div>
</template>
<script>
import onLineIndex from '@/views/onLineEditing/onLineIndex'

import { queryDataTable, removeFormData, exportData, checkExportData } from '@/api/platform/data/dataTemplate'
import { startFlowFromList } from '@/api/platform/bpmn/bpmInst'
import { getDatabaseType } from '@/api/platform/form/formDef'

import fecha from '@/utils/fecha'
import { debounce, toUpper, toLower } from 'lodash'
import ActionUtils from '@/utils/action'
import FormOptions from '@/business/platform/form/constants/formOptions'
import FormUtils from '@/business/platform/form/utils/formUtil'
import DateFormatUtil from '@/business/platform/form/utils/dateFormatUtil'
import ButtonsConstants, { hasButton, hasSearchPermission } from '@/business/platform/data/constants/buttons'

import { filterNumber } from '../utils'

import BpmDefDialog from '@/business/platform/bpmn/definition/dialog'

import SearchForm from '../../components/search-form/index'
import DataTemplateFormrenderDialog from '../form/dialog'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import IbpsUserSelector from '@/business/platform/org/selector'
import IbpsCustomDialog from '@/business/platform/data/templaterender/custom-dialog'
import IbpsLinkData from '@/business/platform/data/templaterender/link-data'
import IbpsAddress from '@/components/ibps-address/cascader'
import IbpsImage from '@/business/platform/file/image'

import DictionaryFormat from '../components/format/dictionary-format'
// import DataTemplateFormat from '../components/format/data-template-format'

import IbpsExportColumnsDialog from '../components/export-columns-dialog'
import IbpsImportColumnsDialog from '../components/import-columns-dialog'
import CustomDataDisplayMixin from '@/business/platform/system/mixins/customDataDisplay'
import FormPrintTemplate from '@/business/platform/form/form-print/template'
import importTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'

import JTemplate from '../utils/JTemplate' // 自定义脚本
import JDialogTemplate from '../utils/JDialogTemplate' // 对话框自定义脚本

import Scan from '@/views/system/jbdScan/scan.vue'

// import BpmnFormrender from '@/vuew/business/platform/bpmn/form/dialog'//新增流程打开页面
import IbpsExport from '@/plugins/export'
import IbpsImport from '@/plugins/import'
import Vue from 'vue'
Vue.component('ibps-data-template-render-dialog', () => import('@/business/platform/data/templaterender/preview/dialog.vue'))
import xlsxFile from '@/business/platform/data/templaterender/templates/compenent/xlsxFile.vue'
import generalModules from '@/views/system/jbdScan/generalModules.vue'

export default {
    name: 'list',
    components: {
        BpmDefDialog,
        DataTemplateFormrenderDialog,
        FormPrintTemplate,
        SearchForm,
        IbpsAttachment,
        IbpsUserSelector,
        IbpsCustomDialog,
        IbpsLinkData,
        IbpsExportColumnsDialog,
        IbpsImportColumnsDialog,
        IbpsAddress,
        IbpsImage,
        DictionaryFormat,
        Scan,
        importTable,
        Print: () => import('../components/print'),
        LabelPrint: () => import('../components/labelPrint'),
        xlsxFile,
        generalModules,
        onLineIndex

        // BpmnFormrender
        // DataTemplateFormat
    },
    filters: {
        filterNumber (data, fieldOptions = {}) {
            return filterNumber(data, fieldOptions)
        }
    },
    mixins: [CustomDataDisplayMixin],
    props: {
        dataTemplate: Object,
        template: Object,
        dynamicParams: Object,
        composeParams: Object,
        value: [String, Number, Array, Object],
        multiple: Boolean,
        height: [String, Number],
        fields: Object,
        relatedTreeFields: String,
        relatedListFields: String,
        defaultData: [Array, Object],
        preview: {
            type: Boolean,
            default: false
        },
        xlsxFileVisible: false,
        tempSearch: { // 是否是数据模板使用的筛选条件
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            npmDialogFormVisible: false, // 弹窗
            defId: '', // 编辑dialog需要使用
            instanceId: '', // 流程查看办理详情
            taskId: '', // 流程进入当前任务

            dialogValue: {},
            dialogVisible: false,
            sefStartFlowId: '',
            addDataCont: {},
            defaultFormData: {},
            scanVisible: false,
            scanName: '',
            obj: '',
            initialization: false,
            tableHeight: document.body.clientHeight,
            listIdentity: '',
            listData: [],
            listConfig: {
                // 工具栏
                toolbars: [],
                columns: [],
                searchForm: null,
                rowHandle: ''
            },
            pagination: {
                page: 1,
                limit: 20
            },
            form_name: '',
            indexRow: false,
            displayField: '',
            displayFieldData: [],
            showPagination: false,
            sorts: {},
            loading: false,
            key: '',
            pkValue: '',
            formKey: '',
            readonly: false,
            dialogFormVisible: false,
            editButtons: [], // 表单按钮
            editToolbars: [],
            filterConditionKey: '',

            templateDialogVisible: false,
            templateDialogKey: '',
            templateDialogDynamicParams: {},

            exportColumnsVisible: false,
            action: '',
            selecteds: '',

            databaseType: 'lower',

            importColumnsVisible: false,

            selectionAll: this.multiple ? [] : {}, // 所有选中的数据包含跨页数据
            selection: this.multiple ? [] : {}, // 当前页选中的数据
            dialogTemplate: null,
            dialogTemplateAtts: {},
            formPrintTemplateDialogVisible: false,
            printTemplateId: '',
            showPrintYi: false,
            showPrint: false,
            printType: '',
            printList: [],

            importTableDialogVisible: false,
            position: null,
            importList: [],
            importVlaue: null,
            snapshotFile: '',

            generalShow: false,
            currentType: '',
            generalList: [],

            grooveDialogVisible: false,
            grooveData: {
                title: ''
            },
            grooveList: [],
            hadDoSearch: false
        }
    },
    computed: {
        selectionType () {
            return this.multiple ? 'checkbox' : 'radio'
        },
        pkKey () {
            return this.key || 'id_'
        },
        formFieldMap () {
            if (this.$utils.isEmpty(this.fields)) {
                return {}
            }
            const map = {}
            for (const key in this.fields) {
                const field = this.fields[key]
                if (this.$utils.isNotEmpty(field.field_name)) {
                    map[field.field_name.toLowerCase()] = key
                }
            }
            return map
        },
        composeParam () {
            return this.composeParams
        }
    },
    watch: {
        value: {
            handler (val, oldVal) {
                this.selectionAll = val
            },
            immediate: true,
            deep: true
        },
        selectionAll: {
            handler (val, oldVal) {
                this.$emit('selected', val)
            },
            deep: true
        },
        template: {
            handler (val, oldVal) {
                if (!this.template) {
                    return
                }
                this.getDatabaseType()
                this.initUI()
                this.listConfig = null
                this.displayFieldData = []
                this.initParameter()
                // this.initData()
            },
            immediate: true
        },
        height: {
            handler (val, oldVal) {
                this.loadHeight()
            },
            immediate: true
        }
    },
    destroyed () {
        if (this.dataTemplate.type !== 'dialog') {
            JTemplate.cleanEvents()
        }
    },
    methods: {
        getDatabaseType () {
            getDatabaseType().then((response) => {
                this.databaseType = response.data
                this.checkPk(this.dataTemplate.unique)
                this.initData()
            }).catch(() => {
                this.loading = false
            })
        },
        checkPk (pk) {
            let pkKey = pk || 'id_'
            if (this.databaseType === 'upper') {
                pkKey = toUpper(pkKey)
            } else if (this.databaseType === 'lower') {
                pkKey = toLower(pkKey)
            }
            this.key = pkKey
        },
        initUI () {
            this.initialization = false
            if (!this.initialization) {
                this.initJTemplate()
                this.initialization = true
                setTimeout(() => {
                    this.loadScript()
                }, 10)
            }
        },
        loadHeight () {
            if (this.$utils.isNotEmpty(this.height)) {
                this.tableHeight = this.height - 90
            } else {
                if (this.preview) {
                    this.tableHeight = document.body.clientHeight - 30
                } else {
                    this.tableHeight = this.fixHeight()
                }
            }
        },
        getParentEl (parentEl) {
            if (parentEl.$el && parentEl.$el.nodeName !== '#comment') {
                return parentEl.$el
            } else {
                return this.getParentEl(parentEl.$parent)
            }
        },
        fixHeight () {
            const parentEl = this.getParentEl(this.$parent)
            const parentHeight = parentEl.offsetHeight
            // header 高度
            const header = parentEl.getElementsByClassName('ibps-theme-header')
            let headerHeight = 0
            if (header && header[0]) {
                headerHeight = header[0].offsetHeight || 60
            }
            // tab 高度
            const tabs = parentEl.getElementsByClassName('ibps-multiple-page-control-group')
            let tabHeight = 0
            if (tabs && tabs[0]) {
                tabHeight = 40
            }
            return parentHeight - headerHeight - tabHeight
        },
        initData () {
            // if (this.displayField) {
            //     this.listIdentity = 'ibps-dataTempate-' + this.dataTemplate.key
            //     this.loadDisplayField()
            // }
            // 是否初始化查询数据
            if (this.template && this.template.attrs && this.template.attrs.init_query === 'N') {
                this.listData = []
                return
            }
            this.loadData()
        },
        clearSelection () {
            this.$refs['crud'].clearSelection()
            this.$emit('selected', this.multiple ? [] : '')
        },
        handleSelectionChange (selection) {
            this.selection = selection
            setTimeout(() => {
                this.changePageCoreRecordData()
            }, 10)
        },
        /**
         * 记忆选择核心方法
         */
        changePageCoreRecordData () {
            // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
            if (this.$utils.isEmpty(this.selectionAll)) {
                this.selectionAll = this.selection ? JSON.parse(JSON.stringify(this.selection)) : []
                return
            }

            // 标识当前行的唯一键的名称
            const { listData } = this
            // 总选择里面的key集合
            const selectAllIds = this.getSelectAllIds()
            let selectionAll = []
            if (this.multiple) {
                selectionAll = [].concat(this.selectionAll)
            } else {
                selectionAll.push(this.selectionAll)
            }

            // 获取当前页选中的id
            const selectIds = []
            if (this.multiple) {
                this.selection.forEach((row) => {
                    const pkValue = this.getPkValue(row)
                    selectIds.push(pkValue)
                    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
                    if (selectAllIds.indexOf(pkValue) < 0) {
                        selectionAll.push(row)
                    }
                })
            } else {
                if (this.$utils.isNotEmpty(this.selection)) {
                    const pkValue = this.getPkValue(this.selection)
                    selectIds.push(pkValue)
                    if (selectAllIds.indexOf(pkValue) < 0) {
                        selectionAll = []
                        selectionAll.push(this.selection)
                    }
                } else {
                    if (this.$utils.isNotEmpty(this.selectionAll)) {
                        const pkValue = this.getPkValue(this.selectionAll)
                        selectIds.push(pkValue)
                    }
                }
            }

            const noSelectIds = []
            // 得到当前页没有选中的id
            listData.forEach((row) => {
                const pkValue = this.getPkValue(row)
                if (selectIds.indexOf(pkValue) < 0) {
                    noSelectIds.push(pkValue)
                }
            })
            noSelectIds.forEach((id) => {
                if (selectAllIds.indexOf(id) >= 0) {
                    for (let i = 0; i < selectionAll.length; i++) {
                        const pkValue = this.getPkValue(selectionAll[i])
                        if (pkValue === id) {
                            // 如果总选择中有未被选中的，那么就删除这条
                            selectionAll.splice(i, 1)
                            break
                        }
                    }
                }
            })
            if (this.multiple) {
                this.selectionAll = selectionAll
            } else {
                this.selectionAll = selectionAll[0]
            }
        },
        setSelectRow () {
            setTimeout(() => {
                this.setRowSelect()
            }, 10)
        },
        /**
         *  设置选中的方法
         */
        setRowSelect () {
            const tableEl = this.$refs['crud']
            if (!tableEl) {
                return
            }
            // 先清空
            tableEl.clearSelection()
            if (this.$utils.isEmpty(this.selectionAll)) {
                if (!this.multiple) {
                    this.selection = {}
                }
                return
            }
            const { listData } = this
            const selectAllIds = this.getSelectAllIds()
            for (let i = 0; i < listData.length; i++) {
                const row = listData[i]
                if (selectAllIds.indexOf(this.getPkValue(row)) >= 0) {
                    if (this.multiple) {
                        tableEl.toggleSelectionRow(row, true)
                    } else {
                        tableEl.setSelectionRadio(row)
                    }
                }
            }
        },
        /**
         * 获取选择的ID
         */
        getSelectAllIds () {
            const selectAllIds = []
            if (this.$utils.isEmpty(this.selectionAll)) {
                return
            }
            if (this.multiple) {
                this.selectionAll.forEach((row) => {
                    selectAllIds.push(this.getPkValue(row))
                })
            } else {
                selectAllIds.push(this.getPkValue(this.selectionAll))
            }
            return selectAllIds
        },
        /**
         * 根据key获取对象的值
         * 用于解决key值大小写不同的问题
         * @param {Object} data 需要从中获取值的对象
         * @param {Object} defaultValue 默认值
         */
        getPkValue (data, defaultValue = '') {
            const pkKey = this.pkKey || 'id'
            // 创建一个忽略大小写的正则对象
            const regx = new RegExp(`^${pkKey}$`, 'gi')
            // 循环正则匹配
            for (const key in data) {
                // 匹配成功返回值
                if (regx.test(key)) {
                    return data[key]
                }
            }
            return defaultValue
        },
        /**
         * 加载数据
         */
        loadData (outerKey) {
            // 仅模板类型为对话框时触发页内loading事件，其余根据接口判定触发全局loading
            this.loading = this.dataTemplate.type === 'dialog'
            if (this.$utils.isEmpty(this.template)) return
            queryDataTable(this.getFormatParams(outerKey), this.dataTemplate.type).then((response) => {
                this.loading = false
                ActionUtils.handleListData(this, response.data)
                this.setSelectRow()
                if (this.$refs.crud) {
                    this.$refs.crud.handleTableHeight()
                    debounce(() => {
                        if (this.$refs.crud) {
                            this.$refs.crud.handleTableHeight()
                        }
                    }, 100)()
                }
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getFormatParams (outerKey) {
            let formParams = {}
            const refSerchForm = this.$refs['searchForm']
            if (refSerchForm) {
                // 首次查询使用模板配置的默认查询条件
                if (!this.hadDoSearch) {
                    const range = ['datePicker', 'dateRange', 'numberRange']
                    const multiple = ['radio', 'checkbox', 'select']
                    const { query_columns = [] } = this.template || {}
                    const defaultValueField = query_columns.filter(i => i.default_value)
                    defaultValueField.forEach(item => {
                        const getBuildSearchForm = this.buildSearchForm(item)
                        const val = item.default_value.split('&')
                        if (range.includes(item.field_type)) {
                            // 用于渲染查询表单值
                            const index = query_columns.findIndex(i => i.name === item.name)
                            switch (item.field_options.datefmt) {
                                case 'yyyy':
                                // 非多选，传值为数组类型控件
                                    refSerchForm.params[getBuildSearchForm.prop[0]] = val[0] + '-01-01'
                                    refSerchForm.params[getBuildSearchForm.prop[1]] = val[1] + '-12-31'
                                    refSerchForm.params['daterange-prefix' + index] = val[0]
                                    break
                                case 'yyyy-MM':
                                    refSerchForm.params[getBuildSearchForm.prop[0]] = val[0] + '-01'
                                    refSerchForm.params[getBuildSearchForm.prop[1]] = val[1] + '-31'
                                    refSerchForm.params['daterange-prefix' + index] = val[0]
                                    break
                                default:
                                    refSerchForm.params[getBuildSearchForm.prop[0]] = val[0]
                                    refSerchForm.params[getBuildSearchForm.prop[1]] = val[1]
                                    refSerchForm.params['daterange-prefix' + index] = [val[0], val[1]]

                                    break
                            }
                            // refSerchForm.params[getBuildSearchForm.modelValue] = val
                        } else if (multiple.includes(item.field_type)) {
                            // 多选，且传值为数组类型控件
                            refSerchForm.params[getBuildSearchForm.prop] = val
                        } else {
                            refSerchForm.params[getBuildSearchForm.prop] = this.replaceAll(item.default_value, '&', ',')
                        }
                    })
                }

                formParams = refSerchForm.getSearcFormData() || {}
            }
            if (this.$utils.isNotEmpty(this.composeParam) && outerKey === 'outside') {
                for (var i in this.composeParam) {
                    formParams[i] = this.composeParam[i]
                }
            }
            const responseData = JSON.parse(JSON.stringify(this.template))
            responseData.datasetKey = this.dataTemplate.datasetKey
            responseData.unique = this.pkKey
            responseData['dynamic_params'] = this.dynamicParams
            formParams['response_data'] = JSON.stringify(responseData)
            formParams['filter_condition_key'] = this.filterConditionKey
            return ActionUtils.formatParams(formParams, this.pagination, this.sorts)
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            this.changePageCoreRecordData()
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        // 查询数据
        search () {
            this.hadDoSearch = true
            this.loadData()
            this.addDataCont = {}
        },
        /* 流程页面关闭，刷新当前页面*/
        loadFlowFData () {
            this.npmDialogFormVisible = false
            this.addDataCont = {}
        },
        /* 扫码操作*/
        scanHandler (val) {
            this.scanVisible = true
            this.scanName = val
        },
        generalClick (val, list) {
            this.currentType = val
            this.generalList = list
            this.generalShow = true
        },
        generalClose (val = false) {
            this.generalShow = val
        },
        // /*按钮传参*/
        scanHandlerObj (val, obj) {
            this.scanVisible = true
            this.scanName = val
            this.obj = obj
        },
        // 一般验收物料标签打印
        labelPrint (data, type) {
            this.showPrintYi = true
            this.printList = data
            this.printType = type
        },
        // 标签打印
        printTag (data, type) {
            this.showPrint = true
            this.printList = data
            this.printType = type
        },
        /* 返回关闭*/
        scanOff (val) {
            this.scanVisible = false
            this.scanName = ''
            this.search()
        },
        resetSearchForm () {
            if (this.$refs['searchForm']) {
                this.$refs['searchForm'].resetSearchForm()
            }
        },
        /**
         * 获取显示字段
         */
        loadDisplayField () {
            if (!this.preview) {
                this.getCustomDataDisplay(this.listIdentity).then((data) => {
                    this.displayFieldData = data
                })
            } else {
                this.displayFieldData = []
            }
        },
        handleHeaderDragend (newWidth, oldWidth, column, event) {
            if (this.preview /* || !this.displayField */) {
                return
            }
            for (let i = 0; i < this.displayFieldData.length; i++) {
                if (this.displayFieldData[i].prop === column.property) {
                    this.displayFieldData[i].width = parseInt(newWidth)
                }
            }
            this.handleDisplayField(this.displayFieldData, () => {}, false)
        },
        /**
         * 保存显示字段
         */
        handleDisplayField (data, callback, hasMessage) {
            if (!this.preview) {
                this.saveCustomDataDisplay(data, this.listIdentity).then((response) => {
                    if (hasMessage) ActionUtils.success(response.message)
                    callback(true)
                    this.search()
                }).catch(() => {
                    callback(false)
                })
            } else {
                ActionUtils.success('保存成功,该为演示,不保存数据库！')
                callback(true)
            }
        },
        handleAction (command, position, selection, data, index, button) {
            const buttonType = button.button_type || button.key
            this.action = buttonType
            this.position = position
            this.selection = selection

            // 前置事件
            this.beforeScript(command, position, selection, data, () => {
                let src = ''
                this.readonly = false
                const { first = '', second = '' } = this.$store.getters.level || {}
                switch (buttonType) {
                    case 'search': // 查询
                        ActionUtils.setFirstPagination(this.pagination)
                        this.search()
                        break
                    case 'resetSearch': // 重置
                        this.resetSearchForm()
                        ActionUtils.setFirstPagination(this.pagination)
                        this.search()
                        break
                    case 'add': // 添加
                        this.handleEdit(null, command, position, selection, data)
                        break
                    case 'edit': // 编辑
                    case 'detail': // 明细
                        ActionUtils.selectedRecord(selection).then((id) => {
                            this.handleEdit(id, command, position, selection, data)
                        }).catch(() => {})
                        break
                    case 'remove': // 删除
                        ActionUtils.removeRecord(selection).then((ids) => {
                            this.handleRemove(ids, command, position, selection, data)
                        }).catch(() => {})
                        break
                    case 'sefStartFlow': // 启动自定义流程
                        ActionUtils.selectedMultiRecord(selection).then((ids) => {
                            if (button.deflow) {
                                this.$confirm('确定启动流程吗？', '消息', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$message.success('流程任务正在[异步操作]启动中...(期间可做其它操作！)')
                                    this.handleStartFlowFromList(ids, button.deflow, this.getFormKey())
                                }).catch(() => {})
                            } else {
                                this.dialogVisible = true
                                this.dialogValue = {}
                                this.sefStartFlowId = ids
                            }
                        }).catch(() => {})
                        break
                    case 'custom': // 自定义按钮
                        break
                    case 'openTask': // 编制，开启对应流程
                        // console.log(button)
                        if (!button.deflow) {
                            this.$message.warning('请先配置对应流程！')
                            return
                        }
                        this.defId = button.deflow
                        this.addDataCont = button.initAddDataCont
                        this.npmDialogFormVisible = true
                        break
                    case 'consult': // 查阅
                        this.snapshotFile = ''
                        if (data.kuai_zhao_) {
                            this.snapshotFile = data.kuai_zhao_
                            setTimeout(() => {
                                this.$refs.snapshot.handleActionEvent('preview', 0)
                            }, 500)
                        } else {
                            if (!button.reportPath) {
                                this.$message.warning('请先配置对应报表路径！')
                                return
                            }
                            src = `${this.$reportPath.replace('show', 'pdf')}${button.reportPath}&id_=${selection}&org_=${first}&second_=${second}`
                            // console.log(src)
                            this.$common.preview(this, src)
                        }
                        break
                    case 'download': // 下载记录
                        if (!button.reportPath) {
                            this.$message.warning('请先配置对应报表路径！')
                            return
                        }
                        this.$common.snapshoot({
                            url: this.$getReportFile(button.reportPath, `id_=${selection}&org_=${first}&second_=${second}`),
                            name: selection,
                            type: 'pdf'
                        }).then((res) => {
                            if (!res.data || !res.data.id) {
                                this.$message.error('生成文件失败，请重试！')
                                return
                            }
                            this.$common.download(res.data)
                        })
                        break
                    case 'print': // 打印
                        ActionUtils.selectedRecord(selection).then((id) => {
                            this.handlePrint(id)
                        }).catch(() => {})
                        break
                    case 'import': // 导入
                        this.importColumnsVisible = true
                        break
                    case 'exportAll': // 导出所有
                        this.exportActions(buttonType)
                        break
                    case 'exportMuBan': // 导出模板
                        this.exportActions(buttonType)
                        break
                    case 'exportSelected': // 导出选中

                        ActionUtils.selectedMultiRecord(this.getSelectAllIds()).then((ids) => {
                            this.selecteds = ids
                            this.exportActions(buttonType, ids)
                        }).catch(() => {})
                        break
                    case 'exportCurPage': // 导出当前页
                        this.exportActions(buttonType)
                        break
                    default:
                        break
                }
            })
        },
        exportActions (buttonType, ids, exportColumns) {
            const { template } = this
            if (this.$utils.isNotEmpty(template.export_columns)) {
                if (template.export_columns.select_field === 'Y') {
                    this.exportColumnsVisible = true
                    // todo
                } else {
                    this.getResponseData(buttonType, ids)
                }
            } else {
                this.getResponseData(buttonType, ids)
            }
        },
        // 数据导出 小林
        getIbpsExport (columns, data, title, message, nameKey = 'name') {
            IbpsExport.excel({
                columns: columns,
                data: data,
                nameKey: nameKey,
                title: title
            }).then(() => {
                const msg = message || '导出成功'
                ActionUtils.success(msg)
            })
        },
        getResponseData (buttonType, ids, exportColumns) {
            const { template, dataTemplate, fields, pagination, sorts } = this
            const params = {}
            // 取消重置过滤条件
            // template.filter_conditions = []
            let response_data = JSON.parse(JSON.stringify(dataTemplate))
            if (this.$utils.isEmpty(template.export_columns)) {
                const arr = dataTemplate.datasets.filter((d) => d.type !== 'table')
                const select_field = 'N'
                const export_type = 'db'
                const defaultfields = arr.map((a) => {
                    return {
                        name: a.name,
                        label: a.label,
                        fieldType: 'text',
                        rights: [
                            {
                                type: 'all',
                                rightsId: '',
                                rightsName: ''
                            }
                        ]
                    }
                })
                template.export_columns = {
                    select_field: select_field,
                    fields: defaultfields,
                    export_type: export_type
                }
            } else {
                const indexs = []
                let pass = false
                template.export_columns.fields.forEach((f) => {
                    const index = f.rights.findIndex((e) => e.type === 'none')
                    indexs.push(index)
                })
                indexs.forEach((i) => {
                    if (i !== 0) {
                        pass = true
                        return false
                    }
                })
                if (!pass) {
                    this.$message({
                        message: '没有字段可导出！',
                        type: 'warning'
                    })
                    return
                }
            }
            if (this.$utils.isEmpty(this.listData) && buttonType !== 'exportMuBan') {
                this.$message({
                    message: '没有列表数据可导出！',
                    type: 'warning'
                })
                return
            }
            response_data = Object.assign(response_data, template)
            const fieldsArr = []
            for (var f in fields) {
                fieldsArr.push(fields[f])
            }

            response_data.fields = fieldsArr
            params.action = buttonType

            params['response_data'] = JSON.stringify(response_data)
            const searcFormData = this.$refs['searchForm'].getSearcFormData() || {}
            for (const key in searcFormData) {
                params[key] = searcFormData[key]
            }
            if (this.$utils.isNotEmpty(exportColumns)) {
                const export_columns = {
                    export_type: template.export_columns.export_type,
                    fields: exportColumns,
                    select_field: template.export_columns.select_field
                }
                params.export_columns = JSON.stringify(export_columns)
            }
            let saveData

            if (buttonType === 'exportAll' || buttonType === 'exportMuBan') {
                saveData = ActionUtils.formatParams(params, pagination, sorts)
            }
            if (buttonType === 'exportSelected') {
                params.ids = ids
                saveData = ActionUtils.formatParams(params, {}, sorts)
            }
            if (buttonType === 'exportCurPage') {
                saveData = ActionUtils.formatParams(params, pagination, sorts)
            }

            checkExportData(saveData).then((res) => {
                this.handleExportData(saveData)
            }).catch((err) => console.error(err))
        },
        handleExportData (saveData) {
            exportData(saveData).then((response) => {
                if (!response) {
                    return
                }
                ActionUtils.exportFile(response.data, this.dataTemplate.name + '_' + fecha.formatDate('yyyyMMddHHmmss') + '.xls')
            })
        },
        callbackExtFields (data) {
            const { action, selecteds } = this
            this.getResponseData(action, selecteds, data)
        },
        handleStartFlowFromList (id, defKey, formKey) {
            startFlowFromList({
                ids: id,
                defKey: defKey,
                formKey: formKey
            }).then((response) => {
                this.$message({
                    message: '流程启动成功！',
                    type: 'success'
                })
                this.dialogVisible = false
                this.search()
            }).catch(() => {
                this.dialogVisible = false
            })
        },
        handleDialogActionEvent (key, data) {
            if (key === 'clean') {
                this.dialogValue = {}
            }
            if (key === 'confirm') {
                this.handleStartFlowFromList(this.sefStartFlowId, data ? data.defKey : '', this.getFormKey())
            }
        },
        getFormKey () {
            return this.dataTemplate.attrs ? this.dataTemplate.attrs.form_key || '' : ''
        },
        getPrintTemplateId () {
            return this.dataTemplate.attrs ? this.dataTemplate.attrs.print_id || '' : ''
        },
        initParameter () {
            this.formKey = this.getFormKey()
            // 打印模版
            this.printTemplateId = this.getPrintTemplateId()
            // 管理主题
            this.manageEffect = this.template.attrs ? this.$utils.toBoolean(this.template.attrs.manage_effect) : false

            const functionButtons = this.template.buttons ? this.template.buttons.function_buttons || [] : []
            // 工具栏
            const toolbarButtons = []
            // 管理列
            const manageButtons = []

            // 功能按钮
            functionButtons.forEach((rf, i) => {
                const btn = this.buildButton(rf, i)

                if (rf.button_type === 'openTask') {
                    const obj = {}
                    if (rf.initAddDataCont) {
                        const arr1 = rf.initAddDataCont.split('&')
                        for (const i of arr1) {
                            const arr = i.split(':')
                            obj[arr[0]] = arr[1]
                        }
                    }
                    this.defId = rf.deflow
                    this.addDataCont = rf.initAddDataCont ? obj : {}
                }
                // 查询列默认是顶部
                if (hasSearchPermission(rf.button_type) && !rf.position) {
                    rf.position = 'toolbar'
                }
                // if (rf.button_type === 'search') { isHasSearch = true }
                // 顶部按钮
                if (hasButton(rf.button_type, 'toolbar', rf.position)) {
                    btn.position = 'toolbar'
                    toolbarButtons.push(btn)
                }
                // // 查询按钮
                // if (hasButton(rf.button_type, 'search', rf.position)) {
                //   this.response_search_buttons.add(this.getButtonModel(rf))
                // }

                // 管理列按钮
                if (hasButton(rf.button_type, 'manage', rf.position)) {
                    btn.position = 'manage'
                    manageButtons.push(btn)
                }
            })
            let rowHandle = null

            if (this.$utils.isNotEmpty(manageButtons)) {
                rowHandle = {
                    // effect: this.manageEffect ? 'display' : 'default',
                    effect: this.template.attrs.manage_effect === 'Y' ? 'display' : 'default',
                    actions: manageButtons,
                    columnHeader: this.template.attrs.manage_effect === 'Y' || this.template.attrs.manage_effect === 'N' ? null : this.template.attrs.manage_effect,
                    colWidth: this.template.attrs.col_width
                }
            }
            // 查询字段
            const searchForms = []
            this.setQueryColumns(this.template.query_columns || [], searchForms)
            // 显示字段
            const columns = []
            this.setDisplayColumns(this.template.display_columns || [], columns)
            this.listConfig = {
                toolbars: toolbarButtons,
                columns: columns,
                rowHandle: rowHandle,
                searchForm: searchForms.length > 0 ? { forms: searchForms } : null
            }
            // 判断地点是否第一层级
            const position = this.$store.getters.userInfo.positions
            const first = this.$store.getters.level.first
            let showBoolean = false
            if (position && position.length > 0 && first) {
                showBoolean = position.some((item) => item.id === first)
            }
            const columnsShow = this.listConfig.columns.some((item) => item.prop === 'di_dian_')
            if (!showBoolean && columnsShow) {
                this.listConfig.columns.forEach((item) => {
                    if (item.prop === 'di_dian_') {
                        item.hidden = true
                    }
                })
            } else {
                this.listConfig.columns.forEach((item) => {
                    if (item.prop === 'di_dian_') {
                        item.hidden = false
                    }
                })
            }

            // 分页
            this.showPagination = this.template.attrs ? this.template.attrs.need_page === 'Y' : true
            this.pagination.limit = this.template.attrs ? parseInt(this.template.attrs.page_size, 10) || 20 : 20

            // 是否显示字段
            this.displayField = this.template.attrs ? this.template.attrs.display_field : false

            this.indexRow = this.template.attrs ? this.template.attrs.indexRow || false : false
            this.editButtons = this.template.buttons ? this.template.buttons.edit_buttons || [] : []
        },
        setQueryColumns (queryColumns, columns) {
            queryColumns.forEach((column) => {
                const field = this.convertField(column)
                if (field.common === 'N') return
                columns.push(this.buildSearchForm(field))
            })
            return columns
        },
        /**
         * 显示字段
         */
        setDisplayColumns (displayColumns, columns) {
            const fields = ['di_dian_', 'bian_zhi_bu_men_', 'bian_zhi_shi_jian', 'bian_zhi_ren_', 'shi_fou_guo_shen_']
            const allInIt = displayColumns.every(i => fields.includes(i.name))
            displayColumns.forEach((col) => {
                // 修改宽度
                switch (col.name) {
                    case 'di_dian_':
                        col.width = '110'
                        break
                    case 'bian_zhi_bu_men_':
                        col.width = '100'
                        col.label = '部门'
                        break
                    case 'bian_zhi_shi_jian':
                        // col.width = '120'
                        break
                    case 'bian_zhi_ren_':
                        col.width = '100'
                        break
                    case 'shi_fou_guo_shen_':
                        if (col.label === '状态') {
                            col.width = '75'
                        }
                        break
                }
                // 所有字段都在fields范围内 或 之前的所有字段都设置了宽度且最后一个字段在fields范围内时，去除最后一个字段的宽度
                if (allInIt || (displayColumns.every(col => col.width) && fields.includes(displayColumns[displayColumns.length - 1].name))) {
                    displayColumns[displayColumns.length - 1].width = ''
                }
                const field = this.convertField(col)
                const column = this.buildDisplayColumn(field)
                column.sortBy = col.prop
                columns.push(column)
            })
            return columns
        },
        /**
         * 构建按钮
         */
        buildButton (rf, i) {
            const defaultButton = ButtonsConstants[rf.button_type] || {}
            let key = rf.button_type
            let mode
            let rightIcon
            let menus
            if (key === 'custom' || key === 'sefStartFlow') {
                key = rf.code ? rf.code : key + i
            }
            if (rf.button_type === 'export') {
                mode = 'dropdown'
                rightIcon = true
                menus = ButtonsConstants[rf.button_type].menus
            }
            let disabled = false
            let hidden = false
            if (this.hasButtonAction(key, rf)) {
                hidden = (row, data) => {
                    return JTemplate._onLoadActions(this, key, rf, 'hidden', row, data)
                }
                disabled = (row, data) => {
                    return JTemplate._onLoadActions(this, key, rf, 'disabled', row, data)
                }
            }
            const obj = {}
            if (rf.initAddDataCont) {
                const arr1 = rf.initAddDataCont.split('&')
                for (const i of arr1) {
                    const arr = i.split(':')
                    obj[arr[0]] = arr[1]
                }
            }
            return {
                $index: i,
                key: key,
                button_type: rf.button_type,
                code: rf.code,
                label: rf.label || defaultButton.label,
                icon: rf.icon ? 'ibps-icon-' + rf.icon : defaultButton.icon,
                type: rf.style || defaultButton.type,
                deflow: rf.deflow || null,
                // eslint-disable-next-line no-eval
                initAddDataCont: rf.initAddDataCont ? obj : null,
                reportPath: rf.reportPath,
                mode: mode,
                rightIcon: rightIcon,
                menus: menus,
                disabled: disabled,
                hidden: hidden
            }
        },
        // 自定义格式数据事件
        hasButtonAction: function (key, button) {
            const buttonActionResult = JTemplate._onLoadActions(this, key, button)
            if (typeof buttonActionResult !== 'undefined' && buttonActionResult) {
                return true
            }
            return false
        },
        /**
         * 转换字段
         */
        convertField: function (column) {
            const field = this.fields[column.name.toLowerCase()] || null
            const same = !(column['same'] && column['same'] === 'N')
            let fieldType = same ? (field ? field['field_type'] || 'text' : 'text') : column['field_type'] || 'text'
            const fieldOptions = same ? (field ? field['field_options'] || {} : {}) : column['field_options'] || {}
            const dataType = field ? field['type'] || 'varchar' : 'varchar'
            const dataTypeList = ['date', 'timestamp', 'datetime', 'currentTime', 'currentDate']
            // 字段是日期类型
            if (dataTypeList.includes(dataType) && fieldType !== 'datePicker' && fieldType !== 'dateRange') {
                fieldType = 'datePicker'
            }
            if (fieldType === 'datePicker' || fieldType === 'dateRange') {
                const datefmtType = fieldOptions['datefmt_type']
                if (datefmtType !== 'custom') {
                    fieldOptions['datefmt'] = this.getDatefmt(fieldOptions)
                }
            }

            // 处理当前用户，当前组织控件
            if (fieldType === 'currentUser' || fieldType === 'currentOrg' || fieldType === 'currentPosition') {
                fieldType = 'selector'
            }
            column['field_type'] = fieldType
            column['field_options'] = fieldOptions
            column['data_type'] = dataType
            return column
        },
        getDatefmt (fieldOptions) {
            if (fieldOptions['datefmt_type'] && fieldOptions['datefmt_type'] !== 'custom') {
                return FormOptions.t.DATE_FORMATS[fieldOptions['datefmt_type']] || FormOptions.t.DATE_FORMATS['date']
            }
            return fieldOptions['datefmt'] || FormOptions.t.DATE_FORMATS['date']
        },
        buildOptions (options = []) {
            const rtn = []
            options.forEach((option) => {
                rtn.push({
                    value: option.val,
                    label: option.label
                })
            })
            return rtn
        },
        buildSwitchOptions (fieldOptions) {
            return FormUtils.getSwitchOptions(fieldOptions, 'value')
        },
        /**
         * 构建查询条件
         */
        buildSearchForm (field) {
            let querySuffix = 'SL'
            if (field['data_type'] === 'number') {
                querySuffix = 'N'
            }
            let searchColumn = {
                label: field.label
            }
            // 控件类型
            const fieldType = field['field_type']
            const fieldOptions = field['field_options']
            if (fieldType === 'hidden') {
                searchColumn = Object.assign(searchColumn, {
                    prop: `Q^${field.name}^${querySuffix}`,
                    modelValue: `Q^${field.name}^${querySuffix}`,
                    fieldType: fieldType
                })
            } else if (fieldType === 'numberRange') {
                // 数字范围
                searchColumn = Object.assign(searchColumn, {
                    prop: [`Q^${field.name}^NL`, `Q^${field.name}^NG`],
                    modelValue: `Q^${field.name}^${querySuffix}`,
                    fieldType: 'numberRange'
                })
            } else if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
                querySuffix = fieldType === 'radio' ? 'S' : 'SL'
                const prop = `Q^${field.name}^${querySuffix}`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    modelValue: prop,
                    fieldType: 'select',
                    options: this.buildOptions(fieldOptions && fieldOptions.options ? fieldOptions.options : [])
                })
            } else if (fieldType === 'switch') {
                const prop = `Q^${field.name}^S`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    modelValue: prop,
                    fieldType: 'select',
                    options: this.buildSwitchOptions(fieldOptions)
                })
            } else if (fieldType === 'date') {
                const datefmt = fieldOptions.datefmt || ''
                const prop = `Q^${field.name}^D^${datefmt}`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    modelValue: prop,
                    fieldType: 'date',
                    dateType: fieldOptions.datefmt_type ? fieldOptions.datefmt_type : 'date'
                })
            } else if (fieldType === 'datePicker' || fieldType.toLowerCase() === 'daterange') {
                const datefmt = fieldOptions.datefmt || ''
                const dateDealFmt = DateFormatUtil.dealFmt(fieldOptions.datefmt)
                searchColumn = Object.assign(searchColumn, {
                    prop: [`Q^${field.name}^DL^${datefmt}`, `Q^${field.name}^DG^${datefmt}`],
                    modelValue: `Q^${field.name}^${querySuffix}`,
                    fieldType: dateDealFmt.dateType + 'range',
                    field_options: fieldOptions
                })
            } else if (fieldType === 'dictionary') {
                const prop = `Q^${field.name}^SL`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    fieldType: fieldType,
                    modelValue: prop,
                    placeholder: fieldOptions.placeholder || '请选择',
                    field_options: fieldOptions
                })
            } else if (fieldType === 'selector') {
                const prop = `Q^${field.name}^SL`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    fieldType: fieldType,
                    modelValue: prop,
                    placeholder: fieldOptions.placeholder || '请选择',
                    selectorType: fieldOptions.selector_type || 'user',
                    field_options: fieldOptions
                })
            } else if (fieldType === 'customDialog') {
                const prop = `Q^${field.name}^SL`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    modelValue: prop,
                    fieldType: fieldType,
                    field_options: fieldOptions
                })
            } else if (fieldType === 'linkdata') {
                const prop = `Q^${field.name}^SL`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    modelValue: prop,
                    fieldType: fieldType,
                    field_options: fieldOptions
                })
            } else if (fieldType === 'address') {
                const prop = `Q^${field.name}^S`
                searchColumn = Object.assign(searchColumn, {
                    prop: prop,
                    modelValue: prop,
                    fieldType: fieldType,
                    field_options: fieldOptions
                })
            } else {
                searchColumn = Object.assign(searchColumn, {
                    prop: `Q^${field.name}^${querySuffix}`,
                    modelValue: `Q^${field.name}^${querySuffix}`
                })
            }
            if (field.item_width) {
                searchColumn = Object.assign(searchColumn, {
                    itemWidth: field.item_width
                })
            }
            return searchColumn
        },
        buildDisplayColumn (field) {
            const displayColumn = {
                prop: field.name,
                label: field.label,
                align: field.align,
                vertical: field.vertical,
                width: field.width,
                minWidth: field.minWidth,
                hidden: field['field_type'] === 'hidden'
            }
            if (field.type !== 'clob') {
                displayColumn.sortable = this.$utils.isNotEmpty(field.sortable) ? field.sortable : true
            }
            // TODO:没有权限处理**
            // noRightStyle =  field["noRightStyle"];

            const customFormatterResult = this.hasCustomFormatter(field.name)
            if (customFormatterResult) {
                displayColumn.slotName = 'customFormatter'
                displayColumn.field = field
                return displayColumn
            }
            // 控件类型
            const fieldType = field['field_type']
            const fieldOptions = field['field_options']
            const typeList = ['number', 'editor', 'textarea', 'attachment', 'dictionary', 'selector', 'customDialog', 'linkdata', 'address', 'image']
            if (fieldType === 'radio' || fieldType === 'checkbox' || fieldType === 'select') {
                displayColumn.options = this.buildOptions(fieldOptions && fieldOptions.options ? fieldOptions.options : [])
                displayColumn.dataType = fieldType === 'checkbox' ? 'stringArray' : null
            } else if (fieldType === 'switch') {
                displayColumn.options = this.buildSwitchOptions(fieldOptions)
            } else if (fieldType === 'datePicker' || fieldType === 'daterange' || fieldType === 'dateRange') {
                const datefmt = fieldOptions['datefmt'] ? fieldOptions['datefmt'] : 'yyyy-MM-dd HH:mm:ss'
                displayColumn.dateFormat = datefmt
                displayColumn.origDateFormat = fieldOptions['datefmt_type'] !== 'custom' ? datefmt : 'yyyy-MM-dd HH:mm:ss'
            } else if (typeList.includes(fieldType)) {
                displayColumn.slotName = fieldType
                displayColumn.field_options = fieldOptions
            }
            return displayColumn
        },
        // 自定义格式数据事件
        hasCustomFormatter: function (name) {
            const customFormatterResult = JTemplate._customFormatter(this, name)
            if (typeof customFormatterResult !== 'undefined' && customFormatterResult) {
                return true
            }
            return false
        },
        customFormatter (name, value, rowData, column) {
            return JTemplate._customFormatter(this, name, value, rowData, column)
        },
        hasDynamicParams (fieldOptions) {
            return FormUtils.hasLinkDynamicParams(fieldOptions)
        },
        getLinkDynamicParams (fieldOptions, data) {
            return FormUtils.getLinkDynamicParams(fieldOptions, data, this.formFieldMap)
        },
        getLinkValueKey (fieldOptions, data) {
            return FormUtils.getLinkValueKey(fieldOptions, data)
        },
        getLinkLabelType (fieldOptions, data) {
            return FormUtils.getLinkLabelType(fieldOptions, data)
        },
        getLinkLabelKey (fieldOptions, data) {
            return FormUtils.getLinkLabelKey(fieldOptions, data)
        },
        getLinkStructure (fieldOptions, data) {
            return FormUtils.getLinkStructure(fieldOptions)
        },
        getLinkConfig (fieldOptions, data) {
            return FormUtils.getLinkConfig(fieldOptions)
        },
        getStreet (value) {
            if (this.$utils.isNotEmpty(value)) {
                const data = this.$utils.parseJSON(value)
                return data['street'] || ''
            }
            return ''
        },
        getAddressValue (value, fieldOptions) {
            return FormUtils.getAddressControlValue(value, fieldOptions)
        },
        getAddressTopVal (fieldOptions) {
            return FormUtils.getAddressTopVal(fieldOptions)
        },
        /**
         * 添加、编辑表单
         */
        handleEdit (pkValue, action = 'edit', position, selection, data) {
            this.formKey = this.getFormKey()
            if (this.$utils.isEmpty(this.formKey)) {
                ActionUtils.warning('请绑定表单')
                return
            }
            if (this.relatedTreeFields && this.$utils.isNotEmpty(this.defaultData)) {
                const selection = this.defaultData[this.relatedTreeFields]
                this.defaultFormData = action === 'add' ? this.getDefaultFormData(selection) : null
            } else {
                this.defaultFormData = {}
            }
            this.readonly = action === 'detail'
            const editToolbars = []
            this.editButtons.forEach((rf, i) => {
                const btn = this.buildButton(rf, i)
                const buttonType = action === 'add' ? 'edit' : action
                // 编辑页顶部按钮
                if (hasButton(rf.button_type, buttonType, rf.position)) {
                    editToolbars.push(btn)
                }
            })
            this.editToolbars = editToolbars
            this.pkValue = pkValue || ''
            this.afterScript(action, position, pkValue, data, () => {
                this.dialogFormVisible = true
            })
        },
        /**
         * 删除表单
         */
        handleRemove (ids, action, position, selection, data) {
            if (this.$utils.isEmpty(this.formKey)) {
                ActionUtils.warning('请绑定表单')
                return
            }
            removeFormData({
                formKey: this.formKey,
                ids: ids
            }).then((response) => {
                this.afterScript(action, position, selection, data, () => {
                    ActionUtils.removeSuccessMessage()
                    this.search()
                })
            }).catch(() => {})
        },
        handlePrint (ids) {
            if (this.$utils.isNotEmpty(this.printTemplateId)) {
                this.pkValue = ids
                // 打开打印模版页面
                this.formPrintTemplateDialogVisible = true
            }
        },
        handleTemplateDialogActionEvent () {
            // TODO:
        },
        getDefaultFormData (selection) {
            const parentIdField = this.fields[this.relatedListFields] || {}
            // 如果不是就按命名规律
            const pidKey = parentIdField ? parentIdField.field_name || this.relatedListFields : this.relatedListFields
            return { [pidKey]: selection }
        },

        // 自定义导入  小林
        handleImport (data = []) {
            this.importList = data
            this.importVlaue = this.getKeys(this.importList)
            this.importTableDialogVisible = true
        },
        handleImportTableActionEvent (file, options) {
            this.loading = false
            const formData = this.setValue(this.importVlaue)
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
                const list = []
                results.forEach((item) => {
                    const data = JSON.parse(JSON.stringify(formData))
                    for (const key in item) {
                        if (this.importVlaue[key]) {
                            data[this.importVlaue[key]] = item[key]
                        }
                    }
                    list.push(data)
                })
                this.importTableDialogVisible = false
                // results
                this.afterScript('multipleImport', this.position, this.selection, list, () => {})
                // ActionUtils.success('导入成功')
            })
        },
        setValue (data) {
            const obj = {}
            Object.values(data).forEach((item) => {
                obj[item] = ''
            })
            return obj
        },
        getKeys (data) {
            const obj = {}
            if (data.length > 0) {
                data.forEach((item) => {
                    obj[item.label] = item.name
                })
                return obj
            } else {
                return obj
            }
        },
        xlsxFileClick () {
            this.xlsxFileVisible = true
        },
        xlsxFileClose () {
            this.xlsxFileVisible = false
        },
        getGroo (data, list) {
            this.grooveData = data
            this.grooveList = list
            this.grooveDialogVisible = true
        },

        // =================================处理脚本================================
        /**
         * 初始化脚本
         */
        initJTemplate () {
            const { data_title = '' } = this.template.attrs
            const id = data_title && !this.tempSearch ? 'JDialogTemplate' : 'JTemplate'
            let script = document.getElementById(id)
            if (script) {
                script.parentNode.removeChild(script)
            }
            if (this.dataTemplate.attrs && this.dataTemplate.attrs.script) {
                const codeScript = this.dataTemplate.attrs.script
                script = document.createElement('script')
                script.type = 'text/javascript'
                script.id = id
                document.body.appendChild(script)
                try {
                    script.appendChild(document.createTextNode(codeScript))
                } catch (ex) {
                    script.text = codeScript
                }
                document.body.appendChild(script)
            }
        },
        // 处理脚本
        hasScript () {
            return true
        },
        // 加载脚本
        loadScript () {
            if (!this.hasScript()) {
                return
            }
            // type:default，那么表示是一般的列表
            // type:dialog,表示对话框列表
            // tempSearch为true的时候是列表搜索框点击打开的对话框
            if (this.dataTemplate.type == 'default' || this.tempSearch) {
                // 脚本里打开的对话框列表，不需要执行本模块代码，否则会执行到底层列表的onload脚本
                JTemplate._onLoad(this)
            }
        },
        // 前置脚本
        beforeScript (action, position, selection, data, callback) {
            if (!this.hasScript()) {
                const flag = true
                callback(flag)
                return
            }
            JTemplate._beforeSubmit(this, action, position, selection, data, callback)
        },
        // 后置脚本
        afterScript (action, position, selection, data, callback) {
            if (!this.hasScript()) {
                const flag = true
                callback(flag)
                return
            }
            JTemplate._afterSubmit(this, action, position, selection, data, callback)
        },
        // 替换字符串中指定的字符
        replaceAll (str, find, replace) {
            if (str.indexOf(find) === -1) {
                return str
            }
            return this.replaceAll(str.replace(find, replace), find, replace)
        },
        // 数据模板打开数据模板时候，被打开的数据模板弹框关闭逻辑
        handleRenderDialogClose (visible, previousDataTemplate) {
            this.dataTemplate = previousDataTemplate
            this.templateDialogVisible = visible
            this.initJTemplate()
        }
    }
}
</script>
<style lang="scss">
.ibps-data-template-list__preview {
    .ibps-toolbar .tools {
        padding-right: 40px !important;
    }
}
</style>
