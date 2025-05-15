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
            <!-- 自定义多级表头 -->
            <template #prepend-column>
                <el-table-column key="user_name_" prop="user_name_" label="姓名" width="90">
                    <template #default="{ row }">
                        <el-tag style="margin: 2px;">
                            {{ row.user_name_ }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 基本信息分组 -->
                <el-table-column label="基本信息">
                    <!--<el-table-column prop="yong_hu_id_" title="姓名" key="yong_hu_id_" width="80" />-->
                    <el-table-column key="pos_name_" prop="pos_name_" label="部门" width="90">
                        <template #default="{ row }">
                            <el-tag style="margin: 2px;">
                                {{ row.pos_name_ }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column key="gong_hao_" prop="gong_hao_" label="工号" width="70" />
                </el-table-column>
                <!-- 考勤情况 -->
                <el-table-column label="考勤情况">
                    <el-table-column key="ying_chu_qin_shu" prop="ying_chu_qin_shu" label="应出勤天数" width="80" />
                    <el-table-column key="shi_ji_chu_qin_shu" prop="shi_ji_chu_qin_shu" label="实际出勤天数" width="85" />
                    <el-table-column key="xiu_xi_shu" prop="xiu_xi_shu" label="休息天数" width="85" />
                    <el-table-column key="zheng_chang_shu" prop="zheng_chang_shu" label="正常天数" width="65" />
                    <el-table-column key="yi_chang_shu" prop="yi_chang_shu" label="异常天数" width="65" />
                    <el-table-column key="total_ban_ci_shi_chang" prop="total_ban_ci_shi_chang" label="标准工作时长(小时)" width="120" />
                    <el-table-column key="total_gong_zuo_shi_chan" prop="total_gong_zuo_shi_chan" label="实际工作时长(小时)" width="120" />
                </el-table-column>
                <!-- 异常统计 -->
                <el-table-column label="异常统计">
                    <el-table-column key="yi_chang_he_ji" prop="yi_chang_he_ji" label="异常合计" width="70">
                        <template #default="{ row }">
                            <span :style="{ color: 'red' }">
                                {{ row.yi_chang_he_ji }}次
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column key="chi_dao_ci_shu" prop="chi_dao_ci_shu" label="迟到次数" width="70">
                        <template #default="{ row }">
                            <span :style="{ color: 'red' }">
                                {{ row.chi_dao_ci_shu }}次
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column key="total_chi_dao_shi_chang" prop="total_chi_dao_shi_chang" label="迟到时长(分钟)" width="100">
                        <template #default="{ row }">
                            <span :style="{ color: 'red' }">
                                {{ row.total_chi_dao_shi_chang }}
                            </span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column key="zao_tui_ci_shu" prop="zao_tui_ci_shu" label="早退次数" width="70" />
                    <el-table-column key="zao_tui_shi_chang" prop="zao_tui_shi_chang" label="早退时长" width="70" />-->
                    <el-table-column key="kuang_gong_ci_shu" prop="kuang_gong_ci_shu" label="旷工次数" width="80">
                        <template #default="{ row }">
                            <span :style="{ color: 'red' }">
                                {{ row.kuang_gong_ci_shu }}次
                            </span>
                        </template>
                    </el-table-column>
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
                totalCount: 0,
                page: 1,
                limit: 15
            },
            sorts: {},
            daterRange: [],
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
            searchParam['Q^ri_qi_^DL'] = this.daterRange[0]
            searchParam['Q^ri_qi_^DG'] = this.daterRange[1]
            return ActionUtils.formatParams(searchParam, this.pagination, this.sorts)
        },
        getSearchSql () {
            let sql = ``
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
                    const wherestr = ' WHERE ' + conditions.join(' AND ')
                    sql = `select 
                        (select COUNT(DISTINCT USER_ID_) 
                            FROM v_attendance_statistics 
                             ${wherestr}
                        ) AS total_count,
                        USER_ID_,
                        ri_qi_,
                        user_name_,
		                pos_name_,
		                gong_hao_,
                        COUNT(ri_qi_) AS ying_chu_qin_shu,
                        SUM(CASE WHEN (da_ka_shi_jian_1_ IS NULL OR da_ka_shi_jian_1_ = '') 
                                AND (da_ka_shi_jian_2_ IS NULL OR da_ka_shi_jian_2_ = '') 
                                THEN 1 ELSE 0 END) AS xiu_xi_shu,
                        COUNT(ri_qi_) - SUM(CASE WHEN (da_ka_shi_jian_1_ IS NULL OR da_ka_shi_jian_1_ = '') 
                                                AND (da_ka_shi_jian_2_ IS NULL OR da_ka_shi_jian_2_ = '') 
                                                THEN 1 ELSE 0 END) AS shi_ji_chu_qin_shu,
                        SUM(kao_qin_zhuang_ta) AS zheng_chang_shu,
                        SUM(CASE WHEN kao_qin_zhuang_ta = '异常' OR kao_qin_zhuang_ta IS NULL OR kao_qin_zhuang_ta = '' THEN 1 ELSE 0 END) AS yi_chang_shu,
                        ROUND(SUM(ban_ci_shi_chang_) / 60.0,2) AS total_ban_ci_shi_chang,
                        ROUND(SUM(gong_zuo_shi_chan) / 60.0,2) AS total_gong_zuo_shi_chan,
                        SUM(CASE WHEN zhuang_tai_1_ = '异常' OR zhuang_tai_2_ = '异常' THEN 1 ELSE 0 END) AS chi_dao_ci_shu,
                        SUM(chi_dao_shi_chang) AS total_chi_dao_shi_chang,
                        SUM(CASE WHEN zhuang_tai_1_ IS NULL OR zhuang_tai_1_ = '' THEN 1 ELSE 0 END) + 
                        SUM(CASE WHEN zhuang_tai_2_ IS NULL OR zhuang_tai_2_ = '' THEN 1 ELSE 0 END) AS kuang_gong_ci_shu,

                        SUM(CASE WHEN zhuang_tai_1_ = '异常' THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN zhuang_tai_2_ = '异常' THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN zhuang_tai_1_ IS NULL OR zhuang_tai_1_ = '' THEN 1 ELSE 0 END) + 
                        SUM(CASE WHEN zhuang_tai_2_ IS NULL OR zhuang_tai_2_ = '' THEN 1 ELSE 0 END) AS yi_chang_he_ji
                    FROM 
                        v_attendance_statistics 
                    ${wherestr}
                    GROUP BY USER_ID_,ri_qi_ ORDER BY USER_ID_
                    LIMIT ${this.pagination.limit} OFFSET ${(this.pagination.page - 1) * this.pagination.limit}
                    `
                }
            }
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
                    field_name: 'user_name_',
                    label: '姓名',
                    name: 'user_name_'
                },
                {
                    field_name: 'pos_name_',
                    label: '部门',
                    name: 'pos_name_'
                },
                {
                    field_name: 'gong_hao_',
                    label: '工号',
                    name: 'gong_hao_'
                },
                {
                    field_name: 'ying_chu_qin_shu',
                    label: '应出勤天数',
                    name: 'ying_chu_qin_shu'
                },
                {
                    field_name: 'shi_ji_chu_qin_shu',
                    label: '实际出勤天数',
                    name: 'shi_ji_chu_qin_shu'
                },
                {
                    field_name: 'xiu_xi_shu',
                    label: '休息天数',
                    name: 'xiu_xi_shu'
                },
                {
                    field_name: 'zheng_chang_shu',
                    label: '正常天数',
                    name: 'zheng_chang_shu'
                },
                {
                    field_name: 'yi_chang_shu',
                    label: '异常天数',
                    name: 'yi_chang_shu'
                },
                {
                    field_name: 'total_ban_ci_shi_chang',
                    label: '标准工作时长(分钟)',
                    name: 'total_ban_ci_shi_chang'
                },
                {
                    field_name: 'total_gong_zuo_shi_chan',
                    label: '实际工作时长(分钟)',
                    name: 'total_gong_zuo_shi_chan'
                },
                {
                    field_name: 'yi_chang_he_ji',
                    label: '异常合计',
                    name: 'yi_chang_he_ji'
                },
                {
                    field_name: 'chi_dao_ci_shu',
                    label: '迟到次数',
                    name: 'chi_dao_ci_shu'
                },
                {
                    field_name: 'chi_dao_shi_chang',
                    label: '迟到时长(分钟)',
                    name: 'chi_dao_shi_chang'
                },

                {
                    field_name: 'kuang_gong_ci_shu',
                    label: '旷工次数',
                    name: 'kuang_gong_ci_shu'
                }
            ]
            this.handleExport(exportColumns, this.listData, `${this.daterRange[0] + '至' + this.daterRange[1]}考勤统计数据`)
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