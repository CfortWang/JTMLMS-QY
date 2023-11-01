<template>
    <div :style="{height:height+'px'}">
        <ibps-crud
            v-if="visible"
            ref="crud"
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
        />
        <!-- 人员选择器 -->
        <ibps-employee-selector-dialog
            :visible="selectorVisible"
            :value="[]"
            :show-tree="false"
            :party-type-id="id"
            :seeting-search-party-type="seetingSearchPartyType"
            title="人员选择器"
            multiple
            class="position-employee-dialog"
            @close="visible => selectorVisible = visible"
            @action-event="handleSelectorActionEvent"
        />
    </div>
</template>
<script>
import IbpsEmployeeSelectorDialog from '@/business/platform/org/employee/dialog'
import { queryWithOrg as queryPageList, addPositionUser, removePositionUser } from '@/api/platform/org/employee'
import ActionUtils from '@/utils/action'
import { statusOptions, genderOptions } from '../../employee/constants'
import { queryPageList as queryUserList } from '@/api/platform/org/employee'

export default {
    components: {
        IbpsEmployeeSelectorDialog
    },
    props: {
        id: [String, Number],
        seetingSearchPartyType: String,
        height: Number,
        visible: Boolean,
        depth: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            selectorVisible: false,
            pkKey: 'id',
            loading: false,
            listData: [],
            pagination: {},
            sorts: {},
            listConfig: {
                toolbars: [
                    {
                        key: 'search'
                    },
                    {
                        key: 'add',
                        label: '加入',
                        icon: 'el-icon-plus'
                    },
                    {
                        key: 'remove',
                        label: '移除',
                        icon: 'el-icon-delete'
                    }
                ],
                searchForm: {
                    inline: true,
                    forms: [
                        { prop: 'Q^NAME_^SL', label: '姓名：' }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'name', label: '姓名', width: '120' },
                    { prop: 'positionsName', label: '归属部门', hidden: false },
                    { prop: 'gender', label: '性别', tags: genderOptions, width: '80' },
                    { prop: 'createTime', label: '创建时间', width: '150' },
                    { prop: 'status', label: '状态', tags: statusOptions, width: '120' }
                ],
                rowHandle: {
                    actions: [
                        {
                            key: 'remove',
                            label: '移除',
                            icon: 'el-icon-delete'
                        }
                    ]
                }
            }
        }
    },
    watch: {
        visible: {
            handler () {
                if (this.visible && this.$utils.isNotEmpty(this.id)) {
                    this.loadData()
                }
            },
            immediate: true
        },
        depth: {
            handler () {
                this.listConfig.columns[1].hidden = this.depth === 4
            },
            immediate: true
        }
    },
    created () {
        this.getOrg()
    },
    methods: {
        // 初始化数据
        loadData () {
            this.loading = true
            queryUserList(this.getSearcFormData()).then((response) => {
                response.data.dataResult.forEach(item => {
                    if (item.positions) {
                        // 转换岗位名
                        const name = this.getPositionsName(item.positions)
                        this.$set(item, 'positionsName', name)
                        // 转换岗位路径
                        const path = this.getPositionsPath(item.positions)
                        this.$set(item, 'positionsPath', path)
                    }
                })
                ActionUtils.handleListData(this, response.data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        getPositionsName (valueList) {
            const postList = valueList.split(',')
            const list = []
            if (!postList.length) {
                return ''
            }
            postList.forEach((item, index) => {
                const dataItem = this.positionsList.find(i => i.ID_ === item)
                list.push(`（${index + 1}）${dataItem.NAME_}`)
            })
            return list.join(' ')
        },
        getPositionsPath (valueList) {
            const postList = valueList.split(',')
            const list = []
            if (!postList.length) {
                return ''
            }
            postList.forEach((item) => {
                const temp = this.positionsList.find(i => i.ID_ === item)
                const pathList = temp ? temp.PATH_.split('.') : []
                let p = ''
                pathList.filter(i => i).forEach(k => {
                    const t = this.positionsList.find(i => i.ID_ === k)
                    p += `${t.NAME_}.`
                })
                list.push(p)
            })
            return list.join('\r\n')
        },
        // 查询
        getSearcFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            const res = ActionUtils.formatParams(params, this.pagination, this.sorts)
            res.customs = {
                position: this.id
            }
            return res
        },
        /**
         * 处理排序
         */
        handleSortChange (sort) {
            ActionUtils.setSorts(this.sorts, sort)
            this.loadData()
        },
        /**
         * 处理分页事件
         */
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.loadData()
        },
        search () {
            this.loadData()
        },
        handleAction (buttonKey, position, selection, data) {
            switch (buttonKey) {
                // 组织负责人
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'add':// 设置
                    this.handleAdd()
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(ids)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        // 处理 加入人员
        handleAdd () {
            this.selectorVisible = true
        },
        handleSelectorActionEvent (buttonKey, data) {
            switch (buttonKey) {
                case 'confirm':// 确定
                    this.handleConfirm(data)
                    break
            }
        },
        handleConfirm (data) {
            this.selectorVisible = false
            addPositionUser({
                positionId: this.id,
                userIds: data.map((d) => { return d.id }).join(',')
            }).then(response => {
                this.selectorVisible = false
                ActionUtils.success('加入人员成功!')
                this.search()
            })
        },
        handleRemove (ids) {
            removePositionUser({
                positionId: this.id,
                userIds: ids
            }).then(response => {
                ActionUtils.removeSuccessMessage()
                this.search()
            })
        },
        // 获取组织的数据
        getOrg () {
            return new Promise((resolve, reject) => {
                const sql = `select a.ID_ as ID_, a.NAME_ as NAME_, b.path_ as PATH_ FROM ibps_party_position a, ibps_party_entity b where a.id_ = b.id_`
                this.$common.request('sql', sql).then((res) => {
                    const datas = res.variables.data
                    datas.forEach((item, index) => {
                        this.$set(item, 'value', item.ID_)
                        this.$set(item, 'label', item.NAME_)
                    })
                    this.positionsList = datas
                    resolve()
                })
            })
        }
    }
}
</script>
<style lang="scss">
    .position-employee-dialog{
        .el-dialog__body{
            height:  calc(70vh - 190px) !important;
        }
    }
</style>
