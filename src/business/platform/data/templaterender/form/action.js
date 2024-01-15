
import { saveFormData } from '@/api/platform/data/dataTemplate'
import { startFlowFromEdit } from '@/api/platform/bpmn/bpmInst'
import Print from '@/utils/print'

export default {
    methods: {
        emitEventHandler (actionKey, args) {
            const action = args && args.attributes ? args.attributes.button_type || actionKey : actionKey
            this.actionName = actionKey
            switch (action) {
                case 'close': // 关闭窗口
                    this.closeDialog()
                    break
                case 'save':
                    this.handleSave()
                    break
                case 'print':
                    this.handlePrint()
                    break
                case 'sefStartFlow':
                    this.handleStartFlowFrom(args && args.attributes ? args.attributes.deflow : '')
                    break
                case 'custom':
                    if (this.actionName === 'dingDanKaiLizanCun') {
                        this.handleSave()
                        break
                    }
                default:
                    break
            }
        },
        handleStartFlowFrom (flowKey) {
            // 表单提交校验
            if (this.$utils.isEmpty(flowKey)) {
                // this.$message.warning('请检查是否绑定流程！')
                this.bpmDefDialogVisible = true
                return
            }
            // 验证表单是否正确
            this.validate(valid => {
                if (valid) {
                    // 表单提交校验
                    this.formSubmitVerify((result, errorMsg) => {
                        if (!result) {
                            this.$message.closeAll()
                            return this.$message.warning(errorMsg)
                        }
                        if (flowKey) {
                            this.$confirm('确定启动流程吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.handleStartFlowFromEdit(flowKey)
                            }).catch(() => {})
                        } else {
                            this.bpmDefDialogVisible = true
                        }
                    })
                } else {
                    this.formErrorToast()
                }
            })
        },
        handleDialogActionEvent (key, data) {
            if (key === 'clean') {
                this.bpmDefValue = {}
            } else if (key === 'confirm') {
                this.handleStartFlowFromEdit(data.defKey)
            }
        },
        handleStartFlowFromEdit (flowKey) {
            const formData = JSON.stringify(this.getFormData())
            startFlowFromEdit({
                data: formData,
                flowKey: flowKey,
                pk: this.pkValue || ''
            }).then(response => {
                this.bpmDefDialogVisible = false
                this.$message({
                    message: '流程启动成功！',
                    type: 'success'
                })
                // 后置事件
                this.afterScript(this.actionName, {
                    data: response.data,
                    variables: response.variables
                }, () => {
                    this.callbackPage()
                })
            }).catch(() => {
                this.bpmDefDialogVisible = false
            })
        },
        // 保存
        handleSave () {
            // 验证表单是否正确
            this.validate(valid => {
                if (valid) {
                    // 表单提交校验
                    this.formSubmitVerify((result, errorMsg) => {
                        if (!result) {
                            this.$message.closeAll()
                            return this.$message.warning(errorMsg)
                        }
                        // 保存数据
                        this.saveData()
                    })
                } else {
                    this.formErrorToast()
                }
            })
        },
        // 保存数据
        saveData () {
            // 表单数据
            const formData = this.getFormData()
            const jsonData = {
                boCode: this.boCode,
                version: this.version,
                formKey: this.formKey,
                pk: this.pkValue,
                data: JSON.stringify(this.$common.replaceNullWithEmpty(formData))
            }
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            saveFormData(jsonData).then(response => {
                loading.close()
                this.$alert(`保存表单成功！`, {
                    showClose: false
                }).then(() => {
                    // 后置事件
                    this.afterScript(this.actionName, {
                        data: response.data,
                        variables: response.variables
                    }, () => {
                        this.callbackPage()
                    })
                }).catch(() => {
                })
            }).catch(() => {
                loading.close()
            })
        },
        /**
         * 打印
         */
        handlePrint () {
            if (this.$utils.isNotEmpty(this.printTemplateId)) {
                // 打开打印模版页面
                this.formPrintTemplateDialogVisible = true
            } else {
                //  window.print()
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('common.loading')
                })
                setTimeout(() => {
                    Print(this.$refs.formrender.$el, {
                        title: '',
                        callback: () => {
                            loading.close()
                        }
                    })
                }, 300)
            }
        }

    }
}
