<template>
    <ibps-layout ref="layout">
        <!--  -->
        <div slot="west">
            <ibps-tree
                :width="width"
                :height="height"
                :data="treeData"
                :options="treeOptions"
                :contextmenus="treeContextmenus"
                title="分类管理"
                :category-key="categoryKey"
                @action-event="handleTreeAction"
                @node-click="handleNodeClick"
                @expand-collapse="handleExpandCollapse"
            >
                <el-select
                    slot="searchForm"
                    v-model="categoryKey"
                    @change="loadTreeData(false)"
                >
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.categoryKey"
                    />
                </el-select>
            </ibps-tree>
        </div>

        <ibps-container
            :margin-left="width+'px'"
            class="page"
        >
            <edit
                v-show="show"
                :id="editId"
                ref="editForm"
                :readonly="readonly"
                :category-key="categoryKey"
                :parent-data="nodeData"
                :is-private="isPrivate"
                :random-num="randomNum"
                display-type="edit"
                @callback="loadTreeData"
            />
            <el-alert
                v-show="!show"
                :closable="false"
                title="请选择左边菜单右键进行操作！"
                type="warning"
                show-icon
                style="height:50px;"
            />
        </ibps-container>

        <!-- 数据字典 -->
        <import-xml
            :id="editId"
            :visible="importFormVisible"
            @callback="callback"
            @close="visible => importFormVisible = visible"
        />
        <sort
            :id="editId"
            :visible="sortFormVisible"
            title="分类排序"
            :category-key="categoryKey"
            @callback="callback"
            @close="visible => sortFormVisible = visible"
        />
    </ibps-layout>
</template>
<script>
import { queryPageList } from '@/api/platform/cat/category'
import { remove, exportXml, findTreeData } from '@/api/platform/cat/type'
import ActionUtils from '@/utils/action'
import FixHeight from '@/mixins/height'
import ImportXml from './import-xml'
import Sort from './sort'
import Edit from './edit'

