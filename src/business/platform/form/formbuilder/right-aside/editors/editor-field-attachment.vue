<template>
  <div class="panel panel-default bowen-options">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">

      <el-form-item>
        <template slot="label">文件编辑：</template>
        <el-radio-group v-model="fieldOptions.operation_status">
         <el-radio label="none" >不操作</el-radio>
          <!-- <el-radio label="saveDel">替换</el-radio> -->
          <el-radio label="saveAdd" >新增</el-radio>
           </el-radio-group>
           </br>
           用编辑的文件'替换'原文件
           </br>
           或通过选择文件模板，'新增'文件
      </el-form-item>


      <el-form-item>
        <template slot="label">是否多选<help-tip prop="multiple" /></template>
        <el-switch
          v-model="fieldOptions.multiple"
          @change="setDefaultValue"
        />
      </el-form-item>
      <el-form-item v-if="fieldOptions.multiple" label-width="120px">
        <template slot="label">
          <div class="ibps-ellipsis">最大上传数量<help-tip prop="fileQuantity" /></div>
        </template>
        <el-input-number v-model="fieldOptions.max_file_quantity" :min="1" style="width:100%;" />
      </el-form-item>
      <el-form-item label-width="120px">
        <template slot="label">
          <div class="ibps-ellipsis">文件大小(单个)<help-tip prop="fileSize" /></div>
        </template>
        <el-input v-model="fieldOptions.max_file_size" placeholder="文件大小(单个)">
          <template slot="append">M</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">上传类型 <help-tip prop="fileType" /></template>
        <el-select v-model="fieldOptions.media_type" style="width:100%;">
          <el-option value="" label="不限制" />
          <el-option v-for="fileType in fileTypeOptions" :key="fileType.value" :value="fileType.value" :label="fileType.label" />
        </el-select>
        <el-input v-if="fieldOptions.media_type==='custom'" v-model="media" type="textarea" rows="1" resize="none" autosize placeholder="自定义文件类型,逗号[,]分割" style="padding-top:5px;" />
      </el-form-item>

      <el-form-item>
        <template slot="label">
          允许下载
        </template>
        <el-switch v-model="fieldOptions.download" />
      </el-form-item>
      <el-form-item>
        <template slot="label">上传方式<help-tip prop="uploadType" /></template>
        <el-select v-model="fieldOptions.uploadType" style="width:100%;">
          <el-option
            v-for="item in uploadTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">存储格式<help-tip prop="fileStore" /></template>
        <el-select v-model="fieldOptions.store" style="width:100%;">
          <el-option
            v-for="store in fileStoreOptions"
            :key="store.value"
            :value="store.value"
            :label="store.label"
          />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { fileTypeOptions, fileStoreOptions, uploadTypeOptions } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      fileTypeOptions,
      fileStoreOptions,
      uploadTypeOptions,
      media: this.fieldItem.field_options.media
    }
  },
  computed: {
    mediaValue: {
      get() {
        return this.fieldOptions.media || ''
      },
      set(val) {
        this.fieldItem.field_options.media = this.media = val
      }
    }
  },
  watch: {
    media: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.mediaValue = this.fieldItem.field_options.media = val || ''
        }
      },
      immediate: true
    }
  }
}
</script>
