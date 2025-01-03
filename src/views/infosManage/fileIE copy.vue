<template>
    <div class="main-container">
        <!-- 外部 -->
        <div slot="west">
            <div class="box">
                <!-- 选择内外部文件的侧边栏 -->
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
                <!-- 选择文件，展示在右边 -->
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
                            v-if="scope.row.fu_jian_"
                            slot="file"
                            slot-scope="scope"
                        >
                            <ibps-attachment
                                v-model="scope.row.fu_jian_"
                                allow-download
                                download
                                multiple
                                accept="*"
                                store="id"
                                readonly
                            />
                        </template>
                        <template
                            v-if="scope.row.file_info_"
                            slot="wenjinachayue"
                            slot-scope="scope"
                        >
                            <div>
                                <!-- <img
                                    :src="wordPng"
                                    style="vertical-align: middle; height: 20px;"
                                > -->
                                <i class="el-icon-document" />
                                <el-tag
                                    type="info"
                                    style="cursor: pointer;"
                                    @click="handleClickTag(scope.row)"
                                >{{ scope.row.file_info_ }}</el-tag>
                            </div>
                        </template>
                        <template v-if="showCaoZuoColumn" slot="caozuo" slot-scope="scope">
                            <div style="color:#1E90FF; " class="hover-hand" @click="updateDate(scope)">
                                <i class="el-icon-edit-outline" style="cursor: pointer;" />
                                <span style="cursor: pointer;"> 更新</span>
                            </div>
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
            <!-- <file-lookup
                :visible="dialogVisible"
                :file-infos="fileInfos"
            /> -->
            <!-- 本人修改 -->
            <file-lookup
                v-if="dialogVisible"
                :visible="dialogVisible"
                :file-infos="fileArray"
                @colseVisible="colseVisible"
            />
        </div>
        <UpdateFile
            v-if="dialogFormVisibles"
            :visidial="dialogFormVisibles"
            :son-data="sonData"
            @getcolse="getcolse"
        />
    </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import FixHeight from '@/mixins/height'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import closeFilePng from '@/assets/images/icons/closeFile.png'
import openFilePng from '@/assets/images/icons/openFile.png'
import wordPng from '@/assets/images/icons/word.png'
import fileTraining from '@/views/component/fileTraining'
import UpdateFile from './updateFile'

