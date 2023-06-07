<template>
  <div class="bpmn-user-setting">
    <fieldset class="user-setting-border">
      <legend><span class="ibps-p-5">人员设置</span></legend>
      <div class="user-setting-button">
        <el-button type="primary" icon="ibps-icon-add" @click="addUser">添加</el-button>
        <el-button type="danger" icon="ibps-icon-delete" @click="removeUser">删除</el-button>
        <el-button type="info" icon="ibps-icon-eye" @click="previewData">预览</el-button>
      </div>
      <div class="user-form">
        <el-table
          ref="userTable"
          :data="userList"
          border
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column width="200px" align="center" prop="pluginType" label="用户类型">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.pluginType"
                placeholder="请选择"
                @change="value =>{
                  changeUserType(value,scope.$index)
                }"
              >
                <el-option
                  v-for="item in pluginTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="descText" label="用户来自">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.description"
                disabled
                type="textarea"
                :rows="2"
                placeholder="请选择"
              />
              <el-button
                v-if="hasSelect(scope.row.pluginType)"
                type="primary"
                @click="chooseUserForm(scope.row,scope.$index)"
              >选择</el-button>
            </template>
          </el-table-column>
          <el-table-column width="120px" align="center" prop="extract" label="抽取用户">
            <template slot-scope="scope">
              <el-select v-model="scope.row.extract" placeholder="请选择">
                <el-option
                  v-for="item in extractOptins"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="center" prop="logicCal" label="运算类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.logicCal" placeholder="请选择">
                <el-option
                  v-for="item in logicCalOptions "
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="80px" label="管理">
            <template slot-scope="scope">
              <el-button type="danger" size="small" plain @click="removeRowUser(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--用户窗口-->
      <user-dialog
        :visible="userDialogVisible"
        :user-type="userType"
        :data="editData"
        :title="userTypeTitle"
        @close="() => userDialogVisible = false"
        @callback="handleData"
      />
      <!--用户预览-->
      <user-preview-dialog
        :visible="previewVisible"
        :data="userList"
        @close="visible=>previewVisible=visible"
      />
    </fieldset>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserPreviewDialog from './user-preview-dialog'
import UserDialog from './user-dialog'

export default {
  components: {
    UserDialog,
    UserPreviewDialog
  },
  props: {
    value: Array,
    pluginTypeOptions: Array,
    logicCalOptions: Array,
    extractOptins: Array
  },
  data() {
    return {
      defaultData: {
        pluginType: 'cusers',
        source: '',
        description: '',
        extract: 'extract',
        logicCal: 'or'
      },
      userChoose: true, // 表单用户来自选择按钮
      userType: '',
      editData: {},
      editIndex: -1,
      previewVisible: false,
      checked: '',
      userDialogVisible: false, // 规则
      multipleSelection: [] // 多选表格数据
    }
  },
  computed: {
    ...mapState({
      curNode: state => state.ibps.bpmn.curNode
    }),
    userList: {
      get() {
        return this.value || []
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    userTypeTitle() {
      return this.userType && this.pluginTypeMap ? this.pluginTypeMap[this.userType].label : ''
    },
    pluginTypeMap() {
      const pluginTypeMap = {}
      this.pluginTypeOptions.forEach(item => {
        pluginTypeMap[item.value] = item
      })
      return pluginTypeMap
    },
    extractDisabled() {
      if (this.curNode.nodeType === 'signTask') {
        return true
      }
      return false
    }
  },
  beforeDestroy() {
    this.editData = null
  },
  methods: {
    // 添加人员
    addUser() {
      const data = JSON.parse(JSON.stringify(this.defaultData))
      if (this.curNode && this.curNode.nodeType === 'signTask') {
        data.extract = 'extract'
      }
      this.userList.push(data)
    },
    // 删除人员
    removeUser() {
      if (this.multipleSelection.length === 0) {
        this.$message.closeAll()
        this.$message({
          message: '请选择记录',
          type: 'warning'
        })
        return
      }
      this.multipleSelection.forEach((item) => {
        this.userList.splice(item.index, 1)
      })
    },
    // 删除人员[行]
    removeRowUser(index) {
      this.userList.splice(index, 1)
    },
    // 改变用户类型
    changeUserType(type, index) {
      this.userList[index].source = ''
      this.userList[index].description = this.pluginTypeMap[type].descText || ''
      const propertys = ['pluginType', 'source', 'description', 'extract', 'logicCal']
      for (const key in this.userList[index]) {
        if (propertys.indexOf(key) < 0) {
          this.userList[index][key] = null
        }
      }
    },
    // 选择用户来自
    chooseUserForm(data, index) {
      this.userType = data.pluginType
      this.editData = data
      this.editIndex = index
      this.userDialogVisible = true
    },
    hasSelect(type) {
      return !this.pluginTypeMap[type].noSelect
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.userTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.userTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleData(data) {
      const userList = JSON.parse(JSON.stringify(this.userList))
      const userData = JSON.parse(JSON.stringify(data))
      userList[this.editIndex] = userData
      this.$emit('input', userList)
    },
    previewData() {
      if (this.userList.length < 1) {
        this.$message.closeAll()
        this.$message({
          message: '请添加人员配置项',
          type: 'warning'
        })
        return
      }
      for (var i = 0; i < this.userList.length; i++) {
        // 如果 配置条件为空 则return
        if (!this.userList[i]['description']) {
          this.$message.closeAll()
          this.$message({
            message: `第${i + 1}行人员配置无效,请检查。`,
            type: 'warning'
          })
          return
        }
      }
      this.previewVisible = true
    }
  }
}
</script>

<style lang="scss">
.bpmn-user-setting  {
  .user-setting-border{
    border: 1px groove #ddd !important;
    padding: 0 0.4em 1.4em 0.4em !important;
  }
  legend {
    font-size: 18px!important;
  }
  .user-setting-button{
    margin-top:10px;
    text-align: right;
  }
  .user-form{
    margin-top : 20px;
    .el-table .cell{
      display: flex;
    }
  }
}
</style>
