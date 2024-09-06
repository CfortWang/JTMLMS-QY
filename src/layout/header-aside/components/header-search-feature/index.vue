<template>
    <div class="header-search-feature">
        <el-autocomplete
            ref="input"
            v-model="searchText"
            class="custom-autocomplete"
            suffix-icon="el-icon-search"
            placeholder="功能查找"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            :popper-append-to-body="false"
            clearable
            @clear="handleClear"
            @select="handleSelect"
        >
            <ibps-panel-search-item slot-scope="{ item }" :item="item" />
        </el-autocomplete>
    </div>
</template>

<script>
import IbpsPanelSearchItem from '../panel-search/components/panel-search-item/index.vue'
import { mapState } from 'vuex'
import mixin from '../mixin/menu'
import Fuse from 'fuse.js'
export default {
    components: {
        IbpsPanelSearchItem
    },
    mixins: [mixin],
    data () {
        return {
            searchText: '',
            results: []
        }
    },
    computed: {
        ...mapState('ibps/search', [
            'hotkey',
            'pool'
        ]),
        // 根据 pool 更新 fuse 实例
        fuse () {
            return new Fuse(this.pool, {
                shouldSort: true,
                tokenize: true,
                threshold: 0.6,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    'fullTitle',
                    'path'
                ]
            })
        }
    },
    methods: {
        /**
     * @description 接收用户在下拉菜单中选中事件
     */
        async handleSelect ({ path }) {
            // 如果用户选择的就是当前页面 就直接关闭搜索面板
            if (path === this.$route.path) {
                this.handleEsc()
                return
            }
            // 用户选择的是其它页面
            await this.$nextTick()
            this.handleMenuSelect(path)
        },
        /**
     * @description 过滤选项 这个方法在每次输入框的值发生变化时会触发
     */
        querySearch (queryString, callback) {
            const results = this.fuse.search(queryString).map(e => e.item)
            this.results = results
            callback(results)
        },
        /**
     * @augments 接收用户触发的关闭
     */
        async handleEsc () {
            this.closeSuggestion()
            await this.$nextTick()
            this.$emit('close')
        },
        closeSuggestion () {
            if (this.$refs.input.activated) {
                this.$refs.input.suggestions = []
                this.$refs.input.activated = false
            }
        },
        handleClear () {
            // 清空输入框后手动让输入框失焦
            document.activeElement.blur()
        }
    }
}
</script>

<style lang="scss" scoped>
.header-search-feature {
    .custom-autocomplete  ::v-deep .el-autocomplete-suggestion{
        width: auto !important;
    }
}

</style>
