<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    custom-class="bpmn-auth-dialog is-fullscreen"
    top="0"
    width="80%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="bpmAuthForm"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="bpmAuth"
      :rules="rules"
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-form-item label="授权名称:" prop="name">
        <el-input v-if="!readonly" v-model="bpmAuth.name" />
        <span v-else>{{ bpmAuth.name }}</span>
      </el-form-item>
      <el-form-item prop="type">
        <span slot="label">
          权限类型
          <el-tooltip
            class="item"
            effect="light"
            placement="bottom"
          >
            <div slot="content">
              设置流程在哪些菜单中显示。对应的菜单为:<br>
              启动：对应“个人办公”-【流程中心】-【创建流程管理】菜单和首页【新建流程】栏目。<br>
              定义：对应”工作流程“ - 【流程定义管理】菜单。<br>
              任务：对应"工作流程"-【流程审批管理】菜单。<br>
              实例：对应”工作流程“-【流程实例管理】菜单。
            </div>
            <ibps-icon name="help" style="color:#dd5b44;" />
          </el-tooltip>:
        </span>
        <el-checkbox-group v-model="bpmAuth.type" :disabled="readonly">
          <el-checkbox v-for="type in typeOptions" :key="type.value" :label="type.value">{{ type.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="授权人员:" prop="rightsOwner">
        <div v-if="!readonly" class="toolbar">
          <el-button type="primary" class="ibps-icon-add" @click="setBpmAuth">设置</el-button>
          <el-button type="danger" class="ibps-icon-remove" @click="()=>{bpmAuth.rightsOwner = []}">重置</el-button>
        </div>
        <el-table
          :data="bpmAuth.rightsOwner"
          border
          empty-text="暂无设置授权人员"
        >
          <el-table-column
            label="权限分类"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.type | optionsFilter(rightsTypeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="授权给"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type ==='all'">允许所有人访问</span>
              <span v-else>{{ scope.row.rightsName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="授权流程:" prop="rightsDef">
        <div v-if="!readonly" class="toolbar">
          <bpm-definition-selector
            button
            multiple
            @callback="updateDefine"
          />
          <el-button type="warning" class="ibps-icon-delete ibps-ml-10" @click="deleteDef">删除</el-button>
          <el-button type="danger" class="ibps-icon-remove" @click="()=>{bpmAuth.rightsDef = []}">重置</el-button>
        </div>
        <el-table
          ref="rightsDef"
          :data="bpmAuth.rightsDef"
          empty-text="暂无设置授权流程"
          :class="readonly?'authorization-table':null"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="!readonly"
            label="快捷设置"
          >
            <el-table-column
              type="selection"
            />
          </el-table-column>
          <el-table-column>
            <template v-if="!readonly" slot="header">
              <template v-for="(rights,i) in flowRightsOptions">
                <span v-if="dialogVisible" :key="rights.name">
                  {{ rights.label }}：（
                  <template v-for="item in rights.options">
                    <el-checkbox
                      :key="item.value"
                      :checked="defalueCheckBoxVaries[''+item.value]==='Y'"
                      true-label="Y"
                      false-label="N"
                      class="authorization-checkbox"
                      @change="(val)=>{changeShortcutRights(val,item.value)}"
                    >{{ item.label }}</el-checkbox>
                  </template>
                  ）
                  <br v-if="i!==flowRightsOptions.length-1">
                </span>
              </template>
            </template>
            <el-table-column
              prop="defName"
              label="流程名称"
            />
            <el-table-column
              label="授权给"
            >
              <template slot-scope="scope">
                <template v-for="(rights,i) in flowRightsOptions">
                  <span :key="rights.name">
                    {{ rights.label }}：（
                    <el-checkbox
                      v-for="item in rights.options"
                      :key="item.value"
                      v-model="scope.row.rights[''+item.value]"
                      :disabled="readonly"
                      true-label="Y"
                      false-label="N"
                      class="authorization-checkbox"
                    >{{ item.label }}</el-checkbox>
                    ）
                    <br v-if="i!==flowRightsOptions.length-1">
                  </span>
                </template>
              </template>

            </el-table-column>
          </el-table-column>
        </el-table>

      </el-form-item>
    </el-form>
    <rights-config
      :id="formId"
      :visible="dialogRightsVisible"
      :data="rightsOwnerList"
      title="设置权限"
      @callback="updateBpmAuth"
      @close="visible => dialogRightsVisible = visible"
    />
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import { save, get } from '@/api/platform/bpmn/bpmAuth'
import { typeOptions, rightsTypeOptions, flowRightsOptions } from './constants'
import ActionUtils from '@/utils/action'
import RightsConfig from '@/business/platform/rights/config'
import BpmDefinitionSelector from '@/business/platform/bpmn/definition/selector'

export default {
  components: {
    RightsConfig,
    BpmDefinitionSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    id: String,
    title: {
      type: String,
      default: '流程代理设置'
    }
  },
  data() {
    return {
      formName: 'bpmAuthForm',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogRightsVisible: false,
      rightsTypeOptions,
      typeOptions,
      flowRightsOptions,

      defaultForm: {},
      rightsOwnerList: [],
      bpmAuth: {
        id: '',
        name: '',
        type: [],
        rightsOwner: [],
        rightsDef: []
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') },
          { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }]
      },
      defalueFormCheckBoxVaries: {
        'm_edit': 'N',
        'm_del': 'N',
        'm_start': 'N',
        'm_set': 'N',
        'm_clean': 'N',
        'm_guideEdit': 'N',
        'i_del': 'N'
      },
      defalueCheckBoxVaries: {},
      defineSelect: [],
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    shortcutRights: {
      get() {
        return JSON.parse(JSON.stringify(this.defalueCheckBoxVaries))
      },
      set(val) {
        this.defalueCheckBoxVaries = JSON.parse(JSON.stringify(val))
      }
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
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.bpmAuth))
    this.defalueCheckBoxVaries = JSON.parse(JSON.stringify(this.defalueFormCheckBoxVaries))
  },
  beforeDestroy() {
    this.rightsOwnerList = null
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 保存数据
    handleSave() {
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 提交保存数据
    saveData() {
      const type = this.$utils.isNotEmpty(this.bpmAuth.type) ? this.bpmAuth.type.join(',') : ''
      const rightsOwner = this.$utils.isNotEmpty(this.bpmAuth.rightsOwner) ? JSON.stringify(this.bpmAuth.rightsOwner) : ''
      const rightsDef = this.$utils.isNotEmpty(this.bpmAuth.rightsDef) ? JSON.stringify(this.bpmAuth.rightsDef) : ''
      const data = {
        id: this.bpmAuth.id,
        name: this.bpmAuth.name,
        type: type,
        rightsOwner: rightsOwner,
        rightsDef: rightsDef
      }
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.shortcutRights = JSON.parse(JSON.stringify(this.defalueFormCheckBoxVaries))
      this.$refs[this.formName].resetFields()
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.shortcutRights = this.defalueCheckBoxVaries = JSON.parse(JSON.stringify(this.defalueFormCheckBoxVaries))
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.bpmAuth = JSON.parse(JSON.stringify(this.defaultForm))

        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        id: this.formId
      }).then(response => {
        const data = response.data
        this.rightsOwnerList = data.rightsOwnerList
        let rightsDef = []
        if (this.$utils.isNotEmpty(data.rightsDef)) {
          rightsDef = this.$utils.parseJSON(data.rightsDef)
          rightsDef = rightsDef.map((item) => {
            item.rights = this.$utils.parseJSON(item.rights)
            return item
          })
        }
        this.bpmAuth = {
          id: data.id,
          name: data.name,
          type: this.$utils.isNotEmpty(data.type) ? data.type.split(',') : [],
          rightsOwner: this.$utils.isNotEmpty(data.rightsOwner) ? this.$utils.parseJSON(data.rightsOwner) : [],
          rightsDef: rightsDef
        }
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    deleteDef() {
      if (this.$utils.isEmpty(this.defineSelect)) {
        ActionUtils.warning('请选择记录！')
        return
      }
      const selectionKey = []
      this.defineSelect.forEach(item => {
        selectionKey.push(item.defKey)
      })
      const rowIndex = []
      for (let i = 0; i < this.bpmAuth.rightsDef.length; i++) {
        const rightsDef = this.bpmAuth.rightsDef[i]
        if (selectionKey.indexOf(rightsDef.defKey) > -1) {
          rowIndex.push(rightsDef.defKey)
        }
      }
      rowIndex.forEach(index => {
        this.bpmAuth.rightsDef.forEach((r, i) => {
          if (index === r.defKey) {
            this.bpmAuth.rightsDef.splice(i, 1)
          }
        })
      })

      this.$refs.rightsDef.clearSelection()
    },
    setBpmAuth() {
      this.rightsOwnerList = [...this.bpmAuth.rightsOwner]
      this.dialogRightsVisible = true
    },
    updateBpmAuth(rights) {
      this.bpmAuth.rightsOwner = [...rights]
    },
    updateDefine(data) {
      const rightsDef = this.bpmAuth.rightsDef
      data.forEach(def => {
        let isExist = false
        rightsDef.forEach(e => {
          if (e.defKey === def.defKey) {
            isExist = true
          }
        })
        if (!isExist) {
          rightsDef.push({
            defKey: def.defKey,
            defName: def.name,
            rights: this.$utils.newData(this.defalueCheckBoxVaries) })
        }
      })

      this.bpmAuth.rightsDef = rightsDef
    },
    /**
     * @description 行点击时触发的事件
     */
    handleRowClick(row, event, column) {
      this.$refs.rightsDef.toggleRowSelection(row)
    },
    handleSelectionChange(selection) {
      this.defineSelect = selection
    },
    changeShortcutRights(val, key) {
      if (this.$utils.isEmpty(this.bpmAuth.rightsDef)) {
        ActionUtils.warning('请选择授权的流程！')
        return
      }
      const data = JSON.parse(JSON.stringify(this.defalueCheckBoxVaries))
      data[key] = val
      this.shortcutRights = data
      this.bpmAuth.rightsDef.forEach(element => {
        element.rights[key] = val
      })
    }
  }
}
</script>
<style lang='scss'>
.bpmn-auth-dialog{
  .el-dialog__body{
    height:  calc(100vh - 110px) !important;
  }
  .toolbar{
    padding-bottom: 5px;
  }
  .authorization-checkbox{
    margin-right:5px;
    .el-checkbox__label{
      padding-left: 5px;
    }
  }
  .authorization-table{
    .el-table__header-wrapper{
      .el-table__header{
        .has-gutter{
          tr:nth-of-type(1){
            display: none;
          }
        }
      }
    }
  }
}
</style>
