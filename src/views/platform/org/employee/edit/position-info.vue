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
                const treeData = this.toTree(arr)
                if (treeData[0].id === '0') {
                    treeData[0].name = '部门树'
                    treeData[0].disabled = true
                } // 根节点不能选择
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
        // 属于
        handleBelongTo () {
            const tree = this.$refs.elTree
            const postInfo = tree.getCheckedNodes() // 勾选
            if (this.$utils.isEmpty(postInfo)) {
                this.hint()
                return
            }
            for (let i = 0; i < postInfo.length; i++) {
                if (postInfo[i].id === '0') {
                    postInfo.splice(i, 1)
                }
            }
            this.posItemList = concat(this.posItemList, postInfo)
        },
        hint () {
            this.$alert('你还没有选择任何节点！', '信息', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {})
        },
        handleClear () {
            this.posItemList = []
            this.init()
        },
        deleteRow (index, row) {
            row.splice(index, 1)
        },
        changeMainPost (index, row) {
            this.radioSelection = row
            for (const item of this.posItemList) {
                item.isMainPost = 'N'
            }
            row.isMainPost = 'Y'
        },
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
