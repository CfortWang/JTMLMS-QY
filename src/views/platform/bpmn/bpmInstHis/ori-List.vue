<template>
  <div class="main-container">


    <div slot="west">
      <ibps-type-tree :width="width" :height="height" title="记录分类" category-key="FLOW_TYPE"
        :hasPermission="true" @node-click="handleNodeClick" @expand-collapse="handleExpandCollapse" />
    </div>
    <ibps-crud ref="crud" :style="{ marginLeft: width + 'px' }" :height="height" :data="listData"
      :toolbars="listConfig.toolbars" :search-form="listConfig.searchForm" :pk-key="pkKey" :displayField="tableTitle"
      :columns="listConfig.columns" :row-handle="listConfig.rowHandle" :pagination="pagination" :loading="loading"
      :index-row="false" :selection-row="false" @action-event="handleAction" @sort-change="handleSortChange"
      @column-link-click="handleLinkClick" @pagination-change="handlePaginationChange">

      <template slot="selectCont" slot-scope="scope">
        <el-popover :ref="'popover2-' + scope.row.id" placement="bottom" width="250" popper-class="popverClass"
          trigger="click" @show="getReportAndFile(scope.row)">
          <!-- 触发事件 --> <!-- @click="handleAction('detail',null,null,scope.row)"-->
          <div class="div_test el-icon-s-order" slot="reference">查阅记录</div>
          <!-- 弹框内容 -->
          <div class="div_content">
            <!-- 获取所有输出报告-->
            <div class="content_butts" v-if="currReportCont.report.length > 0" v-for="(item, i) in currReportCont.report">
              <span style="cursor: pointer;" @click="clickCont(currReportCont, i)">
                <i class="el-icon-tickets" style="font-size: 18px;" />
                <!-- {{item.split('/')[1].split('.')[0].split(' ')[1]}} -->
                {{ item.slice(-item.split("").reverse().join("").indexOf(' '),
                    -item.split("").reverse().join("").indexOf('.') - 1)
                }}
              </span>
              <br>
            </div>

            <div class="content_butts" v-if="currReportCont.file">
              <ibps-attachment v-model="fileId" placeholder="请选择" :download="true" :readonly="true" accept="*"
                :multiple="true" upload-type="attachment" store="id" media-type="" media="" style="width:100%;" />
            </div>


          </div>
        </el-popover>
      </template>

    </ibps-crud>

    <bpmn-formrender :visible="dialogFormVisible" :instance-id="instanceId"
      @close="visible => dialogFormVisible = visible" />

    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :top="'3vh'" :width="'90%'"
      class="js-custom-dialog" append-to-body :fullscreen="false" :visible.sync="visible">

      <iframe :src="srcUrl" :height="'100%'" :width="'100%'" frameborder="0" scrolling="no" />

    </el-dialog>

  </div>

</template>

