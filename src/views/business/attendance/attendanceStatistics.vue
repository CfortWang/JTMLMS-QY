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
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleRowDblclick"
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
            <!-- 自定义多级表头 -->
            <template #prepend-column>
                <el-table-column key="userName" prop="userName" label="姓名" width="80">
                    <template #default="{ row }">
                        <el-tag style="margin: 2px;">
                            {{ row.userName }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 基本信息分组 -->
                <el-table-column label="基本信息">
                    <!--<el-table-column prop="yong_hu_id_" title="姓名" key="yong_hu_id_" width="80" />-->
                    <el-table-column key="deptName" prop="deptName" label="部门" width="100">
                        <template #default="{ row }">
                            <el-tag style="margin: 2px;">
                                {{ row.deptName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column key="gong_hao_" prop="gong_hao_" label="工号" width="70" />
                </el-table-column>
                <!-- 考勤情况 -->
                <el-table-column label="考勤情况">
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="应出勤天数" width="80" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="实际出勤天数" width="90" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="休息出勤天数" width="90" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="正常天数" width="70" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="异常天数" width="70" />
                    <el-table-column key="gong_zuo_shi_chan" prop="gong_zuo_shi_chan" label="标准工作时长" width="100" />
                    <el-table-column key="gong_zuo_shi_chan" prop="gong_zuo_shi_chan" label="实际工作时长" width="100" />
                </el-table-column>
                <!-- 异常统计 -->
                <el-table-column label="异常统计" :style="{ color: 'red' }">
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="异常合计" width="70" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="迟到次数" width="70" />
                    <el-table-column key="chi_dao_shi_chang" prop="chi_dao_shi_chang" label="迟到时长(分钟)" width="100" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="早退次数" width="70" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="早退时长" width="70" />
                    <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="旷工次数" width="70" />
                </el-table-column>
            </template>
        </ibps-crud>
    </div>
</template>

<script>
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import IbpsExport from '@/plugins/export'
import color from '@/store/modules/ibps/modules/color'
import { mount } from 'sortablejs'

export default {
    mixins: [FixHeight],
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const deptOption = deptList.map(item => ({ label: item.positionName, value: item.positionId }))
        return {
            userOption,
            deptOption,
            title: '考勤统计',
            pkKey: 'id_', // 主键对应数据库字段
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {
                currentPage: 1,
                limit: 20
            },
            sorts: {},
            daterRange: [],
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary' },
                    { key: 'export', icon: 'ibps-icon-download', label: '导出', type: 'primary' }
                ],
                searchForm: {
                    labelWidth: 100,
                    forms: [
                        { prop: '', label: '日期范围', fieldType: 'slot', slotName: 'time' },
                        { prop: 'Q^yong_hu_id_^S', label: '姓名', fieldType: 'select', options: userOption },
                        { prop: 'Q^gong_hao_^S', label: '工号' },
                        { prop: 'Q^bu_men_^SL', label: '部门', fieldType: 'select', options: deptOption }
                    ]
                },
                columns: []
            }
        }
    },
    computed: {
    },
    created () {
        const daterRange = this.getTodayDate()
        this.daterRange = [daterRange.sDay, daterRange.eDay]
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
                })
                // this.pagination.total = res.totalCount
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
            searchParam['Q^ri_qi_^DL'] = this.daterRange[0]
            searchParam['Q^ri_qi_^DG'] = this.daterRange[1]
            return ActionUtils.formatParams(searchParam, this.pagination, this.sorts)
        },
        getSearchSql () {
            let sql = `select * FROM t_attendance_detail`
            const params = this.getSearchFormData()
            // 定义操作符映射
            const operatorMap = {
                'S': '=',
                'SL': 'LIKE',
                'DG': '<=',
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

                if (conditions.length > 0) {
                    sql += ' WHERE ' + conditions.join(' AND ')
                }
            }
            // 添加分页
            sql += ` LIMIT ${this.pagination.limit} OFFSET ${(this.pagination.currentPage - 1) * this.pagination.limit}`
            return sql
        },
        getTodayDate () { // 获取初始化查询截止日期
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1) // 减去1天
            const year = yesterday.getFullYear()
            const month = String(yesterday.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要+1
            const day = String(yesterday.getDate()).padStart(2, '0')
            const daterRange = {
                sDay: `${year}-${month}-01`,
                eDay: `${year}-${month}-${day}`
            }
            return daterRange
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
    .el-table__column[prop="pal_ban_ming_chen"] { min-width: 180px; }
    .el-tag { margin: 2px; }
}
</style>