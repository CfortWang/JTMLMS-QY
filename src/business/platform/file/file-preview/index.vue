<template>
 <ibps-file-viewer
    :visible.sync="dialogVisible"
    :title="title"
    :url="url"
    :optionFile="optionFile"
    :file-ext="fileExt"
    @close="$emit('close', false)"
  />
</template>
<script>
import IbpsFileViewer from '@/components/ibps-file-viewer'
import { previewFile } from '@/api/platform/file/attachment'
export default {
  components: {
    IbpsFileViewer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object
    },
    optionFile: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      title: '',
      fileId: '',
      fileExt: '',
      fileType: '',
      url: ''
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.title = this.file.fileName
          this.fileId = this.file.id
          this.fileExt = this.file.ext
          this.url = previewFile(this.file.id) || ''
        }
      },
      immediate: true
    }
  }

}
</script>
