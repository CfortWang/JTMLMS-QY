<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="事务分类"
                category-key="FLOW_TYPE"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <ibps-crud
            ref="crud"
            :height="height"
            :style="{ marginLeft: width + 'px' }"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :pagination="pagination"
            :loading="loading"
            :index-row="false"
            :display-field="title"
            @action-event="handleAction"
            @sort-change="handleSortChange"
            @column-link-click="handleLinkClick"
            @pagination-change="handlePaginationChange"
        />
        <bpmn-formrender
            :visible="dialogFormVisible"
            :def-id="defId"
            :pro-inst-id="proInstId"
            :title="flowName"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { myDraft, removeDraft } from '@/api/platform/office/bpmInitiated'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import CommonData from '../mixin/utils'

export default {
    mixins: [FixHeight, CommonData],
    data () {
        return {
            title: '我的暂存',
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    { key: 'remove' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'Q^proc_def_name_^SL', label: '事务名称' },
                        { prop: 'Q^subject_^SL', label: '事务说明' },
                        {
                            prop: ['Q^create_time_^DL', 'Q^create_time_^DG'],
                            label: '创建时间',
                            fieldType: 'daterange'
                        }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'procDefName', label: '事务名称', width: 200, link: 'dialog' },
                    { prop: 'subject', label: '事务说明', minWidth: 200 },
                    { prop: 'createTime', label: '创建时间', width: 150, sortable: true }
                ]
            }
        }
    },
    created () {
        this.loadData()
    },
    methods: {
        /**
         * 加载数据
         */
        loadData () {
            this.loading = true
            myDraft(this.getFormatParams()).then(response => {
                const { data } = response || {}
                data.dataResult.forEach((item, i) => {
                    item.subject = this.getTaskDesc(item.subject)
                })
                ActionUtils.handleListData(this, data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 点击链接
         */
        handleLinkClick (data, columns) {
            this.flowName = data.name
            this.defId = data.procDefId || ''
            this.proInstId = data.id || ''
            this.dialogFormVisible = true
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection).then((ids) => {
                        this.handleRemove(data)
                    }).catch(() => { })
                    break
                default:
                    break
            }
        },
        /**
         * 处理删除
         */
        // handleRemove (ids) {
        //     removeDraft({ ids: ids }).then(response => {
        //         ActionUtils.removeSuccessMessage()
        //         this.search()
        //     })
        // },
        handleRemove (datas, selection) {
            this.$confirm('将删除选中暂存记录与对应数据表数据，删除之后无法恢复， 是否确定？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false
            }).then(() => {
                const defKeyArr = []
                const delList = {}
                const idList = []
                datas.forEach(item => {
                    const { id, bizKey, procDefKey } = item
                    idList.push(id)
                    if (!delList[procDefKey]) {
                        delList[procDefKey] = []
                        defKeyArr.push(procDefKey)
                    }
                    delList[procDefKey].push(bizKey)
                })
                console.log(idList, delList, defKeyArr)
                const sql = `select bo_code_, def_key_ from ibps_bpm_def where find_in_set(def_key_, '${defKeyArr.join(',')}')`
                // const sql = `select a.bo_code_, b.key_ from ibps_form_bo a, ibps_form_def b where a.form_id_ = b.id_ and find_in_set(b.key_, '${formKeyArr.join(',')}')`
                this.$common.request('sql', sql).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        return
                    }
                    const codes = {}
                    data.forEach(item => {
                        const { bo_code_, def_key_ } = item
                        codes[def_key_] = bo_code_
                    })
                    // 删除选中记录
                    removeDraft({ ids: idList.join(',') }).then(() => {
                        ActionUtils.removeSuccessMessage()
                        this.selection = []
                        // 循环删除对应数据表数据
                        defKeyArr.forEach(k => {
                            const deleteParams = {
                                tableName: `t_${codes[k]}`,
                                paramWhere: { id_: delList[k].join(',') }
                            }
                            this.$common.request('delete', deleteParams, 'post', true)
                        })
                        this.$message.success('删除成功！')
                        this.search()
                    })
                }).catch(() => {
                    this.$message.error('获取数据表key值出错，请联系开发人员！')
                })
            })
        }
    }
}
</script>
