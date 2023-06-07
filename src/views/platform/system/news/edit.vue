<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="65%"
    top="0"
    custom-class="dialog is-fullscreen"
    @open="getform"
    @close="closeDialog"
  >
    <el-row>
      <el-col :span="7">
        <div style="padding-left:65px; display: none;">
          <span class="photo-area" @click="dialogPictureVisible = !readonly">
            <img v-if="form.picture" :src="image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div v-if="!readonly" :class="form.picture!==''?'handle-photo-buttons':null" @click.stop="() => { dialogPictureVisible = false }">
              <div v-if="form.picture!==''">
                <i class="el-icon-edit" @click.stop="dialogPictureVisible = !readonly" />
                <i class="el-icon-delete" @click.stop="form.picture = ''" />
              </div>
            </div>
          </span>
        </div>
        <span v-if="!readonly " class="operation" style="display: none;">点击上方选择封面图片</span>
        <ibps-uploader
          :visible="dialogPictureVisible"
          :accept="accept"
          @action-event="uploaderPictureAction"
          @close="visible => dialogPictureVisible = visible"
        />
      </el-col>
      <el-col :span="15" style="margin-left:25px;">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px" @submit.native.prevent>
          <el-form-item label="发布选项：" prop="publicItem">
            <el-radio-group v-model="form.publicItem">
              <el-radio label="notices">发布公告</el-radio>
              <el-radio label="top">置顶工作首页</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="公告分类：" prop="type" style="display: none;">
            <ibps-type-select v-model="form.typeId" category-key="NOTICE_TYPE" clearable />
          </el-form-item>
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="发布人：" prop="userId">
            <ibps-employee-selector
              :value="form.userId"
              @callback="handleInput"
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否公共：" prop="public0" style="display: none;">
                <el-radio-group v-model="form.public0" @change="change">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="show==='N'" label="是否包含子集" prop="includeChild">
                <el-radio-group v-model="form.includeChild">
                  <el-radio label="Y">是</el-radio>
                  <el-radio label="N">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="show==='N'" label="发布范围：" prop="depName">
            <ibps-org-selector
              :value="form.depId"
              :multiple="true"
              @input="depNameInput"
              @callback="callbackDepName"
            />
          </el-form-item>
          <el-form-item label="作者：" prop="author" style="display: none;">
            <el-input v-model="form.author" />
          </el-form-item>
          <el-form-item label="关键字：" prop="key" style="display: none;">
            <el-input v-model="form.key" />
          </el-form-item>
          <el-form-item label="发布时间：" prop="publicDate">
            <el-date-picker
              v-model="form.publicDate"
              type="date"
              style="width:100%;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="失效时间：" prop="loseDate">
            <el-date-picker
              v-model="form.loseDate"
              type="date"
              style="width:100%;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="附件：" prop="fileAttach" style="display: none;">
            <ibps-attachment-selector
              v-model="form.fileAttach"
              accept="*"
              multiple
            />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <ibps-ueditor v-model="form.content" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <ibps-uploader
      :visible="dialogFormVisible"
      @action-event="uploaderAction"
      @close="visible => dialogFormVisible = visible"
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
import { fileUrl } from '@/api/platform/file/attachment'
import { save, get } from '@/api/platform/system/news'
import { typeOptions } from './constants'
import ActionUtils from '@/utils/action'
import { getFile } from '@/utils/avatar'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsOrgSelector from '@/business/platform/org/org/selector'

import IbpsUploader from '@/business/platform/file/uploader'

import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'

