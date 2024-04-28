<template>
    <div class="main-container">
        <!-- 外部 -->
        <div slot="west">
            <div class="box">
                <ibps-type-tree
                    :width="width"
                    :height="height"
                    :category-key="categoryKey"
                    :has-permission="true"
                    @node-click="handleNodeClick"
                    @expand-collapse="handleExpandCollapse"
                />
            </div>
            <ibps-container
                :margin-left="width + 'px'"
                class="page"
            >
                <el-alert
                    v-if="!show"
                    :closable="false"
                    title="请选择点击记录分类菜单进行操作！"
                    type="warning"
                    show-icon
                    style="height:50px;"
                />
                <template v-else>
                    <ibps-crud
                        key="istree"
                        ref="crud"
                        :data="listData"
                        :toolbars="listConfig.toolbars"
                        :search-form="listConfig.searchForm"
                        :pk-key="pkKey"
                        :columns="listConfig.columns"
                        :loading="loading"
                        :pagination="pagination"
                        :display-field="tableTitle"
                        :index-row="false"
                        @sort-change="handleSortChange"
                        @action-event="handleAction"
                        @pagination-change="handlePaginationChange"
                    >
                        <template
                            slot="wenjinachayue"
                            slot-scope="scope"
                        >
                            <div>
                                <img
                                    :src="wordPng"
                                    style="vertical-align: middle; height: 20px;"
                                >
                                <el-tag
                                    type="info"
                                    style="cursor: pointer;"
                                    @click="handleClickTag(scope.row)"
                                >{{ scope.row.file_info_ }}</el-tag>
                            </div>

                        </template>
                        <template
                            slot="readStatus"
                            slot-scope="scope"
                        >
                            <img
                                :src="scope.row.cy_id_ ? openFilePng : closeFilePng"
                                style="vertical-align: middle; height: 30px;"
                            > /
                            <img
                                :src="scope.row.sc_id_ ? hadColetcPng : noColectPng"
                                style="vertical-align: middle; height: 30px;"
                            >
                        </template>
                    </ibps-crud>
                </template>
            </ibps-container>
            <bpmn-formrender
                :visible="dialogFormVisible"
                :template-key="templateKey"
                :def-id="defId"
                :pk-value="pkValue"
                :form-key="formKey"
                :add-data-cont="addDataCont"
                @close="closeHandle"
            />

            <el-dialog
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :top="'3vh'"
                :width="'90%'"
                class="js-custom-dialog"
                append-to-body
                :fullscreen="false"
                :visible.sync="visible"
            >
                <iframe
                    :src="srcUrl"
                    :height="'100%'"
                    :width="'100%'"
                    frameborder="0"
                    scrolling="no"
                />
            </el-dialog>
            <file-lookup
                :visible="dialogVisible"
                :file-infos="fileInfos"
            />
        </div>

    </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import { getFileType, getFileByUserId } from '@/api/permission/file'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import { findTreeData } from '@/api/platform/cat/type'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import closeFilePng from '@/assets/images/icons/closeFile.png'
import openFilePng from '@/assets/images/icons/openFile.png'
import hadColetcPng from '@/assets/images/icons/hadColetc.png'
import noColectPng from '@/assets/images/icons/noColect.png'
import wordPng from '@/assets/images/icons/word.png'
import fileTraining from '@/views/component/fileTraining'

