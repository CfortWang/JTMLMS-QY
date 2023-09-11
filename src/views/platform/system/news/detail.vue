<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        width="65%"
        top="10vh"
        class="news-detail-dialog"
        @open="getFormData"
        @close="closeDialog"
    >
        <el-row style="padding: 10px 10px 0 10px; max-height: 600px;">
            <el-form ref="form" :model="form" label-width="100px" disabled>
                <!-- <el-form-item label="公告分类：" prop="typeId">
                    <ibps-type-select v-model="form.typeId" category-key="NOTICE_TYPE" />
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="作者：" prop="author">
                    <el-input v-model="form.author" />
                </el-form-item>
                <el-form-item label="关键字：" prop="key">
                    <el-input v-model="form.key" />
                </el-form-item> -->
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发布人：" prop="author">
                            <el-input v-model="form.author" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="发布时间：" prop="publicDate">
                            <el-date-picker
                                v-model="form.publicDate"
                                type="date"
                                style="width:100%;"
                                placeholder=""
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="失效时间：" prop="loseDate">
                            <el-date-picker
                                v-model="form.loseDate"
                                type="date"
                                style="width:100%;"
                                placeholder=""
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="附件：" prop="fileAttach">
                    <ibps-attachment-selector
                        v-if="form.fileAttach"
                        :value="form.fileAttach"
                        multiple
                        readonly
                    />
                    <span v-else>/</span>
                </el-form-item>
                <el-form-item label="内容：" prop="content">
                    <ibps-ueditor v-model="form.content" :readonly="readonly" destroy />
                </el-form-item>
            </el-form>
        </el-row>
        <div slot="footer" class="el-dialog--center">
            <ibps-toolbar
                :actions="toolbars"
                @action-event="handleActionEvent"
            />
        </div>
    </el-dialog>
</template>

<script>
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import { get } from '@/api/platform/system/news'
import { typeOptions, publicItemOptions, isPublicOptions } from './constants'
import { getFile } from '@/utils/avatar'
import IbpsUeditor from '@/components/ibps-ueditor'
import IbpsTypeSelect from '@/business/platform/cat/type/select'
export default {
    components: {
        IbpsAttachmentSelector,
        IbpsUeditor,
        IbpsTypeSelect
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        id: String,
        title: String
    },
    data () {
        return {
            formName: 'form',
            dialogVisible: this.visible,
            dialogLoading: false,
            dialogFormVisible: false, // 弹窗
            typeOptions: typeOptions,
            publicItemOptions: publicItemOptions,
            isPublicOptions: isPublicOptions,
            form: {},
            toolbars: [
                { key: 'cancel', label: '关闭' }
            ]
        }
    },
    computed: {
        formId () {
            return this.id
        },
        image () {
            return getFile(this.form.picture)
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
                case 'cancel':
                    this.closeDialog()
                    break
                default:
                    break
            }
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        titleStyle (color) {
            this.$refs.title.style.color = color
        },
        /**
         * 获取表单数据
         */
        getFormData () {
            this.dialogLoading = true
            get({
                newsId: this.formId
            }).then(response => {
                const data = response.data
                this.form = data
                if (response.data.publicItem === 'important') {
                    this.titleStyle('red')
                } else {
                    this.titleStyle('black')
                }

                this.dialogLoading = false
            }).catch(() => {
                this.dialogLoading = false
            })
        }
    }

}
</script>
<style lang="scss">
    .news-detail-dialog{
        .text-border{
            width:100%;
            color: #000000;
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1),
            0 0 0 0 rgba(0, 0, 0, 0.1),
            0 0 0 0 rgba(0, 0, 0, 0.1),
            0 1px 0px 0 rgba(0, 0, 0, 0.1);
            min-height: 38px;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
        }
        .el-dialog__body{
            height:  calc(70vh - 110px) !important;
        }
    }
</style>
