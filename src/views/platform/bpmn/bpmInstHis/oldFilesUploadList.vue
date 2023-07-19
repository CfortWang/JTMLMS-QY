<template>
    <div class="main-container">
        <div slot="west">
            <ibps-type-tree
                :width="width"
                :height="height"
                title="记录分类"
                :location="location"
                category-key="FLOW_TYPE"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            />
        </div>
        <ibps-crud
            ref="crud"
            :style="{ marginLeft: width + 'px' }"
            :height="height"
            :data="listData"
            :toolbars="listConfig.toolbars"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :display-field="tableTitle"
            :columns="listConfig.columns"
            :loading="loading"
            :index-row="false"
            :pagination="pagination"
            :selection-row="selection"
            @action-event="handleAction"
            @pagination-change="handlePaginationChange"
        >

            <template
                slot="wenjinachayue"
                slot-scope="scope"
            >
                <ibps-attachment
                    :value="scope.row.fu_jian_"
                    readonly
                    allow-download
                    :download="false"
                    :multiple="true"
                />
            </template>
        </ibps-crud>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :template-key="templateKey"
            :def-id="defId"
            :pk-value="pkValue"
            :form-key="formKey"
            :add-data-cont="addDataCont"
            @close="visible => dialogFormVisible = visible"
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

    </div>

</template>

