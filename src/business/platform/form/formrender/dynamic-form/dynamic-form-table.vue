<template>
    <div v-if="!tableHidden && dynamicShow" class="dynamic-form-table">
        <template v-if="columns && columns.length > 0">
            <!--================表内和弹窗模式=================================-->
            <div v-if="mode === 'inner' || mode === 'dialog'" class="dynamic-form-table__inner panel panel-info">
                <div class="panel-heading ibps-clearfix">
                    <div v-if="!formDialogVisible" class="ibps-fl dynamic-form-table__label table-tetle-style">{{ field.label }}</div>
                    <!--弹窗模式对话框-->
                    <div v-if="toolbarButtons && toolbarButtons.length > 0" class="ibps-fr hidden-print">
                        <el-button-group>
                            <el-button
                                v-for="(button, index) in toolbarButtons"
                                :key="index"
                                :type="button.type"
                                :icon="button.icon"
                                @click="handleActionEvent(button, index)"
                            >
                                {{ button.label }}
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
                <div class="panel-body">
                    <el-table
                        ref="elTable"
                        :data="copDataModel"
                        :header-cell-style="{ color: '#000', 'font-size': '14px', padding: '4px 0' }"
                        :row-class-name="tableRowClassName"
                        :show-summary="showSummary"
                        :sum-text="sumText"
                        :summary-method="hasSummaryMethod ? summaryMethod : null"
                        border
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column v-if="!tableReadonly" type="selection" width="50" />
                        <el-table-column
                            v-if="field.field_options.index"
                            type="index"
                            :label="field.field_options.index_name ? field.field_options.index_name : '序号'"
                            :width="field.field_options.index_width ? field.field_options.index_width : 50"
                            :index="indexMethod"
                        />
                        <template v-for="(column, j) in displayColumns">
                            <el-table-column
                                v-if="!columnHidden(column) && column.field_type != 'desc' && column.label != ''"
                                :key="j"
                                show-overflow-tooltip
                                :prop="column.name"
                                :width="column.field_options.custom_class || null"
                            >
                                <template slot="header">
                                    {{ $utils.isNotEmpty(column.field_options.units) ? column.label + '(' + column.field_options.units + ')' : column.label }}
                                    <ibps-help v-if="column && column.desc && descPosition === 'lableIcon'" type="tooltip" :content="$utils.formatText(column.desc)" />
                                </template>
                                <template slot-scope="scope">
                                    <template v-if="copDataModelCont && copDataModelCont.length > 0 && dynamicShow">
                                        <ibps-dynamic-form-table-item
                                            :ref="'formItem' + column.name"
                                            :key="scope.$index + j"
                                            :models.sync="copDataModelCont[scope.$index + (currentPage - 1) * pageSize]"
                                            :rights.sync="columnsRights"
                                            :form-data="models"
                                            :field="column"
                                            :main-code="mainCode"
                                            :code="code"
                                            :row="scope.$index"
                                            :mode="mode"
                                            :params="params"
                                            :curr-page="currentPage"
                                            @updateModel="updateModel"
                                            v-on="listeners"
                                        />
                                    </template>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column
                            v-if="manageButtons && manageButtons.length > 0"
                            align="center"
                            fixed="right"
                            class-name="hidden-print"
                            label="操作栏目"
                            :width="colWidth ? colWidth : (manageButtons.length == 1 ? '85' : '160')"
                        >
                            <template slot-scope="scope">
                                <el-dropdown v-if="manageButtons.length > 3">
                                    <ibps-icon name="chevron-circle-down" size="28" class="hidden-print" />
                                    <el-dropdown-menu slot="dropdown" class="ibps-table-dropdown-menu" style="margin-top: 0.02rem">
                                        <ibps-toolbar
                                            :actions="manageButtons"
                                            :socpe="thatSocpe"
                                            :data="scope.row"
                                            position="manage"
                                            class="hidden-print"
                                            @action-event="(action) => handleActionEvent(action, scope.$index)"
                                        />
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <template v-else>
                                    <template v-for="(button, index) in manageButtons">
                                        <el-link
                                            :key="index"
                                            :icon="button.icon"
                                            :type="button.type"
                                            :underline="false"
                                            @click="handleActionEvent(button, scope.$index)"
                                        >{{ button.label }}</el-link>
                                        <!-- <el-button plain size="mini" :key="index" :type="button.type" @click="handleActionEvent(button, scope.$index)">
                                            {{ button.label }}
                                        </el-button> -->
                                        <!-- (manageButtons.length === 3 && index === 0) || index === 1 -->
                                        <el-divider v-if="index !== manageButtons.length - 1" :key="index" direction="vertical" />
                                    </template>
                                </template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <el-pagination
                        v-if="needPage !== 'N' && (mode === 'dialog' || mode === 'inner')"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :page-sizes="pageSizeOptions"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                    />
                </div>
            </div>
            <!--================表内和弹窗模式end=================================-->
            <!--================块模式=================================-->
            <template v-else-if="mode === 'block'">
                <template v-if="dataModel && dataModel.length > 0">
                    <template v-for="(data, index) in dataModel">
                        <div :key="index" class="dynamic-form-table__block panel panel-info">
                            <div class="panel-heading ibps-clearfix">
                                <!--块模式：工具栏-->
                                <div class="ibps-fl dynamic-form-table__label"><el-badge v-if="field.field_options.index" :value="index + 1" type="primary" style="top: 0.3em" />{{ field.label }}</div>
                                <div v-if="toolbarButtons && toolbarButtons.length > 0" class="ibps-fr">
                                    <el-button-group>
                                        <template v-for="(button, b) in toolbarButtons">
                                            <template v-if="!(button.key === 'remove' && dataModel.length === 1)">
                                                <el-button :key="b" :type="button.type" :icon="button.icon" @click="handleActionEvent(button, b)">
                                                    {{ button.label }}
                                                </el-button>
                                            </template>
                                        </template>
                                    </el-button-group>
                                </div>
                            </div>

                            <!--块模式：表单-->
                            <div class="panel-body">
                                <ibps-dynamic-form-table-block
                                    v-for="(column, j) in columns"
                                    :ref="'formItem' + column.name"
                                    :key="index + j"
                                    :models.sync="dataModel[index]"
                                    :rights.sync="columnsRights"
                                    :form-data="models"
                                    :field="column"
                                    :main-code="mainCode"
                                    :code="code"
                                    :row="index"
                                    :params="params"
                                    v-on="listeners"
                                />
                            </div>
                        </div>
                    </template>
                </template>
            </template>
        </template>

        <el-table v-else :data="[]" empty-text="您尚未创建任何字段。请在表单中添加字段。" border />
        <!--按钮支持自定义对话框-->
        <custom-dialog
            :visible="customDialogVisible"
            :value="[]"
            :template-key="customDialogKey"
            :dynamic-params="customDialogDynamicParams"
            @close="(visible) => (customDialogVisible = visible)"
            @action-event="handleCustomDialogActionEvent"
        />

        <import-table
            :visible="importTableDialogVisible"
            :title="field.label"
            @close="(visible) => importTableAction(visible)"
            @action-event="handleImportTableActionEvent"
        />
        <component
            :is="dialogTemplate"
            v-if="dialogTemplate"
            ref="dialogTemplate"
            v-bind="dialogTemplateAtts"
        />
        <formrender-dialog
            ref="jyxtEdit"
            :visible="formDialogVisible"
            :title="field.label"
            :form-def="dialogFormDef"
            :data="dialogFormData"
            :mode="mode"
            :edit-from-type="editFromType"
            custom-class="ibps-dialog-80"
            @close="(visible) => (formDialogVisible = visible)"
            @action-event="handleFormDialogActionEvent"
        />
    </div>
