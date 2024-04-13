<template>
    <el-row :gutter="10">
        <el-col v-if="!readonly" :span="8" border>
            <div class="grid-content">
                <tree
                    ref="elTree"
                    :height="height"
                    :data="treeData"
                    :check-strictly="checkStrictly"
                    :options="{
                        'default-expand-all': false,
                        'expand-on-click-node': false,
                        'default-expanded-keys':['0'],
                        lazy:true,
                        load:loadTreeNode,
                        props: {
                            children: 'children',
                            label: 'name'
                        }
                    }"
                    node-key="id"
                    @action-event="handleTreeAction"
                />
            </div>
        </el-col>
        <el-col v-if="!readonly" :span="3">
            <el-button type="primary" icon="el-icon-d-arrow-right" class="ibps-ml-10" @click="handleBelongTo">分配</el-button>
            <el-button type="info" icon="el-icon-d-arrow-left" class="ibps-ml-10 ibps-mt-10" @click="handleClear">清空</el-button>
        </el-col>
        <el-col :span="spanNumber" border>
            <el-table
                :data="posItemList"
                style="width: 100%"
                border
            >
                <el-table-column label="部门名称">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否主部门" width="100">
                    <template slot-scope="scope">
                        <el-radio
                            :disabled="readonly"
                            :value="check(scope.row, 'radio')"
                            :label="scope.row.id"
                            @change.native="changeMainPost(scope.$index,scope.row)"
                        >
                            <span>&nbsp;</span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="主负责人" width="100">
                    <template slot-scope="scope">
                        <el-checkbox
                            :disabled="readonly"
                            :value="check(scope.row, 'checkbox')"
                            :label="scope.row.id"
                            @change.native="changeCharge(scope.$index,scope.row)"
                        >
                            <span>&nbsp;</span>
                        </el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column v-if="!readonly" label="管理" width="100">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="danger"
                            @click.native.prevent="deleteRow(scope.$index,posItemList)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script>
import { findTreeData as getTreeData } from '@/api/platform/org/position'
import { concat } from '../utils'
import TreeUtils from '@/utils/tree'

import Tree from '../../components/tree'

export default {
    components: {
        Tree
    },
    props: {
        data: Array,
        readonly: {
            type: Boolean,
            default: false
        },
        orgId: [Number, String],
        span: [Number, String]
    },
    data () {
        return {
            parentId: '0',
            pkKey: 'id',
            nameKey: 'name',
            treeData: [],
            posItemList: [],
            height: document.clientHeight,
            checkStrictly: true,
            defaultTreeData: []
        }
    },
    computed: {
        spanNumber () {
            return this.span
        }
    },
    watch: {
        data: {
            handler: function (val, oldVal) {
                this.posItemList = val
                const arr = JSON.parse(JSON.stringify(val))
                arr.forEach(item => {
                    this.defaultTreeData.push(item.id)
                })
                if (this.$refs.elTree) {
                    this.$refs.elTree.setCheckedKeys(this.defaultTreeData, true)
                }
            },
            deep: true
        },
        posItemList: {
            handler: function (val, oldVal) {
                if (val !== oldVal) {
                    this.handleEmitEvent()
                }
            },
            deep: true
        }
    },
    methods: {
        init () {
            if (this.$refs.elTree) {
                this.$refs.elTree.setCheckedNodes([])
            }
            this.defaultTreeData = []
        },
        // 查询
        refreshNode () {
            const node = this.$refs.elTree.getNode(this.parentId)
            node.loaded = false
            node.expand()
        },
        // 加载岗位树
        loadTreeNode (node, resolve) {
            const isSuper = this.$store.getters.isSuper
            const level = this.$store.getters.level
            this.loading = true
            const params = {}
            params.type = '1'
            params.posId = node.level === 0 ? null : node.data.id

            if (this.moreSearchParams) {
                Object.assign(params, this.moreSearchParams)
            }
            getTreeData(params).then(res => {
                this.loading = false
                const arr = JSON.parse(JSON.stringify(res.data))
                // 岗位树改成部门树
                arr.forEach(item => {
                    if (item.name === '岗位树') {
                        item.name = '部门树'
                        item.disabled = true
                    }
                })
                // 过滤部门  管理员不过滤
                let arrList = []
                if (!isSuper) {
                    const firstShow = arr.some(item => item.id === level.first)
                    const secondShow = arr.some(item => item.id === level.second)
                    if (level.first && firstShow) {
                        arrList = arr.filter(item => item.id === level.first)
                    } else if (level.second && secondShow) {
                        arrList = arr.filter(item => item.id === level.second)
                    } else {
                        arrList = arr
                    }
                } else {
                    arrList = arr
                }

                const treeData = this.toTree(arrList)
                resolve(treeData)
            }).catch(res => {
                this.loading = false
                resolve([])
            })
        },
        toTree (data) {
            return TreeUtils.transformToTreeFormat(data, {
                idKey: 'id',
                pIdKey: 'parentId',
                childrenKey: 'children'
            })
        },
        // 树事件
        handleTreeAction (command, position, selection, data) {
            if (position === 'toolbar' && command === 'refresh') {
                this.refreshNode()
            }
        },
        // 分配
        handleBelongTo () {
            const tree = this.$refs.elTree
            const postInfo = tree.getCheckedNodes() // 勾选
            if (this.$utils.isEmpty(postInfo)) {
                this.hint()
                return
            }
            const objs = []
            for (let i = 0; i < postInfo.length; i++) {
                if (postInfo[i].id === '0') {
                    postInfo.splice(i, 1)
                }
                const hadData = this.posItemList.find(fid => fid.id === postInfo[i].id)
                const obj = {
                    'name': postInfo[i].name,
                    'id': postInfo[i].id,
                    'posAlias': postInfo[i].alias,
                    'isMainPost': hadData ? hadData.isMainPost : 'N',
                    'isPrincipal': hadData ? hadData.isPrincipal : 'N',
                    'hasChild': postInfo[i].hasChild
                }
                objs.push(obj)
            }
            this.posItemList = concat(this.posItemList, objs)
        },
        // 清空
        handleClear () {
            this.posItemList = []
            this.init()
        },
        hint () {
            this.$alert('你还没有选择任何节点！', '信息', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {})
        },
        // 删除
        deleteRow (index, row) {
            // 删除行数据
            row.splice(index, 1)
            // 删除树选择的数据
            const tree = this.$refs.elTree
            tree.setCheckedNodes([])
            const arr = []
            for (const item of row) {
                arr.push({ id: item.id })
            }
            tree.setCheckedNodes(arr)
        },
        // 是否主部门 变更事件
        changeMainPost (index, row) {
            for (const item of this.posItemList) {
                item.isMainPost = 'N'
            }
            row.isMainPost = 'Y'
        },
        // 主负责人 变更事件
        changeCharge (index, row) {
            this.checkBoxSelection = row
            if (row.isPrincipal === 'Y') {
                row.isPrincipal = 'N'
            } else {
                row.isPrincipal = 'Y'
            }
        },
        handleEmitEvent () {
            this.$emit('input', this.posItemList)
        },
        // 回填显示单选、多选框的value
        check (row, type) {
            if (type === 'radio') {
                return row.isMainPost === 'Y' ? row.id : false
            } else if (type === 'checkbox') {
                return row.isPrincipal === 'Y'
            }
        }
    }
}
</script>
