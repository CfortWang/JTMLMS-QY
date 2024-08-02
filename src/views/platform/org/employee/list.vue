<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            style="width: 100%"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :row-handle="listConfig.rowHandle"
            :pagination="pagination"
            :loading="loading"
            display-field="用户管理"
            :display-field-data="listConfig.displayFieldData"
            @display-field-change="handleDisplayField"
            @header-dragend="handleHeaderDragend"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <template slot="roleName" slot-scope="scope">
                <span class="wrap">{{ scope.row.roleName }}</span>
            </template>
            <template slot="positionsPath" slot-scope="scope">
                <span class="wrap">{{ scope.row.positionsPath }}</span>
            </template>
        </ibps-crud>
        <!-- 新增、编辑、明细 -->
        <edit
            :id="editId"
            :title="title"
            :form-type="formType"
            :visible="dialogFormVisible"
            :readonly="readonly"
            :span="span"
            @dialog-callback="search"
            @close="(visible) => (dialogFormVisible = visible)"
        />
        <!-- 重置密码 -->
        <change-password
            :ids="changePasswordIds"
            :visible="changePasswordVisible"
            :title="$t('platform.org.employee.change-password.resetPassword')"
            is-reset
            :reg-open="true"
            @dialog-callback="search"
            @close="(visible) => (changePasswordVisible = visible)"
        />
        <more-search
            ref="moreSearch"
            :title="moreSearchTitle"
            :visible="dialogMoreSearchVisible"
            party-type="employee"
            @callback="search"
            @close="(visible) => (dialogMoreSearchVisible = visible)"
            @action-event="handleMoreSearchAction"
        />
        <import-table
            :visible="importTableDialogVisible"
            title="导入"
            @close="(visible) => (importTableDialogVisible = visible)"
            @action-event="handleImportTableActionEvent"
        />
    </div>
</template>