</template>
<script>
import emitter from '@/plugins/element-ui/src/mixins/emitter'
import { valueEquals } from '@/plugins/element-ui/src/utils/util'
import { nestedFieldTypes } from '@/business/platform/form/constants/fieldTypes'
import FormOptions from '../../constants/formOptions'
import ActionUtils from '@/utils/action'
import FormUtils from '../../utils/formUtil'
import FormFieldUtil from '../../utils/formFieldUtil'

import { hasPermission } from '@/business/platform/form/constants/tableButtonTypes'
import { defaultPageSize, pageSizeOptions } from '@/business/platform/form/constants/fieldOptions'

import CustomDialog from '@/business/platform/data/templaterender/custom-dialog/dialog'
import FormrenderDialog from '@/business/platform/form/formrender/dialog'
import ImportTable from './components/import-table'
import IbpsExport from '@/plugins/export'
import IbpsImport from '@/plugins/import'

const JForm = window.JForm
// 获取子表展示数据
const getShowData = (data, current = 1, size = defaultPageSize) => {
    return data && data.length ? JSON.parse(JSON.stringify(data)).slice((current - 1) * size, current * size) : []
}

export default {
    components: {
        FormrenderDialog,
        CustomDialog,
        ImportTable
    },
    mixins: [emitter],
    props: {
        value: [Array, Object, String], // 值
        formData: [Array, Object], // 表单数据
        field: {
            // 字段
            type: Object,
            required: true
        },
        rights: {
            type: [String, Object]
        },
        readonly: {
            type: Boolean,
            default: false
        },
        mainCode: String, // 主表名
        params: Object // 参数
    },
    inject: {
        elForm: {
            default: ''
        },
        elFormItem: {
            default: ''
        }
    },
    data () {
        const { page, pageSize = defaultPageSize, mode = 'inner', colWidth } = this.field.field_options || {}
        let initData = []
        if (page === 'N' || mode === 'block' || !this.value) {
            initData = this.value || []
        } else {
            initData = getShowData(this.value, 1, pageSize)
        }
        return {
            pageSize,
            colWidth,
            pageSizeOptions,
            editFromType: '', // 列表编辑弹出框类型
            npmDialogFormVisible: false, // 弹窗
            defId: '', // 编辑dialog需要使用
            currentPage: 1,
            totalCount:  0,
            dataModel: initData,
            copDataModel: initData,
            multipleSelection: '',
            countNumber: 0,
            fieldRights: {}, // 子表配置权限
            tableRights: FormOptions.t.PERMISSIONS.EDIT, // 子表权限
            columnsRights: {}, // 子表字段权限
            buttonsRights: {}, // 子表按钮权限
            actionCode: '',
            actionPosition: 'toolbar',
            handleCout: '',
            dynamicShow: true,

            customDialogVisible: false,
            customDialogKey: '',
            customDialogDynamicParams: {},
            customDialogCustom: {},

            formEditVisible: false,
            formDialogVisible: false,
            dialogFormDef: {},
            dialogFormData: {},
            dialogFormIndex: -1,

            importTableDialogVisible: false,
            dialogTemplate: null,
            dialogTemplateAtts: {},

            oldList: [], // 子表旧数据
            importList: [],
            importValue: null,
            actionButton: null
        }
    },
    computed: {
        thatSocpe () {
            return this
        },
        models () {
            return this.formData
        },
        fieldOptions () {
            const fieldOptions = this.field.field_options || {}
            fieldOptions.default_value_type = fieldOptions.default_value_type || 'fixed'
            return fieldOptions
        },
        toolbarButtons () {
            return this.filterButtons('toolbar')
        },
        manageButtons () {
            return this.filterButtons('manage')
        },
        manageButtonWidth () {
            return this.manageButtons.length > 2 || this.manageButtons.length === 1 ? 70 : 150
        },
        mode () {
            return this.field.field_options.mode || 'inner'
        },
        showSummary () {
            return this.field.field_options.summary || false
        },
        sumText () {
            return this.field.field_options.sum_text || '合计'
        },
        hasSummaryMethod () {
            return this.field.field_options.summary_method || false
        },
        code () {
            return this.field.name || ''
        },
        columns () {
            return this.field.field_options.columns || []
        },
        needPage () {
            return this.field.field_options.page || 'Y'
        },
        // pageSize () {
        //     return this.field.field_options.pageSize || 10
        // },
        // copDataModel () {
        //     // 自动计算显示数据，缺陷：子表数据任何变化都将触发
        //     // 非块模式且数据不为空
        //     if (this.$utils.isNotEmpty(this.dataModel) && ['dialog', 'inner'].includes(this.mode)) {
        //         return this.$utils.newData(this.dataModel).slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        //     } else {
        //         return this.dataModel
        //     }
        // },
        nameColumns () {
            return FormFieldUtil.getSubDisplayColumns(this.columns)
        },
        displayColumns () {
            const displayColumns = []
            const traverse = (fields) => {
                fields.forEach((field) => {
                    if (nestedFieldTypes.includes(field.field_type)) {
                        const columns = field.field_options.columns
                        columns.forEach((child) => {
                            traverse(child.fields)
                        })
                    } else {
                        if (this.$utils.toBoolean(field.field_options.display, true)) {
                            displayColumns.push(field)
                        }
                    }
                })
            }
            traverse(this.columns)
            return displayColumns
        },
        buttons () {
            const buttons = this.field.field_options.buttons || []
            const bs = []
            buttons.forEach((button) => {
                const b = JSON.parse(JSON.stringify(button))
                b.key = button.type
                b.type = button.style
                b.style = button.style
                b.icon = 'ibps-icon-' + button.icon
                bs.push(b)
            })
            return bs
        },
        tableReadonly () {
            return this.readonlyRights ? true : this.tableRights === FormOptions.t.PERMISSIONS.READ
        },
        tableHidden () {
            return this.tableRights === FormOptions.t.PERMISSIONS.HIDE
        },
        descPosition () {
            return this.params.descPosition || 'inline'
        },
        defaultLabelWidth () {
            return this.params.labelWidth
        },
        readonlyRights () {
            return this.params.readonly
        },
        readonlyStyle () {
            return this.params.readonlyStyle
        },
        formula () {
            return this.params.responseFormula
        },
        linkages () {
            return this.params.responseLinkages
        },
        copDataModelCont () {
            // 进行参数替换，提高子表性能
            return JSON.parse(JSON.stringify(this.dataModel))
        },
        listeners () {
            return {
                'update-form-data': (name, value) => {
                    this.updateFormData(name, value)
                }
            }
        }
    },
    watch: {
        value: {
            handler (val, oldVal) {
                if (!val) {
                    this.dataModel = []
                    return
                }
                this.dataModel = val
                // if (!valueEquals(val, oldVal)) {
                //     this.dispatch('ElFormItem', 'el.form.change', val)
                // }
            },
            deep: true,
            immediate: true
        },
        dataModel: {
            handler (val, oldVal) {
                // 进行分页操作
                if (this.mode === 'block') {
                    return val
                }
                this.handlePagination(val)
            },
            deep: true,
            immediate: true
        },
        rights: {
            handler (val, oldVal) {
                if (val !== oldVal) {
                    this.fieldRights = val || {}
                }
            },
            deep: true,
            immediate: true
        },
        // 字段权限
        fieldRights: {
            handler (fieldRights) {
                if (this.$utils.isNotEmpty(fieldRights) && this.$utils.isPlainObject(fieldRights)) {
                    this.tableRights = this.getRealRights(fieldRights['rights'] || FormOptions.t.PERMISSIONS.EDIT)
                    this.columnsRights = this.getColumnsRights(fieldRights['columns'])
                    this.buttonsRights = this.getButtonsRights(fieldRights['buttons'])
                } else {
                    this.tableRights = FormOptions.t.PERMISSIONS.EDIT
                    this.columnsRights = this.getColumnsRights({})
                    this.buttonsRights = this.getButtonsRights({})
                }
            },
            deep: true,
            immediate: true
        }
    },
    beforeDestroy () {
        this.dynamicShow = false
        // 注销当前表格保存在window[this.mainCode+'TableRefs']的this
        this.destoryTable()
    },
    created () {
        window.onresize = () => {
            this.handleRefreshTable()
        }
    },
    updated () {
        this.handleRefreshTable()
    },
    mounted () {
        this.handleRefreshTable()
    },
    methods: {
        handleRefreshTable () {
            this.$nextTick(() => {
                if (this.$refs.elTable) {
                    this.$refs.elTable.doLayout()
                }
            })
        },
        getShowData,
        indexMethod (index) {
            return (this.currentPage - 1) * this.pageSize + index + 1
        },
        /**
         * 定义删除、增加 不做操作。修改时才做更新，分页修改时，根据页表修改。
         */
        updateModel (key, val, index, page) {
            this.dataModel[(page - 1) * this.pageSize + index][key] = val
            this.$emit('change-data', key, val)
        },
        handlePagination (val) {
            this.totalCount = val.length
            // 限制最小页数为1
            const pageCount = Math.ceil(this.totalCount / this.pageSize) || 1
            // 逻辑：删除后当前页大于总页数，替换为总页数，否则留在当前页
            if (this.editFromType === 'add') {
                // 新增按钮逻辑：前往最后一页
                this.currentPage = pageCount
            } else if (this.editFromType === 'import') {
                // 导入定位到第一页
                this.currentPage = 1
            } else {
                // 其余逻辑（编辑、删除、整表赋值）：操作后当前页大于总页数，替换为总页数，否则留在当前页
                this.currentPage = this.currentPage > pageCount ? pageCount : this.currentPage
            }
            this.copDataModel = this.getShowData(val, this.currentPage, this.pageSize)
            this.editFromType = ''
            this.$emit('update:value', val)
        },
        // 处理切换分页
        handleCurrentChange (val) {
            this.currentPage = val
            this.copDataModel = this.getShowData(this.dataModel, this.currentPage, this.pageSize)
        },
        // 处理切换分页大小
        handleSizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
            this.copDataModel = this.getShowData(this.dataModel, this.currentPage, this.pageSize)
        },
        columnHidden (column) {
            // 是否隐藏
            return this.columnsRights[column.name] === FormOptions.t.PERMISSIONS.HIDE || column.field_type === 'hidden'
        },
        /**
         * 获取真实的权限
         */
        getRealRights (rights) {
            if (this.tableReadonly) {
                return rights === FormOptions.t.PERMISSIONS.HIDE ? rights : FormOptions.t.PERMISSIONS.READ
            } else {
                return rights
            }
        },
        getColumnsRights (rights = {}) {
            const columnsRights = {}
            if (this.nameColumns && this.nameColumns.length > 0) {
                this.nameColumns.forEach((column) => {
                    columnsRights[column.name] = this.getRealRights(rights[column.name] || FormUtils.getDefaultRigths(column))
                })
            }
            return columnsRights
        },
        getButtonsRights (rights = {}) {
            if (this.$utils.isEmpty(rights)) {
                const buttonsRights = {}
                if (this.$utils.isNotEmpty(this.buttons)) {
                    this.buttons.forEach((button) => {
                        buttonsRights[button.key] = FormOptions.t.PERMISSIONS.SHOW
                    })
                }
                return buttonsRights
            } else {
                return rights || {}
            }
        },
        tableRowClassName ({ row, rowIndex }) {
            // 把每一行的索引放进row
            row.$index = rowIndex
            if (rowIndex % 2 === 1) return 'warning-row'
            return 'success-row'
        },
        handleSelectionChange (selection) {
            this.multipleSelection = selection
        },
        handleRowClick (row, event, column) {
            this.$refs.elTable.toggleRowSelection(row)
        },
        filterButtons (position) {
            if (this.tableReadonly) {
                return this.filterDetailButtons(position)
            }
            const bs = []
            this.buttons.forEach((button) => {
                if (
                    hasPermission(button.key, position) && // 有位置权限
                    (!button.position || button.position === 'all' || button.position === position) && // 有位置权限
                    (this.$utils.isEmpty(this.buttonsRights[button.key]) || this.buttonsRights[button.key] !== FormOptions.t.PERMISSIONS.HIDE) && // 有按钮权限
                    this.buttonsRights[button.code] !== FormOptions.t.PERMISSIONS.HIDE
                ) {
                    const b = JSON.parse(JSON.stringify(button))
                    b.position = position
                    bs.push(b)
                }
            })
            return bs
        },
        filterDetailButtons (position) {
            const bs = []
            this.buttons.forEach((button) => {
                if (
                    hasPermission(button.key, position) && // 有位置权限
                    (!button.position || button.position === 'all' || button.position === position) && // 有位置权限
                    (this.$utils.isEmpty(this.buttonsRights[button.key]) || this.buttonsRights[button.key] !== FormOptions.t.PERMISSIONS.HIDE) && // 有按钮权限
                    button.key === 'consult'
                ) {
                    // 原按钮权限限制 改为开放查阅按钮 modified by 林总
                    // this.$utils.toBoolean(button.enabledDetail)
                    const b = JSON.parse(JSON.stringify(button))
                    b.position = position
                    bs.push(b)
                }
            })
            return bs
        },
        handleActionEvent (button, buttonIndex) {
            // 起始下标
            const index = (this.currentPage - 1) * this.pageSize + buttonIndex
            this.actionCode = button.key === 'custom' ? button.code || button.key + index : button.key
            this.actionPosition = button.position || 'toolbar'
            this.actionButton = button
            // 前置事件
            this.beforeScript(button, index, (result) => {
                this.editFromType = button.key
                if (!result) {
                    return
                }
                switch (button.key) {
                    case 'add':
                        // 新增自定义对话框按钮
                        if (button.enabledCustom === 'Y') {
                            this.handleAddCustomDialog(button)
                        } else {
                            this.handleAdd()
                        }
                        break
                    case 'copy':
                        // 复制已有数据（尾部插入）
                        this.handleCopyData(button, index)
                        break
                    case 'edit':
                        this.handleDialogMode(index)
                        break
                    case 'consult':
                        // 查阅按钮事件
                        this.handleDialogMode(index)
                        break
                    case 'remove':
                        this.handleRemove(button, index)
                        break
                    case 'import':
                        this.handleImport(button, index)
                        break
                    case 'export':
                        this.handleExport(button, index)
                        break
                    case 'custom':
                        // 新增自定义对话框按钮
                        if (button.enabledCustom === 'Y') {
                            this.handleAddCustomDialog(button)
                        }
                        break
                    default:
                        break
                }
            })
        },
        destoryTable () {
            if (this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs']) && this.$utils.isNotEmpty(window[this.mainCode + 'TableRefs'][this.code])) {
                window[this.mainCode + 'TableRefs'][this.code] = null
                delete window[this.mainCode + 'TableRefs'][this.code]
            }
            if (this.$utils.isObject(window[this.mainCode + 'TableRefs']) && this.$utils.isEmpty(window[this.mainCode + 'TableRefs'])) {
                window[this.mainCode + 'TableRefs'] = null
                delete window[this.mainCode + 'TableRefs']
            }
        },
        // 添加
        async handleAdd () {
            if (this.mode === 'dialog') {
                this.handleDialogMode()
            } else {
                const defaultValue = await FormUtils.getTableDefaultData(this.field)
                await this.addData(JSON.parse(JSON.stringify(defaultValue)))
            }
        },
        // 新增数据
        addData (data) {
            // this.dataModel.unshift(data)
            this.dataModel.push(data)
            // 初始化运行公式计算 unshift
            this.initRunCalFormula(this.dataModel.length - 1)
            // 后置事件
            this.afterScript(this.actionCode, this.actionPosition)
            if (this.$refs.elTable) {
                this.$refs.elTable.doLayout()
            }
        },
        // 复制已有数据
        handleCopyData (button, index) {
            const position = button.position
            const selection = this.getSelection(position, index)
            ActionUtils.selectedMultiRecord(selection).then((ids) => {
                selection.forEach(i => {
                    const obj = JSON.parse(JSON.stringify(this.dataModel[i]))
                    delete obj.$index
                    delete obj.id
                    this.dataModel.push(obj)
                })
                // 初始化运行公式计算
                this.initRunCalFormula(this.dataModel.length - 1)
                // 后置事件
                this.afterScript(this.actionCode, this.actionPosition)
                if (this.$refs.elTable) {
                    this.$refs.elTable.doLayout()
                }
            }).catch(() => {})
        },
        /**
         * 获取选择的记录
         */
        getSelection (position, index) {
            const selection = []
            if (position === 'toolbar' && this.mode !== 'block') {
                if (this.multipleSelection && this.multipleSelection.length > 0) {
                    const startIndex = (this.currentPage - 1) * this.pageSize
                    this.multipleSelection.forEach((row) => {
                        selection.push(row.$index + startIndex)
                    })
                }
            } else {
                selection.push(index)
            }
            return selection
        },
        handleRemove (button, index) {
            const position = button.position
            const selection = this.getSelection(position, index)
            ActionUtils.removeRecord(selection, '确定删除当前数据？', true).then((ids) => {
                for (let i = this.dataModel.length - 1; i >= 0; i--) {
                    if (ids.indexOf(i) > -1) {
                        this.dataModel.splice(i, 1)
                    }
                }
                this.totalCount = this.dataModel.length
                // 后置事件
                this.afterScript(this.actionCode, position, {
                    selection: selection,
                    index: index
                })
            }).catch(() => {})
        },
        // 初始化运行公式计算
        initRunCalFormula (row) {
            // 不需要字段的进行公式计算 比如获取但其当前时间，随机数
            FormUtils.runCalFormula(this, this.formula[FormUtils.NOT_NEED_FIELD], this.mainCode, row)
        },
        handleImport () {
            this.importTableDialogVisible = true
        },
        importTableAction (val) {
            this.importTableDialogVisible = false
            this.importList = []
            this.importValue = null
        },
        // 子表导入 小林
        handleImportTableActionEvent (file, options) {
            if (this.importList.length > 0) {
                this.loading = false
                const formData = this.setValue(this.importValue)
                IbpsImport.xlsx(file, options).then(({ header, results }) => {
                    const list = []
                    results.forEach((item) => {
                        const data = JSON.parse(JSON.stringify(formData))
                        for (const key in item) {
                            if (this.importValue[key]) {
                                data[this.importValue[key]] = item[key]
                            }
                        }
                        if (this.actionCode === 'importData') {
                            list.push(data)
                        } else {
                            this.dataModel.push(data)
                        }
                        // this.dataModel.push(data)
                    })
                    // 后置事件
                    if (this.actionCode === 'importData') {
                        this.afterScript(this.actionCode, this.actionPosition, {
                            button: this.actionButton,
                            importList: list,
                            fullImportList: [...this.dataModel, ...list]
                        })
                    }

                    this.importTableDialogVisible = false
                    this.importValue = null
                    this.importList = []
                    ActionUtils.success('导入成功')
                })
            } else {
                const formData = FormUtils.getTableDefaultColumnData(this.field)
                IbpsImport.xlsx(file, options).then(({ header, results }) => {
                    const columnMap = {}
                    this.nameColumns.forEach((column) => {
                        columnMap[column.label] = column
                    })
                    results.forEach((result) => {
                        const data = JSON.parse(JSON.stringify(formData))
                        for (const key in result) {
                            if (columnMap[key]) {
                                const column = columnMap[key]
                                const name = column.name
                                const value = this.importDataFormatter(result[key], column)
                                data[name] = value
                            }
                        }
                        // TODO: 需要格式化的成数据库的数据
                        // 数据添加
                        this.dataModel.push(data)
                    })
                    this.importTableDialogVisible = false
                    ActionUtils.success('导入成功')
                })
            }
        },
        // 自定义导入
        customHandleImport (data = []) {
            this.importList = data
            this.importValue = this.getKeys(this.importList)
            this.importTableDialogVisible = true
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
        // 数据导出  小林
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
        // 导出
        handleExport (button, index) {
            const position = button.position
            const selection = this.getSelection(position, index)
            if (selection.length > 0) {
                this.exportData(selection)
            } else {
                this.exportData()
            }
        },
        /**
         * 导出数据
         */
        exportData (ids) {
            const columnMap = {}
            const columns = []
            this.nameColumns.forEach((column) => {
                if (!this.columnHidden(column)) {
                    columns.push(column)
                }
                columnMap[column.name] = column
            })
            const exportData = JSON.parse(JSON.stringify(this.dataModel))
            const data = ids
                ? exportData.filter((d, i) => {
                    return ids.includes(i)
                })
                : exportData
            // TODO: 需要格式化展示的数据
            this.convertExportData(data, columnMap).then((data) => {
                IbpsExport.excel({
                    columns: columns,
                    data: data,
                    nameKey: 'name',
                    title: this.field.label
                }).then(() => {
                    ActionUtils.success('导出成功')
                })
            })
        },
        async convertExportData (data, columnMap) {
            return new Promise((resolve, reject) => {
                const result = []
                data
                    ? data.forEach((d) => {
                        const o = d
                        for (const name in d) {
                            const column = columnMap[name]
                            const value = this.dataFormatter(d[name], column)
                            o[name] = value
                        }
                        result.push(o)
                    })
                    : ''
                resolve(result)
            })
        },
        importDataFormatter (value, column) {
            if (this.$utils.isEmpty(value) || this.$utils.isEmpty(column)) {
                return value
            }
            const fieldType = column.field_type
            const fieldOptions = column.field_options
            let result = ''
            switch (fieldType) {
                case 'hidden':
                case 'text':
                case 'textarea':
                case 'editor':
                case 'autoNumber':
                case 'number': // 数字，格式化千分位等
                case 'datePicker': // 日期格式
                case 'currentDate':
                case 'currentTime':
                    result = value
                    break
                case 'select': // 下拉，单选，多选
                case 'radio':
                case 'checkbox':
                    result = this.formatterOptions(value, fieldOptions['options'], 'label', 'val')
                    break
                case 'switch': //
                    result = this.formatterOptions(value, FormUtils.getSwitchOptions(this.field.field_options), 'label', 'val')
                    break
                default:
                    result = value
                    break
            }
            return result
        },
        dataFormatter (value, column) {
            if (this.$utils.isEmpty(value) || this.$utils.isEmpty(column)) {
                return value
            }
            const fieldType = column.field_type
            const fieldOptions = column.field_options
            let result = ''
            switch (fieldType) {
                case 'hidden':
                case 'text':
                case 'textarea':
                case 'editor':
                case 'autoNumber':
                case 'number': // 数字，格式化千分位等
                case 'datePicker': // 日期格式
                case 'currentDate':
                case 'currentTime':
                    result = value
                    break
                case 'select': // 下拉，单选，多选
                case 'radio':
                case 'checkbox':
                    result = this.formatterOptions(value, fieldOptions['options'], 'val')
                    break
                case 'switch': //
                    result = this.formatterOptions(value, FormUtils.getSwitchOptions(fieldOptions), 'val')
                    break
                default:
                    result = value
                    break
            }
            return result
        },
        /**
         * 格式化选项
         */
        formatterOptions (value, options, valueKey = 'value', labelKey = 'label') {
            const optionObj = {}
            if (options) {
                options.map((option) => {
                    optionObj[option[valueKey]] = option[labelKey]
                })
            }
            const aryValue = value.split(',')
            const res = aryValue.map((v) => {
                return optionObj[v] || v
            })
            return res.join(',')
        },
        deleteEdit () {
            this.formDialogVisible = false
            this.handleCout = null
        },
        // =====================对话框模式数据处理   金源信通改=====================
        handleDialogMode (index) {
            const data = this.$utils.isNotEmpty(index) ? this.dataModel[index] : {}
            this.dialogFormData = {
                responses: JSON.parse(JSON.stringify(data)),
                // 表单字段权限
                permissions: {
                    fields: this.columnsRights
                }
            }
            const attrs = {
                hide_name: true
            }
            if (this.params.formAttrs) {
                const formAttrs = this.params.formAttrs
                const allowAttrs = ['inline', 'labelPosition', 'labelWidth', 'labelWidthUnit', 'size', 'statusIcon', 'descPosition', 'read_style', 'colon', 'labelSuffix']
                for (const key in formAttrs) {
                    if (allowAttrs.indexOf(key) > -1) {
                        const val = formAttrs[key]
                        attrs[key] = val
                    }
                }
            }

            this.dialogFormIndex = this.$utils.isNotEmpty(index) ? index : -1
            this.dialogFormDef = {
                code: this.field.name,
                attrs: attrs,
                fields: this.columns
            }
            // 表单
            this.formDialogVisible = true
            this.judgeData(index)
        },
        /**
         * 第一次进入时：不做更新判断。并记录当前进入时的操作，index>=0 则为修改。否则为新增。
         * 第二次进入时判断：如果上次为修改，则刷新重置添加。如果上次为新增，则不做变化。
         */
        judgeData (index) {
            if (index >= 0 && this.handleCout) {
                // 第一次进入时，不做更新判断。
                this.$refs.jyxtEdit.loadFormData()
            } else if (index === undefined && this.handleCout === '编辑') {
                this.$refs.jyxtEdit.loadFormData()
            }
            this.handleCout = index >= 0 ? '编辑' : '新增' // 记录
        },

        // =====================对话框模式数据处理=  原====================

        handleEditMode (index) {
            const data = this.$utils.isNotEmpty(index) ? this.dataModel[index] : {}
            this.dialogFormData = {
                responses: JSON.parse(JSON.stringify(data)),
                // 表单字段权限
                permissions: {
                    fields: this.columnsRights
                }
            }
            const attrs = {
                hide_name: true
            }
            if (this.params.formAttrs) {
                const formAttrs = this.params.formAttrs
                const allowAttrs = ['inline', 'labelPosition', 'labelWidth', 'labelWidthUnit', 'size', 'statusIcon', 'descPosition', 'read_style', 'colon', 'labelSuffix']
                for (const key in formAttrs) {
                    if (allowAttrs.indexOf(key) > -1) {
                        const val = formAttrs[key]
                        attrs[key] = val
                    }
                }
            }

            this.dialogFormIndex = this.$utils.isNotEmpty(index) ? index : -1
            this.dialogFormDef = {
                code: this.field.name,
                attrs: attrs,
                fields: this.columns
            }
            // 表单
            this.formEditVisible = true
        },

        /**
         * 对话框模式表单返回值
         */
        handleFormDialogActionEvent (key, data) {
            this.$message({
                showClose: true,
                message: '操作成功！',
                type: 'success'
            })
            if (this.dialogFormIndex > -1) {
                this.dataModel.splice(this.dialogFormIndex, 1, data)
                // 后置事件
                this.afterScript(this.actionCode, this.actionPosition, {
                    index: this.dialogFormIndex
                })
            } else {
                this.addData(data)
            }
            this.formDialogVisible = false
        },
        // =====================自定义对话框=====================

        async handleAddCustomDialog (button) {
            this.customDialogKey = button.dialog
            this.customDialogDynamicParams = await FormUtils.getLinkDynamicParams(button.custom, this.formData)
            this.customDialogCustom = button.custom
            setTimeout(() => {
                this.customDialogVisible = true
            }, 10)
        },
        async handleCustomDialogActionEvent (key, datas) {
            const linkLinkage = this.customDialogCustom['link_linkage']
            if (this.$utils.isEmpty(linkLinkage)) {
                return
            }
            const defaultValue = await FormUtils.getTableDefaultData(this.field)
            for (let i = 0; i < datas.length; i++) {
                const data = datas[i]
                const model = JSON.parse(JSON.stringify(defaultValue))
                for (let i = 0; i < linkLinkage.length; i++) {
                    const item = linkLinkage[i]
                    const fieldName = item.field
                    if (model.hasOwnProperty(fieldName)) {
                        model[fieldName] = data[item.name] || ''
                    }
                }
                this.dataModel.push(model)
            }
            // 后置事件
            this.afterScript(this.actionCode, this.actionPosition)
        },
        summaryMethod (param) {
            if (this.showSummary) {
                return JForm._summaryMethod(this, this.field.name, param)
            }
        },
        hasScript () {
            return true
        },
        // 前置脚本
        beforeScript (button, index, callback) {
            if (!this.hasScript()) {
                if (callback) {
                    const flag = true
                    callback(flag)
                }
                return
            }
            const params = {
                button: button,
                index: index
            }
            if (!callback) {
                callback = () => {}
            }
            JForm._beforeSubButton(this, this.actionCode, button.position, params, callback)
        },
        // 后置脚本
        afterScript (action, position, params, callback) {
            if (!this.hasScript()) {
                if (callback) {
                    const flag = true
                    callback(flag)
                }
                return
            }
            if (!params) {
                params = {}
            }
            params.button = this.getButtonByKey(action)
            if (!callback) {
                callback = () => {}
            }
            JForm._afterSubButton(this, action, position, params, callback)
        },
        getButtonByKey (action) {
            return this.buttons.find((button) => {
                return button.key === action
            })
        },
        /**
         * 更新字段值（主表或其他子表）
         */
        updateFormData (name, value) {
            this.$emit('change-data', name, value)
        },
        // 设置行数据
        setRowData (row, name, value) {
            this.dataModel[row][name] = value
        },
        // 设置行数据
        getRowData (row, name) {
            return this.dataModel[row][name]
        },
        /**
         * 获取表单值
         */
        getData (key) {
            return this.formData[key]
        },
        /**
         * 设置表单值
         */
        setData (name, value) {
            this.updateFormData(name, value)
        }
    }
}
</script>
<style lang="scss" scoped>
.dynamic-form-table {
    .panel-heading {
        color: #000;
        border-bottom: 0;
        padding: 0px 0px 0px 15px;
        background: #f0ffff;
    }

    .dynamic-form-table__inner {
        .panel-body {
            padding: 0;
        }
    }

    .dynamic-form-table__block {
        padding-bottom: 10px;

        .panel-body {
            border: 0px;
        }
    }

    .el-rate {
        position: relative;
        display: inline-block;
    }

    ::v-deep .el-table {
        th {
            background-color: #84d5cf !important;
            font-size: 12px;
            font-weight: bold;
            border: 0px;
        }
        td {
            font-size: 12px;
            padding: 0px 0 !important;
        }
        .warning-row {
            background: #e0f0ee;
            color: #000000;
        }
        .success-row {
            background: #f9ffff;
            color: #000000;
        }
    }
}

.is-error {
    .dynamic-form-table {
        border: 1px solid #f56c6c;
    }
}

.is-required:not(.is-no-asterisk) {
    .dynamic-form-table__label:before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
    }
}

.table-tetle-style {
    font-weight: bold;
    font-size: 12px;
    color: #999999;
}
</style>
