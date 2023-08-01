<template>
  <div class="main-container">
    <!-- 外部 -->
    <div slot="west">
      <div class="box">
        <ibps-tree :width="width"
                   :height="height"
                   :data="treeData"
                   @node-click="handleNodeClick"
                   @expand-collapse="handleExpandCollapse"
                   title="分类管理">
        </ibps-tree>
      </div>
      <ibps-container :margin-left="width + 'px'"
                      class="page">
        <el-alert v-if="!show"
                  :closable="false"
                  title="请选择左边菜单右键进行操作！"
                  type="warning"
                  show-icon
                  style="height:50px;" />
        <template v-else>
          <ibps-crud key="istree"
                     ref="crud"
                     :data="listData"
                     :toolbars="listConfig.toolbars"
                     :search-form="listConfig.searchForm"
                     :pk-key="pkKey"
                     :columns="listConfig.columns"
                     :loading="loading"
                     :pagination="pagination"
                     @sort-change="handleSortChange"
                     @action-event="handleAction"
                     @pagination-change="handlePaginationChange">
            <template slot="wenjinachayue"
                      slot-scope="scope">
              <ibps-attachment :value="scope.row.wen_jian_fu_jian_"
                               readonly
                               allow-download
                               :download="false" />
            </template>
          </ibps-crud>
        </template>
      </ibps-container>

    </div>

  </div>
</template>
<script>
import ActionUtils from '@/utils/action'
import { getFileType, getFileByUserId } from '@/api/permission/file'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import FixHeight from '@/mixins/height'
import { findTreeData } from '@/api/platform/cat/type'
export default {
  components: {
    'ibps-attachment': IbpsAttachment
  },
  mixins: [FixHeight],
  data() {
    return {
      treeData: [],
      show: '',
      rightsArr: ['join', 'delete'],
      rowHandle: true,
      width: 230,
      orgId: '',
      oldorgId: '',
      orgName: '',
      height: document.clientHeight,
      loading: false,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      loading: false,
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
      listTreeData: [],
      listConfig: {
        // 工具栏
        toolbars: [
          { key: 'search' }
        ],
        // 查询条件
        searchForm: {
          forms: [
            { prop: 'fileCode', label: '文件编号' },
            { prop: 'fileName', label: '文件名称' },
            // { prop: 'deptName', label: '部门' },
          ]
        },
        // 表格字段配置
        columns: [
          // { prop: 'zi_duan_yi_', label: '部门' },
          { prop: 'wen_jian_bian_hao', label: '文件编号', sortable: 'custom', width: 180 },
          { prop: 'wen_jian_ming_che', label: '文件名称', width: 400 },
          { prop: 'ban_ben_', label: '版本', width: 120 },
          { prop: 'fa_bu_ri_qi_', label: '发放日期', width: 100, sortable: 'custom' },
          { prop: 'wen_jian_fu_jian_', label: '查阅', slotName: "wenjinachayue", width: 400 }
        ]
      },
      listOptions: {
        border: true,
        stripe: true
      },
      pagination: {
        limit: 20, page: 1
      },
      sorts: {},
      sqlWhere: {}
      // testData: [{
      //     zi_duan_yi_: '1',
      //     wen_jian_bian_hao: '2',
      //     wen_jian_ming_che: '3',
      //     ban_ben_hao_: '4',
      //     fa_bu_ri_qi_: '5',
      //     wen_jian_id_: '880481571788816384'
      // }]
    }
  },
  created() {
    this.loadTreeData()
  },
  mounted() {
    // this.loadNode()
  },
  methods: {
    // 加载具体分类数据
    loadTreeData(isEdit) {
      findTreeData({ 'categoryKey': 'FILE_TYPE' }).then(response => {
        const data = response.data
        this.treeData = data
        this.show = isEdit
      })
    },
    handleExpandCollapse(isExpand, readonly = false) {
      this.width = isExpand ? 200 : 50
    },

    loadNode() {
      this.loading = true
    },
    getDatas() {
      const { fileCode, fileType, fileName, sorts, userId } = this.sqlWhere
      this.listData = []
      let wheres = ''
      if (fileCode) {
        wheres = wheres + ` and wj.wen_jian_bian_hao like '%${fileCode}%'`
      }
      if (fileName) {
        wheres = wheres + ` and wj.wen_jian_ming_che like '%${fileName}%'`
      }
      if (fileType) {
        wheres = wheres + ` and FIND_IN_SET (wj.xi_lei_id_,'${fileType}')`
      }

      if (sorts) {
        if (JSON.stringify(sorts) !== "{}") {
          wheres = wheres + ` order by  ${Object.keys(sorts)}  ${Object.values(sorts)}`
        }
      }
      // 重复发放的文件，在权限表会存在重复的文件信息
      let sql = `select  wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_,qx.create_time_,wj.wen_jian_fu_jian_,qx.fa_bu_ri_qi_ FROM (SELECT a.id_,a.create_by_,MAX(a.create_time_) create_time_ ,a.yong_hu_id_,a.wen_jian_id_,a.fa_bu_ri_qi_,a.shou_quan_ FROM t_wjcysqb a  GROUP BY yong_hu_id_,wen_jian_id_) qx LEFT JOIN t_wjxxb wj ON qx.wen_jian_id_=wj.wen_jian_fu_jian_ WHERE qx.shou_quan_='1' and qx.yong_hu_id_='${userId}' ${wheres}`
      curdPost('sql', sql).then(res => {
        let tableDatas = res.variables.data
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
    refreshData() {
      this.listData = []
      this.getDatas(this.getSearcFormData())
    },
    handleNodeClick(data) {
      this.show = 'detail'
      let fileTypes = []
      if (this.oldorgId == data.id) {
        return
      }
      if (data.children == undefined) {
        fileTypes.push(data.id)
      } else {
        const getTail = item => item.children && item.children.length > 0 ? item.children.map(m => getTail(m)) : [item]
        const result = _.flattenDeep(data.children.map(m => getTail(m)))
        for (var i of result) {
          fileTypes.push(i.id)
        }
      }
      this.oldorgId = data.id
      this.sqlWhere = {
        fileType: fileTypes.join(','),
        userId: this.$store.getters.userInfo.employee.id,
        sorts: { 'wen_jian_bian_hao': 'desc' }
      }
      this.getDatas()
    },

    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      if (params.fileCode) {
        this.sqlWhere.fileCode = params.fileCode
      } else {
        this.sqlWhere.fileCode = ''
      }
      if (params.fileName) {
        this.sqlWhere.fileName = params.fileName
      }else{
        this.sqlWhere.fileName = ''
      }
      this.getDatas()
    },
    /**
 * 处理按钮事件
 */
    handleAction(command, position, selection, data) {
      switch (command) {
        case 'search':// 查询
          this.refreshData()
          break
        default:
          break
      }
    },
    /**
    * 处理排序
    */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sqlWhere.sorts, sort)
      this.getDatas()
    },
    // 处理分页事件
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.bianlistData.pageResult.limit = page.limit
      this.bianlistData.pageResult.page = page.page
      let filterDatas = []
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
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
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
  