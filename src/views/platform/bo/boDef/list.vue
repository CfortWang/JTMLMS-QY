<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                :has-contextmenu="true"
                category-key="BO_TYPE"
                title="业务对象分类"
                @treeData="treeData"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <ibps-crud
            ref="crud"
            :style="{ marginLeft: width+'px' }"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            :index-row="false"
            @row-click="handleRowClick"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <!-- @column-link-click="handleLinkClick"-->
            <div slot="versionCount" slot-scope="scope">
                默认：
                <el-link type="primary" @click="handleVersion(scope.row.id)">版本({{ scope.row.version }})</el-link>
                <el-link class="ibps-ml-5" type="primary" @click="handleVersionCount(scope.row.code)">更多版本({{ scope.row.versionCount }})</el-link>
            </div>
        </ibps-crud>
        <!-- 添加编辑明细 -->
        <edit
            :id="editId"
            :code="code"
            :type-id="typeId"
            :visible="dialogFormVisible"
            :readonly="readonly"
            title="业务对象添加"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
        <!-- 设置分类 -->
        <setting-type
            :visible="settingTypeFormVisible"
            title="设置业务对象分类"
            category-key="BO_TYPE"
            @save="saveSettingType"
            @close="visible => settingTypeFormVisible = visible"
        />
        <!-- 导入 -->
        <import-bo
            :id="editId"
            :visible="importFormVisible"
            @callback="search"
            @close="visible => importFormVisible = visible"
        />
        <!-- 导出 -->
        <export-bo
            :id="editId"
            title="导出业务对象数据配置"
            :visible="exportVisible"
            @callback="search"
            @close="visible => exportVisible = visible"
        />
        <!-- 更多版本 -->
        <more-versions
            :code="code"
            :visible="versionsFormVisible"
            @callback="search"
            @close="visible => versionsFormVisible = visible"
        />
        <!-- 复制 -->
        <copy
            :id="editId"
            :copy-data="copyData"
            :visible="copyFormVisible"
            @callback="search"
            @close="visible => copyFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { queryPageList, remove, synBoTable, genBoTable, setCategory, exportFile, getTableProfix } from '@/api/platform/bo/boDef'
import { boTypeOptions, createTabelOptions, statusOptions } from './constants'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import SettingType from '@/business/platform/cat/type/setting-type'
import Edit from './edit'
import Copy from './copy'
import importBo from './import'
import exportBo from './export'
import MoreVersions from './more-versions'

