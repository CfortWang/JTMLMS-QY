<template>
  <ibps-layout ref="layout">
    <!-- 外部 -->
    <div slot="west">
      <div class="box">
        <p class="title">文件类型</p>
        <el-input placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
        <div class="treeDiv">
          <el-tree ref="tree"
                   :width="width"
                   :data="paramsTypeData"
                   :props="defaultProps"
                   @node-click="handleNodeClick"
                   :filter-node-method="filterNode"></el-tree>
        </div>
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
              <ibps-attachment :value="scope.row.wen_jian_id_"
                               readonly
                               allow-download
                               :download="false" />
            </template>
          </ibps-crud>
        </template>
      </ibps-container>

    </div>
  </ibps-layout>
</template>
<script>
import ActionUtils from '@/utils/action'
import { getFileType, getFileByUserId } from '@/api/permission/file'
import IbpsAttachment from '@/business/platform/file/attachment/selector'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

export default {
  components: {
    'ibps-attachment': IbpsAttachment
  },
  data() {
    return {
      show: '',
      rightsArr: ['join', 'delete'],
      rowHandle: true,
      width: 230,
      orgId: '',
      oldorgId: '',
      orgName: '',
      loading: false,
      paramsTypeData: [
        { id: '0', label: '技术类' },
        { id: '1', label: '管理类' },
        { id: '2', label: '参考文献' },
        { id: '3', label: '设备说明资料' },
        { id: '4', label: '伦理审查文件' },
        { id: '5', label: '其它' }
      ],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
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
          { prop: 'ban_ben_hao_', label: '实施时间', width: 120 },
          { prop: 'fa_bu_ri_qi_', label: '发放日期', width: 100, sortable: 'custom' },
          { prop: 'wen_jian_id_', label: '查阅', slotName: "wenjinachayue", width: 400 }
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
  mounted() {
    // this.loadNode()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    loadNode() {
      this.loading = true
    },
    refreshData() {
      console.log('11111111111111')

      this.tableData = []
      this.getDatas(this.getSearcFormData())
    },

    handleNodeClick(data) {
      this.oldorgId = data
      this.show = 'detail'
      if (this.oldorgId == data.id) {
        return
      } else {
        this.getDatas({
          fileType: this.paramsTypeData[data.id].label,
          userId: this.$store.getters.userInfo.employee.id,
          sorts: { 'wen_jian_bian_hao': 'desc' }
        })
      }
    },
    /**
    * 获取格式化参数
    */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}
      console.log('params', params)
      params['fileType'] = this.paramsTypeData[this.oldorgId.id].label
      params['userId'] = this.$store.getters.userInfo.employee.id
      params['sorts'] = this.sorts
      return params
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
      ActionUtils.setSorts(this.sorts, sort)
      this.getDatas(this.getSearcFormData())
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
    getDatas(sorts) {
      let wheres = ''
      if (sorts.fileCode) {
        wheres = wheres + ` and wj.wen_jian_bian_hao like '%${sorts.fileCode}%'`
      }

      if (sorts.fileType) {
        wheres = wheres + ` and wj.wen_jian_lie_xing = '${sorts.fileType}'`
      }
      if (sorts.fileName) {
        wheres = wheres + ` and wj.wen_jian_ming_che like '%${sorts.fileName}%'`
      }
      if (sorts.sorts) {
        if (JSON.stringify(sorts.sorts) !== "{}") {
          wheres = wheres + ` order by  ${Object.keys(sorts.sorts)}  ${Object.values(sorts.sorts)}`
        }
      }
      // 重复发放的文件，在权限表会存在重复的文件信息
      let sql = `select  wj.wen_jian_bian_hao,wj.wen_jian_ming_che,wj.ban_ben_hao_,qx.create_time_,wj.wen_jian_id_,qx.fa_bu_ri_qi_ FROM (
                     SELECT a.id_,a.create_by_,MAX(a.create_time_) create_time_ ,a.yong_hu_id_,a.wen_jian_id_,
                     a.fa_bu_ri_qi_,a.shou_quan_ FROM t_wjcysqb a  GROUP BY yong_hu_id_,wen_jian_id_
                 ) qx LEFT JOIN t_wjgl wj ON qx.wen_jian_id_=wj.wen_jian_id_ WHERE qx.shou_quan_='1' and qx.yong_hu_id_='${sorts.userId}' ${wheres}`

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
      })
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
