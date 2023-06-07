<template>
  <ibps-container
    v-loading="loading"
    :element-loading-text="$t('common.loading')"
    type="full"
    class="page"
  >
    <template slot="header">
      <el-button type="primary" icon="ibps-icon-save" @click="handleSave()">保存</el-button>
      <el-button v-if="type === 'addMenu'" icon="ibps-icon-close" @click="handleClose()">关闭</el-button>
    </template>
    <el-form ref="resourcesForm" :model="resources" :rules="rules" :label-width="formLabelWidth" @submit.native.prevent>
      <el-form-item v-if="type === 'addMenu'" label="父节点名称:">
        <el-input v-model="parentName" disabled />
      </el-form-item>

      <el-form-item label="资源名称:" prop="name">
        <el-input v-model="resources.name" v-pinyin="{vm:resources,key:'alias'}" autocomplete="off" />
      </el-form-item>
      <el-form-item label="资源别名:" prop="alias">
        <el-input v-model="resources.alias" autocomplete="off" />
      </el-form-item>
      <el-form-item label="资源类型:" prop="resourceType">
        <el-select v-model="resources.resourceType" @change="changeResourceType">
          <el-option
            v-for="item in resourceTypes"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图标:" prop="icon">
        <ibps-icon-select v-model="resources.icon" icon="el-icon-search" />
      </el-form-item>
      <el-form-item label="默认URL:" prop="defaultUrl">
        <el-input v-model="resources.defaultUrl" :disabled="resources.resourceType==='dir'" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否目录:" prop="isFolder">
        <el-switch
          v-model="resources.isFolder"
          :active-value="'Y'"
          :inactive-value="'N'"
          disabled
        />
      </el-form-item>
      <el-form-item label="显示到菜单:" prop="displayInMenu">
        <el-switch
          v-model="resources.displayInMenu"
          :active-value="'Y'"
          :inactive-value="'N'"
          :disabled="resources.resourceType==='request'"
          @change="displayInMenu"
        />
      </el-form-item>
      <el-form-item label="是否展开:" prop="isOpen">
        <el-switch
          v-model="resources.isOpen"
          :active-value="'Y'"
          :inactive-value="'N'"
        />
      </el-form-item>
      <el-form-item v-if="resources.resourceType==='menu'" label="是否常用菜单:" prop="isCommon">
        <el-switch
          v-model="resources.isCommon"
          :active-value="'Y'"
          :inactive-value="'N'"
        />
      </el-form-item>
      <el-form-item label="租户资源类型:" prop="tenantType">
        <el-select v-model="resources.tenantType">
          <el-option
            v-for="item in tenantType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="采用布局:" prop="layout">
        <el-select v-model="resources.layout">
          <el-option
            v-for="item in layouts"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="同层顺序:" prop="sn">
        <el-input v-model="resources.sn" type="number" />
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input v-model="resources.desc" type="textarea" row="4" />
      </el-form-item>
    </el-form>

    <syn-menu
      :visible="settingVisible"
      @close="visible => settingVisible = visible"
      @save="synSub"
    />
  </ibps-container>
</template>
<script>
import { save, get, removeFavorites, saveFavorites } from '@/api/platform/auth/resources'
import ActionUtils from '@/utils/action'
import { validateKey, validateInteger } from '@/utils/validate'
import { tenantType } from './constants'

import SynMenu from './synMenu'

