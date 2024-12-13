import { upperFirst } from 'lodash'
import FormrenderResponseButton from '@/business/platform/form/formrender/button'

var BpmnButton
window.BpmnButton = BpmnButton = function (options) {
    this.response_buttons = []
    this.initButtons(options)
}

BpmnButton.prototype = {
    initButtons: function ({ buttons, params = {}}) {
        const suspendState = params.suspendState
        for (var i = 0; i < buttons.length; i++) {
            const rf = buttons[i]
            const buttonType = rf.button_type = rf[BpmnButton.key.BUTTON_TYPE]
            rf.alias = rf[BpmnButton.key.BUTTON_ALIAS]
            rf.label = rf[BpmnButton.key.LABEL]

            if ((buttonType === 'suspendProcess' && suspendState === '2') || // 挂起
                (buttonType === 'recoverProcess' && suspendState === '1')) { // 恢复
                continue
            }
            if (
                buttonType === 'startCommu' || // 屏蔽-沟通
                buttonType === 'commu' || // 屏蔽-沟通
                buttonType === 'startTrans' || // 屏蔽-流转
                buttonType === 'agreeTrans' || // 屏蔽-同意流转
                buttonType === 'opposeTrans') { // 屏蔽-反对流转
                continue
            }

            let button = null
            try {
                button = new BpmnButton.Models['ResponseButton' + (upperFirst(buttonType))](rf, params)
            } catch (error) {
                console.error(error)
                button = new BpmnButton.Models['ResponseButtonCustom'](rf, params)
            }

            // 初始化按钮事件
            this.response_buttons.push(button)
        }
    }
}

BpmnButton.Models = {}
BpmnButton.BUTTON_TYPES = ['close', 'startFlow', 'lock', 'unlock', 'forceUnlock', 'agree', 'oppose', 'abandon', 'saveDraft', 'reject', 'endProcess', 'delegate', 'addSign', 'startCommu', 'commu', 'startTrans', 'flowImage', 'timeModification', 'timeModificationNo', 'approvalHistory', 'opposeTrans', 'agreeTrans', 'suspendProcess', 'recoverProcess', 'print', 'rejectToStart', 'revoke', 'save', 'custom']
BpmnButton.key = {
    BUTTON_ALIAS: 'key',
    BUTTON_TYPE: 'alias',
    LABEL: 'name'
}

BpmnButton.VERSION = '3.0.0'

/**
 * 流程表单按钮
 */
BpmnButton.Models.ResponseButton = FormrenderResponseButton.extend({
    style: 'primary',
    plain: true,
    aliasKey: BpmnButton.key.BUTTON_ALIAS
})

// 关闭
BpmnButton.Models.ResponseButtonClose = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-close',
    style: 'default',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

/**
 * 启动流程
 */
BpmnButton.Models.ResponseButtonStartFlow = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-send',
    action (btn) {
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
                    this.handleActionEvent(btn.getAlias(), btn)
                })
            } else {
                this.formErrorToast()
            }
        })
    }

})
// 保存草稿
BpmnButton.Models.ResponseButtonSaveDraft = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-save',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 锁定
BpmnButton.Models.ResponseButtonLock = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-lock',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 解锁
BpmnButton.Models.ResponseButtonUnlock = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-unlock-alt',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 强制解锁
BpmnButton.Models.ResponseButtonForceUnlock = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-unlock',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 同意
BpmnButton.Models.ResponseButtonAgree = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-check-square-o',
    action (btn) {
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
                    this.handleActionEvent(btn.getAlias(), btn)
                })
            } else {
                this.formErrorToast()
            }
        })
    }
})

// 反对
BpmnButton.Models.ResponseButtonOppose = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-close',
    action (btn) {
        this.formOpinionValidate((valid) => {
            if (valid) {
                this.handleActionEvent(btn.getAlias(), btn)
            } else {
                this.formErrorToast('请填写审批意见！')
            }
        })
    }
})

// 弃权
BpmnButton.Models.ResponseButtonAbandon = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-hand-o-up',
    action (btn) {
        this.formOpinionValidate((valid) => {
            if (valid) {
                this.handleActionEvent(btn.getAlias(), btn)
            } else {
                this.formErrorToast('请填写审批意见！')
            }
        })
    }
})
// 驳回
BpmnButton.Models.ResponseButtonReject = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-lastfm',
    action (btn) {
        this.formOpinionValidate((valid) => {
            if (valid) {
                this.handleActionEvent(btn.getAlias(), btn)
            } else {
                this.formErrorToast('请填写审批意见！')
            }
        }, true)
    }
})
// 驳回发起人
BpmnButton.Models.ResponseButtonRejectToStart = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-send',
    action (btn) {
        this.formOpinionValidate((valid) => {
            if (valid) {
                this.handleActionEvent(btn.getAlias(), btn)
            } else {
                this.formErrorToast('请填写审批意见！')
            }
        }, true)
    }
})
// 驳回上一步
BpmnButton.Models.ResponseButtonRejectToPrevious = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-backward',
    action (btn) {
        this.formOpinionValidate((valid) => {
            if (valid) {
                this.handleActionEvent(btn.getAlias(), btn)
            } else {
                this.formErrorToast('请填写审批意见！')
            }
        }, true)
    }
})
// 终止流程
BpmnButton.Models.ResponseButtonEndProcess = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-ioxhost',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 转办
BpmnButton.Models.ResponseButtonDelegate = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-share',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 补签
BpmnButton.Models.ResponseButtonAddSign = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-group',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 开始沟通
BpmnButton.Models.ResponseButtonStartCommu = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-comment-o',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 开始流转
BpmnButton.Models.ResponseButtonStartTrans = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-ioxhost',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 沟通
BpmnButton.Models.ResponseButtonCommu = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-comment-o',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 流程图
BpmnButton.Models.ResponseButtonFlowImage = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-image',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 审批历史
BpmnButton.Models.ResponseButtonApprovalHistory = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-bars',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 反对流转
BpmnButton.Models.ResponseButtonOpposeTrans = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-ioxhost',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 同意流转
BpmnButton.Models.ResponseButtonAgreeTrans = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-ioxhost',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 挂起
BpmnButton.Models.ResponseButtonSuspendProcess = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-ioxhost',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 恢复
BpmnButton.Models.ResponseButtonRecoverProcess = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-ioxhost',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 打印
BpmnButton.Models.ResponseButtonPrint = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-print',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 撤销
BpmnButton.Models.ResponseButtonRevoke = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-lock',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 流程实例明细
BpmnButton.Models.ResponseButtonInstanceDetail = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-detail',
    action: function (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 流程代理、转办明细
BpmnButton.Models.ResponseButtonDelegateDetail = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-detail',
    action: function (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

// 流程修改保存
BpmnButton.Models.ResponseButtonSave = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-edit',
    action: function (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 流程实例修改
BpmnButton.Models.ResponseButtonTimeModification = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-lock',
    action: function (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 流程实例修改取消
BpmnButton.Models.ResponseButtonTimeModificationNo = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-lock',
    action: function (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})
// 自定义
BpmnButton.Models.ResponseButtonCustom = BpmnButton.Models.ResponseButton.extend({
    icon: 'ibps-icon-cog',
    action (btn) {
        this.handleActionEvent(btn.getAlias(), btn)
    }
})

export default BpmnButton