<script>
import ActionUtils from '@/utils/action'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import FixHeight from '@/mixins/height'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js' // 增删改查规则
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import GetReport from './corresponding/getReport.js'
export default {
    components: {
        IbpsTypeTree,
        BpmnFormrender,
        'ibps-attachment': IbpsAttachment
    },
    mixins: [FixHeight, GetReport],
    props: {
        location: {
            type: String,
            default: 'initial'
        }
    },
    data () {
        return {
            width: 200,
            selection: false,
            dialogFormVisible: false, // 弹窗
            defId: '', // 添加dialog需要使用
            addDataCont: {},
            pkKey: 'id_', // 主键  如果主键不是pk需要传主键
            formKey: 'ywyxjl', // 编辑dialog需要使用
            pkValue: '',
            templateKey: 'ywyxjlsc',
            tableTitle: '',
            typeId: '',
            listType: '',
            srcUrl: '', // 报表字段
            fuJian: '', // 文件字段
            isDisable: false, // 判断多次点击
            forClick: '', // 判断是否重复点击
            visible: false,
            currReportCont: {},
            title: '',
            loading: true,
            height: document.clientHeight,
            reportAll: [],
            listData: [],
            bianlistData: {
                dataResult: [],
                pageResult: {
                    limit: 0,
                    page: 0,
                    totalCount: 0,
                    totalPages: 0
                }
            },
            selectListData: [],
            pagination: {
                limit: 20, page: 1
            },
            paginations: 20,
            page: 1,
            sorts: {},
            depth: '', // 分类栏层级
            treeData: [], // 分类栏数据
            niandu: '', // 年度
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            listOptions: {
                border: true,
                stripe: true
            },
            listConfig: {
                toolbars: [
                    { key: 'search' }
                    // { key: 'add' },
                    // { key: 'detail' },
                    // { key: 'resetSearch' }
                ],
                searchForm: {
                    forms: [
                        { prop: 'nianDu', label: '年度:', width: 50 },
                        { prop: 'bianZhiShiJian', label: '上传时间:', fieldType: 'daterange', width: 225 }
                    ]
                },
                // 表格字段配置
                columns: [
                    { prop: 'fen_lei_', label: '记录表单分类', width: 120 },
                    { prop: 'biao_dan_ming_che', label: '表单名称', width: 350 },
                    { prop: 'shi_wu_shuo_ming_', label: '事务说明', width: 350 },

                    { prop: 'nian_du_', label: '年度', width: 80 },
                    { prop: 'bian_zhi_shi_jian', label: '上传时间', width: 100 },
                    //   { prop: 'bm_name', label: '上传部门', width: 120 },
                    { prop: 'ry_name', label: '上传人', width: 100 },
                    { prop: 'fu_jian_', label: '附件', slotName: 'wenjinachayue', width: 300 }
                ]
            }
        }
    },
    created () {
        this.loadData()
        // this.getConfig() //获取配置的报表
        const roleList = this.$store.getters.userInfo.role
        // 系统管理角色添加删除按钮
        const hasRole = roleList.some(item => item.name === '系统管理角色')
        if (hasRole) {
            // 系统管理角色不做分类过滤
            this.listConfig.toolbars.push({ key: 'remove' })
            this.selection = true
        }
    },
    methods: {
        /* 获取配置报表数据*/
        getConfig () {
            const sql = 'select bao_biao_lu_jing_, fu_jian_nei_rong_, guan_lian_zi_duan, liu_cheng_xuan_ze, shi_fou_zi_biao_ from t_lcidglbdbb'
            curdPost('sql', sql).then((res) => {
                this.reportAll = res.variables && res.variables.data
            }).catch(() => {
                console.log('获取流程配置报表数据失败！')
            })
        },
        /* 封装表名与条件*/
        packNameWhere (name, where) {
            const cont = {}
            cont['tableName'] = name
            cont['paramWhere'] = where
            return cont
        },
        openTask (id) {
            this.dialogFormVisible = true
            this.defId = id
            this.addDataCont = { fenLei: this.tableTitle, fenLeiId: this.typeId }
        },
        // 加载数据
        loadData () {
            this.loading = true
            const typeWheres = []
            let typeWhere = ''
            const startTimeWhere = this.startTime ? (
                this.endTime ? ` bian_zhi_shi_jian between '${this.startTime}' and '${this.endTime}'` : ` bian_zhi_shi_jian between '${this.startTime}' and '2099-01-01'`
            ) : (
                this.endTime ? ` bian_zhi_shi_jian between '1949-10-01' and '${this.endTime}'` : ``
            )

            // 第一级目录
            if (this.depth === '0') {
                const nianduWhere = this.niandu ? (
                    startTimeWhere ? ` where  nian_du_ = '${this.niandu}' and` + startTimeWhere : ` where  nian_du_ = '${this.niandu}'`
                ) : (
                    startTimeWhere ? ' where ' + startTimeWhere : ''
                )
                const sql = 'select * FROM t_ywyxjlb jl  LEFT JOIN lh_bm_ry ry ON ry.ry_id  = jl.bian_zhi_ren_' + nianduWhere + ' order by bian_zhi_shi_jian desc'
                curdPost('sql', sql).then(response => {
                    const tableDatas = response.variables.data
                    if (tableDatas.length !== 0) {
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
                    } else {
                        ActionUtils.handleListData(this, [])
                        this.pagination.limit = 20
                        this.pagination.page = 1
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            } else {
                // 筛选出下级目录
                const erji = this.treeData.filter(el => {
                    return el.parentId === this.typeId
                })
                if (erji.length !== 0) {
                    // 第二级目录
                    erji.forEach(el => typeWheres.push(el.id))
                    typeWhere = "'" + typeWheres.join("','") + "'"
                } else {
                    // 第三级目录
                    typeWhere = this.typeId
                }

                const nianduWhere = this.niandu ? (
                    startTimeWhere ? ` where  nian_du_ = '${this.niandu}' and` + startTimeWhere : ` where  nian_du_ = '${this.niandu}'`
                ) : (
                    startTimeWhere ? ' where ' + startTimeWhere : ''
                )
                const idwhere = typeWhere ? (
                    nianduWhere ? nianduWhere + ` and fen_lei_id_ in (${typeWhere})` : ` where fen_lei_id_ in (${typeWhere})`
                ) : (
                    nianduWhere || ``
                )
                const sql = `select * FROM t_ywyxjlb jl  LEFT JOIN lh_bm_ry ry ON ry.ry_id  = jl.bian_zhi_ren_   ` + idwhere + ` order by bian_zhi_shi_jian desc`

                curdPost('sql', sql).then(response => {
                    const tableDatas = response.variables.data
                    if (tableDatas.length !== 0) {
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
                    } else {
                        ActionUtils.handleListData(this, [])
                        this.pagination.limit = 20
                        this.pagination.page = 1
                    }

                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }
        },
        // getParenthesesStr(text) {
        //         let result = ''
        //         if (!text) return result
        //         let regex = /\((.+?)\)/g;
        //         let options = text.match(regex)
        //         if (options) {
        //                 let option = options[0]
        //                 if (option) {
        //                         result = option.substring(1, option.length - 1)
        //                 }
        //                 if (options[1]) {
        //                         let yersOption = options[1]
        //                         if (yersOption) {
        //                                 result = result + '/' + yersOption.substring(1, yersOption.length - 1)
        //                         }
        //                 }
        //         }
        //         return result.split('/')
        // },
        /**
         * 获取格式化参数
         */
        getSearcFormData () {
            const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
            if (JSON.stringify(params) === '{}') {
                this.niandu = '' // 年度
                this.startTime = '' // 开始时间
                this.endTime = '' // 结束时间
            } else {
                this.niandu = params.nianDu ? params.nianDu : '' // 年度
                this.startTime = params.b ? params.b : '' // 开始时间
                this.endTime = params.i ? params.i : '' // 结束时间
            }
        },
        /**
         * 处理分页事件
         */
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

        /**
         * 查询
         */
        search () {
            this.pagination.limit = 20
            this.pagination.page = 1
            this.getSearcFormData()
            this.loadData()
        },
        /* 防止多次快速查询*/
        numbersClick () {
            this.isDisable = true
            setTimeout(() => {
                this.isDisable = false
            }, 600)
        },
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            const ids = selection.join(',')
            const deleteParams = {
                tableName: 't_ywyxjlb',
                paramWhere: { id_: ids }
            }
            switch (command) {
                case 'search':// 查询
                    ActionUtils.setFirstPagination(this.pagination)
                    this.search()
                    break
                    // case 'resetSearch':
                    //   this.typeId = ''
                    //   this.tableTitle = ''
                    //   this.search()
                    //   break
                case 'remove':
                    curdPost('delete', deleteParams).then(() => {
                        this.$message({
                            message: '删除成功！',
                            type: 'warning'
                        })
                        this.search()
                    })

                    break
                case 'add': // 添加
                    this.openTask('1072813170935988224')
                    break
                    // case 'edit': // 编辑
                    //   ActionUtils.selectedRecord(selection).then((id) => {
                    //     console.log('selection', selection)
                    //     let filterDatas = this.listData.filter(fil => {
                    //       return fil.id_ = fil
                    //     })
                    //     this.dialogFormVisible = true
                    //     // this.defId = '1072813170935988224'
                    //     this.pkValue = id

                    //     // console.log('id', id)
                    //     // console.log('filterDatas', filterDatas)

                    //     // this.addDataCont.nianDu = filterDatas[0].nian_du_
                    //     // this.addDataCont.biaoDanMingCheng = filterDatas[0].biao_dan_ming_che
                    //     // this.addDataCont.fuJian = filterDatas[0].biao_dan_ming_che
                    //     // this.addDataCont.shiWuShuoMing = filterDatas[0].shi_wu_shuo_ming_
                    //     // console.log('this.addDataCont', this.addDataCont)

                    //   }).catch(() => { })
                    //   break
                default:
                    break
            }
        },
        handleNodeClick (typeId, typeName, treeData) {
            this.tableTitle = typeName.name
            this.typeId = typeId
            this.treeData = treeData
            this.depth = typeName.depth
            this.loadData()
            // 判断是否存在下级菜单
            const state = this.treeData.filter(el => {
                return el.parentId === this.typeId
            })
            const pageName = this.$route.name

            if (state.length === 0 && pageName === 'wjkzgl-ywyxjlsc') {
                const chongfu = this.listConfig.toolbars.filter(el => {
                    return el.key === 'add'
                })
                if (chongfu.length === 0 && this.depth !== 0) {
                    this.listConfig.toolbars.push({ key: 'add' })
                }
            } else {
                this.listConfig.toolbars = this.listConfig.toolbars.filter(el => {
                    return el.key !== 'add'
                })
            }
        },
        handleExpandCollapse (isExpand) {
            this.width = isExpand ? 230 : 30
        }
    }
}
</script>
<style lang="scss" >
.js-custom-dialog {
    .el-dialog__body {
        height: calc(100vh) !important;
        margin: -9px !important;
        padding: 0px !important;
        overflow: hidden;
    }
    .el-dialog__header {
        padding: 0px;
    }
    .el-dialog__headerbtn i {
        font-size: 28px;
        font-weight: bold;
        background-color: #ffffff;
        border-radius: 8px;
        margin-top: -8px;
    }
}

.main-container .div_test {
    cursor: pointer;
}

.main-container .el-popover.popverClass {
    .div_content {
        .content_checkbox {
            .el-checkbox-group {
                display: flex;
                flex-direction: column;
                z-index: 999;
            }

            z-index: 999;
        }
        .content_butts {
            z-index: 999;
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            .el-button {
                padding: 7px 14px;
            }
        }
    }
}
</style>