export default {
    components: {
        IbpsTypeTree,
        BpmnFormrender,
        'ibps-attachment': IbpsAttachment,
        'file-lookup': fileTraining
    },
    mixins: [FixHeight],
    data () {
        const depArrs = []
        var fileDownloadAuthority = false
        const { deptList, role } = this.$store.getters
        for (var i of deptList) {
            depArrs.push(`wj.bian_zhi_bu_men_ like '${i.positionId}'`)
        }
        const roleKey = ['xtgljs', 'syszr', 'dagly', 'xxgljs']
        for (const i of roleKey) {
            if (role.some(so => { return so.alias === i })) {
                fileDownloadAuthority = true
                break
            }
        }
        return {
            //   treeData: [],
            show: '',
            //   rightsArr: ['join', 'delete'],
            //   rowHandle: true,
            width: 210,
            oldorgId: '',
            height: document.clientHeight,
            loading: false,
            filterText: '',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            formKey: 'ywyxjl', // 编辑dialog需要使用
            pkValue: '',
            templateKey: 'ywyxjlsc',
            visible: false,
            categoryKey: '',
            tableTitle: '',
            listData: [],
            selectListData: [],
            bianlistData: {
                dataResult: [],
                pageResult: {
                    limit: 0,
                    page: 0,
                    totalCount: 0,
                    totalPages: 0
                }
            },
            //   listTreeData: [],
            listConfig: {
                // 工具栏
                toolbars: [
                    { key: 'search' },
                    {
                        key: 'colect',
                        label: '收藏或取消收藏',
                        type: 'success'
                    }
                ],
                // 查询条件
                searchForm: {
                    forms: []
                },
                // 表格字段配置
                columns: []
            },
            //   listOptions: {
            //     border: true,
            //     stripe: true
            //   },
            pagination: {
                limit: 20, page: 1
            },
            sorts: {},
            sqlWhere: {},
            searchWhere: {},
            pageKey: '',
            dialogFormVisible: false,
            defId: '',
            addDataCont: {},
            srcUrl: '', // 报表字段
            fileTypesDatas: {
                comAuthority: [],
                buMenAuthority: [],
                authority: []
            }, // 存放所点击列表的分类信息
            depArrs,
            fileDownloadAuthority,
            closeFilePng,
            hadColetcPng,
            noColectPng,
            openFilePng,
            wordPng,
            dialogVisible: false,
            fileInfos: {}
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        }
    },
    created () {
        this.pageKey = this.$route.name
        this.categoryKey = this.$route.name === 'nbwj' ? 'FILE_TYPE' : 'FLOW_TYPE'
        this.userId = this.$store.getters.userInfo.employee.id
        const roleList = this.$store.getters.userInfo.role
        // 系统管理角色添加删除按钮
        const hasRole = roleList.some(item => item.name === '系统管理角色')
        if (this.$route.name === 'wjkzgl-ywyxjlsc') {
            // 系统管理角色不做分类过滤
            this.listConfig.toolbars.push({ key: 'remove' })
            this.selection = true
        }
        if (this.$route.name === 'nbwj') {
            this.listConfig.searchForm.forms = [
                { prop: 'wen_jian_bian_hao', label: '文件编号' },
                { prop: 'wen_jian_ming_che', label: '文件名称' }
            ]
            this.listConfig.columns = [
                { prop: 'status', label: '阅览 / 收藏', slotName: 'readStatus', width: 100 },
                // { prop: 'wen_jian_xi_lei_', label: '文件细类', sortable: 'custom', minWidth: 100 },
                { prop: 'wen_jian_bian_hao', label: '文件编号', sortable: 'custom', width: 150 },
                { prop: 'wen_jian_ming_che', label: '文件名称', minWidth: 150 },
                { prop: 'ban_ben_', label: '版本', width: 65 },
                { prop: 'file_info_', label: '查阅', slotName: 'wenjinachayue', minWidth: 150 },
                { prop: 'fa_fang_shi_jian_', label: '发布日期', sortable: 'custom', width: 150 },
                // { prop: 'read', label: '阅览状态', slotName: 'readStatus', minWidth: 60 },
                // { prop: 'collect', label: '收藏状态', slotName: 'collectStatus', minWidth: 60 },
                { prop: 'cha_yue_jie_zhi_s', label: '查阅截止时间', sortable: 'custom', minWidth: 120 }
            ]
        }
        if (this.$route.name === 'wjkzgl-ywyxjlsc' || this.$route.name === 'ywtxyxjl') {
            this.listConfig.searchForm.forms = [
                { prop: 'nian_du_', label: '年度:', fieldType: 'date', dateType: 'year', width: 50 },
                { prop: 'bian_zhi_shi_jian', label: '上传时间:', fieldType: 'daterange', width: 200 }
            ]
            this.listConfig.columns = [
                // { prop: 'fen_lei_', label: '表单分类', width: 120 },
                { prop: 'nian_du_', label: '年度', width: 100 },
                { prop: 'org_name', label: '部门', width: 100 },
                { prop: 'biao_dan_ming_che', label: '表单名称', width: 210 },
                { prop: 'shi_wu_shuo_ming_', label: '事务说明', minWidth: 250 },
                { prop: 'fu_jian_', label: '附件', slotName: 'wenjinachayue', width: 250 },

                { prop: 'bian_zhi_shi_jian', label: '上传时间', width: 120 },
                { prop: 'ry_name', label: '上传人', width: 70 }
            ]
        }
    },
    mounted () { },
    methods: {
        handleExpandCollapse (isExpand, readonly = false) {
            this.width = isExpand ? 200 : 50
        },

        loadNode () {
            this.loading = true
        },
        getDatas () {
            const { comAuthority, buMenAuthority, authority } = this.fileTypesDatas
            const { fileType, sorts } = this.sqlWhere
            this.listData = []
            let wheres1 = '' // 共用
            let wheres2 = '' // 部门
            let wheres3 = '' // 受限

            let start = ''
            //   console.log('this.$store.getters',this.$store.getters)
            const positionsDatas = this.$store.getters.userInfo.positions
            const needSelType = []
            if (this.$store.getters.userInfo.positions === 0) {
                this.$message({
                    message: '该账户并没有所属部门，请先归属部门再来操作。',
                    type: 'error'
                })
                return
            }
            for (var i in this.searchWhere) {
                if (i === 'b') {
                    start = this.searchWhere[i]
                }
                if (i === 'i') {
                    wheres1 = wheres1 + ` and bian_zhi_shi_jian between '${start} 00:00:00' and '${this.searchWhere[i]} 23:59:59'`
                    wheres2 = wheres2 + ` and bian_zhi_shi_jian between '${start} 00:00:00' and '${this.searchWhere[i]} 23:59:59'`
                    wheres3 = wheres3 + ` and bian_zhi_shi_jian between '${start} 00:00:00' and '${this.searchWhere[i]} 23:59:59'`
                }
                if (i !== 'i' && i !== 'b') {
                    const likeWhere = i === 'nian_du_' ? this.searchWhere[i].getFullYear() : this.searchWhere[i]
                    wheres1 = wheres1 + ` and wj.${i} like '%${likeWhere}%'`
                    wheres2 = wheres2 + ` and wj.${i} like '%${likeWhere}%'`
                    wheres3 = wheres3 + ` and wj.${i} like '%${likeWhere}%'`
                }
            }

            if (fileType) {
                if (this.pageKey === 'nbwj') {
                    if (comAuthority.length !== 0) {
                        wheres1 = wheres1 + ` and FIND_IN_SET (wj.xi_lei_id_,'${comAuthority}')`
                    }
                    if (buMenAuthority.length !== 0) {
                        let orSql = ''
                        // eslint-disable-next-line no-redeclare
                        for (const i in positionsDatas) {
                            if (i === '0') {
                                orSql = `wj.quan_xian_xin_xi_ LIKE '%${positionsDatas[i].id}%'`
                            } else {
                                orSql = orSql + `or wj.quan_xian_xin_xi_ LIKE '%${positionsDatas[i].id}%'`
                            }
                        }
                        wheres2 = wheres2 + ` and (${orSql}) and FIND_IN_SET (wj.xi_lei_id_,'${buMenAuthority}')`
                    }
                    if (authority.length !== 0) {
                        wheres3 = wheres3 + ` and FIND_IN_SET (wj.xi_lei_id_,'${authority}')`
                    }
                } else {
                    wheres1 = wheres1 + ` and FIND_IN_SET (wj.fen_lei_id_,'${fileType}')`
                }
            }
            if (sorts) {
                if (JSON.stringify(sorts) !== '{}') {
                    wheres1 = wheres1 + ` order by  ${sorts.sortBy}  ${sorts.order === 'ascending' ? 'asc' : 'desc'}`
                    wheres2 = wheres2 + ` order by  ${sorts.sortBy}  ${sorts.order === 'ascending' ? 'asc' : 'desc'}`
                }
            }

            // 重复发放的文件，在权限表会存在重复的文件信息
            //   let fileSearchSql = `select  wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,qx.bian_zhi_shi_jian
            //    FROM (SELECT *FROM (SELECT * FROM t_wjcysqb  ORDER BY create_time_ DESC LIMIT 99999999) a GROUP BY a.yong_hu_id_,a.wen_jian_id_) qx LEFT JOIN t_wjxxb wj ON qx.wen_jian_id_=wj.wen_jian_fu_jian_ WHERE qx.yong_hu_id_='${this.userId}' AND qx.shou_quan_='1' ${wheres1} GROUP BY qx.yong_hu_id_,qx.wen_jian_id_`
            const selectSql = `select  wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,concat(file.file_name_,'.',file.ext_,'（大小：',file.total_bytes_,'）') as file_info_,
            wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,wj.fa_bu_shi_jian_ as fa_fang_shi_jian_,"" AS cha_yue_jie_zhi_s  from`
            const leftSql = `left join (select id_,parent_id_ from t_wjcyjl group by parent_id_) cy on cy.parent_id_ = wj.id_
            left join (select id_,parent_id_ from t_wjscjl group by parent_id_) sc on sc.parent_id_ = wj.id_
            left join ibps_file_attachment file on file.id_ = wj.wen_jian_fu_jian_`
            // 内外部文件查阅时候查所有文件
            const allSql = ``
            // 共用文件
            const comSql = `${selectSql} t_wjxxb wj ${leftSql} 
             where wj.shi_fou_guo_shen_ ='有效' and (${this.depArrs.join(' or ')}) ${wheres1} `
            // 部门权限文件
            const buMenSql = `${selectSql}  t_wjxxb wj ${leftSql}
            where wj.shi_fou_guo_shen_ in ('有效','使用') ${wheres2} `
            // 受限文件:结合查阅授权模块的截止时间
            const authoritySql = `select wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,concat(file.file_name_,'.',file.ext_,'（',file.total_bytes_,'）') as file_info_,
            wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,wj.fa_bu_shi_jian_ as fa_fang_shi_jian_,sq.cha_yue_jie_zhi_s  from
        t_wjxxb wj 
        left join (select *from t_skwjcysqsqzb order by create_time_ desc limit 1) sq on wj.id_=sq.wen_jian_id_ 
        ${leftSql}
        WHERE wj.shi_fou_guo_shen_ ='有效' and ((sq.cha_yue_jie_zhi_s >DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (sq.cha_yue_jie_zhi_s =DATE_FORMAT(NOW(), '%Y-%m-%d')))
        and wj.quan_xian_xin_xi_ like '%${this.userId}%'  ${wheres3} `
            const sqlArr = [comSql, buMenSql, authoritySql]
            let oldRecordSql = ''
            const buMenWhere = []
            if (this.pageKey !== 'nbwj') {
                if (this.$store.getters.deptList.length !== 0) {
                    // eslint-disable-next-line no-redeclare
                    for (var i of this.$store.getters.deptList) {
                        buMenWhere.push(`bian_zhi_bu_men_ like '%${i.positionId}%'`)
                    }
                    oldRecordSql = `select wj.*,en.name_ AS org_name,ee.name_ as ry_name FROM t_ywyxjlb wj 
                    left join ibps_party_employee ee on wj.bian_zhi_ren_ = ee.id_ 
                    LEFT JOIN ibps_party_entity en ON en.id_= bian_zhi_bu_men_ 
                    where (${buMenWhere.join(' or ')}) ${wheres1}  order by bian_zhi_shi_jian desc`
                } else {
                    console.log('没有部门组织')
                    return
                }
            }
            // eslint-disable-next-line no-redeclare
            for (var i in Object.keys(this.fileTypesDatas)) {
                var key = Object.keys(this.fileTypesDatas)[i] // key
                var value = this.fileTypesDatas[key] // value
                if (value.length !== 0) {
                    needSelType.push(`(${sqlArr[i]})`)
                }
            }
            //   console.log('needSelType',needSelType)
            const fileSearchSql = needSelType.join('union all')
            const sql = this.pageKey === 'nbwj' ? `select sq.* from (${fileSearchSql}) sq ORDER BY sq.wen_jian_bian_hao DESC,sq.wen_jian_ming_che DESC` : oldRecordSql
            // console.log('sql------------：', sql)
            curdPost('sql', sql).then(res => {
                const tableDatas = res.variables.data
                this.selectListData = JSON.parse(JSON.stringify(tableDatas))
                let filterDatas = []
                this.bianlistData.pageResult.totalCount = tableDatas.length
                this.bianlistData.pageResult.totalPages = Math.ceil(tableDatas.length / this.pagination.limit)
                this.bianlistData.pageResult.limit = this.pagination.limit
                this.bianlistData.pageResult.page = this.pagination.page
                if (this.pagination.limit > tableDatas.length) {
                    filterDatas = JSON.parse(JSON.stringify(tableDatas))
                } else {
                    for (let index = 0; index < 20; index++) {
                        filterDatas.push(tableDatas[index])
                    }
                }
                this.bianlistData.dataResult = filterDatas
                ActionUtils.handleListData(this, this.bianlistData)
            }).catch(res => {
                this.loading = false
                this.listData = []
            })
        },
        refreshData () {
            this.listData = []
            this.getSearcFormData()
            this.getDatas()
        },
        handleNodeClick (nodeId, nodeData, treeDatas) {
            this.tableTitle = nodeData.name
            this.show = 'detail'
            this.addDataCont = { fenLei: nodeData.name, fenLeiId: nodeId }
            const fileTypes = []
            if (this.oldorgId === nodeId && (nodeData.name !== '文件分类')) {
                return
            }
            // 判断是否存在下级菜单
            const noHadNext = nodeData.children === undefined
            if (noHadNext && this.pageKey === 'wjkzgl-ywyxjlsc') {
                const chongfu = this.listConfig.toolbars.filter(el => {
                    return el.key === 'add'
                })
                if (chongfu.length === 0 && this.depth !== 0) {
                    this.listConfig.toolbars.splice(1, 0, { key: 'add' })
                }
            } else {
                this.listConfig.toolbars = this.listConfig.toolbars.filter(el => {
                    return el.key !== 'add'
                })
            }
            this.fileTypesDatas = {
                comAuthority: [],
                buMenAuthority: [],
                authority: [],
                shiJiSql: [],
                sheBeiSql: []
            }
            if (nodeData.children === undefined) {
                const authorityName = JSON.parse(nodeData.authorityName)
                fileTypes.push(nodeId)
                if (authorityName.chaYue === '公用查阅') {
                    this.fileTypesDatas.comAuthority.push(nodeId)
                }
                if (authorityName.chaYue === '部门查阅') {
                    this.fileTypesDatas.buMenAuthority.push(nodeId)
                }
                if (authorityName.chaYue === '受限查阅') {
                    this.fileTypesDatas.authority.push(nodeId)
                }
            } else {
                const getTail = item => item.children && item.children.length > 0 ? item.children.map(m => getTail(m)) : [item]
                // eslint-disable-next-line no-undef
                const result = _.flattenDeep(nodeData.children.map(m => getTail(m)))
                for (var i of result) {
                    fileTypes.push(i.id)
                    const authorityName = JSON.parse(i.authorityName)
                    if (authorityName.chaYue === '公用查阅') {
                        this.fileTypesDatas.comAuthority.push(i.id)
                    }
                    if (authorityName.chaYue === '部门查阅') {
                        this.fileTypesDatas.buMenAuthority.push(i.id)
                    }
                    if (authorityName.chaYue === '受限查阅') {
                        this.fileTypesDatas.authority.push(i.id)
                    }
                }
            }
            this.oldorgId = nodeId
            this.sqlWhere = {
                fileType: fileTypes.join(',')
            }
            this.getDatas()
        },
        // 开启表单页面
        openTask (id) {
            this.dialogFormVisible = true
            this.defId = id
        },
        // 关闭编辑表单
        closeHandle (v) {
            this.dialogFormVisible = v
            this.refreshData()
        },
        /**
     * 获取格式化参数
     */
        getSearcFormData () {
            this.searchWhere = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            //   this.getDatas()
        },
        /**
 * 处理按钮事件
 */
        handleAction (command, position, selection, data, index, button) {
            switch (command) {
                case 'search':// 查询
                    this.refreshData()
                    break
                case 'remove':
                    if (data.length === 0) {
                        this.$message({
                            message: '请选择数据再进行删除',
                            type: 'error'
                        })
                    }
                    // eslint-disable-next-line no-case-declarations
                    const ids = []
                    for (var i of data) {
                        ids.push(i.id_)
                    }
                    // eslint-disable-next-line no-case-declarations
                    const deleteParams = {
                        tableName: 't_ywyxjlb',
                        paramWhere: { id_: ids.join(',') }
                    }
                    curdPost('delete', deleteParams).then(() => {
                        this.$message({
                            message: '删除成功！',
                            type: 'warning'
                        })
                        this.refreshData()
                    })

                    break
                case 'add': // 添加
                    this.openTask('1072813170935988224')
                    break
                case 'colect': // 收藏或取消收藏
                    if (!data || !data.length) {
                        return this.$message({
                            message: '请先选择数据再进行操作~',
                            type: 'warning'
                        })
                    }
                    this.handleColect(data)
                    break
                default:
                    break
            }
        },
        /**
    * 处理排序
    */
        handleSortChange (sort) {
            this.sqlWhere.sorts = sort
            this.getDatas()
        },
        // 处理分页事件
        handlePaginationChange (page) {
            ActionUtils.setPagination(this.pagination, page)
            this.bianlistData.pageResult.limit = page.limit
            this.bianlistData.pageResult.page = page.page
            const filterDatas = []
            if (this.selectListData.length >= (page.limit * page.page)) {
                for (let index = (page.limit * page.page) - page.limit; index < (page.limit * page.page); index++) {
                    filterDatas.push(this.selectListData[index])
                }
                this.bianlistData.dataResult = JSON.parse(JSON.stringify(filterDatas))
            } else {
                for (let index = (page.limit * page.page) - page.limit; index < this.selectListData.length; index++) {
                    filterDatas.push(this.selectListData[index])
                }
                this.bianlistData.dataResult = JSON.parse(JSON.stringify(filterDatas))
            }
            ActionUtils.handleListData(this, this.bianlistData)
        },
        getScSrc (id) {
            return id ? this.hadColetcPng : this.noColectPng
        },
        async handleColect (data) {
            const addScDatas = []
            const delIds = []
            const scTableName = 't_wjscjl'
            for (const i of data) {
                // 如果是有sc_id_说明是已经收藏过的，再次点击按钮的时候就取消收藏
                if (i.sc_id_) {
                    delIds.push(i.sc_id_)
                } else {
                    addScDatas.push({
                        bian_zhi_ren_: this.userId,
                        bian_zhi_shi_jian: this.$common.getDateNow(19),
                        parent_id_: i.id
                    })
                }
            }
            if (addScDatas.length) {
                const addParams = {
                    tableName: scTableName,
                    paramWhere: addScDatas
                }
                await curdPost('add', addParams).then(res => {
                })
            }
            if (delIds.length) {
                const deleteParams = {
                    tableName: scTableName,
                    paramWhere: { id_: delIds.join(',') }
                }
                await curdPost('delete', deleteParams).then(() => {
                })
            }
            this.refreshData()
        },
        handleClickTag (val) {
            const sql = `select * from ibps_file_attachment where id_= '${val.fu_jian_}'`
            this.$common.request('sql', sql).then(res => {
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    this.$message.warning('没有可查阅的文件，请查明原因！')
                    return
                }
                this.fileInfos = { id: val.id, FILE_NAME_: val.wen_jian_ming_che, fileInfos: data[0], func: this.handleUpdate }
                this.dialogVisible = true
            })
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
            curdPost('add', addParams).then(res => {
                this.refreshData()
            })
        }
    }
}
</script>
<style lang="less" scoped>
.box {
  width: 230px;
}

.title {
  font-size: 14px;
  margin: 21px 5px 5px;
  padding: 0;
}

/deep/ .el-tree-node__content {
  display: block;
}
</style>

