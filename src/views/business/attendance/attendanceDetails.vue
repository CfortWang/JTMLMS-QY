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
        >
            <template slot="time">
                <el-date-picker
                    v-model="daterRange"
                    size="mini"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    value-format="yyyy-MM-dd"
                />
            </template>
            <template slot="userSlot">
                <ibps-user-selector
                    v-model="searchXinMing"
                    type="user"
                    readonly-text="text"
                    :multiple="true"
                    size="mini"
                    :filter="filter"
                    filtrate
                />
            </template>
            <!-- 自定义多级表头 -->
            <template #prepend-column>
                <el-table-column key="userName" prop="userName" label="姓名" width="110">
                    <template #default="{ row }">
                        <el-tag style="margin: 2px;">
                            {{ row.userName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 基本信息分组 -->
                <el-table-column label="基本信息">
                    <!--<el-table-column prop="yong_hu_id_" title="姓名" key="yong_hu_id_" width="80" />-->
                    <el-table-column key="deptName" prop="deptName" label="部门" width="120">
                        <template #default="{ row }">
                            <el-tag style="margin: 2px;">
                                {{ row.deptName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column key="gongHao" prop="gongHao" label="工号" width="80" />
                </el-table-column>
                <!-- 班次信息分组 -->
                <el-table-column label="班次信息">
                    <el-table-column key="paiBanMingChen" prop="paiBanMingChen" label="排班名称" min-width="140" />
                    <el-table-column key="banCiMing" prop="banCiMing" label="班次名" width="100" />
                    <el-table-column key="banCiBieMing" prop="banCiBieMing" label="班次别名" width="100" />
                </el-table-column>
                <el-table-column key="riQi" prop="riQi" label="日期" width="100" />
                <!-- 上班分组 -->
                <el-table-column label="上班">
                    <el-table-column key="daKaShiJian1" prop="daKaShiJian1" label="打卡时间" width="160" />
                    <el-table-column key="zhuangTai1" prop="zhuangTai1" label="打卡状态" width="90">
                        <template #default="{ row }">
                            <span :style="{ color: row.zhuangTai1=='异常' ? 'red' : (!row.daKaShiJian1 ? 'red' :'inherit') }">
                                {{ !row.daKaShiJian1 ? '缺勤' : (row.zhuangTai1 === '异常' ? '迟到' : row.zhuangTai1) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- 下班分组 -->
                <el-table-column label="下班">
                    <el-table-column key="daKaShiJian2" prop="daKaShiJian2" label="打卡时间" width="160" />
                    <el-table-column key="zhuangTai2" prop="zhuangTai2" label="打卡状态" width="90">
                        <template #default="{ row }">
                            <span :style="{ color: row.zhuangTai2=='异常' ? 'red' : (!row.daKaShiJian2 ? 'red' :'inherit') }">
                                {{ !row.daKaShiJian2 ? '缺勤' : (row.zhuangTai2 === '异常' ? '迟到' : row.zhuangTai2) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column key="chiDaoShiChang" prop="chiDaoShiChang" label="迟到时长(分钟)" width="120" />
                <el-table-column key="daKaCiShu" prop="daKaCiShu" label="打卡次数" width="90" />
                <el-table-column key="kaoQinZhuangTa" prop="kaoQinZhuangTa" label="考勤状态" width="90">
                    <template #default="{ row }">
                        <span :style="{ color: row.kaoQinZhuangTa=='异常' ? 'red' : 'inherit' }">
                            {{ row.kaoQinZhuangTa }}
                        </span>
                    </template>
                </el-table-column>
            </template>
        </ibps-crud>
    </div>
</template>

<script>
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsExport from '@/plugins/export'
import ibpsUserSelector from '@/business/platform/org/selector'
import { queryAttendanceDetail } from '@/api/business/attendance'

export default {
    components: {
        ibpsUserSelector
    },
    mixins: [FixHeight],
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const deptOption = deptList.map(item => ({ label: item.positionName, value: item.positionId }))
        return {
            userOption,
            deptOption,
            title: '考勤明细',
            pkKey: 'id_', // 主键对应数据库字段
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {
                totalCount: 0,
                page: 1,
                limit: 15
            },
            filter: [{
                descVal: '1',
                includeSub: true,
                old: 'position',
                partyId: this.$store.getters.userInfo.employee.positions,
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            sorts: {},
            daterRange: [],
            searchXinMing: '',
            pickerOptions: {
                disabledDate (time) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    // 禁用今天及未来的日期
                    return time.getTime() >= today.getTime()
                }
            },
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary' },
                    { key: 'export', icon: 'ibps-icon-download', label: '导出', type: 'primary' }
                ],
                searchForm: {
                    labelWidth: 80,
                    itemWidth: 200,
                    forms: [
                        { prop: 'Q^kao_qin_zhuang_ta^S', label: '考勤状态', fieldType: 'select', options: [{ value: '正常', label: '正常' }, { value: '异常', label: '异常' }] },
                        // { prop: 'Q^yong_hu_id_^S', label: '姓名', fieldType: 'select', options: userOption },
                        { prop: '', label: '姓名', fieldType: 'slot', slotName: 'userSlot' },
                        { prop: 'Q^gong_hao_^S', label: '工号' },
                        { prop: 'Q^bu_men_^SL', label: '部门', fieldType: 'select', options: deptOption },
                        { prop: 'Q^pai_ban_ming_chen^SL', label: '排班名称' },
                        { prop: 'Q^ban_ci_ming_^SL', label: '班次名称' },
                        { prop: 'Q^ban_ci_bie_ming_^SL', label: '班次别名' },
                        { prop: '', label: '日期范围', fieldType: 'slot', slotName: 'time' }
                    ]
                },
                columns: []
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
            queryAttendanceDetail(this.getSearchFormData()).then(res => {
                this.listData = res.variables.data
                if (this.listData.length > 0) {
                    // 做部门和姓名处理
                    this.listData.forEach(item => {
                        item.userName = this.getUserLabel(item.yong_hu_id_)
                        item.deptName = this.getDeptLabel(item.bu_men_)
                        // 考勤状态-缺勤
                        if (item.kaoQinZhuangTa === '') {
                            item.kaoQinZhuangTa = '异常'
                        }
                    })
                }
            }).finally(() => {
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
            searchParam['Q^ri_qi_^DGT'] = this.$common.getDateNow()
            if (this.daterRange.length > 0) {
                searchParam['Q^ri_qi_^DL'] = this.daterRange[0]
                searchParam['Q^ri_qi_^DG'] = this.daterRange[1]
            }
            return ActionUtils.formatParams(searchParam, this.pagination, this.sorts)
        },
        // 分页/排序处理
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },

        // 操作处理
        handleAction (command, _, selection) {
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.loadData()
                    break
                case 'export':
                    this.exportData()
                    break
            }
        },
        // 导出数据
        exportData () {
            const exportColumns = [
                {
                    field_name: 'userName',
                    label: '姓名',
                    name: 'userName'
                },
                {
                    field_name: 'deptName',
                    label: '部门',
                    name: 'deptName'
                },
                {
                    field_name: 'gongHao',
                    label: '工号',
                    name: 'gongHao'
                },
                {
                    field_name: 'paiBanMingChen',
                    label: '排班名称',
                    name: 'paiBanMingChen'
                },
                {
                    field_name: 'banCiMing',
                    label: '班次名',
                    name: 'banCiMing'
                },
                {
                    field_name: 'banCiBieMing',
                    label: '班次别名',
                    name: 'banCiBieMing'
                },
                {
                    field_name: 'riQi',
                    label: '日期',
                    name: 'riQi'
                },
                {
                    field_name: 'daKaShiJian1',
                    label: '上班打卡时间',
                    name: 'daKaShiJian1'
                },
                {
                    field_name: 'zhuangTai1',
                    label: '上班打卡状态',
                    name: 'zhuangTai1'
                },
                {
                    field_name: 'daKaShiJian2',
                    label: '下班打卡时间',
                    name: 'daKaShiJian2'
                },
                {
                    field_name: 'zhuangTai2',
                    label: '下班打卡状态',
                    name: 'zhuangTai2'
                },
                {
                    field_name: 'chiDaoShiChang',
                    label: '迟到时长(分钟)',
                    name: 'chiDaoShiChang'
                },
                {
                    field_name: 'daKaCiShu',
                    label: '打卡次数',
                    name: 'daKaCiShu'
                },
                {
                    field_name: 'kaoQinZhuangTa',
                    label: '考勤状态',
                    name: 'kaoQinZhuangTa'
                }
            ]
            this.handleExport(exportColumns, this.listData, `考勤明细统计数据`)
        },
        handleExport (columns, data, title, message, nameKey = 'name') {
            IbpsExport.excel({
                columns: columns,
                data: data,
                nameKey: nameKey,
                title: title
            }).then(() => {
                const msg = message || '导出成功'
                ActionUtils.success(msg)
            })
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
    .el-table__column[prop="pal_ban_ming_chen"] { min-width: 200px; }
    .el-tag { margin: 2px; }
}
</style>
