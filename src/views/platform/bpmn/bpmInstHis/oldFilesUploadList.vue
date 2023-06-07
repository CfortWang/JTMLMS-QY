<template>
  <div class="main-container">

    <div slot="west">
      <ibps-type-tree :width="width"
                      :height="height"
                      title="记录分类"
                      :location="location"
                      category-key="FLOW_TYPE"
                      @node-click="handleNodeClick"
                      @expand-collapse="handleExpandCollapse" />
    </div>
    <ibps-crud ref="crud"
               :style="{ marginLeft: width + 'px' }"
               :height="height"
               :data="listData"
               :toolbars="listConfig.toolbars"
               :search-form="listConfig.searchForm"
               :pk-key="pkKey"
               :displayField="tableTitle"
               :columns="listConfig.columns"
               :loading="loading"
               :index-row="false"
               :pagination="pagination"
               :selection-row="selection"
               @action-event="handleAction"
               @pagination-change="handlePaginationChange">

      <template slot="wenjinachayue"
                slot-scope="scope">
        <ibps-attachment :value="scope.row.fu_jian_"
                         readonly
                         allow-download
                         :download="false"
                         :multiple=true />
      </template>
    </ibps-crud>
    <bpmn-formrender :visible="dialogFormVisible"
                     :template-key="templateKey"
                     :def-id="defId"
                     :pk-value="pkValue"
                     :form-key="formKey"
                     @callback=""
                     :addDataCont="addDataCont"
                     @close="visible => dialogFormVisible = visible" />``

    <el-dialog :close-on-click-modal="false"
               :close-on-press-escape="false"
               :top="'3vh'"
               :width="'90%'"
               class="js-custom-dialog"
               append-to-body
               :fullscreen="false"
               :visible.sync="visible">
      <iframe :src="srcUrl"
              :height="'100%'"
              :width="'100%'"
              frameborder="0"
              scrolling="no" />
    </el-dialog>

  </div>

</template>

