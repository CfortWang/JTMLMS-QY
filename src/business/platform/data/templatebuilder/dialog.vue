<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="templatebuilder-dialog"
        fullscreen
        append-to-body
        @open="getFormData"
        @close="closeDialog"
    >
        <div
            v-loading.fullscreen.lock="dialogLoading"
            :element-loading-text="$t('common.loading')"
        >
            <data-template-builder
                v-if="dialogVisible && $utils.isNotEmpty(dataTemplate)"
                :data="dataTemplate"
                :compose-confirm="composeConfirm"
                @callback="handleCallback"
                @initDataTemplte="initDataTemplte"
                @close="closeDialog"
            />
        </div>
    </el-dialog>
</template>
<script>
import { getBuildDataById } from '@/api/platform/data/dataTemplate'
import { buildTree } from '@/api/platform/data/dataset'
import { mapActions } from 'vuex'
import { defaultsDeep } from 'lodash'
import Utils from './utils'

import DataTemplateBuilder from './index'

export default {
    components: {
        DataTemplateBuilder
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
        data: {
            type: Object
        },
        composeConfirm: {
            type: Boolean,
            default: false
        },
        id: String
    },
    data () {
        return {
            dialogVisible: this.visible,
            dialogLoading: false,
            defaultForm: {
                attrs: {},
                templates: [] // 模版
            },
            dataTemplate: null
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
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions({
            setDatasets: 'ibps/dataTemplate/setDatasets'
        }),
        // 关闭当前窗口
        closeDialog () {
            this.$emit('close', false)
        },
        handleCallback () {
            this.$emit('callback')
        },
        getDefaultTemplateAttrs (data) {
            if (data.type === 'valueSource') {
                data.templates = [
                    Utils.defaultValueSourcetAttrs(data)
                ]
            } else {
                if (data.showType === 'list') {
                    data.templates = [
                        Utils.defaultListAttrs(data)
                    ]
                } else if (data.showType === 'tree' || data.composeType === 'treeForm') {
                    data.templates = [
                        Utils.defaultTreeAttrs(data)
                    ]
                } else if (data.showType === 'compose' && data.composeType !== 'treeForm') {
                    data.templates = []
                }

                if (data.type === 'dialog') {
                    data.dialogs = Utils.defaultDialogAttrs()
                }
            }
            return data
        },
        initDataTemplte (data) {
            const defaultForm = JSON.parse(JSON.stringify(this.defaultForm))
            this.dataTemplate = defaultsDeep(this.getDefaultTemplateAttrs(data), defaultForm)
        },
        /**
         * 获取表单数据
         */
        getFormData () {
            this.dataTemplate = null
            this.dialogLoading = true
            const defaultForm = JSON.parse(JSON.stringify(this.defaultForm))
            if (this.$utils.isEmpty(this.formId) && this.$utils.isNotEmpty(this.data)) {
                const data = JSON.parse(JSON.stringify(this.data))
                // 重置表单
                this.dataTemplate = defaultsDeep(this.getDefaultTemplateAttrs(data), defaultForm)
                if (this.dataTemplate.datasetKey) {
                    this.intDatasets(this.dataTemplate.datasetKey)
                } else {
                    this.dialogLoading = false
                    this.setDatasets([])
                }
                return
            }
            getBuildDataById({
                dataTemplateId: this.formId
            }).then(response => {
                const data = response.data
                // 从后台获取数据
                this.dataTemplate = defaultsDeep({}, JSON.parse(data), defaultForm)
                if (this.dataTemplate.datasetKey) {
                    this.intDatasets(this.dataTemplate.datasetKey)
                } else {
                    this.setDatasets([])
                }
                this.dialogLoading = false
            }).catch(() => {
                this.dialogLoading = false
            })
        },
        intDatasets (datasetKey) {
            const datasets = this.dataTemplate.datasets
            if (this.$utils.isNotEmpty(datasets)) {
                this.setDatasets(datasets)
                this.setUnique(datasets)
                this.dialogLoading = false
            } else {
                buildTree({
                    datasetKey: datasetKey
                }).then(response => {
                    this.dialogLoading = false
                    const datasets = response.data
                    this.setDatasets(datasets)
                    this.dataTemplate.datasets = datasets
                    this.setUnique(datasets)
                }).catch((e) => {
                    this.dialogLoading = false
                })
            }
        },
        setUnique (datasets) {
            if (this.$utils.isEmpty(this.dataTemplate.unique)) {
                if (Array.isArray(datasets)) {
                    // 取第一个字段
                    const fields = datasets.filter((d) => {
                        return d.parentId !== '0'
                    })
                    if (fields && fields.length > 0) {
                        this.dataTemplate.unique = fields[0].name
                    }
                } else {
                    // TODO:唯一字段
                }
            }
        }
    }

}
</script>
<style lang="scss" >
.templatebuilder-dialog {
    .el-dialog__header {
        padding: 0;
        border-bottom: 0;
    }
    .el-dialog__body {
        padding: 0;
    }
    .is-fullscreen {
        overflow: hidden;
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
