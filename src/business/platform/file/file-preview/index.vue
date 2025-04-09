<template>
    <ibps-file-viewer
        :visible.sync="dialogVisible"
        :title="title"
        :url="url"
        :url-list="urlList"
        :option-file="optionFile"
        :file-ext="fileExt"
        @close="$emit('close', false)"
    />
</template>
<script>
import IbpsFileViewer from '@/components/ibps-file-viewer'
import { previewFile } from '@/api/platform/file/attachment'
import { imageType } from '@/components/ibps-file-viewer/constants/index.js'

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
        fileList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            dialogVisible: false,
            title: '',
            fileId: '',
            fileExt: '',
            fileType: '',
            url: '',
            urlList: []
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
                if (this.dialogVisible) {
                    this.title = this.file.fileName
                    this.fileId = this.file.id
                    this.fileExt = this.file.ext
                    this.url = previewFile(this.file.id) || ''
                    // 过滤出图片url
                    this.urlList = this.fileList.filter(i => imageType.includes(i.ext)).map(ii => previewFile(ii.id) || '') || []
                }
            },
            immediate: true
        }
    }

}
</script>
