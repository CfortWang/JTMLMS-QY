<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="formbuilder-dialog"
        :class="$style.content"
        fullscreen
        append-to-body
        @open="getFormData"
        @close="closeDialog"
    >
        <formbuilder
            v-if="dialogVisible"
            :id="id"
            v-loading.fullscreen.lock="dialogLoading"
            :element-loading-text="$t('common.loading')"
            :data="formDef"
            :bo="boData"
            :loading="dialogLoading"
            @callback="handleCallback"
            @close="closeDialog"
        />
    </el-dialog>
</template>
<script>
    import { getFormDataByFormDefId, design, buildTree } from '@/api/platform/form/formDef'
    import { defaultsDeep } from 'lodash'
    import Formbuilder from './index'

    export default {
        components: {
            Formbuilder
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: String,
            data: {
                type: Object
            }
        },
        data() {
            return {
                dialogVisible: this.visible,
                dialogLoading: false,
                defaultForm: {
                    attrs: {
                        inline: false, // 是否使用inline排版
                        labelPosition: 'left', // 标签对齐方式
                        labelWidth: '110', // 标签宽度
                        labelWidthUnit: 'px', // 标签宽度单位
                        size: 'mini', // 尺寸
                        statusIcon: false, // 显示验证图标
                        descPosition: 'inline',
                        verifys: [], // 表单提交校验
                        script: '', // 表单脚本
                        read_style: 'text',
                        colon: false,
                        labelSuffix: ':',
                        title_position: 'center'
                    },
                    fields: [] // 字段列表
                },
                formDef: null,
                boData: []
            }
        },
        computed: {
            formId() {
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
        created() {
            this.formDef = JSON.parse(JSON.stringify(this.defaultForm))
        },
        methods: {
            // 关闭当前窗口
            closeDialog() {
                this.formDef = JSON.parse(JSON.stringify(this.defaultForm))
                this.$emit('close', false)
            },
            handleCallback() {
                this.$emit('callback')
            },
            /**
             * 获取表单数据
             */
            getFormData() {
                const defaultForm = JSON.parse(JSON.stringify(this.defaultForm))
                this.dialogLoading = true
                if (this.$utils.isEmpty(this.formId)) {
                    if (this.$utils.isNotEmpty(this.data)) {
                        design({
                            mode: this.data.mode || 'bo',
                            boCode: this.data.code,
                            buildMode: this.data.buildMode || 'default',
                            template: this.data.template || ''
                        }).then((response) => {
                            const data = this.$utils.parseData(
                                response.data
                            )
                            // 从后台获取数据
                            const formDef = defaultsDeep(
                                {},
                                data,
                                defaultForm
                            )
                            Object.assign(formDef, this.data)
                            this.formDef = formDef
                            this.buildTree(this.formDef)
                            this.dialogLoading = false
                        }).catch((err) => {
                            console.error(err)
                            this.formDef = defaultsDeep({}, defaultForm)
                            this.dialogLoading = false
                        })
                    }
                } else {
                    getFormDataByFormDefId({ formDefId: this.formId }).then((response) => {
                        const data = response.data
                        // 从后台获取数据
                        this.formDef = defaultsDeep(
                            {},
                            this.$utils.parseJSON(data),
                            defaultForm
                        )
                        this.buildTree(this.formDef)
                        this.dialogLoading = false
                    }).catch(() => {
                        this.formDef = defaultsDeep({}, defaultForm)
                        this.dialogLoading = false
                    })
                }
            },
            buildTree({ code, busId, mode }) {
                buildTree({
                    boCode: code,
                    boDefId: busId,
                    mode: mode || ''
                }).then((response) => {
                    this.boData = response.data
                }).catch((e) => {
                    //  loading.close()
                })
            }
        }
    }
</script>
<style lang="scss" module>
    .content {
        :global {
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
            .form-main .widget-form-container {
                .el-form-item__label {
                    padding-left: 30px;
                    position: relative;
                    &:before {
                        position: absolute;
                        left: 24px;
                    }
                }
            }
        }
    }
</style>
