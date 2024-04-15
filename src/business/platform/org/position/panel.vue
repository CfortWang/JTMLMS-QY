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
                    :show-checkbox="multiple"
                    :check-strictly="true"
                    :filter-node-method="filterNode"
                    node-key="id"
                    pid-key="parentId"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-checked-keys="defaultCheckedKeys"
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
import { findTreeData as getTreeData, findAllPosition } from '@/api/platform/org/position'
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
        /**
         * partyTypeId：类型节点ID,
         * 即：选择范围里的顺序（1全部、2所在范围、3指定范围、4脚本）
         * 4的逻辑暂时未处理
         */
        partyTypeId: {
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
        let radio = ''
        let defaultCheckedKeys = []
        if (this.multiple) {
            if (this.value.length !== 0) {
                defaultCheckedKeys = this.value.map(i => i.id)
            }
        } else {
            if (this.value) {
                radio = this.value.id
            }
        }
        return {
            parentId: '0',
            defaultExpandAll: true,
            defaultCheckedKeys,
            lazyTree: true,
            defaultExpandedKeys: ['0'],
            moreSearchParams: {},
            radio,
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
    mounted () {
        const { position, isSuper = false } = this.$store.getters

        /**
        *  判断是否是超级管理员isSuper账号，目前以该账户为系统最大的管理权限
        *  如果是测试账号，则获取全部数据
        *  否则，获取当前用户所在医院的数据
        */
        if (this.partyTypeId !== '4') {
            const type = this.partyTypeId !== '' ? this.partyTypeId : '1'
            findAllPosition().then(res => {
                const { data = [] } = res || {}
                if (data.length) {
                    for (const i of data) {
                        if (!isSuper) {
                            switch (type) {
                                case '2':
                                    i.disabled = true
                                    // 展示所在部门及其上级部门，但是上级部门无法被选择到，但是下属部门要能选择
                                    for (const item of position.split(',')) {
                                        if ((this.$utils.getIndexOf(i.path.split('.'), item) > -1) &&
                                      (this.$utils.getIndexOf(i.path.split('.'), item) <= this.$utils.getIndexOf(i.path.split('.'), i.id))) {
                                            i.disabled = false
                                            break
                                        }
                                    }
                                    break
                                case '3':
                                    i.disabled = true
                                    // 展示指定范围的部门
                                    for (const item of this.currentOrgId.split(',')) {
                                        if ((this.$utils.getIndexOf(i.path.split('.'), item) > -1) &&
                                      (this.$utils.getIndexOf(i.path.split('.'), item) <= this.$utils.getIndexOf(i.path.split('.'), i.id))) {
                                            i.disabled = false
                                            break
                                        }
                                    }
                                    break
                                default:
                                // 展示该院下全部部门，且全部可选
                                    break
                            }
                        }
                    }
                }
                this.treeData = this.toTree(data)
            }).catch(res => {
            })
        } else {
            this.getScriptData(this.script)
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
        getPosiData (arrList, disabled, disabledShow = false, type) {
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
            // 如果上级可以选择 也就是 disabled false，下级一定是false

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
            this.disabledDotCount(arrList, type)
        },
        disabledDotCount (arrList, type = 1) {
            const isSuper = this.$store.getters.isSuper
            let dotCount = 0
            if (arrList && Array.isArray(arrList) && arrList.length > 0 && arrList[0].path) {
                dotCount = arrList[0].depth
            }
            //
            if (((type === '1' && !isSuper) || (type === '2')) && dotCount <= 2) {
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