export default {
    components: {
        IbpsTypeTree,
        BpmnFormrender,
        UpdateFile,
        'ibps-attachment': IbpsAttachment,
        'file-lookup': fileTraining
    },
    mixins: [FixHeight],
    data () {
        const roleList = ['xtgljs', 'syszr', 'wjglzzc', 'wjgly', 'wjxzjs']
        const { isSuper, role, deptList = [] } = this.$store.getters || {}
        const hasRole = isSuper || role.some(r => roleList.includes(r.alias))
        const depArrs = deptList.map(i => `wj.bian_zhi_bu_men_ like '${i.positionId}'`)
        return {
            isSuper,
            hasRole,
            depArrs,
            dialogFormVisibles: false,
            fileLookShow: false,
            sonData: '',
            showCaoZuoColumn: false,
            //   treeData: [],
            show: '',
            //   rightsArr: ['join', 'delete'],
            //   rowHandle: true,
            width: 210,
            oldorgId: null,
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
                    { key: 'search' }
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
            closeFilePng,
            openFilePng,
            wordPng,
            dialogVisible: false,
            fileInfos: {},
            // 本人修改
            fileArray: []
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        },
        showCaoZuoColumn (val) {
            this.showCaoZuoColumn = val
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
                // { prop: 'wen_jian_xi_lei_', label: '文件细类', sortable: 'custom', minWidth: 100 },
                { prop: 'wen_jian_bian_hao', label: '文件编号', sortable: 'custom', width: 150 },
                { prop: 'wen_jian_ming_che', label: '文件名称', minWidth: 150 },
                { prop: 'ban_ben_', label: '版本', width: 65 },
                { prop: 'file_info_', label: '查阅', slotName: 'wenjinachayue', minWidth: 150 },
                { prop: 'fa_fang_shi_jian_', label: '发布日期', sortable: 'custom', width: 150 },
                { prop: 'cha_yue_jie_zhi_s', label: '查阅截止时间', sortable: 'custom', minWidth: 120 }
            ]
        }
        if (this.$route.name === 'wjkzgl-ywyxjlsc' || this.$route.name === 'ywtxyxjl') {
            this.listConfig.searchForm.forms = [
                { prop: 'nian_du_', label: '记录月份', fieldType: 'date', dateType: 'year', width: 50 },
                { prop: 'bian_zhi_shi_jian', label: '上传时间', fieldType: 'daterange', width: 200 }
            ]
            this.listConfig.columns = [
                // { prop: 'fen_lei_', label: '表单分类', width: 120 },
                { prop: 'nian_du_', label: '记录月份', width: 100 },
                { prop: 'org_name', label: '部门', width: 100 },
                { prop: 'biao_dan_ming_che', label: '表单名称', width: 250 },
                { prop: 'shi_wu_shuo_ming_', label: '事务说明', width: 250 },
                { prop: 'fu_jian_', label: '附件', slotName: 'file', minWidth: 250 },
                { prop: 'bian_zhi_shi_jian', label: '上传时间', width: 140 },
                { prop: 'ry_name', label: '上传人', width: 90 }
            ]
        }
    },
    methods: {

        unitConversions (str) {
            // 使用正则表达式匹配括号内的数字
            const match = str.match(/（(\d+)）/)
            // const match = str.match(/\((\d+)\)/)
            console.log('match', match)
            // 如果找到了匹配，则返回匹配到的数字；否则返回空字符串
            if (!match) { return }
            if (match[1] < 1024) { return match[0] + match[1] }
            return match[0] + (match[1] / 1024).toFixed(2) + 'M'
        },
        colseVisible (val) {
            this.dialogVisible = val
        },
        getcolse () {
            this.dialogFormVisibles = false
        },
        // 外部文件更新
        updateDate (data) {
            this.sonData = data
            this.dialogFormVisibles = true
        },
        handleClose (done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                })
                .catch(_ => {})
        },
        handleExpandCollapse (isExpand, readonly = false) {
            this.width = isExpand ? 200 : 50
        },

        loadNode () {
            this.loading = true
        },
        getDatas () {
            const { comAuthority, buMenAuthority, authority } = this.fileTypesDatas
            // fileType存放点击文件id，如有孩子，则还有孩子id
            const { fileType, sorts } = this.sqlWhere
            this.listData = []
            let wheres1 = '' // 共用
            let wheres2 = '' // 部门
            let wheres3 = '' // 受限

            let start = ''
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
            // fileType存放文件的id和有孩子的id
            if (fileType) {
                if (this.pageKey === 'nbwj') {
                    if (comAuthority.length !== 0) {
                        wheres1 = wheres1 + ` and FIND_IN_SET (wj.xi_lei_id_,'${comAuthority}')`
                    }
                    if (buMenAuthority.length !== 0) {
                        let orSql = ''
                        positionsDatas.forEach((item, index) => {
                            orSql += `${index === 0 ? '' : 'OR'} wj.quan_xian_xin_xi_ LIKE '%${item.id}%'`
                        })
                        wheres2 = wheres2 + ` and (${orSql}) and FIND_IN_SET (wj.xi_lei_id_,'${buMenAuthority}')`
                    }
                    if (authority.length !== 0) {
                        wheres3 = wheres3 + ` and FIND_IN_SET (wj.xi_lei_id_,'${authority}')`
                    }
                } else {
                    wheres1 = wheres1 + ` and FIND_IN_SET (wj.fen_lei_id_,'${fileType}')`
                }
            }
            let ascDesc = 'desc'
            if (sorts && JSON.stringify(sorts) !== '{}') {
                wheres1 = wheres1 + ` order by  ${sorts.sortBy}  ${sorts.order === 'ascending' ? 'asc' : 'desc'}`
                wheres2 = wheres2 + ` order by  ${sorts.sortBy}  ${sorts.order === 'ascending' ? 'asc' : 'desc'}`
                ascDesc = sorts.order === 'ascending' ? 'asc' : 'desc'
            }
            const isSuper = this.$store.getters.isSuper
            const roleLists = this.$store.getters.userInfo.role
            const roleKey = ['wjgly']
            const curRole = roleLists.map(i => i.alias)
            const isPower = curRole.some(i => roleKey.includes(i))
            // 重复发放的文件，在权限表会存在重复的文件信息
            //   let fileSearchSql = `select  wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,qx.bian_zhi_shi_jian
            //    FROM (SELECT *FROM (SELECT * FROM t_wjcysqb  ORDER BY create_time_ DESC LIMIT 99999999) a GROUP BY a.yong_hu_id_,a.wen_jian_id_) qx LEFT JOIN t_wjxxb wj ON qx.wen_jian_id_=wj.wen_jian_fu_jian_ WHERE qx.yong_hu_id_='${this.userId}' AND qx.shou_quan_='1' ${wheres1} GROUP BY qx.yong_hu_id_,qx.wen_jian_id_`
            const selectSql = `select  wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,wj.shu_ju_lai_yuan_ AS shu_ju_lai_yuan_,concat(file.file_name_,'.',file.ext_,'（大小：',
               CASE
                WHEN file.total_bytes_ >= 1024 * 1024 THEN CONCAT(ROUND(file.total_bytes_ / (1024.0 * 1024), 2), ' M')
                WHEN file.total_bytes_ >= 1024 THEN CONCAT(ROUND(file.total_bytes_ / 1024.0, 2), ' K')
                ELSE CONCAT(file.total_bytes_, 'B')
            END
            ,'）') as file_info_,
            wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,wj.fa_bu_shi_jian_ as fa_fang_shi_jian_,'' AS cha_yue_jie_zhi_s  from`

            // const selectSql = `select  wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,concat(file.file_name_,'.',file.ext_,'（大小：',file.total_bytes_,'）') as file_info_,
            // wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,wj.fa_bu_shi_jian_ as fa_fang_shi_jian_,"" AS cha_yue_jie_zhi_s  from`
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
            // select wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,concat(file.file_name_,'.',file.ext_,'（',file.total_bytes_,'）') as file_info_,

            const authoritySql = `select wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,wj.shu_ju_lai_yuan_ AS shu_ju_lai_yuan_,concat(file.file_name_,'.',file.ext_,'（',
                     CASE
                    WHEN file.total_bytes_ >= 1024 * 1024 THEN CONCAT(ROUND(file.total_bytes_ / (1024.0 * 1024), 2), ' M')
                    WHEN file.total_bytes_ >= 1024 THEN CONCAT(ROUND(file.total_bytes_ / 1024.0, 2), ' K')
                    ELSE CONCAT(file.total_bytes_, 'B')
                END
                ,'）') as file_info_,
                wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,wj.fa_bu_shi_jian_ as fa_fang_shi_jian_,sq.cha_yue_jie_zhi_s  from
            t_wjxxb wj
            left join (select *from t_skwjcysqsqzb order by create_time_ desc limit 1) sq on wj.id_=sq.wen_jian_id_
            ${leftSql}
            WHERE wj.shi_fou_guo_shen_ ='有效'and ((sq.cha_yue_jie_zhi_s >DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (sq.cha_yue_jie_zhi_s =DATE_FORMAT(NOW(), '%Y-%m-%d')))
            and wj.quan_xian_xin_xi_ like '%${this.userId}%'  ${wheres3} `
            // and (${isPower} or wj.quan_xian_xin_xi_ like '%${this.userId}%')  ${wheres3}
            // 深圳三院（受限文件查阅权限）
            //     const authoritySql = `select wj.id_ as id,cy.id_ as cy_id_,sc.id_ as sc_id_,
            //     CONCAT(file.file_name_, '.', file.ext_, '（',
            //     CASE
            //        WHEN file.total_bytes_ >= 1024 * 1024 THEN CONCAT(ROUND(file.total_bytes_ / (1024.0 * 1024), 2), ' M')
            //        WHEN file.total_bytes_ >= 1024 THEN CONCAT(ROUND(file.total_bytes_ / 1024.0, 2), ' K')
            //        ELSE CONCAT(file.total_bytes_, 'B')
            //     END
            //  , '）') as file_info_,wj.wen_jian_xi_lei_,wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,wj.wen_jian_fu_jian_ AS fu_jian_,wj.fa_bu_shi_jian_ as fa_fang_shi_jian_,sq.cha_yue_jie_zhi_s FROM t_wjxxb wj
            //  LEFT JOIN (SELECT * FROM t_skwjcysqsqzb ORDER BY create_time_ DESC LIMIT 1) sq ON wj.id_ = sq.wen_jian_id_ ${leftSql}
            //  WHERE wj.shi_fou_guo_shen_ = '有效' AND (${isSuper} OR ${isPower}
            // 	OR EXISTS (SELECT 1 FROM t_wjxdzb wjxdzb
            // 		JOIN t_wjxzxdjlb wjxzxdjlb ON wjxdzb.id_ = wjxzxdjlb.parent_id_
            // 		JOIN t_wjxxb wjxxb ON wjxxb.shu_ju_lai_yuan_ = wjxzxdjlb.id_
            // 	WHERE wjxxb.id_ = wj.id_  AND CONCAT_WS(',',
            //         IF ( wjxdzb.bian_zhi_ren_ != '', wjxdzb.bian_zhi_ren_, NULL ),
            // 		IF( wjxdzb.zhu_shen_he_ren_ != '', wjxdzb.zhu_shen_he_ren_, NULL ),
            // 		IF( wjxdzb.zhu_shen_pi_ren_ != '', wjxdzb.zhu_shen_pi_ren_, NULL )
            // 		) LIKE '%${this.userId}%'
            // 	)
            // ) ${wheres3}`
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
            const fileSearchSql = needSelType.join('union all')
            // ` order by  ${sorts.sortBy}  ${sorts.order === 'ascending' ? 'asc' : 'desc'}`
            const sql = this.pageKey === 'nbwj' ? `select sq.id,sq.cy_id_,sq.sc_id_,sq.shu_ju_lai_yuan_,sq.file_info_,sq.wen_jian_xi_lei_,sq.wen_jian_bian_hao,sq.wen_jian_ming_che,sq.ban_ben_,COALESCE(wjxz.gai_zhang_fu_jian,sq.fu_jian_) AS fu_jian_,sq.fa_fang_shi_jian_,sq.cha_yue_jie_zhi_s from (${fileSearchSql}) sq LEFT JOIN t_wjxzxdjlb wjxz ON sq.shu_ju_lai_yuan_ = wjxz.id_ ORDER BY sq.wen_jian_bian_hao ${ascDesc},sq.wen_jian_ming_che DESC` : oldRecordSql
            // console.log(sql, 'sssssssssssssssssss')
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
        //  and ((sq.cha_yue_jie_zhi_s >DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (sq.cha_yue_jie_zhi_s =DATE_FORMAT(NOW(), '%Y-%m-%d')))
        refreshData () {
            this.listData = []
            this.getSearcFormData()
            this.getDatas()
        },
        hasColumnByProp (columns, prop) {
            return columns.some(column => column.prop === prop)
        },
        removeColumnByProp (columns, prop) {
            return columns.filter(column => column.prop !== prop)
        },
        handleNodeClick (nodeId, nodeData, treeDatas) {
            // 判断是否显示外部文件更新按钮
            if (nodeData.depth !== 0) {
                const pathId = nodeData.path ? nodeData.path.split('.') : []
                const pathNameList = pathId.map(id => {
                    const node = treeDatas.find(item => item.id === id)
                    return node ? node.name : ''
                })
                if (pathNameList.includes('外部文件') && this.isSuper) {
                    this.showCaoZuoColumn = true
                    if (!this.hasColumnByProp(this.listConfig.columns, 'cao_zuo')) {
                        this.listConfig.columns.push({ prop: 'cao_zuo', label: '操作', slotName: 'caozuo', width: 100 })
                    }
                } else {
                    this.showCaoZuoColumn = false
                    this.listConfig.columns = this.removeColumnByProp(this.listConfig.columns, 'cao_zuo')
                }
            }
            this.show = 'detail'
            this.addDataCont = { fenLei: nodeData.name, fenLeiId: nodeId }
            const fileTypes = []
            // 避免重复请求
            if (this.oldorgId === nodeId) {
                return
            }
            // 判断是否存在下级菜单
            const noHadNext = !nodeData.children || !nodeData.children.length
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
            const processAuthority = (nodeId, authorityName) => {
                fileTypes.push(nodeId)
                if (!authorityName || !authorityName.chaYue) {
                    return
                }
                switch (authorityName.chaYue) {
                    case '公用查阅':
                        this.fileTypesDatas.comAuthority.push(nodeId)
                        break
                    case '部门查阅':
                        this.fileTypesDatas.buMenAuthority.push(nodeId)
                        break
                    case '受限查阅':
                        this.fileTypesDatas.authority.push(nodeId)
                        break
                }
            }
            // 递归获取所有子节点
            // 存在子节点时，需获取当前节点及所有子节点信息 - task3329
            const getTail = item => {
                const result = [item] // 将自身信息添加到结果中
                if (item.children && item.children.length > 0) {
                    // 如果有子节点，则递归获取子节点的信息
                    item.children.forEach(child => {
                        result.push(...getTail(child)) // 将子节点信息添加到结果中
                    })
                }
                return result
            }

            const result = getTail(nodeData)
            result.forEach(({ id, authorityName }) => {
                const parsedAuthority = JSON.parse(authorityName)
                processAuthority(id, parsedAuthority)
            })
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
            // console.log('val', val)
            // const sql = `select * from ibps_file_attachment where id_= '${val.fu_jian_}'`
            // this.$common.request('sql', sql).then(res => {
            //     console.log('res', res)
            //     this.fileInfos = {}// 本人添加
            //     const { data = [] } = res.variables || {}
            //     if (!data.length) {
            //         this.$message.warning('没有可查阅的文件，请查明原因！')
            //         return
            //     }
            //     this.fileInfos = { id: val.id, FILE_NAME_: val.wen_jian_ming_che, fileInfos: data[0], func: this.handleUpdate, ban_ben_: val.ban_ben_ }
            //     this.dialogVisible = true
            // 本人修改
            this.fileArray = []
            // this.handleFileInfo(val)
            const sql1 = `select t_wjxxb.*, t_wjxzxdjlb.xiu_ding_ban_ben_, t_wjxzxdjlb.xiu_ding_nei_rong,t_wjxzxdjlb.yuan_yin_
            from  t_wjxxb
            INNER JOIN t_wjxzxdjlb ON  t_wjxxb.shu_ju_lai_yuan_ = t_wjxzxdjlb.id_ WHERE  tou_ban_wen_jian_='${val.id}' AND t_wjxxb.shi_fou_guo_shen_='有效'`
            // 1
            const sql = `select wjxzxdjlb.* FROM t_wjxxb wjxxb 
            LEFT JOIN t_wjxzxdjlb wjxzxdjlb ON 
            wjxxb.wen_jian_fu_jian_ = wjxzxdjlb.wen_jian_fu_jian_
            WHERE wjxxb.id_ = '${val.id}' ORDER BY wjxzxdjlb.create_time_ DESC`
            this.$common.request('sql', sql).then(res => {
                const list = res.variables.data
                // console.log('list', list)
                list.forEach(el => {
                    const obj = {
                        zId: val.id,
                        id: el.id_,
                        wen_jian_ming_che: el.wen_jian_ming_che,
                        ban_ben_: el.ban_ben_,
                        // fu_jian_: el.wen_jian_fu_jian_,
                        fu_jian_: el.gai_zhang_fu_jian ? el.gai_zhang_fu_jian : el.wen_jian_fu_jian_,
                        xiu_ding_nei_rong: el.xiu_ding_nei_rong,
                        yuan_yin_: el.yuan_yin_,
                        fa_fang_shi_jian_: el.bian_zhi_shi_jian,
                        xiu_ding_ban_ben_: el.xiu_ding_ban_ben_, xiu_ding_wen_jian_: el.xiu_ding_wen_jian_,
                        wen_jian_bian_hao: el.wen_jian_bian_hao,
                        bian_zhi_ren_: el.bian_zhi_ren_,
                        cao_zuo_lei_xing_: el.cao_zuo_lei_xing_,
                        xiu_ding_fu_jian_: el.xiu_ding_fu_jian_
                    }
                    this.handleFileInfo(obj)
                })
                this.dialogVisible = true
            })
        },
        handleFileInfo (val) {
            let sql = ''
            if (val.cao_zuo_lei_xing_ === '修订') {
                sql = `select * from ibps_file_attachment where id_= '${val.xiu_ding_fu_jian_}'`
            } else {
                sql = `select * from ibps_file_attachment where id_= '${val.fu_jian_}'`
            }
            this.$common.request('sql', sql).then(res => {
                this.fileInfos = {}// 本人添加
                const { data = [] } = res.variables || {}
                if (!data.length) {
                    this.$message.warning('没有可查阅的文件，请查明原因！')
                    return
                }
                this.fileInfos = { id: val.id, FILE_NAME_: val.wen_jian_ming_che, fileInfos: data[0], func: this.handleUpdate, ban_ben_: val.ban_ben_, xiu_ding_nei_rong: val.xiu_ding_nei_rong ? val.xiu_ding_nei_rong : '', yuan_yin_: val.yuan_yin_ ? val.yuan_yin_ : '', xiu_ding_ban_ben_: val.xiu_ding_ban_ben_ ? val.xiu_ding_ban_ben_ : '', wen_jian_bian_hao: val.wen_jian_bian_hao, fa_fang_shi_jian_: val.fa_fang_shi_jian_, bian_zhi_ren_: val.bian_zhi_ren_, cao_zuo_lei_xing_: val.cao_zuo_lei_xing_, zId: val.zId, xiu_ding_fu_jian_: val.xiu_ding_fu_jian_ }
                this.fileArray.push(this.fileInfos)
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

/deep/ .el-form-item__label{
    text-align: left;
}

/deep/ .el-dialog__footer{
    display: flex;
    justify-content: center;
}

</style>

