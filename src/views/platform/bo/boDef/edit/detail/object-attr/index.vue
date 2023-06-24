<template>
    <div class="main-container bo-attr">
        <ibps-crud
            ref="crud"
            :data="listData"
            :toolbars="!isToolbars&&formData.boType!=='out'?listConfig.toolbars:false"
            :search-form="listConfig.searchForm"
            :pk-key="pkKey"
            :columns="listConfig.columns"
            :selection-row="!isToolbars&&formData.boType!=='out'?selectionRow:false"
            :index-row="false"
            :reserve-selection="true"
            :show-pagination="true"
            :pagination-options="{layout:'slot'}"
            selection-type="checkbox"
            row-key="id"
            @select="handleSelect"
            @row-click="handleRowClick"
            @action-event="handleAction"
        >
            <template #footer>
                <span class="el-pagination__total">{{ '共'+ listData.length }}条</span>
            </template>
        </ibps-crud>
        <edit
            :id="editId"
            :datas="editData"
            :title="title"
            :clear="clear"
            :is-create-table="formData.isCreateTable"
            :visible="dialogFormVisible"
            :readonly="readonly"
            @callback="callback"
            @close="visible => dialogFormVisible = visible"
        />
    </div>
</template>

<script>
import { typeOptions, defaultAttrs, subBoDefsAttrs, objectAttrRootData } from '../../../constants'
import { checkSameNode } from '@/views/platform/bo/boDef/utils'
import ActionUtils from '@/utils/action'
import Edit from './edit'
const uuid = () => {
    return require('uuid').v1()
}
export default {
    components: {
        Edit
    },
    props: {
        id: String,
        attrs: {
            type: Array,
            default: () => []
        },
        formData: Object,
        treeData: Array,
        review: Object,
        isMain: {
            type: String,
            default: 'Y'
        },
        toolbars: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        height: [String, Number]
    },
    data () {
        return {
            dialogFormVisible: false, // 弹窗
            editId: '', // 编辑dialog需要使用
            pkKey: 'id', // 主键  如果主键不是pk需要传主键
            editData: {},
            defaultData: [],
            title: '',
            clear: false,
            isSame: false,
            selection: [],
            selectionRow: {
                'reserveSelectione': true
            },
            listData: this.attrs,
            pagination: {},
            isRadio: true,
            listConfig: {
                toolbars: [
                    {
                        key: 'add'
                    },
                    {
                        key: 'edit'
                    },
                    {
                        key: 'moveUp',
                        label: '上移',
                        icon: 'ibps-icon-arrow-circle-up'
                    },
                    {
                        key: 'moveDown',
                        label: '下移',
                        icon: 'ibps-icon-arrow-circle-down'
                    },
                    {
                        key: 'remove'
                    },
                    {
                        key: 'reset',
                        label: '重置',
                        icon: 'ibps-icon-undo'
                    }
                ],
                searchForm: {},
                // 表格字段配置
                columns: [
                    { prop: 'name', label: '名称', minWidth: 150 },
                    { prop: 'code', label: '编码', width: 140 },
                    { prop: 'fieldName', label: '字段', width: 140 },
                    { prop: 'desc', label: '字段描述', width: 200 },
                    { prop: 'dataType', label: '属性类型', tags: typeOptions, width: 120 }
                ]
            }
        }
    },
    computed: {
        isToolbars () {
            return this.toolbars
        },
        reviewData () {
            return this.review
        }
    },
    watch: {
        attrs: {
            handler (val, oldVal) {
                if (this.$utils.isNotEmpty(this.attrs)) {
                    this.listData = this.attrs
                }
            },
            deep: true
        },
        listData: {
            handler (val, oldVal) {
                this.checkNode(this.reviewData, this.treeData)
                this.$emit('change', this.listData)
            },
            deep: true
        }
    },
    methods: {
        /**
         * 处理按钮事件
         */
        handleAction (command, position, selection, data) {
            switch (command) {
                case 'add':// 添加
                    this.handleEdit()
                    this.title = '添加对象属性'
                    break
                case 'edit':// 编辑
                    ActionUtils.selectedRecord(selection).then((id) => {
                        this.handleEdit(id)
                        this.title = '编辑对象属性'
                    }).catch(() => { })
                    break
                case 'moveUp':// 上移
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.moveUp(ids)
                    }).catch(() => { })
                    break
                case 'moveDown':// 下移
                    ActionUtils.selectedMultiRecord(selection).then((ids) => {
                        this.moveDown(ids)
                    }).catch(() => { })
                    break
                case 'remove':// 删除
                    ActionUtils.removeRecord(selection, '此操作将删除该数据, 是否确定?').then((id) => {
                        this.handleRemove(id)
                    }).catch(() => {})
                    break
                case 'reset':// 重置
                    this.$confirm('是否重置到初始属性？', '信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$refs['crud'].clearSelection()
                        if (this.isMain !== 'Y') {
                            this.defaultData = JSON.parse(JSON.stringify(defaultAttrs))
                            this.defaultData.splice(1, 0, subBoDefsAttrs)
                        } else {
                            this.defaultData = JSON.parse(JSON.stringify(defaultAttrs))
                        }
                        this.listData = JSON.parse(JSON.stringify(this.defaultData))
                        ActionUtils.success('重置成功！')
                    }).catch(() => {})
                    break
                default:
                    break
            }
        },
        /**
         * 编辑回传
         */
        handleRowClick (row) {
            this.editData = row
        },
        handleSelect (selection, row) {
            this.editData = row
        },
        /**
         * 处理添加||编辑
         */
        handleEdit (id = '', readonly = false) {
            this.editId = id
            const index = this.listData.findIndex(l => this.editId === l.id)
            this.editData = this.listData[index]
            this.readonly = readonly
            this.dialogFormVisible = true
            this.$refs['crud'].clearSelection()
        },
        // 添加||编辑 数据返回
        callback (value, buttonKey) {
            const codeIndex = this.listData.findIndex(i => i.code === value.code)
            const fieldNameIndex = this.listData.findIndex(i => i.fieldName === value.fieldName)
            const curIndex = this.listData.findIndex(i => i.id === value.id)
            this.clear = !!((codeIndex > -1 || fieldNameIndex > -1) && this.editId === '')
            if (curIndex > -1) {
                this.listData.splice(curIndex, 1, value)
            } else {
                if (codeIndex > -1 && this.editId === '') {
                    ActionUtils.warning('编码【' + value.code + '】已存在')
                    return
                }
                if (fieldNameIndex > -1 && this.editId === '') {
                    ActionUtils.warning('字段【' + value.fieldName + '】已存在')
                    return
                }
                value.id = uuid()
                value.sn = this.listData.length + 1
                this.listData.push(value)
            }
            this.$emit('change', this.listData)
        },
        filtrationIndex (arr, move) {
            let indexs = []
            arr.forEach(a => {
                this.listData.forEach((l, index) => {
                    if (a === l.id) {
                        indexs.push(index)
                    }
                })
            })
            const compare = function (a, b) {
                return move === 'moveUp' ? a - b : b - a
            }
            indexs = indexs.sort(compare)
            return indexs
        },
        // 上移
        moveUp (ids) {
            const arr = ids.split(',')
            const indexs = this.filtrationIndex(arr, 'moveUp')
            try {
                indexs.forEach(i => {
                    if (i === 0) {
                        throw new Error('EndIterative')
                    } else {
                        const upDate = this.listData[i - 1]
                        this.listData.splice(i - 1, 1)
                        this.listData.splice(i, 0, upDate)
                    }
                })
            } catch (e) {
                if (e.message !== 'EndIterative') throw e
            }
        },
        // 下移
        moveDown (ids) {
            const arr = ids.split(',')
            const indexs = this.filtrationIndex(arr, 'moveDown')
            try {
                indexs.forEach(i => {
                    if (i === this.listData.length - 1) {
                        throw new Error('EndIterative')
                    } else {
                        const upDate = this.listData[i + 1]
                        this.listData.splice(i + 1, 1)
                        this.listData.splice(i, 0, upDate)
                    }
                })
            } catch (e) {
                if (e.message !== 'EndIterative') throw e
            }
        },
        /**
         * 处理删除
         */
        handleRemove (ids) {
            const arr = ids.split(',')
            arr.forEach(a => {
                this.listData.forEach((i, index) => {
                    if (a === i.id && i.code !== 'createTime') {
                        this.listData.splice(index, 1)
                    } else if (a === i.id && i.code === 'createTime') {
                        this.$message({
                            message: '创建时间不可删除！',
                            type: 'warning'
                        })
                    }
                })
            })
            this.clearSelection()
        },
        clearSelection () {
            this.$refs['crud'] ? this.$refs['crud'].clearSelection() : null
        },
        callbackListData () {
            return this.listData
        },
        getListData (value) {
            this.listData = value
        },
        checkNode (review, treeData) {
            this.isSame = checkSameNode(review, treeData)
            this.$emit('checkNode', this.isSame)
        }
    }
}
</script>
<style lang="scss">
.bo-attr{
    .el-table{
        height:  calc(75vh + 12px ) !important;
    }
    .toolbar-box{
        display: none;
    }
    .ibps-container-crud__footer{
        padding-top: 5px;
        text-align: right;
    }
}
</style>
