<template>
    <el-form
        ref="form"
        v-loading="loading"
        :element-loading-text="$t('common.loading')"
        :label-width="formLabelWidth"
        class="inner-detail"
        @submit.native.prevent
    >
        <el-row>
            <el-col :span="12">
                <el-form-item label="主题:">
                    <div class="text-border">{{ form.subject }}</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="创建时间:">
                    <div class="text-border">{{ form.createTime | dateFormat }}</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发送人:">
                    <div class="text-border">{{ form.ownerName }}</div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="消息类型:">
                    <div class="text-border">
                        <el-tag :type="form.messageType | optionsFilter(typeOptions, 'type')">
                            {{ form.messageType | optionsFilter(typeOptions, 'label') }}
                        </el-tag>
                    </div>
                </el-form-item>
            </el-col>
            <el-col v-if="judgeTF(form)" :span="12">
                <el-form-item v-if="showDialog==true" :label="fontText[JSON.parse(form.skipTypeMsg).skipType-1]">
                    <el-button
                        :type="form.messageType | optionsFilter(typeOptions, 'type')"
                        @click.native="handleDifferentTab(form)"
                    >点击</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item
                    label="是否公告:"
                    :hidden="type"
                >
                    <div class="text-border">
                        <el-tag :type="form.isPublic | optionsFilter(publicOrCanreplyOptions, 'type')">
                            {{ form.isPublic | optionsFilter(publicOrCanreplyOptions, 'label') }}
                        </el-tag>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item
                    label="是否可回复:"
                    :hidden="type"
                >
                    <div class="text-border">
                        <el-tag :type="form.canreply | optionsFilter(publicOrCanreplyOptions, 'type')">
                            {{ form.canreply | optionsFilter(publicOrCanreplyOptions, 'label') }}
                        </el-tag>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="消息内容:">
                    <span
                        class="original-content"
                        v-html="$utils.formatText(form.content)"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="附件:">
                    <ibps-attachment-selector
                        v-model="form.fileMsg"
                        :download="!readonly"
                        :readonly="readonly"
                        multiple
                    />
                </el-form-item>
            </el-col>
            <!-- <el-col v-if="!inside" :span="24">
                <el-form-item class="list">
                    <el-tabs v-model="activeName" class="detail" @tab-click="handleClick">
                        <el-tab-pane label="已回复信息列表" name="replied" style="height:300px;">
                            <reply-list :id="formId" ref="replyList" />
                        </el-tab-pane>
                        <el-tab-pane label="已读取人员列表" name="readed" style="height:300px;">
                            <readed-list :id="formId" ref="readedList" />
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
            </el-col> -->
        </el-row>
        <bpmn-formrender
            :visible="dialogFormVisible"
            :task-id="taskId"
            :instance-id="instanceId"
            @close="visible => dialogFormVisible = visible"
        />
        <!-- <data-template-formrender-dialog
            :visible="dialogformrenderVisible"
            :form-key="formKey"
            :default-data="defaultFormData"
            :pk-value="pkValue"
            :toolbars="editToolbars"
            :readonly="readonly"
            @close="visible => dialogformrenderVisible = visible"
        /> -->
        <!-- @callback="search" -->
    </el-form>
</template>

<script>
import { get } from '@/api/platform/message/innerMessage'
import curdPost from '@/business/platform/form/utils/custom/joinCURD.js'
import { typeOptions, publicOrCanreplyOptions } from '../constants'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import ReadedList from './readed-list'
import ReplyList from './reply-list'
import DataTemplateFormrenderDialog from '@/business/platform/data/templaterender/form/dialog'

