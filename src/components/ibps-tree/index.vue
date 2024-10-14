<template>
    <div
        ref="ibpsTree"
        :style="{ width: width + 'px', position: location }"
        class="ibps-tree"
    >
        <div
            v-if="title"
            ref="header"
            :class="['layout-header--' + $ELEMENT.size]"
            class="layout-header"
        >
            <div
                v-show="isExpand"
                :style="{ width: width - 55 + 'px' }"
                class="layout-header-title ibps-ellipsis"
            >
                {{ title }}
            </div>
            <div v-if="angleDouble" class="layout-header-tools">
                <el-tooltip
                    :content="isExpand ? '收缩' : '展开'"
                    placement="bottom-start"
                >
                    <a
                        herf="javascript:void(0);"
                        class="pinBtn"
                        @click="handleExpandCollapse"
                    >
                        <ibps-icon :name="expandCollapseIcon" />
                    </a>
                </el-tooltip>
            </div>
        </div>
        <div
            v-if="toolbars"
            :class="isExpand ? 'ibps-show-expand' : 'ibps-show-collapse'"
        >
            <div
                v-if="toolbars"
                v-show="isExpand"
                ref="toolbar"
                class="ibps-tree-toolbar"
            >
                <ibps-toolbar
                    :actions="toolbars"
                    type="icon"
                    @action-event="handleActionEvent"
                />
            </div>
        </div>
        <div
            v-show="!isExpand"
            class="ibps-show"
            :style="{ height: (isExpand ? treeHeight : height) - 45 + 'px' }"
        >
            &nbsp;
        </div>
        <div
            v-if="$slots.searchForm"
            v-show="isExpand"
            ref="searchForm"
            class="ibps-tree-search-form"
        >
            <slot name="searchForm" />
        </div>
        <div
            v-show="isExpand"
            :style="{ height: (isExpand ? treeHeight : height) - 45 + 'px' }"
            class="ibps-tree-main"
        >
            <el-scrollbar
                style="height: 100%; width: 100%"
                wrap-class="ibps-tree-wrapper"
            >
                <el-tree
                    v-if="!lazy ? (treeData && treeData.length>0) : lazy "
                    ref="elTree"
                    v-loading="loading"
                    :data="!lazy ? treeData : null"
                    :lazy="lazy"
                    :load="load"
                    v-bind="treeOptions"
                    :default-expand-all="judgeTitle()"
                    node-key="id"
                    :default-expanded-keys="treeExpandData"
                    @node-click="handleNodeClick"
                    @node-contextmenu="handleNodeContextmenu"
                >
                    <span slot-scope="scope" class="ibps-custom-tree-node" :title="scope.node.label">
                        <!-- <img
                            v-if="['FILE_TYPE', 'FLOW_TYPE'].includes(categoryKey) && scope.data.categoryKey"
                            :src="filePng"
                            style="vertical-align: middle; height: 20px;"
                        > -->
                        <template v-if="['FILE_TYPE', 'FLOW_TYPE'].includes(categoryKey)">
                            <ibps-icon
                                v-if="scope.data.templateId"
                                style="font-size: 12px;"
                                name="file-text-o"
                            />
                            <ibps-icon v-else :name="getFolderIcon(scope)" />
                        </template>
                        <ibps-icon
                            v-else-if="showIcon"
                            :name="getIcon(scope.data)"
                        />
                        <span>{{ scope.node.label }}</span>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <!--右键菜单-->
        <ibps-contextmenu
            v-if="contextmenus"
            ref="contextmenu"
            :visible.sync="contextmenuFlag"
            :menulist="contextmenuList"
            :x="contentmenuX"
            :y="contentmenuY"
            :z-index="zIndex"
        >
            <ibps-contextmenu-list
                :menulist="contextmenuList"
                @row-click="handleContextmenuClick"
            />
        </ibps-contextmenu>
    </div>
