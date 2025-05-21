<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
            :display-field="title"
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
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick"
        >
            <template slot="dateRange" slot-scope="scope">
                <span>{{ `${scope.row.startDate} 至 ${scope.row.endDate}` }}</span>
            </template>
            <template slot="partys" slot-scope="scope">
                <span v-for="party in scope.row.partys" :key="party.value">
                    <span v-if="party.value !== scope.row.createBy" :class="getTagClass(party)" class="el-tag el-tag--small el-tag--light" style="margin-left: 5px;">{{ party.label }}</span>
                </span>
            </template>
        </ibps-crud>
        <adjust-edit
            v-if="showAdjustEdit"
            :visible.sync="showAdjustEdit"
            :params="params"
            :readonly="readonly"
            @refresh="loadData"
            @close="() => showAdjustEdit = false"
        />
    </div>
</template>

<script>
import { queryAdjustment, removeAdjustment, sendMessage, saveAdjustment } from '@/api/business/schedule'
import { stateType } from '@/views/constants/schedule'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
    components: {
        AdjustEdit: () => import('./components/adjust-edit')
    },
    mixins: [FixHeight],
    data () {
        const { userList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userOption,
            stateType,
            title: '调班申请记录',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            showAdjustEdit: false,
            readonly: false,
            params: {},
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary', hidden: false },
                    { key: 'create', icon: 'ibps-icon-plus', label: '申请', type: 'success', hidden: false },
                    { key: 'remove', icon: 'ibps-icon-close', label: '删除', type: 'danger', hidden: !this.isRoleFilter() }
                ],
                searchForm: {
                    labelWidth: 80,
                    itemWidth: 180,
                    forms: [
                        { prop: 'Q^reason_^SL', label: '调班原因' },
                        { prop: 'Q^status^S', label: '状态', fieldType: 'select', options: stateType },
                        { prop: ['Q^create_time_^DL', 'Q^create_time_^DG'], label: '申请时间', fieldType: 'daterange', itemWidth: 200 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'createBy', label: '申请人', tags: userOption, width: 100 },
                    { prop: 'createTime', label: '申请时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 140 },
                    { prop: 'partys', label: '审核人', fieldType: 'slot', slotName: 'partys', minWidth: 120 },
                    { prop: 'executor', label: '审批人', tags: userOption, dataType: 'stringArray', separator: ',', minWidth: 120 },
                    { prop: 'executeDate', label: '审批时间', dateFormat: 'yyyy-MM-dd HH:mm', sortable: 'custom', width: 140 },
                    { prop: 'reason', label: '调班原因', width: 150 },
                    { prop: 'status', label: '状态', tags: stateType, width: 100 },
                    { prop: 'overview', label: '概览', minWidth: 200 }
                ],
                rowHandle: {
                    effect: 'default',
                    // effect: 'display',
                    actions: [
                        { key: 'edit', label: '编辑', type: 'primary', icon: 'ibps-icon-edit', hidden: function (row) { return row.status !== '已暂存' && row.status !== '已取消' } },
                        { key: 'cancel', label: '取消', type: 'danger', icon: 'ibps-icon-cancel', hidden: function (row) { return !(row.status === '待审核' && row.createBy === this.$store.getters.userId) } },
                        { key: 'edit', label: '再次申请', type: 'primary', icon: 'ibps-icon-edit', hidden: function (row) { return row.status !== '已拒绝' } },
                        { key: 'detail', label: '详情', type: 'primary', icon: 'ibps-icon-list-alt' }
                    ]
                }
            }
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData () {
            this.loading = true
            queryAdjustment(this.getSearchFormData()).then(res => {
                ActionUtils.handleListData(this, res.data)
                // 处理审核人数据
                res.data.dataResult.forEach((el) => {
                    el.partys = this.getPartysList(el.adjustmentDetailPoList)
                })
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 判断当前用户是否为超级管理员和高权限角色
         */
        isRoleFilter () {
            const highRoles = this.$store.getters.userInfo.highRoles || [] // 高权限角色
            const userRole = this.$store.getters.userInfo.role || [] // 用户权限角色
            let isHighRole = false
            userRole.forEach(el => {
                const roleAlias = el.alias
                if (highRoles.includes(roleAlias)) {
                    isHighRole = true
                }
            })
            return (this.$store.getters.isSuper || isHighRole)
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const parameters = [{
                relation: 'AND',
                parameters: [
                    {
                        'key': 'Q^reason_^NE',
                        'value': '排班修改',
                        'param': 'status1'
                    }
                ]
            }]
            // 加入搜索栏参数
            const searchParam = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (Object.keys(searchParam).length) { // 查询条件不为空，则加入parameters
                const reasonArr = Object.keys(searchParam).filter(key => key.includes('reason'))
                const notreasonArr = Object.keys(searchParam).filter(key => key.includes('reason') === false)
                if (reasonArr.length > 0) { // 加入状态查询
                    parameters[0].parameters.push({
                        'key': reasonArr[0],
                        'value': searchParam[reasonArr[0]],
                        'param': 'reason2'
                    })
                }
                if (notreasonArr.length > 0) { // 加入其他查询
                    notreasonArr.forEach((el) => {
                        parameters[0].parameters.push({
                            'key': el,
                            'value': searchParam[el]
                        })
                    })
                }
            }
            const { first, second } = this.$store.getters.level || {}
            parameters[0].parameters.push({ 'key': 'Q^di_dian_^S', 'value': (second || first) })
            if (this.isRoleFilter()) { // 超级管理员和高权限角色不做申请人过滤
            } else {
                const { userId } = this.$store.getters || ''
                if (userId) {
                    parameters[0].parameters.push({ 'key': 'Q^create_By_^S', 'value': userId })
                }
            }
            const param = {
                parameters: parameters,
                ...ActionUtils.formatParams(null, this.pagination, this.sorts)
            }
            return param
        },
        /**
         * 处理审核人数据
         */
        getPartysList (poList) {
            const self = this
            const result = poList.reduce((acc, currentItem) => {
                const existing = acc.find(item => item.value === currentItem.party)
                if (!existing) {
                    acc.push({
                        value: currentItem.party,
                        status: currentItem.status,
                        label: (self.userOption.filter(o => o.value === currentItem.party))[0].label,
                        type: 'success'
                    })
                }
                return acc
            }, [])
            return result
        },
        /**
         * 处理审核人样式
         */
        getTagClass (party) {
            switch (party.status) {
                case '已通过':
                    return 'el-tag--success'
                case '已拒绝':
                    return 'el-tag--danger'
                case '待审核':
                    return 'el-tag--primary'
                default:
                    return 'el-tag--primary'
            }
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
         * 查询
         */
        search () {
            this.loadData()
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'create':
                    this.handleEdit(command, {})
                    break
                case 'edit':
                    this.handleEdit(command, data)
                    break
                case 'cancel':
                    this.handleCancel(data)
                    break
                case 'detail':
                    this.handleEdit(command, data)
                    break
                case 'remove':
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => {})
                    break
                default:
                    break
            }
        },
        /**
         * 处理编辑
         */
        async handleEdit (key, { id, scheduleId }) {
            this.params = {
                id,
                scheduleId,
                action: key === 'detail' ? 'view' : 'edit'
            }
            this.readonly = key === 'detail'
            this.showAdjustEdit = true
        },
        /**
         * 处理取消
         */
        async handleCancel (data) {
            data.status = '已取消'
            // 改为通用接口
            const tableName = 't_adjustment'
            const updateParams = {
                tableName,
                updList: [
                    {
                        where: {
                            id_: data.id
                        },
                        param: {
                            status: data.status
                        }
                    }]
            }
            this.$common.request('update', updateParams).then(async () => {
                const sonTableName = 't_adjustment_detail'
                const sonUpdateParams = {
                    tableName: sonTableName,
                    updList: [
                        {
                            where: {
                                parent_id_: data.id
                            },
                            param: {
                                status_: data.status
                            }
                        }]
                }
                // 更新子表
                this.$common.request('update', sonUpdateParams).then(() => {
                    ActionUtils.successMessage()
                    this.search()
                    // 告知审核人该单已取消(除非是自己的排版变更取消)
                    if (data.dbType !== 'paiban') {
                        data.adjustmentDetailPoList.forEach((el) => { // 遍历子表提取审核人字段
                            sendMessage(data, el.party)
                        })
                    }
                }).catch((e) => { console.error(e) })
            }).catch((e) => { console.error(e) })
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            // return this.$message.warning('避免误删测试数据，联系开发删除')
            removeAdjustment({ ids }).then(() => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        },
        handleRowDblclick (row) {
            // this.handleEdit(row, 'detail')
        }
    }
}
</script>
<style lang="scss">
</style>
