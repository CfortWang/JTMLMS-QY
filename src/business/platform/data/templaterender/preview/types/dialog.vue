<template>
    <!--自定义对话框-->
    <ibps-selector-dialog
        :visible="dialogVisible"
        :value="selectedValue"
        :title="title"
        :width="width"
        :height="height"
        :margin-top="marginTop"
        :multiple="multiple"
        :label-key="showLabel"
        :default-button="false"
        :buttons="toolbars"
        class="preview-type-dialog"
        @input="handleSelectChange"
        @remove-select="setSelectRow"
        @close="closeDialog"
    >
        <template v-slot>
            <ibps-data-template-render
                v-if="dialogVisible"
                ref="dataTemplate"
                :value="selectedValue"
                :data="dataTemplate"
                :dynamic-params="dynamicParams"
                :multiple="multiple"
                :height="dialogHeight"
                :preview="preview"
                :temp-search="tempSearch"
                @close="closeDialog"
                @selected="handleSelectChange"
            />
        </template>
    </ibps-selector-dialog>
</template>
<script>
import TypeMixin from '../mixins/types'
import { buildLabelTitle } from '../../utils'
import JDialog from '../../utils/JDialogTemplate' // 自定义脚本
// import ActionUtils from '@/utils/action'

import IbpsSelectorDialog from '@/components/ibps-selector/dialog'
import Vue from 'vue'
Vue.component('ibps-data-template-render', () =>
    import('@/business/platform/data/templaterender/index.vue')
)

export default {
    components: {
        IbpsSelectorDialog
    },
    mixins: [TypeMixin],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object
        },
        dynamicParams: {
            type: Object
        },
        value: {
            type: [Object, Array]
        },
        title: String,
        width: {
            type: [String, Number],
            default: '80%'
        },
        height: {
            type: [String, Number],
            default: '100%'
        },
        dialogHeight: {
            type: [String, Number],
            default: 400
        },
        multiple: {
            type: Boolean,
            default: false
        },
        toolbars: {
            type: Array
        },
        labelKey: {
            type: [String, Function]
        },
        preview: {
            type: Boolean,
            default: false
        },
        tempSearch: { // 是否是数据模板使用的筛选条件
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dialogVisible: this.visible,
            selectedValue: this.multiple ? [] : {},
            dataTemplate: {},
            initialization: false,
            showLabel: this.labelKey
        }
    },
    computed: {
        marginTop () {
            if (this.height === '100%' || this.height === 100) {
                return '0'
            } else {
                return '5vh'
            }
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                this.dialogVisible = val
                if (val) {
                    this.initUI()
                    this.getFormData()
                }
            },
            immediate: true
        },
        value (val) {
            this.selectedValue = val
        },
        selectedValue: {
            handler (val, oldVal) {
                if (val !== oldVal) {
                    this.$emit('update:value', val)
                }
            },
            deep: true
        },
        labelKey: {
            handler: function (val, oldVal) {
                if (val) {
                    this.showLabel = val
                }
            },
            immediate: true
        }
    },
    methods: {
        // 关闭当前窗口
        closeDialog () {
            this.JDialogTemplate()
            this.$emit('close', false)
            this.$emit('update:value', {})
        },
        getFormData () {
            this.initData(JSON.parse(JSON.stringify(this.data)))
        },
        setSelectRow () {
            this.$refs['dataTemplate'].setSelectRow()
        },
        handleSelectChange (val, dataTemplate) {
            // if (typeof this.labelKey === 'function') {
            //     if (this.$utils.isNotEmpty(val)) {
            //         ActionUtils.warning('配置错误，请设置一个返回字段')
            //         this.clearSelection()
            //         return
            //     }
            // } else if (typeof this.labelKey === 'string') {
            //     return data[config]
            // } else if (typeof this.labelKey === 'undefined') {

            // }
            if (this.dataTemplate.type !== 'dialog' && !this.dataTemplate.templates[0].result_columns) {
                this.$message({
                    message: '请检查是否设置返回字段！',
                    type: 'warning'
                })
                return
            } else if (dataTemplate) {
                if (!dataTemplate.templates[0].result_columns) {
                    this.$message({
                        message: '请检查是否设置返回字段！',
                        type: 'warning'
                    })
                    return
                } else {
                    this.showLabel = buildLabelTitle(dataTemplate)
                }
            }
            this.selectedValue = val
        },
        clearSelection () {
            this.$refs['dataTemplate'].clearSelection()
        },
        initUI () {
            this.initialization = false
            if (!this.initialization) {
                this.JDialogTemplate()
                this.initialization = true
            }
        },
        /**
             * 初始化脚本
             */
        JDialogTemplate () {
            const dialogId = 'JDialog'
            let script = document.getElementById(dialogId)
            if (script) {
                script.parentNode.removeChild(script)
            }
            if (this.data.dialogs.attrs && this.data.dialogs.attrs.script) {
                const codeScript = this.data.dialogs.attrs.script
                script = document.createElement('script')
                script.type = 'text/javascript'
                script.id = dialogId
                document.body.appendChild(script)
                try {
                    script.appendChild(document.createTextNode(codeScript))
                } catch (ex) {
                    console.error(ex)
                    script.text = codeScript
                }
                document.body.appendChild(script)
                setTimeout(() => {
                    this.loadScript()
                }, 10)
            }
        },
        // 处理脚本
        hasScript () {
            return true
        },
        // 加载脚本
        loadScript () {
            if (!this.hasScript()) {
                return
            }
            JDialog._onLoad(this)
        },
        // 前置脚本
        beforeScript (action, position, selection, data, callback) {
            if (!this.hasScript()) {
                const flag = true
                callback(flag)
                return
            }
            JDialog._beforeSubmit(this, action, position, selection, data, callback)
        },
        // 后置脚本
        afterScript (action, position, selection, data, callback) {
            if (!this.hasScript()) {
                const flag = true
                callback(flag)
                return
            }
            JDialog._afterSubmit(this, action, position, selection, data, callback)
        }
    }
}
</script>
<style lang="scss">
    .preview-type-dialog {
        height: 100%;
        display: flex;
        justify-content: center;
        .el-dialog {
            margin: 5vh 0;
        }
        .el-dialog__body {
            height: calc(100% - 90px) !important;
            > div:nth-of-type(2) {
                position: relative;
                height: calc(100% - 35px);
                .el-table--small {
                    // 此处无法自适应，260为搜索栏换行时大致高度，不可修改
                    min-height: calc(90vh - 260px);
                }
            }
        }
    }
</style>