</template>
<script>
import TreeUtils from '@/utils/tree'
import PopupManager from '@/utils/popup'
import IbpsContextmenu from '@/components/ibps-contextmenu'
import IbpsContextmenuList from '@/components/ibps-contextmenu/components/contentmenu-list'
import filePng from '@/assets/images/form/file.png'
export default {
    components: {
        IbpsContextmenu,
        IbpsContextmenuList
    },
    props: {
        title: String,
        angleDouble: {
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 200
        },
        height: {
            type: Number,
            default: 400
        },
        position: {
            type: String,
            default: 'west'
        },
        location: {
            type: String,
            default: 'initial'
        },
        loading: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array
        },
        dataType: {
            // 数据类型，tree：树形，list:列表
            type: String,
            default: 'list'
        },
        customZindex: {
            type: Number,
            default: 2003
        },
        options: {
            type: Object,
            default: () => {
                return {}
            }
        },
        toolbars: {
            type: [Array, Boolean],
            default: () => {
                return [
                    {
                        key: 'refresh'
                    },
                    {
                        key: 'expand'
                    },
                    {
                        key: 'compress'
                    }
                ]
            }
        },
        contextmenus: {
            type: Array,
            default: () => {
                return []
            }
        },
        load: Function,
        lazy: {
            type: Boolean,
            default: false
        },
        categoryKey: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            treeHeight: this.height,
            isExpand: true,
            autoPlacement: true,
            contextmenuFlag: false,
            contentmenuX: 0,
            contentmenuY: 0,
            contextmenuData: {},
            contextmenuList: [],
            zIndex: 2003,
            treeExpandData: [],
            activedId: '',
            filePng
        }
    },
    computed: {
        treeData () {
            if (!this.data || this.data.length === 0) return []
            this.data.map((item) => {
                if (item.name === '任务分类') {
                    item.name = '记录分类'
                }
            })
            if (this.dataType === 'list') {
                return TreeUtils.transformToTreeFormat(
                    JSON.parse(JSON.stringify(this.data)),
                    {
                        idKey: this.treeOptions['node-key'],
                        pIdKey: this.pidKey,
                        childrenKey: this.treeOptions['props']['children']
                    }
                )
            } else {
                return JSON.parse(JSON.stringify(this.data))
            }
        },
        treeOptions () {
            const defaultOptions = {
                rootPId: null,
                'node-key': 'id',
                'pid-key': 'parentId',
                'default-expand-all': true,
                'expand-on-click-node': false,
                'highlight-current': true,
                props: {
                    children: 'children',
                    label: 'name'
                }
            }
            return Object.assign(defaultOptions, this.options)
        },
        pidKey () {
            return this.treeOptions['pid-key']
        },
        rootPId () {
            return this.treeOptions['rootPId'] || null
        },
        showIcon () {
            return this.treeOptions['showIcon'] || false
        },
        expandCollapseIcon () {
            if (this.position === 'west') {
                return this.isExpand ? 'angle-double-left' : 'angle-double-right'
            } else {
                return this.isExpand ? 'angle-double-right' : 'angle-double-left'
            }
        }
    },
    watch: {
        height () {
            this.handleTreeHeight()
        },
        customZindex (val) {
            this.zIndex = val
        },
        treeData (val) {
            // if (val && val[0] && val[0].children) {
            //     this.treeExpandData.push(val[0].children[0].id)
            // }
            // 如果是部门管理里只显示一个医院的，那么就展开所有的节点
            if (val && val[0] && val[0].children && val[0].children.length === 1 &&
                this.title === '部门管理') {
                return
            }
            if (val && val[0] && val[0].children && val[0].children.length && val[0].children.length !== 1) {
                // 默认打开第三层
                for (const i of val[0].children) {
                    if (i.children) {
                        this.treeExpandData.push(
                            i.children.length ? i.children[0].id : i.id
                        )
                    }
                }
            }
        }
    },
    mounted () {
        this.handleTreeHeight()
        if (this.contextmenus && this.contextmenus.length > 0) {
            this.fixZIndex()
        }
    },
    methods: {
        /**
         * 判斷tree是否展开
         */
        judgeTitle () {
            if (this.title === '业务对象管理' || this.title === undefined || (this.treeData[0] && this.treeData[0].children && this.treeData[0].children.length === 1 && this.title === '部门管理')) {
                return true
            }
            return this.lazy
        },
        /**
         * zxh 修复zindex 不是最高的被遮住
         */
        fixZIndex () {
            this.zIndex = PopupManager.getZIndex()
        },
        getIcon (data) {
            let icon = data ? data[this.treeOptions['iconKey'] || 'icon'] : 'list-alt'
            if (icon) {
                return icon
            }
            if (data[this.pidKey] === this.rootPId) {
                icon = this.treeOptions['rootIcon'] || 'home'
            } else {
                icon = this.treeOptions['nodeIcon'] || 'list-alt'
            }
        },
        getFolderIcon ({ data, node }) {
            const { expanded, childNodes = [] } = node
            const { id } = data
            return (expanded && childNodes.length) || id === this.activedId ? 'folder-open-o' : 'folder-o'
        },
        handleTreeHeight () {
            this.treeHeight = this.height
            if (this.$refs.header) {
                this.treeHeight -= this.$refs.header.clientHeight
            }
            if (this.$refs.toolbar) {
                this.treeHeight -= this.$refs.toolbar.clientHeight
            }
            if (this.$refs.searchForm) {
                this.treeHeight -= this.$refs.searchForm.clientHeight
            }
        },
        handleActionEvent (action, position, data) {
            const command = action.key
            if (command === 'expand') {
                this.expandCompressTree(true)
            } else if (command === 'compress') {
                this.expandCompressTree(false)
            }
            this.$emit('action-event', command, position, data)
        },
        expandCompressTree (expanded) {
            for (
                var i = 0;
                i < this.$refs.elTree.store._getAllNodes().length;
                i++
            ) {
                this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
            }
        },
        handleNodeClick (data) {
            this.activedId = data.id
            this.$emit('node-click', data)
        },
        refreshNode (id) {
            const node = this.$refs.elTree.getNode(id) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
        },
        /**
         * 处理节点右键菜单
         */
        handleNodeContextmenu (event, data) {
            if (!this.contextmenus || this.contextmenus.length === 0) return
            let target = event.target
            let flag = false
            if ((target && target.className.indexOf('el-tree-node__content') > -1) || (target && target.className.indexOf('ibps-custom-tree-node') > -1)) {
                flag = true
            } else if ((target && target.parentNode.className.indexOf('el-tree-node__content') > -1) || (target && target.parentNode.className.indexOf('ibps-custom-tree-node') > -1)) {
                target = target.parentNode
                flag = true
            }
            if (flag) {
                event.preventDefault()
                event.stopPropagation()
                this.handleContextmenuList(data)
                this.contextmenuData = data
                this.contextmenuFlag = true
                this.handleReferenceContextmenu(event)
            }
        },
        handleContextmenuList (data) {
            this.contextmenuList = []
            const isRoot = data[this.pidKey] === this.rootPId
            this.contextmenus.forEach((menu) => {
                if (!menu.rights) {
                    this.contextmenuList.push(menu)
                } else {
                    if (Array.isArray(menu.rights)) {
                        if (menu.rights.indexOf('node') > -1 && !isRoot) {
                            this.contextmenuList.push(menu)
                        }
                    } else if (typeof menu.rights === 'function') {
                        if (menu.rights.call(this, menu, data, isRoot)) {
                            this.contextmenuList.push(menu)
                        }
                    }
                }
            })
        },
        // 处理菜单位置
        handleReferenceContextmenu (event) {
            const eventX = event.pageX
            const eventY = event.pageY
            this.$nextTick(() => {
                const contextmenuPosition = {
                    top: eventY,
                    left: eventX
                }
                if (this.autoPlacement) {
                    const el = this.$refs.contextmenu.$el
                    const contextmenuWidth = el.clientWidth
                    const contextmenuHeight = el.clientHeight
                    if (contextmenuHeight + eventY >= window.innerHeight) {
                        contextmenuPosition.top -= contextmenuHeight
                    }
                    if (contextmenuWidth + eventX >= window.innerWidth) {
                        contextmenuPosition.left -= contextmenuWidth
                    }
                }

                this.contentmenuX = contextmenuPosition.left
                this.contentmenuY = contextmenuPosition.top
            })
        },
        handleContextmenuClick (command) {
            this.contextmenuFlag = false
            this.$emit(
                'action-event',
                command,
                'contextmenu',
                this.contextmenuData[this.pkKey],
                this.contextmenuData
            )
        },
        handleExpandCollapse () {
            this.isExpand = !this.isExpand
            this.$emit('expand-collapse', this.isExpand)
        },
        remove (data) {
            this.$refs.elTree.remove(data)
        },
        getCurrentKey () {
            return this.$refs.elTree.getCurrentKey()
        }
    }
}
</script>

