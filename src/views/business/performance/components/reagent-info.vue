<template>
    <div class="info-container">
        <div class="info-item">
            <div class="title">
                <i class="ibps-icon-star" />
                <span>实验试剂信息</span>
            </div>
            <div class="table-container">
                <div class="table-operate">
                    <template v-for="btn in toolbars">
                        <el-button
                            v-if="!btn.hidden"
                            :key="btn.key"
                            :type="btn.type"
                            :icon="btn.icon"
                            :size="btn.size || 'mini'"
                            plain
                            @click="handleActionEvent(btn.key)"
                        >
                            {{ btn.label }}
                        </el-button>
                    </template>
                </div>
                <el-table
                    ref="reagentTable"
                    :data="reagentData"
                    border
                    stripe
                    highlight-current-row
                    style="width: 100%"
                    max-height="400px"
                    class="reagent-table"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="40" header-align="center" align="center" />
                    <el-table-column type="index" label="序号" width="50" header-align="center" align="center" />
                    <el-table-column prop="leiBie" label="类别" width="80" header-align="center" align="center" />
                    <el-table-column prop="shiJiMingCheng" label="试剂名称" min-width="120" header-align="center" />
                    <el-table-column prop="piHao" label="批号" width="75" header-align="center" align="center" sortable />
                    <el-table-column prop="changJia" label="厂家" width="100" header-align="center" />
                    <el-table-column prop="youXiaoQi" label="有效期" width="100" header-align="center" align="center" sortable />
                    <el-table-column fixed="right" label="操作" width="70" header-align="center" align="center">
                        <template slot-scope="scope">
                            <div class="inline-operate">
                                <a><i class="el-icon-edit" @click="handleEdit('edit', scope.row, scope.$index)" /></a>
                                <a><i class="el-icon-delete" @click="handleRemove(scope.$index)" /></a>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <reagent-edit
            v-if="showReagent"
            :show.sync="showReagent"
            :page-data="rowData"
            :data-index="rowIndex"
            @close="() => showReagent = false"
            @callback="updates"
        />
    </div>
</template>
<script>
export default {
    components: {
        ReagentEdit: () => import('./reagent-edit')
    },
    props: {
        info: {
            type: Array,
            default: () => []
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            reagentData: [],
            showReagent: false,
            selectionIndex: '',
            rowData: {},
            toolbars: [
                { key: 'export', icon: 'ibps-icon-sign-out', label: '导出', type: 'info', hidden: this.readonly },
                { key: 'import', icon: 'ibps-icon-sign-in', label: '导入', type: 'warning', hidden: this.readonly },
                { key: 'create', icon: 'ibps-icon-plus', label: '添加', type: 'success', hidden: this.readonly },
                // { key: 'edit', icon: 'ibps-icon-edit', label: '编辑', type: 'primary', hidden: this.readonly },
                { key: 'remove', icon: 'ibps-icon-trash', label: '删除', type: 'danger', hidden: this.readonly }
            ]
        }
    },
    watch: {
        info: {
            handler (val) {
                this.reagentData = val || []
            },
            immediate: true,
            deep: true
        }
    },
    mounted () {

    },
    methods: {
        handleSelectionChange (val) {
            this.selectionIndex = val.map(item => this.reagentData.indexOf(item))
        },
        handleActionEvent (key) {
            switch (key) {
                case 'export':
                    this.handleExport()
                    break
                case 'import':
                    this.handleImport()
                    break
                case 'create':
                    this.handleEdit(key)
                    break
                case 'remove':
                    if (!this.selectionIndex) {
                        return this.$message.warning('请选择要删除的试剂')
                    }
                    this.handleRemove(this.selectionIndex)
                    break
            }
        },
        handleExport () {
            console.log('导出')
        },
        handleImport () {
            console.log('导入')
        },
        handleEdit (key, selection, index) {
            this.showReagent = true
            this.rowData = key === 'edit' ? selection : {}
            this.rowIndex = key === 'edit' ? index : null
        },
        handleRemove (index) {
            let indexList = []
            if (typeof index === 'number') {
                indexList = [index]
            } else {
                indexList = index
            }
            indexList.sort((a, b) => b - a)
            this.$confirm('确定要删除选中试剂吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                indexList.forEach(i => {
                    this.reagentData.splice(i, 1)
                })
            }).catch(() => {})
        },
        updates (params) {
            console.log(params)
            if (params.index === null) {
                this.reagentData.push(params.data)
            } else {
                this.reagentData.splice(params.index, 1, params.data)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .info-container {
        .info-item {
            .table-container {
                padding: 10px;
                background: #f5f5f5;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                overflow: hidden;
                .table-operate {
                    margin-bottom: 10px;
                    text-align: right;
                }
                .inline-operate {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    a:hover {
                        color: #409eff;
                    }
                }
            }
        }
    }
</style>
