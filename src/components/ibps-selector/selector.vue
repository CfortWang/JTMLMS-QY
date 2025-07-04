<template>
    <div
        class="el-selector"
        @click="handleFocus"
    >
        <div
            v-if="selected && selected.length >0"
            ref="tags"
            :style="{ 'max-width': inputWidth + 'px', width: '80%',overflow: 'hidden','white-space': 'ellipsis', 'word-break': 'break-all','text-overflow': 'ellipsis'}"
            class="el-selector__tags"
        >
            <transition-group @after-leave="resetInputHeight">
                <template v-for="(item, index) in selected">
                    <template v-if="$utils.isNotEmpty(item)">
                        <!-- 第一个选中值一直显示为内容，非列表查询条件一直显示为内容 -->
                        <el-tag
                            v-if="index === 0 || !tempSearch"
                            :key="item + index"
                            type="primary"
                            :closable="!selectDisabled"
                            :size="collapseTagSize"
                            disable-transitions
                            @close="deleteTag(index)"
                        >
                            <span class="el-selector__tags-text">{{ item }}</span>
                        </el-tag>
                        <el-tag
                            v-else-if="tempSearch && index === 1"
                            :key="item + index"
                            :size="collapseTagSize"
                            type="primary"
                        >
                            <span class="el-selector__tags-text">+ {{ selected.length - 1 }}</span>
                        </el-tag>
                    </template>
                </template>
            </transition-group>
        </div>
        <el-input
            ref="reference"
            v-model="selectedLabel"
            :disabled="selectDisabled"
            :validate-event="false"
            :size="selectSize"
            :placeholder="currentPlaceholder"
            type="text"
            :class="inputClass"
            @focus="handleFocus"
            @mouseenter.native="inputHovering = true"
            @mouseleave.native="inputHovering = false"
        >
            <i v-if="prefixIconClass" slot="prefix" :class="prefixIconClass" />
            <!-- 来自模板的查询，且为自定义对话框，且有值时显示全部清空图标 -->
            <i v-if="selected.length > 0 && tempSearch && dialogSearch" slot="suffix" style="position: relative;;z-index: 100;" class="el-input__icon el-icon-circle-close" @click.stop="deleteAllTag()" />
        </el-input>
    </div>

</template>
<script>
import { addResizeListener, removeResizeListener } from '@/plugins/element-ui/src/utils/resize-event'
import emitter from '@/plugins/element-ui/src/mixins/emitter'
const sizeMap = {
    'medium': 36,
    'small': 32,
    'mini': 28
}

export default {
    name: 'ibps-selector',
    mixins: [emitter],
    props: {
        items: {
            type: Array
        },
        placeholder: {
            type: String,
            default: '请选择'
        },
        multiple: { // 是否多选
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: 'el-icon-plus'
        },
        disabledIcon: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        showPlaceholder: { // 是否显示占位符
            type: Boolean,
            default: false
        },
        /**
         * 只读样式 【text original】
         */
        readonlyText: {
            type: String,
            default: 'original'
        },
        inputBorderStyle: {
            type: String
        },
        size: {
            type: String,
            default: 'mini'
        },
        tempSearch: { // 是否是数据模板使用的筛选条件
            type: Boolean,
            default: false
        },
        dialogSearch: { // 是否是自定义对话框
            type: Boolean,
            default: false
        }

    },
    data () {
        return {
            query: '',
            inputLength: 20,
            inputWidth: 0,
            inputHovering: false,
            selected: []
        }
    },
    computed: {
        hasValue () {
            return this.items && this.items.length > 0
        },
        selectedLabel () {
            return this.hasValue ? ' ' : ''
        },
        prefixIconClass () {
            let classes = ['el-selector__caret', 'el-input__icon']
            if ((this.disabled || this.readonly) && !this.disabledIcon) {
                return
            }

            if (this.hasValue) {
                classes = [...classes, this.icon, 'is-show-close']
            } else {
                classes.push(this.icon)
            }
            return classes
        },
        inputClass () {
            let classes = []
            if (this.readonlyText === 'text') {
                classes = ['el-selector__readonly-text']
            }
            if (this.inputBorderStyle) {
                classes = [...classes, 'el-selector__' + this.inputBorderStyle]
            }
            return classes
        },
        selectDisabled () {
            return this.disabled || (this.elForm || {}).disabled
        },
        selectSize () {
            return this.size || (this.elFormItem || {}).elFormItemSize || (this.$ELEMENT || {}).size
        },
        collapseTagSize () {
            return ['small', 'mini'].indexOf(this.selectSize) > -1 ? 'mini' : 'small'
        },
        currentPlaceholder () {
            if (!this.showPlaceholder && (this.readonly || this.selectDisabled)) {
                return ''
            }

            if (!this.items || (Array.isArray(this.items) && this.items.length === 0)) {
                return this.placeholder
            } else {
                return ''
            }
        }
    },
    watch: {
        items (val) {
            if (val) {
                this.setSelected()
            }
        }
    },
    mounted () {
        addResizeListener(this.$el, this.handleResize)
        const reference = this.$refs.reference
        this.$nextTick(() => {
            if (reference && reference.$el) {
                this.inputWidth = reference.$el.getBoundingClientRect().width
            }
        })
        this.setSelected()
    },
    beforeDestroy () {
        removeResizeListener(this.$el, this.handleResize)
    },
    methods: {
        setSelected () {
            const result = []
            if (Array.isArray(this.items)) {
                this.items.forEach(item => {
                    result.push(item)
                })
            }
            this.selected = result
            if (this.multiple) {
                this.$nextTick(this.resetInputHeight)
            }
        },
        resetInputWidth () {
            if (!this.$refs.reference) return
            this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width
        },
        resetInputHeight () {
            this.$nextTick(() => {
                if (!this.$refs.reference) return
                const inputEl = this.$refs.reference.$refs.input
                const tags = this.$refs.tags
                let height = sizeMap[this.selectSize] || 40
                if (this.selected.length !== 0) {
                    height = Math.max((tags.clientHeight + (tags.clientHeight > height ? 6 : 0)), height)
                }
                inputEl.style.height = `${height}px`
            })
        },
        handleResize () {
            this.resetInputWidth()
            if (this.multiple) this.resetInputHeight()
        },
        handleFocus () {
            if (this.disabled) return
            this.$refs.reference.blur()
            this.$emit('click')
        },
        deleteTag (index) {
            this.$emit('remove', index)
        },
        deleteAllTag (index) {
            this.$emit('removeAll')
        }
    }
}
</script>
