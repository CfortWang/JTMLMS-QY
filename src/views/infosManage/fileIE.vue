<template>
    <ibps-layout ref="layout">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                :category-key="categoryKey"
                :has-permission="true"
                @refresh="refresh"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <ibps-container :margin-left="width+'px'" class="page">
            <ibps-crud
                ref="crud"
                :height="height"
                :data="listData"
                :index-row="false"
                :toolbars="listConfig.toolbars"
                :row-handle="listConfig.rowHandle"
                :search-form="listConfig.searchForm"
                :pk-key="pkKey"
                :columns="listConfig.columns"
                :pagination="pagination"
                :loading="loading"
                :display-field="tableTitle"
                @sort-change="handleSortChange"
                @action-event="handleAction"
                @pagination-change="handlePaginationChange"
            >
                <template
                    v-if="row.fu_jian_"
                    slot="file"
                    slot-scope="{row}"
                >
                    <ibps-attachment
                        v-model="row.fu_jian_"
                        allow-download
                        download
                        multiple
                        accept="*"
                        store="id"
                        readonly
                    />
                </template>
                <template
                    v-if="row.file_info_"
                    slot="fileInfo"
                    slot-scope="{row}"
                >
                    <div>
                        <i class="el-icon-document" />
                        <el-tag
                            type="info"
                            style="cursor: pointer;"
                            @click="handleFileClick(row)"
                        >{{ row.file_info_ }}</el-tag>
                    </div>
                </template>
            </ibps-crud>
        </ibps-container>

        <file-lookup
            v-if="dialogVisible"
            :visible="dialogVisible"
            :file-infos="fileHisList"
            @close="visible => dialogVisible = visible"
        />
        <update-file
            v-if="fileUpDialogVisible"
            :visible="fileUpDialogVisible"
            :file-data="fileData"
            @close="visible => fileUpDialogVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import { queryFileInfo } from '@/api/business/general'
import { keyBy, mapValues } from 'lodash'

const fileRightsType = {
    '公用查阅': 'common',
    '部门查阅': 'dept',
    '受限查阅': 'constraint'
}

