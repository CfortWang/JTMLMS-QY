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
            <!-- 自定义多级表头 -->
            <template #prepend-column>
                <el-table-column key="yong_hu_id_" prop="yong_hu_id_" label="用户" width="80">
                    <template #default="{ row }">
                        <el-tag style="margin: 2px;">
                            {{ getUserLabel(row.yong_hu_id_) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <!-- 基本信息分组 -->
                <el-table-column label="基本信息">
                    <!--<el-table-column prop="yong_hu_id_" title="用户" key="yong_hu_id_" width="80" />-->
                    <el-table-column key="gong_hao_" prop="gong_hao_" label="工号" width="80" />
                    <el-table-column key="bu_men_" prop="bu_men_" label="部门" width="100">
                        <template #default="{ row }">
                            <el-tag style="margin: 2px;">
                                {{ getDeptLabel(row.bu_men_) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- 班次信息分组 -->
                <el-table-column label="班次信息">
                    <el-table-column key="pai_ban_ming_chen" prop="pai_ban_ming_chen" label="排班名称" width="120" />
                    <el-table-column key="ban_ci_ming_" prop="ban_ci_ming_" label="班次名" width="80" />
                    <el-table-column key="ban_ci_bie_ming_" prop="ban_ci_bie_ming_" label="班次别名" width="80" />
                </el-table-column>
                <el-table-column key="ri_qi_" prop="ri_qi_" label="日期" width="100" />
                <!-- 上班分组 -->
                <el-table-column label="上班">
                    <el-table-column key="da_ka_shi_jian_1_" prop="da_ka_shi_jian_1_" label="打卡时间" width="120" />
                    <el-table-column key="zhuang_tai_1_" prop="zhuang_tai_1_" label="打卡状态" width="80">
                        <template #default="{ row }">
                            <span :style="{ color: row.zhuang_tai_2_=='异常' ? 'red' : 'inherit' }">
                                {{ row.zhuang_tai_2_ }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- 下班分组 -->
                <el-table-column label="下班">
                    <el-table-column key="da_ka_shi_jian_2_" prop="da_ka_shi_jian_2_" label="打卡时间" width="120" />
                    <el-table-column key="zhuang_tai_2_" prop="zhuang_tai_2_" label="打卡状态" width="80">
                        <template #default="{ row }">
                            <span :style="{ color: row.zhuang_tai_2_=='异常' ? 'red' : 'inherit' }">
                                {{ row.zhuang_tai_2_ }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column key="chi_dao_shi_chang" prop="chi_dao_shi_chang" label="迟到时长(分钟)" width="100" />
                <el-table-column key="da_ka_ci_shu_" prop="da_ka_ci_shu_" label="打卡次数" width="70" />
                <el-table-column key="kao_qin_zhuang_ta" prop="kao_qin_zhuang_ta" label="考勤状态" width="80">
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
import color from '@/store/modules/ibps/modules/color'

export default {
    mixins: [FixHeight],
    data () {
        const { userList = [], deptList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        const deptOption = deptList.map(item => ({ label: item.positionName, value: item.positionId }))
        return {
            userOption,
            deptOption,
            title: '考勤明细统计',
            pkKey: 'pal_ban_lu_l_uL', // 主键对应数据库字段
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {
                currentPage: 1,
                limit: 20
            },
            sorts: {},
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary' },
                    { key: 'export', icon: 'ibps-icon-download', label: '导出', type: 'warning' }
                ],
                searchForm: {
                    labelWidth: 100,
                    forms: [
                        { prop: 'Q^pai_ban_ming_chen^SL', label: '排班名称' },
                        { prop: 'Q^yong_hu_id_^S', label: '用户' },
                        { prop: 'Q^bu_men_^SL', label: '部门', fieldType: 'select', options: deptOption },
                        { prop: 'Q^kao_qin_zhuang_ta^SL', label: '考勤状态' },
                        { prop: ['Q^ri_qi_^DG', 'Q^ri_qi_^DL'], label: '日期范围', fieldType: 'daterange' }
                    ]
                },
                columns: []
            }
        }
    },
    computed: {
    },
    created() {
        this.loadData()
    },
    methods: {
        // 加载数据
        loadData() {
            this.loading = true
            const sql = `select * FROM t_attendance_detail 
                        LIMIT ${this.pagination.limit} 
                        OFFSET ${(this.pagination.currentPage-1)*this.pagination.limit}`
            debugger
            this.$common.request('sql', sql).then(res => {
                this.listData = res.variables.data
                this.pagination.total = res.totalCount
            }).finally(() => {
                this.loading = false
            })
        },
        getUserLabel(userId) {
            const user = this.userOption.find(item => item.value === userId)
            return user ? user.label : ''
        },
        getDeptLabel(positionId) {
            const dept = this.deptOption.find(item => item.value === positionId)
            return dept ? dept.label : ''
        },
        // 构造查询参数
        getSearchParams() {
            const params = this.$refs.crud?.getSearcFormData() || {}
            return ActionUtils.formatParams(params, this.pagination, this.sorts)
        },

        // 分页/排序处理
        handlePaginationChange(page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        handleSortChange(sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },

        // 操作处理
        handleAction(command, _, selection) {
            switch(command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.loadData()
                    break
                case 'export':
                    this.exportData()
                    break
            }
        },
        // 导出数据（需实现后端接口）
        exportData() {
            const sql = 'SELECT * FROM t_attendance_detail'
            this.$common.request('export', { sql }).then(res => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(new Blob([res.data]))
                link.download = `考勤明细_${new Date().toLocaleDateString()}.csv`
                link.click()
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