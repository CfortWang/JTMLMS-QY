<template>
    <div class="main-container">
        <ibps-crud
            ref="crud"
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
            :display-field="listTitle"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @pagination-change="handlePaginationChange"
        >
            <template slot="delegatorId">
                <ibps-user-selector
                    v-model="searchDelegatorId"
                    :type="type"
                    :filter="filter"
                    :multiple="multiple"
                    :filtrate="filtrate"
                    :store="store"
                    :disabled="disabled"
                    :readonly-text="readonlyText"
                    placeholder="请选择代理人"
                    @change-link-data="callbackAgenterInfo"
                />
            </template>
        </ibps-crud>
        <edit :id="editId" :title="title" :visible="dialogFormVisible" :readonly="readonly" @callback="search" @close="closeDialog" />
    </div>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
// import { queryPageList, remove, setEnable } from '@/api/platform/bpmn/bpmAgent'
import { queryTaskAgemt } from '@api/business/general'
import ibpsUserSelector from '@/business/platform/org/selector'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { statusOptions, agentTypeOptions } from '../constants'
import Edit from './edit'
import agent from './agent'
import { keyBy, mapValues } from 'lodash'

export default {
    components: {
        IbpsEmployeeSelector,
        Edit,
        ibpsUserSelector
    },
    mixins: [FixHeight, agent],
    data () {
        const { first = '', second = '' } = this.$store.getters.level
        const level = second || first
        return {
            level,
            dialogFormVisible: false, // 弹窗
            editId: '', // 编辑dialog需要使用
            readonly: false, // 是否只读
            pkKey: 'id', // 主键  如果主键不是pk需要传主键

            searchDelegatorId: '',
            listTitle: '事务代理',
            title: '',
            loading: false,
            height: document.clientHeight,

            listData: [],
            pagination: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'add'
                    },
                    {
                        key: 'remove'
                    }
                ],
                searchForm: {
                    forms: [
                        {
                            prop: 'daiLiRenXingM',
                            label: '代理人'
                        },
                        {
                            prop: 'shiFouQiYong',
                            label: '是否启用',
                            fieldType: 'select',
                            options: statusOptions
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'biao_ti_', label: '标题', width: 250 },
                    { prop: 'wei_tuo_ren_xing_', label: '委托人', width: 120 },
                    { prop: 'dai_li_ren_xing_m', label: '代理人', width: 120 },
                    { prop: 'shi_fou_qi_yong_', label: '是否启用', tags: statusOptions, width: 120 },
                    { prop: 'bei_zhu_', label: '备注' },
                    { prop: 'name_', label: '创建人', width: 120 }
                    // { prop: 'sheng_xiao_shi_ji', label: '生效时间' },
                    // { prop: 'jie_shu_shi_jian_', label: '失效时间' }
                ],
                rowHandle: {
                    actions: [{
                        key: 'edit'
                    },
                    {
                        key: 'enabled',
                        label: '启用',
                        icon: 'ibps-icon-toggle-on',
                        hidden: (rowData, index) => {
                            return rowData.shi_fou_qi_yong_ === 'enabled'
                        }
                    }, {
                        key: 'disabled',
                        label: '禁用',
                        icon: 'ibps-icon-toggle-off',
                        hidden: (rowData, index) => {
                            return rowData.shi_fou_qi_yong_ === 'disabled'
                        }
                    },
                    {
                        key: 'detail'
                    }]
                }
            },
            // 委托人和代理人 选择器修改通用选择器，需要这些参数
            type: 'user',
            filter: [{
                descVal: '2',
                includeSub: true,
                old: 'position',
                partyId: '',
                partyName: '',
                scriptContent: '',
                type: 'user',
                userType: 'position'
            }],
            multiple: false,
            filtrate: true,
            store: 'id',
            disabled: false,
            readonlyText: 'null'
        }
    },
    created () {
        this.getInit()
        this.loadData()
    },
    methods: {
        // 初始化
        getInit () {
            this.filter[0].partyId = this.$store.getters.userInfo.employee.positions || ''
        },
        callbackAgenterInfo (value, data, type) {
            this.searchDelegatorId = value
        },
        // 加载数据
        // loadData () {
        //     this.loading = true
        //     const start = (this.pagination.page - 1) * this.pagination.limit
        //     const end = this.pagination.page * this.pagination.limit
        //     const searcFormData = this.getSearcFormData()
        //     const sql1 = `select a.*,b.name_ from t_swdl a left join ibps_party_employee b on a.create_by_ = b.ID_  where a.di_dian_ = '${this.level}' ${searcFormData} order by a.create_time_ desc limit ${start},${end}`
        //     const sql2 = `select count(a.id_) as count from t_swdl a where a.di_dian_ = '${this.level}' ${searcFormData}`
        //     Promise.all([this.$common.request('sql', sql1), this.$common.request('sql', sql2)]).then((res) => {
        //         const list0 = res[0].variables.data
        //         list0.forEach(item => {
        //             item.id = item.id_
        //         })
        //         const list1 = res[1].variables.data
        //         const page = {
        //             limit: this.pagination.limit,
        //             page: this.pagination.page,
        //             totalCount: list1[0].count,
        //             totalPages: Math.ceil(list1[0].count / this.pagination.limit)
        //         }
        //         const result = {
        //             dataResult: list0,
        //             pageResult: page
        //         }
        //         ActionUtils.handleListData(this, result)
        //         this.loading = false
        //     }).catch(() => {
        //         this.loading = false
        //     })
        // },
        loadData () {
            this.loading = true
            queryTaskAgemt(this.getSearchFormData()).then(res => {
                ActionUtils.handleListData(this, res.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 获取格式化参数
         */
        getSearchFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            const formatParams = ActionUtils.formatParams(
                params,
                this.pagination,
                this.sorts
            )
            const { parameters, requestPage, sorts } = formatParams || {}
            const p = mapValues(keyBy(parameters, 'key'), 'value')
            const { pageNo, limit } = requestPage || {}
            return {
                ...p,
                pageNo,
                limit
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
                case 'search': // 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add': // 添加
                    this.handleEdit()
                    this.title = '事务代理设置'
                    break
                case 'edit': // 编辑
                    ActionUtils.selectedRecord(selection)
                        .then((id) => {
                            this.handleEdit(id)
                            this.title = '编辑流程代理'
                        })
                        .catch(() => {})
                    break
                case 'detail': // 明细
                    ActionUtils.selectedRecord(selection)
                        .then((id) => {
                            this.handleEdit(id, true)
                            this.title = '流程代理明细'
                        })
                        .catch(() => {})
                    break
                case 'remove': // 删除
                    ActionUtils.removeRecord(selection)
                        .then((ids) => {
                            this.handleRemove(ids, data)
                        })
                        .catch(() => {})
                    break
                case 'enabled': // 启用
                    this.handleSetEnable(data, 'enabled')
                    break
                case 'disabled': // 禁用
                    this.handleSetEnable(data, 'disabled')
                    break
                default:
                    break
            }
        },
        /**
         * 处理编辑。
         */
        handleEdit (id = '', readonly = false) {
            this.editId = id
            this.readonly = readonly
            this.dialogFormVisible = true
        },
        /**
         * 处理删除
         */
        handleRemove (ids, data) {
            const show = data.some(item => item.shi_fou_qi_yong_ === 'enabled')
            if (show) {
                this.$message.warning('请把数据禁用，才能删除')
                return
            }

            const params = {
                tableName: 't_swdl',
                paramWhere: {
                    id_: ids
                }
            }
            this.$common.request('delete', params).then(res => {
                ActionUtils.removeSuccessMessage()
                this.search()
            })
        },
        handleSetEnable (data, status = 'disabled') {
            this.bpmAgent = JSON.parse(JSON.stringify(data))
            this.bpmAgent.shi_fou_qi_yong_ = status === 'enabled' ? 'enabled' : 'disabled'
            this.checkList1 = this.bpmAgent.wei_tuo_jiao_se_i.split(',')
            delete this.bpmAgent.id
            delete this.bpmAgent.name_
            Promise.all([this.getWeiTuo(data.wei_tuo_ren_, 1, data.id_), this.getWeiTuo(data.dai_li_ren_, 2, data.id_)]).then(res => {
                this.saveData(data.id_)
            })
        },
        closeDialog (val) {
            this.dialogFormVisible = val
            this.loadData()
        }
    }
}
</script>