<script>
import { queryPageList } from '@/api/platform/bpmn/bpmInstHis'
import ActionUtils from '@/utils/action'
import IbpsTypeTree from '@/business/platform/cat/type/tree'
import FixHeight from '@/mixins/height'
import { searchOptions, resultTypeOptions, statusOptions } from './constants'
import BpmnFormrender from '@/business/platform/bpmn/form/dialog'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js' //增删改查规则
import IbpsAttachment from '@/business/platform/file/attachment/selector'
export default {
  components: {
    IbpsTypeTree,
    BpmnFormrender,
    'ibps-attachment': IbpsAttachment
  },
  mixins: [FixHeight],
  data() {
    return {
      width: 200,
      dialogFormVisible: false, // 弹窗
      instanceId: '', // 编辑dialog需要使用
      pkKey: 'id', // 主键  如果主键不是pk需要传主键
      tableTitle: '',
      typeId: '',
      srcUrl: '', //报表字段
      fileId: '',//文件字段
      isDisable: false, //判断多次点击
      forClick: '',//判断是否重复点击
      visible: false,
      currReportCont: {},
      title: '',
      loading: true,
      height: document.clientHeight,
      reportAll: "",
      listData: [],
      pagination: {},
      sorts: {},
      listConfig: {
        toolbars: [
          { key: 'search' },
          { key: 'resetSearch' }
        ],
        searchForm: {
          forms: [
            { prop: 'Q^subject_^SL', label: '关键字搜索:', width: 145 },
            /*  { prop: 'Q^proc_def_name_^SL', label: '任务名称' }, */
            // {
            //   prop: ['Q^create_Time_^DL', 'Q^create_Time_^DG'],
            //   label: '完成年度:',
            //   fieldType: 'daterange',
            // },
            /*  {
                prop: 'Q^status_^S',
                label: '任务状态',
                fieldType: 'select',
                options: searchOptions
              } */
          ]
        },
        // 表格字段配置
        columns: [
          /* { prop: 'subject', label: '任务标题', link: 'dialog', width: 250 }, */
          { prop: 'tYear', label: 'ori-List年份', width: 58 },
          { prop: 'tDept', label: '编制部门', width: 80 },
          { prop: 'procDefName', label: '表单名称' },
          { prop: 'tUser', label: '编制人', width: 80 },
          { prop: 'endTime', label: '完成时间', sortable: 'custom', dateFormat: 'yyyy-MM-dd', width: 150 },
        ],
        rowHandle: {
          actions: [/* {
            key: 'detail',label:"内容及附件"
          } */],
          effect: 'display',
          width: '100'//固定按钮
        }
      }
    }
  },
  created() {
    this.loadData()
    this.getConfig() //获取配置的报表
    let roleArr = this.$store.getters.userInfo.role
    console.log('这是通用页面')
    for (let i = 0; i < roleArr.length; i++) {
      if (roleArr[i].alias = "xtgljs") {
        this.listConfig.toolbars.push({ key: 'remove' })
        return;
      }
    }
  },
  methods: {
    //获取配置报表数据
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
    // 加载数据
    loadData() {
      this.loading = true
      queryPageList(this.getSearcFormData()).then(response => {
        let data = response.data.dataResult
        for (let i in data) {
          let dept, user, tName, tYear
          let arr = this.getParenthesesStr(data[i].subject)
          if (arr.length == 4) { //如果是年度计划， 标题编辑中取年份， 去除默认给与的年份
            data[i]['tYear'] = arr[0]
            data[i]['tDept'] = arr[2]
            data[i]['tUser'] = arr[3]
          } else if (arr.length > 1) {
            data[i]['tYear'] = arr[0]
            data[i]['tDept'] = arr[1]
            data[i]['tUser'] = arr[2]
          }
        }
        ActionUtils.handleListData(this, response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getParenthesesStr(text) {
      let result = ''
      if (!text) return result
      let regex = /\((.+?)\)/g;
      let options = text.match(regex)
      if (options) {
        let option = options[0]
        if (option) {
          result = option.substring(1, option.length - 1)
        }
        if (options[1]) {
          let yersOption = options[1]
          if (yersOption) {
            result = result + '/' + yersOption.substring(1, yersOption.length - 1)
          }
        }
      }
      return result.split('/')
    },
    /**
     * 获取格式化参数
     */
    getSearcFormData() {
      const params = this.$refs['crud'] ? this.$refs['crud'].getSearcFormData() : {}

      if (this.$utils.isNotEmpty(this.typeId)) {
        params['Q^TYPE_ID_^S'] = this.typeId
      }
      params['Q^status_^S'] = "end"
      let cont = ActionUtils.formatParams(
        params,
        this.pagination,
        this.sorts)

      cont.parameters.push({
        "parameters": [
          {
            "parameters": [
              {
                "key": "Q^proc_Def_Key_^NE",
                "value": "Process_08hbmhs",
                "param": "name"
              }
            ]
          },
          {
            "parameters": [
              {
                "key": "Q^proc_Def_Key_^NE",
                "value": "Process_0xlaidt",
                "param": "name1"
              }
            ]
          },
          {
            "parameters": [
              {
                "key": "Q^proc_Def_Key_^NE",
                "value": "Process_0ocg0f1",
                "param": "name2"
              }
            ]
          }
        ]
      })
      return cont

    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadData()
    },
    handleLinkClick(data, columns) {
      this.handleEdit(data.id)
    },
    /**
     * 查询
     */
    search() {
      this.loadData()
    },
    /* 防止多次快速查询*/
    numbersClick() {
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 600)
    },
    /*1 遍历，返回附件和报告*/
    selectRetrunData(key) {
      for (let i = 0; i < this.reportAll.length; i++) {
        let data = {}
        if (key.procDefKey === this.reportAll[i].liu_cheng_xuan_ze) {
          if (this.reportAll[i].bao_biao_lu_jing_) {
            data['report'] = this.reportAll[i].bao_biao_lu_jing_.split(",")
          }
          data['file'] = this.reportAll[i].fu_jian_nei_rong_
          data['formId'] = key.bizKey
          data['mysql'] = this.reportAll[i].shi_fou_zi_biao_
          return data
        }
      }

    },

    /* 2、打开内容与附件，获取相关报告与附件内容*/
    getReportAndFile(data) {
      if (this.forClick == data.id || this.isDisable) { //判断，是否重复点击  是否多次高速点击
        if (this.isDisable) this.$message.error('请勿快速点击！');
        return
      }
      this.numbersClick()
      this.forClick = data.id

      this.fileId = ''
      this.currReportCont = {}
      if (!data.procDefKey) return

      let cont = this.selectRetrunData(data)
      if (!cont) return

      this.currReportCont = cont
      if (cont.file && cont.mysql) { //拥有文件的表单，查询对应文件
        this.getfIle(cont)
      }
    },
    /* 3打开报告 */
    clickCont(cont, i) {
      this.srcUrl = this.$reportPash.replace("show", "pdf") + cont.report[i] + '&id_=' + cont.formId
      this.visible = true
    },
    /*3 获取文件内容， 以表名+ id 去获取对应参数*/
    getfIle(cont) {
      curdPost('select', this.packNameWhere(cont.mysql, { 'id_': cont.formId })).then(response => {
        this.fileId = response.variables.data[0][cont.file]
      })
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
        case 'resetSearch':
          this.typeId = ''
          this.tableTitle = ''
          this.search()
          break
        case 'detail':// 明细
          ActionUtils.selectedRecord(selection).then((id) => {
            this.handleEdit(id)
            this.title = '信息'
          }).catch(() => { })
          break
        default:
          break
      }
    },

    handleNodeClick(typeId, typeName) {
      this.tableTitle = typeName.name
      this.typeId = typeId
      this.loadData()
    },
    handleExpandCollapse(isExpand) {
      this.width = isExpand ? 230 : 30
    },
    /**
     * 处理编辑
     */
    handleEdit(id = '') {
      this.instanceId = id
      this.dialogFormVisible = true
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
    background-color: #FFFFFF;
    border-radius: 8px;
    margin-top: -8px;
  }
}
</style>
<style>
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
