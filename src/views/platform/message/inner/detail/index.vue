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
    </el-form>
</template>

<script>
import { get } from '@/api/platform/message/innerMessage'
import { typeOptions, publicOrCanreplyOptions } from '../constants'
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import ReadedList from './readed-list'
import ReplyList from './reply-list'

export default {
    components: {
        ReadedList,
        IbpsAttachmentSelector,
        ReplyList
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
        getform: () => { }
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
            fileTitle: ''
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
        /**
         * 获取表单数据
         */
        getFormData () {
            this.activeName = 'replied'
            this.form = ''
            this.loading = true
            get({
                innerMessageId: this.formId,
                type: this.type // 是否为空值，来决定消息是否要已读：空就已读，非空就未读
            }).then(response => {
                this.form = response.data
                if (this.$refs['replyList']) { this.$refs['replyList'].loadData() }
                if (this.$refs['readedList']) { this.$refs['readedList'].loadData() }
                this.fileSrc = this.form.fileMsg.src
                this.fileTitle = this.form.fileMsg.title
                this.loading = false
                this.$emit('callback', true)
            }).catch(() => {
                this.loading = false
            })
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
