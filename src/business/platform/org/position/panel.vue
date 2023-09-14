<template>
    <div>
        <div v-if="toolbars" ref="toolbar" class="ibps-tree-toolbar">
            <ibps-toolbar
                :actions="toolbars"
                type="icon"
                @action-event="handleTreeAction"
            />
        </div>
        <!-- <div ref="searchForm" class="ibps-tree-search-form">
            <el-row style="padding-right:12px;" :gutter="5">
                <el-col :span="21">
                    <el-input v-model="filterText" placeholder="请输入岗位名称" clearable />
                </el-col>
                <el-col :span="2">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="handleMoreSearch">更多</el-button>
                </el-col>
            </el-row>
        </div> -->
        <div :style="{ height: tableHeight + 'px' }">
            <el-scrollbar style="height: 100%" wrap-class="ibps-tree-wrapper ibps-scrollbar-wrapper">
                <!-- 多选-->
                <el-tree
                    v-if="multiple"
                    ref="elTree"
                    v-loading="loading"
                    :data="treeData"
                    :expand-on-click-node="false"
                    :props="{ children: 'children', label: 'name',isLeaf: 'leaf'}"
                    :load="loadTreeNode"
                    :lazy="lazyTree"
                    :show-checkbox="multiple"
                    :check-strictly="true"
                    :filter-node-method="filterNode"
                    node-key="id"
                    pid-key="parentId"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="defaultExpandAll"
                    highlight-current
                    check-on-click-node
                    @check-change="handleCheckChange"
                />
                <!-- 单选-->
                <el-tree
                    v-else
                    ref="elTree"
                    v-loading="loading"
                    :data="treeData"
                    :expand-on-click-node="false"
                    :props="{ children: 'children', label: 'name',isLeaf: 'leaf'}"
                    :load="loadTreeNode"
                    :lazy="lazyTree"
                    node-key="id"
                    pid-key="parentId"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="defaultExpandAll"
                    highlight-current
                    :show-checkbox="multiple"
                    @node-click="onNodeClick"
                >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <el-radio
                            v-model="radio"
                            :label="data[pkKey]"
                            :disabled="data.disabled"
                            @change="changeRadio(data)"
                        >{{ node.label }}</el-radio>
                    </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <more-search
            ref="moreSearch"
            :title="title"
            :visible="dialogFormVisible"
            :party-type="partyType"
            @callback="search"
            @close="visible => dialogFormVisible = visible"
            @action-event="handleMoreSearchAction"
        />
    </div>
</template>
<script>
import { getScriptValue } from '@/api/platform/form/formDef'// 脚本
import { findTreeData as getTreeData } from '@/api/platform/org/position'
// import { findTreeData as getPositionTreeData } from '@/api/platform/org/entity'

import MoreSearch from './more-search'
import TreeUtils from '@/utils/tree'

