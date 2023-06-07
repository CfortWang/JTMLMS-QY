<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="人员预览"
    width="70%"
    top="10vh"
    class="user-preview"
    append-to-body
    @opened="getFormData"
    @close="closeDialog"
  >
    <div class="user-preview-content">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="预览参数" name="params">
            <el-form
              v-if="types.length > 0"
              ref="form"
              :model="form"
              :rules="rules"
              label-width="120px"
              @submit.native.prevent
            >
              <el-form-item v-if="types.includes('prev')" label="上一步执行人：" prop="prevUser">
                <ibps-employee-selector
                  v-model="form.prevUser"
                  placeholder="请选择上一步执行人"
                  :multiple="false"
                />
              </el-form-item>
              <el-form-item v-if="types.includes('start')" label="发起人：" prop="startUser">
                <ibps-employee-selector
                  v-model="form.startUser"
                  placeholder="请选择发起人"
                  :multiple="false"
                />
              </el-form-item>

            </el-form>
            <ibps-empty v-else desc="暂无参数" />
          </el-tab-pane>
          <el-tab-pane label="查询结果" name="result">
            <ibps-crud
              ref="crud"
              :height="tableHeight"
              :selection-row="false"
              :data="resultData"
              :pk-key="pkKey"
              :columns="listConfig.columns"
              :pagination="pagination"
              :loading="loading"
              @sort-change="handleSortChange"
              @pagination-change="handlePaginationChange"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="actions"
        @action-event="handleActionEvent"
      />
    </div>

  </el-dialog>
</template>

<script>
import { previewCondition } from '@/api/platform/bpmn/bpmNodeDef'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'

export default {
  components: {
    IbpsEmployeeSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '400px'
    },
    data: {
      type: Array
    }
  },
  data() {
    return {
      types: [],
      formName: 'form',
      form: {
        prevUser: '',
        startUser: ''
      },
      pagination: {},
      pkKey: 'id',
      loading: false,
      rules: {
        prevUser: [{ required: true, message: '请选择上一步执行人', trigger: 'change' }],
        startUser: [{ required: true, message: '请选择发起人', trigger: 'change' }]
      },
      resultData: [],
      listData: [],
      listConfig: {
        columns: [
          { prop: 'fullname', label: '姓名' },
          { prop: 'account', label: '账号' }
        ]
      },
      activeName: 'params',
      dialogVisible: this.visible,
      actions: [
        { key: 'preview', icon: 'ibps-icon-eye', label: '预览' },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    tableHeight() {
      const h = this.height.substr(0, this.height.length - 2)
      return parseInt(h) - 10
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 加载数据
     */
    loadListData() {
      this.loading = true

      const conditionArray = [{
        calcs: this.data
      }]
      const formParams = ActionUtils.formatParams({
        conditionArray: JSON.stringify(conditionArray),
        variables: JSON.stringify(this.form)
      })
      const curPagination = JSON.parse(JSON.stringify(this.pagination))
      previewCondition(formParams).then(response => {
        ActionUtils.handleListData(this, response.data)
        ActionUtils.setPagination(this.pagination, curPagination)

        this.pagination['totalCount'] = this.listData.length
        const pageSize = this.pagination.limit * (this.pagination.page - 1)
        this.resultData = this.listData.slice(pageSize, pageSize + this.pagination.limit)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 处理分页事件
     */
    handlePaginationChange(page) {
      ActionUtils.setPagination(this.pagination, page)
      this.loadListData()
    },
    /**
     * 处理排序
     */
    handleSortChange(sort) {
      ActionUtils.setSorts(this.sorts, sort)
      this.loadListData()
    },
    handleClick(tab, event) {
      // 验证必填项
      if (tab.name === 'result') {
        this.handlePreview(tab.name)
      }
    },
    handleActionEvent({ key }) {
      switch (key) {
        case 'preview':
          this.handlePreview(this.activeName)
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    handlePreview(curName) {
      if (this.$refs[this.formName]) {
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            this.activeName = 'result'
            this.loadListData()
          } else {
            setTimeout(() => {
              this.activeName = 'params'
            }, 10)
            ActionUtils.saveErrorMessage()
          }
        })
      } else {
        this.activeName = 'result'
        this.loadListData()
      }
    },
    closeDialog() {
      this.$emit('close', false)
    },
    getFormData() {
      const types = []
      this.data.forEach(condition => {
        if (condition.source === 'prev') {
          if (!types.includes('prev')) {
            types.push('prev')
          }
        } else if (condition.source === 'start') {
          if (!types.includes('start')) {
            types.push('start')
          }
        } else if (condition.source === 'var') {
          if (!types.includes('var')) {
            types.push('var')
          }
          // var varVal = condition['var']
          // if (typeof varVal === 'string') {
          //   // varVal = eval('(' + condition['var'] + ')')
          // }
        }
      })
      this.types = types
      if (this.$utils.isEmpty(this.types)) {
        this.handlePreview()
      } else {
        this.activeName = 'params'
      }
    }
  }
}
</script>

<style lang="scss">
.user-preview{
.user-preview-content{
  height: 60vh;

}
}
</style>
