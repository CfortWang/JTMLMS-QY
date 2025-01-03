<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        class="dialog"
        @opened="openedDialog"
        @close="closeDialog"
    >
        <el-form
            ref="importForm"
            v-loading="dialogLoading"
            :element-loading-text="$t('common.loading')"
            :label-width="formLabelWidth"
            class="import-form"
            @submit.native.prevent
        >

            <el-form-item label="选择文件:" required>
                <el-upload
                    ref="upload"
                    action="https://www.bpmhome.cn/post"
                    accept=".zip"
                    :file-list="fileList"
                    :on-change="handleChange"
                    :before-upload="handleUpload"
                    :auto-upload="false"
                >
                    <el-button type="primary" icon="el-icon-upload">选择文件</el-button>
                    <div slot="tip" class="el-upload__tip"> 请导入Zip文件</div>
                </el-upload>
            </el-form-item>
            <!-- <el-form-item label="格式数据：">
        <el-switch
          v-model="options.raw"
          active-text="原始"
          inactive-text="格式化"
        />
      </el-form-item> -->
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
import ActionUtils from '@/utils/action'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        }
    },
    data () {
        return {
            formName: 'importForm',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogLoading: false,
            fileList: [],
            options: {
                raw: false
            },
            toolbars: [
                { key: 'import' },
                { key: 'cancel' }
            ]
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
            },
            immediate: true
        }
    },
    methods: {
        openedDialog () {
            this.fileList = []
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'import':
                    this.handleImport()
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleChange (file, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, 1)
            }
        },
        handleUpload (file) {
            // this.file = file
            // 判断是否是Excel
        },
        async handleImport () {
            const files = this.$refs['upload'].uploadFiles
            if (this.$utils.isEmpty(files)) {
                ActionUtils.warning('请上传要导入的文件')
                return
            }
            console.log(files[0].raw)
            this.$emit('action-event', files[0].raw, this.options)
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
            this.$refs[this.formName].resetFields()
        }
    }

}
</script>
