<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        class="licence-dialog"
        @close="closeDialog"
    >
        <el-form
            ref="updateLicence"
            v-loading="dialogLoading"
            :model="formModel"
            :rules="rules"
            :element-loading-text="$t('common.loading')"
            :label-width="formLabelWidth"
            @submit.native.prevent
        >
            <el-form-item prop="licenceKey">
                <el-input
                    ref="input"
                    v-model="formModel.licenceKey"
                    type="textarea"
                    rows="8"
                    maxlength="4000"
                    show-word-limit
                    required
                    placeholder="请填写开发方提供的许可证"
                />
            </el-form-item>
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

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '更新许可证'
        },
        categoryKey: String
    },
    data () {
        return {
            formName: 'updateLicence',
            formLabelWidth: '0px',
            dialogVisible: this.visible,
            dialogLoading: false,
            formModel: {
                licenceKey: ''
            },
            rules: {
                licenceKey: [
                    {
                        required: true,
                        message: this.$t('validate.required')
                    }
                ]
            },
            toolbars: [
                { key: 'save', label: '更新' },
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
        handleActionEvent ({ key }) {
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
        handleSave () {
            this.$refs[this.formName].validate(valid => {
                if (valid) {
                    this.saveData()
                } else {
                    this.$message.warning('请填写开发方提供的许可证信息！')
                }
            })
        },
        // 提交保存数据
        saveData () {
            this.$message.success('更新许可证成功，请重新登录!')
            this.closeDialog()
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
            this.$refs[this.formName].resetFields()
        }
    }
}
</script>
<style lang="scss" scoped>
    .licence-dialog {
        ::v-deep .el-dialog {
            margin-top: calc((100vh - 288px) / 2.5) !important;
            .el-dialog__body {
                .el-form {
                    padding: 10px;
                }
            }
        }
    }
</style>
