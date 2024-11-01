<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="表单分类"
                category-key="FLOW_TYPE"
                :has-contextmenu="true"
                @refresh="refresh"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <ibps-container :margin-left="width+'px'" class="page">
            <ibps-crud
                ref="crud"
                :height="height"
                :data="listData"
                :index-row="false"
                :toolbars="listConfig.toolbars"
                :row-handle="listConfig.rowHandle"
                :search-form="listConfig.searchForm"
                :pk-key="pkKey"
                :columns="listConfig.columns"
                :pagination="pagination"
                :loading="loading"
                @action-event="handleAction"
                @sort-change="handleSortChange"
                @pagination-change="handlePaginationChange"
            >
                <template slot="dept">
                    <ibps-user-selector
                        v-model="searchParams.dept"
                        type="position"
                        readonly-text="text"
                        :multiple="true"
                        size="mini"
                        :filter="filterOption"
                        :temp-search="true"
                        filterable
                    />
                </template>
                <template slot="user">
                    <ibps-user-selector
                        v-model="searchParams.submitBy"
                        type="user"
                        readonly-text="text"
                        :multiple="true"
                        size="mini"
                        :filter="filterOption"
                        :temp-search="true"
                        filterable
                    />
                </template>
            </ibps-crud>
        </ibps-container>
        <!-- 流程启动 -->
        <bpmn-formrender
            :visible="startFormVisible"
            :def-id="editId"
            :title="title"
            :add-data-cont="addDataCont"
            @close="visible => startFormVisible = visible"
        />
        <data-template-formrender-dialog
            :visible="dialogFormVisible"
            :form-key="formKey"
            :default-data="defaultFormData"
            :pk-value="pkValue"
            :toolbars="editToolbars"
            :readonly="readonly"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>

import { createTemplateFile, editTemplateFile, deleteTemplateFile } from '@/api/platform/file/onlyoffice'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
// import Handle from './mixin/handle'
import { keyBy, mapValues } from 'lodash'

// 列表排序字段
const sortField = {
    DEPT_: 'bian_zhi_bu_men_',
    SUBMIT_TIME_: 'bian_zhi_shi_jian',
    FORM_NAME_: 'biao_dan_ming_che'
}

const stateOption = [
    { label: '已暂存', value: '已暂存' },
    { label: '已完成', value: '已完成' }
]

