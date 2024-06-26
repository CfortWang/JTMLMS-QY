<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        fullscreen
        class="desktop-manage-dialog"
        @close="closeDialog"
        @open="loadData"
    >
        <ibps-container
            ref="dashboardContainer"
            v-loading="loading"
            :element-loading-text="$t('common.loading')"
            :scroll-delay="scrollDelay"
            type="full"
            @scroll="({x, y}) => { scrollTop = y }"
        >
            <template slot="header">
                <el-button type="primary" icon="ibps-icon-save" @click="save()">保存</el-button>
                <el-button icon="ibps-icon-add" @click="handleAdd()">添加栏目</el-button>
                <el-button type="info" icon="ibps-icon-undo" @click="handleRestoreDefault()">还原默认</el-button>
                <el-button type="success" icon="ibps-icon-eye" @click="dialogPreviewVisible =true">预览</el-button>

                <el-button type="danger" icon="ibps-icon-close" @click="closeDialog()">关闭</el-button>
            </template>
            <desktop-layout
                :data="layout"
                :empty-text="emptyText"
                :visible="addColumnVisible"
                :open="dialogVisible"
                @init="loadData"
                @close="visible => addColumnVisible =visible"
                @change="changeLayout"
            />
            <!--保存布局管理--->
            <el-dialog
                :visible.sync="saveDialogVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                append-to-body
                title="保存布局管理"
                @close="closeSaveDialog"
            >
                <el-form
                    ref="desktopManageForm"
                    :model="desktopManage"
                    :label-width="formLabelWidth"
                    :rules="rules"
                    @submit.native.prevent
                >
                    <el-form-item label="布局名称" prop="name">
                        <el-input v-model="desktopManage.name" />
                    </el-form-item>
                    <el-form-item label="布局描述" prop="memo">
                        <el-input v-model="desktopManage.memo" type="textarea" />
                    </el-form-item>

                    <el-form-item label="所属部门" prop="groupId">
                        <ibps-position-selector
                            v-model="desktopManage.groupId"
                            :placeholder="'请选择部门'"
                            :filtrate="true"
                        />
                    </el-form-item>
                    <el-form-item label="是否默认:" prop="isDef">
                        <el-radio-group v-model="desktopManage.isDef">
                            <el-radio label="Y">是</el-radio>
                            <el-radio label="N">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="el-dialog--center">
                    <ibps-toolbar
                        :actions="toolbars"
                        @action-event="handleActionEvent"
                    />
                </div>
            </el-dialog>
            <desktop-preview
                :visible="dialogPreviewVisible"
                :data="layout"
                readonly
                title="桌面预览"
                @close="visible => dialogPreviewVisible = visible"
            />
        </ibps-container>
    </el-dialog>
</template>

<script>
import { save, get } from '@/api/platform/desktop/manage'
import ActionUtils from '@/utils/action'
import DesktopLayout from '../myLayout/layout'
import IbpsPositionSelector from '@/business/platform/org/position/selector'
import DesktopPreview from './preview'

export default {
    components: {
        DesktopLayout,
        IbpsPositionSelector,
        DesktopPreview
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
            formName: 'desktopManageForm',
            formLabelWidth: '120px',
            dialogVisible: this.visible,
            dialogPreviewVisible: false,
            saveDialogVisible: false,

            defaultForm: {},
            desktopManage: {
                name: '',
                memo: '',
                templateHtml: '',
                isDef: 'N'
            },
            rules: {
                name: [{ required: true, message: this.$t('validate.required') }]
            },
            emptyText: '未设置个人桌面布局，请添加栏目。',
            scrollDelay: 0,
            scrollTop: 0,
            loading: false,
            layout: [],
            addColumnVisible: false,
            toolbars: [
                { key: 'save', hidden: () => { return this.readonly } },
                { key: 'cancel' }
            ]
        }
    },
    computed: {
        formId () {
            return this.id
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = this.visible
                this.layout = []
            },
            immediate: true
        }
    },
    created () {
        this.defaultForm = JSON.parse(JSON.stringify(this.desktopManage))
    },
    methods: {
        handleActionEvent ({ key }) {
            switch (key) {
                case 'save':
                    this.handleSave()
                    break
                case 'cancel':
                    this.closeSaveDialog()
                    break
                default:
                    break
            }
        },
        save () {
            this.saveDialogVisible = true
            this.formValidate()
        },
        closeSaveDialog () {
            this.saveDialogVisible = false
        },
        // 保存数据
        handleSave () {
            this.$refs[this.formName].validate(valid => {
                if (valid) {
                    this.saveData()
                } else {
                    ActionUtils.saveErrorMessage()
                }
            })
        },
        // 提交保存数据
        saveData () {
            this.desktopManage.templateHtml = JSON.stringify(this.layout)
            save(this.desktopManage).then(response => {
                this.$emit('callback', this)
                ActionUtils.saveSuccessMessage(response.message, (rtn) => {
                    this.closeSaveDialog()
                    if (rtn) {
                        this.closeDialog()
                    }
                })
            }).catch((err) => {
                console.error(err)
            })
        },
        /**
         * 表单验证
         */
        formValidate () {
            if (this.readonly) return
            this.$nextTick(() => {
                this.$refs[this.formName].validate(() => {})
            })
        },
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        /**
         * 获取表单数据
         */
        loadData () {
            if (this.$utils.isEmpty(this.formId)) {
                // 重置表单
                this.desktopManage = JSON.parse(JSON.stringify(this.defaultForm))
                return
            }
            this.loading = true
            get({
                desktopManageId: this.formId
            }).then(response => {
                this.desktopManage = response.data
                if (this.$utils.isNotEmpty(this.desktopManage.templateHtml)) {
                    try {
                        this.layout = this.$utils.parseData(this.desktopManage.templateHtml)
                    } catch (error) {
                        console.error(error)
                        this.layout = null
                    }
                }
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },

        handleAdd () {
            this.addColumnVisible = true
        },
        changeLayout (data) {
            this.layout = data
        },
        handleRestoreDefault () {
            this.desktopManage = JSON.parse(JSON.stringify(this.defaultForm))
            this.layout = this.$utils.parseData(this.desktopManage.templateHtml)
            this.$message({
                message: '还原默认成功',
                type: 'success'
            })
        }
    }

}
</script>
<style lang="scss" scoped>
    .desktop-manage-dialog {
        ::v-deep {
            .el-dialog__header {
                padding: 15px 20px;
                height: 25px;
            }
            .el-dialog__body {
                height: calc(100vh - 55px) !important;
                padding: 0;
                .ibps-container-full__body {
                    // 与头高度相加为90，即首页头部高度
                    padding-top: 30px !important;
                }
            }
        }
    }
</style>