export default {
    components: {
        IbpsTypeTree,
        SettingType,
        MoreVersions,
        Edit,
        exportBo,
        importBo,
        Copy
    },
    mixins: [FixHeight],
    data () {
        return {
            width: 200,
            height: document.clientHeight,
            settingTypeFormVisible: false, // 弹窗
            dialogFormVisible: false,
            versionsFormVisible: false,
            importFormVisible: false,
            exportVisible: false,
            copyFormVisible: false,
            readonly: false,
            editId: '', // 编辑dialog需要使用
            code: '',
            typeId: '',
            prefix: '',
            copyData: {},
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: false,
            listData: [],
            typeFiler: [], // 类型过滤
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    { key: 'add' },
                    { key: 'edit' },
                    { key: 'remove' },
                    {
                        key: 'setCategory',
                        label: '设置分类',
                        icon: 'ibps-icon-cog'
                    },
                    {
                        key: 'export'
                    },
                    {
                        key: 'import'
                    }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^NAME_^SL', label: '名称' },
                        { prop: 'Q^CODE_^SL', label: '编码' }
                        // {
                        //     prop: 'Q^IS_CREATE_TABLE_^S',
                        //     label: '是否生成表',
                        //     fieldType: 'select',
                        //     options: createTabelOptions
                        // }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'name', label: '名称', sortable: true, minWidth: 200 },
                    { prop: 'code', label: '编码', sortable: true, width: 100 },
                    { prop: 'versionCount', label: '版本信息', fieldType: 'slot', slotName: 'versionCount', width: 180 },
                    { prop: 'typeId', label: '归分类型', sortable: true, width: 120 },
                    { prop: 'status', label: '状态', sortable: true, width: 80, tags: statusOptions },
                    { prop: 'boType', label: '对象类型', sortable: true, width: 100, tags: boTypeOptions },
                    { prop: 'isCreateTable', label: '生成表', sortable: true, tags: createTabelOptions, width: 80 },
                    { prop: 'createTime', label: '创建时间', sortable: true, width: 150 }
                ],
                // 管理列
                rowHandle: {
                    actions: [
                        {
                            key: 'genBoTable',
                            label: '生成表',
                            icon: 'ibps-icon-cog',
                            hidden: (row, index) => {
                                return !(row.boType === 'object' && row.isCreateTable === 'N')
                            }
                        },
                        {
                            key: 'synBoTable',
                            label: '同步表结构',
                            icon: 'ibps-icon-exchange',
                            hidden: (row, index) => {
                                return row.boType !== 'out'
                            }
                        },
                        {
                            key: 'copy',
                            label: '复制',
                            icon: 'ibps-icon-copy',
                            hidden: (row, index) => {
                                return row.boType === 'out'
                            }
                        },
                        { key: 'edit' },
                        { key: 'remove' },
                        { key: 'detail' }
                    ]
                }
            },
            pagination: {},
            sorts: {}

        }
    },
    created () {
        this.loadData()
    },
    methods: {
        /**
         * 加载数据
         */
        loadData (id = '') {
            this.loading = true
            queryPageList(this.getFormatParams(id)).then(response => {
                response.data.dataResult.forEach((item) => {
                    if (item.typeId && this.typeFiler.length) {
                        const temp = this.typeFiler.find(i => i.id === item.typeId)
                        item.typeId = temp ? temp.name : '未分类'
                    } else {
                        item.typeId = item.typeId ? '分类被删除' : '未分类'
                    }
                })
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getFormatParams () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            params['Q^TYPE_ID_^S'] = this.typeId
            return ActionUtils.formatParams(
                params,
                this.pagination,
                this.sorts)
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
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
        search () {
            this.loadData()
        },
        /**
         * 设置分类
         */
        handleSetCategory (editId) {
            this.editId = editId || ''
            this.settingTypeFormVisible = true
        },
        /**
         * 保存分类
         */
        saveSettingType (typeId) {
            setCategory({
                boDefIds: this.editId,
                typeId: typeId
            }).then(response => {
                ActionUtils.successMessage('保存成功')
                this.settingTypeFormVisible = false
                this.search()
            }).catch((err) => {
                console.error(err)
            })
        },
        /**
         * 添加
         */
        handleEdit (editId = '', readonly = false) {
            this.editId = editId || ''
            this.readonly = readonly
            this.dialogFormVisible = true
        },
        /**
         * 更多版本
         */
        handleVersions (code = '') {
            this.code = code || ''
            this.versionsFormVisible = true
        },
        // 获取code
        handleRowClick (row, event, column) {
            this.code = row.code
        },
        /**
         * 点击表格
         */
        // handleLinkClick (data, columns) {
        //     console.log(data.id)
        // },
        /**
         * 复制
         */
        handleCopy (editId = '') {
            this.editId = editId || ''
            this.copyFormVisible = true
        },
        /* 左侧列表参数*/
        treeData (data) {
            this.typeFiler = data
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add':// 添加
                    this.handleEdit()
                    break
                case 'edit': // 编辑
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id)
                        this.code = data.code
                    }).catch(() => { })
                    break
                case 'remove': // 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    break
                case 'detail': // 明细
                    ActionUtils.selectedRecord(selection).then((ids) => {
                        this.handleEdit(ids, true)
                    }).catch(() => { })
                    break
                case 'setCategory': // 设置分类
                    ActionUtils.selectedMultiRecord(selection).then((id) => {
                        this.handleSetCategory(id)
                    }).catch(() => { })
                    break
                case 'export': // 导出
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleExport(ids)
                    }).catch(() => { })
                    break
                case 'import': // 导入
                    this.handleImport()
                    break
                case 'copy': // 复制
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleCopy(id)
                        this.copyData = data
                    }).catch(() => { })
                    break
                case 'genBoTable': // 生成表
                    getTableProfix().then(res => {
                        ActionUtils.selectedRecord(selection).then((id) => {
                            this.$confirm('确定生成表吗？表名自动添加【' + res.data + '】业务前缀。', '消息', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.handleGenBoTable(id)
                                ActionUtils.success('生成表成功！')
                            }).catch(() => {})
                        }).catch(() => { })
                    })
                    break
                case 'synBoTable': // 同步表结构
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.$confirm(`<span style="color:#f56c6c; font-size: 18px; font-weight: 600;">同步表结构存在以下问题：</span><br>1.将用当前表编码去模糊查询，并将匹配到的第一个表结构同步到当前表。因此使用前请搜索当前表编码，确保结果只有一个，否则将表结构混乱！<br>2.同步表结构后数据表字段的编码长度将会被改变，涉及到的所有脚本及表单都需要进行调整。<br><span style="color:#f56c6c; font-size: 18px; font-weight: 600;">请谨慎操作！</span>`, '警告', {
                            confirmButtonText: '确定同步',
                            cancelButtonText: '取消',
                            dangerouslyUseHTMLString: true,
                            type: 'warning'
                        }).then(() => {
                            this.handlesynBoTable(id)
                        }).catch(() => {})
                    }).catch(() => {})
                    break
                default:
                    break
            }
        },
        handleExport (ids) {
            this.$confirm('是否进一步配置导出数据？否，则直接导出当前业务对象。', '业务导出', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.editId = ids
                this.exportVisible = true
            }).catch(() => {
                exportFile({ boDefIds: ids }).then((response) => {
                    if (!response) {
                        return
                    }
                    ActionUtils.exportFile(
                        response.data,
                        'boDef_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
                    )
                })
            })
        },
        handleImport () {
            this.importFormVisible = true
        },
        handleRemove (id) {
            remove({
                boDefIds: id,
                rmType: 'all',
                clean: true
            }).then(response => {
                const { cause = '' } = response
                if (cause && cause.includes('请先处理关联后再删除！')) {
                    this.$confirm(cause, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        dangerouslyUseHTMLString: true,
                        type: 'warning'
                    })
                }
                this.loadData()
            })
        },
        handlesynBoTable (id) {
            synBoTable({
                boDefId: id
            }).then(response => {
                this.$message({
                    type: 'success',
                    message: '同步外部数据表结构成功！'
                })
                this.loadData()
            })
        },
        handleGenBoTable (id) {
            genBoTable({
                boDefId: id
            }).then(response => {
                this.loadData()
            })
        },
        handleVersion (id) {
            this.handleEdit(id, true)
        },
        handleVersionCount (code) {
            this.handleVersions(code)
        },
        handleNodeClick (id) {
            this.typeId = id
            this.loadData(id)
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 230 : 30
        }
    }
}
</script>