export default {
    components: {
        ImportXml,
        Sort,
        Edit
    },
    mixins: [FixHeight],
    data () {
        const { first, second } = this.$store.getters.level || {}
        return {
            width: 200,
            level: second || first,
            height: document.clientHeight,
            importFormVisible: false,
            sortFormVisible: false,
            editId: '0', // 编辑dialog需要使用
            readonly: false, // 是否只读
            randomNum: '',
            loading: false,
            // 树配置
            treeOptions: { 'rootPId': '-1' },
            treeContextmenus: [
                {
                    icon: 'add',
                    label: '添加分类',
                    value: 'add',
                    rights: function (menu, data, isRoot) {
                        if (isRoot) return true
                        if (data.struType === '0') return false // 平铺结构类型不允许添加子分类
                        if (!(data.ownerId === '0' || this.$utils.isEmpty(data.ownerId))) {
                            return false
                        }
                        return true
                    }
                },
                {
                    icon: 'add',
                    label: '添加私有分类',
                    value: 'addPrivate',
                    rights: function (menu, data, isRoot) {
                        if (data.struType === '0') return false // 平铺结构类型不允许添加子分类
                        return true
                    }
                },
                { icon: 'edit', label: '编辑分类', value: 'edit', rights: ['node'] },
                { icon: 'delete', label: '删除分类', value: 'remove', rights: ['node'] },
                { type: 'divided' },
                { icon: 'export',
                    label: '导出',
                    value: 'export',
                    rights: function (menu, data, isRoot) {
                        if (!this.$store.getters.isSuper) return false
                        return true
                    }
                },
                { icon: 'import',
                    label: '导入',
                    value: 'import',
                    rights: function (menu, data, isRoot) {
                        if (!this.$store.getters.isSuper) return false
                        return true
                    } },
                {
                    type: 'divided',
                    rights: function (menu, data, isRoot) {
                        if (isRoot) return true
                        if (data.isLeaf === 'Y') return false
                        return true
                    }
                },
                {
                    icon: 'sort',
                    label: '子节点排序',
                    value: 'sort',
                    rights: function (menu, data, isRoot) {
                        if (isRoot) return true
                        if (data.isLeaf === 'Y') return false
                        return true
                    }
                }
            ],
            treeData: [],
            nodeData: {},
            isPrivate: false,
            type: {},
            categoryKey: '',
            categoryOptions: [],
            show: false
        }
    },
    created () {
        this.loadCategoryData()
        this.loadTreeData()
    },
    methods: {
    // 加载下拉框 分类标识数据
        loadCategoryData () {
            this.loading = true
            let whereParams = {}
            const allRequests = []
            if (this.$route?.meta?.name === 'wjjflsz') {
                this.categoryKey = 'FILE_TYPE'
                const keys = ['FILE_TYPE', 'FLOW_TYPE']
                keys.forEach(item => {
                    whereParams = {
                        parameters: [
                            {
                                key: 'Q^category_key_^SL',
                                value: item
                            }
                        ]
                    }
                    allRequests.push(queryPageList(whereParams))
                })
            } else {
                this.categoryKey = 'FLOW_TYPE'
                allRequests.push(queryPageList(whereParams))
            }
            Promise.all(allRequests).then(responses => {
                this.categoryOptions = []
                responses.forEach(response => {
                    this.categoryOptions.push(...response.data.dataResult)
                })
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        // 加载具体分类数据
        loadTreeData (isEdit) {
            //  文件分类获取文件类型需要根据地点进行数据过滤
            const whereParams = {
                'categoryKey': this.categoryKey
            }
            if (this.categoryKey === 'FILE_TYPE') {
                whereParams.diDian = this.level
            }
            findTreeData(whereParams).then(response => {
                const data = response.data
                this.treeData = data
                this.show = isEdit
            })
        },
        handleTreeAction (command, position, selection, data) {
            if (data?.sn === 0 && data?.name === '文件分类') {
                const object = {
                    diDian: this.level,
                    buMen: '',
                    chaYue: '公用查阅',
                    shenCha: '不需要',
                    shenHeZouXiang: ''
                }
                data.authorityName = JSON.stringify(object)
            }
            if (position === 'toolbar') {
                if (command === 'refresh') {
                    this.loadTreeData()
                }
            } else {
                if (command === 'add') { // 添加
                    if (this.isSpecial(data.name, 0)) {
                        return
                    }
                    if (this.isSpecial(data.name, 3)) {
                        return
                    }
                    this.editId = null
                    this.nodeData = data
                    this.isPrivate = false
                    this.handTreeEdit()
                } else if (command === 'addPrivate') {
                    if (this.isSpecial(data.name, 0)) {
                        return
                    }
                    if (this.isSpecial(data.name, 3)) {
                        return
                    }

                    this.editId = null
                    this.isPrivate = true
                    this.nodeData = data
                    this.handTreeEdit()
                } else if (command === 'edit') {
                    if (this.isSpecial(data.name, 1)) {
                        return
                    }
                    this.handleNodeClick(data, false)
                } else if (command === 'remove') {
                    if (this.isSpecial(data.name, 1)) {
                        return
                    }
                    this.handleTreeRemove(data.id)
                } else if (command === 'export') {
                    this.handTreeExport(data.id, data.name)
                } else if (command === 'import') {
                    this.handTreeImport(data.id)
                } else if (command === 'sort') {
                    this.handTreeSort(data)
                }
            }
        },
        handleNodeClick (data, readonly = true) {
            if (data.depth === 0 || data.parentId === '-1') {
                return
            }
            this.readonly = readonly
            this.nodeData = data
            this.editId = data.id
            this.show = true
            this.randomNum = (new Date()).getTime()
        },
        handleExpandCollapse (isExpand, readonly = false) {
            this.width = isExpand ? 200 : 50
        },
        handTreeEdit (editId, readonly = false) {
            this.editId = editId || ''
            this.readonly = readonly
            this.show = true
            this.randomNum = (new Date()).getTime()
        },
        handTreeImport (editId) {
            this.editId = editId || ''
            this.importFormVisible = true
        },
        handTreeSort (data) {
            const children = data.children
            if (children && children.length > 0) {
                if (children.length === 1) {
                    ActionUtils.warning('只有一个节点无需排序')
                } else {
                    this.editId = data.id || ''
                    this.sortFormVisible = true
                }
            } else {
                ActionUtils.warning('无子节点排序')
            }
        },
        handTreeExport (editId, name) {
            // 获取数据
            exportXml({ typeId: editId }).then(response => {
                ActionUtils.exportFile(response.data, name + '.xml')
            }).catch(() => {

            })
        },
        handleTreeRemove (ids) {
            // 获取数据
            remove({ typeId: ids }).then(response => {
                ActionUtils.removeSuccessMessage()
                this.loadTreeData()
            }).catch(() => {

            })
        },
        getSelectedData (id, list) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].id === id) {
                    return list[index]
                }
            }
        },
        callback (data) {
            this.loadTreeData()
        },
        isSpecial (name, type) {
            const fileType = ['内部文件', '外部文件', '记录表单']
            // if (this.categoryKey === 'FILE_TYPE' && name=='文件分类' && type == '0') {
            //     ActionUtils.warning('请不要操作文件分类！！如果需要更改，请联系管理员。')
            //     return true
            // }
            if (this.categoryKey === 'FILE_TYPE' && fileType.includes(name) && type === '1') {
                ActionUtils.warning('涉及系统代码逻辑，请谨慎操作内部文件、外部文件、记录表单分类！！如果需要更改，请联系管理员。')
                return false
            }
            if (this.categoryKey === 'FILE_TYPE' && name === '记录表单' && type === '3') {
                ActionUtils.warning('涉及系统代码逻辑，请谨慎操作记录表单！！如果需要更改，请联系管理员。')
                return false
            }
            return false
        }
    }
}
</script>
