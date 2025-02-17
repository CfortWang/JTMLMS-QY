<template>
    <div>
        <div class="reagentQualitative">
            <el-row type="flex">
                <el-col class="button">
                    <div class="title">*</div>
                    <div v-if="isRead" />
                    <div v-else>
                        <el-button type="primary" size="mini" icon="ibps-icon-add" @click="handleAdd"> 添加</el-button>
                        <el-button type="primary" size="mini" icon="ibps-icon-copy" @click="handleCopy"> 复制</el-button>
                        <el-button type="danger" size="mini" icon="ibps-icon-remove" @click="handleDelete"> 删除</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-table ref="external" :data="reagentBatchDataFilter" :span-method="objectSpanMethod" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55" />
                        <el-table-column label="样品序号 （条码号）" prop="biaoBenHao">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.biaoBenHao" size="mini" maxlength="32" placeholder="请输入" />
                                <span v-else>{{ row.biaoBenHao }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="新批号" prop="xinJieGuo">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.xinJieGuo" size="mini" maxlength="32" placeholder="请输入" />
                                <span v-else>{{ row.xinJieGuo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="旧批号" prop="jiuJieGuo">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.jiuJieGuo" size="mini" maxlength="32" placeholder="请输入" />
                                <span v-else>{{ row.jiuJieGuo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否相符" prop="xiangFu">
                            <template slot-scope="{row}">
                                <el-radio-group v-model="row.xiangFu" :disabled="isRead">
                                    <el-radio label="是">是</el-radio>
                                    <el-radio label="否">否</el-radio>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                        <el-table-column label="可接受范围（≥80%）" prop="biaoZhun">
                            <template slot-scope="{row}">
                                <el-input v-if="!isRead" v-model="row.biaoZhun" size="mini" maxlength="32" placeholder="请输入" @input="handleInput" />
                                <span v-else>{{ row.biaoZhun }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        layout="total,sizes,prev, pager, next,jumper"
                        :current-page="requestPage.pageNo"
                        :page-size="requestPage.limit"
                        :page-sizes="[10,15,20,30,50,100]"
                        :total="reagentBatchData.length"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { cloneDeep } from 'lodash'
export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readonly: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            reagentBatchData: [],
            disabled: false,
            requestPage: {
                limit: 10,
                pageNo: 1
            },
            multipleSelection: [],
            isRead: false
        }
    },
    computed: {
        reagentBatchDataFilter () {
            return this.reagentBatchData.slice((this.requestPage.pageNo - 1) * (this.requestPage.limit), (this.requestPage.pageNo - 1) * (this.requestPage.limit) + this.requestPage.limit)
        }
    },
    watch: {
        'formData.sjghyzjlbbbzb': {
            handler (value, old) {
                if (value && value.length) {
                    this.reagentBatchData = value
                }
            }
        },
        reagentBatchData: {
            handler (value, old) {
                this.$emit('change-data', 'sjghyzjlbbbzb', value)
            },
            deep: true
        }
    },
    mounted () {
        this.isRead = this.readonly || this.params.nodeId === 'Activity_1envuj2'
    },
    methods: {
        handleInput (e) {
            this.reagentBatchData.forEach(item => {
                item.biaoZhun = e
            })
        },
        objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 5) {
                // 获取当前单元格的值
                const currentValue = row[column.property]
                // 获取上一行相同列的值
                const preRow = this.reagentBatchData[rowIndex - 1]
                const preValue = preRow ? preRow[column.property] : null
                // 如果当前值和上一行的值相同，则将当前单元格隐藏
                if (currentValue === preValue) {
                    return { rowspan: 0, colspan: 0 }
                } else {
                    // 否则计算当前单元格应该跨越多少行
                    let rowspan = 1
                    for (let i = rowIndex + 1; i < this.reagentBatchData.length; i++) {
                        const nextRow = this.reagentBatchData[i]
                        const nextValue = nextRow[column.property]
                        if (nextValue === currentValue) {
                            rowspan++
                        } else {
                            break
                        }
                    }
                    return { rowspan, colspan: 1 }
                }
            }
        },

        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        handleAdd () {
            this.reagentBatchData.push({
                biaoBenHao: '',
                xinJieGuo: '',
                jiuJieGuo: '',
                xiangFu: '是',
                biaoZhun: this.reagentBatchData.length > 0 ? this.reagentBatchData[0].biaoZhun : '' // 如果已有数据，则添加biaozhun的值应该是统一的
            })
        },
        // 删除
        handleDelete () {
            this.$confirm('确定删除当前选中数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0) {
                    this.reagentBatchData = this.reagentBatchData.filter(row => !this.multipleSelection.includes(row))
                } else {
                    this.$message.warning('请选择数据')
                }
            })
        },
        // 复制
        handleCopy () {
            if (this.multipleSelection.length > 0) {
                this.reagentBatchData = this.reagentBatchData.concat(cloneDeep(this.multipleSelection))
            } else {
                this.$message.warning('请选择数据')
            }
        },
        // 当前页码改变
        handleCurrentChange (val) {
            this.requestPage.pageNo = val
        },
        // 页码选择器改变
        handleSizeChange (val) {
            this.requestPage.limit = val
            this.requestPage.pageNo = 1
        }
    }
}
</script>
<style lang="scss" scoped>
.reagentQualitative{
    margin-bottom: 20px;
    .button{
        display: flex;
        justify-content: space-between;
        padding: 0px 0px 0px 15px;
        background: #f0ffff;
        .title {
            color: red;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 0;
        }
        .el-button {
            margin: 0;
        }
    }
}
// ::v-deep .el-table--border  td, .el-table--border th, .el-table__body-wrapper .el-table--border .is-scrolling-left .el-table__fixed {
//     border-right: 1px solid rgba(255, 0, 0, 0)!important;
// }
</style>
