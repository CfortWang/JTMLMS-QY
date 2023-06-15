<template>
    <el-dialog ref="dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" class="form-renderer-dialog" :width="width" :top="top" :title="getTitle(title)" :custom-class="customClass"  append-to-body @open="loadFormData" @close="closeDialog">
        <ibps-formrender v-if="dialogVisible && formDef" ref="formrender" :form-def="formDefData" :data="formData" :isDialog="true" :mode="mode" :readonly="editFromType == 'consult'" @load="loadFormrender" @cur-active-step="(val) => (curActiveStep = val)" />
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar :actions="editFromType != 'consult' ? toolbars : toolbarsConsult" @action-event="handleActionEvent" />
        </div>
    </el-dialog>
</template>
<script>
import ActionUtils from '@/utils/action'
import Vue from 'vue'
Vue.component('ibps-formrender', () => import('@/business/platform/form/formrender/index.vue'))

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        customClass: {
            type: String
        },
        width: {
            type: String,
            default: '80%'
        },
        top: {
            type: String,
            default: '0'
        },
        formDef: {
            // 表单定义
            type: Object
        },
        data: {
            // 表单数据
            type: Object
        },
        mode: {
            // 表单模式
            type: String
        },
        editFromType: {
            type: String,
            default: 'add'
        }
    },
    data() {
        return {
            dialogVisible: this.visible,
            formDefData: null,
            formData: {},
            formOpinionData: {},
            toolbars: [
                { key: 'confirm', label: '确定'},
                { key: 'cancel'}
            ],
            // 查阅按钮
            toolbarsConsult: [{ key: 'cancel' }],
            stepButtons: [],
            curActiveStep: 0,
            stepNum: 3,
            stepLoading: false
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
        getTitle(title) {
            let data = '添加'
            if (this.editFromType == 'add') {
                data = '添加'
            } else if (this.editFromType == 'edit') {
                data = '编辑'
            } else if (this.editFromType == 'consult') {
                data = '查阅'
            }
            let titleData = title ? ' - ' : ''
            return title + titleData + data
        },
        handleActionEvent({ key }) {
            switch (key) {
                case 'confirm':
                    this.handleConfirm(key)
                    break
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        handleConfirm(key) {
            // 验证表单是否正确
            this.validate((valid) => {
                if (valid) {
                    // 表单提交校验
                    this.formSubmitVerify((result, errorMsg) => {
                        if (!result) {
                            this.$message.closeAll()
                            return this.$message.warning(errorMsg)
                        }

                        this.$emit('action-event', key, this.getFormData())
                    })
                } else {
                    this.formErrorToast()
                }
            })
        },
        getForm() {
            return this.$refs.formrender
        },
        /**
         * 获取表单验证
         */
        validate(callback) {
            this.getForm().validate((valid, invalidFields) => {
                callback(valid, invalidFields)
            })
        },
        formErrorToast() {
            ActionUtils.saveErrorMessage()
        },
        // 处理表单提交验证
        formSubmitVerify(callback) {
            this.getForm().formSubmitVerify(callback)
        },
        /**
         * 获取表单数据
         */
        getFormData() {
            return this.getForm().getFormData()
        },

        // 关闭当前窗口
        closeDialog() {
            this.formDefData = null
            this.formData = null
            this.$emit('close', false)
        },
        loadFormData() {
            this.formDefData = JSON.parse(JSON.stringify(this.formDef))
            this.formData = JSON.parse(JSON.stringify(this.data))
        },
        loadFormrender(form) {
            const stepButtons = form.stepButtons
            if (this.$utils.isEmpty(stepButtons)) {
                return
            }
            this.stepButtons = stepButtons
            this.stepNum = form.stepNum
        },
        disabledStepButton(key) {
            if (key === 'prev') {
                return this.curActiveStep === 0
            } else {
                return this.stepNum - 1 === this.curActiveStep
            }
        },
        handleStepButtonEvent(button) {
            this.getForm().handleStepButtonEvent(button)
        }
    }
}
</script>
<style lang="scss" >
.form-renderer-dialog {
    .el-dialog__body {
        padding: 10px 0 5px 0;
    }
    .el-dialog__headerbtn {
        z-index: 99999;
    }
    @media print {
        .el-dialog__headerbtn {
            display: none !important;
        }
        .hidden-print {
            padding: 0;
            margin: 0;
        }
    }
}
</style>
