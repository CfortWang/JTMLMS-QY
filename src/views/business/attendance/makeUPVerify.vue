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
import { queryAttendanceReissue, saveAttendanceReissue, saveAttendanceDetail, getAttendanceDetail } from '@/api/business/attendance'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

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
            title: '补卡审核',
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
            bukaInfo: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    { key: 'search', icon: 'ibps-icon-search', label: '查询', type: 'primary' }
                ],
                searchForm: {
                    labelWidth: 90,
                    itemWidth: 200,
                    class: 'el-form--inline',
                    forms: [
                        // { prop: 'Q^bian_zhi_ren_^S', label: '申请人', fieldType: 'select', options: userOption },
                        { prop: ['Q^bian_zhi_shi_jian^DL', 'Q^bian_zhi_shi_jian^DG'], label: '申请时间', fieldType: 'daterange' },
                        { prop: 'Q^zhuang_tai_^SL', label: '状态', fieldType: 'select', options: [{ value: '待审核', label: '待审核' }, { value: '未通过', label: '未通过' }, { value: '已通过', label: '已通过' }] },
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
                        { key: 'agree', label: '同意', type: 'success', icon: 'ibps-icon-check', hidden: function (row) { return (row.zhuang_tai_ === '已通过' || row.zhuang_tai_ === '已撤销' || row.zhuang_tai_ === '未通过') } },
                        { key: 'disagree', label: '不同意', type: 'danger', icon: 'ibps-icon-close', hidden: function (row) { return (row.zhuang_tai_ === '已通过' || row.zhuang_tai_ === '已撤销' || row.zhuang_tai_ === '未通过') } },
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
            searchParam['Q^shen_he_ren_^SL'] = this.$store.getters.userId
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
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':
                    ActionUtils.setFirstPagination(this.pagination)
                    this.loadData()
                    break
                case 'agree':
                    this.handleAgree(command, data)
                    break
                case 'disagree':
                    this.handleAgree(command, data)
                    break
                case 'detail':
                    this.handleEdit(command, data)
                    break
            }
        },
        /* 点击单条同意/不同意
         */
        async handleAgree (key, data) {
            const self = this
            let status = '未通过'
            if (key === 'agree') {
                status = '已通过'
            }
            const time = self.$common.getFormatDate()
            data.shenHeShiJian = time || ''
            data.zhuangTai = status
            const submitData = data

            /*
            const submitData = {
                banCiZhuangTai: data.ban_ci_zhuang_tai || '',
                bianZhiRen: data.bian_zhi_ren_ || '',
                bianZhiShiJian: data.bian_zhi_shi_jian || '',
                buKaBanCi: data.bu_ka_ban_ci_ || '',
                buKaRiQi: data.bu_ka_ri_qi_ || '',
                buKaShiJian: data.bu_ka_shi_jian_ || '',
                buKaShiYou: data.bu_ka_shi_you_ || '',
                createBy: data.create_by_ || '',
                createTime: data.create_time_ || '',
                diDian: data.di_dian_ || '',
                fuJian: data.fu_jian_ || '',
                id: data.id_ || '',
                ip: data.ip_ || '',
                kaoQinId: data.kao_qin_id_ || '',
                paiBanId: data.pai_ban_id_ || '',
                paiBanJiLuId: data.pai_ban_ji_lu_id_ || '',
                shenHeRen: data.shen_he_ren_ || '',
                shenHeShiJian: time || '',
                shenHeYiJian: data.shen_he_yi_jian_ || '',
                tenantId: data.tenant_id_ || '',
                updateBy: data.update_by_ || '',
                updateTime: data.update_time_ || '',
                zhuangTai: status
            }*/
            // 更新补卡数据
            saveAttendanceReissue(submitData).then((res) => {
                self.$message.success(`操作成功`)
                self.loadData() // 刷新列表
                if (key === 'agree') {
                    // 更新考勤表
                    self.updateAttendanceDetail(submitData)
                }
            })
        },
        // 更新考勤
        updateAttendanceDetail (submitData) {
            const self = this
            getAttendanceDetail({ id: submitData.kaoQinId }).then((res) => { // 获取考勤明细
                const updateData = res.data
                if (submitData.buKaBanCi.includes('上班')) { // 更新上班数据
                    updateData.zhuangTai1 = '正常'
                    updateData.daKaShiJian1 = submitData.buKaRiQi + ' ' + submitData.buKaShiJian
                } else { // 更新下班数据
                    updateData.zhuangTai2 = '正常'
                    updateData.daKaShiJian2 = submitData.buKaRiQi + ' ' + submitData.buKaShiJian
                }
                if (updateData.zhuangTai1 === '正常' && updateData.zhuangTai2 === '正常') {
                    updateData.kaoQinZhuangTa = '正常'
                }
                updateData.daKaCiShu += 1
                if (updateData.zhuangTai1 === '正常' && updateData.zhuangTai2 === '正常') {
                    // 打卡状态都正常后，迟到分钟清0
                    updateData.chiDaoShiChang = null
                }
                // 计算实际工作时长
                if (updateData.daKaShiJian1 && updateData.daKaShiJian2) {
                    // 将时间字符串转换为Date对象
                    const date1 = new Date(updateData.daKaShiJian1.replace(/-/g, '/'))
                    const date2 = new Date(updateData.daKaShiJian2.replace(/-/g, '/'))
                    // 计算时间差（毫秒）
                    const diffInMs = date2 - date1
                    // 转换为分钟（四舍五入保留整数）
                    const diffInMinutes = Math.round(diffInMs / (1000 * 60))
                    updateData.gongZuoShiChan = diffInMinutes
                }
                saveAttendanceDetail(updateData)
            })
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
