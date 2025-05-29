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
                    <el-table-column key="gong_hao_" prop="gong_hao_" label="工号" width="80" />
                </el-table-column>
                <!-- 班次信息分组 -->
                <el-table-column label="班次信息">
                    <el-table-column key="pai_ban_ming_chen" prop="pai_ban_ming_chen" label="排班名称" min-width="140" />
                    <el-table-column key="ban_ci_ming_" prop="ban_ci_ming_" label="班次名" width="100" />
                    <el-table-column key="ban_ci_bie_ming_" prop="ban_ci_bie_ming_" label="班次别名" width="100" />
                </el-table-column>
                <el-table-column key="ri_qi_" prop="ri_qi_" label="日期" width="100" />
                <!-- 上班分组 -->
                <el-table-column label="上班">
                    <el-table-column key="da_ka_shi_jian_1_" prop="da_ka_shi_jian_1_" label="打卡时间" width="160" />
                    <el-table-column key="zhuang_tai_1_" prop="zhuang_tai_1_" label="打卡状态" width="90">
                        <template #default="{ row }">
                            <span :style="{ color: row.zhuang_tai_1_=='异常' ? 'red' : (!row.da_ka_shi_jian_1_ ? 'red' :'inherit') }">
                                {{ !row.da_ka_shi_jian_1_ ? '缺勤' : (row.zhuang_tai_1_ === '异常' ? '迟到' : row.zhuang_tai_1_) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- 下班分组 -->
                <el-table-column label="下班">
                    <el-table-column key="da_ka_shi_jian_2_" prop="da_ka_shi_jian_2_" label="打卡时间" width="160" />
                    <el-table-column key="zhuang_tai_2_" prop="zhuang_tai_2_" label="打卡状态" width="90">
                        <template #default="{ row }">
                            <span :style="{ color: row.zhuang_tai_2_=='异常' ? 'red' : (!row.da_ka_shi_jian_2_ ? 'red' :'inherit') }">
                                {{ !row.da_ka_shi_jian_2_ ? '缺勤' : (row.zhuang_tai_2_ === '异常' ? '迟到' : row.zhuang_tai_2_) }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column key="chi_dao_shi_chang" prop="chi_dao_shi_chang" label="迟到时长(分钟)" width="120" />
                <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="打卡次数" width="90" />
                <el-table-column key="kao_qin_zhuang_ta" prop="kao_qin_zhuang_ta" label="考勤状态" width="90">
                    <template #default="{ row }">
                        <span :style="{ color: row.kao_qin_zhuang_ta=='异常' ? 'red' : 'inherit' }">
                            {{ row.kao_qin_zhuang_ta }}
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
import color from '@/store/modules/ibps/modules/color'

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
            const sql = this.getSearchSql()
            this.$common.request('sql', sql).then(res => {
                this.listData = res.variables.data
                // 做部门和姓名处理
                this.listData.forEach(item => {
                    item.userName = this.getUserLabel(item.yong_hu_id_)
                    item.deptName = this.getDeptLabel(item.bu_men_)
                    // 考勤状态-缺勤
                    if (item.kao_qin_zhuang_ta === '') {
                        item.kao_qin_zhuang_ta = '异常'
                    }
                })
                debugger
                this.pagination.totalCount = this.listData[0]?.total_count
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
        getSearchSql () {
            const params = this.getSearchFormData()
            const { first, second } = this.$store.getters.level || {}
            let sql = `select t.*, (select COUNT(*) FROM t_attendance_detail WHERE di_dian_ = '${second || first}' and ri_qi_ < '${this.$common.getDateNow()}') AS total_count FROM t_attendance_detail t  ORDER BY ri_qi_ DESC `
            // 定义操作符映射
            const operatorMap = {
                'S': '=',
                'SL': 'LIKE',
                'DG': '<=',
                'DLS': '>',
                'DGT': '<',
                'DL': '>='
            }
            // 如果有查询条件，构建 WHERE 子句
            if (params.parameters && params.parameters.length > 0) {
                const conditions = []
                params.parameters.forEach(item => {
                    const { key, value } = item
                    const parts = key.split('^') // 格式: Q^field^operator
                    if (parts.length === 3 && parts[0] === 'Q') {
                        const field = parts[1] // 字段名
                        const operatorKey = parts[2] // 操作符（S/SL/DG/DL）
                        const operator = operatorMap[operatorKey]
                        if (operator) {
                            let condition
                            if (operator === 'LIKE') {
                                condition = `${field} LIKE '%${value}%'` // LIKE 模糊查询
                            } else {
                                condition = `${field} ${operator} '${value}'` // 其他操作符（=, <=, >=）
                            }
                            conditions.push(condition)
                        }
                    }
                })
                debugger
                if (conditions.length > 0) { // 正常查询条件一定会大于0，因为地点必查
                    conditions.forEach((condition, index) => {
                        if (condition.includes('异常')) {
                            conditions[index] = `(kao_qin_zhuang_ta = '异常' or kao_qin_zhuang_ta = '') `
                        }
                    })
                    let wherestr = ' WHERE ' + conditions.join(' AND ')
                    if (this.searchXinMing) {
                        wherestr += `and yong_hu_id_ in ('` + this.searchXinMing.split(',').join("','") + `')`
                    }
                    sql = `select t.*, (select COUNT(*) FROM t_attendance_detail ${wherestr} ) AS total_count FROM t_attendance_detail t ${wherestr}  ORDER BY ri_qi_ DESC `
                }
            }
            // 添加分页
            sql += ` LIMIT ${this.pagination.limit} OFFSET ${(this.pagination.page - 1) * this.pagination.limit}`
            return sql
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
                    field_name: 'gong_hao_',
                    label: '工号',
                    name: 'gong_hao_'
                },
                {
                    field_name: 'pai_ban_ming_chen',
                    label: '排班名称',
                    name: 'pai_ban_ming_chen'
                },
                {
                    field_name: 'ban_ci_ming_',
                    label: '班次名',
                    name: 'ban_ci_ming_'
                },
                {
                    field_name: 'ban_ci_bie_ming_',
                    label: '班次别名',
                    name: 'ban_ci_bie_ming_'
                },
                {
                    field_name: 'ri_qi_',
                    label: '日期',
                    name: 'ri_qi_'
                },
                {
                    field_name: 'da_ka_shi_jian_1_',
                    label: '上班打卡时间',
                    name: 'da_ka_shi_jian_1_'
                },
                {
                    field_name: 'zhuang_tai_1_',
                    label: '上班打卡状态',
                    name: 'zhuang_tai_1_'
                },
                {
                    field_name: 'da_ka_shi_jian_2_',
                    label: '下班打卡时间',
                    name: 'da_ka_shi_jian_2_'
                },
                {
                    field_name: 'zhuang_tai_2_',
                    label: '下班打卡状态',
                    name: 'zhuang_tai_2_'
                },
                {
                    field_name: 'chi_dao_shi_chang',
                    label: '迟到时长(分钟)',
                    name: 'chi_dao_shi_chang'
                },
                {
                    field_name: 'da_ka_ci_shu_',
                    label: '打卡次数',
                    name: 'da_ka_ci_shu_'
                },
                {
                    field_name: 'kao_qin_zhuang_ta',
                    label: '考勤状态',
                    name: 'kao_qin_zhuang_ta'
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