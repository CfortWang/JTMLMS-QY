<template>
  <!--对话框-->
  <el-dialog v-if="displayType ==='dialog'"
             :title="title"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             append-to-body
             class="dialog"
             :class="className"
             @open="getFormData"
             @close="closeDialog">
    <el-form ref="typeForm"
             v-loading="dialogLoading"
             :element-loading-text="$t('common.loading')"
             :model="type"
             :rules="rules"
             :label-width="formLabelWidth"
             @submit.native.prevent>
      <!-- <el-form-item  v-show="!formId" label="父节点名称:">
        <span>{{ parentData.name }}</span>
      </el-form-item> -->

      <el-form-item label="分类名称："
                    prop="name">
        <el-input v-model="type.name"
                  v-pinyin="{vm:type,key:'typeKey'}" />
      </el-form-item>
      <el-form-item label="分类Key："
                    prop="typeKey">
        <el-input v-model="type.typeKey"
                  :disabled="$utils.isNotEmpty(formId)" />
      </el-form-item>

      <el-form-item v-show="categoryKey==='DIC_TYPE'"
                    label="分类类型："
                    prop="struType">
        <el-radio-group v-model="type.struType">
          <el-radio v-for="option in srtuOptions"
                    :key="option.value"
                    :label="option.value">{{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="el-dialog--center">
      <ibps-toolbar :actions="toolbars"
                    @action-event="handleActionEvent" />
    </div>
  </el-dialog>
  <!--默认形式-->
  <div v-else
       class="main-container">
    <ibps-container type="full"
                    class="page">
      <template slot="header">
        <el-button type="primary"
                   :disabled="readonly"
                   icon="ibps-icon-save"
                   @click="handleSave()">保存</el-button>
      </template>
      <el-form ref="typeForm"
               :model="type"
               :rules="rules"
               :label-width="formLabelWidth">
        <el-form-item label="分类：">
          <span>{{ isPrivateLocal ? '私有分类' : '普通分类' }}</span>
        </el-form-item>
        <el-form-item v-show="!formId"
                      label="父节点名称：">
          <span>{{ parentData.name }}</span>
        </el-form-item>
        <el-form-item label="分类名称："
                      prop="name">
          <el-input v-if="!readonly"
                    v-model="type.name"
                    v-pinyin="{vm:type,key:'typeKey'}" />
          <span v-else>{{ type.name }}</span>
        </el-form-item>
        <el-form-item label="分类Key："
                      prop="typeKey">
          <el-input v-if="!readonly"
                    v-model="type.typeKey"
                    :disabled="$utils.isNotEmpty(formId)" />
          <span v-else>{{ type.typeKey }}</span>
        </el-form-item>
        <el-form-item label="查阅权限："
                      prop="authorityObject.chaYue"
                      v-show="categoryKey==='FILE_TYPE'">
          <el-radio-group v-if="!readonly"
                          v-model="type.authorityObject.chaYue"
                          @change="radioChangeHandle">
            <el-radio label="公用查阅">公用查阅</el-radio>
            <el-radio label="部门查阅">部门查阅</el-radio>
            <el-radio label="受限查阅">受限查阅</el-radio>
          </el-radio-group>
          <span v-else>{{ type.authorityObject.chaYue }}</span>
        </el-form-item>
        <el-form-item label="部门："
                      prop="authorityObject.buMen"
                      v-show="categoryKey==='FILE_TYPE' && type.authorityObject.chaYue=='部门查阅'">
          <el-cascader placeholder="请选择部门"
                       :options="cascaderOptions"
                       :props="cascaderProps"
                       filterable
                       :disabled="readonly"
                       v-model="type.authorityObject.buMen"></el-cascader>
        </el-form-item>
        <el-form-item v-show="categoryKey==='DIC_TYPE'"
                      label="字典类型:"
                      prop="struType">
          <el-radio-group v-model="type.struType">
            <el-radio v-for="option in srtuOptions"
                      :key="option.value"
                      :label="option.value">{{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="体系审查："
                      prop="authorityObject.shenCha"
                      v-show="categoryKey==='FILE_TYPE'">
          <el-radio-group v-if="!readonly"
                          v-model="type.authorityObject.shenCha"
                          >
            <el-radio label="需要">需要</el-radio>
            <el-radio label="不需要">不需要</el-radio>
          </el-radio-group>
          <span v-else>{{ type.authorityObject.shenCha }}</span>
        </el-form-item>
        <el-form-item v-show="categoryKey==='FILE_TYPE'">
            <span >需要进行体系文件审查的文件类型请选择“需要”，子节点有需要进行文件审查的话，父节点也需要选择“需要”</span>
        </el-form-item>
      </el-form>
    </ibps-container>
  </div>
</template>
<script>
import { save, get } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'
import { srtuOptions } from './constants'
import { validateKey } from '@/utils/validate'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'

export default {
  props: {
    className: String,
    id: {
      type: String
    },
    parentData: Object, // 父类数据
    categoryKey: String, // 分类标识key
    isPrivate: Boolean, // 是否是私有的
    data: Array,
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    displayType: {
      type: String,
      default: 'dialog'
    },
    randomNum: [String, Number] // 时间戳，用于保证点击请求数据
  },
  data() {
    return {
      formName: 'typeForm',
      formLabelWidth: '120px',
      dialogVisible: false,
      dialogLoading: false,
      isPrivateLocal: false,
      topKey: '',
      srtuOptions: srtuOptions,
      defaultForm: {},
      type: {
        struType: '1',
        name: '',
        typeKey: '',
        ownerId: '0',
        authorityObject: {
          chaYue: '', buMen: '',shenCha:''
        }
      },
      rules: {
        name: [{ required: true, message: this.$t('validate.required') }],
        typeKey: [{ required: true, validator: validateKey }],
        authorityObject: {
          chaYue: [{ required: false }],
          buMen: [{ required: false }],
          shenCha: [{ required: false }]
        }
      },
      toolbars: [
        { key: 'save', hidden: () => { return this.readonly } },
        { key: 'cancel' }
      ],
      cascaderOptions: [],
      cascaderProps: {
        multiple: true,
        children: 'children',  //匹配响应数据中的children
        label: 'NAME_',        //匹配响应数据中的name
        value: 'ID_'
      }
    }
  },
  computed: {
    formId() {
      return this.id
    },
    random() {
      return this.randomNum
    }
  },
  watch: {
    random() {
      if (this.displayType !== 'dialog') {
        this.getFormData()
        if (!this.id) this.type = JSON.parse(JSON.stringify(this.defaultForm))
      }
    },
    visible: {
      handler: function (val, oldVal) {
        this.dialogVisible = this.visible
        this.isPrivateLocal = this.isPrivate
        if (this.categoryKey === 'FILE_TYPE' && this.parentData.authorityName !== undefined) {
          this.type.authorityObject = JSON.parse(this.parentData.authorityName)
        }
      },
      immediate: true
    },
    parentData: {
      handler: function (val, oldVal) {
        if (this.categoryKey === 'FILE_TYPE' && (this.$route.name !== 'nbwj' || this.$route.name !== 'wjkzgl-ywyxjlsc') && val.authorityName !== undefined) {
          this.getRadioOptions()
          this.type.authorityObject = JSON.parse(val.authorityName)
        }
      },
      immediate: true
    },
    /* formId() {
       if (this.displayType !== 'dialog') {
         this.getFormData()
         if (!this.id) this.type = JSON.parse(JSON.stringify(this.defaultForm))
       }
    }, */
    isPrivate: {
      handler: function (val, oldVal) {
        this.isPrivateLocal = this.isPrivate
      },
      immediate: true
    }
  },
  created() {
    this.topKey = ''
    this.defaultForm = JSON.parse(JSON.stringify(this.type))
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
    closeDialog() {
      this.$emit('close', false)
    },
    // 保存数据
    handleSave() {
      if (!this.type.authorityObject.chaYue && this.categoryKey === 'FILE_TYPE') {
        this.rules.authorityObject.chaYue = [{ required: true, message: "查阅权限不得为空！" }]
      } else {
        this.rules.authorityObject.chaYue = [{ required: false }]
      }
      if (!this.type.authorityObject.shneCha && this.categoryKey === 'FILE_TYPE') {
        this.rules.authorityObject.shneCha = [{ required: true, message: "审查选择不得为空！" }]
      } else {
        this.rules.authorityObject.shneCha = [{ required: false }]
      }
      if (this.type.authorityObject.chaYue == '部门查阅' && (!this.type.authorityObject.buMen || this.type.authorityObject.buMen.length == 0)) {
        this.rules.authorityObject.buMen = [{ required: true, message: "部门选择不得为空！" }]
      } else {
        this.rules.authorityObject.buMen = [{ required: false }]
      }
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
      if (this.$utils.isEmpty(this.formId)) {
        if (this.parentData.depth === 0 || this.parentData.depth === '0') {
          this.type.path = this.parentData.id + '.'
          this.isRoot = true
        } else {
          this.type.path = this.parentData.path
        }
        this.type.parentId = this.parentData.id
        this.type.categoryKey = this.categoryKey
        this.type.isPrivate = this.isPrivate
        if (this.$utils.isEmpty(this.type.id) && (this.type.isPrivate === true || this.type.isPrivate === 'true')) {
          this.type.ownerId = this.$store.getters.userId
        }
        if (!this.displayType === 'DIC_TYPE') {
          this.type.struType = this.parentData.struType || '0'
        }
      }
      save(JSON.stringify(this.type)).then(response => {
        if (this.displayType === 'dialog') {
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (this.$utils.isEmpty(this.formId)) {
              this.$refs[this.formName].resetFields()
            }
            if (rtn) {
              this.closeDialog()
            }
            this.$emit('callback', true)
          })
        } else {
          ActionUtils.removeSuccessMessage('保存成功')
          if (this.$utils.isEmpty(this.formId)) {
            this.$refs[this.formName].resetFields()
          }
          this.$emit('callback', true)
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    /**
     * 表单验证
     */
    formValidate() {
      if (this.readonly) return
      this.$nextTick(() => {
        this.$refs[this.formName].validate(() => { })
      })
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        this.type = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      get({
        typeId: this.formId
      }).then(response => {
        this.$refs[this.formName].clearValidate()
        this.type = response.data
        this.type.authorityObject = JSON.parse(response.data.authorityObject)
        this.isPrivateLocal = !((this.$utils.isEmpty(this.type.ownerId) || this.type.ownerId === '0'))
      }).catch(() => { })
    },
    getRadioOptions() {
      this.type.authorityObject.buMen = ''
      if (this.$store.getters.userId == '702117247933480960') {
        let sql = `select * FROM  ibps_party_entity WHERE party_type_='position' `
        curdPost('sql', sql).then(res => {
          let datas = res.variables.data
          let treeDatas = this.buildTree(datas, 'ID_', 'PARENT_ID_')
          let tree = []
          for (let i in treeDatas) {
            tree.push(treeDatas[i])
          }
          this.cascaderOptions = tree
        })
      }
    },
    radioChangeHandle(h) {
      if (h == '部门查阅') {
        this.type.authorityObject.buMen = JSON.parse(this.parentData.authorityName).buMen
        if (this.cascaderOptions.length == 0) {
          this.getRadioOptions()
        }
      } else {
        this.type.authorityObject.buMen = ''
      }
    },
    // 数据扁平化处理
    buildTree(array, id, parent_id) {
      // 创建临时对象
      let temp = {};
      // 创建需要返回的树形对象
      let tree = {};
      // 先遍历数组，将数组的每一项添加到temp对象中
      for (let i in array) {
        temp[array[i][id]] = array[i];
      }
      // 遍历temp对象，将当前子节点与父节点建立连接
      for (let i in temp) {
        // 判断是否是根节点下的项
        if (temp[i][parent_id] !== '0') {
          if (!temp[temp[i][parent_id]].children) {
            temp[temp[i][parent_id]].children = new Array();
          }
          temp[temp[i][parent_id]].children.push(temp[i]);
        } else {
          tree[temp[i][id]] = temp[i];
        }
      }
      return tree;
    }
  }
}
</script>
<style lang="scss">
.el-cascader {
  width: 100%;
}
.gy-cascader {
  max-width: 500px;
  overflow-x: auto;
  &::-webkit-scrollbar-track-piece {
    background-color: #f8f8f800;
  }
  &::-webkit-scrollbar {
    transition: all 2s;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ebeaef;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  &::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-corner {
    background-color: rgba(255, 255, 255, 0);
  }
}
</style>





