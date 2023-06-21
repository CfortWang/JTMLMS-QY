<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    top="15vh"
    class="dataset-dialog"
    width="70%"
    @open="getFormData"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      v-loading="dialogLoading"
      :element-loading-text="$t('common.loading')"
      :model="form"
      :rules="rules"
      :label-width="formLabelWidth"
      @submit.native.prevent
    >
      <el-row>
        <el-col :span="span">
          <el-form-item label="名称:" prop="name">
            <el-input v-if="!readonly" v-model="form.name" v-pinyin="{vm:form}" />
            <span v-else>{{ form.name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="数据集key:" prop="key">
            <el-input v-if="!readonly" v-model="form.key" :disabled="disabled" />
            <span v-else>{{ form.key }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="!readonly" :span="span">
          <el-form-item key="typeId" label="分类:" prop="typeId">
            <ibps-type
              ref="ibpsType"
              v-model="form.typeId"
              :readonly="readonly"
              category-key="BO_TYPE"
              class="type"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="外部数据:" prop="external">
            <el-switch
              v-if="!readonly"
              v-model="form.external"
              :active-value="'Y'"
              :inactive-value="'N'"
              active-text="是"
              inactive-text="否"
            />
            <el-tag v-else :type="form.external|optionsFilter(externalOptions,'type')">
              {{ form.external|optionsFilter(externalOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col> -->
        <el-col v-if="form.external==='Y'" :span="12" style="height:50px;">
          <el-form-item label="数据源:" prop="dsAlias">
            <el-select
              v-if="!readonly"
              v-model="form.dsAlias"
              clearable
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in dsAliasOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-tag v-else :type="form.dsAlias|optionsFilter(externalOptions,'type')">
              {{ form.dsAlias|optionsFilter(externalOptions,'label') }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="类型:" prop="type">
            <el-row>
              <el-col :span="5">
                <el-select
                  v-if="!readonly"
                  v-model="form.type"
                  placeholder="请选择"
                  style="width:100%;"
                  @change="changeType"
                >
                  <el-option
                    v-for="item in datasetTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tag v-else :type="form.type|optionsFilter(datasetTypeOptions,'type')">{{ form.type|optionsFilter(datasetTypeOptions,'label') }}</el-tag>
              </el-col>
              <el-col :span="19">
                <el-form-item v-if="!readonly" prop="from" class="from">
                  <el-select v-if="form.type!=='thirdparty'" v-model="form.from" filterable placeholder="请选择或者搜索关键字后选择" style="width:100%">
                    <el-option
                      v-for="item in fromOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <ibps-tree-select
                    v-else
                    v-model="form.from"
                    :data="treeData"
                    :props="props"
                    :icon="handleIcon"
                    :multiple="false"
                    :allow-selection="handleAllowSelection"
                    node-key="key"
                    empty-text="暂无第三方服务"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <p v-if="!readonly&&form.type==='thirdparty'" class="ibps-m-0"><i class="el-icon-warning" style="font-size:12px;color:#E6A23C" /> <span style="font-size:12px;color:#E6A23C">带图标</span> <i class="ibps-icon ibps-icon-list" /> <span style="font-size:12px;color:#E6A23C">数据为目录不能用作第三方服务类型参数</span> </p>
          </el-form-item>
        </el-col>
        <template v-if="readonly">
          <el-col :span="span">
            <el-form-item key="from" label="来源:">
              <span>{{ form.from }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="span">
            <el-form-item key="isTree" label="是否树型:">
              <span>{{ form.isTree|optionsFilter(externalOptions,'label') }}</span>
            </el-form-item>
          </el-col> -->
          <el-col :span="span">
            <el-form-item key="createBy" label="创建人:">
              <ibps-employee-selector
                :value="form.createBy"
                :disabled="true"
                class="dataset-readonly-selector"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="createTime" label="创建时间:">
              <span>{{ form.createTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="updateBy" label="更新人:">
              <ibps-employee-selector
                :value="form.updateBy"
                :disabled="true"
                class="dataset-readonly-selector"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item key="updateTime" label="更新时间:">
              <span>{{ form.updateTime }}</span>
            </el-form-item>
          </el-col>
        </template>
      </el-row>

    </el-form>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import { save, get, getTableOrViewList } from '@/api/platform/data/dataset'
import { datasetTypeOptions } from '@/business/platform/data/constants'
import { externalOptions, dsAliasOptions } from './constants'
import { validateKey } from '@/utils/validate'

import IbpsType from '@/business/platform/cat/type/select'
import ActionUtils from '@/utils/action'

import { findTreeData } from '@/api/platform/serv/service'
import TreeUtils from '@/utils/tree'

import IbpsTreeSelect from '@/components/ibps-tree-select'

export default {
  components: {
    IbpsType,
    IbpsTreeSelect,
    IbpsEmployeeSelector
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
    title: String,
    typeId: String
  },
  data() {
    return {
      formName: 'form',
      formLabelWidth: '120px',
      span: 24,
      dialogVisible: this.visible,
      dialogLoading: false,
      dsAlias: false,
      disabled: false,
      datasetTypeOptions,
      externalOptions: externalOptions,
      dsAliasOptions: dsAliasOptions,
      fromOptions: [],
      defaultForm: {},
      props: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      form: {
        key: '',
        name: '',
        typeId: '',
        external: 'N',
        type: 'table',
        isTree: 'N',
        from: '',
        dsAlias: 'dataSource_default'
      },
      rules: {
        key: [{ required: true, validator: validateKey },
          { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }],
        name: [{ required: true, message: this.$t('validate.required') },
          { min: 1, max: 64, message: '长度不能超过64个字符', trigger: 'blur' }],
        from: [{ required: true, message: this.$t('validate.required') }],
        external: [{ required: true, message: this.$t('validate.required') }],
        type: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
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
    this.defaultForm = JSON.parse(JSON.stringify(this.form))
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
      const data = JSON.parse(JSON.stringify(this.form))
      save(data).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          if (rtn) {
            this.closeDialog()
          } else {
            this.formValidate()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
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
    changeType(type) {
      this.form.from = ''
      this.fromOptions = []
      this.loadDataTableOrView(type)
    },
    // 子集Key数据获取
    loadDataTableOrView(type = 'table') {
      if (this.$utils.isEmpty(this.formId)) {
        this.form.from = ''
        this.fromOptions = []
      }
      if (type !== 'thirdparty') {
        getTableOrViewList({
          from: '',
          external: this.form.external,
          dsAlias: this.form.dsAlias || 'dataSource_default',
          type: type
        }).then(response => {
          const data = response.data
          this.fromOptions = data.map(item => {
            return {
              value: item.id,
              label: item.text + '【' + item.comment + '】'
            }
          })
        }).catch(() => {})
      } else {
        findTreeData().then(response => {
          const data = response.data
          const treeData = []
          data.forEach(d => {
            if (d.parentId !== '-1') {
              if (d.isDir === 'Y') {
                d.disabled = true
              }
              treeData.push(d)
            }
          })
          this.treeData = TreeUtils.transformToTreeFormat(treeData)
        })
      }
    },
    handleIcon(data) {
      let icon = ''
      if (data.isDir === 'Y') {
        icon = 'ibps-icon ibps-icon-list'
      }
      return icon
    },
    handleAllowSelection(data) {
      if (data.isDir === 'Y') {
        this.$message.warning('数据为目录不能用作第三方服务参数，请重新选择！')
        return false
      }
      return true
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.$nextTick(() => {
        if (this.$refs['ibpsType']) {
          this.$refs['ibpsType'].loadTreeData()
        }
      })
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.disabled = false
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.form.typeId = this.typeId
        this.span = 24
        this.loadDataTableOrView()
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        datasetId: this.formId
      }).then(response => {
        this.span = 24
        if (this.readonly) {
          this.span = 12
          this.dsAlias = false
        }
        this.loadDataTableOrView(response.data.type)
        this.disabled = true
        this.form = response.data
        this.formValidate()
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.dataset-dialog{
  .el-tree-select{
    line-height: 28px;
  }
  .dataset-readonly-selector{
    .is-disabled{
      input{
        display:none;
      }
    }
  }
}
</style>
