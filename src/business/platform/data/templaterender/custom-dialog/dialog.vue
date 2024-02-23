<template>
    <data-template-dialog
        :visible.sync="selectorVisible"
        :data="dataTemplate"
        :dynamic-params="dynamicParams"
        :multiple="multiple"
        :value="selectorValue"
        :label-key="labelKey"
        :preview="false"
        type="dialog"
        @close="closeDialog"
        @action-event="handleSelectorActionEvent"
    />
</template>
<script>
import { getByKey } from '@/api/platform/data/dataTemplate'
import DataTemplateDialog from '../preview'
import { buildLabelTitle } from '../utils'

export default {
    components: {
        DataTemplateDialog
    },
    props: {
        visible: Boolean, // 是否可见
        value: [Object, Array],
        templateKey: { // 数据模版key
            type: String
        },
        dynamicParams: { // 动态参数
            type: Object
        },
        multiple: {
            type: Boolean,
            default: true
        },
        previousDataTemplate: {
            type: Object
        }

    },
    data () {
        return {
            dataTemplate: {},
            labelKey: '',
            valueKey: '',
            selectorVisible: false,
            selectorValue: this.multiple ? [] : {},
            cacheData: {},
            bindIdValue: ''
        }
    },
    watch: {
        visible: {
            handler: function (val, oldVal) {
                if (val) {
                    this.loadTemplateData()
                } else {
                    this.selectorVisible = val
                }
            },
            immediate: true
        },
        value: {
            handler (val, oldVal) {
                this.initData()
            },
            immediate: true
        }
    },
    methods: {
        loadTemplateData () {
            if (this.$utils.isEmpty(this.templateKey)) {
                return
            }
            getByKey({
                dataTemplateKey: this.templateKey
            }).then(response => {
                this.dataTemplate = this.$utils.parseData(response.data)
                this.initDataTemplate()
                this.selectorVisible = true
            }).catch(() => {
            })
        },
        initDataTemplate () {
            this.valueKey = this.dataTemplate.unique
            this.labelKey = buildLabelTitle(this.dataTemplate)
        },
        handleLabel (data) {
            const config = this.labelKey
            if (typeof config === 'function') {
                return config(data)
            } else if (typeof config === 'string') {
                return data[config]
            } else if (typeof config === 'undefined') {
                const dataProp = data['name']
                return dataProp === undefined ? '' : dataProp
            }
        },
        /**
     * 初始化数据
     */
        initData (init = true) {
            this.selectorValue = this.multiple ? [] : {}
        },
        // ===================事件处理=========
        closeDialog () {
            this.$emit('close', false)
        },
        handleSelectorActionEvent (buttonKey, data) {
            switch (buttonKey) {
                case 'ok':// 确定
                    this.closeDialog()
                    this.$emit('action-event', buttonKey, data)
                    break
                case 'cleanClose': // 清空关闭
                    this.closeDialog()
                    this.selectorValue = this.multiple ? [] : {}
                    this.$emit('action-event', buttonKey, this.selectorValue)
                    break
                case 'cancel':// 取消
                    this.closeDialog()
                    this.selectorValue = this.multiple ? [] : {}
                    break
        // TODO:自定义按钮事件处理
            }
        }
    }
}
</script>
