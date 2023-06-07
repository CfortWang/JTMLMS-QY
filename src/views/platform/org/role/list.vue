<template>
    <div class="main-container">
      <ibps-crud
        ref="crud"
        :height="height"
        :data="listData"
        :toolbars="listConfig.toolbars"
        :search-form="listConfig.searchForm"
        :pk-key="pkKey"
        :columns="listConfig.columns"
        :row-handle="listConfig.rowHandle"
        :pagination="pagination"
        :loading="loading"
        displayField="角色设置列表"
        @action-event="handleAction"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
      />
      <edit
        :id="editId"
        :title="title"
        :visible="dialogFormVisible"
        :readonly="readonly"
        @callback="search"
        @close="visible => dialogFormVisible = visible"
      />
      <copy
        :id="editId"
        :data="data"
        :visible="copyFormVisible"
        :title="title"
        @callback="search"
        @close="visible => copyFormVisible = visible"
      />
      <user-list
        :id="editId"
        :visible="dialogUserListVisible"
        @close="visible => dialogUserListVisible = visible"
      />
      <assign-resource
        :id="editId"
        :system-id="systemId"
        :type="assignResourceType"
        :visible="dialogAssignResourceVisible"
        @callback="search"
        @close="visible => dialogAssignResourceVisible = visible"
      />
      <!-- API 授权申请 -->
      <client-grant
        :title="title"
        :client-key="clientKey"
        :grant-type="grantType"
        :visible="apiGrantVisible"
        @callback="search"
        @close="visible => apiGrantVisible = visible"
        @closeAll="closeAll"
      />
    </div>
  </template>
  
  <script>
  import { queryPageList, remove } from '@/api/platform/org/role'
  import { findAllSubsystem } from '@/api/platform/auth/subsystem'
  import ActionUtils from '@/utils/action'
  import FixHeight from '@/mixins/height'
  import Edit from './edit'
  import ClientGrant from '@/views/platform/auth/client/grant/index'
  import UserList from './user-list'
  import AssignResource from './assign-resource'
  import Copy from './copy'
  
  export default {
    components: {
      Edit,
      ClientGrant,
      UserList,
      AssignResource,
      Copy
    },
    mixins: [FixHeight],
    data() {
      return {
        dialogFormVisible: false, // 弹窗
        editId: '', // 编辑dialog需要使用
        systemId: '',
        dialogUserListVisible: false,
        dialogAssignResourceVisible: false,
        apiGrantVisible: false,
        copyFormVisible: false, // 复制角色信息弹窗
        data: {},
  
        readonly: false, // 是否只读
        pkKey: 'id', // 主键  如果主键不是pk需要传主键
  
        clientKey: '',
        grantType: '',
  
        assignResourceType: '',
  
        title: '',
        loading: true,
        height: document.clientHeight,
        pagination: {},
        sorts: {},
        listData: [],
        listConfig: {
          toolbars: [
            {
              key: 'search'
            }, {
              key: 'add'
            }, {
              key: 'edit'
            }, {
              key: 'remove'
            }
          ],
          searchForm: {
            forms: [
              { prop: 'Q^NAME_^SL', label: '角色名称' },
              { prop: 'Q^ROLE_ALIAS_^SL', label: '角色别名' },
              // {
              //   prop: 'Q^SYSTEM_ID_^SL',
              //   label: '子系统',
              //   fieldType: 'select',
              //   valueKey: 'id',
              //   labelKey: 'name',
              //   resultField: 'data',
              //   selectFetch: findAllSubsystem
              // }
            ]
          },
          // 表格字段配置
          columns: [
            { prop: 'name', label: '角色名称' },
            { prop: 'roleAlias', label: '角色别名' },
          //   { prop: 'subSystemName', label: '子系统名称' }
          ],
          rowHandle: {
            actions: [{
              key: 'copy',
              label: '复制',
              icon: 'ibps-icon-copy'
            }, {
              key: 'userList',
              label: '人员列表',
              icon: 'ibps-icon-detail'
            }, {
              key: 'assignResource',
              label: '资源分配',
              icon: 'ibps-icon-dashboard'
            }, {
              key: 'appAssignResource',
              label: 'App资源分配',
              icon: 'ibps-icon-dashboard'
            }, {
              key: 'authApiGrant',
              label: '接口授权',
              icon: 'ibps-icon-ticket'
            },{
              key: 'remove'
            }, {
              key: 'detail'
            },{
              key: 'edit'
            }]
          }
        },
        subsystemList: []
      }
    },
    created() {
      this.loadData()
    },
    methods: {
  
      // 加载数据
      loadData() {
        this.loading = true
        queryPageList(this.getSearcFormData()).then(response => {
          ActionUtils.handleListData(this, response.data)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      /**
       * 获取格式化参数
       */
      getSearcFormData() {
        return ActionUtils.formatParams(
          this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
          this.pagination,
          this.sorts)
      },
      /**
       * 处理分页事件
       */
      handlePaginationChange(page) {
        ActionUtils.setPagination(this.pagination, page)
        this.loadData()
      },
      /**
       * 处理排序
       */
      handleSortChange(sort) {
        ActionUtils.setSorts(this.sorts, sort)
        this.loadData()
      },
      /**
       * 查询
       */
      search() {
        this.loadData()
      },
      /**
       * 处理按钮事件
       */
      handleAction(command, position, selection, data) {
        switch (command) {
          case 'search':// 查询
            ActionUtils.setFirstPagination(this.pagination)
            this.search()
            break
          case 'add':// 添加
            this.handleEdit()
            this.title = '添加角色'
            break
          case 'edit':// 编辑
            ActionUtils.selectedRecord(selection).then((id) => {
              this.handleEdit(id)
              this.title = '编辑角色'
            }).catch(() => { })
            break
          case 'detail':// 明细
            ActionUtils.selectedRecord(selection).then((id) => {
              this.handleEdit(id, true)
              this.title = '角色明细'
            }).catch(() => { })
            break
          case 'copy':// 复制
            this.title = '复制角色'
            this.data = data
            this.handleCopy(selection)
            break
          case 'remove':// 删除
            ActionUtils.removeRecord(selection).then((ids) => {
              this.handleRemove(ids)
            }).catch(() => { })
            break
          case 'userList':// 人员列表
            this.handleUserList(selection)
            break
          case 'assignResource':// 资源分配
            this.handleAsignResource(selection, data.subSystemId, '')
            break
          case 'appAssignResource':// app资源分配
            this.handleAsignResource(selection, data.subSystemId, 'app')
            break
          case 'authApiGrant':// 接口授权申请
            ActionUtils.selectedRecord(selection).then((id) => {
              this.handleApiGrant(id)
              this.title = '接口授权申请'
              this.clientKey = data.roleAlias
              this.grantType = 'role'
            }).catch(() => { })
            break
          default:
            break
        }
      },
      /**
       * 处理编辑
       */
      handleEdit(id = '', readonly = false) {
        this.editId = id
        this.readonly = readonly
        this.dialogFormVisible = true
      },
      /**
       * 复制角色信息
       */
      handleCopy(id) {
        this.copyFormVisible = true
        this.editId = id
      },
      /**
       * 接口授权申请
       */
      handleApiGrant(id = '') {
        this.editId = id
        this.apiGrantVisible = true
      },
      /**
       * 处理删除
       */
      handleRemove(ids) {
        remove({ roleIds: ids }).then(response => {
          ActionUtils.removeSuccessMessage()
          this.search()
        }).catch(() => {})
      },
      handleUserList(id) {
        this.editId = id
        this.dialogUserListVisible = true
      },
      handleAsignResource(id, systemId, type) {
        this.assignResourceType = type
        this.editId = id
        this.systemId = systemId
        this.dialogAssignResourceVisible = true
      },
      closeAll() {
        this.apiGrantVisible = false
      }
    }
  }
  </script>
  