<style lang="scss" scoped>
$border-color: #e5e6e7;
.ibps-tree {
    .layout-header {
        background: #ffffff;
        height: 35px;
        border-left: 1px solid $border-color;
        border-bottom: 1px solid $border-color;
        font-weight: bold;
        text-align: center;
        padding: 5px;
        position: relative;
        overflow: hidden;
        overflow-y: none;
        &--medium {
            height: 40px;
        }
        &--small {
            height: 35px;
        }
        &--mini {
            height: 30px;
        }
        .layout-header-title {
            float: left;
            text-align: left;
            font-size: 14px;
            margin: 10px 5px 5px;
            padding: 0;
        }
        .layout-header-tools {
            float: right;
            margin-top: 5px;
            position: relative;
            padding: 0;
            .pinBtn {
                cursor: pointer;
                margin-left: 5px;
                color: #c4c4c4;
                font-size: 25px;
            }
        }
    }
    .ibps-show {
        background: #ffffff;
    }
    .ibps-show-expand {
        height: 42px;
        background: #ffffff;
        border-bottom: 1px solid $border-color;
    }

    .ibps-show-collapse {
        background: #ffffff;
    }

    .ibps-tree-toolbar {
        border: 1px solid $border-color;
        height: 35px;
        padding: 5px;
    }

    .ibps-tree-search-form {
        padding: 5px;
        border-right: 1px solid $border-color;
        background: #ffffff;
    }
    .ibps-tree-main {
        border: 1px solid $border-color;
        background: #ffffff;
    }
    .ibps-tree-wrapper {
        background: #ffffff;
        ::v-deep {
            .el-tree > .el-tree-node {
                display: block;
            }
        }
    }
    .ibps-custom-tree-node {
        font-size: 13px;
        padding-right: 8px;
        .ibps-icon {
            margin-right: 2px;
        }
    }
}
</style>
