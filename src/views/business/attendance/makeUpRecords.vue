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
        />
        <makeUpEdit
            v-if="showMakeUpEdit"
            :visible.sync="showMakeUpEdit"
            :params="bukaInfo"
            :readonly="readonly"
            @close="() => {closeBuKaDialog()}"
        />
    </div>
</template>

<script>
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { queryAttendanceReissue, saveAttendanceReissue } from '@/api/business/attendance'

export default {
    components: {
        makeUpEdit: () => import('./makeUpEdit')
    },
    mixins: [FixHeight],
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const deptOption = deptList.map(item => ({ label: item.positionName, value: item.positionId }))
        return {
            userOption,
            deptOption,
            title: '补卡记录',
            pkKey: 'id_', // 主键对应数据库字段
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {
                totalCount: 0,
                currentPage: 1,
                limit: 15
            },
            showMakeUpEdit: false,
            params: {},
            bukaInfo: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary' },
                    { key: 'add', icon: 'ibps-icon-plus', label: '申请', type: 'success' }
                ],
                searchForm: {
                    labelWidth: 90,
                    itemWidth: 200,
                    forms: [
                        // { prop: 'Q^bian_zhi_ren_^S', label: '申请人', fieldType: 'select', options: userOption },
                        { prop: ['Q^bian_zhi_shi_jian^DL', 'Q^bian_zhi_shi_jian^DG'], label: '申请时间', fieldType: 'daterange' },
                        { prop: 'Q^zhuang_tai_^SL', label: '状态', fieldType: 'select', options: [{ value: '待审核', label: '待审核' }, { value: '未通过', label: '未通过' }, { value: '已通过', label: '已通过' }, { value: '已撤销', label: '已撤销' }] },
                        { prop: ['Q^bu_ka_ri_qi_^DL', 'Q^bu_ka_ri_qi_^DG'], label: '补卡日期', fieldType: 'daterange' },
                        { prop: 'Q^bu_ka_ban_ci_^SL', label: '补卡班次' },
                        { prop: 'Q^bu_ka_shi_you_^SL', label: '补卡事由' }
                    ]
                },
                columns: [
                    { prop: 'bianZhiRen', label: '申请人', tags: userOption, width: 100 },
                    { prop: 'bianZhiShiJian', label: '申请时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', sortable: 'custom', width: 140 },
                    { prop: 'shenHeRen', label: '审批人', tags: userOption, dataType: 'stringArray', separator: ',', width: 200 },
                    { prop: 'shenHeShiJian', label: '审批时间', dateFormat: 'yyyy-MM-dd HH:mm:ss', sortable: 'custom', width: 140 },
                    { prop: 'zhuangTai', label: '状态', width: 90 },
                    { prop: 'buKaRiQi', label: '补卡日期', dateFormat: 'yyyy-MM-dd', sortable: 'custom', width: 100 },
                    { prop: 'buKaShiJian', label: '补卡时间', dateFormat: 'HH:mm:ss', sortable: 'custom', width: 100 },
                    { prop: 'buKaBanCi', label: '补卡班次', width: 120 },
                    { prop: 'buKaShiYou', label: '补卡事由', minWidth: 300 },
                    { prop: 'fuJian', label: '说明附件', width: 0, hidden: true },
                    { prop: 'paiBanId', label: '关联排班', width: 0, hidden: true },
                    { prop: 'paiBanJiLuId', label: '关联排班详情', width: 0, hidden: true }
                ],
                rowHandle: {
                    effect: 'default',
                    // effect: 'display',
                    actions: [
                        { key: 'cancel', label: '撤销', type: 'danger', icon: 'ibps-icon-cancel', hidden: function (row) { return (row.zhuang_tai_ !== '待审核') } },
                        { key: 'edit', label: '编辑', type: 'primary', icon: 'ibps-icon-edit', hidden: function (row) { return (row.zhuang_tai_ !== '已撤销') } },
                        { key: 'detail', label: '详情', type: 'primary', icon: 'ibps-icon-list-alt' }
                    ]
                }
            }
        }
    },
    computed: {
    },
    created () {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData () {
            this.loading = true
            queryAttendanceReissue(this.getSearchFormData()).then(res => {
                this.listData = res.data.dataResult
                // 做部门和姓名处理
                this.listData.forEach(item => {
                    item.userName = this.getUserLabel(item.yong_hu_id_)
                    item.deptName = this.getDeptLabel(item.bu_men_)
                })
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        getUserLabel (userId) {
            const user = this.userOption.find(item => item.value === userId)
            return user ? user.label : ''
        },
        getDeptLabel (positionId) {
            const dept = this.deptOption.find(item => item.value === positionId)
            return dept ? dept.label : ''
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const { first, second } = this.$store.getters.level || {}
            const searchParam = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            searchParam['Q^di_dian_^S'] = second || first
            searchParam['Q^bian_zhi_ren_^S'] = this.$store.getters.userId
            return ActionUtils.formatParams(searchParam, this.pagination, this.sorts)
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
        // 操作处理
        handleAction (command, _, selection, data) {
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.loadData()
                    break
                case 'edit':
                    this.handleEdit(command, data)
                    break
                case 'add':
                    this.handleEdit(command, {})
                    break
                case 'detail':
                    this.handleEdit(command, data)
                    break
                case 'cancel':
                    this.handleCancel(data)
                    break
            }
        },
        /**
         * 处理编辑
         */
        async handleEdit (key, data) {
            this.params = {
                data,
                action: key === 'detail' ? 'view' : 'edit'
            }
            this.bukaInfo = data
            this.readonly = key === 'detail'
            this.showMakeUpEdit = true
        },
        closeBuKaDialog () {
            this.showMakeUpEdit = false
            this.loadData()
        },
        /**
         * 处理取消
         */
        async handleCancel (data) {
            data.zhuang_tai_ = '已撤销'
            saveAttendanceReissue(data).then(res => {
                this.$message.success('撤销成功')
            }).catch((e) => { console.error(e) })
        }
    }
}
</script>

<style scoped>
.main-container {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

::v-deep .el-table {
    .el-table__column[prop="bu_men_"] { min-width: 200px; }
    .el-table__column[prop="pal_ban_ming_chen"] { min-width: 180px; }
    .el-tag { margin: 2px; }
}
</style>