<script>
import { queryPageList, remove, active, disable } from '@/api/platform/org/employee'
import { queryRoleScope } from '@/api/platform/org/role'
import { create } from '@/api/platform/org/employee'
import ActionUtils from '@/utils/action'
import { statusOptions, genderOptions, typeOptions } from './constants'
import { mapActions, mapMutations } from 'vuex'
import Edit from './edit/index'
import ChangePassword from './change-password'
import CustomDataDisplayMixin from '@/business/platform/system/mixins/customDataDisplay'
import importTable from '@/business/platform/form/formrender/dynamic-form/components/import-table'
import MoreSearch from './more-search'
import IbpsImport from '@/plugins/import'
export default {
    components: {
        Edit,
        importTable,
        ChangePassword,
        MoreSearch
    },
    mixins: [CustomDataDisplayMixin],
    data () {
        const { first = '', second = '' } = this.$store.getters.level
        const { isSuper = false } = this.$store.getters
        let level = second || first
        if (isSuper) {
            level = null
        }
        return {
            level,
            height: document.clientHeight,
            title: '',
            moreSearchTitle: '更多查询',
            loading: true,
            // 编辑dialog需要使用
            editId: '',
            span: '',
            dialogFormVisible: false,
            readonly: false, // 是否只读
            formType: 'add',

            importTableDialogVisible: false,
            defaultPwd: 'ISO15189',
            changePasswordIds: '',
            changePasswordVisible: false,
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            listIdentity: 'ibps-org-employee', // 列表标识
            listData: [],
            listConfig: {
                displayField: '’',
                displayFieldData: [],
                toolbars: [
                    { key: 'search' },
                    { key: 'add' },
                    { key: 'edit' },
                    { key: 'remove' },
                    {
                        key: 'changePassword',
                        label: this.$t(
                            'platform.org.employee.button.changePassword'
                        ),
                        icon: 'el-icon-refresh'
                    },
                    { key: 'import' }
                    // { key: 'more', icon: 'ibps-icon-ellipsis-h' }
                ],
                searchForm: {
                    forms: [
                        {
                            prop: 'Q^NAME_^SL',
                            label: this.$t('platform.org.employee.prop.name'),
                            labelWidth: 40,
                            itemWidth: 150
                        },
                        {
                            prop: 'Q^ACCOUNT_^SL',
                            label: this.$t(
                                'platform.org.employee.prop.account'
                            ),
                            labelWidth: 40,
                            itemWidth: 150
                        },
                        {
                            prop: 'Q^STATUS_^SL',
                            label: this.$t('platform.org.employee.prop.status'),
                            fieldType: 'select',
                            options: statusOptions.filter((status) => {
                                return status.value !== 'deleted'
                            }),
                            labelWidth: 50,
                            itemWidth: 150
                        },
                        // {
                        //     prop: 'Q^POSITIONS_^SL',
                        //     label: '归属组织',
                        //     fieldType: 'select',
                        //     options: this.positionsList,
                        //     labelWidth: 70,
                        //     itemWidth: 150
                        // },
                        {
                            prop: 'Q^JOB_^SL',
                            label: '角色',
                            fieldType: 'select',
                            options: this.roleList,
                            labelWidth: 70,
                            itemWidth: 150
                        },
                        {
                            prop: ['Q^CREATE_TIME_^DL', 'Q^CREATE_TIME_^DG'],
                            label: this.$t('common.field.createTime'),
                            fieldType: 'daterange',
                            labelWidth: 70,
                            itemWidth: 220
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    {
                        prop: 'name',
                        label: this.$t('platform.org.employee.prop.name'),
                        width: 120
                    },
                    {
                        prop: 'account',
                        label: this.$t('platform.org.employee.prop.account'),
                        width: 150
                    },
                    {
                        prop: 'gender',
                        label: this.$t('platform.org.employee.prop.gender'),
                        tags: genderOptions,
                        width: 90
                    },
                    // { prop: 'wcAccount', label: this.$t('platform.org.employee.prop.wcAccount'),width:120},
                    {
                        prop: 'positionsPath',
                        label: this.$t('platform.org.employee.prop.orgPath'),
                        sortable: false,
                        width: 240,
                        slotName: 'positionsPath'
                    },
                    {
                        prop: 'roleName',
                        label: this.$t('platform.org.employee.prop.job'),
                        sortable: false,
                        minWidth: 200,
                        slotName: 'roleName'
                    },
                    {
                        prop: 'status',
                        label: this.$t('platform.org.employee.prop.status'),
                        tags: statusOptions,
                        width: 100
                    },
                    {
                        prop: 'createTime',
                        label: this.$t('common.field.createTime'),
                        width: 150
                    }
                ],
                rowHandle: {
                    actions: [
                        {
                            key: 'changePassword',
                            label: this.$t(
                                'platform.org.employee.button.changePassword'
                            ),
                            icon: 'el-icon-refresh',
                            hidden: (rowData, index) => {
                                if (rowData.status === 'deleted') {
                                    return true
                                }
                                if (this.$store.getters.userId === rowData.id) {
                                    return true
                                }
                                if (this.$store.getters.isSuper) {
                                    return false
                                }
                            }
                        },
                        {
                            key: 'edit',
                            hidden: (rowData, index) => {
                                if (rowData.status === 'deleted') {
                                    return true
                                }
                                if (this.$store.getters.userId === rowData.id) {
                                    return true
                                }
                                if (this.$store.getters.isSuper) {
                                    return false
                                }
                            }
                        },
                        {
                            key: 'remove',
                            hidden: (rowData, index) => {
                                if (rowData.status === 'deleted') {
                                    return true
                                }
                                if (this.$store.getters.userId === rowData.id) {
                                    return true
                                }
                                if (this.$store.getters.isSuper) {
                                    return false
                                }
                            }
                        },
                        {
                            key: 'detail'
                        },
                        {
                            key: 'actived',
                            label: this.$t(
                                'platform.org.employee.button.actived'
                            ),
                            icon: 'ibps-icon-unlock',
                            hidden: (rowData, index) => {
                                if (rowData.status === 'actived') {
                                    return true
                                }
                                if (this.$store.getters.userId === rowData.id) {
                                    return true
                                }
                                // if (!this.$store.getters.isSuper) {
                                //     return true
                                // }
                            }
                        },
                        {
                            key: 'disable',
                            label: this.$t(
                                'platform.org.employee.button.disable'
                            ),
                            icon: 'ibps-icon-ban',
                            hidden: function (rowData, index) {
                                if (rowData.status !== 'actived') {
                                    return true
                                }
                                if (this.$store.getters.userId === rowData.id) {
                                    return true
                                }
                                // if (!this.$store.getters.isSuper) {
                                //     return true
                                // }
                            }
                        },
                        {
                            key: 'switchUser',
                            label: this.$t('platform.org.employee.button.switchUser'),
                            icon: 'el-icon-sort',
                            hidden: function (rowData, index) {
                                const userId = this.$store.getters.userId
                                const isSuper = this.$store.getters.isSuper
                                const isTenantAdmin = this.$store.getters.isTenantAdmin
                                return (isTenantAdmin === true || rowData.status !== 'actived' || userId === rowData.id || !isSuper)
                            }
                        }
                    ]
                }
            },
            pagination: {},
            sorts: {},
            moreSearchParams: {},
            dialogMoreSearchVisible: false,
            positionsList: [],
            roleList: []
        }
    },
    created () {
        const sql1 = 'select a.id_ as id_, a.name_ as name_, b.path_ as path_ from ibps_party_position a, ibps_party_entity b where a.id_ = b.id_ order by depth_ asc, sn_ asc'
        const sql2 = 'select id_, name_ from ibps_party_role order by role_note_ asc'
        Promise.all([this.getData(sql1, 'positionsList', 4), this.getData(sql2, 'roleList', 3)]).then(() => {
            this.loadData()
            this.loadDisplayField()
        })
    },
    methods: {
        ...mapMutations({
            pageKeepAliveClean: 'ibps/page/keepAliveClean'
        }),
        ...mapActions({
            switchUser: 'ibps/user/switchUser'
        }),
        // 加载数据
        loadData () {
            this.loading = true
            queryPageList(this.getSearcFormData()).then((response) => {
                response.data.dataResult.forEach(item => {
                    if (item.positions) {
                        // 转换岗位名
                        const name = this.getTransformName(item.positions, 'positionsList')
                        this.$set(item, 'positionsName', name)
                        // 转换岗位路径
                        const path = this.getPositionsPath(item.positions)
                        this.$set(item, 'positionsPath', path)
                    }
                    if (item.job) {
                        // 转角色名
                        const role = this.getTransformName(item.job, 'roleList')
                        this.$set(item, 'roleName', role)
                    }
                })
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        getTransformName (value, type) {
            const dataList = value.split(',')
            const result = []
            if (!dataList.length) {
                return ''
            }
            dataList.forEach(item => {
                const dataItem = this[type].find(i => i.id_ === item)
                result.push(dataItem ? dataItem.name_ : '')
            })
            return result.filter(i => i).join('，')
        },
        getPositionsPath (value) {
            const postList = value.split(',')
            const result = []
            if (!postList.length) {
                return ''
            }
            postList.forEach(item => {
                const temp = this.positionsList.find(i => i.id_ === item)
                const pathList = temp ? temp.path_.split('.') : []
                let p = ''
                pathList.filter(i => i).forEach(k => {
                    const t = this.positionsList.find(i => i.id_ === k)
                    p += `${t.name_}.`
                })
                result.push(p)
            })
            return result.join('\r\n')
        },
        /**
         * 获取格式化参数
         */
        getSearcFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (this.moreSearchParams) {
                Object.assign(params, this.moreSearchParams)
            }
            const res = ActionUtils.formatParams(params, this.pagination, this.sorts)
            if (this.level) {
                res.customs = {
                    position: this.level
                }
            }
            return res
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

        /**
         * 获取显示字段
         */
        loadDisplayField () {
            this.getCustomDataDisplay(this.listIdentity).then((data) => {
                this.listConfig.displayFieldData = data
            })
        },
        handleHeaderDragend (newWidth, oldWidth, column, event) {
            const displayFieldData = this.listConfig.displayFieldData
            for (let i = 0; i < displayFieldData.length; i++) {
                const displayField = displayFieldData[i]
                if (displayField.prop === column.property) {
                    displayField.width = parseInt(newWidth)
                }
            }
            this.handleDisplayField(
                displayFieldData,
                () => {
                    this.listConfig.displayFieldData = displayFieldData
                },
                false
            )
        },
        /**
         * 保存显示字段
         */
        handleDisplayField (data, callback, hasMessage) {
            this.saveCustomDataDisplay(data, this.listIdentity).then((response) => {
                if (hasMessage) ActionUtils.success(response.message)
                callback(true)
            }).catch(() => {
                callback(false)
            })
        },
        /**
         * 查询
         */
        search () {
            this.loadData()
        },
        /**
         * 处理按钮事件
         */
        handleAction (buttonKey, position, selection, data) {
            switch (buttonKey) {
                case 'search': // 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add': // 添加
                    this.handleEdit()
                    this.title = this.$t('common.title.add', {
                        title: this.$t('platform.org.employee.title')
                    })
                    this.span = 13
                    break
                case 'edit': // 编辑
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id, false, 'edit')
                        this.title = this.$t('common.title.edit', {
                            title: this.$t('platform.org.employee.title')
                        })
                        this.span = 13
                    }).catch(() => {})
                    break
                case 'changePassword': // 重置密码
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.handlereChangePassword(ids)
                    }).catch(() => {})
                    break
                case 'import':
                    this.importTableDialogVisible = true
                    break
                case 'detail': // 明细
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id, true, 'detail')
                        this.span = 24
                        this.title = this.$t('common.title.detail', {
                            title: this.$t('platform.org.employee.title')
                        })
                    }).catch(() => {})
                    break
                case 'remove': // 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => {})
                    break
                case 'actived': // 激活
                    this.handleActived(selection)
                    break
                case 'more': // 更多
                    this.handleMoreSearchParams()
                    break
                case 'disable': // 禁用
                    this.handleDisable(selection)
                    break
                case 'switchUser': // 切换用户
                    this.handleSwitchUser(data.account)
                    break
                default:
                    break
            }
        },
        /**
         * 处理更多
         */
        handleMoreSearchParams () {
            this.dialogMoreSearchVisible = true
        },
        handleMoreSearchAction (data) {
            ActionUtils.setFirstPagination(this.pagination)
            this.moreSearchParams = data
            this.loadData()
        },
        /**
         * 处理编辑
         */
        handleEdit (editId, readonly = false, type = 'add') {
            this.editId = editId || ''
            this.formType = type
            this.dialogFormVisible = true
            this.readonly = readonly
        },
        /**
         * 处理重置密码
         */
        handlereChangePassword (ids) {
            this.changePasswordIds = ids
            this.changePasswordVisible = true
        },
        handleRemove (ids) {
            // 删除数据
            remove({ employeeIds: ids }).then((response) => {
                ActionUtils.removeSuccessMessage()
                this.search()
            })
        },
        handleActived (id) {
            active({ employeeId: id }).then((response) => {
                ActionUtils.successMessage('激活成功！')
                this.search()
            })
        },
        handleDisable (id) {
            disable({ employeeId: id }).then((response) => {
                ActionUtils.successMessage('禁用成功!')
                this.search()
            })
        },
        handleSwitchUser (username) {
            this.switchUser(username).then(() => {
                ActionUtils.successMessage('切换用户成功!')
                // 由于已经加载过设置 需要清空缓存设置
                this.pageKeepAliveClean()
                // 由于已经加载过设置 需要刷新此页面
                this.$router.replace('/')
            })
        },
        // 获取组织/角色数据
        getData (sql, type, index) {
            return new Promise((resolve, reject) => {
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        ActionUtils.errorMessage('获取数据失败！')
                        return reject()
                    }
                    data.forEach(item => {
                        this.$set(item, 'value', item.id_)
                        this.$set(item, 'label', item.name_)
                    })
                    this[type] = data
                    this.listConfig.searchForm.forms[index].options = data
                    resolve()
                })
            })
        },
        setValue (data) {
            return Object.values(data).reduce((obj, item) => {
                obj[item] = ''
                return obj
            }, {})
        },
        getKeys (data) {
            return data.reduce((obj, item) => {
                obj[item.label] = item.name
                return obj
            }, {})
        },
        // 导入用户
        handleImportTableActionEvent (file, options) {
            this.loading = false
            const column = {
                account: '账号',
                username: '姓名',
                gender: '性别',
                post: '职称',
                number: '工号',
                dept: '所在部门',
                role: '岗位角色',
                email: '邮箱',
                mobile: '手机号码',
                address: '地址',
                unit: '单位名称'
            }
            const importColumn = Object.keys(column).map(key => {
                return {
                    label: column[key],
                    name: key
                }
            })
            const importKeys = this.getKeys(importColumn)
            const importValue = this.setValue(importKeys)
            IbpsImport.xlsx(file, options).then(({ header, results }) => {
                const list = []
                results.forEach((item) => {
                    const data = JSON.parse(JSON.stringify(importValue))
                    for (const key in item) {
                        if (importKeys[key]) {
                            data[importKeys[key]] = item[key]
                        }
                    }
                    list.push(data)
                })
                this.importTableDialogVisible = false
                this.handleImportData(list)
            })
        },
        // 组装导入数据
        async handleImportData (list) {
            const hasError = list.some(i => !i.dept || !i.role)
            if (hasError) {
                return this.$message.error('存在【所属部门】或【岗位角色】为空的数据，请检查后再尝试！')
            }
            console.log(list)
            const roleList = await this.getRoleList()
            const { deptList = [] } = this.$store.getters || {}
            const roleItem = {
                pk: '',
                ip: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                tenantId: null,
                dataStatus: null,
                dbType: null,
                dsAlias: null,
                partyType: null,
                alias: null,
                parentId: '266946423468851203',
                path: null,
                depth: null,
                sn: null,
                roleType: '普通员工',
                subSystemId: '266946423468851203',
                subSystemName: '金通医学实验室管理系统',
                subSystemAlias: null,
                icon: null,
                type: 'role',
                nocheck: false,
                chkDisabled: false,
                click: true,
                title: '',
                open: 'true',
                source: '自有'
            }
            const posItem = {
                isMainPost: 'N',
                isPrincipal: 'N',
                hasChild: false
            }
            const createParams = []
            list.forEach(item => {
                const userItem = {
                    id: '',
                    account: item.account,
                    password: this.defaultPwd,
                    isSuper: 'N',
                    name: item.username,
                    status: 'actived',
                    gender: item.gender === '男' ? 'male' : 'female',
                    email: item.email,
                    photo: '',
                    mobile: item.mobile,
                    createTime: '',
                    attrItemList: [],
                    groupID: '',
                    userGroupItemList: [],
                    orgItem: {},
                    wxyhId: '',
                    jiNengZhiCheng: 'inside',
                    qq: item.unit,
                    jianDingZiGeZ: item.number,
                    address: item.address
                }
                const roleName = item.role.split('\n')
                const deptName = item.dept.split('\n')
                const roleItemList = []
                const posItemList = []
                roleName.forEach(r => {
                    const temp = roleList.find(i => i.name === r.trim().replace(/\r/g, ''))
                    if (temp) {
                        roleItemList.push({
                            ...roleItem,
                            name: r,
                            id: temp.id,
                            roleNote: temp.roleNote,
                            roleAlias: temp.roleAlias
                        })
                    }
                })
                deptName.map(d => {
                    const temp = deptList.find(i => i.positionName === d.trim().replace(/\r/g, ''))
                    if (temp) {
                        posItemList.push({
                            ...posItem,
                            name: d,
                            id: temp.positionId,
                            posAlias: temp.alias
                        })
                    }
                })
                const user = {
                    ...userItem,
                    positions: posItemList.map(i => i.id).join(','),
                    job: roleItemList.map(i => i.id).join(','),
                    posItemList,
                    roleItemList
                }
                const employee = {
                    partyEmployeePo: user,
                    user,
                    positionVoList: posItemList.map(p => ({
                        id: p.id,
                        name: p.name,
                        isMainPost: false,
                        isPrincipal: false
                    })),
                    roleVoList: roleItemList.map(r => ({
                        id: r.id,
                        name: r.name,
                        subSystemName: r.subSystemName,
                        source: r.source,
                        canDelete: true
                    })),
                    attrValueVoList: [],
                    userGroupPoList: []
                }
                createParams.push(employee)
            })
            console.log(createParams)
            this.createEmployee(createParams)
        },
        createEmployee (paramList) {
            if (!paramList || !paramList.length) {
                this.search()
                return
            }
            create(paramList.shift()).then(res => {
                this.createEmployee(paramList)
            })
            // paramList.forEach(vo => {
            //     create(vo)
            // })
        },
        getRoleList () {
            return new Promise((resolve, reject) => {
                queryRoleScope({
                    parameters: [],
                    requestPage: {
                        pageNo: 1,
                        limit: 2000
                    },
                    sorts: []
                }).then(response => {
                    resolve(response.data.dataResult || [])
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}
</script>
<style scoped>
    .wrap{
        white-space: pre-line;
    }
</style>
