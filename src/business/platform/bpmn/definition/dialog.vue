<template>
    <ibps-selector-dialog
        :value="selectedValue"
        :visible="selectorVisible"
        v-bind="$props"
        @input="value => selectedValue = value"
        @remove-select="setSelectRow"
        @close="handleClose"
        @action-event="handleActionEvent"
    >
        <template slot-scope="scope">
            <ibps-selector-panel
                ref="panel"
                v-bind="scope"
                :form-key="formKey"
                :is-super="isSuper"
                :is-data-template-use="isDataTemplateUse"
                @selected="value => selectedValue = value"
            />
        </template>
    </ibps-selector-dialog>
</template>
<script>
    import IbpsSelectorDialog from '@/components/ibps-selector/dialog'
    import IbpsSelectorPanel from './panel'
    export default {
        components: {
            IbpsSelectorDialog,
            IbpsSelectorPanel
        },
        props: {
            // 是否可见
            visible: Boolean,
            // 标题
            title: {
                type: String,
                default: '流程定义选择器'
            },
            // 是否查询所有
            isSuper: {
                type: Boolean,
                default: false
            },
            // Dialog CSS 中的 margin-top 值
            marginTop: {
                type: String,
                default: '5vh'
            },
            width: {
                type: String,
                default: '60%'
            },
            height: {
                type: String,
                default: '415px'
            },
            // 是否可以通过点击 modal 关闭 Dialog
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            // 是否可以通过按下 ESC 关闭 Dialog
            closeOnPressEscape: {
                type: Boolean,
                default: false
            },
            // 是否显示关闭按钮
            showClose: {
                type: Boolean,
                default: true
            },
            isDataTemplateUse: {
                type: Boolean,
                default: false
            },
            // 关闭前的回调，会暂停 Dialog 的关闭
            beforeClose: {
                type: Function
            },
            // 是否为全屏 Dialog
            fullscreen: {
                type: Boolean,
                default: false
            },
            // 展示的值
            labelKey: {
                type: String,
                default: 'name'
            },
            // 唯一存储的值
            valueKey: {
                type: String,
                default: 'id'
            },
            formKey: String,
            value: {
                type: [Object, Array],
                default() {
                    return this.multiple ? [] : {}
                }
            },
            // 按钮清空并关闭
            cleanClose: {
                type: Boolean,
                default: false
            },
            // 按钮组
            buttons: {
                type: Array
            },
            confirmButtonText: {
                type: String,
                default: '选择'
            },
            cleanButtonText: String,
            cancelButtonText: String,
            // 是否多选
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selectorVisible: false,
                selectedValue: this.multiple ? [] : {}
            }
        },
        watch: {
            visible: {
                handler: function (val, oldVal) {
                    this.selectorVisible = this.visible
                },
                immediate: true
            },
            value() {
                this.selectedValue = this.value
            }
        },
        methods: {
            setSelectRow() {
                this.$refs['panel'].setSelectRow()
            },
            handleClose(visible) {
                this.$emit('close', visible)
            },
            handleActionEvent(key, data) {
                if (key === 'clean') {
                    this.setSelectRow()
                }
                this.$emit('action-event', key, data)
            }
        }
    }
</script>
