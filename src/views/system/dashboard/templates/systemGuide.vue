<template>
    <div class="app-container">
        <div class="tab-container">
            <div class="table-container">
                <ibps-crud
                    ref="guide"
                    :data="listData"
                    :toolbars="listConfig.toolbars"
                    :search-form="listConfig.searchForm"
                    :pk-key="pkKey"
                    :columns="listConfig.columns"
                    :pagination="pagination"
                    :loading="loading"
                    :index-row="false"
                    :selection-row="false"
                    :display-field="title"
                    @row-click="handleRowClick"
                    @action-event="handleAction"
                    @sort-change="handleSortChange"
                    @pagination-change="handlePaginationChange"
                >
                    <template slot="role" slot-scope="{row, column}">
                        <ibps-user-selector
                            v-model="row[column.prop]"
                            type="role"
                            readonly-text="text"
                            :multiple="true"
                            size="mini"
                            disabled
                            :filter="filterOption"
                            filterable
                        />
                    </template>
                </ibps-crud>
            </div>
        </div>
    </div>
</template>

<script>
import ActionUtils from '@/utils/action'
import { taskTypeOption, listSearchForm } from '../components/workbench'
import { querySystemGuide } from '@/api/business/general'

const searchForm = listSearchForm.guide

export default {
    name: 'system-guide1',
    components: {
        IbpsUserSelector: () => import('@/business/platform/org/selector')
    },
    filters: {
        getUserName (v, list) {
            const user = list.find(i => i.userId === v)
            return user ? user.userName : ''
        }
    },
    props: {},
    data () {
        const { first = '', second = '' } = this.$store.getters.level || {}
        const level = second || first
        const { userList = [], deptList = [], role = [], menus = [], isSuper } = this.$store.getters || {}
        const allRolesMap = new Map()
        userList.forEach(user => {
            user.roleId.split(',').forEach((roleId, index) => {
                if (!allRolesMap.has(roleId)) {
                    allRolesMap.set(roleId, user.roles.split(',')[index])
                }
            })
        })
        const allRoles = Array.from(allRolesMap, ([key, value]) => ({ key, value: key, label: value }))
        const isManager = role.some(i => i.alias === 'xtgljs') || isSuper
        const roleOption = isManager ? allRoles : role.map(i => ({ key: i.id, value: i.id, label: i.name }))
        const sysOption = menus.map(i => ({ key: i.alias, value: i.title, label: i.title })).filter(i => !['xtgl', 'xnyz'].includes(i.key))
        searchForm.forms[0].value = isManager ? 'all' : 'aboutMe'
        searchForm.forms[1].options = sysOption
        searchForm.forms[3].options = roleOption
        const fieldWidth = window.innerWidth > 1600 ? 150 : 120
        const filterOption = [{
            // descVal: '2',
            includeSub: true,
            partyName: '',
            scriptContent: '',
            type: 'role'
        }]
        return {
            title: '系统指引',
            level,
            userList,
            deptList,
            role,
            menus,
            filterOption,
            pkKey: 'id',
            loading: false,
            selection: [],
            defaultPagination: { page: 1, limit: 15 },
            sorts: {},
            listData: [],
            pagination: {
                limit: 100,
                page: 1
            },
            listConfig: {
                searchForm,
                toolbars: [
                    {
                        key: 'search'
                    }
                ],
                // 表格字段配置
                columns: [
                    { prop: 'sn', label: '序号', width: 60 },
                    { prop: 'suoShuXiTong', label: '所属子系统', width: 100 },
                    { prop: 'gongNengMokuai', label: '所属功能模块', width: fieldWidth },
                    { prop: 'biaoDanMingChe', label: '记录表单', width: 200 },
                    { prop: 'biaoDanBianHao', label: '表单编号', width: 240, sortable: 'custom' },
                    { prop: 'tianXieShiJi', label: '填写时机/记录频次', minWidth: 240 },
                    { prop: 'shiWuLeiXing', label: '事务类型', tags: taskTypeOption, width: 100 },
                    { prop: 'chengXuWenJian', label: '程序文件', width: 160 },
                    { prop: 'bianZhiJiaoSe', label: '编制人', width: fieldWidth, fieldType: 'slot', slotName: 'role' },
                    { prop: 'shenHeJiaoSe', label: '审核人', width: fieldWidth, fieldType: 'slot', slotName: 'role' },
                    { prop: 'shenPiJiaoSe', label: '审批人', width: fieldWidth, fieldType: 'slot', slotName: 'role' }
                ]
            }
        }
    },

    mounted () {
        const timer = setInterval(() => {
            if (this.$refs.guide) {
                this.loadData()
                clearInterval(timer)
            }
        }, 200)
    },
    methods: {
        // getGuide ({ parameters, requestPage, sorts }) {
        //     // 获取查询角色信息
        //     let roleParams = ''
        //     let aboutMeParams = ''
        //     const range = {
        //         aboutMe: [],
        //         sponsor: [],
        //         review: [],
        //         approve: []
        //     }
        //     const sortField = {
        //         TABLE_NO_: 'biao_dan_bian_hao'
        //     }
        //     let sortParams = 'sn_ + 0 asc'
        //     if (sorts && sorts.length) {
        //         sortParams = sorts.map(i => `${sortField[i.field]} ${i.order}`).join(',')
        //     }
        //     this.role.forEach(i => {
        //         range.aboutMe.push(`bian_zhi_jiao_se_ like '%${i.id}%' or shen_he_jiao_se_ like '%${i.id}%' or shen_pi_jiao_se_ like '%${i.id}%'`)
        //         range.sponsor.push(`bian_zhi_jiao_se_ like '%${i.id}%'`)
        //         range.review.push(`shen_he_jiao_se_ like '%${i.id}%'`)
        //         range.approve.push(`shen_pi_jiao_se_ like '%${i.id}%'`)
        //     })
        //     parameters.forEach(item => {
        //         if (item.key === 'range' && item.value !== 'all') {
        //             aboutMeParams = ` and (${range[item.value].join(' or ')})`
        //         }
        //         if (item.key === 'role') {
        //             roleParams = ` and (bian_zhi_jiao_se_ like '%${item.value}%')`
        //         }
        //     })
        //     // 获取查询字段
        //     let params = parameters.filter(i => i.key !== 'role' && i.key !== 'range').reduce((acc, curr) => {
        //         return `${acc} and ${curr.key} like '%${curr.value}%'`
        //     }, '')
        //     params = params + aboutMeParams + roleParams
        //     // and di_dian_ = '${level}'
        //     const sql = `select sn_ as sn, suo_shu_xi_tong_ as sysName, gong_neng_mo_kuai as module, biao_dan_ming_che as tableName, biao_dan_bian_hao as tableNo, tian_xie_shi_ji_ as timing, shi_wu_lei_xing_ as taskType, cheng_xu_wen_jian as fileName, bian_zhi_ren_ as creator, shen_he_ren_ as reviewer, shen_pi_ren_ as approver, ye_mian_lu_jing_ as path, zi_yuan_lu_jing_ as res from t_bdbhpzb where sn_ + 0 > 0 ${params} order by ${sortParams}`
        //     const { pageNo = 1, limit = 15 } = requestPage || {}
        //     return new Promise((resolve, reject) => {
        //         this.$common.request('sql', sql).then(res => {
        //             const { data = [] } = res.variables || {}
        //             const page = {
        //                 limit,
        //                 page: pageNo,
        //                 totalCount: data.length,
        //                 totalPages: Math.ceil(data.length / limit)
        //             }
        //             const result = {
        //                 data: {
        //                     dataResult: data.slice((pageNo - 1) * limit, pageNo * limit),
        //                     pageResult: page
        //                 }
        //             }
        //             resolve(result)
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
        tableRowClassName ({ row, rowIndex }) {
            if (rowIndex % 2 === 1) return 'warning-row'
            return 'success-row'
        },
        loadData () {
            this.loading = true
            querySystemGuide(this.getSearchFormData()).then(res => {
                const { dataResult } = res.data
                const { page, limit } = this.pagination
                const { isEmpty } = this.$utils
                // 无排序字段时，默认按序号排序
                if (isEmpty(this.sorts)) {
                    dataResult.sort((a, b) => {
                        return +a.sn - +b.sn
                    })
                }
                // 处理分页
                const pageResult = {
                    limit,
                    page,
                    totalCount: dataResult.length,
                    totalPages: Math.ceil(dataResult.length / limit)
                }
                const result = {
                    dataResult: dataResult.slice((page - 1) * limit, page * limit),
                    pageResult
                }
                // console.log(result)
                ActionUtils.handleListData(this, result)
            }).finally(() => {
                this.loading = false
            })
        },
        // // 获取表格数据
        // getData () {
        //     this.loading = true
        //     const pageParams = this.pagination && this.pagination.page ? this.pagination : this.defaultPagination
        //     this.getGuide(this.getFormatParams(null, pageParams)).then(response => {
        //         const { dataResult, pageResult } = response.data
        //         this.listData = dataResult
        //         this.pagination = pageResult || {}
        //         this.loading = false
        //     }).catch(() => {
        //         this.loading = false
        //     })
        // },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const params = this.$refs['guide'] ? this.$refs['guide'].getSearcFormData() : {}
            const allRoleId = this.role.map(i => i.id)
            // 默认过滤 SN 字段值不为空的数据
            params[`Q^sn_^SNE`] = '1'
            if (params.range === 'aboutMe') {
                params[`Q^bian_zhi_jiao_se_^SL`] = params[`Q^shen_he_jiao_se_^SL`] = params[`Q^shen_pi_jiao_se_^SL`] = allRoleId
            }
            if (params.range === 'sponsor') {
                params[`Q^bian_zhi_jiao_se_^SL`] = allRoleId
            }
            if (params.range === 'review') {
                params[`Q^shen_he_jiao_se_^SL`] = allRoleId
            }
            if (params.range === 'approve') {
                params[`Q^shen_pi_jiao_se_^SL`] = allRoleId
            }
            if (params.role) {
                params[`Q^bian_zhi_jiao_se_^SL^1`] = params['role']
            }
            delete params.range
            delete params.role
            // console.log(params)
            // 当前后端接口未实现字符串字段【SN】的正确排序，获取全部数据前端自行分页
            const result = {
                parameters: this.formatParameters(params),
                ...ActionUtils.formatParams(null, { ...this.pagination, limit: 9999 }, this.sorts)
            }
            // console.log(result)
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
        // 查询
        search () {
            this.loadData()
        },
        handleSortChange (sort) {
            // 处理字段长度，可能出现排序字段与数据库字段不一致情况
            sort.sortBy = sort.sortBy.slice(0, 17)
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        // getFormatParams (v, page) {
        //     const params = this.$refs.guide ? this.$refs.guide.getSearcFormData() : {}
        //     const pageParams = { ...page, limit: 100 }
        //     return ActionUtils.formatParams(params, pageParams, this.sorts)
        // },
        // 处理表格点击事件
        handleRowClick (data) {
            const { ziYuanLuJing = '' } = data
            if (!ziYuanLuJing) {
                this.$message.warning('未配置资源菜单！')
                return
            }
            const path = '/' + this.findPagePath(ziYuanLuJing)
            this.$router.push(path)
        },
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination || {})
                    this.search()
                    break
                default:
                    break
            }
        },
        findPagePath (res) {
            const resList = res.split('.')
            const findAlias = (nodes, path) => {
                const [currentId, ...rest] = path
                const node = nodes.find(n => n.id === currentId)
                return node && rest.length ? [node.alias, ...findAlias(node.children, rest)] : node && [node.alias]
            }
            this.$store.dispatch('ibps/menu/activeHeaderSet', { activeHeader: resList[0], vm: this })
            return findAlias(this.menus, resList).join('/')
        }
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep .el-table__row {
        cursor: pointer;
    }
    ::v-deep .el-tabs__header {
        margin-bottom: 0;
    }
    .el-completing {
        background: #409eff !important;
    }
    .el-col {
        min-height: 1px;
    }
    .firstcol {
        padding-right: 10px;
    }
    .el-nothing {
        font-size: 13px;
    }
    .calendar-day {
        text-align: center;
        color: #202535;
        line-height: 30px;
        font-size: 12px;
    }
    .is-selected {
        color: #f8a535;
        font-size: 10px;
        margin-top: 5px;
    }
    #calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {
        content: '当月';
    }
    #calendar .item {
        position: relative;
        margin: 0;
        padding: 0;
        height: auto;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        overflow: hidden;
        color: #f8a535;
    }
    .ibps-list-split .ibps-list-item {
        border-bottom: 1px solid #dcdfe6;
        padding: 6px 0;
    }
    .jbd-font-style {
        font-weight: bold;
    }
    .home-text-border {
        color: #999999;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.1);
        min-height: 20px;
        font-size: 14px;
        margin-left: 60px;
        margin-bottom: 5px;
    }
    .jbd-home-card {
        overflow: auto;
    }
    .jbd-home-task {
        width: 100%;
        padding: 10px;
        cursor: pointer;
        font-size: 12px;
        margin-bottom: 35px;
    }
    .jbd-home-card::-webkit-scrollbar {
        display: none;
    }
    .jbd-control-cont {
        text-align: center;
        position: absolute;
        z-index: 10;
        right: 0px;
        top: 50%;
    }
    .tab-container {
        height: calc(100vh - 160px);
        min-height: 600px;
        >div {
            display: inline-block;
        }
        .table-container {
            width: 100%;
            vertical-align: top;
        }
    }
</style>
