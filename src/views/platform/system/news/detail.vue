<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
    width="65%"
    top="5vh"
    class="news-detail-dialog"
    @open="getFormData"
    @close="closeDialog"
  >
    <div style="padding: 10px;">
      <el-row>
        <el-col :span="24">
          <el-col :span="18">
            <el-col :span="24">
                         <span> 标题： <div class="text-border">{{ form.title || "/" }}</div></span>
              </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <span>发布人:<div class="text-border">{{ form.userName|| "/" }}</div></span>
              </el-col>
              <el-col :span="8" style="display: none;">
                <span>作者：<div class="text-border">{{ form.author|| "/" }}</div></span>
              </el-col>
              <el-col :span="8" style="display: none;">
                <div>公告类型：<div class="text-border">{{ form.publicItem|optionsFilter(publicItemOptions,'label') || "/"}}</div></div>
              </el-col>
            </el-col>
            <el-col :span="24" style="display: none;">
              <el-col :span="8">
                <span>是否公共：<div class="text-border">{{ form.isPublic|optionsFilter(isPublicOptions,'label')|| "/" }}</div></span>
              </el-col>
              <el-col :span="16" style="display: none;">
                <span>查看范围组织：<div class="text-border">{{ form.depName || "/"}}</div> </span>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-col :span="8">
                <span>有效时间：<div class="text-border">{{ form.publicDate|dateFormat('yyyy-MM-dd') }} 至 {{ form.loseDate|dateFormat('yyyy-MM-dd')|| "/" }}</div></span>
              </el-col>
              <el-col :span="16" style="display: none;">
                <span>关键字：<label style="color:red"><div class="text-border">{{ form.key || "/"}}</div></label></span>
              </el-col>
            </el-col>
            <el-col :span="24" style="display: none;">
              <span>附件：</span>
              <ibps-attachment-selector
                ref="fileAttach"
                :value="form.fileAttach"
                multiple
                readonly
                allow-download
                :download="readonly"
                style="margin:5px;"
                @callback="data => formId = data.id"
                v-if="form.fileAttach"
              />
              <span v-else>/</span>

            </el-col>
          </el-col>
           <br/>
          <el-col :span="6" style="display: none;">
            <el-image :src="image" class="avatar" style="width: 180px; height: 180px; display: block;">
              <div slot="error">
                <i class="el-icon-picture-outline" style="font-size:180px;color: #909399;" />
              </div>
            </el-image>
            <!-- <img :src="image" class="avatar"> -->
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="10">
            <el-col :span="24">内容：<span  v-if="!form.content">/</span></el-col>
              <el-col :span="24">
                <div class="ibps-p-10" v-html="form.content"  v-if="form.content"/>
              </el-col>
          </el-row>
          </span>

          <!-- <ibps-ueditor v-model="form.content" :readonly="readonly" destroy /> -->
        </el-col>
      </el-row>

    </div>
    <div slot="footer" class="el-dialog--center">
      <ibps-toolbar
        :actions="toolbars"
        @action-event="handleActionEvent"
      />
    </div>
  </el-dialog>
</template>

<script>
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import { get } from '@/api/platform/system/news'
import { typeOptions, publicItemOptions, isPublicOptions } from './constants'
import { getFile } from '@/utils/avatar'
export default {
  components: {
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
    title: String
  },
  data() {
    return {
      formName: 'form',
      dialogVisible: this.visible,
      dialogLoading: false,
      dialogFormVisible: false, // 弹窗
      typeOptions: typeOptions,
      publicItemOptions: publicItemOptions,
      isPublicOptions: isPublicOptions,
      form: {},
      toolbars: [
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
  methods: {
    handleActionEvent({ key }) {
      switch (key) {
        case 'cancel':
          this.closeDialog()
          break
        default:
          break
      }
    },
    // 关闭当前窗口
    closeDialog() {
      this.$emit('close', false)
    },
    titleStyle(color) {
      this.$refs.title.style.color = color
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      this.dialogLoading = true
      get({
        newsId: this.formId
      }).then(response => {
        const data = response.data
        this.form = data
        if (response.data.publicItem === 'important') {
          this.titleStyle('red')
        } else {
          this.titleStyle('black')
        }

        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
      })
    }
  }

}
</script>
<style lang="scss">
.news-detail-dialog{
  .text-border{
    width:100%;
    color: #000000;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1),
    0 0 0 0 rgba(0, 0, 0, 0.1),
    0 0 0 0 rgba(0, 0, 0, 0.1),
    0 1px 0px 0 rgba(0, 0, 0, 0.1);
    min-height: 38px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
  .el-dialog__body{
    height:  calc(70vh - 110px) !important;
  }
}
</style>
