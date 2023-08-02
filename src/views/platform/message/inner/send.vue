<template>
    <ibps-container
        type="full"
        header-background-color
        class="page send send-form"
    >
        <div slot="header">
            <ibps-toolbar
                :actions="toolbars"
                :socpe="thatSocpe"
                @action-event="handleActionEvent"
            />
        </div>
        <el-row class="send-form-row">
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-width="100px"
                class="demo-form"
                @submit.native.prevent
            >
                <el-form-item label="主题：" prop="subject">
                    <el-input v-model="form.subject" />
                </el-form-item>
                <el-form-item label="消息类型：" prop="messageType">
                    <el-radio-group v-model="form.messageType" @input="handleChange">
                        <template v-for="item in typeOptions">
                            <el-radio v-if="item.value" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="接收人：" prop="receiverId">
                    <ibps-employee-selector
                        :value="form.receiverId"
                        multiple
                        placeholder="请选择接收人"
                        @input="handleInput"
                    />
                </el-form-item>
                <!-- <el-form-item label="收件组织：" prop="groupId">
                    <ibps-org-selector
                        :value="form.groupId"
                        :multiple="true"
                        @input="depNameInput"
                    />
                </el-form-item> -->
                <el-form-item label="接收部门：" prop="groupId">
                    <ibps-pos-selector
                        :value="form.groupId"
                        :multiple="true"
                        placeholder="请选择接收部门"
                        @input="depNameInput"
                    />
                </el-form-item>
                <el-form-item v-if="form.messageType !== 'bulletin'" label="是否可回复：" prop="canreply">
                    <el-radio-group v-model="form.canreply">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="附件：" prop="fileMsg">
                    <ibps-attachment-selector
                        v-model="form.fileMsg"
                        accept="*"
                        multiple
                    />
                </el-form-item>
                <el-form-item
                    label="正文："
                    prop="content"
                    class="demo-form-content"
                >
                    <ibps-ueditor v-model="form.content" :z-index="2000" />
                </el-form-item>
            </el-form>
        </el-row>
    </ibps-container>
</template>
<script>
import { save } from '@/api/platform/message/innerMessage'
import { typeOptions } from './constants'
import ActionUtils from '@/utils/action'
import IbpsEmployeeSelector from '@/business/platform/org/employee/selector'
import IbpsOrgSelector from '@/business/platform/org/org/selector'
import IbpsPosSelector from '@/business/platform/org/position/selector'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'

export default {
    components: {
        IbpsUeditor,
        IbpsEmployeeSelector,
        IbpsOrgSelector,
        IbpsPosSelector,
        IbpsAttachmentSelector
    },
    data () {
        return {
            typeOptions,
            formName: 'form',
            toolbars: [
                // { key: 'back', label: '返回', icon: 'ibps-icon-back' },
                { key: 'send', label: '发送', icon: 'ibps-icon-send' }
            ],
            form: {
                subject: '',
                messageType: 'normal',
                receiverId: '',
                receiver: '',
                groupId: '',
                groupName: '',
                positionId: '',
                positionName: '',
                canreply: '0',
                fileMsg: '',
                content: '',
                id: '',
                editorValue: ''
            },
            rules: {
                subject: [
                    { required: true, message: this.$t('validate.required') }
                ],
                receiverId: [{ required: false }],
                groupId: [{ required: false }],
                positionId: [{ required: false }],
                canreply: [{ required: false }],
                fileMsg: [{ required: false }],
                content: [{ required: true }]
            }
        }
    },
    computed: {
        thatSocpe () {
            return this
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.$refs[this.formName].validate(() => {})
        })
    },
    methods: {
        handleInput (data) {
            this.form.receiverId = data
        },
        depNameInput (data) {
            this.form.groupId = data
        },
        posNameInput (data) {
            this.form.positionId = data
        },
        handleActionEvent ({ key }) {
            switch (key) {
                case 'send': // 发送信息
                    this.handSend()
                    break
                case 'back':
                    this.$router.go(-1)
                    break
                default:
                    break
            }
        },
        handSend () {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    this.sendNews()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        sendNews () {
            if (this.form.receiverId === '' && this.form.groupId === '' && this.form.positionId === '') {
                ActionUtils.warning('至少选择一个收件人或收件部门!')
                return
            }
            this.form.ownerName = this.$store.getters.name
            this.form.ownerId = this.$store.getters.userId
            save(this.form).then((response) => {
                ActionUtils.saveSuccessAlert('消息发送成功', () => {
                    this.$refs[this.formName].resetFields()
                })
            }).catch((err) => {
                console.error(err)
            })
        },
        handleChange (v) {
            if (v === 'bulletin') {
                this.form.canreply = '0'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.send {
    .ibps-container-full__body {
        padding: 15px !important;
    }
    .send-form {
        .send-form-row {
            padding: 10px;
            .demo-form-content {
                .edui-editor-iframeholder {
                    height: 100% !important;
                }
            }
        }
    }
}
</style>