export default {
  components: {
    SynMenu
  },
  props: {
    id: [String, Number],
    parentId: [String, Number],
    parentName: String,
    systemId: [String, Number],
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    defaultUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      settingVisible: false,
      loading: false,
      formName: 'resourcesForm',
      formLabelWidth: '120px',
      formId: '',
      clientHeight: '',
      tenantType: tenantType,
      resourceTypes: [{
        value: 'dir',
        label: '目录'
      },
      {
        value: 'menu',
        label: '菜单'
      }, {
        value: 'request',
        label: '请求'
      }],
      defaultForm: {},
      rawOfCommon: 'N',
      resources: {
        id: '',
        parentId: this.parentId,
        name: '',
        alias: '',
        resourceType: 'menu',
        icon: 'cog',
        defaultUrl: '',
        isFolder: 'Y',
        displayInMenu: 'Y',
        isOpen: 'N',
        isCommon: 'N',
        sn: 1,
        layout: '',
        tenantType: 'normal',
        desc: '',
        systemId: '',
        synSubSign: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        sn: [{ required: true, validator: validateInteger }],
        alias: [{ required: true, validator: validateKey }],
        icon: [{ required: true, message: this.$t('validate.required') }],
        resourceType: [{ required: true, message: this.$t('validate.required') }]
      }
    }
  },
  // 监听
  watch: {
    id: {
      handler: function(val, oldVal) {
        this.formId = this.id
        this.getFormData()
      },
      immediate: true
    }
  },
  created() {
    this.defaultForm = JSON.parse(JSON.stringify(this.resources))
  },
  methods: {
    displayInMenu() {
      if (this.id !== '' && this.resources.displayInMenu === 'N') {
        this.settingVisible = true
      } else {
        this.settingVisible = false
        this.resources.synSubSign = 'N'
      }
    },
    synSub(synSign) {
      if (synSign === 'Y') {
        this.resources.synSubSign = 'Y'
      } else if (synSign === 'N') {
        this.resources.synSubSign = 'N'
      } else if (synSign === 'C') {
        this.resources.synSubSign = 'C'
      }
      this.handleSave()
    },
    changeResourceType(val) {
      if (val === 'dir') {
        this.resources.isFolder = 'Y'
        this.resources.displayInMenu = 'Y'
        this.resources.defaultUrl = ''
      } else if (val === 'menu') {
        this.resources.isFolder = 'N'
        this.resources.displayInMenu = 'Y'
        this.resources.defaultUrl = this.defaultUrl
      } else if (val === 'request') {
        this.resources.isFolder = 'N'
        this.resources.displayInMenu = 'N'
        this.resources.defaultUrl = this.defaultUrl
      }
    },
    handleClose() {
      this.$emit('close', true)
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
      if (this.type === 'addMenu') {
        if (this.$utils.isEmpty(this.parentId)) {
          this.$message({
            message: '请在左树，选择一个类型不为“请求”的父节点!',
            type: 'warning'
          })
          return
        } else {
          this.resources.parentId = this.parentId
        }
      }

      this.resources.systemId = this.systemId
      if (this.resources.isCommon !== this.rawOfCommon && this.resources.isCommon === 'Y') {
        saveFavorites({ sign: 'sys', resourceIds: this.resources.id }).then(response => {
        }).catch((err) => {
          console.error(err)
        })
      } else if (this.resources.isCommon !== this.rawOfCommon && this.resources.isCommon === 'N') {
        removeFavorites({ sign: 'sys', resourceIds: this.resources.id }).then(response => {
        }).catch((err) => {
          console.error(err)
        })
      }
      save(this.resources).then(response => {
        this.$emit('callback', this)
        if (this.type === 'addMenu') {
          return
        }
        if (this.$utils.isEmpty(this.formId)) {
          this.$refs[this.formName].resetFields()
        }
        this.rawOfCommon = this.resources.isCommon
        ActionUtils.success('保存菜单成功')
      }).catch((err) => {
        console.error(err)
      })
    },
    // 获取编辑数据
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 页面渲染完后初始化表单
        this.$nextTick(() => {
          this.$refs[this.formName].resetFields()
          // 重置表单
          this.resources = JSON.parse(JSON.stringify(this.defaultForm))
          this.resources.defaultUrl = this.defaultUrl
          this.resources.parentId = this.parentId
          this.formValidate()
        })
      } else {
        this.loading = true
        get({ resourceId: this.formId }).then(response => {
          this.loading = false
          this.resources = response.data
          if (this.$utils.isEmpty(this.resources.resourceType)) {
            this.resources.resourceType = 'menu'
          }
          if (!this.readonly) {
            this.formValidate()
          }
          this.rawOfCommon = this.resources.isCommon
        }).catch(() => {
          this.loading = false
        })
      }
    },
    /**
     * 表单验证
     */
    formValidate() {
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => {})
      })
    }
  }
}
</script>
