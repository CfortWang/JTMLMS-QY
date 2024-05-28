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
            <template slot="time" slot-scope="scope">
                <div>起：{{ scope.row.kaiShiShiJian }}</div>
                <div>止：{{ scope.row.jieShuShiJian }}</div>
            </template>
        </ibps-crud>
        <Experimental
            v-if="showConfig"
            :visible.sync="showConfig"
            :page-data="detailData"
            :readonly="readonly"
            @close="() => showConfig = false"
        />
    </div>
</template>

<script>
import { queryExperimental, getConfigList, getConfigDetail, removeExperimental } from '@/api/business/pv'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'

export default {
    components: {
        Experimental: () => import('./experimental')
    },
    mixins: [FixHeight],
    data () {
        const { userList = [] } = this.$store.getters || {}
        const userOption = userList.map(item => ({ label: item.userName, value: item.userId }))
        return {
            userOption,
            title: '性能验证记录',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: true,
            height: document.clientHeight,
            listData: [],
            pagination: {},
            sorts: {},
            showConfig: false,
            readonly: false,
            detailData: {},
            targetOption: [],
            methodOption: [],
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'remove'
                    }
                ],
                searchForm: {
                    forms: [
                        // { prop: 'Q^name_^SL', label: '性能指标', fieldType: 'select', options: this.targetOption },
                        // { prop: 'Q^fang_an_lei_xing_^SL', label: '方案类型', fieldType: 'select', options: this.methodOption },
                        { prop: 'Q^name_^SL', label: '性能指标' },
                        { prop: 'Q^fang_an_lei_xing_^SL', label: '方案类型' },
                        { prop: 'Q^shi_yan_xiang_mu_^SL', label: '实验项目' },
                        { prop: 'Q^shi_yan_fang_fa_^SL', label: '实验方法' },
                        { prop: 'Q^yang_ben_lei_xing^SL', label: '样本类型' },
                        { prop: 'Q^shi_yan_yi_qi_^SL', label: '实验仪器' },
                        {
                            prop: [
                                'Q^create_time_^DL',
                                'Q^create_time_^DG'
                            ],
                            label: '创建时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'xingNengZhiBia', label: '性能指标', tags: [], minWidth: 110 },
                    { prop: 'fangAnLeiXing', label: '方案类型', tags: [], width: 125 },
                    { prop: 'shiYanXiangMu', label: '实验项目', width: 120 },
                    { prop: 'shiYanFangFa', label: '实验方法', width: 120 },
                    { prop: 'yangBenLeiXing', label: '样本类型', width: 100 },
                    { prop: 'shiYanYiQi', label: '实验仪器', width: 120 },
                    { prop: 'timeRange', label: '实验时间', slotName: 'time', width: 140 },
                    { prop: 'dataStatus', label: '状态', width: 80 },
                    { prop: 'bianZhiRen', label: '实验人', tags: userOption, width: 90 },
                    { prop: 'createBy', label: '评价人', tags: userOption, width: 90 },
                    {
                        prop: 'createTime',
                        label: '创建时间',
                        dateFormat: 'yyyy-MM-dd HH:mm',
                        sortable: 'custom',
                        width: 130
                    }
                ],
                rowHandle: {
                    effect: 'display',
                    actions: [
                        {
                            key: 'edit',
                            label: '编辑',
                            type: 'primary',
                            icon: 'ibps-icon-edit'
                        },
                        {
                            key: 'report',
                            label: '实验报告',
                            type: 'success',
                            icon: 'ibps-icon-file-text-o'
                        }
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
            // const params = {
            //     parameters: [],
            //     requestPage: {
            //         pageNo: 1,
            //         limit: 200
            //     },
            //     sorts: []
            // }
            // Promise.all([
            //     queryExperimental(this.getSearchFormData()),
            //     getConfigList(params)
            // ]).then(([res1, res2]) => {
            //     this.loading = false
            //     ActionUtils.handleListData(this, res1.data)
            //     const { dataResult = [] } = res2.data || {}
            //     const dataList = []
            //     dataResult.forEach(item => {
            //         const config = JSON.parse(item.config)
            //         dataList.push({
            //             id: item.id,
            //             sn: item.sn,
            //             target: item.target,
            //             type: item.type,
            //             icon: item.icon,
            //             methods: config.methods.sort((a, b) => a.sn - b.sn)
            //         })
            //     })
            //     this.targetOption = dataList.map(item => ({ label: item.target, value: item.target }))
            //     console.log(this.targetOption)
            //     this.searchForm.form[0].options = this.targetOption
            //     this.methodOption = dataList.flatMap(item => item.methods.map(method => ({ label: method.name, value: method.name })))
            // }).catch(() => {
            //     this.loading = false
            // })
            queryExperimental(this.getSearchFormData()).then(res => {
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
            return ActionUtils.formatParams(
                this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {},
                this.pagination,
                this.sorts
            )
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
                case 'edit':
                    this.handleEdit(data, command)
                    break
                case 'report': // 明细
                    this.handleReport(data)
                    break
                case 'remove': // 删除
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
        async handleEdit ({ id, zhiBiaoId, fangAnLeiXing, xingNengZhiBia }, key) {
            this.detailData = await this.getConfigData(zhiBiaoId, fangAnLeiXing, id)
            this.readonly = key === 'detail'
            this.showConfig = true
        },
        async getConfigData (id, method, recordId) {
            return new Promise((resolve, reject) => {
                getConfigDetail({ id }).then(res => {
                    const data = res.data || {}
                    const config = JSON.parse(data.config)
                    const m = config.methods.find(i => i.name === method)
                    const result = {
                        targetId: data.id,
                        target: data.target,
                        sn: data.sn,
                        type: data.type,
                        name: m.name,
                        key: m.key,
                        step: m.step,
                        config: m.config,
                        formula: m.formula,
                        recordId
                    }
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleReport (data) {
            console.log('wwww')
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            // return this.$message.warning('避免误删测试数据，联系开发删除')
            removeExperimental({ ids }).then(() => {
                ActionUtils.removeSuccessMessage()
                this.search()
            }).catch(() => {})
        },
        handleRowDblclick (row) {
            this.handleEdit(row, 'detail')
        }
    }
}
</script>
<style lang="scss">
    .attachment-uploader-dialog {
        .el-dialog__body {
            height: calc(57vh - 100px) !important;
        }
    }
</style>
