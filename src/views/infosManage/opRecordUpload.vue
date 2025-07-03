<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                :category-key="categoryKey"
                :has-permission="true"
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
                :display-field="tableTitle"
                @sort-change="handleSortChange"
                @action-event="handleAction"
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
                <template
                    v-if="row.fuJian"
                    slot="file"
                    slot-scope="{row}"
                >
                    <ibps-attachment
                        v-model="row.fuJian"
                        allow-download
                        download
                        multiple
                        accept="*"
                        store="id"
                        readonly
                    />
                </template>
            </ibps-crud>
        </ibps-container>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :template-key="templateKey"
            :def-id="defId"
            :pk-value="pkValue"
            :add-data-cont="addDataCont"
            @close="closeHandle"
        />
        <data-template-formrender-dialog
            :visible="editDialogVisible"
            :form-key="formKey"
            :pk-value="pkValue"
            :toolbars="editToolbars"
            :readonly="false"
            :add-data-cont="addDataCont"
            @close="editClose"
        />
    </ibps-layout>
</template>
<script>
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { queryPaperOpRecod, removePaperOpRecod } from '@/api/business/general'

export default {
    components: {
        IbpsAttachment: () => import('@/business/platform/file/attachment/selector'),
        IbpsTypeTree: () => import('@/business/platform/cat/type/tree'),
        BpmnFormrender: () => import('@/business/platform/bpmn/form/dialog'),
        IbpsUserSelector: () => import('@/business/platform/org/selector'),
        DataTemplateFormrenderDialog: () => import('@/business/platform/data/templaterender/form/dialog.vue')
    },
    mixins: [FixHeight],
    data () {
        const { userId, isSuper, role, deptList = [], userList = [] } = this.$store.getters || {}
        const { first, second } = this.$store.getters.level || {}
        const hasRole = localStorage.getItem('hasHighRole') === '1'
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const deptOption = deptList.map(item => ({ label: item.positionName, value: item.positionId }))
        const roleList = ['xtgljs', 'wjglzzc', 'wjgly']
        const hasEditRole = role.some(item => roleList.includes(item.alias))
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
            isSuper,
            hasRole,
            userOption,
            deptOption,
            filterOption,
            level: second || first,
            width: 210,
            typeId: null,
            allSelectedNodeId: [],
            height: document.clientHeight,
            loading: false,
            filterText: '',
            categoryKey: 'FLOW_TYPE',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            defId: '1072813170935988224', // 以往体系运行记录流程ID
            formKey: 'ywyxjlb', // 以往体系运行记录表单
            dialogFormVisible: false,
            pkValue: '',
            addDataCont: {},
            templateKey: 'ywyxjlsc',
            tableTitle: '',
            editDialogVisible: false,
            editToolbars: [{
                button_type: 'close',
                label: '关闭',
                key: 'close'
            },
            {
                button_type: 'save',
                label: '保存',
                key: 'save'
            }],
            listData: [],
            searchParams: {
                dept: '',
                submitBy: ''
            },
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    // { key: 'add' },
                    { key: 'remove' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^nian_du_^SL', label: '记录月份', fieldType: 'date', dateType: 'month', dateFormat: 'yyyy-MM', itemWidth: 150 },
                        { prop: 'bian_zhi_bu_men_', label: '部门', fieldType: 'slot', slotName: 'dept', itemWidth: 120 },
                        { prop: 'Q^biao_dan_ming_che^SL', label: '表单名称', width: 150 },
                        { prop: 'Q^shi_wu_shuo_ming_^SL', label: '事务说明', width: 150 },
                        { prop: ['Q^bian_zhi_shi_jian^DL', 'Q^bian_zhi_shi_jian^DG'], label: '上传时间', fieldType: 'daterange' },
                        { prop: 'bian_zhi_ren_', label: '上传人', fieldType: 'slot', slotName: 'user' }
                    ]
                },
                // 表格字段配置
                columns: [
                    // { prop: 'fenLei', label: '表单分类', width: 120 },
                    { prop: 'nianDu', label: '记录月份', width: 100 },
                    { prop: 'bianZhiBuMen', label: '部门', tags: deptOption, width: 100, sortable: true },
                    { prop: 'biaoDanMingChe', label: '表单名称', width: 200 },
                    { prop: 'shiWuShuoMing', label: '事务说明', width: 250 },
                    { prop: 'fuJian', label: '附件', slotName: 'file', minWidth: 250 },
                    { prop: 'bianZhiShiJian', label: '上传时间', width: 140, sortable: true },
                    { prop: 'bianZhiRen', label: '上传人', tags: userOption, width: 100, sortable: true }
                ],
                rowHandle: {
                    effect: 'display',
                    actions: [
                        {
                            key: 'edit',
                            label: '修改',
                            type: 'primary',
                            icon: 'ibps-icon-edit',
                            hidden: function () {
                                return !hasEditRole
                            }
                        }
                    ]
                }
            },
            pagination: {},
            sorts: {},
            pageKey: ''
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        }
    },
    created () {
        this.pageKey = this.$route.name
        console.log(this.pageKey)
        // 文件与记录-纸质运行记录列表页面不显示删除按钮
        if (this.pageKey === 'ywyxjlsc' && !this.hasRole) {
            this.listConfig.toolbars = this.listConfig.toolbars.filter(el => el.key !== 'remove')
        }
    },
    mounted () {
        this.loadData()
    },
    methods: {
        refresh () {
            this.typeId = ''
            this.loadData()
        },
        handleExpandCollapse (isExpand, readonly = false) {
            this.width = isExpand ? 200 : 50
        },
        search () {
            this.loadData()
        },
        loadData () {
            this.loading = true
            console.log(this.getSearchFormData())
            queryPaperOpRecod(this.getSearchFormData()).then(res => {
                this.loading = false
                ActionUtils.handleListData(this, res.data)
            }).finally(() => {
                this.loading = false
            })
        },
        handleNodeClick (nodeId, nodeData, treeDatas) {
            // 避免重复请求
            if (this.typeId === nodeId) {
                return
            }
            this.addDataCont = { fenLei: nodeData.name, fenLeiId: nodeId }
            // 文件控制-纸质运行记录上传页面，无下级菜单且无添加按钮时显示添加按钮（仅对纸质运行记录上传列表生效）
            if (this.pageKey === 'ywyxjlsc') {
                const noChildren = nodeData.isLeaf === 'Y'
                const hasAddBtn = this.listConfig.toolbars.some(el => el.key === 'add')

                if (!noChildren && hasAddBtn) {
                    // 有下级菜单时，去除添加按钮
                    this.listConfig.toolbars = this.listConfig.toolbars.filter(el => el.key !== 'add')
                } else if (noChildren && !hasAddBtn && this.depth !== 0) {
                    // 无下级菜单且无添加按钮时，显示添加按钮（排除非根节点）
                    this.listConfig.toolbars.splice(1, 0, { key: 'add' })
                }
            }
            const result = this.getTail(nodeData)
            // 获取所选节点及所有子节点ID
            this.allSelectedNodeId = result.map(i => i.id)
            this.typeId = nodeId
            this.loadData()
        },
        /**
         * 递归获取所有子节点
         */
        getTail (node) {
            const result = [node] // 将自身信息添加到结果中
            if (node.children && node.children.length > 0) {
                // 如果有子节点，则递归获取子节点的信息
                node.children.forEach(child => {
                    result.push(...this.getTail(child)) // 将子节点信息添加到结果中
                })
            }
            return result
        },
        closeHandle (v) {
            this.dialogFormVisible = v
            this.loadData()
        },
        editClose (v) {
            this.editDialogVisible = v
            this.loadData()
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            params['Q^di_dian_^S'] = this.level
            if (this.$utils.isNotEmpty(this.typeId)) {
                params['Q^fen_lei_id_^S'] = this.allSelectedNodeId
            }
            const { dept, submitBy } = this.searchParams
            if (this.$utils.isNotEmpty(dept)) {
                params[`Q^bian_zhi_bu_men_^S`] = dept.split(',')
            }
            if (this.$utils.isNotEmpty(submitBy)) {
                params[`Q^bian_zhi_ren_^S`] = submitBy.split(',')
            }
            if (params['Q^nian_du_^SL']) {
                params[`Q^nian_du_^SL`] = this.$common.getFormatDate('string', 7, params[`Q^nian_du_^SL`])
            }
            // console.log(params)
            const result = {
                parameters: this.formatParameters(params),
                ...ActionUtils.formatParams(null, this.pagination, this.sorts)
            }
            return result
        },
        formatParameters (data) {
            if (this.$utils.isEmpty(data)) {
                return []
            }
            const parameters = Object.entries(data).map(([key, value]) =>
                Array.isArray(value)
                    ? { relation: 'OR', parameters: value.map(v => ({ key, value: v, param: this.$utils.guid() })) }
                    : { key, value }
            )
            return parameters.length === 1 ? [parameters[0]] : [{ relation: 'AND', parameters }]
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data, index, button) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'remove':
                    console.log(selection, data)
                    this.handleRemove(selection)
                    break
                case 'add': // 添加
                    this.dialogFormVisible = true
                    this.pkValue = ''
                    break
                case 'edit': // 添加
                    this.dialogFormVisible = true
                    this.pkValue = data.id
                    break
                default:
                    break
            }
        },
        /**
         * 删除记录
         */
        handleRemove (ids) {
            if (!ids || !ids.length) {
                return this.$message.warning('请选择要删除的数据！')
            }
            this.$confirm(`将删除所选中的 ${ids.length} 条数据，数据删除后无法恢复，确定要继续吗？`, '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                removePaperOpRecod({ ids: ids.join(',') }).then(() => {
                    ActionUtils.removeSuccessMessage()
                    this.search()
                }).catch(() => {})
            })
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
            // 处理字段长度，可能出现排序字段与数据库字段不一致情况
            sort.sortBy = sort.sortBy.slice(0, 17)
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        }
    }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 14px;
  margin: 21px 5px 5px;
  padding: 0;
}

/deep/ .el-tree-node__content {
  display: block;
}

/deep/ .el-form-item__label{
    text-align: left;
}

/deep/ .el-dialog__footer{
    display: flex;
    justify-content: center;
}

</style>