<script>
import ActionUtils from '@/utils/action'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import FixHeight from '@/mixins/height'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js' //增删改查规则
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
  data() {
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
      srcUrl: '', //报表字段
      fuJian: '',//文件字段
      isDisable: false, //判断多次点击
      forClick: '',//判断是否重复点击
      visible: false,
      currReportCont: {},
      title: '',
      loading: true,
      height: document.clientHeight,
      reportAll: [],
      listData: [],
      pagination: { limit: 0, page: 0, totalCount: 0, totalPages: 0 },
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
          { key: 'search' },
          // { key: 'add' },
          // { key: 'detail' },
          // { key: 'resetSearch' }
        ],
        searchForm: {
          forms: [
            { prop: 'nianDu', label: '年度:', width: 50 },
            { prop: 'bianZhiShiJian', label: '上传时间:', fieldType: 'daterange', width: 225 },
          ]
        },
        // 表格字段配置
        columns: [
          { prop: 'fen_lei_', label: '记录表单分类', width: 120 },
          { prop: 'biao_dan_ming_che', label: '表单名称', width: 300 },
          { prop: 'nian_du_', label: '年度', width: 120 },
          { prop: 'bian_zhi_shi_jian', label: '上传时间', width: 150 },
          { prop: 'bm_name', label: '上传部门', width: 120 },
          { prop: 'ry_name', label: '上传人', width: 120 },
          { prop: 'fu_jian_', label: '附件', slotName: "wenjinachayue", width: 300 }
        ],
      }
    }
  },
  created() {
    this.loadData()
    // this.getConfig() //获取配置的报表
    let roleArr = this.$store.getters.userInfo.role
    let pageName = this.$route.name
    for (let i = 0; i < roleArr.length; i++) {
      if (roleArr[i].name == "系统管理角色" && pageName == 'wjkzgl-ywyxjlsc') {
        this.listConfig.toolbars.push({ key: 'remove' })
        // this.listConfig.toolbars.push({ key: 'edit' })
        this.selection = true
        return;
      }
    }
  },
  methods: {
    /*获取配置报表数据*/
    getConfig() {
      curdPost('select', this.packNameWhere('t_lcidglbdbb', { '1': '1' })).then(response => {
        this.reportAll = response.variables.data
      })
    },
    /* 封装表名与条件*/
    packNameWhere(name, where) {
      let cont = {}
      cont['tableName'] = name
      cont['paramWhere'] = where
      return cont
    },
    openTask(id) {
      this.dialogFormVisible = true
      this.defId = id
      this.addDataCont = { fenLei: this.tableTitle, fenLeiId: this.typeId, biaoDanMingCheng: '1111' }
    },
    // 加载数据
    loadData() {
      this.loading = true
      let typeWheres = []
      let typeWhere = ''
      let startTimeWhere = this.startTime ? (
        this.endTime ? ` bian_zhi_shi_jian between '${this.startTime}' and '${this.endTime}'` : ` bian_zhi_shi_jian between '${this.startTime}' and '2099-01-01'`
      ) : (
        this.endTime ? ` bian_zhi_shi_jian between '1949-10-01' and '${this.endTime}'` : ``
      )

      // 第一级目录
      if (this.depth == '0') {

        let nianduWhere = this.niandu ? (
          startTimeWhere ? ` where  nian_du_ = '${this.niandu}' and` + startTimeWhere : ` where  nian_du_ = '${this.niandu}'`
        ) : (
          startTimeWhere ? ' where ' + startTimeWhere : ''
        )
        let sql = 'select * FROM t_ywyxjlb jl  LEFT JOIN lh_bm_ry ry ON ry.ry_id  = jl.bian_zhi_ren_' + nianduWhere + ' order by bian_zhi_shi_jian desc'
        curdPost('sql', sql).then(response => {
          this.listData = this.handlePage(response.variables.data, this.paginations, this.page)

          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        // 筛选出下级目录
        let erji = this.treeData.filter(el => {
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

        let nianduWhere = this.niandu ? (
          startTimeWhere ? ` where  nian_du_ = '${this.niandu}' and` + startTimeWhere : ` where  nian_du_ = '${this.niandu}'`
        ) : (
          startTimeWhere ? ' where ' + startTimeWhere : ''
        )
        let idwhere = typeWhere ? (
          nianduWhere ? nianduWhere + ` and fen_lei_id_ in (${typeWhere})` : ` where fen_lei_id_ in (${typeWhere})`
        ) : (
          nianduWhere ? nianduWhere : ``
        )
        let sql = `select * FROM t_ywyxjlb jl  LEFT JOIN lh_bm_ry ry ON ry.ry_id  = jl.bian_zhi_ren_   ` + idwhere + ` order by bian_zhi_shi_jian desc`

        curdPost('sql', sql).then(response => {
          this.listData = this.handlePage(response.variables.data, this.paginations, this.page)
          this.pagination['limit'] = this.paginations
          this.pagination['page'] = this.page
          this.pagination['totalCount'] = this.handlePage(response.variables.data, this.paginations, this.page).length
          this.pagination['totalPages'] = Math.ceil(this.handlePage(response.variables.data, this.paginations, this.page).length / this.paginations);
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
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      this.niandu = params.nianDu ? params.nianDu : '' // 年度
      this.startTime = params.b ? params.b : '' // 开始时间
      this.endTime = params.i ? params.i : '' // 结束时间
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      this.paginations = page.limit
      this.page = page.page
      this.loadData()
    },

    /* 分页数据处理 */
    handlePage(data, pagination, page) {
      let handleDatas = []
      if (data.length !== 0) {
        for (let i = pagination * page - pagination; i < pagination * page - 1; i++) {
          if (data[i]) {
            handleDatas.push(data[i])
            continue;
          } else {
            break;
          }
        }
        return handleDatas
      } else {
        return []
      }
    },
    /**
     * 查询
     */
    search() {
      this.getSearcFormData()
      this.loadData()

    },
    /* 防止多次快速查询*/
    numbersClick() {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 600)
    },

    /**
     * 处理按钮事件
     */
    handleAction(command, position, selection, data) {
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
          let str = ""
          selection.forEach((item, index) => {
            if (index == 0) {
              str += item
            } else {
              str += "," + item
            }
          })
          let data = {}
          data['tableName'] = "t_ywyxjlb"
          data['paramWhere'] = "{id_:'" + str + "'}"
          let this_ = this
          curdPost('batchDelete', data).then(response => {
            this_.$message({
              message: '删除成功！',
              type: 'warning'
            })
            this.search()
          })

          break
        case 'add': // 添加
          this.openTask("1072813170935988224")
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

    handleNodeClick(typeId, typeName, treeData) {
      this.tableTitle = typeName.name
      this.typeId = typeId
      this.treeData = treeData
      this.depth = typeName.depth
      this.loadData()
      // 判断是否存在下级菜单
      let state = this.treeData.filter(el => {
        return el.parentId === this.typeId
      })
      let pageName = this.$route.name

      if (state.length == 0 && pageName == 'wjkzgl-ywyxjlsc') {
        let chongfu = this.listConfig.toolbars.filter(el => {
          return el.key === 'add'
        })
        if (chongfu.length == 0 && this.depth !== 0) {
          this.listConfig.toolbars.push({ key: 'add' })
        }
      } else {
        this.listConfig.toolbars = this.listConfig.toolbars.filter(el => {
          return el.key !== 'add'
        })
      }
    },
    handleExpandCollapse(isExpand) {
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