export default {
    components: {
        MoreSearch
    },
    props: {
        value: [Object, Array],
        multiple: Boolean,
        height: {
            type: String,
            default: '400px'
        },
        partyTypeId: {
            // 类型节点ID
            type: [String, Number],
            default: ''
        },
        currentOrgId: {
            // 用户组ID
            type: [String, Number],
            default: ''
        },
        script: String,
        isUseScope: {
            // 是否启用范围
            type: Boolean,
            default: false
        },
        partyType: {
            // 类型节点ID
            type: String,
            default: 'position'
        },
        filtrate: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            parentId: '0',
            defaultExpandAll: true,
            lazyTree: true,
            defaultExpandedKeys: ['0'],
            moreSearchParams: {},
            radio: '',
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            loading: false,
            dialogFormVisible: false,
            filterText: '',
            title: '更多查询',
            // 树配置
            treeData: [],
            toolbars: [
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
    computed: {
        tableHeight () {
            const h = this.height.substr(0, this.height.length - 2)
            return parseInt(h) - 10
        }
    },
    watch: {
        filterText (val) {
            this.$refs.elTree.filter(val)
        }
    },
    methods: {
        setChecked (data, selected) {
            if (data !== undefined) {
                this.$refs['elTree'].setChecked(data, selected)
            } else {
                this.radio = ''
            }
        },
        cleanData (multiple) {
            if (multiple) {
                this.$refs['elTree'].setCheckedKeys([])
            } else {
                this.radio = ''
            }
        },
        // 加载岗位树
        loadTreeNode (node, resolve) {
            this.loading = true
            let params = {}
            const type = this.partyTypeId !== '' ? this.partyTypeId : '1'
            if (this.isUseScope) {
                params.type = type === '2' ? '1' : type
                params.includeSub = type === '1' || type === '2'
                if (type === '2') {
                    // params.partyId = node.level === 0 ? null : node.data.id
                    params.posId = node.level === 0 ? null : node.data.id
                }
                if (type === '3') {
                    params.partyId = this.currentOrgId
                }
                if (type === '1') {
                    params.posId = node.level === 0 ? null : node.data.id
                }
                // TODO: 用户选择器的岗位懒加载，待岗位选择器处理完整后统一处理。2类型有问题！
                //  脚本类型初始化
                if (type === 'script') {
                    this.getScriptData(this.script)
                    this.loading = false
                    return
                }
            } else {
                params.type = '1'
                params.posId = node.level === 0 ? null : node.data.id
            }
            if (this.moreSearchParams) {
                Object.assign(params, this.moreSearchParams)
            }
            if (this.$utils.isEmpty(node.data) || node.data.id === '0') {
                getTreeData(params).then(res => {
                    this.loading = false
                    const arr = JSON.parse(JSON.stringify(res.data))
                    // 岗位数改成部门树
                    // 岗位数改成部门树
                    const arrOne = []
                    const arrTwo = []
                    arr.forEach((item) => {
                        if (item.name === '岗位树') {
                            item.name = '部门树'
                            arrOne[0] = item
                        } else {
                            arrTwo.push(item)
                        }
                    })
                    let treeData
                    if (type === '3') {
                        arrTwo.forEach((item) => {
                            item.leaf = true
                        })
                        this.treeData = arrTwo
                    } else {
                        let arrList = []
                        const frist = this.$store.getters.level.first || ''
                        if ((type === '1' || type === '2') && this.filtrate && frist) {
                            const showBoo = arr.some((item) => item.id === frist)
                            if (showBoo) {
                                arrList = arr.filter((item) => item.id === frist)
                            } else {
                                arrList = arr
                            }
                        } else {
                            arrList = arr
                        }

                        if (type === '2') {
                            this.getPosiData(arrList, true, true)
                        }

                        if (this.$utils.isEmpty(node.data)) {
                            treeData = arrList
                            resolve(this.toTree(treeData))
                        } else {
                            treeData = type === '1' || type === '2' ? arrList : this.filterTreeChildren(arrList, 'root')
                            resolve(this.toTree(treeData))
                        }
                    }
                }).catch(res => {
                    this.loading = false
                    resolve([])
                })
            } else if (node.data.id !== '0') {
                if (type === '2') {
                    params = {}
                    params.type = '1'
                    params.posId = node.data.id
                }
                getTreeData(params).then(res => {
                    this.loading = false
                    const arr = JSON.parse(JSON.stringify(res.data))

                    let arrList = []
                    const second = this.$store.getters.level.second || ''
                    if ((type === '1' || type === '2') && this.filtrate && second) {
                        const showBoo = arr.some((item) => item.id === second)
                        if (showBoo) {
                            arrList = arr.filter((item) => item.id === second)
                        } else {
                            arrList = arr
                        }
                    } else {
                        arrList = arr
                    }

                    if (type === '2') {
                        this.getPosiData(arrList, node.data.disabled, node.data.disabledShow)
                    }

                    resolve(this.toTree(arrList))
                }).catch(res => {
                    this.loading = false
                    resolve([])
                })
            }
        },
        getPosiData (arrList, disabled, disabledShow = false) {
            const positions = this.$store.getters.userInfo.employee.positions
            if (positions) {
                const positionsList = positions.split(',')
                positionsList.forEach(item => {
                    const index = arrList.findIndex(it => it.id === item)
                    if (index >= 0) {
                        arrList[index].disabled = true
                        arrList[index].disabledShow = true
                    }
                })
            }
            let dotCount = 0
            if (arrList && Array.isArray(arrList) && arrList.length > 0 && arrList[0].path) {
                // dotCount = (arrList[0].path.match(/\./g) || []).length
                dotCount = arrList[0].depth
            }
            // 如果上级可以选择 也就是 disabled false，下级一定是false
            // if(dotCount)

            if (!disabledShow) {
                arrList.forEach(item => {
                    item.disabled = false
                    item.disabledShow = false
                })
            } else {
                arrList.forEach(item => {
                    if (item.disabledShow) {
                        item.disabled = false
                        item.disabledShow = false
                    } else {
                        item.disabled = true
                        item.disabledShow = true
                    }
                })
            }

            if (dotCount <= 3) {
                console.log(5)
                arrList.forEach(item => {
                    item.disabled = true
                })
            }
        },
        toTree (data) {
            return TreeUtils.transformToTreeFormat(data, {
                idKey: 'id',
                pIdKey: 'parentId',
                childrenKey: 'children'
            })
        },
        // 根据渲染的数据范围类型，筛选目标节点
        filterTreeChildren (treeData, treeScope, nodeId) {
            const data = []
            // 返回设置的范围节点
            if (treeScope === 'root') {
                const currentOrgIds = this.currentOrgId.split(',')
                treeData.forEach(f => {
                    if (currentOrgIds.includes(f.id)) {
                        f.leaf = true
                        data.push(f)
                    }
                })
            }
            return data
        },
        // 脚本函数
        getScriptData (scriptValue) {
            getScriptValue({
                script: scriptValue,
                vars: ''
            }).then(response => {
                const data = JSON.parse(response.data)
                this.treeData = TreeUtils.transformToTreeFormat(data.data)
            })
        },
        filterNode (value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },

        /**
         * 处理更多查询弹窗
         */
        handleMoreSearch () {
            this.dialogFormVisible = true
        },
        /**
         * 更多查询
         */
        handleMoreSearchAction (data) {
            this.loading = true
            this.moreSearchParams = data
            getTreeData(data).then(response => {
                const data = response.data
                this.treeData = TreeUtils.transformToTreeFormat(data)
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 查询
         */
        search () {
            const node = this.$refs.elTree.getNode(this.parentId) // 通过节点id找到对应树节点对象
            node.loaded = false
            node.expand()
        },
        refreshTree () {
            this.parentId = '0'
            this.search()
        },
        /**
         * 重置查询条件
         */
        reset () {
            this.$refs['crud'].handleReset()
        },
        handleTreeAction (action, position, selection, data) {
            const command = action.key
            if (position === 'toolbar' && command === 'refresh') {
                this.refreshTree()
            }
            if (command === 'expand') {
                this.expandCompressTree(true)
            } else if (command === 'compress') {
                this.expandCompressTree(false)
            }
        },
        expandCompressTree (expanded) {
            for (let i = 0; i < this.$refs.elTree.store._getAllNodes().length; i++) {
                this.$refs.elTree.store._getAllNodes()[i].expanded = expanded
            }
        },
        handleCheckChange (data, checked) {
            if (data.id === 0 || data.id === '0') return
            let val = JSON.parse(JSON.stringify(this.value))
            if (checked) {
                const index = val.find((v) => {
                    return v[this.pkKey] === data[this.pkKey]
                })
                if (!index) { val.push(data) }
            } else {
                val = val.filter((v) => {
                    return v[this.pkKey] !== data[this.pkKey]
                })
            }
            this.$emit('selected', val)
        },
        changeRadio (data) {
            if (data.id === 0 || data.id === '0' || data.disabled) return
            this.$emit('selected', data)
        },
        onNodeClick (data, node, obj) {
            if (data.id === 0 || data.id === '0' || data.disabled) return
            this.radio = data[this.pkKey]
            this.$emit('selected', data)
        }
    }
}
</script>
<style lang="scss" scoped>
    $border-color: #e5e6e7;
    .ibps-tree-toolbar {
        border: 1px solid $border-color;
        height: 30px;
        padding: 5px;
    }
    .ibps-tree-search-form {
        padding: 5px;
        border-right: 1px solid $border-color;
        background: #ffffff;
    }
    .ibps-tree-main {
        border: 1px solid $border-color;
    }
    .ibps-tree-wrapper {
        background: #ffffff;

        .el-tree>.el-tree-node {
            display: inline-block;
        }
    }
</style>