export default {
    components: {
        IbpsTypeTree: () => import('@/business/platform/cat/type/tree'),
        UpdateFile: () => import('./updateFile'),
        FileLookup: () => import('@/views/component/fileTraining'),
        IbpsUserSelector: () => import('@/business/platform/org/selector')
    },
    mixins: [FixHeight],
    data () {
        const { userId, isSuper } = this.$store.getters || {}
        const hasRole = localStorage.getItem('hasHighRole') === '1'
        return {
            userId,
            isSuper,
            hasRole,
            dialogVisible: false,
            fileUpDialogVisible: false,
            fileLookShow: false,
            categoryKey: 'FILE_TYPE',
            fileData: '',
            showUpdateFile: false,
            width: 210,
            typeId: null,
            height: document.clientHeight,
            loading: false,
            filterText: '',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            tableTitle: '',
            listData: [],
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' }
                ],
                // 查询条件
                searchForm: {
                    forms: [
                        { prop: 'fileName', label: '文件名称', itemWidth: 150 },
                        { prop: 'fileCode', label: '文件编号', itemWidth: 150 },
                        { prop: 'version', label: '版本号', itemWidth: 150 },
                        { prop: ['startDate', 'endDate'], label: '发布日期', fieldType: 'daterange' }
                    ]
                },
                // 表格字段配置
                columns: [
                    // { prop: 'wen_jian_xi_lei_', label: '文件细类', sortable: 'custom', minWidth: 100 },
                    { prop: 'wen_jian_bian_hao', label: '文件编号', sortable: 'custom', width: 150 },
                    { prop: 'wen_jian_ming_che', label: '文件名称', minWidth: 150 },
                    { prop: 'ban_ben_', label: '版本', width: 65 },
                    { prop: 'fa_fang_shi_jian_', label: '发布日期', sortable: 'custom', width: 120 },
                    { prop: 'cha_yue_jie_zhi_s', label: '查阅截止日期', width: 120 },
                    { prop: 'file_info_', label: '文件附件', slotName: 'fileInfo', minWidth: 200 }
                ],
                rowHandle: undefined
            },
            rowHandle: {
                effect: 'display',
                actions: [
                    {
                        key: 'updateFile',
                        label: '更新',
                        type: 'primary',
                        icon: 'el-icon-refresh'
                    }
                ]
            },
            pagination: {},
            sorts: {},
            pageKey: '',
            fileRights: {
                common: [],
                dept: [],
                constraint: []
            }, // 存放所点击列表的分类信息
            fileHisList: []
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        }
    },
    mounted () {
        this.loadData()
    },
    methods: {
        refresh () {
            this.typeId = ''
            this.loadData()
        },
        // 外部文件更新
        handleFileUpdate (data) {
            this.fileData = data
            this.fileUpDialogVisible = true
        },
        handleClose (done) {
            this.$confirm('确认关闭？').then(_ => {
                done()
            }).catch(_ => {})
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 250 : 30
        },
        search () {
            this.loadData()
        },
        loadData () {
            this.loading = true

            queryFileInfo(this.getSearchParams()).then(res => {
                this.loading = false
                const { data = [], ...rest } = res.variables || {}
                ActionUtils.handleListData(this, {
                    dataResult: data,
                    pageResult: rest
                })
            }).finally(() => {
                this.loading = false
            })
        },
        getData ({ pageNo, limit, ...rest }) {
            return new Promise((resolve, reject) => {
                queryFileInfo(rest).then(res => {
                    const { data = [] } = res.variables || {}
                    if (!data.length) {
                        resolve({
                            dataResult: [],
                            pageResult: {
                                limit: 20,
                                page: 1,
                                totalCount: 0,
                                totalPages: 0
                            }
                        })
                        return
                    }
                    const page = {
                        limit: limit,
                        page: pageNo,
                        totalCount: data.length,
                        totalPages: Math.ceil(data.length / limit)
                    }
                    const result = {
                        data: {
                            dataResult: data.slice((pageNo - 1) * limit, pageNo * limit),
                            pageResult: page
                        }
                    }
                    resolve(result)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleNodeClick (nodeId, nodeData, treeDatas) {
            // 避免重复请求
            if (this.typeId === nodeId) {
                return
            }
            // 判断是否显示外部文件更新按钮
            if (nodeData.depth !== 0) {
                const pathId = nodeData.path ? nodeData.path.split('.') : []
                const pathNameList = pathId.map(id => {
                    const node = treeDatas.find(item => item.id === id)
                    return node ? node.name : ''
                })
                this.showUpdateFile = pathNameList.includes('外部文件') && this.isSuper
                this.listConfig.rowHandle = this.showUpdateFile ? this.rowHandle : undefined
                this.$nextTick(() => {
                    this.$refs['crud']?.doLayout()
                })
            }
            this.fileRights = {
                common: [],
                dept: [],
                constraint: []
            }

            const result = this.getTail(nodeData)
            const allNodeId = []
            result.forEach(({ id, authorityName }) => {
                allNodeId.push(id)
                const parsedAuthority = JSON.parse(authorityName) || {}
                this.fileRights[fileRightsType[parsedAuthority.chaYue]]?.push(id)
            })
            this.typeId = nodeId
            this.loadData()
        },
        /**
         * 递归获取所有子节点
         */
        getTail (node) {
            const result = [node] // 将自身信息添加到结果中
            if (node.children && node.children.length > 0) {
                // 如果有子节点，则递归获取子节点的信息
                node.children.forEach(child => {
                    result.push(...this.getTail(child)) // 将子节点信息添加到结果中
                })
            }
            return result
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
        getSearchParams () {
            const { parameters, requestPage, sorts } = this.getSearchFormData() || {}
            const { pageNo = 1, limit = 20 } = requestPage || {}
            const params = mapValues(keyBy(parameters, 'key'), 'value')
            if (sorts?.length) {
                params.order = sorts.map(i => `${i.field} ${i.order}`).join(',')
            }
            if (this.typeId) {
                params.folderId = this.typeId
            }
            return {
                pageNo,
                limit,
                ...params
            }
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data, index, button) {
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                case 'updateFile':// 外部文件更新
                    this.handleFileUpdate(data)
                    break
                default:
                    break
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
        async handleFileClick (file) {
            this.fileHisList = []
            // const sql = `select w.* FROM t_wjxzxdjlb w JOIN (select zuo_fei_cao_zuo_ FROM t_wjxzxdjlb WHERE id_ = (select shu_ju_lai_yuan_ FROM t_wjxxb WHERE id_ = '${file.id}') and zuo_fei_cao_zuo_ IS NOT NULL and zuo_fei_cao_zuo_ != '' ) sub ON w.zuo_fei_cao_zuo_ = sub.zuo_fei_cao_zuo_ where w.zuo_fei_cao_zuo_ IS NOT NULL and w.zuo_fei_cao_zuo_ != '' AND w.shi_fou_guo_shen_ = '已完成'`
            const { variables: { data = [] }} = await this.$common.request('query', {
                key: 'getFileModifyRecord',
                params: [file.id]
            })
            if (!data.length) {
                this.$message.warning('文件数据异常！')
                return
            }
            const fileIds = data.map(el => el.gai_zhang_fu_jian || el.wen_jian_fu_jian_)
            const { variables: { data: fileData = [] }} = await this.$common.request('query', {
                key: 'getFileAttachmentByIds',
                params: [fileIds.join(',')]
            })
            this.fileHisList = data.map(item => {
                const f = fileData.find(i => i.ID_ === (item.gai_zhang_fu_jian || item.wen_jian_fu_jian_))
                return {
                    id: item.id_,
                    FILE_NAME_: item.wen_jian_ming_che,
                    fileInfos: f,
                    func: this.handleUpdate,
                    ban_ben_: item.ban_ben_,
                    xiu_ding_nei_rong: item.xiu_ding_nei_rong || '',
                    yuan_yin_: item.yuan_yin_ || '',
                    xiu_ding_ban_ben_: item.xiu_ding_ban_ben_ || '',
                    wen_jian_bian_hao: item.wen_jian_bian_hao,
                    fa_fang_shi_jian_: item.bian_zhi_shi_jian,
                    bian_zhi_ren_: item.bian_zhi_ren_,
                    cao_zuo_lei_xing_: item.cao_zuo_lei_xing_,
                    zId: file.id,
                    xiu_ding_fu_jian_: item.xiu_ding_fu_jian_,
                    zhen_fu_jian_: item.zhen_fu_jian_,
                    fa_bu_shi_jian_: item.fa_bu_shi_jian_
                }
            })
            // console.log(this.fileHisList)
            this.dialogVisible = true
        },
        handleUpdate (fileId, time) {
            const addParams = {
                tableName: 't_wjcyjl',
                paramWhere: [
                    {
                        bian_zhi_ren_: this.userId,
                        bian_zhi_shi_jian: this.$common.getDateNow(19),
                        parent_id_: fileId,
                        shi_chang_: time
                    }
                ]
            }
            this.$common.request('add', addParams).then(res => {
                this.loadData()
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .title {
        font-size: 14px;
        margin: 21px 5px 5px;
        padding: 0;
    }

    /deep/ .el-tree-node__content {
        display: block;
    }

    /deep/ .el-form-item__label{
        text-align: left;
    }

    /deep/ .el-dialog__footer{
        display: flex;
        justify-content: center;
    }

</style>