export default {
    components: {
        IbpsTypeTree: () => import('./tree'),
        SettingType: () => import('@/business/platform/cat/type/setting-type'),
        BpmnFormrender: () => import('@/business/platform/bpmn/form/dialog'),
        IbpsUserSelector: () => import('@/business/platform/org/selector'),
        IbpsEmployeeSelector: () => import('@/business/platform/org/employee/selector'),
        DataTemplateFormrenderDialog: () => import('@/business/platform/data/templaterender/form/dialog')
    },
    mixins: [
        // Handle,
        FixHeight
    ],
    data () {
        const roleList = ['xtgljs', 'pxglxzfzr']
        const { isSuper, role, userId, userList = [], deptList = [] } = this.$store.getters || {}
        const { first, second } = this.$store.getters.level || {}
        const hasRole = isSuper || role.some(r => roleList.includes(r.alias))
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const deptOption = deptList.map(item => ({ label: item.positionName, value: item.positionId }))
        const filterOption = [{
            descVal: '2',
            includeSub: true,
            old: 'position',
            partyId: this.$store.getters.userInfo.employee.positions,
            partyName: '',
            scriptContent: '',
            type: 'user',
            userType: 'position'
        }]
        return {
            userId,
            userList,
            userOption,
            deptOption,
            hasRole,
            filterOption,
            level: second || first,

            width: 250,
            height: document.clientHeight,
            // 表单参数
            dialogFormVisible: false,
            formKey: '',
            defaultFormData: {},
            pkValue: '',
            editToolbars: [],
            readonly: false,
            // 启动流程表单弹窗
            startFormVisible: false,
            title: '',
            // 编辑dialog需要使用
            editId: '1267498699286642688',
            defKey: 'Process_16lkr65',
            addDataCont: {},
            typeId: '',
            // 模板数据
            templateData: '',
            // 主键  如果主键不是pk需要传主键
            pkKey: 'id',
            loading: false,
            // 模板文件配置参数
            fileOption: {},
            listData: [],
            searchParams: {
                dept: '',
                submitBy: ''
            },
            listConfig: { // 工具栏
                toolbars: [
                    { key: 'search' },
                    { key: 'online', label: '在线填写', icon: 'ibps-icon-add', type: 'success', visible: false },
                    // { key: 'upload', label: '扫描上传', icon: 'ibps-icon-upload', type: 'primary', visible: false },
                    { key: 'remove', visible: hasRole }
                    // { key: 'more',
                    //     label: '更多',
                    //     mode: 'dropdown',
                    //     type: 'info',
                    //     visible: false,
                    //     menus: [
                    //         { key: 'setTemplate', label: '模板配置', icon: 'ibps-icon-cogs', type: 'info' },
                    //         { key: 'revoke', label: '废除模板', icon: 'ibps-icon-trash', type: 'danger' }
                    //     ]
                    // }
                ],
                searchForm: { // 查询条件
                    labelWidth: 80,
                    itemWidth: 150,
                    forms: [
                        { prop: 'dept', label: '部门', fieldType: 'slot', slotName: 'dept', itemWidth: 120 },
                        { prop: 'formName', label: '表单名称' },
                        { prop: 'state', label: '状态', fieldType: 'select', options: stateOption },
                        { prop: 'submitBy', label: '填写人', fieldType: 'slot', slotName: 'user' },
                        {
                            prop: ['submitTime0', 'submitTime1'],
                            label: '填写时间',
                            fieldType: 'daterange',
                            itemWidth: 240
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'dept', label: '部门', tags: deptOption, width: 100, sortable: true },
                    { prop: 'formName', label: '表单名称', width: 200, sortable: true },
                    { prop: 'state', label: '状态', width: 90 },
                    { prop: 'submitBy', label: '填写人', tags: userOption, width: 100, sortable: true },
                    { prop: 'submitTime', label: '填写时间', width: 140, sortable: true },
                    { prop: 'version', label: '表单版本', width: 90 },
                    { prop: 'attachment', label: '附件', slotName: 'attachment', minWidth: 110 }
                ],
                rowHandle: {
                    effect: 'display',
                    actions: [
                        {
                            label: '编辑',
                            key: 'edit',
                            type: 'primary',
                            hidden: function (rowData, index) {
                                return !(rowData.submitBy === userId || hasRole)
                            }
                        },
                        {
                            label: '查阅',
                            key: 'preview',
                            type: 'info',
                            icon: 'ibps-icon-eye',
                            // hidden: function (rowData, index) {
                            //     return !(rowData.submitBy === userId || hasRole)
                            // }
                        },
                        // {
                        //     label: '删除',
                        //     key: 'remove',
                        //     type: 'danger',
                        //     hidden: function (rowData, index) {
                        //         return !(rowData.submitBy === userId || hasRole)
                        //     }
                        // }
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
        loadData () {
            this.loading = true
            this.getData(this.getSearchFormData()).then(res => {
                this.loading = false
                ActionUtils.handleListData(this, res.data)
            })
        },
        /**
         * 加载数据
         */
        getData ({ parameters, requestPage, sorts }) {
            const { pageNo = 1, limit = 20 } = requestPage || {}
            let sortParams = ''
            if (sorts && sorts.length) {
                sortParams = sorts.map(i => `${sortField[i.field]} ${i.order}`).join(',')
            } else {
                sortParams = 'bian_zhi_shi_jian desc, bian_zhi_bu_men_ asc'
            }
            const params = this.getParams(parameters)
            const sql = `select id_ as id, create_by_ as createBy, bian_zhi_ren_ as submitBy, create_time_ as createTime, bian_zhi_shi_jian as submitTime, bian_zhi_bu_men_ as dept, shi_fou_guo_shen_ as state, biao_dan_ming_che as formName, biao_dan_mo_ban_ as formTemplate, mo_ban_id_ as templateId, gui_dang_lu_jing_ as parentId, fu_jian_ as attachment, cun_fang_lu_jing_ as filePath, shuo_ming_ as detail, pei_zhi_ as config from t_bdmbtxjl where di_dian_ = '${this.level}'${params} order by ${sortParams}`
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        resolve({
                            dataResult: [],
                            pageResult: {
                                limit: 20,
                                page: 1,
                                totalCount: 0,
                                totalPages: 0
                            }
                        })
                        return
                    }
                    const page = {
                        limit,
                        page: pageNo,
                        totalCount: data.length,
                        totalPages: Math.ceil(data.length / limit)
                    }
                    const result = {
                        data: {
                            dataResult: data.slice((pageNo - 1) * limit, pageNo * limit),
                            pageResult: page
                        }
                    }
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 组装SQL查询参数
        getParams (parameters) {
            const temp = mapValues(keyBy(parameters.filter(i => this.$utils.isNotEmpty(i.value)), 'key'), 'value')
            let params = ''

            const addCondition = (condition, value, isArray = false) => {
                if (this.$utils.isNotEmpty(value)) {
                    if (isArray) {
                        const conditions = value.map(v => `${condition} = '${v}'`).join(' or ')
                        params += ` and (${conditions})`
                    } else {
                        params += ` and ${condition} like '%${value}%'`
                    }
                }
            }
            addCondition('biao_dan_ming_che', temp.formName)
            addCondition('bian_zhi_bu_men_', temp.dept?.split(','), true)
            addCondition('shi_fou_guo_shen_', temp.state)
            addCondition('bian_zhi_ren_', temp.submitBy?.split(','), true)

            const addDateCondition = (key, field) => {
                const dateParam = parameters.find(i => i.key.includes(key))
                if (dateParam) {
                    params += ` and (${field} >= '${temp[key + '0']}' and ${field} <= '${temp[key + '1']}' or ${field} is null)`
                }
            }
            addDateCondition('submitTime', 'bian_zhi_shi_jian')
            if (this.typeId) {
                params += ` and mo_ban_id_ = '${this.typeId}'`
            }
            return params
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            let params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            params = {
                ...params,
                ...this.searchParams
            }
            if (this.$utils.isNotEmpty(this.typeId)) {
                params['Q^TYPE_ID_^S'] = this.typeId
            }
            return ActionUtils.formatParams(
                params,
                this.pagination,
                this.sorts
            )
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
         * 重置查询条件
         */
        reset () {
            this.$refs['crud'].handleReset()
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
                case 'online':// 在线填写
                    this.handleOnlineForm(data)
                    break
                case 'upload':// 记录上传
                    this.handleUploadForm(data)
                    break
                case 'edit':// 编辑
                    this.handleEdit('edit')
                    break
                case 'preview':// 查阅
                    this.handleEdit('view')
                    break
                case 'remove':// 删除
                    if (this.$utils.isEmpty(selection)) {
                        return this.$message.warning('请选择要删除的数据！')
                    }
                    this.$confirm('数据删除后不可恢复，您确定要删除吗？', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(() => {
                        this.handleRemove(data)
                    })
                    break
                default:
                    break
            }
        },
        handleNodeClick (typeId, data) {
            console.log(data)
            this.typeId = typeId
            this.templateData = data
            const { templateId } = this.templateData || {}
            this.listConfig.toolbars.forEach(item => {
                // 在线填写按钮仅在模板下显示
                if (item.key === 'more' || item.key === 'online') {
                    item.visible = !!templateId
                }
                if (item.key === 'upload') {
                    item.visible = !templateId && !!typeId
                }
            })
            this.listConfig.toolbars = [...this.listConfig.toolbars]
            this.loadData()
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 250 : 30
        },
        refresh () {
            this.typeId = ''
            this.loadData()
        },
        handleOnlineForm () {
            const { templateId, templateFile, parentId, name, filePath, configData } = this.templateData || {}
            if (this.$utils.isEmpty(templateId)) {
                return this.$message.warning('获取文件信息失败！')
            }
            createTemplateFile({ templateId }).then(res => {
                this.fileOption = res.data
                if (this.$utils.isEmpty(res.data)) {
                    return this.$message.warning('获取文件信息失败！')
                }
                const { referenceData, title } = res.data.document || {}
                const { fileKey } = referenceData || {}
                const temp = fileKey ? JSON.parse(fileKey) : {}
                const fileInfo = JSON.stringify({ filename: title, filepath: temp.fileName })
                this.addDataCont = {
                    templateId,
                    name: name,
                    file: fileInfo,
                    type: parentId,
                    path: temp.fileName,
                    option: res.data,
                    config: configData
                }
                this.startFormVisible = true
            })
        },
        handleUploadForm (data) {

        },
        handleEdit (type) {
            const { templateId, templateFile, parentId, name, filePath, configData, fileOption } = this.templateData || {}
            if (this.$utils.isEmpty(fileOption)) {
                return this.$message.warning('获取文件信息失败！')
            }
            this.fileOption = JSON.parse(fileOption)
            this.fileOption.editorConfig.mode = type
            this.addDataCont = {
                templateId,
                name,
                file: templateFile,
                type: parentId,
                path: filePath,
                option: this.fileOption,
                config: configData
            }
            this.startFormVisible = true
        },
        handleRemove (data) {
            const idList = data.map(i => i.id)
            const filePathList = data.map(i => i.filePath).filter(i => i)
            // 删除记录
            this.$common.request('delete', {
                tableName: 't_bdmbtxjl',
                paramWhere: { id_: idList.join(',') }
            }).then(() => {
                // 删除文件
                if (!filePathList.length) {
                    this.$message.success('删除成功！')
                    this.search()
                    return
                }
                deleteTemplateFile({
                    filePath: filePathList
                }).then(() => {
                    this.$message.success('删除成功！')
                    this.search()
                })
            })
        }
    }
}
</script>