export default {
  components: {
    IbpsUeditor,
    IbpsTypeSelect,
    IbpsEmployeeSelector,
    IbpsOrgSelector,
    IbpsUploader,
    IbpsAttachmentSelector
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
    status: String
  },
  data() {
    return {
      limit: 1,
      accept: '.jpeg,.gif,.png,.jpg', // 规定上传类型
      formName: 'form',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogFormVisible: false, // 弹窗
      dialogPictureVisible: false, // 弹窗
      typeOptions: typeOptions,
      defaultForm: {},
      show: '',
      formsId: this.id,
      form: {
        author: '',
        content: '',
        createBy: '',
        createOrgId: '',
        createTime: '',
        dataStatus: '',
        dbtype: '',
        depId: '',
        depName: '',
        fileAttach: '',
        id: '',
        ip: '',
        public0: 'Y',
        includeChild: 'Y',
        key: '',
        loseDate: '',
        name: '',
        picture: '',
        pk: '',
        publicDate: '',
        publicItem: 'notices',
        status: '',
        tenantId: '',
        title: '',
        type: '',
        typeId: '',
        updateBy: '',
        updateTime: '',
        userId: this.$store.getters.userId,
        userName: this.$store.getters.name
      },
      rules: {
        title: [{ required: true, message: this.$t('validate.required') }],
        userId: [{ required: true, message: this.$t('validate.required') }],
        publicDate: [{ required: true, message: this.$t('validate.required') }]
      },
      toolbars: [
        { key: 'save',
          icon: 'ibps-icon-send',
          label: '发布',
          type: 'success',
          hidden: () => {
            return this.readonly
          } },
        { key: 'drafts',
          icon: 'ibps-icon-save',
          label: '存为草稿',
          hidden: () => {
            return this.readonly
          } },
        { key: 'cancel' }
      ]
    }
  },
  computed: {
    formId() {
      return this.id
    },
    image() {
      return getFile(this.form.picture)
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
    this.form.userId = this.$store.getters.userId
  },
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'save':
          this.handleSave()
          break
        case 'drafts':
          this.handleDrafts()
          break
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 选择图片附件区
    /**
     * 上传
     */
    handleUpload() {
      this.dialogFormVisible = true
    },
    uploaderAction(buttonKey, data) {
      this.dialogFormVisible = false
      this.form.fileAttach = data.id
    },
    uploaderPictureAction(buttonKey, data) {
      this.dialogPictureVisible = false
      this.form.picture = fileUrl(data.id || data[0].id)
    },
    beforeAvatarUpload(file) {
      return true
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw)
    },
    // 填写编辑区
    handleInput(data) {
      this.form.userId = data.id
      this.form.userName = data.name
    },
    depNameInput(data) {
      this.form.depId = data
    },
    callbackDepName(data) {
      const arr = []
      data.forEach(i => {
        arr.push(i.name)
      })
      this.form.depName = arr.join(' ')
    },
    change(data) {
      this.show = data
    },
    // 发布
    handleSave() {
      this.form.status = 'publish'
      this.rules = {
        title: [{ required: true, message: this.$t('validate.required') }],
        userId: [{ required: true, message: this.$t('validate.required') }],
        publicDate: [{ required: true, message: this.$t('validate.required') }]
      }
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          // 置顶公告必须选择图片
          if (this.image === '' && this.form.publicItem === 'top') {
            ActionUtils.warning('请选择封面图片')
          } else {
            this.saveData()
          }
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 保存草稿
    handleDrafts() {
      this.form.status = 'drafts'
      this.rules = {}
      this.$refs[this.formName].validate(valid => {
        if (valid) {
          this.saveData()
        } else {
          ActionUtils.saveErrorMessage()
        }
      })
    },
    // 保存数据
    saveData() {
      const data = JSON.parse(JSON.stringify(this.form))
      data.publicDate = new Date(this.form.publicDate).getTime() || ''
      data.loseDate = new Date(this.form.loseDate).getTime() || ''
      // 检测失效日期是否发布日期在之前。
      if (data.publicDate > data.loseDate && data.loseDate !== '') {
        ActionUtils.error('发布时间与失效时间范围不合法！')
        return
      }
      save(this.form).then(response => {
        this.$emit('callback', this)
        ActionUtils.saveSuccessMessage(response.message, (rtn) => {
          if (rtn) {
            this.closeDialog()
          } else {
            if (this.form.status === 'drafts') {
              return
            }
            this.form.depId = ''
            this.form.picture = ''
            this.$refs[this.formName].resetFields()
          }
        })
      }).catch((err) => {
        console.error(err)
      })
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
      this.show = ''
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
    getform() {
      this.form.userName = this.$store.getters.name
      if (this.$utils.isEmpty(this.formId)) {
        // 重置表单
        const firstDate = new Date()
        this.form.publicDate = firstDate.setDate(1)
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.formValidate()
        return
      }
      this.dialogLoading = true
      get({
        newsId: this.formId
      }).then(response => {
        this.form = response.data
        this.show = this.form.public0
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
  .photo-area{
    display:block;
    position: relative;
    width: 178px;
    height: 178px;
      z-index:9997;
    .avatar {
      display: block;
      width: 178px;
      height: 178px;
    }
    .handle-photo-buttons{
      width:100%;
      height:100%;
      position: absolute;
      top:0;
      background: rgba(7, 0, 0, 0.6);
      display:none;
      z-index:9998;
      >div{
        margin:44% 0 0 30%;
        i{
          z-index:9999;
          cursor: pointer;
          margin:0 7px;
          color:white;
          font-size:18px;
        }
      }
    }
  }
  .photo-area:hover>.handle-photo-buttons{
      display: block;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
