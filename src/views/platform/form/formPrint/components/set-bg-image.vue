<template>
  <div class="menu-tools-set-bg-image">
    <div class="title">背景设置</div>
    <el-row :gutter="10">
      <el-col :span="8">
        背景图
        <el-tooltip content="请上传与纸张长宽比例一致的背景图" placement="bottom" effect="light">
          <i class="ibps-icon ibps-icon-help" />
        </el-tooltip>
      </el-col>
      <el-col :span="16">
        <div v-if="form.file" class="item-wrapper">
          <div class="text">{{ form.file.fileName }}</div>
          <i class="ibps-icon ibps-icon-delete" @click="removeImage" />
        </div>
        <div v-else class="item-wrapper">
          <div class="text">&nbsp;</div>
          <i class="ibps-icon ibps-icon-upload" @click="uploadImage" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="ibps-pt-10">
      <el-col :span="18">
        打印背景
      </el-col>
      <el-col :span="4">
        <el-switch
          v-model="form.printable"
          :disabled="!form.file"
          size="mini"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        file: null,
        printable: false
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.form = val
        }
      },
      immediate: true,
      deep: true
    },
    form: {
      handler(val) {
        this.$emit('callback', val)
      },
      deep: true
    }
  },
  methods: {
    removeImage() {
      this.form.file = null
      this.form.printable = false
    },
    uploadImage() {
      this.$emit('upload')
    }
  }
}
</script>
<style  lang="scss">
.menu-tools-set-bg-image{
  .ibps-icon{
    cursor: pointer;
  }
  .title{
    color: #7C7C7C;
    font-size: 12px;
    margin-bottom: 8px;
  }

  .item-wrapper {
     .text {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 80%;
    }
    i{
      position: relative;
      float: right;
      right: 0;
      top: 3px;
      font-size: 16px;
      cursor: pointer
    }
    .ibps-icon-delete{
      color: #d9534f;
    }

  }

}

</style>

