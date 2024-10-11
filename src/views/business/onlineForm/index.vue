<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="表单分类"
                category-key="FLOW_TYPE"
                :has-contextmenu="true"
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
        <!-- 设置分类 -->
        <setting-type
            :visible="settingTypeFormVisible"
            title="设置任务分类"
            category-key="FLOW_TYPE"
            @save="saveSettingType"
            @close="visible => settingTypeFormVisible = visible"
        />
        <!-- 流程启动 -->
        <bpmn-formrender
            :visible="startFormVisible"
            :def-id="editId"
            :title="title"
            @close="visible => startFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { setCategory } from '@/api/platform/bpmn/bpmDefinition'
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

export default {
    components: {
        IbpsTypeTree: () => import('@/business/platform/cat/type/tree'),
        SettingType: () => import('@/business/platform/cat/type/setting-type'),
        BpmnFormrender: () => import('@/business/platform/bpmn/form/dialog'),
        IbpsUserSelector: () => import('@/business/platform/org/selector'),
        IbpsEmployeeSelector: () => import('@/business/platform/org/employee/selector')
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

            width: 200,
            height: document.clientHeight,
            settingTypeFormVisible: false, // 设置分类弹窗
            startFormVisible: false, // 启动流程表单弹窗

            title: '启动',
            editId: '', // 编辑dialog需要使用
            defKey: '',
            data: {},
            typeId: '',
            status: '',
            // 数据字典列表
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: false,
            listData: [],
            searchParams: {
                dept: '',
                submitBy: ''
            },
            listConfig: { // 工具栏
                toolbars: [
                    { key: 'search' },
                    { key: 'online', label: '在线填写', icon: 'ibps-icon-add', type: 'success' },
                    { key: 'upload', label: '扫描上传', icon: 'ibps-icon-upload', type: 'primary' },
                    { key: 'remove' },
                    { key: 'more',
                        label: '更多',
                        mode: 'dropdown',
                        type: 'info',
                        menus: [
                            { key: 'setTemplate', label: '模板配置', icon: 'ibps-icon-cogs', type: 'info' },
                            { key: 'revoke', label: '废除模板', icon: 'ibps-icon-trash', type: 'danger' }
                        ]
                    }
                ],
                searchForm: { // 查询条件
                    labelWidth: 80,
                    itemWidth: 150,
                    forms: [
                        { prop: 'dept', label: '部门', fieldType: 'slot', slotName: 'dept', itemWidth: 120 },
                        { prop: 'formName', label: '表单名称' },
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
                    { prop: 'formName', label: '表单名称', minWidth: 150, sortable: true },
                    { prop: 'state', label: '状态', slotName: 'state', width: 90 },
                    { prop: 'submitBy', label: '填写人', tags: userOption, width: 100, sortable: true },
                    { prop: 'submitTime', label: '填写时间', width: 140, sortable: true },
                    { prop: 'attachment', label: '附件', slotName: 'attachment', width: 90 },
                    { prop: 'version', label: '表单版本', width: 90 }
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
                            hidden: function (rowData, index) {
                                return !(rowData.submitBy === userId || hasRole)
                            }
                        },
                        {
                            label: '删除',
                            key: 'remove',
                            type: 'danger',
                            hidden: function (rowData, index) {
                                return !(rowData.submitBy === userId || hasRole)
                            }
                        }
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
            const sql = `select id_ as recordId, create_by_ as createBy, bian_zhi_ren_ as submitBy, create_time_ as createTime, bian_zhi_shi_jian as submitTime, bian_zhi_bu_men_ as dept, shi_fou_guo_shen_ as state, biao_dan_ming_che as formName, biao_dan_mo_ban_ as formTemplete, gui_dang_lu_jing_ as path, fu_jian_ as attachment, shuo_ming_ as detail, pei_zhi_ as config, mo_ban_id_ as templeteId from t_bdmbtxjl where di_dian_ = '${this.level}'${params} order by ${sortParams}`
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
            addCondition('bian_zhi_ren_', temp.submitBy?.split(','), true)

            const addDateCondition = (key, field) => {
                const dateParam = parameters.find(i => i.key.includes(key))
                if (dateParam) {
                    params += ` and (${field} >= '${temp[key + '0']}' and ${field} <= '${temp[key + '1']}' or ${field} is null)`
                }
            }
            addDateCondition('submitTime', 'bian_zhi_shi_jian')
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
         * 前置事件
         *
        * @before-action-event="beforeActionEvent"
        */
        beforeActionEvent (key, position, data, callback) {
            const flag = true
            callback(flag)
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
                case 'design':// 设计
                    if (this.$utils.isNotEmpty(data)) {
                        this.status = data.status
                    }
                    this.handleDesign(position === 'toolbar' ? '' : selection)
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    break
                case 'setCategory':// 设置分类
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleSetCat(ids)
                    }).catch(() => { })
                    break
                case 'export':// 导出
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleExport(ids)
                    }).catch(() => { })
                    break
                case 'import': // 导入
                    this.handImport()
                    break
                case 'batchSuspend':// 挂起
                case 'suspend':// 挂起
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleBatchSuspend(ids)
                    }).catch(() => { })
                    break
                case 'batchRecover':// 恢复
                case 'recover':// 恢复
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handleBatchRecover(ids)
                    }).catch(() => { })
                    break
                case 'start':// 启动
                    this.handleStart(selection)
                    break
                case 'copy':// 复制
                    this.title = '复制流程'
                    this.data = data
                    this.handleCopy(selection)
                    break
                case 'deploy':// 发布
                    this.handleDeploy(selection)
                    break
                case 'setting':// 设置
                    this.handleSetting(selection, data.defKey)
                    break
                case 'getGuide':// 查看指南
                    this.handleEditGuide(selection, 'look')
                    break
                case 'editGuide':// 编辑指南
                    this.handleEditGuide(selection, 'edit')
                    break
                case 'clear':// 清除数据
                    this.handleClear(selection)
                    break
                default:
                    break
            }
        },
        handleCopy (id) {
            this.copyFormVisible = true
            this.editId = id
        },
        handleNodeClick (typeId) {
            this.typeId = typeId
            this.loadData()
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 200 : 30
        },
        getSelectedData (id) {
            const data = this.listData
            for (let index = 0; index < data.length; index++) {
                if (data[index].id === id) {
                    return data[index]
                }
            }
        },
        saveSettingType (typeId) {
            setCategory({
                defIds: this.editId,
                typeId: typeId
            }).then(response => {
                ActionUtils.successMessage('保存成功')
                this.settingTypeFormVisible = false
                this.search()
            }).catch((err) => {
                console.error(err)
            })
        }
    }
}
</script>
