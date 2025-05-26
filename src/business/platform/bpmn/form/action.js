import { doEndProcess, doAddSignTask, lock, unlock, suspendProcess, recoverProcess } from '@/api/platform/bpmn/bpmTask'
import { agree, oppose, abandon, reject, rejectToStarter, rejectToPrevious, bpmTaskSave } from '@/api/platform/bpmn/bpmTask'
import { startFlow, saveDraft } from '@/api/platform/bpmn/bpmInst'
import { saveFormData } from '@/api/platform/data/dataTemplate'
import { changeCompleteTime, replenishSnapshot } from '@/api/platform/bpmn/bpmInstHis'
import Print from '@/utils/print'

export default {
    methods: {
        // 内嵌url表单,外部url表单 【自定义】
        emitButtonEventHandler (actionName, args) {
            // 前置事件
            this.beforeScript(actionName, (result) => {
                if (result) {
                    return this.emitEventHandler(actionName, args)
                }
            })
        },
        // 设置是否过审的状态
        setData (title) {
            let data = title
            if (!title) {
                // 获取当前流程步骤名
                data = '已' + this.getFormEL().formDefData.flowName
            }
            this.getFormEL().setData('shiFouGuoShen', data)
        },
        emitEventHandler (actionName, args) {
            const this_ = this
            this.actionName = actionName
            const buttonType = args && args.attributes ? args.attributes.button_type || actionName : actionName
            this.actionTitle = args && args.attributes ? args.attributes.label : null
            this.submitFormOpinion = this.getFormOpinionData()
            switch (buttonType) {
                case 'agree':// 同意
                    this.setData()
                    // if (this.isHide()) {
                    this.handleDirectActionEvent(actionName)
                    // } else {
                    //     this.agreeDialogVisible = true
                    // }
                    break
                case 'oppose':// 反对
                    this_.$confirm(
                        `确定进行 [ ${args.attributes.label} ] 操作 ？`,
                        '提示:',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    ).then(() => {
                        // if (this.isHide()) {
                        this.setData('未同意')
                        this.handleDirectActionEvent(actionName)
                        // } else {
                        //     this.agreeDialogVisible = true
                        // }
                    }).catch(() => { })
                    break
                case 'abandon':// 弃权
                    this_.$confirm(
                        `确定进行 [ 弃权 ] 操作 ？`,
                        '提示:',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    ).then(() => {
                        if (this.isHide()) {
                            this.handleDirectActionEvent(actionName)
                        } else {
                            this.agreeDialogVisible = true
                        }
                    }).catch(() => { })
                    break
                case 'close': // 关闭窗口
                    this.closeDialog()
                    break
                case 'flowImage':// 流程图
                    this.flowDiagramVisible = true
                    break
                case 'approvalHistory': // 审批历史
                    this.approvalHistoryVisible = true
                    break
                case 'instanceDetail': // 流程实例明细
                    this.instanceDetailVisible = true
                    break
                case 'startFlow': // 启动流程
                    if (this.actionTitle === '同意并结束' || this.actionTitle === '提交并结束') {
                        this.setData('已完成')
                    } else {
                        this.setData('已编制')
                    }
                    // this.setData('已编制')
                    this.handleStartFlow()
                    break
                case 'saveDraft': // 保存草稿
                    this.setData('已暂存')
                    this.handleSaveDraft()
                    break
                case 'rejectToPrevious':// 驳回上一步
                case 'rejectToStart':// 驳回发起人
                case 'reject':// 驳回
                    this.setData('已退回')
                    // if (this.isBpmOpinionHide && actionName === 'rejectToPrevious') {
                    //     this.handleDirectActionEvent(actionName)
                    // } else {
                    //     this.rejectDialogVisible = true
                    // }
                    this.rejectDialogVisible = true
                    break
                case 'delegate':// 转办
                    this.delegateReadonly = false
                    this.delegateDialogVisible = true
                    break
                case 'delegateDetail':// 转办/代理明细
                    this.setData()
                    this.delegateReadonly = true
                    this.delegateDialogVisible = true
                    break
                case 'addSign':// 补签
                    this.addSignTaskDialogVisible = true
                    break
                case 'endProcess':// 终止流程
                    this.setData('已终止')
                    this.handleEndProcess()
                    break
                case 'print':// 打印
                    this.handlePrint()
                    break
                case 'lock':// 锁定
                    this.handleLock()
                    break
                case 'unlock':// 解锁
                    this.handleUnlock()
                    break
                case 'forceUnlock':// 强制解锁
                    this.handleForceUnlock()
                    break
                case 'suspendProcess':// 挂起流程
                    this.handleSuspendProcess()
                    break
                case 'recoverProcess':// 撤回流程
                    this.handleRecoverProcess()
                    break
                case 'save':// 节点按钮设置-保存
                    // this.setData('已暂存')
                    this.handleSave()
                    break
                case 'timeModification':// 节点按钮设置-修改时间
                    this.handleTimeModification()

                    break
                default:
                    break
            }
        },
        /**
         * 是否隐藏
         */
        isHide () {
            return (this.isBpmOpinionHide && this.attributes.isHidePath) || (this.attributes.isCommonJumpType && this.attributes.isHideOpinion && this.attributes.isHidePath) || (this.attributes.isEnd && this.attributes.isHideOpinion)
        },
        // 是否保存[节点-按钮设置-保存]
        handleSave () {
            const formData = this.getFormData()
            const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            if (!formData) return
            const replaceFormData = this.$common.replaceNullWithEmpty(formData)
            bpmTaskSave({
                taskId: this.taskId,
                data: JSON.stringify(replaceFormData),
                opinion
            }).then(response => {
                // 后置事件
                this.afterScript(this.actionName, {
                    data: response.data,
                    variables: response.variables
                }, () => {
                    loading.close()
                    this.$alert(`已保存表单内容！`, {
                        showClose: false
                    }).then(() => {
                        // 回调上个页面
                        // this.callbackPage()
                    }).catch(() => { })
                })
            })
        },
        /**
         * 处理启动流程
         */
        handleStartFlow () {
            const firstNodeUserAssign = this.attributes.firstNodeUserAssign || false
            if (firstNodeUserAssign) {
                const formData = this.getFormData()
                if (!formData) return
                this.submitFormData = this.$common.replaceNullWithEmpty(formData)
                this.startFlowDialogVisible = true
            } else {
                this.saveStartFlow()
            }
        },
        /**
         * 保存启动流程
         * @param {*}
         */
        saveStartFlow (params = {}) {
            const formData = this.getFormData()
            if (!formData) return
            // 暂存后直接提交，已有数据ID
            if (this.$utils.isNotEmpty(this.bizKey)) {
                formData.id = this.bizKey || ''
            }
            const jsonData = {
                defId: this.defId,
                version: this.version || '0',
                data: JSON.stringify(this.$common.replaceNullWithEmpty(formData))
            }
            if (this.$utils.isNotEmpty(params.nodeUsers)) {
                jsonData.nodeUsers = JSON.stringify(params.nodeUsers) || ''
            }
            if (this.$utils.isNotEmpty(params.destination)) {
                jsonData.destination = params.destination || ''
            }

            if (this.$utils.isNotEmpty(this.proInstId) && !this.copyFlow) {
                jsonData.proInstId = this.proInstId || ''
            }

            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            // 1、直接启动
            startFlow(jsonData).then(response => {
                const { bizKey = '', proInstId = '' } = response.variables || {}
                // this.createSnapshot(bizKey, proInstId)
                this.startFlowDialogVisible = false
                // 后置事件
                this.afterScript(this.actionName, {
                    data: response.data,
                    variables: response.variables
                }, () => {
                    loading.close()
                    this.$alert(`启动成功！`, {
                        showClose: false
                    }).then(() => {
                        // 回调上个页面
                        this.callbackPage()
                    }).catch(() => { })
                })
            }).catch(() => {
                loading.close()
            })
        },
        /**
         * 保存草稿
         */
        handleSaveDraft () {
            // 表单数据
            const formData = this.getFormData()
            if (!formData) return

            if (this.$utils.isNotEmpty(this.bizKey)) {
                formData.id = this.bizKey || ''
            }

            const jsonData = {
                defId: this.defId,
                version: this.version || '',
                data: JSON.stringify(this.$common.replaceNullWithEmpty(formData))
            }
            if (this.$utils.isNotEmpty(this.proInstId) && !this.copyFlow) {
                jsonData.proInstId = this.proInstId || ''
            }

            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            saveDraft(jsonData).then(response => {
                const { proInstId, bizKey } = response.variables || {}
                this.proInstId = proInstId
                this.bizKey = bizKey
                // 后置事件
                this.afterScript(this.actionName, {
                    data: response.data,
                    variables: response.variables
                }, () => {
                    loading.close()
                    this.$alert(`保存成功！`, {
                        showClose: false
                    }).then(() => {
                        // 回调上个页面
                        // this.callbackPage()
                    }).catch(() => { })
                })
            }).catch(() => {
                loading.close()
            })
        },
        /**
         * 直接同意流程
         * @param {*} actionName
         */
        handleDirectActionEvent (actionName) {
            const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
            this.handleActionEvent(actionName, {
                opinion: opinion
            })
        },
        /**
         * 处理按钮事件
         * @param {*} actionName
         * @param {*} params
         */
        handleActionEvent (actionName, params) {
            if (actionName === 'agree' || actionName === 'oppose' || actionName === 'abandon' || actionName === 'rejectToPrevious' || actionName === 'rejectToStart' || actionName === 'reject') {
                this.handleComplete(actionName, params)
            } else if (actionName === 'endProcess') {
                this.handleDoEndProcess(params)
            } else if (actionName === 'addSign') {
                this.handleAddSignTask(params)
            }
        },
        handleComplete (actionName, params = {}) {
            const formData = this.getFormData()
            if (!formData) return
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            params.taskId = this.taskId
            params.data = JSON.stringify(this.$common.replaceNullWithEmpty(formData))

            if (actionName === 'agree') {
                agree(params).then(response => {
                    this.handleResponse(actionName, loading, response)
                    // this.createSnapshot()
                }).catch(() => {
                    loading.close()
                })
            } else if (actionName === 'oppose') {
                oppose(params).then(response => {
                    this.handleResponse(actionName, loading, response)
                }).catch(() => {
                    loading.close()
                })
            } else if (actionName === 'abandon') {
                abandon(params).then(response => {
                    this.handleResponse(actionName, loading, response)
                }).catch(() => {
                    loading.close()
                })
            } else if (actionName === 'rejectToPrevious') {
                rejectToPrevious(params).then(response => {
                    this.handleResponse(actionName, loading, response, params)
                }).catch(() => {
                    loading.close()
                })
            } else if (actionName === 'rejectToStart') {
                rejectToStarter(params).then(response => {
                    this.handleResponse(actionName, loading, response, params)
                }).catch(() => {
                    loading.close()
                })
            } else if (actionName === 'reject') {
                reject(params).then(response => {
                    this.handleResponse(actionName, loading, response, params)
                }).catch(() => {
                    loading.close()
                })
            }
        },
        handleResponse (actionName, loading, response, params) {
            // 关闭窗口
            if (actionName === 'agree' || actionName === 'oppose' || actionName === 'abandon') {
                this.agreeDialogVisible = false
            } else if (actionName === 'rejectToPrevious' || actionName === 'rejectToStart' || actionName === 'reject') {
                this.rejectDialogVisible = false
            }
            if (actionName === 'agree') {
                // this.createSnapshot()
            }
            this.getFormEL().rejectParams = params || {}
            // 后置事件
            this.afterScript(this.actionName, {
                data: response.data,
                variables: response.variables
            }, () => {
                loading.close()
                this.$alert(response.message, {
                    showClose: false
                }).then(() => {
                    // 回调上个页面
                    this.callbackPage()
                }).catch(() => { })
            })
        },
        handleEndProcess () {
            if (this.isBpmOpinionHide) {
                this.$confirm('确定终止流程!', '提示', {
                    type: 'warning'
                }).then(() => {
                    const opinion = this.hasFormOpinion() ? this.getFormOpinionData() : ''
                    this.handleDoEndProcess({
                        opinion: opinion
                    })
                }).catch(() => { })
            } else {
                this.approveDialogVisible = true
            }
        },
        /**
         * 处理终止任务
         * @param {*} params
         */
        handleDoEndProcess (params) {
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            doEndProcess({
                taskId: this.taskId ? this.taskId : this.endProcessTaskId,
                endReason: params.opinion
            }).then(response => {
                this.approveDialogVisible = false
                // 更改数据状态为已终止
                const { code = '' } = this.getFormEL().formDefData || {}
                const { id = '' } = this.getFormEL().formData || {}
                if (!id || !code) {
                    return
                }
                this.updateState(id, code, '已终止', null)
                // 后置事件
                this.afterScript(this.actionName, {
                    data: response.data,
                    variables: response.variables
                }, () => {
                    loading.close()
                    this.$alert(response.message, {
                        showClose: false
                    }).then(() => {
                        // 回调上个页面
                        this.callbackPage()
                    })
                })
            }).catch(() => {
                loading.close()
            })
        },
        /**
         * 补签
         * @param {*} params
         */
        handleAddSignTask (params) {
            const loading = this.$loading({
                lock: true,
                text: this.$t('common.saving')
            })
            doAddSignTask({
                taskId: this.taskId,
                addSignTaskUserId: params.addSignTaskUserId,
                messageType: params.messageType,
                addReason: params.opinion
            }).then(response => {
                this.addSignTaskDialogVisible = false
                // 后置事件
                this.afterScript(this.actionName, {
                    data: response.data,
                    variables: response.variables
                }, () => {
                    loading.close()
                    this.$alert(response.message, {
                        showClose: false
                    }).then(() => {
                        // 回调上个页面
                        this.callbackPage()
                    })
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
                this.submitFormData = this.getFormData()
                // 打开打印模版页面
                this.formPrintTemplateDialogVisible = true
            } else {
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
        },
        /**
         * 锁定任务
         */
        handleLock () {
            this.$confirm('确定锁定任务!', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('common.saving')
                })
                lock({ taskId: this.taskId }).then(response => {
                    // 后置事件
                    this.afterScript(this.actionName, {
                        data: response.data,
                        variables: response.variables
                    }, () => {
                        loading.close()
                        this.$alert(`锁定任务成功！`, {
                            showClose: false
                        }).then(() => {
                            // 回调上个页面
                            this.callbackPage()
                        }).catch(() => { })
                    })
                }).catch(() => {
                    loading.close()
                })
            }).catch(() => { })
        },
        /**
         * 解锁任务
         */
        handleUnlock () {
            this.$confirm('确定解锁任务!', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('common.saving')
                })
                unlock({ taskId: this.taskId }).then(response => {
                    // 后置事件
                    this.afterScript(this.actionName, {
                        data: response.data,
                        variables: response.variables
                    }, () => {
                        loading.close()
                        this.$alert(`解锁任务成功！`, {
                            showClose: false
                        }).then(() => {
                            // 回调上个页面
                            this.callbackPage()
                        }).catch(() => { })
                    })
                }).catch(() => {
                    loading.close()
                })
            }).catch(() => { })
        },
        /**
         * 强制解锁任务
         */
        handleForceUnlock () {
            this.$confirm('确定强制解锁任务!', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('common.saving')
                })
                unlock({ taskId: this.taskId }).then(response => {
                    // 后置事件
                    this.afterScript(this.actionName, {
                        data: response.data,
                        variables: response.variables
                    }, () => {
                        loading.close()
                        this.$alert(`强制解锁任务成功！`, {
                            showClose: false
                        }).then(() => {
                            // 回调上个页面
                            this.callbackPage()
                        }).catch(() => { })
                    })
                }).catch(() => {
                    loading.close()
                })
            }).catch(() => { })
        },
        /**
         * 挂起任务
         */
        handleSuspendProcess () {
            this.$confirm('确定挂起任务', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('common.saving')
                })
                suspendProcess({ taskId: this.taskId }).then(response => {
                    // 后置事件
                    this.afterScript(this.actionName, {
                        data: response.data,
                        variables: response.variables
                    }, () => {
                        loading.close()
                        this.$alert(`挂起任务成功！`, {
                            showClose: false
                        }).then(() => {
                            // 回调上个页面
                            this.callbackPage()
                        }).catch(() => { })
                    })
                }).catch(() => {
                    loading.close()
                })
            }).catch(() => { })
        },
        /**
         * 恢复任务
         */
        handleRecoverProcess () {
            this.$confirm('确定恢复任务', '提示', {
                type: 'warning'
            }).then(() => {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('common.saving')
                })
                recoverProcess({
                    taskId: this.taskId
                }).then(response => {
                    // 后置事件
                    this.afterScript(this.actionName, {
                        data: response.data,
                        variables: response.variables
                    }, () => {
                        loading.close()
                        this.$alert(`恢复任务成功！`, {
                            showClose: false
                        }).then(() => {
                            // 回调上个页面
                            this.callbackPage()
                        })
                    })
                }).catch(() => {
                    loading.close()
                })
            }).catch(() => {

            })
        },
        async createSnapshot (bizKey, proId) {
            const { code = '', name = '' } = this.getFormEL().formDefData || {}
            const { proInstId = '' } = this.getFormEL().params || {}
            const instId = proId || proInstId
            const id = bizKey || this.getFormEL().formData.id
            if (!code) {
                return
            }
            const sql = `select * from t_lcidglbdbb where tablekey_ = '${code}' and ti_jiao_kuai_zhao = '是' and gui_dang_lei_xing = 'process' and (liu_cheng_xuan_ze = (select PROC_DEF_KEY_ from ibps_bpm_inst where id_ = '${instId}' limit 1) or liu_cheng_xuan_ze = (select PROC_DEF_KEY_ from ibps_bpm_inst_his where id_ = '${instId}' limit 1))`
            const { first = '' } = this.$store.getters.level
            this.$common.request('sql', sql).then(async res => {
                const { data = [] } = res.variables || {}
                // 轮询流程是否结束，流程未结束不生成快照，每2秒查询一次，最多等待10秒钟
                let timeout = 10000
                const intervalTime = 2000
                while (!(await this.isFinish(proId || proInstId))) {
                    timeout -= intervalTime
                    if (timeout <= 0) {
                        // 超时，流程还未结束，结束生成快照
                        console.log('流程未结束，无法生成快照')
                        return
                    }
                    // 等待一段时间后再次查询
                    await new Promise(resolve => setTimeout(resolve, intervalTime))
                }
                if (!data.length) {
                    this.updateState(id, code, '已完成', null)
                    return
                }
                const paths = data[0].bao_biao_lu_jing_ ? data[0].bao_biao_lu_jing_.split(',') : []
                if (!paths.length) {
                    this.$message.error('未配置快照路径！')
                    return
                }
                // 延迟生成快照，避免数据获取失败
                setTimeout(() => {
                    Promise.all(paths.map(path => {
                        const url = this.$getReportFile(path, `id_=${id}&org_=${first}`)
                        const fileName = name + this.$common.getDateNow(16, 'string')
                        console.log(url, fileName)
                        return this.$common.snapshoot({
                            url,
                            name: fileName,
                            type: 'pdf'
                        })
                    })).then(results => {
                        const ids = results.map(result => result.data.id)
                        if (!ids.length) {
                            this.$message.error('生成快照失败！')
                        }
                        const fileParams = ids.length ? { kuai_zhao_: ids.join(',') } : {}
                        this.updateState(id, code, '已完成', fileParams)
                    }).catch(() => {
                        this.$message.error('提交快照生成失败！')
                        this.updateState(id, code, '已完成')
                    })
                }, 300)
            })
        },
        // 判断流程是否结束
        async isFinish (id) {
            const sql = `select * from ibps_bpm_inst_his where id_ = '${id}'`
            const res = await this.$common.request('sql', sql)
            const { data = [] } = res.variables || {}
            return data.length > 0
        },
        // 更新数据状态
        updateState (id, code, state, fileParams) {
            const params = {
                tableName: `t_${code}`,
                updList: [{
                    where: {
                        id_: id
                    },
                    param: {
                        shi_fou_guo_shen_: state,
                        ...fileParams
                    }
                }]
            }
            this.$common.request('update', params)
        },
        // 修改流程时间

        async handleTimeModification () {
            // 获取表单数据
            const { code = '', name = '' } = this.getFormEL().formDefData || {}
            const currentFormData = this.$common.replaceNullWithEmpty(this.getFormData())
            const jsonData = {
                boCode: code,
                version: 0,
                formKey: this.dataResultitem.formKey,
                pk: this.dataResultitem.bizKey,
                data: JSON.stringify(currentFormData),
                // 接口新增参数，是否记录操作日志
                addLog: true
            }

            // 获取流程意见数据
            const { opinionList, formOpinionNodeData } = this.formParams.formOpinionData || {}
            const snapshot = { id: this.instanceId_ }

            if (!this.timeModification_) {
                this.timeModification_ = true
                return
            }

            // 检查数据变更状态
            const isFormDataChanged = JSON.stringify(this.$common.replaceNullWithEmpty(this.formDataBF)) !== JSON.stringify(currentFormData)
            const isOpinionChanged = JSON.stringify(opinionList) !== JSON.stringify(this.opinionListBF)

            const opinionNodeList = Object.values(formOpinionNodeData).filter(Array.isArray).flat()
            // 根据变更状态执行相应操作
            if (!isFormDataChanged && isOpinionChanged) {
                await this.timeModify(opinionNodeList)
            } else if (isFormDataChanged) {
                await this.saveData(jsonData, isOpinionChanged, opinionNodeList, snapshot)
            }
        },
        // 保存流程数据生成快照
        async timeModify (data) {
            try {
                const response = await changeCompleteTime(data)
                if (response.state === 200) {
                    this.$message.success('修改成功！')
                    this.callbackPage()
                } else {
                    this.$message.error(response.message)
                }
            } catch (error) {
                console.error('修改时间失败:', error)
            }
        },
        // 保存表单数据生成快照
        async saveData (data, sflc, opinionList, snapshot) {
            await saveFormData(data).then(response => {
                if (sflc) {
                    this.timeModify(opinionList)
                } else {
                    this.repleceSnapshot(snapshot)
                }
            }).catch(() => {
            })
        },

        // 生成快照
        async repleceSnapshot (data) {
            await replenishSnapshot(data).then(response => {
                if (response.state === 200) {
                    this.$message.success('生成快照成功！')
                    this.callbackPage()
                } else {
                    this.$message.error(response.message)
                }
            }).catch(() => {
            })
        }

    }
}