export default {
    components: {
        ReadedList,
        IbpsAttachmentSelector,
        ReplyList,
        DataTemplateFormrenderDialog
    },
    props: {
        inside: {
            type: Boolean,
            default: false
        },
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },

        id: String,
        title: String,
        type: String,
        getform: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            activeName: 'replied',
            formLabelWidth: '120px',
            typeOptions: typeOptions,
            publicOrCanreplyOptions: publicOrCanreplyOptions,
            loading: false,
            form: {},
            fileSrc: '',
            fileTitle: '',
            instanceId: '',
            dialogFormVisible: false, // 弹窗
            // dialogformrenderVisible: false,
            taskId: '', // 编辑dialog需要使用
            fontText: ['明细：', '流程：', '路由：', '表单：'],
            showDialog: false
            // formKey: 'snwsdjkjlb',
            // defaultFormData: {},
            // pkValue: '',
            // editToolbars: [
            //     {
            //         button_type: 'close',
            //         label: '关闭',
            //         key: 'close'
            //     },
            //     {
            //         button_type: 'save',
            //         label: '提交',
            //         key: 'save',
            //         icon: 'el-icon-finished'
            //     }
            // ],
            // readonly: false
        }
    },
    computed: {
        formId () {
            return this.id
        }
    },
    methods: {
        handleClick (tab, event) {
            this.$refs['readedList'].loadData()
        },
        // 流程
        handleEdit (id) {
            this.taskId = id
            this.dialogFormVisible = true
        },
        // 明细
        handleLinkClick (data) {
            this.instanceId = data
            this.dialogFormVisible = true
        },
        // 路由
        handleRouterSkip (way) {
            this.$router.push(`${way}`)
        },
        // 无流程表单
        // handleFlowlessForm(way){
        //     this.dialogformrenderVisible = true
        // },
        handleDifferentTab (objNum) {
            const stm = JSON.parse(objNum.skipTypeMsg)
            const tid = stm.pathInfo ? objNum.taskId : stm.pathInfo
            switch (stm.skipType) {
                case 1:// 明细
                    this.handleLinkClick(stm.pathInfo)
                    break
                case 2:// 流程
                    this.handleEdit(tid)
                    break
                case 3:// 路由
                    this.handleRouterSkip(stm.pathInfo)
                    break
                // case 4:// 表单
                //     this.handleFlowlessForm(stm.pathInfo)
                //     break
                default:
                    break
            }
        },
        // search() {
        //     this.loadData()
        // },
        /**
         * 获取表单数据
         */
        getFormData () {
            this.activeName = 'replied'
            this.form = ''
            this.loading = true
            get({
                innerMessageId: this.formId,
                type: this.type || '' // 是否为空值，来决定消息是否要已读：空就已读，非空就未读
            }).then(response => {
                this.form = response.data
                if (this.$refs['replyList']) { this.$refs['replyList'].loadData() }
                if (this.$refs['readedList']) { this.$refs['readedList'].loadData() }
                const { fileMsg } = this.form
                this.fileSrc = fileMsg && fileMsg.src ? fileMsg.src : ''
                this.fileTitle = fileMsg && fileMsg.src ? fileMsg.src : ''
                this.loading = false
                if (!this.type) {
                    this.$emit('callback', true)
                }
            }).catch(() => {
                this.loading = false
            })
        },
        judgeTF (form) {
            if (form.skipTypeMsg) {
                try {
                    const obj = JSON.parse(form.skipTypeMsg)
                    if (typeof obj === 'object' && obj) {
                        if (obj.skipType > 0) {
                            if (obj.skipType === 1) {
                                this.showDialog = true
                            } else if (obj.skipType === 2 && form.taskId != null) {
                                const sql = "select count(id_) as num from ibps_bpm_task_pendding where task_id_='" + form.taskId + "'"
                                curdPost('sql', sql).then(res => {
                                    console.log(res.variables.data[0].num)
                                    if (res.variables.data[0].num > 0) {
                                        this.showDialog = true
                                    } else {
                                        this.showDialog = false
                                    }
                                })
                            } else if (obj.skipType === 3) {
                                this.showDialog = true
                            }
                            // else if(obj.skipType==4){
                            //     this.showDialog = true;
                            // }
                            else {
                                this.showDialog = false
                            }
                        } else {
                            this.showDialog = false
                        }
                    } else {
                        this.showDialog = false
                    }
                } catch (e) {
                    this.showDialog = false
                }
            } else {
                this.showDialog = false
            }
            return true
        }
    }

}
</script>
<style lang="scss">
.inner-detail {
    .original-content {
        p {
            margin: 0;
        }
    }
}

.text-border {
    color: #000000;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(0, 0, 0, 0.1),
        0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 0px 0 rgba(0, 0, 0, 0.1);
    padding-left: 5px;
    min-height: 38px;
    font-size: 16px;
    text-align: center;
    width: 80%;
}
</style>
